import { Test, TestingModule } from '@nestjs/testing';
import { LinkStatsController } from './link-stats.controller';

describe('LinkStatsController', () => {
  let controller: LinkStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkStatsController],
    }).compile();

    controller = module.get<LinkStatsController>(LinkStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
