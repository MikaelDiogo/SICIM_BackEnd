import { DomainError, DomainErrorType } from '../../../../shared/domain/exceptions/domain.error';

export class DuplicateAcronymError extends DomainError {
  constructor(acronym: string) {
    super(
      `A managing unit with acronym "${acronym}" already exists.`,
      DomainErrorType.CONFLICT,
    );
  }
}
