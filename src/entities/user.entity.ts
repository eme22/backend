import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  VENDOR = 'vendor',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn()
  user_id: number;

  @ApiProperty({ description: 'The username of the user' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: 'The password of the user', writeOnly: true })
  @Column()
  password: string;

  @ApiProperty({ description: 'The email of the user' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'The first name of the user' })
  @Column({ nullable: true })
  first_name: string;

  @ApiProperty({ description: 'The last name of the user' })
  @Column({ nullable: true })
  last_name: string;

  @ApiProperty({ description: 'The phone number of the user', nullable: true })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({ description: 'The address of the user', nullable: true })
  @Column({ nullable: true })
  address: string;

  @ApiProperty({ description: 'The role of the user', enum: UserRole })
  @Column({ 
    type: 'text', // Use 'text' for cross-database compatibility
    enum: UserRole, 
    default: UserRole.CUSTOMER 
  })
  role: UserRole;

  @ApiProperty({ description: 'The date when the user was created' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'The date when the user was last updated' })
  @UpdateDateColumn()
  updated_at: Date;
}
