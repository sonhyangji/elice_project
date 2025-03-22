import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class VerifyEmailDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: '@email' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'xxxxxx' })
    code: string;
}
