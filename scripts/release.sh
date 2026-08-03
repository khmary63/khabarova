#!/usr/bin/env bash
#
# Управление релизами на VPS. Запускается self-hosted runner'ом.
#
#   release.sh deploy <каталог_с_артефактом>   — выложить новый релиз
#   release.sh rollback [имя_релиза]           — откатиться (по умолчанию на предыдущий)
#
# Схема каталогов (BASE_DIR):
#   releases/<timestamp>-<sha>/   — распакованные сборки (.output целиком)
#   current -> releases/<...>     — симлинк, который читает контейнер
#
# Контейнер factory-app монтирует BASE_DIR и запускает current/server/index.mjs,
# поэтому переключение симлинка + перезапуск контейнера = атомарная смена версии.

set -euo pipefail

BASE_DIR="${BASE_DIR:-/var/www/factory.neyromarket.com}"
COMPOSE_FILE="${COMPOSE_FILE:-/opt/factory/docker-compose.yml}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3002/}"
PUBLIC_URL="${PUBLIC_URL:-https://factory.neyromarket.com/}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"

log() { printf '\n=== %s ===\n' "$1"; }

restart_app() {
  log "Перезапуск контейнера"
  docker compose -f "$COMPOSE_FILE" up -d --force-recreate factory-app
}

health_check() {
  log "Проверка здоровья: $HEALTH_URL"
  local i
  for i in $(seq 1 20); do
    if curl -fsS -o /dev/null "$HEALTH_URL"; then
      echo "OK (попытка $i)"
      # Публичный адрес проверяем без фатальности: Caddy может ещё держать
      # старое соединение, а сам факт ответа контейнера уже подтверждён.
      curl -fsS -o /dev/null -w "Публичный адрес: %{http_code}\n" "$PUBLIC_URL" || true
      return 0
    fi
    sleep 2
  done
  echo "Контейнер не ответил за 40 секунд" >&2
  docker compose -f "$COMPOSE_FILE" logs --tail=50 factory-app >&2 || true
  return 1
}

current_release() {
  basename "$(readlink -f "$BASE_DIR/current")"
}

deploy() {
  local artifact_dir="$1"
  [ -f "$artifact_dir/server/index.mjs" ] || {
    echo "В артефакте нет server/index.mjs — это не сборка node-server" >&2
    exit 1
  }

  local release_id
  release_id="$(date +%Y%m%d-%H%M%S)-${GITHUB_SHA:-manual}"
  release_id="${release_id:0:60}"

  log "Новый релиз: $release_id"
  mkdir -p "$BASE_DIR/releases"
  cp -a "$artifact_dir" "$BASE_DIR/releases/$release_id"

  local previous=""
  [ -e "$BASE_DIR/current" ] && previous="$(current_release)"

  # ln -sfn + rename внутри одной ФС: читатели видят либо старый, либо новый путь.
  ln -sfn "releases/$release_id" "$BASE_DIR/current.tmp"
  mv -T "$BASE_DIR/current.tmp" "$BASE_DIR/current"

  restart_app

  if ! health_check; then
    if [ -n "$previous" ]; then
      log "Автооткат на $previous"
      ln -sfn "releases/$previous" "$BASE_DIR/current.tmp"
      mv -T "$BASE_DIR/current.tmp" "$BASE_DIR/current"
      restart_app
      health_check || true
    fi
    exit 1
  fi

  log "Чистка старых релизов (оставляем $KEEP_RELEASES)"
  ls -1dt "$BASE_DIR/releases"/*/ | tail -n "+$((KEEP_RELEASES + 1))" | while read -r old; do
    case "$(basename "$old")" in
      "$release_id"|"$previous") continue ;;
    esac
    echo "удаляю $old"
    rm -rf "$old"
  done

  log "Готово: $release_id"
}

rollback() {
  local target="${1:-}"
  local current
  current="$(current_release)"

  if [ -z "$target" ]; then
    # Предыдущий по времени относительно текущего.
    target="$(ls -1dt "$BASE_DIR/releases"/*/ | xargs -n1 basename | grep -vx "$current" | head -1)"
  fi
  [ -n "$target" ] && [ -d "$BASE_DIR/releases/$target" ] || {
    echo "Релиз для отката не найден. Доступные:" >&2
    ls -1t "$BASE_DIR/releases" >&2
    exit 1
  }

  log "Откат: $current -> $target"
  ln -sfn "releases/$target" "$BASE_DIR/current.tmp"
  mv -T "$BASE_DIR/current.tmp" "$BASE_DIR/current"
  restart_app
  health_check
  log "Откат завершён"
}

case "${1:-}" in
  deploy)   deploy "${2:?Укажите каталог с артефактом}" ;;
  rollback) rollback "${2:-}" ;;
  *) echo "Использование: release.sh deploy <dir> | rollback [release]" >&2; exit 1 ;;
esac
