# Worship+ MVP Roadmap

**Versão:** 1.0  
**Data:** 2 de Março de 2026  
**Status:** Planejamento Ativo  
**Product Manager:** Definido pelo usuário

---

## Índice

1. [Visão do MVP](#1-visão-do-mvp)
2. [Priorização P0 (Crítico)](#2-priorização-p0-crítico)
3. [Priorização P1 (Importante)](#3-priorização-p1-importante)
4. [Priorização P2 (Futuro)](#4-priorização-p2-futuro)
5. [User Stories Detalhadas](#5-user-stories-detalhadas)
6. [Estimativas e Entregas](#6-estimativas-e-entregas)

---

## 1. Visão do MVP

### 1.1 Objetivo Principal

Criar plataforma **mínima viável** que permita:
- Ministros criarem eventos e montarem setlists
- Ministros escalarem integrantes baseado em disponibilidade
- Integrantes visualizarem seus eventos e acessarem referências de músicas (YouTube)
- Owners editarem seus próprios eventos sem depender de Admin

### 1.2 O Que NÃO Está no MVP

❌ Upload de VS (Virtual Sound) - **MOVIDO PARA P1**  
❌ Processamento/transcodificação de áudio  
❌ Archival inteligente (Glacier)  
❌ Player de áudio integrado  
❌ Download de pacotes ZIP  
❌ Notificações push  
❌ Feed de atividade  

### 1.3 Alternativa ao VS no MVP

✅ **YouTube Link:** Todo cadastro de música terá campo **obrigatório** para link do YouTube  
- Músicos acessam versão correta da música via YouTube  
- Reduz complexidade de storage/processamento  
- Permite delivery rápido do MVP  
- VS pode ser adicionado em P1 como feature adicional (não substitui YouTube)

---

## 2. Priorização P0 (Crítico)

### Sprint 1: Fundação (2 semanas)

#### **US-001: Autenticação Básica** ⭐ CRÍTICO
**Como** usuário  
**Quero** fazer login com email e senha  
**Para que** eu possa acessar o sistema de forma segura

**Critérios de Aceitação:**
- [ ] Tela de login funcional
- [ ] Validação de credenciais via Supabase Auth
- [ ] Recuperação de senha por email
- [ ] Logout com limpeza de sessão
- [ ] Redirecionamento para /login se não autenticado

**Bounded Context:** User Management (Supporting)  
**Estimativa:** 3 pontos  
**Prioridade:** P0

---

#### **US-002: Cadastro de Membros** ⭐ CRÍTICO
**Como** Admin  
**Quero** cadastrar novos integrantes da equipe  
**Para que** eles possam fazer login e participar das escalas

**Critérios de Aceitação:**
- [ ] Formulário de cadastro: nome, email, área de atuação, instrumento (se músico)
- [ ] Cantores especificam se são Ministro ou Backing Vocal
- [ ] Upload de avatar (opcional)
- [ ] Envio de email com credenciais temporárias
- [ ] Validação: email único, campos obrigatórios

**Bounded Context:** Team Context  
**Agregado:** TeamMember  
**Estimativa:** 5 pontos  
**Prioridade:** P0

---

#### **US-003: Edição de Perfil** ⭐ CRÍTICO
**Como** Team Member  
**Quero** editar meu próprio perfil  
**Para que** eu possa atualizar meus dados e avatar

**Critérios de Aceitação:**
- [ ] Team Member pode editar: nome, telefone, foto, instrumento, área, congregação
- [ ] Cantores podem alterar papel (Ministro ↔ Backing Vocal)
- [ ] Validações de campos obrigatórios
- [ ] Admin pode editar qualquer perfil

**Bounded Context:** Team Context  
**Agregado:** TeamMember  
**Evento:** `ProfileUpdated`  
**Estimativa:** 3 pontos  
**Prioridade:** P0

---

### Sprint 2: Músicas e Disponibilidade (2 semanas)

#### **US-004: Cadastro de Músicas (YouTube Link)** ⭐ CRÍTICO
**Como** Admin ou Ministro  
**Quero** cadastrar músicas do Setlist com link do YouTube  
**Para que** integrantes tenham acesso à versão correta da música

**Critérios de Aceitação:**
- [ ] Formulário: título, autor, tom (opcional), **YouTube Link (obrigatório)**
- [ ] Campo opcional para partitura (PDF upload)
- [ ] Validação: YouTube URL válida (regex)
- [ ] Preview do vídeo ao visualizar música (embed YouTube)
- [ ] Busca por título ou autor

**Bounded Context:** Music Library Context  
**Agregado:** Song  
**Estimativa:** 5 pontos  
**Prioridade:** P0

**Decisão Técnica:**
```typescript
interface Song {
  id: string
  title: string
  author: string
  key?: string // Tom (C, D, E, etc)
  youtubeUrl: string // OBRIGATÓRIO no MVP
  sheetMusicUrl?: string // PDF opcional
  createdAt: Date
}
```

---

#### **US-005: Definir Disponibilidade Semanal** ⭐ CRÍTICO
**Como** integrante  
**Quero** definir meu padrão semanal de disponibilidade  
**Para que** ministros saibam quando posso ser escalado

**Critérios de Aceitação:**
- [ ] Interface visual: calendário semanal (dom-sáb)
- [ ] Toggle disponível/indisponível por dia da semana
- [ ] Padrão inicial: todos os dias disponíveis
- [ ] Salvar padrão recorrente (RecurringAvailability)
- [ ] Visualização clara do padrão atual

**Bounded Context:** Team Context  
**Agregado:** Availability  
**Evento:** `RecurringAvailabilitySet`  
**Estimativa:** 5 pontos  
**Prioridade:** P0

---

#### **US-006: Adicionar Exceções de Disponibilidade** ⭐ CRÍTICO
**Como** integrante  
**Quero** marcar datas específicas como disponível/indisponível  
**Para que** eu possa ter exceções ao meu padrão semanal

**Critérios de Aceitação:**
- [ ] Calendário mensal com seleção de data
- [ ] Marcar data específica como disponível ou indisponível
- [ ] Campo opcional para motivo/observação
- [ ] DateOverride **sobrescreve** RecurringAvailability
- [ ] Apenas datas >= hoje podem ser editadas
- [ ] Listar exceções ativas

**Bounded Context:** Team Context  
**Agregado:** Availability  
**Evento:** `DateOverrideAdded`  
**Estimativa:** 5 pontos  
**Prioridade:** P0

---

### Sprint 3: Eventos e Setlists (2 semanas)

#### **US-007: Criar Evento** ⭐ CRÍTICO
**Como** Admin ou Ministro  
**Quero** criar um novo evento  
**Para que** eu possa montar o setlist e escalar a equipe

**Critérios de Aceitação:**
- [ ] Formulário: título, data/hora, descrição, owner (ministro responsável)
- [ ] Apenas Admin e Ministros podem criar eventos
- [ ] Evento criado fica em estado "rascunho" (não publicado)
- [ ] Owner definido automaticamente como criador (pode ser alterado por Admin)

**Bounded Context:** Worship Context  
**Agregado:** Event  
**Evento:** `EventCreated`  
**Estimativa:** 5 pontos  
**Prioridade:** P0

---

#### **US-008: Adicionar Músicas ao Event Setlist** ⭐ CRÍTICO
**Como** Owner ou Admin  
**Quero** adicionar músicas do Setlist ao meu evento  
**Para que** integrantes saibam quais músicas serão tocadas

**Critérios de Aceitação:**
- [ ] Modal de busca de músicas do Setlist (biblioteca geral)
- [ ] Adicionar música ao Event Setlist com ordem de exibição
- [ ] Drag-and-drop para reordenar músicas
- [ ] Remover música do Event Setlist
- [ ] Visualizar YouTube Link de cada música

**Bounded Context:** Worship Context  
**Agregado:** Event  
**Evento:** `SongAddedToEvent`  
**Estimativa:** 8 pontos  
**Prioridade:** P0

---

#### **US-009: Escalar Integrantes (Verificando Disponibilidade)** ⭐ CRÍTICO
**Como** Owner ou Admin  
**Quero** escalar integrantes para um evento verificando sua disponibilidade  
**Para que** eu só escale quem está disponível na data

**Critérios de Aceitação:**
- [ ] Modal de seleção de integrantes
- [ ] Filtrar por área (cantor, músico, mídia, som)
- [ ] **Indicador visual de disponibilidade** (verde/vermelho)
- [ ] Alerta se tentar escalar quem está indisponível (pode continuar se necessário)
- [ ] Definir papel específico (ex: Ministro, Backing Vocal, Violão, Bateria)
- [ ] Remover integrante da escala
- [ ] Apenas Admin e Owner do Event podem editar escala
- [ ] Team Member sem privilégio visualiza escala em modo read-only

**Bounded Context:** Worship Context  
**Agregado:** Event (Schedule + Assignment)  
**Evento:** `MemberAssigned`  
**Estimativa:** 8 pontos  
**Prioridade:** P0

**Regra de Negócio:**
```typescript
// Ao listar integrantes para escalação
integrantes.forEach(member => {
  const isAvailable = member.availability.checkAvailability(event.date)
  member.availabilityStatus = isAvailable ? 'available' : 'unavailable'
})

// UI mostra badge verde (disponível) ou vermelho (indisponível)
// Ministro pode escalar mesmo indisponível (aviso amarelo)
```

---

### Sprint 4: Permissões e Publicação (1 semana)

#### **US-010: Editar Evento como Owner** ⭐ CRÍTICO
**Como** Owner de um evento  
**Quero** editar setlist e escala do meu evento  
**Para que** eu possa gerenciar sem depender do Admin

**Critérios de Aceitação:**
- [ ] Owner pode editar: título, descrição, setlist, escala
- [ ] Owner NÃO pode alterar data ou owner (apenas Admin)
- [ ] Owner pode editar mesmo se evento estiver `locked`
- [ ] Team Member sem permissão vê tela read-only
- [ ] Validação de permissão no backend

**Bounded Context:** Worship Context  
**Invariante:** `event.isOwner(userId) || user.isAdmin()`  
**Estimativa:** 5 pontos  
**Prioridade:** P0

**Referência de Detalhamento:** `docs/planning/prds/PRD-005-edicao-escala-no-evento.md`

---

#### **US-011: Publicar Evento e Notificar Escalados** ⭐ CRÍTICO
**Como** Owner ou Admin  
**Quero** publicar um evento  
**Para que** integrantes escalados sejam notificados por email

**Critérios de Aceitação:**
- [ ] Botão "Publicar Evento"
- [ ] Validação: evento deve ter pelo menos 1 música E 1 integrante escalado
- [ ] Envio de email para todos os escalados com:
  - Título e data do evento
  - Lista de músicas (com links YouTube)
  - Papel do integrante nesse evento
- [ ] Evento publicado fica visível para todos
- [ ] Evento pode ser "despublicado" (volta a rascunho)

**Bounded Context:** Worship Context  
**Agregado:** Event  
**Evento:** `EventPublished`  
**Estimativa:** 5 pontos  
**Prioridade:** P0

---

#### **US-012: Visualizar Meus Eventos** ⭐ CRÍTICO
**Como** integrante  
**Quero** visualizar eventos onde estou escalado  
**Para que** eu saiba minha agenda e acesse as músicas

**Critérios de Aceitação:**
- [ ] Tela "Meus Eventos" com lista de eventos futuros
- [ ] Filtrar: todos, próximos 7 dias, próximo mês
- [ ] Card de evento mostra: data, título, meu papel
- [ ] Clicar no evento: ver setlist com links YouTube
- [ ] Badge visual: "Owner" se for meu evento

**Bounded Context:** Worship Context  
**Estimativa:** 5 pontos  
**Prioridade:** P0

---

## 3. Priorização P1 (Importante)

### Sprint 5-6: Upload de VS (4 semanas)

#### **US-101: Upload de VS (WAV/MP3)**
**Como** Admin  
**Quero** fazer upload de arquivos VS das músicas  
**Para que** integrantes baixem áudio de qualidade para ensaio

**Critérios de Aceitação:**
- [ ] Upload direto via presigned URL (S3)
- [ ] Validação: formato (WAV/MP3), tamanho (≤200MB), sample rate (≤96kHz)
- [ ] Transcodificação assíncrona (WAV → MP3 256kbps)
- [ ] Barra de progresso e status de processamento
- [ ] YouTube Link continua obrigatório (VS é adicional)

**Bounded Context:** Media Context  
**Agregado:** MediaAsset  
**Evento:** `VSUploaded`, `MediaProcessingCompleted`  
**Estimativa:** 13 pontos  
**Prioridade:** P1

---

#### **US-102: Player de Áudio Integrado**
**Como** integrante  
**Quero** ouvir VS das músicas direto no app  
**Para que** eu possa ensaiar sem baixar

**Critérios de Aceitação:**
- [ ] Player com controles: play/pause, seek, volume
- [ ] Preview de 30s se VS ainda estiver em processamento
- [ ] Fallback para YouTube se VS não disponível
- [ ] Lazy loading de áudio

**Bounded Context:** Music Library Context  
**Estimativa:** 8 pontos  
**Prioridade:** P1

---

#### **US-103: Download de ZIP por Evento**
**Como** integrante escalado  
**Quero** baixar ZIP com todos VS e partituras do evento  
**Para que** eu tenha todo material de uma vez

**Critérios de Aceitação:**
- [ ] Botão "Baixar Material" no evento
- [ ] Backend gera ZIP automaticamente ao publicar evento
- [ ] ZIP contém: VS (MP3) + Partituras (PDF)
- [ ] Presigned URL com TTL de 7 dias
- [ ] CloudFront cache para múltiplos usuários

**Bounded Context:** Worship Context + Media Context  
**Estimativa:** 8 pontos  
**Prioridade:** P1

---

#### **US-104: Archival Inteligente (Glacier IR)**
**Como** Software Architecture  
**Quero** mover VS para Glacier IR quando não em uso  
**Para que** custo de storage seja reduzido em 80%

**Critérios de Aceitação:**
- [ ] VS ficam em Glacier IR por padrão
- [ ] Promover para S3 Standard quando música em evento <30 dias
- [ ] Retornar a Glacier IR 30 dias após evento
- [ ] Cron job diário verifica lifecycle
- [ ] Métricas de custo (CloudWatch)

**Bounded Context:** Media Context  
**Evento:** `MediaPromotedToActive`, `MediaArchivedToGlacier`  
**Estimativa:** 13 pontos  
**Prioridade:** P1

---

### Sprint 7: OAuth e UX (2 semanas)

#### **US-105: Login com Google**
**Como** usuário  
**Quero** fazer login com conta Google  
**Para que** não precise criar senha

**Bounded Context:** User Management  
**Estimativa:** 5 pontos  
**Prioridade:** P1

---

#### **US-106: Login com Apple**
**Como** usuário iOS  
**Quero** fazer login com Apple ID  
**Para que** seja mais rápido no iPhone

**Bounded Context:** User Management  
**Estimativa:** 5 pontos  
**Prioridade:** P1

---

## 4. Priorização P2 (Futuro)

### Backlog (Sem Sprint Definida)

- **US-201:** Notificações push (evento publicado, mudanças)
- **US-202:** Feed de atividade (quem editou o quê)
- **US-203:** Histórico de eventos passados
- **US-204:** Relatórios de participação
- **US-205:** Métricas de músicas mais tocadas
- **US-206:** Integração com Google Calendar
- **US-207:** Export de setlist (PDF/Excel)
- **US-208:** Chat por evento
- **US-209:** Sistema de aprovação de escalas
- **US-210:** Multi-tenancy (múltiplas igrejas)

---

## 5. User Stories Detalhadas

### Formato Padrão

Todas as stories seguem o template:

```markdown
**US-XXX: Título Curto**

**Como** [papel]  
**Quero** [ação]  
**Para que** [benefício]

**Critérios de Aceitação:**
- [ ] Critério 1
- [ ] Critério 2

**Bounded Context:** [contexto DDD]  
**Agregado:** [agregado DDD]  
**Evento(s):** [eventos de domínio]  
**Estimativa:** [pontos Fibonacci]  
**Prioridade:** P0 | P1 | P2  
**Dependencies:** [outras user stories]
```

---

## 6. Estimativas e Entregas

### 6.1 Timeline MVP (P0 apenas)

| Sprint | Duração | Features | Pontos |
|--------|---------|----------|--------|
| Sprint 1 | 2 semanas | US-001, US-002, US-003 | 11 pontos |
| Sprint 2 | 2 semanas | US-004, US-005, US-006 | 15 pontos |
| Sprint 3 | 2 semanas | US-007, US-008, US-009 | 21 pontos |
| Sprint 4 | 1 semana  | US-010, US-011, US-012 | 15 pontos |
| **TOTAL MVP** | **7 semanas** | **12 user stories** | **62 pontos** |

### 6.2 Velocity Estimada

- **Time:** 2 desenvolvedores full-stack + 1 PM
- **Velocity:** ~10 pontos/semana
- **MVP delivery:** 7 semanas (~1.7 meses)

### 6.3 Milestones

- **M1 (Sprint 1):** Autenticação + Cadastro de membros ✅
- **M2 (Sprint 2):** Músicas + Disponibilidade ✅
- **M3 (Sprint 3):** Eventos + Escalação ✅
- **M4 (Sprint 4):** Permissões + Publicação ✅ **→ MVP RELEASE**

---

## 7. Riscos e Mitigações

### 7.1 Riscos Técnicos

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Supabase Free Tier insuficiente | Alto | Baixo | Monitorar uso; upgrade para Pro ($25/mês) se necessário |
| YouTube API rate limit | Médio | Médio | Cachear thumbnails; usar embed direto (não API) |
| Disponibilidade complexa | Médio | Baixo | Priorizar recurring antes de overrides |
| Performance em escalação | Baixo | Baixo | Indexar queries de disponibilidade |

### 7.2 Riscos de Negócio

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Usuários esperarem VS no MVP | Alto | Médio | Comunicação clara: YouTube Link é suficiente; VS vem em P1 |
| Disponibilidade muito manual | Médio | Médio | UX simples e intuitiva; templates pré-definidos |
| Poucos usuários no lançamento | Baixo | Baixo | Foco em 1 igreja piloto; iterar com feedback |

---

## 8. Definição de Pronto (DoD)

### Uma user story está PRONTA quando:

- [ ] Código implementado seguindo DDD-GUIDE
- [ ] Testes unitários escritos (cobertura ≥70%)
- [ ] Testes de integração nos fluxos críticos
- [ ] Code review aprovado
- [ ] Documentação atualizada (se aplicável)
- [ ] Deploy em staging e testado manualmente
- [ ] Validado pelo Product Manager
- [ ] Sem bugs P0 ou P1 abertos

---

## 9. Próximos Passos

### Ações Imediatas (Esta Semana)

1. ✅ **Validar roadmap com stakeholders** (Product Manager + Tech Lead)
2. ⏳ **Criar repositórios GitHub:**
   - `worship-plus-poc` (frontend)
   - `worship-plus-backend` (API)
   - `worship-plus-docs` (documentação)
3. ⏳ **Setup inicial:**
   - Configurar Supabase (auth + database)
   - Configurar projeto React + Vite
   - Configurar CI/CD (GitHub Actions)
4. ⏳ **Kickoff Sprint 1:** Começar US-001 (Autenticação Básica)

### Perguntas Pendentes para PM

- [ ] Confirmar OAuth (Google/Apple) pode ser P1?
- [ ] Confirmar YouTube Link obrigatório é aceitável no MVP?
- [ ] Validar timeline de 7 semanas para MVP?
- [ ] Definir igreja piloto para beta test?

---

## 10. Referências de Arquitetura

📖 **Documentos Relacionados:**

- **`DDD-GUIDE.md`:** Bounded Contexts, Agregados, Domain Events, Stack Técnico
- **`ARCHITECTURE-DECISIONS.md`:** 
  - BFF (Backend For Frontend) - Quando adicionar?
  - Filosofia de Desenvolvimento (SOLID, DRY, KISS)
  - Design Patterns Avançados (Decorators, Repository, Strategy, Observer)
  - Abstrações com Hooks (Frontend)
  - Estrutura de Pastas (Frontend + Backend)
- **`AGENTS-GUIDE.md`:** Processo de atualização de documentação

---

**Este roadmap é um living document e deve ser atualizado a cada sprint retrospective.**

**Última atualização:** 2 de Março de 2026
