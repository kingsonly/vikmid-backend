import { Injectable } from '@nestjs/common';
import { LinkStats } from '../entity/link-stats.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLinkStatsDto } from './dto/creat-link-stats.dto';
import { PaginateQuery, paginate, Paginated } from 'nestjs-paginate'
@Injectable()
export class LinkStatsService {
    constructor(
        @InjectRepository(LinkStats) private readonly linkStatsRepository: Repository<LinkStats>,
    ) { }

    async createLinkStat(data: CreateLinkStatsDto): Promise<LinkStats> {
        const computedData = this.linkStatsRepository.create({
            linkId: data.linkId,
            stats: data.stats,
        });
        return await this.linkStatsRepository.save(computedData);
    }

    async fetchPaginatedLinkStat(query: PaginateQuery, linkId: string,): Promise<Paginated<LinkStats>> {
        return paginate(query, this.linkStatsRepository, {
            sortableColumns: ['id'],
            defaultSortBy: [['id', 'DESC']],
            where: { linkId },

        })
    }

    async analyzeStatsInBatches(linkId: string) {

        const batchSize = 10000;
        let offset = 0;
        let hasMore = true;

        let total = 0;
        let mobile = 0;
        let desktop = 0;
        const browserMap: Record<string, number> = {};
        const dayMap: Record<string, number> = {};

        while (hasMore) {
            const batch = await this.linkStatsRepository.find({
                where: { linkId },
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
