import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
//import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { HubModule } from 'src/hub/hub.module';
import { ValidatorModule } from 'src/users/validator/validator.module';


@Module({
  imports: [
    ValidatorModule,
    HubModule,
    ConfigModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule { }
