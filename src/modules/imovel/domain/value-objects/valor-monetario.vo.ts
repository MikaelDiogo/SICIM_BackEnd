import { DomainError } from '../../../../shared/domain/exceptions/domain.error';

export class ValorMonetarioNegativoError extends DomainError {
  constructor(valor: number) {
    super(`Valor monetário não pode ser negativo. Recebido: ${valor}`);
  }
}

export class ValorMonetario {
  private readonly _centavos: number;

  private constructor(centavos: number) {
    this._centavos = centavos;
  }

  static criar(reais: number): ValorMonetario {
    if (reais < 0) {
      throw new ValorMonetarioNegativoError(reais);
    }
    return new ValorMonetario(Math.round(reais * 100));
  }

  static zero(): ValorMonetario {
    return new ValorMonetario(0);
  }

  get reais(): number {
    return this._centavos / 100;
  }

  subtrair(outro: ValorMonetario): ValorMonetario {
    const resultado = this._centavos - outro._centavos;
    // Nunca retorna negativo — regra de negócio do patrimônio público
    return new ValorMonetario(Math.max(0, resultado));
  }

  equals(outro: ValorMonetario): boolean {
    return this._centavos === outro._centavos;
  }

  toString(): string {
    return this.reais.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}
