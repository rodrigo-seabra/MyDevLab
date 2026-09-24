# Regras de negócio — MyDevLab V1

> Este documento registra regras derivadas do escopo e das decisões já fornecidas. Itens marcados **Pendente de decisão** continuam abertos. As regras descrevem o domínio; não definem ainda tabelas, endpoints ou implementação.

## 1. Contas, níveis e autorização

### RN-001 — Visitante não requer conta

Visitante é qualquer pessoa não autenticada. Visitante pode acessar somente os recursos públicos, usar o grafo público e enviar uma mensagem de contato.

### RN-002 — Toda conta autenticada pode ser autora

Toda conta interna pode criar conteúdo. Founder e Admin possuem capacidades adicionais ao nível Author; autorização e auditoria são aplicadas à conta e às suas capacidades, sem tratar Author como um papel adicional acumulado.

### RN-003 — Founder principal tem autoridade máxima

Há uma conta principal do Founder com acesso a todos os recursos, incluindo gestão de contas e configuração das permissões de Admin. Capacidades de Founder não podem ser delegadas.

### RN-004 — Admin recebe capacidades delegadas

O Founder seleciona para cada Admin capacidades de uma lista mantida pelo produto. Admin não pode criar, promover ou configurar outro Admin.

Capacidades candidatas para a V1:

- consultar itens submetidos para aprovação;
- aprovar/rejeitar conteúdo;
- editar conteúdo de outros Authors;
- gerenciar Tags;
- criar/remover relações entre conteúdos;
- gerenciar arquivos de mídia;
- arquivar/restaurar conteúdo;
- gerenciar contas Author, se essa delegação for confirmada.

Gestão de Admins, permissões de Admin, conta Founder/recovery e mensagens de contato são exclusivas do Founder. Admins não consultam nem apagam mensagens de contato.

**Pendente de decisão:** a lista final de capacidades, se consultar a fila de revisão é independente de aprovar, e se Admin pode criar/gerenciar contas Author.

### RN-005 — Author administra conteúdo próprio

Author pode criar e editar somente o próprio conteúdo. Founder pode administrar todos os conteúdos. Admin pode administrar conteúdo de outras contas somente quando tiver as capacidades correspondentes.

**Pendente de decisão:** tratamento de conteúdo e autoria quando uma conta Author é desativada ou removida.

## 2. Bootstrap e recuperação do Founder

### RN-006 — Bootstrap cria duas contas Founder

Na inicialização do serviço são provisionadas a conta principal do Founder e uma conta recovery separada. A conta recovery não é uma conta administrativa geral.

### RN-007 — Configuração inicial do Founder principal

No primeiro acesso, o Founder principal configura senha e autenticação multifator.

**Pendente de decisão:** se a conta recovery configura MFA no primeiro acesso e como suas credenciais iniciais são entregues.

### RN-008 — Segredo de recuperação é separado da senha

Um segredo definido no provisionamento da conta é exigido para autorizar reset de senha ou troca de email do Founder principal. Ele não substitui a senha nem é a senha da conta.

O segredo não deve ser armazenado em texto puro, incluído no código, versionado ou escrito em logs. A verificação deve usar armazenamento protegido e limitar tentativas.

**Pendente de decisão:** quem gera/define o segredo, como é entregue e rotacionado, qual confirmação adicional é exigida e que notificações são enviadas.

### RN-009 — Limites da conta recovery na V1

Na V1, a conta recovery pode redefinir senha e trocar email do Founder principal após validar o segredo de recuperação. Encerramento remoto de sessões e outros recursos avançados de recuperação ficam para V2.

## 3. Conteúdo e ciclo editorial

### RN-010 — Tipos de conteúdo da V1

O sistema administra Projects, Articles e Notes como conceitos distintos. Note pode ser curta, informal, pessoal ou técnica e pode ter mídia associada. Todos os tipos podem ter autoria, Tags, relações e arquivos associados conforme permissões.

### RN-011 — Draft não é público

