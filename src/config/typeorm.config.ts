import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Address } from '../entities/address.entity';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';
import { Product } from '../entities/product.entity';
import { ProductImage } from '../entities/product-image.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Payment } from '../entities/payment.entity';
import { Review } from '../entities/review.entity';
import { RefreshToken } from '../entities/refresh-token.entity';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: (process.env.DB_TYPE as any) || 'sqljs',
  location: './db.sqlite',
  autoSave: true,
  entities: [
    User,
    Address,
    Category,
    Brand,
    Product,
    ProductImage,
    Order,
    OrderItem,
    Payment,
    Review,
    RefreshToken,
  ],
  synchronize: configService.get('NODE_ENV') !== 'production',
  //  logging: configService.get('NODE_ENV') !== 'production',
});
