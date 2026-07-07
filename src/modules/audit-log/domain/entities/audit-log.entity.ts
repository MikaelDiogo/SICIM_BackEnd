import { AuditAction } from '../enums/audit-action.enum';

export interface AuditLogProps {
  id: string;
  userId: string;
  affectedEntity: string;
  entityId: string;
  action: AuditAction;
  dataBefore: Record<string, unknown> | null;
  dataAfter: Record<string, unknown> | null;
  timestamp: Date;
  sourceIp: string | null;
}

// Immutable — append-only, never altered or deleted (audit/LGPD requirement).
export class AuditLog {
  readonly id: string;
  readonly userId: string;
  readonly affectedEntity: string;
  readonly entityId: string;
  readonly action: AuditAction;
  readonly dataBefore: Record<string, unknown> | null;
  readonly dataAfter: Record<string, unknown> | null;
  readonly timestamp: Date;
  readonly sourceIp: string | null;

  private constructor(props: AuditLogProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.affectedEntity = props.affectedEntity;
    this.entityId = props.entityId;
    this.action = props.action;
    this.dataBefore = props.dataBefore;
    this.dataAfter = props.dataAfter;
    this.timestamp = props.timestamp;
    this.sourceIp = props.sourceIp;
  }

  static create(props: Omit<AuditLogProps, 'timestamp'>): AuditLog {
    return new AuditLog({ ...props, timestamp: new Date() });
  }

  static reconstitute(props: AuditLogProps): AuditLog {
    return new AuditLog(props);
  }
}
