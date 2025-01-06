import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Plan } from './plans.entity';
import { PlanFeature } from './plan_features.entity';
import { Feature } from './features.entity';

@Module({
  providers: [
    PlansService,
  ],
  imports: [
    TypeOrmModule.forFeature([User, Plan, PlanFeature, Feature])
  ],
  controllers: [PlansController],
  exports: [PlansService],
})
export class PlansModule { }
