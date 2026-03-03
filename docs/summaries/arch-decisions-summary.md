# Architecture Decisions Summary — Worship+

**Versão:** 1.0  
**Data:** 3 de Março de 2026  
**Propósito:** Sumário de decisões arquiteturais críticas para AI Agents  
**Tamanho:** ~3KB (vs 50KB do ARCHITECTURE-DECISIONS completo)

---

## 1. Filosofia de Desenvolvimento

### 1.1 Princípios SOLID

**SRP (Single Responsibility Principle)**
```javascript
// ❌ Componente com múltiplas responsabilidades
function EventCard({ event }) {
  const [loading, setLoading] = useState(false);
  const fetchDetails = async () => { /* API call */ };
  const formatDate = (date) => { /* formatting */ };
  return <div>{/* render */}</div>;
}

// ✅ Separação de responsabilidades
function EventCard({ event }) {
  const { loading, fetchDetails } = useEventDetails(event.id);
  const formattedDate = useFormattedDate(event.date);
  return <EventCardView event={event} loading={loading} />;
}
```

**DIP (Dependency Inversion Principle)**
```javascript
// ✅ Depender de abstrações (interfaces), não implementações
// useRepository hook abstrai Supabase
const eventRepository = useRepository('events');
const events = await eventRepository.findAll();

// Fácil trocar Supabase por outro backend no futuro
```

**OCP (Open/Closed Principle)**
```javascript
// ✅ Extensível via hooks, não modificando componente base
function EventList() {
  const events = useEvents();
  const filters = useEventFilters(); // Plugin adiciona filtros
  const sorting = useEventSorting(); // Plugin adiciona ordenação
  return <List items={filters(sorting(events))} />;
}
```

### 1.2 KISS > DRY (quando há trade-off)

**Preferir duplicação simples a abstração complexa:**
```javascript
// ✅ KISS: Duplicação aceitável se clara
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // ...
}

function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  // ...
}

// ❌ DRY over-engineered: Abstração dificulta compreensão
function UniversalAuthForm({ mode, fields, validators, ... }) {
  // 200 linhas de lógica condicional complexa
}
```

---

## 2. Estrutura de Pastas (Feature-Based)

### Frontend (React)
```
src/
├── features/              # Agrupamento por feature (não por tipo)
│   ├── auth/
│   │   ├── components/    # LoginForm, SignupForm
│   │   ├── hooks/         # useAuth, useSession
│   │   ├── services/      # authService.js
│   │   └── index.js       # Public API
│   │
│   ├── events/
│   │   ├── components/    # EventCard, EventForm
│   │   ├── hooks/         # useEvents, useEventDetails
│   │   ├── services/      # eventRepository.js
│   │   └── index.js
│   │
│   └── team/
│       ├── components/
│       ├── hooks/
│       └── services/
│
├── shared/                # Componentes reutilizáveis
│   ├── components/        # Button, Modal, Input
│   ├── hooks/             # useForm, usePagination
│   └── utils/             # formatDate, validators
│
└── config/                # Configurações globais
    ├── supabase.js
    └── constants.js
```

### Backend (NestJS - P2)
```
src/
├── worship/               # Bounded Context
│   ├── domain/            # Entidades, Value Objects
│   │   ├── event.entity.ts
│   │   └── event.repository.interface.ts
│   ├── application/       # Use Cases
│   │   └── create-event.usecase.ts
│   ├── infrastructure/    # Implementações concretas
│   │   └── event.repository.impl.ts
│   └── presentation/      # Controllers
│       └── event.controller.ts
│
├── team/
│   └── ... (mesma estrutura)
│
└── shared/
    ├── domain/            # Base classes
    └── infrastructure/    # DB, Auth, etc
```

---

## 3. Design Patterns (Frontend)

### 3.1 Custom Hooks (Strategy Pattern)
```javascript
// Abstração de lógica reutilizável
function useRepository(tableName) {
  const supabase = useSupabase();
  
  return {
    findAll: () => supabase.from(tableName).select('*'),
    findById: (id) => supabase.from(tableName).select('*').eq('id', id),
    create: (data) => supabase.from(tableName).insert(data),
    update: (id, data) => supabase.from(tableName).update(data).eq('id', id),
    delete: (id) => supabase.from(tableName).delete().eq('id', id),
  };
}

// Uso em qualquer feature
const eventRepo = useRepository('events');
const teamRepo = useRepository('team_members');
```

