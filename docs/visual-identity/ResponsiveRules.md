# Responsive Design Rules
**Roman Creative Studio — Visual Identity System**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

Define how the Roman Creative Studio design system behaves across device sizes. Every layout, component, spacing value, and type scale has a defined responsive behavior. These rules ensure that the premium experience delivered on desktop is fully maintained on mobile — not degraded, not simplified, but *appropriately translated*.

---

## Core Responsive Philosophy

> **Mobile-first means mobile-complete, not mobile-minimal.**

The RCS responsive system is built on four principles:

| Principle | What It Means |
|-----------|---------------|
| **Mobile-First CSS** | Write base styles for mobile, then layer up with `min-width` breakpoints |
| **Proportional Scaling** | Spacing and type scale proportionally — not arbitrarily smaller |
| **Stacking Order Matters** | When columns collapse, the reading order must remain logical |
| **Touch-First Interaction** | All interactive targets meet 44px minimum touch target size |

---

## Breakpoint System

```css
/* RCS Breakpoint Tokens */
:root {
  --bp-xs:  320px;  /* Minimum supported width — small phones */
  --bp-sm:  480px;  /* Large phones, landscape phones */
  --bp-md:  768px;  /* Tablets portrait */
  --bp-lg:  1024px; /* Tablets landscape, small laptops */
  --bp-xl:  1280px; /* Standard desktop */
  --bp-2xl: 1440px; /* Large desktop */
  --bp-3xl: 1920px; /* Ultra-wide (max layout width, content centers) */
}
```

### Media Query Usage

```css
/* Mobile base (no query needed) */
.component { ... }

/* ≥480px */
@media (min-width: 480px) { ... }

/* ≥768px — tablet+ */
@media (min-width: 768px) { ... }

/* ≥1024px — desktop */
@media (min-width: 1024px) { ... }

/* ≥1280px — wide desktop */
@media (min-width: 1280px) { ... }

/* ≥1440px — large desktop */
@media (min-width: 1440px) { ... }
```

**Rule:** Never use `max-width` queries. Always write mobile-first with `min-width`. Exception: print styles.

---

## Typography Scaling

### Responsive Type Scale

The type scale scales up at tablet and desktop breakpoints:

| Token | Mobile | Tablet (768px+) | Desktop (1024px+) |
|-------|--------|-----------------|-------------------|
| `--text-display` | 36px | 48px | 64px |
| `--text-5xl` | 30px | 40px | 52px |
| `--text-4xl` | 26px | 34px | 42px |
| `--text-3xl` | 22px | 28px | 34px |
| `--text-2xl` | 20px | 24px | 28px |
| `--text-xl` | 18px | 20px | 22px |
| `--text-lg` | 16px | 18px | 18px |
| `--text-base` | 15px | 16px | 16px |
| `--text-sm` | 13px | 14px | 14px |
| `--text-xs` | 11px | 12px | 12px |

```css
/* Responsive type token implementation */
:root {
  --text-display: 36px;
  --text-5xl: 30px;
  --text-4xl: 26px;
  --text-3xl: 22px;
  --text-2xl: 20px;
  --text-xl: 18px;
}

@media (min-width: 768px) {
  :root {
    --text-display: 48px;
    --text-5xl: 40px;
    --text-4xl: 34px;
    --text-3xl: 28px;
    --text-2xl: 24px;
    --text-xl: 20px;
  }
}

@media (min-width: 1024px) {
  :root {
    --text-display: 64px;
    --text-5xl: 52px;
    --text-4xl: 42px;
    --text-3xl: 34px;
    --text-2xl: 28px;
    --text-xl: 22px;
  }
}
```

---

## Spacing Scaling

### Section Padding

| Context | Mobile | Tablet (768px+) | Desktop (1024px+) |
|---------|--------|-----------------|-------------------|
| Section vertical padding | `--space-12` (48px) | `--space-16` (64px) | `--space-24` (96px) |
| Section gap between items | `--space-6` (24px) | `--space-8` (32px) | `--space-10` (40px) |
| Container horizontal padding | `--space-5` (20px) | `--space-8` (32px) | `--space-12` (48px) |
| Card internal padding | `--space-5` (20px) | `--space-6` (24px) | `--space-8` (32px) |

```css
.section {
  padding-block: var(--space-12);
}

@media (min-width: 768px) {
  .section { padding-block: var(--space-16); }
}

@media (min-width: 1024px) {
  .section { padding-block: var(--space-24); }
}
```

---

## Grid & Layout Behavior

### Standard Collapse Patterns

| Component | Mobile | Tablet (768px+) | Desktop (1024px+) |
|-----------|--------|-----------------|-------------------|
| Service cards grid | 1 column | 2 columns | 3 columns |
| Feature grid | 1 column | 2 columns | 4 columns |
| Testimonial grid | 1 column | 2 columns | 3 columns |
| Hero (text + image) | Stack (text first) | Stack (text first) | Side by side |
| Footer columns | 1 column | 2 columns | 4 columns |
| Blog listing | 1 column | 2 columns | 3 columns |
| Stats row | 2 columns | 4 columns | 4 columns |
| Nav links | Hidden (hamburger) | Hidden (hamburger) | Visible inline |

