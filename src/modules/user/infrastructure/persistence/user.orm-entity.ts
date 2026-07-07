import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';
import { Role } from '../../domain/enums/role.enum';

@Entity('users')
export class UserOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  employeeNumber: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
