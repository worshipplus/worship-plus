# US-013: Design Tokens e Theme Setup

**Como** Desenvolvedor Frontend  
**Quero** configurar design tokens e sistema de tema  
**Para que** toda a aplicação use cores, espaçamentos e tipografia consistentes

**Bounded Context:** User Management (Generic - Design System)  
**Prioridade:** P0 - CRÍTICO  
**Estimativa:** 3 pontos  
**Sprint:** Sprint 1

---

## Critérios de Aceitação

1. ✅ Arquivo `src/styles/tokens.css` com custom properties CSS (cores, espaçamentos, tipografia)
2. ✅ Paleta de cores extraída das imagens de inspiração (usar palette-extractor.js)
3. ✅ Suporte a dark mode (data-theme="light" | "dark")
4. ✅ Breakpoints mobile-first (360px, 768px, 1024px, 1440px)
5. ✅ Escala tipográfica (12px, 14px, 16px, 20px, 24px, 32px, 48px)
6. ✅ Espaçamento 4px base (4, 8, 12, 16, 24, 32, 48, 64px)
7. ✅ Documentação em Storybook (tokens visíveis)

---

## Regras de Negócio

- Cores devem ter contrast ratio ≥ 4.5:1 para WCAG AA (acessibilidade)
- Dark mode deve ser persistido em localStorage (preferência do usuário)
- Tokens devem ser usados via `var(--color-primary)` (não hardcoded)
- Mobile-first: breakpoints em `min-width` (não `max-width`)
- Escala tipográfica usando `clamp()` para fluid typography

---

## Eventos de Domínio

| Evento | Quando Disparar | Ouvintes | Ação |
|--------|----------------|----------|------|
| `ThemeChanged` | Usuário alterna dark/light mode | Analytics Context (P2) | Registrar preferência do usuário |

---

## Dependências

### Técnicas
- [ ] Imagens de inspiração processadas (palette-extractor.js rodado)
- [ ] Storybook configurado no projeto
- [ ] PostCSS configurado (custom properties)

### User Stories
- Nenhuma (primeira story de frontend)

---

## Definição de Pronto (DoD)

- [ ] Código implementado seguindo DDD (agregados corretos)
- [ ] Testes unitários escritos (coverage >80%)
- [ ] Testes de integração para fluxo crítico
- [ ] Contract API atualizado (se necessário)
- [ ] Scenarios BDD validados
- [ ] Code review aprovado
- [ ] Deployment em staging testado
- [ ] Documentação atualizada (se aplicável)

---

## Referências

- **Contract API:** [`contract.yaml`](./contract.yaml)
- **BDD Scenarios:** [`scenarios.feature`](./scenarios.feature)
- **Testes de Aceitação:** [`acceptance-tests.md`](./acceptance-tests.md)
- **DDD-GUIDE:** [`docs/summaries/ddd-summary.md`](../../summaries/ddd-summary.md)
- **Architecture:** [`docs/summaries/arch-decisions-summary.md`](../../summaries/arch-decisions-summary.md)

---

## Notas Adicionais (Opcional)

[Qualquer contexto adicional, links para mockups, decisões de design, etc.]

---

**Criado em:** [data]  
**Atualizado em:** [data]  
**Responsável:** [Product Manager Agent | Nome do PM]
