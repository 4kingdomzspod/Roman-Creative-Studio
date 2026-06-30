# File & Asset Management Rules
**Roman Creative Studio — Brand Governance System**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

Define how brand assets are stored, named, versioned, and delivered. File management is a professional standard, not a personal preference. A disorganized asset library causes duplicate work, version confusion, incorrect logo usage, and quality defects that reach clients.

> **If you can't find it in under 30 seconds, the folder structure has failed.**

---

## 1. Master Folder Structure

All RCS brand and project assets follow this structure:

```
assets/
├── brand/
│   ├── logo/
│   │   ├── svg/          ← SVG source files, all variants
│   │   ├── png/          ← PNG exports, all variants + sizes
│   │   ├── ico/          ← Favicon ICO file
│   │   └── source/       ← Original design files (Figma, Illustrator)
│   ├── colors/           ← Color swatch files, token exports
│   ├── fonts/            ← Licensed font files (if self-hosting)
│   ├── icons/            ← Approved icon library (Heroicons set)
│   └── patterns/         ← Brand pattern/texture files
├── images/
│   ├── team/             ← Team headshots and photos
│   ├── services/         ← Service illustration / photography
│   ├── portfolio/        ← Client work screenshots (by client folder)
│   └── social/           ← Social media graphics
│       ├── instagram/
│       ├── linkedin/
│       └── youtube/
├── documents/
│   ├── proposals/        ← Proposal templates and completed proposals
│   ├── contracts/        ← Contract templates
│   ├── invoices/         ← Invoice templates
│   ├── presentations/    ← Slide deck templates
│   └── case-studies/     ← Case study documents
└── exports/
    └── [project-name]/   ← Final exports organized by project
```

### Client Project Structure

Each client project lives in its own folder:

```
clients/
└── [client-name]/
    ├── briefs/           ← Discovery notes, briefs, intake forms
    ├── design/
    │   ├── wireframes/
    │   ├── mockups/
    │   └── final/
    ├── assets/           ← Client-provided assets (logos, photos)
    ├── deliverables/     ← Final deliverables sent to client
    ├── correspondence/   ← Emails, notes, meeting summaries
    └── invoices/         ← Project-specific invoices
```

---

## 2. File Naming Conventions

### The Naming Formula

```
[asset-type]-[descriptor]-[variant]-[size]-[version].[ext]
```

All lowercase. Hyphens only. No spaces. No underscores. No camelCase.

### Logo File Names

```
rcs-logo-primary-full.svg
rcs-logo-primary-full@2x.png
rcs-logo-horizontal-dark.svg
rcs-logo-horizontal-dark@2x.png
rcs-logo-horizontal-light.svg
rcs-logo-horizontal-light@2x.png
rcs-logo-stacked-dark.svg
rcs-logo-icon-only.svg
rcs-logo-icon-only@2x.png
rcs-logo-wordmark-only.svg
rcs-logo-social-profile.png
rcs-favicon.ico
rcs-apple-touch-icon.png
```

### Image File Names

```
[subject]-[description]-[dimensions].[ext]

team-alexander-headshot-800x800.jpg
service-web-design-hero-1920x1080.webp
portfolio-dental-practice-screenshot-1440x900.webp
social-instagram-post-services-1080x1080.png
```

### Document File Names

```
[doc-type]-[client-name]-[date]-v[version].[ext]

proposal-smith-dental-2025-01-15-v1.pdf
proposal-smith-dental-2025-01-20-v2.pdf
contract-smith-dental-2025-01-22-v1.pdf
invoice-smith-dental-2025-02-01-001.pdf
```

### Design Source File Names

```
[project]-[file-type]-[date].fig

rcs-website-design-2025-01.fig
smith-dental-website-design-2025-02.fig
rcs-social-templates-2025-01.fig
```

---

## 3. Version Control Rules

### Prohibited Version Naming

The following file names are permanently prohibited:

- ❌ `final.pdf`
- ❌ `final-final.pdf`
- ❌ `final-FINAL.pdf`
- ❌ `new-version.pdf`
- ❌ `updated.pdf`
- ❌ `revised.pdf`
- ❌ `proposal-v3-USE THIS ONE.pdf`
- ❌ `logo-CORRECT.svg`
- ❌ Any file name that contains "final" without a version number

