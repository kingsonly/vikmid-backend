import { forwardRef, Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity/course.entity';
import { UsersModule } from 'src/users/users.module';
import { LessonsModule } from './lessons/lessons.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
    LessonsModule,
    EnrollmentsModule
  ],
  providers: [CourseService],
  controllers: [CourseController],
  exports: [CourseService],
})
export class CourseModule {}
