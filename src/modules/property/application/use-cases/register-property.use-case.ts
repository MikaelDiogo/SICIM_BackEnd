import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PossessionContract } from '../../domain/entities/possession-contract.entity';
import { Property } from '../../domain/entities/property.entity';
import { DuplicateRegistrationNumberError } from '../../domain/errors/duplicate-registration-number.error';
import type { IPropertyRepository } from '../../domain/repositories/property.repository';
import { PROPERTY_REPOSITORY } from '../../domain/repositories/property.repository';
import { Address } from '../../domain/value-objects/address.vo';
import { Geolocation } from '../../domain/value-objects/geolocation.vo';
import { RegistrationNumber } from '../../domain/value-objects/registration-number.vo';
import { MonetaryValue } from '../../domain/value-objects/monetary-value.vo';
import { PossessionType } from '../../domain/enums/possession-type.enum';
import { RegisterPropertyDto } from '../dto/register-property.dto';

@Injectable()
export class RegisterPropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: IPropertyRepository,
  ) {}

  async execute(dto: RegisterPropertyDto, createdById: string): Promise<Property> {
    const registrationNumber = RegistrationNumber.create(dto.registrationNumber);

    const alreadyExists = await this.propertyRepository.existsByRegistrationNumber(
      registrationNumber.value,
    );
    if (alreadyExists) {
      throw new DuplicateRegistrationNumberError(registrationNumber.value);
    }

    const address = Address.create({
      street: dto.address.street,
      number: dto.address.number,
      neighborhood: dto.address.neighborhood,
      zipCode: dto.address.zipCode,
      reference: dto.address.reference,
    });

    const geolocation = Geolocation.create(dto.latitude, dto.longitude);

    const originalValue = MonetaryValue.create(dto.originalValue);

    const possessionContract =
      dto.possessionContract && dto.possessionType !== PossessionType.OWNED
        ? new PossessionContract(dto.possessionType, {
            startDate: dto.possessionContract.startDate,
            endDate: dto.possessionContract.endDate,
            monthlyValue: dto.possessionContract.monthlyValue,
            referenceValue: dto.possessionContract.referenceValue,
            grantor: dto.possessionContract.grantor,
            lessor: dto.possessionContract.lessor,
            administrativeProcessNumber: dto.possessionContract.administrativeProcessNumber,
          })
        : undefined;

    const property = Property.create({
      id: randomUUID(),
      registrationNumber,
      notaryOffice: dto.notaryOffice,
      notarialDescription: dto.notarialDescription,
      address,
      totalArea: dto.totalArea,
      builtArea: dto.builtArea,
      geolocation,
      managingUnitId: dto.managingUnitId,
      budgetUnit: dto.budgetUnit,
      usageCategory: dto.usageCategory,
      possessionType: dto.possessionType,
      possessionContract,
      acquisitionYear: dto.acquisitionYear,
      originalValue,
      publicPurpose: dto.publicPurpose,
      createdById,
    });

    return this.propertyRepository.save(property);
  }
}
