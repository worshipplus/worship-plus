# US-014: Componentes Base (Button, Input, Card)

**Como** Desenvolvedor Frontend  
**Quero** ter componentes base reutilizáveis (Button, Input, Card, Badge, Avatar)  
**Para que** eu possa construir telas consistentes rapidamente

**Bounded Context:** User Management (Generic - Design System)  
**Prioridade:** P0 - CRÍTICO  
**Estimativa:** 8 pontos  
**Sprint:** Sprint 1

---

## Critérios de Aceitação

1. ✅ Componente `Button` com variantes: primary, secondary, ghost, danger
2. ✅ Componente `Input` com validação, error state, label, helper text
3. ✅ Componente `Card` com header, footer, actions
4. ✅ Componente `Badge` com cores: success, warning, error, info
5. ✅ Componente `Avatar` com fallback (iniciais), tamanhos (sm, md, lg, xl)
6. ✅ Todos componentes mobile-first (touch target ≥ 44x44px)
7. ✅ Acessibilidade: ARIA labels, keyboard navigation, focus visible
8. ✅ Storybook com todos os estados (default, hover, disabled, loading, error)
9. ✅ Testes unitários (coverage ≥ 80%)

---

## Regras de Negócio

- Touch targets devem ter mínimo 44x44px (iOS guideline)
- Focus visible com outline 2px (acessibilidade)
- Disabled state deve ter opacity 0.4 e cursor not-allowed
- Botões loading mostram spinner e desabilitam interação
- Input error mostra mensagem abaixo do campo (role="alert")
- Avatar fallback usa primeira letra do nome + cor hash do email

---

## Eventos de Domínio

Nenhum (componentes de apresentação)

---

## Dependências

### Técnicas
- [ ] US-013: Design Tokens configurados
- [ ] Storybook configurado
- [ ] Testing Library instalado

### User Stories
- **US-013:** Design Tokens (tokens.css com cores/espaçamentos)

---

## Definição de Pronto (DoD)

- [ ] 5 componentes implementados (Button, Input, Card, Badge, Avatar)
- [ ] Cada componente com props TypeScript tipadas
- [ ] Storybook com todas as variantes documentadas
- [ ] Testes unitários (coverage >80%)
- [ ] Acessibilidade validada (ARIA, keyboard, focus)
- [ ] Mobile-first (touch targets ≥ 44px)
- [ ] Code review aprovado
- [ ] Documentação inline (JSDoc)

---

## Referências

- **Contract API:** [`contract.yaml`](./contract.yaml)
- **BDD Scenarios:** [`scenarios.feature`](./scenarios.feature)
- **Testes de Aceitação:** [`acceptance-tests.md`](./acceptance-tests.md)
- **DDD-GUIDE:** [`docs/summaries/ddd-summary.md`](../../summaries/ddd-summary.md)
- **Architecture:** [`docs/summaries/arch-decisions-summary.md`](../../summaries/arch-decisions-summary.md)

---

## Notas Adicionais

**Inspiração visual:** Consultar `agents/worship+/frontend-developer-agent/inspiration-images/` para referências de design.

**Compound Components Pattern:** Componentes complexos (Card, Input) devem usar Compound Components para flexibilidade:

```jsx
<Card>
  <Card.Header>
    <Card.Title>Título</Card.Title>
  </Card.Header>
  <Card.Content>Conteúdo</Card.Content>
  <Card.Footer>
    <Button>Ação</Button>
  </Card.Footer>
</Card>
```

---

**Criado em:** 3 de Março de 2026  
**Responsável:** Frontend Developer Agent
