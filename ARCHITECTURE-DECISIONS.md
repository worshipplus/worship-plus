# Architecture Decisions — Worship+

**Versão:** 1.0  
**Data:** 2 de Março de 2026  
**Status:** Living Document  

---

## Índice

1. [BFF (Backend For Frontend)](#1-bff-backend-for-frontend)
2. [Filosofia de Desenvolvimento](#2-filosofia-de-desenvolvimento)
3. [Padrões Arquiteturais](#3-padrões-arquiteturais)
4. [Dependency Injection](#4-dependency-injection)

---

## 1. BFF (Backend For Frontend)

### 1.1 Contexto

**Pergunta:** Faz sentido uma camada BFF entre frontend e Supabase?

### 1.2 Análise Técnica

#### ❌ **BFF NÃO é necessário para MVP** (P0-P1)

**Razões:**

1. **Supabase já é um BFF otimizado**
   - Row-Level Security (RLS) nativo
   - Realtime subscriptions otimizadas
   - Client SDK com retry/cache automático
   - Auto-generated REST API tipada

2. **Overhead desnecessário no MVP**
   - +1 camada = +1 ponto de falha
   - +latência (frontend → BFF → Supabase)
   - +complexidade de deploy/monitoramento
   - +código para manter

3. **Regras de negócio simples no MVP**
   - Validações podem estar em RLS policies
   - Agregações são diretas (SQL/Postgres Functions)
   - Não há orquestração complexa de múltiplos serviços

4. **Time pequeno (2 devs)**
   - BFF exige +1 repositório, +1 deploy, +1 monitoramento
   - Foco deve estar em features, não infra

#### ✅ **Quando BFF SERIA necessário (Futuro P2/P3)?**

**Cenários válidos:**

1. **Múltiplos clientes com necessidades diferentes**
   ```
   Mobile App (iOS/Android) → BFF Mobile → Supabase
   Web App                  → BFF Web    → Supabase
   Admin Panel              → BFF Admin  → Supabase
   ```
   - BFF Mobile: payload otimizado, menos campos
   - BFF Web: dados completos
   - BFF Admin: queries complexas agregadas

2. **Orquestração de múltiplos backends**
   ```
   Frontend → BFF → Supabase (auth/db)
                 ↘ AWS S3 (media)
                 ↘ Stripe (payments)
                 ↘ SendGrid (email)
   ```
   - BFF coordena chamadas paralelas
   - BFF faz retry/fallback entre serviços

3. **Regras de negócio complexas**
   - Cálculos pesados (relatórios, analytics)
   - Workflows com múltiplas etapas
   - Validações que exigem múltiplas queries

4. **Rate limiting customizado**
   - Limitar chamadas por usuário/tenant
   - Throttling diferenciado por plano

5. **Cache avançado**
   - Redis para queries frequentes
   - Invalidação de cache complexa

### 1.3 Decisão: Arquitetura Progressive

**MVP (P0-P1):** Frontend → Supabase (direto)

```
┌─────────────┐
│   React     │
│   (Vite)    │
└──────┬──────┘
       │ supabase-js SDK
       ↓
┌─────────────┐
│  Supabase   │ ← Row-Level Security (RLS)
│  Postgres   │ ← Postgres Functions (regras complexas)
└─────────────┘
```

**Vantagens:**
- ✅ Latência mínima (1 hop)
- ✅ Menos código para manter
- ✅ Realtime "de graça"
- ✅ Tipagem automática (Supabase CLI)

---

**Futuro (P2/P3 - Se necessário):** Adicionar BFF incremental

```
┌─────────────┐
│   React     │
│   (Vite)    │
└──────┬──────┘
       │ REST/GraphQL
       ↓
┌─────────────┐
│     BFF     │ ← NestJS ou Fastify
│  (Node.js)  │ ← Decorators, DI, Middleware
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Supabase   │
│  Postgres   │
└─────────────┘
```

**Sinais para adicionar BFF:**

- [ ] Múltiplos clientes (mobile app nativo)
- [ ] Orquestração de 3+ serviços externos
- [ ] Regras de negócio que não cabem em Postgres Functions
- [ ] Cache Redis necessário
- [ ] Rate limiting customizado

### 1.4 Alternativa: Edge Functions (Supabase)

**Meio-termo:** Usar Supabase Edge Functions (Deno) para lógica específica

```typescript
// supabase/functions/generate-event-zip/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { eventId } = await req.json()
  
  // Buscar músicas do evento
  const songs = await supabase
    .from('event_setlists')
    .select('song_id, songs(title, youtubeUrl)')
    .eq('event_id', eventId)
  
  // Gerar ZIP ou orquestrar S3
  const zipUrl = await generateZip(songs)
  
  return new Response(JSON.stringify({ zipUrl }))
})
```

**Quando usar Edge Functions:**
- Processamento assíncrono (transcodificação, ZIP)
- Webhooks (Stripe, SendGrid)
- Cron jobs (archival de mídia)
- Validações complexas que não cabem em RLS

---

## 2. Filosofia de Desenvolvimento

### 2.1 Princípios Fundamentais

#### **2.1.1 Escalabilidade com Pragmatismo**

> "Construa para hoje, arquitete para amanhã, mas não implemente amanhã hoje."

**Aplicação:**
- ✅ Use abstrações que facilitam evolução (interfaces, DI)
- ❌ Não implemente microserviços antes de precisar
- ✅ Escreva código desacoplado (bounded contexts)
- ❌ Não adicione cache/queue sem necessidade comprovada

**Regra de Ouro:**
```
Se uma funcionalidade pode ser implementada em 2 horas com solução simples
ou 2 dias com solução "escalável", escolha a simples.

EXCETO se você SABE que precisará escalar (ex: upload de arquivos grandes).
```

---

#### **2.1.2 Carga Cognitiva Controlada**

**Objetivo:** Código que qualquer dev entenda em 5 minutos.

**Estratégias:**

1. **Abstrair complexidade, não escondê-la**
   ```typescript
   // ❌ Má abstração (esconde muita mágica)
   @AutoSave @Validate @Cache @Retry
   async updateEvent(data: EventDTO) { ... }
   
   // ✅ Boa abstração (intenção clara)
   async updateEvent(data: EventDTO) {
     await this.validator.validate(data)
     const event = await this.repository.update(data)
     await this.cache.invalidate(`event:${event.id}`)
     return event
   }
   ```

2. **Preferir composição explícita**
   ```typescript
   // ✅ Fluxo visível
   const result = await pipe(
     getUserInput,
     validateAvailability,
     checkConflicts,
     assignMember,
     notifyTeam
   )(eventId, memberId)
   ```

3. **Nomenclatura que explica intenção**
   ```typescript
   // ❌ Genérico
   processData()
   
   // ✅ Específico
   transcodifyWavToMp3()
   promoteMediaFromGlacier()
   generateEventZipWithSongs()
   ```

---

### 2.2 SOLID no Worship+

#### **2.2.1 Single Responsibility Principle (SRP)**

**Aplicação Frontend:**
```typescript
// ❌ Violação: componente faz TUDO
function EventForm() {
  const [data, setData] = useState()
  const validateForm = () => { /* validação */ }
  const fetchSongs = () => { /* busca API */ }
  const uploadFile = () => { /* upload S3 */ }
  const submitEvent = () => { /* salva DB */ }
  return <form>...</form>
}

// ✅ SRP: cada hook tem UMA responsabilidade
function EventForm() {
  const { data, setData } = useEventFormState()
  const { errors, validate } = useEventValidation(data)
  const { songs, loading } = useSongs()
  const { upload } = useFileUpload()
  const { submit, submitting } = useEventSubmit()
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

**Aplicação Backend:**
```typescript
// ✅ Cada classe tem UMA razão para mudar
class EventService {
  constructor(
    private repository: EventRepository,
    private validator: EventValidator,
    private notifier: EventNotifier
  ) {}
  
  async createEvent(data: CreateEventDTO) {
    await this.validator.validate(data)
    const event = await this.repository.create(data)
    await this.notifier.notifyOwner(event)
    return event
  }
}
```

---

#### **2.2.2 Open/Closed Principle (OCP)**

**Aplicação: Estratégias de Notificação**

```typescript
// ✅ Aberto para extensão, fechado para modificação
interface NotificationStrategy {
  send(recipient: string, message: string): Promise<void>
}

class EmailNotification implements NotificationStrategy {
  async send(recipient: string, message: string) {
    await sendGrid.send({ to: recipient, body: message })
  }
}

class PushNotification implements NotificationStrategy {
  async send(recipient: string, message: string) {
    await firebase.sendPush({ token: recipient, body: message })
  }
}

class WhatsAppNotification implements NotificationStrategy {
  async send(recipient: string, message: string) {
    await twilio.sendWhatsApp({ to: recipient, body: message })
  }
}

// Uso
class NotificationService {
  constructor(private strategies: NotificationStrategy[]) {}
  
  async notifyMember(member: TeamMember, message: string) {
    await Promise.all(
      this.strategies.map(s => s.send(member.contact, message))
    )
  }
}
```

---

#### **2.2.3 Liskov Substitution Principle (LSP)**

**Aplicação: Storage Providers**

```typescript
// ✅ Qualquer implementação pode substituir outra
interface StorageProvider {
  upload(file: File, path: string): Promise<string>
  download(path: string): Promise<Blob>
  delete(path: string): Promise<void>
}

class S3StorageProvider implements StorageProvider {
  async upload(file: File, path: string) {
    const url = await s3.putObject({ Bucket: 'worship-media', Key: path, Body: file })
    return url
  }
  // ... outros métodos
}

class LocalStorageProvider implements StorageProvider {
  async upload(file: File, path: string) {
    await fs.writeFile(`./uploads/${path}`, file)
    return `http://localhost:3000/uploads/${path}`
  }
  // ... outros métodos
}

// ✅ Service funciona com QUALQUER implementação
class MediaService {
  constructor(private storage: StorageProvider) {}
  
  async uploadVS(file: File, songId: string) {
    const path = `songs/${songId}/vs.mp3`
    const url = await this.storage.upload(file, path) // funciona com S3 ou Local
    return url
  }
}
```

---

#### **2.2.4 Interface Segregation Principle (ISP)**

**Aplicação: Repositories**

```typescript
// ❌ Interface "gorda" (força implementações desnecessárias)
interface Repository {
  find(id: string): Promise<any>
  findAll(): Promise<any[]>
  create(data: any): Promise<any>
  update(id: string, data: any): Promise<any>
  delete(id: string): Promise<void>
  bulkCreate(data: any[]): Promise<any[]>
  bulkUpdate(data: any[]): Promise<any[]>
  bulkDelete(ids: string[]): Promise<void>
}

// ✅ Interfaces segregadas (cada classe implementa só o que precisa)
interface Readable<T> {
  find(id: string): Promise<T>
  findAll(): Promise<T[]>
}

interface Writable<T> {
  create(data: T): Promise<T>
  update(id: string, data: Partial<T>): Promise<T>
  delete(id: string): Promise<void>
}

interface BulkOperations<T> {
  bulkCreate(data: T[]): Promise<T[]>
  bulkDelete(ids: string[]): Promise<void>
}

// Uso específico
class EventRepository implements Readable<Event>, Writable<Event> {
  // Só implementa read + write (não precisa de bulk)
}

class AvailabilityRepository implements Readable<Availability>, BulkOperations<Availability> {
  // Só implementa read + bulk (update é via bulk apenas)
}
```

---

#### **2.2.5 Dependency Inversion Principle (DIP)**

**Aplicação: Service Layer**

```typescript
// ✅ Serviços dependem de abstrações (interfaces), não implementações

// Domain Layer (abstrações)
interface IEventRepository {
  create(event: Event): Promise<Event>
  findByOwner(ownerId: string): Promise<Event[]>
}

interface INotificationService {
  notifyEventPublished(event: Event): Promise<void>
}

// Application Layer (lógica de negócio)
class PublishEventUseCase {
  constructor(
    private eventRepo: IEventRepository, // ← Abstração
    private notifier: INotificationService // ← Abstração
  ) {}
  
  async execute(eventId: string) {
    const event = await this.eventRepo.findById(eventId)
    event.publish()
    await this.eventRepo.update(event)
    await this.notifier.notifyEventPublished(event)
  }
}

// Infrastructure Layer (implementações concretas)
class SupabaseEventRepository implements IEventRepository { ... }
class EmailNotificationService implements INotificationService { ... }

// Dependency Injection (composição)
const publishEvent = new PublishEventUseCase(
  new SupabaseEventRepository(supabase),
  new EmailNotificationService(sendGrid)
)
```

---

### 2.3 DRY (Don't Repeat Yourself)

#### **2.3.1 Abstrair Lógica Repetida**

**Frontend: Custom Hooks**

```typescript
// ❌ Repetição
function EventsView() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    setLoading(true)
    supabase.from('events').select('*')
      .then(res => setEvents(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [])
  
  return <div>...</div>
}

// ✅ DRY: Hook reutilizável
function useSupabaseQuery<T>(table: string, query: QueryBuilder) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    setLoading(true)
    query(supabase.from(table).select('*'))
      .then(res => setData(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [table])
  
  return { data, loading, error }
}

// Uso
function EventsView() {
  const { data: events, loading, error } = useSupabaseQuery<Event>(
    'events',
    q => q.eq('owner_id', userId).order('date', { ascending: true })
  )
  
  return <div>...</div>
}
```

**Backend: Base Repository**

```typescript
// ✅ DRY: Métodos comuns abstraídos
abstract class BaseRepository<T> {
  constructor(protected tableName: string, protected supabase: SupabaseClient) {}
  
  async findById(id: string): Promise<T | null> {
    const { data } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single()
    return data
  }
  
  async findAll(): Promise<T[]> {
    const { data } = await this.supabase.from(this.tableName).select('*')
    return data ?? []
  }
  
  async create(entity: Omit<T, 'id'>): Promise<T> {
    const { data } = await this.supabase.from(this.tableName).insert(entity).select().single()
    return data
  }
  
  // Métodos específicos são abstratos
  abstract findByOwner(ownerId: string): Promise<T[]>
}

// Uso
class EventRepository extends BaseRepository<Event> {
  constructor(supabase: SupabaseClient) {
    super('events', supabase)
  }
  
  async findByOwner(ownerId: string): Promise<Event[]> {
    const { data } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('owner_id', ownerId)
    return data ?? []
  }
}
```

---

### 2.4 KISS (Keep It Simple, Stupid)

#### **2.4.1 Simplicidade > Elegância**

```typescript
// ❌ "Elegante" mas complexo
const validateEvent = (event: Event) =>
  pipe(
    validateTitle,
    validateDate,
    validateOwner,
    validateSetlist
  )(event).fold(
    errors => left(errors),
    () => right(event)
  )

// ✅ KISS: Simples e claro
function validateEvent(event: Event): ValidationResult {
  const errors: string[] = []
  
  if (!event.title || event.title.length < 3) {
    errors.push('Título deve ter no mínimo 3 caracteres')
  }
  
  if (!event.date || event.date < new Date()) {
    errors.push('Data deve ser futura')
  }
  
  if (!event.ownerId) {
    errors.push('Evento deve ter um owner')
  }
  
  return errors.length > 0 ? { valid: false, errors } : { valid: true }
}
```

#### **2.4.2 Evitar Over-Engineering**

**Regra:** Se você está criando framework, está fazendo errado.

```typescript
// ❌ Over-engineered (framework caseiro)
class AbstractFactoryProxyObserverSingleton {
  private static instance: AbstractFactoryProxyObserverSingleton
  private observers: Map<string, Observer[]> = new Map()
  
  private constructor() {}
  
  static getInstance() { ... }
  registerObserver() { ... }
  notifyObservers() { ... }
  createProxy() { ... }
}

// ✅ KISS: Use ferramentas prontas
import EventEmitter from 'events'
const emitter = new EventEmitter()
emitter.on('eventPublished', notifyTeam)
emitter.emit('eventPublished', event)
```

---

### 2.5 Design Patterns Avançados

#### **2.5.1 Decorator Pattern (Autenticação/Autorização)**

**Backend: NestJS Decorators**

```typescript
// ✅ Decorator para autenticação
import { UseGuards, SetMetadata } from '@nestjs/common'

// Guard customizado
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest()
    return !!req.user
  }
}

// Guard de permissão
@Injectable()
export class OwnerOrAdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const eventId = req.params.eventId
    const event = await eventRepo.findById(eventId)
    
    return req.user.isAdmin || event.ownerId === req.user.id
  }
}

