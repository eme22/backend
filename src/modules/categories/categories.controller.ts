import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Category } from '../../entities/category.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Return all categories',
    type: [Category],
  })
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get('root')
  @ApiOperation({ summary: 'Get root categories (no parent)' })
  @ApiResponse({
    status: 200,
    description: 'Return root categories',
    type: [Category],
  })
  findRootCategories(): Promise<Category[]> {
    return this.categoriesService.findRootCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the category',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findOne(+id);
  }

  @Get(':id/subcategories')
  @ApiOperation({ summary: 'Get subcategories of a category' })
  @ApiResponse({
    status: 200,
    description: 'Return subcategories',
    type: [Category],
  })
  findSubcategories(@Param('id') id: string): Promise<Category[]> {
    return this.categoriesService.findSubcategories(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({
    status: 201,
    description: 'The category has been created',
    type: Category,
  })
  create(@Body() createCategoryDto: Partial<Category>): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({
    status: 200,
    description: 'The category has been updated',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: Partial<Category>,
  ): Promise<Category> {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: 'The category has been deleted' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.categoriesService.remove(+id);
  }
}
