# Pre-Commit Checklist

**IMPORTANTE:** Sempre execute este checklist antes de qualquer commit!

## ✅ Checklist Obrigatório

### 1. Verificar Untracked Changes
```bash
# Listar arquivos não rastreados
git status --short

# Ver arquivos untracked especificamente
git ls-files --others --exclude-standard

# Contar arquivos untracked
git ls-files --others --exclude-standard | wc -l
```

**Regra:** Se houver arquivos untracked, avaliar se devem ser adicionados ao commit atual ou a um commit separado.

### 2. Verificar Arquivos Modificados
```bash
# Ver mudanças unstaged
git diff --name-status

# Ver mudanças staged
git diff --cached --name-status
```

### 3. Revisar Mudanças Antes de Stage
```bash
# Ver diff completo antes de adicionar
git diff [arquivo]

# Adicionar interativamente (recomendado)
git add -p
```

### 4. Validar Qualidade do Código
```bash
# Se houver linter configurado
npm run lint

# Se houver testes
npm test

# Se houver type checking
npm run type-check
```

### 5. Commit Message Guidelines
- **feat:** nova funcionalidade
- **fix:** correção de bug
- **docs:** documentação
- **style:** formatação, ponto e vírgula faltando
- **refactor:** refatoração de código
- **test:** adição/correção de testes
- **chore:** tarefas de manutenção

**Formato:**
```
tipo(escopo): descrição curta

- Detalhe 1
- Detalhe 2
- Detalhe 3
```

### 6. Verificar Branch
```bash
# Confirmar que está no branch correto
git branch --show-current

# Ver status do branch vs remote
git status
```

## 🔴 Erros Comuns a Evitar

1. ❌ Commitar arquivos sensíveis (`.env`, credenciais)
2. ❌ Deixar `console.log()` em produção
3. ❌ Commitar código comentado ou dead code
4. ❌ Commitar dependências (`node_modules/`)
5. ❌ Ignorar arquivos untracked relevantes
6. ❌ Commits muito grandes (usar commits atômicos)
7. ❌ Mensagens de commit vagas ("fix", "update", "changes")

## 📋 Template de Verificação Rápida

Antes de `git commit`:
```bash
# 1. Ver o que será commitado
git status

# 2. Ver arquivos untracked
echo "=== UNTRACKED FILES ===" && git ls-files --others --exclude-standard

# 3. Ver diff do que será commitado
git diff --cached

# 4. Confirmar que tudo está correto
echo "Tudo certo? [y/n]"
```

## 🤖 Automação (Opcional)

### Git Hook: pre-commit
Criar arquivo `.git/hooks/pre-commit`:
```bash
#!/bin/bash

echo "🔍 Verificando untracked files..."
UNTRACKED=$(git ls-files --others --exclude-standard)

if [ -n "$UNTRACKED" ]; then
    echo "⚠️  ATENÇÃO: Existem arquivos untracked:"
    echo "$UNTRACKED"
    echo ""
    echo "Deseja continuar com o commit? [y/n]"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "❌ Commit cancelado."
        exit 1
    fi
fi

echo "✅ Checklist OK. Prosseguindo com commit..."
```

Tornar executável:
```bash
chmod +x .git/hooks/pre-commit
```

---

**Mantido por:** Architecture Agent  
**Última atualização:** 2026-03-03  
**Versão:** 1.0.0
