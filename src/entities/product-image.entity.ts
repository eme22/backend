import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
  @ApiProperty({ description: 'The unique identifier of the product image' })
  @PrimaryGeneratedColumn()
  image_id: number;

  @ApiProperty({ description: 'The product ID associated with this image' })
  @Column()
  product_id: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ApiProperty({ description: 'The URL of the product image' })
  @Column()
  image_url: string;

  @ApiProperty({ description: 'Whether this is the primary image for the product' })
  @Column({ default: false })
  is_primary: boolean;

  @ApiProperty({ description: 'The date when the image was created' })
  @CreateDateColumn()
  created_at: Date;
}
