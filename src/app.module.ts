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

@Module({
  imports: [
    AuthModule,
    UsersModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
