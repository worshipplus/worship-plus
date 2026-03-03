# US-001: Checklist de Testes de Aceitação — Autenticação Básica

**Feature:** Autenticação Básica  
**Bounded Context:** User Management (Generic)  
**Testado por:** [Nome do QA/Dev]  
**Data:** [data]  
**Ambiente:** [ ] Staging | [ ] Production

---

## ✅ Testes Funcionais

### Happy Path (Fluxos de Sucesso)

- [ ] **Login com credenciais corretas**
  - [ ] Input: email="jubarte@adpg.com", senha="SecurePass123"
  - [ ] Output: Redireciona para `/dashboard`
  - [ ] Exibe mensagem "Bem-vindo, Jubarte!"
  - [ ] Token JWT armazenado em httpOnly cookie
  - [ ] Avatar do usuário visível no header

- [ ] **Sessão persiste após reload**
  - [ ] Reload (F5) mantém autenticação
  - [ ] Dashboard continua acessível
  - [ ] Token JWT não expira imediatamente

- [ ] **Logout encerra sessão**
  - [ ] Clicar em "Logout" redireciona para `/login`
  - [ ] Token JWT é invalidado
  - [ ] Tentar acessar `/dashboard` redireciona para `/login`

### Validações de Input

- [ ] Campo "Email" é obrigatório (erro: "Campo email é obrigatório")
- [ ] Campo "Email" aceita apenas formato válido (ex: @example.com)
- [ ] Campo "Senha" é obrigatório (erro: "Campo senha é obrigatório")
- [ ] Campo "Senha" exige mínimo 8 caracteres
- [ ] Validação client-side funciona (antes de submit, sem HTTP)
- [ ] Email normalizado (espaços extras removidos)
- [ ] Email case-insensitive ("JUBARTE@ADPG.COM" = "jubarte@adpg.com")

### Casos de Erro

- [ ] **Senha incorreta:** Exibe "Email ou senha incorretos"
- [ ] **Email não cadastrado:** Exibe "Email não encontrado"
- [ ] **5 tentativas falhas:** Bloqueia login por 15min, exibe countdown
- [ ] **Erro de rede (500):** Exibe "Erro ao conectar. Verifique sua conexão e tente novamente."
- [ ] **Erro de rede:** Botão "Tentar Novamente" funciona
- [ ] Estado da aplicação permanece consistente após erro

### Recuperação de Senha

- [ ] Link "Esqueci minha senha" redireciona para `/recover-password`
- [ ] Email válido: Exibe "Se o email estiver cadastrado, você receberá um link de recuperação"
- [ ] Email válido: Envia email de recuperação (verificar inbox mock)
- [ ] Email não cadastrado: Exibe mesma mensagem (não revela existência)
- [ ] Rate limiting: 3 tentativas em 5min, depois bloqueia com erro

### Token Refresh

- [ ] Access token expirado → renova automaticamente com refresh token
- [ ] Refresh token válido → requisições continuam funcionando
- [ ] Refresh token expirado (7 dias) → redireciona para `/login`
- [ ] Mensagem "Sua sessão expirou. Faça login novamente."

---

## ✅ Testes de Segurança

### Autenticação e Autorização

- [ ] Apenas usuários autenticados acessam rotas protegidas
- [ ] Usuário não autenticado redireciona para `/login?redirect=/dashboard`
- [ ] Após login, redireciona para URL original (redirect param)
- [ ] Token JWT tem expiração de 7 dias (verificar payload)

### Validações de Segurança

- [ ] Senha não aparece em plain text (type="password")
- [ ] Token JWT armazenado em httpOnly cookie (não localStorage)
- [ ] SQL injection não é possível (Supabase RLS + prepared statements)
- [ ] XSS prevention: inputs sanitizados
- [ ] Rate limiting configurado (5 req/min por IP no login)
- [ ] HTTPS obrigatório em produção (verificar redirect http→https)
- [ ] Password hash bcrypt no servidor (não texto plano no DB)

### Bloqueio e Rate Limiting

- [ ] 5 tentativas falhas = 15min de bloqueio
- [ ] Countdown de 15:00 até 00:00 exibido durante bloqueio
- [ ] Botão "Entrar" desabilitado durante bloqueio
- [ ] Bloqueio por IP (não por email - evitar DoS)

---

## ✅ Testes de UI/UX

### Responsividade

