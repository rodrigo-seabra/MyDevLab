# AGENTS.md

## Projeto

MyDevLab é uma plataforma técnica pessoal que combina portfólio profissional, laboratório de engenharia de software, projetos, artigos, pesquisas e experimentos.

A V1 possui as rotas Home, About, Projects, Articles e Contact. O projeto deve permanecer simples, server-rendered por padrão e fácil de evoluir.

Experiências profissionais com PHP, ERPs legados, SQL Server, integrações e sistemas críticos fazem parte do contexto editorial do projeto, mas não fazem parte da stack de execução do MyDevLab.

---

## Stack atual

- Next.js 16 com App Router e `output: "standalone"`;
- React 19 e TypeScript com `strict: true`;
- Node.js 24 LTS dentro do Docker;
- Tailwind CSS 4;
- PostgreSQL 18;
- Drizzle ORM, `pg` e `drizzle-kit`;
- Zod para validação;
- ESLint, Vitest e TypeScript type checking;
- Docker Compose para desenvolvimento.

---

## Skills Especializadas (.agents/skills/)

O projeto conta com skills dedicadas para guiar os agentes nos fluxos críticos de engenharia. Consulte os runbooks antes de realizar modificações:

1. **`drizzle-database-workflow`** ([SKILL.md](file:///c:/Users/Rainha/Desktop/teste/MyDevHub/.agents/skills/drizzle-database-workflow/SKILL.md)): Modelagem modular de tabelas em `src/db/schema/`, geração de migrations versionadas e execução via Docker.
2. **`docker-tdd-quality`** ([SKILL.md](file:///c:/Users/Rainha/Desktop/teste/MyDevHub/.agents/skills/docker-tdd-quality/SKILL.md)): Fluxo de TDD, estrutura de testes (`tests/unit/` e `tests/integration/`) e Quality Gates obrigatórios.
3. **`nextjs-clean-fullstack`** ([SKILL.md](file:///c:/Users/Rainha/Desktop/teste/MyDevHub/.agents/skills/nextjs-clean-fullstack/SKILL.md)): Padrões de Server Components, Server Actions com `useActionState` e Zod, Tailwind CSS 4 e A11y.
4. **`domain-rules-guardian`** ([SKILL.md](file:///c:/Users/Rainha/Desktop/teste/MyDevHub/.agents/skills/domain-rules-guardian/SKILL.md)): Regras de negócio essenciais de `docs/domain/` (ciclo editorial, autorização Founder/Admin/Author, segregação de aprovação e auditoria).

---

## Estrutura do Repositório

```text
src/
  app/              # Rotas, layouts, estilos globais e actions de página
  components/       # Componentes reutilizáveis de interface (ui/ e layout)
  db/               # Conexão Drizzle e schema modular PostgreSQL
    schema/         # Schemas divididos por domínio (auth, contents, metadata, etc.)
  lib/              # Utilitários compartilhados (ex: cn.ts)
  services/         # Somente quando houver lógica de negócio concreta isolável
  types/            # Tipos compartilhados TypeScript
  validations/      # Schemas de validação Zod
drizzle/            # Migrations versionadas geradas pelo drizzle-kit
public/             # Assets estáticos
tests/
  unit/             # Testes unitários puros (schemas Zod, utilitários, cálculos)
  integration/      # Testes com banco de dados PostgreSQL e Server Actions
.agents/skills/     # Skills e runbooks dos agentes
docs/domain/        # Documentação da modelagem de domínio e regras de negócio
```

> **Atenção**: Não crie camadas artificiais, repositórios genéricos, microservices, CMS, sistemas externos de auth, filas ou abstrações sem requisito concreto.

---

## Comandos e Execução em Ambiente Docker

O ambiente esperado não exige Node.js, npm ou PostgreSQL instalados no sistema operacional hospedeiro. **Todos os comandos devem ser executados via Docker Compose**:

```bash
# Garantir containers ativos
docker compose up -d

# Executar migrations
docker compose exec app npm run db:migrate

# Quality Gates (obrigatórios antes de concluir tarefas)
docker compose exec app npm run lint
docker compose exec app npm run typecheck
docker compose exec app npm run test

# Build de produção
docker compose exec app npm run build
```

A aplicação fica disponível em `http://localhost:18080`. Para o fluxo local, o bind mount do Compose provê hot reload dentro do container.

---

## Banco e Isolamento

O PostgreSQL é a fonte de verdade persistente. Alterações de schema devem ser feitas no schema Drizzle (`src/db/schema/`) e geradas como migrations em `drizzle/`.

Use exclusivamente estas variáveis de ambiente específicas do projeto:
- `MYDEVLAB_DATABASE_URL`
- `MYDEVLAB_POSTGRES_DB`
- `MYDEVLAB_POSTGRES_USER`
- `MYDEVLAB_POSTGRES_PASSWORD`

Nunca use `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE` ou variáveis genéricas. O app conecta obrigatoriamente ao hostname Docker `postgres`.

Não leia, altere, sobrescreva ou reutilize configurações de ambientes externos corporativos. Não altere variáveis de ambiente do Windows nem instalações locais de PHP. Credenciais reais não podem ser commitadas; use `.env.example` para referências seguras.

---

## Quality Gate e Definition of Done

Nenhuma tarefa é considerada concluída sem que:
1. Todos os testes em `tests/` passem com sucesso (`npm run test`).
2. A verificação estática não acuse erros nem warnings não justificados (`npm run lint`).
3. A compilação estrita de tipos passe sem erros (`npm run typecheck`).
4. As regras de negócio de `docs/domain/` sejam rigorosamente respeitadas (ver `domain-rules-guardian`).

---

## Convenções de Implementação

- **Server Components Primeiro**: Prefira Server Components e HTML semântico; limite `'use client'` à interatividade estritamente necessária.
- **Mutações Seguras**: Formulários e mutações via Server Actions em arquivos dedicados `actions.ts`, validados com Zod e consumidos com `useActionState` (React 19).
- **TypeScript Estrito**: Evite `any`.
- **Acessibilidade**: Preserve labels associados, estados `:focus-visible`, headings consistentes e mensagens de validação acessíveis.
- **Transparência**: Não esconda falhas com `|| true` ou flags permissivas no lint/testes.

---

## Git e Commits

- Não remova `.git`, não altere histórico existente e nunca faça force push.
- Adote **Conventional Commits** atômicos após aprovação nos Quality Gates (`feat:`, `fix:`, `test:`, `refactor:`, `chore:`, `docs:`).
- Antes de qualquer commit, valide `git diff`, `git status` e certifique-se da ausência total de segredos ou arquivos temporários.
