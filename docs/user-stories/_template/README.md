# Template de User Stories — Worship+

**Versão:** 1.0  
**Data:** 3 de Março de 2026  
**Mantido por:** Product Manager Agent + Architecture Agent

---

## 📋 Propósito

Este template define a estrutura padrão para documentação de User Stories no projeto Worship+, garantindo:

- ✅ **Consistência:** Todas as US seguem mesmo formato
- ✅ **Economia de Contexto:** Agents consomem apenas arquivos relevantes
- ✅ **Qualidade:** Contratos + BDD garantem comportamento esperado
- ✅ **Rastreabilidade:** Artefatos linkados facilitam navegação

---

## 📁 Estrutura Base (Obrigatória - 4 arquivos)

```
docs/user-stories/US-XXX-nome-feature/
├── story.md              # User Story (source of truth)
├── contract.yaml         # OpenAPI contract (API specification)
├── scenarios.feature     # BDD Gherkin (comportamento esperado)
└── acceptance-tests.md   # Checklist manual de QA
```

### 1. `story.md` — Source of Truth (~1.5KB)

**Conteúdo:**
- User Story (Como/Quero/Para que)
- Bounded Context + Prioridade
- Critérios de Aceitação
- Regras de Negócio
- Eventos de Domínio
- Dependências
- Definição de Pronto (DoD)

**Consumidores:** PM Agent, Architecture Agent, Developers

---

### 2. `contract.yaml` — API Contract (~2-3KB)

**Formato:** OpenAPI 3.1.0  
**Conteúdo:**
- Endpoints (GET/POST/PATCH/DELETE)
- Request/Response schemas
- Códigos de erro
- Exemplos de uso

**Consumidores:** Frontend Agent, Backend Agent (P2)

**Benefícios:**
- ✅ Frontend/Backend consomem **apenas contrato** (vs 48KB de DDD-GUIDE)
- ✅ Validação automática com TypeScript/Zod
- ✅ Menos retrabalho (contrato aprovado antes de implementar)

---

### 3. `scenarios.feature` — BDD Scenarios (~1-2KB)

**Formato:** Gherkin (Given/When/Then)  
**Conteúdo:**
- Happy path (fluxos de sucesso)
- Validações de input
- Casos de erro
- Edge cases
- Autorização/Permissões
- Integrações entre contextos

**Consumidores:** Developers, QA, Testers automatizados

**Benefícios:**
- ✅ Define **comportamento esperado** de forma clara
- ✅ Facilita TDD (Test-Driven Development)
- ✅ Serve como **documentação viva** do sistema

---

### 4. `acceptance-tests.md` — QA Checklist (~1KB)

**Conteúdo:**
- Checklist de testes funcionais
- Testes de segurança (auth, XSS, CSRF)
- Testes de UI/UX (responsividade, acessibilidade)
- Testes de integração (APIs, eventos de domínio)
- Testes de regressão
- Testes de performance (Web Vitals)
- Sign-off do PO/QA/Tech Lead

**Consumidores:** QA, Testers manuais, Product Owner

---

## 📁 Estrutura Adicional (Opcional - Seletiva)

Para User Stories **complexas/críticas**, adicionar:

```
docs/user-stories/US-XXX-nome-feature/
├── story.md
├── contract.yaml
├── scenarios.feature
├── acceptance-tests.md
├── adr-XXX.md            # Architecture Decision Record (Mermaid)
└── sequence-diagram.mmd  # Diagrama de Sequência (Mermaid)
```

---

### 5. `adr-XXX.md` — ADR (Opcional - ~3KB)

**Quando criar:**
- ✅ Decisões que afetam múltiplos bounded contexts
- ✅ Trade-offs técnicos significativos
- ✅ Escolha de algoritmos complexos
- ✅ Mudanças de stack/padrões estabelecidos

**Formato:** Markdown + Mermaid diagrams  
**Estrutura:**
- Contexto (problema a resolver)
- Opções consideradas (com pros/cons)
- Decisão tomada (qual escolhemos e por quê)
- Consequências (impactos esperados)
- Diagrams (fluxos, trade-offs em Mermaid)

**Exemplos de US que precisam ADR:**
- ✅ US-024 (Escalação Inteligente): Greedy vs ML, trade-off performance vs precisão
- ✅ US-050 (Upload VS): Chunked upload vs resumable, trade-off simplicidade vs robustez
- ❌ US-001 (Login): Supabase Auth padrão, sem trade-offs

---

### 6. `sequence-diagram.mmd` — Diagrama de Sequência (Opcional - ~2KB)

**Quando criar:**
- ✅ Fluxos com 3+ bounded contexts interagindo
- ✅ Orquestração complexa (upload → S3 → processing → notification)
- ✅ Sagas/transações distribuídas
- ✅ Integrações externas (webhooks, APIs terceiros)

**Formato:** Mermaid Sequence Diagram  
**Conteúdo:**
- Atores (Frontend, Backend, Contexts, Serviços externos)
- Mensagens síncronas/assíncronas
- Eventos de domínio
- Condições e loops

**Exemplos de US que precisam diagrama:**
- ✅ US-018 (Publicar Evento): Worship → Team → Notification (3 contexts)
- ✅ US-050 (Upload VS): Client → S3 → Lambda → DB → CloudFront (5 steps)
- ❌ US-002 (Cadastro Membro): 1 context, linear (sem necessidade)

---

## 🚀 Workflow de Criação

### Fase 1: PM Agent Escreve Story

