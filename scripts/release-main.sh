#!/usr/bin/env bash
# Explicit main-domain release; never reuse the Factory release script.
set -euo pipefail
: "${NM_MAIN_BASE:?Set a dedicated absolute directory for main-domain releases}"
: "${NM_MAIN_COMPOSE:?Set absolute path to the dedicated main compose file}"
: "${NM_MAIN_HEALTH_URL:?Set local main-domain health URL}"
case "$NM_MAIN_BASE" in /*) ;; *) echo "NM_MAIN_BASE must be absolute" >&2; exit 1;; esac
case "$NM_MAIN_BASE $NM_MAIN_COMPOSE $NM_MAIN_HEALTH_URL" in *factory*|*noya*|*crm.neyromarket*) echo "Refusing another service's paths" >&2; exit 1;; esac
[[ -f "$NM_MAIN_COMPOSE" ]] || { echo "Compose file missing" >&2; exit 1; }
[[ ! -e "$NM_MAIN_BASE/current" || -L "$NM_MAIN_BASE/current" ]] || { echo "current must be a release symlink; back up and migrate existing installation first" >&2; exit 1; }
mkdir -p "$NM_MAIN_BASE/releases"
exec 9>"$NM_MAIN_BASE/.release.lock"
flock -n 9 || { echo "Another release is running" >&2; exit 1; }
switch_to() {
  ln -sfn "$1" "$NM_MAIN_BASE/current.next"
  mv -Tf "$NM_MAIN_BASE/current.next" "$NM_MAIN_BASE/current"
}
restart() { docker compose -f "$NM_MAIN_COMPOSE" up -d --force-recreate neyromarket-main; }
health() {
  for ((i=0;i<20;i++)); do
    if curl --max-time 3 -fsS "$NM_MAIN_HEALTH_URL" | grep 'Бизнес третьего' >/dev/null; then return 0; fi
    sleep 2
  done
  return 1
}
case "${1:-}" in
 deploy)
  NM_ARTIFACT=$(realpath "${2:?Pass .output artifact directory}")
  test -f "$NM_ARTIFACT/server/index.mjs"
  test -d "$NM_ARTIFACT/public"
  NM_PREVIOUS=$(readlink "$NM_MAIN_BASE/current" || true)
  NM_RELEASE="$(date -u +%Y%m%d-%H%M%S)-${NM_RELEASE_SHA:-manual}"
  [[ "$NM_RELEASE" =~ ^[a-zA-Z0-9-]+$ ]] || exit 1
  NM_TARGET="releases/$NM_RELEASE"
  [[ ! -e "$NM_MAIN_BASE/$NM_TARGET" ]] || { echo "Release already exists" >&2; exit 1; }
  cp -a "$NM_ARTIFACT" "$NM_MAIN_BASE/$NM_TARGET"
  switch_to "$NM_TARGET"
  if ! restart || ! health; then
    echo "Release failed; rolling back" >&2
    if [[ -n "$NM_PREVIOUS" ]]; then switch_to "$NM_PREVIOUS"; restart; health || true
    else docker compose -f "$NM_MAIN_COMPOSE" stop neyromarket-main; fi
    exit 1
  fi
  if [[ -n "$NM_PREVIOUS" ]]; then printf '%s\n' "$NM_PREVIOUS" > "$NM_MAIN_BASE/previous-release"; fi
  echo "Released $NM_RELEASE; previous artifacts retained"
  ;;
 rollback)
  NM_TARGET=${2:-$(cat "$NM_MAIN_BASE/previous-release")}
  [[ "$NM_TARGET" =~ ^releases/[a-zA-Z0-9-]+$ ]] || { echo "Invalid release path" >&2; exit 1; }
  test -f "$NM_MAIN_BASE/$NM_TARGET/server/index.mjs"
  switch_to "$NM_TARGET"; restart; health
  echo "Rolled back to $NM_TARGET"
  ;;
 *) echo 'Usage: bash scripts/release-main.sh deploy .output | rollback [releases/id]' >&2; exit 1;;
esac
