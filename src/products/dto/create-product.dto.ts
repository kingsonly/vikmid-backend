import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { DiscountType, ProductStatus, ProductType } from '../product.enum';

export class CreateProductDto {
  @ApiProperty({
    description: 'Title of the product',
    example: 'Gaming Laptop',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'User ID is the creator of the product',
    example: 'ad2db5a9-551b-4ca9-8b6e-95fe07716227',
  })
  @IsUUID()
  user_id: string;

  @ApiProperty({
    description: 'Hub ID is the creator of the product',
    example: 'ad2db5a9-551b-4ca9-8b6e-95fe07716227',
  })
  @IsUUID()
  hub_id: string;

  @ApiProperty({
    description: 'Cost of the product',
    example: 1499.99,
    type: 'number',
    format: 'decimal',
  })
  @IsNumber()
  cost: number;

  @ApiProperty({
    description: 'Description of the product',
    example: 'A high-performance laptop for gaming',
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Product image URL',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  product_image?: string;

  @ApiProperty({
    description: 'Type of the product',
    enum: ProductType,
    example: ProductType.physical,
  })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty({
    description: 'Status of the product',
    enum: ProductStatus,
    example: ProductStatus.available,
  })
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @ApiProperty({
    description: 'Whether the product has a discount',
    example: false,
  })
  @IsOptional()
  with_discount: boolean;

  @ApiProperty({
    description: 'Discounted cost',
    example: 1299.99,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  discount_cost?: number;

  @ApiProperty({
    description: 'Type of discount',
    enum: DiscountType,
    example: DiscountType.percentage,
    required: false,
  })
  @IsOptional()
  @IsEnum(DiscountType)
  discount_type?: DiscountType;
}
