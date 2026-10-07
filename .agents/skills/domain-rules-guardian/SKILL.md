---
name: domain-rules-guardian
description: >-
  Guia de validação e garantia de conformidade com as regras de negócio e modelo de domínio do MyDevLab (RN-001 a RN-016, ciclo editorial, níveis de usuário e auditoria). Use ao implementar lógica de negócio, autorização, transições de estado de conteúdo ou fluxos de aprovação.
---

# Domain & Business Rules Guardian — MyDevLab

Este documento sintetiza os invariantes e regras de negócio obrigatórios descritos na pasta `docs/domain/` (`scope.md`, `business-rules.md`, `domain-model.md`, `use-cases.md`), garantindo que nenhum agente introduza inconsistências de domínio no MyDevLab.

---

## 1. Núcleo de Identidade e Autorização

### Hierarquia e Níveis de Usuário:
1. **Visitante (Anônimo)**:
   - Acesso exclusivo a conteúdos públicos publicados e aprovados.
   - Pode explorar o grafo público e enviar formulário de contato.
   - **Nunca** possui registro na tabela `users`.
2. **Founder Principal**:
   - Autoridade máxima no sistema.
   - Cria contas de Admin e define suas capacidades.
   - **Prerrogativa exclusiva**: É o único que pode aprovar o próprio conteúdo (auto-aprovação).
   - É o único autorizado a visualizar e apagar mensagens de contato.
3. **Conta Recovery**:
   - Conta técnica de contingência criada no bootstrap.
   - Restrita estritamente à rota `/auth/recovery` mediante validação de segredo criptografado.
   - Capacidade restrita na V1: Redefinir senha e alterar email do Founder principal. Não é uma conta administrativa geral.
4. **Admin (Capacidades Delegadas)**:
   - Possui capacidades explicitamente registradas na tabela `admin_capabilities`.
   - **Não pode** criar ou promover outros Admins.
   - **Não pode** acessar mensagens de contato.
   - **Segregação Obrigatória de Aprovação (RN-013 / Decisão 4)**: Um Admin **nunca** pode aprovar conteúdo criado por ele mesmo.
5. **Author**:
   - Toda conta autenticada pode criar conteúdo como autora.
   - Author edita exclusivamente o próprio conteúdo na V1.

---

## 2. Ciclo Editorial e Invariantes de Conteúdo

### Estados Editoriais (`editorial_status`):
- `draft`: Rascunho privado do autor. Inacessível publicamente.
- `pending_review`: Conteúdo submetido para aprovação. Visível apenas ao autor, Founder e Admins com capacidade de revisão.
- `published`: Conteúdo aprovado e público.
- `archived`: Conteúdo desativado. Completamente ocultado da área pública e do grafo (deve retornar 404 para visitantes). Visível apenas no painel administrativo.

### Regras Críticas de Transição e Auditoria:
1. **Aprovação Obrigatória (RN-012)**:
   - Nenhum Project, Article ou Note se torna público sem registro formal de aprovação, mesmo se criado por Founder ou Admin.
2. **Edição de Conteúdo Publicado (RN-016 / Decisão 2)**:
   - Qualquer edição em campos públicos de um item já `published` retira o conteúdo do ar imediatamente, revertendo seu status para `pending_review`.
3. **Registro de Auditoria Imutável (RN-014, RN-015 / Decisão 5)**:
   - Toda decisão de aprovação ou rejeição deve inserir um registro na tabela `review_logs` (`content_id`, `reviewer_id`, `decision`, `reason`, `created_at`).
   - **Rejeição exige justificativa**: O campo `reason` é obrigatório na rejeição e deve conter no mínimo 20 caracteres.
4. **Notas Privadas**:
   - Notes marcadas como privadas são acessíveis unicamente pelo seu autor. Ao serem submetidas para aprovação, passam a ser visíveis aos revisores autorizados.

---

## 3. Rede de Conhecimento e Grafo (Taxonomia e Relações)

1. **Relações Simétricas e Sem Duplicatas (Decisão 8)**:
   - As conexões entre conteúdos (`content_relations`) são bidirecionais.
   - A tabela deve garantir par único sem duplicatas invertidas (se A relaciona com B, não deve haver duplicata B relaciona com A).
2. **Integridade do Grafo Público**:
   - O grafo interativo e a listagem pública de conteúdos relacionados devem retornar **exclusivamente** nós e arestas de conteúdos que estejam com status `published` e visibilidade pública.
   - Nenhum rascunho, item pendente ou item arquivado pode vazar na navegação por relações públicas.

---

## 4. Comunicação e Formulário de Contato

1. **Proteção contra Abuso (Decisão 11)**:
   - Formulário de contato público deve incluir campo honeypot oculto e controle de rate limiting no servidor.
2. **Armazenamento e Privacidade**:
   - Mensagens são persistidas na tabela `contact_messages` sem categoria pré-definida.
   - Somente o Founder principal tem permissão de leitura e exclusão das mensagens.

---

## 5. Checklist de Verificação de Regras de Domínio

Antes de concluir qualquer implementação envolvendo regras de negócio, o agente deve validar:

- [ ] Visitantes recebem 404 ao tentar acessar conteúdos que não sejam `published`?
- [ ] A aprovação de conteúdo registra `reviewer_id` e data em `review_logs`?
- [ ] Admins são impedidos de aprovar conteúdo próprio?
- [ ] A rejeição exige justificativa mínima de 20 caracteres?
- [ ] Edições em itens publicados revertem o status para `pending_review`?
- [ ] O grafo público filtra conteúdos arquivados, rascunhos e pendentes?
- [ ] Mensagens de contato só são acessíveis pela conta do Founder?

