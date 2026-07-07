import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { Role } from '../../../modules/user/domain/enums/role.enum';
import { RegisterUserUseCase } from '../../../modules/user/application/use-cases/register-user.use-case';
import { DuplicateEmailError } from '../../../modules/user/domain/errors/duplicate-email.error';

// Bootstraps the first ADMINISTRATION user so the API can be used at all —
// registering a user requires an ADMINISTRATION token, which nothing can hold on a fresh database.
async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@crateus.ce.gov.br';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'changeme123';

  const app = await NestFactory.createApplicationContext(AppModule);
  const registerUserUseCase = app.get(RegisterUserUseCase);

  try {
    await registerUserUseCase.execute({
      name: 'Administrator',
      employeeNumber: '0000',
      email,
      password,
      role: Role.ADMINISTRATION,
    });
    console.log(`Seeded admin user: ${email}`);
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      console.log(`Admin user already exists: ${email}`);
    } else {
      throw error;
    }
  } finally {
    await app.close();
  }
}

seedAdmin();
