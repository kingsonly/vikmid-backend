import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { SocialLinkService } from './social-link.service';
import { SocialLinksDto } from './dto/social-links.dto';
import { reorderSocialLinksDto } from './dto/reorder-social-links.dto';

@ApiTags('Social Links')
@Controller('social-link')
export class SocialLinkController {
    constructor(
        private readonly socialLinkService: SocialLinkService,
    ) { }

    /**
     * Creates a new social link.
     * @param {SocialLinksDto} socialLinksDto - The DTO containing social link data.
     * @returns The newly created social link.
     */
    @Post("create")
    @ApiOperation({ summary: 'Create a social link' })
    @ApiResponse({ status: 201, description: 'Social link created successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiBody({ type: SocialLinksDto })
    async createSocialLink(
        @Body() socialLinksDto: SocialLinksDto,
    ) {
        return await this.socialLinkService.createLink(socialLinksDto);
    }

    /**
     * Updates an existing social link by ID.
     * @param {string} id - The ID of the social link to update.
     * @param {Partial<SocialLinksDto>} socialLinksDto - The new data for the social link.
     * @returns The updated social link.
     */
    @Put("update/:id")
    @ApiOperation({ summary: 'Update a social link by ID' })
    @ApiResponse({ status: 200, description: 'Social link updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 404, description: 'Social link not found' })
    @ApiParam({ name: 'id', description: 'The ID of the social link to update' })
    @ApiBody({ type: SocialLinksDto })
    async updateSocialLink(
        @Body() socialLinksDto: Partial<SocialLinksDto>,
        @Param("id") id: string,
    ) {
        return await this.socialLinkService.updateSocialLink(id, socialLinksDto);
    }

    /**
     * Reorders social links.
     * @param {reorderSocialLinksDto} socialLinksDto - DTO containing an array of social link IDs in the desired order.
     * @returns A success message if the order is updated.
     */
    @Put("reorder")
    @ApiOperation({ summary: 'Reorder social links' })
    @ApiResponse({ status: 200, description: 'Order updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiBody({ type: reorderSocialLinksDto })
    async reorderSocialLinks(
        @Body() socialLinksDto: reorderSocialLinksDto
    ) {
        let reorder = await this.socialLinkService.reorderSocialLinks(socialLinksDto.socialLinksIds)
        if (!reorder) {
            throw new BadRequestException('Something went wrong');
        }
        return {
            message: "Order Updated",
            status: "success"
        };
    }

    /**
     * Retrieves a social link by its ID.
     * @param {string} id - The ID of the social link to retrieve.
     * @returns The social link object.
     */
    @Get(":id")
    @ApiOperation({ summary: 'Get a social link by ID' })
    @ApiResponse({ status: 200, description: 'Social link retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Social link not found' })
    @ApiParam({ name: 'id', description: 'The ID of the social link to retrieve' })
    async getSocialLinkById(
        @Param("id") id: string
    ) {
        return await this.socialLinkService.getSocialLinkById(id);
    }

    /**
     * Retrieves all social links associated with a bio profile.
     * @param {string} id - The ID of the bio profile.
     * @returns An array of social links.
     */
    @Get("bio-profile-social-links/:id")
    @ApiOperation({ summary: 'Get social links by bio profile ID' })
    @ApiResponse({ status: 200, description: 'Social links retrieved successfully' })
    @ApiResponse({ status: 404, description: 'No social links found' })
    @ApiParam({ name: 'id', description: 'The ID of the bio profile to retrieve social links for' })
    async getLinksByPageSectionId(
        @Param("id") id: string
    ) {
        return await this.socialLinkService.getLinksByBioProfileId(id);
    }

    /**
     * Deletes a social link by its ID.
     * @param {string} id - The ID of the social link to delete.
     * @returns The deleted social link.
     */
    @Delete(":id")
    @ApiOperation({ summary: 'Delete a social link by ID' })
    @ApiResponse({ status: 200, description: 'Social link deleted successfully' })
    @ApiResponse({ status: 404, description: 'Social link not found' })
    @ApiParam({ name: 'id', description: 'The ID of the social link to delete' })
    async deleteLink(
        @Param("id") id: string
    ) {
        return await this.socialLinkService.deleteSocialLink(id);
    }
}
