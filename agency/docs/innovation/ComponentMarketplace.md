# Component Marketplace — Roman Creative Studio
## Innovation Lab | Section 3C
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Owner:** Chief Innovation Officer + Lead Software Engineer  
**Status:** Planning Phase (Year 2 Launch Target)

---

## Overview

The RCS Component Marketplace is a curated library of production-ready HTML, CSS, and JavaScript components — the code implementation layer that accompanies our Figma design assets. Where DesignAssets.md covers the visual design layer, this document covers the coded component ecosystem.

**Market Position:** Premium quality over volume. Every component is hand-coded, not AI-generated without review. Every component ships with accessibility built in, not bolted on.

**Revenue Model:** Individual component packs, full component libraries, and subscription access for agencies.

---

## Component Categories

### Category 1: Navigation Components (NAV)

| ID | Component | Features | Price |
|----|-----------|----------|-------|
| NAV-01 | Sticky Navigation Pack | 8 variants, mobile hamburger, smooth scroll | $39 |
| NAV-02 | Mega Menu System | Dropdown, flyout, tabbed mega menu | $59 |
| NAV-03 | Mobile Navigation Pack | Slide-in, full-screen, bottom tab bar | $44 |
| NAV-04 | Breadcrumb & Progress Nav | Breadcrumb, stepper, wizard progress | $29 |
| NAV-05 | Sidebar Navigation | Collapsible, icon-only, nested items | $49 |

### Category 2: Hero & Landing Components (HERO)

| ID | Component | Features | Price |
|----|-----------|----------|-------|
| HERO-01 | Animated Hero Pack | 6 hero variants with CSS animations | $59 |
| HERO-02 | Video Background Hero | Autoplay, fallback image, overlay controls | $44 |
| HERO-03 | Split Layout Heroes | Image/text, illustration/CTA variants | $39 |
| HERO-04 | Countdown Timer Hero | Launch page, sale countdown, event timer | $34 |
| HERO-05 | Parallax Hero Pack | Smooth parallax, mobile-safe fallback | $49 |

### Category 3: Forms & Inputs (FORM)

| ID | Component | Features | Price |
|----|-----------|----------|-------|
| FORM-01 | Contact Form Pack | 6 layouts, validation, success states | $49 |
| FORM-02 | Multi-Step Form System | Progress bar, validation, step navigation | $79 |
| FORM-03 | Search Components | Live search, filters, autocomplete | $59 |
| FORM-04 | File Upload Components | Drag-drop, preview, progress indicator | $44 |
| FORM-05 | Booking/Availability Form | Date picker, time slots, confirmation | $89 |

### Category 4: Cards & Content (CARD)

| ID | Component | Features | Price |
|----|-----------|----------|-------|
| CARD-01 | Service Card Pack | 8 card layouts for service businesses | $39 |
| CARD-02 | Testimonial Card Pack | 6 variants, star ratings, avatars | $34 |
| CARD-03 | Blog Post Card Pack | 6 layouts, category tags, author info | $34 |
| CARD-04 | Pricing Card Pack | 8 pricing table variants | $49 |
| CARD-05 | Portfolio/Project Cards | Grid, masonry, hover effects | $44 |
| CARD-06 | Team Member Cards | 6 layouts, social links, bio toggle | $34 |

### Category 5: Modals & Overlays (MOD)

| ID | Component | Features | Price |
|----|-----------|----------|-------|
| MOD-01 | Modal Library | 8 modal types, focus trap, keyboard nav | $49 |
| MOD-02 | Toast Notification System | Success/error/warning/info, queue, auto-dismiss | $39 |
| MOD-03 | Lightbox Gallery | Image + video, keyboard, touch swipe | $44 |
| MOD-04 | Cookie Consent Banner | GDPR-ready, preference center, localStorage | $59 |
| MOD-05 | Announcement Bar | Dismissible, countdown, CTA variants | $29 |

### Category 6: Data Display (DATA)

