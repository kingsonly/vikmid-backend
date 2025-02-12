import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateLessonSegmentsDto {
    @ApiProperty({ description: 'ID of the lesson this segment belongs to' })
    @IsNotEmpty()
    @IsUUID()
    lessonId: string;

    @ApiProperty({ description: 'The type of the lesson segment' })
    @IsNotEmpty()
    @IsString()
    type: string;

    @ApiProperty({ description: 'The content of the lesson segment' })
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty({ description: 'The description of the lesson segment' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ description: 'The order in which the segment appears in the lesson' })
    @IsNotEmpty()
    @IsNumber()
    order: number;

    @ApiPropertyOptional({ description: 'Optional field for a hub ID' })
    @IsOptional()
    @IsNumber()
    hubId?: number;

    @ApiProperty({ description: 'Whether the segment is free or not' })
    @IsNotEmpty()
    @IsBoolean()
    freeStatus: boolean;

    @ApiProperty({ description: 'Whether the segment is previewable or not' })
    @IsNotEmpty()
    @IsBoolean()
    previewable: boolean;
}