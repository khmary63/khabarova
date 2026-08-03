#!/usr/bin/env bash
#
# Деплой на VPS. Запускается self-hosted runner'ом из .github/workflows/deploy-vps.yml,
# но его можно выполнить и вручную по SSH из каталога с чекаутом репозитория.
#
# Настраивается переменными окружения:
#   DEPLOY_PATH   — каталог приложения на сервере (обязателен)
#   SERVICE_NAME  — systemd-сервис для перезапуска (необязателен)

set -euo pipefail

DEPLOY_PATH="${DEPLOY_PATH:-}"
SERVICE_NAME="${SERVICE_NAME:-}"

if [ -z "$DEPLOY_PATH" ]; then
  echo "DEPLOY_PATH не задан. Укажите его в Settings → Variables репозитория." >&2
  exit 1
fi

log() { printf '\n=== %s ===\n' "$1"; }

log "Проверка окружения"
export PATH="$HOME/.bun/bin:$PATH"
if ! command -v bun >/dev/null 2>&1; then
  echo "bun не найден, устанавливаю"
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi
echo "bun $(bun --version)"

log "Установка зависимостей"
bun install --frozen-lockfile

log "Сборка"
bun run build

log "Выкладка в $DEPLOY_PATH"
mkdir -p "$DEPLOY_PATH"

# Что именно выкладывать, зависит от сборки. Vite кладёт результат в dist/,
# серверные пресеты Nitro — в .output/. Берём то, что реально появилось.
if [ -d ".output" ]; then
  BUILD_DIR=".output"
elif [ -d "dist" ]; then
  BUILD_DIR="dist"
else
  echo "Каталог сборки не найден: нет ни .output/, ни dist/" >&2
  exit 1
fi
echo "Каталог сборки: $BUILD_DIR"

# --delete убирает на сервере файлы, которых больше нет в сборке,
# чтобы не копились артефакты прошлых версий.
rsync -a --delete "$BUILD_DIR/" "$DEPLOY_PATH/"

if [ -n "$SERVICE_NAME" ]; then
  log "Перезапуск сервиса $SERVICE_NAME"
  sudo systemctl restart "$SERVICE_NAME"
  sleep 2
  sudo systemctl status "$SERVICE_NAME" --no-pager --lines=20
else
  echo "SERVICE_NAME не задан — перезапуск пропущен."
fi

log "Готово"
