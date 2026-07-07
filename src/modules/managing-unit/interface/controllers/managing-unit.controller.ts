import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { RegisterManagingUnitDto } from '../../application/dto/register-managing-unit.dto';
import { GetManagingUnitUseCase } from '../../application/use-cases/get-managing-unit.use-case';
import { ListManagingUnitsUseCase } from '../../application/use-cases/list-managing-units.use-case';
import { RegisterManagingUnitUseCase } from '../../application/use-cases/register-managing-unit.use-case';
import { ManagingUnitPresenter } from '../presenters/managing-unit.presenter';

@Controller('managing-units')
export class ManagingUnitController {
  constructor(
    private readonly registerManagingUnitUseCase: RegisterManagingUnitUseCase,
    private readonly listManagingUnitsUseCase: ListManagingUnitsUseCase,
    private readonly getManagingUnitUseCase: GetManagingUnitUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterManagingUnitDto) {
    const managingUnit = await this.registerManagingUnitUseCase.execute(dto);
    return ManagingUnitPresenter.toHttp(managingUnit);
  }

  @Get()
  async list() {
    const managingUnits = await this.listManagingUnitsUseCase.execute();
    return managingUnits.map(ManagingUnitPresenter.toHttp);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const managingUnit = await this.getManagingUnitUseCase.execute(id);
    return ManagingUnitPresenter.toHttp(managingUnit);
  }
}
