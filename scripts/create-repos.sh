#!/usr/bin/env bash
# create-repos.sh
# Script to create GitHub repos (private) for Worship+ workspace and push local folders.
# SAFE: the script prints the commands it will run and asks for confirmation.

set -euo pipefail
IFS=$'\n\t'

usage() {
  cat <<EOF
Usage: $0 --owner OWNER [--preserve-history]

Options:
  --owner OWNER         GitHub owner (user or org) where repos will be created.
  --preserve-history    Use git subtree split to preserve history when pushing subfolders (agents/poc).
  --help                Show this help.

This script requires the GitHub CLI (gh) and git installed and authenticated (gh auth login).
It will create the following repos under OWNER:
  - worship-plus
  - worship-plus-agents
  - worship-plus-poc

It will then push the current folder to worship-plus and push subfolders to the other repos.
EOF
}

PRESERVE_HISTORY=0
OWNER=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --owner) OWNER="$2"; shift 2;;
    --preserve-history) PRESERVE_HISTORY=1; shift 1;;
    --help) usage; exit 0;;
    *) echo "Unknown arg: $1"; usage; exit 1;;
  esac
done

if [[ -z "$OWNER" ]]; then
  echo "--owner not provided — attempting to auto-detect GitHub owner..."

  # 1) Try to parse from remote.origin.url if present
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    ORIGIN_URL=$(git config --get remote.origin.url || true)
    if [[ -n "$ORIGIN_URL" ]]; then
      # git@github.com:owner/repo.git
      if [[ "$ORIGIN_URL" =~ git@github.com:(.+)/.+(.git)?$ ]]; then
        OWNER=${BASH_REMATCH[1]}
      fi
      # https://github.com/owner/repo.git or https://user@github.com/owner/repo.git
      if [[ -z "$OWNER" && "$ORIGIN_URL" =~ https://([^/]+)@github.com/([^/]+)/.+ ]]; then
        OWNER=${BASH_REMATCH[2]}
      elif [[ -z "$OWNER" && "$ORIGIN_URL" =~ https://github.com/([^/]+)/.+ ]]; then
        OWNER=${BASH_REMATCH[1]}
      fi
    fi
  fi

  # 2) Try ~/.git-credentials (plain text) for https://user:token@github.com
  if [[ -z "$OWNER" && -f "$HOME/.git-credentials" ]]; then
    GREP_LINE=$(grep github.com "$HOME/.git-credentials" | head -n1 || true)
    if [[ -n "$GREP_LINE" ]]; then
      # parse https://user:token@github.com
      if [[ "$GREP_LINE" =~ https://([^:@]+)@github.com ]]; then
        OWNER=${BASH_REMATCH[1]}
      fi
    fi
  fi

  # 3) Try gh API (if authenticated)
  if [[ -z "$OWNER" ]]; then
    if command -v gh >/dev/null 2>&1; then
      if gh auth status >/dev/null 2>&1; then
        OWNER=$(gh api user --jq .login 2>/dev/null || true)
      fi
    fi
  fi

  # 4) Fallback: prompt user
  if [[ -z "$OWNER" ]]; then
    read -p "Could not auto-detect GitHub owner. Enter OWNER (user or org): " OWNER
  else
    echo "Detected owner: $OWNER"
  fi

  if [[ -z "$OWNER" ]]; then
    echo "No owner specified — aborting." >&2
    exit 1
  fi
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI not found. Install it (brew install gh) and run 'gh auth login' first." >&2
  exit 1
fi

if ! command -v git >/dev/null 2>&1; then
  echo "git not found. Install git first." >&2
  exit 1
fi

ROOT_DIR=$(pwd)
REPOS=("worship-plus" "worship-plus-agents" "worship-plus-poc")

echo "Will create repositories under owner: $OWNER"
for r in "${REPOS[@]}"; do
  echo "  - ${OWNER}/${r}"
done

read -p "Proceed to create these repos and push local folders? (y/N): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborting. No changes made."
  exit 0
fi

# Create repos
for r in "${REPOS[@]}"; do
  if gh repo view "${OWNER}/${r}" >/dev/null 2>&1; then
    echo "Repo ${OWNER}/${r} already exists — skipping create"
  else
    echo "Creating repo ${OWNER}/${r} (private)"
    gh repo create "${OWNER}/${r}" --private --confirm
  fi
done

# Push root (worship-plus) — push current repo contents as initial import
# If current folder is already a git repo, use it; otherwise initialize and push
if [ -d ".git" ]; then
  echo "Root is a git repo — preparing to push to ${OWNER}/worship-plus"

  # If repo has no commits yet, create a safe initial commit without adding all project files.
  if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
    echo "Repository has no commits — creating a safe initial commit (only README or empty)"
    if [ ! -f README.md ]; then
      echo "# worship-plus" > README.md
      git add README.md
      git commit -m "Initial import: worship-plus workspace (README only)"
    else
      # If README exists, commit it; if commit fails, create an empty commit
      git add README.md >/dev/null 2>&1 || true
      git commit -m "Initial import: worship-plus workspace (README)" || git commit --allow-empty -m "Initial import: worship-plus workspace (empty commit)"
    fi
  fi

  if git remote get-url origin >/dev/null 2>&1; then
    echo "Remote origin exists — adding temporary remote 'worship_plus_origin'"
    git remote add worship_plus_origin "git@github.com:${OWNER}/worship-plus.git" || true
    git push worship_plus_origin HEAD:main --set-upstream || git push worship_plus_origin HEAD:master --set-upstream
  else
    git remote add origin "git@github.com:${OWNER}/worship-plus.git"
    git push origin HEAD:main --set-upstream || git push origin HEAD:master --set-upstream
  fi
else
  echo "Root is not a git repo — creating a temporary repo to push root contents"
  TEMP_DIR=$(mktemp -d)
  cp -R . "${TEMP_DIR}/"
  pushd "${TEMP_DIR}" >/dev/null
  git init
  git add .
  git commit -m "Initial import: worship-plus workspace"
  git remote add origin "git@github.com:${OWNER}/worship-plus.git"
  git push origin main --set-upstream || git push origin master --set-upstream
  popd >/dev/null
  rm -rf "${TEMP_DIR}"
fi

# Helper to push a subfolder
push_subfolder() {
  local subpath="$1"
  local target_repo="$2"

  if [ ! -d "${subpath}" ]; then
    echo "Subpath ${subpath} not found — skipping"
    return
  fi

  if [ "$PRESERVE_HISTORY" -eq 1 ]; then
    echo "PRESERVING history for ${subpath} using git subtree split"
    # Create a split branch with history for the subfolder
    SPLIT_BRANCH="split-${subpath//\//-}-$(date +%s)"
    git subtree split --prefix="${subpath}" -b "${SPLIT_BRANCH}" || {
      echo "git subtree split failed for ${subpath}"; return 1
    }
    git remote remove temp_remote || true
    git remote add temp_remote "git@github.com:${OWNER}/${target_repo}.git"
    git push temp_remote "${SPLIT_BRANCH}:main" --force
    git branch -D "${SPLIT_BRANCH}" || true
    git remote remove temp_remote || true
  else
    echo "Pushing contents of ${subpath} without preserving history (simple import)"
    TEMP_DIR=$(mktemp -d)
    rsync -a --exclude='.git' "${subpath}/" "${TEMP_DIR}/"
    pushd "${TEMP_DIR}" >/dev/null
    git init
    git add .
    git commit -m "Import ${subpath} from monorepo"
    git remote add origin "git@github.com:${OWNER}/${target_repo}.git"
    git push origin main --set-upstream --force || git push origin master --set-upstream --force
    popd >/dev/null
    rm -rf "${TEMP_DIR}"
  fi
}

# Push agents
push_subfolder "agents" "worship-plus-agents"
# Push poc
push_subfolder "poc" "worship-plus-poc"

echo "Done. Repositories created and content pushed. Verify remotes and branch protection settings on GitHub." 

# Notes for next steps
cat <<EOF
Next steps (manual):
- Configure branch protection rules on GitHub for 'main' (require PR reviews, status checks).
- Add repository secrets via 'gh secret set' for CI (AWS keys, etc.).
- Consider moving docs to dedicated docs/ repo or GitHub Pages for public docs.
EOF
