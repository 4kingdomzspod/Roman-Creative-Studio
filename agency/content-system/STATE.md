# Content System — State
_Read this first. Rules/templates: [SYSTEM.md](SYSTEM.md). Index/workflow: [README.md](README.md)._

| Key | Value |
|---|---|
| Content System Version | v1.0 |
| Current Phase | TEMPLATE DESIGN |
| Challenge Day | 0 / 90 |
| Revenue | $0 / $10,000 |
| Days Remaining | 90 |
| Latest Completed Episode | none |
| Next Episode | EP.01 — The Beginning ([episodes/ep01.md](episodes/ep01.md)) |
| Episode Status | PLAN |

## Current Templates
| Template | Status |
|---|---|
| Intro montage creative blueprint | NOT YET RECEIVED — see INTRO-MONTAGE.md §Handoff |
| DaVinci intro build | NOT YET BUILT (blocked on blueprint) |
| CapCut intro build | NOT YET BUILT (blocked on blueprint) |
| Episode master template (both editors) | SPEC COMPLETE (SYSTEM.md §6/§7), not yet built in either editor |

## Current Assets
None yet inventoried. Older footage exists (per Alexander) but has not been reviewed by any Claude session — no footage has been analyzed, no clips selected. See INTRO-MONTAGE.md.

## Next Action
Get the intro montage creative blueprint (exact shot selects + beat map) from a session with direct footage access, then fill in INTRO-MONTAGE.md / DAVINCI-BUILD.md / CAPCUT-BUILD.md and lock v1.0 of the montage.

## Blockers
- No footage has been provided to any Claude Code session yet — intro montage cannot move past placeholder structure until it is.
- Creative LUT not yet chosen — correction-first only until real footage is tested (SYSTEM.md §4)
- Music/SFX license source not yet confirmed by Alexander (SYSTEM.md §3)

## Decisions
- Content system lives under `agency/` (not `docs/`, which is legacy/migrating per `.github/workflows/pages.yml`) and not duplicated elsewhere.
- Raw footage/exports/project binaries never enter this git repo — local/cloud storage only (ASSET-SYSTEM.md, `.gitignore`).
- Intro montage build sheets (DAVINCI-BUILD.md, CAPCUT-BUILD.md) stay placeholder-only until a real creative blueprint arrives — no invented keyframes/timings.

## Known Improvements
_(none yet — populate from episode REVIEW notes; promote a repeated, proven improvement to a SYSTEM.md version bump)_

## Changelog
- **v1.0** (2026-08-31) — Initial system created (SYSTEM.md, STATE.md, README.md, episodes/ep01.md).
- **v1.0** (2026-08-31) — Added INTRO-MONTAGE.md, DAVINCI-BUILD.md, CAPCUT-BUILD.md, ASSET-SYSTEM.md, EPISODE-WORKFLOW.md, EXPORT-STANDARD.md. Montage/build sheets are structure-only, pending creative blueprint — no footage inspected.

_Last updated: 2026-08-31_
