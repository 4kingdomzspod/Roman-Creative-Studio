# Responsive Behavior System
**Roman Creative Studio — Design System Engine**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

Define how every component and section in the design system behaves across all breakpoints. This is the engineering specification for responsive behavior — not a conceptual guide. Every rule here maps directly to CSS implementation.

> **Mobile-first means the base CSS targets mobile. Desktop is the enhancement.**

---

## Breakpoint Token Reference

```css
/* Applied via min-width media queries only */
/* --bp-xs:  320px  — minimum supported */
/* --bp-sm:  480px  — large phones      */
/* --bp-md:  768px  — tablets           */
/* --bp-lg: 1024px  — desktop           */
/* --bp-xl: 1280px  — wide desktop      */
```

**Rule:** CSS tokens cannot be used inside media queries in standard CSS. Use the raw pixel values.

```css
/* ✅ Correct */
@media (min-width: 768px) { ... }

/* ❌ Prohibited */
@media (min-width: var(--bp-md)) { ... }  /* doesn't work */
```

---

## Responsive Token Overrides

These tokens are overridden at breakpoints to scale the design system:

```css
/* Mobile base (no query) */
:root {
  --text-display: 36px;
  --text-5xl:     30px;
  --text-4xl:     26px;
  --text-3xl:     22px;
  --text-2xl:     20px;
  --text-xl:      18px;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  :root {
    --text-display: 48px;
    --text-5xl:     40px;
    --text-4xl:     34px;
    --text-3xl:     28px;
    --text-2xl:     24px;
    --text-xl:      20px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  :root {
    --text-display: 64px;
    --text-5xl:     52px;
    --text-4xl:     42px;
    --text-3xl:     34px;
    --text-2xl:     28px;
    --text-xl:      22px;
  }
}
```

---

## Component Responsive Behavior Reference

### Navbar

| Property | Mobile (< 1024px) | Desktop (1024px+) |
|----------|------------------|------------------|
| Height | 72px | 72px |
| Logo size | 56px | 72px |
| Nav links | Hidden | Visible flex row |
| CTA button | Hidden | Visible |
| Hamburger | Visible | Hidden |
| Sticky | Yes | Yes |

### Hero — Centered

| Property | Mobile | Tablet (768px+) | Desktop (1024px+) |
|----------|--------|-----------------|------------------|
| Alignment | Center | Center | Center |
| Headline size | `--text-4xl` (26px) | `--text-5xl` (40px) | `--text-display` (64px) |
| CTA layout | Stacked (full-width) | Inline row | Inline row |
| Padding | `--space-16` | `--space-20` | `--space-32` |

### Hero — Split

| Property | Mobile | Desktop (1024px+) |
|----------|--------|------------------|
| Layout | Single column (text above) | Two columns (50/50) |
| Visual element | Stacks below text | Side-by-side |
| Text alignment | Left | Left |
| Gap | `--space-10` | `--space-16` |

### Section Headers

| Property | Mobile | Desktop |
|----------|--------|---------|
| Alignment | Center | Center |
| Title size | `--text-4xl` | `--text-5xl` |
| Max-width | 100% | 720px |
| Bottom margin | `--space-8` | `--space-12` |

### Cards — Grid Collapse

| Grid Class | Mobile | 640px+ | 768px+ | 1024px+ |
|------------|--------|--------|--------|----------|
| `.card-grid-2` | 1 col | 2 cols | 2 cols | 2 cols |
| `.card-grid-3` | 1 col | 1 col | 2 cols | 3 cols |
| `.card-grid-4` | 1 col | 2 cols | 2 cols | 4 cols |

**Stacking order rule:** When a grid collapses, items stack in DOM order. Ensure the DOM order matches the intended reading priority on mobile.

### Buttons

| Property | Mobile | Desktop |
|----------|--------|---------|
| Width | `width: 100%` in hero/form context | `width: auto` |
| Min height | 48px | 44px |
| Primary size | `.btn--lg` in hero | `.btn--md` or `.btn--lg` |

```css
@media (max-width: 479px) {
  .hero-cta-group .btn {
    width: 100%;
    justify-content: center;
  }
}
```

### Forms

| Property | Mobile | Tablet+ |
|----------|--------|----------|
| Layout | Single column | 2-column available |
| Input height | 48px | 44px |
| Submit button | Full-width | Full-width (always for forms) |

### Footer

| Property | Mobile | Tablet (768px+) |
|----------|--------|------------------|
| Layout | Single column stack | 2-column (brand + nav) |
| Nav columns | Stacked | 3-column grid |
| Bottom bar | Stacked | Inline row |

---

## Touch Target Rules (All Breakpoints)

Touch targets apply everywhere — not just mobile. Any element a user interacts with must meet minimum size:

| Element | Minimum Size | CSS |
|---------|-------------|-----|
| Buttons | 44 × 44px | `min-height: 44px` |
| Nav links (mobile drawer) | 48px height | `padding-block: var(--space-3)` |
| Icon buttons | 44 × 44px | `width: 44px; height: 44px` |
| Checkboxes/radios | 20px indicator + 44px label target | Wrap in `<label>` |
| Form inputs | 44px height | `min-height: var(--form-height-md)` |
| Accordion triggers | 48px height | `padding-block: var(--space-3)` |

---

## Image Responsive Rules

```html
<!-- Always specify width/height to prevent layout shift (CLS) -->
<!-- Always use loading="lazy" except hero/above-fold images -->
<!-- Always provide srcset for photography -->
<img
  src="/assets/images/hero-800.webp"
  srcset="/assets/images/hero-400.webp 400w,
          /assets/images/hero-800.webp 800w,
          /assets/images/hero-1200.webp 1200w"
  sizes="(max-width: 768px) 100vw,
         (max-width: 1024px) 50vw,
         800px"
  alt="Modern agency workspace"
  width="800"
  height="533"
  loading="eager"
/>
```

**CSS for responsive images:**
```css
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Object-fit for fixed-height containers */
.card-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
```

---

## Print Styles

```css
@media print {
  /* Hide navigation and interactive elements */
  .navbar,
  .nav-mobile,
  .footer,
  .btn,
  .hero-cta-group { display: none !important; }

  /* Ensure readable print layout */
  body {
    color: #000;
    background: #fff;
    font-size: 12pt;
  }

  a[href]::after {
    content: ' (' attr(href) ')';
    font-size: 10pt;
    color: #666;
  }

  /* Don't print absolute URLs for internal links */
  a[href^="/"]::after,
  a[href^="#"]::after { content: ''; }

  /* Avoid page breaks inside cards and sections */
  .card, .section { page-break-inside: avoid; }
}
```

---

## Responsive QA Checklist

Test at these exact widths before any page ships:

| Width | Device Reference | Check |
|-------|-----------------|-------|
| 320px | Small phone | No horizontal scroll, text readable |
| 375px | iPhone SE | CTAs accessible, nav functional |
| 414px | Standard phone | Forms usable, touch targets ok |
| 768px | Tablet portrait | Grid layout correct, nav hamburger |
| 1024px | Tablet landscape | Desktop nav appears |
| 1280px | Standard desktop | Max container width honored |
| 1440px | Large desktop | No content stretches past container |

**For each width verify:**
- [ ] No horizontal overflow / scroll
- [ ] All text readable (no zoom required)
- [ ] All touch targets ≥ 44px
- [ ] Grid columns collapse in correct order
- [ ] Navigation fully functional
- [ ] Hero headline doesn't orphan a single word on last line
- [ ] Images don't distort or overflow containers
- [ ] Forms are single-column on mobile
- [ ] CTAs are visible and have adequate tap area
- [ ] No content hidden behind sticky nav

---

## Related Documents
- `docs/visual-identity/ResponsiveRules.md` — Design-level responsive philosophy
- `docs/design-system-engine/LayoutSystem.md` — Container and grid system
- `docs/design-system-engine/NavigationSystem.md` — Nav responsive implementation
- `docs/brand-governance/AccessibilityGovernance.md` — Touch target and zoom requirements
- `docs/operations/QAChecklist.md` — Full QA process
