import { Module } from '@nestjs/common';
import { LinkStatsController } from './link-stats.controller';
import { LinkStatsService } from './link-stats.service';
import { LinkStats } from '../entity/link-stats.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        LinkStats,
      ]),
  ],
  controllers: [LinkStatsController],
  providers: [LinkStatsService]
})
export class LinkStatsModule { }
