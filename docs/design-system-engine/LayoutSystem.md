# Layout System
**Roman Creative Studio — Design System Engine**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

Define the structural layout rules that govern how all page sections are constructed. Every section on every page follows the same layout system — container, section, grid, and spacing — to ensure predictability, responsiveness, and reusability.

---

## Container System

```css
:root {
  --container-sm:  640px;
  --container-md:  768px;
  --container-lg:  1024px;
  --container-xl:  1280px;
  --container-2xl: 1440px;
}

/* Base container — used for all page content */
.container {
  width: 100%;
  max-width: var(--container-xl);
  margin-inline: auto;
  padding-inline: var(--space-5);
}

@media (min-width: 768px) {
  .container { padding-inline: var(--space-8); }
}

@media (min-width: 1024px) {
  .container { padding-inline: var(--space-12); }
}

/* Narrow — blog posts, long-form content, forms */
.container-narrow {
  width: 100%;
  max-width: var(--container-md);
  margin-inline: auto;
  padding-inline: var(--space-5);
}

@media (min-width: 768px) {
  .container-narrow { padding-inline: var(--space-8); }
}

/* Wide — full-bleed-adjacent sections */
.container-wide {
  width: 100%;
  max-width: var(--container-2xl);
  margin-inline: auto;
  padding-inline: var(--space-5);
}

@media (min-width: 1024px) {
  .container-wide { padding-inline: var(--space-12); }
}
```

---

## Section System

```css
/* Standard section */
.section {
  padding-block: var(--space-16);
}

@media (min-width: 768px) {
  .section { padding-block: var(--space-20); }
}

@media (min-width: 1024px) {
  .section { padding-block: var(--space-24); }
}

/* Compact section — tighter spacing between related sections */
.section--compact {
  padding-block: var(--space-10);
}

@media (min-width: 768px) {
  .section--compact { padding-block: var(--space-12); }
}

/* Hero section — larger top/bottom */
.section--hero {
  padding-block: var(--space-20);
}

@media (min-width: 1024px) {
  .section--hero { padding-block: var(--space-32); }
}

/* Full-bleed — background spans full width, content is contained */
.section--full-bleed {
  /* No horizontal padding here — container inside handles it */
}

/* Background variants */
.section--bg-default  { background-color: var(--color-bg); }
.section--bg-surface  { background-color: var(--color-surface); }
.section--bg-muted    { background-color: var(--color-surface-muted); }
.section--bg-elevated { background-color: var(--color-surface-elevated); }
.section--bg-brand    { background-color: var(--color-brand-gold); color: var(--color-bg); }
```

---

## Section Header Pattern

Every content section follows this header structure:

```html
<div class="section-header">
  <span class="section-eyebrow">Our Services</span>
  <h2 class="section-title">Everything You Need to Grow Online</h2>
  <p class="section-description">From strategy to launch, we handle it all so you can focus on running your business.</p>
</div>
```

```css
.section-header {
  text-align: center;
  max-width: 720px;
  margin-inline: auto;
  margin-bottom: var(--space-12);
}

.section-eyebrow {
  display: block;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--color-brand-gold);
  margin-bottom: var(--space-3);
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 600;
  color: var(--color-text);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-4);
}

@media (min-width: 768px) {
  .section-title { font-size: var(--text-5xl); }
}

.section-description {
  font-size: var(--text-lg);
  color: var(--color-text-muted);
  line-height: var(--leading-relaxed);
  max-width: 600px;
  margin-inline: auto;
}

/* Left-aligned variant */
.section-header--left {
  text-align: left;
  margin-inline: 0;
}

.section-header--left .section-description {
  margin-inline: 0;
}
```

---

## Grid System

