import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class reorderSocialLinksDto {
    @ApiProperty({
        description: 'Array of Social Links IDs in the new order',
        type: [String],
        example: ['Social-link1', 'Social-link2', 'Social-link3']
    })
    @IsArray({ message: 'socialLinksIds must be an array of strings' })
    @ArrayNotEmpty({ message: 'socialLinksIds array cannot be empty' })
    @IsString({ each: true, message: 'Each socialLinksIds must be a string' })
    socialLinksIds: string[];


}
