import {
  Request,
  Body,
  Controller,
  Post,
  UseGuards,
  Patch,
  NotFoundException,
  ForbiddenException,
  Param,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProductDto } from './dto/update-product.dto';

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

  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    // Check if product exists and belongs to user
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // if (product.user_id !== user.id) {
    //   throw new ForbiddenException('You can only update your own products');
    // }

    return this.productsService.updateProduct(id, updateProductDto);
  }
}
