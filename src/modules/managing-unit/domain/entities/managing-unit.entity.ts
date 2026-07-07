import { ManagingUnitType } from '../enums/managing-unit-type.enum';

export interface ManagingUnitProps {
  id: string;
  name: string;
  acronym: string;
  type: ManagingUnitType;
  createdAt: Date;
}

export class ManagingUnit {
  readonly id: string;
  readonly name: string;
  readonly acronym: string;
  readonly type: ManagingUnitType;
  readonly createdAt: Date;

  private constructor(props: ManagingUnitProps) {
    this.id = props.id;
    this.name = props.name;
    this.acronym = props.acronym;
    this.type = props.type;
    this.createdAt = props.createdAt;
  }

  static create(props: Omit<ManagingUnitProps, 'createdAt'>): ManagingUnit {
    return new ManagingUnit({ ...props, createdAt: new Date() });
  }

  static reconstitute(props: ManagingUnitProps): ManagingUnit {
    return new ManagingUnit(props);
  }
}
