import { Property } from '../../domain/entities/property.entity';

export class PropertyPresenter {
  static toHttp(property: Property) {
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
      possessionContract: property.possessionContract
        ? {
            startDate: property.possessionContract.startDate,
            endDate: property.possessionContract.endDate,
            monthlyValue: property.possessionContract.monthlyValue,
            referenceValue: property.possessionContract.referenceValue,
            grantor: property.possessionContract.grantor,
            lessor: property.possessionContract.lessor,
            administrativeProcessNumber: property.possessionContract.administrativeProcessNumber,
          }
        : null,
      acquisitionYear: property.acquisitionYear,
      originalValue: property.originalValue.amount,
      accumulatedDepreciation: property.accumulatedDepreciation.amount,
      netBookValue: property.netBookValue.amount,
      publicPurpose: property.publicPurpose,
      status: property.status,
      createdById: property.createdById,
      createdAt: property.createdAt,
      updatedAt: property.updatedAt,
    };
  }
}
