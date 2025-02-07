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
import { ProductsModule } from './products/products.module';
import { ValidatorModule } from './users/validator/validator.module';
import { PaymentModule } from './payment/payment.module';
import { CreatorsSubscriptionModule } from './creators-subscription/creators-subscription.module';
import { LinkInBioModule } from './link-in-bio/link-in-bio.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ValidatorModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule globally available
    }),
    TypeOrmModule.forRoot({
      type: 'mysql', // or your chosen database
      ...config.db,
      autoLoadEntities: true,
      synchronize: true,
    }),
    PlansModule,
    WaitlistModule,
    ProductsModule,
    PaymentModule,
    CreatorsSubscriptionModule,
    LinkInBioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
