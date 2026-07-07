import { AuditLog } from '../../domain/entities/audit-log.entity';
import { PagedAuditLogs } from '../../domain/repositories/audit-log.repository';

export class AuditLogPresenter {
  static toHttp(auditLog: AuditLog) {
    return {
      id: auditLog.id,
      userId: auditLog.userId,
      affectedEntity: auditLog.affectedEntity,
      entityId: auditLog.entityId,
      action: auditLog.action,
      dataBefore: auditLog.dataBefore,
      dataAfter: auditLog.dataAfter,
      timestamp: auditLog.timestamp,
      sourceIp: auditLog.sourceIp,
    };
  }

  static toHttpList(page: PagedAuditLogs) {
    return {
      data: page.data.map(AuditLogPresenter.toHttp),
      total: page.total,
      page: page.page,
      pageSize: page.pageSize,
    };
  }
}
