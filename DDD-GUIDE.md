# Worship+ Domain-Driven Design Guide

**Versão:** 1.2  
**Data:** 2 de Março de 2026  
**Status:** Living Document  
**Autores:** Software Architecture Agent + Product Manager Agent  
**Última Atualização:** Análise técnica Vite vs Next.js (v1.2)

---

## Índice

1. [Visão Estratégica](#1-visão-estratégica)
2. [Subdomínios](#2-subdomínios)
3. [Bounded Contexts](#3-bounded-contexts)
4. [Glossário de Linguagem Úbiqua](#4-glossário-de-linguagem-úbiqua)
5. [Agregados Principais](#5-agregados-principais)
6. [Eventos de Domínio](#6-eventos-de-domínio)
7. [Mapa de Contextos](#7-mapa-de-contextos)
8. [Decisões Arquiteturais](#8-decisões-arquiteturais)

---

## 1. Visão Estratégica

### 1.1 Problema de Negócio

Grupos de louvor de igrejas enfrentam desafios operacionais críticos:
- **Comunicação dispersa:** WhatsApp, e-mail, papel
- **Gestão manual de escalas:** Erros, retrabalho, falta de visibilidade
- **Setlist desorganizado:** Músicas perdidas, versões diferentes, falta de partituras
- **Preparação ineficiente:** Músicos sem acesso antecipado ao material

### 1.2 Proposta de Valor

Centralizar a gestão de grupos de louvor em uma plataforma digital mobile-first que:
- Organiza eventos e escalas automaticamente
- Gerencia biblioteca de músicas com partituras e VS (Virtual Sound)
- Facilita comunicação e colaboração da equipe
- Otimiza preparação musical para eventos

### 1.3 Contexto de Uso Principal

- **Usuários Primários:** Músicos, cantores, ministros de louvor
- **Plataforma:** Mobile-first (80% uso em celulares)
- **Casos de Uso Críticos:**
  1. Ministro cria evento e monta setlist
  2. Ministro escala equipe para evento
  3. Músico baixa VS e partituras do próximo evento
  4. Integrante visualiza sua agenda de eventos

---

## 2. Subdomínios

### 2.1 Subdomínios Principais (Core Domain)

Estes são os **diferenciais estratégicos** do Worship+, onde o conhecimento de domínio é crítico:

#### **Event Management** (Gerenciamento de Eventos e Escalas)
- **Responsabilidade:** Criar, agendar e gerenciar eventos de louvor (cultos, ensaios, conferências)
- **Complexidade:** Alta - regras de escalação, conflitos de agenda, permissões por papel
- **Agregados:** Event, Schedule, Assignment
- **Por que é Core:** Define como a igreja organiza seu louvor (core business)

#### **Setlist Management** (Gerenciamento de Músicas)
- **Responsabilidade:** Biblioteca de músicas, partituras, arranjos e VS (Virtual Sound)
- **Complexidade:** Alta - metadados, direitos autorais, versionamento, arquivamento inteligente
- **Agregados:** Song, SongVersion, Setlist
- **Por que é Core:** Conhecimento musical e organização são diferenciais competitivos

#### **Team Management** (Gerenciamento de Equipe)
- **Responsabilidade:** Cadastro de integrantes, papéis, instrumentos, disponibilidade
- **Complexidade:** Média - papéis hierárquicos (ministro, backing vocal), competências
- **Agregados:** TeamMember, Instrument, Role
- **Por que é Core:** Estrutura organizacional específica de grupos de louvor

---

### 2.2 Subdomínios de Suporte (Supporting)

Suportam o core domain mas podem ser implementados com soluções genéricas:

#### **User Management** (Autenticação e Autorização)
- **Responsabilidade:** Login, cadastro, recuperação de senha, OAuth (Google/Apple)
- **Complexidade:** Baixa - usar Supabase Auth (solução pronta)
- **Agregados:** User, Session
- **Por que é Supporting:** Necessário mas não diferencial (usar framework)

#### **Media Processing** (Processamento de Mídia)
- **Responsabilidade:** Upload, transcodificação, otimização de WAV/MP3, geração de thumbnails
- **Complexidade:** Média - pipeline assíncrono, workers, lifecycle management
- **Agregados:** MediaAsset, ProcessingJob
- **Por que é Supporting:** Técnico mas não específico do domínio de louvor

#### **Notification System** (Notificações)
- **Responsabilidade:** Avisar integrantes sobre escalas, eventos, mudanças
- **Complexidade:** Baixa - email, push notifications
- **Agregados:** Notification, NotificationPreference
- **Por que é Supporting:** Comunicação é importante mas não diferencial

---

### 2.3 Subdomínios Genéricos (Generic)

Commodities que podem ser terceirizadas ou usadas "as-is":

#### **File Storage**
- **Provider:** AWS S3 + Glacier Instant Retrieval
- **Uso:** Armazenamento de WAV/MP3, partituras (PDF), avatares
- **Decisão:** Não desenvolver, usar API da AWS

#### **CDN Delivery**
- **Provider:** AWS CloudFront
- **Uso:** Entregar mídia otimizada para mobile com baixa latência
- **Decisão:** Não desenvolver, usar CDN pronta

#### **Email/SMS**
- **Provider:** AWS SES / SendGrid / Twilio
- **Uso:** Emails transacionais, recuperação de senha
- **Decisão:** Não desenvolver, usar serviço gerenciado

---

## 3. Bounded Contexts

### 3.1 Worship Context (Contexto Central)

**Responsabilidade:** Orquestrar eventos de louvor, setlists e escalas.

**Entidades:**
- `Event` (Evento)
- `EventSetlist` (Músicas do Evento)
- `Schedule` (Escala)
- `Assignment` (Alocação de Integrante)

**Regras de Negócio:**
- Ministro/Owner pode editar setlist e escala de seus eventos
- Eventos bloqueados (`locked`) são read-only para não-ministros
- Eventos publicados notificam automaticamente integrantes escalados

**Linguagem Úbiqua Específica:**
- **Ministro/Owner:** Líder responsável por guiar músicas no evento
- **Escala:** Distribuição de integrantes em papéis (cantor, músico, mídia, som)
- **Backing Vocal:** Cantor que faz segunda voz (não ministra)

---

### 3.2 Music Library Context

**Responsabilidade:** Gerenciar catálogo de músicas, metadados e arquivos.

**Entidades:**
- `Song` (Música)
- `SongVersion` (Versão de Arranjo)
- `MediaAsset` (Arquivo WAV/MP3/PDF)

**Regras de Negócio:**
- Uma música pode ter múltiplas versões (arranjos diferentes)
- VS (Virtual Sound) são arquivados em Glacier IR por padrão
- VS são promovidos para S3 Standard quando músicas são escaladas para eventos nos próximos 30 dias
- Após 30 dias do evento, VS retornam ao archival (economia de 80%)

**Linguagem Úbiqua Específica:**
- **Setlist:** Biblioteca geral de músicas disponíveis para o grupo
- **VS (Virtual Sound):** Arquivo de áudio do arranjo (WAV ou MP3)
- **Partitura:** Cifra ou notação musical (PDF)
- **Arranjo:** Versão específica de uma música com instrumentação definida

---

### 3.3 Team Context

**Responsabilidade:** Gerenciar integrantes, papéis, competências e disponibilidade.

**Entidades:**
- `TeamMember` (Integrante)
- `Instrument` (Instrumento)
- `Role` (Papel/Função)
- `Assignment` (Alocação em Papel Específico)
- `Availability` (Disponibilidade)
- `RecurringAvailability` (Padrão Semanal)
- `DateOverride` (Exceção de Data)

**Regras de Negócio:**
- Integrante pode ter múltiplos papéis (ex: Cantor + Violão)
- Cantores têm assignment adicional: `Ministro` ou `BackingVocal`
- Admin pode gerenciar todos; Team Member só edita próprio perfil
- Congregação é informativa (não bloqueia escalação)
- **Disponibilidade padrão:** Sempre disponível (se não configurado)
- **DateOverride tem prioridade** sobre RecurringAvailability
- **Passado não pode ser editado:** Apenas data >= hoje

**Linguagem Úbiqua Específica:**
- **Integrante:** Membro da equipe de louvor
- **Cantor:** Papel vocal (pode ser ministro ou backing vocal)
- **Músico:** Instrumentista (violão, guitarra, baixo, bateria, teclado)
- **Mídia:** Responsável por projeção/videografia
- **Som:** Técnico de áudio
- **Disponibilidade:** Status de disponibilidade do integrante para escalação
- **Recurring Availability:** Padrão semanal de disponibilidade (ex: sempre indisponível terças)
- **Date Override:** Exceção para data específica que sobrescreve padrão recorrente

---

### 3.4 Media Context

**Responsabilidade:** Upload, processamento e entrega de arquivos de mídia.

**Entidades:**
- `MediaAsset` (Ativo de Mídia)
- `ProcessingJob` (Job de Transcodificação)
- `StorageLocation` (Localização S3/Glacier)

**Regras de Negócio:**
- Upload direto via presigned URLs (sem passar por backend)
- Transcodificação assíncrona: WAV → MP3 256kbps
- Rejeitar sample rates > 96kHz e arquivos mono
- Limites: Avatar ≤ 5MB, VS ≤ 200MB

**Linguagem Úbiqua Específica:**
- **Presigned URL:** Link temporário para upload/download direto no S3
- **Transcodificação:** Conversão automática de formato (WAV → MP3)
- **Archival:** Armazenamento de longo prazo em Glacier IR (custo reduzido)

---

## 4. Glossário de Linguagem Úbiqua

### 4.1 Conceitos de Domínio (Core)

| Termo | Definição | Contexto | Sinônimos Rejeitados |
|-------|-----------|----------|---------------------|
| **Event** | Ocasião onde o grupo de louvor se apresenta (culto, ensaio, conferência) | Worship | Apresentação, show |
| **Setlist** | Biblioteca geral de músicas disponíveis para o grupo de louvor | Music Library | ~~Repertório~~ (rejeitado) |
| **Event Setlist** | Lista específica de músicas selecionadas para um evento | Worship | Tracklist |
| **Schedule** | Escala de integrantes alocados para um evento | Worship | Escala, lineup |
| **Assignment** | Alocação de um integrante em um papel específico para um evento | Worship / Team | Atribuição, escalação |
| **Ministro/Owner** | Líder responsável por guiar as músicas durante o evento | Worship / Team | Líder de louvor, worship leader |
| **Backing Vocal** | Cantor que faz segunda voz (não ministra) | Team | Segunda voz, BV |
| **Integrante** | Membro da equipe de louvor | Team | Membro, colaborador |
| **VS (Virtual Sound)** | Arquivo de áudio do arranjo de uma música (WAV ou MP3) | Music Library | Track, playback |
| **Partitura** | Cifra ou notação musical (arquivo PDF) | Music Library | Cifra, chart |
| **Arranjo** | Versão específica de uma música com instrumentação definida | Music Library | Versão |
| **Congregação** | Igreja ou local de origem do integrante | Team | Igreja, unidade |
| **Disponibilidade** | Status de disponibilidade de um integrante para escalação em eventos | Team | Agenda, calendário |
| **Recurring Availability** | Padrão semanal de disponibilidade (ex: sempre indisponível às terças) | Team | Padrão, rotina |
| **Date Override** | Exceção única para data específica (sobrescreve recurring) | Team | Bloqueio, exceção |
| **YouTube Link** | URL de vídeo no YouTube usada como referência de música (alternativa a VS) | Music Library | Link, referência |

---

### 4.2 Papéis e Permissões

| Papel | Permissões | Contexto |
|-------|-----------|----------|
| **Admin** | Gerencia escalas, setlists, equipes, eventos e configurações do sistema | Global |
| **Team Member** | Visualiza escalas e setlist; edita próprio perfil | Global |
| **Ministro/Owner** | Pode editar setlist e escala dos eventos onde é owner, mesmo sem ser Admin | Worship (por evento) |

---

### 4.3 Áreas de Atuação

Classificação dos integrantes por função técnica:

| Área | Descrição | Exemplos |
|------|-----------|----------|
| **Cantor** | Vocal (pode ser ministro ou backing vocal) | Ministro, Backing Vocal |
| **Músico** | Instrumentista | Violão, Guitarra, Baixo, Bateria, Teclado, Piano |
| **Mídia** | Responsável por projeção, vídeo, streaming | Operador ProPresenter, Câmera |
| **Som** | Técnico de áudio | Operador Mesa, Monitors |

---

### 4.4 Estados e Lifecycle

| Termo | Definição | Contexto |
|-------|-----------|----------|
| **Locked Event** | Evento bloqueado para edições (somente leitura para não-ministros) | Worship |
| **Published Event** | Evento publicado que notifica automaticamente integrantes escalados | Worship |
| **Available** | Status de integrante disponível para escalação em data específica | Team |
| **Unavailable** | Status de integrante indisponível para escalação em data específica | Team |
| **Active Storage** | Arquivo em S3 Standard (acesso imediato, custo médio) | Media |
| **Archived Storage** | Arquivo em Glacier IR (acesso 3-5h, custo baixo) | Media |
| **Processing** | Estado de arquivo aguardando transcodificação | Media |
| **Ready** | Arquivo processado e disponível para download | Media |

---

### 4.5 Formatos e Especificações Técnicas

| Termo | Especificação | Contexto |
|-------|---------------|----------|
| **WAV Aceito** | 44.1/48kHz, 16/24-bit, estéreo, ≤200MB | Media |
| **MP3 Padrão** | 256kbps, 44.1/48kHz, estéreo, ≤50MB | Media |
| **Avatar** | Imagem JPEG/PNG, ≤5MB | Team |
| **Partitura** | PDF, ≤10MB | Music Library |

---

## 5. Agregados Principais

### 5.1 Event Aggregate (Worship Context)

**Root:** `Event`

**Entidades Filhas:**
- `EventSetlist` (músicas do evento)
- `Schedule` (escala de integrantes)
- `Assignment` (alocação individual)

**Invariantes:**
- Um evento deve ter pelo menos 1 música no setlist antes de ser publicado
- Um evento deve ter pelo menos 1 integrante escalado antes de ser publicado
- Ministro/Owner do evento pode editar mesmo se `locked = true`
- Apenas Admin ou Owner podem publicar evento

**Operações:**
```typescript
Event.create(title, date, description, ownerId)
Event.addSong(songId, order)
Event.removeSong(songId)
Event.assignMember(memberId, roleId)
Event.unassignMember(assignmentId)
Event.lock()
Event.unlock()
Event.publish()
```

---

### 5.2 Song Aggregate (Music Library Context)

**Root:** `Song`

**Entidades Filhas:**
- `SongVersion` (arranjos diferentes)
- `MediaAsset` (WAV, MP3, PDF)

**Invariantes:**
- Uma música deve ter pelo menos título e autor
- VS (MediaAsset de tipo audio) devem estar associados a uma SongVersion
- Partituras (MediaAsset de tipo document) podem estar associadas diretamente à Song ou SongVersion

**Operações:**
```typescript
Song.create(title, author, key?)
Song.addVersion(title, description)
SongVersion.uploadVS(file, format)
SongVersion.attachSheet(pdfFile)
Song.archive()
Song.restore()
```

---

### 5.3 TeamMember Aggregate (Team Context)

**Root:** `TeamMember`

**Entidades Filhas:**
- `Instrument` (instrumentos que toca)
- `RoleAssignment` (papéis que exerce)

**Invariantes:**
- Integrante deve ter pelo menos nome, email e área de atuação
- Cantores devem especificar se são Ministro ou Backing Vocal
- Músicos devem especificar pelo menos 1 instrumento

**Operações:**
```typescript
TeamMember.create(name, email, area)
TeamMember.setVocalRole(role: 'Ministro' | 'BackingVocal')
TeamMember.addInstrument(instrument)
TeamMember.updateProfile(fields)
TeamMember.uploadAvatar(file)
```

---

### 5.4 Availability Aggregate (Team Context)

**Root:** `Availability`

**Entidades Filhas:**
- `RecurringAvailability` (padrão semanal de disponibilidade)
- `DateOverride` (exceções para datas específicas)

**Invariantes:**
- Disponibilidade padrão é "sempre disponível" se não configurado
- DateOverride tem **prioridade absoluta** sobre RecurringAvailability
- Apenas datas futuras ou hoje podem ser editadas (data >= hoje)
- Status deve ser `available` ou `unavailable`
- RecurringAvailability usa dia da semana (0-6, onde 0 = domingo)

**Operações:**
```typescript
Availability.initializeForMember(memberId)
Availability.setRecurring(dayOfWeek: 0-6, status: 'available' | 'unavailable')
Availability.addOverride(date: Date, status: 'available' | 'unavailable', reason?: string)
Availability.removeOverride(date: Date)
Availability.checkAvailability(date: Date) → boolean
  // Lógica: 
  // 1. Se existe DateOverride para date → retorna override.status
  // 2. Senão, verifica RecurringAvailability[dayOfWeek] → retorna recurring.status
  // 3. Senão, retorna 'available' (padrão)
```

**Exemplo de Uso:**
```typescript
// Integrante sempre indisponível às terças
availability.setRecurring(2, 'unavailable') // 2 = terça

// Exceção: disponível na terça 2026-03-10 (evento especial)
availability.addOverride('2026-03-10', 'available', 'Culto especial de páscoa')

// Consultar disponibilidade
availability.checkAvailability('2026-03-10') // → true (override)
availability.checkAvailability('2026-03-17') // → false (recurring)
availability.checkAvailability('2026-03-18') // → true (padrão, quarta)
```

---

### 5.5 MediaAsset Aggregate (Media Context)

**Root:** `MediaAsset`

**Entidades Filhas:**
- `ProcessingJob` (job de transcodificação)
- `StorageLocation` (bucket, key, lifecycle)

**Invariantes:**
- MediaAsset deve ter referência ao owner (Song, SongVersion ou TeamMember)
- Arquivos em processamento não podem ser deletados
- Apenas Admin pode forçar exclusão de arquivo em uso

**Operações:**
```typescript
MediaAsset.requestUpload(filename, contentType) → presignedUrl
MediaAsset.notifyUploadComplete(key)
MediaAsset.startProcessing()
MediaAsset.markReady()
MediaAsset.promoteToActive() // Glacier → S3
MediaAsset.archiveToGlacier()
```

---

## 6. Eventos de Domínio

### 6.1 Worship Context

| Evento | Quando Ocorre | Consequências |
|--------|---------------|---------------|
| `EventCreated` | Admin ou Ministro cria novo evento | - Criar registro no sistema<br>- Notificar owner |
| `EventPublished` | Evento é publicado | - Notificar todos integrantes escalados<br>- Promover VS das músicas para S3 Active (se em Glacier) |
| `MemberAssigned` | Integrante é escalado para evento | - Adicionar no schedule<br>- Notificar integrante |
| `MemberUnassigned` | Integrante é removido da escala | - Notificar integrante |
| `SongAddedToEvent` | Música é adicionada ao event setlist | - Verificar se VS está em archival<br>- Se evento em <30 dias, promover VS |
| `EventLocked` | Evento é bloqueado para edições | - Desabilitar edições UI para não-owners |

---

### 6.2 Music Library Context

| Evento | Quando Ocorre | Consequências |
|--------|---------------|---------------|
| `SongCreated` | Nova música é cadastrada | - Criar registro no catálogo |
| `VSUploaded` | Arquivo de áudio é enviado | - Criar ProcessingJob<br>- Transcodificar WAV → MP3 256kbps |
| `MediaProcessingCompleted` | Transcodificação finalizada | - Marcar asset como Ready<br>- Notificar owner |
| `MediaArchivedToGlacier` | VS movido para Glacier IR | - Atualizar StorageLocation<br>- Reduzir custo de storage |
| `MediaPromotedToActive` | VS promovido para S3 Standard | - Atualizar StorageLocation<br>- Garantir acesso imediato (evento próximo) |

---

### 6.3 Team Context

| Evento | Quando Ocorre | Consequências |
|--------|---------------|---------------|
| `TeamMemberCreated` | Novo integrante cadastrado | - Criar perfil<br>- Inicializar Availability (padrão: sempre disponível)<br>- Enviar email de boas-vindas |
| `ProfileUpdated` | Integrante edita perfil | - Atualizar registro<br>- Reindexar busca |
| `AvatarUploaded` | Integrante faz upload de avatar | - Redimensionar imagem<br>- Atualizar profile picture |
| `MemberAvailabilityChanged` | Integrante atualiza disponibilidade | - Atualizar Availability<br>- Notificar admins/ministros se impactar eventos próximos |
| `RecurringAvailabilitySet` | Padrão semanal de disponibilidade definido | - Atualizar RecurringAvailability<br>- Validar se não conflita com eventos já escalados |
| `DateOverrideAdded` | Exceção de data adicionada | - Criar DateOverride<br>- Verificar se integrante está escalado nessa data (alerta) |

---

## 7. Mapa de Contextos

### 7.1 Relacionamentos entre Bounded Contexts

```
┌─────────────────────────────────────────────────────────────┐
│                     Worship Context                         │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐                │
│  │  Event   │→→→│ Schedule │→→→│Assignment│                │
│  └──────────┘   └──────────┘   └──────────┘                │
│        │                                                     │
│        │ references                                          │
│        ↓                                                     │
└────────┼─────────────────────────────────────────────────────┘
         │
         │
    ┌────┴──────────────────────────────────────────────┐
    │                                                    │
    ↓                                                    ↓
┌───────────────────────────┐          ┌────────────────────────────┐
│  Music Library Context    │          │      Team Context          │
│  ┌──────┐   ┌───────────┐│          │  ┌────────────┐            │
│  │ Song │→→→│SongVersion││          │  │ TeamMember │            │
│  └──────┘   └───────────┘│          │  └────────────┘            │
│       │            │      │          │         │                  │
│       └────────────┘      │          │         │                  │
│              │            │          │         │                  │
└──────────────┼────────────┘          └─────────┼──────────────────┘
               │                                 │
               │ references                      │ references
               ↓                                 ↓
        ┌────────────────────────────────────────────┐
        │         Media Context                      │
        │  ┌────────────┐   ┌───────────────┐       │
        │  │ MediaAsset │→→→│ProcessingJob  │       │
        │  └────────────┘   └───────────────┘       │
        │         │                                  │
        │         ↓                                  │
        │  ┌───────────────┐                        │
        │  │StorageLocation│                        │
        │  └───────────────┘                        │
        └────────────────────────────────────────────┘
```

### 7.2 Tipo de Relacionamento

| Contexto A | Contexto B | Tipo de Relação | Integração |
|------------|------------|-----------------|----------|
| Worship | Music Library | Customer/Supplier | Event referencia Song por ID (read-only) |
| Worship | Team | Customer/Supplier | Assignment referencia TeamMember por ID |
| Music Library | Media | Customer/Supplier | Song referencia MediaAsset por ID |
| Team | Media | Customer/Supplier | TeamMember referencia MediaAsset (avatar) |

**Padrão:** Todos os relacionamentos são por **ID reference** (não embedded), mantendo independência entre contextos.

---

## 8. Decisões Arquiteturais

### 8.1 Stack Técnico

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| **Frontend** | React 19 + Vite | SPA privada, HMR instantâneo (200ms), bundle otimizado (197KB), perfeito para mobile-first |
| **Backend** | Supabase (Postgres + Auth + Storage) | MVP rápido, free tier generoso, escalável |
| **Storage** | AWS S3 + Glacier IR | Lifecycle inteligente, custo otimizado ($0-17/ano) |
| **CDN** | AWS CloudFront | Baixa latência para mobile, cache eficiente |
| **Media Processing** | AWS Lambda + FFmpeg | Serverless, paga-por-uso, escala automática |
| **Hosting** | Vercel (frontend) | Deploy automático, free tier, edge computing |

---

#### **Decisão Crítica: Vite vs Next.js**

**Por que Vite (não Next.js)?**

| Critério | Vite | Next.js | Vencedor |
|----------|------|---------|----------|
| **SSR/SEO necessário?** | ❌ SPA apenas | ✅ SSR/SSG | ⚠️ **Não aplicável** (app 100% privada, sem SEO) |
| **Build Speed** | 200ms | 2-3s | ✅ **Vite** (15x mais rápido) |
| **HMR** | Instantâneo | Rápido | ✅ **Vite** (melhor DX) |
| **Bundle Size** | 197KB (POC) | ~250KB+ | ✅ **Vite** (menor overhead) |
| **Complexidade** | Baixa | Média-Alta | ✅ **Vite** (menos abstração) |
| **Learning Curve** | Suave | Íngreme (App Router) | ✅ **Vite** (onboarding rápido) |
| **API Routes** | ❌ Precisa backend separado | ✅ Integrado | ⚠️ **Não aplicável** (já temos Supabase) |

**Contexto do Projeto:**
- ✅ **Aplicação 100% privada** (requer login) → SSR/SEO irrelevantes
- ✅ **Mobile-first SPA** com interações ricas (calendários, drag-and-drop)
- ✅ **Backend já definido** (Supabase) → API Routes desnecessárias
- ✅ **MVP em 7 semanas** → Build rápido crítico
- ✅ **POC funcional em Vite** → Migração evitada

**Quando Next.js SERIA necessário:**
- 🌐 Landing page pública com SEO
- 📝 Blog ou conteúdo indexável por search engines
- 🏢 Site institucional público
- 🗂️ Páginas dinâmicas server-side (não client-side)

**Conclusão:** Vite é tecnicamente superior para este caso de uso. Next.js adicionaria complexidade sem benefício real.

**Referência:** decision_log.md Frontend Agent - "Adoção de React 19 + Vite"

---

### 8.2 Padrões de Persistência

#### **Event Sourcing:** NÃO utilizado (overkill para MVP)
#### **CQRS:** NÃO utilizado (complexidade desnecessária)
#### **Padrão Escolhido:** CRUD tradicional com Aggregate Roots

**Justificativa:**
- MVP precisa ser simples e rápido
- Postgres + Supabase oferece queries eficientes
- Event Sourcing pode ser adicionado futuramente se necessário

---

### 8.3 Priorização MVP (Decisão 2026-03-02)

**Features CRÍTICAS (P0 - Não negociável):**

1. **Autenticação e Cadastro**
   - Login com email/senha
   - Cadastro de membros
   - Recuperação de senha
   - OAuth Google e Apple (futuro P1)

2. **Gerenciamento de Eventos**
   - Criar, editar, visualizar eventos
   - Definir owner/ministro do evento
   - Lock/unlock de eventos
   - Publicar evento (notificar escalados)

3. **Gerenciamento de Músicas (SEM VS inicialmente)**
   - Cadastrar música: título, autor, tom
   - **YouTube Link obrigatório** (alternativa a VS no MVP)
   - Campo de partitura (PDF) opcional
   - Buscar e listar músicas

4. **Event Setlist**
   - Adicionar músicas do Setlist ao evento
   - Ordenar músicas do evento
   - Remover músicas do evento

5. **Escalação (Schedule + Assignment)**
   - Escalar integrantes para evento
   - Definir papel de cada integrante no evento
   - Visualizar quem está escalado

6. **Disponibilidade de Membros**
   - Definir padrão semanal de disponibilidade
   - Adicionar exceções para datas específicas
   - Consultar disponibilidade ao escalar

7. **Permissões por Owner**
   - Owner/Ministro pode editar seus eventos
   - Admin pode editar todos os eventos
   - Team Member visualiza apenas (exceto se for owner)

**Features IMPORTANTES (P1 - Segunda fase):**

- Upload de VS (WAV/MP3)
- Processamento e transcodificação de VS
- Archival inteligente (Glacier IR)
- Download de ZIP por evento
- Player de áudio integrado
- OAuth Google e Apple

**Features SECUNDÁRIAS (P2 - Futuro):**

- Notificações push
- Feed de atividade
- Histórico de eventos
- Relatórios e métricas
- Integração com calendário externo

**Racionalização:**

- **YouTube Link substitui VS no MVP:** Reduz complexidade de upload/storage/processamento
- **Disponibilidade é P0:** Crítica para facilitar escalação (objetivo principal do sistema)
- **Permissões por Owner:** Delegação de poder sem centralizar tudo no Admin
- **VS movido para P1:** Feature importante mas não blocker para uso inicial

---

### 8.4 Lifecycle de Mídia (FASE P1 - NÃO MVP)

**Arquivamento Inteligente Baseado em Eventos Agendados:**

1. **Estado Padrão:** VS ficam em **Glacier IR** (custo baixo)
2. **Promoção Automática:** Quando música é adicionada a evento nos próximos **30 dias**, promover VS para **S3 Standard** (acesso imediato)
3. **Retorno ao Archival:** **30 dias após** o evento, VS retorna ao **Glacier IR**

**Benefícios:**
- Economia de ~80% em storage costs
- Disponibilidade garantida quando necessário
- Automação completa (sem intervenção manual)

**Implementação:**
- Event domain event `SongAddedToEvent` verifica data do evento
- Se evento.date - hoje ≤ 30 dias → trigger MediaAsset.promoteToActive()
- Cron job diário verifica eventos passados há 30+ dias → trigger MediaAsset.archiveToGlacier()

---

### 8.4 Download de VS por Evento (UX + Custo)

**Formato Padrão:** Arquivo ZIP por evento

**Razões:**
1. **UX Superior:** Músico baixa tudo de uma vez (não múltiplos downloads)
2. **Economia de 70% em transfer costs:** CloudFront cache serve múltiplos usuários
3. **Menos requisições ao S3:** Reduz custos de API
4. **Melhor preparação:** Equipe tem todo material necessário em 1 arquivo

**Implementação:**
- Ao publicar evento, backend gera ZIP automaticamente
- ZIP contém: VS (MP3) + Partituras (PDF) de todas músicas
- Presigned URL do ZIP com TTL de 7 dias
- Fallback: download individual disponível se necessário

---

### 8.5 Segurança e Compliance

#### **LGPD/GDPR:**
- **Arquivos VS:** NÃO contêm dados pessoais identificáveis → uso baseado em "legítimo interesse" (atividade religiosa sem fins lucrativos)
- **Dados pessoais (cadastro, fotos):** DEVEM estar em conformidade
  - Política de Privacidade e Termos de Uso obrigatórios
  - Consentimento explícito no signup
  - Direitos de acesso/correção/exclusão implementados

#### **Segurança de Upload/Download:**
- **Presigned URLs:** TTL de 15 minutos (upload) e 7 dias (download)
- **Validação:** Backend valida tipo, tamanho e extensão antes de gerar presigned URL
- **IAM:** Políticas mínimas (least privilege)

---

### 8.6 Observabilidade

**Métricas Críticas:**
- Taxa de sucesso/falha de transcodificação
- Tempo médio de processamento (WAV → MP3)
- Custos de storage (S3 vs Glacier)
- Custos de transfer (bandwidth)
- Tempo de promoção (Glacier → S3)

**Ferramentas:**
- Supabase Logs (queries, auth)
- AWS CloudWatch (Lambda, S3)
- Sentry (erros frontend/backend)

---

## 9. Referências e Próximos Passos

### 9.1 Documentos Relacionados

- [project-details.md](./project-details.md) - Especificações de negócio
- [RFC-0001-media-storage.md](./RFC-0001-media-storage.md) - Decisões de armazenamento
- [RFC-0002-project-overview.md](./RFC-0002-project-overview.md) - Visão geral do projeto
- [brainstorm-insights.md](./brainstorm-insights.md) - Perguntas e decisões técnicas
- [PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md) - Análise completa do projeto

---

### 9.2 Próximos Passos

#### **Para Desenvolvedores:**
1. Implementar agregados conforme definições deste guia
2. Usar termos do glossário **exatamente como definidos** (linguagem úbiqua)
3. Consultar este documento ao criar entidades, eventos e regras de negócio

#### **Para Product Manager:**
1. Validar prioridades de features por subdomínio (Core > Supporting > Generic)
2. Escrever user stories usando linguagem úbiqua deste glossário
3. Priorizar MVP em Event Management + Setlist Management

#### **Para Arquiteto:**
1. Definir schemas de banco baseados nos agregados
2. Implementar lifecycle de mídia (Glacier ↔ S3)
3. Configurar pipeline de transcodificação (Lambda + FFmpeg)

---

**Este documento é vivo e deve ser atualizado conforme novas decisões de domínio são tomadas.**

**Última atualização:** 2 de Março de 2026
