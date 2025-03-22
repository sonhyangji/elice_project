import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService:UserService,
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

}
