import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovePropertyUseCase } from './application/use-cases/approve-property.use-case';
import { DeactivatePropertyUseCase } from './application/use-cases/deactivate-property.use-case';
import { GetPropertyUseCase } from './application/use-cases/get-property.use-case';
import { ListPropertiesUseCase } from './application/use-cases/list-properties.use-case';
import { RegisterPropertyUseCase } from './application/use-cases/register-property.use-case';
import { PROPERTY_REPOSITORY } from './domain/repositories/property.repository';
import { PropertyTypeormRepository } from './infrastructure/persistence/property-typeorm.repository';
import { PropertyOrmEntity } from './infrastructure/persistence/property.orm-entity';
import { PropertyController } from './interface/controllers/property.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyOrmEntity])],
  controllers: [PropertyController],
  providers: [
    RegisterPropertyUseCase,
    ListPropertiesUseCase,
    GetPropertyUseCase,
    ApprovePropertyUseCase,
    DeactivatePropertyUseCase,
    {
      provide: PROPERTY_REPOSITORY,
      useClass: PropertyTypeormRepository,
    },
  ],
  exports: [RegisterPropertyUseCase],
})
export class PropertyModule {}
