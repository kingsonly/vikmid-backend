import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateLessonsDto {
    @ApiProperty({ description: 'Reference the course by its ID for easier DTO usage' })
    @IsNotEmpty()
    @IsUUID()
    courseId: string;

    @ApiProperty({ description: 'Title of the lesson' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ description: 'Content of the lesson' })
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty({ description: 'Order of the lesson in the course' })
    @IsNotEmpty()
    @IsNumber()
    order: number;

    @ApiProperty({ description: 'Optional hub ID related to the lesson', required: false })
    @IsOptional()
    @IsNumber()
    hubId?: number;
}
