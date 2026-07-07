export enum DomainErrorType {
  VALIDATION = 'VALIDATION',
  CONFLICT = 'CONFLICT',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

export abstract class DomainError extends Error {
  readonly type: DomainErrorType;

  constructor(message: string, type: DomainErrorType = DomainErrorType.VALIDATION) {
    super(message);
    this.name = this.constructor.name;
    this.type = type;
  }
}
