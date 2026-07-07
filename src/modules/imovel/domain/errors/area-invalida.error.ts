import { DomainError } from '../../../../shared/domain/exceptions/domain.error';

export class AreaInvalidaError extends DomainError {
  constructor(areaConstruida: number, areaTotal: number) {
    super(
      `Área construída (${areaConstruida} m²) não pode ser maior que a área total (${areaTotal} m²).`,
    );
  }
}
