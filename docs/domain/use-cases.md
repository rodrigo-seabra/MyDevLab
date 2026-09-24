# Casos de uso — MyDevLab V1

> Este documento descreve comportamentos do produto, sem definir tabelas, endpoints ou componentes. Decisões ainda abertas aparecem como **Pendente de decisão** e não devem ser tratadas como regra fechada.

## Atores

- **Visitante:** pessoa sem conta que acessa conteúdo e grafo públicos ou envia uma mensagem de contato.
- **Founder principal:** proprietário da plataforma, com acesso a todos os recursos administrativos.
- **Conta recovery:** conta provisionada no bootstrap para redefinir a senha e trocar o email do Founder principal na V1.
- **Admin:** conta interna com capacidades selecionadas pelo Founder. Não cria nem promove outros Admins.
- **Author:** toda conta autenticada pode criar conteúdo como autora. Author edita somente os próprios conteúdos na V1.
- **Admin aprovador:** Admin que recebeu do Founder a capacidade de aprovar/rejeitar conteúdo.

## Conteúdo coberto

- **Project:** projeto ou experimento técnico.
- **Article:** conteúdo técnico estruturado.
- **Note:** conteúdo curto, informal, pessoal ou técnico; pode ser privado ou submetido para publicação.

## UC-01 — Inicializar as contas Founder

**Atores:** processo de bootstrap; Founder principal; conta recovery.

**Pré-condições:** serviço inicializado sem contas Founder provisionadas; os dados de bootstrap são fornecidos por canal operacional.

**Fluxo principal:**

1. O bootstrap cria a conta principal do Founder e a conta recovery.
2. No primeiro acesso, o Founder principal configura senha e autenticação multifator.
3. O Founder principal passa a administrar a plataforma.

**Alternativas e erros:**

- Segredos necessários ao bootstrap não estão disponíveis: o processo informa falha e não cria contas parcialmente.
- A primeira configuração de senha/MFA não foi concluída: as operações administrativas permanecem indisponíveis.

**Resultado:** existem as contas iniciais com capacidades distintas; credenciais não são armazenadas no código-fonte.

**Pendente de decisão:** como provisionar a credencial inicial de cada conta, se a conta recovery também configura MFA e se o bootstrap pode ser repetido com segurança.

## UC-02 — Autenticar e encerrar sessão

**Atores:** Founder principal, conta recovery, Admin, Author.

**Pré-condições:** a conta está provisionada e ativa.

**Fluxo principal:**

1. A pessoa informa suas credenciais.
2. O sistema valida a identidade e os fatores de autenticação exigidos para a conta.
3. O sistema abre uma sessão com as capacidades daquela conta.
4. A pessoa encerra a sessão quando desejar.

**Alternativas e erros:**

- Credenciais ou segundo fator inválidos: o acesso é recusado sem revelar qual dado falhou.
- Conta desativada: o acesso é recusado.

**Resultado:** a conta autenticada pode executar somente as operações permitidas ao seu nível e às capacidades concedidas.

**Pendente de decisão:** MFA obrigatório para Admins e Authors; política de sessão e bloqueio após tentativas malsucedidas.

## UC-03 — Recuperar email ou senha do Founder principal

**Atores:** conta recovery; Founder principal.

**Pré-condições:** ambas as contas foram provisionadas; existe um segredo de recuperação separado da senha.

**Fluxo principal:**

1. A conta recovery inicia a troca do email ou a redefinição da senha do Founder principal.
2. A pessoa apresenta o segredo de recuperação.
3. O sistema valida o segredo.
4. O sistema atualiza o dado solicitado e registra a ação.

**Alternativas e erros:**

- Segredo inválido: nenhuma alteração é feita.
- A conta recovery tenta executar uma função administrativa normal: a operação é recusada.

**Resultado:** email ou senha do Founder principal são alterados por uma operação autorizada da conta recovery.

