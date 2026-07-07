import { PossessionContract } from '../../domain/entities/possession-contract.entity';
import { Property } from '../../domain/entities/property.entity';
import { PossessionType } from '../../domain/enums/possession-type.enum';
import { Address } from '../../domain/value-objects/address.vo';
import { Geolocation } from '../../domain/value-objects/geolocation.vo';
import { RegistrationNumber } from '../../domain/value-objects/registration-number.vo';
import { MonetaryValue } from '../../domain/value-objects/monetary-value.vo';
import { PropertyOrmEntity } from './property.orm-entity';

export class PropertyMapper {
  static toDomain(orm: PropertyOrmEntity): Property {
    const possessionContract =
      orm.possessionType !== PossessionType.OWNED && orm.contractStartDate
        ? new PossessionContract(orm.possessionType, {
            startDate: orm.contractStartDate,
            endDate: orm.contractEndDate ?? undefined,
            monthlyValue:
              orm.contractMonthlyValue !== null ? Number(orm.contractMonthlyValue) : undefined,
            referenceValue:
              orm.contractReferenceValue !== null
                ? Number(orm.contractReferenceValue)
                : undefined,
            grantor: orm.contractGrantor ?? undefined,
            lessor: orm.contractLessor ?? undefined,
            administrativeProcessNumber: orm.contractAdministrativeProcessNumber ?? '',
          })
        : undefined;

    return Property.reconstitute({
      id: orm.id,
      registrationNumber: RegistrationNumber.create(orm.registrationNumber),
      notaryOffice: orm.notaryOffice,
      notarialDescription: orm.notarialDescription,
      address: Address.create({
        street: orm.addressStreet,
        number: orm.addressNumber,
        neighborhood: orm.addressNeighborhood,
        zipCode: orm.addressZipCode,
        reference: orm.addressReference ?? undefined,
      }),
      totalArea: Number(orm.totalArea),
      builtArea: Number(orm.builtArea),
      geolocation: Geolocation.create(
        orm.geolocation.coordinates[1],
        orm.geolocation.coordinates[0],
      ),
      managingUnitId: orm.managingUnitId,
      budgetUnit: orm.budgetUnit ?? undefined,
      usageCategory: orm.usageCategory,
      possessionType: orm.possessionType,
      possessionContract,
      acquisitionYear: orm.acquisitionYear,
      originalValue: MonetaryValue.create(Number(orm.originalValue)),
      accumulatedDepreciation: MonetaryValue.create(Number(orm.accumulatedDepreciation)),
      publicPurpose: orm.publicPurpose,
      status: orm.status,
      createdById: orm.createdById,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toPersistence(property: Property): PropertyOrmEntity {
    const orm = new PropertyOrmEntity();
    orm.id = property.id;
    orm.registrationNumber = property.registrationNumber.value;
    orm.notaryOffice = property.notaryOffice;
    orm.notarialDescription = property.notarialDescription;
    orm.addressStreet = property.address.street;
    orm.addressNumber = property.address.number;
    orm.addressNeighborhood = property.address.neighborhood;
    orm.addressZipCode = property.address.zipCode;
    orm.addressReference = property.address.reference ?? null;
    orm.totalArea = property.totalArea;
    orm.builtArea = property.builtArea;
    orm.geolocation = property.geolocation.toGeoJSON();
    orm.managingUnitId = property.managingUnitId;
    orm.budgetUnit = property.budgetUnit ?? null;
    orm.usageCategory = property.usageCategory;
    orm.possessionType = property.possessionType;
    orm.contractStartDate = property.possessionContract?.startDate ?? null;
    orm.contractEndDate = property.possessionContract?.endDate ?? null;
    orm.contractMonthlyValue = property.possessionContract?.monthlyValue ?? null;
    orm.contractReferenceValue = property.possessionContract?.referenceValue ?? null;
    orm.contractGrantor = property.possessionContract?.grantor ?? null;
    orm.contractLessor = property.possessionContract?.lessor ?? null;
    orm.contractAdministrativeProcessNumber =
      property.possessionContract?.administrativeProcessNumber ?? null;
    orm.acquisitionYear = property.acquisitionYear;
    orm.originalValue = property.originalValue.amount;
    orm.accumulatedDepreciation = property.accumulatedDepreciation.amount;
    orm.publicPurpose = property.publicPurpose;
    orm.status = property.status;
    orm.createdById = property.createdById;
    orm.createdAt = property.createdAt;
    orm.updatedAt = property.updatedAt;
    return orm;
  }
}
