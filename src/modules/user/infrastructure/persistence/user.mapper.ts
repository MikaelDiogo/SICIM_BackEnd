import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { UserOrmEntity } from './user.orm-entity';

export class UserMapper {
  static toDomain(orm: UserOrmEntity): User {
    return User.reconstitute({
      id: orm.id,
      name: orm.name,
      employeeNumber: orm.employeeNumber,
      email: Email.create(orm.email),
      passwordHash: orm.passwordHash,
      role: orm.role,
      createdAt: orm.createdAt,
    });
  }

  static toPersistence(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = user.id;
    orm.name = user.name;
    orm.employeeNumber = user.employeeNumber;
    orm.email = user.email.value;
    orm.passwordHash = user.passwordHash;
    orm.role = user.role;
    orm.createdAt = user.createdAt;
    return orm;
  }
}
