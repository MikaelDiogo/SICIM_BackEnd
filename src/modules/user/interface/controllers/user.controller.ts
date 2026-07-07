import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../../auth/interface/decorators/roles.decorator';
import { Role } from '../../domain/enums/role.enum';
import { RegisterUserDto } from '../../application/dto/register-user.dto';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { UserPresenter } from '../presenters/user.presenter';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMINISTRATION)
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.registerUserUseCase.execute(dto);
    return UserPresenter.toHttp(user);
  }
}
