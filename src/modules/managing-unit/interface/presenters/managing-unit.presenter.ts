import { ManagingUnit } from '../../domain/entities/managing-unit.entity';

export class ManagingUnitPresenter {
  static toHttp(managingUnit: ManagingUnit) {
    return {
      id: managingUnit.id,
      name: managingUnit.name,
      acronym: managingUnit.acronym,
      type: managingUnit.type,
      createdAt: managingUnit.createdAt,
    };
  }
}