Conteúdo salvo como rascunho não é retornado por listas, busca, páginas, Tags, relações ou grafo públicos. Preview autenticado não altera o estado editorial.

### RN-012 — Todo conteúdo público precisa ser aprovado

Project, Article ou Note só fica público depois de uma decisão de aprovação, inclusive conteúdo criado por Founder ou Admin. Submeter um item não o torna público.

### RN-013 — Permissão de aprovação

Founder pode aprovar o próprio conteúdo. Admin somente pode aprovar ou rejeitar quando o Founder lhe concedeu a capacidade de aprovação. Admin sem essa capacidade não pode aprovar conteúdo próprio nem de terceiros. Admin com a capacidade pode aprovar conteúdo do Founder.

**Pendente de decisão:** se Admin com capacidade pode aprovar o próprio conteúdo.

### RN-014 — A aprovação identifica o aprovador

Cada decisão de aprovação registra qual conta a executou. O mesmo princípio se aplica a rejeições.

**Recomendação para detalhar antes da implementação:** registrar também horário, decisão, item/versão revisada e, quando aplicável, justificativa. A identidade do aprovador é requisito confirmado; os demais dados ainda precisam ser aceitos como regra.

### RN-015 — Rejeição exige justificativa

Rejeitar uma submissão exige uma justificativa não vazia que atenda ao tamanho mínimo. Após rejeição, Author pode editar o conteúdo próprio e submetê-lo novamente.

**Pendente de decisão:** tamanho mínimo exato, se rejeições ficam preservadas no histórico e se a justificativa pode ser editada.

### RN-016 — Alterações públicas exigem nova aprovação

Alterar conteúdo já publicado exige nova aprovação quando a mudança afeta sua apresentação pública. Alterações exclusivamente administrativas, sem efeito público, não reiniciam o processo.

**Pendente de decisão:** lista dos campos que contam como apresentação pública e se a versão anteriormente aprovada permanece pública enquanto a nova revisão está pendente.

### RN-017 — Notes privadas

Uma Note privada só é acessível ao Author proprietário. Quando submetida para publicação, passa a ser acessível ao Author, ao Founder e aos Admins autorizados para revisão; continua fora da área pública até aprovação.

**Pendente de decisão:** o significado e as permissões de conteúdo privado para Projects e Articles, além das regras para Notes quando o Author é desativado.

### RN-018 — Preview é restrito

Preview de conteúdo não publicado nunca é acessível a visitantes. O servidor valida autoria e capacidades antes de apresentar o preview.

## 4. Tags, relações e grafo

### RN-019 — Tags podem ser associadas aos três tipos

Projects, Articles e Notes podem receber Tags. Visitantes podem navegar por Tags, mas veem apenas conteúdo público aprovado.

**Pendente de decisão:** regras de nome/slug, se Tags são globais e compartilhadas entre os tipos, quem pode criar/excluir Tags e o efeito de excluir uma Tag em uso.

### RN-020 — Relações conectam qualquer tipo de conteúdo

Project, Article e Note podem se relacionar com conteúdos de qualquer um dos três tipos. O domínio exige conexões muitos-para-muitos e a navegação deve formar uma rede.

**Pendente de decisão:** se relações são direcionadas ou simétricas, se possuem tipo/rótulo, como evitar duplicatas ou autorrelações e quem pode criá-las/removê-las.

### RN-021 — Grafo público respeita acesso

O grafo acessível a visitantes inclui somente nós e relações entre conteúdos publicados e públicos. Não deve revelar títulos, identificadores ou existência de conteúdo privado, pendente ou arquivado sem acesso público.

**Pendente de decisão:** filtros, busca, agrupamento, limites de nós e comportamento responsivo da visualização.

## 5. Mídia

### RN-022 — Uploads são associados a conteúdo

Arquivos enviados são validados, armazenados e associados a um ou mais conteúdos conforme a operação permitida à conta.

### RN-023 — Acesso à mídia acompanha a política do conteúdo