// Uso em controller
@Controller('events')
export class EventsController {
  
  @Get(':eventId')
  @UseGuards(AuthGuard) // ← Decorator
  async getEvent(@Param('eventId') id: string) {
    return this.eventsService.findById(id)
  }
  
  @Put(':eventId')
  @UseGuards(AuthGuard, OwnerOrAdminGuard) // ← Compose decorators
  async updateEvent(@Param('eventId') id: string, @Body() data: UpdateEventDTO) {
    return this.eventsService.update(id, data)
  }
}
```

**Frontend: HOC (Higher-Order Component)**

```typescript
// ✅ HOC para autenticação
function withAuth<P extends object>(Component: ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth()
    
    if (loading) return <LoadingSpinner />
    if (!user) return <Navigate to="/login" />
    
    return <Component {...props} />
  }
}

// Uso
const ProtectedEventForm = withAuth(EventForm)

// Ou com decorators (experimental)
@withAuth
@withOwnerCheck
class EventForm extends Component {
  render() { ... }
}
```

---

#### **2.5.2 Repository Pattern**

```typescript
// ✅ Abstração completa do data source
interface IEventRepository {
  create(event: CreateEventDTO): Promise<Event>
  findById(id: string): Promise<Event | null>
  findByOwner(ownerId: string): Promise<Event[]>
  update(id: string, data: Partial<Event>): Promise<Event>
  delete(id: string): Promise<void>
}

