#!/bin/bash
set -euo pipefail

# Source ANTHROPIC_API_KEY from ~/.zshrc if not already in env
if [ -z "${ANTHROPIC_API_KEY:-}" ] && [ -f "$HOME/.zshrc" ]; then
  export ANTHROPIC_API_KEY="$(grep -E '^export ANTHROPIC_API_KEY=' "$HOME/.zshrc" | head -1 | sed -E 's/^export ANTHROPIC_API_KEY="?([^"]*)"?.*/\1/')"
fi

# Install deps if node_modules missing but package.json exists
if [ -f package.json ] && [ ! -d node_modules ]; then
  npm install --silent
fi

# Ensure .env.local has the key (idempotent)
if [ -n "${ANTHROPIC_API_KEY:-}" ] && [ ! -f .env.local ]; then
  echo "ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY" > .env.local
fi

echo "Agent memory environment ready"
