import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
//import { UsersController } from './users.controller';
import { User } from './user.entity';
import { CreatorsSubscription } from 'src/creators-subscription/entities/creators-subscription.entity';
import { Hub } from 'src/hub/entities/hub.entity';   
import { HubModule } from 'src/hub/hub.module';
import { IsEmailUniqueConstraint } from './validator/is-email-unique-constraint.service';
import { CourseModule } from 'src/course/course.module';
import { EnrollmentsModule } from 'src/course/enrollments/enrollments.module'; 

@Module({
  imports: [TypeOrmModule.forFeature([User, CreatorsSubscription, Hub]), HubModule, forwardRef(() => CourseModule),
  EnrollmentsModule],
  providers: [UsersService],
  //controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {
  constructor() {
  }
}
