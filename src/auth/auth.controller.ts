import { Body, Controller, Get, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUser } from './interfaces/requestWithUser';
import { SendEmailDto } from 'src/user/dto/send-email.dto';
import { VerifyEmailDto } from 'src/user/dto/verify-email.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  @ApiOperation({
    summary: '계정 생성',
    description: '새로운 계정을 등록합니다.',
  })
  async signupUser(@Body() createUserDto : CreateUserDto): Promise<User>{
    return await this.authService.signupUser(createUserDto);
  }

  
/**
  @Post("/login")
  @ApiOperation({
    summary: '로그인',
    description: '로그인 시도',
  })
  async loginUser(@Body() loginUserDto : LoginUserDto): Promise<User>{
    return await this.authService.getAuthUser(loginUserDto);
  }
*/
  @Post("/login")
  @ApiOperation({
    summary: '로그인',
    description: '로그인 시도',
  })
  @UseGuards(LocalAuthGuard) //인증 인가 보안 관련
  @ApiBody({
    type: LoginUserDto
  })
  async loginUser(@Req() r: RequestWithUser){
    const { user } = r;
    const accessToken = await this.authService.generateAccessToken(user.id)
    return { user , accessToken };
  }

  @Get("/google")
  @UseGuards(GoogleAuthGuard)
  async googleLogin(): Promise<any>{
    return HttpStatus.OK;
  }

  @Get("/google/callback")
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback(@Req() req:RequestWithUser): Promise<any>{
    return req.user;
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  async getUserInfo(@Req() req:RequestWithUser): Promise<User>{
    return req.user;
  }

  @Post('/send/email')
  async sendEmail(@Body() sendEmailDto : SendEmailDto): Promise<void>{
    return await this.authService.sendEmailVerify(sendEmailDto.email);
  }

  @Post('/verify/email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<boolean>{
    return await this.authService.configVerify(verifyEmailDto);
  }
}