### 3.2 Compound Components
```javascript
// API flexível e composável
<EventCard>
  <EventCard.Image src={event.imageUrl} />
  <EventCard.Title>{event.title}</EventCard.Title>
  <EventCard.Date date={event.date} />
  <EventCard.Actions>
    <Button>Editar</Button>
    <Button>Publicar</Button>
  </EventCard.Actions>
</EventCard>
```

### 3.3 Repository Pattern (Backend)
```typescript
// Interface (domínio)
interface EventRepository {
  findAll(): Promise<Event[]>;
  findById(id: string): Promise<Event | null>;
  save(event: Event): Promise<void>;
}

// Implementação (infraestrutura)
class SupabaseEventRepository implements EventRepository {
  async findAll() { /* Supabase query */ }
  async findById(id: string) { /* ... */ }
  async save(event: Event) { /* ... */ }
}

// Use Case (aplicação)
class CreateEventUseCase {
  constructor(private eventRepo: EventRepository) {}
  
  async execute(data: CreateEventDto) {
    const event = Event.create(data); // Domain logic
    await this.eventRepo.save(event);
    return event;
  }
}
```

---

## 4. Testes (Coverage: 80% mínimo)

### Unit Tests (Jest/Vitest)
```javascript
// Testar comportamento, não implementação
describe('useEvents', () => {
  it('should return events sorted by date', async () => {
    const { result } = renderHook(() => useEvents());
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    const events = result.current.events;
    expect(events[0].date).toBeLessThan(events[1].date);
  });
});
```

### Integration Tests (React Testing Library)
```javascript
// Testar fluxos críticos end-to-end
test('user can create an event', async () => {
  render(<EventForm />);
  
  fireEvent.change(screen.getByLabelText('Título'), {
    target: { value: 'Culto Domingo' }
  });
  fireEvent.change(screen.getByLabelText('Data'), {
    target: { value: '2026-03-10' }
  });
  fireEvent.click(screen.getByText('Criar Evento'));
  
  await waitFor(() => {
    expect(screen.getByText('Evento criado com sucesso!')).toBeInTheDocument();
  });
});
```

---

## 5. Code Review Checklist

**Antes de aprovar PR:**

- [ ] Código segue SOLID?
- [ ] Testes unitários cobrem casos críticos?
- [ ] Nomenclatura usa linguagem úbiqua (DDD-GUIDE)?
- [ ] Não há lógica de negócio em componentes de UI?
- [ ] Commits seguem Conventional Commits?
- [ ] Não há código comentado (remover ou explicar)
- [ ] Acessibilidade (ARIA labels, tab index)?
- [ ] Performance (evita re-renders desnecessários)?

---

## 6. Conventional Commits (Obrigatório)

```bash
# Estrutura
<type>(<scope>): <description> [<ticket>]

<body (opcional)>

<footer (opcional)>

# Tipos
feat:     Nova funcionalidade
fix:      Correção de bug
docs:     Documentação
style:    Formatação (não afeta lógica)
refactor: Refatoração
test:     Testes
chore:    Build, CI, deps

# Exemplos
feat(worship): adiciona criação de eventos [US-004]
fix(team): corrige validação de email duplicado
docs(adr): documenta escolha de Supabase vs NestJS
test(worship): aumenta coverage do EventRepository para 85%
refactor(auth): extrai hook useAuth para feature/auth/
```

---

## 7. Performance Guidelines

### Frontend
- **Bundle size:** <250KB (gzipped)
- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <3s
- **Lighthouse score:** >90

### Backend (P2)
- **API response:** <200ms (p95)
- **Database queries:** <50ms (p95)
- **Connection pool:** 10-50 (ajustar por carga)

### Estratégias
- Lazy loading de rotas
- Code splitting por feature
- Memoization (React.memo, useMemo)
- Debounce em inputs de busca
- Virtualização para listas longas (>100 itens)

---

**Para detalhes completos, consultar:** [`docs/architecture/ARCHITECTURE-DECISIONS.md`](../architecture/ARCHITECTURE-DECISIONS.md)