- [ ] **Mobile (390x844 - iPhone):** Layout funcional, sem scroll horizontal
- [ ] **Mobile (360x640 - Android):** Layout funcional, sem scroll horizontal
- [ ] **Tablet (768x1024):** Layout adaptado
- [ ] **Desktop (1440x900):** Layout otimizado
- [ ] Breakpoints intermediários funcionam (600px, 900px, 1200px)

### Acessibilidade (WCAG 2.1 - Level AA)

- [ ] Todos os inputs têm `<label>` associados (for/id)
- [ ] ARIA labels em elementos interativos (botões, links)
- [ ] Navegação por teclado (TAB) funciona: Email → Senha → Entrar → Esqueci Senha
- [ ] Indicadores de foco visíveis (outline ou custom style)
- [ ] Pressionar ENTER no campo "Senha" submete formulário
- [ ] Contraste de cores ≥ 4.5:1 (texto normal) - verificar com contrast checker
- [ ] Contraste de cores ≥ 3:1 (botões, ícones)
- [ ] Screen reader anuncia labels e mensagens de erro (testar VoiceOver/NVDA)
- [ ] Mensagens de erro anunciadas via aria-live="polite"
- [ ] Título da página anunciado: "Login - Worship+"

### Feedback ao Usuário

- [ ] Loading spinner visível durante autenticação (0.5s+)
- [ ] Mensagem de sucesso: "Bem-vindo, [Nome]!" exibida após login
- [ ] Mensagens de erro claras e específicas (não genéricas)
- [ ] Campo "Senha" é limpo após erro (campo "Email" mantém valor)
- [ ] Botão "Entrar" desabilitado durante processamento (prevent double-submit)
- [ ] Botão "Entrar" muda para "Entrando..." durante loading

### Performance Percebida

- [ ] Autofocus no campo "Email" ao carregar página
- [ ] Debounce de 300ms na validação de email (não valida a cada tecla)
- [ ] Transições suaves entre telas (fade in/out)
- [ ] Sem janks ou travamentos visuais

---

## ✅ Testes de Integração

### APIs e Supabase

- [ ] Request para `POST /auth/v1/token` retorna em < 1s (p95)
- [ ] Response segue schema OpenAPI: access_token, refresh_token, user
- [ ] Token JWT tem payload correto (sub=user_id, email, role, exp)
- [ ] Logout invalida refresh token no servidor (verificar DB)
- [ ] RLS policies impedem acesso não autorizado a `team_members` table

### Eventos de Domínio

- [ ] Evento `UserLoggedIn` é disparado ao login (verificar logs mock)
- [ ] Evento `UserLoggedOut` é disparado ao logout
- [ ] Evento `LoginAttemptFailed` é disparado após 5 tentativas (verificar logs)

### Email (Recuperação de Senha)

- [ ] Email de recuperação enviado via Supabase Email Service
- [ ] Link de recuperação válido por 1 hora (verificar expiração)
- [ ] Token de recuperação único e não reutilizável

---

## ✅ Testes de Regressão

### Features Relacionadas

- [ ] US-002 (Cadastro de Membros) ainda funciona
- [ ] US-003 (Edição de Perfil) ainda funciona
- [ ] Rotas protegidas continuam redirecionando para `/login`

### Testes Automatizados

- [ ] Unit tests passam (coverage ≥ 80%)
  - [ ] `LoginForm.test.jsx`
  - [ ] `useAuth.test.js`
- [ ] Integration tests passam
  - [ ] `auth.integration.test.js`
- [ ] Lint sem erros (`npm run lint`)
- [ ] Build sem warnings (`npm run build`)

---

## ✅ Testes de Performance

### Métricas Web Vitals (Lighthouse)

- [ ] **LCP (Largest Contentful Paint):** < 2.5s (campo email visível)
- [ ] **FID (First Input Delay):** < 100ms (responsividade do campo)
- [ ] **CLS (Cumulative Layout Shift):** < 0.1 (sem reflows)
- [ ] **Performance Score:** ≥ 90

### Tempos de Resposta

- [ ] Login (submit → response): < 1s
- [ ] Redirecionamento (/login → /dashboard): < 500ms
- [ ] Tempo total (submit → dashboard renderizado): < 2s
- [ ] Token refresh (background): < 300ms

### Carga

- [ ] 100 logins simultâneos sem degradação (teste de carga)
- [ ] Rate limiting funciona (5 req/min por IP)

---

## ✅ Testes de Compatibilidade

### Browsers Desktop

