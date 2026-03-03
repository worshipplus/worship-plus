#!/bin/bash

# create-user-story.sh — Automação de criação de User Story
# 
# Uso: ./scripts/create-user-story.sh --id 025 --title "criar-evento"
#
# Reduz tempo de criação: 15min manual → 5min automatizado (66% economia)

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
US_ID=""
US_TITLE=""
BOUNDED_CONTEXT=""
PRIORITY=""
ESTIMATE=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --id)
      US_ID="$2"
      shift 2
      ;;
    --title)
      US_TITLE="$2"
      shift 2
      ;;
    --context)
      BOUNDED_CONTEXT="$2"
      shift 2
      ;;
    --priority)
      PRIORITY="$2"
      shift 2
      ;;
    --estimate)
      ESTIMATE="$2"
      shift 2
      ;;
    -h|--help)
      echo "Uso: ./scripts/create-user-story.sh --id <ID> --title <título> [opções]"
      echo ""
      echo "Argumentos obrigatórios:"
      echo "  --id <ID>         Número da US (ex: 025)"
      echo "  --title <título>  Título kebab-case (ex: criar-evento)"
      echo ""
      echo "Argumentos opcionais:"
      echo "  --context <ctx>   Bounded Context (Worship/Team/Media/UserManagement)"
      echo "  --priority <p>    Prioridade (P0/P1/P2)"
      echo "  --estimate <pts>  Estimativa (1/2/3/5/8/13)"
      echo ""
      echo "Exemplo:"
      echo "  ./scripts/create-user-story.sh --id 025 --title \"criar-evento\" --context Worship --priority P0 --estimate 8"
      exit 0
      ;;
    *)
      echo -e "${RED}Argumento desconhecido: $1${NC}"
      exit 1
      ;;
  esac
done

# Validate required arguments
if [ -z "$US_ID" ]; then
  echo -e "${RED}Erro: --id é obrigatório${NC}"
  exit 1
fi

if [ -z "$US_TITLE" ]; then
  echo -e "${RED}Erro: --title é obrigatório${NC}"
  exit 1
fi

# Make sure we're in the workspace root
if [ ! -d "docs/user-stories/_template" ]; then
  echo -e "${RED}Erro: Não encontrei docs/user-stories/_template/. Execute este script da raiz do workspace.${NC}"
  exit 1
fi

# Format US ID with leading zeros
US_ID_FORMATTED=$(printf "US-%03d" "$US_ID")

# Create US directory
US_DIR="docs/user-stories/${US_ID_FORMATTED}-${US_TITLE}"

if [ -d "$US_DIR" ]; then
  echo -e "${YELLOW}Aviso: Diretório ${US_DIR} já existe. Sobrescrever? (y/N)${NC}"
  read -r response
  if [[ ! "$response" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Operação cancelada.${NC}"
    exit 0
  fi
fi

echo -e "${GREEN}Criando User Story ${US_ID_FORMATTED}: ${US_TITLE}${NC}"

# Create directory
mkdir -p "$US_DIR"

# Copy template files
echo "📋 Copiando template files..."
cp docs/user-stories/_template/story.md "$US_DIR/story.md"
cp docs/user-stories/_template/contract.yaml "$US_DIR/contract.yaml"
cp docs/user-stories/_template/scenarios.feature "$US_DIR/scenarios.feature"
cp docs/user-stories/_template/acceptance-tests.md "$US_DIR/acceptance-tests.md"

# Substitute placeholders in story.md
echo "🔧 Substituindo placeholders..."

# Convert title to Title Case
US_TITLE_CAPITALIZED=$(echo "$US_TITLE" | sed 's/-/ /g' | sed 's/\b./\u&/g')

# Substitute in story.md
sed -i '' "s/US-XXX/${US_ID_FORMATTED}/g" "$US_DIR/story.md"
sed -i '' "s/\[Título da Feature\]/${US_TITLE_CAPITALIZED}/g" "$US_DIR/story.md"

# Add optional fields if provided
if [ -n "$BOUNDED_CONTEXT" ]; then
  sed -i '' "s/\[Contexto\]/${BOUNDED_CONTEXT} Context/g" "$US_DIR/story.md"
fi

if [ -n "$PRIORITY" ]; then
  sed -i '' "s/P0 - CRÍTICO/${PRIORITY}/g" "$US_DIR/story.md"
fi

if [ -n "$ESTIMATE" ]; then
  sed -i '' "s/X pontos/${ESTIMATE} pontos/g" "$US_DIR/story.md"
fi

# Substitute in contract.yaml
sed -i '' "s/US-XXX/${US_ID_FORMATTED}/g" "$US_DIR/contract.yaml"
sed -i '' "s/\[Título da Feature\]/${US_TITLE_CAPITALIZED}/g" "$US_DIR/contract.yaml"

# Substitute in scenarios.feature
sed -i '' "s/US-XXX/${US_ID_FORMATTED}/g" "$US_DIR/scenarios.feature"
sed -i '' "s/\[Título da Feature\]/${US_TITLE_CAPITALIZED}/g" "$US_DIR/scenarios.feature"

# Substitute in acceptance-tests.md
sed -i '' "s/US-XXX/${US_ID_FORMATTED}/g" "$US_DIR/acceptance-tests.md"
sed -i '' "s/\[Título da Feature\]/${US_TITLE_CAPITALIZED}/g" "$US_DIR/acceptance-tests.md"

echo -e "${GREEN}✅ User Story criada com sucesso!${NC}"
echo ""
echo "📁 Arquivos criados:"
echo "  - $US_DIR/story.md"
echo "  - $US_DIR/contract.yaml"
echo "  - $US_DIR/scenarios.feature"
echo "  - $US_DIR/acceptance-tests.md"
echo ""
echo -e "${YELLOW}Próximos passos:${NC}"
echo "  1. Editar story.md e preencher:"
echo "     - Como/Quero/Para que"
echo "     - Critérios de Aceitação"
echo "     - Regras de Negócio"
echo "     - Eventos de Domínio"
echo "  2. Validar: ./scripts/validate-user-story.sh --id ${US_ID}"
echo "  3. Notificar Architecture Agent para definir contract.yaml"
echo ""
echo "Abrir editor agora? (y/N)"
read -r open_editor

if [[ "$open_editor" =~ ^[Yy]$ ]]; then
  if command -v code &> /dev/null; then
    code "$US_DIR/story.md"
  elif command -v vim &> /dev/null; then
    vim "$US_DIR/story.md"
  else
    echo -e "${YELLOW}Editor não encontrado. Abra manualmente: $US_DIR/story.md${NC}"
  fi
fi

echo -e "${GREEN}🎉 Concluído!${NC}"
