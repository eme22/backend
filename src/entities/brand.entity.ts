import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('brands')
export class Brand {
  @ApiProperty({ description: 'The unique identifier of the brand' })
  @PrimaryGeneratedColumn()
  brand_id: number;

  @ApiProperty({ description: 'The name of the brand' })
  @Column()
  name: string;

  @ApiProperty({ description: 'The description of the brand' })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({ description: 'The date when the brand was created' })
  @CreateDateColumn()
  created_at: Date;
}
