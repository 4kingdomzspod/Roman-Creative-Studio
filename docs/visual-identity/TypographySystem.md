# Typography System

**Roman Creative Studio Visual Identity System — Phase 2B**
*Version 1.0 | Last Updated: June 2026*

---

## Purpose of This Document

Typography is the most used element in any visual system. It communicates before the reader reads — through weight, contrast, spacing, and hierarchy. This document defines the complete type architecture for Roman Creative Studio: every font role, every size in the scale, every spacing rule, and how the system responds across device sizes.

---

## Font Selection

Roman Creative Studio uses a three-font system:

| Role | Font Family | Why |
|------|------------|-----|
| **Display / Headings** | Cormorant Garamond | Editorial premium. Pairs with gold to create a refined, authoritative tone. Strong personality at large sizes without being trendy. |
| **Body / UI** | Inter | The most readable sans-serif at body sizes. Modern, neutral, and precise. Extensive weight range. Excellent WCAG compliance. |
| **Monospace** | JetBrains Mono | Used for code, tokens, and technical documentation. Clear, legible, and consistent with the precision of the system. |

---

## Font Pairing Logic

Cormorant Garamond and Inter represent a deliberate tension that serves the brand:

- **Cormorant Garamond** brings history, confidence, and weight to display moments — the large headlines that define a page
- **Inter** brings clarity, neutrality, and function to the UI layer — the text people actually read at length

The pairing communicates: *premium character, modern intelligence.*

