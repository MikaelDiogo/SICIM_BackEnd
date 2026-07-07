import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class ListAuditLogsDto {
  @IsString()
  @IsOptional()
  affectedEntity?: string;

  @IsUUID()
  @IsOptional()
  entityId?: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

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
