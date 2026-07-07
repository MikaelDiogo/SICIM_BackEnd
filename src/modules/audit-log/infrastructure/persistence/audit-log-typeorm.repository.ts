import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../domain/entities/audit-log.entity';
import {
  AuditLogFilters,
  IAuditLogRepository,
  PagedAuditLogs,
} from '../../domain/repositories/audit-log.repository';
import { AuditLogMapper } from './audit-log.mapper';
import { AuditLogOrmEntity } from './audit-log.orm-entity';

@Injectable()
export class AuditLogTypeormRepository implements IAuditLogRepository {
  constructor(
    @InjectRepository(AuditLogOrmEntity)
    private readonly repository: Repository<AuditLogOrmEntity>,
  ) {}

  async record(auditLog: AuditLog): Promise<AuditLog> {
    const saved = await this.repository.save(AuditLogMapper.toPersistence(auditLog));
    return AuditLogMapper.toDomain(saved);
  }

  async list(filters: AuditLogFilters): Promise<PagedAuditLogs> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;

    const query = this.repository.createQueryBuilder('auditLog');

    if (filters.affectedEntity) {
      query.andWhere('auditLog.affectedEntity = :affectedEntity', {
        affectedEntity: filters.affectedEntity,
      });
    }
    if (filters.entityId) {
      query.andWhere('auditLog.entityId = :entityId', { entityId: filters.entityId });
    }
    if (filters.userId) {
      query.andWhere('auditLog.userId = :userId', { userId: filters.userId });
    }

    query.orderBy('auditLog.timestamp', 'DESC');
    query.skip((page - 1) * pageSize).take(pageSize);

    const [records, total] = await query.getManyAndCount();

    return {
      data: records.map(AuditLogMapper.toDomain),
      total,
      page,
      pageSize,
    };
  }
}
