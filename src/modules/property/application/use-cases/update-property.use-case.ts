import { Inject, Injectable } from '@nestjs/common';
import { AuditAction } from '../../../audit-log/domain/enums/audit-action.enum';
import { AuditLogService } from '../../../audit-log/application/services/audit-log.service';
import type { IManagingUnitRepository } from '../../../managing-unit/domain/repositories/managing-unit.repository';
import { MANAGING_UNIT_REPOSITORY } from '../../../managing-unit/domain/repositories/managing-unit.repository';
import { ManagingUnitNotFoundError } from '../../../managing-unit/domain/errors/managing-unit-not-found.error';
import { PossessionContract } from '../../domain/entities/possession-contract.entity';
import { Property } from '../../domain/entities/property.entity';
import { PropertyNotFoundError } from '../../domain/errors/property-not-found.error';
import type { IPropertyRepository } from '../../domain/repositories/property.repository';
import { PROPERTY_REPOSITORY } from '../../domain/repositories/property.repository';
import { Address } from '../../domain/value-objects/address.vo';
import { Geolocation } from '../../domain/value-objects/geolocation.vo';
import { MonetaryValue } from '../../domain/value-objects/monetary-value.vo';
import { UpdatePropertyDto } from '../dto/update-property.dto';
import { toAuditSnapshot } from './property-audit-snapshot';

@Injectable()
export class UpdatePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: IPropertyRepository,
    @Inject(MANAGING_UNIT_REPOSITORY)
    private readonly managingUnitRepository: IManagingUnitRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async execute(id: string, dto: UpdatePropertyDto, updatedById: string): Promise<Property> {
    const property = await this.propertyRepository.findById(id);
    if (!property) {
      throw new PropertyNotFoundError(id);
    }

    if (dto.managingUnitId) {
      const managingUnit = await this.managingUnitRepository.findById(dto.managingUnitId);
      if (!managingUnit) {
        throw new ManagingUnitNotFoundError(dto.managingUnitId);
      }
    }

    const dataBefore = toAuditSnapshot(property);

    const possessionType = dto.possessionType ?? property.possessionType;
    const possessionContract = dto.possessionContract
      ? new PossessionContract(possessionType, dto.possessionContract)
      : property.possessionContract;

    const updated = property.update({
      ...(dto.notaryOffice !== undefined && { notaryOffice: dto.notaryOffice }),
      ...(dto.notarialDescription !== undefined && { notarialDescription: dto.notarialDescription }),
      ...(dto.address !== undefined && { address: Address.create(dto.address) }),
      ...(dto.totalArea !== undefined && { totalArea: dto.totalArea }),
      ...(dto.builtArea !== undefined && { builtArea: dto.builtArea }),
      ...((dto.latitude !== undefined || dto.longitude !== undefined) && {
        geolocation: Geolocation.create(
          dto.latitude ?? property.geolocation.latitude,
          dto.longitude ?? property.geolocation.longitude,
        ),
      }),
      ...(dto.managingUnitId !== undefined && { managingUnitId: dto.managingUnitId }),
      ...(dto.budgetUnit !== undefined && { budgetUnit: dto.budgetUnit }),
      ...(dto.usageCategory !== undefined && { usageCategory: dto.usageCategory }),
      ...(dto.possessionType !== undefined && { possessionType }),
      ...(dto.possessionContract !== undefined && { possessionContract }),
      ...(dto.acquisitionYear !== undefined && { acquisitionYear: dto.acquisitionYear }),
      ...(dto.originalValue !== undefined && { originalValue: MonetaryValue.create(dto.originalValue) }),
      ...(dto.publicPurpose !== undefined && { publicPurpose: dto.publicPurpose }),
    });

    const saved = await this.propertyRepository.save(updated);

    await this.auditLogService.record({
      userId: updatedById,
      affectedEntity: 'Property',
      entityId: saved.id,
      action: AuditAction.UPDATE,
      dataBefore,
      dataAfter: toAuditSnapshot(saved),
    });

    return saved;
  }
}
