import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import { AuditAction } from '../../domain/enums/audit-action.enum';
import type {
  AuditLogFilters,
  IAuditLogRepository,
  PagedAuditLogs,
} from '../../domain/repositories/audit-log.repository';
import { AUDIT_LOG_REPOSITORY } from '../../domain/repositories/audit-log.repository';

export interface RecordAuditLogInput {
  userId: string;
  affectedEntity: string;
  entityId: string;
  action: AuditAction;
  dataBefore?: Record<string, unknown> | null;
  dataAfter?: Record<string, unknown> | null;
  sourceIp?: string | null;
}

@Injectable()
export class AuditLogService {
  constructor(
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly auditLogRepository: IAuditLogRepository,
  ) {}

  async record(input: RecordAuditLogInput): Promise<AuditLog> {
    const auditLog = AuditLog.create({
      id: randomUUID(),
      userId: input.userId,
      affectedEntity: input.affectedEntity,
      entityId: input.entityId,
      action: input.action,
      dataBefore: input.dataBefore ?? null,
      dataAfter: input.dataAfter ?? null,
      sourceIp: input.sourceIp ?? null,
    });

    return this.auditLogRepository.record(auditLog);
  }

  async list(filters: AuditLogFilters): Promise<PagedAuditLogs> {
    return this.auditLogRepository.list(filters);
  }
}
