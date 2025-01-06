import { IsNotEmpty, IsString, IsOptional, IsDate, IsEmail } from 'class-validator';

export class WaitlistDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    fullName: string;
}