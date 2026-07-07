import { UsageCategory } from '../enums/usage-category.enum';
import { PropertyStatus } from '../enums/property-status.enum';
import { PossessionType } from '../enums/possession-type.enum';
import { InvalidAreaError } from '../errors/invalid-area.error';
import { PossessionContractRequiredError } from '../errors/possession-contract-required.error';
import { Address } from '../value-objects/address.vo';
import { Geolocation } from '../value-objects/geolocation.vo';
import { RegistrationNumber } from '../value-objects/registration-number.vo';
import { MonetaryValue } from '../value-objects/monetary-value.vo';
import { PossessionContract } from './possession-contract.entity';

const POSSESSION_TYPES_WITH_CONTRACT = [
  PossessionType.RENTED,
  PossessionType.GRANTED,
  PossessionType.LOAN,
  PossessionType.USUFRUCT,
  PossessionType.USE_PERMIT,
];

export interface PropertyProps {
  id: string;
  registrationNumber: RegistrationNumber;
  notaryOffice: string;
  notarialDescription: string;
  address: Address;
  totalArea: number;
  builtArea: number;
  geolocation: Geolocation;
  managingUnitId: string;
  budgetUnit?: string;
  usageCategory: UsageCategory;
  possessionType: PossessionType;
  possessionContract?: PossessionContract;
  acquisitionYear: number;
  originalValue: MonetaryValue;
  accumulatedDepreciation: MonetaryValue;
  publicPurpose: string;
  status: PropertyStatus;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Property {
  readonly id: string;
  readonly registrationNumber: RegistrationNumber;
  readonly notaryOffice: string;
  readonly notarialDescription: string;
  readonly address: Address;
  readonly totalArea: number;
  readonly builtArea: number;
  readonly geolocation: Geolocation;
  readonly managingUnitId: string;
  readonly budgetUnit?: string;
  readonly usageCategory: UsageCategory;
  readonly possessionType: PossessionType;
  readonly possessionContract?: PossessionContract;
  readonly acquisitionYear: number;
  readonly originalValue: MonetaryValue;
  readonly accumulatedDepreciation: MonetaryValue;
  readonly publicPurpose: string;
  readonly status: PropertyStatus;
  readonly createdById: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: PropertyProps) {
    this.id = props.id;
    this.registrationNumber = props.registrationNumber;
    this.notaryOffice = props.notaryOffice;
    this.notarialDescription = props.notarialDescription;
    this.address = props.address;
    this.totalArea = props.totalArea;
    this.builtArea = props.builtArea;
    this.geolocation = props.geolocation;
    this.managingUnitId = props.managingUnitId;
    this.budgetUnit = props.budgetUnit;
    this.usageCategory = props.usageCategory;
    this.possessionType = props.possessionType;
    this.possessionContract = props.possessionContract;
    this.acquisitionYear = props.acquisitionYear;
    this.originalValue = props.originalValue;
    this.accumulatedDepreciation = props.accumulatedDepreciation;
    this.publicPurpose = props.publicPurpose;
    this.status = props.status;
    this.createdById = props.createdById;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: Omit<PropertyProps, 'status' | 'accumulatedDepreciation' | 'createdAt' | 'updatedAt'>): Property {
    if (props.builtArea > props.totalArea) {
      throw new InvalidAreaError(props.builtArea, props.totalArea);
    }

    const needsContract = POSSESSION_TYPES_WITH_CONTRACT.includes(props.possessionType);
    if (needsContract && !props.possessionContract) {
      throw new PossessionContractRequiredError(props.possessionType);
    }

    const now = new Date();

    return new Property({
      ...props,
      accumulatedDepreciation: MonetaryValue.zero(),
      status: PropertyStatus.PENDING_APPROVAL,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Reconstitutes the entity from persisted data (does not apply creation invariants)
  static reconstitute(props: PropertyProps): Property {
    return new Property(props);
  }

  get netBookValue(): MonetaryValue {
    return this.originalValue.subtract(this.accumulatedDepreciation);
  }

  approve(approvedById: string): Property {
    return Property.reconstitute({
      ...this.toProps(),
      status: PropertyStatus.APPROVED,
      updatedAt: new Date(),
    });
  }

  deactivate(): Property {
    return Property.reconstitute({
      ...this.toProps(),
      status: PropertyStatus.INACTIVE,
      updatedAt: new Date(),
    });
  }

  private toProps(): PropertyProps {
    return {
      id: this.id,
      registrationNumber: this.registrationNumber,
      notaryOffice: this.notaryOffice,
      notarialDescription: this.notarialDescription,
      address: this.address,
      totalArea: this.totalArea,
      builtArea: this.builtArea,
      geolocation: this.geolocation,
      managingUnitId: this.managingUnitId,
      budgetUnit: this.budgetUnit,
      usageCategory: this.usageCategory,
      possessionType: this.possessionType,
      possessionContract: this.possessionContract,
      acquisitionYear: this.acquisitionYear,
      originalValue: this.originalValue,
      accumulatedDepreciation: this.accumulatedDepreciation,
      publicPurpose: this.publicPurpose,
      status: this.status,
      createdById: this.createdById,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
