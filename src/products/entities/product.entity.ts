import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DiscountType, ProductStatus, ProductType } from '../product.enum';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  hub_id: string;

  @Column()
  title: string;

  @Column('decimal')
  cost: number;

  @Column('enum', { enum: ProductType, default: ProductType.physical })
  type: ProductType;

  @Column()
  description: string;

  @Column()
  product_image: string;

  @Column('enum', { enum: ProductStatus, default: ProductStatus.available })
  status: ProductStatus;

  @Column({ default: false })
  with_discount: boolean;

  @Column('decimal', { nullable: true })
  discount_cost: number;

  @Column('enum', { enum: DiscountType, nullable: true })
  discount_type: DiscountType;
}
