import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
//import { UsersController } from './users.controller';
import { User } from './user.entity';
import { CreatorsSubscription } from 'src/creators-subscription/entities/creators-subscription.entity';
import { Hub } from 'src/hub/entities/hub.entity';
import { HubModule } from 'src/hub/hub.module';
import { IsEmailUniqueConstraint } from './validator/is-email-unique-constraint.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, CreatorsSubscription, Hub]), HubModule],
  providers: [UsersService],
  //controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {
  constructor() {
  }
}
