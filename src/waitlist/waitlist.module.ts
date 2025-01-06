import { Module } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Waitlist } from './waitlist.entity';
import { WaitlistController } from './waitlist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Waitlist])],
  providers: [WaitlistService],
  controllers: [WaitlistController]
})
export class WaitlistModule { }

