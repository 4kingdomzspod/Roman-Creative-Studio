# Content System — State
_Read this first. Rules/templates: [SYSTEM.md](SYSTEM.md). Index/workflow: [README.md](README.md)._

| Key | Value |
|---|---|
| Content System Version | v1.0 |
| Current Phase | INTRO MONTAGE BUILD PROCEDURES LOCKED (DaVinci + CapCut, both frame-accurate) — AWAITING PHYSICAL BUILD |
| Challenge Day | 0 / 90 |
| Revenue | $0 / $10,000 |
| Days Remaining | 90 |
| Latest Completed Episode | none |
| Next Episode | EP.01 — The Beginning ([episodes/ep01.md](episodes/ep01.md)) |
| Episode Status | PLAN |

## Current Templates
| Template | Status |
|---|---|
| Intro montage spec (timeline, typography, color, sound) | **APPROVED — v1.0**, now frame-accurate at 30fps (INTRO-MONTAGE.md) |
| DaVinci intro build sheet | **APPROVED — v1.0**, frame-accurate build procedure (DAVINCI-BUILD.md) — documentation complete, not yet physically built in DaVinci |
| CapCut intro build sheet | **APPROVED — v1.0**, frame-accurate build procedure (CAPCUT-BUILD.md) — portability/reference platform; documentation complete, not yet physically built in CapCut |
| Episode master template (both editors) | SPEC COMPLETE (SYSTEM.md §6/§7), not yet built in either editor |

## Current Assets
None yet inventoried. Older footage exists (per Alexander) but no Claude session has directly reviewed it — the approved intro spec came from a separate creative-blueprint pass, not from footage inspection here. Shot selects against real clips still need to happen (INTRO-MONTAGE.md shot list is the target to match footage against).

## Next Action
Alexander builds the intro montage in DaVinci (primary platform) following DAVINCI-BUILD.md against real footage, matching INTRO-MONTAGE.md's frame-accurate shot list. CAPCUT-BUILD.md is available as a validated portability/reference build if CapCut is used instead or in parallel. Report back what worked/didn't so REVIEW notes can feed a v1.1 if needed.

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
- **DaVinci literal build (frame-accurate) validated and locked** (2026-09-01). Two proposed changes classified:
  - **Shot 05 extension (0.35s→0.87s/26 frames) to close the Momentum Bridge:** the *concept* (extend Shot 05, no new shot, no gap) was already approved in the prior decision above — classified **APPROVED/IMPLEMENT**. The specific frame count (26, not a rounder number) is a **compatible mathematical detail**: 0.85s lands on 25.5 frames, which isn't an editable unit at 30fps, so it necessarily rounds to 26.
  - **Cumulative frame rounding to exactly 225 frames/7.5s:** verified independently, frame-by-frame — every shot's End+1 equals the next shot's Start (no gaps/overlaps), max single-shot deviation from its nominal decimal value is ±1 frame (≈0.017s), and Shot 10 (Identity, the emotional anchor) lands exactly on 45 frames/1.50s with zero drift. Classified **APPROVED/IMPLEMENT** — purely a 30fps quantization necessity, no creative intent altered.
  - **Found and corrected during validation (not in the original proposal):** the literal build placed Line 2's title-text entrance 9–12 frames after Line 1 (~frame 167–170). INTRO-MONTAGE.md's own beat map places the "ROMAN CREATIVE STUDIO" accent at ~0:06.10 (frame 183) — a ~13–16 frame (≈0.45–0.55s) discrepancy, not rounding noise. Corrected to start Line 2's entrance at frame 178–179 so it completes at the accent (~183), matching the already-approved beat map. This is a technical correction to match an existing approved timestamp, not a new creative call.
  - **Media Pool bin names in the literal build used the rejected Blueprint folder list** (`01 Raw Footage`, `05 Logos`, `06 Fonts`, spaces, no episode/color folders) instead of the approved `ASSET-SYSTEM.md` naming — corrected in DAVINCI-BUILD.md to use `01_RAW`, `05_BRAND`, etc.
  - Cross-dissolve duration pinned to **3 frames (0.1s)**, the top of the previously-approved 2–3 frame range, so both editors use the same value.
