import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
//import { UsersController } from './users.controller';
import { User } from './user.entity';
import { CourseModule } from 'src/course/course.module';
import { EnrollmentsModule } from 'src/course/enrollments/enrollments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => CourseModule),
    EnrollmentsModule,
  ],
  providers: [UsersService],
  //controllers: [UsersController],
  exports: [UsersService],

})
export class UsersModule { }
