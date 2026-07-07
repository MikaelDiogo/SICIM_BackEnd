import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuditLogService } from './application/services/audit-log.service';
import { AUDIT_LOG_REPOSITORY } from './domain/repositories/audit-log.repository';
import { AuditLogTypeormRepository } from './infrastructure/persistence/audit-log-typeorm.repository';
import { AuditLogOrmEntity } from './infrastructure/persistence/audit-log.orm-entity';
import { AuditLogController } from './interface/controllers/audit-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogOrmEntity]), AuthModule],
  controllers: [AuditLogController],
  providers: [
    AuditLogService,
    {
      provide: AUDIT_LOG_REPOSITORY,
      useClass: AuditLogTypeormRepository,
    },
  ],
  exports: [AuditLogService],
})
export class AuditLogModule {}
