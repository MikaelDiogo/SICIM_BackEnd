import { DomainError } from '../../../../shared/domain/exceptions/domain.error';

export class MatriculaDuplicadaError extends DomainError {
  constructor(matricula: string) {
    super(`Já existe um imóvel cadastrado com a matrícula "${matricula}".`);
  }
}
