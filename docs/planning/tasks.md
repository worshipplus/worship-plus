---
# TASKS: Reorganizar e documentar o repositório Worship+
---

Objetivo: Reorganizar o trabalho já feito no repositório Worship+ em áreas claras, com critérios de aceitação e passos executáveis, facilitando manutenção e reuso.

Prompt reorganizado (use como `prompt-reorganize-worshipplus.md`):

Objetivo
- Reorganizar e documentar o repositório Worship+ para manutenção, consumo por agentes e replicação em novos repositórios.

Instruções Gerais
- Leia o repositório inteiro e os documentos (RFCs, AGENT.md, COMPONENT_GUIDELINES.md, project-details.md, brainstorm-insights.md).
- Trabalhe por escopo (lista abaixo). Para cada escopo: identifique arquivos atuais, normalize estruturas, defina entradas/saídas, documente acceptance criteria e proponha PRs pequenos e executáveis.
- Produza um `project-organization-plan.md` contendo: visão geral, lista de PRs sugeridos (priorizados), checklist de aceitação por PR e comandos de verificação.
- Preserve histórico: registre todo movimento/remoção em `decision_log.md` com justificativa e link para PR.

Escopos (entregáveis por bloco)

1) Agents (`agents/`)
- O que considerar: AGENT.md, SKILLS.md, RULES.md, decision_log.md, templates e governance.
- Entradas: diretório `agents/`, RFCs e `project-details.md`.
- Saídas: padronização por agent (AGENT.md, SKILLS.md, RULES.md, README), `agents/INDEX.md` e checklist de implantação.
- Critérios: cada agent tem AGENT.md + SKILLS.md + RULES.md + README; `INDEX.md` lista agentes com descrições.

2) POC / Frontend (`poc/`)
- O que considerar: React 19 app, `vite.config.mjs`, `src/`, stories, tests.
- Saídas: mobile-first garantido, README com passos de dev (`npm install`, `npm run dev`), correções para watcher Vite e checklist de bundling.
- Critérios: `npm run dev` inicia sem erros; meta viewport presente; principais views responsivas.

3) Design System
- O que considerar: `components-kit-standard.css`, tokens, `COMPONENT_GUIDELINES.md`, palettes.json.
- Saídas: documentação de tokens, exemplos de uso (Avatar, AudioPlayer), `design/README.md` com breakpoints e touch-targets.
- Critérios: Storybook importa tokens; componentes usam `srcset`/thumbnails.

4) Media Processing & Scripts (`scripts/`)
- O que considerar: scripts de imagem, ffmpeg, `package.json` de scripts.
- Saídas: `scripts/README.md` com install/run, CLI clara (`npm run process`), exemplos de input/output.
- Critérios: instruções para instalar `sharp`/ffmpeg-static e rodar scripts localmente.

5) Infra & Arquitetura Docs (RFCs / decision logs)
- O que considerar: RFCs, `brainstorm-insights.md`, `project-details.md`.
- Saídas: mover RFCs para `/docs/rfcs/` (ou manter na raiz com prefixo), criar `decision_log.md` na raiz e `agents/.../decision_log.md` quando aplicável, gerar ADRs a partir de RFCs aprovadas.
- Critérios: RFCs em português no root; `decision_log.md` com entradas sobre mídia e mobile-first.

6) Product / Backlog
- O que considerar: `project-details.md`, AGENT.md do product-manager.
- Saídas: `backlog/top-10.md` priorizado (RICE/MoSCoW) e templates de user stories com acceptance criteria mobile-first.

7) Tests & CI
- O que considerar: test suites, package scripts, E2E proposals.
- Saídas: matrix de testes (unit/integration/e2e), comandos de CI e E2E minimal (Playwright) para flows críticos.

Formato de execução (passos para o agente/operador)
1. Varredura: listar arquivos por escopo e gerar inventário.
2. Gap analysis por escopo: arquivos ausentes, READMEs faltando, testes faltantes.
3. Gerar PRs sugeridos (título, resumo, arquivos afetados, checklist de aceitação).
4. Criar `project-organization-plan.md` com visão geral e lista de PRs priorizados.

Saída final esperada
- Um único arquivo Markdown `project-organization-plan.md` contendo: visão geral, PRs sugeridos (com patches), checklist de aceitação e comandos para verificação.

Restrições
- Não executar instalações ou pushes sem permissão; proponha comandos a executar localmente.

Exemplo de PR sugerido
- PR title: "agents: padronizar estrutura e criar INDEX.md"
- Changes: adicionar `agents/INDEX.md`; criar stubs AGENT.md/SKILLS.md/RULES.md quando ausentes.
- Acceptance: `agents/INDEX.md` lista todos agents; cada agent tem AGENT.md com scope e owner.

---
Fim do prompt reorganizado.

Próximo passo: o repositório agora contém este prompt aqui em `tasks.md` — execute os passos manualmente ou me peça para gerar os patches/PRs sugeridos.


