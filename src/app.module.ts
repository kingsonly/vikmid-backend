import { Module } from '@nestjs/common';
import config from 'config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PlansModule } from './plans/plans.module';
import { WaitlistModule } from './waitlist/waitlist.module';
import { ValidatorModule } from './users/validator/validator.module';
import { PaymentModule } from './payment/payment.module';
import { CreatorsSubscriptionModule } from './creators-subscription/creators-subscription.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ValidatorModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule globally available
    }),
    TypeOrmModule.forRoot({
      // type: 'mariadb', // or your chosen database
      // host: 'localhost',
      // port: 3308,
      // username: 'forge',
      // password: 'Ubuxa##99', 
      // database: 'forge',
      type: 'mysql', // or your chosen database
      ...config.db,
      autoLoadEntities: true,
      synchronize: true,
    }),
    PlansModule,
    WaitlistModule,
    PaymentModule,
    CreatorsSubscriptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
