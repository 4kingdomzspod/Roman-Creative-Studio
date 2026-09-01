# DaVinci Build Sheet — Intro Montage
**Status: PENDING CREATIVE BLUEPRINT.** This covers only the intro montage (INTRO-MONTAGE.md). The full episode DaVinci template (10 slots, Media Pool bins, Color/Fairlight/Fusion structure) is already decided — see SYSTEM.md §7, not repeated here.

**Format:** 1080×1920, 9:16, 30fps.

## Track roles (this montage only)
| Track | Role |
|---|---|
| V1 | Main footage per shot ID |
| V2 | Secondary/B-roll, if a beat needs a layered shot |
| V3 | Title card (SYSTEM.md §3 title system) + progress-tracker template if shown here |
| V4 | Optional overlay (grain, light texture) — omit unless it earns its place |
| A1 | Music |
| A2 | SFX |
| A3 | Voice (only if a line of dialogue opens the montage — normally none) |

Same track *numbers* as SYSTEM.md §6/§7's full-episode layout where the roles overlap (V1 main, V3 titles); A-track split differs slightly here because the montage carries no synced dialogue by default.

## What's implemented now
- Track/role map above.
- Color: same node chain as SYSTEM.md §7 (exposure/WB → contrast/highlights-shadows → saturation/skin tone → optional LUT node, disabled).
- Sequence settings: 1080×1920, 30fps, matching SYSTEM.md's platform standard.

## What's pending the creative blueprint
Exact clip in/out points, cut timings, speed-ramp keyframes, title-card animation curve, music track choice, SFX placement. Do not invent these values. Once the blueprint arrives, fill this section with the real implementation and set INTRO-MONTAGE.md's status to LOCKED.

## Reuse mechanic
Save the finished montage as its own DaVinci timeline ("RCS90_INTRO_DAVINCI_v01" — ASSET-SYSTEM.md) inside the master project. To reuse: duplicate the timeline, drop it at the head of a new episode timeline, do not re-edit it. Only the episode content after the montage changes per episode.
