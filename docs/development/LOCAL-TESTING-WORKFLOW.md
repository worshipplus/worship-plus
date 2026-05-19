# 🧪 Workflow de Testes Local - Pré-Commit

**IMPORTANTE:** Execute este workflow ANTES de qualquer commit!

---

## 🎯 Objetivo

Garantir que o código está funcionando corretamente no navegador antes de commitar, evitando rework e mantendo a qualidade do código.

---

## 📋 Checklist de Desenvolvimento

### 1️⃣ Desenvolvimento da Feature

```bash
# 1. Criar branch da feature
git checkout -b feature/US-XXX-nome-feature

# 2. Desenvolver código
# ... implementação ...

# 3. Rodar em modo desenvolvimento
npm run dev
```

**Porta padrão:** `http://localhost:5173`

---

### 2️⃣ Testes Manuais no Navegador (OBRIGATÓRIO)

#### Antes de commitar, testar:

##### ✅ Funcionalidades Core
- [ ] Login/Logout funciona
- [ ] Navegação entre páginas funciona
- [ ] Componentes renderizam corretamente
- [ ] Estados (loading, error, success) funcionam
- [ ] Forms validam corretamente
- [ ] Modals abrem e fecham

##### ✅ Responsividade
- [ ] **Desktop** (1440px+): Layout com sidebar
- [ ] **Tablet** (768px-1023px): Layout intermediário
- [ ] **Mobile** (360px-767px): Bottom nav flutuante

**Ferramentas:**
- Chrome DevTools: `Cmd+Option+I` → Device Toolbar
- Testar em: iPhone 14, iPad Air, Desktop 1920x1080

##### ✅ Performance
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Sem memory leaks (Chrome DevTools Memory)

##### ✅ Acessibilidade
- [ ] Navegação por teclado funciona (Tab, Enter, Esc)
- [ ] Screen reader compatível (VoiceOver no Mac)
- [ ] Contraste de cores adequado (WCAG AA)
- [ ] Touch targets ≥ 48px

##### ✅ Glassmorphism (Premium)
- [ ] Backdrop blur renderiza corretamente
- [ ] Bordas semi-transparentes visíveis
- [ ] Hover states com glow funcionam
- [ ] Transições suaves (300-900ms)

---

### 3️⃣ Testes Automatizados

```bash
# Rodar todos os testes antes de commitar
npm run pre-commit
```

Este comando executa:
1. **Lint:** ESLint + Prettier
2. **Type Check:** TypeScript compiler
3. **Unit Tests:** Vitest (coverage ≥ 80%)
4. **Integration Tests:** React Testing Library
5. **Build:** Verificar se compila sem erros

#### ✅ Validação automática no push

Este repositório também possui um hook de **pre-push** (Husky) para barrar pushes que quebrariam o CI.

Ele executa um check rápido alinhado ao GitHub Actions:

```bash
# (executado automaticamente no push)
npm run ci:prepush
```

Se você precisar contornar o hook em situações excepcionais:

- `git push --no-verify` (pula hooks)
- ou `HUSKY=0 git push` (desativa Husky)

---

### 4️⃣ Build e Preview de Produção

```bash
# 1. Build para produção
npm run build

# 2. Preview do build
npm run preview
```

**Porta preview:** `http://localhost:4173`

#### Verificar no preview:
- [ ] Bundle size otimizado (dist/ < 1MB)
- [ ] Fonts carregam corretamente
- [ ] Images otimizadas
- [ ] Service worker registra (PWA)
- [ ] Console sem erros

---

### 5️⃣ Git Commit (Após validação)

```bash
# 1. Verificar untracked files
git status

# 2. Ver diff antes de adicionar
git diff

# 3. Stage arquivos relevantes
git add src/components/Button.tsx src/components/Button.test.tsx

# 4. Commit com mensagem convencional
git commit -m "feat(components): adiciona Button premium glassmorphism

- Implementa US-014
- 3 variantes: primary, secondary, ghost
- Hover com glow effect
- Touch target 48px
- Testes de acessibilidade passando"

# 5. Push para branch feature
git push origin feature/US-014-button-component
```

---

## 🚀 Scripts NPM Disponíveis

### Desenvolvimento

```bash
# Servidor de desenvolvimento (hot reload)
npm run dev

# Servidor com HTTPS local (para testar PWA)
npm run dev:https

# Storybook (design system)
npm run storybook
```

### Testes

```bash
# Testes unitários (watch mode)
npm run test

# Testes unitários (single run)
npm run test:unit

# Testes de integração
npm run test:integration

# Testes E2E (Playwright)
npm run test:e2e

# Testes E2E (headed mode - ver navegador)
npm run test:e2e:headed

# Coverage report
npm run test:coverage
```

### Build & Preview

```bash
# Build de produção
npm run build

# Preview do build
npm run preview

# Analisar bundle size
npm run build:analyze
```

### Qualidade de Código

```bash
# Lint (ESLint)
npm run lint

# Lint + fix automático
npm run lint:fix

# Lint CSS (Stylelint — valida ordem de @import)
npm run lint:css

# Prettier check
npm run format:check

# Prettier fix
npm run format

# TypeScript check
npm run type-check

# Rodar tudo antes de commit
npm run pre-commit
```

---

## 🔧 Configuração do Ambiente Local

