import { Injectable } from '@nestjs/common';
import { ProductRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private productRepository: ProductRepository) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.createProduct(createProductDto);
  }

  async findOne(id: string): Promise<Product> {
    return this.productRepository.findOneBy({ id });
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id);
  }
}
