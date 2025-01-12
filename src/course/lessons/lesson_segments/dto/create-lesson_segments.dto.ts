import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateLessonSegmentsDto {
    @IsNotEmpty()
    @IsInt()
    lessonId: number;  // ID of the lesson this segment belongs to

    @IsNotEmpty()
    @IsString()
    type: string;  // The type of the lesson segment

    @IsNotEmpty()
    @IsString()
    content: string;  // The content of the lesson segment
    
    @IsNotEmpty()
    @IsString()
    description: string;  // The content of the lesson segment

    @IsNotEmpty()
    @IsNumber()
    order: number;  // The order in which the segment appears in the lesson

    @IsOptional()
    @IsNumber()
    hubId?: number;  // Optional field for a hub ID

    @IsNotEmpty()
    @IsBoolean()
    freeStatus: boolean;  // Whether the segment is free or not

    @IsNotEmpty()
    @IsBoolean()
    previewable: boolean;  // Whether the segment is previewable or not
}
