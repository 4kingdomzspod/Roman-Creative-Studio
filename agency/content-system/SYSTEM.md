# RCS Content System v1.0
**Series:** 90 DAYS → $10K — Alexander documents a real 90-day attempt to generate $10,000 through Roman Creative Studio. Recurring question: *"Will I make it—or will I break it?"*
**Platforms:** TikTok, Instagram Reels (one 9:16 master edit, ~80–90% shared between both — see §Platform).
**Tools:** CapCut Desktop (daily production) · DaVinci Resolve Free (weekly/advanced development).
**Goal:** selected footage → publish-ready episode in ~20–30 min.

State/versioning/changelog live in [STATE.md](STATE.md), not here. Brand color/font/logo *rules* live in `docs/brand-governance/SocialMediaBrandingRules.md` and `docs/visual-identity/` — not duplicated here; values are cited where an editor needs them in-context. Intro montage, DaVinci/CapCut build sheets, asset naming, episode checklist, and export settings each have their own file (linked in [README.md](README.md)) — not duplicated here either.

---

## 1. Identity
Authentic, documentary, entrepreneurial, cinematic but restrained, modern, clean, professional, story-driven, visually recognizable. **Not** generic influencer content. Priority order when two goals conflict: **Story > Retention > Consistency > Speed > Brand recognition.** Do not over-design.

## 2. Episode Structure
```
HOOK → visual proof → SIGNATURE MONTAGE → episode title card → story →
conflict/problem → action → result/realization → next step → CTA
```
Hook always comes **before** the signature montage. Example:
> "I'm giving myself 90 days to make $10,000." → rapid clips → **90 DAYS → $10K / EP. 01 — THE BEGINNING**

**Signature montage:** the reusable RCS intro — full spec in [INTRO-MONTAGE.md](INTRO-MONTAGE.md). Evolution/version changes logged in STATE.md, not here.

