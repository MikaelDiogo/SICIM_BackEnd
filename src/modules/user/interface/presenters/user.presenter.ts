import { User } from '../../domain/entities/user.entity';

export class UserPresenter {
  static toHttp(user: User) {
    return {
      id: user.id,
      name: user.name,
      employeeNumber: user.employeeNumber,
      email: user.email.value,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
