import { Test, TestingModule } from '@nestjs/testing';
import { LinkStatsService } from './link-stats.service';

describe('LinkStatsService', () => {
  let service: LinkStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinkStatsService],
    }).compile();

    service = module.get<LinkStatsService>(LinkStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
