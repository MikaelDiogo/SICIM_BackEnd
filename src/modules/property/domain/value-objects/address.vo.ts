import { DomainError } from '../../../../shared/domain/exceptions/domain.error';

const ZIP_CODE_FORMAT = /^\d{5}-?\d{3}$/;

export class InvalidZipCodeError extends DomainError {
  constructor(zipCode: string) {
    super(`Invalid zip code: "${zipCode}". Use the format NNNNN-NNN.`);
  }
}

export interface AddressProps {
  street: string;
  number: string;
  neighborhood: string;
  zipCode: string;
  reference?: string;
}

export class Address {
  readonly street: string;
  readonly number: string;
  readonly neighborhood: string;
  readonly zipCode: string;
  readonly reference?: string;

  private constructor(props: AddressProps) {
    this.street = props.street;
    this.number = props.number;
    this.neighborhood = props.neighborhood;
    this.zipCode = props.zipCode;
    this.reference = props.reference;
  }

  static create(props: AddressProps): Address {
    if (!ZIP_CODE_FORMAT.test(props.zipCode)) {
      throw new InvalidZipCodeError(props.zipCode);
    }
    return new Address(props);
  }
}
