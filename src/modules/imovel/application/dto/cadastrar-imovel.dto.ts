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
import { TipoPosse } from '../../domain/enums/tipo-posse.enum';
import { CategoriaUso } from '../../domain/enums/categoria-uso.enum';

export class EnderecoDto {
  @IsString()
  @IsNotEmpty()
  logradouro: string;

  @IsString()
  @IsNotEmpty()
  numero: string;

  @IsString()
  @IsNotEmpty()
  bairro: string;

  @IsString()
  @IsNotEmpty()
  cep: string;

  @IsString()
  @IsOptional()
  referencia?: string;
}

export class ContratoPosseDto {
  @Type(() => Date)
  dataInicio: Date;

  @Type(() => Date)
  @IsOptional()
  dataFim?: Date;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  valorMensal?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  valorReferencia?: number;

  @IsString()
  @IsOptional()
  cedente?: string;

  @IsString()
  @IsOptional()
  locador?: string;

  @IsString()
  @IsNotEmpty()
  numeroProcessoAdministrativo: string;
}

export class CadastrarImovelDto {
  @IsString()
  @IsNotEmpty()
  matricula: string;

  @IsString()
  @IsNotEmpty()
  cartorio: string;

  @IsString()
  @IsNotEmpty()
  descricaoCartorial: string;

  @ValidateNested()
  @Type(() => EnderecoDto)
  endereco: EnderecoDto;

  @IsNumber()
  @IsPositive()
  areaTotal: number;

  @IsNumber()
  @IsPositive()
  areaConstruida: number;

  @IsNumber()
  @Min(-5.65)
  @Max(-4.70)
  latitude: number;

  @IsNumber()
  @Min(-41.20)
  @Max(-40.10)
  longitude: number;

  @IsUUID()
  unidadeGestoraId: string;

  @IsString()
  @IsOptional()
  unidadeOrcamentaria?: string;

  @IsEnum(CategoriaUso)
  categoriaUso: CategoriaUso;

  @IsEnum(TipoPosse)
  tipoPosse: TipoPosse;

  // Obrigatório quando tipoPosse !== PROPRIO — validação reforçada no use case
  @ValidateIf((o) => o.tipoPosse !== TipoPosse.PROPRIO)
  @ValidateNested()
  @Type(() => ContratoPosseDto)
  contratoPosse?: ContratoPosseDto;

  @IsInt()
  @Min(1800)
  @Max(new Date().getFullYear())
  anoAquisicao: number;

  @IsNumber()
  @IsPositive()
  valorOriginal: number;

  @IsString()
  @IsNotEmpty()
  finalidadePublica: string;
}
