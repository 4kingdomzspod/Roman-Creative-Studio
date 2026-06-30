# Design Language Principles
**Roman Creative Studio — Visual Identity System**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

Define the foundational visual philosophy that governs all design decisions at Roman Creative Studio. This document explains the *why* behind the aesthetic — the principles that determine how we use space, shape, depth, shadow, and hierarchy. Every visual decision should trace back to one of these principles.

---

## The Four-Word Direction

> **Dark. Gold. Precise. Intentional.**

Every design element — whether a button, a hero section, a proposal template, or a business card — must feel consistent with all four of these words simultaneously.

| Word | What It Requires |
|------|------------------|
| **Dark** | Dark backgrounds dominate. Light text. Not gray — true dark. |
| **Gold** | Restraint with gold. Reserve it for hierarchy moments, not decoration. |
| **Precise** | Sharp edges. Consistent spacing. Nothing accidental or approximate. |
| **Intentional** | Every element earns its place. Remove anything that doesn't serve the user or the message. |

---

## 1. Spacing Philosophy

### The Base-4 Grid

All spacing in the RCS design system derives from a **4px base unit**. Every spacing value is a multiple of 4.

```css
:root {
  --space-1:  4px;   /* Micro — icon gap, tight label spacing */
  --space-2:  8px;   /* Small — inline element gaps */
  --space-3:  12px;  /* Label to field gap */
  --space-4:  16px;  /* Default component padding */
  --space-5:  20px;  /* Slightly generous padding */
  --space-6:  24px;  /* Card padding, section sub-gaps */
  --space-8:  32px;  /* Between related sections */
  --space-10: 40px;  /* Section internal spacing */
  --space-12: 48px;  /* Section breathing room */
  --space-16: 64px;  /* Between major sections */
  --space-20: 80px;  /* Hero section padding */
  --space-24: 96px;  /* Large section separation */
  --space-32: 128px; /* Maximum section padding */
}
```

### Spacing Rules

1. **Never use arbitrary values.** If a spacing value isn't in the scale, use the nearest token.
2. **More space = more importance.** Generous spacing signals premium. Tight spacing signals density/utility.
3. **Vertical rhythm matters.** Sections separated by `--space-16` or more should feel like chapters, not sentences.
4. **Mobile scales down one step.** A desktop `--space-16` gap becomes `--space-10` or `--space-12` on mobile.

---

## 2. Shape Language

### Border Radius System

```css
:root {
  --radius-none: 0px;    /* Hard edges — borders, dividers, table cells */
  --radius-sm:   4px;    /* Slight softening — tags, badges, code blocks */
  --radius-md:   8px;    /* Default — form inputs, small cards */
  --radius-lg:   12px;   /* Cards, panels, modals */
  --radius-xl:   16px;   /* Featured cards, large panels */
  --radius-2xl:  24px;   /* Hero containers, large feature sections */
  --radius-full: 9999px; /* Pills, avatar circles, full-round buttons */
}
```

### Shape Principles

**Default to `--radius-lg` (12px)** for cards and panels. This is the RCS signature radius — soft enough to feel modern, precise enough to feel premium.

**Never mix radii randomly.** Within a single component, all radius values should be consistent. A card with `--radius-lg` corners doesn't have a `--radius-full` button unless it's an intentional pill CTA.

**Sharp edges are allowed and powerful.** Section dividers, table borders, horizontal rules, and some decorative elements use `--radius-none`. Sharp edges create visual precision.

**The geometric underpinning:** The RCS aesthetic leans toward rectangles and structured grids — not organic, rounded blobs. Radius is applied to soften precision, not to impose softness.

---

## 3. Depth System

RCS uses a layered depth model to create visual hierarchy on dark backgrounds. Rather than using traditional drop shadows (which work better on light backgrounds), the depth system relies on **surface elevation** — progressively lighter background values as elements move "higher."

### Elevation Layers

| Layer | Token | Hex | Use |
|-------|-------|-----|-----|
| Page background | `--color-bg` | `#0C0E11` | The canvas. Nothing sits below this. |
| Content surface | `--color-surface` | `#1B1E23` | Cards, panels, sidebars |
| Elevated surface | `--color-surface-elevated` | `#252930` | Modals, dropdowns, tooltips |
| Muted depression | `--color-surface-muted` | `#121417` | Inset inputs, code blocks, depressed states |

### Depth Rules

1. **Higher elevation = lighter background.** Always. This creates intuitive spatial hierarchy.
2. **Never use a lighter elevation behind a darker elevation.** That inverts depth and confuses the eye.
3. **Borders reinforce depth transitions.** Use `--color-border` between same-layer elements, `--color-border-strong` to separate elevation layers.
4. **Gold border on top elevation.** When the highest elevation element is a featured/primary card, `--color-border-brand` can replace the standard border.

