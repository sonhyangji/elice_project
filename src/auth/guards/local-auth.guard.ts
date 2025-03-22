import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// 가드를 통해서 스트레이티지를 쓴다
@Injectable()
export class LocalAuthGuard extends AuthGuard("local"){

}