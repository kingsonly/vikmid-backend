import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateLessonsDto {
    @IsNotEmpty()
    @IsNumber()
    courseId: number;  // Reference the course by its ID for easier DTO usage

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsNumber()
    order: number;

    @IsOptional()
    @IsNumber()
    hubId?: number;
}
