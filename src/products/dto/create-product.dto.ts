import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

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
  @IsString()
  user_id: string;

  @ApiProperty({
    description: 'Hub ID is the creator of the product',
    example: 'ad2db5a9-551b-4ca9-8b6e-95fe07716227',
  })
  @IsString()
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
    required: false,
  })
  @IsOptional()
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

  @ApiProperty({ description: 'Type of the product', example: 'Electronics' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Status of the product', example: 'available' })
  @IsString()
  status: string;

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
    description: 'Type of discount (percentage or flat)',
    example: 'percentage',
    required: false,
  })
  @IsOptional()
  @IsString()
  discount_type?: string;
}
