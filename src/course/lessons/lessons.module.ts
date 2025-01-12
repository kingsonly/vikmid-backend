import { forwardRef, Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { LessonSegmentsModule } from './lesson_segments/lesson_segments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonSegments } from './lesson_segments/lesson_segments.entity/lesson_segments.entity';
import { Lessons } from './lessons.entity/lessons.entity';
import { CourseModule } from '../course.module';

@Module({
  exports: [LessonsService],
  providers: [LessonsService],
  controllers: [LessonsController],
  imports: [
    TypeOrmModule.forFeature([Lessons]),
    LessonSegmentsModule,
    forwardRef(() => CourseModule),
  ]
})
export class LessonsModule {}
