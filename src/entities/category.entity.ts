import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('categories')
export class Category {
  @ApiProperty({ description: 'The unique identifier of the category' })
  @PrimaryGeneratedColumn()
  category_id: number;

  @ApiProperty({ description: 'The name of the category' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The image URL of the category' })
  @Column({ nullable: true })
  image_url: string;

  @ApiProperty({ description: 'The description of the category' })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({ description: 'The ID of the parent category (if any)' })
  @Column({ nullable: true })
  parent_category_id: number;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'parent_category_id' })
  parent_category: Category;

  @OneToMany(() => Category, (category) => category.parent_category)
  subcategories: Category[];

  @ApiProperty({ description: 'The date when the category was created' })
  @CreateDateColumn()
  created_at: Date;
}
