import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

// providers 에 등록 필요
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly configService : ConfigService,
        private readonly userService: UserService,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('ACCESSTOKEN_SECRET')
        })
    }

    async validate(payload:{userId}): Promise<User> {
        return await this.userService.getUserById(payload.userId); // validate dto형태로 못들어간다네
    }
}