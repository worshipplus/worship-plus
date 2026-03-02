---
Title: RFC-0002: Visão Geral do Projeto Worship+
Author: Equipe Worship+
Status: Proposta
Date: 2026-02-23
---

# RFC-0002: Visão Geral do Projeto Worship+

## Resumo

Worship+ é uma plataforma para gestão de grupos de louvor: comunicação, escalas, setlists e eventos. O foco inicial é mobile-first; usuários primários usam celulares para cadastrar eventos e setlist.

## Escopo do MVP

- Autenticação básica (cadastro/login).
- Cadastro e edição de eventos (formulário mobile-first).
- Gerenciamento de setlist (adicionar/editar músicas, link, upload de arranjos e áudio VS).
- Gerenciamento de equipe (perfils, instrumentos, área de atuação).
- Upload e reprodução de áudio com armazenamento S3 (wav/mp3) e downloads em mp3/wav.
- UI responsiva, acessível e testável; Design System + Storybook.

## Requisitos Não-Funcionais

- Mobile-first (UX otimizada para telas pequenas; touch targets ≥44px).
- Performance: reprodução de áudio com CDN, uploads resumíveis quando possível.
- Segurança: presigned URLs, validação de uploads no backend, políticas de IAM.
- Observabilidade e testes (unitários, stories, E2E).

## Arquitetura sugerida (alto nível)

- Frontend: React 19 + Vite, Storybook, componentes mobile-first.
- Backend: Node.js/TypeScript (API REST ou GraphQL), Postgres para metadados, Redis para cache/filas.
- Storage: S3 (ativos) + bucket/backup IA/Glacier (originais arquivados).
- Processamento: Workers (container ou Lambdas) usando ffmpeg para transcodificação e geração de derivados.
- CI/CD: pipeline para testes, lint, build e deploy; infra como código (Terraform / CloudFormation).

## Modelagem de dados (resumo)

- Usuário: nome, email, instrumento, área de atuação, avatar (thumbs).
- Evento: data, título, descrição, escala (lista de usuários).
- Música/Setlist: título, autor, link, partitura/arranjo (arquivo), áudio (VS).
- Equipe: integrantes (lista de usuários).

## Padrões e diretrizes

- Mobile-first e acessibilidade (WCAG).
- Design System centralizado (tokens de cor: bordô #7B112F, offwhite #F8F6F0).
- Uploads por presigned URL e processamento assíncrono.
- Registros de decisões (ADR) para mudanças arquiteturais.

## Riscos e mitigação

- Custo de armazenamento e transcodificação → usar arquivamento automático e monitorar custos.
- Upload móvel falhando → implementar retry/chunked upload e UX de progresso.
- Compatibilidade de librarias com React 19 → validar dependências antes de evoluir.

## Critérios de aceitação do MVP

- Fluxos críticos (criar evento, adicionar música, upload/ reprodução de áudio) funcionam em rede móvel típica.
- UI responsiva para telas <480px e ≥1024px sem layout quebrado.
- Processamento assíncrono de áudio registrado no backend e versões otimizadas entregues via CDN.

## Decisões abertas (encaminhar para brainstorm-insights)

- Tokens de autenticação e política de cadastro (confirmação por email, tokens admin).
- Política detalhada de retenção/arquivamento.
- Estratégia de custos (limites de upload gratuitos, planos).
- Necessidade de suporte a outros formatos além de wav/mp3 no futuro.

## References

- RFC-0001-media-storage.md — detailed media/storage RFC.
- `agents/worship+/frontend-developer-agent/COMPONENT_GUIDELINES.md` — component guidelines and image rules.

## Next steps

- Review RFC with product and architecture stakeholders. Collect answers to open questions and add to `brainstorm-insights.md`.
- After decisions, convert key architecture decisions into ADRs for permanent record.
1. Finish POC and stabilize dev flow (Vite) and Storybook components.
