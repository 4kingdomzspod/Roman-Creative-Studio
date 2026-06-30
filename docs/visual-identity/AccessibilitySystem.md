# Accessibility System
**Roman Creative Studio — Visual Identity System**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

Define the non-negotiable accessibility standards that govern all Roman Creative Studio work — for the RCS brand itself and for every client website we build. Accessibility is not a feature. It is a baseline quality standard. A website that excludes people is not a quality website.

**Compliance target: WCAG 2.1 AA minimum.** Aim for AAA where achievable without design compromise.

---

## Core Accessibility Principles

> **If it can't be used without a mouse, without color, or without sight — it isn't done.**

| Principle | WCAG Pillar | What It Requires |
|-----------|-------------|------------------|
| **Perceivable** | 1.x | Information must be presentable in ways users can perceive — text alternatives, captions, adaptable layouts |
| **Operable** | 2.x | UI components must be operable — keyboard accessible, no seizure-inducing content, enough time |
| **Understandable** | 3.x | Information and operation must be understandable — readable text, predictable behavior, error prevention |
| **Robust** | 4.x | Content must be robust enough to be interpreted by assistive technologies |

---

## 1. Color Contrast Requirements

### WCAG AA Minimum (Required)

| Text Type | Minimum Ratio |
|-----------|---------------|
| Normal text (< 18px regular, < 14px bold) | **4.5:1** |
| Large text (≥ 18px regular, ≥ 14px bold) | **3:1** |
| UI components (form borders, button outlines) | **3:1** |
| Graphical elements (icons, charts) | **3:1** |

### WCAG AAA Target (Aim For)

| Text Type | Target Ratio |
|-----------|-------------|
| Normal text | **7:1** |
| Large text | **4.5:1** |

### RCS Color Contrast Audit

| Foreground | Background | Ratio | Level | Status |
|------------|------------|-------|-------|---------|
| `#F0EFE9` (--color-text) | `#0C0E11` (--color-bg) | ~15.8:1 | AAA | ✅ Pass |
| `#F0EFE9` (--color-text) | `#1B1E23` (--color-surface) | ~13.2:1 | AAA | ✅ Pass |
| `#F0EFE9` (--color-text) | `#252930` (--color-surface-elevated) | ~11.4:1 | AAA | ✅ Pass |
| `rgba(240,239,233,0.65)` (--color-text-muted) | `#0C0E11` | ~9.8:1 | AAA | ✅ Pass |
| `rgba(240,239,233,0.45)` (--color-text-subtle) | `#0C0E11` | ~6.7:1 | AA | ✅ Pass |
| `#D4AF37` (--color-brand-gold) | `#0C0E11` | ~7.9:1 | AAA | ✅ Pass |
| `#D4AF37` (--color-brand-gold) | `#1B1E23` | ~6.6:1 | AAA | ✅ Pass |
| `#0C0E11` (--color-text-inverse) | `#D4AF37` (gold bg) | ~7.9:1 | AAA | ✅ Pass |
| `#22C55E` (--color-success) | `#0C0E11` | ~6.9:1 | AAA | ✅ Pass |
| `#DC2626` (--color-error) | `#0C0E11` | ~3.6:1 | AA* | ⚠️ Large text only |
| `#F59E0B` (--color-warning) | `#0C0E11` | ~6.2:1 | AAA | ✅ Pass |
| `#3B82F6` (--color-info) | `#0C0E11` | ~4.9:1 | AA | ✅ Pass |

**⚠️ Error color note:** `#DC2626` on `#0C0E11` is 3.6:1 — passes only for large text (18px+). For error messages at body size, always pair with an icon and text label — never rely on color alone.

### Color-Blind Safe Combinations

The following color pairs are safe for the most common forms of color blindness:

| Pair | Deuteranopia (red-green) | Protanopia (red-green) | Tritanopia (blue-yellow) |
|------|--------------------------|------------------------|-------------------------|
| Gold on dark | ✅ Distinguishable | ✅ Distinguishable | ✅ Distinguishable |
| White on dark | ✅ ✅ ✅ | ✅ ✅ ✅ | ✅ ✅ ✅ |
| Error red (icon+label) | ✅ With icon | ✅ With icon | ✅ Distinguishable |
| Success green (icon+label) | ✅ With icon | ✅ With icon | ✅ Distinguishable |

**Rule:** Never communicate state through color alone. Always pair color with an icon, text label, or pattern.

---

## 2. Focus States

All interactive elements must have a visible, distinct focus indicator for keyboard navigation.

### RCS Focus Ring Standard

```css
/* Default focus ring — applies to all interactive elements */
:focus-visible {
  outline: 2px solid var(--color-brand-gold);
  outline-offset: 3px;
  border-radius: inherit;
}

/* Remove outline only when using :focus-visible (mouse users don't see ring) */
:focus:not(:focus-visible) {
  outline: none;
}
```

