#!/bin/bash

# validate-user-story.sh — Validação automatizada de User Story
# 
# Uso: ./scripts/validate-user-story.sh --id 025
#
# Valida 11 itens do checklist do PM Agent:
# 1. Título <50 caracteres
# 2. Como/Quero/Para que presentes
# 3. Bounded Context identificado
# 4. Prioridade definida (P0/P1/P2)
# 5. Critérios de Aceitação (mínimo 3, máximo 10)
# 6. Termos do glossário usados
# 7. Estimativa presente (1, 2, 3, 5, 8, 13)
# 8. Regras de negócio mapeadas
# 9. Eventos de domínio identificados
# 10. Dependências listadas
# 11. DoD completo

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Variables
US_ID=""
ERRORS=0
WARNINGS=0

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --id)
      US_ID="$2"
      shift 2
      ;;
    -h|--help)
      echo "Uso: ./scripts/validate-user-story.sh --id <ID>"
      echo ""
      echo "Argumentos:"
      echo "  --id <ID>   Número da US (ex: 025) ou ID completo (ex: US-025)"
      echo ""
      echo "Exemplo:"
      echo "  ./scripts/validate-user-story.sh --id 025"
      exit 0
      ;;
    *)
      echo -e "${RED}Argumento desconhecido: $1${NC}"
      exit 1
      ;;
  esac
done

# Validate argument
if [ -z "$US_ID" ]; then
  echo -e "${RED}Erro: --id é obrigatório${NC}"
  exit 1
fi

# Format US ID
if [[ ! "$US_ID" =~ ^US- ]]; then
  US_ID=$(printf "US-%03d" "$US_ID")
fi

# Find US directory
US_DIR=$(find docs/user-stories -type d -name "${US_ID}-*" | head -n 1)

if [ -z "$US_DIR" ]; then
  echo -e "${RED}Erro: User Story ${US_ID} não encontrada em docs/user-stories/${NC}"
  exit 1
fi

STORY_FILE="${US_DIR}/story.md"

if [ ! -f "$STORY_FILE" ]; then
  echo -e "${RED}Erro: ${STORY_FILE} não existe${NC}"
  exit 1
fi

echo -e "${GREEN}Validando User Story: ${US_ID}${NC}"
echo "📁 Arquivo: ${STORY_FILE}"
echo ""

# Read file content
CONTENT=$(cat "$STORY_FILE")

