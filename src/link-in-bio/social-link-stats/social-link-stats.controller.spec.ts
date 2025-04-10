import { Test, TestingModule } from '@nestjs/testing';
import { SocialLinkStatsController } from './social-link-stats.controller';

describe('SocialLinkStatsController', () => {
  let controller: SocialLinkStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialLinkStatsController],
    }).compile();

    controller = module.get<SocialLinkStatsController>(SocialLinkStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
