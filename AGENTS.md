# AGENTS.md

## Projeto

MyDevLab e uma plataforma tecnica pessoal que combina portfolio profissional, laboratorio de engenharia de software, projetos, artigos, pesquisas e experimentos.

A V1 possui as rotas Home, About, Projects, Articles e Contact. O projeto deve permanecer simples, server-rendered por padrao e facil de evoluir.

Experiencias profissionais com PHP, ERPs legados, SQL Server, integracoes e sistemas criticos fazem parte do contexto editorial do projeto, mas nao fazem parte da stack de execucao do MyDevLab.

## Stack atual

- Next.js 16 com App Router e `output: "standalone"`;
- React e TypeScript com `strict: true`;
- Node.js 24 LTS dentro do Docker;
- Tailwind CSS 4;
- PostgreSQL 18;
- Drizzle ORM, `pg` e `drizzle-kit`;
- Zod para validacao;
- ESLint, Vitest e TypeScript type checking;
- Docker Compose para desenvolvimento.


## Estrutura

```text
src/
  app/              # rotas, layout e estilos globais
  components/       # componentes reutilizaveis de interface
  db/               # conexao Drizzle e schema PostgreSQL
  lib/              # utilitarios pequenos e compartilhados
  services/         # somente quando houver logica de aplicacao real
  types/            # tipos compartilhados quando necessario
  validations/      # schemas Zod
drizzle/            # migrations versionadas
public/             # assets estaticos
tests/              # testes Vitest
```

Nao crie camadas artificiais, repositorios genericos, microservices, CMS, autenticacao, filas ou outras abstracoes sem requisito concreto.

## Comandos

O ambiente esperado nao exige Node.js, npm ou PostgreSQL instalados localmente:

```bash
docker compose up --build
docker compose exec app npm run db:migrate
docker compose exec app npm run lint
docker compose exec app npm run typecheck
docker compose exec app npm run test
docker compose exec app npm run build
```

A aplicacao fica em `http://localhost:3000`. Para o fluxo local, o bind mount do Compose habilita hot reload dentro do container.

## Banco e isolamento

O PostgreSQL e a fonte de verdade persistente. Alteracoes de schema devem ser feitas no schema Drizzle e geradas como migrations em `drizzle/`.

Use exclusivamente estas variaveis especificas do projeto:

- `MYDEVLAB_DATABASE_URL`;
- `MYDEVLAB_POSTGRES_DB`;
- `MYDEVLAB_POSTGRES_USER`;
- `MYDEVLAB_POSTGRES_PASSWORD`.

Nunca use `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE` ou outras variaveis genericas. O app deve conectar ao hostname Docker `postgres`, nunca a um host inferido do sistema operacional.

Nao leia, altere, sobrescreva ou reutilize configuracoes do ambiente corporativo ESW. Nao altere variaveis de ambiente do Windows, instalacoes de PHP ou arquivos fora deste repositorio.

Credenciais reais nao podem ser commitadas. O repositorio deve conter somente valores locais seguros em `.env.example`, quando necessario.

## Convencoes de implementacao

- Prefira Server Components e HTML semantico; use JavaScript no cliente somente quando houver necessidade real.
- Prefira saidas escapadas e validacao com Zod.
- Evite `any`; mantenha o TypeScript estrito.
- Use aliases `@/components`, `@/lib`, `@/db` e similares quando melhorarem a leitura.
- Mantenha nomes de tabelas e colunas explicitos e migrations reproduziveis.
- Nao esconda falhas com `|| true` ou equivalentes.
- Preserve acessibilidade basica: labels, foco visivel, headings coerentes, mensagens de erro uteis e texto alternativo.

## Git e revisao

Nao remova `.git`, nao altere historico existente e nunca faca force push. Antes de concluir uma tarefa, verifique `git diff`, `git status` e a ausencia de segredos no diff.
