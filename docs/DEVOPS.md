# Управление сервером и деплой

Документ описывает два способа работать с VPS: интерактивный (Claude Code на вашем
компьютере вместо Termius) и автоматический (деплой через self-hosted GitHub Actions
runner, который живёт на самом сервере).

Способы независимы и дополняют друг друга: первый нужен для живой отладки, второй — для
повторяемого деплоя и для случаев, когда до сервера нельзя достучаться напрямую.

---

## Часть 1. Claude Code локально — замена Termius

### Зачем

Claude Code в облаке (claude.ai/code) работает в изолированном контейнере за пределами
России, поэтому подключиться к российскому VPS оттуда не получается. Claude Code,
запущенный на вашем компьютере, использует вашу сеть и ваши SSH-ключи — для сервера это
обычное подключение с вашего IP, ничем не отличающееся от Termius.

### Установка (Windows)

Node.js и npm не нужны — у Claude Code есть нативный установщик. В **PowerShell**:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Если появится ошибка `'irm' is not recognized` — открыт не PowerShell, а CMD. Признак:
в PowerShell строка начинается с `PS C:\`, в CMD — просто `C:\`. Для CMD команда другая:

```batch
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

После установки закройте и откройте окно терминала заново, иначе `PATH` не обновится:

```powershell
claude --version
```

