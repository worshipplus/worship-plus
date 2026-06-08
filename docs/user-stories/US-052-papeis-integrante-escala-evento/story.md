# US-052: Definir Papel de Integrante na Escala por Event

**Como** admin ou Owner/Ministro de um Event  
**Quero** atribuir e ajustar o papel de cada integrante na Escala  
**Para que** cada integrante execute apenas um papel por Event com controle claro de Privilégio

**Bounded Context:** Worship Context (Core) + Team Context (Supporting)  
**Prioridade:** P0 - CRITICO  
**Estimativa:** 5 pontos  
**Sprint:** Sprint atual

---

## Critérios de Aceitação

1. Cadastro de integrante permite 1 papel principal obrigatório.
2. Cadastro de integrante permite papéis secundários opcionais sem duplicidade.
3. Ao adicionar integrante na Escala, o papel principal é sugerido automaticamente.
4. Cada integrante pode ter apenas 1 papel por Event.
5. admin e Owner/Ministro do Event podem editar papel na Escala.
6. team-member não pode editar papel de terceiros na Escala.
7. Event Locked bloqueia qualquer alteração de papel na Escala.
8. Mensagens de erro são amigáveis e sem detalhes técnicos internos.

---

## Regras de Negócio

- RB-001: Integrante possui exatamente 1 papel principal no cadastro.
- RB-002: Integrante pode possuir 0..N papéis secundários.
- RB-003: Papel principal é default na atribuição inicial da Escala.
- RB-004: Integrante executa no máximo 1 papel por Event.
- RB-005: Somente admin ou Owner/Ministro do Event edita papel na Escala.
- RB-006: team-member não pode alterar papel de terceiros na Escala.
- RB-007: Event Locked rejeita mutação na Escala.

---

## Eventos de Domínio

| Evento | Quando disparar | Ouvintes | Ação |
|---|---|---|---|
| `MemberRoleSetInEvent` | Integrante recebe papel na Escala | Event Context | Atualizar estado da Escala |
| `MemberRoleUpdatedInEvent` | Papel da Escala é alterado | Event Context | Revalidar consistência da Escala |
| `RoleChangeDenied` | Usuário sem Privilégio tenta editar | UI/Observabilidade | Exibir erro de autorização |
| `LockedEventMutationBlocked` | Tentativa de alterar Event Locked | UI/Observabilidade | Exibir erro de estado inválido |

---

## Dependências

### Técnicas
- [ ] Fluxo de Privilégio ativo no contexto de autenticação.
- [ ] Use cases de Event/Escala com validação de autorização e estado.
- [ ] Hooks com mapeamento de DomainError para estado de UI.

### PRDs relacionados
- [ ] PRD-003 - Visualização da Página de Eventos.
- [ ] PRD-004 - Cadastro de Usuário com Privilégios.
- [ ] PRD-006 - Papéis Principal/Secundários e Papel Único por Event.

---

## Definição de Pronto (DoD)

- [ ] Regras RB-001..RB-007 implementadas.
- [ ] Testes cobrindo Privilégio, validação e Event Locked.
- [ ] Nenhum erro de domínio tratado diretamente no componente.
- [ ] Lint, build e test:unit passando.
- [ ] Sem schema/migration/ORM.

---

## Referências

- **Contract API:** [contract.yaml](./contract.yaml)
- **BDD Scenarios:** [scenarios.feature](./scenarios.feature)
- **Testes de Aceitação:** [acceptance-tests.md](./acceptance-tests.md)
- **PRD Isolado:** [PRD-006](../../planning/prds/PRD-006-papeis-principal-secundarios-escala-evento.md)

---

**Criado em:** 2026-05-19  
**Atualizado em:** 2026-05-19  
**Responsável:** Product Manager Agent
