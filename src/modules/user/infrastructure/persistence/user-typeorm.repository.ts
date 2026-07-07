import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { UserMapper } from './user.mapper';
import { UserOrmEntity } from './user.orm-entity';

@Injectable()
export class UserTypeormRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async save(user: User): Promise<User> {
    const saved = await this.repository.save(UserMapper.toPersistence(user));
    return UserMapper.toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const found = await this.repository.findOneBy({ id });
    return found ? UserMapper.toDomain(found) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await this.repository.findOneBy({ email });
    return found ? UserMapper.toDomain(found) : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const total = await this.repository.countBy({ email });
    return total > 0;
  }
}
