import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hub } from './entities/hub.entity';
import { HubService } from './hub.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hub])],
  providers: [HubService],
  controllers: [],
  exports: [HubService],
})
export class HubModule { }

