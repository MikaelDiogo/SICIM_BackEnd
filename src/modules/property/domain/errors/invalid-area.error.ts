import { DomainError } from '../../../../shared/domain/exceptions/domain.error';

export class InvalidAreaError extends DomainError {
  constructor(builtArea: number, totalArea: number) {
    super(
      `Built area (${builtArea} m²) cannot be greater than total area (${totalArea} m²).`,
    );
  }
}
