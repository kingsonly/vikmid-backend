import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ProductStatus, ProductType } from '../product.enum';

export class FilterProductDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  hub_id?: string;

  @ApiProperty({ required: false, enum: ProductType })
  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @ApiProperty({ required: false, enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
