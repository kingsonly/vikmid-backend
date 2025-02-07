import { Request, Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new product' })
  async createProduct(
    @Request() req,
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    const product = {
      ...createProductDto,
      userId: req.user.id,
    };
    if (!product.userId) {
      throw new Error('User not found');
    }
    return this.productsService.createProduct(createProductDto);
  }
}
