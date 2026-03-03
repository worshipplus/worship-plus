# US-002: Cadastro de Membros

**Como** Administrador do ministério  
**Quero** cadastrar novos integrantes (TeamMembers) da equipe  
**Para que** eles possam fazer login e participar das escalações de eventos

**Bounded Context:** Team Context (Supporting)  
**Prioridade:** P0 - CRÍTICO  
**Estimativa:** 5 pontos  
**Sprint:** Sprint 1

---

## Critérios de Aceitação

1. ✅ Formulário com campos: nome completo, email, área de atuação (cantor/músico/mídia/som), instrumento (se músico)
2. ✅ Cantores especificam se são Ministro/Owner ou Backing Vocal
3. ✅ Upload de avatar opcional (jpg/png, máx 2MB, crop circular)
4. ✅ Envio automático de email com credenciais temporárias (Supabase Auth)
5. ✅ Validação: email único no sistema (constraint DB)
6. ✅ Validação: campos obrigatórios (nome, email, área)
7. ✅ Após salvar: redirecionar para lista de membros com toast de sucesso

---

## Regras de Negócio

- Email deve ser único (constraint no banco de dados `team_members.email UNIQUE`)
- Ministro/Owner deve ter `area = 'cantor'` (validação no frontend e RLS)
- Backing Vocal não pode ser owner de eventos (regra aplicada em Event Aggregate)
- Credenciais temporárias expiram em 24 horas (Supabase Auth config)
- Avatar default: primeira letra do nome em círculo colorido (hash do email para cor)

---

## Eventos de Domínio

| Evento | Quando Disparar | Ouvintes | Ação |
|--------|----------------|----------|------|
| `TeamMemberCreated` | Cadastro bem-sucedido (INSERT na tabela) | User Management Context | Criar conta Supabase Auth com credenciais temporárias |
| `WelcomeEmailSent` | Após criação de conta Auth | Email Service (P2 - futuro) | Enviar email de boas-vindas com link de ativação |

---

## Dependências

### Técnicas
- [ ] Tabela `team_members` criada (migration aplicada)
- [ ] Supabase Auth configurado (projeto criado)
- [ ] RLS policies: apenas admin pode criar membros
- [ ] S3 bucket para avatars (P1 - pode usar Supabase Storage no MVP)

### User Stories
- **US-001:** Autenticação (admin precisa estar logado para cadastrar)

---

## Definição de Pronto (DoD)

- [ ] Código implementado seguindo DDD (agregados corretos)
- [ ] Testes unitários escritos (coverage >80%)
- [ ] Testes de integração para fluxo crítico
- [ ] Contract API atualizado (se necessário)
- [ ] Scenarios BDD validados
- [ ] Code review aprovado
- [ ] Deployment em staging testado
- [ ] Documentação atualizada (se aplicável)

---

## Referências

- **Contract API:** [`contract.yaml`](./contract.yaml)
- **BDD Scenarios:** [`scenarios.feature`](./scenarios.feature)
- **Testes de Aceitação:** [`acceptance-tests.md`](./acceptance-tests.md)
- **DDD-GUIDE:** [`docs/summaries/ddd-summary.md`](../../summaries/ddd-summary.md)
- **Architecture:** [`docs/summaries/arch-decisions-summary.md`](../../summaries/arch-decisions-summary.md)

---

## Notas Adicionais (Opcional)

[Qualquer contexto adicional, links para mockups, decisões de design, etc.]

---

**Criado em:** [data]  
**Atualizado em:** [data]  
**Responsável:** [Product Manager Agent | Nome do PM]
