import { IsNotEmpty, IsString, IsOptional, IsDate, IsEmail, IsNumber } from 'class-validator';
import { IsEmailUnique, IsEmailUniqueConstraint } from '../../users/validator/is-email-unique-constraint.service';

export class SignupDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @IsEmailUnique({ message: 'Email is already registered.' })
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsNumber()
    plan: number;

    @IsNotEmpty()
    @IsString()
    url: string;

    @IsNotEmpty()
    @IsString()
    hubName: string;
}