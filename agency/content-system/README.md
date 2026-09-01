# RCS Content System
"90 DAYS → $10K" — Alexander's real 90-day attempt to generate $10,000 through Roman Creative Studio, documented on TikTok + Instagram Reels.

## Index
| Question | File |
|---|---|
| Where's the current state / what's left to do? | [STATE.md](STATE.md) |
| What's the series identity, structure, visual system, color, platform rules? | [SYSTEM.md](SYSTEM.md) |
| What's the standard RCS intro? | [INTRO-MONTAGE.md](INTRO-MONTAGE.md) |
| DaVinci version of the intro? | [DAVINCI-BUILD.md](DAVINCI-BUILD.md) |
| CapCut version of the intro? | [CAPCUT-BUILD.md](CAPCUT-BUILD.md) |
| What assets are required / how are they named? | [ASSET-SYSTEM.md](ASSET-SYSTEM.md) |
| How do I run an episode start to finish? | [EPISODE-WORKFLOW.md](EPISODE-WORKFLOW.md) |
| What are the export settings? | [EXPORT-STANDARD.md](EXPORT-STANDARD.md) |
| Individual episodes | [episodes/](episodes/) |
| Brand colors/fonts/logo rules (not duplicated here) | `docs/brand-governance/SocialMediaBrandingRules.md`, `docs/visual-identity/` |

## Quick Start
- **"Start Episode N"** → read STATE.md, create `episodes/epNN.md` from SYSTEM.md §9, status PLAN.
- **"Prepare today's footage for Episode N"** → open `episodes/epNN.md`, advance to FILM, hand over the shot list (SYSTEM.md §8).
- **"Update the intro"** → edit INTRO-MONTAGE.md (+ DAVINCI-BUILD.md/CAPCUT-BUILD.md), bump status per INTRO-MONTAGE.md §Handoff, log the decision in STATE.md.
- Any other request → read STATE.md + the one relevant file above. Don't re-read the whole tree.

## Workflow
```
PLAN → FILM → INGEST → SELECT → EDIT → QC → EXPORT → PUBLISH → REVIEW → UPDATE STATE
```
Step-by-step checklist: EPISODE-WORKFLOW.md. REVIEW notes feed "Known Improvements" in STATE.md; a proven, repeated improvement graduates to a SYSTEM.md version bump (v1.1+, SYSTEM.md §11).

## Rules
- No raw footage, exports, or CapCut/DaVinci project binaries committed to this repo (`.gitignore`).
- Don't duplicate a rule that already lives in another file here — cite it.
- One state file, one file per concern above. Don't create a second instruction system for this series.
