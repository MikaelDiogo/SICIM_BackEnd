import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    {
      provide: PROPERTY_REPOSITORY,
      useClass: PropertyTypeormRepository,
    },
  ],
  exports: [RegisterPropertyUseCase],
})
export class PropertyModule {}
