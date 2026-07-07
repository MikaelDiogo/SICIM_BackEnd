import { DomainError, DomainErrorType } from '../../../../shared/domain/exceptions/domain.error';

export class ManagingUnitNotFoundError extends DomainError {
  constructor(id: string) {
    super(`No managing unit found with id "${id}".`, DomainErrorType.NOT_FOUND);
  }
}
