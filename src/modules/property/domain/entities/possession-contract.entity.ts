import { PossessionType } from '../enums/possession-type.enum';

export interface PossessionContractProps {
  startDate: Date;
  endDate?: Date;
  monthlyValue?: number;
  referenceValue?: number;
  grantor?: string;
  lessor?: string;
  administrativeProcessNumber: string;
}

export class PossessionContract {
  readonly possessionType: PossessionType;
  readonly startDate: Date;
  readonly endDate?: Date;
  readonly monthlyValue?: number;
  readonly referenceValue?: number;
  readonly grantor?: string;
  readonly lessor?: string;
  readonly administrativeProcessNumber: string;

  constructor(possessionType: PossessionType, props: PossessionContractProps) {
    this.possessionType = possessionType;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.monthlyValue = props.monthlyValue;
    this.referenceValue = props.referenceValue;
    this.grantor = props.grantor;
    this.lessor = props.lessor;
    this.administrativeProcessNumber = props.administrativeProcessNumber;
  }

  get isCurrent(): boolean {
    if (!this.endDate) return true;
    return this.endDate > new Date();
  }
}
