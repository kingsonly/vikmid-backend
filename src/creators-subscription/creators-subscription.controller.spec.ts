import { Test, TestingModule } from '@nestjs/testing';
import { CreatorsSubscriptionController } from './creators-subscription.controller';

describe('CreatorsSubscriptionController', () => {
  let controller: CreatorsSubscriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreatorsSubscriptionController],
    }).compile();

    controller = module.get<CreatorsSubscriptionController>(CreatorsSubscriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
