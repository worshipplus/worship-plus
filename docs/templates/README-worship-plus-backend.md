# Worship+ Backend (BFF)

**Backend For Frontend - NestJS**

**Organização:** [worshipplus](https://github.com/worshipplus)  
**Repositório:** https://github.com/worshipplus/worship-plus-backend.git  
**Visibilidade:** Private

---

## ⚠️ Status: **Não Implementado (P2)**

Este repositório está **planejado para P2** (após MVP). No MVP (P0-P1), o frontend conecta **diretamente ao Supabase**.

---

## 📖 Propósito

Backend For Frontend (BFF) com **NestJS** para:
- Orquestração de múltiplos serviços
- Business logic complexa que não cabe em RLS (Row-Level Security)
- Agregação de dados de múltiplas fontes
- Cache de queries pesadas
- Integração com serviços externos (S3, CloudFront, SNS)

---

## 🚦 Quando Criar Este Repositório?

### ✅ SIM, se:

1. **Multi-client:**
   - Frontend web + mobile apps (iOS/Android)
   - Diferentes clientes precisam de dados distintos
   - Exemplo: App mobile tem UX diferente da web

2. **Orquestração complexa:**
   - 1 chamada do frontend = 5+ queries no Supabase
   - Exemplo: Dashboard com métricas agregadas de múltiplas tabelas

3. **Business logic não cabe em RLS:**
   - Regras com 10+ condições
   - Exemplo: Escalação automática com 15 critérios de prioridade

4. **Cache necessário:**
   - Queries pesadas (>3s)
   - Executadas frequentemente
   - Exemplo: Relatório de métricas do mês

5. **Integrações externas:**
   - Pagamento (Stripe)
   - Email (SendGrid)
   - Notificações push (FCM)
   - Storage (S3 upload direto, não Supabase Storage)

6. **30+ classes de domínio:**
   - Codebase frontend fica confuso com lógica de negócio
   - DDD pede separação clara de camadas

---

### ❌ NÃO, se:

1. **MVP simples:**
   - Frontend → Supabase (Auth + DB + RLS) é suficiente
   - <10 User Stories implementadas
   - Time pequeno (1-2 devs)

2. **RLS resolve:**
   - Policies conseguem expressar as regras de negócio
   - Exemplo: `user_id = auth.uid()` garante segurança

3. **Sem multi-client:**
   - Apenas frontend web
   - Sem apps mobile planejados para P1-P2

4. **Sem orquestração:**
   - Frontend faz queries diretas simples
   - Sem agregações complexas

---

## 🛠️ Stack Técnico

### Core
- **NestJS** (framework opinado, módulos, DI nativo)
- **TypeScript** (type safety)

### Database
- **Supabase Client** para acessar Postgres
- **Prisma** ou **TypeORM** (ORM, migrations)

### Autenticação
- **Passport** (JWT via Supabase tokens)
- **Guards** (NestJS) para proteger rotas

### Testing
- **Jest** (unit tests)
- **Supertest** (integration tests)

### Cache
- **Redis** (opcional, P2)

### Deploy
- **Docker** + **ECS** (AWS)
- **Railway** ou **Render** (alternativa rápida)

---

## 📂 Estrutura

```
worship-plus-backend/
├── README.md                          # Este arquivo
├── package.json
├── tsconfig.json
├── nest-cli.json
├── .env.example
├── Dockerfile
│
├── src/
│   ├── main.ts                        # Bootstrap
│   ├── app.module.ts                  # Root module
│   │
│   ├── config/                        # Configurações
│   │   ├── supabase.config.ts
│   │   ├── redis.config.ts
│   │   └── env.validation.ts
│   │
│   ├── core/                          # Domain layer (DDD)
│   │   ├── events/
│   │   │   ├── domain/
│   │   │   │   ├── Event.ts
│   │   │   │   ├── Setlist.ts
│   │   │   │   └── Song.ts
│   │   │   ├── application/
│   │   │   │   └── EventService.ts
│   │   │   └── infrastructure/
│   │   │       ├── repositories/
│   │   │       │   └── SupabaseEventRepository.ts
│   │   │       └── adapters/
│   │   │           └── S3Adapter.ts
│   │   │
│   │   ├── team/
│   │   │   ├── domain/
│   │   │   │   ├── Member.ts
│   │   │   │   └── Availability.ts
│   │   │   ├── application/
│   │   │   │   └── AvailabilityService.ts
│   │   │   └── infrastructure/
│   │   │       └── repositories/
│   │   │           └── SupabaseAvailabilityRepository.ts
│   │   │
│   │   └── shared/
│   │       ├── domain/
│   │       │   ├── AggregateRoot.ts
│   │       │   ├── Entity.ts
│   │       │   └── ValueObject.ts
│   │       └── utils/
│   │           └── date.utils.ts
│   │
│   ├── api/                           # Presentation layer (REST)
│   │   ├── events/
│   │   │   ├── events.controller.ts
│   │   │   ├── events.module.ts
│   │   │   └── dto/
│   │   │       ├── create-event.dto.ts
│   │   │       └── update-event.dto.ts
│   │   │
│   │   ├── team/
│   │   │   ├── team.controller.ts
│   │   │   ├── team.module.ts
│   │   │   └── dto/
│   │   │       └── availability.dto.ts
│   │   │
│   │   └── auth/
│   │       ├── auth.guard.ts
│   │       └── supabase-jwt.strategy.ts
│   │
│   └── shared/
│       ├── filters/
│       │   └── http-exception.filter.ts
│       ├── interceptors/
│       │   └── logging.interceptor.ts
│       └── decorators/
│           └── current-user.decorator.ts
│
├── test/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── prisma/
    ├── schema.prisma
    └── migrations/
```

---

## 🚀 Setup Local (Quando P2)

### 1. Pré-requisitos

- Node.js 20+
- Docker (para Postgres local ou usar Supabase diretamente)
- Conta Supabase

---

### 2. Clone e Install

```bash
git clone https://github.com/worshipplus/worship-plus-backend.git
cd worship-plus-backend
npm install
```

---

### 3. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

**Editar `.env`:**

```env
# Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=seu_anon_key
SUPABASE_SERVICE_ROLE_KEY=seu_service_role_key  # Admin, não expor no frontend

# Database (Postgres via Supabase)
DATABASE_URL=postgresql://postgres:[password]@db.[projeto].supabase.co:5432/postgres

# Redis (opcional, P2)
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=seu_secret_aqui

# Port
PORT=3001
```

---

### 4. Migrations (Prisma)

```bash
npx prisma generate
npx prisma migrate dev
```

---

### 5. Rodar Dev

```bash
npm run start:dev
# http://localhost:3001
```

---

## 📝 Scripts Disponíveis

```json
{
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "build": "nest build",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }
}
```

---

## 🔐 Autenticação (Supabase JWT)

### Strategy

```typescript
// src/api/auth/supabase-jwt.strategy.ts
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class SupabaseJwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SUPABASE_JWT_SECRET,
    })
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role }
  }
}
```

---

### Guard

```typescript
// src/api/auth/auth.guard.ts
import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

---

### Protected Route

```typescript
// src/api/events/events.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/auth.guard'
import { CurrentUser } from '@/shared/decorators/current-user.decorator'

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.eventService.findAllForUser(user.userId)
  }
}
```

---

## 🏗️ DDD Layers

### 1. Domain Layer

```typescript
// src/core/events/domain/Event.ts
export class Event extends AggregateRoot {
  private constructor(
    public readonly id: string,
    public title: string,
    public date: Date,
    public setlist: Setlist | null,
  ) {
    super()
  }

