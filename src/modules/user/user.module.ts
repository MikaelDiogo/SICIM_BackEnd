import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { PASSWORD_HASHER } from './domain/services/password-hasher';
import { UserTypeormRepository } from './infrastructure/persistence/user-typeorm.repository';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt-password-hasher';
import { UserController } from './interface/controllers/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UserController],
  providers: [
    RegisterUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeormRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
  ],
  exports: [USER_REPOSITORY, PASSWORD_HASHER],
})
export class UserModule {}
