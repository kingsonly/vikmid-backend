import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateEnrollmentsDto {
    @ApiProperty({ description: 'ID of the student', example: 1 })
    @IsUUID()
    @IsNotEmpty()
    studentId: string;

    @ApiProperty({ description: 'ID of the course', example: 101 })
    @IsUUID()
    @IsNotEmpty()
    courseId: string;

    @ApiProperty({ description: 'Enrollment status', example: 'active' })
    @IsString()
    @IsNotEmpty()
    status: string;

    @ApiPropertyOptional({ description: 'ID of the hub (optional)', example: 5, required: false })
    @IsOptional()
    @IsInt()
    hubId?: number;

}
