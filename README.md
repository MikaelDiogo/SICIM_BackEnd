# SICIM API — Sistema de Controle de Imóveis Municipais de Crateús

API REST do SICIM, sistema institucional desenvolvido para a Prefeitura Municipal de Crateús/CE, que centraliza o cadastro, a geolocalização e o controle contábil-patrimonial dos imóveis sob gestão do município, substituindo a consulta cartorial dispersa que existe hoje.

Este repositório contém apenas o backend. O frontend (SPA em React) está no repositório [SICIM_FrontEnd](https://github.com/MikaelDiogo/SICIM_FrontEnd).

---

## Índice

1. [Visão geral](#1-visão-geral)
2. [Domínio e regras de negócio](#2-domínio-e-regras-de-negócio)
3. [Perfis de acesso (RBAC)](#3-perfis-de-acesso-rbac)
4. [Arquitetura](#4-arquitetura)
5. [Tecnologias utilizadas](#5-tecnologias-utilizadas)
6. [Endpoints da API](#6-endpoints-da-api)
7. [Como rodar o projeto](#7-como-rodar-o-projeto)
8. [Banco de dados (Docker)](#8-banco-de-dados-docker)
9. [Migrations e seed](#9-migrations-e-seed)
10. [Variáveis de ambiente](#10-variáveis-de-ambiente)
11. [Testes](#11-testes)

---

## 1. Visão geral

A entidade central do sistema é o **imóvel**, que reúne em um único registro:

| Grupo de dados | Conteúdo |
|---|---|
| Identificação cartorial | Matrícula, cartório de registro, descrição literal do registro |
| Endereço | Logradouro, número, bairro, CEP, referência |
| Dimensões | Área total e área construída |
| Geolocalização | Coordenada geográfica (ponto), validada dentro do perímetro do município |
| Vinculação administrativa | Unidade gestora (secretaria) e unidade orçamentária |
| Dados contábeis | Valor original, depreciação acumulada, valor patrimonial líquido (calculado) |
| Posse | Tipo de posse (próprio, alugado, cedido, comodato, usufruto, permissão de uso) e contrato associado quando aplicável |

Todo o cadastro é alimentado manualmente pelos usuários do sistema (não há integração automática com cartório, sistema contábil ou SINTER nesta fase). Por isso a API aplica dupla validação (DTO de entrada e invariantes de domínio) e um fluxo de aprovação: todo imóvel criado ou alterado fica pendente até ser aprovado por um usuário com perfil adequado.

---

## 2. Domínio e regras de negócio

| # | Regra |
|---|---|
| 1 | Todos os dados do imóvel são inseridos manualmente pelo perfil Cadastro; não há integração automática com fontes externas nesta fase. |
| 2 | Todo campo crítico é validado em duas camadas: DTO (entrada da API) e invariante de domínio. |
| 3 | `valorPatrimonialLiquido = valorOriginal - depreciacaoAcumulada`, nunca negativo. O cálculo é sempre feito no backend. |
| 4 | A depreciação acumulada é calculada a partir de uma taxa por categoria de bem, podendo ser lançada manualmente ou recalculada. |
| 5 | Quando o tipo de posse é diferente de "Próprio", os dados do contrato de posse tornam-se obrigatórios — validado no backend. |
| 6 | A matrícula cartorial é única em todo o sistema. |
| 7 | A geolocalização deve estar dentro do perímetro (bounding box) do município de Crateús/CE. |
| 8 | Todo imóvel é criado com status "Pendente de Aprovação" e só passa a "Aprovado" mediante ação de um usuário com perfil de aprovação ou administração. |
| 9 | Toda criação, alteração, exclusão ou aprovação gera um registro imutável (append-only) em log de auditoria, com estado anterior e posterior. |
| 10 | A exclusão de imóvel é lógica (soft delete / status "Inativo"), nunca física. |

---

## 3. Perfis de acesso (RBAC)

| Perfil | Permissões |
|---|---|
| Cadastro | Criar e editar imóveis (ficam pendentes de aprovação); não aprova nem exclui |
| Consulta | Somente leitura — dashboard, mapa e relatórios |
| Aprovação | Tudo o que Cadastro faz, mais aprovar/reprovar imóveis pendentes |
| Administração | Acesso total, incluindo gestão de usuários e unidades gestoras |

---

## 4. Arquitetura

A API segue Clean Architecture organizada por módulo de domínio (`property`, `user`, `managing-unit`, `audit-log`, `auth`). A regra de dependência é sempre de fora para dentro: **o domínio não conhece NestJS, TypeORM ou HTTP.**

| Camada | Pasta | Responsabilidade |
|---|---|---|
| Domínio | `domain/` | Entidades de negócio puras, value objects (ex.: `RegistrationNumber`, `Geolocation`, `MonetaryValue`), enums e interfaces de repositório (portas). Sem dependência de framework. |
| Aplicação | `application/` | Casos de uso (`RegisterPropertyUseCase`, `ApprovePropertyUseCase`, etc.) que orquestram as entidades de domínio através das portas. |
| Infraestrutura | `infrastructure/` | Implementações concretas: entidades TypeORM, repositórios TypeORM, hashing de senha, PostGIS. |
| Interface (web) | `interface/` | Controllers REST, DTOs de request/response, presenters e filtro global de exceções de domínio. |

Cada módulo replica essa estrutura de quatro camadas internamente (`src/modules/<modulo>/{domain,application,infrastructure,interface}`).

Princípios SOLID aplicados:

| Princípio | Aplicação no domínio |
|---|---|
| Single Responsibility | Cada serviço de domínio (ex.: calculadora de depreciação) muda apenas se a regra contábil mudar |
| Open/Closed | Novas regras de posse são adicionadas por nova estratégia, sem alterar código já testado |
| Liskov Substitution | Qualquer implementação de um repositório (TypeORM hoje, outro amanhã) substitui a anterior sem quebrar os casos de uso |
| Interface Segregation | Interfaces pequenas e específicas por responsabilidade, em vez de interfaces genéricas |
| Dependency Inversion | Casos de uso dependem de interfaces (portas) definidas no domínio; o NestJS injeta a implementação concreta via token (`Symbol`) |

---

## 5. Tecnologias utilizadas

| Camada | Tecnologia | Motivo da escolha |
|---|---|---|
| Framework | NestJS + TypeScript | Estrutura modular opinativa, injeção de dependência nativa, decorators organizam bem Clean Architecture |
| ORM | TypeORM | Produtividade em CRUD de entidades ricas, com suporte a queries nativas para relatórios |
| Banco de dados | PostgreSQL 16 + PostGIS | Armazena geolocalização como `geometry(Point, 4326)`, permitindo consultas espaciais nativas |
| Migração de schema | TypeORM Migrations | Versionamento de schema auditável |
| Autenticação | Passport + JWT (`@nestjs/passport`, `passport-jwt`, `@nestjs/jwt`) | Autenticação stateless compatível com SPA |
| Hash de senha | bcryptjs | Armazenamento seguro de credenciais |
| Validação | class-validator + class-transformer | Validação declarativa nos DTOs de entrada |
| Configuração | @nestjs/config | Variáveis de ambiente tipadas |
| Documentação de API | @nestjs/swagger | Contrato de API sincronizado com o código, exposto em `/docs` |
| Segurança HTTP | helmet, @nestjs/throttler | Cabeçalhos de segurança e limitação de requisições (rate limiting) |
| Testes | Jest | Testes unitários e de integração |

---

## 6. Endpoints da API

Todos os endpoints retornam/consomem JSON. A documentação interativa (Swagger) fica disponível em `/docs` quando a API está em execução.

| Módulo | Método | Rota | Descrição |
|---|---|---|---|
| Auth | POST | `/auth/login` | Autentica um usuário e retorna o token JWT |
| Users | POST | `/users` | Cria um novo usuário |
| Managing Units | POST | `/managing-units` | Cadastra uma unidade gestora |
| Managing Units | GET | `/managing-units` | Lista unidades gestoras |
| Managing Units | GET | `/managing-units/:id` | Consulta uma unidade gestora |
| Properties | POST | `/properties` | Cadastra um imóvel (fica pendente de aprovação) |
| Properties | GET | `/properties` | Lista imóveis com filtros |
| Properties | GET | `/properties/:id` | Consulta um imóvel |
| Properties | PATCH | `/properties/:id` | Atualiza um imóvel |
| Properties | PATCH | `/properties/:id/approve` | Aprova um imóvel pendente |
| Properties | PATCH | `/properties/:id/deactivate` | Inativa um imóvel (exclusão lógica) |
| Properties | PATCH | `/properties/:id/recalculate-depreciation` | Recalcula a depreciação do imóvel |
| Audit Logs | GET | `/audit-logs` | Lista o histórico de auditoria |

Rotas protegidas exigem o cabeçalho `Authorization: Bearer <token>` obtido no login, e são restritas por perfil de acesso conforme a seção 3.

---

## 7. Como rodar o projeto

### 7.1 Pré-requisitos

| Ferramenta | Uso |
|---|---|
| Node.js 20+ | Executar a API |
| npm | Gerenciador de pacotes |
| Docker e Docker Compose | Subir o banco de dados PostgreSQL/PostGIS |

### 7.2 Passo a passo

```bash
# instalar dependências
npm install

# subir o banco de dados (ver seção 8)
docker compose up -d

# rodar as migrations
npm run migration:run

# (opcional) criar um usuário administrador inicial
npm run seed:admin

# subir a API em modo desenvolvimento (watch)
npm run start:dev
```

A API sobe por padrão em `http://localhost:3000`, e a documentação Swagger fica em `http://localhost:3000/docs`.

### 7.3 Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run start:dev` | Sobe a API em modo watch |
| `npm run build` | Compila o projeto para `dist/` |
| `npm run start:prod` | Executa a API já compilada |
| `npm run lint` | Executa o ESLint com correção automática |
| `npm run test` / `test:e2e` / `test:cov` | Testes unitários, end-to-end e cobertura |
| `npm run migration:generate` / `migration:run` / `migration:revert` | Gerencia migrations do TypeORM |
| `npm run seed:admin` | Cria o usuário administrador inicial |

---

## 8. Banco de dados (Docker)

O banco de desenvolvimento é definido em `docker-compose.yml` e usa a imagem oficial do PostGIS sobre PostgreSQL 16:

```yaml
services:
  postgres:
    image: postgis/postgis:16-3.4-alpine
    container_name: sicim-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: sicim
      POSTGRES_USER: sicim
      POSTGRES_PASSWORD: sicim_dev_pass
    ports:
      - '5432:5432'
    volumes:
      - sicim_pgdata:/var/lib/postgresql/data

volumes:
  sicim_pgdata:
```

Para subir o banco:

```bash
docker compose up -d
```

Para acompanhar os logs do container:

```bash
docker compose logs -f postgres
```

Para parar o banco mantendo os dados (o volume `sicim_pgdata` persiste):

```bash
docker compose stop
```

Para remover o container e o volume (apaga todos os dados):

```bash
docker compose down -v
```

Credenciais padrão de desenvolvimento (definidas em `docker-compose.yml` e espelhadas em `.env`):

| Variável | Valor |
|---|---|
| Host | `localhost` |
| Porta | `5432` |
| Banco | `sicim` |
| Usuário | `sicim` |
| Senha | `sicim_dev_pass` |

Essas credenciais são apenas para desenvolvimento local e não devem ser usadas em produção.

---

## 9. Migrations e seed

O schema do banco é versionado via migrations do TypeORM, localizadas em `src/shared/infrastructure/database/migrations/`.

| Comando | Efeito |
|---|---|
| `npm run migration:generate -- <nome>` | Gera uma nova migration a partir das diferenças entre as entidades e o schema atual |
| `npm run migration:create <nome>` | Cria uma migration em branco |
| `npm run migration:run` | Aplica as migrations pendentes no banco |
| `npm run migration:revert` | Reverte a última migration aplicada |
| `npm run seed:admin` | Cria o usuário administrador inicial para primeiro acesso |

---

## 10. Variáveis de ambiente

Arquivo `.env` na raiz do projeto:

| Variável | Descrição | Exemplo (desenvolvimento) |
|---|---|---|
| `DB_HOST` | Host do PostgreSQL | `localhost` |
| `DB_PORT` | Porta do PostgreSQL | `5432` |
| `DB_USERNAME` | Usuário do banco | `sicim` |
| `DB_PASSWORD` | Senha do banco | `sicim_dev_pass` |
| `DB_NAME` | Nome do banco | `sicim` |
| `NODE_ENV` | Ambiente de execução | `development` |
| `JWT_SECRET` | Segredo usado para assinar os tokens JWT | `sicim_dev_secret` |
| `PORT` | Porta em que a API sobe (opcional, padrão `3000`) | `3000` |
| `CORS_ORIGIN` | Origem(ns) autorizadas para CORS, separadas por vírgula | `http://localhost:5173` |

Em produção, os segredos (`JWT_SECRET`, senha do banco) devem ser gerados de forma segura e nunca reutilizar os valores de desenvolvimento.

---

## 11. Testes

| Comando | Escopo |
|---|---|
| `npm run test` | Testes unitários (Jest), executados sobre `src/` |
| `npm run test:e2e` | Testes end-to-end, executados sobre `test/` |
| `npm run test:cov` | Testes unitários com relatório de cobertura |

Casos de uso são testados isoladamente mockando os repositórios via suas interfaces de domínio; testes de integração exercitam os repositórios TypeORM contra um banco Postgres real.
