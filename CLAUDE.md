# CLAUDE.md — BodyRes provider overlay

Цей файл не дублює universal/project rules.

Перед роботою:

1. прочитай root `AGENTS.md`;
2. прочитай `PROJECT_RULES.md`;
3. завантаж релевантний local Vaoferi skill за routing у `AGENTS.md`.

## Claude-specific

- `.claude/settings.local.json`, якщо він існує у поточному workspace, є machine/provider permission overlay, а не source of truth для архітектури або поведінки BodyRes.
- Не переносити machine-specific Bash/Read allowlist з `.claude/settings.local.json` у `AGENTS.md`, `PROJECT_RULES.md` або інші universal docs.
- Якщо локальний permission/tool недоступний у поточній Claude session, спочатку перевір current capability/config. Не переписуй project architecture лише через session-level відсутність tool.

BodyRes business/content facts живуть у `massage_business_info.md`; build/deploy/design facts — у `PROJECT_RULES.md`, `README.md`, `docs/architecture-decisions.md` і `docs/build-rules.md`.
