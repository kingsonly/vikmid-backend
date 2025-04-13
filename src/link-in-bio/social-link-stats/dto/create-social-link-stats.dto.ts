import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsObject, IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateSocialLinkStatsDto {
    @IsString()
    @ApiProperty({ type: String, description: 'name' })
    socialLinkId: string;


    @IsObject()
    @ApiProperty({ type: String, description: 'bioProfileId' })
    stats: {
        referrer: string;
        userAgent: string;
        viewportWidth: number;
        viewportHeight: number;
        language: string;
        platform: string;
    };

}
