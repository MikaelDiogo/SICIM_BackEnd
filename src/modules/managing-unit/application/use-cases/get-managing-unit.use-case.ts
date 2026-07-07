import { Inject, Injectable } from '@nestjs/common';
import { ManagingUnit } from '../../domain/entities/managing-unit.entity';
import { ManagingUnitNotFoundError } from '../../domain/errors/managing-unit-not-found.error';
import type { IManagingUnitRepository } from '../../domain/repositories/managing-unit.repository';
import { MANAGING_UNIT_REPOSITORY } from '../../domain/repositories/managing-unit.repository';

@Injectable()
export class GetManagingUnitUseCase {
  constructor(
    @Inject(MANAGING_UNIT_REPOSITORY)
    private readonly managingUnitRepository: IManagingUnitRepository,
  ) {}

  async execute(id: string): Promise<ManagingUnit> {
    const managingUnit = await this.managingUnitRepository.findById(id);
    if (!managingUnit) {
      throw new ManagingUnitNotFoundError(id);
    }
    return managingUnit;
  }
}
