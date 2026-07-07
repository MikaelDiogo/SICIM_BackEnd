import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApprovePropertyDto } from '../../application/dto/approve-property.dto';
import { ListPropertiesDto } from '../../application/dto/list-properties.dto';
import { RegisterPropertyDto } from '../../application/dto/register-property.dto';
import { ApprovePropertyUseCase } from '../../application/use-cases/approve-property.use-case';
import { DeactivatePropertyUseCase } from '../../application/use-cases/deactivate-property.use-case';
import { GetPropertyUseCase } from '../../application/use-cases/get-property.use-case';
import { ListPropertiesUseCase } from '../../application/use-cases/list-properties.use-case';
import { RegisterPropertyUseCase } from '../../application/use-cases/register-property.use-case';
import { PropertyPresenter } from '../presenters/property.presenter';

@Controller('properties')
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
  async register(@Body() dto: RegisterPropertyDto) {
    const property = await this.registerPropertyUseCase.execute(dto, dto.createdById);
    return PropertyPresenter.toHttp(property);
  }

  @Get()
  async list(@Query() query: ListPropertiesDto) {
    const page = await this.listPropertiesUseCase.execute(query);
    return PropertyPresenter.toHttpList(page);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const property = await this.getPropertyUseCase.execute(id);
    return PropertyPresenter.toHttp(property);
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: string, @Body() dto: ApprovePropertyDto) {
    const property = await this.approvePropertyUseCase.execute(id, dto.approvedById);
    return PropertyPresenter.toHttp(property);
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    const property = await this.deactivatePropertyUseCase.execute(id);
    return PropertyPresenter.toHttp(property);
  }
}
