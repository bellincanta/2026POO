# Aula — Passo a passo do Backend do appEstoque (NestJS + Prisma + PostgreSQL)


# 1. Visão geral — o restaurante do estoque

Neste tutorial vamos construir a API que o nosso frontend já espera: login com crachá, categorias, produtos e movimentações guardados no PostgreSQL. 

## 1.1 A cena do restaurante

> "Um pedido chegando na API é um pedido chegando num restaurante. O garçom (Controller) anota, mas não cozinha. O maître (ValidationPipe) confere se a comanda foi escrita direito. A cozinha (Service) é onde as regras acontecem: 'não dá para tirar 10 do estoque se só tem 3'. O almoxarife (Prisma) é o único que fala a língua da despensa. E a despensa (PostgreSQL) é onde as coisas ficam guardadas de verdade — quando o restaurante fecha, o que está lá continua lá."

Dois personagens que vocês já conhecem do frontend voltam aqui: o **crachá** (o token JWT) e a **catraca** (o Guard, que só libera quem tem crachá válido).

```mermaid
flowchart LR
  F[Frontend React] -->|POST /movimentacoes| C[Catraca<br/>JwtAuthGuard]
  C --> M[Maitre<br/>ValidationPipe]
  M --> G[Garcom<br/>Controller]
  G --> K[Cozinha<br/>Service]
  K --> A[Almoxarife<br/>Prisma]
  A --> D[(Despensa<br/>PostgreSQL)]
```

Cada seta é uma etapa das próximas aulas. Vocês só vão escrever regra de negócio na cozinha; o resto é encanamento que o NestJS já entrega pronto.

## 1.2 Por que estas versões (leia antes de instalar)

Quando montei o projeto, algumas versões mais novas deram problema. Por isso vamos fixar estas:

| Item | O que acontece com a versão mais nova | O que vamos usar |
|---|---|---|
| NestJS | O `@nestjs/cli` mais novo (12) gera projeto em ESM e já vem com Vitest, não com Jest — e o Jest não roda nele sem gambiarra no Node 22 | NestJS 11 (`@nestjs/cli@11`), que gera CommonJS + Jest + Supertest, como a stack pede |
| Bibliotecas do Nest | `@nestjs/swagger` mais recente exige Nest 12 | Instalar a família 11: `@nestjs/swagger@11`, `@nestjs/jwt@11`, `@nestjs/config@4` |
| Prisma | A versão 8 está em release candidate | Prisma 6 (`prisma@6` e `@prisma/client@6`) |
| Preço do produto | O ideal em sistema financeiro é `Decimal` | `Float`, porque o frontend espera `preco: number`. Vamos conversar sobre arredondamento em aula |
| Senha | — | `bcryptjs` (JavaScript puro, não precisa compilar nada na sua máquina) |

## 1.3 Pré-requisitos

- Node.js 20 ou superior
- Docker Desktop rodando (para o PostgreSQL, sem instalar banco na máquina)
- O frontend que fizemos nas aulas anteriores, para ligar os dois no final
- Uma ferramenta para testar rotas: a própria página do Swagger, ou a extensão REST Client do VS Code

## 1.4 Roteiro das aulas

| Etapa | Assunto |
|---|---|---|
| 1 | PostgreSQL no Docker + projeto NestJS | 
| 2 | Prisma: schema, migrate e seed |
| 3 | Primeiro módulo CRUD: Categorias |

---

# 2. Etapa 1 — A despensa (PostgreSQL) e a cozinha vazia (NestJS)

Ao final desta aula você vai ter um banco rodando no Docker e uma API NestJS respondendo em `localhost:3000`.

> "Primeiro alugamos a despensa, depois montamos a cozinha. Sem despensa, não há o que guardar."

## 2.1 Subindo o banco

Criar o arquivo `docker-compose.yml` na raiz do repositório (fora das pastas `frontend` e `backend`):

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: estoque-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: estoque
    ports:
      - '5432:5432'
    volumes:
      - dados-postgres:/var/lib/postgresql/data

volumes:
  dados-postgres:
