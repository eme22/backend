import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { User } from '../../entities/user.entity';
import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ description: 'Product ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  product_id: number;

  @ApiProperty({ description: 'Quantity', example: 2 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ description: 'New quantity', example: 3 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;
}

export interface CartItem {
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
  user_id?: number;
  session_id?: string;
}

export interface AddToCartDto {
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

@Injectable()
export class CartService {
  private anonymousCarts: Map<string, Cart> = new Map();

  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getCart(userId?: number, sessionId?: string): Promise<Cart> {
    if (userId) {
      return this.getUserCart(userId);
    } else if (sessionId) {
      return this.getAnonymousCart(sessionId);
    }

    throw new BadRequestException('User ID or session ID is required');
  }

  private async getUserCart(userId: number): Promise<Cart> {
    // For registered users, we could store cart in database
    // For now, we'll use in-memory storage with user_id as key
    const cartKey = `user_${userId}`;

    if (!this.anonymousCarts.has(cartKey)) {
      this.anonymousCarts.set(cartKey, {
        items: [],
        total: 0,
        itemCount: 0,
        user_id: userId,
      });
    }

    const cart = this.anonymousCarts.get(cartKey)!;
    return this.enrichCartWithProducts(cart);
  }

  private async getAnonymousCart(sessionId: string): Promise<Cart> {
    if (!this.anonymousCarts.has(sessionId)) {
      this.anonymousCarts.set(sessionId, {
        items: [],
        total: 0,
        itemCount: 0,
        session_id: sessionId,
      });
    }

    const cart = this.anonymousCarts.get(sessionId)!;
    return this.enrichCartWithProducts(cart);
  }

  private async enrichCartWithProducts(cart: Cart): Promise<Cart> {
    const enrichedItems: CartItem[] = [];
    let total = 0;
    let itemCount = 0;

    for (const item of cart.items) {
      const product = await this.productsRepository.findOne({
        where: { product_id: item.product_id, is_active: true },
        relations: ['category', 'brand', 'images'],
      });

      if (product) {
        const enrichedItem: CartItem = {
          ...item,
          product,
          price: product.price,
        };
        enrichedItems.push(enrichedItem);
        total += product.price * item.quantity;
        itemCount += item.quantity;
      }
    }

    return {
      ...cart,
      items: enrichedItems,
      total,
      itemCount,
    };
  }

  async addToCart(
    addToCartDto: AddToCartDto,
    userId?: number,
    sessionId?: string,
  ): Promise<Cart> {
    const { product_id, quantity } = addToCartDto;

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    // Validate product exists and is active
    const product = await this.productsRepository.findOne({
      where: { product_id, is_active: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${product_id} not found`);
    }

    // Check stock availability
    if (product.stock_quantity < quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${product.stock_quantity}, Requested: ${quantity}`,
      );
    }

    const cartKey = userId ? `user_${userId}` : sessionId!;
    const cart = await this.getCart(userId, sessionId);

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product_id === product_id,
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const existingItem = cart.items[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;

      if (product.stock_quantity < newQuantity) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${product.stock_quantity}, In cart: ${existingItem.quantity}, Requested: ${quantity}`,
        );
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        product_id,
        quantity,
        price: product.price,
      });
    }

    // Update cart in storage
    this.anonymousCarts.set(cartKey, {
      ...cart,
      items: cart.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    return this.enrichCartWithProducts(cart);
  }

  async updateCartItem(
    product_id: number,
    updateCartItemDto: UpdateCartItemDto,
    userId?: number,
    sessionId?: string,
  ): Promise<Cart> {
    const { quantity } = updateCartItemDto;

    if (quantity < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    const cart = await this.getCart(userId, sessionId);
    const itemIndex = cart.items.findIndex(
      (item) => item.product_id === product_id,
    );

    if (itemIndex === -1) {
      throw new NotFoundException(
        `Product with ID ${product_id} not found in cart`,
      );
    }

    const cartKey = userId ? `user_${userId}` : sessionId!;

    if (quantity === 0) {
      // Remove item from cart
      cart.items.splice(itemIndex, 1);
    } else {
      // Validate stock
      const product = await this.productsRepository.findOne({
        where: { product_id, is_active: true },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${product_id} not found`);
      }

      if (product.stock_quantity < quantity) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${product.stock_quantity}, Requested: ${quantity}`,
        );
      }

      cart.items[itemIndex].quantity = quantity;
    }

    // Update cart in storage
    this.anonymousCarts.set(cartKey, {
      ...cart,
      items: cart.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    return this.enrichCartWithProducts(cart);
  }

  async removeFromCart(
    product_id: number,
    userId?: number,
    sessionId?: string,
  ): Promise<Cart> {
    const cart = await this.getCart(userId, sessionId);
    const itemIndex = cart.items.findIndex(
      (item) => item.product_id === product_id,
    );

    if (itemIndex === -1) {
      throw new NotFoundException(
        `Product with ID ${product_id} not found in cart`,
      );
    }

    cart.items.splice(itemIndex, 1);

    const cartKey = userId ? `user_${userId}` : sessionId!;
    this.anonymousCarts.set(cartKey, {
      ...cart,
      items: cart.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    return this.enrichCartWithProducts(cart);
  }

  async clearCart(userId?: number, sessionId?: string): Promise<Cart> {
    const cartKey = userId ? `user_${userId}` : sessionId!;

    const emptyCart: Cart = {
      items: [],
      total: 0,
      itemCount: 0,
      user_id: userId,
      session_id: sessionId,
    };

    this.anonymousCarts.set(cartKey, emptyCart);
    return emptyCart;
  }

  async mergeAnonymousCart(sessionId: string, userId: number): Promise<Cart> {
    const anonymousCart = this.anonymousCarts.get(sessionId);
    if (!anonymousCart || anonymousCart.items.length === 0) {
      return this.getUserCart(userId);
    }

    const userCart = await this.getUserCart(userId);

    // Merge items
    for (const anonymousItem of anonymousCart.items) {
      const existingItemIndex = userCart.items.findIndex(
        (item) => item.product_id === anonymousItem.product_id,
      );

      if (existingItemIndex >= 0) {
        // Merge quantities
        userCart.items[existingItemIndex].quantity += anonymousItem.quantity;
      } else {
        // Add new item
        userCart.items.push(anonymousItem);
      }
    }

    // Save merged cart
    const userCartKey = `user_${userId}`;
    this.anonymousCarts.set(userCartKey, {
      ...userCart,
      items: userCart.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    });

    // Clear anonymous cart
    this.anonymousCarts.delete(sessionId);

    return this.enrichCartWithProducts(userCart);
  }

  async getCartSummary(
    userId?: number,
    sessionId?: string,
  ): Promise<{
    itemCount: number;
    total: number;
  }> {
    const cart = await this.getCart(userId, sessionId);
    return {
      itemCount: cart.itemCount,
      total: cart.total,
    };
  }
}
