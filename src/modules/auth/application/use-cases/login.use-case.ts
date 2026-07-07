import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../user/domain/entities/user.entity';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../../user/domain/repositories/user.repository';
import type { IPasswordHasher } from '../../../user/domain/services/password-hasher';
import { PASSWORD_HASHER } from '../../../user/domain/services/password-hasher';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { LoginDto } from '../dto/login.dto';

export interface LoginResult {
  accessToken: string;
  user: User;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(dto.email.trim().toLowerCase());
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await this.passwordHasher.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    const accessToken = await this.jwtService.signAsync({ sub: user.id, role: user.role });

    return { accessToken, user };
  }
}
