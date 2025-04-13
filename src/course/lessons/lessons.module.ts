import { forwardRef, Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonSegments } from './lesson_segments/lesson_segments.entity/lesson_segments.entity';
import { Lessons } from './lessons.entity/lessons.entity';
import { CourseModule } from '../course.module';
import { LessonSegmentsService } from './lesson_segments/lesson_segments.service';
import { LessonSegmentsModule } from './lesson_segments/lesson_segments.module';

@Module({
  exports: [LessonsService, TypeOrmModule],
  providers: [LessonsService, LessonSegmentsService],
  controllers: [LessonsController],
  imports: [
    TypeOrmModule.forFeature([Lessons]),
    LessonSegmentsModule,
    forwardRef(() => CourseModule),
  ]
})
export class LessonsModule {}