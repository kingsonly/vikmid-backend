import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class LinksDto {

    @IsString()
    @ApiPropertyOptional({ type: String, description: 'Link Title' })
    title: string;

    @IsString()
    @ApiPropertyOptional({ type: String, description: 'full link address' })
    link: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ type: String, description: 'an image tho identify the link' })
    image?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ type: String, description: 'a json template instruction for what the link design would look like ' })
    linkDesign?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({ type: Number, description: 'The order in which the link should be displayed' })
    order?: number;

    @IsString()
    @ApiPropertyOptional({ type: String, description: 'The section which a link belongs too' })
    pageSectionId: string;


    @IsOptional()
    @IsBoolean()
    @ApiPropertyOptional({ type: Boolean, description: 'Status' })
    status?: boolean;
}
