import {
  Injectable,
  NotFoundException,
  ConflictException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ user_id: id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ username });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async create(userData: Partial<User>): Promise<User> {
    // Check if user with the same email or username already exists
    const existingUser = await this.usersRepository.findOne({
      where: [{ username: userData.username }, { email: userData.email }],
    });

    if (existingUser) {
      throw new ConflictException(
        `User with username ${userData.username} or email ${userData.email} already exists`,
      );
    }

    // Hash password
    if (userData.password) {
      const salt = await bcrypt.genSalt();
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    // Set default role if not provided
    if (!userData.role) {
      userData.role = UserRole.CUSTOMER;
    }

    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.findOne(id);

    // Hash password if it's being updated
    if (userData.password) {
      const salt = await bcrypt.genSalt();
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    Object.assign(user, userData);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async count(): Promise<number> {
    return this.usersRepository.count();
  }

  onApplicationBootstrap() {
    this.usersRepository
      .findOne({
        where: {
          username: 'admin',
          role: UserRole.ADMIN,
        },
      })
      .then((admin) => {
        if (!admin) {
          // Create a default admin user if none exists
          const defaultAdmin: Partial<User> = {
            username: 'admin',
            password: 'admin',
            email: 'admin@gmail.com',
            role: UserRole.ADMIN,
          };

          return this.create(defaultAdmin);
        }
      })
      .catch((error) => {
        console.error('Error ensuring default admin user:', error);
      });
  }
}
