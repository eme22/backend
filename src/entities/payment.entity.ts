import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  ELECTRONIC_WALLET = 'electronic_wallet',
  APPLE_PAY = 'apple_pay',
  COD = 'cod',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled',
}

@Entity('payments')
export class Payment {
  @ApiProperty({ description: 'The unique identifier of the payment' })
  @PrimaryGeneratedColumn()
  payment_id: number;

  @ApiProperty({ description: 'The order ID associated with this payment' })
  @Column()
  order_id: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ApiProperty({ description: 'The payment method used', enum: PaymentMethod })
  @Column({
    type: 'text',
    enum: PaymentMethod,
  })
  payment_method: PaymentMethod;

  @ApiProperty({ description: 'The payment amount' })
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'The payment status', enum: PaymentStatus })
  @Column({
    type: 'text',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @ApiProperty({ description: 'The date when the payment was made' })
  @CreateDateColumn()
  payment_date: Date;

  @ApiProperty({ description: 'The transaction ID for the payment' })
  @Column({ nullable: true })
  transaction_id: string;
}
