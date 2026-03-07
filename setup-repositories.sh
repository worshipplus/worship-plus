#!/bin/bash

# Script de Setup para Migração de Repositórios
# Organização: worshipplus
# 7 repositórios: docs, agents, poc, frontend, backend, infra, scripts

set -e

ORGANIZATION="worshipplus"
CURRENT_REPO="MatheusLimaGomes/worship-plus"

echo "===================="
echo "🚀 Worship+ Repositório Setup"
echo "===================="
echo ""
echo "Este script irá:"
echo "1. Criar organização GitHub 'worshipplus'"
echo "2. Criar 7 repositórios"
echo "3. Configurar branch protections"
echo "4. Gerar comandos para migração de conteúdo"
echo ""
read -p "Continuar? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ Cancelado"
    exit 1
fi

# Verificar se gh CLI está instalado
if ! command -v gh &> /dev/null
then
    echo "❌ GitHub CLI (gh) não está instalado"
    echo "   Instale com: brew install gh"
    exit 1
fi

# Verificar autenticação
echo "🔐 Verificando autenticação GitHub..."
gh auth status || {
    echo "❌ Não autenticado. Execute: gh auth login"
    exit 1
}

echo "✅ Autenticado"
echo ""

# Criar organização (manual pela UI)
echo "📋 PASSO 1: Criar Organização"
echo "----------------------------"
echo "⚠️  Criar organização requer conta paga ou free trial."
echo "    Alternativa: Use conta pessoal e renomeie repos com 'worship-plus-*'"
echo ""
read -p "Já criou a organização 'worshipplus'? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    echo "👉 Crie manualmente em: https://github.com/organizations/plan"
    echo "   Nome: worshipplus"
    echo "   Email: [seu_email]"
    echo ""
    echo "Depois execute este script novamente."
    exit 0
fi

echo ""
echo "📂 PASSO 2: Criar Repositórios"
echo "-------------------------------"

# Array de repos
declare -a REPOS=(
    "worship-plus::public::Worship+ Documentação Compartilhada (DDD, Architecture, MVP)"
    "worship-plus-agents::public::Agents de IA (Copilot, Cursor) para desenvolvimento consistente"
    "worship-plus-poc::public::POCs e experimentos técnicos (React 19, Supabase, etc.)"
    "worship-plus-frontend::private::Aplicação React 19 + Vite (produção)"
    "worship-plus-backend::private::API/BFF com NestJS (P2, quando necessário)"
    "worship-plus-infra::private::Infrastructure as Code (Terraform + Kubernetes)"
    "worship-plus-scripts::public::Scripts de processamento de mídia e utilitários"
)

for repo_data in "${REPOS[@]}"
do
    IFS='::' read -r repo visibility description <<< "$repo_data"
    
    echo ""
    echo "Criando: 📦 $repo"
    
    if [ "$visibility" = "public" ]; then
        gh repo create "$ORGANIZATION/$repo" \
            --public \
            --description "$description" \
            --confirm || echo "⚠️  Repo já existe ou erro"
    else
        gh repo create "$ORGANIZATION/$repo" \
            --private \
            --description "$description" \
            --confirm || echo "⚠️  Repo já existe ou erro"
    fi
done

echo ""
echo "✅ Repositórios criados (ou já existentes)"
echo ""

# Branch protections (apenas para repos de código)
echo "🔒 PASSO 3: Configurar Branch Protections"
echo "------------------------------------------"

# Para times, configure para 1+ (ex.: REQUIRED_APPROVALS=1).
# Para contexto solo/MVP, use 0 para não bloquear merges por falta de reviewers.
REQUIRED_APPROVALS="${REQUIRED_APPROVALS:-0}"

declare -a CODE_REPOS=(
    "worship-plus-frontend"
    "worship-plus-backend"
    "worship-plus-infra"
)