```

Subir o banco e conferir:

```bash
docker compose up -d
docker compose ps          # deve aparecer "running"
docker compose logs db | tail
```

Repare no **volume**: sem ele, apagar o container apaga a despensa inteira.

## 2.2 Criando o projeto NestJS

Criar o projeto (a versão 11 é de propósito — lembra da tabela de versões?):

```bash
npx @nestjs/cli@11 new backend --package-manager npm --skip-git
cd backend
npm run start:dev
```

Abrir `http://localhost:3000` — aparece "Hello World!". A cozinha está de pé, ainda sem pratos.

Instalar as ferramentas de trabalho:

```bash
npm install @nestjs/config@4 @nestjs/jwt@11 @nestjs/swagger@11 class-validator class-transformer bcryptjs @prisma/client@6
npm install -D prisma@6 @types/bcryptjs ts-node
```

## 2.3 Variáveis de ambiente e AppModule

Criar o `.env` dentro de `backend/`:

```text
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/estoque?schema=public"
JWT_SECRET="segredo-do-access-token"
JWT_REFRESH_SECRET="segredo-do-refresh-token"
PORT=3000
```

Ligar o `ConfigModule` e apagar o "Hello World" — `src/app.module.ts` fica assim (os módulos entram nas próximas etapas):

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
```

Apagar também `src/app.controller.ts`, `src/app.service.ts` e `src/app.controller.spec.ts`.

> **Pausa para pensar:** "O `.env` vai para o GitHub?"
>
> Nunca. Ele guarda senhas. O que vai é um `.env.example` com os nomes das variáveis e valores de exemplo.

**Erros comuns:** porta 5432 já ocupada por um PostgreSQL instalado na máquina (trocar para `'5433:5432'` e ajustar a `DATABASE_URL`); Docker Desktop fechado; esquecer o `cd backend` e instalar as dependências na pasta errada.

## 2.4 Comandos do dia a dia

| Comando | Para que serve |
|---|---|
| `docker compose up -d` | liga a despensa em segundo plano |
| `docker compose down` | desliga (os dados ficam salvos no volume) |
| `docker compose down -v` | desliga e apaga os dados — usar só para começar do zero |
| `npm run start:dev` | liga a API recarregando a cada salvamento |

---

# 3. Etapa 2 — O almoxarife (Prisma): planta, prateleiras e primeiros produtos

O Prisma é o **almoxarife**: nós descrevemos as prateleiras em um arquivo, e ele constrói as prateleiras no banco e entrega funções prontas em TypeScript para mexer nelas.

## 3.1 A planta da despensa (`schema.prisma`)

Iniciar o Prisma:

```bash
npx prisma init
```

Escrever `prisma/schema.prisma` — a planta da despensa. Repare que é quase a mesma coisa que o `types/index.ts` do frontend:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Usuario {
  id           Int     @id @default(autoincrement())
  nome         String
  email        String  @unique
  senha        String
  refreshToken String?
}

model Categoria {
  id       Int       @id @default(autoincrement())
  nome     String    @unique
  produtos Produto[]
}

model Produto {
  id            Int            @id @default(autoincrement())
  nome          String
  preco         Float
  quantidade    Int            @default(0)
  categoriaId   Int
  categoria     Categoria      @relation(fields: [categoriaId], references: [id])
  movimentacoes Movimentacao[]
}

enum TipoMovimentacao {
  ENTRADA
  SAIDA
}

model Movimentacao {
  id         Int              @id @default(autoincrement())
  produtoId  Int
  produto    Produto          @relation(fields: [produtoId], references: [id])
  tipo       TipoMovimentacao
  quantidade Int
  criadoEm   DateTime         @default(now())
}
```

| Símbolo | O que significa na despensa |
|---|---|
| `@id @default(autoincrement())` | a etiqueta numérica de cada item, gerada pelo banco |
| `@unique` | não pode ter duas prateleiras "Bebidas" |
| `String?` | o `?` diz "pode estar vazio" |
| `@relation(fields: [categoriaId], ...)` | cada produto pertence a uma categoria |
| `Produto[]` | o outro lado da relação: uma categoria tem vários produtos |
| `enum` | lista fechada de valores — igual ao type `TipoMovimentacao` do front |

