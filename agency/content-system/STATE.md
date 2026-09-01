# Content System — State
_Read this first. Rules/templates: [SYSTEM.md](SYSTEM.md). Index/workflow: [README.md](README.md)._

| Key | Value |
|---|---|
| Content System Version | v1.0 |
| Current Phase | INTRO TEMPLATE APPROVED — AWAITING BUILD |
| Challenge Day | 0 / 90 |
| Revenue | $0 / $10,000 |
| Days Remaining | 90 |
| Latest Completed Episode | none |
| Next Episode | EP.01 — The Beginning ([episodes/ep01.md](episodes/ep01.md)) |
| Episode Status | PLAN |

## Current Templates
| Template | Status |
|---|---|
| Intro montage spec (timeline, typography, color, sound) | **APPROVED — v1.0** (INTRO-MONTAGE.md) |
| DaVinci intro build sheet | **APPROVED — v1.0** spec (DAVINCI-BUILD.md) — not yet physically built in DaVinci |
| CapCut intro build sheet | **APPROVED — v1.0** spec (CAPCUT-BUILD.md) — not yet physically built in CapCut |
| Episode master template (both editors) | SPEC COMPLETE (SYSTEM.md §6/§7), not yet built in either editor |

## Current Assets
None yet inventoried. Older footage exists (per Alexander) but no Claude session has directly reviewed it — the approved intro spec came from a separate creative-blueprint pass, not from footage inspection here. Shot selects against real clips still need to happen (INTRO-MONTAGE.md shot list is the target to match footage against).

## Next Action
Alexander builds the intro montage in DaVinci and/or CapCut following DAVINCI-BUILD.md / CAPCUT-BUILD.md against real footage, matching INTRO-MONTAGE.md's locked shot list. Report back what worked/didn't so REVIEW notes can feed a v1.1 if needed.

## Blockers
- Music/SFX license source not yet confirmed by Alexander (SYSTEM.md §3, INTRO-MONTAGE.md §Music & Beat Structure — BPM/style target given, no specific track chosen).

## Decisions
- Content system lives under `agency/` (not `docs/`, which is legacy/migrating per `.github/workflows/pages.yml`) and not duplicated elsewhere.
- Raw footage/exports/project binaries never enter this git repo — local/cloud storage only (ASSET-SYSTEM.md, `.gitignore`).
- **Intro montage v1.0 approved** (2026-09-01) after creative-blueprint validation. Two conflicts resolved before lock:
  - **Font:** Plus Jakarta Sans only (already the approved brand font, free) — not Neue Montreal/Helvetica Now (paid) or other blueprint alternatives.
  - **Color:** manual baseline grade is the default; LUT (including any teal-orange treatment) is optional/experimental only, never standard, and requires real-footage validation first (SYSTEM.md §4) — this also respects Alexander's standing "no orange/teal" direction.
  - **Timeline:** the 0:01.75–0:02.25 span is a Momentum Bridge (audio riser marker), resolved by holding Shot 05 through it — no 11th footage shot added, no blank frames.
- Existing `ASSET-SYSTEM.md` folder structure kept as-is; the blueprint's simpler folder list was a partial illustration, not a replacement (it omitted episode organization).
- Cross-dissolve (2–3 frame, Shot 10 only) and optional blur-to-sharp (same shot, non-default) are sanctioned exceptions to the hard-cut rule — documented in INTRO-MONTAGE.md §Editing Language, not a general license to use transitions elsewhere.
- Progress tracker (`DAY XX/90` / `$X/$10,000`) belongs to the episode template only, never the reusable intro.

## Known Improvements
_(none yet — populate from episode REVIEW notes; promote a repeated, proven improvement to a SYSTEM.md version bump)_

## Changelog
- **v1.0** (2026-08-31) — Initial system created (SYSTEM.md, STATE.md, README.md, episodes/ep01.md).
- **v1.0** (2026-08-31) — Added INTRO-MONTAGE.md, DAVINCI-BUILD.md, CAPCUT-BUILD.md, ASSET-SYSTEM.md, EPISODE-WORKFLOW.md, EXPORT-STANDARD.md. Montage/build sheets structure-only, pending creative blueprint — no footage inspected.
- **v1.0** (2026-09-01) — Reviewed the creative-blueprint handoff against approved standards: 2 CONFLICTs (font, LUT color direction), 1 timeline-integrity gap, and 8 WARNs found and resolved (see Decisions above). Intro montage marked **APPROVED — v1.0**: INTRO-MONTAGE.md, DAVINCI-BUILD.md, CAPCUT-BUILD.md rewritten with the locked spec; EXPORT-STANDARD.md gained bitrate detail; SYSTEM.md §3 clarified the "whoosh" wording collision.

_Last updated: 2026-09-01_