### Shadow Use

Shadows on dark backgrounds must be used sparingly. Unlike on light backgrounds, a black shadow on a dark background is invisible or minimal. Use shadows for:

- **Floating elements** (tooltips, modals, dropdown menus)
- **Brand emphasis** (gold glow for primary CTAs and icon containers)
- **Cards on hover** (deepen shadow on `translateY(-2px)` hover)

```css
/* Shadow scale */
:root {
  --shadow-sm:   0 1px  3px rgba(0, 0, 0, 0.30);
  --shadow-md:   0 4px 12px rgba(0, 0, 0, 0.35);
  --shadow-lg:   0 8px 32px rgba(0, 0, 0, 0.40);
  --shadow-xl:   0 16px 48px rgba(0, 0, 0, 0.50);

  /* Brand glow — gold-tinted shadow for emphasis */
  --shadow-brand-sm: 0 0  8px rgba(212, 175, 55, 0.20);
  --shadow-brand-md: 0 0 18px rgba(212, 175, 55, 0.30);
  --shadow-brand-lg: 0 0 32px rgba(212, 175, 55, 0.40);
}
```

**Gold glow is reserved for:**
- Primary CTA buttons (active/focus state)
- Logo container
- Featured/hero icon containers
- Highlighted statistics or key numbers

---

## 4. Visual Hierarchy

Visual hierarchy answers: *What should the user look at first?*

### The RCS Hierarchy Ladder (Top to Bottom)

1. **Gold-tinted elements** — Immediately draw the eye. Reserve for the single most important thing per section.
2. **Large display type** (Cormorant Garamond, 48px+) — Section headline, hero statement
3. **White body text** (`--color-text`) — Primary readable content
4. **Supporting body text** (`--color-text-muted`) — Descriptions, secondary information
5. **Muted/subtle text** (`--color-text-subtle`) — Labels, meta information, timestamps
6. **Borders and dividers** — Structure, not information
7. **Background surfaces** — The canvas, never the message

### Hierarchy Rules

- **One gold element per section.** Two gold elements compete and cancel each other out.
- **Size + weight = importance.** Large Cormorant headline + gold color = maximum hierarchy.
- **Whitespace is hierarchy.** The most important element should have the most space around it.
- **Don't bold everything.** Bold means "most important in this group." If everything is bold, nothing is.

---

## 5. Grid System

### Container Widths

```css
:root {
  --container-sm:   640px;  /* Narrow content — blog posts, forms */
  --container-md:   768px;  /* Medium content */
  --container-lg:   1024px; /* Standard page width */
  --container-xl:   1280px; /* Full-width sections */
  --container-2xl:  1440px; /* Maximum layout width */
}

.container {
  width: 100%;
  max-width: var(--container-xl);
  margin-inline: auto;
  padding-inline: var(--space-6);
}

@media (min-width: 768px) {
  .container { padding-inline: var(--space-8); }
}

@media (min-width: 1024px) {
  .container { padding-inline: var(--space-12); }
}
```

### Column Grid

```css
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-6); }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-6); }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-6); }

/* Asymmetric — content + sidebar */
.grid-content-sidebar { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-8); }

/* Featured + 2 columns */
.grid-featured { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); }
.grid-featured .featured { grid-column: 1 / -1; }
```

---

## 6. Line & Divider System

Horizontal rules and dividers serve as chapter breaks in the visual layout.

```css
.divider {
  border: none;
  border-top: 1px solid var(--color-border);
  margin-block: var(--space-8);
}

.divider-strong {
  border-top-color: var(--color-border-strong);
}

.divider-brand {
  border-top-color: var(--color-border-brand);
}

/* Gradient fade-out divider */
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

## Design Language Anti-Patterns

| Anti-Pattern | Correct Approach |
|--------------|------------------|
| Multiple gold elements per section | One gold anchor per section |
| Random spacing values not in scale | Use nearest token value |
| Mixing border-radius values randomly | Consistent radius per component type |
| Dark shadows on dark backgrounds (invisible) | Elevation layers + subtle shadows |
| Every element bolded | Reserve bold for maximum 20% of content |
| Light background behind dark background | Always: higher elevation = lighter |
| Decorative animations without purpose | Every motion must serve function |

---

## Related Documents
- `docs/visual-identity/ColorSystem.md` — Full color token reference
- `docs/visual-identity/TypographySystem.md` — Type scale and hierarchy tokens
- `docs/visual-identity/MotionSystem.md` — Motion and transition tokens
- `docs/visual-identity/ResponsiveRules.md` — Grid and spacing at breakpoints
- `docs/design-system/` — Component implementations applying these principles
