# Knowledge Base
## Roman Creative Studio — Agency Operating System

**Owner:** Founder
**Version:** 1.0
**Last Updated:** 2026-06-30
**Related Documents:** All AOS documents, CommunicationStandards.md

---

## Purpose

Define the structure, content categories, and maintenance standards for the Roman Creative Studio internal and client-facing knowledge bases. The knowledge base is the institutional memory of the agency.

---

## Knowledge Base Architecture

```
Knowledge Base
├── Internal (RCS Team Only)
│   ├── 01 — Frequently Asked Questions (Internal)
│   ├── 02 — Coding Standards
│   ├── 03 — Design Standards
│   ├── 04 — SEO Standards
│   ├── 05 — Accessibility Standards
│   ├── 06 — Hosting & Infrastructure
│   ├── 07 — Website Care Standards
│   ├── 08 — Internal Training
│   ├── 09 — AI Prompt Library
│   └── 10 — Employee / Contractor Handbook (future)
└── Client-Facing (Published in Client Portal)
    ├── 01 — Getting Started with Your Website
    ├── 02 — Understanding Your Monthly Report
    ├── 03 — How to Submit a Change Request
    ├── 04 — Your Care Plan, Explained
    ├── 05 — Domain and Hosting Basics
    └── 06 — SEO Basics for Business Owners
```

---

## Section 2: Coding Standards

### HTML Standards
- Semantic HTML5 elements required (`<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`, `<article>`)
- All images: `alt` attribute required; meaningful description
- Form inputs: always have associated `<label>` elements
- Skip navigation link at top of every page
- Language attribute: `<html lang="en">`; Viewport meta tag required
- No inline event handlers — use event listeners in JS

### CSS Standards
- Use RCS design token system (`tokens.css`) for all visual values
- No magic numbers — use token variables (`var(--space-4)` not `16px`)
- Mobile-first: base styles target 320px; breakpoints scale up
- No `!important` unless overriding third-party styles
- CSS load order: `tokens.css` → `base.css` → `layout.css` → `components.css`

### JavaScript Standards
- `defer` attribute on all `<script>` tags
- No jQuery — vanilla JS or modern framework only
- `const` by default; `let` when reassignment needed; never `var`
- Error handling on all form submissions and API calls

### Performance Standards
- All images: WebP format preferred; JPEG/PNG fallback
- Images: `loading="lazy"` on all below-fold images; `loading="eager" fetchpriority="high"` on hero
- Target Lighthouse: Performance > 90, Accessibility > 95, SEO > 90

### File Structure
```
/assets/brand/    # Favicon, brand SVGs
/assets/css/      # tokens.css, base.css, layout.css, components.css
/assets/images/   # All website images
/assets/js/       # main.js and page-specific scripts
/services/        # Industry/service landing pages
```

---

## Section 3: Design Standards

### Brand Colors (from tokens.css)
- Primary gold: `#D4AF37` (`--color-gold-400`)
- Dark gold: `#A88920` (`--color-gold-600`)
- Background dark: `#0C0E11` (`--color-navy-950`)
- Background light: `#F8F9FA` (`--color-gray-50`)
- Text primary: `#212529` (`--color-gray-900`)

### Typography
- Display headings: Plus Jakarta Sans (700, 800)
- Body text: Inter (400, 500, 600)
- Minimum body size: 16px (`--text-base`); Line height: 1.5–1.7

### CTA Hierarchy
- Primary (gold fill): Book Discovery Call
- Secondary (outlined): View Our Work
- Tertiary (text link): Free Website Audit
- Never more than 2 CTAs in the same visual block

### Accessibility Design Requirements
- Color contrast: minimum 4.5:1 for normal text, 3:1 for large text
- Focus indicators: visible, high-contrast ring (never `outline: none`)
- Touch targets: minimum 44×44px on mobile

---

## Section 4: SEO Standards

**Per-page checklist:** unique `<title>` (55-60 chars), unique `<meta description>` (150-160 chars), canonical tag, one `<h1>`, Open Graph tags, Twitter Card, keyword-relevant alt text, internal links to ≥ 2 relevant pages.

**Homepage Schema (minimum):**
```json
{ "@type": "LocalBusiness", "name": "Roman Creative Studio",
  "url": "https://romancreativestudio.co", "email": "Alexander@romancreativestudio.co" }
```

---

## Section 5: Accessibility Standards

**Standard:** WCAG 2.1 Level AA (minimum)

**Non-Negotiable Requirements:**
1. All images have meaningful `alt` text
2. All forms have associated `<label>` elements
3. Color contrast ratio ≥ 4.5:1 for normal text
4. All interactive elements keyboard accessible
5. Skip navigation link present
6. No auto-playing media without controls
7. Heading hierarchy never skipped

**Testing Tools:** axe DevTools, WAVE, Lighthouse (target > 95), NVDA, VoiceOver, keyboard-only navigation test

---

## Section 6: Hosting & Infrastructure

**Current Stack:** GitHub Pages / `romancreativestudio.co` / SSL auto-provision / GitHub CDN (Fastly)

| Tier | Provider | Notes |
|------|----------|-------|
| Static HTML | GitHub Pages | Free, fast, zero maintenance |
| JAMstack | Vercel | Best developer experience |
| WordPress | Kinsta or WP Engine | Managed, security-focused |
| Custom app | Vercel + Supabase | Full-stack capable |

---

## Section 7: Website Care Standards (Monthly Checklist)

```
[ ] Security scan | [ ] WordPress/plugin updates | [ ] Broken link check
[ ] Form test (submit test entry on each form) | [ ] Performance check (Lighthouse)
[ ] Backup verified | [ ] Uptime report reviewed (> 99.9% target)
[ ] SSL certificate check (flag if < 60 days) | [ ] Domain expiry check (flag if < 90 days)
[ ] Content update queue processed | [ ] Monthly report generated
```

---

## Section 9: AI Prompt Library

**Stored at:** `docs/ai-prompts/` (version-controlled in GitHub)

**Available Prompts:** proposal-generator, discovery-summary, meeting-notes, content-draft, seo-brief, seo-optimize, accessibility-review, website-audit, case-study, monthly-report, knowledge-assistant

**Prompt Quality Standards:**
- Every prompt includes: system role, output format, example input, example output
- Reviewed and updated quarterly; tested on 3 real use cases before adding
- All prompts include a "human review required" note

---

## Client-Facing Knowledge Base Articles

- **KB-C-01:** Getting Started (what to expect, who to contact)
- **KB-C-02:** Understanding Your Monthly Report (metrics explained in plain language)
- **KB-C-03:** How to Submit a Change Request (vs. new scope, response times)
- **KB-C-04:** Your Care Plan, Explained (what's included/excluded, billing, pause/cancel)
- **KB-C-05:** Domain and Hosting Basics (what they are, who manages them, SSL)
- **KB-C-06:** SEO Basics for Business Owners (plain language, why it takes 3-6 months)

---

## Knowledge Base Maintenance

| Task | Frequency | Owner |
|------|-----------|-------|
| Review all internal docs for accuracy | Quarterly | Founder |
| Update AI prompts library | Quarterly | Founder |
| Add new FAQ entries as they arise | As needed | Whoever encounters them |
| Archive outdated documents | Bi-annually | Founder |

## Technical Notes
- Internal knowledge base maintained in Markdown in this GitHub repository (`agency/docs/`)
- Client-facing KB will be served from the Client Portal (future build)
- All docs version-controlled via Git — commit history serves as version log
- Knowledge base documents feed the AI Knowledge Assistant
