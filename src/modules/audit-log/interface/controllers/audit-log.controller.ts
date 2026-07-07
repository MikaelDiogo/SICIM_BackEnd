import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/interface/decorators/roles.decorator';
import { Role } from '../../../user/domain/enums/role.enum';
import { AuditLogService } from '../../application/services/audit-log.service';
import { ListAuditLogsDto } from '../../application/dto/list-audit-logs.dto';
import { AuditLogPresenter } from '../presenters/audit-log.presenter';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @Roles(Role.ADMINISTRATION)
  async list(@Query() query: ListAuditLogsDto) {
    const page = await this.auditLogService.list(query);
    return AuditLogPresenter.toHttpList(page);
  }
}