// Implementação Supabase
class SupabaseEventRepository implements IEventRepository {
  constructor(private supabase: SupabaseClient) {}
  
  async create(dto: CreateEventDTO): Promise<Event> {
    const { data, error } = await this.supabase
      .from('events')
      .insert(dto)
      .select()
      .single()
    
    if (error) throw new RepositoryError(error.message)
    return data
  }
  
  // ... outros métodos
}

// ✅ Service não conhece Supabase
class EventService {
  constructor(private eventRepo: IEventRepository) {}
  
  async createEvent(dto: CreateEventDTO) {
    // Poderia trocar Supabase por Postgres direto sem alterar aqui
    return this.eventRepo.create(dto)
  }
}
```

---

#### **2.5.3 Strategy Pattern (Media Processing)**

```typescript
// ✅ Diferentes estratégias de processamento
interface MediaProcessingStrategy {
  process(file: File): Promise<ProcessedMedia>
}

class ImageProcessingStrategy implements MediaProcessingStrategy {
  async process(file: File): Promise<ProcessedMedia> {
    const resized = await sharp(file.buffer)
      .resize(800, 600)
      .jpeg({ quality: 80 })
      .toBuffer()
    
    return { buffer: resized, mimeType: 'image/jpeg' }
  }
}

class AudioProcessingStrategy implements MediaProcessingStrategy {
  async process(file: File): Promise<ProcessedMedia> {
    const transcoded = await ffmpeg(file.buffer)
      .audioCodec('libmp3lame')
      .audioBitrate('256k')
      .toBuffer()
    
    return { buffer: transcoded, mimeType: 'audio/mp3' }
  }
}

