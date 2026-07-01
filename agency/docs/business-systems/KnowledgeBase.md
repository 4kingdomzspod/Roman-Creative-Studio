# Knowledge Base
## Roman Creative Studio — Agency Operating System

**Owner:** Founder
**Version:** 1.0
**Last Updated:** 2026-06-30
**Related Documents:** All AOS documents, CommunicationStandards.md

---

## Purpose

Define the structure, content categories, and maintenance standards for the Roman Creative Studio internal and client-facing knowledge bases. The knowledge base is the institutional memory of the agency — it must be searchable, accurate, and maintained.

## Business Value

A maintained knowledge base enables faster onboarding of contractors, reduces support load from repetitive client questions, creates a culture of documentation that scales beyond the founder, and provides the context layer for AI automation tools.

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

## Section 1: Internal FAQ

**Audience:** Founder and future contractors

**Questions to Document:**

- How do we handle a client who wants to add scope mid-project?
- What do we do when a client misses their content deadline?
- How do we respond to a client who wants to skip the wireframe stage?
- What is our refund policy and when do we apply it?
- How do we handle a client who is never satisfied with revisions?
- What do we do when a live site goes down at 11pm?
- How do we handle a competitor asking for a quote (reconnaissance)?
- What industries do we NOT serve?
- How do we respond to a client who tries to pay late consistently?
- What happens if a project is cancelled mid-way?

**Format for Each FAQ Entry:**
```
## [Question]
**Context:** Why this comes up
**Our Answer:** [Clear, direct response]
**Internal Notes:** [Any nuance not shared publicly]
**Related Policy:** [Link to contract clause, SOP, etc.]
```

---

## Section 2: Coding Standards

**Audience:** Founder and developer contractors

**Topics to Document:**

### HTML Standards
- Semantic HTML5 elements required (`<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`, `<article>`)
- No deprecated elements (`<table>` for layout, `<font>`, `<center>`)
- All images: `alt` attribute required; meaningful description, not filename
- Form inputs: always have associated `<label>` elements
- Skip navigation link at top of every page
- Language attribute: `<html lang="en">`
- Viewport meta tag required on all pages
- No inline event handlers (`onclick` in HTML) — use event listeners in JS

### CSS Standards
- Use RCS design token system (`tokens.css`) for all visual values
- No magic numbers — use token variables (`var(--space-4)` not `16px`)
- Mobile-first: base styles target 320px; breakpoints scale up
- No `!important` unless overriding third-party styles (document the reason)
- CSS file load order: `tokens.css` → `base.css` → `layout.css` → `components.css`
- BEM naming convention not required but class names must be descriptive
- Dark section backgrounds use `var(--color-navy-950)` or `var(--color-charcoal-950)`

### JavaScript Standards
- `defer` attribute on all `<script>` tags
- No jQuery — vanilla JS or modern framework only
- `const` by default; `let` when reassignment needed; never `var`
- Error handling on all form submissions and API calls
- No blocking scripts in `<head>`
- External scripts loaded from CDN must have `integrity` and `crossorigin` attributes

### Performance Standards
- All images: WebP format preferred; JPEG/PNG fallback
- Images: `loading="lazy"` on all below-fold images
- Hero images: `loading="eager"` + `fetchpriority="high"`
- Max image width: 1920px; provide responsive `srcset` for images > 800px
- Google Fonts: `display=swap` parameter required
- Target Lighthouse score: Performance > 90, Accessibility > 95, SEO > 90

### File Structure
```
/
├── assets/
│   ├── brand/     # Favicon, brand SVGs
│   ├── css/       # tokens.css, base.css, layout.css, components.css
│   ├── images/    # All website images
│   └── js/        # main.js and any page-specific scripts
├── services/      # Industry/service landing pages
├── docs/          # Documentation
├── index.html
├── about.html
├── [page].html
├── robots.txt
├── sitemap.xml
└── .nojekyll
```

---

## Section 3: Design Standards

**Audience:** Founder and designer contractors

**Topics:**

### Brand Colors (from tokens.css)
- Primary gold: `#D4AF37` (`--color-gold-400`)
- Dark gold: `#A88920` (`--color-gold-600`)
- Background dark: `#0C0E11` (`--color-navy-950`)
- Background light: `#F8F9FA` (`--color-gray-50`)
- Text primary: `#212529` (`--color-gray-900`)

