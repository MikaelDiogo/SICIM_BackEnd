import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/interface/decorators/roles.decorator';
import { Role } from '../../../user/domain/enums/role.enum';
import { RegisterManagingUnitDto } from '../../application/dto/register-managing-unit.dto';
import { GetManagingUnitUseCase } from '../../application/use-cases/get-managing-unit.use-case';
import { ListManagingUnitsUseCase } from '../../application/use-cases/list-managing-units.use-case';
import { RegisterManagingUnitUseCase } from '../../application/use-cases/register-managing-unit.use-case';
import { ManagingUnitPresenter } from '../presenters/managing-unit.presenter';

@ApiTags('managing-units')
@ApiBearerAuth()
@Controller('managing-units')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ManagingUnitController {
  constructor(
    private readonly registerManagingUnitUseCase: RegisterManagingUnitUseCase,
    private readonly listManagingUnitsUseCase: ListManagingUnitsUseCase,
    private readonly getManagingUnitUseCase: GetManagingUnitUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMINISTRATION)
  async register(@Body() dto: RegisterManagingUnitDto) {
    const managingUnit = await this.registerManagingUnitUseCase.execute(dto);
    return ManagingUnitPresenter.toHttp(managingUnit);
  }

  @Get()
  @Roles(Role.REGISTRATION, Role.VIEWER, Role.APPROVAL, Role.ADMINISTRATION)
  async list() {
    const managingUnits = await this.listManagingUnitsUseCase.execute();
    return managingUnits.map(ManagingUnitPresenter.toHttp);
  }

  @Get(':id')
  @Roles(Role.REGISTRATION, Role.VIEWER, Role.APPROVAL, Role.ADMINISTRATION)
  async get(@Param('id', ParseUUIDPipe) id: string) {
    const managingUnit = await this.getManagingUnitUseCase.execute(id);
    return ManagingUnitPresenter.toHttp(managingUnit);
  }
}
