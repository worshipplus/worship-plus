#!/bin/bash

# sprint-report.sh — Gerar relatório de sprint com métricas
# 
# Uso: ./scripts/sprint-report.sh --sprint 1
#
# Gera relatório com:
# - Velocity (pontos entregues)
# - Stories completadas vs planejadas
# - Bugs encontrados
# - Lead time médio
# - Burndown chart data

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Variables
SPRINT_NUMBER=""
OUTPUT_FILE=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --sprint)
      SPRINT_NUMBER="$2"
      shift 2
      ;;
    --output)
      OUTPUT_FILE="$2"
      shift 2
      ;;
    -h|--help)
      echo "Uso: ./scripts/sprint-report.sh --sprint <número> [--output <arquivo>]"
      echo ""
      echo "Argumentos:"
      echo "  --sprint <n>       Número da sprint (ex: 1)"
      echo "  --output <arquivo> Arquivo de saída (padrão: docs/sprint-reports/sprint-N-report.md)"
      echo ""
      echo "Exemplo:"
      echo "  ./scripts/sprint-report.sh --sprint 1"
      exit 0
      ;;
    *)
      echo -e "${RED}Argumento desconhecido: $1${NC}"
      exit 1
      ;;
  esac
done

# Validate
if [ -z "$SPRINT_NUMBER" ]; then
  echo -e "${RED}Erro: --sprint é obrigatório${NC}"
  exit 1
fi

# Set default output file
if [ -z "$OUTPUT_FILE" ]; then
  OUTPUT_FILE="docs/sprint-reports/sprint-${SPRINT_NUMBER}-report.md"
fi

echo -e "${BLUE}Gerando relatório Sprint ${SPRINT_NUMBER}...${NC}"

# Create output directory
mkdir -p "$(dirname "$OUTPUT_FILE")"

# ==========================================
# Collect Data
# ==========================================

# Find all user stories
ALL_STORIES=$(find docs/user-stories -maxdepth 1 -type d -name "US-*" | sort)

# Extract sprint stories from story.md files
SPRINT_STORIES=()
COMPLETED_STORIES=()
TOTAL_POINTS_PLANNED=0
TOTAL_POINTS_DELIVERED=0

echo "📊 Analisando User Stories..."

for story_dir in $ALL_STORIES; do
  STORY_FILE="${story_dir}/story.md"
  
  if [ ! -f "$STORY_FILE" ]; then
    continue
  fi
  
  # Check if story belongs to this sprint
  STORY_SPRINT=$(grep "^\*\*Sprint:\*\*" "$STORY_FILE" | sed 's/^.*Sprint //' | sed 's/[^0-9]//g')
  
  if [ "$STORY_SPRINT" = "$SPRINT_NUMBER" ]; then
    US_ID=$(basename "$story_dir" | sed 's/-.*$//')
    US_TITLE=$(grep "^# US-" "$STORY_FILE" | sed 's/^# //')
    US_POINTS=$(grep "^\*\*Estimativa:\*\*" "$STORY_FILE" | sed 's/^.*: //' | sed 's/ pontos.*//')
    
    SPRINT_STORIES+=("${US_ID}|${US_TITLE}|${US_POINTS}")
    TOTAL_POINTS_PLANNED=$((TOTAL_POINTS_PLANNED + US_POINTS))
    
    # Check if completed (you can customize this check based on your workflow)
    # For now, we assume if DoD section has checked items, it's completed
    COMPLETED_COUNT=$(grep -c "^- \[x\]" "$STORY_FILE" || echo "0")
    TOTAL_DOD=$(grep -c "^- \[ \]" "$STORY_FILE" || echo "1")
    COMPLETION_RATE=$((COMPLETED_COUNT * 100 / TOTAL_DOD))
    
    if [ "$COMPLETION_RATE" -ge 80 ]; then
      COMPLETED_STORIES+=("${US_ID}|${US_TITLE}|${US_POINTS}")
      TOTAL_POINTS_DELIVERED=$((TOTAL_POINTS_DELIVERED + US_POINTS))
    fi
  fi
done

