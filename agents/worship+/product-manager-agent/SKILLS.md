# PM Agent Skills — Core Capabilities

**Versão:** 1.0  
**Data:** 3 de Março de 2026  
**Propósito:** Definir habilidades e formatos de output do PM Agent

---

## 1. Core Skills

### 1.1 Escrever User Stories (Formato Padrão)

**Input:**
- Requisito de negócio (stakeholder ou hipótese)
- [`docs/summaries/ddd-summary.md`](../../../docs/summaries/ddd-summary.md) (glossário)

**Output Format:**
Seguir **exatamente** [`docs/user-stories/_template/story.md`](../../../docs/user-stories/_template/story.md)

**Exemplo de Output:**
```markdown
# US-002: Cadastro de Membros

**Como** Admin  
**Quero** cadastrar novos integrantes da equipe  
**Para que** eles possam fazer login e participar das escalas

**Bounded Context:** Team Context (Supporting)  
**Prioridade:** P0 - CRÍTICO  
**Estimativa:** 5 pontos  
**Sprint:** Sprint 1

## Critérios de Aceitação

1. ✅ Formulário com campos: nome, email, área de atuação, instrumento (se músico)
2. ✅ Cantores especificam se são Ministro ou Backing Vocal
3. ✅ Upload de avatar (opcional, formatos: jpg/png, máx 2MB)
4. ✅ Envio de email com credenciais temporárias (Supabase Auth)
5. ✅ Validação: email único no sistema
6. ✅ Validação: campos obrigatórios (nome, email, área)
7. ✅ Após salvar: redirecionar para lista de membros

## Regras de Negócio

- Email único (constraint no banco de dados)
- Ministro deve ter area = 'music' (validação no frontend e RLS)
- Backing Vocal não pode ser owner de eventos (regra em Event Aggregate)
- Credenciais temporárias expiram em 24 horas

## Eventos de Domínio

| Evento | Quando Disparar | Ouvintes | Ação |
|--------|----------------|----------|------|
| `TeamMemberCreated` | Cadastro bem-sucedido | User Management Context | Criar conta Supabase Auth |
| `WelcomeEmailSent` | Após criação de conta | Email Service (P2) | Enviar email de boas-vindas |

## Dependências

### Técnicas
- [ ] Tabela `team_members` criada (migration aplicada)
- [ ] Supabase Auth configurado
- [ ] RLS policies: apenas admin pode criar membros

### User Stories
- **US-001:** Autenticação (admin precisa estar logado)

## Definição de Pronto (DoD)

- [ ] Código implementado seguindo DDD (Team Context)
- [ ] Componente `MemberForm.jsx` criado e testado
- [ ] Testes unitários escritos (coverage >80%)
- [ ] Testes de integração para cadastro end-to-end
- [ ] Contract API validado
- [ ] Scenarios BDD validados
- [ ] Code review aprovado
- [ ] Deployment em staging testado
- [ ] Acessibilidade validada

## Referências

- **Contract API:** [`contract.yaml`](./contract.yaml)
- **BDD Scenarios:** [`scenarios.feature`](./scenarios.feature)
- **Testes de Aceitação:** [`acceptance-tests.md`](./acceptance-tests.md)
- **DDD-GUIDE:** [`docs/summaries/ddd-summary.md`](../../summaries/ddd-summary.md#team-context)

---

**Criado em:** 3 de Março de 2026  
**Responsável:** Product Manager Agent
```

**Validação:**
- ✅ Usa termos do glossário (TeamMember, Ministro, Backing Vocal)
- ✅ Bounded Context correto (Team Context - Supporting)
- ✅ Critérios de aceitação mensuráveis (7 critérios)
- ✅ Regras de negócio mapeadas (4 regras)
- ✅ Eventos de domínio identificados (2 eventos)
- ✅ Dependências listadas (técnicas + US)
- ✅ DoD completo

---

### 1.2 Priorizar Backlog (Core > Supporting > Generic)

**Input:**
- Backlog de User Stories (todas as US)
- Velocity da equipe (pontos/sprint)

