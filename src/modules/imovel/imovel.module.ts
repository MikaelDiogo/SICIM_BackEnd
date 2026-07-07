import { Module } from '@nestjs/common';
import { CadastrarImovelUseCase } from './application/use-cases/cadastrar-imovel.use-case';
import { IMOVEL_REPOSITORY } from './domain/repositories/imovel.repository';

// Repositório concreto será adicionado na próxima sessão (camada de infraestrutura)
// Por enquanto o módulo serve como esqueleto para os casos de uso

@Module({
  providers: [
    CadastrarImovelUseCase,
    // {
    //   provide: IMOVEL_REPOSITORY,
    //   useClass: ImovelTypeormRepository,  // será adicionado na sessão 2
    // },
  ],
  exports: [CadastrarImovelUseCase],
})
export class ImovelModule {}
