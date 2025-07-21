import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Address } from './address.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from './payment.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('orders')
export class Order {
  @ApiProperty({ description: 'The unique identifier of the order' })
  @PrimaryGeneratedColumn()
  order_id: number;

  @ApiProperty({ description: 'The user ID associated with this order' })
  @Column({ nullable: true })
  user_id: number;

  @ApiProperty({
    description:
      'The user email associated with this order if user_id is not set',
  })
  @Column({ nullable: true })
  user_email: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'The address ID for shipping this order' })
  @Column({ nullable: true })
  address_id: number;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @ApiProperty({ description: 'The status of the order', enum: OrderStatus })
  @Column({
    type: 'text',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @ApiProperty({ description: 'The total amount of the order' })
  @Column('decimal', { precision: 10, scale: 2 })
  total_amount: number;

  @ApiProperty({ description: 'The shipping address for this order' })
  @Column('text', { nullable: true })
  shipping_address: string;

  @ApiProperty({ description: 'The date when the order was created' })
  @CreateDateColumn({ name: 'order_date' })
  order_date: Date;

  @ApiProperty({ description: 'The date when the order was created' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'The shipping method used for the order' })
  @Column({ nullable: true })
  shipping_method: string;

  @ApiProperty({
    description: 'The payment status of the order',
    enum: PaymentStatus,
  })
  @Column({
    type: 'text',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  payment_status: PaymentStatus;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    onDelete: 'CASCADE',
  })
  order_items: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];

  @ManyToOne(() => Payment, { nullable: true })
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;
}
