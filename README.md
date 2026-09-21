# MyDevLab

MyDevLab e um portfolio tecnico e laboratorio pessoal de engenharia de software. A V1 prepara as rotas Home, About, Projects, Articles e Contact, com uma base simples para projetos, artigos, pesquisas e experimentos.

O projeto roda sem PHP, Composer, Laravel, Apache ou SQL Server. A aplicacao e executada dentro do Docker com Next.js, e o PostgreSQL fica isolado na rede interna do Compose.

## Stack

- Next.js 16 com App Router e TypeScript strict;
- React 19;
- Node.js 24 LTS no container;
- Tailwind CSS 4;
- PostgreSQL 18;
- Drizzle ORM, `pg` e `drizzle-kit`;
- Zod, ESLint e Vitest.

## Iniciar

Pre-requisito: Docker Desktop com Compose.

```bash
git clone <url-do-repositorio>
cd mydevlab
docker compose up --build
```

Abra [http://localhost:3000](http://localhost:3000). O codigo fica montado no container, com hot reload habilitado para o desenvolvimento no Windows.

O PostgreSQL nao publica uma porta no host. O app acessa o banco exclusivamente pelo hostname Docker `postgres` na rede interna `mydevlab_internal`.

## Comandos diarios

```bash
# iniciar em segundo plano
docker compose up -d --build

# acompanhar logs
docker compose logs -f app
docker compose logs -f postgres

# parar os containers
docker compose down

# rebuildar a imagem
docker compose build --no-cache

# rodar verificacoes dentro do container
docker compose exec app npm run lint
docker compose exec app npm run typecheck
docker compose exec app npm run test
docker compose exec app npm run build
```

## Banco de dados

O schema inicial contempla `projects`, `articles` e `contact_messages`. As migrations ficam versionadas em `drizzle/`.

```bash
# aplicar migrations no PostgreSQL do Compose
docker compose exec app npm run db:migrate

# gerar uma nova migration depois de alterar o schema
docker compose exec app npm run db:generate -- --name descricao_da_mudanca

# abrir o Drizzle Studio dentro do ambiente do projeto
docker compose exec app npm run db:studio

# acessar o PostgreSQL quando necessario
docker compose exec postgres psql -U mydevlab -d mydevlab
```

Os dados persistem no volume Docker `mydevlab_postgres_data`. Para remover os dados locais de forma intencional, use `docker compose down -v`.

## Variaveis de ambiente

O Compose usa somente variaveis especificas do projeto:

```text
MYDEVLAB_DATABASE_URL
MYDEVLAB_POSTGRES_DB
MYDEVLAB_POSTGRES_USER
MYDEVLAB_POSTGRES_PASSWORD
```

Os valores padrao sao locais e seguros para desenvolvimento. Se precisar customizar, copie `.env.example` para `.env` (ignorado pelo Git) e mantenha o hostname `postgres` na URL do banco.

Nao use `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE` ou qualquer variavel generica. O projeto nao acessa nem modifica configuracoes do ambiente corporativo ESW e nao altera variaveis do Windows.

## Estrutura principal

```text
src/app/          # layout e rotas
src/components/   # componentes de interface
src/db/           # conexao e schema Drizzle
src/validations/  # schemas Zod
drizzle/          # migrations
public/           # assets estaticos
tests/            # testes Vitest
```

Consulte [AGENTS.md](AGENTS.md) para as convencoes de implementacao, isolamento e revisao.

## Privacidade e licenca

Nao adicione credenciais, chaves, endpoints privados, codigo proprietario, informacoes de clientes ou detalhes confidenciais ao repositorio. O codigo e licenciado sob MIT conforme [LICENSE](LICENSE); conteudo editorial e ativos originais permanecem reservados salvo indicacao explicita.
