# US-051: Guard Rails de CI e Branch Protection

**Como** Tech Lead do contexto Team  
**Quero** estabelecer guard rails de CI e governança de branches  
**Para que** o time evite quebras de pipeline e reduza retrabalho

**Bounded Context:** Team  
**Prioridade:** P0  
**Estimativa:** 3 pontos  
**Sprint:** 1

---

## Critérios de Aceitação

1. ✅ O CI utiliza scripts canônicos e reaproveitáveis (`tsc:build` e `build`) para reduzir drift
2. ✅ O `tsc -b` roda com `tsconfig.*` válidos (sem opções desconhecidas / build info consistente)
3. ✅ Existe validação local antes do push para barrar quebras de TypeScript config/version (`.husky/pre-push` → `ci:prepush`)
4. ✅ A branch `main` aceita apenas merge via Pull Request e bloqueia force-push
5. ✅ Branch protection exige checks do workflow de CI e impede merge com pipeline vermelho

---

## Regras de Negócio

- Alterações em `main` devem ocorrer via Pull Request (sem push direto)
- Force-push é proibido em `main`
- Aprovações de PR podem ser exigidas (1+ recomendado quando houver time; 0 em contexto solo/MVP para não bloquear merges)
- O pipeline é a fonte de verdade para qualidade (checks obrigatórios para merge)
- O hook de `pre-push` pode ser contornado apenas em modo break-glass (`--no-verify`), com justificativa registrada no PR

---

## Eventos de Domínio

| Evento | Quando Disparar | Ouvintes | Ação |
|--------|----------------|----------|------|
| `GuardRailsConfigured` | Ao habilitar branch protection e checks obrigatórios | Team | Registrar a decisão e atualizar documentação |

---

## Dependências

### Técnicas
- [ ] Workflow de CI configurado para rodar `tsc:build` e `build`
- [ ] Hooks locais configurados (Husky) e documentados

### User Stories
- [ ] US-051: Configurar branch protection no repositório GitHub (ação manual em Settings)

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

- **BDD Scenarios:** [`scenarios.feature`](./scenarios.feature)
- **Testes de Aceitação:** [`acceptance-tests.md`](./acceptance-tests.md)
- **DDD-GUIDE:** [`docs/summaries/ddd-summary.md`](../../summaries/ddd-summary.md)
- **Architecture:** [`docs/summaries/arch-decisions-summary.md`](../../summaries/arch-decisions-summary.md)

---

## Notas Adicionais (Opcional)

N/A.

---

**Criado em:** 2026-03-04  
**Atualizado em:** 2026-03-04  
**Responsável:** Product Manager Agent
