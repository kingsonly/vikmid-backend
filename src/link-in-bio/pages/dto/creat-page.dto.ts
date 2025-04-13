import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreatePageDto {
    @IsString()
    @ApiProperty({ type: String, description: 'name' })
    name: string;

    @IsString()
    @ApiProperty({ type: String, description: 'bioProfileId' })
    bioProfileId: string;
}
