import { ManagingUnit } from '../entities/managing-unit.entity';

export interface IManagingUnitRepository {
  save(managingUnit: ManagingUnit): Promise<ManagingUnit>;
  findById(id: string): Promise<ManagingUnit | null>;
  list(): Promise<ManagingUnit[]>;
  existsByAcronym(acronym: string): Promise<boolean>;
}

export const MANAGING_UNIT_REPOSITORY = Symbol('MANAGING_UNIT_REPOSITORY');
