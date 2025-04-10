import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { SocialLinkStatsService } from './social-link-stats.service';
import { CreateSocialLinkStatsDto } from './dto/create-social-link-stats.dto';
import { SocialLinkStats } from '../entity/social-link-stats.entity';

@Controller('social-link-stats')
export class SocialLinkStatsController {
    constructor(
        private readonly socialLinkStatsService: SocialLinkStatsService,
    ) { }

    @Post("create")
    @ApiOperation({ summary: 'Create a new link stats' })
    @ApiResponse({ status: 201, description: 'link stats created successfully.', type: SocialLinkStats })
    @ApiResponse({ status: 400, description: 'Invalid data provided.' })
    async createLinkStats(@Body() data: CreateSocialLinkStatsDto) {
        return await this.socialLinkStatsService.createSocialLinkStat(data);
    }

    @Get("get-all-social-links-stats-by-link-id/:id")
    @UseGuards(JwtAuthGuard)
    async getLinkStats(@Paginate() query: PaginateQuery, @Param("id") socialLinkId: string): Promise<Paginated<SocialLinkStats>> {
        return this.socialLinkStatsService.fetchPaginatedSocialLinkStat(query, socialLinkId);
    }

    @Get('analyze/:socialLinkId')
    @UseGuards(JwtAuthGuard)
    async getStatsAnalysis(
        @Param('socialLinkId') socialLinkId: string,
    ): Promise<any> {
        return this.socialLinkStatsService.analyzeStatsInBatches(socialLinkId);
    }
}
