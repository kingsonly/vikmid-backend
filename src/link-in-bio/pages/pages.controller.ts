import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/creat-page.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Page } from '../entity/page.entity';


@ApiTags('Pages') // Group in Swagger
@ApiBearerAuth() // Enables JWT authentication in Swagger UI
@Controller('pages')
@UseGuards(JwtAuthGuard) // Apply authentication guard to all routes
export class PagesController {
    constructor(
        private readonly pageService: PagesService,
    ) { }

    @Post("create")
    @ApiOperation({ summary: 'Create a new page' })
    @ApiResponse({ status: 201, description: 'Page created successfully.', type: Page })
    @ApiResponse({ status: 400, description: 'Invalid data provided.' })
    async createPages(@Body() data: CreatePageDto) {
        return await this.pageService.createPage(data);
    }

    @Put("update/:id")
    @ApiOperation({ summary: 'Update an existing page' })
    @ApiResponse({ status: 200, description: 'Page updated successfully.', type: Page })
    @ApiResponse({ status: 404, description: 'Page not found.' })
    async updatePages(@Param("id") id: string, @Body() data: Partial<CreatePageDto>) {
        return await this.pageService.updatePage(data, id);
    }

    @Get(":id")
    @ApiOperation({ summary: 'Get page by ID' })
    @ApiResponse({ status: 200, description: 'Page found.', type: Page })
    @ApiResponse({ status: 404, description: 'Page not found.' })
    async getPage(@Param("id") id: string) {
        return await this.pageService.getPageById(id);
    }

    @Get("profile-pages/:id")
    @ApiOperation({ summary: 'Get all pages by profile ID' })
    @ApiResponse({ status: 200, description: 'Pages retrieved successfully.', type: Page, isArray: true })
    @ApiResponse({ status: 404, description: 'No pages found for this profile.' })
    async getProfilePages(@Param("id") id: string) {
        return await this.pageService.getPageByProfileId(id);
    }

    @Delete(":id")
    @ApiOperation({ summary: 'Delete a page and its relationships' })
    @ApiResponse({
        status: 200,
        description: 'Page deleted successfully.',
        schema: {
            example: {
                message: "Deleted Successfully",
                status: "success"
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Page not found.',
        schema: {
            example: {
                message: "Could not delete page",
                status: "error"
            }
        }
    })
    async deletePage(@Param("id") id: string) {
        let response = await this.pageService.deletePage(id);
        if (response) {
            return {
                message: "Deleted Successfully",
                status: "success"
            };
        }
        return {
            message: "Could not delete page",
            status: "error"
        };
    }
}
