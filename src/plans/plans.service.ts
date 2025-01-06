import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './plans.entity';
import { PlanFeature } from './plan_features.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
@Injectable()
export class PlansService {
    constructor(
        @InjectRepository(Plan) private readonly planRepo: Repository<Plan>,
        @InjectRepository(PlanFeature)
        private readonly planFeatureRepo: Repository<PlanFeature>,
        @InjectRepository(User)
        private userService: Repository<User>,
    ) { }

    // Get a user's active plan
    async getUserPlan(userId: number): Promise<Plan> {
        const user = await this.userService.findOne({ where: { id: userId } }); // Assuming you have a user service
        return this.planRepo.findOne({ where: { id: user.planId } });
    }

    // Get plan features and restrictions
    async getPlanFeatures(planId: number): Promise<Record<string, any>> {
        const features = await this.planFeatureRepo.find({
            where: { plan: { id: planId } },
            relations: ['feature'],
        });

        const featureMap = {};
        features.forEach((f) => {
            //featureMap[f.feature.key] = f.value === 'unlimited' ? Infinity : f.value;
            // if (f.value !== 'unlimited' && typeof f.value !== 'number') {
            //     featureMap[f.feature.key] = f.value == 'true' ? true : false;

            // } else {
            //     featureMap[f.feature.key] = f.value === 'unlimited' ? Infinity : f.value;
            // }
            let value = f.value === 'unlimited' ? Infinity : f.value;
            featureMap[f.feature.key] = f.feature.type === 'boolean' ? JSON.parse(String(value)) : value;

        });
        return featureMap;
    }

    // Check a specific feature limit
    async checkFeatureLimit(
        userId: number,
        featureKey: string,
        currentCount: number,
    ): Promise<boolean> {
        const userPlan = await this.getUserPlan(userId);
        const features = await this.getPlanFeatures(userPlan.id);
        let limit = features[featureKey];
        // check if limit is a number
        if (typeof limit !== 'number') {
            return <boolean>limit;
        }

        return currentCount < limit;
    }
}
