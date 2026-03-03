# US-016: Custom Hooks de Infraestrutura

**Como** Desenvolvedor Frontend  
**Quero** ter custom hooks reutilizáveis (useAuth, useLocalStorage, useDebounce, useMediaQuery)  
**Para que** eu possa encapsular lógica comum e reutilizar em múltiplos componentes

**Bounded Context:** User Management (Generic - Hooks Library)  
**Prioridade:** P0 - CRÍTICO  
**Estimativa:** 5 pontos  
**Sprint:** Sprint 1

---

## Critérios de Aceitação

1. ✅ `useAuth()` - retorna user, signIn, signOut, isLoading (integração com Supabase Auth)
2. ✅ `useLocalStorage(key, initialValue)` - sincroniza state com localStorage
3. ✅ `useDebounce(value, delay)` - debounce para inputs (search, filtros)
4. ✅ `useMediaQuery(query)` - detecta breakpoints (mobile, tablet, desktop)
5. ✅ `useOnClickOutside(ref, handler)` - fecha modals/dropdowns ao clicar fora
6. ✅ `useAsync(asyncFn)` - gerencia loading, error, data de promises
7. ✅ Cada hook com TypeScript generics quando aplicável
8. ✅ Testes unitários com @testing-library/react-hooks (coverage ≥ 80%)

---

## Regras de Negócio

- useAuth deve cachear user em sessionStorage (evitar re-fetch)
- useLocalStorage deve sincronizar entre tabs (storage event)
- useDebounce delay padrão: 300ms (UX search)
- useMediaQuery deve usar matchMedia (performance)
- useAsync deve cancelar promise se component unmount (cleanup)

---

## Eventos de Domínio

| Evento | Quando Disparar | Ouvintes | Ação |
|--------|----------------|----------|------|
| `UserSignedIn` | useAuth().signIn() bem-sucedido | Analytics Context (P2) | Registrar login |
| `UserSignedOut` | useAuth().signOut() executado | Analytics Context (P2) | Registrar logout |

---

## Dependências

### Técnicas
- [ ] Supabase Client configurado
- [ ] @testing-library/react-hooks instalado
- [ ] TypeScript configurado (strict mode)

### User Stories
- **US-001:** Autenticação (Supabase Auth setup)

---

## Definição de Pronto (DoD)

- [ ] 6 hooks implementados (useAuth, useLocalStorage, useDebounce, useMediaQuery, useOnClickOutside, useAsync)
- [ ] TypeScript com generics tipados corretamente
- [ ] Testes unitários (coverage >80%)
- [ ] Documentação inline (JSDoc com exemplos)
- [ ] Cleanup correto (evitar memory leaks)
- [ ] Code review aprovado
- [ ] README.md com exemplos de uso

---

## Referências

- **Contract API:** [`contract.yaml`](./contract.yaml)
- **BDD Scenarios:** [`scenarios.feature`](./scenarios.feature)
- **Testes de Aceitação:** [`acceptance-tests.md`](./acceptance-tests.md)
- **DDD-GUIDE:** [`docs/summaries/ddd-summary.md`](../../summaries/ddd-summary.md)
- **Architecture:** [`docs/summaries/arch-decisions-summary.md`](../../summaries/arch-decisions-summary.md)

---

## Notas Adicionais

**Exemplo de uso:**

```typescript
// useAuth hook
const { user, signIn, signOut, isLoading } = useAuth()

// useLocalStorage hook
const [theme, setTheme] = useLocalStorage('theme', 'light')

// useDebounce hook
const [search, setSearch] = useState('')
const debouncedSearch = useDebounce(search, 300)

// useMediaQuery hook
const isMobile = useMediaQuery('(max-width: 768px)')

// useOnClickOutside hook
const ref = useRef()
useOnClickOutside(ref, () => setIsOpen(false))

// useAsync hook
const { data, error, isLoading } = useAsync(() => fetchEvents())
```

---

**Criado em:** 3 de Março de 2026  
**Responsável:** Frontend Developer Agent