**Output Format:**
Backlog priorizado por:
1. **P0 (CRÍTICO):** Bloqueia MVP
2. **P1 (IMPORTANTE):** Melhora UX significativamente
3. **P2 (FUTURO):** Nice to have

**Critérios de Priorização:**
1. **Core Domain primeiro:** Worship Context (eventos, setlists)
2. **Supporting depois:** Team (disponibilidade), Media (VS)
3. **Generic por último:** User Management (auth já coberto por Supabase)

**Exemplo de Output:**
```markdown
# Backlog Priorizado — MVP

## P0 - CRÍTICO (Sprint 1-2)

### Worship Context (Core) — 32 pontos
- ⭐ US-004: Criar Evento (8 pontos)
- ⭐ US-005: Adicionar Música ao Event Setlist (5 pontos)
- ⭐ US-007: Visualizar Event Setlist (3 pontos)
- ⭐ US-011: Publicar Evento (8 pontos)
- ⭐ US-012: Listar Eventos (3 pontos)
- ⭐ US-013: Editar Evento (5 pontos)

### User Management (Generic) — 8 pontos
- ⭐ US-001: Autenticação (3 pontos)
- ⭐ US-003: Editar Perfil (5 pontos)

### Team Context (Supporting) — 16 pontos
- ⭐ US-002: Cadastro de Membros (5 pontos)
- ⭐ US-008: Definir Disponibilidade (5 pontos)
- ⭐ US-009: Visualizar Disponibilidade (3 pontos)
- ⭐ US-010: Escalar Membros (3 pontos)

**Total P0:** 56 pontos (~3 sprints de 20 pontos)

---

## P1 - IMPORTANTE (Sprint 3-4)

### Media Context (Supporting) — 21 pontos
- US-050: Upload de VS para S3 (13 pontos)
- US-051: Visualizar VS (3 pontos)
- US-052: Download de VS (5 pontos)

### Team Context (Supporting) — 13 pontos
- US-024: Escalação Inteligente (algoritmo) (13 pontos)

**Total P1:** 34 pontos (~2 sprints)

---

## P2 - FUTURO (Sprint 5+)

### Worship Context — 8 pontos
- US-020: Feed de Atividade (5 pontos)
- US-021: Notificações Push (3 pontos)

### Analytics Context — 5 pontos
- US-030: Dashboard de Métricas (5 pontos)

**Total P2:** 13 pontos (~1 sprint)
```

---

### 1.3 Validar Terminologia (DDD Glossário)

**Habilidade:** Identificar termos incorretos e sugerir correção.

**Exemplo:**

**Input (ERRADO):**
```markdown
**Como** Líder de louvor  
**Quero** adicionar uma música ao repertório do culto  
**Para que** os backing vocais possam ensaiar
```

**Output (CORRIGIDO):**
```markdown
**Como** Ministro/Owner  
**Quero** adicionar uma música ao Event Setlist  
**Para que** os Backing Vocalists possam ensaiar

# Correções aplicadas:
- ❌ "Líder de louvor" → ✅ "Ministro/Owner" (termo do glossário)
- ❌ "repertório do culto" → ✅ "Event Setlist" (termo específico)
- ❌ "backing vocais" → ✅ "Backing Vocalists" (termo correto)
```

---

### 1.4 Estimar User Stories (Planning Poker)

**Habilidade:** Estimar pontos de story baseado em complexidade.

**Escala Fibonacci:** 1, 2, 3, 5, 8, 13, 21

**Critérios:**

| Pontos | Complexidade | Tempo | Descrição |
|--------|--------------|-------|-----------|
| **1** | Trivial | 1-2h | CRUD simples, 1 tela, sem regras de negócio |
| **2** | Simples | 2-4h | CRUD com validações básicas |
| **3** | Média-Baixa | 4-8h | CRUD + validações + 1 integração |
| **5** | Média | 1-2 dias | Múltiplas telas, validações complexas |
| **8** | Média-Alta | 2-3 dias | Integrações, regras de negócio, eventos |
| **13** | Alta | 3-5 dias | Algoritmos, múltiplos contextos, ADR |
| **21+** | Muito Alta | >5 dias | **Quebrar em US menores!** |

