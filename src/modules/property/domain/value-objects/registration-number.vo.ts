import { DomainError } from '../../../../shared/domain/exceptions/domain.error';

// Format: MAT-YYYY-NNNNN (e.g. MAT-2024-00001)
const FORMAT = /^MAT-\d{4}-\d{5}$/;

export class InvalidRegistrationNumberError extends DomainError {
  constructor(value: string) {
    super(`Invalid registration number: "${value}". Use the format MAT-YYYY-NNNNN.`);
  }
}

export class RegistrationNumber {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): RegistrationNumber {
    const normalized = value.trim().toUpperCase();
    if (!FORMAT.test(normalized)) {
      throw new InvalidRegistrationNumberError(value);
    }
    return new RegistrationNumber(normalized);
  }

  get value(): string {
    return this._value;
  }

  equals(other: RegistrationNumber): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
