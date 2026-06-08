# PRD-006 - Papéis Principal/Secundários e Papel Único por Event

## 1. Objetivo
Definir e padronizar as regras de negócio para papéis de integrante no projeto e na Escala de Event, garantindo previsibilidade de domínio, consistência de Privilégio e melhor experiência de planejamento.

## 2. Problema
Hoje o fluxo de papéis não está explicitamente formalizado em um PRD isolado, o que gera risco de comportamento inconsistente entre cadastro de integrante, montagem de Escala e controle de Privilégios.

## 3. Escopo MVP
- Permitir cadastro de integrante com 1 papel principal e 0..N papéis secundários.
- Permitir que o integrante informe seus papéis conforme disponibilidade.
- Sugerir automaticamente o papel principal ao adicionar integrante na Escala do Event.
- Garantir que o integrante execute apenas 1 papel por Event.
- Permitir editar papel na Escala conforme Privilégio.
- Bloquear alterações em Event Locked.

## 4. Fora de Escopo
- Algoritmo automático de otimização de Escala.
- Recomendação inteligente por histórico de eventos.
- Regras de carga horária e conflito entre múltiplos eventos.
- Modelagem de banco de dados, migrations ou ORM.

## 5. Personas e Privilégio (MVP)
- admin: cria/edita cadastro, define papéis, altera papéis na Escala, altera Owner.
- ministro (Owner): cria/edita Event e pode ajustar papel na Escala do próprio Event.
- team-member: informa papéis no próprio cadastro conforme regras do projeto; não altera papéis de terceiros na Escala.

## 6. Requisitos Funcionais
1. O cadastro de integrante deve exigir 1 papel principal válido.
2. O cadastro de integrante deve aceitar lista de papéis secundários sem duplicidade.
3. O papel principal deve fazer parte da lista de habilidades do integrante.
4. Ao adicionar integrante na Escala, o sistema deve sugerir o papel principal.
5. Deve ser possível substituir o papel sugerido por outro papel permitido do integrante.
6. O integrante não pode ter mais de um papel na Escala do mesmo Event.
7. Em Event Locked, qualquer mutação de papel na Escala deve ser rejeitada.
8. Ações de edição devem respeitar Privilégio por perfil.

## 7. Requisitos Não Funcionais
- Mensagens de erro claras e sem termos técnicos internos.
- Comportamento consistente entre use case, hook e UI.
- Fluxo mobile-first sem scroll horizontal em 375px.
- Testes de Privilégio e validação para caminho principal e erro.

## 8. Regras de Negócio
- Regra RB-001: integrante tem exatamente 1 papel principal no cadastro.
- Regra RB-002: integrante pode ter 0..N papéis secundários.
- Regra RB-003: papel principal é sugestão inicial na Escala.
- Regra RB-004: em cada Event, integrante executa somente 1 papel.
- Regra RB-005: apenas admin ou Owner do Event podem editar papel na Escala.
- Regra RB-006: team-member não altera papéis de terceiros na Escala.
- Regra RB-007: Event Locked não permite alteração de papel.

## 9. Mapeamento de Erros Prioritários
- DOMAIN-004: usuário sem Privilégio tenta editar Event Setlist.
- DOMAIN-005: usuário sem Privilégio tenta editar Escala.
- DOMAIN-013: papel inválido na Escala.
- DOMAIN-014: Event Locked recebendo mutação.

Observação:
- Para este PRD, DOMAIN-005, DOMAIN-013 e DOMAIN-014 são obrigatórios para cobertura mínima.

## 10. Critérios de Aceitação
- [ ] Cadastro de integrante permite papel principal + papéis secundários.
- [ ] Escala sugere papel principal na inserção.
- [ ] Escala impede mais de um papel por integrante no mesmo Event.
- [ ] Edição de papel na Escala respeita Privilégio (admin e Owner).
- [ ] Team-member não consegue editar papel de terceiros na Escala.
- [ ] Event Locked bloqueia alterações de papel.
- [ ] Fluxo validado com dados mockados.
- [ ] Sem schema/modelagem de banco.

## 11. Dados e Persistência
- Dados mockados em src/mocks durante MVP.
- Proibido criar schema/tabelas/migrations/ORM nesta entrega.

## 12. Entregáveis
- Especificação de regras de papel no cadastro de integrante.
- Especificação de regras de atribuição de papel por Event na Escala.
- Definição de regras de Privilégio para edição de papel.
- Cobertura de testes mínimos para Privilégio e validação.

## 13. Dependências e Referências
- PRD-003 - Visualização da Página de Eventos.
- PRD-004 - Cadastro de Usuário com Privilégios.
- docs/guides/REFACTOR-MOCK-DECOUPLING.md (mapeamento de erros e resiliência).
