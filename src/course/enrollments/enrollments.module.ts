import { forwardRef, Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollments } from './enrollments.entity/enrollments.entity';
import { UsersModule } from 'src/users/users.module';
import { CourseModule } from '../course.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollments]),
    forwardRef(() => CourseModule)
  ],
  providers: [EnrollmentsService],
  controllers: [EnrollmentsController]
})
export class EnrollmentsModule {}
