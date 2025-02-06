import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorsSubscription } from './entities/creators-subscription.entity';
import { User } from 'src/users/user.entity';
import { PaymentModule } from 'src/payment/payment.module';
import { UsersModule } from 'src/users/users.module';
import { CreatorsSubscriptionService } from './creators-subscription.service';
import { CreatorsSubscriptionController } from './creators-subscription.controller';
import { PlansModule } from 'src/plans/plans.module';

@Module({
  imports: [TypeOrmModule.forFeature([CreatorsSubscription]), PaymentModule, UsersModule, PlansModule],
  providers: [CreatorsSubscriptionService],
  controllers: [CreatorsSubscriptionController],
  exports: [CreatorsSubscriptionService]
})
export class CreatorsSubscriptionModule { }

