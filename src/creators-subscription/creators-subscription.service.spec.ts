import { Test, TestingModule } from '@nestjs/testing';
import { CreatorsSubscriptionService } from './creators-subscription.service';

describe('CreatorsSubscriptionService', () => {
  let service: CreatorsSubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreatorsSubscriptionService],
    }).compile();

    service = module.get<CreatorsSubscriptionService>(CreatorsSubscriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
