import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { LinkStatsService } from './link-stats.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateLinkStatsDto } from './dto/creat-link-stats.dto';
import { LinkStats } from '../entity/link-stats.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';

@Controller('link-stats')
export class LinkStatsController {


    constructor(
        private readonly linkStatsService: LinkStatsService,
    ) { }

    @Post("create")
    @ApiOperation({ summary: 'Create a new link stats' })
    @ApiResponse({ status: 201, description: 'link stats created successfully.', type: LinkStats })
    @ApiResponse({ status: 400, description: 'Invalid data provided.' })
    async createLinkStats(@Body() data: CreateLinkStatsDto) {
        return await this.linkStatsService.createLinkStat(data);
    }

    @Get("get-all-links-stats-by-link-id/:id")
    @UseGuards(JwtAuthGuard)
    async getLinkStats(@Paginate() query: PaginateQuery, @Param("id") linkId: string): Promise<Paginated<LinkStats>> {
        return this.linkStatsService.fetchPaginatedLinkStat(query, linkId);
    }

    @Get('analyze/:linkId')
    @UseGuards(JwtAuthGuard)
    async getStatsAnalysis(
        @Param('linkId') linkId: string,
    ): Promise<any> {
        return this.linkStatsService.analyzeStatsInBatches(linkId);
    }
}
