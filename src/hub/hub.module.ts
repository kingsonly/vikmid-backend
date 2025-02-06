import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hub } from './entities/hub.entity';
import { HubService } from './hub.service';
import { HubController } from './hub.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Hub])],
  providers: [HubService],
  controllers: [HubController],
  exports: [HubService],
})
export class HubModule { }