// Factory para selecionar estratégia
class MediaProcessorFactory {
  static getProcessor(mimeType: string): MediaProcessingStrategy {
    if (mimeType.startsWith('image/')) return new ImageProcessingStrategy()
    if (mimeType.startsWith('audio/')) return new AudioProcessingStrategy()
    throw new Error('Unsupported media type')
  }
}

// Uso
const processor = MediaProcessorFactory.getProcessor(file.mimeType)
const processed = await processor.process(file)
```

---

#### **2.5.4 Observer Pattern (Domain Events)**

```typescript
// ✅ Event-driven architecture
interface DomainEvent {
  eventName: string
  occurredAt: Date
  data: any
}

class EventPublished implements DomainEvent {
  eventName = 'EventPublished'
  occurredAt = new Date()
  
  constructor(public data: { event: Event }) {}
}

// Event Bus
class EventBus {
  private handlers: Map<string, Array<(event: DomainEvent) => void>> = new Map()
  
  subscribe(eventName: string, handler: (event: DomainEvent) => void) {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, [])
    }
    this.handlers.get(eventName)!.push(handler)
  }
  
  publish(event: DomainEvent) {
    const handlers = this.handlers.get(event.eventName) ?? []
    handlers.forEach(handler => handler(event))
  }
}

// Handlers
const eventBus = new EventBus()

eventBus.subscribe('EventPublished', async (event: EventPublished) => {
  await notificationService.notifyTeam(event.data.event)
})

eventBus.subscribe('EventPublished', async (event: EventPublished) => {
  await mediaService.promoteVSToActive(event.data.event)
})

// Uso
class EventService {
  async publishEvent(eventId: string) {
    const event = await this.eventRepo.findById(eventId)
    event.publish()
    await this.eventRepo.update(event)
    
    // Dispara evento (handlers executam automaticamente)
    eventBus.publish(new EventPublished({ event }))
  }
}
```

---

### 2.6 Abstrações com Hooks (Frontend)

#### **2.6.1 Hooks Customizados para Lógica de Negócio**

```typescript
// ✅ Hook para disponibilidade
function useAvailability(memberId: string) {
  const [recurring, setRecurring] = useState<RecurringAvailability[]>([])
  const [overrides, setOverrides] = useState<DateOverride[]>([])
  const [loading, setLoading] = useState(false)
  
  const checkAvailability = useCallback((date: Date): boolean => {
    // Verifica override primeiro
    const override = overrides.find(o => isSameDay(o.date, date))
    if (override) return override.status === 'available'
    
    // Verifica recurring
    const dayOfWeek = date.getDay()
    const recurringRule = recurring.find(r => r.dayOfWeek === dayOfWeek)
    if (recurringRule) return recurringRule.status === 'available'
    
    // Default: disponível
    return true
  }, [recurring, overrides])
  
  const setRecurringAvailability = useCallback(async (
    dayOfWeek: number,
    status: 'available' | 'unavailable'
  ) => {
    await supabase.from('recurring_availability').upsert({
      member_id: memberId,
      day_of_week: dayOfWeek,
      status
    })
    // Atualiza estado local
  }, [memberId])
  
  return {
    recurring,
    overrides,
    loading,
    checkAvailability,
    setRecurringAvailability,
    addOverride: async (date: Date, status: string) => { ... }
  }
}

