# SICIM — Sistema de Controle de Imóveis Municipais de Crateús

> Documento de contexto para desenvolvimento assistido (Claude Code). Contém visão geral, stack, arquitetura, entidades, regras de negócio e convenções de código. Leia isto antes de gerar qualquer código.

---

## 1. Visão Geral do Sistema

O SICIM é uma aplicação institucional para a Prefeitura Municipal de Crateús/CE, que centraliza o cadastro, a geolocalização e o controle contábil-patrimonial dos imóveis sob gestão do município, substituindo a consulta cartorial dispersa que existe hoje.

**Entidade central:** `Imovel` — agrega identificação cartorial, endereço, dimensões, geolocalização, vinculação administrativa (unidade gestora/orçamentária) e dados contábeis (valor original, depreciação, valor líquido calculado).

**Telas principais (já prototipadas em HTML/mockup):**
1. **Painel Geral** — dashboard com KPIs, mapa-resumo, tabela filtrável e ficha lateral detalhada
2. **Cadastro de Imóvel** — formulário em duas colunas com mini-mapa para captura de coordenada, cálculo automático do valor líquido, seção condicional para imóveis não-próprios
3. **Mapa Territorial** — visualização ampliada com tooltips por pin e filtros multi-dimensionais
4. **Relatórios** — filtros por período/unidade/status, gráficos de distribuição, exportação PDF/Excel/impressão

**Importante — natureza da entrada de dados:** não há importação automática de nenhuma base externa (cartório, sistema contábil, SINTER) nesta fase. **Todo o cadastro é alimentado manualmente pelos próprios usuários do sistema** (perfil Cadastro), incluindo latitude/longitude, valor do imóvel, área, tipo de posse etc. O mini-mapa no cadastro serve apenas como apoio visual para o usuário confirmar/ajustar a coordenada. Por isso, validação em duas camadas (DTO + regra de domínio) e o fluxo de aprovação por um segundo usuário (perfil Aprovação) são essenciais — não existe fonte externa para conferir os dados automaticamente.

---

## 2. Stack Técnica

| Camada | Tecnologia | Motivo |
|---|---|---|
| Backend | **NestJS + TypeScript** | Estrutura modular já opinativa, DI nativo, decorators organizam bem Clean Architecture, forte tipagem compartilhável com o frontend. |
| Persistência | **TypeORM + PostgreSQL** | Produtividade em CRUD de entidades ricas, com possibilidade de queries nativas para relatórios. |
| Banco de dados | **PostgreSQL 16 + PostGIS** | Armazenar geolocalização como `geometry(Point, 4326)` real, não lat/lng soltos — permite consultas espaciais nativas (raio, perímetro). |
| Migração de schema | **TypeORM migrations** (ou Flyway-like via CLI) | Versionamento de schema auditável, essencial em sistema público. |
| Autenticação | **Passport + JWT** (`@nestjs/passport`, `passport-jwt`, `@nestjs/jwt`) | Autenticação stateless, compatível com SPA. |
| Validação | **class-validator + class-transformer** | Validação declarativa nos DTOs de entrada. |
| Configuração | **@nestjs/config** | Variáveis de ambiente tipadas. |
| Documentação de API | **@nestjs/swagger** | Contrato de API sincronizado com o código. |
| Testes | **Jest** (unit) + **Testcontainers** (integração com Postgres real) | Evita divergência entre banco de teste e produção. |
| Frontend | **Vite + React + TypeScript** | SPA interno autenticado — SSR do Next.js não agrega valor aqui (sem necessidade de SEO). |
| UI Kit | **Mantine** | Componentes acessíveis (WCAG 2.1 AA), tema customizável com a paleta institucional verde/dourado. |
| Estado de servidor | **TanStack Query** | Cache e revalidação de dados vindos da API. |
| Formulários | **React Hook Form + Zod** | Validação no cliente espelhando as regras do backend. |
| Mapas | **MapLibre GL JS** | Biblioteca open source (fork do Mapbox GL), permite estilo 2D flat (sem prédios 3D) igual ao mockup, com tiles de OpenFreeMap (dev, sem chave) ou MapTiler (produção, mais controle visual). |

