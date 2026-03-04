# Worship+ — Documentação Compartilhada

**Plataforma de Gestão para Grupos de Louvor**

**Organização:** [worshipplus](https://github.com/worshipplus)  
**Repositório:** https://github.com/worshipplus/worship-plus.git  
**Visibilidade:** Public

---

## 📖 Sobre o Projeto

**Worship+** é uma plataforma digital para gestão e organização de grupos de louvor de igrejas, focada em facilitar a comunicação, escalas, setlists e eventos.

**Objetivo:** Centralizar informações, melhorar a colaboração entre membros e otimizar o planejamento musical e de eventos.

**Público-alvo:** Equipes de louvor, músicos, cantores, técnicos de mídia e som, líderes de igrejas.

---

## 🎯 Problema e Solução

### Problema

- Dificuldade de organização de eventos e escalas
- Comunicação dispersa (WhatsApp, email, papel)
- Falta de controle sobre setlists e versões de músicas
- Disponibilidade dos membros não é visível

### Solução

- **Eventos:** Criação e gerenciamento centralizado
- **Setlists:** Montagem de repertório com referências (YouTube)
- **Escalação:** Atribuição de membros baseada em disponibilidade
- **Disponibilidade:** Membros definem padrões semanais e exceções
- **Permissões:** Owners editam seus eventos sem depender de Admin

---

## 📂 Estrutura do Repositório

Este repositório contém **toda a documentação compartilhada** do projeto:

```
worship-plus/
├── README.md                          # Este arquivo
├── ONBOARDING.md                      # 🚀 Guia para novos colaboradores (COMECE AQUI!)
│
├── docs/
│   ├── architecture/                  # 🏗️ Arquitetura e Design
│   │   ├── DDD-GUIDE.md              # Domain-Driven Design completo
│   │   ├── ARCHITECTURE-DECISIONS.md  # Decisões técnicas (SOLID, DI, Commits)
│   │   └── rfcs/                     # Requests for Comments
│   │       ├── RFC-0001-media-storage.md
│   │       └── RFC-0002-project-overview.md
│   │
│   ├── planning/                      # 📋 Planejamento e Roadmap
│   │   ├── MVP-ROADMAP.md            # User Stories (US-001 a US-012)
│   │   ├── PROJECT_ANALYSIS.md       # Análise técnica completa
│   │   ├── TECHNICAL_SPECS.md        # Especificações técnicas
│   │   ├── brainstorm-insights.md    # Insights de brainstorming
│   │   ├── project-details.md        # Detalhes do projeto
│   │   └── tasks.md                  # Tarefas e backlog
│   │
│   ├── guides/                        # 📖 Guias e Tutoriais
│   │   ├── AGENTS-GUIDE.md           # Como usar AI agents
│   │   └── REPOSITORY-STRUCTURE.md   # Estrutura multi-repo (7 repos)
│   │
│   └── templates/                     # 📝 Templates de READMEs
│       ├── README-worship-plus-frontend.md
│       ├── README-worship-plus-backend.md
│       └── README-worship-plus-infra.md
│
├── scripts/                           # 🛠️ Scripts utilitários
│   ├── palette-extractor.js          # Extrai paletas de cores
│   ├── image-processor.js            # Processa imagens
│   └── video-processor.js            # Processa vídeos
│
└── setup-repositories.sh              # Script de setup da org
```

---

## �️ Roteiro de Leitura

**Novo no projeto?** Comece por aqui:

1. **[ONBOARDING.md](ONBOARDING.md)** 🚀 — Guia completo para novos colaboradores
2. **[docs/architecture/DDD-GUIDE.md](docs/architecture/DDD-GUIDE.md)** — Entender o domínio e bounded contexts
3. **[docs/planning/MVP-ROADMAP.md](docs/planning/MVP-ROADMAP.md)** — Ver User Stories e sprints
4. **[docs/architecture/ARCHITECTURE-DECISIONS.md](docs/architecture/ARCHITECTURE-DECISIONS.md)** — Padrões e convenções

---

## 📚 Documentos Principais

### 1. [docs/architecture/DDD-GUIDE.md](docs/architecture/DDD-GUIDE.md) — Domain-Driven Design

**O que contém:**

- 4 Bounded Contexts: Events, Music, Team, Media
- Agregados principais (Event, Song, TeamMember, Availability)
- Glossário de termos (Linguagem Úbiqua)
- Domain Events
- Stack técnico (React 19, Vite, Supabase)
- Decisões de persistência

**Quem usa:**

- Software Architecture Agent
- Frontend/Backend Developers
- Product Manager

**Última versão:** v1.2 (análise Vite vs Next.js)

---

### 2. [docs/architecture/ARCHITECTURE-DECISIONS.md](docs/architecture/ARCHITECTURE-DECISIONS.md) — Decisões Arquiteturais

**O que contém:**

- **BFF (Backend For Frontend):** Análise técnica e quando usar
- **Filosofia de Desenvolvimento:** SOLID, DRY, KISS
- **Design Patterns:** Decorators, Repository, Strategy, Observer
- **Dependency Injection:** Composition Root vs TSyringe/InversifyJS
- **Conventional Commits:** Padrão de mensagens com US-XXX
- Estrutura de pastas (frontend e backend)
- Clean Architecture (camadas e dependências)

**Quem usa:**

- Frontend Developer Agent
- Software Architecture Agent
- Desenvolvedores em code review

**Última versão:** 1.0 (inclui Conventional Commits)

---

### 3. [docs/planning/MVP-ROADMAP.md](docs/planning/MVP-ROADMAP.md) — Roadmap do MVP

**O que contém:**

- **P0 (Crítico):** 12 User Stories, 62 pontos, 7 semanas
  - Sprint 1: Auth + Membros (US-001 a US-003)
  - Sprint 2: Músicas (YouTube) + Disponibilidade (US-004 a US-006)
  - Sprint 3: Eventos + Escalação (US-007 a US-009)
  - Sprint 4: Permissões + Publicação (US-010 a US-012)
- **P1 (Importante):** VS upload, player, archival, OAuth
- **P2 (Futuro):** Notificações, reports, multi-tenancy
- Estimativas e timeline
- Riscos e mitigações

**Quem usa:**

- Product Manager Agent
- Desenvolvedores (referência de US-XXX em commits)
- Stakeholders

**O que NÃO está no MVP:**

- Upload de VS (movido para P1)
- OAuth Google/Apple (movido para P1)
- Notificações push (P2)

**O que ESTÁ no MVP:**

- YouTube Link **obrigatório** para músicas (substitui VS)

---

### 4. [docs/guides/AGENTS-GUIDE.md](docs/guides/AGENTS-GUIDE.md) — Guia para Agents

**O que contém:**

- Como usar DDD-GUIDE.md
- Processo de atualização de Living Documents
- Quando atualizar glossário, aggregates, domain events
- Checklist de validação
- Exemplos práticos

**Quem usa:**

- Todos os agents (Frontend, PM, Architecture)
- Desenvolvedores criando novos features

---

### 5. RFCs (Request for Comments)

#### [docs/architecture/rfcs/RFC-0001-media-storage.md](docs/architecture/rfcs/RFC-0001-media-storage.md)

**Status:** Aprovado para P1  
**Conteúdo:**

- Estratégia S3 + Glacier
- Lifecycle de mídia (ativo → arquivado → restaurado)
- Processamento e transcodificação (ffmpeg)
- Presigned URLs para upload direto
- Otimizações mobile-first

#### [docs/architecture/rfcs/RFC-0002-project-overview.md](docs/architecture/rfcs/RFC-0002-project-overview.md)

**Status:** Aprovado  
**Conteúdo:**

- Visão geral do Worship+
- Bounded Contexts
- Stack técnico
- Arquitetura de componentes

---

## 🚀 Como Usar Este Repositório

### Para Desenvolvedores

```bash
# Clone
git clone https://github.com/worshipplus/worship-plus.git
cd worship-plus

# Leia primeiro
open ONBOARDING.md
open docs/architecture/DDD-GUIDE.md
open docs/architecture/ARCHITECTURE-DECISIONS.md
open docs/planning/MVP-ROADMAP.md

# Consulte durante desenvolvimento
grep -r "Availability" docs/architecture/DDD-GUIDE.md  # Buscar termo
grep "US-005" docs/planning/MVP-ROADMAP.md         # Ver User Story

# Frontend (React + Vite)
cd frontend
npm ci
npm run dev

# Hooks de Git (Husky) + Conventional Commits
# (instalados automaticamente via `npm ci` por causa do script `prepare`)
# Se precisar reinstalar manualmente:
npm run prepare
```

---

### Para Product Manager

```bash
# Atualizar roadmap
git checkout -b docs/update-roadmap
vim MVP-ROADMAP.md

# Commit
git commit -m "docs(roadmap): adiciona US-013 para Sprint 5"
git push origin docs/update-roadmap
```

---

### Para Architecture Agent

```bash
# Adicionar novo bounded context
git checkout -b docs/add-notification-context
vim DDD-GUIDE.md

# Atualizar versão
# v1.2 → v1.3

# Commit
git commit -m "docs(ddd): adiciona Notification Context [US-020]"
```

---

## 🔄 Living Documents

Documentos que **evoluem com o projeto:**

- ✅ **DDD-GUIDE.md** - Atualizado quando:
  - Novo termo de domínio
  - Novo bounded context
  - Novo aggregate/entity
  - Nova decisão arquitetural

- ✅ **ARCHITECTURE-DECISIONS.md** - Atualizado quando:
  - Nova decisão de design pattern
  - Escolha de biblioteca/framework
  - Mudança de filosofia de desenvolvimento

- ✅ **MVP-ROADMAP.md** - Atualizado quando:
  - Nova sprint definida
  - User Story movida entre P0/P1/P2
  - Timeline ajustado

**Processo:** Veja [AGENTS-GUIDE.md Section 7](AGENTS-GUIDE.md#7-atualização-de-documentação-living-documents)

---

## 📊 Status do MVP

### P0 (Crítico) — 7 semanas

| Sprint   | User Stories    | Pontos | Status        |
| -------- | --------------- | ------ | ------------- |
| Sprint 1 | US-001 a US-003 | 11 pts | 🔄 Planejado  |
| Sprint 2 | US-004 a US-006 | 15 pts | ⏳ Aguardando |
| Sprint 3 | US-007 a US-009 | 21 pts | ⏳ Aguardando |
| Sprint 4 | US-010 a US-012 | 15 pts | ⏳ Aguardando |

**Total P0:** 62 pontos, 7 semanas  
**Data prevista MVP:** 23 de Abril de 2026

---

## 🏗️ Stack Técnico

### Frontend

- **React 19** (Suspense, Transitions)
- **Vite 6.0** (Build rápido 200ms)
- **Supabase Client** (Auth + Realtime)
- **CSS Modules** ou Tailwind (a definir)

### Backend

- **Supabase** (Postgres + Auth + Realtime)
- **Row-Level Security** (RLS policies)
- **Edge Functions** (Deno) para lógica serverless

### Infraestrutura (P1)

- **S3** (media storage)
- **CloudFront** (CDN)
- **Glacier IR** (archival)

**Decisão:** Vite escolhido sobre Next.js (veja [DDD-GUIDE section 8.1](DDD-GUIDE.md#81-stack-técnico))

---

## 🔗 Repositórios Relacionados

| Repositório               | Propósito                | Link                                                 |
| ------------------------- | ------------------------ | ---------------------------------------------------- |
| **worship-plus**          | Documentação (este repo) | https://github.com/worshipplus/worship-plus          |
| **worship-plus-agents**   | Agents de IA (Copilot)   | https://github.com/worshipplus/worship-plus-agents   |
| **worship-plus-poc**      | POCs e experimentos      | https://github.com/worshipplus/worship-plus-poc      |
| **worship-plus-frontend** | Aplicação React + Vite   | https://github.com/worshipplus/worship-plus-frontend |
| **worship-plus-backend**  | API/BFF (P2)             | https://github.com/worshipplus/worship-plus-backend  |
| **worship-plus-infra**    | IaC (Terraform + K8s)    | https://github.com/worshipplus/worship-plus-infra    |

**Estrutura completa:** [REPOSITORY-STRUCTURE.md](REPOSITORY-STRUCTURE.md)

---

## 🤝 Contribuindo

### Pull Requests

**Use Conventional Commits:**

```bash
git commit -m "docs(architecture): adiciona análise de cache [US-015]"
git commit -m "docs(ddd): atualiza Availability aggregate [US-006]"
git commit -m "docs(roadmap): move OAuth para P1"
```

**Formato:** `<type>(<scope>): <description> [US-XXX]`

**Types:** `docs`, `feat`, `fix`, `refactor`, etc.

**Veja:** [ARCHITECTURE-DECISIONS.md Section 5](ARCHITECTURE-DECISIONS.md#5-conventional-commits)

---

### Code Review Checklist

- [ ] Documento atualizado é Living Document?
- [ ] Versão bumped (se DDD-GUIDE ou ARCHITECTURE-DECISIONS)?
- [ ] Referências cruzadas corretas?
- [ ] User Story referenciada (se aplicável)?
- [ ] Decision log atualizado (se decisão técnica)?

---

## 📖 Leitura Recomendada

**Para novos desenvolvedores:**

1. [README.md](README.md) ← Você está aqui
2. [DDD-GUIDE.md](DDD-GUIDE.md) - Entender bounded contexts
3. [MVP-ROADMAP.md](MVP-ROADMAP.md) - Ver User Stories
4. [ARCHITECTURE-DECISIONS.md](ARCHITECTURE-DECISIONS.md) - Padrões de código

**Para agents:**

1. [AGENTS-GUIDE.md](AGENTS-GUIDE.md) - Como usar a documentação
2. Agent-specific docs em [worship-plus-agents](https://github.com/worshipplus/worship-plus-agents)

---

## 📞 Contato

**Dúvidas sobre documentação:**

- Abrir issue: https://github.com/worshipplus/worship-plus/issues
- Discussão: https://github.com/worshipplus/worship-plus/discussions

**Organização Worship+:**

- GitHub: https://github.com/worshipplus
- Todos os repositórios: https://github.com/orgs/worshipplus/repositories

---

## 📜 Licença

[A definir - MIT ou Proprietária]

---

**Este repositório é a fonte única de verdade (Single Source of Truth) para toda a documentação do Worship+.**

**Última atualização:** 2 de Março de 2026
