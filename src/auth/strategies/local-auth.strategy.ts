import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { User } from "src/user/entities/user.entity";

// providers 에 등록 필요
@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly authService: AuthService
    ){
        super({
            usernameField: "email"
        })
    }

    async validate(email: string, password: string): Promise<User> {
        return await this.authService.getAuthUser({email, password}) // validate dto형태로 못들어간다네
    }
}