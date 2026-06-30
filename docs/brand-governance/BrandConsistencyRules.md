# Brand Consistency Rules
**Roman Creative Studio — Brand Governance System**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

Define the system-wide consistency standards that apply to every RCS output. These rules govern typography, color, spacing, layout, and component behavior across all platforms. Any deviation from these rules is a brand quality defect — not a stylistic preference.

> **There is no "close enough" in brand consistency. Either it matches the system or it doesn't.**

---

## 1. Typography Consistency Rules

### Font Usage

| Font | Approved Use | Prohibited Use |
|------|-------------|----------------|
| **Cormorant Garamond** | Display headings 30px and above only | Body text, UI labels, sizes below 30px, captions |
| **Inter** | All body copy, UI text, labels, captions, buttons, nav | Display headings (use Cormorant instead) |
| **JetBrains Mono** | Code blocks, technical content, terminal output | Decorative use, body text, headings |
| **Any other font** | ❌ Never | No exceptions without Phase 2B amendment |

### Size Enforcement

- All font sizes must reference a `--text-*` token. No hardcoded `px` values for type.
- No font size below `--text-xs` (12px) except in `<sup>`, `<sub>`, or legal fine print.
- No font size above `--text-display` except in one-off brand moment designs (requires approval).

### Weight Enforcement

| Font | Approved Weights | Prohibited |
|------|-----------------|------------|
| Cormorant Garamond | 400 (Regular), 600 (SemiBold), 700 (Bold) | 300 (too thin at size), 900 |
| Inter | 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold) | 100, 200, 300, 800, 900 |
| JetBrains Mono | 400 (Regular), 700 (Bold) | All other weights |

### Heading Hierarchy

```
Every page/document must have:
  Exactly one H1
  H2s for major sections (never skip to H3 without H2)
  H3s for subsections
  H4s only when H3 genuinely has sub-items
```

**Rule:** Never use a heading level for visual size reasons. If the visual hierarchy doesn't match the semantic hierarchy, fix the CSS — not the heading level.

### Line Length

- Body text maximum line length: **75 characters** (approximately 640px at base font size)
- Display headings maximum line length: **50 characters**
- Apply `max-width` to text containers, not individual `<p>` elements

### Letter Spacing Enforcement

- Heading letter-spacing: use `--tracking-tight` or `--tracking-tighter` only
- All-caps labels: `--tracking-widest` (0.1em minimum)
- Body copy: `--tracking-normal` (0em) — never track out body text
- **Prohibited:** Tracking body text wider than `0.02em`

---

## 2. Color Token Enforcement Rules

### Non-Negotiable

> **No hardcoded color values in production code or design files.** Every color must reference a CSS custom property token from `--color-*`.

### Approved Color Usage

| Color Token | Approved Use | Prohibited Use |
|------------|-------------|----------------|
| `--color-brand-gold` | Primary CTAs, active states, headline accents, icon containers | Background fills for large areas, body text color |
| `--color-brand-gold-dark` | Hover state for gold elements | As a primary color (use base gold) |
| `--color-brand-gold-subtle` | Subtle tint backgrounds, highlight states | Text color |
| `--color-brand-gold-glow` | Box shadow glow on brand elements | As border color |
| `--color-bg` | Page background only | Cards, panels (use --color-surface) |
| `--color-surface` | Cards, panels, sidebars | Page background |
| `--color-surface-elevated` | Modals, dropdowns, tooltips | Standard cards |
| `--color-surface-muted` | Inset inputs, code blocks, depressed states | Page background |
| `--color-text` | Primary body text | Decorative use, background fills |
| `--color-text-muted` | Secondary text, descriptions | Primary headings |
| `--color-text-subtle` | Labels, meta, timestamps | Body copy |
| `--color-text-brand` | Brand-colored text emphasis | Large blocks of text |
| `--color-error` | Error states only | Decorative red, non-error emphasis |
| `--color-success` | Success states only | Decorative green |
| `--color-warning` | Warning states only | Decorative yellow/amber |
| `--color-info` | Informational states only | Decorative blue |

### Prohibited Color Uses

- ❌ Any hex color not in the design token system (in production code)
- ❌ Using error/success/warning colors for decorative purposes
- ❌ Using gold as a large background fill (it becomes overwhelming — reserve for accents)
- ❌ Introducing any new color without a formal brand system amendment
- ❌ Using RGBA values not derived from existing color tokens

