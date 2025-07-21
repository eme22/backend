import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from './category.entity';
import { Brand } from './brand.entity';
import { ProductImage } from './product-image.entity';
import { Review } from './review.entity';
import { OrderItem } from './order-item.entity';

@Entity('products')
export class Product {
  @ApiProperty({ description: 'The unique identifier of the product' })
  @PrimaryGeneratedColumn()
  product_id: number;

  @ApiProperty({ description: 'The name of the product' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The description of the product' })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({ description: 'The category ID of the product' })
  @Column({ nullable: true })
  category_id: number;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ApiProperty({ description: 'The brand ID of the product' })
  @Column({ nullable: true })
  brand_id: number;

  @ManyToOne(() => Brand, { nullable: true })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ApiProperty({ description: 'The price of the product' })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'The stock quantity of the product' })
  @Column({ default: 0 })
  stock_quantity: number;

  @ApiProperty({ description: 'The SKU (Stock Keeping Unit) of the product' })
  @Column({ unique: true })
  sku: string;

  @ApiProperty({ description: 'Whether the product is active' })
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty({ description: 'Whether the product is on offer' })
  @Column({ default: false })
  offer: boolean;

  @ApiProperty({ description: 'The date when the product was created' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'The date when the product was last updated' })
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  order_items: OrderItem[];
}
