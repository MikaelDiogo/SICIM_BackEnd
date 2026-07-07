import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ManagingUnitType } from '../../domain/enums/managing-unit-type.enum';

export class RegisterManagingUnitDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  acronym: string;

  @IsEnum(ManagingUnitType)
  type: ManagingUnitType;
}