---

## 3. Arquitetura — Clean Architecture no NestJS

Regra de dependência: camadas externas dependem de camadas internas, nunca o contrário. **O domínio não conhece NestJS, não conhece TypeORM, não conhece HTTP.**

### 3.1 Camadas

| Camada | Pasta | Responsabilidade |
|---|---|---|
| **Domínio** | `domain/` | Entidades de negócio puras (classes TypeScript simples, sem decorator de framework), Value Objects (`Matricula`, `Geolocalizacao`, `ValorMonetario`), enums de regra, e **interfaces de repositório** (portas). Zero dependência externa. |
| **Aplicação** | `application/` | Casos de uso (`CadastrarImovelUseCase`, `CalcularValorPatrimonialService`) que orquestram entidades de domínio via as portas. Contém a regra de orquestração. |
| **Infraestrutura** | `infrastructure/` | Implementações concretas: entidades TypeORM, repositórios TypeORM (implementam as portas do domínio), integração PostGIS, geração de PDF/Excel. |
| **Interface (web)** | `interface/` (controllers, dto) | Controllers REST, DTOs de request/response, tratamento global de exceções (`ExceptionFilter`). |

### 3.2 Estrutura de pastas proposta

```
src/
  modules/
    imovel/
      domain/
        entities/
          imovel.entity.ts
        value-objects/
          matricula.vo.ts
          geolocalizacao.vo.ts
          valor-monetario.vo.ts
        enums/
          tipo-posse.enum.ts
          categoria-uso.enum.ts
          status-imovel.enum.ts
        repositories/
          imovel.repository.ts          # interface (porta)
        errors/
          matricula-duplicada.error.ts
      application/
        use-cases/
          cadastrar-imovel.use-case.ts
          atualizar-imovel.use-case.ts
          consultar-imoveis.use-case.ts
          aprovar-imovel.use-case.ts
        dto/
          cadastrar-imovel.dto.ts
          atualizar-imovel.dto.ts
      infrastructure/
        persistence/
          imovel.orm-entity.ts
          imovel-typeorm.repository.ts
      interface/
        controllers/
          imovel.controller.ts
        presenters/
          imovel.presenter.ts
      imovel.module.ts
    usuario/
      (mesma estrutura: domain / application / infrastructure / interface)
    auditoria/
      (mesma estrutura)
  shared/
    domain/
      exceptions/
        domain.error.ts
    infrastructure/
      database/
        database.module.ts
      auth/
        jwt.strategy.ts
        jwt-auth.guard.ts
        roles.guard.ts
    interface/
      filters/
        http-exception.filter.ts
  main.ts
  app.module.ts
```

### 3.3 SOLID aplicado ao domínio do SICIM

- **S — Single Responsibility:** `CalculadoraDepreciacao` só muda se a regra contábil mudar; `ImovelController` só muda se o contrato HTTP mudar.
- **O — Open/Closed:** novas regras de posse devem ser adicionadas via nova implementação de uma estratégia (ex.: `RegraPosseStrategy`), sem alterar código já testado.
- **L — Liskov Substitution:** qualquer implementação de `ImovelRepository` (TypeORM hoje, outra tecnologia amanhã) deve substituir a outra sem quebrar os casos de uso que a consomem.
- **I — Interface Segregation:** interfaces pequenas e específicas — ex.: `RelatorioExporter` (PDF/Excel) separado de `ImovelRepository`, em vez de uma interface "gigante".
- **D — Dependency Inversion:** casos de uso dependem de interfaces de repositório (portas) definidas no domínio; o NestJS injeta a implementação concreta via `@Inject(IMOVEL_REPOSITORY)` com token de injeção, mas o caso de uso não sabe qual implementação é.

### 3.4 Convenções de código limpo

