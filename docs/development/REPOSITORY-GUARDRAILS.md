# 🛡️ Guard Rails do Repositório (CI + Branch Protection)

Este documento descreve os guard rails que evitam quebras de pipeline e reduzem risco de deploy.

## 1) Objetivo

- Evitar drift entre comandos locais e CI
- Barrar quebras antes do push (ex.: incompatibilidades de TypeScript/tsconfig)
- Proteger `main` (trunk) contra force-push e merge sem PR

## 2) Paridade CI ↔ Local

Scripts canônicos (rodar no diretório `frontend/`):

- `npm run -s lint:css` (Stylelint para validar ordem de diretivas CSS, incluindo `@import`)
- `npm run -s tsc:build` (TypeScript build mode com project references)
- `npm run -s build` (encadeia `tsc:build` + build do Vite)

O GitHub Actions deve chamar esses scripts (não comandos “soltos”) para reduzir drift.

## 3) Validação automática antes do push (Husky)

Hook:

- `.husky/pre-push` → roda `npm --prefix frontend run -s ci:prepush`
- `ci:prepush` inclui `lint:css` + `tsc:build` para detectar erro de diretivas CSS antes do push

Break-glass (apenas em casos excepcionais):

- `git push --no-verify`
- ou `HUSKY=0 git push`

## 4) Branch Protection (ação manual no GitHub)

GitHub → **Settings → Branches → Branch protection rules**

### Regra para `main`

Habilitar:

- **Require a pull request before merging**
- **Require approvals** (0 para contexto solo/MVP; 1+ recomendado quando houver time)
- **Require status checks to pass before merging**
- **Require branches to be up to date before merging**
- **Disable force pushes**

Checks recomendados (workflow CI/CD):

- 🔍 Lint & Code Quality
- 🔷 TypeScript Type Check
- 🧪 Run Tests
- 🔒 Security Audit
- 🏗️ Build Application
- 🎭 E2E Tests

Observação: este repositório adota **trunk-based development**, então a governança se concentra em `main`.

## 5) Observabilidade e manutenção

- Sempre que alterar `tsconfig.*` ou versão do TypeScript, rode `npm run -s tsc:build`
- Em caso de quebra no CI, priorize alinhar versão de toolchain (`typescript`, `@typescript-eslint/*`) e scripts canônicos
