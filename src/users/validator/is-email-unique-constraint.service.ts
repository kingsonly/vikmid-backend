import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
    constructor(private readonly userService: UsersService) { }

    async validate(email: string): Promise<boolean> {
        console.log('UsersService:', this.userService);
        const user = await this.userService.findOneByEmail(email);
        return !user; // Returns true if no user is found, meaning the email is unique
    }

    defaultMessage(): string {
        return 'Email $value is already taken.';
    }
}

export function IsEmailUnique(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsEmailUniqueConstraint,
        });
    };
}
