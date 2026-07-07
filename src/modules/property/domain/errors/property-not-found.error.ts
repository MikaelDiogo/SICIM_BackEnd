import { DomainError, DomainErrorType } from '../../../../shared/domain/exceptions/domain.error';

export class PropertyNotFoundError extends DomainError {
  constructor(id: string) {
    super(`No property found with id "${id}".`, DomainErrorType.NOT_FOUND);
  }
}