# Calculate metrics
TOTAL_STORIES=${#SPRINT_STORIES[@]}
COMPLETED_COUNT=${#COMPLETED_STORIES[@]}
COMPLETION_PERCENTAGE=$((COMPLETED_COUNT * 100 / TOTAL_STORIES))

echo "   ✅ Stories planejadas: ${TOTAL_STORIES}"
echo "   ✅ Stories completadas: ${COMPLETED_COUNT}"
echo "   📈 Pontos planejados: ${TOTAL_POINTS_PLANNED}"
echo "   📈 Pontos entregues: ${TOTAL_POINTS_DELIVERED}"

# ==========================================
# Generate Report
# ==========================================

echo ""
echo "📝 Gerando relatório..."

cat > "$OUTPUT_FILE" << EOF
# Sprint ${SPRINT_NUMBER} Report — Worship+

**Período:** [Data Início] - [Data Fim]  
**Velocity:** ${TOTAL_POINTS_DELIVERED} pontos (planejado: ${TOTAL_POINTS_PLANNED})  
**Completion Rate:** ${COMPLETION_PERCENTAGE}%

---

## 📊 Métricas

- **Stories Completadas:** ${COMPLETED_COUNT} de ${TOTAL_STORIES} (${COMPLETION_PERCENTAGE}%)
- **Pontos Entregues:** ${TOTAL_POINTS_DELIVERED} de ${TOTAL_POINTS_PLANNED} ($((TOTAL_POINTS_DELIVERED * 100 / TOTAL_POINTS_PLANNED))%)
- **Bugs Encontrados:** [A preencher manualmente]
- **Lead Time Médio:** [A preencher manualmente]

---

## ✅ User Stories Completadas

EOF

# Add completed stories
if [ ${#COMPLETED_STORIES[@]} -eq 0 ]; then
  echo "Nenhuma story completada nesta sprint." >> "$OUTPUT_FILE"
else
  for story in "${COMPLETED_STORIES[@]}"; do
    IFS='|' read -r US_ID US_TITLE US_POINTS <<< "$story"
    echo "${COMPLETED_COUNT}. ✅ ${US_TITLE} (${US_POINTS} pontos)" >> "$OUTPUT_FILE"
  done
fi

echo "" >> "$OUTPUT_FILE"
echo "**Total:** ${TOTAL_POINTS_DELIVERED} pontos" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Add carryover stories
cat >> "$OUTPUT_FILE" << EOF
---

## ⏸️ Carryover (Sprint $((SPRINT_NUMBER + 1)))

EOF

# Find stories not completed
CARRYOVER=false
for story in "${SPRINT_STORIES[@]}"; do
  IFS='|' read -r US_ID US_TITLE US_POINTS <<< "$story"
  
  # Check if this story is NOT in completed list
  IS_COMPLETED=false
  for completed in "${COMPLETED_STORIES[@]}"; do
    if [[ "$completed" == "${US_ID}|"* ]]; then
      IS_COMPLETED=true
      break
    fi
  done
  
  if [ "$IS_COMPLETED" = false ]; then
    echo "- ${US_TITLE} (${US_POINTS} pontos) — [% concluído, aguardando...]" >> "$OUTPUT_FILE"
    CARRYOVER=true
  fi
done

if [ "$CARRYOVER" = false ]; then
  echo "Nenhuma story em carryover. Sprint completada 100%! 🎉" >> "$OUTPUT_FILE"
fi

echo "" >> "$OUTPUT_FILE"

# Add bugs section
cat >> "$OUTPUT_FILE" << EOF
---

## 🐛 Bugs Encontrados

[A preencher manualmente durante a sprint]

- Bug #1: [Descrição] (P0 - critical | P1 - high | P2 - minor) — [Status]
- Bug #2: [Descrição] (P0 - critical | P1 - high | P2 - minor) — [Status]

---

## 📈 Burndown Chart

\`\`\`
Dia  | Pontos Restantes | Ideal
-----|------------------|-------
D1   | ${TOTAL_POINTS_PLANNED}            | ${TOTAL_POINTS_PLANNED}
D2   | [preencher]      | $((TOTAL_POINTS_PLANNED * 13 / 14))
D3   | [preencher]      | $((TOTAL_POINTS_PLANNED * 12 / 14))
D4   | [preencher]      | $((TOTAL_POINTS_PLANNED * 11 / 14))
D5   | [preencher]      | $((TOTAL_POINTS_PLANNED * 10 / 14))
D6   | [preencher]      | $((TOTAL_POINTS_PLANNED * 9 / 14))
D7   | [preencher]      | $((TOTAL_POINTS_PLANNED * 8 / 14))
D8   | [preencher]      | $((TOTAL_POINTS_PLANNED * 7 / 14))
D9   | [preencher]      | $((TOTAL_POINTS_PLANNED * 6 / 14))
D10  | [preencher]      | $((TOTAL_POINTS_PLANNED * 5 / 14))
D11  | [preencher]      | $((TOTAL_POINTS_PLANNED * 4 / 14))
D12  | [preencher]      | $((TOTAL_POINTS_PLANNED * 3 / 14))
D13  | [preencher]      | $((TOTAL_POINTS_PLANNED * 2 / 14))
D14  | ${TOTAL_POINTS_DELIVERED}            | 0
\`\`\`

---

## 🎯 Retrospective

### What Went Well ✅

- [Preencher durante retrospective]
- [Preencher durante retrospective]
- [Preencher durante retrospective]

### What to Improve 🔧

- [Preencher durante retrospective]
- [Preencher durante retrospective]
- [Preencher durante retrospective]

### Action Items 🎬

- [ ] [Action item 1]
- [ ] [Action item 2]
- [ ] [Action item 3]

---

## 📅 Próxima Sprint

**Sprint $((SPRINT_NUMBER + 1)):**  
**Período:** [Data Início] - [Data Fim]  
**Forecast:** [pontos] (carryover + novos)

**Top Prioridades:**
1. [Carregar do backlog após priorização]
2. [Carregar do backlog após priorização]
3. [Carregar do backlog após priorização]

---

**Relatório gerado em:** $(date '+%d/%m/%Y %H:%M')  
**Por:** Sprint Report Script
EOF

echo -e "${GREEN}✅ Relatório gerado com sucesso!${NC}"
echo ""
echo "📁 Arquivo: ${OUTPUT_FILE}"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo "  1. Editar relatório e preencher seções manuais:"
echo "     - Período (datas início e fim)"
echo "     - Bugs encontrados"
echo "     - Lead time médio"
echo "     - Burndown chart (pontos dia a dia)"
echo "     - Retrospective (what went well, improve, actions)"
echo "  2. Compartilhar com time e stakeholders"
echo ""

# Open file in editor if available
if command -v code &> /dev/null; then
  echo "Abrir no VS Code? (y/N)"
  read -r open_editor
  if [[ "$open_editor" =~ ^[Yy]$ ]]; then
    code "$OUTPUT_FILE"
  fi
fi

echo -e "${GREEN}🎉 Concluído!${NC}"