**Fora da V1:** encerrar remotamente sessões/dispositivos e outros fluxos avançados de recuperação.

**Pendente de decisão:** forma de provisionar e armazenar o segredo, confirmação adicional, notificação, rotação do segredo e política de tentativas.

## UC-04 — Gerenciar contas internas e permissões de Admin

**Atores:** Founder principal.

**Pré-condições:** Founder principal autenticado.

**Fluxo principal:**

1. O Founder cria ou administra uma conta interna.
2. Para uma conta Admin, seleciona capacidades permitidas a partir da lista definida pelo sistema.
3. O sistema salva o nível e as capacidades concedidas.
4. O Founder pode alterar ou revogar essas capacidades.

**Alternativas e erros:**

- Admin tenta criar ou promover outra conta a Admin: operação recusada.
- Conta não pode receber uma capacidade exclusiva do Founder: operação recusada.

**Resultado:** contas e permissões internas refletem a decisão do Founder.

**Pendente de decisão:** quais capacidades compõem a lista final e se Admin pode criar/gerenciar contas Author.

## UC-05 — Criar e salvar conteúdo como rascunho

**Atores:** Founder principal, Admin, Author.

**Pré-condições:** conta autenticada; o tipo de conteúdo está habilitado para a conta.

**Fluxo principal:**

1. A pessoa escolhe Project, Article ou Note.
2. Preenche os dados exigidos para aquele tipo.
3. Salva como rascunho.
4. O backend valida os dados e persiste o conteúdo e sua autoria no PostgreSQL.

**Alternativas e erros:**

- Dados inválidos ou obrigatórios ausentes: o conteúdo não é salvo e os campos com erro são informados.
- Author tenta editar conteúdo de outra pessoa: operação recusada.

**Resultado:** o rascunho persiste e não fica disponível a visitantes.

**Pendente de decisão:** campos obrigatórios por tipo, formato de Article/Note, política de slug e campos específicos de Project.

## UC-06 — Pré-visualizar rascunho ou conteúdo pendente

**Atores:** Author proprietário, Founder principal, Admin autorizado.

**Pré-condições:** conteúdo existe e a conta tem permissão para visualizá-lo.

**Fluxo principal:**

1. A pessoa solicita preview do conteúdo.
2. O backend verifica identidade, autoria e permissões.
3. O sistema exibe uma renderização equivalente à apresentação pública, sem publicar o conteúdo.

**Alternativas e erros:**

- Visitante tenta abrir o preview: acesso recusado.
- Conta sem acesso ao item tenta pré-visualizá-lo: acesso recusado.

**Resultado:** conteúdo em edição ou revisão pode ser conferido sem aparecer na área pública.

**Pendente de decisão:** se o preview de conteúdo pendente fica disponível a todo Admin ou somente a Admin com permissão de revisão.

## UC-07 — Submeter conteúdo para publicação

**Atores:** Author proprietário; Founder principal; Admin.

**Pré-condições:** conteúdo salvo; dados necessários à publicação válidos.

**Fluxo principal:**

1. A pessoa escolhe submeter Project, Article ou Note para publicação.
2. O sistema valida os campos de publicação.
3. O conteúdo entra em estado pendente de aprovação.
4. O Author e os revisores autorizados podem consultar o item pendente.

**Alternativas e erros:**

- Dados de publicação incompletos: o sistema apresenta os erros e não cria a submissão.
- Conteúdo privado não submetido: permanece acessível somente ao Author, conforme regra definida para Notes privadas.

**Resultado:** o conteúdo aguarda decisão e ainda não é público.

## UC-08 — Aprovar conteúdo

**Atores:** Founder principal; Admin com capacidade de aprovar/rejeitar.

**Pré-condições:** conteúdo pendente; conta aprovadora autenticada e autorizada.

**Fluxo principal:**

