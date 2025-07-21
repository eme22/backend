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
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Product } from '../../entities/product.entity';
import { ProductImage } from '../../entities/product-image.entity';
import { UserRole } from '../../entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully.' })
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
    name: 'category_id',
    required: false,
    type: Number,
    description: 'Filter by category ID',
  })
  @ApiQuery({
    name: 'brand_id',
    required: false,
    type: Number,
    description: 'Filter by brand ID',
  })
  @ApiQuery({
    name: 'min_price',
    required: false,
    type: Number,
    description: 'Minimum price filter',
  })
  @ApiQuery({
    name: 'max_price',
    required: false,
    type: Number,
    description: 'Maximum price filter',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search in name and description',
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('category_id') category_id?: number,
    @Query('brand_id') brand_id?: number,
    @Query('min_price') min_price?: number,
    @Query('max_price') max_price?: number,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll(
      page,
      limit,
      category_id,
      brand_id,
      min_price,
      max_price,
      search,
    );
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiResponse({
    status: 200,
    description: 'Products by category retrieved successfully.',
  })
  findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.productsService.findByCategory(categoryId);
  }

  @Get('brand/:brandId')
  @ApiOperation({ summary: 'Get products by brand' })
  @ApiResponse({
    status: 200,
    description: 'Products by brand retrieved successfully.',
  })
  findByBrand(@Param('brandId', ParseIntPipe) brandId: number) {
    return this.productsService.findByBrand(brandId);
  }

  @Get('offers')
  @ApiOperation({
    summary: 'Get products on offer with pagination and filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Products on offer retrieved successfully.',
  })
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
    name: 'category_id',
    required: false,
    type: Number,
    description: 'Filter by category ID',
  })
  @ApiQuery({
    name: 'brand_id',
    required: false,
    type: Number,
    description: 'Filter by brand ID',
  })
  @ApiQuery({
    name: 'min_price',
    required: false,
    type: Number,
    description: 'Minimum price filter',
  })
  @ApiQuery({
    name: 'max_price',
    required: false,
    type: Number,
    description: 'Maximum price filter',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search in name and description',
  })
  findOnOffer(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('category_id') category_id?: number,
    @Query('brand_id') brand_id?: number,
    @Query('min_price') min_price?: number,
    @Query('max_price') max_price?: number,
    @Query('search') search?: string,
  ) {
    return this.productsService.findOnOffer(
      page,
      limit,
      category_id,
      brand_id,
      min_price,
      max_price,
      search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body(ValidationPipe) createProductDto: Partial<Product>) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProductDto: Partial<Product>,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product (soft delete)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add image to product' })
  @ApiResponse({ status: 201, description: 'Image added successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  addImage(
    @Param('id', ParseIntPipe) productId: number,
    @Body(ValidationPipe) imageData: Partial<ProductImage>,
  ) {
    return this.productsService.addImage(productId, imageData);
  }

  @Delete('images/:imageId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove image from product' })
  @ApiResponse({ status: 200, description: 'Image removed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Image not found.' })
  removeImage(@Param('imageId', ParseIntPipe) imageId: number) {
    return this.productsService.removeImage(imageId);
  }

  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product stock' })
  @ApiResponse({ status: 200, description: 'Stock updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.productsService.updateStock(id, quantity);
  }
}
