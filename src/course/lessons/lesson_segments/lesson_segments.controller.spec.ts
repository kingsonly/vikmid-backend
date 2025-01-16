import { Test, TestingModule } from '@nestjs/testing';
import { LessonSegmentsController } from './lesson_segments.controller';

describe('LessonSegmentsController', () => {
  let controller: LessonSegmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonSegmentsController],
    }).compile();

    controller = module.get<LessonSegmentsController>(LessonSegmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
