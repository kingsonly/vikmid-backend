import { Controller, Get, Param, UseGuards, Body, Put, UseInterceptors, UploadedFiles, NotFoundException } from '@nestjs/common';
import { LinkInBioService } from './link-in-bio.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { UpdateBioProfileDto } from './dto/update-bio-profile.dto';
import { BioProfile } from './entity/bio-profile.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'config/storage.provider';
import { HubService } from 'src/hub/hub.service';
@Controller('link-in-bio')
export class LinkInBioController {
    constructor(
        private readonly bioProfileService: LinkInBioService,
        private readonly hubService: HubService,
        private readonly storageService: StorageService) { }
    @ApiTags('BioProfile')
    @ApiBearerAuth() // Indicates this route requires authentication
    @Get('init/:hubId')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get or Create BioProfile' })
    @ApiParam({ name: 'hubId', type: Number, description: 'The ID of the Hub' })
    @ApiResponse({ status: 200, description: 'BioProfile retrieved or created successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async getOrCreateBioProfile(@Param('hubId') hubId: number) {
        return this.bioProfileService.getOrCreateBioProfile(hubId);
    }

    @Put('update/:id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileFieldsInterceptor(
        [
            { name: 'profilePicture', maxCount: 1 },
            { name: 'banner', maxCount: 1 },
        ]
    ))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Update BioProfile by ID with file upload' })
    @ApiResponse({ status: 200, description: 'BioProfile updated successfully', type: BioProfile })
    @ApiResponse({ status: 404, description: 'BioProfile not found' })
    async updateBioProfile(
        @Param('id') id: string,
        @UploadedFiles() files: { profilePicture?: Express.Multer.File[], banner?: Express.Multer.File[] },
        @Body() updateBioProfileDto: UpdateBioProfileDto,
    ) {
        const bioProfile = await this.bioProfileService.getBioProfileById(id);
        if (files?.profilePicture) {
            let storage = await this.storageService.uploadFile(files.profilePicture[0], 'link-in-bio');
            if (storage) {
                updateBioProfileDto.profilePicture = storage.url;
                //delete previous file
                if (bioProfile.profilePicture.length > 0) {
                    await this.storageService.deleteFile(bioProfile.profilePicture);
                }

            }
        }

        if (files?.banner) {
            let storage = await this.storageService.uploadFile(files.banner[0], 'link-in-bio');
            if (storage) {
                updateBioProfileDto.banner = storage.url;
                //delete previous file
                if (bioProfile.banner.length > 0) {
                    await this.storageService.deleteFile(bioProfile.banner);
                }


            }
        }
        return this.bioProfileService.updateBioProfile(id, updateBioProfileDto);
    }

    @Get('links/:url')
    @ApiOperation({ summary: 'Get BioProfile by Hub URL' })
    @ApiParam({
        name: 'url',
        required: true,
        description: 'The URL of the hub associated with the BioProfile',
        example: 'info.vikmid.com'
    })
    @ApiResponse({ status: 200, description: 'Returns the BioProfile with all relationships', type: BioProfile })
    @ApiResponse({ status: 404, description: 'BioProfile not found' })
    async getBioProfileWithRelationshipsWithHubUrl(@Param('url') url: string): Promise<BioProfile> {
        let hub = await this.hubService.findByUrl(url)
        if (!hub) {
            throw new NotFoundException('BioProfile not found');
        }
        return await this.bioProfileService.getBioProfileWithRelationships(hub.id);
    }
}
