# CapCut Build Sheet — Intro Montage
**Status: APPROVED — v1.0.** Implements INTRO-MONTAGE.md's locked timeline, closest CapCut equivalent to DAVINCI-BUILD.md. Covers only the intro montage. The full episode CapCut template (10 slots, track layout, reuse pattern) is already decided — see SYSTEM.md §6, not repeated here.

**Project settings:** 1080×1920, 9:16, 30fps.

## Layer layout (top to bottom)
| Layer | Role |
|---|---|
| Text layer | Titles — CapCut Text tool, keyframed Opacity + Scale |
| Overlay track | Secondary footage/PiP — optional, empty by default |
| Main video track | All 10 shots in sequence (INTRO-MONTAGE.md timeline) |
| Audio 1 | Music |
| Audio 2 | SFX |

CapCut's flatter model collapses DaVinci's separate V2 (secondary) and V4 (overlay) into one optional Overlay track — no default functionality is lost since both are off by default. **No progress tracker on any layer here** — it belongs to the episode template (SYSTEM.md §6 slot 4), not this montage (INTRO-MONTAGE.md §Progress Tracker).

## Build steps
1. Import the 10 shot clips in order, trim each to the exact duration in INTRO-MONTAGE.md's Master Timeline using the timeline trim handles. Shot 05 (Planning) is trimmed to its full 0.85s (covers the Momentum Bridge), not cut short at 0.35s.
2. Speed: apply Speed → **Normal** (not Curve) for 105% (Shot 03), 110% (Shot 06), 115% (Shot 08), 90% (Shot 09) — flat retimes, not ramps.
3. Transitions: set all to "None" (hard cut) except Shot 10 (Identity) entrance — add a Cross Dissolve, duration ~0.1s (CapCut's closest equivalent to a 2–3 frame dissolve at 30fps). Blur-to-sharp on the same transition is optional/non-default — CapCut has no native Gaussian-easing keyframe for this; skip it in CapCut unless a manual filter-opacity keyframe workaround is worth the time (DaVinci is the more natural editor for this optional touch).
4. Color: apply the manual baseline grade via the Adjust panel in this order — Exposure → White Balance → Contrast → Highlights/Shadows → Saturation (INTRO-MONTAGE.md §Color) — on one clip, then copy settings to the rest via "Copy" → "Paste Setting" (**VERIFY CURRENT CAPCUT VERSION** — this feature's exact menu wording has changed between CapCut releases). No LUT/filter applied by default; a LUT is an optional experimental branch only, never standard.
5. Text: Text → Add Text, font **Plus Jakarta Sans** if installed locally; if CapCut's font picker doesn't list it, use its closest bundled grotesque as a temporary substitute and flag it in STATE.md, not silently. Keyframe Opacity and Scale to match INTRO-MONTAGE.md §Typography's entrance/hold/exit timing.
6. Add music to Audio 1, trim to the beat-structure timestamps in INTRO-MONTAGE.md. Add SFX from CapCut's sound library to Audio 2 at the exact frame positions in INTRO-MONTAGE.md §Sound Design.
7. Save via CapCut's "Save as Template" feature, or export/re-import the project file (**VERIFY CURRENT CAPCUT VERSION** — exact save/template flow varies by release), into `00_TEMPLATE/CAPCUT/` (ASSET-SYSTEM.md).

**Export:** see EXPORT-STANDARD.md (1080×1920, 30fps, H.264, high bitrate).

## Reuse mechanic
Duplicate the saved draft/template (`RCS90_INTRO_CAPCUT_v01`, ASSET-SYSTEM.md) — keep the montage clips untouched, add the new episode's content after it.
