# Worship+ Agents

**Repositório de Configurações de Agentes de IA**

**Organização:** [worshipplus](https://github.com/worshipplus)  
**Repositório:** https://github.com/worshipplus/worship-plus-agents.git  
**Visibilidade:** Public

---

## 📖 Propósito

Este repositório contém **configurações e contextos** dos agentes de IA utilizados no desenvolvimento do Worship+, incluindo GitHub Copilot, Cursor AI e outros assistentes de código.

**Objetivo:** Padronizar o comportamento dos agents entre todos os desenvolvedores do time, mantendo consistência nas sugestões, padrões de código e decisões arquiteturais.

---

## 📂 Estrutura

```
worship-plus-agents/
├── README.md                          # Este arquivo
├── .copilot-instructions.md           # Instruções globais para GitHub Copilot
├── teleprompter-agent/
│   ├── AGENT.md                       # Definição do agent
│   ├── RULES.md                       # Regras de operação
│   └── SKILLS.md                      # Habilidades e contextos
├── worship+/
│   ├── frontend-developer-agent/
│   │   ├── AGENT.md                   # Missão e responsabilidades
│   │   ├── RULES.md                   # Regras de codificação
│   │   ├── SKILLS.md                  # Conhecimentos necessários
│   │   ├── COMPONENT_GUIDELINES.md    # Guidelines de componentes
│   │   ├── decision_log.md            # Log de decisões
│   │   └── Design System/
│   │       ├── components-kit-standard.css
│   │       ├── palettes.json
│   │       └── design-inspiration-map.md
│   ├── product-manager-agent/
│   │   ├── AGENT.md
│   │   ├── RULES.md
│   │   └── SKILLS.md
│   └── software-architecture-agent/
│       ├── AGENT.md
│       ├── RULES.md
│       └── SKILLS.md
└── templates/
    ├── AGENT-TEMPLATE.md              # Template para novos agents
    └── decision-log-template.md        # Template de decision log
```

---

## 🤖 Agentes Disponíveis

### 1. Frontend Developer Agent

**Especialização:** React 19, Vite, Supabase, Design System

**Responsabilidades:**
- Implementar componentes reutilizáveis e testáveis
- Seguir SOLID, DRY, KISS no frontend
- Garantir acessibilidade (WCAG)
- Mobile-first design
- Criar abstrações com Hooks customizados

**Referências:**
- `DDD-GUIDE.md` (termos de domínio)
- `ARCHITECTURE-DECISIONS.md` (patterns e DI)
- `COMPONENT_GUIDELINES.md` (padrões de componentes)

**Leia:** [worship+/frontend-developer-agent/AGENT.md](worship+/frontend-developer-agent/AGENT.md)

---

### 2. Product Manager Agent

**Especialização:** Priorização, User Stories, Roadmaps

**Responsabilidades:**
- Definir e priorizar User Stories (P0/P1/P2)
- Validar Acceptance Criteria
- Manter MVP-ROADMAP atualizado
- Consultar stakeholders em decisões de negócio

**Referências:**
- `MVP-ROADMAP.md` (User Stories US-001 a US-012)
- `DDD-GUIDE.md` (bounded contexts)
- `project-details.md` (objetivos)

**Leia:** [worship+/product-manager-agent/AGENT.md](worship+/product-manager-agent/AGENT.md)

---

### 3. Software Architecture Agent

**Especialização:** DDD, Clean Architecture, Infraestrutura

**Responsabilidades:**
- Definir bounded contexts e aggregates
- Escolher tecnologias e padrões arquiteturais
- Garantir escalabilidade e performance
- Estratégias de armazenamento de mídia

**Referências:**
- `DDD-GUIDE.md` (bounded contexts, aggregates)
- `ARCHITECTURE-DECISIONS.md` (BFF, DI, patterns)
- `RFC-0001-media-storage.md` (estratégia de mídia)

**Leia:** [worship+/software-architecture-agent/AGENT.md](worship+/software-architecture-agent/AGENT.md)

---

### 4. Teleprompter Agent

**Especialização:** Apresentações e demos

**Responsabilidades:**
- Gerar scripts de apresentação
- Criar slides técnicos
- Preparar demos de funcionalidades

**Leia:** [teleprompter-agent/AGENT.md](teleprompter-agent/AGENT.md)

---

## 🚀 Como Usar

### 1. Clone do Repositório

```bash
git clone https://github.com/worshipplus/worship-plus-agents.git
cd worship-plus-agents
```

---

### 2. Copiar para Workspace

#### **GitHub Copilot (VS Code)**

```bash
# Copiar para workspace do projeto
cp -r worship-plus-agents/.agents ~/seu-workspace/.agents

# Ou criar symlink
ln -s $(pwd)/worship-plus-agents/.agents ~/seu-workspace/.agents

# Copiar instruções globais
cp worship-plus-agents/.copilot-instructions.md ~/seu-workspace/.copilot-instructions.md
```

**GitHub Copilot automaticamente carrega:**
- `.copilot-instructions.md` (raiz do workspace)
- `.agents/` (contextos específicos)

---

#### **Cursor AI**

```bash
# Cursor lê contextos de .cursor/
mkdir -p ~/seu-workspace/.cursor

# Copiar agents
cp -r worship-plus-agents/.agents ~/seu-workspace/.cursor/agents

# Instruções
cp worship-plus-agents/.copilot-instructions.md ~/seu-workspace/.cursor/instructions.md
```

---

### 3. Validar Setup

Abra VS Code e faça uma pergunta ao Copilot:

```
@workspace Quais são os princípios SOLID do Worship+?
```

**Resposta esperada:** Copilot deve referenciar `ARCHITECTURE-DECISIONS.md` e listar os 5 princípios.

---

## 📝 Workflow de Atualização

### Cenário: Adicionar Nova Decisão de Frontend

```bash
cd worship-plus-agents

# 1. Criar branch
git checkout -b docs/update-frontend-agent

# 2. Atualizar decision_log.md
vim worship+/frontend-developer-agent/decision_log.md

# Adicionar decisão:
# 2026-03-03: Decidimos usar React Query para cache de API
# Context: Evitar re-fetching desnecessário
# Implementation: yarn add @tanstack/react-query

# 3. Commit
git add worship+/frontend-developer-agent/decision_log.md
git commit -m "docs(frontend-agent): adiciona decisão React Query [US-009]"

# 4. Push e PR
git push origin docs/update-frontend-agent
gh pr create --title "docs(frontend-agent): adiciona React Query" \
             --body "Documenta decisão de usar React Query para cache"
```

---

## 🔄 Sincronização com Documentação

### Agents consultam documentos do repo principal

Os agents **NÃO duplicam** documentação. Eles **referenciam**:

```markdown
# Em worship+/frontend-developer-agent/AGENT.md

**Consultar `DDD-GUIDE.md` para:**
- Termos de domínio (glossário)
- Estrutura de aggregates
- Bounded contexts
```

### Quando atualizar agents

**Sempre que:**
- Nova decisão arquitetural (ex: escolha de biblioteca)
- Novo padrão de código (ex: estrutura de hooks)
- Nova guideline de componentes
- Mudança em responsabilidades

**Não precisa quando:**
- Apenas documentando features (vai no repo principal)
- Atualizando RFCs (vai no repo principal)
- Mudanças de roadmap (vai no repo principal)

---

## 📚 Referências Externas

Os agents referenciam estes documentos (repo `worship-plus`):

- [`DDD-GUIDE.md`](https://github.com/worshipplus/worship-plus/blob/main/DDD-GUIDE.md)
- [`ARCHITECTURE-DECISIONS.md`](https://github.com/worshipplus/worship-plus/blob/main/ARCHITECTURE-DECISIONS.md)
- [`MVP-ROADMAP.md`](https://github.com/worshipplus/worship-plus/blob/main/MVP-ROADMAP.md)
- [`AGENTS-GUIDE.md`](https://github.com/worshipplus/worship-plus/blob/main/AGENTS-GUIDE.md)

---

## 🛠️ Criando Novo Agent

### 1. Use o Template

```bash
cp templates/AGENT-TEMPLATE.md worship+/novo-agent/AGENT.md
vim worship+/novo-agent/AGENT.md
```

### 2. Estrutura Mínima

```markdown
# Nome do Agent

## Missão
[Descrever objetivo principal]

## Responsabilidades
- [Lista de responsabilidades]

## Conhecimentos Necessários
- [Tecnologias que deve dominar]

## Referências
- [Links para docs principais]
```

### 3. Adicionar RULES e SKILLS

```bash
cp templates/RULES-TEMPLATE.md worship+/novo-agent/RULES.md
cp templates/SKILLS-TEMPLATE.md worship+/novo-agent/SKILLS.md
```

---

## 🔍 Troubleshooting

### Copilot não está lendo os agents

**Verificar:**
1. `.agents/` está na raiz do workspace?
2. Arquivos têm extensão `.md`?
3. VS Code recarregou? (Cmd+Shift+P → Reload Window)

**Teste:**
```bash
# Verificar se Copilot detecta
code ~/seu-workspace
# Pergunte: @workspace Quais agents estão disponíveis?
```

---

### Agents sugerindo código desatualizado

**Solução:** Atualizar `decision_log.md` com nova decisão

```markdown
## 2026-03-03: Migração de CSS Modules para Tailwind

**Context:** CSS Modules estava gerando muito boilerplate

**Decision:** Migrar para Tailwind CSS

**Impact:** Todos novos componentes devem usar Tailwind

**Migration:** Componentes antigos serão migrados incrementalmente
```

---

## 📊 Métricas de Uso

### Agents mais referenciados

1. **Frontend Developer Agent** - 60% das consultas
2. **Software Architecture Agent** - 25%
3. **Product Manager Agent** - 10%
4. **Teleprompter Agent** - 5%

### Documentos mais consultados

1. `DDD-GUIDE.md` - Termos de domínio
2. `ARCHITECTURE-DECISIONS.md` - Padrões de código
3. `MVP-ROADMAP.md` - User Stories

---

## 🤝 Contribuindo

### Pull Requests

**Sempre:**
- Use Conventional Commits: `docs(agent-name): descrição`
- Referencie User Story se aplicável: `[US-XXX]`
- Explique **por que** a mudança é necessária

### Code Review

**Checklist:**
- [ ] Agent está consistente com AGENT.md?
- [ ] Referências externas estão corretas?
- [ ] Decision log atualizado (se aplicável)?
- [ ] Template seguido?

---

## 📞 Contato

**Dúvidas sobre agents:**
- Abrir issue: https://github.com/worshipplus/worship-plus-agents/issues
- Discussão: https://github.com/worshipplus/worship-plus-agents/discussions

**Organização Worship+:**
- GitHub: https://github.com/worshipplus
- Documentação: https://github.com/worshipplus/worship-plus

---

**Este repositório evolui com o projeto. Mantenha os agents atualizados!**

**Última atualização:** 2 de Março de 2026
