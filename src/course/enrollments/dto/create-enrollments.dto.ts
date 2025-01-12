import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateEnrollmentsDto {
    @IsInt()
    @IsNotEmpty()
    studentId: number;

    @IsInt()
    @IsNotEmpty()
    courseId: number;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsOptional()
    @IsInt()
    hubId?: number;
}
