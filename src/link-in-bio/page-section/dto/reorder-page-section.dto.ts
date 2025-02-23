import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';

export class reorderPageSectionDto {
    @ApiProperty({
        description: 'Array of Page Section IDs in the new order',
        type: [String],
        example: ['section1', 'section2', 'section3']
    })
    @IsArray({ message: 'pageSectionIds must be an array of strings' })
    @ArrayNotEmpty({ message: 'pageSectionIds array cannot be empty' })
    @IsString({ each: true, message: 'Each pageSectionId must be a string' })
    pageSectionIds: string[];


}
