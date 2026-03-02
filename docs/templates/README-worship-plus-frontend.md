# Worship+ Frontend

**Aplicação Web React 19 + Vite**

**Organização:** [worship plus](https://github.com/worshipplus)  
**Repositório:** https://github.com/worshipplus/worship-plus-frontend.git  
**Visibilidade:** Private

---

## 📖 Propósito

Aplicação **React 19 + Vite** do Worship+ para **produção**. Conecta direto ao Supabase (auth + database) sem camada de BFF no MVP.

---

## 🚀 Stack Técnico

### Core
- **React 19** (Suspense, Transitions, use() hook)
- **Vite 6.0** (Build rápido, HMR instantâneo)
- **TypeScript** (opcional mas recomendado P1)

### Backend/Auth
- **Supabase Client** (Auth + Realtime + Database)
- **Row-Level Security** (RLS) para segurança

### Styling
- **CSS Modules** (isolamento de estilos)
- **Design Tokens** (cores, espaçamentos, tipografia)

### Testing
- **Vitest** (testes unitários)
- **React Testing Library** (testes de componentes)
- **Playwright** (E2E - P1)

### CI/CD
- **GitHub Actions** (lint, test, build)
- **Vercel** ou **Netlify** (deploy automático)

---

## 📂 Estrutura

```
worship-plus-frontend/
├── README.md                          # Este arquivo
├── package.json
├── vite.config.js
├── .env.example
├── .gitignore
│
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Lint, test, build
│       └── deploy.yml                 # Deploy Vercel
│
├── public/
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   ├── features/                      # Feature-based modules (DDD)
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   └── usePermissions.ts
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   └── types.ts
│   │   │
│   │   ├── events/
│   │   │   ├── hooks/
│   │   │   │   ├── useEvents.ts
│   │   │   │   └── useEventSetlist.ts
│   │   │   ├── components/
│   │   │   │   ├── EventForm.tsx
│   │   │   │   ├── EventCard.tsx
│   │   │   │   └── SetlistModal.tsx
│   │   │   ├── services/
│   │   │   │   └── eventService.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── setlist/
│   │   │   ├── hooks/
│   │   │   │   └── useSongs.ts
│   │   │   ├── components/
│   │   │   │   ├── SongForm.tsx
│   │   │   │   └── YouTubePreview.tsx
│   │   │   └── types.ts
│   │   │
│   │   ├── team/
│   │   │   ├── hooks/
│   │   │   │   ├── useTeamMembers.ts
│   │   │   │   └── useAvailability.ts
│   │   │   ├── components/
│   │   │   │   ├── MemberCard.tsx
│   │   │   │   └── AvailabilityCalendar.tsx
│   │   │   └── types.ts
│   │   │
│   │   └── availability/
│   │       ├── hooks/
│   │       │   └── useAvailability.ts
│   │       ├── components/
│   │       │   ├── WeeklyPattern.tsx
│   │       │   └── MonthlyCalendar.tsx
│   │       └── types.ts
│   │
│   ├── shared/                        # Compartilhado entre features
│   │   ├── components/
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── hooks/
│   │   │   ├── useAsync.ts
│   │   │   ├── useSupabaseQuery.ts
│   │   │   └── useDebounce.ts
│   │   ├── utils/
│   │   │   ├── date.ts
│   │   │   └── validation.ts
│   │   └── types/
│   │       └── common.ts
│   │
│   ├── config/
│   │   ├── supabase.ts                # Supabase client singleton
│   │   └── container.ts               # Composition Root (DI)
│   │
│   ├── styles/
│   │   ├── tokens.css                 # Design tokens
│   │   ├── global.css                 # Reset + globals
│   │   └── responsive.css             # Breakpoints
│   │
│           ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/                           # Playwright (P1)
```

---

## 🛠️ Setup Local

### 1. Pré-requisitos

- Node.js 20+
- npm ou yarn
- Conta Supabase (free tier OK)

---

### 2. Clone e Install

```bash
git clone https://github.com/worshipplus/worship-plus-frontend.git
cd worship-plus-frontend
npm install
```

---

### 3. Configurar Variáveis de Ambiente

```bash
cp .env.example .env.local
```

**Editar `.env.local`:**

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=seu_anon_key_aqui
```

**Como obter:**
1. Acesse https://app.supabase.com
2. Selecione seu projeto
3. Settings → API → URL e anon/public key

---

### 4. Rodar Dev Server

```bash
npm run dev
# Abre http://localhost:5173
```

---

### 5. Build Production

```bash
npm run build
npm run preview  # Testar build local
```

---

## 📝 Scripts Disponíveis

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "e2e": "playwright test"
  }
}
```

---

## 🧪 Testes

### Unit Tests (Vitest)

```bash
# Rodar todos
npm test

# Watch mode
npm test -- --watch

# Coverage
npm run test:coverage
```

**Exemplo:**

```typescript
// src/features/events/hooks/useEvents.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { useEvents } from './useEvents'

test('useEvents fetches events', async () => {
  const { result } = renderHook(() => useEvents())
  
  await waitFor(() => {
    expect(result.current.events).toHaveLength(5)
  })
})
```

---

### E2E Tests (Playwright - P1)

```bash
npm run e2e
```

**Exemplo:**

```typescript
// tests/e2e/create-event.spec.ts
import { test, expect } from '@playwright/test'

test('create new event', async ({ page }) => {
  await page.goto('/events/new')
  await page.fill('[name="title"]', 'Culto de Domingo')
  await page.fill('[name="date"]', '2026-03-10')
  await page.click('button[type="submit"]')
  
  await expect(page).toHaveURL(/\/events\/\d+/)
})
```

---

## 🎨 Design System

### Tokens (src/styles/tokens.css)

```css
:root {
  /* Colors */
  --color-primary: #4F46E5;
  --color-secondary: #10B981;
  --color-error: #EF4444;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  
  /* Breakpoints (via media queries) */
  /* mobile: 360px */
  /* tablet: 768px */
  /* desktop: 1024px */
}
```

---

### Componentes (src/shared/components/)

**Button:**
```tsx
<Button variant="primary" size="md">
  Criar Evento
</Button>
```

**Modal:**
```tsx
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <ModalHeader>Título</ModalHeader>
  <ModalBody>Conteúdo</ModalBody>
  <ModalFooter>
    <Button onClick={onSave}>Salvar</Button>
  </ModalFooter>
</Modal>
```

---

## 🔐 Autenticação (Supabase)

### Hook useAuth()

```typescript
// src/features/auth/hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )
    
    return () => subscription.unsubscribe()
  }, [])
  
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }
  
  const signOut = async () => {
    await supabase.auth.signOut()
  }
  
  return { user, loading, signIn, signOut }
}
```

---

### Proteger Rotas

```typescript
// src/features/auth/components/ProtectedRoute.tsx
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) return <LoadingSpinner />
  if (!user) return <Navigate to="/login" />
  
  return <>{children}</>
}

// Uso
<Route path="/events" element={<ProtectedRoute><EventsView /></ProtectedRoute>} />
```

---

## 🗂️ Dependency Injection (Composition Root)

### src/config/container.ts

```typescript
import { createClient } from '@supabase/supabase-js'
import { SupabaseEventRepository } from '@/features/events/repositories/event.repository'
import { EventService } from '@/features/events/services/event.service'

// Singleton Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Repositories
export const eventRepository = new SupabaseEventRepository(supabase)
export const teamRepository = new SupabaseTeamRepository(supabase)

// Services
export const eventService = new EventService(eventRepository)
export const teamService = new TeamService(teamRepository)

// Testing factories
export function createEventServiceForTest(repo: IEventRepository) {
  return new EventService(repo)
}
```

**Uso:**

```typescript
// src/features/events/hooks/useEvents.ts
import { eventService } from '@/config/container'

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  
  useEffect(() => {
    eventService.getAll().then(setEvents)
  }, [])
  
  return { events }
}
```

---

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Configurar variáveis de ambiente
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# 4. Deploy production
vercel --prod
```

**Auto-deploy:**
- Push para `develop` → Deploy staging
- Push para `main` → Deploy production

---

### Netlify (Alternativa)

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Deploy
netlify deploy --prod

# 3. Vars de ambiente via UI
# https://app.netlify.com → Site settings → Environment variables
```

---

## 📊 Performance

### Metas (MVP)

| Métrica | Target | Atual |
|---------|--------|-------|
| **First Contentful Paint** | <1.5s | - |
| **Time to Interactive** | <3s | - |
| **Lighthouse Score** | 90+ | - |
| **Bundle Size** | <300KB | 197KB (POC) ✅ |
| **Build Time** | <30s | ~10s ✅ |

---

## 🔗 Referências

- **Documentação:** https://github.com/worshipplus/worship-plus
- **DDD-GUIDE:** Bounded Contexts e termos
- **ARCHITECTURE-DECISIONS:** Padrões SOLID, DI, Conventional Commits
- **MVP-ROADMAP:** User Stories (US-001 a US-012)
- **POC:** https://github.com/worshipplus/worship-plus-poc

---

## 🤝 Contribuindo

### Criar Feature Branch

```bash
git checkout -b feature/US-007-event-creation
```

### Commit (Conventional Commits)

```bash
git commit -m "feat(events): adiciona EventForm component [US-007]"
```

### Pull Request

```bash
gh pr create --title "feat(events): adiciona EventForm [US-007]" \
             --body "Implementa US-007: Cadastro de eventos
             
Acceptance Criteria:
✅ Formulário com campos title, date, description
✅ Validação de data futura
✅ Botão salvar desabilitado se inválido
✅ Redireciona para /events/:id após criar

Related: MVP-ROADMAP.md section 2.3"
```

---

## 📞 Contato

**Issues:** https://github.com/worshipplus/worship-plus-frontend/issues  
**Organização:** https://github.com/worshipplus

---

**Este repositório é private. Apenas membros do core team têm acesso.**

**Última atualização:** 2 de Março de 2026