## 3.2 Construindo as prateleiras (`migrate`)

Criar as prateleiras de verdade no banco:

```bash
npx prisma migrate dev --name inicial
```

Esse comando faz três coisas: escreve o SQL em `prisma/migrations/`, roda esse SQL no PostgreSQL e gera o cliente TypeScript. Abra o arquivo `.sql` gerado: ele é a ponte entre o que você escreveu e o SQL que você já conhece.

## 3.3 O serviço que conversa com o almoxarife

Criar `src/prisma/prisma.service.ts`:

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // onModuleInit: o Nest chama isso quando a aplicação sobe
  async onModuleInit() {
    await this.$connect();
  }
}
```

E o módulo que deixa esse serviço disponível para todo mundo — `src/prisma/prisma.module.ts`:

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // só precisa importar uma vez, no AppModule
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

## 3.4 Os primeiros produtos (`seed`)

Criar `prisma/seed.ts` — os mesmos dados que o frontend usava como mock, agora de verdade:

```typescript
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // upsert: cria se não existe, mantém se existe (pode rodar várias vezes)
  const professor = await prisma.usuario.upsert({
    where: { email: 'professor@ifpr.edu.br' },
    update: {},
    create: {
      nome: 'Professor Nelson',
      email: 'professor@ifpr.edu.br',
      senha: await bcrypt.hash('123456', 10), // nunca salvar senha pura
    },
  });

  const bebidas = await prisma.categoria.upsert({
    where: { nome: 'Bebidas' },
    update: {},
    create: { nome: 'Bebidas' },
  });
  const limpeza = await prisma.categoria.upsert({
    where: { nome: 'Limpeza' },
    update: {},
    create: { nome: 'Limpeza' },
  });

  await prisma.produto.createMany({
    data: [
      { nome: 'Refrigerante 2L', preco: 8.5, quantidade: 20, categoriaId: bebidas.id },
      { nome: 'Detergente', preco: 3.2, quantidade: 5, categoriaId: limpeza.id },
    ],
    skipDuplicates: true,
  });

  console.log(`Seed pronto! Usuário: ${professor.email} / senha 123456`);
}

main().finally(() => prisma.$disconnect());
```

Registrar o seed no `package.json` e rodar:

```json
"prisma": { "seed": "ts-node prisma/seed.ts" }
```

```bash
npx prisma db seed
npx prisma studio       # abre uma tela no navegador para ver as tabelas
```

> **Pausa para pensar:** "Por que a senha vira aquele texto embaralhado?"
>
> O hash é de mão única. Se o banco vazar, ninguém descobre a senha original; na hora do login comparamos hashes, nunca textos.

**Erros comuns:** rodar `migrate` com o Docker desligado (erro "Can't reach database server"); mexer no `schema.prisma` e esquecer de rodar `migrate dev` de novo; editar um arquivo em `prisma/migrations/` — esses arquivos são histórico, não se apagam nem se editam.

---

# 4. Etapa 3 — O primeiro prato: módulo de Categorias

Este é o **molde** que vamos repetir em todos os módulos: garçom (controller), cozinha (service), comanda (DTO). Depois desta aula, Produtos e Movimentações são "o mesmo, com outro tempero".

```mermaid
flowchart LR
  R[Requisicao] --> C[categorias.controller.ts<br/>rotas e verbos HTTP]
  C --> S[categorias.service.ts<br/>regras e Prisma]
  S --> P[(PostgreSQL)]
  D[create-categoria.dto.ts<br/>formato aceito] -.confere.-> C
```

## 4.1 A estrutura (CLI)

Criar a estrutura com o CLI (ele já cria os três arquivos e registra o módulo):

```bash
npx nest g module categorias
npx nest g controller categorias --no-spec
npx nest g service categorias --no-spec
```

## 4.2 A comanda (DTO)

`src/categorias/dto/create-categoria.dto.ts`. É o único formato de pedido aceito:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty({ example: 'Bebidas' }) // aparece na documentação
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(2, { message: 'O nome precisa ter ao menos 2 letras' })
  nome: string;
}
```

