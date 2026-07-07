import { DomainError } from '../../../../shared/domain/exceptions/domain.error';
import { TipoPosse } from '../enums/tipo-posse.enum';

export class ContratoPosseObrigatorioError extends DomainError {
  constructor(tipoPosse: TipoPosse) {
    super(
      `ContratoPosse é obrigatório para imóveis com tipo de posse "${tipoPosse}".`,
    );
  }
}