| ID | Component | Features | Price |
|----|-----------|----------|-------|
| DATA-01 | Stats Counter Pack | Animated counters, scroll-trigger | $34 |
| DATA-02 | Progress Indicators | Bar, circle, step, skill charts | $39 |
| DATA-03 | Timeline Component | Vertical, horizontal, milestone variants | $39 |
| DATA-04 | Comparison Table | Feature matrix, 2-4 column, sticky header | $44 |
| DATA-05 | FAQ Accordion Pack | Single/multi expand, search, categories | $34 |

### Category 7: Media & Visual (MEDIA)

| ID | Component | Features | Price |
|----|-----------|----------|-------|
| MEDIA-01 | Image Gallery Pack | Grid, masonry, slider, lightbox-ready | $49 |
| MEDIA-02 | Video Player Components | Custom controls, playlist, autoplay | $54 |
| MEDIA-03 | Slider/Carousel Pack | Touch, keyboard, autoplay, indicators | $49 |
| MEDIA-04 | Before/After Slider | Drag comparison, touch-friendly | $34 |
| MEDIA-05 | Logo Marquee/Scroll | Client logos, infinite scroll, pause-on-hover | $29 |

### Category 8: Utility & Interaction (UTIL)

| ID | Component | Features | Price |
|----|-----------|----------|-------|
| UTIL-01 | Scroll Animation Pack | Fade, slide, scale triggers | $39 |
| UTIL-02 | Copy-to-Clipboard Components | Code blocks, inline copy, feedback | $24 |
| UTIL-03 | Back-to-Top Button | Smooth scroll, progress ring variant | $19 |
| UTIL-04 | Dark Mode Toggle | System detection, localStorage, transitions | $34 |
| UTIL-05 | Loading State Pack | Skeleton screens, spinners, progress | $39 |

---

## Technical Standards

### Code Quality Requirements

Every component must meet the following before release:

**HTML:**
- Semantic elements (not div soup)
- Valid HTML5
- BEM naming convention
- Minimal nesting depth

**CSS:**
- CSS custom properties for all configurable values
- No `!important` (rare exception with documented reason)
- Responsive without media query fragility
- Follows RCS 4-layer architecture where applicable
- Dark mode via `prefers-color-scheme` and/or class toggle

**JavaScript:**
- Vanilla JS only (no jQuery dependency)
- ES6+ with no build step required (or ESM with instructions)
- Event delegation where possible
- No global namespace pollution
- Destroyable (event listeners removable)

**Accessibility (WCAG 2.1 AA minimum):**
- Keyboard navigable
- Focus visible
- ARIA labels where native semantics insufficient
- Screen reader tested (VoiceOver + NVDA)
- Color contrast minimum 4.5:1 (text), 3:1 (UI)
- No motion without `prefers-reduced-motion` fallback

**Performance:**
- No render-blocking resources
- Images lazy-loaded
- Animations use `transform` and `opacity` only (GPU-composited)
- Bundle size documented
- Lighthouse Performance score ≥90 in isolation

---

## Marketplace Architecture

### Year 1: Third-Party Platforms
```
Lemon Squeezy (primary)
├── Individual component packs
├── Category bundles
└── Full library access

Gumroad (secondary)
├── Individual components
└── Starter bundles
```

### Year 2: Own Marketplace (rcs.shop or shop.romancreativestudio.co)
```
Next.js Storefront
├── Stripe Checkout + Stripe Customer Portal
├── License key generation (Lemon Squeezy API or custom)
├── Download delivery
├── Update notifications
└── Account area (purchase history, downloads, licenses)
```

### Year 3: Subscription Tier
```
RCS Component Club ($49/mo or $399/yr)
├── Access to all 40+ component packs
├── New components monthly
├── Early access to new releases
├── Request a component (community voting)
└── Slack community access
```

---

## Subscription Model (Year 3 Target)

| Tier | Price | Access | Target |
|------|-------|--------|--------|
| Individual | $29/mo or $249/yr | Personal use, 1 designer | Freelancers |
| Team | $79/mo or $699/yr | Up to 5 designers, unlimited projects | Small agencies |
| Agency | $149/mo or $1,299/yr | Unlimited designers, white-label rights | Mid agencies |