- Nomes de arquivos em `kebab-case`, classes em `PascalCase`, variáveis/métodos em `camelCase` (padrão TypeScript/Nest).
- Um caso de uso = uma classe com um método público (`execute()`), seguindo Command Pattern — facilita teste unitário isolado.
- DTOs de entrada sempre validados com `class-validator` (`@IsNotEmpty`, `@IsNumber`, `@ValidateNested`, etc.); nunca confiar em validação apenas no frontend.
- Entidades de domínio validam suas próprias invariantes no construtor/métodos (ex.: `Imovel.calcularValorLiquido()` nunca retorna negativo) — a regra vive no domínio, não no controller nem no service de infraestrutura.
- Tokens de injeção de dependência para interfaces de repositório (Nest não resolve interfaces puras em runtime): usar `Symbol` ou string constante, ex. `export const IMOVEL_REPOSITORY = Symbol('IMOVEL_REPOSITORY')`.
- Testes unitários para casos de uso (mockando o repositório via interface) e testes de integração com Testcontainers para os repositórios TypeORM reais.

---

## 4. Modelo de Domínio e Entidades

### 4.1 `Imovel`

| Atributo | Tipo | Regra |
|---|---|---|
| id | UUID | Chave primária |
| matricula | `Matricula` (VO) | Única no sistema; formato validado (ex.: `MAT-AAAA-NNNNN`) |
| cartorio | string | Nome do cartório de registro |
| descricaoCartorial | text | Descrição literal do registro de imóveis |
| endereco | `Endereco` (embutido) | Logradouro, número, bairro, CEP, referência |
| areaTotal / areaConstruida | decimal (m²) | `areaConstruida <= areaTotal` |
| geolocalizacao | `Geolocalizacao` (VO — Point PostGIS, SRID 4326) | Deve estar dentro do bounding box de Crateús/CE |
| unidadeGestora | FK → UnidadeGestora | Secretaria responsável |
| unidadeOrcamentaria | string/FK | Código orçamentário (integração contábil futura) |
| categoriaUso | enum `CategoriaUso` | Administrativo, Educacional, Saúde, Assistencial, Cultural, Outro |
| tipoPosse | enum `TipoPosse` | Próprio, Alugado, Cedido, Comodato, Usufruto, Permissão de Uso |
| contratoPosse | `ContratoPosse` (opcional) | Obrigatório quando `tipoPosse !== Próprio` |
| anoAquisicao | integer | Ano de aquisição/incorporação |
| valorOriginal | decimal | Valor de aquisição/avaliação |
| depreciacaoAcumulada | decimal | Calculado (ver regras de negócio) |
| valorPatrimonialLiquido | decimal (derivado) | `valorOriginal - depreciacaoAcumulada`, nunca negativo |
| finalidadePublica | text | Descrição livre da destinação de uso público |
| status | enum `StatusImovel` | Rascunho, Pendente de Aprovação, Aprovado, Inativo |

### 4.2 `ContratoPosse`
- `tipoPosse` (herdado do contexto do imóvel)
- `dataInicio` / `dataFim`
- `valorMensal` (aluguel/permissão) ou `valorReferencia` (cedido/comodato/usufruto)
- `cedente`/`locador` (nome e documento da contraparte, quando aplicável)
- `numeroProcessoAdministrativo`

### 4.3 `UnidadeGestora`
- `id`, `nome` (ex.: Secretaria de Educação), `sigla`, `tipo` (Secretaria, Autarquia, Fundação)

### 4.4 `Usuario` / `Perfil`
- `id`, `nome`, `matriculaFuncional`, `email` institucional, `senha` (hash), `perfil`
- enum `Perfil`: `CADASTRO`, `CONSULTA`, `APROVACAO`, `ADMINISTRACAO`

### 4.5 `LogAuditoria`
- `id`, `usuarioId`, `entidadeAfetada`, `entidadeId`, `acao` (CRIACAO/ALTERACAO/EXCLUSAO/APROVACAO), `dadosAntes` (JSON), `dadosDepois` (JSON), `timestamp`, `ipOrigem`
- Registro **imutável** — append-only, nunca alterado/apagado (exigência de auditoria/LGPD)

