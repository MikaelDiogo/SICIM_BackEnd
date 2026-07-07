import { DomainError } from '../../../../shared/domain/exceptions/domain.error';

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class InvalidEmailError extends DomainError {
  constructor(value: string) {
    super(`Invalid email: "${value}".`);
  }
}

export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): Email {
    const normalized = value.trim().toLowerCase();
    if (!EMAIL_FORMAT.test(normalized)) {
      throw new InvalidEmailError(value);
    }
    return new Email(normalized);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
