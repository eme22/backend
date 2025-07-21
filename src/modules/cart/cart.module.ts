import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { User } from '../../entities/user.entity';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, User]),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