# ==========================================
# Validation 1: Título < 50 caracteres
# ==========================================
echo -n "1️⃣  Título < 50 caracteres... "
TITLE=$(echo "$CONTENT" | grep -m 1 "^# US-" | sed 's/^# //')
TITLE_LENGTH=${#TITLE}

if [ "$TITLE_LENGTH" -le 50 ]; then
  echo -e "${GREEN}✅ OK${NC} (${TITLE_LENGTH} chars)"
else
  echo -e "${RED}❌ ERRO${NC} (${TITLE_LENGTH} chars, máximo 50)"
  ERRORS=$((ERRORS + 1))
fi

# ==========================================
# Validation 2: Como/Quero/Para que
# ==========================================
echo -n "2️⃣  Como/Quero/Para que... "
if echo "$CONTENT" | grep -q "^\*\*Como\*\*" && \
   echo "$CONTENT" | grep -q "^\*\*Quero\*\*" && \
   echo "$CONTENT" | grep -q "^\*\*Para que\*\*"; then
  echo -e "${GREEN}✅ OK${NC}"
else
  echo -e "${RED}❌ ERRO${NC} (faltando Como/Quero/Para que)"
  ERRORS=$((ERRORS + 1))
fi

# ==========================================
# Validation 3: Bounded Context
# ==========================================
echo -n "3️⃣  Bounded Context... "
if echo "$CONTENT" | grep -q "^\*\*Bounded Context:\*\*" && \
   echo "$CONTENT" | grep -E "Worship|Team|Media|User Management"; then
  CONTEXT=$(echo "$CONTENT" | grep "^\*\*Bounded Context:\*\*" | sed 's/^.*: //')
  echo -e "${GREEN}✅ OK${NC} (${CONTEXT})"
else
  echo -e "${RED}❌ ERRO${NC} (Bounded Context não identificado)"
  ERRORS=$((ERRORS + 1))
fi

# ==========================================
# Validation 4: Prioridade (P0/P1/P2)
# ==========================================
echo -n "4️⃣  Prioridade definida... "
if echo "$CONTENT" | grep -qE "^\*\*Prioridade:\*\* P[0-2]"; then
  PRIORITY=$(echo "$CONTENT" | grep "^\*\*Prioridade:\*\*" | sed 's/^.*: //')
  echo -e "${GREEN}✅ OK${NC} (${PRIORITY})"
else
  echo -e "${RED}❌ ERRO${NC} (Prioridade não definida ou formato incorreto)"
  ERRORS=$((ERRORS + 1))
fi

# ==========================================
# Validation 5: Critérios de Aceitação (3-10)
# ==========================================
echo -n "5️⃣  Critérios de Aceitação (3-10)... "
CRITERIA_COUNT=$(echo "$CONTENT" | grep -E "^[0-9]+\. ✅" | wc -l | tr -d ' ')

if [ "$CRITERIA_COUNT" -ge 3 ] && [ "$CRITERIA_COUNT" -le 10 ]; then
  echo -e "${GREEN}✅ OK${NC} (${CRITERIA_COUNT} critérios)"
elif [ "$CRITERIA_COUNT" -lt 3 ]; then
  echo -e "${RED}❌ ERRO${NC} (${CRITERIA_COUNT} critérios, mínimo 3)"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${YELLOW}⚠️  AVISO${NC} (${CRITERIA_COUNT} critérios, máximo recomendado 10)"
  WARNINGS=$((WARNINGS + 1))
fi

# ==========================================
# Validation 6: Termos do glossário DDD
# ==========================================
echo -n "6️⃣  Termos do glossário DDD... "

# Load glossary terms from ddd-summary.md
GLOSSARY_TERMS="Setlist|Event Setlist|Ministro|Owner|Backing Vocal|TeamMember|Event|Worship|Team|Media"

FOUND_GLOSSARY_TERMS=false
if echo "$CONTENT" | grep -qE "$GLOSSARY_TERMS"; then
  echo -e "${GREEN}✅ OK${NC}"
  FOUND_GLOSSARY_TERMS=true
else
  echo -e "${YELLOW}⚠️  AVISO${NC} (Nenhum termo do glossário encontrado. Verifique se está usando linguagem úbiqua.)"
  WARNINGS=$((WARNINGS + 1))
fi

# Check for incorrect terms
INCORRECT_TERMS="Líder de louvor|repertório|BV|Segunda voz|Catálogo"
if echo "$CONTENT" | grep -qE "$INCORRECT_TERMS"; then
  echo -e "   ${RED}⚠️  AVISO: Termos incorretos detectados!${NC}"
  echo "   Usar: Ministro/Owner (não 'Líder de louvor')"
  echo "   Usar: Setlist (não 'repertório' ou 'catálogo')"
  echo "   Usar: Backing Vocal (não 'BV' ou 'segunda voz')"
  WARNINGS=$((WARNINGS + 1))
fi

# ==========================================
# Validation 7: Estimativa (1, 2, 3, 5, 8, 13)
# ==========================================
echo -n "7️⃣  Estimativa (Fibonacci)... "
if echo "$CONTENT" | grep -qE "^\*\*Estimativa:\*\* (1|2|3|5|8|13) pontos?"; then
  ESTIMATE=$(echo "$CONTENT" | grep "^\*\*Estimativa:\*\*" | sed 's/^.*: //')
  echo -e "${GREEN}✅ OK${NC} (${ESTIMATE})"
else
  echo -e "${RED}❌ ERRO${NC} (Estimativa ausente ou não segue Fibonacci: 1, 2, 3, 5, 8, 13)"
  ERRORS=$((ERRORS + 1))
fi

# ==========================================
# Validation 8: Regras de Negócio
# ==========================================
echo -n "8️⃣  Regras de Negócio... "
if echo "$CONTENT" | grep -q "## Regras de Negócio"; then
  RULES_COUNT=$(echo "$CONTENT" | sed -n '/## Regras de Negócio/,/## /p' | grep -cE "^- " || echo "0")
  if [ "$RULES_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ OK${NC} (${RULES_COUNT} regras)"
  else
    echo -e "${YELLOW}⚠️  AVISO${NC} (Seção presente mas vazia)"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "${YELLOW}⚠️  AVISO${NC} (Seção 'Regras de Negócio' ausente)"
  WARNINGS=$((WARNINGS + 1))
fi

# ==========================================
# Validation 9: Eventos de Domínio
# ==========================================
echo -n "9️⃣  Eventos de Domínio... "
if echo "$CONTENT" | grep -q "## Eventos de Domínio"; then
  EVENTS_COUNT=$(echo "$CONTENT" | sed -n '/## Eventos de Domínio/,/## /p' | grep -cE "^\| \`" || echo "0")
  if [ "$EVENTS_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ OK${NC} (${EVENTS_COUNT} eventos)"
  else
    echo -e "${YELLOW}⚠️  AVISO${NC} (Seção presente mas vazia)"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "${YELLOW}⚠️  AVISO${NC} (Seção 'Eventos de Domínio' ausente)"
  WARNINGS=$((WARNINGS + 1))
fi

# ==========================================
# Validation 10: Dependências
# ==========================================
echo -n "🔟 Dependências... "
if echo "$CONTENT" | grep -q "## Dependências"; then
  echo -e "${GREEN}✅ OK${NC}"
else
  echo -e "${YELLOW}⚠️  AVISO${NC} (Seção 'Dependências' ausente)"
  WARNINGS=$((WARNINGS + 1))
fi

# ==========================================
# Validation 11: Definição de Pronto (DoD)
# ==========================================
echo -n "1️⃣1️⃣ Definição de Pronto (DoD)... "
if echo "$CONTENT" | grep -q "## Definição de Pronto"; then
  DOD_COUNT=$(echo "$CONTENT" | sed -n '/## Definição de Pronto/,/## /p' | grep -cE "^- \[ \]" || echo "0")
  if [ "$DOD_COUNT" -ge 5 ]; then
    echo -e "${GREEN}✅ OK${NC} (${DOD_COUNT} itens)"
  else
    echo -e "${YELLOW}⚠️  AVISO${NC} (DoD com poucos itens: ${DOD_COUNT}, recomendado mínimo 5)"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "${RED}❌ ERRO${NC} (Seção 'Definição de Pronto' ausente)"
  ERRORS=$((ERRORS + 1))
fi

# ==========================================
# Summary
# ==========================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESULTADO DA VALIDAÇÃO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✅ READY FOR DEVELOPMENT${NC}"
  echo "   Todos os critérios atendidos!"
  echo ""
  echo "   Próximos passos:"
  echo "   1. Notificar Architecture Agent para definir contract.yaml"
  echo "   2. Architecture Agent gera scenarios.feature"
  echo "   3. Architecture Agent gera acceptance-tests.md"
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠️  READY WITH WARNINGS${NC}"
  echo "   Erros: ${ERRORS}"
  echo "   Avisos: ${WARNINGS}"
  echo ""
  echo "   User Story pode prosseguir, mas considere revisar os avisos."
  exit 0
else
  echo -e "${RED}❌ NOT READY${NC}"
  echo "   Erros: ${ERRORS}"
  echo "   Avisos: ${WARNINGS}"
  echo ""
  echo "   Corrija os erros antes de marcar como 'Ready for Development'."
  exit 1
fi
