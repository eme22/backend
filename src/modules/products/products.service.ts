import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { ProductImage } from '../../entities/product-image.entity';
import { Brand } from '../../entities/brand.entity';
import { Category } from '../../entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImagesRepository: Repository<ProductImage>,
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    category_id?: number,
    brand_id?: number,
    min_price?: number,
    max_price?: number,
    search?: string,
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.reviews', 'reviews')
      .where('product.is_active = :is_active', { is_active: true });

    if (category_id) {
      queryBuilder.andWhere('product.category_id = :category_id', {
        category_id,
      });
    }

    if (brand_id) {
      queryBuilder.andWhere('product.brand_id = :brand_id', { brand_id });
    }

    if (min_price !== undefined) {
      queryBuilder.andWhere('product.price >= :min_price', { min_price });
    }

    if (max_price !== undefined) {
      queryBuilder.andWhere('product.price <= :max_price', { max_price });
    }

    if (search) {
      queryBuilder.andWhere(
        '(product.name LIKE :search OR product.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const total = await queryBuilder.getCount();
    const products = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('product.created_at', 'DESC')
      .getMany();

    return {
      products,
      total,
      page,
      limit,
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { product_id: id, is_active: true },
      relations: ['category', 'brand', 'images', 'reviews', 'reviews.user'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(productData: Partial<Product>): Promise<Product> {
    // Validate category exists
    if (productData.category_id) {
      const category = await this.categoriesRepository.findOne({
        where: { category_id: productData.category_id },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${productData.category_id} not found`,
        );
      }
    }

    // Validate brand exists
    if (productData.brand_id) {
      const brand = await this.brandsRepository.findOne({
        where: { brand_id: productData.brand_id },
      });
      if (!brand) {
        throw new NotFoundException(
          `Brand with ID ${productData.brand_id} not found`,
        );
      }
    }

    const product = this.productsRepository.create({
      ...productData,
      is_active: true,
    });

    return this.productsRepository.save(product);
  }

  async update(id: number, productData: Partial<Product>): Promise<Product> {
    const product = await this.findOne(id);

    // Validate category exists if updating
    if (
      productData.category_id &&
      productData.category_id !== product.category_id
    ) {
      const category = await this.categoriesRepository.findOne({
        where: { category_id: productData.category_id },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${productData.category_id} not found`,
        );
      }
    }

    // Validate brand exists if updating
    if (productData.brand_id && productData.brand_id !== product.brand_id) {
      const brand = await this.brandsRepository.findOne({
        where: { brand_id: productData.brand_id },
      });
      if (!brand) {
        throw new NotFoundException(
          `Brand with ID ${productData.brand_id} not found`,
        );
      }
    }

    Object.assign(product, productData);
    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    // Soft delete - set is_active to false
    product.is_active = false;
    await this.productsRepository.save(product);
  }

  async addImage(
    productId: number,
    imageData: Partial<ProductImage>,
  ): Promise<ProductImage> {
    const product = await this.findOne(productId);

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const image = this.productImagesRepository.create({
      ...imageData,
      product_id: productId,
    });

    return this.productImagesRepository.save(image);
  }

  async removeImage(imageId: number): Promise<void> {
    const image = await this.productImagesRepository.findOne({
      where: { image_id: imageId },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    await this.productImagesRepository.remove(image);
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.productsRepository.find({
      where: { category_id: categoryId, is_active: true },
      relations: ['category', 'brand', 'images'],
    });
  }

  async findByBrand(brandId: number): Promise<Product[]> {
    return this.productsRepository.find({
      where: { brand_id: brandId, is_active: true },
      relations: ['category', 'brand', 'images'],
    });
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stock_quantity = quantity;
    return this.productsRepository.save(product);
  }

  async decreaseStock(id: number, quantity: number): Promise<Product> {
    const product = await this.findOne(id);

    if (product.stock_quantity < quantity) {
      throw new Error(
        `Insufficient stock. Available: ${product.stock_quantity}, Requested: ${quantity}`,
      );
    }

    product.stock_quantity -= quantity;
    return this.productsRepository.save(product);
  }

  async findOnOffer(
    page: number = 1,
    limit: number = 10,
    category_id?: number,
    brand_id?: number,
    min_price?: number,
    max_price?: number,
    search?: string,
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.reviews', 'reviews')
      .where('product.is_active = :is_active', { is_active: true })
      .andWhere('product.offer = :offer', { offer: true });

    if (category_id) {
      queryBuilder.andWhere('product.category_id = :category_id', {
        category_id,
      });
    }

    if (brand_id) {
      queryBuilder.andWhere('product.brand_id = :brand_id', { brand_id });
    }

    if (min_price !== undefined) {
      queryBuilder.andWhere('product.price >= :min_price', { min_price });
    }

    if (max_price !== undefined) {
      queryBuilder.andWhere('product.price <= :max_price', { max_price });
    }

    if (search) {
      queryBuilder.andWhere(
        '(product.name LIKE :search OR product.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const total = await queryBuilder.getCount();
    const products = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('product.created_at', 'DESC')
      .getMany();

    return {
      products,
      total,
      page,
      limit,
    };
  }

  async count(): Promise<number> {
    return this.productsRepository.count({ where: { is_active: true } });
  }
}