// Uso em componente
function MemberAvailabilityForm({ memberId }: Props) {
  const {
    recurring,
    checkAvailability,
    setRecurringAvailability
  } = useAvailability(memberId)
  
  const handleToggleDay = (dayOfWeek: number) => {
    const current = recurring.find(r => r.dayOfWeek === dayOfWeek)
    const newStatus = current?.status === 'available' ? 'unavailable' : 'available'
    setRecurringAvailability(dayOfWeek, newStatus)
  }
  
  return <WeeklyCalendar onToggle={handleToggleDay} />
}
```

---

#### **2.6.2 Hooks para Autenticação/Autorização**

```typescript
// ✅ Hook de autenticação
function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    
    return () => subscription.unsubscribe()
  }, [])
  
  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [])
  
  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])
  
  return { user, loading, signIn, signOut }
}

// ✅ Hook de autorização
function useOwnerOrAdmin(eventId: string) {
  const { user } = useAuth()
  const [canEdit, setCanEdit] = useState(false)
  
  useEffect(() => {
    if (!user) {
      setCanEdit(false)
      return
    }
    
    // Verifica se é admin
    if (user.role === 'admin') {
      setCanEdit(true)
      return
    }
    
    // Verifica se é owner do evento
    supabase
      .from('events')
      .select('owner_id')
      .eq('id', eventId)
      .single()
      .then(({ data }) => {
        setCanEdit(data?.owner_id === user.id)
      })
  }, [user, eventId])
  
  return canEdit
}

// Uso
function EventEditor({ eventId }: Props) {
  const canEdit = useOwnerOrAdmin(eventId)
  
  if (!canEdit) return <AccessDenied />
  
  return <EventForm eventId={eventId} />
}
```

---

#### **2.6.3 Hooks para Operações Assíncronas**

```typescript
// ✅ Hook genérico para async operations
function useAsync<T>(asyncFunction: () => Promise<T>, immediate = true) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  
  const execute = useCallback(async () => {
    setStatus('pending')
    setData(null)
    setError(null)
    
    try {
      const response = await asyncFunction()
      setData(response)
      setStatus('success')
    } catch (error) {
      setError(error as Error)
      setStatus('error')
    }
  }, [asyncFunction])
  
  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])
  
  return { execute, status, data, error }
}

// Uso
function EventsList() {
  const fetchEvents = useCallback(
    () => supabase.from('events').select('*').order('date'),
    []
  )
  
  const { data: events, status, error, execute: refetch } = useAsync(fetchEvents)
  
  if (status === 'pending') return <LoadingSpinner />
  if (status === 'error') return <ErrorMessage error={error} />
  
  return (
    <div>
      <button onClick={refetch}>Atualizar</button>
      <EventList events={events ?? []} />
    </div>
  )
}
```

---

### 2.7 Estrutura de Pastas

#### **2.7.1 Frontend (Vite + React)**

```
src/
├── features/              # Feature-based modules
│   ├── auth/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── usePermissions.ts
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   └── types.ts
│   │
│   ├── events/
│   │   ├── hooks/
│   │   │   ├── useEvents.ts
│   │   │   └── useEventSetlist.ts
│   │   ├── components/
│   │   │   ├── EventForm.tsx
│   │   │   ├── EventCard.tsx
│   │   │   └── SetlistModal.tsx
│   │   ├── services/
│   │   │   └── eventService.ts
│   │   └── types.ts
│   │
│   ├── team/
│   │   ├── hooks/
│   │   │   ├── useTeamMembers.ts
│   │   │   └── useAvailability.ts
│   │   ├── components/
│   │   │   ├── MemberCard.tsx
│   │   │   └── AvailabilityCalendar.tsx
│   │   └── types.ts
│   │
│   └── music/
│       ├── hooks/
│       ├── components/
│       └── types.ts
│
├── shared/                # Compartilhado entre features
│   ├── hooks/
│   │   ├── useAsync.ts
│   │   ├── useSupabaseQuery.ts
│   │   └── useDebounce.ts
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── LoadingSpinner.tsx
│   ├── utils/
│   │   ├── date.ts
│   │   └── validation.ts
│   └── types/
│       └── common.ts
│
├── config/
│   ├── supabase.ts
│   └── constants.ts
│
└── App.tsx
```

---

#### **2.7.2 Backend (NestJS - Futuro BFF)**

```
src/
├── domain/                # Domínio puro (DDD)
│   ├── events/
│   │   ├── entities/
│   │   │   ├── event.entity.ts
│   │   │   └── event-setlist.entity.ts
│   │   ├── repositories/
│   │   │   └── event.repository.interface.ts
│   │   └── value-objects/
│   │       └── event-date.vo.ts
│   │
│   ├── team/
│   │   ├── entities/
│   │   │   ├── team-member.entity.ts
│   │   │   └── availability.entity.ts
│   │   └── repositories/
│   │       └── team-member.repository.interface.ts
│   │
│   └── music/
│       ├── entities/
│       └── repositories/
│
├── application/           # Use cases (Application Layer)
│   ├── events/
│   │   ├── create-event.usecase.ts
│   │   ├── publish-event.usecase.ts
│   │   └── assign-member.usecase.ts
│   ├── team/
│   └── music/
│
├── infrastructure/        # Implementações concretas
│   ├── database/
│   │   ├── supabase/
│   │   │   ├── event.repository.ts
│   │   │   └── team-member.repository.ts
│   │   └── migrations/
│   │
│   ├── storage/
│   │   ├── s3.provider.ts
│   │   └── local.provider.ts
│   │
│   └── messaging/
│       ├── email.service.ts
│       └── push.service.ts
│
├── presentation/          # Controllers (API Layer)
│   ├── events/
│   │   ├── events.controller.ts
│   │   ├── dtos/
│   │   │   ├── create-event.dto.ts
│   │   │   └── update-event.dto.ts
│   │   └── events.module.ts
│   ├── team/
│   └── music/
│
└── main.ts
```

---

## 3. Padrões Arquiteturais

### 3.1 Clean Architecture (Camadas)

```
┌─────────────────────────────────────────┐
│        Presentation Layer               │ ← Controllers, DTOs
│  (Express/NestJS Routes, GraphQL)       │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│        Application Layer                │ ← Use Cases
│  (Business Logic, Orchestration)        │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│           Domain Layer                  │ ← Entities, Aggregates
│  (Pure Business Rules, Invariants)      │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│       Infrastructure Layer              │ ← Repositories, APIs
│  (Supabase, S3, SendGrid)               │
└─────────────────────────────────────────┘
```

**Regra de Dependência:** Camadas internas NÃO conhecem camadas externas.

---

### 3.2 Decisões de Implementação

| Fase | Padrão | Justificativa |
|------|--------|---------------|
| **MVP (P0)** | Simples + Hooks | Velocidade > Arquitetura elaborada |
| **P1** | + Repository Pattern | Abstrair Supabase (facilita testes) |
| **P2** | + Use Cases | Lógica de negócio complexa isolada |
| **P3** | + Domain Events | Event-driven quando houver múltiplos contextos |

---

## 4. Dependency Injection

### 4.1 Contexto

**Pergunta:** Usar biblioteca de DI (TSyringe, InversifyJS) ou Composition Root pattern manual?

**Considerações:**
- TypeScript não tem DI nativo (como Angular ou NestJS)
- Decorators são experimental (Stage 3 proposal, `experimentalDecorators: true`)
- MVP em 7 semanas exige foco em features
- Time pequeno precisa minimizar carga cognitiva

---

### 4.2 Análise Comparativa

#### **Opção 1: DI Libraries**

##### **TSyringe** (Microsoft)
```typescript
import "reflect-metadata"
import { injectable, inject, container } from "tsyringe"

