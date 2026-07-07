import { Inject, Injectable } from '@nestjs/common';
import { ManagingUnit } from '../../domain/entities/managing-unit.entity';
import type { IManagingUnitRepository } from '../../domain/repositories/managing-unit.repository';
import { MANAGING_UNIT_REPOSITORY } from '../../domain/repositories/managing-unit.repository';

@Injectable()
export class ListManagingUnitsUseCase {
  constructor(
    @Inject(MANAGING_UNIT_REPOSITORY)
    private readonly managingUnitRepository: IManagingUnitRepository,
  ) {}

  async execute(): Promise<ManagingUnit[]> {
    return this.managingUnitRepository.list();
  }
}
