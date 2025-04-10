import { Module } from '@nestjs/common';
import { SocialLinkStatsController } from './social-link-stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialLinkStats } from '../entity/social-link-stats.entity';
import { SocialLinkStatsService } from './social-link-stats.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        SocialLinkStats,
      ]),
  ],
  controllers: [SocialLinkStatsController],
  providers: [SocialLinkStatsService]
})
export class SocialLinkStatsModule { }
