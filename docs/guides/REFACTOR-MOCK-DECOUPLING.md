# Refatoração: Prompt Curto para Desacoplar Mocks

Versão: 2.1  
Status: pronto para uso no agente  
Objetivo: desacoplar frontend dos mocks com adapters, use cases e hooks, mantendo linguagem ubíqua do projeto.

---

## Prompt Para Executar

Use este texto como problem statement no agente:

```text
Refatore o frontend para separar regras de negócio, estado de UI e origem de dados, removendo acoplamento direto a src/mocks.

Meta arquitetural (obrigatória):
1) domain/types = apenas formato de dados, sem valores fixos de mock.
2) adapters/contracts = protocolos de acesso a dados.
3) adapters/implementations = implementações concretas (mock agora, API depois).
4) usecases = regras de negócio puras (sem React).
5) hooks = orquestração de UI (loading/error/state), chamando use cases.
6) features = apresentação, consumindo apenas hooks.

Restrições obrigatórias:
- Não usar any explícito.
- Não criar schema/migration/ORM.
- Manter linguagem ubíqua: Setlist, Event Setlist, Event, Owner/Ministro, Privilégio.
- Respeitar perfis: admin, ministro, team-member.
- Mobile-first e testes mínimos para caminho feliz e permissão.

Tarefas:

T1) Criar/ajustar contratos de dados
- src/adapters/contracts/UserSource.ts
- src/adapters/contracts/SetlistSource.ts
- src/adapters/contracts/EventSource.ts

T2) Mover dependência dos mocks para implementações
- src/adapters/implementations/MockUserSource.ts
- src/adapters/implementations/MockSetlistSource.ts
- src/adapters/implementations/MockEventSource.ts

Regra: importações de src/mocks só podem existir em adapters/implementations.

T3) Criar use cases (sem React)
- src/usecases/user/GetAdminUserUseCase.ts
- src/usecases/user/GetMinistrosUseCase.ts
- src/usecases/setlist/SearchSetlistItemsUseCase.ts
- src/usecases/event/GetEventsByOwnerUseCase.ts

T4) Criar hooks para UI
- src/hooks/useGetAdminUser.ts
- src/hooks/useGetMinistros.ts
- src/hooks/useSearchSetlist.ts
- src/hooks/useGetEventsByOwner.ts

Os hooks devem retornar { data, loading, error } (ou nomes equivalentes claros).

T5) Refatorar context e features
- src/context/providers.tsx deve injetar sources (mock agora).
- src/context/auth.tsx deve usar hook/use case e não importar mocks.
- features em src/features/** devem consumir hooks, sem importar mock e sem importar usecase diretamente.

T6) Testes mínimos
- 1 teste de use case (puro, sem React).
- 1 teste de hook (loading/sucesso/erro).
- 1 teste de permissão (usuário sem privilégio não vê ação restrita).

Critérios de aceite:
- grep -r "import.*mock" src/features src/context src/usecases src/hooks retorna zero linhas.
- grep -r "from \"react\"" src/usecases retorna zero linhas.
- lint, build e test:unit passando.
- Troca de Mock para API exige alterar apenas providers/adapters, sem mexer em features.

Validação final (executar nesta ordem):
cd frontend && npm run lint
cd frontend && npm run build
cd frontend && npm run test:unit

Entregar:
- Lista objetiva dos arquivos criados/alterados.
- Resumo do que foi desacoplado.
- Evidências dos 3 comandos de validação.
```

---

## Estrutura Alvo Resumida

```text
src/
  domain/types/
  adapters/
    contracts/
    implementations/
  usecases/
  hooks/
  context/
  features/
```

---

## Checagens Rápidas

```bash
# mocks só em adapters/implementations
grep -r "import.*mock" src/ --exclude-dir=node_modules | grep -v "adapters/implementations"

# use case sem React
grep -r "from \"react\"" src/usecases/

# features sem usecase direto
grep -r "from.*usecases" src/features/
```

Se algum comando retornar linhas, a refatoração ainda está incompleta.

---

## Mapeamento de Erros e Resiliencia

Objetivo: padronizar os erros da funcionalidade para garantir previsibilidade de dominio, boa UX e testes confiaveis.

### Erros de Dominio Prioritarios

