# Roman Creative Studio — Claude Entry Point

Read only what the task needs. Each system below is its own source of truth — don't re-derive rules already written there.

| System | Start here | Notes |
|---|---|---|
| Public website | `README.md`, `docs/AuditReport.md` | Static HTML/CSS/JS, GitHub Pages. `docs/` is legacy, migrating to `agency/` — don't add new docs under `docs/`. |
| Agency internal ops (brand, sales, finance, etc.) | `agency/README.md` | Never deployed publicly (see `.github/workflows/pages.yml` allowlist). |
| CRM (Google Apps Script) | `crm/README.md` | Container-bound Apps Script; test via `tests/*.js` (indirect-eval harness). |
| 90 Days → $10K content system | `agency/content-system/STATE.md` | Read STATE.md first — it has current day/episode/revenue and points to the rest. Full rules in `agency/content-system/SYSTEM.md`. |
| Outreach templates | `outreach/OUTREACH_PLAYBOOK.md` | |

## Working conventions
- Small, focused files over one giant doc. Reference a rule instead of copying it.
- Don't create a competing state/instructions file for a system that already has one.
- No raw media/binaries in git (see `.gitignore`).
