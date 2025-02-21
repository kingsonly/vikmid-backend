import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class UpdateBioProfileDto {
    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({ type: Number, description: 'Template ID' })
    template?: number;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ type: String, description: 'Display Name' })
    displayName?: string;

    @IsOptional()
    @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Profile Picture' })
    profilePicture?: string;

    @IsOptional()
    @ApiPropertyOptional({ type: 'string', format: 'binary', description: 'Banner' })
    banner?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({ type: String, description: 'Theme Colors' })
    themeColors?: string;

    @IsOptional()
    @IsBoolean()
    @ApiPropertyOptional({ type: Boolean, description: 'Status' })
    status?: boolean;
}
