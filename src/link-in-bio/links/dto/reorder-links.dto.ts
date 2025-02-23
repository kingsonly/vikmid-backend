import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';

export class reorderLinksDto {
    @ApiProperty({
        description: 'Array of Links IDs in the new order',
        type: [String],
        example: ['link1', 'link2', 'link3']
    })
    @IsArray({ message: 'linksIds must be an array of strings' })
    @ArrayNotEmpty({ message: 'linksIds array cannot be empty' })
    @IsString({ each: true, message: 'Each linksIds must be a string' })
    linksIds: string[];


}