### Required Version System

Version numbers follow `v[major].[minor]` format:

- `v1` — Initial version
- `v1.1` — Minor revision (content edit, small correction)
- `v2` — Significant revision (structural change, major rewrite, redesign)

**Rule:** When a new version is created, do not delete the old version. Archive it in an `archive/` subfolder. The latest version is always in the primary folder. The archive preserves history.

### Design File Versioning

Design tools (Figma, etc.) have built-in version history. Use named versions at each client milestone:
- "Draft 1 — Sent for Review"
- "After Client Feedback 1"
- "Final Approved"
- "Revised After Launch"

---

## 4. Export Format Rules

### Images

| Image Type | Preferred Format | Fallback Format | Never Use |
|------------|-----------------|-----------------|----------|
| Logo (digital) | SVG | PNG (2× minimum) | JPEG, GIF, BMP |
| Photography (web) | WebP | JPEG (85% quality) | PNG (too large), BMP |
| Screenshots (web) | WebP | PNG | JPEG (artifacts) |
| Social graphics | PNG | JPEG (90% quality) | GIF (unless animated), BMP |
| Favicon | ICO | PNG (multiple sizes) | SVG (limited browser support) |
| Icons (web) | SVG (inline) | SVG (file) | PNG icon files |
| Print (all) | PDF (vector) | EPS, AI | JPEG, PNG |

### Image Size Standards

| Context | Recommended Width | Notes |
|---------|------------------|---------|
| Hero / full-width background | 1920px | Export both 1x and 2x |
| Section images | 1200px | |
| Card / thumbnail images | 800px | |
| Blog post images | 1200px | |
| Team headshots | 800px × 800px | Square |
| OG / social share images | 1200px × 630px | |
| Social post (square) | 1080px × 1080px | |
| Social post (portrait) | 1080px × 1350px | |
| Story / TikTok | 1080px × 1920px | |

### Asset Optimization Rules

All web images must be optimized before deployment:

| Format | Target File Size | Tool |
|--------|-----------------|------|
| WebP | < 150KB for hero, < 80KB for cards | Squoosh, ImageOptim |
| JPEG | < 200KB for hero, < 100KB for cards | ImageOptim, TinyJPG |
| PNG | < 100KB for UI graphics | TinyPNG |
| SVG | Minified, remove editor metadata | SVGO |

**Rule:** No unoptimized image is deployed to production. Large images are the single most impactful factor in page speed, and page speed directly affects SEO and conversion.

---

## 5. Asset Delivery Rules

### To Clients

- **Logo packages:** ZIP file containing SVG + PNG (multiple sizes) + ICO. Never send AI or PSD files unless explicitly contracted.
- **Documents:** Always PDF. Never editable source files unless the contract includes editable files.
- **Photos/images:** Original quality files + web-optimized versions in separate folders.
- **Delivery method:** Secure file transfer link (not email attachments for large files). Link expires after 30 days.

### From Clients

- **Receive all client assets in a dedicated `[client-name]/assets/client-provided/` folder.**
- **Never edit client-provided originals.** Make a copy and edit the copy.
- **Document what was received:** List client-provided assets in the project brief.

---

## 6. Asset Audit Schedule

| Asset Category | Audit Frequency | Action Items |
|---------------|----------------|-------------|
| Logo files | Annually | Verify all variants are current, delete outdated versions |
| Photography | Annually | Remove unused, verify licenses are current |
| Social templates | Quarterly | Verify brand consistency, update dated content |
| Document templates | Bi-annually | Verify pricing, services, contact info are current |
| Font files | When hosting changes | Verify license compliance |

---

## Related Documents
- `docs/brand-governance/LogoUsageRules.md` — Logo format requirements
- `docs/visual-identity/LogoSystem.md` — Logo variant specifications
- `docs/brand-governance/BrandEvolutionRules.md` — When assets are updated
- `docs/operations/QAChecklist.md` — Image optimization in QA process
