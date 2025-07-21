import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Category } from '../../entities/category.entity';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';
import { UserRole } from 'src/entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';

export class DashboardResponse {
  users: number;
  products: number;
  orders: number;
  categories: number;
}

export class RecentActivityResponse {
  id: number;
  name: string;
  type: string;
  message: string;
  created_at: Date;
  status: string;
}

@ApiTags('dashboard')
@Controller('dashboard')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
export class DashboardController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns dashboard statistics',
    type: [DashboardResponse],
  })
  getStats(): Promise<DashboardResponse> {
    const totalProducts = this.productsService.count();
    const totalUsers = this.usersService.count();
    const totalOrders = this.ordersService.count();
    const totalCategories = this.categoriesService.count();
    return Promise.all([
      totalProducts,
      totalUsers,
      totalOrders,
      totalCategories,
    ]).then(([products, users, orders, categories]) => ({
      products: products,
      users: users,
      orders: orders,
      categories: categories,
    }));
  }

  @Get('activity')
  @ApiOperation({ summary: 'Get recent activity' })
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'Return recent activity',
    type: [Category],
  })
  getRecentActivity(): Promise<RecentActivityResponse[]> {
    return Promise.resolve([
      {
        id: 1,
        name: 'Product A',
        type: 'product',
        message: 'Product A was added.',
        created_at: new Date(),
        status: 'active',
      },
      {
        id: 2,
        name: 'User B',
        type: 'user',
        message: 'User B registered.',
        created_at: new Date(),
        status: 'active',
      },
    ]);
  }
}
