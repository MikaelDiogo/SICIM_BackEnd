import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from '../../application/dto/login.dto';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { AuthPresenter } from '../presenters/auth.presenter';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const result = await this.loginUseCase.execute(dto);
    return AuthPresenter.toHttp(result);
  }
}