1. A pessoa revisa o conteúdo pendente.
2. Aprova a submissão.
3. O sistema registra a conta que aprovou e a decisão.
4. O conteúdo aprovado passa a ficar público.

**Alternativas:**

- Founder aprova conteúdo próprio, conforme decisão do domínio: a conta Founder fica registrada como aprovadora.
- Admin com permissão aprova conteúdo do Founder: a conta Admin fica registrada como aprovadora.
- Admin sem a capacidade de aprovação tenta aprovar: operação recusada.

**Resultado:** somente conteúdo aprovado é entregue pelas rotas públicas.

**Pendente de decisão:** se Admin com a capacidade pode aprovar conteúdo próprio; campos de auditoria além do identificador do aprovador.

## UC-09 — Rejeitar, editar e reenviar conteúdo

**Atores:** Founder principal; Admin com capacidade de aprovação; Author proprietário.

**Pré-condições:** conteúdo pendente; conta revisora autorizada.

**Fluxo principal:**

1. A pessoa revisora rejeita a submissão e informa uma justificativa que respeita o mínimo definido.
2. O sistema registra o aprovador/revisor e a justificativa.
3. O Author consulta o motivo da rejeição e edita o próprio conteúdo.
4. O Author pode submeter novamente.

**Alternativas e erros:**

- Justificativa vazia ou abaixo do mínimo: rejeição recusada.
- Outro Author tenta editar o item: operação recusada.

**Resultado:** o conteúdo rejeitado não é público; após edição e reenvio, volta à fila de aprovação.

**Pendente de decisão:** valor mínimo da justificativa e se a justificativa pode ser editada depois da rejeição.

## UC-10 — Editar conteúdo já publicado

**Atores:** Author proprietário; Founder principal; Admin com permissão para editar conteúdo de outras pessoas.

**Pré-condições:** conteúdo publicado; conta autorizada a editar.

**Fluxo principal:**

1. A pessoa altera um campo que afeta a apresentação pública.
2. O sistema salva a nova versão e a envia novamente para aprovação.
3. A versão modificada não é tratada como aprovada até passar pela revisão.

**Alternativa:** mudança exclusivamente administrativa que não afeta a apresentação pública não reinicia a aprovação.

**Resultado:** alterações públicas ficam sujeitas a revisão novamente.

**Pendente de decisão:** se a versão anteriormente aprovada continua pública enquanto a nova versão aguarda revisão; lista exata dos campos/alterações públicas.

## UC-11 — Arquivar e restaurar conteúdo

**Atores:** Founder principal; Admin com capacidade de arquivar/restaurar.

**Pré-condições:** conteúdo existe; conta tem autorização para administrá-lo.

**Fluxo principal:**

1. A pessoa arquiva o conteúdo.
2. O sistema registra a mudança de estado.
3. Uma pessoa autorizada pode restaurar o item, respeitando as regras de publicação.

**Resultado:** o conteúdo deixa de ser tratado como item corrente.

**Pendente de decisão:** se o item arquivado é ocultado, removido ou substituído por uma página informativa em sua URL; se restaurar um item previamente público exige nova aprovação.

## UC-12 — Gerenciar Tags

**Atores:** Founder principal; Admin com capacidade de gerenciar Tags; Author para aplicar Tags aos próprios conteúdos, conforme regra a definir.

**Pré-condições:** conta autenticada com capacidade correspondente.

**Fluxo principal:**

1. Uma pessoa autorizada cria ou edita uma Tag.
2. Uma pessoa autorizada associa ou remove Tags de Project, Article ou Note.
3. Visitantes navegam por Tags e veem somente conteúdos públicos publicados associados.

**Pendente de decisão:** unicidade/nome/slug, exclusão de Tag em uso e quem além do Founder/Admin pode aplicar Tags.

## UC-13 — Relacionar conteúdos

**Atores:** Founder principal; Admin com capacidade de gerenciar relações; Author para relações nos próprios conteúdos, conforme regra a definir.