- **CapCut literal build (frame-accurate, portability/reference) validated and locked** (2026-09-01). No new creative proposals in this submission — only two mechanical corrections needed against already-locked values (the submitting session had no direct repo access and had inherited pre-correction data):
  - **Line 2 title-entrance timing** was given as ~frame 167–170 (the original, pre-correction proposal) — corrected to the already-locked frame 178–179 → completes ~183, matching DAVINCI-BUILD.md.
  - **Folder reference** used the rejected Blueprint naming (`02 Selects`, spaces) — corrected to the approved `02_SELECTS` (ASSET-SYSTEM.md).
  - Also folded in: Highlights' warm-push nuance (previously DaVinci-only), explicit EXPORT-STANDARD.md citation (≥20 Mbps/AAC 320kbps) where CapCut exposes those controls, and reconciled the unused-track/layer structure so DaVinci and CapCut build sheets no longer describe it two different ways.
  - Strengthened the frame-vs-tenths warning: this project's specific durations (14f, 10f, 26f, 52f) are not clean tenths of a second, so a decimal approximation on a tenths-only CapCut version can silently drift a frame — frame-based trimming is required when available, and the limitation must be flagged (not silently rounded) if a version genuinely lacks it.
  - CapCut remains the portability/reference build; DaVinci Resolve remains the primary production platform (SYSTEM.md §7).

## Known Improvements
_(none yet — populate from episode REVIEW notes; promote a repeated, proven improvement to a SYSTEM.md version bump)_

## Changelog
- **v1.0** (2026-08-31) — Initial system created (SYSTEM.md, STATE.md, README.md, episodes/ep01.md).
- **v1.0** (2026-08-31) — Added INTRO-MONTAGE.md, DAVINCI-BUILD.md, CAPCUT-BUILD.md, ASSET-SYSTEM.md, EPISODE-WORKFLOW.md, EXPORT-STANDARD.md. Montage/build sheets structure-only, pending creative blueprint — no footage inspected.
- **v1.0** (2026-09-01) — Reviewed the creative-blueprint handoff against approved standards: 2 CONFLICTs (font, LUT color direction), 1 timeline-integrity gap, and 8 WARNs found and resolved (see Decisions above). Intro montage marked **APPROVED — v1.0**: INTRO-MONTAGE.md, DAVINCI-BUILD.md, CAPCUT-BUILD.md rewritten with the locked spec; EXPORT-STANDARD.md gained bitrate detail; SYSTEM.md §3 clarified the "whoosh" wording collision.
- **v1.0** (2026-09-01) — Validated the DaVinci literal editing build (Part 1) against the locked spec: verified frame math for all 12 timeline rows (no gaps/overlaps/drift beyond ±1 frame), classified both proposed changes as APPROVED/IMPLEMENT (see Decisions above), caught and corrected a Line 2 title-timing discrepancy against the beat map, and corrected Media Pool bin naming back to the approved ASSET-SYSTEM.md convention. INTRO-MONTAGE.md's Master Timeline is now frame-accurate; DAVINCI-BUILD.md rewritten as a full frame-accurate build procedure. CapCut Part 2 not yet supplied — CAPCUT-BUILD.md unchanged this pass.
- **v1.0** (2026-09-01) — Validated the CapCut literal editing build (Part 2, portability/reference) against the now-locked DaVinci/INTRO-MONTAGE.md values: re-verified the same frame table, confirmed 3 frames = exactly 0.1s at 30fps, found 2 mechanical discrepancies (stale Line 2 timing, stale folder naming) from the submitting session lacking direct repo access, and folded in 3 non-blocking consistency improvements plus a strengthened frame-vs-tenths warning (see Decisions above). CAPCUT-BUILD.md rewritten as a full frame-accurate build procedure and marked APPROVED — v1.0. Both editors' intro-montage documentation are now locked and mutually consistent.

_Last updated: 2026-09-01_
