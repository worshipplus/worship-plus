# US-001: Autenticação Básica

**Como** usuário registrado  
**Quero** fazer login com email e senha  
**Para que** eu possa acessar o sistema de forma segura

**Bounded Context:** User Management (Generic)  
**Prioridade:** P0 - CRÍTICO  
**Estimativa:** 3 pontos  
**Sprint:** Sprint 1

---

## Critérios de Aceitação

1. ✅ Tela de login com campos email e senha
2. ✅ Validação client-side (email válido, senha ≥8 caracteres)
3. ✅ Integração com Supabase Auth funcional
4. ✅ Redirecionamento para `/dashboard` após login com sucesso
5. ✅ Mensagens de erro claras:
   - "Email ou senha incorretos" (credenciais inválidas)
   - "Conta bloqueada. Tente novamente em 15 minutos" (múltiplas tentativas)
   - "Email não encontrado" (usuário não cadastrado)
6. ✅ Link "Esqueci minha senha" funcional (envia email de recuperação)
7. ✅ Botão "Logout" limpa sessão e redireciona para `/login`
8. ✅ Sessão persiste após reload da página (até expirar)

---

## Regras de Negócio

- **Rate Limiting:** Após 5 tentativas falhas, bloquear login por 15 minutos
- **Sessão:** Token JWT expira em 7 dias (refresh token renova automaticamente)
- **Senha:** Mínimo 8 caracteres (validado no cliente e servidor via RLS)
- **Email:** Único no sistema (constraint no banco)
- **2FA:** Não implementado no MVP (P1 - futuro)

---

## Eventos de Domínio

| Evento | Quando Disparar | Ouvintes | Ação |
|--------|----------------|----------|------|
| `UserLoggedIn` | Login bem-sucedido | Analytics Context (P2) | Registrar evento de login |
| `UserLoggedOut` | Logout explícito | Analytics Context (P2) | Registrar duração de sessão |
| `LoginAttemptFailed` | Credenciais inválidas | Security Context (P2) | Detectar tentativas de brute-force |

---

## Dependências

### Técnicas
- [x] Supabase Auth configurado no projeto
- [x] Tabela `team_members` criada (migration aplicada)
- [ ] RLS policy `authenticated users only` em tabelas sensíveis
- [ ] Environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)

### User Stories
- **US-002:** Cadastro de Membros (dependência circular - admin cria membros manualmente antes do login)

---

## Definição de Pronto (DoD)

- [ ] Código implementado seguindo DDD (User Management context)
- [ ] Componente `LoginForm.jsx` criado e testado
- [ ] Hook `useAuth` criado (abstração de Supabase Auth)
- [ ] Testes unitários escritos (coverage >80%)
  - [ ] `LoginForm.test.jsx` (componente)
  - [ ] `useAuth.test.js` (hook)
- [ ] Testes de integração para fluxo crítico (login end-to-end)
- [ ] Contract API validado (Supabase Auth segue OpenAPI padrão)
- [ ] Scenarios BDD validados (todos os cenários passam)
- [ ] Code review aprovado (checklist ARCHITECTURE-DECISIONS.md)
- [ ] Deployment em staging testado
- [ ] Acessibilidade validada (navegação por teclado, ARIA labels)
- [ ] Responsividade validada (mobile 360px até desktop 1440px)

---

## Referências

- **Contract API:** [`contract.yaml`](./contract.yaml)
- **BDD Scenarios:** [`scenarios.feature`](./scenarios.feature)
- **Testes de Aceitação:** [`acceptance-tests.md`](./acceptance-tests.md)
- **DDD-GUIDE:** [`docs/summaries/ddd-summary.md`](../../summaries/ddd-summary.md#user-management-context)
- **Architecture:** [`docs/summaries/arch-decisions-summary.md`](../../summaries/arch-decisions-summary.md)
- **Supabase Auth Docs:** https://supabase.com/docs/guides/auth

---

## Notas Adicionais

### Design/UX
- Tela de login deve ser **mobile-first** (maioria dos usuários acessa via celular)
- Campo email com autofocus ao carregar página
- Botão "Entrar" desabilitado enquanto processa (prevenir double-submit)
- Loading spinner durante autenticação
- Link para "Criar conta" não está no MVP (cadastro manual por Admin)

### Segurança
- Senha não deve aparecer em plain text (usar `type="password"`)
- Token JWT armazenado em httpOnly cookie (não localStorage - XSS prevention)
- HTTPS obrigatório em produção
- Rate limiting configurado via Supabase Dashboard (5 req/min por IP)

### Performance
- Lazy loading de componentes não-críticos
- Debounce de 300ms na validação de email (evitar validar a cada tecla)

---

**Criado em:** 3 de Março de 2026  
**Atualizado em:** 3 de Março de 2026  
**Responsável:** Product Manager Agent
