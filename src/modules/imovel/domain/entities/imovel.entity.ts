import { CategoriaUso } from '../enums/categoria-uso.enum';
import { StatusImovel } from '../enums/status-imovel.enum';
import { TipoPosse } from '../enums/tipo-posse.enum';
import { AreaInvalidaError } from '../errors/area-invalida.error';
import { ContratoPosseObrigatorioError } from '../errors/contrato-posse-obrigatorio.error';
import { Endereco } from '../value-objects/endereco.vo';
import { Geolocalizacao } from '../value-objects/geolocalizacao.vo';
import { Matricula } from '../value-objects/matricula.vo';
import { ValorMonetario } from '../value-objects/valor-monetario.vo';
import { ContratoPosse } from './contrato-posse.entity';

const TIPOS_POSSE_COM_CONTRATO = [
  TipoPosse.ALUGADO,
  TipoPosse.CEDIDO,
  TipoPosse.COMODATO,
  TipoPosse.USUFRUTO,
  TipoPosse.PERMISSAO_DE_USO,
];

export interface ImovelProps {
  id: string;
  matricula: Matricula;
  cartorio: string;
  descricaoCartorial: string;
  endereco: Endereco;
  areaTotal: number;
  areaConstruida: number;
  geolocalizacao: Geolocalizacao;
  unidadeGestoraId: string;
  unidadeOrcamentaria?: string;
  categoriaUso: CategoriaUso;
  tipoPosse: TipoPosse;
  contratoPosse?: ContratoPosse;
  anoAquisicao: number;
  valorOriginal: ValorMonetario;
  depreciacaoAcumulada: ValorMonetario;
  finalidadePublica: string;
  status: StatusImovel;
  criadoPorId: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

export class Imovel {
  readonly id: string;
  readonly matricula: Matricula;
  readonly cartorio: string;
  readonly descricaoCartorial: string;
  readonly endereco: Endereco;
  readonly areaTotal: number;
  readonly areaConstruida: number;
  readonly geolocalizacao: Geolocalizacao;
  readonly unidadeGestoraId: string;
  readonly unidadeOrcamentaria?: string;
  readonly categoriaUso: CategoriaUso;
  readonly tipoPosse: TipoPosse;
  readonly contratoPosse?: ContratoPosse;
  readonly anoAquisicao: number;
  readonly valorOriginal: ValorMonetario;
  readonly depreciacaoAcumulada: ValorMonetario;
  readonly finalidadePublica: string;
  readonly status: StatusImovel;
  readonly criadoPorId: string;
  readonly criadoEm: Date;
  readonly atualizadoEm: Date;

  private constructor(props: ImovelProps) {
    this.id = props.id;
    this.matricula = props.matricula;
    this.cartorio = props.cartorio;
    this.descricaoCartorial = props.descricaoCartorial;
    this.endereco = props.endereco;
    this.areaTotal = props.areaTotal;
    this.areaConstruida = props.areaConstruida;
    this.geolocalizacao = props.geolocalizacao;
    this.unidadeGestoraId = props.unidadeGestoraId;
    this.unidadeOrcamentaria = props.unidadeOrcamentaria;
    this.categoriaUso = props.categoriaUso;
    this.tipoPosse = props.tipoPosse;
    this.contratoPosse = props.contratoPosse;
    this.anoAquisicao = props.anoAquisicao;
    this.valorOriginal = props.valorOriginal;
    this.depreciacaoAcumulada = props.depreciacaoAcumulada;
    this.finalidadePublica = props.finalidadePublica;
    this.status = props.status;
    this.criadoPorId = props.criadoPorId;
    this.criadoEm = props.criadoEm;
    this.atualizadoEm = props.atualizadoEm;
  }

  static criar(props: Omit<ImovelProps, 'status' | 'depreciacaoAcumulada' | 'criadoEm' | 'atualizadoEm'>): Imovel {
    if (props.areaConstruida > props.areaTotal) {
      throw new AreaInvalidaError(props.areaConstruida, props.areaTotal);
    }

    const precisaContrato = TIPOS_POSSE_COM_CONTRATO.includes(props.tipoPosse);
    if (precisaContrato && !props.contratoPosse) {
      throw new ContratoPosseObrigatorioError(props.tipoPosse);
    }

    const agora = new Date();

    return new Imovel({
      ...props,
      depreciacaoAcumulada: ValorMonetario.zero(),
      status: StatusImovel.PENDENTE_APROVACAO,
      criadoEm: agora,
      atualizadoEm: agora,
    });
  }

  // Reconstitui a entidade a partir de dados persistidos (sem aplicar invariantes de criação)
  static reconstituir(props: ImovelProps): Imovel {
    return new Imovel(props);
  }

  get valorPatrimonialLiquido(): ValorMonetario {
    return this.valorOriginal.subtrair(this.depreciacaoAcumulada);
  }

  aprovar(aprovadoPorId: string): Imovel {
    return Imovel.reconstituir({
      ...this.toProps(),
      status: StatusImovel.APROVADO,
      atualizadoEm: new Date(),
    });
  }

  inativar(): Imovel {
    return Imovel.reconstituir({
      ...this.toProps(),
      status: StatusImovel.INATIVO,
      atualizadoEm: new Date(),
    });
  }

  private toProps(): ImovelProps {
    return {
      id: this.id,
      matricula: this.matricula,
      cartorio: this.cartorio,
      descricaoCartorial: this.descricaoCartorial,
      endereco: this.endereco,
      areaTotal: this.areaTotal,
      areaConstruida: this.areaConstruida,
      geolocalizacao: this.geolocalizacao,
      unidadeGestoraId: this.unidadeGestoraId,
      unidadeOrcamentaria: this.unidadeOrcamentaria,
      categoriaUso: this.categoriaUso,
      tipoPosse: this.tipoPosse,
      contratoPosse: this.contratoPosse,
      anoAquisicao: this.anoAquisicao,
      valorOriginal: this.valorOriginal,
      depreciacaoAcumulada: this.depreciacaoAcumulada,
      finalidadePublica: this.finalidadePublica,
      status: this.status,
      criadoPorId: this.criadoPorId,
      criadoEm: this.criadoEm,
      atualizadoEm: this.atualizadoEm,
    };
  }
}
