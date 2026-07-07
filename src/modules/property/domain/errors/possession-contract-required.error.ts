import { DomainError } from '../../../../shared/domain/exceptions/domain.error';
import { PossessionType } from '../enums/possession-type.enum';

export class PossessionContractRequiredError extends DomainError {
  constructor(possessionType: PossessionType) {
    super(
      `PossessionContract is required for properties with possession type "${possessionType}".`,
    );
  }
}
