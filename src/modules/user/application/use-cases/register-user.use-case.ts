import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from '../../domain/entities/user.entity';
import { DuplicateEmailError } from '../../domain/errors/duplicate-email.error';
import type { IUserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { IPasswordHasher } from '../../domain/services/password-hasher';
import { PASSWORD_HASHER } from '../../domain/services/password-hasher';
import { Email } from '../../domain/value-objects/email.vo';
import { RegisterUserDto } from '../dto/register-user.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    const email = Email.create(dto.email);

    const alreadyExists = await this.userRepository.existsByEmail(email.value);
    if (alreadyExists) {
      throw new DuplicateEmailError(email.value);
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);

    const user = User.create({
      id: randomUUID(),
      name: dto.name,
      employeeNumber: dto.employeeNumber,
      email,
      passwordHash,
      role: dto.role,
    });

    return this.userRepository.save(user);
  }
}
