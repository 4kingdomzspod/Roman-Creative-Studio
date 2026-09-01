# CapCut Build Sheet — Intro Montage
**Status: PENDING CREATIVE BLUEPRINT.** This covers only the intro montage (INTRO-MONTAGE.md). The full episode CapCut template (10 slots, track layout, reuse pattern) is already decided — see SYSTEM.md §6, not repeated here.

**Format:** 1080×1920, 9:16, 30fps.

## Track roles (this montage only)
| Track | Role |
|---|---|
| Main video track | Footage per shot ID, cut in sequence |
| Overlay track | Secondary/B-roll layering, if a beat needs it |
| Text track | Title card (SYSTEM.md §3 title system, CapCut Text Style) |
| Audio 1 | Music |
| Audio 2 | SFX |

CapCut's flatter track model doesn't map 1:1 to DaVinci's numbered tracks (DAVINCI-BUILD.md) — this is the closest equivalent, not a forced identical structure.

## What's implemented now
- Track/role map above.
- Color: same correction order as SYSTEM.md §4, applied as CapCut's Adjust panel (exposure, WB, contrast, HSL) in that order — no LUT applied.
- Canvas: 1080×1920, 30fps.

## What's pending the creative blueprint
Exact clip trims, cut timings, speed-ramp curve values, text animation preset/duration, keyframe points, music track, SFX placement. Do not invent these. Once the blueprint arrives, fill this section with the real implementation and set INTRO-MONTAGE.md's status to LOCKED.

## Reuse mechanic
Save the finished montage as a CapCut Draft ("RCS90_INTRO_CAPCUT_v01" — ASSET-SYSTEM.md), then export it as a Template inside CapCut (or keep as a duplicable draft). To reuse: duplicate the draft, keep the montage clips untouched, add the new episode's content after it, replace only the two progress-tracker numbers if the tracker is baked into this draft.
