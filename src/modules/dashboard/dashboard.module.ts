import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { OrdersModule } from '../orders/orders.module';
import { UsersModule } from '../users/users.module';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [OrdersModule, UsersModule, CategoriesModule, ProductsModule],
  controllers: [DashboardController],
  providers: [],
  exports: [],
})
export class DashboardModule {}
