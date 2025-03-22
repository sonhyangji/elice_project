import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUser } from './interfaces/requestWithUser';

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
    return r.user;
  }

}
