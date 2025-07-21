import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { OrdersService, CreateOrderDto } from './orders.service';
import { Order } from '../../entities/order.entity';
import { UserRole } from '../../entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: Number,
    description: 'Filter by user ID',
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('userId') userId?: number,
  ) {
    return this.ordersService.findAll(page, limit, userId);
  }

  @Get('my-orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user orders' })
  @ApiResponse({
    status: 200,
    description: 'User orders retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findMyOrders(@Request() req: any) {
    return this.ordersService.getUserOrders(req.user.userId);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order statistics (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Order statistics retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getStats() {
    return this.ordersService.getOrderStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const userId =
      req.user.role === UserRole.ADMIN ? undefined : req.user.userId;
    return this.ordersService.findOne(id, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  create(
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
    @Request() req: any,
  ) {
    return this.ordersService.create({
      ...createOrderDto,
      user_id: req.user.userId,
    });
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.ordersService.updateStatus(id, status);
  }

  @Patch(':id/payment-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order payment status (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Payment status updated successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  updatePaymentStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('paymentStatus') paymentStatus: string,
  ) {
    return this.ordersService.updatePaymentStatus(id, paymentStatus);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully.' })
  @ApiResponse({ status: 400, description: 'Cannot cancel order.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  cancel(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    const userId =
      req.user.role === UserRole.ADMIN ? undefined : req.user.userId;
    return this.ordersService.cancel(id, userId);
  }
}
