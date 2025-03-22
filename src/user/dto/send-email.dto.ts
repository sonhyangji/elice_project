import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class SendEmailDto {
    @IsEmail()
    @ApiProperty({ example: '@email' })
    email: string;
}
