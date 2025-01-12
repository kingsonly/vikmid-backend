import { IsBoolean, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCourseDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsString()
    status: string;

    @IsBoolean()
    @IsOptional()
    withTrailer?: boolean;

    @IsBoolean()
    @IsOptional()
    withDiscount?: boolean;
    
    @IsNotEmpty()
    @IsNumber()
    discountPrice: number;

    @IsOptional()
    @IsString()
    file?: string;

    @IsBoolean()
    @IsOptional()
    withBatch?: boolean;

    @IsBoolean()
    @IsOptional()
    withCertificate?: boolean;

    @IsOptional()
    @IsNumber()
    hubId?: number;

    @IsNotEmpty()
    @IsNumber()
    creatorId: number;
}
