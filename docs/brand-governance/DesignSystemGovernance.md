# Design System Governance
**Roman Creative Studio — Brand Governance System**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

Define how the Roman Creative Studio design system grows, stays clean, and remains the single source of truth for all design and development decisions. A design system without governance becomes a design system full of duplicates, exceptions, and contradictions. Governance is what makes the system trustworthy.

> **The design system is the product. Every shortcut taken against it is technical debt borrowed against brand quality.**

---

## 1. The Core Governance Principle

> **No component is created unless it serves a reusable, documented system need.**

Before creating any new component, token, or pattern, ask:
1. Does this already exist in the system?
2. Can an existing component be composed to solve this need?
3. If new: will this be reused in at least 3 contexts?
4. If new: is it consistent with the existing system vocabulary?

If the answer to (1) or (2) is yes, stop. Use what exists. If the answer to (3) or (4) is no, the new component is not added to the system — it may be built as a one-off with a `[ONE-OFF]` label and requires separate approval.

---

## 2. New Component Approval Process

### Step 1 — Identify the Need
Document:
- What problem does this component solve?
- What existing component(s) came closest?
- Why can't an existing component be used or extended?
- Where will this component be used (minimum 3 contexts)?

### Step 2 — Design the Component
- Build using only existing design tokens (`--color-*`, `--space-*`, `--text-*`, `--radius-*`, `--duration-*`)
- Define all states: default, hover, focus, active, disabled, error (where applicable)
- Verify WCAG AA compliance for all states
- Check responsive behavior at all defined breakpoints

### Step 3 — Document the Component
Add to `docs/design-system/` with:
- Component name and purpose
- All variants and states
- Token references
- HTML/CSS implementation
- Accessibility requirements
- Do/don't examples
- Related components

### Step 4 — Review
- Reviewed against the existing component library for duplicates
- Reviewed against brand consistency rules
- Approved before any production use

### Step 5 — Add to System
- Component added to CSS with proper naming convention
- Added to design file component library
- `docs/design-system/` file committed

---

## 3. New Token Approval Process

Tokens are the foundation of the design system. Token sprawl (too many tokens, redundant tokens, inconsistently named tokens) is a critical system failure.

### When a New Token Is Allowed

| Scenario | Decision |
|----------|----------|
| A new color is needed for a state not covered by existing tokens | Allowed — follow naming convention |
| A spacing value not in the scale is needed repeatedly | Allowed — add to scale with justification |
| A variant of an existing token is needed (e.g., lighter version of gold) | Allowed only if the variant is used in ≥3 places |
| A one-off value is needed for a single component | Not a token — hardcode with `[ONE-OFF]` comment |
| A new font is proposed | Requires Phase 2B amendment — not a token decision |

### Token Naming Convention

```css
/* Pattern: --[category]-[name]-[modifier] */

/* Color tokens */
--color-brand-gold
--color-brand-gold-dark
--color-brand-gold-subtle
--color-bg
--color-surface
--color-surface-elevated
--color-text
--color-text-muted

/* Spacing tokens */
--space-1  through  --space-32

/* Typography tokens */
--text-xs  through  --text-display
--font-body
--font-display
--font-mono
--leading-tight  through  --leading-loose
--tracking-tighter  through  --tracking-widest
--weight-regular  through  --weight-bold

/* Border radius tokens */
--radius-none  through  --radius-full

/* Duration tokens */
--duration-instant  through  --duration-dramatic

/* Shadow tokens */
--shadow-sm  through  --shadow-xl
--shadow-brand-sm  through  --shadow-brand-lg
```

### Token Anti-Patterns (Prohibited)

```css
/* ❌ Never name tokens by context or component */
--button-background-color       /* context-specific — not a system token */
--card-padding                  /* use --space-6 directly */
--header-font-size              /* use --text-xl directly */

/* ❌ Never duplicate existing tokens */
--primary-color: #D4AF37;      /* duplicates --color-brand-gold */

/* ❌ Never use numeric-only names without a scale */
--color-1, --color-2            /* meaningless names */

/* ❌ Never name tokens by value */
--color-48px                    /* names should describe meaning, not value */
```

