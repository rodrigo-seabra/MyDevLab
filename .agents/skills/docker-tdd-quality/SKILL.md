---
name: docker-tdd-quality
description: >-
  Diretrizes de TDD, organização de testes (unit e integration) e Quality Gates executados estritamente dentro do container Docker Compose. Use antes de concluir qualquer tarefa ou ao implementar e refatorar funcionalidades com testes.
---

# Docker TDD & Quality Pipeline — MyDevLab

Este documento estabelece as diretrizes de desenvolvimento orientado a testes (TDD), controle de qualidade e critérios de aceite (Definition of Done) no MyDevLab.

---

## 1. Regra de Execução: Docker First & Docker Only

O ambiente do projeto não pressupõe Node.js, npm ou PostgreSQL instalados no sistema operacional hospedeiro.

- Todos os comandos de execução de testes, linting, compilação e verificação de tipos **devem** ser executados dentro do container Docker `app`.
- Se os containers não estiverem rodando no momento da execução, inicie-os em background antes de executar comandos:
  ```bash
  docker compose up -d
  ```

---

## 2. Estrutura e Organização de Testes (`tests/`)

A suíte de testes em Vitest é organizada por escopo de isolamento:

```text
tests/
├── unit/                   # Testes unitários puros (rápidos, sem I/O externo)
│   ├── validations/        # Validação de schemas Zod (regras de campo, tamanhos, formatos)
│   ├── domain/             # Regras de negócio puras (transições de estado, cálculos)
│   └── lib/                # Utilitários puros (funções auxiliares, formatação)
└── integration/            # Testes de integração (com I/O ou banco de dados)
    ├── db/                 # Operações Drizzle persistindo no PostgreSQL real
    ├── actions/            # Server Actions com validação, permissões e persistência
    └── flows/              # Fluxos completos de casos de uso (UC-01, UC-02, etc.)
```

### Diretrizes de Escrita de Testes:
1. **Testes Unitários**:
   - Devem ser determinísticos e rápidos.
   - Não devem tentar conectar ao banco ou fazer chamadas de rede.
   - Testam exaustivamente casos de sucesso, erros de validação, limites de tamanho e valores nulos/inválidos.
2. **Testes de Integração**:
   - Utilizam a conexão real do PostgreSQL rodando no container Docker.
   - Limpam ou isolam dados criados para evitar interferência entre testes.
   - Validam a integridade de chaves estrangeiras, transações e restrições de unicidade.

---

## 3. Ciclo TDD (Red-Green-Refactor)

Ao implementar uma nova funcionalidade, caso de uso ou regra de negócio:

1. **Red**: Escreva o teste especificando o comportamento esperado e as restrições. Execute o teste e confirme que ele falha pela razão correta:
   ```bash
   docker compose exec app npm run test -- tests/unit/<arquivo>.test.ts
   ```
2. **Green**: Escreva a implementação mínima necessária em `src/` para fazer o teste passar.
3. **Refactor**: Melhore o código, elimine duplicações e garanta tipagem estrita sem quebrar os testes.

---

## 4. Quality Gate Obrigatório (Definition of Done)

Nenhuma tarefa ou modificação é considerada pronta se não passar nos três pilares de qualidade:

1. **Testes Unitários e de Integração**:
   ```bash
   docker compose exec app npm run test
   ```
2. **Análise Estática e Linting**:
   ```bash
   docker compose exec app npm run lint
   ```
3. **Verificação Estrita de Tipos**:
   ```bash
   docker compose exec app npm run typecheck
   ```

> **Atenção**: Nunca use `|| true` ou ignore erros com `ts-ignore`/`eslint-disable` sem justificativa extrema documentada. Todos os comandos devem retornar código de saída `0`.

---

## 5. Política de Commits no Git (Conventional Commits)

Após a aprovação completa nos Quality Gates, realize commits pequenos e atômicos seguindo o padrão Conventional Commits:

- `feat(<escopo>)`: Nova funcionalidade (ex: `feat(db): add contents polymorphic schema`)
- `fix(<escopo>)`: Correção de bug (ex: `fix(auth): enforce password length validation`)
- `test(<escopo>)`: Adição ou ajuste de testes (ex: `test(validations): add review rejection reason tests`)
- `refactor(<escopo>)`: Refatoração sem mudança de comportamento externo
- `chore(<escopo>)`: Ajustes de dependências, docker ou tarefas auxiliares
- `docs(<escopo>)`: Atualizações de documentação e skills

Antes de comitar:
1. Verifique `git status` e `git diff`.
2. Certifique-se de que nenhum segredo, arquivo `.env` com dados reais ou lixo temporário esteja incluído no diff.
3. Não use force push e não altere histórico compartilhado.

