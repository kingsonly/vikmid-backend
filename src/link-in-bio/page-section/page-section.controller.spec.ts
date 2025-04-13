import { Test, TestingModule } from '@nestjs/testing';
import { PageSectionController } from './page-section.controller';

describe('PageSectionController', () => {
  let controller: PageSectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PageSectionController],
    }).compile();

    controller = module.get<PageSectionController>(PageSectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
