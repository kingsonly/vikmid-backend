import { IsNotEmpty, IsString, IsOptional, IsDate, IsEmail, IsNumber } from 'class-validator';
import { IsEmailUnique, IsEmailUniqueConstraint } from '../../users/validator/is-email-unique-constraint.service';

export class CreatorsSubscriptionDto {
    user: number;
    planId: number;
    startDate: Date;
    endDate: Date;
}