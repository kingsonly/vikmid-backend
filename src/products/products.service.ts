import { Injectable } from '@nestjs/common';
import { ProductRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private productRepository: ProductRepository) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.createProduct(createProductDto);
  }
}
