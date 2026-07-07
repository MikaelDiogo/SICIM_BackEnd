import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ContratoPosse } from '../../domain/entities/contrato-posse.entity';
import { Imovel } from '../../domain/entities/imovel.entity';
import { MatriculaDuplicadaError } from '../../domain/errors/matricula-duplicada.error';
import { IImovelRepository, IMOVEL_REPOSITORY } from '../../domain/repositories/imovel.repository';
import { Endereco } from '../../domain/value-objects/endereco.vo';
import { Geolocalizacao } from '../../domain/value-objects/geolocalizacao.vo';
import { Matricula } from '../../domain/value-objects/matricula.vo';
import { ValorMonetario } from '../../domain/value-objects/valor-monetario.vo';
import { TipoPosse } from '../../domain/enums/tipo-posse.enum';
import { CadastrarImovelDto } from '../dto/cadastrar-imovel.dto';

@Injectable()
export class CadastrarImovelUseCase {
  constructor(
    @Inject(IMOVEL_REPOSITORY)
    private readonly imovelRepository: IImovelRepository,
  ) {}

  async execute(dto: CadastrarImovelDto, criadoPorId: string): Promise<Imovel> {
    const matricula = Matricula.criar(dto.matricula);

    const jaExiste = await this.imovelRepository.existeComMatricula(matricula.valor);
    if (jaExiste) {
      throw new MatriculaDuplicadaError(matricula.valor);
    }

    const endereco = Endereco.criar({
      logradouro: dto.endereco.logradouro,
      numero: dto.endereco.numero,
      bairro: dto.endereco.bairro,
      cep: dto.endereco.cep,
      referencia: dto.endereco.referencia,
    });

    const geolocalizacao = Geolocalizacao.criar(dto.latitude, dto.longitude);

    const valorOriginal = ValorMonetario.criar(dto.valorOriginal);

    const contratoPosse =
      dto.contratoPosse && dto.tipoPosse !== TipoPosse.PROPRIO
        ? new ContratoPosse(dto.tipoPosse, {
            dataInicio: dto.contratoPosse.dataInicio,
            dataFim: dto.contratoPosse.dataFim,
            valorMensal: dto.contratoPosse.valorMensal,
            valorReferencia: dto.contratoPosse.valorReferencia,
            cedente: dto.contratoPosse.cedente,
            locador: dto.contratoPosse.locador,
            numeroProcessoAdministrativo: dto.contratoPosse.numeroProcessoAdministrativo,
          })
        : undefined;

    const imovel = Imovel.criar({
      id: randomUUID(),
      matricula,
      cartorio: dto.cartorio,
      descricaoCartorial: dto.descricaoCartorial,
      endereco,
      areaTotal: dto.areaTotal,
      areaConstruida: dto.areaConstruida,
      geolocalizacao,
      unidadeGestoraId: dto.unidadeGestoraId,
      unidadeOrcamentaria: dto.unidadeOrcamentaria,
      categoriaUso: dto.categoriaUso,
      tipoPosse: dto.tipoPosse,
      contratoPosse,
      anoAquisicao: dto.anoAquisicao,
      valorOriginal,
      finalidadePublica: dto.finalidadePublica,
      criadoPorId,
    });

    return this.imovelRepository.salvar(imovel);
  }
}
