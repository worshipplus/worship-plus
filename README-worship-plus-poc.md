# Worship+ POC

**Proofs of Concept e Experimentos Técnicos**

**Organização:** [worshipplus](https://github.com/worshipplus)  
**Repositório:** https://github.com/worshipplus/worship-plus-poc.git  
**Visibilidade:** Public

---

## 📖 Propósito

Este repositório contém **POCs (Proofs of Concept)** e experimentos técnicos para validar arquitetura, performance e viabilidade de features **antes** da implementação no MVP.

**Objetivo:** Reduzir riscos técnicos, validar decisões arquiteturais e criar benchmarks de performance.

---

## 📂 Estrutura

```
worship-plus-poc/
├── README.md                          # Este arquivo
├── poc-react-19-vite/                 # ✅ POC atual (concluído)
│   ├── README.md
│   ├── package.json
│   ├── vite.config.mjs
│   ├── index.html
│   └── src/
│       ├── components/
│       │   ├── AudioPlayer.jsx
│       │   ├── Avatar.jsx
│       │   ├── Badge.jsx
│       │   ├── Modal.jsx
│       │   └── Sidebar.jsx
│       ├── views/
│       │   ├── EventsView.jsx
│       │   ├── SetlistView.jsx
│       │   └── TeamView.jsx
│       └── styles/
│           ├── tokens.css
│           ├── components.css
│           └── responsive.css
│
├── poc-supabase-realtime/             # 🔄 Futuro
│   └── README.md
│
├── poc-media-transcoding/             # 🔄 Futuro
│   └── README.md
│
└── poc-availability-calendar/         # 🔄 Futuro
    └── README.md
```

---

## ✅ POC 1: React 19 + Vite

**Status:** Concluído  
**Data:** Fevereiro 2026  
**Objetivo:** Validar arquitetura frontend (React 19 + Vite) antes do MVP

### Resultados

| Métrica | Resultado | Status |
|---------|-----------|--------|
| **Build Production** | 197KB (gzipped) | ✅ Excelente |
| **Build Time** | 200ms | ✅ 15x mais rápido que Next.js |
| **HMR** | Instantâneo (<50ms) | ✅ Excelente |
| **First Load** | <1s | ✅ Excelente |
| **Lighthouse** | 95+ | ✅ Aprovado |

### Componentes Implementados

- ✅ **AudioPlayer:** Player de áudio com controles customizados
- ✅ **Avatar:** Componente de avatar com fallback de iniciais
- ✅ **Badge:** Badges de status e notificação
- ✅ **Modal:** Modal reutilizável com overlay
- ✅ **Sidebar:** Navegação lateral responsiva

### Views Implementadas

- ✅ **EventsView:** Listagem de eventos futuros
- ✅ **SetlistView:** Criação e edição de setlists
- ✅ **TeamView:** Gestão de equipe

### Decisões Validadas

1. **Vite > Next.js:** Build 15x mais rápido, bundle menor
2. **CSS Modules:** Melhor que Tailwind para este caso (menos overhead)
3. **React 19:** Suspense e Transitions funcionam perfeitamente
4. **Mobile-first:** Layout responsivo validado (360px → 1920px)

### Como Rodar

```bash
cd poc-react-19-vite
npm install
npm run dev
# http://localhost:5173
```

**Veja:** [poc-react-19-vite/README.md](poc-react-19-vite/README.md)

---

## 🔄 POC 2: Supabase Realtime (Planejado)

**Status:** Não iniciado  
**Objetivo:** Validar Supabase Realtime subscriptions para updates em tempo real

### Testes Planejados

1. **Subscription Performance:**
   - Quantos usuários simultâneos?
   - Latência de updates (target: <500ms)
   - Reconnection automática

2. **Casos de Uso:**
   - Event Setlist atualizado → Notifica membros escalados
   - Availability changed → Atualiza UI de escalação
   - Event published → Notifica todos da igreja

3. **Fallback:**
   - Polling se WebSocket falhar
   - Offline-first com sync

### Stack

- Supabase Realtime (WebSocket)
- React hooks customizados (`useRealtimeSubscription`)

---

## 🔄 POC 3: Media Transcoding (Planejado)

**Status:** Não iniciado  
**Objetivo:** Validar transcodificação serverless de áudio (WAV → MP3/AAC/WebM)

### Testes Planejados

1. **Performance:**
   - Tempo de transcodificação (target: <30s para 5min de áudio)
   - Custo por transcodificação
   - Memory usage (Lambda limits)

2. **Qualidade:**
   - Bitrate ideal (256kbps vs 192kbps vs 128kbps)
   - Comparar waveform antes/depois
   - Teste subjetivo de áudio

3. **Estratégias:**
   - Lambda (AWS)
   - Edge Function (Supabase/Deno)
   - Worker (Cloudflare)

### Stack

- ffmpeg-static (Node.js)
- Sharp (thumbnails)
- S3 presigned URLs

---

## 🔄 POC 4: Availability Calendar (Planejado)

**Status:** Não iniciado  
**Objetivo:** Validar UX de disponibilidade (semanal + exceções)

### Testes Planejados

1. **Componentes:**
   - WeeklyPattern (0-6 dias da semana)
   - MonthlyCalendar (exceções em datas específicas)
   - Badge de disponibilidade (verde/vermelho)

2. **Interações:**
   - Toggle semanal (1 clique)
   - Add override em data (modal)
   - Visualização de conflitos (vermelho)

3. **Performance:**
   - Renderizar 50 membros com disponibilidade
   - Filtrar disponíveis para data X (<100ms)

### Stack

- React hooks (`useAvailability`)
- date-fns (manipulação de datas)
- CSS Grid (calendar layout)

---

## 🚀 Criando Nova POC

### 1. Estrutura Base

```bash
# Criar pasta
mkdir poc-nome-experimento
cd poc-nome-experimento

# Inicializar
npm init -y

# Adicionar README
cat > README.md << 'EOF'
# POC: Nome do Experimento

**Objetivo:** [Descrever o que está sendo validado]

## Hipótese

[O que queremos provar ou refutar]

## Testes

1. [Teste 1]
2. [Teste 2]

## Resultados

[Preencher após execução]

## Decisão

[Aprovado para MVP? Movido para P1? Descartado?]
EOF
```

---

### 2. Configurar POC

```bash
# React + Vite (se frontend)
npm create vite@latest . -- --template react

# Node.js simples (se backend/infra)
npm install [dependências]

# Adicionar ao .gitignore root
echo "poc-nome-experimento/node_modules/" >> ../.gitignore
```

---

### 3. Executar e Documentar

```bash
# Rodar testes
npm run dev

# Registrar resultados em README.md
vim README.md

# Commit
git add poc-nome-experimento/
git commit -m "feat(poc): adiciona POC de [nome] para validar [objetivo]"
```

---

## 📊 Histórico de POCs

| POC | Status | Data | Decisão |
|-----|--------|------|---------|
| React 19 + Vite | ✅ Concluído | Fev 2026 | Aprovado para MVP |
| Supabase Realtime | ⏳ Planejado | Mar 2026 | - |
| Media Transcoding | ⏳ Planejado | Abr 2026 (P1) | - |
| Availability Calendar | ⏳ Planejado | Mar 2026 | - |

---

## 🔗 Referências

- **Documentação:** https://github.com/worshipplus/worship-plus
- **DDD-GUIDE:** Bounded Contexts e Aggregates
- **ARCHITECTURE-DECISIONS:** Padrões validados
- **MVP-ROADMAP:** User Stories que podem se beneficiar de POCs

---

## 🤝 Contribuindo

### Propor Nova POC

```bash
# 1. Abrir issue
gh issue create --title "POC: Nome do Experimento" \
                --body "Objetivo: [descrever]
                
Hipótese: [o que queremos validar]
                
Testes: [lista de testes]"

# 2. Aguardar aprovação do Architecture Agent

# 3. Criar branch
git checkout -b poc/nome-experimento

# 4. Implementar POC

# 5. Documentar resultados em README.md

# 6. PR com resultados e decisão
```

---

## 📞 Contato

**Dúvidas sobre POCs:**
- Issue: https://github.com/worshipplus/worship-plus-poc/issues
- Discussão: https://github.com/worshipplus/worship-plus-poc/discussions

**Organização:**
- GitHub: https://github.com/worshipplus

---

**Este repositório evolui com novos experimentos técnicos.**

**Última atualização:** 2 de Março de 2026
