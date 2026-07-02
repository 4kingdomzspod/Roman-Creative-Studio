# Template Library
# Roman Creative Studio — Innovation Lab & Product Ecosystem
# Section 4 of 17 | ERD Version 1.0

---

## Purpose

Define the complete template library strategy for Roman Creative Studio — every template type, format, audience, quality standard, production process, and marketplace strategy.

**Business Value:** Templates are the fastest path to digital product revenue. They leverage work already done on client projects. Each template is a standalone asset that sells indefinitely with zero marginal cost.

**Owner:** Creative Director / CEO  
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Related Documents:** DigitalProducts.md, DesignAssets.md, ComponentMarketplace.md, ProductRoadmap.md

---

## Template Categories

### Category 1: Website Templates (Figma)

**Production standard for all Figma templates:**
- Auto-layout throughout (no fixed-width frames)
- Component-based (every repeating element is a component)
- Design token connected (colors, typography use styles/variables)
- Light + dark mode variants (where applicable)
- 3 breakpoints minimum: mobile (375px), tablet (768px), desktop (1440px)
- WCAG AA contrast verified on all text elements
- Handoff-ready: all layers named, grouped, and annotated
- Included: Style guide page, component overview page, page layouts

**Quality gate:** Template must be reviewed by a second designer before listing. No template ships with unnamed layers, missing states, or broken auto-layout.

---

### Category 2: HTML/CSS Static Templates

**Production standard:**
- Built from Figma template (design-to-code consistency required)
- Semantic HTML5
- CSS custom properties for all tokens (colors, typography, spacing)
- Mobile-first responsive
- PageSpeed score ≥90 (mobile and desktop)
- WCAG 2.1 AA compliant
- No JavaScript dependencies for basic layout
- Minimal JS only for interactions (navigation, animations)
- Clean, commented code
- README with setup instructions
- License file included

**Included files:**
```
template-name/
├── index.html
├── about.html
├── services.html
├── contact.html
├── css/
│   ├── tokens.css
│   ├── base.css
│   ├── layout.css
│   └── components.css
├── js/
│   └── main.js (minimal)
├── assets/
│   ├── images/ (placeholder images)
│   └── icons/
├── README.md
└── LICENSE.md
```

---

### Category 3: Business Document Templates

**Formats offered:**
- Google Docs (primary — most accessible)
- Microsoft Word (.docx) (for enterprise buyers)
- PDF (preview only)
- Notion (for operations templates)

**Document quality standard:**
- Professional typography (Inter or similar Google Font)
- Brand-neutral color palette (white-label ready)
- All placeholder text marked clearly: `[CLIENT NAME]`, `[DATE]`, `[AMOUNT]`
- Legal language reviewed by attorney (for contracts)
- Instructions page included at start of document
- Version number and date on every document

---

### Category 4: Notion Templates

**Production standard:**
- Duplicate link (not file export) — live Notion template
- All databases pre-configured with relevant properties
- Sample data included (5–10 rows) to show expected usage
- README page at top of workspace
- Video walkthrough included (Loom, 5–10 minutes)
- Mobile-friendly layout (collapsible sections for small screens)

---

## Template Production Process

### Step 1: Source (Day 1)
- Identify existing client work that can be generalized
- OR design new template based on documented market demand
- Document template brief: audience, pages, features, format

### Step 2: Design (Days 2–10)
- Design in Figma using RCS design system
- All 3 breakpoints designed
- Light mode complete; dark mode if applicable
- Design review by second team member (or CEO)

### Step 3: Develop (Days 11–20, if HTML version)
- Convert Figma to clean HTML/CSS
- Test across Chrome, Safari, Firefox, Edge
- Run Lighthouse audit; fix to ≥90
- Run axe accessibility audit; fix all violations
- Test on real mobile device

### Step 4: Package (Days 21–25)
- Organize files per folder structure above
- Write README.md (plain English, setup steps)
- Create 5–8 preview screenshots (1440px desktop + 375px mobile)
- Create promo graphic (1200×800px) for marketplace listing
- Write product description (300–500 words, SEO-optimized)
- Set price based on competitive analysis

### Step 5: Publish (Day 26–30)
- Upload to Gumroad (primary)
- Cross-list to Figma Community (design files)
- Schedule announcement email
- Write blog post case study demonstrating template
- Submit to Creative Market (7-day review queue)

### Step 6: Maintain
- Review quarterly: broken links, outdated components, browser issues
- Major version update annually (or when design system updates)
- Respond to support questions within 48 hours
- Update changelog in README.md

---

## Template Pricing Strategy

| Template Type | Minimum | Standard | Premium |
|--------------|---------|----------|--------|
| Figma UI Kit (single) | $29 | $49–$79 | $99–$149 |
| Figma Website Template | $49 | $79–$99 | $149–$199 |
| HTML/CSS Template | $49 | $99–$129 | $149–$249 |
| Business Document | $9 | $19–$29 | $47–$79 |
| Notion Template | $19 | $29–$49 | $79–$149 |
| Template Bundle | $79 | $149–$197 | $297–$497 |

**Bundle strategy:** After 3+ individual products exist in a category, offer a bundle at 40–50% off individual prices. Bundles drive higher AOV and reduce decision paralysis.

---

## Template Versioning

**Version format:** `v[Major].[Minor]`

| Version Change | When | Example |
|---------------|------|--------|
| Major (v1 → v2) | Full redesign, new pages, structural change | v1.0 → v2.0 |
| Minor (v1.0 → v1.1) | Bug fixes, small updates, new components | v1.0 → v1.1 |

**Buyer update policy:**
- Minor updates: Free download via Gumroad re-download
- Major updates: Free if purchased within 12 months; 50% upgrade price after

---

## Template Licensing

**Standard License (all templates):**
- 1 end project (1 website, 1 client, 1 use)
- Cannot resell or redistribute the template itself
- Can modify for client projects
- Attribution not required
- Price: Standard product price

**Extended License (premium, 5× standard price):**
- Unlimited end projects
- Can use as base for client deliverables (unlimited clients)
- Cannot resell the template itself
- Suitable for agencies using the same template across multiple clients

**Educational License:**
- Use in teaching or courses (credited to Roman Creative Studio)
- Contact: Alexander@romancreativestudio.co
- Custom pricing based on use case

---

## Template SEO & Discovery

**Keyword targets for template listings:**
- `[industry] website template figma`
- `[industry] html css template free/premium`
- `[industry] website design template`
- `web design template [industry] 2026`

**Content marketing for templates:**
- Blog post: "How I Built This Template" (process + behind the scenes)
- YouTube: Figma speed build (template creation timelapse)
- Twitter/X: Template preview GIFs (animated walkthrough)
- Newsletter: "New template: [name] — what's inside"

---

*Document: TemplateLibrary.md | Phase 11 Section 4 | Version 1.0 | 2026-07-01*
