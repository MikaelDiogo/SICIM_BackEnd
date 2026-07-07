import { DomainError, DomainErrorType } from '../../../../shared/domain/exceptions/domain.error';

export class DuplicateEmailError extends DomainError {
  constructor(email: string) {
    super(`A user with email "${email}" already exists.`, DomainErrorType.CONFLICT);
  }
}
