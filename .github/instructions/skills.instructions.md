---
applyTo: "**"
---
# Skills — Capacidades Operacionais Frontend

**Versão:** 1.1  
**Data:** Maio 2026  
**Status:** Ativo (PRD-001)

---

## 1. Planejamento

| Skill | Descrição |
|-------|-----------|
| Leitura de PRD | Extrair requisitos funcionais, critérios de aceitação e fora de escopo antes de implementar |
| Identificação de privilégios | Mapear quais personas (Admin, Ministro/Owner, Team Member) podem executar cada ação |
| Estimativa de impacto | Identificar arquivos a criar/alterar sem modificar código não relacionado |
| Definição de mock | Criar dados mockados que representem cenários realistas para a feature sem definir schema de banco |

## 2. UI e Componentes

| Skill | Descrição |
|-------|-----------|
| Componente funcional TypeScript | Criar componente React com tipagem explícita, sem `any` |
| Mobile-first com Tailwind | Usar classes responsivas (`sm:`, `md:`) como camada adicional sobre base mobile |
| Glassmorphism tokens | Aplicar CSS tokens do projeto (`var(--color-*)`, `var(--radius-*)`, `glass-card`) |
| Formulário com validação | Validar campos obrigatórios com mensagem de erro clara sem libs externas no MVP |
| Lista paginada/filtrada | Implementar filtro textual/por período com estado local e sem chamadas externas |
| Navegação via Router | Usar `<Link>`, `useNavigate`, `useParams` do React Router DOM v6 |
| Renderização condicional por perfil | Esconder/desabilitar ações de acordo com o privilégio do usuário atual |

## 3. Testes

| Skill | Descrição |
|-------|-----------|
| Teste unitário com Vitest | Criar arquivo `*.test.tsx` junto ao componente, cobrir casos principais |
| Renderização mínima | Verificar que o componente renderiza sem crash com `render()` do Testing Library |
| Teste de interação | Simular cliques/inputs com `userEvent` do Testing Library |
| Asserção de visibilidade | Usar `screen.getByText`, `screen.queryByText`, `expect(...).toBeInTheDocument()` |
| Teste de permissão | Verificar que usuário sem privilégio não vê/aciona ações restritas |
| Mock de contexto | Envolver componente em providers mockados (`ThemeProvider`, `AuthProvider`) nos testes |

## 4. Validação e Qualidade

| Skill | Descrição |
|-------|-----------|
| ESLint zero warnings | Garantir `npm run lint` sem warnings antes do commit |
| TypeScript strict | Sem `any` explícito; usar `unknown` quando necessário |
| Build sem erros | Confirmar `npm run build` com saída limpa |
| Cobertura mínima | `npm run test:unit` passando com `--passWithNoTests` para features sem testes ainda |

## 5. Linguagem Ubíqua (aplicação prática)

| Termo correto | Termos a evitar | Contexto |
|---------------|-----------------|---------|
| **Setlist** | repertório, biblioteca de músicas, song library | Coleção global de músicas |
| **Event Setlist** | playlist do evento, set do culto | Lista de músicas de um evento específico |
| **Event** | culto, reunião, service | Evento de louvor |
| **Owner / Ministro** | líder, pastor, speaker | Responsável pelo evento |
| **Privilégio** | role, permission, cargo | Nível de acesso do usuário |
| **Locked Event** | evento encerrado, finalizado | Evento sem novas edições |

## 6. Referências

- [instrucional.instructions.md](.github/instructions/instrucional.instructions.md) — Checklist de abertura/encerramento de sessão
- [rules.instructions.md](.github/instructions/rules.instructions.md) — Políticas de execução e qualidade
