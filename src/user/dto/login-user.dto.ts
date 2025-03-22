import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'very good' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'very good' })
    password: string;
}
