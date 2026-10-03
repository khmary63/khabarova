#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
command -v bun >/dev/null || { echo "Bun is required" >&2; exit 1; }
NM_LOCK_BACKUP=$(mktemp)
cp bun.lock "$NM_LOCK_BACKUP"
trap 'cp "$NM_LOCK_BACKUP" bun.lock; rm -f "$NM_LOCK_BACKUP"' EXIT
sed -i -E 's#https://[a-z0-9-]+-npm\.pkg\.dev/lovable-core-prod/sandbox-npm-cache#https://registry.npmjs.org#g' bun.lock
bun install --frozen-lockfile
bunx --no-install tsc --noEmit
bun test tests/agency-leads.test.ts
VPS_BUILD=1 bun run build
test -f .output/server/index.mjs
test -d .output/public
echo "VPS artifact: .output/ (server and public together)"