This is not an arbitrary aesthetic choice. It mirrors the brand's core positioning: strategic depth (Cormorant's authority) expressed through modern, accessible communication (Inter's clarity).

**Where each is used:**
- Cormorant Garamond: Display headings (60px+), H1 in hero sections, pull quotes
- Inter: All UI text, H2–H6, body copy, labels, buttons, nav, forms, captions
- JetBrains Mono: Code blocks, token references, technical documentation only

---

## Font Loading

```html
<!-- Add to <head> of every HTML page -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

```css
/* In tokens.css */
--font-display: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
--font-body:    'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono:    'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

---

## Type Scale

All sizes are defined as CSS tokens and use `rem` units (base: 16px).

| Token | Rem | px | Role |
|-------|-----|----|------|
| `--text-xs` | `0.75rem` | 12px | Labels, badges, helper text |
| `--text-sm` | `0.875rem` | 14px | Small body, secondary labels, captions |
| `--text-base` | `1rem` | 16px | Primary body text |
| `--text-lg` | `1.125rem` | 18px | Lead text, nav brand name, large labels |
| `--text-xl` | `1.25rem` | 20px | Card headings, sub-section titles |
| `--text-2xl` | `1.5rem` | 24px | H4 equivalents, feature headings |
| `--text-3xl` | `1.875rem` | 30px | H3 equivalents, section headings |
| `--text-4xl` | `2.25rem` | 36px | H2 equivalents, page headings |
| `--text-5xl` | `3rem` | 48px | H1 (mobile and tablet) |
| `--text-6xl` | `3.75rem` | 60px | H1 (desktop) |
| `--text-7xl` | `4.5rem` | 72px | Display / Hero (large desktop) |
| `--text-display` | `clamp(3rem, 6vw, 5rem)` | Fluid | Display hero headlines |

---

## Weight System

| Token | Value | Font Usage |
|-------|-------|------------|
| `--weight-light` | `300` | Inter only — for specific decorative/lead text |
| `--weight-normal` | `400` | Body text, default |
| `--weight-medium` | `500` | Emphasized body, labels, form text |
| `--weight-semibold` | `600` | Sub-headings, nav items, card titles (Inter) |
| `--weight-bold` | `700` | Section headings, strong emphasis |
| `--weight-extrabold` | `800` | Hero headings (Inter UI layer) |

*Cormorant Garamond display headings use weights 400–700. Heavier weights don't render well at very large sizes in this typeface.*

---

## Line Height System

| Token | Value | Use |
|-------|-------|-----|
| `--leading-none` | `1` | Display text where tight stacking is intentional |
| `--leading-tight` | `1.15` | Large display and hero headings (Cormorant) |
| `--leading-snug` | `1.35` | H2–H3 section headings |
| `--leading-normal` | `1.5` | Body text default |
| `--leading-relaxed` | `1.65` | Long-form editorial body |
| `--leading-loose` | `1.8` | Highly readable text for accessibility-sensitive contexts |

---

## Letter Spacing System

| Token | Value | Use |
|-------|-------|-----|
| `--tracking-tight` | `-0.025em` | Display headings (Cormorant, large sizes) |
| `--tracking-snug` | `-0.015em` | H1–H2 Inter headings |
| `--tracking-normal` | `0` | Body text |
| `--tracking-wide` | `0.04em` | Labels, badges, small caps, all-caps text |
| `--tracking-widest` | `0.10em` | Overline text, category labels above headings |

---

## Typography Hierarchy

### Display / Hero (Cormorant Garamond)

```css
.display {
  font-family: var(--font-display);
  font-size: var(--text-display);     /* clamp(3rem, 6vw, 5rem) */
  font-weight: 600;
  line-height: var(--leading-tight);  /* 1.15 */
  letter-spacing: var(--tracking-tight);
  color: var(--color-white);
}

.display em {
  color: var(--color-text-brand);     /* #D4AF37 */
  font-style: italic;
}
```

### H1 — Page Heading (Inter)

```css
h1, .h1 {
  font-family: var(--font-body);
  font-size: var(--text-6xl);         /* 60px desktop */
  font-weight: var(--weight-extrabold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-snug);
  color: var(--color-white);
}
```

### H2 — Section Heading

```css
h2, .h2 {
  font-family: var(--font-body);
  font-size: var(--text-4xl);         /* 36px */
  font-weight: var(--weight-bold);
  line-height: var(--leading-snug);
  letter-spacing: var(--tracking-snug);
  color: var(--color-text);
}
```

### H3 — Sub-Section Heading

```css
h3, .h3 {
  font-family: var(--font-body);
  font-size: var(--text-3xl);         /* 30px */
  font-weight: var(--weight-bold);
  line-height: var(--leading-snug);
  color: var(--color-text);
}
```

### H4 — Card / Component Heading

```css
h4, .h4 {
  font-family: var(--font-body);
  font-size: var(--text-xl);          /* 20px */
  font-weight: var(--weight-semibold);
  line-height: var(--leading-snug);
  color: var(--color-text);
}
```

### Body Large

```css
.body-lg {
  font-family: var(--font-body);
  font-size: var(--text-lg);          /* 18px */
  font-weight: var(--weight-normal);
  line-height: var(--leading-relaxed);
  color: var(--color-text-muted);
}
```

### Body (Default)

```css
body, .body {
  font-family: var(--font-body);
  font-size: var(--text-base);        /* 16px */
  font-weight: var(--weight-normal);
  line-height: var(--leading-normal);
  color: var(--color-text-muted);
}
```

### Body Small

```css
.body-sm {
  font-family: var(--font-body);
  font-size: var(--text-sm);          /* 14px */
  line-height: var(--leading-normal);
  color: var(--color-text-muted);
}
```

### Caption / Metadata

```css
.caption {
  font-family: var(--font-body);
  font-size: var(--text-xs);          /* 12px */
  font-weight: var(--weight-normal);
  line-height: var(--leading-normal);
  color: var(--color-text-subtle);
}
```

### Button Text

```css
.btn-text {
  font-family: var(--font-body);
  font-size: var(--text-sm);          /* 14px */
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-wide);
  line-height: 1;
}
```

### Label / Overline

```css
.label {
  font-family: var(--font-body);
  font-size: var(--text-xs);          /* 12px */
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--color-text-brand);     /* Often gold */
}
```

### Code / Monospace

```css
code, pre, .mono {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: var(--weight-normal);
  line-height: var(--leading-relaxed);
  color: var(--color-text-brand);     /* Gold on dark makes code pop */
}
```

---

## Responsive Scaling

| Element | Mobile (<768px) | Tablet (768–1023px) | Desktop (1024px+) |
|---------|----------------|---------------------|------------------|
| Hero H1 | `--text-4xl` (36px) | `--text-5xl` (48px) | `--text-6xl` (60px) |
| Display | `clamp(2rem, 8vw, 3rem)` | `clamp(2.5rem, 6vw, 4rem)` | `clamp(3rem, 6vw, 5rem)` |
| H2 | `--text-3xl` (30px) | `--text-4xl` (36px) | `--text-4xl` (36px) |
| H3 | `--text-2xl` (24px) | `--text-3xl` (30px) | `--text-3xl` (30px) |
| Body | `--text-base` (16px) | `--text-base` (16px) | `--text-base` (16px) |

**Rule:** Body text never scales below 16px on any viewport. Heading sizes scale fluidly between breakpoints using `clamp()` where possible.

---

## Accessibility Notes

- Minimum body text: `16px` — never below this on any viewport
- Use `rem` units, not `px`, so browser font size preferences are respected
- Line length: 60–75 characters per line for body text (approx. `ch` units or max-width constraint)
- Do not reduce `line-height` below `1.5` for body text (WCAG 1.4.12)
- Do not use `letter-spacing` on body text — it disrupts word recognition
- Cormorant Garamond should only be used at 30px+ for accessibility — the thin strokes of Garamond reduce legibility at small sizes

---

## Rules

1. Never use Cormorant Garamond below 30px
2. Never use JetBrains Mono for UI text or body copy
3. Never introduce a fourth typeface without updating this document
4. All font sizes must reference `--text-*` tokens — no arbitrary `px` values in CSS
5. Body text must always use Inter — never Cormorant at body sizes
6. All-caps text must use `--tracking-widest` — never `text-transform: uppercase` without adjusted letter spacing

---

## Related Documents

- [Design System — Typography.md](../design-system/Typography.md)
- [ColorSystem.md](ColorSystem.md)
- [AccessibilitySystem.md](AccessibilitySystem.md)

---

*Roman Creative Studio Visual Identity System | Phase 2B | Version 1.0*
