import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';

export class reorderPageDto {
    @ApiProperty({
        description: 'Array of Page  IDs in the new order',
        type: [String],
        example: ['page1', 'page2', 'page3']
    })
    @IsArray({ message: 'pageIds must be an array of strings' })
    @ArrayNotEmpty({ message: 'pageIds array cannot be empty' })
    @IsString({ each: true, message: 'Each pageId must be a string' })
    pageIds: string[];


}
