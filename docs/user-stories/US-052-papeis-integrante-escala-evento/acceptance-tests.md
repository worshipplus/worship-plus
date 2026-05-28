# US-052 - Checklist de Testes de Aceitacao

**Feature:** Papel de integrante na Escala por Event  
**Bounded Context:** Worship + Team  
**Data:** 2026-05-19  
**Ambiente:** [ ] Local [ ] Staging

---

## Testes Funcionais

- [ ] Cadastro de integrante exige papel principal.
- [ ] Cadastro de integrante aceita papeis secundarios sem duplicidade.
- [ ] Insercao na Escala sugere automaticamente o papel principal.
- [ ] Alteracao para papel secundario permitido funciona.
- [ ] Integrante mantem apenas 1 papel por Event.

## Testes de Permissao

- [ ] admin pode editar papel de integrante na Escala.
- [ ] Owner/Ministro do Event pode editar papel na Escala do proprio Event.
- [ ] team-member nao consegue editar papel de terceiros na Escala.
- [ ] Usuario sem privilegio recebe mensagem amigavel de autorizacao.

## Testes de Estado do Event

- [ ] Event Locked bloqueia alteracao de papel.
- [ ] Em Event Locked, papel permanece inalterado apos tentativa de edicao.

## Testes de Erro e Resiliencia

- [ ] Papel invalido retorna DOMAIN-013.
- [ ] Edicao sem privilegio retorna DOMAIN-005.
- [ ] Mutacao em Event Locked retorna DOMAIN-014.
- [ ] UI nao quebra em erro e mantem navegacao funcional.

## Testes de UX e Mobile-First

- [ ] Fluxo funcional em viewport 375px sem scroll horizontal.
- [ ] Mensagens de erro sao claras e sem detalhes tecnicos internos.
- [ ] Campos e acoes de edicao possuem estado de loading/erro previsivel.

## Criterio de Aprovacao

- [ ] Todos os cenarios do scenarios.feature foram validados.
- [ ] Regras RB-001..RB-007 atendidas.
- [ ] Nao ha tratamento de erro de dominio diretamente no componente.
- [ ] Lint, build e test:unit executados sem falhas.