- [ ] Chrome 120+ (últimas 2 versões)
- [ ] Firefox 121+ (últimas 2 versões)
- [ ] Safari 17+ (últimas 2 versões)
- [ ] Edge 120+ (últimas 2 versões)

### Browsers Mobile

- [ ] Mobile Safari iOS 16+ (iPhone 12, 13, 14)
- [ ] Chrome Android 120+ (Samsung Galaxy S21+)
- [ ] Samsung Internet (últimas 2 versões)

### Dispositivos Testados

- [ ] iPhone 14 Pro (390x844) - iOS 17
- [ ] iPhone SE (375x667) - iOS 16
- [ ] Samsung Galaxy S23 (360x800) - Android 13
- [ ] iPad Air (820x1180) - iPadOS 17

---

## ✅ Testes Mobile Específicos

### Teclado Virtual

- [ ] Teclado virtual não sobrepõe botão "Entrar"
- [ ] Viewport ajusta quando teclado aparece (scroll automático)
- [ ] Campo focado permanece visível acima do teclado
- [ ] Botão "Entrar" acessível sem fechar teclado

### Touch e Gestures

- [ ] Botões têm área mínima de toque de 44x44px
- [ ] Toque no campo "Email" abre teclado com @ disponível
- [ ] Toque no campo "Senha" abre teclado e esconde caracteres
- [ ] Sem double-tap zoom (meta viewport configurado)

### Conexão Móvel

- [ ] Login funciona em 4G (latência ~100ms)
- [ ] Login funciona em 3G (latência ~500ms)
- [ ] Timeout configurado para 10s (conexões lentas)
- [ ] Mensagem de erro clara se timeout

---

## ✅ Testes de Deploy

### Staging

- [ ] Deploy em staging via CI/CD (GitHub Actions)
- [ ] Smoke tests passam (login + logout)
- [ ] Environment variables configuradas:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Health check endpoint retorna 200: `/api/health`

### Production

- [ ] Deploy em produção via Vercel (blue-green)
- [ ] Rollback plan documentado e testado (revert commit)
- [ ] Monitoring ativo:
  - [ ] Sentry (error tracking) configurado
  - [ ] Vercel Analytics (performance) ativo
  - [ ] Supabase Dashboard (DB metrics) monitorando
- [ ] HTTPS forçado (redirect http → https)
- [ ] Health check endpoint retorna 200

---

## 📝 Notas e Observações

[Espaço para anotações durante testes, bugs encontrados, melhorias sugeridas]

**Bugs Encontrados:**
- [ ] Bug #1: [descrição]
- [ ] Bug #2: [descrição]

**Melhorias Sugeridas:**
- [ ] Melhoria #1: [descrição]
- [ ] Melhoria #2: [descrição]

---

## ✅ Sign-off

- [ ] **Product Owner:** Aprovado - Critérios de aceitação atendidos
- [ ] **QA Lead:** Aprovado - Todos os testes passaram
- [ ] **Tech Lead:** Aprovado - Código segue padrões ARCHITECTURE-DECISIONS.md

**Assinaturas:**
- PO: __________________ Data: __/__/____
- QA: __________________ Data: __/__/____
- Tech: ________________ Data: __/__/____

---

## ✅ Definição de Pronto (DoD) - Validação Final

- [ ] Todos os critérios de aceitação (story.md) atendidos
- [ ] Todos os cenários BDD (scenarios.feature) passando
- [ ] Todos os testes de aceitação (este checklist) validados
- [ ] Contrato API (contract.yaml) implementado corretamente
- [ ] Code review aprovado (1 senior + 1 peer)
- [ ] Testes automatizados passando (coverage ≥80%)
- [ ] Deploy em staging testado por QA
- [ ] Deploy em production concluído
- [ ] Post-deployment validation completa
- [ ] Documentação atualizada (se aplicável)

---

**Status Final:** [ ] ✅ APROVADO | [ ] ❌ REQUER AJUSTES | [ ] ⏸️ BLOQUEADO

**Bloqueadores (se aplicável):**
- [ ] [Bloqueador #1: descrição]

**Próximos Passos:**
- [ ] Merge para `develop`
- [ ] Deploy em staging
- [ ] QA final em staging
- [ ] Merge para `main`
- [ ] Deploy em produção
- [ ] Post-deployment validation (smoke tests)
- [ ] Monitorar métricas por 24h (Sentry, Analytics)
- [ ] Fechar ticket US-001 no backlog

---

**Última atualização:** [data]  
**Responsável QA:** [nome]
