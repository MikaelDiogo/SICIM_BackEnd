import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { GetManagingUnitUseCase } from './application/use-cases/get-managing-unit.use-case';
import { ListManagingUnitsUseCase } from './application/use-cases/list-managing-units.use-case';
import { RegisterManagingUnitUseCase } from './application/use-cases/register-managing-unit.use-case';
import { MANAGING_UNIT_REPOSITORY } from './domain/repositories/managing-unit.repository';
import { ManagingUnitTypeormRepository } from './infrastructure/persistence/managing-unit-typeorm.repository';
import { ManagingUnitOrmEntity } from './infrastructure/persistence/managing-unit.orm-entity';
import { ManagingUnitController } from './interface/controllers/managing-unit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ManagingUnitOrmEntity]), AuthModule],
  controllers: [ManagingUnitController],
  providers: [
    RegisterManagingUnitUseCase,
    ListManagingUnitsUseCase,
    GetManagingUnitUseCase,
    {
      provide: MANAGING_UNIT_REPOSITORY,
      useClass: ManagingUnitTypeormRepository,
    },
  ],
  exports: [MANAGING_UNIT_REPOSITORY],
})
export class ManagingUnitModule {}
