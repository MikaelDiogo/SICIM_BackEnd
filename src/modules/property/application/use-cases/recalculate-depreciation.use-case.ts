import { Inject, Injectable } from '@nestjs/common';
import { AuditAction } from '../../../audit-log/domain/enums/audit-action.enum';
import { AuditLogService } from '../../../audit-log/application/services/audit-log.service';
import { DepreciationCalculator } from '../../domain/services/depreciation-calculator';
import { Property } from '../../domain/entities/property.entity';
import { PropertyNotFoundError } from '../../domain/errors/property-not-found.error';
import type { IPropertyRepository } from '../../domain/repositories/property.repository';
import { PROPERTY_REPOSITORY } from '../../domain/repositories/property.repository';
import { toAuditSnapshot } from './property-audit-snapshot';

@Injectable()
export class RecalculateDepreciationUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: IPropertyRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async execute(id: string, updatedById: string): Promise<Property> {
    const property = await this.propertyRepository.findById(id);
    if (!property) {
      throw new PropertyNotFoundError(id);
    }

    const dataBefore = toAuditSnapshot(property);

    const accumulatedDepreciation = DepreciationCalculator.calculate(
      property.originalValue,
      property.usageCategory,
      property.acquisitionYear,
    );

    const saved = await this.propertyRepository.save(
      property.withRecalculatedDepreciation(accumulatedDepreciation),
    );

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