  static create(title: string, date: Date): Event {
    if (!title) throw new Error('Title required')
    if (date < new Date()) throw new Error('Date must be future')
    
    return new Event(uuid(), title, date, null)
  }

  assignSetlist(setlist: Setlist): void {
    this.setlist = setlist
    this.addDomainEvent(new SetlistAssignedEvent(this.id, setlist.id))
  }
}
```

---

### 2. Application Layer (Service)

```typescript
// src/core/events/application/EventService.ts
@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly eventBus: EventBus,
  ) {}

  async createEvent(dto: CreateEventDto, userId: string): Promise<Event> {
    const event = Event.create(dto.title, dto.date)
    await this.eventRepository.save(event)
    
    // Dispatch domain events
    event.domainEvents.forEach(e => this.eventBus.publish(e))
    
    return event
  }
}
```

---

### 3. Infrastructure Layer (Repository)

```typescript
// src/core/events/infrastructure/repositories/SupabaseEventRepository.ts
@Injectable()
export class SupabaseEventRepository implements IEventRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async save(event: Event): Promise<void> {
    const { error } = await this.supabase
      .from('events')
      .insert({
        id: event.id,
        title: event.title,
        date: event.date.toISOString(),
      })
    
    if (error) throw new Error(error.message)
  }

  async findById(id: string): Promise<Event | null> {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error || !data) return null
    
    return Event.reconstitute(data.id, data.title, new Date(data.date))
  }
}
```

---

### 4. Presentation Layer (Controller)

```typescript
// src/api/events/events.controller.ts
@Controller('api/events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(
    @Body() dto: CreateEventDto,
    @CurrentUser() user: any,
  ) {
    const event = await this.eventService.createEvent(dto, user.userId)
    return { id: event.id, title: event.title }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventService.findById(id)
    if (!event) throw new NotFoundException('Event not found')
    return event
  }
}
```

---

## 🧪 Testes

### Unit Test

```typescript
// test/unit/event.service.spec.ts
describe('EventService', () => {
  let service: EventService
  let repository: jest.Mocked<IEventRepository>

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findById: jest.fn(),
    } as any

    service = new EventService(repository, eventBus)
  })

  it('should create event', async () => {
    const dto = { title: 'Culto', date: new Date('2026-03-10') }
    
    const event = await service.createEvent(dto, 'user-123')
    
    expect(event.title).toBe('Culto')
    expect(repository.save).toHaveBeenCalledWith(event)
  })
})
```

---

### Integration Test

```typescript
// test/integration/events.controller.spec.ts
import * as request from 'supertest'