```css
/* Example: Service cards */
.services-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-5);
}

@media (min-width: 768px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }
}
```

---

## Navigation Responsive Behavior

### Mobile Navigation

- **Hamburger trigger:** Visible on `< 1024px`
- **Mobile drawer:** Full-width overlay panel, slides in from top or left
- **Nav links:** Stacked vertically, `--text-xl` size, generous `--space-4` padding
- **CTA button:** Full-width or centered at bottom of drawer
- **Logo:** Always visible in nav bar regardless of drawer state

### Desktop Navigation

- **Links:** Inline, `--text-sm`, horizontal row
- **CTA button:** Right-aligned, standard button size
- **Hamburger:** Hidden (`display: none`)

```css
.nav-links {
  display: none;
}

.nav-hamburger {
  display: flex;
}

@media (min-width: 1024px) {
  .nav-links {
    display: flex;
    align-items: center;
    gap: var(--space-8);
  }

  .nav-hamburger {
    display: none;
  }
}
```

### Nav Logo Sizing

| Breakpoint | Logo Container | Font Size |
|------------|---------------|----------|
| Mobile | 56px | — |
| Tablet+ | 64px | — |
| Desktop | 72px | — |

---

## Component-Specific Responsive Rules

### Hero Sections

```css
.hero {
  padding-block: var(--space-16);
  text-align: center;
}

.hero-content {
  max-width: 100%;
}

@media (min-width: 1024px) {
  .hero {
    padding-block: var(--space-24);
    text-align: left;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-12);
    align-items: center;
  }
}
```

### Cards

- **Mobile:** Full-width. Minimum height not enforced.
- **Tablet:** 2-column grid. Cards in same row must align height (CSS Grid handles this automatically).
- **Desktop:** 3-column (service/blog) or 4-column (features). Height-aligned.
- **Internal padding:** Scales per spacing table above.

### Buttons

| State | Mobile | Desktop |
|-------|--------|---------|
| Width | Full-width or auto | Auto (content-sized) |
| Min height | 48px (touch target) | 44px |
| Font size | `--text-base` | `--text-sm` |
| Padding | `--space-4` vertical, `--space-6` horizontal | `--space-3` vertical, `--space-5` horizontal |

```css
.btn {
  width: 100%;
  min-height: 48px;
  padding: var(--space-4) var(--space-6);
  font-size: var(--text-base);
}

@media (min-width: 768px) {
  .btn {
    width: auto;
    min-height: 44px;
    padding: var(--space-3) var(--space-5);
    font-size: var(--text-sm);
  }
}
```

### Forms

- **Mobile:** Full-width fields, stacked labels above inputs, single-column layout
- **Tablet:** Maintain single-column for readability
- **Desktop:** Optional 2-column for side-by-side fields (first name / last name), but single-column is always acceptable and often better
- **Input height:** Minimum `44px` at all breakpoints (touch target)

---

## Images & Media

### Responsive Images

```html
<!-- Always use appropriate srcset and sizes -->
<img
  src="image-800.jpg"
  srcset="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Descriptive alt text"
  loading="lazy"
  width="800"
  height="600"
/>
```

### Image Behavior in Layouts

| Context | Mobile | Desktop |
|---------|--------|---------|
| Hero image | Stacks below headline, full width | Side by side with text |
| Card image | Full-width top of card | Fixed-height top of card |
| Team photo | Centered, 120px–160px diameter | Same |
| Blog thumbnail | 16:9 aspect ratio maintained | 16:9 aspect ratio maintained |

---

## Touch Target Rules

All interactive elements must meet minimum touch target size:

| Element | Minimum Size | Implementation |
|---------|-------------|----------------|
| Buttons | 44px height | `min-height: 44px` |
| Nav links (mobile) | 48px height | `padding-block: var(--space-3)` |
| Icon buttons | 44×44px | `min-width: 44px; min-height: 44px` |
| Checkboxes | 44×44px clickable area | Wrap in label with padding |
| Form inputs | 44px height | `min-height: 44px` |

---

## Responsive QA Checklist

Before any page or component ships, test at these widths:

- [ ] 320px — smallest supported phone
- [ ] 375px — iPhone SE / common small phone
- [ ] 414px — standard phone
- [ ] 768px — tablet portrait
- [ ] 1024px — tablet landscape / small laptop
- [ ] 1280px — standard desktop
- [ ] 1440px — large desktop

**At each breakpoint, verify:**
- [ ] No horizontal scroll
- [ ] Text is readable without zooming
- [ ] All touch targets meet 44px minimum
- [ ] Images scale correctly and don't overflow containers
- [ ] Grid columns collapse in correct order
- [ ] Navigation is fully functional
- [ ] CTAs are visible and accessible

---

## Related Documents
- `docs/visual-identity/DesignLanguage.md` — Spacing system and grid philosophy
- `docs/visual-identity/TypographySystem.md` — Type scale tokens
- `docs/visual-identity/AccessibilitySystem.md` — Touch target and keyboard requirements
- `docs/design-system/Navigation.md` — Nav responsive implementation
- `docs/operations/QAChecklist.md` — Full QA process