### Typography
- Display headings: Plus Jakarta Sans (700, 800)
- Body text: Inter (400, 500, 600)
- Minimum body size: 16px (`--text-base`)
- Line height body: 1.5–1.7
- Heading line height: 1.2–1.3

### Spacing
- All spacing from 4px base scale (`--space-*` tokens)
- Section padding: `--section-lg` (96px) standard; `--section-md` (80px) on mobile
- Container max-width: `--container-xl` (1280px)
- Container padding: `--container-px` (clamp 16px–32px)

### CTA Hierarchy
- Primary (gold fill): Book Discovery Call
- Secondary (outlined): View Our Work
- Tertiary (text link): Free Website Audit
- Never more than 2 CTAs in the same visual block

### Accessibility Design Requirements
- Color contrast: minimum 4.5:1 for normal text, 3:1 for large text
- Focus indicators: visible, high-contrast ring (never removed with `outline: none`)
- Touch targets: minimum 44×44px on mobile
- No information conveyed by color alone

---

## Section 4: SEO Standards

**Audience:** Founder and contractor

**Reference:** See also `docs/marketing-engine-system/SEODominationSystem.md`

**Page-Level Checklist (every page):**
- Unique `<title>` tag: 55–60 characters, primary keyword first
- Unique `<meta name="description">`: 150–160 characters, includes CTA
- `<link rel="canonical">` pointing to preferred URL
- Exactly one `<h1>` per page
- Open Graph tags: `og:title`, `og:description`, `og:type`, `og:url`, `og:image`
- Twitter Card: `twitter:card`, `twitter:image`
- All images have keyword-relevant `alt` text
- Internal links from each page to at least 2 other relevant pages

**Schema Markup (homepage minimum):**
```json
{
  "@type": "LocalBusiness",
  "name": "Roman Creative Studio",
  "url": "https://romancreativestudio.co",
  "email": "Alexander@romancreativestudio.co"
}
```

**URL Structure Standards:**
- Lowercase, hyphen-separated
- No underscores, no camelCase
- Short and descriptive: `/services/dentist-websites` not `/services/website-design-for-dentists-and-dental-practices`

---

## Section 5: Accessibility Standards

**Audience:** All team members

**Reference:** WCAG 2.1 Level AA (minimum)

**Non-Negotiable Requirements:**
1. All images have meaningful `alt` text
2. All forms have associated `<label>` elements
3. Color contrast ratio ≥ 4.5:1 for normal text
4. All interactive elements keyboard accessible
5. Skip navigation link present
6. No auto-playing media without controls
7. Heading hierarchy never skipped

**Testing Tools:**
- axe DevTools (browser extension)
- WAVE Web Accessibility Evaluator
- Lighthouse Accessibility score (target: > 95)
- NVDA (Windows screen reader)
- VoiceOver (macOS/iOS screen reader)
- Keyboard-only navigation test (Tab, Shift+Tab, Enter, Escape, arrow keys)

**Statement of Compliance:**
Every RCS website includes an accessibility commitment on the privacy/terms page. Major WCAG Level A or AA failures block launch.

---

## Section 6: Hosting & Infrastructure

**Current Stack:**
- Website hosting: GitHub Pages
- Domain: `romancreativestudio.co` (registrar: TBD)
- SSL: GitHub Pages auto-provision
- CDN: GitHub's built-in (Fastly)
- DNS: managed at registrar

**Client Site Hosting Standards:**
- All sites require HTTPS (never ship on HTTP)
- SSL must auto-renew (avoid manual certificate management)
- DNS TTL during migration: set to 300s (5 min) 48 hours before cutover, then restore after
- Backup: minimum weekly automated backup; retained 30 days
- Uptime monitoring: UptimeRobot or Uptime Kuma for all Care Plan sites

**Hosting Provider Recommendations by Tier:**
| Tier | Provider | Notes |
|------|----------|-------|
| Static HTML | GitHub Pages | Free, fast, zero maintenance |
| JAMstack | Vercel | Best developer experience |
| WordPress | Kinsta or WP Engine | Managed, security-focused |
| Custom app | Vercel + Supabase | Full-stack capable |

