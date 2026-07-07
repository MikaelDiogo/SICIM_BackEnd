import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { AuditAction } from '../../domain/enums/audit-action.enum';

@Entity('audit_logs')
export class AuditLogOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  affectedEntity: string;

  @Index()
  @Column({ type: 'uuid' })
  entityId: string;

  @Column({ type: 'enum', enum: AuditAction })
  action: AuditAction;

  @Column({ type: 'jsonb', nullable: true })
  dataBefore: Record<string, unknown> | null;

  @Column({ type: 'jsonb', nullable: true })
  dataAfter: Record<string, unknown> | null;

  @Index()
  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  sourceIp: string | null;
}