### One Gold Rule Per Section

> **Maximum one gold-dominant element per visual section.** Two gold elements in the same section compete and cancel each other out. If everything is emphasized, nothing is.

---

## 3. Spacing Consistency Rules

### Token Enforcement

All spacing values — margin, padding, gap — must reference a `--space-*` token. No hardcoded `px` values for spacing in production.

```css
/* ✅ Correct */
padding: var(--space-6);

/* ❌ Prohibited */
padding: 24px;
```

### Exception: Border width, outline width, border-radius
These may use hardcoded pixel values (e.g., `border: 2px solid`, `border-radius: 12px`) when they reference the design spec directly — or use the `--radius-*` tokens defined in the system.

### Spacing Rules

- **Same section, related items:** `--space-4` to `--space-6`
- **Same section, distinct groups:** `--space-8` to `--space-10`
- **Between major sections:** `--space-16` to `--space-24`
- **Hero section vertical padding:** `--space-20` to `--space-32`

**Consistency rule:** If two sections of the same type (e.g., two service cards) use different internal padding, that is a defect. Card padding is defined once in the design system and applied universally.

---

## 4. Component Consistency Rules

### Button Consistency

All buttons must use one of the defined button variants. No one-off button styles.

| Variant | When to Use |
|---------|------------|
| Primary (gold fill) | One per section — the main action |
| Secondary (gold outline) | Supporting action when primary exists |
| Ghost (transparent + border) | Tertiary or low-emphasis actions |
| Destructive (error-toned) | Delete, remove, cancel actions |
| Icon-only | Compact UI where label would clutter |

**Rule:** There must never be two Primary buttons in the same visual section. One primary action per section.

### Card Consistency

- All cards of the same type must have identical padding, border-radius, and border style
- Cards in a grid must align vertically (height determined by CSS Grid, not fixed values)
- Card hover states must match the defined system: `translateY(-2px)` + shadow deepening + border brightening

### Form Consistency

- All form inputs must use identical height (minimum 44px), border-radius (`--radius-md`), and border color (`--color-border`)
- Focus states must use the gold outline ring without exception
- Error states must use `--color-error` border + red message text + error icon — all three together

### Navigation Consistency

- The navigation must be identical across all pages. No per-page nav variations.
- Active state: gold text color (`--color-text-brand`) for current page
- Nav links never use bold weight in the default state
- CTA button in nav: always Primary style, always rightmost element

---

## 5. Layout Consistency Rules

### Container Width

- All page content must be constrained to `--container-xl` (1280px) maximum
- No content should bleed beyond the container without intentional full-bleed treatment
- Full-bleed sections (backgrounds only) must still contain their text content within the container

### Section Structure

Every content section must follow this structure pattern:
```
[Section wrapper with background color]
  [Container at --container-xl]
    [Section header: eyebrow label + H2 headline + optional description]
    [Content grid or list]
    [Optional section CTA]
```

No section may skip the container wrapper. No content may be directly on the `<body>`.

### Grid Alignment

- All grids must use CSS Grid or Flexbox — no float-based layouts
- Grid gaps must use `--space-*` tokens
- All items in the same grid row must align to the same baseline grid

---

## Consistency Audit Checklist

Run before any page or asset is marked complete:

- [ ] All font sizes use `--text-*` tokens
- [ ] All colors use `--color-*` tokens
- [ ] All spacing uses `--space-*` tokens
- [ ] Heading hierarchy is correct (H1 → H2 → H3, no skips)
- [ ] Maximum one Primary button per section
- [ ] Maximum one gold-dominant element per section
- [ ] Navigation is identical to all other pages
- [ ] Cards of the same type have identical structure
- [ ] Container width is enforced on all content
- [ ] No hardcoded pixel values for type, color, or spacing

---

## Related Documents
- `docs/visual-identity/ColorSystem.md` — Token definitions
- `docs/visual-identity/TypographySystem.md` — Font and scale definitions
- `docs/visual-identity/DesignLanguage.md` — Spacing and depth philosophy
- `docs/design-system/` — Component specifications
- `docs/brand-governance/DesignSystemGovernance.md` — Component approval process