for repo in "${CODE_REPOS[@]}"
do
    echo "Protegendo branch 'main' em $repo..."
    
    gh api \
        --method PUT \
        -H "Accept: application/vnd.github+json" \
        "/repos/$ORGANIZATION/$repo/branches/main/protection" \
    -f required_status_checks='{"strict":true,"contexts":["🔍 Lint & Code Quality","🔷 TypeScript Type Check","🧪 Run Tests","🔒 Security Audit","🏗️ Build Application","🎭 E2E Tests"]}' \
        -f enforce_admins=false \
    -f required_pull_request_reviews="{\"dismiss_stale_reviews\":true,\"require_code_owner_reviews\":false,\"require_last_push_approval\":false,\"required_approving_review_count\":${REQUIRED_APPROVALS}}" \
        -f restrictions=null || echo "⚠️  Branch main ainda não existe ou erro"
done

echo ""
echo "✅ Branch protections configuradas"
echo ""

# Gerar comandos de migração
echo "📦 PASSO 4: Migração de Conteúdo"
echo "---------------------------------"
echo ""
echo "⚠️  ATENÇÃO: Os comandos abaixo devem ser executados MANUALMENTE"
echo "   após backup do repositório atual."
echo ""
echo "Backup do repo atual:"
echo "  cd /Users/gomatheus/Desktop"
echo "  tar -czf louvor-adpg-backup-$(date +%Y%m%d).tar.gz louvor-adpg/"
echo ""

cat > migration-commands.sh << 'EOF'
#!/bin/bash
# Comandos de Migração (Executar Manualmente)

ORGANIZATION="worshipplus"
WORKSPACE="/Users/gomatheus/Desktop/louvor-adpg"

echo "===================="
echo "Migração de Conteúdo"
echo "===================="

# 1. Repositório de Docs (worship-plus)
echo ""
echo "📚 1. Migrando worship-plus (docs)..."
cd "$WORKSPACE"
git remote set-url origin "git@github.com:$ORGANIZATION/worship-plus.git"
mv README-worship-plus.md README.md
git add README.md
git add REPOSITORY-STRUCTURE.md
git commit -m "docs: adiciona READMEs para estrutura multi-repo"
git push -u origin main

echo "✅ Docs migrados"

# 2. Repositório de Agents
echo ""
echo "🤖 2. Criando worship-plus-agents..."
cd /tmp
rm -rf worship-plus-agents
git clone "$WORKSPACE" worship-plus-agents
cd worship-plus-agents

# Manter apenas .agents/ e agents/
git filter-repo --path .agents --path agents --force
cp "$WORKSPACE/README-worship-plus-agents.md" README.md
git add README.md
git commit -m "docs: adiciona README do agents repo"
git remote set-url origin "git@github.com:$ORGANIZATION/worship-plus-agents.git"
git push -u origin main

echo "✅ Agents migrado"

# 3. Repositório de POC
echo ""
echo "🧪 3. Criando worship-plus-poc..."
cd /tmp
rm -rf worship-plus-poc
git clone "$WORKSPACE" worship-plus-poc
cd worship-plus-poc

# Manter apenas poc/
git filter-repo --path poc --force
cp "$WORKSPACE/README-worship-plus-poc.md" README.md
git add README.md
git commit -m "docs: adiciona README do poc repo"
git remote set-url origin "git@github.com:$ORGANIZATION/worship-plus-poc.git"
git push -u origin main

echo "✅ POC migrado"

# 4. Scripts (opcional)
echo ""
echo "🛠️  4. Criando worship-plus-scripts (opcional)..."
cd /tmp
rm -rf worship-plus-scripts
git clone "$WORKSPACE" worship-plus-scripts
cd worship-plus-scripts

# Manter apenas scripts/
git filter-repo --path scripts --force
cat > README.md << 'SCRIPTS_README'
# Worship+ Scripts

Utilitários para processamento de mídia:
- `palette-extractor.js`: Extrai paletas de cores de imagens
- `image-processor.js`: Redimensiona e otimiza imagens
- `video-processor.js`: Processa vídeos (thumbnails, metadata)

