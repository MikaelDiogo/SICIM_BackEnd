import { Imovel } from '../entities/imovel.entity';
import { StatusImovel } from '../enums/status-imovel.enum';
import { CategoriaUso } from '../enums/categoria-uso.enum';

export interface FiltrosImovel {
  status?: StatusImovel;
  categoriaUso?: CategoriaUso;
  unidadeGestoraId?: string;
  anoAquisicaoDe?: number;
  anoAquisicaoAte?: number;
  pagina?: number;
  itensPorPagina?: number;
}

export interface PaginaResultado<T> {
  dados: T[];
  total: number;
  pagina: number;
  itensPorPagina: number;
}

// Esta é uma interface (porta) — o domínio define o contrato,
// a infraestrutura (TypeORM) entrega a implementação concreta.
export interface IImovelRepository {
  salvar(imovel: Imovel): Promise<Imovel>;
  buscarPorId(id: string): Promise<Imovel | null>;
  buscarPorMatricula(matricula: string): Promise<Imovel | null>;
  listar(filtros: FiltrosImovel): Promise<PaginaResultado<Imovel>>;
  existeComMatricula(matricula: string): Promise<boolean>;
}

export const IMOVEL_REPOSITORY = Symbol('IMOVEL_REPOSITORY');
