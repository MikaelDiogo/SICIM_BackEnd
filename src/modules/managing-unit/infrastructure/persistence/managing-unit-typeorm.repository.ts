import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManagingUnit } from '../../domain/entities/managing-unit.entity';
import { IManagingUnitRepository } from '../../domain/repositories/managing-unit.repository';
import { ManagingUnitMapper } from './managing-unit.mapper';
import { ManagingUnitOrmEntity } from './managing-unit.orm-entity';

@Injectable()
export class ManagingUnitTypeormRepository implements IManagingUnitRepository {
  constructor(
    @InjectRepository(ManagingUnitOrmEntity)
    private readonly repository: Repository<ManagingUnitOrmEntity>,
  ) {}

  async save(managingUnit: ManagingUnit): Promise<ManagingUnit> {
    const saved = await this.repository.save(ManagingUnitMapper.toPersistence(managingUnit));
    return ManagingUnitMapper.toDomain(saved);
  }

  async findById(id: string): Promise<ManagingUnit | null> {
    const found = await this.repository.findOneBy({ id });
    return found ? ManagingUnitMapper.toDomain(found) : null;
  }

  async list(): Promise<ManagingUnit[]> {
    const records = await this.repository.find({ order: { name: 'ASC' } });
    return records.map(ManagingUnitMapper.toDomain);
  }

  async existsByAcronym(acronym: string): Promise<boolean> {
    const total = await this.repository.countBy({ acronym });
    return total > 0;
  }
}
