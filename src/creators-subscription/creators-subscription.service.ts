import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatorsSubscription } from './entities/creators-subscription.entity';
import { CreatorsSubscriptionDto } from './dto/creators-subscription.dto';
interface CreatorsSubscriptionInterface {
    userId: number;
    planId: number;
    startDate: Date;
    endDate: Date;
}
@Injectable()
export class CreatorsSubscriptionService {
    constructor(
        @InjectRepository(CreatorsSubscription)
        private creatorsSubscriptionRepository: Repository<CreatorsSubscription>,
    ) { }
    async create(data) {
        const subscription = this.creatorsSubscriptionRepository.create({
            ...data,
            user: { id: data.user }, // Ensure user relationship is set properly
        });

        return await this.creatorsSubscriptionRepository.save(subscription);
    }
}
