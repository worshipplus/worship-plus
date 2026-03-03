# DDD Quick Reference — Worship+

**Versão:** 1.0  
**Data:** 3 de Março de 2026  
**Propósito:** Sumário compacto do DDD-GUIDE.md para economia de contexto em AI Agents  
**Tamanho:** ~5KB (vs 48KB do DDD-GUIDE completo)

---

## 1. Bounded Contexts (4 contextos)

### 1.1 Worship Context (Core Domain)
**Responsabilidade:** Gerenciar eventos de louvor, setlists e escalas  
**Agregados:** Event, Setlist  
**Priority:** P0 (MVP Critical)

**Glossário:**
- **Event** → Culto/evento de louvor (ex: Culto Domingo 10h)
- **Setlist** → Biblioteca GLOBAL de músicas (todas as músicas disponíveis)
- **Event Setlist** → Lista de músicas DE UM evento específico
- **Ministro/Owner** → Líder responsável pelo evento
- **Locked Event** → Evento finalizado (não permite mais edições)

### 1.2 Team Context (Supporting)
**Responsabilidade:** Gerenciar membros da equipe e disponibilidade  
**Agregados:** TeamMember, Availability  
**Priority:** P0 (MVP Critical)

**Glossário:**
- **TeamMember** → Integrante da equipe (músicos, técnicos, etc)
- **Ministro** → Cantor líder (pode ser owner de eventos)
- **Backing Vocal** → Segunda voz (não é ministro)
- **Availability** → Padrão semanal (ex: disponível domingos 10h)
- **Date Override** → Exceção pontual (ex: indisponível 15/03/2026)

### 1.3 Media Context (Supporting - P1)
**Responsabilidade:** Armazenar e servir arquivos de mídia (VS, imagens)  
**Agregados:** MediaFile  
**Priority:** P1 (Post-MVP)

**Glossário:**
- **VS (Virtual Sound)** → Arquivo de áudio de referência (.wav, .mp3)
- **Active Storage** → S3 padrão (eventos <30 dias)
- **Archive Storage** → Glacier (eventos >30 dias)

### 1.4 User Management Context (Generic)
**Responsabilidade:** Autenticação e autorização  
**Agregados:** User, Session  
**Priority:** P0 (MVP Critical)

**Stack:** Supabase Auth (já implementado)

---

## 2. Agregados Principais

### Event Aggregate (Worship Context)
```
Event (Root)
├── id: UUID
├── title: string
├── date: timestamp
├── owner_id: UUID (ref TeamMember)
├── locked: boolean
├── published: boolean
└── EventSetlistEntry[] (entidades filhas)
    ├── id: UUID
    ├── song_id: UUID (ref Setlist)
    ├── order: int
    └── notes: string
```

**Invariantes:**
- Event locked → não pode adicionar/remover músicas
- Owner deve ser Ministro (role validation)
- Data do evento deve ser futura na criação

### TeamMember Aggregate (Team Context)
```
TeamMember (Root)
├── id: UUID
├── name: string
├── email: string (unique)
├── role: enum [admin, ministro, member]
├── instrument: string?
├── area: enum [music, tech, media]
└── Availability (Value Object)
    ├── weekly_pattern: jsonb
    └── date_overrides: jsonb
```

**Invariantes:**
- Email único no sistema
- Ministro deve ter area = 'music'
- Backing Vocal não pode ser owner de eventos

---

## 3. Eventos de Domínio (Critical)

| Evento | Contexto Emissor | Contextos Ouvintes | Ação |
|--------|-----------------|-------------------|------|
| `EventCreated` | Worship | Team | Notificar ministros disponíveis |
| `EventPublished` | Worship | Team, Media | Escalar membros, ativar VS no S3 |
| `SongAddedToEvent` | Worship | Media | Promover VS para Active Storage |
| `EventLocked` | Worship | Media | Mover VS antigos para Glacier |
| `MemberUnavailable` | Team | Worship | Remover de escalas futuras |

---

## 4. Relacionamentos Entre Contextos

```
Worship Context ──┬── Customer/Supplier ──> Team Context
                  │   (consulta disponibilidade)
                  │
                  └── Customer/Supplier ──> Media Context
                      (solicita ativação de VS)

Team Context ─────── Published Language ──> User Management
                     (usa user_id como FK)
```

---

## 5. Stack Técnico (MVP)

**Frontend (P0):**
- React 19.0.0 + Vite 6.0.1
- Supabase JS SDK 2.x
- CSS Modules

**Backend (P0):**
- Supabase (Postgres + Auth + RLS + Realtime)
- Row-Level Security (RLS) para autorização

**Backend (P2 - futuro BFF):**
- NestJS + TypeORM
- Apenas se >30 classes ou multi-client

**Infra (P1):**
- AWS S3 (Active) + Glacier (Archive)
- CloudFront CDN
- Lambda (processamento de mídia)

---

## 6. Decisões Arquiteturais (Resumo)

### 6.1 BFF: NÃO no MVP
**Razão:** Supabase já é um BFF otimizado (RLS + Realtime + Auto REST API)  
**Quando adicionar:** P2, se múltiplos clientes ou orquestração complexa

### 6.2 DDD Patterns
- **Aggregates:** Transaction boundary (Event com EventSetlistEntry)
- **Repositories:** 1 por agregado (EventRepository, TeamMemberRepository)
- **Domain Events:** Comunicação assíncrona entre contexts

### 6.3 Padrões SOLID
- **SRP:** Componentes com responsabilidade única
- **DIP:** Inversão de dependências (interfaces, não classes concretas)
- **OCP:** Extensível via hooks/plugins (não modificar código existente)

---

## 7. Convenções de Nomenclatura

### Database Tables
```sql
-- Worship Context
events
event_setlist_entries
songs (Setlist global)

-- Team Context
team_members
availabilities
event_assignments

-- Media Context (P1)
media_files
media_versions
```

### API Endpoints
```
GET    /events                    # Lista eventos
POST   /events                    # Cria evento
GET    /events/:id                # Detalhes do evento
PATCH  /events/:id                # Atualiza evento
POST   /events/:id/songs          # Adiciona música ao Event Setlist
DELETE /events/:id/songs/:songId  # Remove música do Event Setlist
POST   /events/:id/publish        # Publica evento (dispara escalação)
```

### Commits (Conventional Commits)
```bash
feat(worship): adiciona criação de eventos
fix(team): corrige validação de disponibilidade
docs(adr): documenta escolha de algoritmo de escalação
test(worship): adiciona testes para Event Aggregate
```

---

## 8. Checklist de Validação DDD

**Antes de implementar uma feature:**

- [ ] Identifiquei o Bounded Context correto?
- [ ] Usei termos do glossário (linguagem úbiqua)?
- [ ] Identifiquei o Aggregate Root?
- [ ] Respeitei as invariantes do agregado?
- [ ] Eventos de domínio foram mapeados?
- [ ] Evitei acoplamento direto entre contextos?
- [ ] Usei IDs de referência (não embedded objects)?

---

**Para detalhes completos, consultar:** [`docs/architecture/DDD-GUIDE.md`](../architecture/DDD-GUIDE.md)
