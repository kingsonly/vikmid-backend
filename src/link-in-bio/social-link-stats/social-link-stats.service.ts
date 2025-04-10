import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, paginate, Paginated } from 'nestjs-paginate'
import { SocialLinkStats } from '../entity/social-link-stats.entity';
import { CreateSocialLinkStatsDto } from './dto/create-social-link-stats.dto';
@Injectable()
export class SocialLinkStatsService {
    constructor(
        @InjectRepository(SocialLinkStats) private readonly socialLinkStatsRepository: Repository<SocialLinkStats>,
    ) { }

    async createSocialLinkStat(data: CreateSocialLinkStatsDto): Promise<SocialLinkStats> {

        const computedData = this.socialLinkStatsRepository.create({
            socialLinkId: data.socialLinkId,
            stats: data.stats,
        });
        return await this.socialLinkStatsRepository.save(computedData);
    }

    async fetchPaginatedSocialLinkStat(query: PaginateQuery, socialLinkId: string,): Promise<Paginated<SocialLinkStats>> {
        return paginate(query, this.socialLinkStatsRepository, {
            sortableColumns: ['id'],
            defaultSortBy: [['id', 'DESC']],
            where: { socialLinkId },
        })
    }

    async analyzeStatsInBatches(socialLinkId: string) {

        const batchSize = 10000;
        let offset = 0;
        let hasMore = true;

        let total = 0;
        let mobile = 0;
        let desktop = 0;
        const browserMap: Record<string, number> = {};
        const dayMap: Record<string, number> = {};

        while (hasMore) {
            const batch = await this.socialLinkStatsRepository.find({
                where: { socialLinkId },
                skip: offset,
                take: batchSize,
            });

            if (batch.length === 0) break;

            for (const row of batch) {
                const stat = row.stats;
                const userAgent = stat.userAgent.toLowerCase();
                const createdAt = new Date(row.createdAt);

                // Platform check
                if (/mobile|android|iphone|ipad|ipod/.test(userAgent)) {
                    mobile++;
                } else {
                    desktop++;
                }

                // Browser check
                let browser = 'Unknown';
                if (userAgent.includes('chrome')) browser = 'Chrome';
                else if (userAgent.includes('safari')) browser = 'Safari';
                else if (userAgent.includes('firefox')) browser = 'Firefox';
                else if (userAgent.includes('edg')) browser = 'Edge';

                browserMap[browser] = (browserMap[browser] || 0) + 1;

                // Day of week
                const day = createdAt.toLocaleDateString('en-US', { weekday: 'long' });
                dayMap[day] = (dayMap[day] || 0) + 1;
            }

            total += batch.length;
            offset += batchSize;
            hasMore = batch.length === batchSize;
        }

        const topBrowser = Object.entries(browserMap).sort((a, b) => b[1] - a[1])[0];
        const busiestDay = Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0];

        return {
            total,
            platformPercentage: {
                mobile: total > 0 ? Number(((mobile / total) * 100).toFixed(0)) : 0,
                desktop: total > 0 ? Number(((desktop / total) * 100).toFixed(0)) : 0,
            },
            topBrowser: topBrowser ? {
                name: topBrowser[0],
                count: topBrowser[1],
                percentage: Number(((topBrowser[1] / total) * 100).toFixed(0)),
            } : {
                name: "Unavailable",
                count: 0,
                percentage: 0,
            },
            busiestDay: busiestDay ? {
                day: busiestDay[0],
                count: busiestDay[1],
                percentage: Number(((busiestDay[1] / total) * 100).toFixed(0)),
            } : {
                day: "Unavailable",
                count: 0,
                percentage: 0,
            },
        };

    }


}
