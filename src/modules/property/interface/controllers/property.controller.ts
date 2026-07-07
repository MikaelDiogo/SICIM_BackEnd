import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { CurrentUser } from '../../../auth/interface/decorators/current-user.decorator';
import { Roles } from '../../../auth/interface/decorators/roles.decorator';
import type { AuthenticatedUser } from '../../../auth/infrastructure/strategies/jwt.strategy';
import { Role } from '../../../user/domain/enums/role.enum';
import { ListPropertiesDto } from '../../application/dto/list-properties.dto';
import { RegisterPropertyDto } from '../../application/dto/register-property.dto';
import { ApprovePropertyUseCase } from '../../application/use-cases/approve-property.use-case';
import { DeactivatePropertyUseCase } from '../../application/use-cases/deactivate-property.use-case';
import { GetPropertyUseCase } from '../../application/use-cases/get-property.use-case';
import { ListPropertiesUseCase } from '../../application/use-cases/list-properties.use-case';
import { RegisterPropertyUseCase } from '../../application/use-cases/register-property.use-case';
import { PropertyPresenter } from '../presenters/property.presenter';

@Controller('properties')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PropertyController {
  constructor(
    private readonly registerPropertyUseCase: RegisterPropertyUseCase,
    private readonly listPropertiesUseCase: ListPropertiesUseCase,
    private readonly getPropertyUseCase: GetPropertyUseCase,
    private readonly approvePropertyUseCase: ApprovePropertyUseCase,
    private readonly deactivatePropertyUseCase: DeactivatePropertyUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.REGISTRATION, Role.ADMINISTRATION)
  async register(@Body() dto: RegisterPropertyDto, @CurrentUser() user: AuthenticatedUser) {
    const property = await this.registerPropertyUseCase.execute(dto, user.id);
    return PropertyPresenter.toHttp(property);
  }

  @Get()
  @Roles(Role.REGISTRATION, Role.VIEWER, Role.APPROVAL, Role.ADMINISTRATION)
  async list(@Query() query: ListPropertiesDto) {
    const page = await this.listPropertiesUseCase.execute(query);
    return PropertyPresenter.toHttpList(page);
  }

  @Get(':id')
  @Roles(Role.REGISTRATION, Role.VIEWER, Role.APPROVAL, Role.ADMINISTRATION)
  async get(@Param('id') id: string) {
    const property = await this.getPropertyUseCase.execute(id);
    return PropertyPresenter.toHttp(property);
  }

  @Patch(':id/approve')
  @Roles(Role.APPROVAL, Role.ADMINISTRATION)
  async approve(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const property = await this.approvePropertyUseCase.execute(id, user.id);
    return PropertyPresenter.toHttp(property);
  }

  @Patch(':id/deactivate')
  @Roles(Role.APPROVAL, Role.ADMINISTRATION)
  async deactivate(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    const property = await this.deactivatePropertyUseCase.execute(id, user.id);
    return PropertyPresenter.toHttp(property);
  }
}