---

## 5. Regras de Negócio

1. Todos os dados do imóvel (matrícula, endereço, área, lat/lng, valor, tipo de posse etc.) são inseridos **manualmente** por usuário de perfil Cadastro — sem integração automática com fontes externas nesta fase. O mini-mapa serve apenas para o usuário posicionar/ajustar visualmente o pin.
2. Por isso, validação em duas camadas (DTO + invariante de domínio) é obrigatória para todos os campos críticos, e o fluxo de aprovação por um segundo usuário funciona como checagem extra antes do dado virar oficial.
3. `valorPatrimonialLiquido = valorOriginal - depreciacaoAcumulada`, nunca negativo (mínimo zero). Cálculo sempre no backend, nunca confiado ao frontend.
4. Depreciação acumulada calculada a partir de taxa por categoria de bem (parametrizável), permitindo lançamento manual ou cálculo automático anual futuro.
5. Quando `tipoPosse !== Próprio`, os campos de `ContratoPosse` tornam-se obrigatórios — validado no backend, não apenas ocultando/mostrando campos no formulário.
6. Matrícula cartorial é única em todo o sistema.
7. Geolocalização deve estar dentro do bounding box do município de Crateús/CE; fora disso, gera erro de validação.
8. Todo imóvel é criado com status `Pendente de Aprovação` e só vira `Aprovado` mediante ação de usuário com perfil `APROVACAO` ou `ADMINISTRACAO`.
9. Toda criação/alteração/exclusão/aprovação gera registro imutável em `LogAuditoria` com estado anterior e posterior.
10. Relatórios são gerados sob demanda a partir dos dados vigentes, exportáveis em PDF/Excel/impressão.
11. Exclusão de imóvel é **lógica** (soft delete / status `Inativo`), nunca física.

---

## 6. Perfis de Acesso (RBAC)

| Perfil | Permissões |
|---|---|
| Cadastro | Criar e editar imóveis (ficam Pendente de Aprovação); sem aprovar ou excluir |
| Consulta | Somente leitura — dashboard, mapa, relatórios |
| Aprovação | Tudo de Cadastro + aprovar/reprovar imóveis pendentes |
| Administração | Acesso total, incluindo gestão de usuários e unidades gestoras |

---

## 7. Mapas — Decisão Técnica

- **Biblioteca:** MapLibre GL JS (open source, BSD-3, renderização vetorial WebGL, estilo 2D flat sem prédios 3D — igual ao mockup original).
- **Tiles em desenvolvimento:** OpenFreeMap (gratuito, sem chave de API).
- **Tiles em produção (opcional):** MapTiler (chave gratuita, mais controle de estilo/cores e opção de 3D).
- **Interação esperada:** pin colorido por categoria, hover expande card de resumo, clique abre detalhe (drawer/painel lateral) e dá zoom suave (`flyTo`) até revelar as ruas do entorno — sem inclinação 3D por padrão.
- Protótipos HTML já validados com ambas as fontes de tile antes desta etapa de backend.

---

## 8. O que pedir ao Claude Code nesta primeira sessão

Sugestão de ordem de execução:
1. Reestruturar o projeto Nest recém-criado (`sicim-api`) para a árvore de pastas da seção 3.2, começando pelo módulo `imovel`.
2. Criar as entidades de domínio puras (`domain/entities`, `domain/value-objects`, `domain/enums`) sem nenhum decorator do NestJS/TypeORM.
3. Criar a interface do repositório (`domain/repositories/imovel.repository.ts`) com os métodos que os casos de uso vão precisar (`save`, `findById`, `findByMatricula`, `findAll` com filtros).
4. Criar o primeiro caso de uso: `CadastrarImovelUseCase`, recebendo o DTO validado e retornando a entidade de domínio criada.
5. Só depois disso, implementar a camada de infraestrutura (entidade TypeORM + repositório concreto) e o controller REST.
6. Configurar `docker-compose.yml` com PostgreSQL + PostGIS para desenvolvimento local antes de rodar a primeira migration.