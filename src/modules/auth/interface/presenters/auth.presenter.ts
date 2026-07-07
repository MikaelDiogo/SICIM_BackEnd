import { LoginResult } from '../../application/use-cases/login.use-case';

export class AuthPresenter {
  static toHttp(result: LoginResult) {
    return {
      accessToken: result.accessToken,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email.value,
        role: result.user.role,
      },
    };
  }
}
