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
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PossessionType } from '../../domain/enums/possession-type.enum';
import { UsageCategory } from '../../domain/enums/usage-category.enum';
import { AddressDto, PossessionContractDto } from './register-property.dto';

export class UpdatePropertyDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  notaryOffice?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  notarialDescription?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  totalArea?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  builtArea?: number;

  @IsNumber()
  @Min(-5.65)
  @Max(-4.70)
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @Min(-41.20)
  @Max(-40.10)
  @IsOptional()
  longitude?: number;

  @IsUUID()
  @IsOptional()
  managingUnitId?: string;

  @IsString()
  @IsOptional()
  budgetUnit?: string;

  @IsEnum(UsageCategory)
  @IsOptional()
  usageCategory?: UsageCategory;

  @IsEnum(PossessionType)
  @IsOptional()
  possessionType?: PossessionType;

  @ValidateNested()
  @Type(() => PossessionContractDto)
  @IsOptional()
  possessionContract?: PossessionContractDto;

  @IsInt()
  @Min(1800)
  @Max(new Date().getFullYear())
  @IsOptional()
  acquisitionYear?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  originalValue?: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  publicPurpose?: string;
}
