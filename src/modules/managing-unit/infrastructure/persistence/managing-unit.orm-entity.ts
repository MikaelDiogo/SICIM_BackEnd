import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';
import { ManagingUnitType } from '../../domain/enums/managing-unit-type.enum';

@Entity('managing_units')
export class ManagingUnitOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 20 })
  acronym: string;

  @Column({ type: 'enum', enum: ManagingUnitType })
  type: ManagingUnitType;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
