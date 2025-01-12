import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hub_id: string;

  @Column()
  title: string;

  @Column('decimal')
  cost: number;

  @Column()
  type: string;

  @Column()
  description: string;

  @Column()
  product_image: string;

  @Column()
  status: string;

  @Column({ default: false })
  with_discount: boolean;

  @Column('decimal', { nullable: true })
  discount_cost: number;

  @Column({ nullable: true })
  discount_type: string;
}