describe('EventsController (integration)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = module.createNestApplication()
    await app.init()
  })

  it('POST /api/events', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/events')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ title: 'Culto', date: '2026-03-10' })
      .expect(201)

    expect(response.body).toHaveProperty('id')
  })
})
```

---

## 🚀 Deploy (Quando Implementar)

### Docker

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "dist/main"]
```

---

### Railway (Simples)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy
railway up
```

---

### AWS ECS (Produção)

```bash
# 1. Build image
docker build -t worship-plus-backend .

# 2. Push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin [ECR_URL]
docker tag worship-plus-backend:latest [ECR_URL]:latest
docker push [ECR_URL]:latest

# 3. Update ECS service
aws ecs update-service --cluster worship-plus --service backend --force-new-deployment
```

---

## 📊 Performance

### Metas

| Métrica | Target |
|---------|--------|
| **GET /api/events** | <200ms (p95) |
| **POST /api/events** | <500ms (p95) |
| **CPU usage** | <50% idle |
| **Memory** | <512MB (container) |

---

## 🔗 Referências

- **Documentação:** https://github.com/worshipplus/worship-plus
- **DDD-GUIDE:** Domain modeling, aggregates
- **ARCHITECTURE-DECISIONS:** Quando usar BFF, DI com NestJS
- **Frontend:** https://github.com/worshipplus/worship-plus-frontend

---

## 🤝 Contribuindo (Quando P2)

### Commit (Conventional Commits)

```bash
git commit -m "feat(events): adiciona endpoint POST /api/events [US-007]"
```

### Pull Request

```bash
gh pr create --title "feat(events): adiciona endpoints de eventos [US-007]" \
             --body "Implementa:
- POST /api/events
- GET /api/events/:id
- GET /api/events (list)

Testes:
✅ Unit tests (EventService)
✅ Integration tests (EventsController)

Related: US-007"
```

---

## 📞 Contato

**Issues:** https://github.com/worshipplus/worship-plus-backend/issues  
**Organização:** https://github.com/worshipplus

---

**Este repositório será criado em P2, após validação do MVP.**

**Última atualização:** 2 de Março de 2026
