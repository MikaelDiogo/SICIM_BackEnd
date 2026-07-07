import { DomainError, DomainErrorType } from '../../../../shared/domain/exceptions/domain.error';

export class DuplicateRegistrationNumberError extends DomainError {
  constructor(registrationNumber: string) {
    super(
      `A property with registration number "${registrationNumber}" already exists.`,
      DomainErrorType.CONFLICT,
    );
  }
}
