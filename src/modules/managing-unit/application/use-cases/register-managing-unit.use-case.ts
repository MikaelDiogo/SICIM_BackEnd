import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ManagingUnit } from '../../domain/entities/managing-unit.entity';
import { DuplicateAcronymError } from '../../domain/errors/duplicate-acronym.error';
import type { IManagingUnitRepository } from '../../domain/repositories/managing-unit.repository';
import { MANAGING_UNIT_REPOSITORY } from '../../domain/repositories/managing-unit.repository';
import { RegisterManagingUnitDto } from '../dto/register-managing-unit.dto';

@Injectable()
export class RegisterManagingUnitUseCase {
  constructor(
    @Inject(MANAGING_UNIT_REPOSITORY)
    private readonly managingUnitRepository: IManagingUnitRepository,
  ) {}

  async execute(dto: RegisterManagingUnitDto): Promise<ManagingUnit> {
    const alreadyExists = await this.managingUnitRepository.existsByAcronym(dto.acronym);
    if (alreadyExists) {
      throw new DuplicateAcronymError(dto.acronym);
    }

    const managingUnit = ManagingUnit.create({
      id: randomUUID(),
      name: dto.name,
      acronym: dto.acronym,
      type: dto.type,
    });

    return this.managingUnitRepository.save(managingUnit);
  }
}
