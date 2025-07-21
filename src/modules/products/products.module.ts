import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { ProductImage } from '../../entities/product-image.entity';
import { Review } from '../../entities/review.entity';
import { Brand } from '../../entities/brand.entity';
import { Category } from '../../entities/category.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage, Review, Brand, Category]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [TypeOrmModule, ProductsService],
})
export class ProductsModule {}
