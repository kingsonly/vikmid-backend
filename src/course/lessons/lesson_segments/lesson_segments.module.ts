import { forwardRef, Module } from '@nestjs/common';
import { LessonSegmentsService } from './lesson_segments.service';
import { LessonSegmentsController } from './lesson_segments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonSegments } from './lesson_segments.entity/lesson_segments.entity';
import { LessonsModule } from '../lessons.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LessonSegments]),
    forwardRef(() => LessonsModule)
  ],
  providers: [LessonSegmentsService],
  controllers: [LessonSegmentsController],
  exports: [LessonSegmentsService, TypeOrmModule]
})
export class LessonSegmentsModule {}
