import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCourseDto {
    @ApiProperty({ description: 'Title of the course', example: 'NestJS for Beginners' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ description: 'Description of the course', example: 'A comprehensive course on NestJS' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ description: 'Price of the course', example: 100.50 })
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @ApiProperty({ description: 'Course status (active/inactive)', example: 'active' })
    @IsString()
    status: string;

    @ApiProperty({ description: 'Indicates whether the course has a trailer', example: true, required: false })
    @IsBoolean()
    @IsOptional()
    withTrailer?: boolean;

    @ApiProperty({ description: 'Indicates whether the course has a discount', example: true, required: false })
    @IsBoolean()
    @IsOptional()
    withDiscount?: boolean;

    @ApiProperty({ description: 'Discounted price of the course', example: 80.00 })
    @IsNotEmpty()
    @IsNumber()
    discountPrice: number;

    @ApiProperty({ description: 'File associated with the course (e.g., a trailer video)', example: 'file.mp4', required: false })
    @IsOptional()
    @IsString()
    file?: string;

    @ApiProperty({ description: 'Indicates whether the course has a batch', example: true, required: false })
    @IsBoolean()
    @IsOptional()
    withBatch?: boolean;

    @ApiProperty({ description: 'Indicates whether the course has a certificate', example: true, required: false })
    @IsBoolean()
    @IsOptional()
    withCertificate?: boolean;

    @ApiProperty({ description: 'ID of the hub related to the course', example: 1, required: false })
    @IsOptional()
    @IsNumber()
    hubId?: number;

    @ApiProperty({ description: 'ID of the course creator (user)', example: 1 })
    @IsNotEmpty()
    @IsNumber()
    creatorId: number;
}