```css
/* ============================================================
   FLEX GRIDS
============================================================ */
.grid {
  display: grid;
  gap: var(--space-6);
}

.grid-1 { grid-template-columns: repeat(1, 1fr); }

.grid-2 {
  grid-template-columns: repeat(1, 1fr);
}
@media (min-width: 640px) {
  .grid-2 { grid-template-columns: repeat(2, 1fr); }
}

.grid-3 {
  grid-template-columns: repeat(1, 1fr);
}
@media (min-width: 768px) {
  .grid-3 { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .grid-3 { grid-template-columns: repeat(3, 1fr); }
}

.grid-4 {
  grid-template-columns: repeat(1, 1fr);
}
@media (min-width: 640px) {
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .grid-4 { grid-template-columns: repeat(4, 1fr); }
}

/* Asymmetric — 2/3 + 1/3 */
.grid-content-sidebar {
  grid-template-columns: 1fr;
}
@media (min-width: 1024px) {
  .grid-content-sidebar { grid-template-columns: 2fr 1fr; gap: var(--space-12); }
}

/* Split — 50/50 for hero/feature sections */
.grid-split {
  grid-template-columns: 1fr;
  align-items: center;
  gap: var(--space-10);
}
@media (min-width: 1024px) {
  .grid-split { grid-template-columns: repeat(2, 1fr); gap: var(--space-16); }
}

/* Gap modifiers */
.grid-gap-sm { gap: var(--space-4); }
.grid-gap-md { gap: var(--space-6); }  /* default */
.grid-gap-lg { gap: var(--space-8); }
.grid-gap-xl { gap: var(--space-12); }

/* Span helpers */
.col-span-2 { grid-column: span 2; }
.col-span-full { grid-column: 1 / -1; }
```

---

## Flexbox Layout Utilities

```css
/* Stack — vertical flex */
.stack {
  display: flex;
  flex-direction: column;
}
.stack-xs  { gap: var(--space-1); }
.stack-sm  { gap: var(--space-2); }
.stack-md  { gap: var(--space-4); }
.stack-lg  { gap: var(--space-6); }
.stack-xl  { gap: var(--space-8); }
.stack-2xl { gap: var(--space-12); }

/* Row — horizontal flex */
.row {
  display: flex;
  align-items: center;
}
.row-xs  { gap: var(--space-1); }
.row-sm  { gap: var(--space-2); }
.row-md  { gap: var(--space-4); }
.row-lg  { gap: var(--space-6); }

/* Cluster — flex wrap for tag groups, button groups */
.cluster {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}

/* Center — flex center both axes */
.center-flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Between — space-between row */
.between-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

---

## Dividers

```css
.divider {
  border: none;
  border-top: 1px solid var(--color-border);
  margin-block: var(--space-8);
}

.divider-strong { border-top-color: var(--color-border-strong); }
.divider-brand  { border-top-color: var(--color-border-brand); }

.divider-fade {
  border: none;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--color-border-strong) 20%,
    var(--color-border-strong) 80%,
    transparent
  );
  margin-block: var(--space-8);
}
```

---

## Standard Page Structure

```html
<!-- Full page layout pattern -->
<body class="page">
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <header role="banner">
    <nav class="navbar" role="navigation" aria-label="Main navigation">
      <!-- See NavigationSystem.md -->
    </nav>
  </header>

  <main id="main-content" role="main">

    <!-- Hero section -->
    <section class="section section--hero section--bg-default">
      <div class="container">
        <!-- HeroSystem.md -->
      </div>
    </section>

    <!-- Services section -->
    <section class="section section--bg-surface" aria-labelledby="services-heading">
      <div class="container">
        <div class="section-header">
          <span class="section-eyebrow">What We Do</span>
          <h2 class="section-title" id="services-heading">Services Built for Your Industry</h2>
        </div>
        <div class="grid grid-3">
          <!-- Service cards -->
        </div>
      </div>
    </section>

    <!-- Additional sections follow same pattern -->

  </main>

  <footer role="contentinfo">
    <!-- See NavigationSystem.md -->
  </footer>
</body>
```

---

## Layout Rules

| Rule | Specification |
|------|---------------|
| Max content width | `--container-xl` (1280px) — never wider |
| Section padding | `--space-16` mobile / `--space-20` tablet / `--space-24` desktop |
| Grid gap default | `--space-6` |
| Full-bleed sections | Background spans 100vw, content inside `.container` |
| Stacking order | Always: mobile = single column. Expand up at breakpoints. |
| No fixed heights | Content containers never have fixed `height`. Use `min-height`. |
| Container nesting | Never nest `.container` inside `.container`. |

---

## Related Documents
- `docs/visual-identity/DesignLanguage.md` — Spacing philosophy and base-4 grid
- `docs/visual-identity/ResponsiveRules.md` — Breakpoints and scaling
- `docs/design-system-engine/Overview.md` — System architecture
