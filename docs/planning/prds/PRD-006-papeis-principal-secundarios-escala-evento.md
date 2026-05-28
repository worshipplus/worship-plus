# PRD-006 - Papeis Principal/Secundarios e Papel Unico por Event

## 1. Objetivo
Definir e padronizar as regras de negocio para papeis de integrante no projeto e na Escala de Event, garantindo previsibilidade de dominio, consistencia de permissao e melhor experiencia de planejamento.

## 2. Problema
Hoje o fluxo de papeis nao esta explicitamente formalizado em um PRD isolado, o que gera risco de comportamento inconsistente entre cadastro de integrante, montagem de Escala e controle de permissoes.

## 3. Escopo MVP
- Permitir cadastro de integrante com 1 papel principal e 0..N papeis secundarios.
- Permitir que o integrante informe seus papeis conforme disponibilidade.
- Sugerir automaticamente o papel principal ao adicionar integrante na Escala do Event.
- Garantir que o integrante execute apenas 1 papel por Event.
- Permitir editar papel na Escala conforme Privilégio.
- Bloquear alteracoes em Event Locked.

## 4. Fora de Escopo
- Algoritmo automatico de otimizacao de Escala.
- Recomendacao inteligente por historico de eventos.
- Regras de carga horaria e conflito entre multiplos eventos.
- Modelagem de banco de dados, migrations ou ORM.

## 5. Personas e Privilégio (MVP)
- admin: cria/edita cadastro, define papeis, altera papeis na Escala, altera Owner.
- ministro (Owner): cria/edita Event e pode ajustar papel na Escala do proprio Event.
- team-member: informa papeis no proprio cadastro conforme regras do projeto; nao altera papeis de terceiros na Escala.

## 6. Requisitos Funcionais
1. O cadastro de integrante deve exigir 1 papel principal valido.
2. O cadastro de integrante deve aceitar lista de papeis secundarios sem duplicidade.
3. O papel principal deve fazer parte da lista de habilidades do integrante.
4. Ao adicionar integrante na Escala, o sistema deve sugerir o papel principal.
5. Deve ser possivel substituir o papel sugerido por outro papel permitido do integrante.
6. O integrante nao pode ter mais de um papel na Escala do mesmo Event.
7. Em Event Locked, qualquer mutacao de papel na Escala deve ser rejeitada.
8. Acoes de edicao devem respeitar Privilégio por perfil.

## 7. Requisitos Nao Funcionais
- Mensagens de erro claras e sem termos tecnicos internos.
- Comportamento consistente entre use case, hook e UI.
- Fluxo mobile-first sem scroll horizontal em 375px.
- Testes de permissao e validacao para caminho principal e erro.

## 8. Regras de Negocio
- Regra RB-001: integrante tem exatamente 1 papel principal no cadastro.
- Regra RB-002: integrante pode ter 0..N papeis secundarios.
- Regra RB-003: papel principal e sugestao inicial na Escala.
- Regra RB-004: em cada Event, integrante executa somente 1 papel.
- Regra RB-005: apenas admin ou Owner do Event podem editar papel na Escala.
- Regra RB-006: team-member nao altera papeis de terceiros na Escala.
- Regra RB-007: Event Locked nao permite alteracao de papel.

## 9. Mapeamento de Erros Prioritarios
- DOMAIN-004: usuario sem privilegio tenta editar Event Setlist.
- DOMAIN-005: usuario sem privilegio tenta editar Escala.
- DOMAIN-013: papel invalido na Escala.
- DOMAIN-014: Event Locked recebendo mutacao.

Observacao:
- Para este PRD, DOMAIN-005, DOMAIN-013 e DOMAIN-014 sao obrigatorios para cobertura minima.

## 10. Criterios de Aceitacao
- [ ] Cadastro de integrante permite papel principal + papeis secundarios.
- [ ] Escala sugere papel principal na insercao.
- [ ] Escala impede mais de um papel por integrante no mesmo Event.
- [ ] Edicao de papel na Escala respeita Privilégio (admin e Owner).
- [ ] Team-member nao consegue editar papel de terceiros na Escala.
- [ ] Event Locked bloqueia alteracoes de papel.
- [ ] Fluxo validado com dados mockados.
- [ ] Sem schema/modelagem de banco.

## 11. Dados e Persistencia
- Dados mockados em src/mocks durante MVP.
- Proibido criar schema/tabelas/migrations/ORM nesta entrega.

## 12. Entregaveis
- Especificacao de regras de papel no cadastro de integrante.
- Especificacao de regras de atribuicao de papel por Event na Escala.
- Definicao de regras de permissao para edicao de papel.
- Cobertura de testes minimos para permissao e validacao.

## 13. Dependencias e Referencias
- PRD-003 - Visualizacao da Pagina de Eventos.
- PRD-004 - Cadastro de Usuario com Privilegios.
- docs/guides/REFACTOR-MOCK-DECOUPLING.md (mapeamento de erros e resiliencia).
