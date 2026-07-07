import { DomainError } from '../../../../shared/domain/exceptions/domain.error';

const FORMATO_CEP = /^\d{5}-?\d{3}$/;

export class CepInvalidoError extends DomainError {
  constructor(cep: string) {
    super(`CEP inválido: "${cep}". Use o formato NNNNN-NNN.`);
  }
}

export interface EnderecoProps {
  logradouro: string;
  numero: string;
  bairro: string;
  cep: string;
  referencia?: string;
}

export class Endereco {
  readonly logradouro: string;
  readonly numero: string;
  readonly bairro: string;
  readonly cep: string;
  readonly referencia?: string;

  private constructor(props: EnderecoProps) {
    this.logradouro = props.logradouro;
    this.numero = props.numero;
    this.bairro = props.bairro;
    this.cep = props.cep;
    this.referencia = props.referencia;
  }

  static criar(props: EnderecoProps): Endereco {
    if (!FORMATO_CEP.test(props.cep)) {
      throw new CepInvalidoError(props.cep);
    }
    return new Endereco(props);
  }
}
