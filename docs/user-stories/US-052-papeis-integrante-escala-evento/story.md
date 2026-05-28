# US-052: Definir Papel de Integrante na Escala por Event

**Como** admin ou Owner/Ministro de um Event  
**Quero** atribuir e ajustar o papel de cada integrante na Escala  
**Para que** cada integrante execute apenas um papel por Event com controle claro de permissao

**Bounded Context:** Worship Context (Core) + Team Context (Supporting)  
**Prioridade:** P0 - CRITICO  
**Estimativa:** 5 pontos  
**Sprint:** Sprint atual

---

## Criterios de Aceitacao

1. Cadastro de integrante permite 1 papel principal obrigatorio.
2. Cadastro de integrante permite papeis secundarios opcionais sem duplicidade.
3. Ao adicionar integrante na Escala, o papel principal e sugerido automaticamente.
4. Cada integrante pode ter apenas 1 papel por Event.
5. admin e Owner/Ministro do Event podem editar papel na Escala.
6. team-member nao pode editar papel de terceiros na Escala.
7. Event Locked bloqueia qualquer alteracao de papel na Escala.
8. Mensagens de erro sao amigaveis e sem detalhes tecnicos internos.

---

## Regras de Negocio

- RB-001: Integrante possui exatamente 1 papel principal no cadastro.
- RB-002: Integrante pode possuir 0..N papeis secundarios.
- RB-003: Papel principal e default na atribuicao inicial da Escala.
- RB-004: Integrante executa no maximo 1 papel por Event.
- RB-005: Somente admin ou Owner/Ministro do Event edita papel na Escala.
- RB-006: team-member nao pode alterar papel de terceiros na Escala.
- RB-007: Event Locked rejeita mutacao na Escala.

---

## Eventos de Dominio

| Evento | Quando disparar | Ouvintes | Acao |
|---|---|---|---|
| `MemberRoleSetInEvent` | Integrante recebe papel na Escala | Event Context | Atualizar estado da Escala |
| `MemberRoleUpdatedInEvent` | Papel da Escala e alterado | Event Context | Revalidar consistencia da Escala |
| `RoleChangeDenied` | Usuario sem privilegio tenta editar | UI/Observabilidade | Exibir erro de autorizacao |
| `LockedEventMutationBlocked` | Tentativa de alterar Event Locked | UI/Observabilidade | Exibir erro de estado invalido |

---

## Dependencias

### Tecnicas
- [ ] Fluxo de Privilégio ativo no contexto de autenticacao.
- [ ] Use cases de Event/Escala com validacao de autorizacao e estado.
- [ ] Hooks com mapeamento de DomainError para estado de UI.

### PRDs relacionados
- [ ] PRD-003 - Visualizacao da Pagina de Eventos.
- [ ] PRD-004 - Cadastro de Usuario com Privilegios.
- [ ] PRD-006 - Papeis Principal/Secundarios e Papel Unico por Event.

---

## Definicao de Pronto (DoD)

- [ ] Regras RB-001..RB-007 implementadas.
- [ ] Testes cobrindo permissao, validacao e Event Locked.
- [ ] Nenhum erro de dominio tratado diretamente no componente.
- [ ] Lint, build e test:unit passando.
- [ ] Sem schema/migration/ORM.

---

## Referencias

- **Contract API:** [contract.yaml](./contract.yaml)
- **BDD Scenarios:** [scenarios.feature](./scenarios.feature)
- **Testes de Aceitacao:** [acceptance-tests.md](./acceptance-tests.md)
- **PRD Isolado:** [PRD-006](../../planning/prds/PRD-006-papeis-principal-secundarios-escala-evento.md)

---

**Criado em:** 2026-05-19  
**Atualizado em:** 2026-05-19  
**Responsavel:** Product Manager Agent
