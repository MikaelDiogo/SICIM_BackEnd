import { Property } from '../entities/property.entity';
import { PropertyStatus } from '../enums/property-status.enum';
import { UsageCategory } from '../enums/usage-category.enum';

export interface PropertyFilters {
  status?: PropertyStatus;
  usageCategory?: UsageCategory;
  managingUnitId?: string;
  acquisitionYearFrom?: number;
  acquisitionYearTo?: number;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// This is an interface (port) — the domain defines the contract,
// the infrastructure (TypeORM) provides the concrete implementation.
export interface IPropertyRepository {
  save(property: Property): Promise<Property>;
  findById(id: string): Promise<Property | null>;
  findByRegistrationNumber(registrationNumber: string): Promise<Property | null>;
  list(filters: PropertyFilters): Promise<PagedResult<Property>>;
  existsByRegistrationNumber(registrationNumber: string): Promise<boolean>;
}

export const PROPERTY_REPOSITORY = Symbol('PROPERTY_REPOSITORY');
