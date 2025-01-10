import { Test, TestingModule } from '@nestjs/testing';
import { LessonSegmentsService } from './lesson_segments.service';

describe('LessonSegmentsService', () => {
  let service: LessonSegmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonSegmentsService],
    }).compile();

    service = module.get<LessonSegmentsService>(LessonSegmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
