import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber, IsObject } from 'class-validator';

export class CreateLinkStatsDto {
    @IsString()
    @ApiProperty({ type: String, description: 'name' })
    linkId: string;

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
