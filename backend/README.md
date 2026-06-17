# Worship+ Backend

Servidor Express.js com dados mock em memória para o projeto Worship+.

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

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/users` | Lista todos os usuários |
| POST | `/api/users` | Cadastra novo usuário |
| PUT | `/api/users/:id` | Atualiza privilégio do usuário |
| DELETE | `/api/users/:id` | Remove usuário |
| GET | `/api/setlist` | Lista todos os itens do Setlist |
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

## Estrutura

```
backend/
  src/
    data/         # Dados mock iniciais (users, setlist, events)
    routes/       # Roteadores Express (users, setlist, events)
    server.js     # Entry point
  package.json
  README.md
```

## Dados em memória

Os dados são inicializados a partir dos arquivos em `src/data/` e mantidos em memória. **Reiniciar o servidor reseta os dados para os valores mock iniciais.** Isso é intencional nesta fase — sem banco de dados.