---

## 4. Duplicate Prevention Rules

Duplicate components and tokens are the primary way design systems degrade.

### Before Creating Anything New

1. **Search the token file** (`tokens.css`) for existing values
2. **Search the component files** (`components.css`) for existing patterns
3. **Search the docs/design-system/** folder for documented components
4. **Check the design file** component library

If a duplicate is found: use the existing one. If the existing one is wrong, fix the existing one — do not create a parallel version.

### Duplicate Resolution Protocol

If two components or tokens serving the same purpose are discovered:
1. Identify which is the canonical version (documented, more widely used)
2. Migrate all uses of the non-canonical version to the canonical one
3. Delete the non-canonical version
4. Document the consolidation in the component's docs file

---

## 5. CSS Architecture Enforcement

The RCS 4-layer CSS architecture is non-negotiable:

```
tokens.css      → All CSS custom properties. No selectors.
base.css        → Reset, HTML element defaults. No classes.
layout.css      → Page structure, grid, containers. No component styles.
components.css  → All reusable component classes.
```

### Layer Rules

| Layer | May Contain | May NOT Contain |
|-------|------------|----------------|
| `tokens.css` | `:root {}` custom property declarations | Any selectors, classes, or style rules |
| `base.css` | Element selectors (`body`, `h1`, `a`, `img`) | Class selectors, component styles |
| `layout.css` | `.container`, `.grid-*`, `.section`, structural classes | Component-specific styles |
| `components.css` | `.btn`, `.card`, `.nav`, all UI components | Layout classes, token declarations |

**Rule:** If a style could logically live in a lower layer, it belongs there. If you find component styles in `base.css`, that is a layer violation.

### Specificity Rules

- No `!important` except in accessibility overrides (`prefers-reduced-motion`) or utility reset classes
- No inline styles in production HTML except for dynamic values (e.g., CSS custom property overrides from JS)
- No ID selectors (`#id { }`) in component CSS — IDs are for JavaScript and accessibility only
- Maximum specificity: two class selectors (`.parent .child { }`). If you need more, rethink the component structure.

---

## 6. Component Reuse Enforcement

Component reuse is not optional. The same visual pattern must always use the same component class.

### Examples of Reuse Violations

```css
/* ❌ Building a "new" button for a specific page */
.homepage-cta {
  background: #D4AF37;
  padding: 12px 24px;
  border-radius: 8px;
  /* ... */
}
/* Instead: use .btn.btn-primary */

/* ❌ Building a "new" card for services */
.service-item {
  background: #1B1E23;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 24px;
}
/* Instead: use the documented .card component */
```

### Approved Extension Pattern

If a component needs minor contextual adjustment, extend with a modifier class:

```css
/* ✅ Extending a component with a modifier */
.card.card--featured {
  border-color: var(--color-border-brand);
  box-shadow: var(--shadow-brand-md);
}

.btn.btn--full-width {
  width: 100%;
}
```

**Rule:** Modifiers may adjust a component's visual treatment. They may not fundamentally change its structure or purpose.

---

## 7. Design System Version Control

The design system is versioned alongside the brand system (see `BrandEvolutionRules.md`).

- **Patch version (x.x.1):** Bug fixes, documentation corrections, no visual changes
- **Minor version (x.1.0):** New component added, new token added, non-breaking visual refinement
- **Major version (2.0.0):** Structural change, breaking change to existing component API or token name

Token renames are always major versions. Removing a token without a replacement is always a major version.

---

## Related Documents
- `docs/visual-identity/ColorSystem.md` — Token definitions
- `docs/design-system/` — All component documentation
- `docs/brand-governance/BrandConsistencyRules.md` — Consistency enforcement
- `docs/brand-governance/BrandEvolutionRules.md` — Versioning system
- `docs/operations/CodingStandards.md` — Code quality rules
