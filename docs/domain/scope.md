# Escopo da V1 — MyDevLab

## 1. Objetivo do projeto

O MyDevLab é uma plataforma pessoal para organizar e publicar conteúdo técnico, projetos, estudos e anotações. A plataforma funcionará como portfólio profissional, laboratório de engenharia de software e base de conhecimento técnico.

## 2. Usuários e valor entregue

### Visitante

Pessoa sem conta que acessa a área pública. Pode descobrir o propósito do MyDevLab, explorar Projects, Articles e Notes publicados e visíveis publicamente, navegar pelas relações e explorar a visualização gráfica. Visitante é um ator de acesso; não precisa ser uma conta persistida no sistema.

**Valor entregue:** conhecer o trabalho técnico e acessar explicações sobre projetos, decisões e aprendizados.

### Founder

Proprietário da plataforma. O bootstrap do serviço cria a conta principal do Founder e uma segunda conta de Founder dedicada à recuperação. A conta principal administra o sistema e decide se outras pessoas terão contas e quais responsabilidades poderão receber. A conta de recuperação tem capacidades restritas, descritas abaixo.

**Valor entregue:** manter controle total sobre a plataforma e delegar tarefas sem perder a responsabilidade principal pelo projeto.

### Admin

Pessoa autenticada à qual o Founder delega tarefas administrativas. O Founder define as permissões de cada Admin. Admin não pode criar ou promover outros Admins. As permissões serão escolhidas entre capacidades previstas pelo produto, não regras arbitrárias criadas pelo usuário.

**Valor entregue:** ajudar a operar a plataforma dentro dos limites concedidos pelo Founder.

### Author

Toda conta autenticada pode agir como autora. Author pode criar e editar somente o próprio conteúdo na V1. Founder/Admin também criam conteúdo e, conforme as permissões, podem administrar conteúdos de outras contas. A conta e seu nível de acesso determinam as permissões; autorização e auditoria não tratam Admin/Founder como papéis acumulados independentes de Author. Cada conteúdo mantém autoria identificável.

Conteúdo de qualquer tipo destinado ao público — Project, Article ou Note — passa por aprovação antes de ficar acessível publicamente, inclusive quando criado por contas de nível superior. O Founder pode aprovar o próprio conteúdo; Admins com permissão de aprovação também podem aprovar conteúdo criado pelo Founder. O registro de aprovação identifica a conta que aprovou. Um Admin sem essa permissão não pode aprovar conteúdo próprio nem de outras pessoas. Notes privadas só podem ser vistas pelo Author; quando submetidas para aprovação, passam a ser visíveis ao Founder e aos Admins autorizados.

**Valor entregue:** produzir conteúdo técnico sem precisar de acesso administrativo amplo à plataforma.

> **Nota de modelagem:** User é a conta/autoria. Founder, Admin e Author representam níveis/capacidades da conta, não entidades independentes nem papéis que se acumulam. Toda conta pode criar conteúdo; níveis superiores acrescentam capacidades. Visitante representa acesso anônimo e não implica uma linha de User.

## 3. Escopo funcional da V1

### 3.1 Área pública

- Apresentar o propósito do MyDevLab e informações básicas sobre o autor.
- Listar Projects publicados e permitir abrir cada Project por uma URL própria.
- Listar Articles publicados e permitir ler cada Article por uma URL própria.
- Listar Notes publicadas e permitir abrir cada Note pública por uma URL própria. Notes podem ser curtas, informais e pessoais, além de técnicas.
- Mostrar Tags e relações entre Projects, Articles e Notes; permitir navegar entre conteúdos relacionados e explorar uma visualização gráfica interativa da rede.
- Exibir imagens associadas ao conteúdo público.
- Disponibilizar formulário de contato e informar o resultado do envio.
- Tratar mensagens recebidas como comunicações dirigidas ao Founder sobre propostas de trabalho ou assuntos da plataforma.
- Exibir apenas conteúdo que esteja publicado e tenha visibilidade pública.
- Ao navegar pelas relações, não revelar conteúdo privado nem conteúdo aguardando aprovação.
- Informar claramente quando não houver conteúdo ou quando uma URL não corresponder a um item público.

