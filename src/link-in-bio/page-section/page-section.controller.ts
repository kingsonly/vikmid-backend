import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PageSectionService } from './page-section.service';
import { PageSectionDto } from './dto/page-section.dto';
import { PageSection } from '../entity/page_section.entity';
import { reorderPageSectionDto } from './dto/reorder-page-section.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Page Sections')
@ApiBearerAuth()
@Controller('page-section')
export class PageSectionController {
    constructor(
        private readonly pageSectionService: PageSectionService
    ) { }

    @Post("create")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create a new page section' })
    @ApiResponse({ status: 201, description: 'Page section created successfully', type: PageSection })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async createSection(
        @Body() pageSectionDto: PageSectionDto
    ): Promise<PageSection> {
        return await this.pageSectionService.createPageSection(pageSectionDto)
    }

    @Put("update/:id")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update an existing page section' })
    @ApiResponse({ status: 200, description: 'Page section updated successfully', type: PageSection })
    @ApiResponse({ status: 404, description: 'Page section not found' })
    async updateSection(
        @Param("id") id: string,
        @Body() pageSectionDto: Partial<PageSectionDto>
    ): Promise<PageSection> {
        return await this.pageSectionService.updatePageSection(id, pageSectionDto)
    }

    @Put("reorder")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Reorder page sections based on new positions' })
    @ApiResponse({ status: 200, description: 'Page sections reordered successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input' })
    async reorderSection(
        @Body() pageSectionDto: reorderPageSectionDto
    ) {
        return await this.pageSectionService.reorderPageSections(pageSectionDto.pageSectionIds)
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get a page section by ID' })
    @ApiResponse({ status: 200, description: 'Page section retrieved successfully', type: PageSection })
    @ApiResponse({ status: 404, description: 'Page section not found' })
    async getSection(
        @Param("id") id: string
    ) {
        return await this.pageSectionService.getPageSectionById(id)
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete a page section' })
    @ApiResponse({ status: 200, description: 'Page section deleted successfully' })
    @ApiResponse({ status: 404, description: 'Page section not found' })
    async deleteSection(
        @Param("id") id: string
    ) {
        return await this.pageSectionService.deletePageSectionById(id)
    }
}
