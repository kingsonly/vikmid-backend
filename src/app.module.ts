import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PlansModule } from './plans/plans.module';
import { WaitlistController } from './waitlist/waitlist.controller';
import { WaitlistModule } from './waitlist/waitlist.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule globally available
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb', // or your chosen database
      host: 'localhost',
      port: 3308,
      username: 'forge',
      password: 'Ubuxa##99',
      database: 'forge',
      autoLoadEntities: true,
      synchronize: true,
    }),
    PlansModule,
    WaitlistModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }


