# DaVinci Build Sheet — Intro Montage
**Status: APPROVED — v1.0.** Implements INTRO-MONTAGE.md's locked timeline. Covers only the intro montage. The full episode DaVinci template (10 slots, Media Pool bins, Color/Fairlight/Fusion structure) is already decided — see SYSTEM.md §7, not repeated here.

**Project settings:** 1080×1920, 9:16, 30fps. Timeline frame rate matched to source footage.

## Track roles (this montage only)
| Track | Role |
|---|---|
| V4 | Optional overlays (grain, light leaks) — off by default |
| V3 | Titles (Text+, not Fusion — see build steps) |
| V2 | Secondary footage — only if a shot needs picture-in-picture/split; optional, off by default |
| V1 | Main footage — all 10 shots in sequence (INTRO-MONTAGE.md timeline) |
| A1 | Music (main beat-synced track) |
| A2 | SFX (hits/whooshes/clicks, INTRO-MONTAGE.md §Sound Design) |
| A3 | Optional voice-over — reserved, empty by default |

**No progress tracker on any track here** — it belongs to the episode template (SYSTEM.md §6 slot 4), not this montage (INTRO-MONTAGE.md §Progress Tracker).

## Build steps
1. Drop the 10 shot clips into V1 in the exact order/durations from INTRO-MONTAGE.md's Master Timeline. Shot 05 (Planning) is trimmed/held to its full 0.85s (covers the Momentum Bridge) — not cut short at 0.35s.
2. Color Page: apply the manual baseline grade (INTRO-MONTAGE.md §Color — exposure → white balance → contrast → highlights/shadows → saturation) as a single Adjustment Clip over the whole V1 stack for consistency across sources. No LUT by default; a LUT is an optional experimental branch only, never applied here as standard.
3. Speed changes via Retime Controls: 105% (Shot 03), 110% (Shot 06), 115% (Shot 08), 90% (Shot 09). Keep changes as flat retimes, not ramps.
4. Cuts are hard cuts throughout except the sanctioned 2–3 frame cross-dissolve into Shot 10 (Identity) — set via the Edit page transition duration field. Optional, non-default: a 2–3 frame Gaussian Blur (OpenFX, not Fusion-only) easing to 0 on the same Shot 10 transition, keyframed in the Inspector — skip if it doesn't read cleanly on real footage.
5. Titles on V3 using Text+ (kept simple/portable rather than Fusion, so the same visual result is easy to manually replicate in CapCut — no literal file portability between the two apps). Keyframe Opacity and Scale (Size) only, per INTRO-MONTAGE.md §Typography's entrance/hold/exit timing. Font: Plus Jakarta Sans (install the full local family, including Medium, on the edit machine).
6. Music on A1, riser and drop placed to INTRO-MONTAGE.md's beat-structure timestamps. SFX hits on A2 at the exact frames in INTRO-MONTAGE.md §Sound Design — nudge with J/K/L for frame accuracy.
7. Save the finished timeline as a Compound Clip or Timeline Template, then either "Export Timeline" or save the project as a `.drp` template stored in `00_TEMPLATE/DAVINCI/` (ASSET-SYSTEM.md).

**Export:** see EXPORT-STANDARD.md (H.264, 1080×1920, 30fps, ≥20 Mbps, AAC 320kbps).

## Reuse mechanic
Duplicate the saved timeline/template (`RCS90_INTRO_DAVINCI_v01`, ASSET-SYSTEM.md) at the head of a new episode timeline — do not re-edit it. Only the episode content after the montage changes per episode.