### Focus Ring Specifications

| Property | Value | Reason |
|----------|-------|--------|
| Style | `solid` | Most visible |
| Width | `2px` | Meets 3:1 contrast for UI component |
| Color | `#D4AF37` (gold) | Brand-consistent, high contrast on dark |
| Offset | `3px` | Separates ring from element, improves visibility |
| Radius | `inherit` | Matches component shape |

### Component-Specific Focus States

```css
/* Button — enhanced focus with glow */
.btn:focus-visible {
  outline: 2px solid var(--color-brand-gold);
  outline-offset: 3px;
  box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.20);
}

/* Form input */
.form-input:focus-visible {
  outline: none; /* Uses border + box-shadow instead */
  border-color: var(--color-brand-gold);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.20);
}

/* Link */
a:focus-visible {
  outline: 2px solid var(--color-brand-gold);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Skip link — must be first focusable element */
.skip-link {
  position: absolute;
  top: -100px;
  left: var(--space-4);
  background: var(--color-brand-gold);
  color: var(--color-bg);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-weight: 600;
  z-index: 9999;
  transition: top var(--duration-fast) var(--ease-out);
}

.skip-link:focus {
  top: var(--space-4);
}
```

---

## 3. Keyboard Navigation

### Required Keyboard Behaviors

| Interaction | Expected Keyboard Behavior |
|-------------|---------------------------|
| Navigation links | `Tab` to focus, `Enter` to activate |
| Buttons | `Tab` to focus, `Enter` or `Space` to activate |
| Dropdown menus | `Tab` into, arrow keys within, `Escape` to close |
| Modal/dialog | `Tab` trapped within modal, `Escape` to close |
| Form fields | `Tab` through fields in logical order |
| Checkboxes/radios | `Tab` to focus, `Space` to toggle |
| Accordion | `Tab` to header, `Enter` or `Space` to expand/collapse |
| Slider/range | `Tab` to focus, arrow keys to adjust value |

### Focus Order Requirements

1. **Skip navigation link** — first focusable element on every page
2. **Logo** — if it's an anchor
3. **Primary navigation links** — left to right
4. **Main content** — logical reading order, never skip elements
5. **Footer links** — after all main content

**Rule:** Never use `tabindex` values greater than 0. Never use `tabindex="-1"` except to programmatically manage focus (e.g., modal management). Rely on DOM order for tab flow.

### Skip Navigation Link (Required on Every Page)

```html
<!-- Must be the first element in <body> -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Main content area must have this id -->
<main id="main-content">
  <!-- page content -->
</main>
```

---

## 4. Semantic HTML Requirements

### Required Landmark Roles

Every page must include these HTML5 landmark elements:

```html
<header role="banner">     <!-- Site header / nav -->
<nav role="navigation">   <!-- Primary navigation -->
<main role="main">        <!-- Page content -->
<footer role="contentinfo"> <!-- Site footer -->
```

### Heading Hierarchy

```
Page: One <h1> per page — the page's primary topic
  └── <h2> — Major sections
       └── <h3> — Subsections within h2 sections
            └── <h4> — Subsections within h3 sections (rare)
```

**Rules:**
- Never skip heading levels (e.g., `h1` → `h3` without `h2`)
- Never use headings for visual styling — use CSS classes instead
- Never use non-heading elements as visual headings

### Form Labels

```html
<!-- Every input must have an associated label -->
<label for="email">Email address</label>
<input type="email" id="email" name="email" autocomplete="email" required />

<!-- Or use aria-label when visible label isn't possible -->
<input type="search" aria-label="Search the site" />

<!-- Required fields must be marked -->
<label for="name">Full name <span aria-hidden="true">*</span><span class="sr-only">(required)</span></label>
```

---

## 5. Alternative Text for Images

### Alt Text Decision Tree

```
Is the image purely decorative (background, divider, illustration with no unique info)?
  YES → alt="" (empty alt, tells screen reader to skip it)
  NO  → Does the image convey information?
          YES → Write descriptive alt text (see rules below)
          NO  → alt="" (decorative)
```

### Alt Text Writing Rules

| Rule | Example |
|------|---------|
| Describe the content and function, not the appearance | ✅ "Team photo of RCS founder Alexander" ❌ "Man in blue shirt smiling" |
| Don't start with "Image of" or "Photo of" — screen readers announce it | ✅ "RCS logo" ❌ "Image of RCS logo" |
| For functional images (buttons/links), describe the action | ✅ "Go to homepage" ❌ "Logo" |
| Keep it under 125 characters | Write concisely |
| For complex images (charts, infographics), provide a text description nearby | Link to description or use `aria-describedby` |