| Codigo | Cenario | Regra de dominio | Onde detectar | Acao esperada |
|---|---|---|---|---|
| DOMAIN-001 | Usuario sem privilegio tenta criar/editar/remover Setlist | Apenas admin e ministro podem editar Setlist | use case de Setlist | Bloquear acao e retornar erro de autorizacao |
| DOMAIN-002 | Usuario sem privilegio tenta criar Event | Apenas admin e ministro podem criar Event | use case de Event | Bloquear acao e retornar erro de autorizacao |
| DOMAIN-003 | Usuario sem privilegio tenta editar Owner | Apenas admin pode alterar Owner | use case de Event | Bloquear acao e retornar erro de autorizacao |
| DOMAIN-004 | Usuario sem privilegio tenta editar Event Setlist | Apenas admin ou Owner do Event pode editar Event Setlist | use case de Event Setlist | Bloquear acao e retornar erro de autorizacao |
| DOMAIN-005 | Usuario sem privilegio tenta editar Escala | Apenas admin ou Owner do Event pode editar Escala | use case de Escala | Bloquear acao e retornar erro de autorizacao |
| DOMAIN-006 | Link de YouTube invalido | Musica exige YouTube valido | use case de Setlist | Rejeitar comando com mensagem de validacao |
| DOMAIN-007 | Campos obrigatorios vazios no cadastro de Setlist | title, author e youtubeUrl sao obrigatorios | use case de Setlist | Rejeitar comando com erros por campo |
| DOMAIN-008 | Campos obrigatorios vazios no cadastro de Event | title, date, description e owner sao obrigatorios | use case de Event | Rejeitar comando com erros por campo |
| DOMAIN-009 | Data de Event invalida | Event deve ter data valida em formato ISO | use case de Event | Rejeitar comando com mensagem de data invalida |
| DOMAIN-010 | Musica duplicada no Event Setlist | Nao adicionar musica ja existente no mesmo Event | use case de Event Setlist | Ignorar comando ou retornar erro de duplicidade |
| DOMAIN-011 | Integrante inexistente na Escala | Usuario precisa existir na base carregada | use case de Escala | Rejeitar comando com erro de entidade nao encontrada |
| DOMAIN-012 | Event nao encontrado por id | Operacoes exigem Event existente | use case de Event | Retornar erro de nao encontrado e manter UI estavel |
| DOMAIN-013 | Papel invalido na Escala | Papel deve estar na lista permitida pelo dominio | use case de Escala | Rejeitar comando com erro de validacao |
| DOMAIN-014 | Event Locked recebendo mutacao | Event Locked nao aceita alteracoes de conteudo | use case de Event e Escala | Rejeitar comando com erro de estado invalido |

### Erros de Aplicacao e Infraestrutura

| Codigo | Cenario | Tratamento no hook | Comportamento da UI |
|---|---|---|---|
| APP-001 | Falha de rede ao listar dados | setar error e loading false | Exibir estado de erro com opcao de tentar novamente |
| APP-002 | Timeout de requisicao | mapear para erro recuperavel | Exibir mensagem amigavel e permitir retry |
| APP-003 | Resposta malformada do adapter | validar shape antes de seguir | Exibir fallback seguro e logar erro |
| APP-004 | Falha inesperada em use case | capturar e mapear para erro generico | Nao quebrar tela; manter navegacao funcional |

### Contrato de Erro Recomendado

Use um erro padrao para reduzir ambiguidade entre camadas:

```text
DomainError {
  code: string
  message: string
  details?: Record<string, unknown>
}
```

Recomendacao de mapeamento por camada:
- usecase: lanca DomainError com code estavel
- hook: transforma em estado de UI { error, loading }
- componente: exibe mensagem amigavel sem vazar detalhes tecnicos

### Casos de Teste Minimos para Resiliencia

Adicionar, no minimo, os testes abaixo:

1. autorizacao negada em Setlist para team-member
2. autorizacao negada em criacao de Event para team-member
3. bloqueio de mutacao em Event Locked
4. validacao de YouTube invalido no cadastro de Setlist
5. validacao de data invalida no cadastro de Event
6. tentativa de duplicar musica no Event Setlist
7. tentativa de adicionar integrante inexistente na Escala
8. fallback de erro de rede em hook com loading finalizado

### Criterio de Qualidade para Aceite

A task so pode ser considerada concluida quando:
- todos os erros DOMAIN-001..DOMAIN-014 tiverem cobertura por teste de use case ou integracao de hook
- nenhum erro de dominio for tratado diretamente no componente
- mensagens de erro para usuario forem claras e sem detalhes tecnicos internos