## 4.3 A cozinha (Service)

`src/categorias/categorias.service.ts`. Aqui ficam as regras, e só aqui:

```typescript
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

@Injectable()
export class CategoriasService {
  // O Nest entrega o PrismaService pronto no construtor (injeção de dependência)
  constructor(private prisma: PrismaService) {}

  listar() {
    return this.prisma.categoria.findMany({ orderBy: { nome: 'asc' } });
  }

  async buscarUm(id: number) {
    const categoria = await this.prisma.categoria.findUnique({ where: { id } });
    if (!categoria) {
      // Virar 404 na resposta HTTP é trabalho do Nest, não nosso
      throw new NotFoundException(`Categoria ${id} não encontrada`);
    }
    return categoria;
  }

  async criar(dados: CreateCategoriaDto) {
    const jaExiste = await this.prisma.categoria.findUnique({ where: { nome: dados.nome } });
    if (jaExiste) {
      throw new ConflictException(`Já existe a categoria "${dados.nome}"`); // 409
    }
    return this.prisma.categoria.create({ data: dados });
  }

  async remover(id: number) {
    await this.buscarUm(id); // reaproveita a verificação
    return this.prisma.categoria.delete({ where: { id } });
  }
}
```

## 4.4 O garçom (Controller)

`src/categorias/categorias.controller.ts`. Ele só anota e repassa; nenhuma regra mora aqui:

```typescript
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';

@ApiTags('categorias')
@Controller('categorias') // prefixo das rotas: /categorias
export class CategoriasController {
  constructor(private categorias: CategoriasService) {}

  @Get()
  listar() {
    return this.categorias.listar();
  }

  @Get(':id')
  buscarUm(@Param('id', ParseIntPipe) id: number) {
    // ParseIntPipe: transforma "5" da URL em 5, e recusa "abc"
    return this.categorias.buscarUm(id);
  }

  @Post()
  criar(@Body() dados: CreateCategoriaDto) {
    return this.categorias.criar(dados);
  }

  @Delete(':id')
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.categorias.remover(id);
  }
}
```

## 4.5 O maître e os módulos

Ligar o maître em `src/main.ts`:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,            // joga fora campos que não estão no DTO
    forbidNonWhitelisted: true, // e avisa quando isso acontece
    transform: true,            // converte "5" em 5 quando o DTO pede number
  }),
);
```

E em `src/app.module.ts`, acrescentar `PrismaModule` e `CategoriasModule` na lista de `imports`.

## 4.6 Testando sem frontend

```bash
curl http://localhost:3000/categorias
curl -X POST http://localhost:3000/categorias -H "Content-Type: application/json" -d '{"nome":"Higiene"}'
curl -X POST http://localhost:3000/categorias -H "Content-Type: application/json" -d '{"nome":"X"}'
```

O terceiro comando deve responder **400** com a mensagem "O nome precisa ter ao menos 2 letras" — o maître barrou a comanda antes de a cozinha ver.

## 4.7 Quem faz o quê

| Camada | Pergunta que ela responde | O que nunca faz |
|---|---|---|
| DTO | "o pedido veio no formato certo?" | não acessa o banco |
| Controller | "qual rota e qual verbo?" | não tem `if` de regra de negócio |
| Service | "o que pode e o que não pode?" | não sabe o que é HTTP |
| Prisma | "como isso vira SQL?" | não decide regras |

> **Pausa para pensar:** "Por que o service joga uma exceção em vez de devolver `{ erro: '...' }`?"
>
> Assim o Nest transforma cada exceção no código HTTP certo (404, 409, 400) em um só lugar, e a cozinha continua sem precisar saber de HTTP.

**Erro comum:** esquecer o `@Injectable()` no service, ou esquecer de colocar o service em `providers` — o Nest reclama com "Nest can't resolve dependencies", que é a mensagem mais comum do framework. Vou provocar esse erro de propósito em aula para vocês reconhecerem quando ele aparecer.

---
