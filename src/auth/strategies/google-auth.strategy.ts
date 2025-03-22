import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-google-oauth2";
import { VerifiedCallback } from "passport-jwt";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";

// providers 에 등록 필요
@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy , "google"){
    constructor(
        private readonly configService : ConfigService,
    ){
        super({
            clientID: configService.get<string>('GOOGLE_AUTH_CLIENT_ID'),
            clientSecret: configService.get<string>('GOOGLE_AUTH_CLIENT_SECRET'),
            callbackURL: configService.get<string>('GOOGLE_AUTH_CALLBACK_URL'),
            scope: ["profile", 'email']
        })
    }

    async validate(
        accessToken:string,
        refreshToken:string,
        profile:any,
        done: VerifiedCallback
    ): Promise<any> {
        console.log('************profile***********',profile);
        return profile;
    }
}