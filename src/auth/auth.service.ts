import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { EmailService } from 'src/email/email.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Cache } from 'cache-manager';
import { VerifyEmailDto } from 'src/user/dto/verify-email.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayloadInterface } from './interfaces/tokenPayloa.Interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService:UserService,
    private readonly emailService:EmailService,
    private readonly jwtService:JwtService,
    private readonly configService:ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ){}

  async signupUser(createUserDto: CreateUserDto): Promise<User>{
    return await this.userService.createUser(createUserDto);
  }

  async getAuthUser(l: LoginUserDto): Promise<User>{
    /**
     * db 에서 이메일 로 유저 검색  후 비번 매칭하기
     * 비번 디코팅 후 확인해서 유저 정보 리턴
    */
    const { email, password} = l;
    const user = await this.userService.getUserByEmail(email);
    if(!user) throw new NotFoundException("User not found")
    
    const isPwMatched = await user.checkPassword(password);
    if(!isPwMatched) throw new HttpException("Password do not matched", HttpStatus.BAD_REQUEST);

    return user;
  }

  async sendEmailVerify(email:string): Promise<void>{
    const generateNumber = this.generateOTP();
    // 래디스에 저장
    await this.cacheManager.set(email, generateNumber);

    return await this.emailService.sendEmail({
      to: email,
      subject: "NestJS Email Verify TEST",
      html: `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>이메일 인증</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    border: 1px solid black;
                }
                .code {
                    font-size: 24px;
                    font-weight: bold;
                    color: #2d89ef;
                    margin: 20px 0;
                }
                .footer {
                    font-size: 12px;
                    color: #777;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>이메일 인증 코드</h2>
                <p>아래 인증번호를 입력하여 이메일 인증을 완료하세요.</p>
                <div class="code">${generateNumber}</div>
                <p>이 코드는 10분 동안만 유효합니다.</p>
                <div class="footer">
                    본 이메일은 자동 발송 메일입니다. 문의 사항이 있으면 고객센터에 문의해 주세요.
                </div>
            </div>
        </body>
        </html>`
    });
  }

  async configVerify(verifyEmailDto : VerifyEmailDto): Promise<boolean>{
    const { email, code } = verifyEmailDto;
    const redisCode = await this.cacheManager.get(email);

    if(redisCode !== code) throw new BadRequestException("wrong code provided");
    await this.cacheManager.del(email);

    return true;
  }

  public generateAccessToken(userId: string): {
    accessToken: string;
    accessCookie: string;
  } {
    const payload: TokenPayloadInterface = { userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESSTOKEN_SECRET'),
      expiresIn: `${this.configService.get('ACCESSTOKEN_EXPIRATION_TIME')}`,
    });
    // const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
    //   'REFRESH_TOKEN_EXPIRATION_TIME',
    // )}`;
    const accessCookie = `Authentication=${accessToken}; Path=/; Max-Age=${this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME')}`;
    return {
      accessToken,
      accessCookie,
    };
  }

  public generateRefreshToken(userId: string): {
    refreshCookie: string;
    refreshToken: string;
  } {
    const payload: TokenPayloadInterface = { userId };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME')}`,
    });
    const refreshCookie = `Refresh=${refreshToken}; Path=/; Max-Age=${this.configService.get(
      'REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;
    return {
      refreshToken,
      refreshCookie,
    };
  }

  generateOTP(){
    let OTP = "";
    for (let i=1 ; i<6; i++){
      OTP += Math.floor(Math.random() * 10)
    }
    return OTP;
  }

}
