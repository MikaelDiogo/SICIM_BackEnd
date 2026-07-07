import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsageCategory } from '../../domain/enums/usage-category.enum';
import { PropertyStatus } from '../../domain/enums/property-status.enum';
import { PossessionType } from '../../domain/enums/possession-type.enum';

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number];
}

@Entity('properties')
export class PropertyOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 20 })
  registrationNumber: string;

  @Column({ type: 'varchar', length: 255 })
  notaryOffice: string;

  @Column({ type: 'text' })
  notarialDescription: string;

  @Column({ type: 'varchar', length: 255 })
  addressStreet: string;

  @Column({ type: 'varchar', length: 20 })
  addressNumber: string;

  @Column({ type: 'varchar', length: 100 })
  addressNeighborhood: string;

  @Column({ type: 'varchar', length: 9 })
  addressZipCode: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  addressReference: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalArea: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  builtArea: number;

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  geolocation: GeoJSONPoint;

  @Column({ type: 'uuid' })
  managingUnitId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  budgetUnit: string | null;

  @Column({ type: 'enum', enum: UsageCategory })
  usageCategory: UsageCategory;

  @Column({ type: 'enum', enum: PossessionType })
  possessionType: PossessionType;

  @Column({ type: 'timestamptz', nullable: true })
  contractStartDate: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  contractEndDate: Date | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  contractMonthlyValue: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  contractReferenceValue: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contractGrantor: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contractLessor: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  contractAdministrativeProcessNumber: string | null;

  @Column({ type: 'integer' })
  acquisitionYear: number;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  originalValue: number;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  accumulatedDepreciation: number;

  @Column({ type: 'text' })
  publicPurpose: string;

  @Column({ type: 'enum', enum: PropertyStatus })
  status: PropertyStatus;

  @Column({ type: 'uuid' })
  createdById: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
