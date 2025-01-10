import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to provide ConfigService
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // or your chosen database
        host: configService.get<string>('DB_HOST', 'mysql'), // Default to 'mysql' if not set
        port: configService.get<number>('DB_PORT', 3306), // Default to 3306 if not set
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD', 'Ubuxa##99'), // Default value provided
        database: configService.get<string>('DB_NAME', 'forge'), // Default value provided
        autoLoadEntities: true,
        synchronize: true, // Should be false in production to avoid accidental schema changes
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
    PlansModule,
    WaitlistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }


