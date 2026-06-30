# Typography Component System
**Roman Creative Studio — Design System Engine**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

Define how typography functions as a UI system — not just a style guide. This document covers every typographic component: headlines, paragraphs, captions, labels, links, highlights, and pull quotes. Each element has a defined class, token reference, and usage rule.

---

## Base Typography Reset

```css
/* In base.css */
*, *::before, *::after { box-sizing: border-box; }

body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--weight-regular);
  line-height: var(--leading-normal);
  color: var(--color-text);
  background-color: var(--color-bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* Heading defaults */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: var(--leading-tight);
  color: var(--color-text);
  letter-spacing: var(--tracking-tight);
  margin: 0;
}

p { margin: 0; }
a { color: var(--color-brand-gold); text-decoration: underline; text-underline-offset: 3px; }
a:hover { color: var(--color-text); }
```

---

## 1. Headline Components

```css
/* Display — hero-scale, editorial moments only */
.text-display {
  font-family: var(--font-display);
  font-size: var(--text-display); /* 36px → 48px → 64px responsive */
  font-weight: 600;
  line-height: var(--leading-tighter);
  letter-spacing: var(--tracking-tighter);
  color: var(--color-text);
}

/* H1 — page title */
.text-h1 {
  font-family: var(--font-display);
  font-size: var(--text-5xl); /* 30px → 40px → 52px */
  font-weight: 600;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tighter);
}

/* H2 — section title */
.text-h2 {
  font-family: var(--font-display);
  font-size: var(--text-4xl); /* 26px → 34px → 42px */
  font-weight: 600;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

/* H3 — subsection, card title */
.text-h3 {
  font-family: var(--font-display);
  font-size: var(--text-3xl); /* 22px → 28px → 34px */
  font-weight: 600;
  line-height: var(--leading-snug);
  letter-spacing: var(--tracking-tight);
}

/* H4 — component-level heading */
.text-h4 {
  font-family: var(--font-body);
  font-size: var(--text-2xl); /* 20px → 24px → 28px */
  font-weight: var(--weight-semibold);
  line-height: var(--leading-snug);
  letter-spacing: var(--tracking-normal);
}

/* H5, H6 — use Inter not Cormorant */
.text-h5 {
  font-family: var(--font-body);
  font-size: var(--text-xl);
  font-weight: var(--weight-semibold);
  line-height: var(--leading-snug);
}

.text-h6 {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
  line-height: var(--leading-normal);
}
```

### Headline Rules

| Rule | Specification |
|------|---------------|
| Cormorant Garamond usage | H1, H2, H3 only. H4–H6 use Inter. |
| Minimum display size | 30px. Never Cormorant below 30px. |
| One H1 per page | Non-negotiable. |
| Heading color | Always `--color-text` (white). Gold only for `.text-brand` modifier. |
| Max line length | Display: 18ch. H1: 22ch. H2: 32ch. H3: 40ch. |

---

## 2. Body Text Components

```css
/* Large body — introductory paragraph, hero subheadline */
.text-body-lg {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: var(--weight-regular);
  line-height: var(--leading-relaxed);
  color: var(--color-text-muted);
}

/* Default body — all standard paragraph text */
.text-body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--weight-regular);
  line-height: var(--leading-relaxed);
  color: var(--color-text-muted);
}

/* Small body — secondary descriptions, card copy */
.text-body-sm {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-regular);
  line-height: var(--leading-relaxed);
  color: var(--color-text-muted);
}

/* Lead paragraph — first paragraph of article/case study */
.text-lead {
  font-family: var(--font-body);
  font-size: var(--text-xl);
  font-weight: var(--weight-regular);
  line-height: var(--leading-relaxed);
  color: var(--color-text);
  max-width: 65ch;
}

/* Prose — long-form readable content (blog posts, docs) */
.prose {
  color: var(--color-text-muted);
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  max-width: 72ch;
}

.prose h2, .prose h3, .prose h4 {
  color: var(--color-text);
  margin-top: var(--space-10);
  margin-bottom: var(--space-4);
}

.prose p { margin-bottom: var(--space-5); }
.prose p:last-child { margin-bottom: 0; }

.prose ul, .prose ol {
  padding-left: var(--space-6);
  margin-bottom: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.prose li::marker { color: var(--color-brand-gold); }

.prose strong {
  color: var(--color-text);
  font-weight: var(--weight-semibold);
}

.prose blockquote {
  border-left: 3px solid var(--color-brand-gold);
  padding-left: var(--space-5);
  margin: var(--space-8) 0;
  font-style: italic;
  color: var(--color-text);
  font-size: var(--text-lg);
}

.prose a {
  color: var(--color-brand-gold);
  text-underline-offset: 3px;
}

.prose code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--color-surface-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 1px 6px;
  color: var(--color-text);
}

.prose pre {
  background: var(--color-surface-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  overflow-x: auto;
  margin-block: var(--space-6);
}

.prose pre code {
  background: none;
  border: none;
  padding: 0;
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}
```

---

## 3. Caption & Label Components

