import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterUserDto } from '../../application/dto/register-user.dto';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { UserPresenter } from '../presenters/user.presenter';

@Controller('users')
export class UserController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.registerUserUseCase.execute(dto);
    return UserPresenter.toHttp(user);
  }
}