**Exemplo:**

**US-001 (Autenticação):**
- 1 tela (login)
- Integração com Supabase Auth (simples)
- Validações básicas
- **Estimativa:** 3 pontos

**US-024 (Escalação Inteligente):**
- Algoritmo greedy
- Múltiplas queries (disponibilidade × eventos)
- Regras de negócio complexas (preferências, conflitos)
- ADR necessário
- **Estimativa:** 13 pontos

---

### 1.5 Definir Critérios de Aceitação (INVEST)

**Habilidade:** Escrever critérios mensuráveis seguindo INVEST.

**INVEST:**
- **I**ndependent (independente de outras US)
- **N**egotiable (pode ser refinada)
- **V**aluable (entrega valor ao usuário)
- **E**stimable (pode ser estimada)
- **S**mall (pequena o suficiente para 1 sprint)
- **T**estable (critérios verificáveis)

**Exemplo de Critérios TESTÁVEIS:**

**❌ ERRADO (não testável):**
```markdown
- Sistema deve ser rápido
- Interface deve ser bonita
- Deve ser fácil de usar
```

**✅ CORRETO (testável):**
```markdown
- Login completa em < 2 segundos (p95)
- Contraste de cores ≥ 4.5:1 (WCAG AA)
- Formulário preenchível com teclado (tab order correto)
- 80% dos usuários completam cadastro sem ajuda (métrica UX)
```

---

### 1.6 Identificar Eventos de Domínio

**Habilidade:** Mapear eventos disparados por User Story.

**Template:**
```markdown
| Evento | Quando Disparar | Ouvintes | Ação |
|--------|----------------|----------|------|
| `[EventName]Past Tense` | [trigger] | [Context1, Context2] | [ação consequente] |
```

**Exemplo:**

**US-011 (Publicar Evento):**
```markdown
| Evento | Quando Disparar | Ouvintes | Ação |
|--------|----------------|----------|------|
| `EventPublished` | Owner clica em "Publicar Evento" | Team Context | Notificar membros escalados |
| `EventPublished` | Mesmo trigger | Media Context | Ativar VS no S3 (migrate Glacier → Active) |
| `MembersNotified` | Após notificação enviada | Analytics Context | Registrar engagement |
```

---

## 2. Secondary Skills

### 2.1 Criar Templates de Comunicação

**Email para Stakeholder (Aprovação de Story):**
```markdown
Assunto: [US-XXX] Aprovação de User Story — [Título]

Olá [Nome],

Criamos a User Story abaixo e gostaríamos da sua aprovação antes de implementar:

**US-XXX: [Título]**

Como [usuário]  
Quero [ação]  
Para que [benefício]

**Critérios de Aceitação:**
1. [Critério 1]
2. [Critério 2]
...

**Estimativa:** X pontos (~Y dias)
**Sprint:** Sprint Z

Você aprova esta story? Algum ajuste necessário?

Link: docs/user-stories/US-XXX/story.md

Obrigado!
```

---

### 2.2 Gerar Sprint Report

