# PM Agent Rules — Context Optimization Strategy

**Versão:** 1.0  
**Data:** 3 de Março de 2026  
**Propósito:** Definir estratégias de economia de contexto para PM Agent

---

## 1. Context Cache Strategy

### 1.1 Always Load (Crítico - <10KB)

**Documentos que DEVEM ser carregados em toda conversação:**

- ✅ [`docs/summaries/ddd-summary.md`](../../../docs/summaries/ddd-summary.md) (**5KB**)
  - Glossário de linguagem úbiqua
  - Bounded contexts resumidos
  - Agregados principais
  - Eventos de domínio

- ✅ [`docs/user-stories/_template/story.md`](../../../docs/user-stories/_template/story.md) (**1.5KB**)
  - Formato padrão de User Story
  - Estrutura de critérios de aceitação
  - Checklist de DoD

**Total:** ~6.5KB (vs 48KB do DDD-GUIDE completo)  
**Economia:** **86%**

---

### 1.2 Reference Only (Economia - Link, Não Carregar)

**Documentos que devem ser REFERENCIADOS, não carregados:**

- 📚 [`docs/architecture/DDD-GUIDE.md`](../../../docs/architecture/DDD-GUIDE.md) (48KB)
  - ❌ NÃO carregar completo
  - ✅ Referenciar seção específica quando necessário
  - Exemplo: "Ver DDD-GUIDE.md#worship-context para detalhes"

- 📚 [`docs/planning/MVP-ROADMAP.md`](../../../docs/planning/MVP-ROADMAP.md) (24KB)
  - ❌ NÃO carregar completo
  - ✅ Carregar APENAS seção relevante (1 sprint = ~3KB)
  - Exemplo: Carregar apenas "Sprint 1" quando planear Sprint 1

- 📚 [`docs/architecture/ARCHITECTURE-DECISIONS.md`](../../../docs/architecture/ARCHITECTURE-DECISIONS.md) (50KB)
  - ❌ NÃO carregar
  - ✅ Usar sumário: `docs/summaries/arch-decisions-summary.md` (3KB)

---

### 1.3 Never Load Full (Alto Custo - Evitar)

**Documentos que NUNCA devem ser carregados completos:**

- ❌ [`docs/guides/AGENTS-GUIDE.md`](../../../docs/guides/AGENTS-GUIDE.md) (40KB)
  - Apenas `AGENT.md` basta (missão e responsabilidades)

- ❌ Histórico de commits (`git log`)
  - Se precisar, carregar apenas diff relevante

- ❌ Código-fonte de implementação
  - PM não precisa ver código (apenas contratos)

---

## 2. Input Optimization (Minimize Context per Task)

### 2.1 Ao Criar Nova User Story

**Contexto Necessário:**
```
Input Total: ~8KB

1. docs/summaries/ddd-summary.md (5KB)
   - Glossário (usar termos corretos)
   - Bounded context (identificar US)
   - Agregados (entender invariantes)

2. docs/user-stories/_template/story.md (1.5KB)
   - Formato padrão

3. Requisito de negócio (1.5KB)
   - Input do stakeholder ou hipótese
```

**Contexto Desnecessário:**
```
❌ NÃO carregar:
- DDD-GUIDE completo (48KB) → usar sumário (5KB)
- MVP-ROADMAP completo (24KB) → carregar apenas prioridades gerais
- ARCHITECTURE-DECISIONS (50KB) → não relevante para escrever story
```

**Economia:** 8KB vs 125KB = **93% de economia**

---

### 2.2 Ao Priorizar Backlog (Sprint Planning)

**Contexto Necessário:**
```
Input Total: ~12KB

1. docs/summaries/ddd-summary.md (5KB)
   - Identificar Core Domain (priorizar primeiro)
   
2. docs/planning/MVP-ROADMAP.md#sprint-X (3KB)
   - Carregar APENAS sprint alvo (não roadmap completo)
   
3. Velocity da equipe (2KB)
   - Pontos entregues em sprints anteriores
   
4. Dependências entre US (2KB)
   - Graph de dependências (US-001 → US-002)
```

**Contexto Desnecessário:**
```
❌ NÃO carregar:
- MVP-ROADMAP completo (24KB) → apenas sprint atual
- Stories antigas já implementadas
- Detalhes técnicos de implementação
```

**Economia:** 12KB vs 80KB = **85% de economia**

---

### 2.3 Ao Validar User Story (Review)

**Contexto Necessário:**
```
Input Total: ~10KB

1. docs/user-stories/US-XXX/story.md (1.5KB)
   - Story sendo validada
   
2. docs/summaries/ddd-summary.md (5KB)
   - Validar terminologia
   - Validar bounded context correto
   
3. docs/user-stories/_template/README.md (3.5KB)
   - Checklist de validação
```

**Contexto Desnecessário:**
```
❌ NÃO carregar:
- contract.yaml (não validado por PM)
- scenarios.feature (não validado por PM)
- acceptance-tests.md (apenas checklist final, não durante escrita)
```

**Economia:** 10KB vs 25KB = **60% de economia**

---

## 3. Output Optimization (Minimize Generated Content)

### 3.1 Ao Criar Story

**Output Esperado:** ~1.5KB (story.md completo)

**Evitar:**
- ❌ Documentação adicional não solicitada
- ❌ Resumos longos ("Criei a story com...")
- ❌ Repetir toda a story na resposta

**Fazer:**
- ✅ Gerar apenas `story.md`
- ✅ Responder: "Story US-XXX criada. Ver docs/user-stories/US-XXX/"

---

### 3.2 Ao Priorizar Backlog

**Output Esperado:** ~2KB (lista de 5-8 US priorizadas)