@injectable()
class EventRepository {
  constructor(@inject("SupabaseClient") private supabase: SupabaseClient) {}
  
  async findById(id: string): Promise<Event | null> {
    const { data } = await this.supabase.from('events').select('*').eq('id', id).single()
    return data
  }
}

@injectable()
class EventService {
  constructor(private eventRepo: EventRepository) {}
  
  async getEvent(id: string) {
    return this.eventRepo.findById(id)
  }
}

// Container registration
container.register("SupabaseClient", { useValue: supabaseClient })
container.register(EventRepository, { useClass: EventRepository })
container.register(EventService, { useClass: EventService })

// Resolução automática
const service = container.resolve(EventService)
```

**Vantagens:**
- ✅ Auto-wiring (resolve dependências automaticamente)
- ✅ Decorators elegantes (`@injectable`, `@inject`)
- ✅ Scopes (singleton, transient, scoped)
- ✅ Menor boilerplate para muitas classes

**Desvantagens:**
- ❌ Requer `reflect-metadata` (runtime overhead)
- ❌ Decorators experimentais (tsconfig: `experimentalDecorators: true`)
- ❌ "Mágica" dificulta debug (dependências ocultas)
- ❌ Curva de aprendizado para novos devs
- ❌ Erros em runtime (não em compile time)

---

##### **InversifyJS**
```typescript
import "reflect-metadata"
import { injectable, inject, Container } from "inversify"

@injectable()
class EventService {
  constructor(
    @inject("EventRepository") private eventRepo: IEventRepository
  ) {}
}

const container = new Container()
container.bind<IEventRepository>("EventRepository").to(EventRepository)
container.bind<EventService>(EventService).toSelf()

const service = container.get<EventService>(EventService)
```

**Vantagens:**
- ✅ Mais poderoso que TSyringe (middleware, contexts, scopes avançados)
- ✅ Type-safe com symbols
- ✅ Bindings explícitos

**Desvantagens:**
- ❌ Mais complexo (overkill para MVP)
- ❌ Mesmos problemas de TSyringe (reflect-metadata, decorators)
- ❌ Boilerplate maior (TYPES symbols, bindings)

---

##### **NestJS (Framework Full)**
```typescript
import { Injectable } from '@nestjs/common'

@Injectable()
export class EventService {
  constructor(private eventRepo: EventRepository) {}
}

@Module({
  providers: [EventService, EventRepository],
  exports: [EventService]
})
export class EventsModule {}
```

**Vantagens:**
- ✅ DI integrado ao framework
- ✅ Decorators padronizados
- ✅ Ecosystem completo (guards, pipes, interceptors)

**Desvantagens:**
- ❌ Framework opinativo (lock-in)
- ❌ Overhead para MVP (se não usar backend BFF)
- ❌ Curva de aprendizado alta

---

#### **Opção 2: Composition Root Pattern (Manual)**

```typescript
// domain/repositories/event.repository.interface.ts
export interface IEventRepository {
  findById(id: string): Promise<Event | null>
  create(event: CreateEventDTO): Promise<Event>
}

// infrastructure/repositories/event.repository.ts
export class SupabaseEventRepository implements IEventRepository {
  constructor(private supabase: SupabaseClient) {}
  
  async findById(id: string): Promise<Event | null> {
    const { data } = await this.supabase.from('events').select('*').eq('id', id).single()
    return data
  }
  
