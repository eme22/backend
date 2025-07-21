import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('order_items')
export class OrderItem {
  @ApiProperty({ description: 'The unique identifier of the order item' })
  @PrimaryGeneratedColumn()
  order_item_id: number;

  @ApiProperty({ description: 'The order ID associated with this item' })
  @Column()
  order_id: number;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ApiProperty({ description: 'The product ID associated with this item' })
  @Column()
  product_id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ApiProperty({ description: 'The quantity of the product ordered' })
  @Column()
  quantity: number;

  @ApiProperty({ description: 'The unit price of the product at the time of purchase' })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'The subtotal for this order item (quantity * unit_price)' })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  subtotal: number;
}
