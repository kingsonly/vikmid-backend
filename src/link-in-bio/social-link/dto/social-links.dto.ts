import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class SocialLinksDto {

    @IsString()
    @ApiPropertyOptional({ type: String, description: 'social Network Name' })
    socialNetworkName: string;

    @IsString()
    @ApiPropertyOptional({ type: String, description: 'Bio profile ID' })
    bioProfileId: string;

    @IsString()
    @ApiPropertyOptional({ type: String, description: 'social network link' })
    link: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ type: Number, description: 'The order in which the link should be displayed' })
    order?: number;


    @IsOptional()
    @IsBoolean()
    @ApiPropertyOptional({ type: Boolean, description: 'Status' })
    status?: boolean;
}