  async create(event: CreateEventDTO): Promise<Event> {
    const { data } = await this.supabase.from('events').insert(event).select().single()
    return data
  }
}

// application/services/event.service.ts
export class EventService {
  constructor(private eventRepo: IEventRepository) {}
  
  async getEvent(id: string) {
    return this.eventRepo.findById(id)
  }
  
  async createEvent(dto: CreateEventDTO) {
    return this.eventRepo.create(dto)
  }
}

// main.ts (Composition Root)
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const eventRepo = new SupabaseEventRepository(supabase)
const eventService = new EventService(eventRepo)

export { eventService } // Export singleton
```

**Vantagens:**
- ✅ **Zero dependencies** (sem biblioteca extra)
- ✅ **Type-safe em compile time** (TypeScript nativo)
- ✅ **Explícito** (todas dependências visíveis)
- ✅ **Fácil debug** (stack trace claro)
- ✅ **Zero runtime overhead**
- ✅ **Fácil de entender** (qualquer dev JS entende)

**Desvantagens:**
- ❌ Boilerplate para muitas classes (manual wiring)
- ❌ Composition Root pode ficar grande (100+ classes)
- ❌ Sem scopes automáticos (precisa gerenciar manualmente)

---

### 4.3 Property Wrappers em TypeScript

**Pergunta:** TypeScript tem biblioteca nativa para property wrappers?

**Resposta:** **NÃO há biblioteca nativa**, mas há alternativas:

#### **1. Decorators (Experimental)**

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}

// Property decorator
function Inject(target: any, propertyKey: string) {
  // Lógica de injeção
}

class EventService {
  @Inject
  private eventRepo!: IEventRepository
}
```

**Status:**
- Stage 3 proposal (pode mudar)
- Requer `experimentalDecorators: true`
- Runtime metadata via `reflect-metadata`

---

#### **2. Proxy Pattern (TypeScript Nativo)**

```typescript
function createProxy<T extends object>(
  target: T,
  handler: ProxyHandler<T>
): T {
  return new Proxy(target, handler)
}

const eventService = createProxy(new EventService(eventRepo), {
  get(target, prop) {
    console.log(`Accessing ${String(prop)}`)
    return target[prop as keyof typeof target]
  }
})
```

**Uso:** Logging, lazy loading, validation

---

#### **3. Higher-Order Functions (Functional Approach)**

```typescript
function withRepository<T>(
  ServiceClass: new (repo: IEventRepository) => T,
  repo: IEventRepository
): T {
  return new ServiceClass(repo)
}

const eventService = withRepository(EventService, eventRepo)
```

---

### 4.4 Decisão: Progressive Approach

#### **MVP (P0-P1): Composition Root Manual**

**Justificativa:**
- ✅ MVP em 7 semanas → simplicidade > elegância
- ✅ Poucas classes (~10-15 services, ~5 repositories)
- ✅ Time pequeno → menos carga cognitiva
- ✅ Type-safe nativo (sem erros runtime)
- ✅ Zero setup (sem bibliotecas extras)

**Implementação:**
```typescript
// src/config/container.ts (Composition Root)
import { createClient } from '@supabase/supabase-js'
import { SupabaseEventRepository } from '@/infrastructure/repositories/event.repository'
import { SupabaseTeamRepository } from '@/infrastructure/repositories/team.repository'
import { SupabaseMusicRepository } from '@/infrastructure/repositories/music.repository'
import { EventService } from '@/application/services/event.service'
import { TeamService } from '@/application/services/team.service'
import { MusicService } from '@/application/services/music.service'

// Singleton Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Repositories (Singleton)
export const eventRepo = new SupabaseEventRepository(supabase)
export const teamRepo = new SupabaseTeamRepository(supabase)
export const musicRepo = new SupabaseMusicRepository(supabase)

// Services (Singleton)
export const eventService = new EventService(eventRepo)
export const teamService = new TeamService(teamRepo)
export const musicService = new MusicService(musicRepo)

// Para testing: factory para criar instâncias com mocks
export function createEventService(repo: IEventRepository) {
  return new EventService(repo)
}
```

**Uso em React:**
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

**Testes:**
```typescript
import { createEventService } from '@/config/container'

describe('EventService', () => {
  it('should create event', async () => {
    const mockRepo: IEventRepository = {
      create: vi.fn().mockResolvedValue({ id: '1', title: 'Test' })
    }
    
    const service = createEventService(mockRepo)
    const event = await service.createEvent({ title: 'Test' })
    
    expect(event.id).toBe('1')
  })
})
```

---

#### **P2-P3: Considerar DI Library (Se Necessário)**

**Sinais para adicionar TSyringe/InversifyJS:**

- [ ] Mais de 30 classes com dependências complexas
- [ ] Necessidade de scopes avançados (request-scoped, transient)
- [ ] Middleware/interceptors complexos
- [ ] Time cresceu (3+ devs confortáveis com DI)

**Sinais para adicionar NestJS:**

- [ ] Adicionou BFF (backend separado)
- [ ] Precisa de GraphQL, WebSockets, Microservices
- [ ] Time familiarizado com Angular (mesma arquitetura)

---

### 4.5 Comparação Resumida

| Critério | Composition Root | TSyringe | InversifyJS | NestJS |
|----------|------------------|----------|-------------|--------|
| **Setup** | ✅ Zero | ⚠️ reflect-metadata | ⚠️ reflect-metadata | ⚠️ Framework |
| **Type Safety** | ✅ Compile time | ❌ Runtime | ⚠️ Symbols | ⚠️ Decorators |
| **Curva Aprendizado** | ✅ Baixa | ⚠️ Média | ❌ Alta | ❌ Alta |
| **Boilerplate** | ⚠️ Manual wiring | ✅ Auto-wiring | ⚠️ Bindings | ✅ Decorators |
| **Debug** | ✅ Stack trace claro | ❌ Difícil | ❌ Difícil | ⚠️ Médio |
| **Performance** | ✅ Zero overhead | ⚠️ Reflection | ⚠️ Reflection | ⚠️ Framework |
| **Testabilidade** | ✅ Factory fácil | ✅ Mocks com container | ✅ Rebind | ✅ Testing module |
| **Escalabilidade** | ⚠️ Manual (30+ classes) | ✅ Alto | ✅ Muito alto | ✅ Muito alto |

