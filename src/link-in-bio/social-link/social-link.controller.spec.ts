import { Test, TestingModule } from '@nestjs/testing';
import { SocialLinkController } from './social-link.controller';

describe('SocialLinkController', () => {
  let controller: SocialLinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialLinkController],
    }).compile();

    controller = module.get<SocialLinkController>(SocialLinkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
