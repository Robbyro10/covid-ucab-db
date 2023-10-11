import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string;
}