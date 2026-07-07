import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../../domain/entities/property.entity';
import {
  PropertyFilters,
  IPropertyRepository,
  PagedResult,
} from '../../domain/repositories/property.repository';
import { PropertyMapper } from './property.mapper';
import { PropertyOrmEntity } from './property.orm-entity';

@Injectable()
export class PropertyTypeormRepository implements IPropertyRepository {
  constructor(
    @InjectRepository(PropertyOrmEntity)
    private readonly repository: Repository<PropertyOrmEntity>,
  ) {}

  async save(property: Property): Promise<Property> {
    const saved = await this.repository.save(PropertyMapper.toPersistence(property));
    return PropertyMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Property | null> {
    const found = await this.repository.findOneBy({ id });
    return found ? PropertyMapper.toDomain(found) : null;
  }

  async findByRegistrationNumber(registrationNumber: string): Promise<Property | null> {
    const found = await this.repository.findOneBy({ registrationNumber });
    return found ? PropertyMapper.toDomain(found) : null;
  }

  async list(filters: PropertyFilters): Promise<PagedResult<Property>> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;

    const query = this.repository.createQueryBuilder('property');

    if (filters.status) {
      query.andWhere('property.status = :status', { status: filters.status });
    }
    if (filters.usageCategory) {
      query.andWhere('property.usageCategory = :usageCategory', {
        usageCategory: filters.usageCategory,
      });
    }
    if (filters.managingUnitId) {
      query.andWhere('property.managingUnitId = :managingUnitId', {
        managingUnitId: filters.managingUnitId,
      });
    }
    if (filters.acquisitionYearFrom) {
      query.andWhere('property.acquisitionYear >= :yearFrom', {
        yearFrom: filters.acquisitionYearFrom,
      });
    }
    if (filters.acquisitionYearTo) {
      query.andWhere('property.acquisitionYear <= :yearTo', {
        yearTo: filters.acquisitionYearTo,
      });
    }

    query.skip((page - 1) * pageSize).take(pageSize);

    const [records, total] = await query.getManyAndCount();

    return {
      data: records.map(PropertyMapper.toDomain),
      total,
      page,
      pageSize,
    };
  }

  async existsByRegistrationNumber(registrationNumber: string): Promise<boolean> {
    const total = await this.repository.countBy({ registrationNumber });
    return total > 0;
  }
}