### 1. Clonar repositório

```bash
git clone https://github.com/worshipplus/worship-plus.git
cd worship-plus
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar `.env.local`

```env
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ENV=development
VITE_API_BASE_URL=http://localhost:3000
```

### 4. Rodar migrações do Supabase (se necessário)

```bash
npx supabase db push
```

### 5. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

🎉 Acesse: `http://localhost:5173`

---

## 🐛 Troubleshooting Local

### Problema: Port 5173 já está em uso

```bash
# Matar processo na porta 5173
lsof -ti:5173 | xargs kill -9

# Ou usar porta alternativa
npm run dev -- --port 5174
```

### Problema: Glassmorphism não renderiza (Firefox)

**Causa:** Firefox tem suporte limitado para `backdrop-filter`.

**Solução:** Adicionar fallback:
```css
.glass-card {
  background: rgba(255, 255, 255, 0.7); /* Fallback */
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px); /* Safari */
}

@supports not (backdrop-filter: blur(40px)) {
  .glass-card {
    background: rgba(255, 255, 255, 0.95); /* Opacidade maior */
  }
}
```

### Problema: Fonts não carregam

```bash
# Verificar se fonts estão no /public/fonts
ls public/fonts

# Re-buildar
npm run build
```

### Problema: Supabase auth não funciona

```bash
# Verificar env variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Verificar se Supabase está online
curl -I https://xyz.supabase.co
```

---

## 📊 Métricas de Qualidade (Targets)

| Métrica | Target | Como Medir |
|---------|--------|------------|
| **Test Coverage** | ≥ 80% | `npm run test:coverage` |
| **Bundle Size** | < 500KB (gzipped) | `npm run build:analyze` |
| **Lighthouse Performance** | ≥ 90 | Chrome DevTools → Lighthouse |
| **Lighthouse Accessibility** | ≥ 95 | Chrome DevTools → Lighthouse |
| **TypeScript Errors** | 0 | `npm run type-check` |
| **ESLint Warnings** | 0 | `npm run lint` |
| **CSS Lint Errors** | 0 | `npm run lint:css` |
| **First Load** | < 2s | Network tab (Slow 3G) |

---

## 🎭 Testes E2E no Navegador

### Playwright Test Runner

```bash
# Rodar todos os E2E tests
npm run test:e2e

# Rodar em modo UI (debug)
npm run test:e2e:ui

# Rodar teste específico
npx playwright test tests/e2e/login.spec.ts

# Ver relatório de testes
npx playwright show-report
```

### Exemplo de teste E2E

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('usuário deve conseguir fazer login', async ({ page }) => {
  // 1. Navegar para página de login
  await page.goto('http://localhost:5173/login');
  
  // 2. Preencher credenciais
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  
  // 3. Clicar em login
  await page.click('button[type="submit"]');
  
  // 4. Verificar redirecionamento
  await expect(page).toHaveURL('http://localhost:5173/');
  
  // 5. Verificar mensagem de boas-vindas
  await expect(page.locator('text=Olá,')).toBeVisible();
});
```

---

## 🔄 Workflow Completo de Feature

```bash
# 1. Criar branch feature
git checkout -b feature/US-014-button-component

# 2. Implementar componente
# src/components/Button.tsx

# 3. Escrever testes
# src/components/Button.test.tsx

# 4. Rodar testes unitários
npm run test

# 5. Iniciar dev server
npm run dev

# 6. Testar no navegador manualmente
# ✅ Desktop, tablet, mobile
# ✅ Hover states, focus, disabled
# ✅ Acessibilidade (keyboard navigation)

# 7. Criar Storybook story
# src/components/Button.stories.tsx

# 8. Visualizar no Storybook
npm run storybook

# 9. Rodar pre-commit checks
npm run pre-commit

# 10. Build de produção
npm run build

# 11. Preview do build
npm run preview

# 12. Teste final no preview
# http://localhost:4173

# 13. Commit (apenas se tudo estiver OK)
git add .
git commit -m "feat(components): Button premium glassmorphism"

# 14. Push
git push origin feature/US-014-button-component

# 15. Criar PR no GitHub
gh pr create --base main --title "feat: Button component"
```

---

## 📸 Screenshots para Testes

### Capturar screenshots automaticamente

```bash
# Capturar screenshots de todos os componentes
npx playwright test --update-snapshots
```

### Visual Regression Testing

```typescript
// tests/e2e/visual.spec.ts
test('Button deve manter visual consistente', async ({ page }) => {
  await page.goto('http://localhost:6006/iframe.html?id=button--primary');
  
  // Screenshot do componente
  const button = page.locator('button');
  await expect(button).toHaveScreenshot('button-primary.png');
});
```

---

## 🎯 Checklist Final Antes de Commit

```bash
# Executar checklist automatizado
npm run pre-commit

# Se tudo passar:
✅ Tests: 45 passed
✅ Coverage: 85%
✅ Lint: 0 errors, 0 warnings
✅ TypeScript: 0 errors
✅ Build: Success (dist/ 423KB)

# Então pode commitar!
git commit -m "feat: ..."
```

---

**Mantido por:** Architecture Agent  
**Última atualização:** 2026-03-03  
**Referência:** `.github/PRE-COMMIT-CHECKLIST.md`