### 3.2 Área administrativa

- Permitir que Founder, Admin e Author autentiquem e encerrem a sessão.
- Permitir que o Founder gerencie contas internas, crie Admins e defina suas permissões. Não haverá cadastro público; Admins não podem criar ou promover outros Admins. Ainda falta decidir quem pode criar contas de Author.
- No primeiro acesso após o bootstrap, permitir que o Founder principal configure sua senha e autenticação multifator.
- Exigir um segredo de recuperação definido no provisionamento da conta Founder para autorizar reset de senha e troca do email da conta principal; esse segredo é diferente da senha.
- Permitir que a conta de recuperação redefina a senha e troque o email da conta principal do Founder após validar o segredo de recuperação.
- Restringir a conta de recuperação a essas operações na V1; encerramento remoto de sessões e outros recursos de recuperação ficam para V2.
- Permitir que todas as contas autenticadas criem Projects, Articles e Notes; Authors editam somente os próprios conteúdos, enquanto Founder/Admin podem administrar outros conteúdos conforme suas permissões.
- Permitir salvar conteúdo como rascunho sem torná-lo acessível publicamente.
- Permitir pré-visualizar rascunhos e conteúdo pendente sem expô-los a visitantes.
- Exigir aprovação antes de tornar público qualquer Project, Article ou Note, inclusive conteúdo criado por Founder/Admin. Admins autorizados podem aprovar conteúdo do Founder; o registro identifica a conta que aprovou.
- Permitir aprovar ou rejeitar conteúdo submetido; após aprovação, o conteúdo fica público conforme suas regras de visibilidade.
- Exigir justificativa com tamanho mínimo definido ao rejeitar uma submissão. Author pode editar o conteúdo rejeitado e reenviá-lo para aprovação.
- Permitir manter Notes privadas acessíveis somente ao Author e submetê-las para aprovação; conteúdo pendente fica visível ao Author, Founder e Admins autorizados.
- Exigir nova aprovação quando campos que afetam a apresentação pública de conteúdo publicado forem alterados, inclusive por Founder/Admin. Alterações sem efeito na apresentação pública não reiniciam a aprovação.
- Permitir arquivar conteúdo e aplicar regras definidas para acesso a conteúdo arquivado.
- Permitir relacionar Projects, Articles e Notes entre si, sem limitar as relações a conteúdos do mesmo tipo.
- Permitir associar Tags aos tipos de conteúdo da V1.
- Permitir enviar imagens/arquivos, armazená-los e associá-los a conteúdos.
- Permitir receber, validar e persistir mensagens de contato sem categoria predefinida; somente o Founder principal pode consultá-las e apagá-las. As mensagens permanecem até o Founder decidir apagá-las.
- Permitir consultar e editar os conteúdos que a conta tem autorização para administrar.
- Permitir ao Founder delegar a cada Admin capacidades selecionadas de uma lista definida pelo sistema. Capacidades candidatas para a V1:
  - consultar conteúdo submetido para aprovação;
  - editar conteúdo de outros Authors;
  - aprovar/rejeitar conteúdo público;
  - gerenciar Tags;
  - criar/remover relações entre conteúdos;
  - gerenciar arquivos de mídia;
  - arquivar/restaurar conteúdo;
  - gerenciar contas Author, caso essa delegação seja aprovada.
- Manter gestão de Admins, permissões, conta Founder/recovery e mensagens de contato exclusivas do Founder; essas capacidades não são delegáveis.
- Persistir as alterações no PostgreSQL por meio do backend da aplicação.
- Verificar a autenticação e a autorização no servidor para toda operação administrativa; esconder um botão na interface não é controle de acesso suficiente.

> **Limite proposto:** esta V1 inclui publicação, revisão, administração de contas, mídia, contato e exploração visual das relações, mas permanece focada nos fluxos do MyDevLab. As permissões de Admin serão escolhidas de um conjunto limitado de capacidades; não haverá construtor genérico de regras.

