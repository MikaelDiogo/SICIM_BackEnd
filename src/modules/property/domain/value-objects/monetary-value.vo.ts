import { DomainError } from '../../../../shared/domain/exceptions/domain.error';

export class NegativeMonetaryValueError extends DomainError {
  constructor(value: number) {
    super(`Monetary value cannot be negative. Received: ${value}`);
  }
}

export class MonetaryValue {
  private readonly _cents: number;

  private constructor(cents: number) {
    this._cents = cents;
  }

  static create(amount: number): MonetaryValue {
    if (amount < 0) {
      throw new NegativeMonetaryValueError(amount);
    }
    return new MonetaryValue(Math.round(amount * 100));
  }

  static zero(): MonetaryValue {
    return new MonetaryValue(0);
  }

  get amount(): number {
    return this._cents / 100;
  }

  subtract(other: MonetaryValue): MonetaryValue {
    const result = this._cents - other._cents;
    // Never returns negative — public asset business rule
    return new MonetaryValue(Math.max(0, result));
  }

  equals(other: MonetaryValue): boolean {
    return this._cents === other._cents;
  }

  toString(): string {
    return this.amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}
