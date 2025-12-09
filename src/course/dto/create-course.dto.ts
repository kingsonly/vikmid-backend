import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";

export enum CourseType {
    ON_DEMAND = 'on-demand',
    COHORT = 'cohort',
    CHALLENGE = 'challenge',
}

export class EnrollmentQuestionDto {
    @ApiProperty({ description: "The question text", example: "Why do you want to join this course?" })
    @IsString()
    @IsNotEmpty()
    question: string;

    @ApiProperty({ description: "Whether this question is required", example: true })
    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    required?: boolean = false;

    @ApiProperty({ description: "Question type", enum: ["text", "multiple_choice", "checkbox"] })
    @IsString()
    type: "text" | "multiple_choice" | "checkbox";

    @ApiProperty({
        description: "Options for multiple choice or checkbox questions",
        required: false,
        example: ["Option A", "Option B", "Option C"]
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    options?: string[];
}
export class CreateCourseDto {
    @ApiProperty({ description: 'Title of the course', example: 'NestJS for Beginners' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ enum: CourseType, example: CourseType.ON_DEMAND, description: 'Type of the course' })
    @IsNotEmpty()
    @IsString()
    courseType: CourseType;

    @ApiProperty({ description: 'Description of the course', example: 'A comprehensive course on NestJS' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ description: 'Indicates whether the course has a batch', example: true, required: false })
    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    withBatch?: boolean;

    @ValidateIf((o) => o.withBatch === false)
    @ApiProperty({ description: 'Price of the course', example: 100.50 })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    price?: number;

    @ApiProperty({ description: 'Course status (active/inactive)', example: 'active' })
    @IsBoolean()
    @Type(() => Boolean)
    status?: boolean;

    @ApiProperty({ description: 'Indicates whether the course has a trailer', example: true, required: false })
    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    withTrailer?: boolean;

    @ApiProperty({ description: 'Indicates whether the course has a discount', example: true, required: false })
    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    withDiscount?: boolean;

    @ValidateIf((o) => o.withDiscount)
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    @ApiProperty({ description: 'Discounted price of the course', example: 80.00, required: false })
    discountPrice?: number;

    @ApiProperty({ description: 'File associated with the course (e.g., a trailer video)', example: 'file.mp4', required: false })
    @IsOptional()
    file?: string;


    @ApiProperty({ description: 'Indicates whether the course has a certificate', example: true, required: false })
    @IsBoolean()
    @Type(() => Boolean)
    @IsOptional()
    withCertificate?: boolean;

    @ApiProperty({ description: 'ID of the hub related to the course', example: 1, required: true })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    hubId: number;

    @ApiProperty({ description: 'ID of the course creator (user)', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    creatorId: number;

    @ApiProperty({
        description: 'Custom enrollment questions for this course',
        type: [EnrollmentQuestionDto],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => EnrollmentQuestionDto)
    @Transform(({ value }) => {
        // If the value is a string (JSON), parse it
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch (e) {
                return [];
            }
        }
        // If it's already an array, return it
        return value;
    })
    enrollmentQuestions?: EnrollmentQuestionDto[];
}