import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class UpdateHubDto {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ type: String, description: 'Hub Title' })
    title?: string;

    @IsOptional()
    @ApiPropertyOptional({ type: 'string', description: 'hub url' })
    hubUrl?: string;
}
