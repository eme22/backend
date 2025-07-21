import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity('reviews')
export class Review {
  @ApiProperty({ description: 'The unique identifier of the review' })
  @PrimaryGeneratedColumn()
  review_id: number;

  @ApiProperty({ description: 'The product ID associated with this review' })
  @Column()
  product_id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ApiProperty({ description: 'The user ID who wrote the review' })
  @Column()
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'The rating given in the review (1-5)' })
  @Column()
  rating: number;

  @ApiProperty({ description: 'The comment text in the review' })
  @Column('text', { nullable: true })
  comment: string;

  @ApiProperty({ description: 'The date when the review was created' })
  @CreateDateColumn()
  created_at: Date;
}
