import { TipoPosse } from '../enums/tipo-posse.enum';

export interface ContratoPosseProps {
  dataInicio: Date;
  dataFim?: Date;
  valorMensal?: number;
  valorReferencia?: number;
  cedente?: string;
  locador?: string;
  numeroProcessoAdministrativo: string;
}

export class ContratoPosse {
  readonly tipoPosse: TipoPosse;
  readonly dataInicio: Date;
  readonly dataFim?: Date;
  readonly valorMensal?: number;
  readonly valorReferencia?: number;
  readonly cedente?: string;
  readonly locador?: string;
  readonly numeroProcessoAdministrativo: string;

  constructor(tipoPosse: TipoPosse, props: ContratoPosseProps) {
    this.tipoPosse = tipoPosse;
    this.dataInicio = props.dataInicio;
    this.dataFim = props.dataFim;
    this.valorMensal = props.valorMensal;
    this.valorReferencia = props.valorReferencia;
    this.cedente = props.cedente;
    this.locador = props.locador;
    this.numeroProcessoAdministrativo = props.numeroProcessoAdministrativo;
  }

  get estaVigente(): boolean {
    if (!this.dataFim) return true;
    return this.dataFim > new Date();
  }
}
