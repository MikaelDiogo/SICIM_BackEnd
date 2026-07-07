import { DomainError, DomainErrorType } from '../../../../shared/domain/exceptions/domain.error';

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super('Invalid email or password.', DomainErrorType.UNAUTHORIZED);
  }
}
