---
applyTo: "frontend/src/**/*.{ts,tsx,css}"
---
# Performance Guardrails — Rules & Skills (Lighthouse)

**Versão:** 1.0  
**Data:** Maio 2026  
**Status:** Ativo

## Rules (obrigatórias)

1. **Não aumentar bundle inicial sem justificativa**
   - Evite adicionar dependências grandes sem necessidade.
   - Prefira bibliotecas já existentes no projeto.

2. **Carregamento sob demanda para partes não críticas**
   - Use import dinâmico para telas/modais pesados e recursos não essenciais no primeiro paint.

3. **Evitar trabalho síncrono pesado na montagem inicial**
   - Não executar loops/processamentos extensos no render inicial.
   - Mover cálculos derivados para memoização quando necessário.

4. **Imagens e mídia**
   - Sempre definir dimensão previsível para evitar layout shift.
   - Evitar assets muito grandes acima do necessário para viewport mobile.

5. **Estilos**
   - Reutilizar tokens e utilitários; evitar CSS redundante e seletores custosos desnecessários.

6. **Gate local antes de PR**
   - Executar `cd frontend && npm run build`.
   - Executar `cd frontend && npm run lint`.
   - Executar `cd frontend && npm run test:unit`.
   - Se houver mudança visual relevante, validar Lighthouse localmente antes de subir.

## Skills (práticas recomendadas)

1. **Leitura de impacto de performance**
   - Antes de codar, mapear quais imports entram no bundle inicial e quais podem ser adiados.

2. **Estratégia mobile-first também para performance**
   - Priorizar render rápido em 375px e reduzir custo de JS no carregamento inicial.

3. **Uso de React com foco em custo de render**
   - Evitar re-renderizações desnecessárias por estado amplo.
   - Quebrar componentes grandes quando houver ganho claro de isolamento de render.

4. **Validação guiada por métricas**
   - Tratar regressão de Lighthouse como bloqueador quando houver queda consistente.
   - Em caso de oscilação de infraestrutura, ajustar baseline com evidência do histórico de runs.

5. **Checklist de revisão de PR**
   - Verificar se houve aumento de JS inicial.
   - Verificar se a mudança adiciona custo de layout/paint evitável.
   - Verificar se fluxos críticos continuam responsivos em mobile.

