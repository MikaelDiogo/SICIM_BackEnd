import { Inject, Injectable } from '@nestjs/common';
import { Property } from '../../domain/entities/property.entity';
import { PropertyNotFoundError } from '../../domain/errors/property-not-found.error';
import type { IPropertyRepository } from '../../domain/repositories/property.repository';
import { PROPERTY_REPOSITORY } from '../../domain/repositories/property.repository';

@Injectable()
export class GetPropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: IPropertyRepository,
  ) {}

  async execute(id: string): Promise<Property> {
    const property = await this.propertyRepository.findById(id);
    if (!property) {
      throw new PropertyNotFoundError(id);
    }
    return property;
  }
}
