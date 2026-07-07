import { DomainError } from '../../../../shared/domain/exceptions/domain.error';

// Formato: MAT-AAAA-NNNNN (ex: MAT-2024-00001)
const FORMATO = /^MAT-\d{4}-\d{5}$/;

export class MatriculaInvalidaError extends DomainError {
  constructor(valor: string) {
    super(`Matrícula inválida: "${valor}". Use o formato MAT-AAAA-NNNNN.`);
  }
}

export class Matricula {
  private readonly _valor: string;

  private constructor(valor: string) {
    this._valor = valor;
  }

  static criar(valor: string): Matricula {
    const normalizado = valor.trim().toUpperCase();
    if (!FORMATO.test(normalizado)) {
      throw new MatriculaInvalidaError(valor);
    }
    return new Matricula(normalizado);
  }

  get valor(): string {
    return this._valor;
  }

  equals(outro: Matricula): boolean {
    return this._valor === outro._valor;
  }

  toString(): string {
    return this._valor;
  }
}
