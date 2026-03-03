# Tech Stack Reference — Worship+

**Versão:** 1.0  
**Data:** 3 de Março de 2026  
**Propósito:** Referência rápida de tecnologias e versões  
**Tamanho:** ~2KB

---

## 1. Frontend (P0 - MVP)

### Core
- **React:** 19.0.0 (última estável)
- **Vite:** 6.0.1 (bundler)
- **JavaScript:** ES2024 (sem TypeScript no MVP)

### Supabase Client
- **@supabase/supabase-js:** ^2.39.0
- **Auth, Realtime, Database:** Integrado

### Styling
- **CSS Modules:** Nativo do Vite
- **Design tokens:** CSS Variables (`:root`)
- **Mobile-first:** Breakpoints: 360px, 768px, 1024px, 1440px

### Testing
- **Vitest:** ^2.0.0 (unit tests)
- **@testing-library/react:** ^14.0.0 (integration)
- **jsdom:** Ambiente de testes

### Dev Tools
- **ESLint:** ^8.56.0 (linting)
- **Prettier:** ^3.2.0 (formatting)
- **Storybook:** ^7.6.0 (component library - opcional)

---

## 2. Backend (P0 - MVP)

### Supabase (Managed)
- **Postgres:** 15.x
- **PostgREST:** Auto-generated REST API
- **GoTrue:** Authentication
- **Realtime:** WebSocket subscriptions
- **Storage:** File uploads (mídia em P1)

### Row-Level Security (RLS)
```sql
-- Exemplo: apenas owner edita evento
CREATE POLICY "owner_can_edit" ON events
  FOR UPDATE USING (auth.uid() = owner_id);
```

---

## 3. Backend (P2 - BFF Futuro)

**Apenas se necessário:**
- **NestJS:** ^10.3.0 (framework)
- **TypeORM:** ^0.3.19 (ORM)
- **Class Validator:** ^0.14.0 (DTOs)
- **Passport JWT:** Autenticação

**Quando usar:**
- Múltiplos clientes (mobile, web, admin)
- Orquestração de 3+ serviços
- Regras de negócio complexas (>30 classes)

---

## 4. Infraestrutura (P1 - Mídia)

### Storage
- **AWS S3:** Active storage (eventos <30 dias)
- **AWS Glacier:** Archive (eventos >30 dias)
- **CloudFront:** CDN para entrega

### Processing
- **AWS Lambda:** Transcodificação de áudio
- **ffmpeg:** Conversão mp3/aac/webm
- **Sharp:** Geração de thumbnails

### Monitoring
- **Sentry:** Error tracking
- **Vercel Analytics:** Frontend metrics
- **Supabase Dashboard:** Database metrics

---

## 5. CI/CD

### GitHub Actions
```yaml
# .github/workflows/ci.yml
- Lint (ESLint)
- Type check (JSDoc)
- Unit tests (Vitest)
- Build (Vite)
- Deploy (Vercel)
```

### Ambientes
- **Develop:** Auto-deploy em push para `develop`
- **Staging:** Manual trigger após QA
- **Production:** Auto-deploy em merge para `main`

---

## 6. Development Tools

### VS Code Extensions
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "supabase.supabase-vscode",
    "ms-vscode.vscode-js-profile-flame",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### Git Aliases
```bash
# ~/.gitconfig ou .git/config local
[alias]
  co = checkout
  br = branch
  ci = commit
  st = status --short
  lg = log --oneline --graph --decorate --all
  cp = cherry-pick
  unstage = reset HEAD --
```

### Package Manager
- **npm:** 10.x (default Node 20)
- **Lock file:** `package-lock.json` (commitado)

---

## 7. Versions Control

### Node.js
- **Version:** 20.11.0 LTS
- **Manager:** nvm (recomendado)
- **.nvmrc:** `20.11.0`

### Browser Support
- **Chrome/Edge:** últimas 2 versões
- **Firefox:** últimas 2 versões
- **Safari:** últimas 2 versões
- **Mobile:** iOS 14+, Android 10+

---

## 8. Database Schema (Supabase Postgres)

### Migrations
```bash
# Supabase CLI
supabase migration new <name>
supabase db push
supabase db reset  # dev only
```

### Naming Conventions
- **Tables:** snake_case, plural (ex: `events`, `team_members`)
- **Columns:** snake_case (ex: `created_at`, `owner_id`)
- **Indexes:** `idx_<table>_<column>` (ex: `idx_events_date`)
- **Foreign Keys:** `fk_<table>_<ref_table>` (ex: `fk_events_team_members`)

---

## 9. API Conventions

### REST Endpoints (Supabase PostgREST)
```
GET    /events                    # Lista todos
GET    /events?id=eq.<uuid>       # Filtro
GET    /events?select=*,owner:team_members(name)  # Join
POST   /events                    # Cria
PATCH  /events?id=eq.<uuid>       # Atualiza
DELETE /events?id=eq.<uuid>       # Deleta
```

### Response Format
```json
{
  "data": [...],
  "error": null,
  "count": 42,
  "status": 200,
  "statusText": "OK"
}
```

---

## 10. Environment Variables

### Frontend (.env)
```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_VERSION=1.0.0
```

### Backend (P2 - .env)
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=xxx
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
S3_BUCKET=worship-plus-media
```

---

## 11. Quick Commands

### Development
```bash
# Frontend
npm run dev              # Vite dev server (http://localhost:5173)
npm run build            # Produção build
npm run preview          # Preview build local
npm run test             # Vitest watch mode
npm run test:coverage    # Coverage report

# Supabase
supabase start           # Local dev (Docker)
supabase db reset        # Reset DB local
supabase functions serve # Edge functions local
```

### Deployment
```bash
# Frontend (Vercel)
vercel --prod            # Deploy production

# Backend (P2 - Heroku/Railway)
git push heroku main     # Deploy backend
```

---

**Última atualização:** 3 de Março de 2026  
**Mantido por:** Software Architecture Agent