## Setup
\`\`\`bash
npm install
node palette-extractor.js [imagem]
\`\`\`
SCRIPTS_README

git add README.md
git commit -m "docs: adiciona README do scripts repo"
git remote set-url origin "git@github.com:$ORGANIZATION/worship-plus-scripts.git"
git push -u origin main

echo "✅ Scripts migrado"

# 5. Frontend (criar durante Sprint 1)
echo ""
echo "⏸️  Frontend será criado em Sprint 1"
echo "   Comando:"
echo "   cd /tmp && npm create vite@latest worship-plus-frontend -- --template react"
echo "   cd worship-plus-frontend"
echo "   cp '$WORKSPACE/README-worship-plus-frontend.md' README.md"
echo "   git init && git add . && git commit -m 'feat(setup): inicializa React 19 + Vite [US-001]'"
echo "   git remote add origin git@github.com:$ORGANIZATION/worship-plus-frontend.git"
echo "   git push -u origin main"

# 6. Backend (criar em P2)
echo ""
echo "⏸️  Backend será criado em P2"
echo "   Comando:"
echo "   cd /tmp && npx @nestjs/cli new worship-plus-backend"
echo "   cd worship-plus-backend"
echo "   cp '$WORKSPACE/README-worship-plus-backend.md' README.md"
echo "   git add README.md && git commit -m 'docs: adiciona README'"
echo "   git remote set-url origin git@github.com:$ORGANIZATION/worship-plus-backend.git"
echo "   git push -u origin main"

# 7. Infra (criar em P1)
echo ""
echo "⏸️  Infra será criado em P1"
echo "   Comando:"
echo "   cd /tmp && mkdir worship-plus-infra"
echo "   cd worship-plus-infra"
echo "   cp '$WORKSPACE/README-worship-plus-infra.md' README.md"
echo "   mkdir -p terraform/environments/{dev,staging,prod}"
echo "   mkdir -p terraform/modules"
echo "   git init && git add . && git commit -m 'feat(infra): inicializa estrutura Terraform'"
echo "   git remote add origin git@github.com:$ORGANIZATION/worship-plus-infra.git"
echo "   git push -u origin main"

echo ""
echo "===================="
echo "✅ Migração Completa"
echo "===================="
echo ""
echo "Próximos passos:"
echo "1. Verificar todos os repos: gh repo list $ORGANIZATION"
echo "2. Clonar workspace local dos 3 repos principais:"
echo "   cd ~/Projects/worshipplus"
echo "   gh repo clone $ORGANIZATION/worship-plus"
echo "   gh repo clone $ORGANIZATION/worship-plus-agents"
echo "   gh repo clone $ORGANIZATION/worship-plus-poc"
echo "3. Durante Sprint 1: Criar worship-plus-frontend"
echo "4. Durante P1: Criar worship-plus-infra (S3 + CloudFront)"
echo "5. Durante P2: Criar worship-plus-backend (NestJS)"

EOF

chmod +x migration-commands.sh

echo ""
echo "✅ Arquivo migration-commands.sh criado"
echo ""
echo "👉 Review os comandos antes de executar:"
echo "   cat migration-commands.sh"
echo ""
echo "👉 Executar migração:"
echo "   bash migration-commands.sh"
echo ""

# Verificar repos criados
echo "📋 PASSO 5: Verificar Repositórios Criados"
echo "--------------------------------------------"
echo ""
gh repo list "$ORGANIZATION" --limit 10

echo ""
echo "===================="
echo "✅ Setup Completo"
echo "===================="
echo ""
echo "Próximos passos:"
echo "1. Fazer backup: tar -czf louvor-adpg-backup.tar.gz /Users/gomatheus/Desktop/louvor-adpg"
echo "2. Revisar: cat migration-commands.sh"
echo "3. Executar: bash migration-commands.sh"
echo "4. Verificar: gh repo list $ORGANIZATION"
echo ""
