import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthStrategy } from './strategies/local-auth.strategy';

@Module({
  imports:[UserModule],
  controllers: [AuthController],
  providers: [AuthService, LocalAuthStrategy],
})
export class AuthModule {}
