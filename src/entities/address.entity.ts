import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity('addresses')
export class Address {
  @ApiProperty({ description: 'The unique identifier of the address' })
  @PrimaryGeneratedColumn()
  address_id: number;

  @ApiProperty({ description: 'The user associated with this address' })
  @Column({ nullable: false })
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'The first line of the address' })
  @Column()
  address_line1: string;

  @ApiProperty({ description: 'The second line of the address (optional)' })
  @Column({ nullable: true })
  address_line2: string;

  @ApiProperty({ description: 'The city of the address' })
  @Column()
  city: string;

  @ApiProperty({ description: 'The state/province of the address (optional)' })
  @Column({ nullable: true })
  state: string;

  @ApiProperty({ description: 'The country of the address' })
  @Column()
  country: string;

  @ApiProperty({ description: 'The postal code of the address' })
  @Column()
  postal_code: string;

  @ApiProperty({
    description: 'The phone number associated with this address (optional)',
  })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({
    description: 'Whether this is the default address for the user',
  })
  @Column({ default: false })
  is_default: boolean;

  @ApiProperty({ description: 'The date when the address was created' })
  @CreateDateColumn()
  created_at: Date;
}