## 4. Fora do escopo da V1

Os itens abaixo ficam **provisoriamente adiados** para manter a primeira entrega concentrada no fluxo principal. Devem ser confirmados ou reclassificados na revisão do escopo:

- Cadastro público de usuários e gestão aberta de contas. Contas e concessão de papéis ficam sob controle do Founder.
- Integrações com plataformas externas para publicar ou sincronizar conteúdo.
- Aplicativos nativos para celular.
- Ferramentas interativas de laboratório que executem código enviado por visitantes.

**Na V1:** Tags, formulário de contato, preview, arquivamento, múltiplos autores, upload/armazenamento de arquivos e visualização gráfica interativa das relações.

**Na V2:** encerramento remoto de sessões e demais recursos avançados de recuperação da conta. O reset de senha e a troca de email do Founder principal permanecem no escopo da V1.

## 5. Requisitos técnicos e restrições

- **Stack definida:** Next.js, TypeScript, PostgreSQL, Docker, Git e GitHub.
- **Base encontrada no repositório:** Next.js App Router, React, TypeScript strict, Tailwind CSS, PostgreSQL via Docker Compose, Drizzle ORM, `pg`, Zod, ESLint e Vitest.
- **Persistência:** PostgreSQL é a fonte de verdade para conteúdos, relações, Tags, estado editorial e mensagens de contato. A V1 não deve depender de conteúdo hardcoded na interface.
- **Credenciais:** credenciais iniciais e segredos de autenticação não podem ser hardcoded nem versionados; o processo de bootstrap precisa receber/provisionar segredos por um canal operacional seguro.
- **Acesso a dados:** o backend valida e aplica as regras de negócio antes de ler ou gravar conteúdo. O navegador não acessa o banco diretamente.
- **Evolução do schema:** o schema Drizzle e migrations versionadas devem refletir o modelo de domínio revisado. O schema/migration existentes são um ponto de partida, não uma decisão final de domínio.
- **Execução local:** a aplicação e o banco devem poder ser iniciados pelo Docker Compose, conforme a configuração do projeto.
- **Segurança básica:** operações administrativas exigem autenticação/autorização no servidor; dados recebidos devem ser validados; conteúdo não publicado não pode vazar por consultas ou rotas públicas.
- **Qualidade:** lint, verificação de tipos e testes relevantes devem fazer parte da validação das mudanças. Os fluxos críticos precisam ter cobertura adequada antes de considerar a V1 pronta.
- **Interface:** a experiência deve funcionar em telas pequenas e grandes e preservar acessibilidade básica, incluindo labels, foco visível e mensagens de erro compreensíveis.

## 6. Critérios de conclusão da V1

A V1 será considerada funcional quando:

1. O Founder principal conseguir autenticar e acessar todos os recursos; a conta recovery ficar limitada às operações de recuperação da V1; Admins e Authors só executarem ações autorizadas para seu nível de acesso.
2. Founder conseguir criar contas internas e configurar permissões delegáveis de Admin; Admins não conseguirem criar ou promover outros Admins.
3. Contas autorizadas conseguirem criar, editar, pré-visualizar, submeter, aprovar/rejeitar e arquivar Projects, Articles e Notes conforme suas regras.
4. Conteúdo público de qualquer tipo só ficar visível após aprovação; mudanças em campos públicos reiniciarem a aprovação.
5. A aprovação identificar a conta aprovadora; Admin só conseguir aprovar/rejeitar quando tiver a permissão concedida pelo Founder, inclusive em conteúdo do Founder.
6. Notes privadas ficarem visíveis somente ao Author até a submissão; itens pendentes ficarem visíveis ao Author, Founder e Admins autorizados.
7. Todos os tipos de conteúdo poderem ser associados a Tags e relacionados entre si em relações muitos-para-muitos, com navegação e grafo público respeitando visibilidade e estado editorial.
8. Visitantes conseguirem explorar o grafo sem receber conteúdo privado, pendente ou arquivado que não seja público.
9. Imagens/arquivos poderem ser enviados, armazenados e servidos segundo as regras de acesso do conteúdo associado.
10. Visitantes conseguirem enviar mensagens de contato sem categoria obrigatória; somente o Founder principal conseguir consultá-las e apagá-las, sem exclusão automática.
11. A conta recovery conseguir redefinir a senha e trocar o email do Founder principal; encerramento de sessões permanecer para V2.
12. Dados do banco e do armazenamento configurado permanecerem disponíveis após reiniciar a aplicação.
13. Usuários não autenticados não conseguirem executar operações administrativas chamando diretamente o backend.
14. Os fluxos essenciais tiverem validação server-side e testes apropriados, e o projeto passar pelas verificações de qualidade definidas no repositório.
15. O ambiente de desenvolvimento e a criação do banco a partir das migrations estiverem documentados e reproduzíveis.