---

## Section 7: Website Care Standards

**Audience:** Founder and account managers

**Monthly Care Plan Checklist:**
```
[ ] Security scan (Sucuri or equivalent)
[ ] WordPress core update (if applicable)
[ ] Plugin updates (if applicable)
[ ] Broken link check
[ ] Form test (submit test entry on each form)
[ ] Performance check (Lighthouse on homepage)
[ ] Backup verified (attempt restore on staging)
[ ] Uptime report reviewed (> 99.9% target)
[ ] SSL certificate check (flag if < 60 days to expiry)
[ ] Domain expiry check (flag if < 90 days to expiry)
[ ] Content update queue processed
[ ] Monthly report generated
```

---

## Section 9: AI Prompt Library

**Audience:** Founder and AI-enabled contractors

**Stored at:** `docs/ai-prompts/` (version-controlled in GitHub)

**Available Prompts:**
- `proposal-generator.md` — Full project proposal generation
- `discovery-summary.md` — Convert raw call notes to structured summary
- `meeting-notes.md` — Clean and format meeting notes
- `content-draft.md` — Generate website page copy
- `seo-brief.md` — Create SEO content brief for a target keyword
- `seo-optimize.md` — Optimize existing page copy for SEO
- `accessibility-review.md` — Flag accessibility issues in HTML
- `website-audit.md` — Generate client-facing website audit report
- `case-study.md` — Generate case study from project data
- `monthly-report.md` — Generate Care Plan monthly performance report
- `knowledge-assistant.md` — Answer internal questions from docs context

**Prompt Quality Standards:**
- Every prompt includes: System role definition, output format specification, example input, example output
- Prompts are reviewed and updated quarterly
- New prompts require testing on 3 real use cases before adding to the library
- All prompts include a "human review required" note

---

## Section 10: Contractor Handbook (Future)

**Placeholder — to be developed when first contractor is onboarded.**

**Planned Sections:**
- Welcome and RCS Values
- Your Role and Scope
- Communication Expectations
- Tool Access and Setup
- Confidentiality Requirements
- Work Quality Standards
- How to Submit Work
- How Revisions Work
- Payment Process
- Feedback and Growth

---

## Client-Facing Knowledge Base

### KB-C-01: Getting Started with Your Website
- What to expect in the first week after launch
- How to share your website effectively
- Who to contact with questions

### KB-C-02: Understanding Your Monthly Report
- What "sessions" and "users" mean
- How to read your keyword rankings
- What Core Web Vitals mean for your business
- Green flags and red flags to watch for

### KB-C-03: How to Submit a Change Request
- What counts as a change request (vs. a new project scope)
- How to submit a request (form / email)
- Response time expectations
- How to prioritize your requests

### KB-C-04: Your Care Plan, Explained
- What's included each month
- What's NOT included (and how to add it)
- How billing works
- How to pause or cancel

### KB-C-05: Domain and Hosting Basics
- What a domain name is and who owns it
- What hosting is and who manages it
- What SSL means and why it matters
- What to do if you want to move your site

### KB-C-06: SEO Basics for Business Owners
- What SEO is (in plain language)
- Why it takes 3-6 months to see results
- What you can do to help your own SEO
- How to read your keyword rankings

---

## Knowledge Base Maintenance

| Task | Frequency | Owner |
|------|-----------|-------|
| Review all internal docs for accuracy | Quarterly | Founder |
| Update AI prompts library | Quarterly | Founder |
| Add new FAQ entries as they arise | As needed | Whoever encounters them |
| Update client KB when services change | As needed | Founder |
| Archive outdated documents | Bi-annually | Founder |

---

## Technical Notes

- Internal knowledge base is maintained in Markdown in this GitHub repository (`docs/`)
- Client-facing KB will be served from the Client Portal (future build)
- All docs are version-controlled via Git — commit history serves as version log
- Knowledge base documents feed the AI Knowledge Assistant (see AIAutomationFramework.md)

## Future Enhancements

- Searchable internal wiki (Notion, Outline, or Docusaurus)
- Knowledge base embedded in client portal with search
- AI-generated knowledge gap detection ("You get asked this question but there's no doc for it")
- Video walkthroughs for key processes (Loom)
