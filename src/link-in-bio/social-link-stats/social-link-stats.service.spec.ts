import { Test, TestingModule } from '@nestjs/testing';
import { SocialLinkStatsService } from './social-link-stats.service';

describe('SocialLinkStatsService', () => {
  let service: SocialLinkStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocialLinkStatsService],
    }).compile();

    service = module.get<SocialLinkStatsService>(SocialLinkStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
