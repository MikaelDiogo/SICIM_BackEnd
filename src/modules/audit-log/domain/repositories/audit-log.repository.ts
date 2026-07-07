import { AuditLog } from '../entities/audit-log.entity';

export interface AuditLogFilters {
  affectedEntity?: string;
  entityId?: string;
  userId?: string;
  page?: number;
  pageSize?: number;
}

export interface PagedAuditLogs {
  data: AuditLog[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IAuditLogRepository {
  record(auditLog: AuditLog): Promise<AuditLog>;
  list(filters: AuditLogFilters): Promise<PagedAuditLogs>;
}

export const AUDIT_LOG_REPOSITORY = Symbol('AUDIT_LOG_REPOSITORY');
