import { Body, Controller, Post, UseInterceptors, UploadedFile, Param, Put, BadRequestException, Get, Delete, UseGuards } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksDto } from './dto/links.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'config/storage.provider';
import { reorderLinksDto } from './dto/reorder-links.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { Express } from 'express';

@ApiTags('Links')
@ApiBearerAuth()
@Controller('links')
export class LinksController {
    constructor(
        private readonly linksService: LinksService,
        private readonly storageService: StorageService
    ) { }

    @Post("create")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Create a new link' })
    @ApiResponse({ status: 201, description: 'Link created successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
                title: { type: 'string' },
                url: { type: 'string' },
                description: { type: 'string' },
                pageSectionId: { type: 'string' }
            }
        }
    })
    async createLink(
        @Body() linksDto: LinksDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (file) {
            let storage = await this.storageService.uploadFile(file, 'link-image');
            if (storage) {
                linksDto.image = storage.url;
            }
        }

        return await this.linksService.createLink(linksDto);
    }

    @Put("update/:id")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Update an existing link' })
    @ApiResponse({ status: 200, description: 'Link updated successfully' })
    @ApiResponse({ status: 404, description: 'Link not found' })
    @ApiConsumes('multipart/form-data')
    @ApiParam({ name: 'id', required: true, description: 'ID of the link to update' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
                title: { type: 'string' },
                url: { type: 'string' },
                description: { type: 'string' },
                pageSectionId: { type: 'string' }
            }
        }
    })
    async updateLink(
        @Body() linksDto: Partial<LinksDto>,
        @Param("id") id: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const link = await this.linksService.getLinkById(id)
        if (file) {
            let storage = await this.storageService.uploadFile(file, 'link-image');
            if (storage) {
                linksDto.image = storage.url;
                await this.storageService.deleteFile(link.image);
            }
        }

        return await this.linksService.updateLink(id, linksDto, link);
    }

    @Put("reorder")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Reorder links' })
    @ApiResponse({ status: 200, description: 'Order updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid request' })
    async reorderLinks(
        @Body() linksDto: reorderLinksDto
    ) {
        let reorder = await this.linksService.reorderLinks(linksDto.linksIds)
        if (!reorder) {
            throw new BadRequestException('Something went wrong');
        }
        return {
            message: "Order Updated",
            status: "success"
        };
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get link by ID' })
    @ApiResponse({ status: 200, description: 'Link retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Link not found' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the link' })
    async getLinkById(
        @Param("id") id: string
    ) {
        return await this.linksService.getLinkById(id);
    }

    @Get("section-links/:id")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get links by Page Section ID' })
    @ApiResponse({ status: 200, description: 'Links retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Page Section not found' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the page section' })
    async getLinksByPageSectionId(
        @Param("id") id: string
    ) {
        return await this.linksService.getLinksByPageSectionId(id);
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Delete link by ID' })
    @ApiResponse({ status: 200, description: 'Link deleted successfully' })
    @ApiResponse({ status: 404, description: 'Link not found' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the link' })
    async deleteLink(
        @Param("id") id: string
    ) {
        return await this.linksService.deleteLink(id);
    }
}
