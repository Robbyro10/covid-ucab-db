import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export class CreateUserDto {

    @ApiProperty()
    @IsEmail()
    email: string;
    
    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string;

    @ApiProperty()
    @IsString()
    @MinLength(2)
    fullName: string;
}