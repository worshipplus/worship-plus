# PRD-005 — Chore: Guard Rails para Imports CSS e Ordem de Diretivas

## 1. Objetivo
Evitar regressões de build causadas por ordem inválida de diretivas CSS, especialmente casos em que @import aparece após outras diretivas como @tailwind, garantindo falha antecipada no fluxo local e na CI.

## 2. Problema
Hoje, erros de ordem de diretivas CSS podem passar pelas validações iniciais e aparecer apenas durante execução do Vite ou build, gerando retrabalho e atraso no ciclo de entrega.

Exemplo de falha recorrente:
- @import posicionado após @tailwind em index.css
- @import em sequência inválida em index.css

## 3. Escopo MVP
- Corrigir a ordem de diretivas no CSS global para conformidade com a especificação.
- Adicionar lint específico para CSS que valide posição de @import e diretivas relacionadas.
- Integrar validação CSS ao fluxo de guard rails local e CI.
- Documentar o novo padrão de ordem de diretivas CSS.

## 4. Fora de Escopo
- Refatoração visual de estilos.
- Migração de arquitetura de estilos (ex.: CSS Modules, styled-components).
- Reestruturação ampla de tokens ou temas.
- Alterações de domínio funcional do produto.

## 5. Requisitos Funcionais
1. O arquivo CSS global deve manter @import no topo, antes de outras diretivas válidas.
2. O pipeline de lint deve falhar quando houver ordem inválida de @import.
3. O fluxo local deve detectar o erro antes do push para remoto.
4. A CI deve manter validação explícita de CSS para esse cenário.

## 6. Requisitos Não Funcionais
- Detecção rápida de erro, preferencialmente em pre-commit/pre-push.
- Mensagem de erro clara para correção imediata.
- Baixa complexidade de manutenção da configuração.
- Compatível com stack atual de frontend (React + Vite + Tailwind + ESLint + Prettier).

## 7. Estratégia de Implementação
1. Ajustar ordem no CSS global:
- Garantir sequência válida de diretivas em index.css

2. Introduzir lint CSS:
- Adotar ferramenta de lint CSS com regras para at-rules e posição de imports.
- Configurar script dedicado no frontend package scripts.

3. Integrar guard rails:
- Incluir lint CSS no fluxo de commit/push.
- Incluir lint CSS no job de qualidade da CI em ci-cd.yml

4. Documentar convenção:
- Atualizar documentação de guard rails em REPOSITORY-GUARDRAILS.md
- Atualizar workflow local em LOCAL-TESTING-WORKFLOW.md

## 8. Critérios de Aceitação
- [x] Ordem de diretivas CSS corrigida no arquivo global.
- [x] Existe comando de lint CSS no frontend e ele falha com ordem inválida.
- [x] Hook local bloqueia push/commit quando houver erro CSS crítico de diretiva.
- [x] CI reprova PR com erro de ordem de @import.
- [x] Documentação de padrão de ordem CSS foi atualizada.
- [ ] Execução local de lint, build e testes permanece estável.

## 9. Dependências
- Configuração atual de scripts do frontend em package.json
- Hooks locais em pre-commit e pre-push
- Política de guard rails em REPOSITORY-GUARDRAILS.md

## 10. Riscos e Mitigações
- Risco: excesso de regras gerando falso positivo.
- Mitigação: iniciar com conjunto mínimo de regras focadas em ordem de diretivas.

- Risco: aumento de tempo no fluxo local.
- Mitigação: execução seletiva em staged quando possível.

## 11. Métricas de Sucesso
- Zero ocorrência de erro de build por @import fora de ordem em PRs após adoção.
- Redução de falhas tardias de CSS detectadas apenas no build.
- 100% dos PRs com validação CSS passando na CI.

## 12. Entregáveis
- Correção de diretiva no CSS global (`src/index.css`).
- Configuração de lint CSS (`frontend/.stylelintrc.cjs`).
- Scripts e hooks atualizados (`package.json`, `.lintstagedrc.cjs`, `pre-push`).
- Pipeline CI com validação CSS (`ci-cd.yml`).
- Documentação de guard rail atualizada (`REPOSITORY-GUARDRAILS.md`, `LOCAL-TESTING-WORKFLOW.md`).
