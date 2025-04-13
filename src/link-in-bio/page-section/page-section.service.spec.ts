import { Test, TestingModule } from '@nestjs/testing';
import { PageSectionService } from './page-section.service';

describe('PageSectionService', () => {
  let service: PageSectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PageSectionService],
    }).compile();

    service = module.get<PageSectionService>(PageSectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