Não há prazo ou orçamento de lançamento definido neste documento. O roadmap deve ser ordenado por dependências e critérios de conclusão, e não por datas inventadas.

## 7. Decisões em aberto

Estas perguntas precisam ser resolvidas nos casos de uso e nas regras de negócio, antes de fechar o modelo lógico e o DBML:

- Quais permissões da lista delegável serão selecionáveis para cada Admin? A delegação de contas Author será permitida?
- Um Admin com permissão de aprovação pode aprovar o próprio conteúdo ou deve haver separação entre autor e aprovador?
- Além da conta aprovadora, quais dados de auditoria devem ser registrados (por exemplo, horário e versão revisada)?
- Qual será o tamanho mínimo da justificativa de rejeição?
- Quais campos contam como mudança da apresentação pública e reiniciam a aprovação?
- Quais combinações de lifecycle e visibility existem? O que acontece com a visibilidade e a URL de um item arquivado?
- Notes privadas são acessíveis somente ao Author; como fica esse acesso se a conta for desativada ou removida?
- Quais formatos e limites de imagem/arquivo serão aceitos? O armazenamento será local no MVP ou em serviço externo? Como backups e remoção funcionarão?
- Como Tags são nomeadas, reutilizadas e associadas aos três tipos de conteúdo?
- Relações são direcionadas ou recíprocas? Podem ter rótulo/descrição? Podem existir relações duplicadas entre o mesmo par?
- Quem pode criar/remover relações e como o grafo filtra conteúdo privado, pendente e arquivado?
- Que interações a visualização do grafo precisa suportar na V1 (filtros, busca, navegação, agrupamento)?
- Mensagens de contato não terão categorias predefinidas e permanecerão até exclusão manual pelo Founder; quais campos do formulário são obrigatórios?
- Como serão provisionadas as credenciais iniciais das contas Founder principal e recovery sem segredos versionados? A conta recovery também terá configuração de senha/MFA no primeiro acesso?
- Como se autentica na conta recovery e como se impede que ela seja usada como conta administrativa normal?
- Como será gerado/definido e entregue o segredo de recuperação? Como será armazenado e atualizado com segurança?
- Para reset de senha e troca de email do Founder principal, que confirmação, registro de auditoria e notificação são necessários?
- Como contas internas serão convidadas, desativadas ou removidas? O que ocorre com autoria e conteúdo de uma conta desativada?
- O conteúdo será escrito em Markdown ou outro formato? Como código, links e imagens serão renderizados com segurança?
- O slug poderá ser alterado depois da publicação? Se puder, o que acontece com URLs antigas?

## 8. Relação com os próximos documentos

- `use-cases.md` detalhará os fluxos do visitante e do administrador cobertos por este escopo.
- `business-rules.md` registrará estados, transições, validações e regras de acesso.
- `domain-model.md` descreverá conceitos, responsabilidades, atributos candidatos e relacionamentos.
- `model.excalidraw` apresentará visualmente o modelo conceitual revisado.
- O DBML será produzido depois da revisão desses documentos; não é parte deste escopo inicial.
