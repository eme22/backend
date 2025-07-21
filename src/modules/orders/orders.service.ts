import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { Product } from '../../entities/product.entity';
import { User } from '../../entities/user.entity';
import {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from '../../entities/payment.entity';

export interface CartItem {
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface CreateOrderDto {
  user_id?: number;
  user_email?: string;
  items: CartItem[];
  shipping_address: string;
  payment_method: string;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    userId?: number,
  ): Promise<{ orders: Order[]; total: number; page: number; limit: number }> {
    const queryBuilder = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.order_items', 'order_items')
      .leftJoinAndSelect('order_items.product', 'product')
      .leftJoinAndSelect('product.images', 'product_images')
      .leftJoinAndSelect('order.payment', 'payment')
      .orderBy('order.created_at', 'DESC');

    if (userId) {
      queryBuilder.andWhere('order.user_id = :userId', { userId });
    }

    const total = await queryBuilder.getCount();
    const orders = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      orders,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number, userId?: number, email?: string): Promise<Order> {
    const queryBuilder = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.order_items', 'order_items')
      .leftJoinAndSelect('order_items.product', 'product')
      .leftJoinAndSelect('product.images', 'product_images')
      .leftJoinAndSelect('order.payment', 'payment')
      .where('order.order_id = :id', { id });

    if (userId) {
      queryBuilder.andWhere('order.user_id = :userId', { userId });
    }

    if (email) {
      queryBuilder.andWhere('order.user_email = :email', { email });
    }

    const order = await queryBuilder.getOne();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async count(): Promise<number> {
    return this.ordersRepository.count();
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { user_id, user_email, items, shipping_address, payment_method } =
      createOrderDto;

    if (!user_id && !user_email) {
      throw new BadRequestException(
        'Either user_id or user_email must be provided',
      );
    }

    // Validate user exists
    const user = await this.usersRepository.findOne({
      where: { user_id },
    });
    if (!user && !user_email) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    // Validate products and calculate total
    let total_amount = 0;
    const orderItems: Partial<OrderItem>[] = [];

    for (const item of items) {
      const product = await this.productsRepository.findOne({
        where: { product_id: item.product_id, is_active: true },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.product_id} not found`,
        );
      }

      if (product.stock_quantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${product.stock_quantity}, Requested: ${item.quantity}`,
        );
      }

      const itemTotal = item.price * item.quantity;
      total_amount += itemTotal;

      orderItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      });
    }

    // Create order
    const order = this.ordersRepository.create({
      user_id,
      user_email,
      total_amount,
      shipping_address,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Create order items
    for (const item of orderItems) {
      const orderItem = this.orderItemsRepository.create({
        ...item,
        order_id: savedOrder.order_id,
      });
      await this.orderItemsRepository.save(orderItem);

      // Update product stock
      await this.productsRepository.decrement(
        { product_id: item.product_id },
        'stock_quantity',
        item.quantity!,
      );
    }

    // Create payment record
    const payment = this.paymentsRepository.create({
      order_id: savedOrder.order_id,
      amount: total_amount,
      payment_method: this.enumFromStringValue(PaymentMethod, payment_method),
      status: PaymentStatus.PENDING,
    });
    await this.paymentsRepository.save(payment);

    return this.findOne(savedOrder.order_id);
  }

  async updateStatus(id: number, status: string): Promise<Order> {
    const order = await this.findOne(id);
    const orderStatus = this.enumFromStringValue(OrderStatus, status);
    if (!orderStatus) {
      throw new BadRequestException(`Invalid order status: ${status}`);
    }
    order.status = orderStatus;
    await this.ordersRepository.save(order);
    return order;
  }

  async updatePaymentStatus(id: number, paymentStatus: string): Promise<Order> {
    const order = await this.findOne(id);
    const status = this.enumFromStringValue(PaymentStatus, paymentStatus);

    if (!status) {
      throw new BadRequestException(`Invalid payment status: ${paymentStatus}`);
    }

    if (order.payment) {
      order.payment.status = status;
      await this.paymentsRepository.save(order.payment);
    }

    return order;
  }

  async cancel(id: number, userId?: number): Promise<Order> {
    const order = await this.findOne(id, userId);

    if (
      order.status === OrderStatus.SHIPPED ||
      order.status === OrderStatus.DELIVERED
    ) {
      throw new BadRequestException(
        'Cannot cancel order that has been shipped or delivered',
      );
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order is already cancelled');
    }

    // Restore product stock
    for (const item of order.order_items) {
      await this.productsRepository.increment(
        { product_id: item.product_id },
        'stock_quantity',
        item.quantity,
      );
    }

    order.status = OrderStatus.CANCELLED;
    await this.ordersRepository.save(order);

    // Update payment status
    if (order.payment) {
      order.payment.status = PaymentStatus.CANCELLED;
      await this.paymentsRepository.save(order.payment);
    }

    return order;
  }

  async getUserOrders(
    userId: number,
  ): Promise<{ orders: Order[]; total: number; page: number; limit: number }> {
    return this.findAll(1, 10, userId);
  }

  async getOrderStats(): Promise<{
    total_orders: number;
    total_revenue: number;
    pending_orders: number;
    shipped_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
  }> {
    const total_orders = await this.ordersRepository.count();
    const pending_orders = await this.ordersRepository.count({
      where: { status: OrderStatus.PENDING },
    });
    const shipped_orders = await this.ordersRepository.count({
      where: { status: OrderStatus.SHIPPED },
    });
    const delivered_orders = await this.ordersRepository.count({
      where: { status: OrderStatus.DELIVERED },
    });
    const cancelled_orders = await this.ordersRepository.count({
      where: { status: OrderStatus.CANCELLED },
    });

    const revenueResult = (await this.ordersRepository
      .createQueryBuilder('order')
      .select('SUM(order.total_amount)', 'total_revenue')
      .where('order.status != :status', { status: 'cancelled' })
      .getRawOne()) as { total_revenue: string };

    const total_revenue = parseFloat(revenueResult.total_revenue) || 0;

    return {
      total_orders,
      total_revenue,
      pending_orders,
      shipped_orders,
      delivered_orders,
      cancelled_orders,
    };
  }

  enumFromStringValue<T>(
    enm: { [s: string]: T },
    value: string,
  ): T | undefined {
    return (Object.values(enm) as unknown as string[]).includes(value)
      ? (value as unknown as T)
      : undefined;
  }
}