```bash
# Input: DDD summary (5KB) + MVP Roadmap (24KB)
# Output: story.md (1.5KB)
pm-agent create-story --priority P0 --context "Worship"
```

---

### Fase 2: Architecture Agent Define Contrato

```bash
# Input: story.md (1.5KB) + DDD summary (5KB)
# Output: contract.yaml (2.5KB)
arch-agent define-contract --story US-001 --format openapi
```

**Architecture Agent analisa complexidade e decide:**
- US **simples** (CRUD): 4 arquivos
- US **média** (integrações): 4 arquivos + `sequence-diagram.mmd`
- US **complexa** (algoritmos/trade-offs): 4 arquivos + `adr-XXX.md` + `sequence-diagram.mmd`

---

### Fase 3: Architecture Agent Gera BDD Scenarios

```bash
# Input: story.md (1.5KB) + contract.yaml (2.5KB)
# Output: scenarios.feature (1KB)
arch-agent generate-scenarios --story US-001
```

---

### Fase 4: Architecture Agent Gera Acceptance Tests

```bash
# Input: story.md + scenarios.feature
# Output: acceptance-tests.md (1KB)
arch-agent generate-acceptance-tests --story US-001
```

---

### Fase 5: Developers Implementam

**Frontend Agent:**
```bash
# Input: contract.yaml (2.5KB) + COMPONENT_GUIDELINES.md (4KB)
# Output: LoginForm.jsx + tests
fe-agent implement --story US-001 --contract contract.yaml
```

**Backend Agent (P2):**
```bash
# Input: contract.yaml (2.5KB) + schema (2KB)
# Output: auth.controller.ts + tests
be-agent implement --story US-001 --contract contract.yaml
```

---

### Fase 6: QA Valida

```bash
# Input: acceptance-tests.md
# Output: Checklist preenchido
qa-agent validate --story US-001 --environment staging
```

---

## 💰 Economia de Contexto

### Comparação: Tradicional vs Template

| Artifact | Tradicional (DDD completo) | Template (sumário + contrato) | Economia |
|----------|----------------------------|-------------------------------|----------|
| **PM Agent** | 48KB (DDD-GUIDE) | 5KB (ddd-summary) | **90%** |
| **Frontend Agent** | 48KB (DDD-GUIDE) | 2.5KB (contract.yaml) | **95%** |
| **Backend Agent** | 48KB (DDD-GUIDE) | 2.5KB (contract.yaml) | **95%** |
| **Architecture Agent** | 48KB (DDD-GUIDE) | 5KB (ddd-summary) | **90%** |

**Economia Média: 92%**

### Custo por User Story

| Fase | Tokens Input | Tokens Output | Custo (Claude Sonnet) |
|------|--------------|---------------|----------------------|
| PM escreve story | 5KB | 1.5KB | $0.0001 |
| Arch define contrato | 6.5KB | 2.5KB | $0.0001 |
| Arch gera scenarios | 4KB | 1KB | $0.00005 |
| Frontend implementa | 6.5KB | 8KB | $0.0002 |
| Backend implementa (P2) | 4.5KB | 6KB | $0.00015 |
| **TOTAL por US** | - | - | **~$0.0005** |

**Projeção MVP (50 User Stories):**
- Custo total: 50 × $0.0005 = **$0.025** (vs $0.75 tradicional)
- **Economia: 97%**

---

## 📚 Exemplos Reais

### Simples (4 arquivos)
- [`US-001-autenticacao/`](../US-001-autenticacao/) - Login básico
- [`US-002-cadastro-membros/`](../US-002-cadastro-membros/) - CRUD TeamMember

### Média (4 + diagrama)
- [`US-018-publicar-evento/`](../US-018-publicar-evento/) - Worship → Team → Notification (3 contexts)

### Complexa (4 + ADR + diagrama)
- [`US-024-escalacao-inteligente/`](../US-024-escalacao-inteligente/) - Algoritmo greedy, trade-offs
- [`US-050-upload-vs/`](../US-050-upload-vs/) - Chunked upload S3, processamento Lambda

---

## ✅ Checklist de Validação

**Antes de considerar US completa:**

- [ ] `story.md` tem critérios de aceitação claros
- [ ] `contract.yaml` é válido OpenAPI 3.1.0
- [ ] `scenarios.feature` cobre happy path + erro cases
- [ ] `acceptance-tests.md` tem checklist completo
- [ ] ADR criado se decisão técnica complexa
- [ ] Diagrama criado se 3+ contexts ou orquestração
- [ ] Todos os arquivos linkam uns aos outros
- [ ] Commits seguem Conventional Commits
- [ ] Testes implementados (coverage ≥80%)
- [ ] Code review aprovado

---

## 🔗 Referências

- **DDD Summary:** [`docs/summaries/ddd-summary.md`](../../summaries/ddd-summary.md)
- **Architecture Decisions:** [`docs/summaries/arch-decisions-summary.md`](../../summaries/arch-decisions-summary.md)
- **Tech Stack:** [`docs/summaries/tech-stack.md`](../../summaries/tech-stack.md)
- **Agents Guide:** [`docs/guides/AGENTS-GUIDE.md`](../../guides/AGENTS-GUIDE.md)
- **MVP Roadmap:** [`docs/planning/MVP-ROADMAP.md`](../../planning/MVP-ROADMAP.md)

---

**Mantido por:** Architecture Agent  
**Última atualização:** 3 de Março de 2026
