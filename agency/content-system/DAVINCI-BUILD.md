# DaVinci Build Sheet — Intro Montage
**Status: APPROVED — v1.0, frame-accurate.** Implements INTRO-MONTAGE.md's locked timeline (30fps frame numbers are the authoritative source there — this file only adds DaVinci-specific execution steps, it doesn't restate the numbers). Covers only the intro montage. The full episode DaVinci template (10 slots, Media Pool bins, Color/Fairlight/Fusion structure) is already decided — see SYSTEM.md §7, not repeated here.

**Project settings:** New Project → Project Settings → Master Settings: timeline resolution **1080×1920** (type directly — Resolve won't auto-suggest vertical), timeline + playback frame rate **30**. Image Scaling → Input Scaling Preset: **None** (frame manually per shot, see §Footage Placeholders).

## Media Pool bins
Match `ASSET-SYSTEM.md`'s approved folder names (not the earlier Blueprint's simplified list — that structure was explicitly rejected, see STATE.md Decisions):
- Top-level bins: `01_RAW`, `02_SELECTS`, `03_MUSIC`, `04_SFX`, `05_BRAND` (with `LOGO`/`FONTS`/`GRAPHICS` sub-bins as needed)
- Inside `02_SELECTS`, one sub-bin per shot: `Shot 01 - Hook` … `Shot 10 - Identity`, `Shot 11 - Title` (empty — text lives on V3, not a media clip)

## Track roles (this montage only)
| Track | Role |
|---|---|
| V4 | Optional overlays (grain, light leaks) — off by default |
| V3 | Titles (Text+, not Fusion — see §Title) |
| V2 | Secondary footage — only if a shot needs picture-in-picture/split; optional, off by default |
| V1 | Main footage — all 10 shots in sequence, frames 0–224 (INTRO-MONTAGE.md timeline) |
| A1 | Music (main beat-synced track) |
| A2 | SFX (hits/whooshes/clicks — see §Audio) |
| A3 | Optional voice-over — reserved, empty by default |

**No progress tracker on any track here** — it belongs to the episode template (SYSTEM.md §6 slot 4), not this montage (INTRO-MONTAGE.md §Progress Tracker).

## Footage Placeholders (rough out timing before real footage is chosen)
Drop a stand-in clip of roughly the right duration into each of the 11 sub-bins; rename it `PLACEHOLDER - [shot name]` so it's obviously not final. Place each on V1 at its exact Start frame (INTRO-MONTAGE.md timeline), trim to its exact Duration (Frames). **This is a rough-timing technique only — no footage has been inspected or claimed as final; every placeholder is a labeled stand-in.**