## 3. Reusable Visual System
| Element | Spec |
|---|---|
| Captions | Auto-caption, styled once, saved as a CapCut Text Style / DaVinci text template. Clean, high-contrast, no word-by-word pop animation. |
| Caption font | Inter (free, OFL, already licensed sitewide) |
| Title/number font | Plus Jakarta Sans (free, OFL, already licensed sitewide) — matches `--font-display` in `assets/css/tokens.css` |
| Palette | Charcoal `#0C0E11` bg · Surface `#1B1E23` · Gold `#D4AF37` accent · Warm white `#F0EFE9` text (per `docs/visual-identity/ColorSystem.md`) |
| Logo watermark | `assets/brand/logo-icon.svg` (or `logo-primary-white.svg`), bottom-right, small — matches `docs/brand-governance/SocialMediaBrandingRules.md` §1 rule 4 |
| Episode title card | "90 DAYS → $10K" (Plus Jakarta Sans, bold) + "EP. NN — TITLE" (gold accent line). Full-bleed dark card, 1–2s hold. |
| Episode numbering | `EP. 01`, `EP. 02`, … zero-padded two digits |
| Progress tracker | Small lower-third or corner overlay: `DAY XX / 90` + `$X / $10,000`. One reusable graphic (compound clip/Fusion template) with 2 editable text fields — never rebuilt, values pulled from STATE.md |
| CTA | End-card, gold text on charcoal: default `"Follow to watch Day X/90"` — vary wording per episode's actual next-step/hook |
| Transitions | Hard cuts primary. J-cuts and L-cuts for dialogue-to-B-roll. Subtle speed ramps only. No spin/zoom/whoosh-transition effects. |
| SFX | Minimal: one whoosh on montage cuts, one soft tick on progress-tracker reveal, one subtle riser into the hook. Use CapCut's built-in royalty-free library or an already-licensed pack — never an unlicensed download. |
| Music | One recurring theme + 2–3 rotation alternates, commercially licensed (Epidemic Sound/Artlist if licensed, else YouTube Audio Library or CapCut's commercial-use tracks). Duck under dialogue automatically; hard rule: dialogue must stay intelligible. |

Avoid: excess emojis, word-by-word animation, transition effects, zoom effects, visual clutter, influencer-style effects.

## 4. Color Pipeline (correction-first — no creative LUT yet)
1. **Normal footage:** exposure → white balance → contrast → highlights/shadows → saturation → skin-tone consistency.
2. **Log footage:** technical conversion (Rec.709 or camera-appropriate LUT) first, *then* the normal-footage steps above.
3. **Creative LUT:** only after testing on real footage proves it improves consistency. Do not force a LUT because the system has one. Decision + rationale logged in STATE.md when made.

## 5. Platform System
One 9:16 (1080×1920) master edit. TikTok and Reels share ~80–90% of the same edit. Platform-specific changes (caption placement clear of native UI, trending-audio swap, etc.) only when they materially improve performance — never two independent edits.

## 6. CapCut Master Template
One saved CapCut project = the master. Reusable slots (in edit order):
1. Hook 2. B-roll/proof 3. Signature montage (see [INTRO-MONTAGE.md](INTRO-MONTAGE.md) / [CAPCUT-BUILD.md](CAPCUT-BUILD.md)) 4. Episode title 5. Main story 6. Conflict 7. Action 8. Result 9. Next step 10. CTA

Track layout: `V3` progress tracker + titles (compound clip) · `V2` B-roll/overlay · `V1` main footage per slot · `A1` sync dialogue · `A2` music · `A3` SFX. Caption style, title style, progress-tracker compound clip, music, and SFX tracks are saved once in the master and duplicated per episode — daily edits only replace footage in slots 1–10 and update the two progress-tracker numbers.

## 7. DaVinci Resolve Free Template
Same 10 slots, mirrored as Media Pool bins + Edit-page timeline markers in one saved "RCS Episode" project. Slot 3 (signature montage) implementation detail: [DAVINCI-BUILD.md](DAVINCI-BUILD.md).
- **Edit page:** same track layout as CapCut (§6).
- **Color page:** node chain = Node1 (exposure/WB) → Node2 (contrast/highlights-shadows) → Node3 (saturation/skin tone) → Node4 (creative LUT, disabled until §4 step 3 is satisfied).
- **Fairlight:** dialogue/music/SFX levels, same 3-track split as CapCut.
- **Fusion:** used once to build the reusable title-card + progress-tracker template (saved as a Generator/Template); not touched per-episode.
- **Cadence:** DaVinci for ~1 episode/week (advanced/development edit, builds real skill); CapCut carries daily volume. This is a deliberate split, not a bug — do not force every episode through DaVinci.

## 8. Filming Guide (minimum useful, not everything)
| Shot type | Capture | Typical/day |
|---|---|---|
| Establishing | Location/workspace wide shot | 1–2 |
| Working | Hands-on-keyboard, calls, real work | 3–5 |
| Screen/B-roll | Screen recordings, close-ups of work product | 2–4 |
| Movement | Walking, transitions between spaces/tasks | 2–3 |
| Reaction/moment | Genuine reaction — frustration, relief, realization | 1–3 |
| Outcome/proof | Deal closed, payment received, deliverable shipped | as they happen |

Do not film every moment. Live normally; grab short (5–15s) clips at natural breakpoints. ~10–15 short clips/day is enough for a full episode.

## 9. Episode File
Per-episode tracking lives at `episodes/epNN.md`. Minimal template (copy for each new episode):
```md
# EP.NN — <Title>
Day: XX/90 | Status: PLAN
Hook: "<line>"
Footage: <shot list checklist or note>
Story beats: conflict / action / result
CTA: <line>
Publish: TikTok <date/link> · Reels <date/link>
QC: <pass/fail, see §10>
Review notes: <what worked, what to fix>
```
Status values track the workflow in [README.md](README.md): PLAN → FILM → INGEST → SELECT → EDIT → QC → EXPORT → PUBLISH → REVIEW → DONE. Step-by-step checklist per status: [EPISODE-WORKFLOW.md](EPISODE-WORKFLOW.md).

## 10. QC Checklist (~60 seconds, pre-publish)
- [ ] Hook lands in first 1–2s
- [ ] Pacing has no dead air / drags
- [ ] Story is clear without sound (captions carry it)
- [ ] Captions: no typos, synced, readable
- [ ] Audio: dialogue clear, no clipping
- [ ] Music level under dialogue, not competing
- [ ] Visual quality: exposure/WB consistent shot-to-shot
- [ ] Progress tracker shows correct DAY XX/90 and $X/$10,000
- [ ] CTA present and matches next-step
- [ ] Export settings correct — see [EXPORT-STANDARD.md](EXPORT-STANDARD.md)

## 11. Versioning Policy
v1.0 = initial working prototype. v1.1 = proven improvements from real episodes (not theory). v2.0 = major workflow change. Only bump after actual episode experience. Changelog entries live in STATE.md.
