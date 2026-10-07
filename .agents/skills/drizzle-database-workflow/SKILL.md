---
name: drizzle-database-workflow
description: >-
  Instruções e convenções para modelagem de schema no Drizzle ORM, geração de migrations versionadas e execução de migrações e seeds exclusivamente dentro do container Docker PostgreSQL no MyDevLab. Use ao criar tabelas, alterar colunas, gerar migrations ou manipular o banco de dados.
---

# Drizzle Database Workflow — MyDevLab

Este documento define o fluxo obrigatório para modelagem, evolução de schema e migrações no banco de dados PostgreSQL do MyDevLab.

---

## 1. Princípios e Diretrizes Fundamentais

1. **Fonte de Verdade Persistente**: O PostgreSQL é a única fonte de verdade.
2. **Execução Estrita no Docker**: Comandos de banco nunca devem ser executados no host local; devem rodar dentro do container da aplicação via Docker Compose.
3. **Isolamento de Variáveis**: Utilize exclusivamente:
   - `MYDEVLAB_DATABASE_URL`
   - `MYDEVLAB_POSTGRES_DB`
   - `MYDEVLAB_POSTGRES_USER`
   - `MYDEVLAB_POSTGRES_PASSWORD`
   - Hostname de conexão da aplicação: `postgres` (definido no `compose.yaml`).
4. **Sem Abstrações Artificiais**: Não crie repositórios genéricos ou camadas DAO abstratas desnecessárias. Use diretamente o cliente Drizzle tipado (`db.select()`, `db.insert()`, etc.).

---

## 2. Organização Modular do Schema (`src/db/schema/`)

O schema deve ser organizado modularmente por domínio funcional dentro de `src/db/schema/`, agregando e reexportando tudo em `src/db/schema/index.ts`:

```text
src/db/
├── index.ts                # Conexão Drizzle com pool node-postgres
├── schema.ts               # Reexporta todo o schema (export * from "./schema/index")
└── schema/
    ├── index.ts            # Agregador central exportando todos os módulos
    ├── auth.ts             # Tabelas users e admin_capabilities
    ├── contents.ts         # Tabela central contents e review_logs
    ├── metadata.ts         # Tabelas especializadas (project_metadata, article_metadata, note_metadata)
    ├── relations.ts        # Tabela content_relations (arestas do grafo simétrico)
    ├── tags.ts             # Tabelas tags e content_tags
    ├── media.ts            # Tabela media_assets (catálogo de arquivos)
    └── contact.ts          # Tabela contact_messages
```

---

## 3. Padrões de Definição de Tabelas

Ao definir tabelas no Drizzle:
- Chaves primárias: Utilize UUIDs com `defaultRandom()`: `uuid("id").defaultRandom().primaryKey()`.
- Timestamps com fuso horário: Sempre use `{ withTimezone: true }` para datas e horas (`created_at`, `updated_at`, `published_at`).
- Nomenclatura explícita: Nomes de tabelas em `snake_case` plural (ex: `contents`, `review_logs`). Nomes de colunas em `snake_case` (ex: `author_id`, `editorial_status`).
- Enums PostgreSQL: Utilize `pgEnum` para tipos enumerados fechados (ex: `user_role`, `content_type`, `editorial_status`, `visibility`).
- Foreign Keys explícitas: Declare restrições de integridade referencial com `.references(() => tabela.id, { onDelete: "..." })`.

---

## 4. Ciclo de Alteração e Migração de Schema

Siga rigorosamente estas etapas sequenciais:

### Etapa 1: Editar ou Criar o Schema
Modifique os arquivos correspondentes em `src/db/schema/<modulo>.ts` e garanta que estão exportados em `src/db/schema/index.ts`.

### Etapa 2: Gerar a Migration
Execute o `drizzle-kit generate` dentro do container:
```bash
docker compose exec app npm run db:generate
```
Isso criará um novo arquivo `.sql` versionado e metadados em `drizzle/`.

### Etapa 3: Inspecionar o Arquivo SQL Gerado
Abra e inspecione o arquivo SQL gerado em `drizzle/` para garantir:
- Não há remoção de tabelas ou colunas acidentais (`DROP`).
- Tipos de dados, defaults e constraints estão corretos.
- Nenhuma credencial foi inserida na migration.

### Etapa 4: Aplicar a Migration no PostgreSQL
Execute a aplicação da migration no banco:
```bash
docker compose exec app npm run db:migrate
```

### Etapa 5: Validação da Aplicação
Verifique se a aplicação continua compilando e executando sem erros de tipagem com o schema atualizado:
```bash
docker compose exec app npm run typecheck
docker compose exec app npm run test
```

