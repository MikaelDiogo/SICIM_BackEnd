import { Property } from '../../domain/entities/property.entity';

// Flat, JSON-serializable snapshot of a Property for audit log records.
export function toAuditSnapshot(property: Property): Record<string, unknown> {
  return {
    id: property.id,
    registrationNumber: property.registrationNumber.value,
    notaryOffice: property.notaryOffice,
    notarialDescription: property.notarialDescription,
    address: {
      street: property.address.street,
      number: property.address.number,
      neighborhood: property.address.neighborhood,
      zipCode: property.address.zipCode,
      reference: property.address.reference,
    },
    totalArea: property.totalArea,
    builtArea: property.builtArea,
    latitude: property.geolocation.latitude,
    longitude: property.geolocation.longitude,
    managingUnitId: property.managingUnitId,
    budgetUnit: property.budgetUnit,
    usageCategory: property.usageCategory,
    possessionType: property.possessionType,
    acquisitionYear: property.acquisitionYear,
    originalValue: property.originalValue.amount,
    accumulatedDepreciation: property.accumulatedDepreciation.amount,
    publicPurpose: property.publicPurpose,
    status: property.status,
    createdById: property.createdById,
    createdAt: property.createdAt,
    updatedAt: property.updatedAt,
  };
}
