import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class reorderPageSectionDto {

    pageSectionIds: string[];


}
