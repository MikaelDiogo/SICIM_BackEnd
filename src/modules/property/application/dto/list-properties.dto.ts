import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { PropertyStatus } from '../../domain/enums/property-status.enum';
import { UsageCategory } from '../../domain/enums/usage-category.enum';

export class ListPropertiesDto {
  @IsEnum(PropertyStatus)
  @IsOptional()
  status?: PropertyStatus;

  @IsEnum(UsageCategory)
  @IsOptional()
  usageCategory?: UsageCategory;

  @IsUUID()
  @IsOptional()
  managingUnitId?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1800)
  @IsOptional()
  acquisitionYearFrom?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1800)
  @IsOptional()
  acquisitionYearTo?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  pageSize?: number;
}
