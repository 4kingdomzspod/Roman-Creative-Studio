# CapCut Build Sheet — Intro Montage
**Status: APPROVED — v1.0, frame-accurate. Portability/reference implementation — DaVinci Resolve remains the primary production platform (see DAVINCI-BUILD.md).** Implements INTRO-MONTAGE.md's locked timeline (30fps frame numbers are the authoritative source there — this file only adds CapCut-specific execution steps, it doesn't restate the numbers). Covers only the intro montage. The full episode CapCut template (10 slots, track layout, reuse pattern) is already decided — see SYSTEM.md §6, not repeated here.

**Project settings:** New Project → Canvas **1080×1920**, **30fps** (9:16 preset should match — verify manually, presets are version-dependent).

## Folder reference
CapCut has no in-app bin/folder system. Maintain the OS/file-level folder structure per `ASSET-SYSTEM.md`'s approved naming (not the earlier-rejected Blueprint list): `02_SELECTS` with one sub-folder per shot (`Shot 01 - Hook` … `Shot 10 - Identity`), import from there. CapCut's Import panel names display as-imported — don't expect renaming to persist identically across versions.

## Layer layout (top to bottom)
| Layer | Role |
|---|---|
| Text layer | Titles — CapCut Text tool, keyframed Opacity + Scale |
| Overlay track | Secondary footage/PiP — optional, empty by default |
| Main video track | All 10 shots in sequence, frames 0–224 (INTRO-MONTAGE.md timeline) |
| Audio 1 | Music |
| Audio 2 | SFX |
| Audio 3 | Optional voice-over — reserved, empty by default |

CapCut's flatter model collapses DaVinci's separate V2 (secondary) and V4 (overlay) into one optional Overlay track — no default functionality is lost since both are unused in v1.0. **No progress tracker on any layer here** — it belongs to the episode template (SYSTEM.md §6 slot 4), not this montage (INTRO-MONTAGE.md §Progress Tracker).

## Footage Placeholders
Same placeholder-then-replace technique as DaVinci: drop a stand-in clip per slot, trim to spec, label it obviously as a placeholder. **This is a rough-timing technique only — no footage has been inspected or claimed as final.** Later, use CapCut's **Replace** function (right-click clip → Replace, or drag new clip onto existing one) to swap in real footage — this generally preserves in/out points and applied effects, but verify after each swap since behavior has changed across versions.

**Crop/framing:** select clip → **Edit → Crop**, or the on-canvas scale/position handles, to fill 1080×1920 and recenter on the shot's focal point. Avoid CapCut's "Fit" mode — it letterboxes, same caveat as DaVinci.

## Speed
Shots 03/06/08/09 only (all others 100%): Speed → **Normal** (not Curve) → 105% / 110% / 115% / 90% respectively. Speed changes shift the out-point in CapCut the same as in Resolve — re-trim to the exact Duration (Frames) in INTRO-MONTAGE.md's table afterward.

