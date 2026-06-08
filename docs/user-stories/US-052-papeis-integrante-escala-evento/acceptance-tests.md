# US-052: Checklist de Testes de Aceitação

**Feature:** Papel de integrante na Escala por Event  
**Bounded Context:** Worship + Team  
**Testado por:** [Nome do QA/Dev]  
**Data:** 2026-05-19  
**Ambiente:** [ ] Local | [ ] Staging

---

## Testes Funcionais

- [ ] Cadastro de integrante exige papel principal.
- [ ] Cadastro de integrante aceita papéis secundários sem duplicidade.
- [ ] Inserção na Escala sugere automaticamente o papel principal.
- [ ] Alteração para papel secundário permitido funciona.
- [ ] Integrante mantém apenas 1 papel por Event.

## Testes de Privilégio

- [ ] admin pode editar papel de integrante na Escala.
- [ ] Owner/Ministro do Event pode editar papel na Escala do próprio Event.
- [ ] team-member não consegue editar papel de terceiros na Escala.
- [ ] Usuário sem Privilégio recebe mensagem amigável de autorização.

## Testes de Estado do Event

- [ ] Event Locked bloqueia alteração de papel.
- [ ] Em Event Locked, papel permanece inalterado após tentativa de edição.

## Testes de Erro e Resiliência

- [ ] Papel inválido retorna DOMAIN-013.
- [ ] Edição sem Privilégio retorna DOMAIN-005.
- [ ] Mutação em Event Locked retorna DOMAIN-014.
- [ ] UI não quebra em erro e mantém navegação funcional.

## Testes de UX e Mobile-First

- [ ] Fluxo funcional em viewport 375px sem scroll horizontal.
- [ ] Mensagens de erro são claras e sem detalhes técnicos internos.
- [ ] Campos e ações de edição possuem estado de loading/erro previsível.

## Critério de Aprovação

- [ ] Todos os cenários do scenarios.feature foram validados.
- [ ] Regras RB-001..RB-007 atendidas.
- [ ] Não há tratamento de erro de domínio diretamente no componente.
- [ ] Lint, build e test:unit executados sem falhas.
