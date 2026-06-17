# Worship+ Backend

Servidor Express.js com persistência em SQLite (`better-sqlite3`) para o projeto Worship+.

> **Nota:** Este código foi desenvolvido no repositório `worship-plus` para ser movido para o repositório [`worship-plus-backend`](https://github.com/worshipplus/worship-plus-backend).

## Instalação

```bash
cd backend
npm install
```

## Rodando em desenvolvimento

```bash
npm run dev
```

O servidor sobe em `http://localhost:3001`.  
Na primeira execução, o banco `worship-plus.db` é criado automaticamente em `backend/` e populado com os dados mock.

## Banco de dados

| Ambiente | Banco | Arquivo |
|----------|-------|---------|
| Desenvolvimento | SQLite local (`better-sqlite3`) | `backend/worship-plus.db` |
| Produção (banco na nuvem) | Turso (`@libsql/client`) | — |
| Produção (tudo junto) | Railway + SQLite | `DB_PATH` via variável de ambiente |

O arquivo `worship-plus.db` é ignorado pelo git (`.gitignore`).

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/users` | Lista todos os usuários |
| GET | `/api/users/:id` | Retorna usuário por id |
| POST | `/api/users` | Cadastra novo usuário |
| PUT | `/api/users/:id` | Atualiza privilégio do usuário |
| DELETE | `/api/users/:id` | Remove usuário |
| GET | `/api/setlist` | Lista todos os itens do Setlist |
| GET | `/api/setlist/:id` | Retorna item por id |
| POST | `/api/setlist` | Adiciona item ao Setlist |
| PUT | `/api/setlist/:id` | Edita item do Setlist |
| DELETE | `/api/setlist/:id` | Remove item do Setlist |
| GET | `/api/events` | Lista todos os eventos |
| GET | `/api/events/:id` | Retorna evento por id |
| POST | `/api/events` | Cria novo evento |
| PUT | `/api/events/:id` | Atualiza evento |
| DELETE | `/api/events/:id` | Remove evento |
| POST | `/api/events/:id/setlist` | Adiciona item ao Event Setlist |
| DELETE | `/api/events/:id/setlist/:itemId` | Remove item do Event Setlist |
| POST | `/api/events/:id/scale` | Adiciona membro à escala |
| DELETE | `/api/events/:id/scale/:entryId` | Remove membro da escala |

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `PORT` | `3001` | Porta do servidor |
| `CORS_ORIGIN` | `http://localhost:5173` | Origem permitida pelo CORS |
| `DB_PATH` | `backend/worship-plus.db` | Caminho do arquivo SQLite |

## Estrutura

```
backend/
  migrations/
    001_init.sql    # Criação das tabelas users, setlist_items, events
  src/
    data/           # Dados mock para seed inicial
    routes/         # Roteadores Express (users, setlist, events)
    db.js           # Inicialização do SQLite, migrations e helpers
    server.js       # Entry point
  package.json
  README.md
```

## Migrations

As migrations em SQL puro ficam em `backend/migrations/`. Elas são executadas automaticamente na inicialização do servidor via `db.exec()`. O seed dos dados mock ocorre apenas quando as tabelas estão vazias.