Дополнительно стоит поставить [Git for Windows](https://git-scm.com/downloads/win). Без него
Claude Code будет выполнять команды через PowerShell; с ним доступен полноценный bash, что
заметно удобнее для работы с сервером и git.

Нативная установка сама обновляется в фоне.

### Если `claude` не распознаётся

Установщик кладёт файл в `%USERPROFILE%\.local\bin\claude.exe`. Первым делом проверьте,
появился ли он:

```powershell
Test-Path "$env:USERPROFILE\.local\bin\claude.exe"
```

**`True`** — установка прошла, но папки нет в `PATH`. Добавьте её в пользовательский `PATH`:

```powershell
$currentPath = [Environment]::GetEnvironmentVariable('PATH', 'User')
[Environment]::SetEnvironmentVariable('PATH', "$currentPath;$env:USERPROFILE\.local\bin", 'User')
```

После этого закройте окно терминала и откройте новое — переменная окружения читается только
при запуске процесса, в текущем окне изменение не появится.

**`False`** — установщик не отработал. Проверьте, доходят ли запросы до сервера загрузки:

```powershell
curl.exe -sI https://downloads.claude.ai/claude-code-releases/latest
```

Здесь важно писать именно `curl.exe`: в PowerShell `curl` — это алиас для
`Invoke-WebRequest`, который не понимает флаги `-sI`.

Первая строка ответа должна быть `HTTP/1.1 200 OK`. Если там `403` или запрос не проходит
вовсе, установку блокирует сеть — понадобится VPN на время скачивания. На работу самого
Claude Code это потом не влияет: он обращается к `api.anthropic.com`.

### Установка (macOS, Linux)

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

### Первый запуск

```powershell
cd C:\Users\<вы>\projects\khabarova    # папка с клоном репозитория
claude
```

При первом запуске откроется браузер — войдите тем же аккаунтом, которым пользуетесь на
claude.ai. Дальше учётные данные сохранятся.

### Настройка SSH-ключа

Claude Code пользуется системным SSH — встроенным в Windows 10/11 OpenSSH, который читает
ключи из `C:\Users\<вы>\.ssh`. Аутентификация по ключу нужна не только для удобства: при
входе по паролю каждая команда требовала бы ручного ввода, и автоматическая работа с
сервером стала бы невозможной.

Создайте ключ:

```powershell
mkdir "$env:USERPROFILE\.ssh" -Force
ssh-keygen -t ed25519 -C "khabarova-vps" -f "$env:USERPROFILE\.ssh\vps_key"
```

На запрос passphrase нажмите Enter дважды, оставив её пустой — иначе пароль от ключа будет
спрашиваться при каждом подключении. Защиту в этом случае обеспечивают права доступа к
файлу.

В Windows права выставляются через `icacls`, а не `chmod`. Без этого SSH отказывается
использовать ключ с ошибкой `UNPROTECTED PRIVATE KEY FILE`:

```powershell
icacls "$env:USERPROFILE\.ssh\vps_key" /inheritance:r
icacls "$env:USERPROFILE\.ssh\vps_key" /grant:r "$($env:USERNAME):(R)"
```

Скопируйте публичный ключ на сервер — пароль понадобится последний раз:

```powershell
scp "$env:USERPROFILE\.ssh\vps_key.pub" <user>@<ip-сервера>:/tmp/id.pub
ssh <user>@<ip-сервера> "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat /tmp/id.pub >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && rm /tmp/id.pub"
```

Передавать ключ через `type ... | ssh` не стоит: PowerShell подставляет в конвейер переводы
строк в формате Windows, ключ на сервере оказывается битым, а причина неочевидна. `scp`
копирует файл без изменений.

Если ключ уже есть в Termius (Keychain → ключ → Export), генерацию можно пропустить:
положите приватный ключ в `%USERPROFILE%\.ssh\vps_key` и выставьте права через `icacls`.

### Настройка алиаса

Чтобы не писать каждый раз IP, пользователя и путь к ключу, создайте файл
`C:\Users\<вы>\.ssh\config` (без расширения) с таким содержимым:

```
Host vps
    HostName <ip-сервера>
    User <пользователь>
    IdentityFile ~/.ssh/vps_key
    ServerAliveInterval 30
```

Тильда `~` внутри этого файла работает и в Windows — OpenSSH раскрывает её в домашнюю папку.

Проверка — должно подключиться без пароля:

```powershell
ssh vps "hostname && uptime"
```

После этого в локальном Claude Code достаточно сказать «посмотри логи nginx на сервере» или
«задеплой ветку main» — он выполнит `ssh vps '...'` сам, прочитает вывод и продолжит работу.

### Что стоит разрешить заранее

Claude Code спрашивает подтверждение на каждую команду. Чтобы не подтверждать однотипные
вещи, можно один раз разрешить их в `.claude/settings.local.json` проекта — например
`Bash(ssh vps:*)`. Проще всего сделать это при первом же запросе, выбрав «разрешить всегда».

---

## Часть 2. Автодеплой: GitHub Actions + self-hosted runner

### Архитектура

Приложение — TanStack Start с серверными функциями (портфолио, блог, бронирование, чат и
аналитика ходят в Supabase с ключом сервис-роли). Ему нужен Node-сервер; статикой такой
код раздавать нельзя. Поэтому на сервере оно работает как контейнер `factory-app` за
Caddy — по той же схеме, что и остальные приложения этого VPS.

Конвейер:

1. **Сборка** — на runner'ах GitHub (`ubuntu-latest`): `VPS_BUILD=1 bun run build` даёт
   `.output` с Node-сервером (пресет `node-server` вместо Cloudflare). VPS в сборке не
   участвует и памяти на неё не тратит.
2. **Выкладка** — self-hosted runner на VPS скачивает артефакт и запускает
   `scripts/release.sh`: новый каталог в `releases/`, атомарное переключение симлинка
   `current`, перезапуск контейнера, health-check. Если проверка провалилась — автооткат
   на предыдущий релиз.
3. **Откат** — workflow `rollback-vps.yml` переключает симлинк на любой из хранимых
   релизов (последние 5) без пересборки.

Runner на VPS решает и проблему сетевой изоляции: сервер сам опрашивает GitHub по
исходящему соединению, входящие подключения из-за рубежа ему не нужны.

Файлы:

| Файл | Назначение |
| --- | --- |
| `.github/workflows/deploy-vps.yml` | сборка + деплой при пуше в `main` |
| `.github/workflows/rollback-vps.yml` | ручной откат |
| `.github/workflows/remote-exec.yml` | ручное выполнение команды на сервере |
| `scripts/release.sh` | релизы/откаты на сервере |
| `deploy/docker-compose.factory.yml` | контейнер приложения (на сервер: `/opt/factory/docker-compose.yml`) |
| `deploy/factory.env.example` | шаблон секретов (на сервер: `/opt/factory/.env`) |
| `deploy/Caddyfile.factory.snippet` | блок Caddy вместо статической раздачи |

### Разовая настройка сервера

Эти шаги удобно поручить локальному Claude Code («выполни настройку сервера по
docs/DEVOPS.md, часть 2») — он сделает их по SSH и проверит каждый.

**1. Пользователь `gha` и права.**

```bash
sudo useradd -m -s /bin/bash gha || true
sudo usermod -aG docker gha                     # перезапуск контейнера при деплое
sudo mkdir -p /var/www/factory.neyromarket.com/releases
sudo chown -R gha:gha /var/www/factory.neyromarket.com
```

Полный sudo пользователю `gha` не нужен: релизы — это запись в свой каталог плюс
`docker compose` через членство в группе `docker`.

**2. Каталог `/opt/factory`.**

```bash
sudo mkdir -p /opt/factory
sudo cp deploy/docker-compose.factory.yml /opt/factory/docker-compose.yml
sudo cp deploy/factory.env.example /opt/factory/.env
sudo chown -R gha:gha /opt/factory
sudo chmod 600 /opt/factory/.env
```

В `/opt/factory/.env` вписать `SUPABASE_SERVICE_ROLE_KEY` (Supabase Dashboard → Settings →
API → `service_role`). В git этот ключ не попадает.

В компоузе проверить имя внешней сети — оно должно совпадать с сетью Caddy:

```bash
docker inspect deploy-caddy-1 -f '{{range $k,$v := .NetworkSettings.Networks}}{{$k}}{{end}}'
```

Если вывод не `deploy_default` — поправить `networks.caddy-net.name` в
`/opt/factory/docker-compose.yml`.

**3. Runner.** Токен: **Settings → Actions → Runners → New self-hosted runner**
(одноразовый, живёт около часа).

```bash
sudo -iu gha
mkdir -p ~/actions-runner && cd ~/actions-runner
curl -o runner.tar.gz -L https://github.com/actions/runner/releases/download/v2.328.0/actions-runner-linux-x64-2.328.0.tar.gz
tar xzf runner.tar.gz
./config.sh --url https://github.com/khmary63/khabarova \
            --token <ТОКЕН> --name khabarova-vps --labels vps --unattended
exit

cd /home/gha/actions-runner
sudo ./svc.sh install gha
sudo ./svc.sh start
```

Метка `vps` обязательна — по ней workflow находят сервер. Статус в
**Settings → Actions → Runners** должен стать `Idle`.

**4. Первый деплой и переключение Caddy.** Запустить **Actions → Deploy to VPS →
Run workflow**. Когда релиз выложится и контейнер ответит на
`http://127.0.0.1:3002/`, заменить в `/opt/neyromarket/deploy/Caddyfile` статический блок
`factory.neyromarket.com` на содержимое `deploy/Caddyfile.factory.snippet` и применить:

```bash
docker exec deploy-caddy-1 caddy validate --config /etc/caddy/Caddyfile
docker exec deploy-caddy-1 caddy reload --config /etc/caddy/Caddyfile
curl -fsS -o /dev/null -w '%{http_code}\n' https://factory.neyromarket.com/
```

Старый статический каталог остаётся на месте — если что-то пойдёт не так, возврат
прежнего блока Caddyfile мгновенно вернёт старую версию сайта.

**5. Прибраться (по желанию).** Системный nginx давно проиграл порты Caddy и висит в
`failed` — `sudo systemctl disable --now nginx` уберёт шум из мониторинга. Старые
`*.tar` ручных деплоев в `/root` и `/tmp` можно удалить.

### Как пользоваться

- **Деплой**: пуш в `main` — всё остальное произойдёт само. Вручную: **Actions →
  Deploy to VPS → Run workflow** (можно указать ветку).
- **Откат**: **Actions → Rollback on VPS → Run workflow**; пустое поле = предыдущий
  релиз, либо имя из `ls /var/www/factory.neyromarket.com/releases`.
- **Команда на сервере без SSH**: **Actions → Remote exec on VPS** — вывод в логе запуска.
  Работает и из облачного Claude Code: он может запускать workflow и читать логи через
  GitHub, то есть администрировать сервер, когда прямой SSH недоступен.

### Границы системы: основной сайт неприкосновенен

neyromarket.com — главный сайт, и конвейер спроектирован так, что не может его задеть:

- деплой пишет только в `/var/www/factory.neyromarket.com` и перезапускает только
  контейнер `factory-app`; контейнер основного сайта (`deploy-neyromarket-1`), его
  compose и файлы не входят в зону досягаемости;
- пользователь `gha` не имеет sudo и прав на каталоги основного сайта;
- Caddyfile общий для всех доменов, поэтому конвейер его **никогда не правит**. Ручные
  правки — только через `caddy validate` перед `caddy reload`: невалидный конфиг не
  применится, работающие домены не пострадают.

Исторический факт (август 2026): до перевода на конвейер поддомен factory раздавал
статический лендинг из другого проекта (Next.js-экспорт, в этом репозитории его нет).
Его релизы сохранены в `/var/www/factory.neyromarket.com/backups/old-landing/` —
автоочистка релизов их не трогает.

### Безопасность

- `remote-exec.yml` и `rollback-vps.yml` запускаются только вручную и только владельцем
  репозитория (`github.actor == github.repository_owner`).
- Runner работает от `gha`: без sudo, из привилегий — только группа `docker` и свой
  каталог релизов.
- Секрет сервис-роли Supabase живёт только в `/opt/factory/.env` на сервере (chmod 600).
- Если репозиторий станет публичным, `remote-exec` стоит удалить или закрыть через
  GitHub Environment с ручным подтверждением.

### Типовые проблемы

**Runner `Offline`.** `sudo systemctl status 'actions.runner.*'` на сервере; чаще всего —
упавший после перезагрузки сервис или заблокированный исходящий HTTPS.

**`403` при `bun install` в сборке.** Прямой признак, что шаг подмены реестра в
`deploy-vps.yml` не отработал: в `bun.lock` зашит приватный npm-кэш Lovable, доступный
только из их песочницы.

**Health-check провалился, деплой красный.** Смотреть лог шага Release — там последние
50 строк лога контейнера. Сайт при этом жив: скрипт сам откатился на предыдущий релиз.

**`permission denied` к docker.sock.** Пользователь `gha` не в группе `docker`, либо
runner-сервис запущен до добавления в группу — `sudo ./svc.sh stop && sudo ./svc.sh start`.
