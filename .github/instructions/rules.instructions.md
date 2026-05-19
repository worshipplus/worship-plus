---
applyTo: "**"
---
# Rules — Políticas de Execução e Qualidade

**Versão:** 1.1  
**Data:** Maio 2026  
**Status:** Ativo (PRD-001)

---

## R-01 — Escopo Estrito por PRD

- Implementar **somente** o que está descrito na seção "Escopo MVP" do PRD.
- Não implementar itens listados em "Fora de Escopo".
- Qualquer extensão de escopo exige novo PRD ou task aprovada.

## R-02 — Sem Modelagem de Banco

- Proibido definir schema, tabelas, migrations, ORMs ou contratos de persistência definitivos.
- Dados devem vir de arquivos de mock em `src/mocks/`.
- Estrutura de mock pode e deve refletir o domínio, mas sem compromisso com estrutura de banco.

## R-03 — Linguagem Ubíqua Obrigatória

- Todos os nomes de variáveis, tipos, props e comentários devem usar a linguagem ubíqua definida em [skills.instructions.md](./skills.instructions.md).
- Pull requests que usem termos alternativos (ex.: "song library" em vez de "Setlist") devem ser corrigidos antes de merge.

## R-04 — Privilégios Aplicados na UI

- Toda ação restrita deve ser condicionada ao privilégio do usuário atual.
- Usuário sem permissão não deve ver o botão/link de ação — ou vê-lo desabilitado com tooltip explicativo.
- Perfis MVP: `admin`, `ministro`, `team-member`.

## R-05 — Validação Obrigatória Antes do PR

Execute em ordem:
```bash
cd frontend
npm run lint        # zero warnings/erros
npm run build       # sem erros de compilação
npm run test:unit   # todos os testes passando
```
Nenhum PR pode ser submetido com falha em qualquer um desses comandos.

## R-06 — TypeScript Sem `any`

- Proibido uso de `any` explícito.
- Usar `unknown` com guard de tipo quando o tipo não puder ser inferido.
- Todos os props de componentes devem ter interface ou type explícito.

## R-07 — Mobile-First

- Todo componente visual deve funcionar em viewport de 375px sem scroll horizontal.
- Responsividade para desktop é adicionada como camada adicional (`md:`, `lg:`).

## R-08 — Testes para Fluxo Principal

- Cada feature deve ter ao menos um teste unitário cobrindo o caminho feliz.
- Testes de permissão são obrigatórios para features com restrição de privilégio.
- Arquivo de teste fica no mesmo diretório do componente: `ComponentName.test.tsx`.

## R-09 — Commits Semânticos

- Formato: `<tipo>(<escopo>): <descrição em minúsculas>`
- Tipos válidos: `feat`, `fix`, `test`, `docs`, `refactor`, `chore`, `style`
- Exemplos:
  - `feat(setlist): add youtube link validation`
  - `test(events): add unit test for event list filter`
  - `docs(instrucional): add PRD-001 artifacts`

## R-10 — Referências Cruzadas com PRDs

- PRD-002 (Setlist): `docs/planning/prds/PRD-002-lista-repertorio-youtube.md`
- PRD-003 (Eventos): `docs/planning/prds/PRD-003-visualizacao-pagina-eventos.md`
- PRD-004 (Usuários): `docs/planning/prds/PRD-004-cadastro-usuario-privilegios.md`
- Instrucional: `.github/instructions/instrucional.instructions.md`
- Skills: `.github/instructions/skills.instructions.md`
- Performance (Rules & Skills): `.github/instructions/performance-rules-skills.instructions.md`

## R-11 — Guard Rails de Performance (Lighthouse)

- Alterações de frontend devem evitar regressão perceptível de performance no carregamento inicial.
- Em mudanças de UI/rotas/componentes, revisar impacto de bundle e custo de render no primeiro paint.
- Em caso de falha do Lighthouse por oscilação de infraestrutura, o baseline só pode ser ajustado com evidência do histórico de runs.
