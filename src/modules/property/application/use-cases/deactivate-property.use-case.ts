import { Inject, Injectable } from '@nestjs/common';
import { AuditAction } from '../../../audit-log/domain/enums/audit-action.enum';
import { AuditLogService } from '../../../audit-log/application/services/audit-log.service';
import { Property } from '../../domain/entities/property.entity';
import { PropertyNotFoundError } from '../../domain/errors/property-not-found.error';
import type { IPropertyRepository } from '../../domain/repositories/property.repository';
import { PROPERTY_REPOSITORY } from '../../domain/repositories/property.repository';
import { toAuditSnapshot } from './property-audit-snapshot';

@Injectable()
export class DeactivatePropertyUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly propertyRepository: IPropertyRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async execute(id: string, deactivatedById: string): Promise<Property> {
    const property = await this.propertyRepository.findById(id);
    if (!property) {
      throw new PropertyNotFoundError(id);
    }

    const dataBefore = toAuditSnapshot(property);
    const saved = await this.propertyRepository.save(property.deactivate());

    await this.auditLogService.record({
      userId: deactivatedById,
      affectedEntity: 'Property',
      entityId: saved.id,
      action: AuditAction.DELETE,
      dataBefore,
      dataAfter: toAuditSnapshot(saved),
    });

    return saved;
  }
}
