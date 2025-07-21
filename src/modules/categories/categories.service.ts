import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from '../../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      relations: ['parent_category', 'subcategories'],
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { category_id: id },
      relations: ['parent_category', 'subcategories'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async create(categoryData: Partial<Category>): Promise<Category> {
    const newCategory = this.categoriesRepository.create(categoryData);
    return this.categoriesRepository.save(newCategory);
  }

  async update(id: number, categoryData: Partial<Category>): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, categoryData);
    return this.categoriesRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }

  async findRootCategories(): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { parent_category_id: IsNull() },
      relations: ['subcategories'],
    });
  }

  async findSubcategories(parentId: number): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { parent_category_id: parentId },
      relations: ['subcategories'],
    });
  }

  async count(): Promise<number> {
    return this.categoriesRepository.count();
  }
}
