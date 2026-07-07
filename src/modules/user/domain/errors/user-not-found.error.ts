import { DomainError, DomainErrorType } from '../../../../shared/domain/exceptions/domain.error';

export class UserNotFoundError extends DomainError {
  constructor(id: string) {
    super(`No user found with id "${id}".`, DomainErrorType.NOT_FOUND);
  }
}
