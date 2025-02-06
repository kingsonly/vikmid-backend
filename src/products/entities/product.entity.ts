import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

enum ProductType {
  physical = 'physical',
  digital = 'digital',
}

enum ProductStatus {
  available = 'available',
  unavailable = 'unavailable',
}

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

  @Column({ nullable: true })
  discount_type: string;
}
