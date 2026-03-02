# Worship+ Agents Guide

**Versão:** 1.0  
**Data:** 2 de Março de 2026  
**Status:** Guia Operacional  

---

## Índice

1. [Propósito deste Guia](#1-propósito-deste-guia)
2. [Hierarquia de Documentação](#2-hierarquia-de-documentação)
3. [Como Cada Agent Deve Usar o DDD-GUIDE](#3-como-cada-agent-deve-usar-o-ddd-guide)
4. [Fluxo de Trabalho por Agent](#4-fluxo-de-trabalho-por-agent)
5. [Checklist de Validação](#5-checklist-de-validação)
6. [Exemplos Práticos](#6-exemplos-práticos)
7. [Atualização de Documentação (Living Documents)](#7-atualização-de-documentação-living-documents)

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
| **DDD-GUIDE.md** | Modelagem de domínio, decisões técnicas | Software Architecture Agent | SEMPRE antes de criar entidades, escrever stories ou implementar features |
| **project-details.md** | Especificações de negócio, regras funcionais | Product Manager Agent | Ao definir requisitos funcionais |
| **RFC-0001/0002** | Decisões técnicas específicas (mídia, storage) | Software Architecture Agent | Implementação de features relacionadas |
| **brainstorm-insights.md** | Perguntas e decisões em validação | Product Manager Agent | Refinamento de backlog |
| **agents/*/AGENT.md** | Responsabilidades e processo de cada agent | Cada Agent | Onboarding e alinhamento de papel |

---

## 3. Como Cada Agent Deve Usar o DDD-GUIDE

### 3.1 Product Manager Agent

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

### 3.2 Software Architecture Agent

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

### 3.3 Frontend Developer Agent

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

### 3.4 Backend Developer Agent

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

## 4. Fluxo de Trabalho por Agent

### 4.1 Product Manager: Criando Backlog

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

### 4.2 Architecture: Projetando API

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

### 4.3 Developer: Implementando Feature

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

## 5. Checklist de Validação

### 5.1 Antes de Criar Pull Request

**Para TODOS os agents:**

- [ ] **Terminologia:** Usei apenas termos do glossário DDD-GUIDE?
- [ ] **Bounded Context:** Identifiquei qual contexto estou trabalhando?
- [ ] **Agregados:** Respeitei invariantes do agregado?
- [ ] **Eventos:** Disparei eventos de domínio necessários?
- [ ] **Documentação:** Atualizei decision_log.md se houver decisão nova?

---

### 5.2 Code Review Checklist (para Reviewers)

- [ ] Código usa linguagem úbiqua (não termos inventados)?
- [ ] Invariantes do agregado estão validadas?
- [ ] Eventos de domínio são disparados nos momentos corretos?
- [ ] Relacionamentos entre contextos são por ID (não embedded)?
- [ ] Nomenclatura de classes/métodos/endpoints segue glossário?

---

## 6. Exemplos Práticos

### 6.1 ❌ ERRADO: Não Seguiu DDD-GUIDE

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

### 6.2 ✅ CORRETO: Seguiu DDD-GUIDE

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

### 6.3 ❌ ERRADO: Schema de DB Não Seguiu Agregados

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

### 6.4 ✅ CORRETO: Schema Seguiu DDD-GUIDE

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

## 7. Resumo Executivo

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

## 7. Atualização de Documentação (Living Documents)

### 7.1 Princípio: Documentação Viva

O **DDD-GUIDE.md** e demais documentos de domínio são **Living Documents** que devem evoluir com o projeto. **Agents são responsáveis por mantê-los atualizados.**

### 7.2 Quando Atualizar DDD-GUIDE.md

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

### 7.3 Processo de Atualização

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

### 7.4 Template de Atualização

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

### 7.5 Quem Atualiza O Quê

| Documento | Responsável Primário | Quando Atualizar |
|-----------|------------------------|------------------|
| **DDD-GUIDE.md** | Software Architecture Agent | Novos termos, agregados, bounded contexts, eventos |
| **project-details.md** | Product Manager Agent | Novos requisitos de negócio, regras funcionais |
| **RFC-*.md** | Software Architecture Agent | Decisões técnicas complexas que precisam de proposta formal |
| **decision_log.md** | Qualquer Agent | Toda decisão significativa (link para DDD-GUIDE se aplicável) |
| **AGENTS-GUIDE.md** | Product Manager Agent | Novos processos, checklists, exemplos |
| **MVP-ROADMAP.md** | Product Manager Agent | Mudanças de prioridade ou escopo |

---

### 7.6 Checklist de Atualização de Documentação

**Antes de fazer PR, verificar:**

- [ ] **Novos termos adicionados ao glossário?**
- [ ] **Invariantes documentadas no agregado?**
- [ ] **Eventos de domínio criados foram documentados?**
- [ ] **Versão e data atualizadas no cabeçalho?**
- [ ] **Mudança registrada em decision_log.md?**
- [ ] **Commit message menciona atualização de DDD-GUIDE?**

---

### 7.7 Exemplo Prático: Adicionar Feature de Disponibilidade

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