## Transitions
Default: no transition between clips = hard cut. One sanctioned exception: Shot 09→Shot 10 only — tap the transition icon, select **Dissolve** (or the closest-named cross-dissolve option in your version), set duration to **3 frames**. **3 frames = 0.1s exactly at 30fps** (3÷30 = 0.100, no rounding involved) — if your CapCut version only accepts duration in tenths of a second, entering 0.1s is exact, not an approximation, for this specific value. Blur-to-sharp: not applied unless the DaVinci build ultimately uses it (it's optional/non-default there — see INTRO-MONTAGE.md §Motion Design); if it does, the closest CapCut equivalent is a Blur filter with intensity keyframed from full to zero across Shot 10's first 2–3 frames.

## Title
- Add Text element at frame 158, duration to frame 209 (52 frames).
- Font: **Plus Jakarta Sans** if available in your CapCut version's font list; if not, use the closest installed match and flag it in STATE.md — do not silently substitute a different-feeling font as if it were equivalent.
- **Line 1** (`90 DAYS.` / `BUILDING FROM ZERO.`): Bold, ~9–11% of frame height/line, centered. Opacity 0→100 / Scale 96%→100% keyframed frame 158→162–163 (same 4–5 frame entrance as DaVinci).
- **Line 2** (`ROMAN CREATIVE STUDIO`) — separate text layer: Medium weight, ~40% of Line 1's size, tracking widened via CapCut's Letter Spacing slider (visually match DaVinci's +30 — exact numeric scales differ between apps). Opacity + Scale keyframed **frame 178–179 → 182–183** — timed so it *completes* at the ~0:06.10 beat accent (frame ~183, INTRO-MONTAGE.md §Music & Beat Structure), not a fixed stagger after Line 1.
- Exit (both lines): Opacity 100 at frame 205, Opacity 0 at frame 209.

## Color
Apply as a track-level adjustment layer if your CapCut version supports one over the full main-track span (frame 0–224); otherwise grade the first clip and use **Copy Setting → Paste Setting** to apply identically to the rest (**VERIFY CURRENT CAPCUT VERSION** — this feature's exact menu wording has changed between releases). Match DaVinci numerically where CapCut's sliders share the same scale; where they don't, match visually. Baseline, in the locked order — Exposure → White Balance → Contrast → Highlights/Shadows → Saturation:
- Contrast **+10**, Saturation **-7** (mid-points of the approved ranges)
- Highlights **-5** luminance, plus a slight warm push on the highlights color/tint control (per INTRO-MONTAGE.md §Color's "highlights warm, protected from clipping" — luminance alone isn't the whole instruction)
- Shadows **+3**, with a slight cool/blue shift (2–3°)

Clip-specific: Shots 03/04/08 (screen-sourced) get +2–3 additional contrast and a warm nudge if the screen-glow reads cooler/bluer than neighboring shots; Shot 10 (Identity) prioritizes skin-tone accuracy over matching the global grade — same rule as DaVinci, applied per-clip.

**LUT:** not applied by default. Optional/experimental only (SYSTEM.md §4 step 3) — if used, 40–60% strength, layered under these adjustments, never replacing them, never a teal-orange treatment as standard.

## Audio
- Audio 1 (Music): from frame 0, aligned to INTRO-MONTAGE.md's beat map.
- Audio 2 (SFX): each hit at its exact locked frame — 0, 23, 68, 86, 113, 158 (bass hit, key-click, whoosh, double-click, impact/drop, secondary impact). Nothing at any other cut point. Peaks 2–4dB above the music bed.
- Audio 3 (Voice): unused, reserved.
- Frame 210 (episode transition): quick duck or hard audio cut, no lingering fade — the "no fade-out" rule in INTRO-MONTAGE.md's QC is about the *visual* cut only.

## Export
See **EXPORT-STANDARD.md**: 1080×1920, 30fps, H.264, **≥20 Mbps, AAC 320kbps** where your CapCut version exposes explicit bitrate controls — otherwise use its highest available quality/bitrate preset.

## Frame-Accuracy Warning
This project's exact frame durations are **not** all clean tenths of a second — several shots (14f = 0.4667s, 10f = 0.3333s, 26f = 0.8667s, 52f = 1.7333s) would round to the *wrong* duration if entered as a rounded decimal (e.g., typing "0.5s" for Shot 01's 14 frames actually produces 15 frames — a real, silent one-frame drift). **If your CapCut version only exposes tenth-of-a-second timing entry, do not use a decimal approximation for these durations.** Instead:
1. Use frame-based counter/timeline trimming (drag the clip edge while watching a frame-number readout, if your version has one) to hit the exact frame count from INTRO-MONTAGE.md's table — this is the priority method whenever available.
2. If your version genuinely has no frame-accurate placement method at all (no frame counter, no frame-unit entry field), **do not silently round and ship it** — flag that limitation in STATE.md so it's a known, documented deviation rather than an invisible drift.

## Version-Dependent Items (flagged, not guaranteed)
- Exact menu labels for Crop, Replace, Dissolve/Cross Dissolve, Speed Curve vs. Normal, and adjustment-layer support vary across CapCut releases and platforms (mobile vs. desktop) — treat the *function* as locked and the *label* as approximate.
- Frame-based timecode entry may not be available in all versions (see §Frame-Accuracy Warning above).
- Font availability (Plus Jakarta Sans) depends on what's installed on the device CapCut is running on.

## Reuse mechanic
Save/export the finished project per your version's template mechanism into `00_TEMPLATE/CAPCUT/` (ASSET-SYSTEM.md, naming `RCS90_INTRO_CAPCUT_v01`). Duplicate for reuse — keep the montage clips untouched, add the new episode's content after it.
