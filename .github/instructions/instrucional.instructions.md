---
applyTo: "**"
---
# Instrucional — Contexto Web Worship+

**Versão:** 1.1  
**Data:** Maio 2026  
**Status:** Ativo (PRD-001)

---

## 1. Checklist de Abertura de Sessão

Antes de iniciar qualquer tarefa de desenvolvimento, execute este checklist:

- [ ] Ler o PRD da feature alvo (localizado em `docs/planning/prds/`)
- [ ] Verificar linguagem ubíqua em [skills.instructions.md](./skills.instructions.md) e [rules.instructions.md](./rules.instructions.md)
- [ ] Navegar na estrutura atual do frontend: `frontend/src/`
- [ ] Confirmar que há dados mockados disponíveis para a feature (sem schema de banco)
- [ ] Verificar se o usuário mockado tem o privilégio correto para o fluxo testado

## 2. Checklist de Encerramento de Sessão

Antes de commitar e submeter a entrega, execute:

- [ ] `cd frontend && npm run lint` — zero warnings/erros
- [ ] `cd frontend && npm run build` — build sem erros
- [ ] `cd frontend && npm run test:unit` — todos os testes passando
- [ ] Terminologia verificada: Setlist, Event Setlist, Event, Owner/Ministro, Privilégio
- [ ] Nenhum schema de banco, migration ou contrato de persistência definitivo incluído
- [ ] Componentes documentados com comentários mínimos quando necessário
- [ ] PR com descrição clara do critério de aceitação atendido

---

## 3. Stack e Ferramentas Relevantes

| Camada       | Tecnologia                              |
|--------------|-----------------------------------------|
| UI           | React 18 + TypeScript                   |
| Bundler      | Vite 5                                  |
| Estilo       | Tailwind CSS 3 + CSS tokens (glassmorphism) |
| Roteamento   | React Router DOM v6                     |
| Testes       | Vitest + Testing Library                |
| Linter       | ESLint 8 + Prettier 3                   |
| E2E          | Playwright (fora do escopo MVP)         |

---

## 4. Comandos Rápidos

```bash
# Instalar dependências
cd frontend && npm install

# Servidor de desenvolvimento
cd frontend && npm run dev

# Validação completa (obrigatória antes do PR)
cd frontend && npm run lint
cd frontend && npm run build
cd frontend && npm run test:unit
```

---

## 5. Estrutura de Diretórios MVP

```
frontend/src/
  context/            # Providers globais (tema, auth)
  features/
    setlist/          # PRD-002: Repertório + YouTube
    events/           # PRD-003: Listagem e detalhe de eventos
    users/            # PRD-004: Cadastro e privilégios
  mocks/              # Dados mockados por domínio
  types/              # Tipos TypeScript por domínio
  components/         # Componentes compartilhados
  App.tsx             # Router raiz
  main.tsx            # Entry point
```

---

## 6. Referências

- [skills.instructions.md](./skills.instructions.md) — Capacidades operacionais por tipo de tarefa
- [rules.instructions.md](./rules.instructions.md) — Políticas de qualidade, terminologia e entrega
- PRDs: `docs/planning/prds/**/*.md`
- Guia de agentes: `docs/guides/AGENTS-GUIDE.md`
