// shared.module.ts
import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { IsEmailUniqueConstraint } from 'src/users/validator/is-email-unique-constraint.service';
import { UsersService } from '../users.service';
import { User } from '../user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
    imports: [UsersModule, TypeOrmModule.forFeature([User])],
    providers: [IsEmailUniqueConstraint, UsersService],
    exports: [IsEmailUniqueConstraint, UsersModule],
})
export class ValidatorModule { }