```html
<!-- Logo in navigation -->
<a href="/" aria-label="Roman Creative Studio — Go to homepage">
  <img src="/assets/images/logo.jpg" alt="Roman Creative Studio logo" width="72" height="72" />
</a>

<!-- Decorative divider -->
<img src="/assets/images/divider.svg" alt="" role="presentation" />

<!-- Team photo -->
<img src="/assets/images/team.jpg" alt="Alexander Roman, founder of Roman Creative Studio" />

<!-- Background/hero image (CSS background) — needs aria-label on container -->
<section
  class="hero"
  style="background-image: url('/assets/images/hero.jpg')"
  aria-label="Modern digital agency workspace"
>
```

---

## 6. ARIA Usage Rules

### Use ARIA Correctly — Or Not At All

> First rule of ARIA: don't use ARIA if native HTML can do it.

```html
<!-- ✅ Use native button, not a div with ARIA -->
<button type="button">Click me</button>
<!-- ❌ Never this -->
<div role="button" tabindex="0">Click me</div>

<!-- ✅ Use native checkbox -->
<input type="checkbox" id="agree" />
<!-- ❌ Never this unless building a custom component -->
<div role="checkbox" aria-checked="false" tabindex="0"></div>
```

### Required ARIA Patterns

```html
<!-- Navigation with label -->
<nav aria-label="Main navigation">

<!-- Secondary nav -->
<nav aria-label="Footer navigation">

<!-- Icon-only button — must have label -->
<button type="button" aria-label="Close menu">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Mobile menu toggle -->
<button
  type="button"
  aria-expanded="false"
  aria-controls="mobile-menu"
  aria-label="Open navigation menu"
>

<!-- Modal dialog -->
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Schedule a Call</h2>
  <p id="modal-description">Choose a time that works for you.</p>
</div>

<!-- Live regions for dynamic content -->
<div aria-live="polite" aria-atomic="true" class="sr-only" id="status-message">
  <!-- Form success/error messages inserted here by JS -->
</div>
```

---

## 7. Motion & Animation Accessibility

```css
/* Always include this — no exceptions */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration:        0.01ms !important;
    animation-iteration-count: 1      !important;
    transition-duration:       0.01ms !important;
    scroll-behavior:           auto   !important;
  }
}
```

**Rules:**
- Never auto-play video with motion (or any video with sound)
- Never create content that flashes more than 3 times per second
- Never use infinite looping animations on main content (loading spinners are OK)
- Carousels and sliders must have pause controls

---

## 8. Screen-Reader Utility Classes

```css
/* Visually hidden but available to screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Visually hidden until focused (for skip links) */
.sr-only-focusable:not(:focus) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## 9. Accessibility QA Checklist

### Automated Testing (Run First)

- [ ] axe DevTools browser extension — zero critical or serious violations
- [ ] WAVE browser extension — zero errors
- [ ] Chrome Lighthouse Accessibility score — target 95+

### Manual Testing (Required)

**Keyboard only:**
- [ ] Navigate entire page using only `Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`, arrow keys
- [ ] Every interactive element is reachable and activatable
- [ ] Focus is never trapped (unless in a modal — then escape releases it)
- [ ] Focus order matches visual reading order
- [ ] Skip link works and moves focus to `#main-content`

**Screen reader (VoiceOver or NVDA):**
- [ ] All images have appropriate alt text (or alt="" for decorative)
- [ ] Headings create logical document outline
- [ ] Forms: all inputs have labels, required fields are announced
- [ ] Buttons and links describe their action or destination
- [ ] Dynamic content changes are announced (live regions)
- [ ] Modal focus management works correctly

**Color and contrast:**
- [ ] All text meets 4.5:1 minimum
- [ ] All UI components meet 3:1 minimum
- [ ] Page is usable in grayscale (information not conveyed by color alone)

**Zoom and reflow:**
- [ ] Page usable at 200% zoom without horizontal scroll
- [ ] Page usable at 400% zoom (content reflows to single column)
- [ ] No content is clipped or hidden at high zoom levels

---

## 10. Accessibility Policy Statement

For client websites, include this in the footer or on a dedicated accessibility page:

> *[Client Name] is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying relevant accessibility standards.*

---

## Related Documents
- `docs/visual-identity/ColorSystem.md` — Full contrast ratio table
- `docs/visual-identity/MotionSystem.md` — Reduced motion implementation
- `docs/visual-identity/ResponsiveRules.md` — Touch target sizing
- `docs/design-system/Forms.md` — Form accessibility implementation
- `docs/operations/QAChecklist.md` — Full QA and accessibility testing process
- `docs/operations/SEOStandards.md` — Semantic HTML overlap with SEO
