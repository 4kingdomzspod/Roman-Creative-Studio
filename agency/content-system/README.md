# RCS Content System
"90 DAYS → $10K" — Alexander's real 90-day attempt to generate $10,000 through Roman Creative Studio, documented on TikTok + Instagram Reels.

- **State (read first):** [STATE.md](STATE.md)
- **Full spec** — identity, episode structure, visual system, color, platform, CapCut/DaVinci templates, filming guide, QC checklist, versioning: [SYSTEM.md](SYSTEM.md)
- **Episodes:** [episodes/](episodes/)
- **Brand rules** (colors/fonts/logo — not duplicated here): `docs/brand-governance/SocialMediaBrandingRules.md`, `docs/visual-identity/`

## Quick Start
- **"Start Episode N"** → read STATE.md, create `episodes/epNN.md` from the template in SYSTEM.md §9, set Episode Status to PLAN.
- **"Prepare today's footage for Episode N"** → open `episodes/epNN.md`, advance status to FILM, hand over the shot list from SYSTEM.md §8.
- Any other request → read STATE.md + the one relevant SYSTEM.md section. Don't re-read the whole tree.

## Workflow
```
PLAN → FILM → INGEST → SELECT → EDIT → QC → EXPORT → PUBLISH → REVIEW → UPDATE STATE
```
Each episode file tracks its own step. REVIEW notes feed "Known Improvements" in STATE.md; a proven, repeated improvement graduates to a SYSTEM.md version bump (v1.1+ — see SYSTEM.md §11). After PUBLISH, update STATE.md's Day/Revenue/Latest/Next fields — that's "UPDATE STATE."

## Rules
- No raw footage, exports, or CapCut/DaVinci project binaries committed to this repo.
- Don't duplicate brand/color/font rules here — cite the source doc.
- One state file, one spec file. Don't create a second instruction system for this series.