Arquivo associado a conteúdo não público não pode ser obtido por visitante apenas por conhecer sua URL. Conteúdo público aprovado pode expor os arquivos necessários à sua apresentação.

**Pendente de decisão:** tipos e tamanhos aceitos, armazenamento local ou externo, backups, remoção, arquivos órfãos e possibilidade de compartilhamento de um arquivo entre conteúdos.

## 6. Contato

### RN-024 — Mensagens são dirigidas ao Founder

O formulário não exige categoria predefinida. A mensagem é destinada ao Founder para propostas de trabalho ou assuntos da plataforma.

### RN-025 — Acesso e retenção de mensagens

Somente o Founder principal pode consultar e apagar mensagens de contato. Não há exclusão automática: o Founder decide quando apagar cada mensagem.

**Pendente de decisão:** campos obrigatórios, limites, proteção contra spam, notificações, registro de exclusão e eventual política de retenção legal/operacional.

## 7. Arquivamento

### RN-026 — Conteúdo pode ser arquivado e restaurado

Founder e Admins com capacidade correspondente podem arquivar/restaurar conteúdo. Author não recebe essa capacidade por padrão na V1.

**Pendente de decisão:** conteúdo arquivado fica inacessível ao público ou mantém uma página histórica? O que a URL retorna? Restaurar conteúdo que já foi público exige nova aprovação?

## 8. Segurança, validação e persistência

### RN-027 — Autorização é validada no servidor

Toda operação administrativa verifica no servidor a identidade, o nível da conta, as capacidades concedidas e a autoria/propriedade do recurso. A interface não é uma barreira de segurança.

### RN-028 — Entrada é validada antes de persistir

Dados enviados pelo cliente são validados no backend antes de gravar. O conteúdo público é renderizado de modo a não executar conteúdo ativo não confiável.

### RN-029 — PostgreSQL é a fonte de verdade

Conteúdo, autoria, decisões editoriais, Tags, relações e mensagens persistidas residem no PostgreSQL. Mídia binária usa o armazenamento definido para arquivos, com referência consistente a partir da aplicação.

### RN-030 — Segredos não entram no repositório

Senhas, segredo de recuperação, tokens e credenciais iniciais não podem ser hardcoded ou versionados. Bootstrap e ambientes locais/produção recebem segredos de forma operacional segura.

## 9. Estados editoriais — proposta a validar

Para representar os fluxos descritos, os estados candidatos são:

- `draft`: edição ainda não submetida;
- `pending_review`: submetido, visível somente a autores/revisores autorizados;
- `rejected`: rejeitado com justificativa, editável pelo Author proprietário e passível de reenvio;
- `published`: aprovado e elegível à exibição pública, desde que a visibilidade permita;
- `archived`: retirado do fluxo corrente, com comportamento público ainda a decidir.

**Atenção:** estes rótulos são uma proposta conceitual para revisar os casos de uso, não uma decisão de schema. A separação final entre estado editorial e visibilidade (por exemplo, `private`/`public`) será fechada antes do DBML.

## 10. Decisões necessárias antes do DBML

1. Fechar o catálogo de capacidades de Admin e se Admin pode gerenciar contas Author.
2. Definir aprovação pelo próprio Admin, além do Founder, e os dados completos do registro de revisão.
3. Definir tamanho mínimo e histórico das justificativas de rejeição.
4. Delimitar os campos públicos e o comportamento da versão antiga durante nova aprovação.
5. Fechar lifecycle, visibility, arquivamento e comportamento das URLs.
6. Definir Tags e semântica/autorizações de relações de conteúdo.
7. Definir filtros e interações mínimas do grafo V1.
8. Escolher regras de armazenamento, limites e acesso de mídia.
9. Definir campos do contato e controles antispam, mantendo consulta/exclusão exclusiva do Founder.
10. Fechar provisionamento, armazenamento e rotação do segredo recovery e MFA da conta recovery.
11. Definir regras de contas desativadas e preservação de autoria.
12. Fechar formato editorial, slugs e requisitos de apresentação por tipo.