**Cropping for 9:16:** if source is 16:9, select the clip → Inspector → Transform → use **Zoom** to fill 1080×1920, then **Pan** to recenter on the focal point (face/hands/screen, per the shot's framing intent). Do not use "Fit" — it letterboxes.

**Replacing footage later:** drag the real clip into its matching sub-bin, then on the timeline right-click the placeholder → **Replace Selected Clip**. This preserves trim points, speed, transitions, and any Transform/keyframes already on that slot — nothing else needs rebuilding.

## Speed
Shots 03/06/08/09 only (all others 100%): right-click clip → **Change Clip Speed** → 105% / 110% / 115% / 90% respectively. Applying speed can shift the out-point — after changing it, re-trim against INTRO-MONTAGE.md's Duration (Frames) column, which is the source of truth, not the percentage alone.

## Transitions
Hard cuts everywhere by default (adjacent V1 clips butted together — no action needed). One sanctioned exception: **Cross Dissolve** on the Shot 09→Shot 10 cut point (frame 112→113) — Effects Library → Video Transitions → Cross Dissolve, dragged onto that cut, duration set to **3 frames (0.1s)**. Optional, non-default: **Gaussian Blur** (Effects Library → OpenFX → Blur — not Fusion-only) on Shot 10's first 2–3 frames, blur amount keyframed ~15→0 — skip unless the dissolve alone reads as abrupt on real footage.

## Title
1. Playhead to frame 158. Effects Library → Titles → **Text+** → drag onto V3, trim to end at frame 209 (52 frames).
2. Font: **Plus Jakarta Sans**, installed system-wide (download the full family — Resolve won't list it otherwise; restart Resolve after installing).
3. **Line 1** (`90 DAYS.` / `BUILDING FROM ZERO.`): Bold (SemiBold if Bold isn't in the installed weight set), size ~9–11% of frame height/line (start ~140px at this canvas and adjust), tracking 0, centered. Opacity + Scale (96%→100%) keyframed at frame 158→162–163 (fade + micro-push in).
4. **Line 2** (`ROMAN CREATIVE STUDIO`) — separate Text+ clip on V3: Medium weight, ~40% of Line 1's size (~56px), tracking +30, centered beneath Line 1. Opacity + Scale keyframed at **frame 178–179 → 182–183** — timed so it *completes* at the ~0:06.10 beat accent (frame 183, INTRO-MONTAGE.md §Music & Beat Structure), not simply staggered a fixed 9–12 frames after Line 1.
5. Hold: no keyframes needed between entrance-complete and exit-start — both lines sit at 100%/100%.
6. Exit (both lines): Opacity 100 at frame 205, Opacity 0 at frame 209 (4-frame fade-out, no slide).

## Color
**Global baseline (Adjustment Clip, Color page):** new Adjustment Clip spanning frames 0–224, on its own track above V1 (or a dedicated grading track). Apply in the locked order — Exposure → White Balance → Contrast → Highlights/Shadows → Saturation:
- Exposure: 0 to start — adjust only if the real footage batch reads under/over-exposed
- White Balance: neutral 6500K as a starting point — don't force-match globally, correct per-clip if sources vary (this is the parameter most likely to need it)
- Contrast: **+10** (mid-point of the approved +8 to +12)
- Highlights: **-5** luminance, plus a slight warm push on the highlights color wheel (per INTRO-MONTAGE.md §Color's "highlights warm, protected from clipping" — luminance alone isn't the whole instruction)
- Shadows: **+3**, shifted 2–3° toward blue on the shadow color wheel (small nudge)
- Saturation: **-7** (mid-point of the approved -5 to -10)

**Clip-specific corrections (Shots 03/04/08 and Shot 10 only — not elsewhere):** add a Serial Node per clip on top of the global grade.
- Shots 03/04/08 (screen-sourced): +2 to +3 additional contrast; check White Balance — if the screen-glow reads cooler/bluer than neighboring camera shots, pull temperature slightly warm to neutralize it.
- Shot 10 (Identity): Qualifier + skin-tone isolation if skin reads off under the global grade — pick the skin range with the qualifier, adjust warmth/saturation on that isolated range rather than re-grading the whole shot.

**LUT:** not applied by default anywhere above. Optional/experimental only (SYSTEM.md §4 step 3) — if one is tested later, it's a light film-emulation LUT at 40–60% opacity layered *under* these node adjustments, never replacing them, and never a teal-orange treatment as standard.

## Audio
- **A1 Music:** starting frame 0. Align structural beats to INTRO-MONTAGE.md's beat map (downbeat frame 0, riser ~frame 53, riser peak ~frames 95–112, drop frame 113, secondary hit frame 158). Bed level ~-14 to -10 on Resolve's meter, leaving headroom for SFX.
- **A2 SFX**, each hit at its exact frame: bass hit (0), key-click (23), whoosh (68), double-click (86), impact/drop (113), secondary impact (158) — INTRO-MONTAGE.md §Sound Design. Peaks 2–4dB above the music bed; whoosh/clicks sit closer to bed level.
- **A3 Voice:** empty, reserved.
- **Episode-transition duck (frame 210):** a quick 2–3 frame volume duck on A1, or a hard audio cut — both are acceptable. The "no fade-out" rule in INTRO-MONTAGE.md's QC is about the *visual* cut only; audio ducking is fine. A quick duck (not a lingering fade) is recommended so the episode's own audio doesn't fight the intro's tail.

**Export:** see EXPORT-STANDARD.md (H.264, 1080×1920, 30fps, ≥20 Mbps, AAC 320kbps).

## Reuse mechanic
Save the finished timeline as a Compound Clip or Timeline Template, then either "Export Timeline" or save the project as a `.drp` template in `00_TEMPLATE/DAVINCI/` (ASSET-SYSTEM.md). Duplicate it at the head of a new episode timeline for reuse — do not re-edit the montage itself; use **Replace Selected Clip** (§Footage Placeholders) if a shot needs swapping later. Only the episode content after the montage changes per episode.
