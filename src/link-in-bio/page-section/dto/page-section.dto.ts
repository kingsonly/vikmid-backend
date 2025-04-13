import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class PageSectionDto {

    @IsString()
    @ApiPropertyOptional({ type: String, description: 'Page ID' })
    pageId: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ type: String, description: 'Section Title' })
    title?: string;

    @IsOptional()
    @ApiPropertyOptional({ type: Number, description: 'The other to fetch and display page section' })
    order?: number;

}
