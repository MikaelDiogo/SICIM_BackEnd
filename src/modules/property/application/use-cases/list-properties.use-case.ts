import { Inject, Injectable } from '@nestjs/common';
import type {
  IPropertyRepository,
  PagedResult,
  PropertyFilters,
} from '../../domain/repositories/property.repository';
import { PROPERTY_REPOSITORY } from '../../domain/repositories/property.repository';
import { Property } from '../../domain/entities/property.entity';

@Injectable()
export class ListPropertiesUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: IPropertyRepository,
  ) {}

  async execute(filters: PropertyFilters): Promise<PagedResult<Property>> {
    return this.propertyRepository.list(filters);
  }
}