**MRR Target at 50 subscribers:** $1,450/mo (Individual avg)
**MRR Target at 200 subscribers:** $5,800/mo

---

## Launch Strategy

### Phase 1 (Month 8–10): Soft Launch
- Launch 3–5 most polished packs on Lemon Squeezy
- Announce to existing email list and LinkedIn
- Price 20% below target for early-adopter feedback
- Collect testimonials from first 20 buyers

### Phase 2 (Month 11–14): Growth
- Expand to 10–15 packs
- Submit to Lemon Squeezy featured section
- Partner with design newsletters (Pixels, Sidebar, etc.)
- Create YouTube demos for top-selling components
- Guest posts on CSS-Tricks / Smashing Magazine

### Phase 3 (Month 18–24): Own Storefront
- Launch shop.romancreativestudio.co
- Migrate existing customers
- Introduce bundle and subscription options
- Build affiliate program (20% commission)

---

## Component Request System

Allow customers to request components — drives product direction and engagement.

**Process:**
1. Customer submits request via form (email + description)
2. Added to public voting board (Canny or Notion public board)
3. Monthly review: top-voted requests enter production
4. Requester gets early access + credit in release notes
5. Announcement email to list on launch

**Benefit:** Ensures we build what people will buy.

---

## Affiliate Program (Year 2)

| Tier | Commission | Threshold | Payout |
|------|------------|-----------|--------|
| Standard Affiliate | 20% | No minimum | Monthly via PayPal |
| Creator Partner | 25% | $500/mo referred | Monthly via PayPal |
| Agency Partner | 30% | $2,000/mo referred | Monthly via Stripe |

**Assets provided:** Product screenshots, demo videos, copy snippets, discount codes

---

## Revenue Projections

| Year | Packs Available | Avg Units/Mo | AOV | Monthly Revenue |
|------|-----------------|--------------|-----|------------------|
| Year 1 (partial) | 5–8 | 15–30 | $42 | $630–$1,260 |
| Year 2 | 20–30 | 60–120 | $55 | $3,300–$6,600 |
| Year 3 | 35–45 | 150–300 | $48 blended | $7,200–$14,400 |

*Year 3 blended AOV lower due to subscription revenue mix.*

---

## Quality Assurance Process

```
Component Built
      ↓
Self-Review (author checklist)
      ↓
Peer Code Review (Lead Engineer)
      ↓
Accessibility Audit
      ↓
Cross-Browser Test (Chrome, Firefox, Safari, Edge)
      ↓
Mobile Device Test (iOS Safari, Android Chrome)
      ↓
Documentation Review
      ↓
Marketing Asset Creation (screenshots, demo)
      ↓
Release Approval (CIO sign-off)
      ↓
Publish + Announce
```

---

## Documentation Standard per Component Pack

Every pack must include:

1. **README.md** — Overview, what's included, browser support, license
2. **INSTALL.md** — Copy/paste instructions for all integration methods
3. **USAGE.md** — All variants documented with code examples
4. **CUSTOMIZE.md** — CSS custom properties reference + examples
5. **ACCESSIBILITY.md** — ARIA attributes, keyboard interactions, screen reader notes
6. **CHANGELOG.md** — Version history
7. **demo/index.html** — Working demo of all variants

---

## Implementation Timeline

| Milestone | Target | Owner |
|-----------|--------|-------|
| Internal use: NAV-01, FORM-01, CARD-01 on 5 client projects | Month 1–6 | Lead Engineer |
| First pack release: NAV-01 on Lemon Squeezy | Month 8 | CIO + Engineer |
| 5 packs live | Month 10 | Lead Engineer |
| First $500/mo component revenue | Month 11 | CIO |
| 15 packs live | Month 16 | Lead Engineer |
| Own storefront launch | Month 20 | SaaS Architect |
| Subscription tier launch | Month 28 | SaaS Architect |