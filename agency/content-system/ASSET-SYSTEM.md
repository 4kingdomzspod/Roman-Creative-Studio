# Asset System
**This structure lives on Alexander's local/cloud editing storage — never in this git repo.** Raw footage, exports, and editor project binaries are git-ignored (`.gitignore`) on purpose (SYSTEM.md, repo README). This repo holds only the specs that describe the structure.

## Folder structure
```
RCS_90_DAY/
├── 00_TEMPLATE/
│   ├── DAVINCI/          ← RCS90_INTRO_DAVINCI_v01 project + episode master
│   └── CAPCUT/           ← RCS90_INTRO_CAPCUT_v01 draft + episode master
├── 01_RAW/
│   ├── OLDER/            ← pre-series footage being mined for the intro montage
│   └── NEW/               ← footage shot for current/future episodes
├── 02_SELECTS/            ← clips pulled from 01_RAW, tagged per INTRO-MONTAGE.md shot IDs
├── 03_MUSIC/
├── 04_SFX/
├── 05_BRAND/
│   ├── LOGO/               ← mirrors assets/brand/ in this repo (logo-icon.svg etc.)
│   ├── FONTS/               ← Inter, Plus Jakarta Sans (SYSTEM.md §3)
│   └── GRAPHICS/
├── 06_COLOR/               ← LUTs, if/when SYSTEM.md §4 step 3 approves one
├── 07_EPISODES/
│   ├── EP01/
│   ├── EP02/
│   └── …
└── 08_EXPORTS/             ← final renders, ready to publish
```

## Naming convention
`[SERIES][ASSET]_[TYPE]_[qualifier]_v[NN]`, uppercase, underscore-separated.

| Example | Use |
|---|---|
| `RCS90_INTRO_MASTER_v01` | Master creative blueprint reference |
| `RCS90_INTRO_DAVINCI_v01` | DaVinci intro montage project/timeline |
| `RCS90_INTRO_CAPCUT_v01` | CapCut intro montage draft |
| `RCS90_EP01_MASTER` | Episode 1 working project |
| `RCS90_EP01_FINAL` | Episode 1 final render |
| `RCS90_BROLL_WORK_001` | B-roll, WORK category, clip 1 |
| `RCS90_BROLL_CRM_001` | B-roll, CRM category, clip 1 |
| `RCS90_SFX_IMPACT_001` | SFX asset |

Version bumps: `_v01` → `_v02` on a real revision. Never `final`, `final-final`, or unversioned "latest" names (same prohibition as `docs/brand-governance/FileAssetManagement.md` §3 — cited, not re-derived).

## B-roll shot categories
For tagging clips in `02_SELECTS/` once real footage is reviewed:
`WORK` (laptop, PC, typing, editing, coding) · `RCS` (website work, CRM, client work, planning) · `LIFE` (driving, morning, walking, transitions) · `BUSINESS` (meetings, calls, research, outreach) · `STORY` (late nights, early mornings, wins, setbacks)
