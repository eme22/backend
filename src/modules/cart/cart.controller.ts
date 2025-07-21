import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Headers,
  ParseIntPipe,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { CartService, AddToCartDto, UpdateCartItemDto } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  private getSessionId(headers: any): string {
    let sessionId = headers['x-session-id'];
    if (!sessionId) {
      sessionId = uuidv4();
    }
    return sessionId;
  }

  @Get()
  @ApiOperation({ summary: 'Get cart contents' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully.' })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for anonymous users',
    required: false,
  })
  @ApiBearerAuth()
  async getCart(@Request() req: any, @Headers() headers: any) {
    const userId = req.user?.user_id || req.user?.userId || undefined;
    const sessionId = userId ? undefined : this.getSessionId(headers);
    
    return this.cartService.getCart(userId, sessionId);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get cart summary (item count and total)' })
  @ApiResponse({ status: 200, description: 'Cart summary retrieved successfully.' })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for anonymous users',
    required: false,
  })
  @ApiBearerAuth()
  async getCartSummary(@Request() req: any, @Headers() headers: any) {
    const userId = req.user?.user_id || req.user?.userId || undefined;
    console.log('User ID from request:', req);
    console.log('User ID from request:', userId);
    const sessionId = userId ? undefined : this.getSessionId(headers);
    
    return this.cartService.getCartSummary(userId, sessionId);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for anonymous users',
    required: false,
  })
  @ApiBearerAuth()
  async addToCart(
    @Body(ValidationPipe) addToCartDto: AddToCartDto,
    @Request() req: any,
    @Headers() headers: any,
  ) {
    const userId = req.user?.user_id || req.user?.userId || undefined;
        console.log('User ID from request:', req);

        console.log('User ID from request:', userId);
    const sessionId = userId ? undefined : this.getSessionId(headers);
    
    return this.cartService.addToCart(addToCartDto, userId, sessionId);
  }

  @Patch('item/:productId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Product not found in cart.' })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for anonymous users',
    required: false,
  })
  @ApiBearerAuth()
  async updateCartItem(
    @Param('productId', ParseIntPipe) productId: number,
    @Body(ValidationPipe) updateCartItemDto: UpdateCartItemDto,
    @Request() req: any,
    @Headers() headers: any,
  ) {
    const userId = req.user?.user_id || req.user?.userId || undefined;
        console.log('User ID from request:', userId);
    console.log('Headers:', headers);
    const sessionId = userId ? undefined : this.getSessionId(headers);
    
    return this.cartService.updateCartItem(productId, updateCartItemDto, userId, sessionId);
  }

  @Delete('item/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed from cart successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found in cart.' })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for anonymous users',
    required: false,
  })
  @ApiBearerAuth()
  async removeFromCart(
    @Param('productId', ParseIntPipe) productId: number,
    @Request() req: any,
    @Headers() headers: any,
  ) {
    const userId = req.user?.user_id || req.user?.userId || undefined;
        console.log('User ID from request:', userId);
    console.log('Headers:', headers);
    const sessionId = userId ? undefined : this.getSessionId(headers);
    
    return this.cartService.removeFromCart(productId, userId, sessionId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully.' })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for anonymous users',
    required: false,
  })
  @ApiBearerAuth()
  async clearCart(@Request() req: any, @Headers() headers: any) {
    const userId = req.user?.user_id || req.user?.userId || undefined;
    const sessionId = userId ? undefined : this.getSessionId(headers);
    
    return this.cartService.clearCart(userId, sessionId);
  }

  @Post('merge')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Merge anonymous cart with user cart after login' })
  @ApiResponse({ status: 200, description: 'Cart merged successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiHeader({
    name: 'x-session-id',
    description: 'Session ID for anonymous cart to merge',
    required: true,
  })
  async mergeCart(@Request() req: any, @Headers() headers: any) {
    const userId = req.user.user_id || req.user.userId || undefined;
    const sessionId = headers['x-session-id'];
    
    if (!sessionId) {
      return this.cartService.getCart(userId);
    }
    
    return this.cartService.mergeAnonymousCart(sessionId, userId);
  }
}
