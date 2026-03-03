# US-017: Services Layer (authService, storageService, apiClient)

**Como** Desenvolvedor Frontend  
**Quero** ter services encapsulados (authService, storageService, apiClient)  
**Para que** eu possa isolar lógica de infraestrutura e facilitar testes

**Bounded Context:** User Management (Generic - Infrastructure)  
**Prioridade:** P0 - CRÍTICO  
**Estimativa:** 5 pontos  
**Sprint:** Sprint 1

---

## Critérios de Aceitação

1. ✅ `authService` - signIn, signOut, getUser, refreshToken (integração Supabase Auth)
2. ✅ `storageService` - get, set, remove, clear (abstração de localStorage/sessionStorage)
3. ✅ `apiClient` - GET, POST, PATCH, DELETE com interceptors (auth header, error handling)
4. ✅ `apiClient` com retry automático (3 tentativas, exponential backoff)
5. ✅ `apiClient` com timeout configurável (default: 30s)
6. ✅ `authService` com refresh token automático (quando token expira)
7. ✅ Dependency Injection: services registrados em `src/config/container.ts`
8. ✅ Testes unitários com mocks (coverage ≥ 80%)

---

## Regras de Negócio

- authService deve cachear token em sessionStorage (não expor via estado global)
- apiClient deve adicionar `Authorization: Bearer {token}` automaticamente
- Retry apenas em erros 5xx (não em 4xx - client errors)
- Timeout deve abortar request e retornar erro customizado
- storageService deve tratar erro de quota excedida (localStorage full)
- Refresh token automático deve ser transparente (user não percebe)

---

## Eventos de Domínio

| Evento | Quando Disparar | Ouvintes | Ação |
|--------|----------------|----------|------|
| `AuthTokenRefreshed` | Token expirado e renovado automaticamente | Analytics Context (P2) | Registrar evento de sessão ativa |
| `ApiRequestFailed` | Request falha após 3 retries | Error Tracking (P2) | Enviar erro para Sentry |

---

## Dependências

### Técnicas
- [ ] Supabase Client configurado
- [ ] Axios ou Fetch API configurado
- [ ] Composition Root (container.ts) criado

### User Stories
- **US-001:** Autenticação (Supabase Auth setup)

---

## Definição de Pronto (DoD)

- [ ] 3 services implementados (authService, storageService, apiClient)
- [ ] Dependency Injection configurado (container.ts)
- [ ] Interceptors implementados (auth header, error handling)
- [ ] Retry com exponential backoff (3 tentativas)
- [ ] Testes unitários com mocks (coverage >80%)
- [ ] Documentação inline (JSDoc)
- [ ] Code review aprovado
- [ ] Exemplo de uso em README.md

---

## Referências

- **Contract API:** [`contract.yaml`](./contract.yaml)
- **BDD Scenarios:** [`scenarios.feature`](./scenarios.feature)
- **Testes de Aceitação:** [`acceptance-tests.md`](./acceptance-tests.md)
- **DDD-GUIDE:** [`docs/summaries/ddd-summary.md`](../../summaries/ddd-summary.md)
- **Architecture:** [`docs/summaries/arch-decisions-summary.md`](../../summaries/arch-decisions-summary.md)

---

## Notas Adicionais

**Composition Root (Dependency Injection):**

```typescript
// src/config/container.ts
import { SupabaseClient } from '@supabase/supabase-js'
import { AuthService } from '@/services/authService'
import { ApiClient } from '@/services/apiClient'
import { StorageService } from '@/services/storageService'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const storageService = new StorageService(window.localStorage)
const authService = new AuthService(supabase, storageService)
const apiClient = new ApiClient(authService)

export { authService, apiClient, storageService }
```

**Uso em componentes:**

```typescript
// src/features/auth/hooks/useAuth.ts
import { authService } from '@/config/container'

export function useAuth() {
  const signIn = (email: string, password: string) => {
    return authService.signIn(email, password)
  }
  
  return { signIn }
}
```

**Testes com mocks:**

```typescript
// authService.test.ts
const mockSupabase = {
  auth: {
    signInWithPassword: jest.fn()
  }
}

const authService = new AuthService(mockSupabase as any, mockStorage)
```

---

**Criado em:** 3 de Março de 2026  
**Responsável:** Frontend Developer Agent