**Pré-condições:** os dois conteúdos existem; a conta pode editar ou relacionar os itens.

**Fluxo principal:**

1. A pessoa seleciona dois conteúdos dentre Projects, Articles e Notes.
2. Cria ou remove a relação entre eles.
3. A relação é persistida e pode aparecer na navegação/grafo conforme acesso aos dois itens.

**Resultado:** os tipos de conteúdo podem se conectar entre si; a rede pode ser explorada sem expor itens privados, pendentes ou não publicados.

**Pendente de decisão:** direção/simetria, rótulos, relações duplicadas, auto-relação e quem pode criar/remover conexões.

## UC-14 — Explorar o grafo público

**Atores:** Visitante; contas autenticadas para visualizações administrativas, se necessárias.

**Pré-condições:** há conteúdo público e publicado com relações.

**Fluxo principal:**

1. Visitante abre a visualização gráfica.
2. O sistema apresenta nós de Projects, Articles e Notes públicos e publicados.
3. Visitante seleciona um nó e navega à página pública correspondente.

**Alternativas:**

- Não há conteúdo público: mostrar estado vazio.
- Nó relacionado é privado, pendente ou arquivado e não público: não expor o nó nem informação que revele sua existência.

**Pendente de decisão:** filtros, busca, agrupamento, limite de nós e comportamento em telas pequenas.

## UC-15 — Enviar e associar arquivo de mídia

**Atores:** Founder principal; Admin com capacidade de gerenciar mídia; Author em conteúdo próprio, conforme regra a definir.

**Pré-condições:** conta autenticada; arquivo dentro dos limites aceitos.

**Fluxo principal:**

1. A pessoa envia um arquivo.
2. O backend valida formato e tamanho.
3. O sistema armazena o arquivo e o associa a conteúdo.
4. A exibição do arquivo respeita o acesso ao conteúdo associado.

**Alternativas:**

- Tipo ou tamanho não permitido: envio recusado com mensagem clara.
- Conteúdo associado é privado/pendente: o arquivo não fica acessível ao visitante.

**Pendente de decisão:** formatos, limites, local de armazenamento, estratégia de backup e remoção de arquivos órfãos.

## UC-16 — Enviar mensagem de contato

**Ator:** Visitante.

**Pré-condições:** formulário de contato disponível.

**Fluxo principal:**

1. Visitante informa os dados de contato e escreve uma mensagem livre, sem categoria predefinida.
2. O sistema valida e persiste a mensagem.
3. O sistema confirma o recebimento.

**Alternativa:** dados inválidos: mensagem não é salva e o visitante recebe indicação do que corrigir.

**Pendente de decisão:** campos obrigatórios, limites, proteção contra spam e confirmação/envio de email.

## UC-17 — Consultar e apagar mensagens de contato

**Ator:** Founder principal.

**Pré-condições:** Founder principal autenticado; mensagens existentes.

**Fluxo principal:**

1. Founder consulta as mensagens recebidas.
2. Founder decide quando apagar uma mensagem.
3. O sistema executa a exclusão e confirma o resultado.

**Alternativas e erros:** conta recovery, Admin ou Author tenta consultar/apagar: operação recusada.

**Resultado:** mensagens não têm categoria e permanecem até exclusão manual pelo Founder.

## UC-18 — Navegar no conteúdo público

**Ator:** Visitante.

**Pré-condições:** existe conteúdo publicado e público.

**Fluxo principal:**

1. Visitante acessa lista de Projects, Articles, Notes ou Tags.
2. Abre um conteúdo ou segue uma relação.
3. O sistema entrega apenas conteúdo público aprovado.

**Alternativas e erros:** URL inexistente, privada, pendente ou arquivada sem acesso público: não revelar o conteúdo; exibir resposta apropriada.

**Resultado:** visitante explora conteúdo e conexões sem autenticação e sem acesso a dados restritos.