```css
/* Caption — image captions, timestamps, metadata */
.text-caption {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--weight-regular);
  line-height: var(--leading-normal);
  color: var(--color-text-subtle);
}

/* Eyebrow / section label — all caps, small, above headings */
.text-eyebrow {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--color-brand-gold);
}

/* UI label — form labels, data labels, table headers */
.text-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  line-height: var(--leading-tight);
  color: var(--color-text-muted);
}

/* Stat value — large numeric display */
.text-stat {
  font-family: var(--font-display);
  font-size: var(--text-5xl);
  font-weight: 700;
  line-height: 1;
  color: var(--color-brand-gold);
  letter-spacing: var(--tracking-tighter);
}

.text-stat-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-subtle);
  margin-top: var(--space-2);
}
```

---

## 4. Highlight & Emphasis Text

```css
/* Brand color highlight */
.text-brand  { color: var(--color-brand-gold); }
.text-muted  { color: var(--color-text-muted); }
.text-subtle { color: var(--color-text-subtle); }
.text-white  { color: var(--color-white); }

/* Gradient text — premium moments only, not body copy */
.text-gradient {
  background: linear-gradient(135deg, var(--color-brand-gold), #F5D470);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Inline code */
.text-code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--color-surface-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 1px 6px;
  color: var(--color-text);
}

/* Mark / highlight */
.text-mark {
  background-color: rgba(212, 175, 55, 0.20);
  color: var(--color-text);
  border-radius: 2px;
  padding: 0 3px;
}
```

---

## 5. Link Styling Rules

```css
/* Default link — in body content */
a {
  color: var(--color-brand-gold);
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
  transition: color var(--duration-fast) var(--ease-out),
              text-decoration-color var(--duration-fast) var(--ease-out);
}

a:hover {
  color: var(--color-text);
  text-decoration-color: var(--color-text);
}

a:focus-visible {
  outline: 2px solid var(--color-brand-gold);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Navigation link — no underline, uses ::after indicator */
.link-nav {
  text-decoration: none;
  color: var(--color-text-muted);
}

/* Muted link — in footers, legal sections */
.link-muted {
  color: var(--color-text-subtle);
  text-decoration: none;
}
.link-muted:hover { color: var(--color-text); }

/* Standalone arrow link — "Learn more →" pattern */
.link-arrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--color-brand-gold);
  font-weight: var(--weight-semibold);
  font-size: var(--text-sm);
  text-decoration: none;
  transition: gap var(--duration-fast) var(--ease-out);
}
.link-arrow:hover { gap: var(--space-2); }
.link-arrow svg { width: 14px; height: 14px; }
```

---

## 6. Pull Quote Component

```css
.pullquote {
  position: relative;
  padding: var(--space-8) var(--space-8) var(--space-8) var(--space-10);
  border-left: 3px solid var(--color-brand-gold);
  background: var(--color-surface);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  margin-block: var(--space-8);
}

.pullquote-text {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-style: italic;
  line-height: var(--leading-relaxed);
  color: var(--color-text);
}

.pullquote-attribution {
  display: block;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-text-muted);
  margin-top: var(--space-4);
  font-style: normal;
}
```

```html
<figure class="pullquote">
  <blockquote>
    <p class="pullquote-text">&ldquo;Roman Creative Studio didn&rsquo;t just build us a website. They built us a growth engine.&rdquo;</p>
  </blockquote>
  <figcaption>
    <cite class="pullquote-attribution">&mdash; Dr. Sarah Smith, Owner, Smith Family Dental</cite>
  </figcaption>
</figure>
```

---

## 7. Badge & Tag Components

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  line-height: 1;
  border-radius: var(--radius-full);
  padding: var(--space-1) var(--space-3);
  white-space: nowrap;
}

/* Variants */
.badge--default    { background: var(--color-surface-elevated); color: var(--color-text-muted); border: 1px solid var(--color-border); }
.badge--brand      { background: var(--color-brand-gold-subtle); color: var(--color-brand-gold); border: 1px solid var(--color-border-brand); }
.badge--success    { background: var(--color-success-subtle); color: var(--color-success); }
.badge--warning    { background: var(--color-warning-subtle); color: var(--color-warning); }
.badge--error      { background: var(--color-error-subtle);   color: var(--color-error); }
.badge--info       { background: var(--color-info-subtle);    color: var(--color-info); }

.badge svg { width: 10px; height: 10px; }

/* Dot indicator */
.badge-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}
.badge-dot--success { background-color: var(--color-success); }
.badge-dot--warning { background-color: var(--color-warning); }
.badge-dot--error   { background-color: var(--color-error); }
.badge-dot--brand   { background-color: var(--color-brand-gold); }
```

---

## Typography Anti-Patterns

| Anti-Pattern | Correct Approach |
|--------------|------------------|
| Cormorant at body size (< 30px) | Use Inter instead |
| Hardcoded font-size in px | Use `--text-*` token |
| Using `<b>` for styling | Use `<strong>` or CSS `font-weight` |
| Using `<i>` for styling | Use `<em>` or CSS `font-style` |
| Multiple `<h1>` on a page | One H1 per page — always |
| Heading used for visual size | Fix the CSS, not the heading level |
| Tracking out body text | Body: `--tracking-normal` (0em) only |
| ALL CAPS in Cormorant | Use Inter for uppercase labels |
| Long line length > 75ch | Apply `max-width: 72ch` to container |

---

## Related Documents
- `docs/visual-identity/TypographySystem.md` — Font tokens and scale definitions
- `docs/design-system-engine/LayoutSystem.md` — Prose container widths
- `docs/design-system-engine/HeroSystem.md` — Hero headline classes
- `docs/brand-governance/BrandConsistencyRules.md` — Typography enforcement rules
