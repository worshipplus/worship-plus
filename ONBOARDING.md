# 🚀 Onboarding - Worship+ Project

**Bem-vindo ao Worship+!**

Este guia te ajudará a entender o projeto, sua estrutura e como começar a contribuir.

---

## 📖 Índice

1. [Sobre o Projeto](#sobre-o-projeto)
2. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
3. [Estrutura de Repositórios](#estrutura-de-repositórios)
4. [Como Navegar na Documentação](#como-navegar-na-documentação)
5. [Primeiros Passos](#primeiros-passos)
6. [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
7. [Padrões e Convenções](#padrões-e-convenções)
8. [Ferramentas e Setup](#ferramentas-e-setup)
9. [Perguntas Frequentes](#perguntas-frequentes)
10. [Contatos e Canais](#contatos-e-canais)

---

## 1. Sobre o Projeto

### O Problema

Ministérios de louvor de igrejas evangélicas enfrentam problemas de **gestão descentralizada**:

- ❌ Comunicação espalhada (WhatsApp, planilhas, memória)
- ❌ Sem visibilidade de disponibilidade dos membros
- ❌ Escalação manual propensa a erros
- ❌ Repertório desorganizado (links do YouTube perdidos)
- ❌ Histórico de eventos perdido

### A Solução

**Worship+** é uma **plataforma centralizada** para:

- ✅ **Gestão de Eventos** (cultos, ensaios, conferências)
- ✅ **Escalação Inteligente** com disponibilidade dos membros
- ✅ **Repertório Musical** organizado (músicas + YouTube links)
- ✅ **Setlists** por evento
- ✅ **Histórico** completo de eventos e escalações

### Tecnologias Principais

| Camada       | Stack                            | Status                       |
| ------------ | -------------------------------- | ---------------------------- |
| **Frontend** | React 19 + Vite 6.0              | Sprint 1 (P0)                |
| **Backend**  | Supabase (Postgres + Auth + RLS) | MVP (P0)                     |
| **BFF**      | NestJS                           | P2 (opcional, se necessário) |
| **Infra**    | AWS S3 + Glacier + CloudFront    | P1 (media upload)            |
| **IaC**      | Terraform + Kubernetes           | P1-P2                        |

---

## 2. Visão Geral da Arquitetura

### 2.1 Domain-Driven Design (DDD)

O projeto segue **DDD** com 4 **Bounded Contexts**:

```
┌─────────────────────────────────────────────────────────┐
│                Worship+ Domain Model                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐     ┌──────────────┐                 │
│  │   Events     │────>│   Setlist    │                 │
│  │  Context     │     │   Context    │                 │
│  └──────────────┘     └──────────────┘                 │
│         │                     │                         │
│         │                     │                         │
│         v                     v                         │
│  ┌──────────────┐     ┌──────────────┐                 │
│  │    Team      │     │  Repertoire  │                 │
│  │  Context     │     │   Context    │                 │
│  └──────────────┘     └──────────────┘                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Leia:** [docs/architecture/DDD-GUIDE.md](docs/architecture/DDD-GUIDE.md)

---

### 2.2 Bounded Contexts

#### 1. **Events Context** 🎤

- **Agregados:** Event, EventSetlist
- **Casos de Uso:** Criar evento, escalar membros, publicar evento
- **Entidades:** Event, EventSetlist, EventMember

#### 2. **Team Context** 👥

- **Agregados:** Member, Availability
- **Casos de Uso:** Cadastrar membro, definir disponibilidade
- **Value Objects:** WeeklyPattern, DateOverride

#### 3. **Repertoire Context** 🎵

- **Agregados:** Song
- **Casos de Uso:** Cadastrar música, adicionar YouTube link
- **Entidades:** Song, Tag

#### 4. **Setlist Context** 📋

- **Agregados:** Setlist
- **Casos de Uso:** Criar setlist, adicionar músicas, reordenar
- **Entidades:** Setlist, SetlistSong

**Glossário completo:** [docs/architecture/DDD-GUIDE.md](docs/architecture/DDD-GUIDE.md#glossário-ubiquitous-language)

---

### 2.3 Arquitetura de Sistema (C4 Model - Nível 2)

```
┌────────────────────────────────────────────────────────────┐
│                       Frontend Web                          │
│               React 19 + Vite + Supabase Client             │
│         (Events, Setlists, Team, Availability UIs)          │
└───────────────────────┬────────────────────────────────────┘
                        │
                        │ HTTPS
                        │
            ┌───────────▼──────────────┐
            │   Supabase Platform      │
            │  ┌──────────────────┐    │
            │  │  Auth (JWT)      │    │
            │  ├──────────────────┤    │
            │  │  Postgres DB     │    │
            │  │  + RLS Policies  │    │
            │  ├──────────────────┤    │
            │  │  Realtime        │    │
            │  │  (WebSocket)     │    │
            │  └──────────────────┘    │
            └──────────────────────────┘

┌──────────────────────────────────────────────────┐
│              Fase P1 (Upload de Mídia)           │
├──────────────────────────────────────────────────┤
│   S3 Bucket → Lifecycle → Glacier (6 meses)     │
│   CloudFront CDN → Streaming                     │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│         Fase P2 (Backend BFF - Opcional)         │
├──────────────────────────────────────────────────┤
│   NestJS API → Supabase Client → Postgres       │
│   Redis Cache → Heavy Queries                    │
│   SQS Queue → Transcodificação de Áudio         │
└──────────────────────────────────────────────────┘
```

**Decisões arquiteturais:** [docs/architecture/ARCHITECTURE-DECISIONS.md](docs/architecture/ARCHITECTURE-DECISIONS.md)

---

## 3. Estrutura de Repositórios

O projeto está dividido em **7 repositórios** na organização [worshipplus](https://github.com/worshipplus):

| Repositório                                                                       | Descrição                         | Visibilidade | Status                    |
| --------------------------------------------------------------------------------- | --------------------------------- | ------------ | ------------------------- |
| **[worship-plus](https://github.com/worshipplus/worship-plus)**                   | 📚 Documentação (você está aqui!) | Public       | ✅ Ativo                  |
| **[worship-plus-agents](https://github.com/worshipplus/worship-plus-agents)**     | 🤖 AI agents (Copilot, Cursor)    | Public       | ✅ Ativo                  |
| **[worship-plus-poc](https://github.com/worshipplus/worship-plus-poc)**           | 🧪 POCs técnicos                  | Public       | ✅ Ativo                  |
| **[worship-plus-frontend](https://github.com/worshipplus/worship-plus-frontend)** | 💻 React 19 + Vite app            | Private      | 🔄 Sprint 1 (P1)          |
| **[worship-plus-backend](https://github.com/worshipplus/worship-plus-backend)**   | 🔧 NestJS BFF                     | Private      | 📦 P2 (quando necessário) |
| **[worship-plus-infra](https://github.com/worshipplus/worship-plus-infra)**       | ☁️ Terraform + K8s                | Private      | 📦 P1-P2 (S3/CloudFront)  |
| **[worship-plus-scripts](https://github.com/worshipplus/worship-plus-scripts)**   | 🛠️ Utilitários                    | Public       | 📦 Opcional               |

**Guia completo:** [docs/guides/REPOSITORY-STRUCTURE.md](docs/guides/REPOSITORY-STRUCTURE.md)

---

## 4. Como Navegar na Documentação

### 📂 Estrutura deste Repositório

```
worship-plus/
├── README.md                          # Introdução e visão geral
├── ONBOARDING.md                      # Este arquivo (começar por aqui!)
│
├── docs/
│   ├── summaries/                     # 📦 Summaries (Context Economy)
│   │   ├── ddd-summary.md            # 5KB vs DDD-GUIDE 48KB (90% savings)
│   │   ├── arch-decisions-summary.md # 3KB resumo de padrões
│   │   └── tech-stack.md             # 2KB referência rápida
│   │
│   ├── user-stories/                  # 📝 User Stories (Template + Exemplos)
│   │   ├── _template/                # Template padrão (4 arquivos base)
│   │   ├── US-001-autenticacao/      # Exemplo simples
│   │   └── US-050-upload-vs/         # Exemplo complexo (ADR + diagrama)
│   │
│   ├── architecture/                  # 🏗️ Arquitetura e Design
│   │   ├── DDD-GUIDE.md              # Domain-Driven Design completo
│   │   ├── ARCHITECTURE-DECISIONS.md  # Decisões técnicas (SOLID, DI, etc.)
│   │   └── rfcs/                     # Requests for Comments
│   │       ├── RFC-0001-media-storage.md
│   │       └── RFC-0002-project-overview.md
│   │
│   ├── planning/                      # 📋 Planejamento e Roadmap
│   │   ├── MVP-ROADMAP.md            # User Stories e Sprints
│   │   ├── PROJECT_ANALYSIS.md       # Análise inicial do projeto
│   │   ├── TECHNICAL_SPECS.md        # Especificações técnicas
│   │   ├── brainstorm-insights.md    # Insights de brainstorming
│   │   ├── project-details.md        # Detalhes do projeto
│   │   └── tasks.md                  # Tarefas e backlog
│   │
│   ├── guides/                        # 📖 Guias e Tutoriais
│   │   ├── AGENTS-GUIDE.md           # Como usar AI agents (v2.0 - Multi-Agent Workflow)
│   │   └── REPOSITORY-STRUCTURE.md   # Estrutura multi-repo
│   │
│   └── templates/                     # 📝 Templates de READMEs
│       ├── README-worship-plus-frontend.md
│       ├── README-worship-plus-backend.md
│       └── README-worship-plus-infra.md
│
├── scripts/                           # 🛠️ Scripts utilitários
│   ├── create-user-story.sh          # Criar User Story (15min → 5min)
│   ├── validate-user-story.sh        # Validar checklist automatizado
│   ├── sprint-report.sh              # Gerar relatório de sprint
│   ├── palette-extractor.js          # Extrai paletas de cores
│   ├── image-processor.js            # Processa imagens
│   └── video-processor.js            # Processa vídeos
│
└── setup-repositories.sh              # Script de setup da org
```

### 🗺️ Roteiro de Leitura Recomendado

**Para Product Owners / Gerentes:**

1. [README.md](README.md) - Visão geral
2. [docs/planning/MVP-ROADMAP.md](docs/planning/MVP-ROADMAP.md) - User Stories e timeline
3. [docs/planning/PROJECT_ANALYSIS.md](docs/planning/PROJECT_ANALYSIS.md) - Análise de negócio

**Para Desenvolvedores:**

1. **ONBOARDING.md** (você está aqui!)
2. [docs/summaries/ddd-summary.md](docs/summaries/ddd-summary.md) - Resumo DDD (5KB, leitura rápida)
3. [docs/architecture/DDD-GUIDE.md](docs/architecture/DDD-GUIDE.md) - DDD completo (quando precisar de detalhes)
4. [docs/architecture/ARCHITECTURE-DECISIONS.md](docs/architecture/ARCHITECTURE-DECISIONS.md) - Padrões e convenções
5. [docs/planning/MVP-ROADMAP.md](docs/planning/MVP-ROADMAP.md) - Ver User Stories
6. [docs/guides/AGENTS-GUIDE.md](docs/guides/AGENTS-GUIDE.md) - Workflow Multi-Agent (v2.0)
7. [docs/user-stories/\_template/README.md](docs/user-stories/_template/README.md) - Template de User Story

**Para Arquitetos:**

1. [docs/architecture/ARCHITECTURE-DECISIONS.md](docs/architecture/ARCHITECTURE-DECISIONS.md)
2. [docs/architecture/DDD-GUIDE.md](docs/architecture/DDD-GUIDE.md)
3. [docs/architecture/rfcs/](docs/architecture/rfcs/) - RFCs técnicos
4. [docs/guides/REPOSITORY-STRUCTURE.md](docs/guides/REPOSITORY-STRUCTURE.md)

---

## 5. Primeiros Passos

### 5.1 Setup Inicial

#### Pré-requisitos

- Node.js 20+
- Git configurado com SSH
- Conta GitHub com acesso à org `worshipplus`
- VS Code (recomendado) + GitHub Copilot

#### Clone o Repositório de Documentação

```bash
cd ~/Projects
git clone git@github.com:worshipplus/worship-plus.git
cd worship-plus
```

#### Leia a Documentação Core

```bash
# Ordem recomendada
cat ONBOARDING.md                          # Este arquivo
cat docs/architecture/DDD-GUIDE.md         # DDD completo
cat docs/planning/MVP-ROADMAP.md           # User Stories
cat docs/architecture/ARCHITECTURE-DECISIONS.md  # Padrões
```

---

### 5.2 Setup de AI Agents (Copilot)

Os **AI agents** te ajudam a escrever código consistente com os padrões do projeto.

#### 1. Clone o Repositório de Agents

```bash
cd ~/Projects
git clone git@github.com:worshipplus/worship-plus-agents.git
```

#### 2. Copie Agents para Workspace

```bash
# Quando estiver trabalhando no frontend
cd ~/Projects/worship-plus-frontend  # (quando criado)
cp -r ~/Projects/worship-plus-agents/.agents .
```

#### 3. Recarregue VS Code

```
Cmd+Shift+P → "Developer: Reload Window"
```

#### 4. Valide que Copilot Leu os Agents

Digite no chat do Copilot:

```
Quais são as regras do Frontend Developer Agent?
```

**Guia completo:** [docs/guides/AGENTS-GUIDE.md](docs/guides/AGENTS-GUIDE.md)

---

### 5.3 Familiarize-se com o Domain Model

Abra e leia com atenção:

1. **Glossário (Ubiquitous Language):**
   - [docs/architecture/DDD-GUIDE.md](docs/architecture/DDD-GUIDE.md#glossário-ubiquitous-language)
   - Termos: Event, Setlist, Member, Availability, Song, etc.

2. **Aggregates:**
   - [docs/architecture/DDD-GUIDE.md](docs/architecture/DDD-GUIDE.md#aggregates)
   - Event, Member, Song, Setlist, Availability

3. **Domain Events:**
   - [docs/architecture/DDD-GUIDE.md](docs/architecture/DDD-GUIDE.md#domain-events)
   - EventPublished, MemberScaled, SetlistAssigned, etc.

---

## 6. Fluxo de Desenvolvimento

### 6.1 Escolher uma User Story

1. Acesse: [docs/planning/MVP-ROADMAP.md](docs/planning/MVP-ROADMAP.md)
2. Escolha uma User Story disponível (status: `🔄 To Do`)
3. Leia os **Acceptance Criteria**
4. Entenda as **Dependencies**

**Exemplo:**

```markdown
### US-001: Autenticação com Email/Senha

**Status:** ✅ P0 (MVP)  
**Sprint:** Sprint 1  
**Pontos:** 5

**Como** membro do ministério  
**Quero** fazer login com email e senha  
**Para que** eu possa acessar o sistema de forma segura

**Acceptance Criteria:**

- [ ] Tela de login com email e senha
- [ ] Validação de campos obrigatórios
- [ ] Integração com Supabase Auth
- [ ] Redirecionar para `/events` após login bem-sucedido
- [ ] Mostrar erro se credenciais inválidas
```

---

### 6.2 Criar Branch

```bash
git checkout -b feature/US-001-authentication

# Convenção:
# feature/US-XXX-description  (nova funcionalidade)
# fix/US-XXX-description      (correção de bug)
# refactor/US-XXX-description (refatoração)
```

---

### 6.3 Desenvolver

**Seguir padrões documentados:**

1. **DDD Layers:**
   - `src/features/{context}/domain/` - Entities, Value Objects, Aggregates
   - `src/features/{context}/application/` - Use Cases, Services
   - `src/features/{context}/infrastructure/` - Repositories, Adapters
   - `src/features/{context}/presentation/` - Components, Views

2. **Composition Root (DI):**
   - Centralizar instâncias em `src/config/container.ts`
   - Evitar usar `new` diretamente nos componentes

3. **Mobile-First:**
   - Design para 360px → 1920px
   - Breakpoints: mobile (360px), tablet (768px), desktop (1024px)

**Exemplo:**

```typescript
// src/features/auth/hooks/useAuth.ts
import { authService } from "@/config/container";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    if (result.success) setUser(result.user);
    return result;
  };

  return { user, signIn };
}
```

---

### 6.4 Workflow Multi-Agent (Novo ✨)

**O projeto agora usa um workflow event-driven com economia de contexto de 93%!**

#### Como Funciona:

```
PM Agent
  │ Cria story.md usando summaries (8KB vs 125KB tradicional)
  ├─→ ./scripts/create-user-story.sh --id 025 --title "feature"
  ├─→ ./scripts/validate-user-story.sh --id 025
  ▼
Architecture Agent
  │ Define contract.yaml (OpenAPI 3.1.0)
  │ Gera scenarios.feature (BDD Gherkin)
  │ Gera acceptance-tests.md (QA checklist)
  │ Se complexo: cria ADR + sequence diagram (Mermaid)
  ▼
Frontend + Backend (PARALELO)
  │ Consomem apenas contract.yaml (2.5KB)
  │ Implementam simultaneamente
  └─→ Deploy
```

#### Economia de Custo:

| Métrica    | Tradicional | Otimizado | Economia   |
| ---------- | ----------- | --------- | ---------- |
| Context/US | 80-125KB    | 6.5-12KB  | **85-93%** |
| Custo/US   | $0.015      | $0.0004   | **97%**    |
| MVP 50 US  | $0.75       | $0.025    | **$0.72**  |
| Tempo      | 100h        | 12.5h     | **87.5h**  |

#### Scripts de Automação:

```bash
# Criar nova User Story (15min → 5min = 66% economia)
./scripts/create-user-story.sh --id 025 --title "marcar-disponibilidade" \
  --context Team --priority P1 --estimate 5

# Validar User Story (checklist automatizado)
./scripts/validate-user-story.sh --id 025
# Output: ✅ READY FOR DEVELOPMENT (11 checks passed)

# Gerar relatório de sprint
./scripts/sprint-report.sh --sprint 1
# Output: docs/sprint-reports/sprint-1-report.md
```

#### Estrutura de User Story:

**Base (toda US - 4 arquivos):**

- `story.md` (1.5KB) - Source of truth
- `contract.yaml` (2.5KB) - OpenAPI 3.1.0 spec
- `scenarios.feature` (1KB) - Gherkin BDD
- `acceptance-tests.md` (1KB) - QA checklist

**Seletivo (US complexa - +2 arquivos):**

- `adr-XXX.md` (3KB) - Architecture Decision Record com Mermaid
- `sequence-diagram.mmd` (2KB) - Diagrama Mermaid (5+ flows)

**Exemplos:**

- [US-001](docs/user-stories/US-001-autenticacao/) (simples - 4 arquivos)
- [US-050](docs/user-stories/US-050-upload-vs/) (complexo - 6 arquivos com ADR + diagrama)

**Guia completo:** [docs/guides/AGENTS-GUIDE.md](docs/guides/AGENTS-GUIDE.md) v2.0 (seção 3)

---

### 6.5 Testar

```bash
# Testes unitários
npm test

# Testes de componente
npm test -- src/features/auth

# Coverage
npm run test:coverage
```

**Mínimo de cobertura:** 80%

---

### 6.6 Commit (Conventional Commits)

```bash
git add .
git commit -m "feat(auth): adiciona LoginForm component [US-001]"
```

**Formato obrigatório:**

```
<type>(<scope>): <description> [US-XXX]

<type>: feat, fix, docs, style, refactor, perf, test, build, ci, chore
<scope>: auth, events, setlist, team, availability, components, hooks
[US-XXX]: Obrigatório para feat/fix relacionados a User Stories
```

**Exemplos:**

```bash
feat(events): adiciona EventForm component [US-007]
fix(availability): corrige prioridade de override [US-006]
refactor(setlist): extrai lógica de reordenação [US-009]
docs(architecture): atualiza DDD-GUIDE com Availability
test(team): adiciona testes para MemberCard component [US-004]
```

**Guia completo:** [docs/architecture/ARCHITECTURE-DECISIONS.md](docs/architecture/ARCHITECTURE-DECISIONS.md#conventional-commits)

---

### 6.6.1 Git Hooks (Husky) + Commitlint

Este repositório usa **Husky** para garantir, antes de commitar:

- `pre-commit`: roda `lint-staged` (ESLint `--fix` + Prettier `--write`) nos arquivos staged
- `commit-msg`: valida **Conventional Commits** e exige `[US-XXX]` para commits `feat`/`fix`

**Instalação automática:** ao rodar `npm ci` em `frontend/`, o script `prepare` instala os hooks no root.

**Reinstalar hooks (se necessário):**

```bash
cd frontend
npm run prepare
```

---

### 6.7 Push e Pull Request

```bash
git push -u origin feature/US-001-authentication
```

**Criar PR:**

```bash
gh pr create --title "feat(auth): adiciona autenticação [US-001]" \
             --body "Implementa US-001: Autenticação com Email/Senha

**Acceptance Criteria:**
✅ Tela de login com email e senha
✅ Validação de campos obrigatórios
✅ Integração com Supabase Auth
✅ Redirecionar para /events após login
✅ Mostrar erro se credenciais inválidas

**Testes:**
✅ Unit tests (authService.test.ts)
✅ Component tests (LoginForm.test.tsx)
✅ E2E tests (login.spec.ts)

**Related:**
- MVP-ROADMAP.md section 2.1

**Screenshots:**
[anexar screenshot da tela de login]
"
```

---

### 6.8 Code Review

**Checklist do Reviewer:**

- [ ] Código segue DDD (domain/application/infrastructure/presentation)
- [ ] Conventional Commits [US-XXX] presente
- [ ] Testes unitários passam (>80% coverage)
- [ ] UI é mobile-first (360px → 1920px)
- [ ] Nomes seguem Ubiquitous Language (DDD-GUIDE)
- [ ] Composition Root usado (sem `new` nos components)
- [ ] Acceptance Criteria da US atendidos
- [ ] Sem erros de lint/type-check

**Aprovar:**

```
✅ LGTM! Código segue DDD patterns, testes OK, UI responsiva.
```

---

### 6.8 Merge e Deploy

**Após aprovação:**

1. **Merge para `develop`:**

   ```bash
   gh pr merge --squash
   ```

2. **Deploy automático para Staging:**
   - GitHub Actions → Build → Vercel staging
   - URL: `https://worship-plus-staging.vercel.app`

3. **QA em Staging:**
   - Testar funcionalidade end-to-end
   - Validar com Product Owner

4. **Merge `develop` → `main` (Production):**

   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```

5. **Deploy automático para Production:**
   - GitHub Actions → Build → Vercel production
   - URL: `https://app.worshipplus.com`

---

## 7. Padrões e Convenções

### 7.1 Princípios SOLID

**S - Single Responsibility Principle:**

```typescript
// ❌ Errado: Component faz query + UI
function EventsList() {
  const [events, setEvents] = useState([])
  useEffect(() => {
    supabase.from('events').select('*').then(setEvents)
  }, [])
  return <div>{events.map(...)}</div>
}

// ✅ Correto: Hook customizado separa responsabilidades
function useEvents() {
  const [events, setEvents] = useState([])
  useEffect(() => {
    eventService.getAll().then(setEvents)
  }, [])
  return { events }
}

function EventsList() {
  const { events } = useEvents()
  return <div>{events.map(...)}</div>
}
```

**Leia mais:** [docs/architecture/ARCHITECTURE-DECISIONS.md](docs/architecture/ARCHITECTURE-DECISIONS.md#solid-principles)

---

### 7.2 DRY (Don't Repeat Yourself)

```typescript
// ❌ Errado: Lógica duplicada
function EventCard({ event }) {
  const formattedDate = new Date(event.date).toLocaleDateString('pt-BR')
  return <div>{formattedDate}</div>
}

function EventDetails({ event }) {
  const formattedDate = new Date(event.date).toLocaleDateString('pt-BR')
  return <span>{formattedDate}</span>
}

// ✅ Correto: Extrair para utilitário
// src/shared/utils/date.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR')
}

function EventCard({ event }) {
  return <div>{formatDate(event.date)}</div>
}

function EventDetails({ event }) {
  return <span>{formatDate(event.date)}</span>
}
```

---

### 7.3 KISS (Keep It Simple, Stupid)

```typescript
// ❌ Errado: Over-engineering
class EventFactory {
  private static instance: EventFactory;
  private constructor() {}

  static getInstance(): EventFactory {
    if (!this.instance) this.instance = new EventFactory();
    return this.instance;
  }

  createEvent(data: EventData): Event {
    const validator = new EventValidator();
    if (!validator.validate(data)) throw new Error();
    return new Event(data);
  }
}

// ✅ Correto: Simples e direto
export function createEvent(data: EventData): Event {
  if (!data.title || !data.date) throw new Error("Invalid data");
  return { id: uuid(), ...data };
}
```

---

### 7.4 Naming Conventions

**Variáveis e Funções:**

```typescript
// ✅ Usar Ubiquitous Language (DDD-GUIDE)
const event = Event.create(title, date); // ✅ Event (domain term)
const member = Member.create(name, role); // ✅ Member (domain term)
const setlist = Setlist.create(eventId); // ✅ Setlist (domain term)

// ❌ Evitar termos genéricos
const item = { title, date }; // ❌ Vago
const person = { name, role }; // ❌ Não é domain term
```

**Components:**

```typescript
// Pascal Case para componentes
EventForm.tsx;
MemberCard.tsx;
SetlistModal.tsx;

// camelCase para hooks
useEvents.ts;
useAvailability.ts;
useSetlist.ts;
```

**Arquivos:**

```
kebab-case.ts     // Utilitários
PascalCase.tsx    // Componentes React
camelCase.test.ts // Testes
```

---

## 8. Ferramentas e Setup

### 8.1 VS Code Extensions (Recomendadas)

```json
{
  "recommendations": [
    "github.copilot",
    "github.copilot-chat",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

---

### 8.2 Git Aliases Úteis

```bash
# ~/.gitconfig
[alias]
  # Ver commits com US-XXX
  us = "!f() { git log --grep=\"US-$1\" --oneline; }; f"

  # Último commit
  last = log -1 HEAD --stat

  # Status curto
  st = status --short

  # Log graph
  lg = log --graph --oneline --all --decorate
```

**Uso:**

```bash
git us 007  # Ver commits da US-007
git last    # Ver último commit
git st      # Status curto
git lg      # Log visual
```

---

### 8.3 GitHub CLI (gh)

```bash
# Instalar
brew install gh

# Autenticar
gh auth login

# Criar PR rapidamente
gh pr create --fill

# Ver PRs
gh pr list

# Ver issues
gh issue list
```

---

## 9. Perguntas Frequentes

### 9.1 Quando usar BFF (Backend For Frontend)?

**MVP (P0-P1): NÃO usar BFF**

- Frontend conecta diretamente ao Supabase
- RLS (Row-Level Security) garante segurança

**P2: Considerar BFF se:**

- Múltiplos clientes (web + mobile iOS + mobile Android)
- Orquestração complexa (1 chamada frontend = 5+ queries Supabase)
- Business logic com 10+ condições (não cabe em RLS)
- Cache necessário (queries pesadas >3s)

**Leia mais:** [docs/architecture/ARCHITECTURE-DECISIONS.md](docs/architecture/ARCHITECTURE-DECISIONS.md#quando-usar-bff)

---

### 9.2 Como funciona Availability (disponibilidade)?

**Modelo:**

```typescript
Availability {
  memberId: string
  weeklyPattern: [0,1,2,3,4,5,6]  // Dias da semana: 0=Dom, 6=Sáb
  dateOverrides: [
    { date: '2026-03-25', available: false }  // Exceção específica
  ]
}
```

**Lógica:**

1. **Padrão semanal:** Membro disponível em certos dias da semana
2. **Override:** Exceção para data específica tem prioridade

**Exemplo:**

- Padrão: Disponível aos domingos (0) e quartas (3)
- Override: Indisponível em 2026-03-25 (quarta)
- Resultado: Disponível domingos, EXCETO 2026-03-25

**Leia mais:** [docs/architecture/DDD-GUIDE.md](docs/architecture/DDD-GUIDE.md#availability-aggregate)

---

### 9.3 Por que Vite em vez de Next.js?

| Critério        | Vite        | Next.js  | Vencedor                  |
| --------------- | ----------- | -------- | ------------------------- |
| **Build Time**  | 200ms       | 3s       | ✅ Vite (15x mais rápido) |
| **Bundle Size** | 197KB       | 350KB    | ✅ Vite                   |
| **HMR**         | Instantâneo | <500ms   | ✅ Vite                   |
| **SSR**         | Manual      | Built-in | ✅ Next.js                |
| **SEO**         | Manual      | Built-in | ✅ Next.js                |

**Decisão:** Vite, porque:

- Worship+ é **SPA privada** (sem necessidade de SEO)
- Build rápido = feedback instantâneo = produtividade++
- Time pequeno (1-2 devs MVP), simplicidade importa

**Leia mais:** [docs/architecture/DDD-GUIDE.md](docs/architecture/DDD-GUIDE.md#vite-vs-nextjs)

---

### 9.4 Como testar com Supabase local?

```bash
# 1. Instalar Supabase CLI
brew install supabase/tap/supabase

# 2. Inicializar
supabase init

# 3. Start local
supabase start

# 4. Ver credenciais
supabase status

# 5. Configurar .env.local
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=[key do supabase status]

# 6. Rodar migrations
supabase db push

# 7. Rodar testes
npm test
```

**Stop:**

```bash
supabase stop
```

---

### 9.5 O que fazer se AI Agent não está funcionando?

**Sintomas:**

- Copilot sugere código genérico (sem seguir padrões DDD)
- Não menciona Ubiquitous Language (Event, Setlist, Member)

**Solução:**

1. **Recarregar VS Code:**

   ```
   Cmd+Shift+P → "Developer: Reload Window"
   ```

2. **Verificar se `.agents/` existe:**

   ```bash
   ls -la .agents
   ```

3. **Validar com Copilot Chat:**

   ```
   Quais são as regras do Frontend Developer Agent?
   ```

   Resposta esperada: Deve mencionar React 19, Vite, DDD, mobile-first

4. **Re-copiar agents:**
   ```bash
   rm -rf .agents
   cp -r ~/Projects/worship-plus-agents/.agents .
   ```

**Leia mais:** [docs/guides/AGENTS-GUIDE.md](docs/guides/AGENTS-GUIDE.md#troubleshooting)

---

## 10. Contatos e Canais

### 10.1 Repositórios

- **Docs:** https://github.com/worshipplus/worship-plus
- **Agents:** https://github.com/worshipplus/worship-plus-agents
- **POC:** https://github.com/worshipplus/worship-plus-poc
- **Frontend:** https://github.com/worshipplus/worship-plus-frontend (Sprint 1)

### 10.2 Comunicação

- **Issues:** Criar em cada repositório específico
  - Bug: `gh issue create --label bug --title "Bug: Descrição"`
  - Feature: `gh issue create --label enhancement --title "Feature: Descrição"`
- **Discussões:** https://github.com/orgs/worshipplus/discussions

---

## 🎉 Pronto para Começar!

**Checklist de Onboarding:**

- [ ] Li ONBOARDING.md (este arquivo)
- [ ] Li [docs/architecture/DDD-GUIDE.md](docs/architecture/DDD-GUIDE.md)
- [ ] Li [docs/planning/MVP-ROADMAP.md](docs/planning/MVP-ROADMAP.md)
- [ ] Li [docs/architecture/ARCHITECTURE-DECISIONS.md](docs/architecture/ARCHITECTURE-DECISIONS.md)
- [ ] Clonei repositório `worship-plus` (docs)
- [ ] Clonei repositório `worship-plus-agents` (AI agents)
- [ ] Instalei VS Code extensions recomendadas
- [ ] Copiei `.agents/` para workspace
- [ ] Testei GitHub Copilot com prompt sobre Frontend Agent
- [ ] Escolhi primeira User Story do MVP-ROADMAP
- [ ] Criei branch `feature/US-XXX-description`

**Próximo passo:** Desenvolver primeira User Story! 🚀

---

**Última atualização:** 2 de Março de 2026

**Contribua:** Encontrou algo errado ou faltando? Abra uma issue ou PR!
