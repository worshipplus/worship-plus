# US-002: Checklist de Testes de Aceitação

**Feature:** [Nome da Feature]  
**Bounded Context:** [Context]  
**Testado por:** [Nome do QA/Dev]  
**Data:** [data]  
**Ambiente:** [ ] Staging | [ ] Production

---

## ✅ Testes Funcionais

### Happy Path (Fluxos de Sucesso)

- [ ] **[Cenário 1]:** [Descrição do teste]
  - [ ] Input: [dados de entrada]
  - [ ] Output esperado: [resultado]
  - [ ] Efeitos colaterais verificados

- [ ] **[Cenário 2]:** [Descrição do teste]
  - [ ] Input: [dados]
  - [ ] Output: [resultado]

### Validações de Input

- [ ] Campo [campo1] aceita apenas [formato]
- [ ] Campo [campo2] é obrigatório
- [ ] Campo [campo3] tem limite de [X] caracteres
- [ ] Validação client-side funciona (antes de submit)
- [ ] Validação server-side funciona (RLS/API)

### Casos de Erro

- [ ] Erro [tipo] exibe mensagem clara: "[mensagem]"
- [ ] Erro de rede exibe retry/fallback
- [ ] Timeout após [X] segundos exibe mensagem
- [ ] Estado da aplicação permanece consistente após erro

---

## ✅ Testes de Segurança

### Autenticação e Autorização

- [ ] Apenas usuários autenticados podem acessar [feature]
- [ ] Redirecionamento para `/login` se não autenticado
- [ ] Role [admin/ministro/member] tem acesso correto
- [ ] Usuário não pode acessar recursos de outros usuários

### Validações de Segurança

- [ ] Inputs são sanitizados (XSS prevention)
- [ ] SQL injection não é possível (RLS + prepared statements)
- [ ] CSRF tokens implementados (se forms tradicionais)
- [ ] Rate limiting configurado ([X] req/min)
- [ ] HTTPS obrigatório em produção
- [ ] Tokens JWT não estão expostos em localStorage (httpOnly cookies)

---

## ✅ Testes de UI/UX

### Responsividade

- [ ] Mobile (360px): Layout funcional, sem scroll horizontal
- [ ] Tablet (768px): Layout adaptado
- [ ] Desktop (1440px): Layout otimizado
- [ ] Breakpoints intermediários funcionam

### Acessibilidade (WCAG 2.1 - Level AA)

- [ ] Todos os inputs têm `<label>` associados
- [ ] ARIA labels em elementos interativos
- [ ] Navegação por teclado (TAB) funciona
- [ ] Indicadores de foco visíveis
- [ ] Contraste de cores ≥ 4.5:1 (texto normal)
- [ ] Contraste de cores ≥ 3:1 (texto grande/ícones)
- [ ] Screen readers podem navegar (testado com VoiceOver/NVDA)

### Feedback ao Usuário

- [ ] Loading spinner durante operações assíncronas
- [ ] Mensagens de sucesso exibidas (ex: "Salvo com sucesso!")
- [ ] Mensagens de erro claras e acionáveis
- [ ] Confirmação antes de ações destrutivas (ex: deletar)
- [ ] Botões desabilitados durante processamento (prevent double-submit)

### Performance Percebida

- [ ] Skeleton loaders em carregamento inicial
- [ ] Lazy loading de imagens ativado
- [ ] Scroll infinito funciona (se lista longa)
- [ ] Transições suaves (sem janks)

---

## ✅ Testes de Integração

### APIs e Banco de Dados

- [ ] Request para API retorna em < [X]ms (p95)
- [ ] Dados são persistidos corretamente no DB
- [ ] RLS policies impedem acesso não autorizado
- [ ] Foreign keys estão corretas
- [ ] Indexes otimizam queries (EXPLAIN ANALYZE)

### Eventos de Domínio

- [ ] Evento `[EventName]` é disparado ao [ação]
- [ ] Listener no contexto `[TargetContext]` recebe evento
- [ ] Ação consequente `[ação]` é executada corretamente
- [ ] Falha em listener não afeta operação principal

### Integrações Externas (se aplicável)

- [ ] Integração com [serviço] funciona
- [ ] Retry implementado em caso de falha
- [ ] Timeout configurado ([X] segundos)
- [ ] Fallback/degradação graceful implementado

---

## ✅ Testes de Regressão

### Features Relacionadas

- [ ] [Feature A] ainda funciona após mudanças
- [ ] [Feature B] não foi afetada
- [ ] Fluxos críticos end-to-end funcionam

### Testes Automatizados

- [ ] Unit tests passam (coverage ≥ 80%)
- [ ] Integration tests passam
- [ ] E2E tests passam (se implementados)
- [ ] Lint sem erros (`npm run lint`)
- [ ] Build sem warnings (`npm run build`)

---

## ✅ Testes de Performance

### Métricas Web Vitals (Lighthouse)

- [ ] **LCP (Largest Contentful Paint):** < 2.5s
- [ ] **FID (First Input Delay):** < 100ms
- [ ] **CLS (Cumulative Layout Shift):** < 0.1
- [ ] **Performance Score:** ≥ 90

### Carga e Stress

- [ ] [X] usuários simultâneos sem degradação
- [ ] Lista com 1000+ itens carrega em < 3s
- [ ] Pagination/virtualização funciona
- [ ] Memória não vaza após uso prolongado

---

## ✅ Testes de Compatibilidade

### Browsers

- [ ] Chrome/Edge (últimas 2 versões)
- [ ] Firefox (últimas 2 versões)
- [ ] Safari (últimas 2 versões)
- [ ] Mobile Safari iOS 14+
- [ ] Chrome Android 10+

### Dispositivos

- [ ] iPhone 12/13/14 (iOS 15+)
- [ ] Samsung Galaxy S21+ (Android 11+)
- [ ] iPad (últimas 2 gerações)

---

## ✅ Testes de Deploy

### Staging

- [ ] Deploy em staging via CI/CD
- [ ] Smoke tests passam
- [ ] Migrations aplicadas corretamente
- [ ] Environment variables configuradas

### Production

- [ ] Deploy em produção (blue-green/canary)
- [ ] Rollback plan documentado e testado
- [ ] Monitoring ativo (Sentry, Analytics)
- [ ] Health check endpoint retorna 200

---

## 📝 Notas e Observações

[Espaço para anotações durante testes, bugs encontrados, melhorias sugeridas]

---

## ✅ Sign-off

- [ ] **Product Owner:** Aprovado  
- [ ] **QA Lead:** Aprovado  
- [ ] **Tech Lead:** Aprovado  

**Assinaturas:**
- PO: __________________ Data: __/__/____
- QA: __________________ Data: __/__/____
- Tech: ________________ Data: __/__/____

---

**Status Final:** [ ] ✅ APROVADO | [ ] ❌ REQUER AJUSTES | [ ] ⏸️ BLOQUEADO

**Próximos Passos:**
- [ ] Merge para `develop`
- [ ] Deploy em staging
- [ ] QA final em staging
- [ ] Merge para `main`
- [ ] Deploy em produção
- [ ] Post-deployment validation
