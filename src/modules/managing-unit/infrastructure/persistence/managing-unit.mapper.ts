import { ManagingUnit } from '../../domain/entities/managing-unit.entity';
import { ManagingUnitOrmEntity } from './managing-unit.orm-entity';

export class ManagingUnitMapper {
  static toDomain(orm: ManagingUnitOrmEntity): ManagingUnit {
    return ManagingUnit.reconstitute({
      id: orm.id,
      name: orm.name,
      acronym: orm.acronym,
      type: orm.type,
      createdAt: orm.createdAt,
    });
  }

  static toPersistence(managingUnit: ManagingUnit): ManagingUnitOrmEntity {
    const orm = new ManagingUnitOrmEntity();
    orm.id = managingUnit.id;
    orm.name = managingUnit.name;
    orm.acronym = managingUnit.acronym;
    orm.type = managingUnit.type;
    orm.createdAt = managingUnit.createdAt;
    return orm;
  }
}
