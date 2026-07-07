import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterPropertyDto } from '../../application/dto/register-property.dto';
import { RegisterPropertyUseCase } from '../../application/use-cases/register-property.use-case';
import { PropertyPresenter } from '../presenters/property.presenter';

@Controller('properties')
export class PropertyController {
  constructor(private readonly registerPropertyUseCase: RegisterPropertyUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterPropertyDto) {
    const property = await this.registerPropertyUseCase.execute(dto, dto.createdById);
    return PropertyPresenter.toHttp(property);
  }
}
