import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PossessionType } from '../../domain/enums/possession-type.enum';
import { UsageCategory } from '../../domain/enums/usage-category.enum';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsString()
  @IsOptional()
  reference?: string;
}

export class PossessionContractDto {
  @Type(() => Date)
  startDate: Date;

  @Type(() => Date)
  @IsOptional()
  endDate?: Date;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  monthlyValue?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  referenceValue?: number;

  @IsString()
  @IsOptional()
  grantor?: string;

  @IsString()
  @IsOptional()
  lessor?: string;

  @IsString()
  @IsNotEmpty()
  administrativeProcessNumber: string;
}

export class RegisterPropertyDto {
  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

  @IsString()
  @IsNotEmpty()
  notaryOffice: string;

  @IsString()
  @IsNotEmpty()
  notarialDescription: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsNumber()
  @IsPositive()
  totalArea: number;

  @IsNumber()
  @IsPositive()
  builtArea: number;

  @IsNumber()
  @Min(-5.65)
  @Max(-4.70)
  latitude: number;

  @IsNumber()
  @Min(-41.20)
  @Max(-40.10)
  longitude: number;

  @IsUUID()
  managingUnitId: string;

  @IsString()
  @IsOptional()
  budgetUnit?: string;

  @IsEnum(UsageCategory)
  usageCategory: UsageCategory;

  @IsEnum(PossessionType)
  possessionType: PossessionType;

  // Required when possessionType !== OWNED — enforced again in the use case
  @ValidateIf((o) => o.possessionType !== PossessionType.OWNED)
  @ValidateNested()
  @Type(() => PossessionContractDto)
  possessionContract?: PossessionContractDto;

  @IsInt()
  @Min(1800)
  @Max(new Date().getFullYear())
  acquisitionYear: number;

  @IsNumber()
  @IsPositive()
  originalValue: number;

  @IsString()
  @IsNotEmpty()
  publicPurpose: string;
}