**Formato:**
```markdown
# Sprint 1 Report — Worship+

**Período:** 01/03/2026 - 14/03/2026  
**Velocity:** 24 pontos (objetivo: 20-30)

## 📊 Métricas

- **Stories Completadas:** 6 de 7 (85%)
- **Pontos Entregues:** 24 de 28 (85%)
- **Bugs Encontrados:** 2 (P2 - minor)
- **Lead Time Médio:** 3.5 dias (story → deploy)

## ✅ User Stories Completadas

1. ✅ US-001: Autenticação (3 pontos)
2. ✅ US-002: Cadastro Membros (5 pontos)
3. ✅ US-004: Criar Evento (8 pontos)
4. ✅ US-005: Adicionar Música ao Event Setlist (5 pontos)
5. ✅ US-007: Visualizar Event Setlist (3 pontos)

**Total:** 24 pontos

## ⏸️ Carryover (Sprint 2)

- US-011: Publicar Evento (8 pontos) — 80% concluído, aguardando QA

## 🐛 Bugs Encontrados

- Bug #1: Campo email aceita duplicados (P2 - minor) — Corrigido
- Bug #2: Avatar não carrega em mobile (P2 - minor) — Em correção

## 📈 Burndown Chart

[ASCII chart ou link para dashboard]

## 🎯 Retrospective

**What Went Well:**
- Velocity dentro do esperado
- Comunicação fluida entre PM e devs
- Critérios de aceitação claros (zero dúvidas)

**What to Improve:**
- US-011 subestimada (8 → deveria ser 13)
- QA bottleneck (aguardar approval leva 1 dia)

**Action Items:**
- [ ] Revisar estimativa de stories de integração
- [ ] QA fazer review incremental (não esperar final)

---

**Próxima Sprint:** Sprint 2 (15/03 - 28/03)  
**Forecast:** 26 pontos (carry over 8 + new 18)
```

---

### 2.3 Conduzir Sprint Planning

**Agenda:**
1. **Review de Velocity** (5min)
   - Velocity sprint anterior: X pontos
   - Velocity média (3 sprints): Y pontos
   - Objetivo próxima sprint: Z pontos

2. **Priorização de Backlog** (15min)
   - Selecionar top 8 US do backlog
   - Validar dependências
   - Confirmar prioridades com PO

3. **Estimativa de Stories** (30min)
   - Planning Poker para cada US
   - Discussão de complexidade
   - Consenso de pontos

4. **Commitment** (10min)
   - Equipe commita com X pontos
   - Identificar riscos/bloqueios
   - Definir goal da sprint

**Output:**
- Sprint backlog com 5-8 US
- Velocity target (20-30 pontos)
- Sprint goal (ex: "Implementar criação e visualização de eventos")

---

## 3. Edge Cases (Quando NÃO Usar Skills)

### 3.1 Não Escrever Contrato de API

**PM não escreve `contract.yaml`** (responsabilidade do Architecture Agent)

**Fazer:**
- ✅ Escrever `story.md` com critérios de aceitação
- ✅ Informar Architecture Agent que story está pronta para contrato

**Não Fazer:**
- ❌ Tentar definir schemas OpenAPI
- ❌ Especificar endpoints HTTP (GET/POST)
- ❌ Definir payloads JSON

---

### 3.2 Não Escrever Scenarios BDD

**PM não escreve `scenarios.feature`** (responsabilidade do Architecture Agent)

**Fazer:**
- ✅ Escrever critérios de aceitação claros em `story.md`
- ✅ Architecture Agent converte critérios em BDD

**Não Fazer:**
- ❌ Escrever Given/When/Then manualmente
- ❌ Criar casos de teste técnicos

---

### 3.3 Não Implementar Código

**PM não implementa features** (responsabilidade de Frontend/Backend Agents)

**Fazer:**
- ✅ Validar se implementação atende critérios de aceitação
- ✅ Aprovar PR após QA

**Não Fazer:**
- ❌ Escrever código React/JavaScript
- ❌ Fazer code review técnico (deixar para Tech Lead)

---

## 4. Quick Reference

### Checklist: Criar User Story

```markdown
- [ ] Título objetivo (< 50 chars)
- [ ] Como/Quero/Para que bem definidos
- [ ] Bounded Context identificado
- [ ] Prioridade (P0/P1/P2) justificada
- [ ] Critérios de aceitação mensuráveis (3-7)
- [ ] Regras de negócio mapeadas
- [ ] Eventos de domínio identificados
- [ ] Dependências listadas
- [ ] Estimativa de pontos (1, 2, 3, 5, 8, 13)
- [ ] Termos do glossário usados
- [ ] DoD completo
- [ ] Referências incluídas
```

---

**Última atualização:** 3 de Março de 2026  
**Mantido por:** Product Manager Agent