---

### 4.6 Exemplo Completo: Composition Root no Worship+

```typescript
// src/config/container.ts
import { createClient } from '@supabase/supabase-js'

// Infrastructure Layer
import { SupabaseEventRepository } from '@/infrastructure/repositories/event.repository'
import { SupabaseTeamRepository } from '@/infrastructure/repositories/team.repository'
import { SupabaseMusicRepository } from '@/infrastructure/repositories/music.repository'
import { SupabaseAvailabilityRepository } from '@/infrastructure/repositories/availability.repository'

// Application Layer
import { EventService } from '@/application/services/event.service'
import { TeamService } from '@/application/services/team.service'
import { MusicService } from '@/application/services/music.service'
import { AvailabilityService } from '@/application/services/availability.service'

// Use Cases (P2)
// import { CreateEventUseCase } from '@/application/use-cases/create-event.usecase'
// import { PublishEventUseCase } from '@/application/use-cases/publish-event.usecase'

// ============================================================================
// SINGLETON INSTANCES (Composition Root)
// ============================================================================

// External Dependencies
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Repositories
const eventRepository = new SupabaseEventRepository(supabase)
const teamRepository = new SupabaseTeamRepository(supabase)
const musicRepository = new SupabaseMusicRepository(supabase)
const availabilityRepository = new SupabaseAvailabilityRepository(supabase)

// Services
const eventService = new EventService(eventRepository)
const teamService = new TeamService(teamRepository, availabilityRepository)
const musicService = new MusicService(musicRepository)
const availabilityService = new AvailabilityService(availabilityRepository)

// Use Cases (P2)
// const createEventUseCase = new CreateEventUseCase(eventRepository, teamRepository)
// const publishEventUseCase = new PublishEventUseCase(eventRepository, notificationService)

// ============================================================================
// EXPORTS (Public API)
// ============================================================================

export {
  // Services (MVP)
  eventService,
  teamService,
  musicService,
  availabilityService,
  
  // Use Cases (P2)
  // createEventUseCase,
  // publishEventUseCase,
}

// ============================================================================
// FACTORY FUNCTIONS (Testing)
// ============================================================================

export function createEventServiceForTest(repo: IEventRepository) {
  return new EventService(repo)
}

export function createTeamServiceForTest(
  teamRepo: ITeamRepository,
  availabilityRepo: IAvailabilityRepository
) {
  return new TeamService(teamRepo, availabilityRepo)
}
```

---

### 4.7 Recomendação Final

#### **Resposta Direta:**

1. **Usar Composition Root manual no MVP** (P0-P1)
   - Simples, type-safe, zero overhead
   - Perfeito para 10-20 classes
   - Fácil migração para DI library depois

2. **TypeScript NÃO tem property wrappers nativos**
   - Use decorators experimentais (se confortável)
   - Ou use Composition Root (recomendado)

3. **Considerar TSyringe em P2** (se passar de 30 classes)
   - Ou NestJS se adicionar BFF backend

#### **Filosofia:**

> "Start simple, evolve when pain is real, not anticipated."

---

## 5. Checklist de Code Review

### 5.1 SOLID

- [ ] Cada classe/componente tem UMA responsabilidade?
- [ ] Código fechado para modificação, aberto para extensão?
- [ ] Abstrações podem ser substituídas sem quebrar?
- [ ] Interfaces são específicas (não "gordas")?
- [ ] Dependências são abstrações (não implementações)?

### 5.2 DRY

- [ ] Lógica duplicada foi abstraída em hook/função?
- [ ] Código compartilhado está em `/shared`?

### 5.3 KISS

- [ ] Código é compreensível em 5 minutos?
- [ ] Não há over-engineering (framework caseiro)?
- [ ] Abstrações facilitam ou complicam?

### 5.4 Patterns

- [ ] Decorators usados para cross-cutting concerns?
- [ ] Repository abstrai data source?
- [ ] Strategy usado para comportamentos intercambiáveis?

### 5.5 Dependency Injection

- [ ] Composition Root está em arquivo separado (`container.ts`)?
- [ ] Dependências injetadas via constructor (não imports diretos)?
- [ ] Factories criadas para testes?
- [ ] Singleton exports para produção?

### 5.6 Carga Cognitiva

- [ ] Nomenclatura clara e específica?
- [ ] Nível de abstração adequado ao contexto?
- [ ] Comentários explicam "porquê", não "o quê"?

---

## 6. Referências

- **DDD-GUIDE.md:** Bounded Contexts, Agregados, Linguagem Úbiqua
- **MVP-ROADMAP.md:** Priorização e escopo
- **AGENTS-GUIDE.md:** Processo de atualização de documentação

**Bibliotecas DI avaliadas:**
- [TSyringe](https://github.com/microsoft/tsyringe) - Microsoft, leve, auto-wiring
- [InversifyJS](https://inversify.io/) - Mais poderoso, middleware avançado
- [TypeDI](https://github.com/typestack/typedi) - Simples, sem reflect-metadata
- [NestJS](https://nestjs.com/) - Framework full com DI integrado

---

**Este documento evolui com o projeto. Mantenha atualizado!**

**Última atualização:** 2 de Março de 2026
