import { AuditLog } from '../../domain/entities/audit-log.entity';
import { AuditLogOrmEntity } from './audit-log.orm-entity';

export class AuditLogMapper {
  static toDomain(orm: AuditLogOrmEntity): AuditLog {
    return AuditLog.reconstitute({
      id: orm.id,
      userId: orm.userId,
      affectedEntity: orm.affectedEntity,
      entityId: orm.entityId,
      action: orm.action,
      dataBefore: orm.dataBefore,
      dataAfter: orm.dataAfter,
      timestamp: orm.timestamp,
      sourceIp: orm.sourceIp,
    });
  }

  static toPersistence(auditLog: AuditLog): AuditLogOrmEntity {
    const orm = new AuditLogOrmEntity();
    orm.id = auditLog.id;
    orm.userId = auditLog.userId;
    orm.affectedEntity = auditLog.affectedEntity;
    orm.entityId = auditLog.entityId;
    orm.action = auditLog.action;
    orm.dataBefore = auditLog.dataBefore;
    orm.dataAfter = auditLog.dataAfter;
    orm.timestamp = auditLog.timestamp;
    orm.sourceIp = auditLog.sourceIp;
    return orm;
  }
}