```markdown
# Sprint 1 Backlog

## P0 - CRÍTICO (5 stories)
- US-001: Autenticação (3 pontos)
- US-002: Cadastro Membros (5 pontos)
- US-004: Criar Evento (8 pontos)
- US-005: Adicionar Música ao Event Setlist (5 pontos)
- US-007: Visualizar Event Setlist (3 pontos)

**Total:** 24 pontos (velocity esperada: 20-30 pontos/sprint)
```

**Evitar:**
- ❌ Copiar stories completas no output
- ❌ Explicar cada story (stakeholder já conhece)

---

## 4. Communication Patterns (Event-Driven)

### 4.1 Com Architecture Agent

**Após criar story:**
```markdown
@Architecture Agent: US-XXX pronta para definição de contrato.

Input necessário:
- docs/user-stories/US-XXX/story.md (1.5KB)
- docs/summaries/ddd-summary.md (5KB)

Output esperado:
- contract.yaml (2.5KB)
- scenarios.feature (1KB)
- acceptance-tests.md (1KB)
```

**Benefício:** Architecture Agent não precisa carregar MVP-ROADMAP completo (24KB), apenas a story específica (1.5KB).

---

### 4.2 Com Frontend/Backend Agents

**Após contrato definido:**
```markdown
@Frontend Agent: US-XXX pronta para implementação.

Input necessário:
- contract.yaml (2.5KB)
- COMPONENT_GUIDELINES.md (4KB)

Output esperado:
- LoginForm.jsx + tests (8KB)
```

**Benefício:** Frontend Agent não precisa carregar DDD-GUIDE (48KB), apenas contrato (2.5KB).

---

## 5. Session Memory (Contexto Persistente)

### 5.1 Manter na Memória de Sessão

**Durante uma sprint** (2 semanas), manter cached:

- ✅ `docs/summaries/ddd-summary.md` (5KB)
- ✅ Backlog da sprint atual (3KB)
- ✅ Velocity da equipe (2KB)

**Total:** 10KB mantidos em cache

---

### 5.2 Limpar da Memória (Após Sprint)

Ao finalizar sprint:
- ❌ Limpar backlog da sprint anterior
- ❌ Limpar stories já implementadas
- ✅ Manter apenas sumários (5KB)

---

## 6. Automated Workflows (Reduzir Interações Manuais)

### 6.1 Script: Criar User Story

```bash
# PM invoca script ao invés de escrever story do zero
./scripts/create-user-story.sh --id 025 --title "criar-evento"

# Script:
# 1. Copia template (story.md, contract.yaml, scenarios.feature, etc)
# 2. Substitui placeholders (US-XXX → US-025)
# 3. Abre editor para PM preencher critérios de aceitação
# 4. Valida formato (checklist automático)

# Economia de tempo: 15min → 5min (66%)
# Economia de contexto: PM não precisa carregar template manualmente
```

---

### 6.2 Script: Validar User Story

```bash
# PM valida story antes de marcar como "Ready"
./scripts/validate-user-story.sh --id US-001

# Output:
# ✅ Título OK (< 50 chars)
# ✅ Como/Quero/Para que OK
# ✅ Bounded Context identificado
# ❌ Critérios de aceitação ausentes (mínimo 3)
# ✅ Termos do glossário usados corretamente
# ✅ DoD completo

# Status: ❌ NOT READY (1 erro encontrado)
```

---

## 7. Metrics and Monitoring

### 7.1 Context Usage Metrics (Objetivo: < 10KB/task)

```python
# Monitorar custo de contexto por task
{
  "task": "create_story",
  "input_size": "8KB",
  "output_size": "1.5KB",
  "total": "9.5KB",  # ✅ Dentro do objetivo (< 10KB)
  "timestamp": "2026-03-03T14:30:00Z"
}
```

---

### 7.2 Alertas de Over-Context

**Disparar alerta se:**
- Input > 15KB
- Output > 5KB
- Total > 20KB

**Ação:**
- Revisar quais documentos estão sendo carregados
- Otimizar (usar sumários ao invés de docs completos)

---

## 8. Quick Reference

### Checklist de Context Optimization

**Antes de iniciar task:**
- [ ] Carreguei apenas `ddd-summary.md` (5KB)?
- [ ] Evitei carregar DDD-GUIDE completo (48KB)?
- [ ] Evitei carregar MVP-ROADMAP completo (24KB)?
- [ ] Carreguei apenas seção relevante (não documento completo)?

**Após completar task:**
- [ ] Output é conciso (< 5KB)?
- [ ] Não repeti documentos completos no output?
- [ ] Usei referências (links) ao invés de copiar conteúdo?

---

## 9. Exemplos Práticos

### Exemplo 1: Criar US-002 (Cadastro de Membros)

**❌ ERRADO (Alto Contexto):**
```
Input:
- DDD-GUIDE.md (48KB)
- MVP-ROADMAP.md (24KB)
- ARCHITECTURE-DECISIONS.md (50KB)
Total: 122KB
```

**✅ CORRETO (Baixo Contexto):**
```
Input:
- ddd-summary.md (5KB)
- _template/story.md (1.5KB)
- Requisito: "Admin cria membros com email, nome, instrumento" (1KB)
Total: 7.5KB

Economia: 94%
```

---

### Exemplo 2: Priorizar Sprint 1

**❌ ERRADO:**
```
Input:
- MVP-ROADMAP.md completo (24KB)
- Todas as 50 US detalhadas (75KB)
Total: 99KB
```

**✅ CORRETO:**
```
Input:
- ddd-summary.md (5KB)
- MVP-ROADMAP.md#sprint-1-only (3KB)
- Velocity equipe (2KB)
Total: 10KB

Economia: 90%
```

---

**Última atualização:** 3 de Março de 2026  
**Mantido por:** Product Manager Agent
