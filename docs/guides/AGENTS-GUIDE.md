# Worship+ Agents Guide

**Versão:** 2.0  
**Data:** 3 de Março de 2026  
**Status:** Guia Operacional  
**Changelog:** 
- v2.0 (03/03/2026): Adicionado workflow multi-agent com context economy (seções 2.3, 3)
- v1.0 (02/03/2026): Versão inicial  

---

## Índice

1. [Propósito deste Guia](#1-propósito-deste-guia)
2. [Hierarquia de Documentação](#2-hierarquia-de-documentação)
   - 2.3 [Context Economy — Summaries](#23-context-economy--summaries-novo-)
3. [Multi-Agent Workflow — Event-Driven Communication](#3-multi-agent-workflow--event-driven-communication) ✨ **Novo**
   - 3.1 [Arquitetura de Comunicação](#31-arquitetura-de-comunicação)
   - 3.2 [Context Economy por Task](#32-context-economy-por-task)
   - 3.3 [Workflow de User Story (Passo a Passo)](#33-workflow-de-user-story-passo-a-passo)
   - 3.4 [Quando Criar ADR ou Diagrama (Selectivity)](#34-quando-criar-adr-ou-diagrama-selectivity)
4. [Como Cada Agent Deve Usar o DDD-GUIDE (Otimizado)](#4-como-cada-agent-deve-usar-o-ddd-guide-otimizado)
5. [Fluxo de Trabalho por Agent (Legado)](#5-fluxo-de-trabalho-por-agent-legado)
6. [Checklist de Validação](#6-checklist-de-validação)
7. [Exemplos Práticos](#7-exemplos-práticos)
8. [Resumo Executivo](#8-resumo-executivo)
9. [Atualização de Documentação (Living Documents)](#9-atualização-de-documentação-living-documents)

---

## 1. Propósito deste Guia

Este documento define **como os agents (PM, Arquiteto, Desenvolvedores)** devem consultar e aplicar o **DDD-GUIDE.md** no seu trabalho diário.

### Objetivos:
- ✅ Garantir consistência na terminologia (linguagem úbiqua)
- ✅ Evitar duplicação ou divergência de conceitos
- ✅ Alinhar implementação técnica com modelagem de domínio
- ✅ Facilitar comunicação entre agents usando vocabulário comum

---

## 2. Hierarquia de Documentação

### 2.1 Source of Truth

```
┌─────────────────────────────────────────────────────────────┐
│                      DDD-GUIDE.md                           │
│  • Subdomínios (Core, Supporting, Generic)                 │
│  • Glossário de Linguagem Úbiqua                           │
│  • Bounded Contexts                                         │
│  • Agregados e Invariantes                                 │
│  • Eventos de Domínio                                       │
│  • Decisões Arquiteturais                                   │
└─────────────────────────────────────────────────────────────┘
                           ▲
                           │ consulta
                           │
      ┌────────────────────┼────────────────────┐
      │                    │                    │
      ▼                    ▼                    ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PM Agent    │  │ Architecture │  │  Dev Agent   │
│              │  │    Agent     │  │ (Frontend/   │
│ • Stories    │  │ • Schema     │  │  Backend)    │
│ • Roadmap    │  │ • API design │  │ • Code       │
│ • Prioriza   │  │ • Infra      │  │ • Tests      │
└──────────────┘  └──────────────┘  └──────────────┘
```

### 2.2 Documentos de Referência

| Documento | Propósito | Quem Atualiza | Quando Consultar |
|-----------|-----------|---------------|------------------|
| **DDD-GUIDE.md** | Modelagem de domínio, decisõestécnicas | Software Architecture Agent | SEMPRE antes de criar entidades, escrever stories ou implementar features |
| **project-details.md** | Especificações de negócio, regras funcionais | Product Manager Agent | Ao definir requisitos funcionais |
| **RFC-0001/0002** | Decisões técnicas específicas (mídia, storage) | Software Architecture Agent | Implementação de features relacionadas |
| **brainstorm-insights.md** | Perguntas e decisões em validação | Product Manager Agent | Refinamento de backlog |
| **agents/*/AGENT.md** | Responsabilidades e processo de cada agent | Cada Agent | Onboarding e alinhamento de papel |

### 2.3 Context Economy — Summaries (Novo ✨)

**Motivação:** Reduzir custo e aumentar velocidade dos agents evitando carregar documentação completa (DDD-GUIDE 48KB, MVP-ROADMAP 24KB, ARCHITECTURE-DECISIONS 50KB).

**Summaries Disponíveis:**

| Summary | Tamanho | Original | Economia | Quando Usar |
|---------|---------|----------|----------|-------------|
| [`docs/summaries/ddd-summary.md`](../summaries/ddd-summary.md) | 5KB | DDD-GUIDE (48KB) | **90%** | Sempre que precisar consultar: bounded contexts, glossário, agregados, eventos |
| [`docs/summaries/arch-decisions-summary.md`](../summaries/arch-decisions-summary.md) | 3KB | ARCHITECTURE-DECISIONS (50KB) | **94%** | Quando precisar: SOLID, patterns, testing, code review |
| [`docs/summaries/tech-stack.md`](../summaries/tech-stack.md) | 2KB | Disperso em RFCs (20KB) | **90%** | Quando precisar: versões, comandos, env variables |

**Total: 10KB vs 148KB (93% economia)**

**Regra de Ouro:**
- ✅ **Always Load:** Summaries (6.5KB)
- 🔗 **Reference Only:** Full docs (link to specific section when needed)
- ❌ **Never Load:** Entire large files without specific need

---

## 3. Multi-Agent Workflow — Event-Driven Communication

### 3.1 Arquitetura de Comunicação

```
┌─────────────────────────────────────────────────────────────┐
│                 Event-Driven Workflow                       │
└─────────────────────────────────────────────────────────────┘

PM Agent
  │ 1. Cria story.md (1.5KB)
  │    Input: ddd-summary (5KB) + template (1.5KB) + requirement (1.5KB) = 8KB
  ├────────────────────────────────────────────────────────────┐
  │                                                            │
  ▼                                                            │
  Emite: "StoryReady" event                                    │
  Payload: { storyPath, usId }                                 │
                                                               │
Architecture Agent                                             │
  │ 2. Define contract.yaml (2.5KB)                           │
  │    Input: story.md (1.5KB) + ddd-summary (5KB) = 6.5KB   │
  │ 3. Gera scenarios.feature (1KB)                           │
  │ 4. Gera acceptance-tests.md (1KB)                         │
  ├────────────────────────────────────────────────────────────┤
  │                                                            │
  ▼                                                            │
  Emite: "ContractDefined" event                               │
  Payload: { contractPath, scenariosPath, usId }               │
                                                               │
┌──────────────────┴──────────────────┐                       │
│                                     │                       │
▼                                     ▼                       │
Frontend Agent (paralelo)      Backend Agent (paralelo)       │
Input: contract.yaml (2.5KB)   Input: contract.yaml (2.5KB)  │
Implementa UI                  Implementa API                 │
```

### 3.2 Context Economy por Task

| Task | Agent | Input Tradicional | Input Otimizado | Economia |
|------|-------|-------------------|-----------------|----------|
| **Criar US** | PM | DDD-GUIDE (48KB) + MVP-ROADMAP (24KB) + ARCH (50KB) = 122KB | ddd-summary (5KB) + template (1.5KB) + requirement (1.5KB) = **8KB** | **93%** |
| **Definir Contract** | Arch | story.md (1.5KB) + DDD-GUIDE (48KB) + ARCH (50KB) = 99.5KB | story.md (1.5KB) + ddd-summary (5KB) = **6.5KB** | **93%** |
| **Implementar UI** | Frontend | contract.yaml (2.5KB) + DDD-GUIDE (48KB) + DESIGN-SYSTEM (20KB) = 70.5KB | contract.yaml (2.5KB) + design-tokens (2KB) = **4.5KB** | **94%** |
| **Implementar API** | Backend | contract.yaml (2.5KB) + DDD-GUIDE (48KB) + schema (10KB) = 60.5KB | contract.yaml (2.5KB) + schema (2KB) = **4.5KB** | **93%** |

**Resultado:** 
- Custo por US: $0.0005 (vs $0.015 tradicional) = **97% savings**
- MVP 50 US: $0.025 (vs $0.75 tradicional) = **$0.72 saved**

### 3.3 Workflow de User Story (Passo a Passo)

#### **Fase 1: Planejamento (PM Agent)**

```bash
# 1. PM usa script de automação
./scripts/create-user-story.sh --id 025 --title "marcar-disponibilidade" \
  --context Team --priority P1 --estimate 5

# Output:
# ✅ Cria diretório: docs/user-stories/US-025-marcar-disponibilidade/
# ✅ Copia 4 arquivos base do template
# ✅ Substitui placeholders (US-025, [Marcar Disponibilidade])
# ✅ Abre editor para PM preencher critérios/regras

# 2. PM preenche story.md
# Input carregado: ddd-summary (5KB) + template (1.5KB) = 6.5KB
# - Como/Quero/Para que
# - Critérios de Aceitação (3-7 itens)
# - Regras de Negócio
# - Eventos de Domínio
# - Dependências

# 3. PM valida story
./scripts/validate-user-story.sh --id 025

# Output:
# ✅ 1️⃣ Título < 50 caracteres
# ✅ 2️⃣ Como/Quero/Para que
# ✅ 3️⃣ Bounded Context (Team Context)
# ✅ 4️⃣ Prioridade (P1)
# ✅ 5️⃣ Critérios de Aceitação (5 critérios)
# ✅ 6️⃣ Termos do glossário DDD
# ✅ 7️⃣ Estimativa (5 pontos)
# ✅ 8️⃣ Regras de Negócio
# ✅ 9️⃣ Eventos de Domínio
# ✅ 🔟 Dependências
# ✅ 1️⃣1️⃣ Definição de Pronto
#
# 📊 RESULTADO: ✅ READY FOR DEVELOPMENT
```

**Notification:**
```
@Architecture Agent: US-025 ready for contract definition
Input: docs/user-stories/US-025-marcar-disponibilidade/story.md (1.5KB)
Context: docs/summaries/ddd-summary.md (5KB)
Total: 6.5KB (vs 99.5KB traditional)
```

#### **Fase 2: Definição Técnica (Architecture Agent)**

```bash
# Architecture Agent carrega:
# - story.md (1.5KB)
# - ddd-summary.md (5KB)
# Total: 6.5KB

# 1. Analisa complexidade
#    Critérios:
#    - Trade-offs? (Sim/Não) → ADR
#    - 3+ contextos? (Sim/Não) → Sequence Diagram
#    - Algoritmo complexo? (Sim/Não) → ADR

# US-025 análise:
# - Trade-offs? NÃO (solução direta: CRUD + recorrência)
# - 3+ contextos? NÃO (apenas Team Context)
# - Algoritmo? NÃO (lógica simples: override > recurring)
# Conclusão: Apenas 4 arquivos base (sem ADR/diagrama)

# 2. Define contract.yaml
#    Endpoints:
#    - GET /members/:id/availability
#    - POST /members/:id/availability/recurring
#    - POST /members/:id/availability/override
#    - DELETE /members/:id/availability/override/:date

# 3. Gera scenarios.feature (BDD)
#    - Happy Path: marcar disponível/indisponível
#    - Validation: data passada rejeitada
#    - Business Rules: override prevalece sobre recurring

# 4. Gera acceptance-tests.md
#    - Functional: CRUD availability
#    - Security: RLS (apenas próprio membro ou admin)
#    - UI/UX: calendar picker, mobile-friendly
```

**Notification:**
```
@Frontend Agent: US-025 ready for implementation
Input: docs/user-stories/US-025-*/contract.yaml (2.5KB)
Total: 2.5KB (vs 70.5KB traditional)

@Backend Agent: US-025 ready for implementation
Input: docs/user-stories/US-025-*/contract.yaml (2.5KB)
Total: 2.5KB (vs 60.5KB traditional)
```

#### **Fase 3: Implementação Paralela**

```
Frontend Agent                     Backend Agent
│                                  │
├─ Load: contract.yaml (2.5KB)    ├─ Load: contract.yaml (2.5KB)
├─ Load: design-tokens (2KB)      ├─ Load: schema (2KB)
│  Total: 4.5KB                   │  Total: 4.5KB
│                                  │
├─ Implementa UI:                 ├─ Implementa API:
│  - AvailabilityCalendar.jsx     │  - POST /availability/recurring
│  - Recurring pattern picker     │  - POST /availability/override
│  - Override date picker          │  - RLS policies
│  - Mobile calendar (44x44px)    │  - Validation: data >= hoje
│                                  │
└─ Aguarda backend deploy         └─ Deploy staging
   (polling /health)                 (smoke tests)
                                  │
                                  └─ ✅ Backend ready
                                  │
                                  ▼
Frontend completa integração      
└─ ✅ US-025 concluída
```

### 3.4 Quando Criar ADR ou Diagrama (Selectivity)

**ADR (Architecture Decision Record):**

Criar quando:
- ✅ Trade-offs significativos (múltiplas opções viáveis)
- ✅ Decisão afeta múltiplos Bounded Contexts
- ✅ Algoritmo complexo (ex: escalação inteligente)
- ✅ Mudança de stack técnico (ex: adicionar Redis)

Exemplos:
- US-050: Upload VS (Single vs Chunked vs Resumable) → ADR-050
- US-024: Escalação Inteligente (Greedy vs GA vs Manual) → ADR-024

**Sequence Diagram (Mermaid):**

Criar quando:
- ✅ 3+ atores/contextos interagindo
- ✅ Orquestração complexa (upload → transcode → notify)
- ✅ Sagas ou compensações
- ✅ Integração com APIs externas

Exemplos:
- US-050: Upload VS (7 atores: User, Frontend, API, S3, Lambda, CDN, Notification) → sequence-diagram.mmd

**Base (Sempre criar):**
- ✅ story.md (1.5KB)
- ✅ contract.yaml (2.5KB)
- ✅ scenarios.feature (1KB)
- ✅ acceptance-tests.md (1KB)

---

## 4. Como Cada Agent Deve Usar o DDD-GUIDE (Otimizado)

### 4.1 Product Manager Agent

#### **Quando Consultar:**
- ✅ Antes de escrever qualquer user story
- ✅ Ao priorizar backlog (usar classificação de subdomínios)
- ✅ Quando houver dúvida sobre terminologia
- ✅ Ao validar critérios de aceitação

#### **Seções Críticas:**
1. **Seção 2 - Subdomínios:** Priorizar Core Domain > Supporting > Generic
2. **Seção 4 - Glossário:** Usar APENAS termos do glossário nas stories
3. **Seção 6 - Eventos de Domínio:** Entender fluxos e consequências de ações

#### **Checklist ao Escrever User Stories:**
- [ ] Usei termos do glossário DDD-GUIDE? (ex: "Setlist" não "Repertório")
- [ ] Identifiquei qual Bounded Context esta story afeta?
- [ ] Verifiquei eventos de domínio que devem ser disparados?
- [ ] Consultei invariantes do agregado relacionado?

#### **Exemplo de Story Correta:**
```markdown
**US-123: Adicionar Música ao Event Setlist**

**Como** Ministro/Owner de um evento  
**Quero** adicionar uma música do Setlist ao meu evento  
**Para que** eu possa preparar o Event Setlist do culto

**Critérios de Aceitação:**
- Buscar músicas do Setlist (biblioteca geral)
- Adicionar música ao Event Setlist (músicas do evento específico)
- Disparar evento de domínio `SongAddedToEvent`
- Se evento em <30 dias, promover VS da música para S3 Active

**Bounded Context:** Worship Context  
**Agregado:** Event Aggregate  
**Prioridade:** ALTA (Core Domain - Event Management)
```

---

### 4.2 Software Architecture Agent

#### **Quando Consultar:**
- ✅ Antes de definir schemas de banco de dados
- ✅ Ao projetar APIs (endpoints, payloads)
- ✅ Quando precisar definir integrações entre contextos
- ✅ Ao implementar regras de negócio complexas

#### **Seções Críticas:**
1. **Seção 3 - Bounded Contexts:** Entender fronteiras e responsabilidades
2. **Seção 5 - Agregados:** Definir roots, entidades filhas e invariantes
3. **Seção 7 - Mapa de Contextos:** Entender relacionamentos (Customer/Supplier)
4. **Seção 8 - Decisões Arquiteturais:** Stack técnico e padrões

#### **Checklist ao Criar Schema de DB:**
- [ ] Identifiquei o Bounded Context correto?
- [ ] Identifiquei o Aggregate Root?
- [ ] Respeitei as invariantes do agregado?
- [ ] Usei ID references entre contextos (não embedded)?
- [ ] Nomenclatura de tabelas usa linguagem úbiqua?

#### **Exemplo de Schema (Event Aggregate):**
```sql
-- Worship Context: Event Aggregate
CREATE TABLE events (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date TIMESTAMP NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL, -- Referência ao TeamMember (Team Context)
  locked BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE event_setlists (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  song_id UUID NOT NULL, -- Referência ao Song (Music Library Context)
  display_order INT NOT NULL,
  UNIQUE(event_id, song_id)
);

CREATE TABLE schedules (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE assignments (
  id UUID PRIMARY KEY,
  schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
  member_id UUID NOT NULL, -- Referência ao TeamMember (Team Context)
  role VARCHAR(50) NOT NULL -- cantor, musico, midia, som
);
```

**Notas:**
- Tabelas usam nomes do glossário DDD-GUIDE
- Relacionamentos entre contextos são por ID (não FK com CASCADE entre contextos diferentes)
- Invariantes do agregado serão validadas na camada de aplicação

---

### 4.3 Frontend Developer Agent

#### **Quando Consultar:**
- ✅ Antes de criar componentes relacionados a entidades de domínio
- ✅ Ao implementar formulários (validações devem respeitar invariantes)
- ✅ Quando precisar de labels, placeholders e mensagens (usar linguagem úbiqua)
- ✅ Ao implementar fluxos que disparam eventos de domínio

#### **Seções Críticas:**
1. **Seção 4 - Glossário:** Labels e textos da UI devem usar termos exatos
2. **Seção 5 - Agregados:** Validações de formulário devem respeitar invariantes
3. **Seção 6 - Eventos de Domínio:** Entender consequências das ações do usuário
4. **Seção 8.3 - Lifecycle de Mídia:** Implementar UX de archival/promoção

#### **Checklist ao Criar Componente:**
- [ ] Labels usam termos do glossário? (não traduções livres)
- [ ] Validações respeitam invariantes do agregado?
- [ ] Tratei estados de eventos de domínio (ex: `SongAddedToEvent` → mostrar "Promovendo VS...")?
- [ ] Formulários mobile-first (≥44x44px touch targets)?

#### **Exemplo de Componente (EventSetlistForm):**
```jsx
function EventSetlistForm({ eventId }) {
  const [songs, setSongs] = useState([])
  
  const handleAddSong = async (songId) => {
    // Validação: respeita invariante do Event Aggregate
    // "Evento deve ter pelo menos 1 música antes de ser publicado"
    
    await api.post(`/events/${eventId}/setlist`, { songId })
    // Backend dispara evento SongAddedToEvent
    // Se evento <30 dias, backend promove VS automaticamente
    
    toast.success('Música adicionada ao Event Setlist') // Usa termo do glossário
  }
  
  return (
    <div>
      <h2>Event Setlist</h2> {/* Não "Repertório do Evento" */}
      <p>Músicas selecionadas para este evento</p>
      <SongSearchModal onSelect={handleAddSong} />
      <SongList songs={songs} />
    </div>
  )
}
```

---

### 4.4 Backend Developer Agent

#### **Quando Consultar:**
- ✅ Antes de criar controllers, services ou repositories
- ✅ Ao implementar regras de negócio
- ✅ Quando precisar disparar eventos de domínio
- ✅ Ao criar APIs (nomenclatura de endpoints e payloads)

#### **Seções Críticas:**
1. **Seção 3 - Bounded Contexts:** Organizar código em módulos por contexto
2. **Seção 5 - Agregados:** Implementar operações do agregado
3. **Seção 6 - Eventos de Domínio:** Disparar eventos de domínio corretamente
4. **Seção 8 - Decisões Arquiteturais:** Seguir stack técnico definido

#### **Checklist ao Implementar Feature:**
- [ ] Organizei código pelo Bounded Context correto?
- [ ] Implementei operações do Aggregate Root?
- [ ] Validei invariantes antes de persistir?
- [ ] Disparei eventos de domínio apropriados?
- [ ] Nomenclatura de classes/métodos usa linguagem úbiqua?

#### **Exemplo de Service (Event Aggregate):**
```typescript
// worship-context/services/event.service.ts
import { EventRepository } from './event.repository'
import { EventBus } from '@/shared/event-bus'

export class EventService {
  constructor(
    private repo: EventRepository,
    private eventBus: EventBus
  ) {}
  
  async addSongToEvent(eventId: string, songId: string, userId: string) {
    const event = await this.repo.findById(eventId)
    
    // Validar invariante: apenas Admin ou Owner pode editar
    if (!event.isOwner(userId) && !user.isAdmin()) {
      throw new ForbiddenError('Apenas Owner ou Admin podem editar')
    }
    
    // Validar invariante: evento locked restringe edições
    if (event.locked && !event.isOwner(userId)) {
      throw new ForbiddenError('Evento bloqueado para edições')
    }
    
    // Adicionar música ao Event Setlist
    event.addSong(songId)
    await this.repo.save(event)
    
    // Disparar evento de domínio
    this.eventBus.publish({
      type: 'SongAddedToEvent',
      payload: { eventId, songId, eventDate: event.date }
    })
    
    // Consequência: MediaService escuta SongAddedToEvent
    // Se evento.date - hoje <= 30 dias → promove VS para S3 Active
  }
}
```

---

## 5. Fluxo de Trabalho por Agent (Legado)

> **Nota:** Esta seção documenta o workflow legado. Ver seção 3 para workflow multi-agent otimizado.

### 5.1 Product Manager: Criando Backlog

```
1. Ler DDD-GUIDE seção 2 (Subdomínios)
   → Identificar qual subdomínio (Core, Supporting, Generic)

2. Priorizar: Core Domain > Supporting > Generic

3. Ler DDD-GUIDE seção 4 (Glossário)
   → Escrever user story usando APENAS termos do glossário

4. Ler DDD-GUIDE seção 3 (Bounded Contexts)
   → Identificar qual contexto (Worship, Music Library, Team, Media)

5. Ler DDD-GUIDE seção 5 (Agregados)
   → Verificar invariantes que devem ser validadas

6. Ler DDD-GUIDE seção 6 (Eventos de Domínio)
   → Documentar eventos que devem ser disparados

7. Criar story com:
   - Título usando linguagem úbiqua
   - Critérios de aceitação técnicos (invariantes, eventos)
   - Bounded Context identificado
   - Prioridade baseada em subdomínio
```

---

### 5.2 Architecture: Projetando API

```
1. Ler DDD-GUIDE seção 3 (Bounded Contexts)
   → Definir módulos do backend por contexto

2. Ler DDD-GUIDE seção 5 (Agregados)
   → Criar schemas de DB baseados em Aggregate Roots

3. Ler DDD-GUIDE seção 7 (Mapa de Contextos)
   → Definir relacionamentos (ID references, não embedded)

4. Ler DDD-GUIDE seção 8 (Decisões Arquiteturais)
   → Usar stack técnico aprovado (Supabase, S3, Lambda)

5. Projetar endpoints:
   - Nomenclatura usa linguagem úbiqua
   - Payloads refletem estrutura de agregados
   - Responses incluem eventos disparados (se aplicável)

6. Documentar:
   - Schemas de DB com invariantes
   - APIs com exemplos de payload
   - Fluxo de eventos de domínio
```

---

### 5.3 Developer: Implementando Feature

```
1. Ler user story (criada pelo PM)
   → Identificar Bounded Context e Agregado

2. Ler DDD-GUIDE seção 5 (Agregados)
   → Entender operações disponíveis e invariantes

3. Implementar:
   - Classes/módulos organizados por contexto
   - Métodos do Aggregate Root
   - Validações de invariantes
   - Disparar eventos de domínio

4. Nomenclatura:
   - Usar EXATAMENTE termos do glossário
   - Classes: Event, Song, TeamMember (não Evento, Musica, Membro)
   - Métodos: event.addSong() (não event.addToRepertoire())

5. Testes:
   - Testar invariantes do agregado
   - Verificar eventos de domínio disparados
   - Usar linguagem úbiqua nos nomes de testes
```

---

## 6. Checklist de Validação

### 6.1 Antes de Criar Pull Request

**Para TODOS os agents:**

- [ ] **Terminologia:** Usei apenas termos do glossário DDD-GUIDE?
- [ ] **Bounded Context:** Identifiquei qual contexto estou trabalhando?
- [ ] **Agregados:** Respeitei invariantes do agregado?
- [ ] **Eventos:** Disparei eventos de domínio necessários?
- [ ] **Documentação:** Atualizei decision_log.md se houver decisão nova?

---

### 6.2 Code Review Checklist (para Reviewers)

- [ ] Código usa linguagem úbiqua (não termos inventados)?
- [ ] Invariantes do agregado estão validadas?
- [ ] Eventos de domínio são disparados nos momentos corretos?
- [ ] Relacionamentos entre contextos são por ID (não embedded)?
- [ ] Nomenclatura de classes/métodos/endpoints segue glossário?

---

## 7. Exemplos Práticos

### 7.1 ❌ ERRADO: Não Seguiu DDD-GUIDE

**User Story (PM):**
```markdown
Como líder de louvor
Quero adicionar músicas ao repertório do culto
Para que os músicos saibam o que tocar
```

**Problemas:**
- ❌ "líder de louvor" → glossário diz "Ministro/Owner"
- ❌ "repertório do culto" → glossário diz "Event Setlist"

---

### 7.2 ✅ CORRETO: Seguiu DDD-GUIDE

**User Story (PM):**
```markdown
**Como** Ministro/Owner de um evento
**Quero** adicionar músicas do Setlist ao Event Setlist
**Para que** os integrantes escalados saibam quais músicas serão tocadas

**Bounded Context:** Worship Context
**Agregado:** Event Aggregate
**Evento de Domínio:** SongAddedToEvent
**Prioridade:** ALTA (Core Domain - Event Management)

**Critérios de Aceitação:**
- Buscar músicas na biblioteca geral (Setlist)
- Adicionar ao Event Setlist com ordem de exibição
- Disparar SongAddedToEvent
- Se evento em <30 dias, promover VS para S3 Active
```

---

### 7.3 ❌ ERRADO: Schema de DB Não Seguiu Agregados

```sql
-- Problema: Tabelas não refletem Aggregate Roots do DDD-GUIDE
CREATE TABLE musicas (  -- ❌ "musicas" não está no glossário
  id UUID PRIMARY KEY,
  nome VARCHAR(255)     -- ❌ "nome" deveria ser "title"
);

CREATE TABLE eventos_musicas (  -- ❌ "eventos_musicas" não reflete "Event Setlist"
  evento_id UUID,
  musica_id UUID
);
```

---

### 7.4 ✅ CORRETO: Schema Seguiu DDD-GUIDE

```sql
-- Worship Context: Event Aggregate
CREATE TABLE events (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date TIMESTAMP NOT NULL,
  owner_id UUID NOT NULL,
  locked BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false
);

CREATE TABLE event_setlists (  -- ✅ Usa termo "Event Setlist"
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  song_id UUID NOT NULL,      -- ✅ ID reference (não embedded)
  display_order INT NOT NULL
);

-- Music Library Context: Song Aggregate
CREATE TABLE songs (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,  -- ✅ "title" como no glossário
  author VARCHAR(255) NOT NULL,
  music_key VARCHAR(10)
);
```

---

## 8. Resumo Executivo

### Para Product Manager:
- 📖 Consulte DDD-GUIDE seção 2 e 4 (Subdomínios + Glossário)
- ✍️ Escreva stories usando APENAS termos do glossário
- 🎯 Priorize Core Domain > Supporting > Generic

### Para Software Architect:
- 🏗️ Consulte DDD-GUIDE seção 3, 5 e 7 (Contexts, Agregados, Mapa)
- 🗂️ Organize código por Bounded Context
- 🔗 Relacionamentos entre contextos = ID references

### Para Developers:
- 💻 Consulte DDD-GUIDE seção 4, 5 e 6 (Glossário, Agregados, Eventos)
- 🏷️ Use linguagem úbiqua em TODO o código
- ✅ Valide invariantes antes de persistir
- 📢 Dispare eventos de domínio após operações críticas

---

**Este guia deve ser consultado SEMPRE antes de iniciar qualquer trabalho no projeto Worship+.**

---

## 9. Atualização de Documentação (Living Documents)

### 9.1 Princípio: Documentação Viva

O **DDD-GUIDE.md** e demais documentos de domínio são **Living Documents** que devem evoluir com o projeto. **Agents são responsáveis por mantê-los atualizados.**

### 9.2 Quando Atualizar DDD-GUIDE.md

#### ⚠️ **Obrigatório Atualizar:**

1. **Novo Termo de Domínio**
   - Quando: Criar novo conceito de negócio que não existe no glossário
   - Quem: Product Manager Agent (valida) + Software Architecture Agent (documenta)
   - Seção: 4. Glossário de Linguagem Úbiqua
   - Exemplo: "Disponibilidade" (dias disponíveis/indisponíveis de um integrante)

2. **Novo Subdomínio**
   - Quando: Identificar nova área de negócio (Core, Supporting ou Generic)
   - Quem: Software Architecture Agent
   - Seção: 2. Subdomínios
   - Exemplo: Adicionar "Availability Management" como Supporting subdomain

3. **Novo Bounded Context**
   - Quando: Criar nova fronteira de responsabilidade com entidades próprias
   - Quem: Software Architecture Agent
   - Seção: 3. Bounded Contexts
   - Exemplo: Separar "Notification Context" do "User Management"

4. **Novo Agregado ou Entidade**
   - Quando: Criar nova estrutura de dados com invariantes
   - Quem: Software Architecture Agent
   - Seção: 5. Agregados Principais
   - Exemplo: "Availability Aggregate" dentro de Team Context

5. **Novo Evento de Domínio**
   - Quando: Implementar ação que dispara consequências em outros contextos
   - Quem: Backend Developer Agent (implementa) + Software Architecture Agent (documenta)
   - Seção: 6. Eventos de Domínio
   - Exemplo: `MemberAvailabilityChanged`

6. **Nova Decisão Arquitetural**
   - Quando: Escolher nova tecnologia, padrão ou abordagem técnica
   - Quem: Software Architecture Agent
   - Seção: 8. Decisões Arquiteturais
   - Exemplo: Adicionar "YouTube Link como alternativa a VS no MVP"

---

### 9.3 Processo de Atualização

```
1. Agent identifica necessidade de atualização
   ↓
2. Consulta se termo/conceito já existe no DDD-GUIDE
   ↓
3. Se NÃO existe:
   a. Valida com Product Manager (se decisão de negócio)
   b. Documenta no DDD-GUIDE (seção apropriada)
   c. Atualiza versão e data no cabeçalho
   d. Registra mudança em decision_log.md
   ↓
4. Notifica outros agents da atualização (commit message claro)
```

---

### 9.4 Template de Atualização

#### Exemplo: Adicionar Novo Termo ao Glossário

```markdown
## 4. Glossário de Linguagem Úbiqua

### 4.1 Conceitos de Domínio (Core)

| Termo | Definição | Contexto | Sinônimos Rejeitados |
|-------|-----------|----------|---------------------|
| **Disponibilidade** | Período de tempo em que um integrante está disponível ou indisponível para escalação em eventos | Team | Agenda, calendário |
| **Recurring Availability** | Padrão recorrente semanal de disponibilidade (ex: sempre indisponível terças) | Team | Padrão, rotina |
| **Date Override** | Exceção única para data específica (sobrescreve recurring) | Team | Bloqueio, exceção |
```

#### Exemplo: Adicionar Novo Agregado

```markdown
## 5. Agregados Principais

### 5.4 Availability Aggregate (Team Context)

**Root:** `Availability`

**Entidades Filhas:**
- `RecurringAvailability` (padrão semanal)
- `DateOverride` (exceções específicas)

**Invariantes:**
- Integrante deve ter pelo menos 1 availability definida (default: sempre disponível)
- DateOverride tem prioridade sobre RecurringAvailability
- Passado não pode ser editado (apenas data >= hoje)

**Operações:**
\`\`\`typescript
Availability.setRecurring(dayOfWeek, status)
Availability.addOverride(date, status, reason?)
Availability.removeOverride(date)
Availability.checkAvailability(date) → boolean
\`\`\`
```

---

### 9.5 Quem Atualiza O Quê

| Documento | Responsável Primário | Quando Atualizar |
|-----------|------------------------|------------------|
| **DDD-GUIDE.md** | Software Architecture Agent | Novos termos, agregados, bounded contexts, eventos |
| **project-details.md** | Product Manager Agent | Novos requisitos de negócio, regras funcionais |
| **RFC-*.md** | Software Architecture Agent | Decisões técnicas complexas que precisam de proposta formal |
| **decision_log.md** | Qualquer Agent | Toda decisão significativa (link para DDD-GUIDE se aplicável) |
| **AGENTS-GUIDE.md** | Product Manager Agent | Novos processos, checklists, exemplos |
| **MVP-ROADMAP.md** | Product Manager Agent | Mudanças de prioridade ou escopo |

---

### 9.6 Checklist de Atualização de Documentação

**Antes de fazer PR, verificar:**

- [ ] **Novos termos adicionados ao glossário?**
- [ ] **Invariantes documentadas no agregado?**
- [ ] **Eventos de domínio criados foram documentados?**
- [ ] **Versão e data atualizadas no cabeçalho?**
- [ ] **Mudança registrada em decision_log.md?**
- [ ] **Commit message menciona atualização de DDD-GUIDE?**

---

### 9.7 Exemplo Prático: Adicionar Feature de Disponibilidade

**Contexto:** Product Manager solicita feature de disponibilidade de membros.

**Passos do Software Architecture Agent:**

1. **Identificar Subdomínio:** Team Management (Supporting)
2. **Bounded Context:** Team Context
3. **Criar Termos no Glossário:**
   - Disponibilidade
   - Recurring Availability
   - Date Override
4. **Criar Agregado:** Availability Aggregate (seção 5)
5. **Criar Eventos:** MemberAvailabilityChanged (seção 6)
6. **Atualizar Team Context (seção 3.3):**
   - Adicionar Availability nas entidades
   - Documentar regras de negócio
7. **Registrar em decision_log.md:**
   ```markdown
   ## 2026-03-02: Disponibilidade de Membros
   - **Decisão:** Adicionar sistema de disponibilidade para facilitar escalação
   - **Contexto:** Ministro precisa saber quem está disponível antes de escalar
   - **Impacto:** Nova entidade Availability, novos endpoints, nova UI
   - **Referência:** DDD-GUIDE seção 5.4
   ```
8. **Atualizar versão DDD-GUIDE:** 1.0 → 1.1
9. **Commit:** `feat: adiciona sistema de disponibilidade de membros (DDD-GUIDE v1.1)`

---

**⚠️ Lembre-se:** Documentação desatualizada é pior que sem documentação. Mantenha sempre sincronizada!

**Última atualização:** 2 de Março de 2026
