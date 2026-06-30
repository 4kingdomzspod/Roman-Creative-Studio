# Design System Engine — Architecture Overview
**Roman Creative Studio — Phase 3: UI Architecture & Component System**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

This is the engineering backbone of Roman Creative Studio. The Design System Engine transforms brand tokens (Phase 2B) and governance rules (Phase 2C) into a fully reusable, production-ready component architecture that generates consistent, accessible, high-performance websites at scale.

> **We do not design pages. We build systems that generate pages.**

Every website RCS builds — for itself or a client — is assembled from this system. No exceptions.

---

## The Four-Layer Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    LAYER 4: PAGES                           │
│   Homepage  •  Service Page  •  Blog  •  Contact  •  Portfolio  │
├────────────────────────────────────────────────────────────────┤
│                  LAYER 3: SECTIONS (Organisms)              │
│  Navbar  •  Hero  •  Features  •  Pricing  •  Testimonials  • Footer │
├────────────────────────────────────────────────────────────────┤
│               LAYER 2: COMPONENTS (Molecules)               │
│    Form Field  •  Card  •  Nav Item  •  Search  •  Alert       │
├────────────────────────────────────────────────────────────────┤
│                 LAYER 1: ATOMS (Primitives)                  │
│    Button  •  Input  •  Label  •  Icon  •  Badge  •  Avatar    │
├────────────────────────────────────────────────────────────────┤
│                 LAYER 0: DESIGN TOKENS                       │
│  Color  •  Space  •  Type  •  Radius  •  Duration  •  Shadow  │
└────────────────────────────────────────────────────────────────┘
```

**The rule:** Higher layers consume lower layers. Lower layers never reference higher layers. Tokens never reference components. Components never reference page layouts.

---

## CSS File Architecture

```
assets/css/
├── tokens.css          ← Layer 0: All --custom-property declarations
├── base.css            ← Layer 0: HTML element resets and defaults
├── layout.css          ← Layer 1+2: Grid, containers, structural classes
├── components.css      ← Layer 1+2: All reusable component classes
└── utilities.css       ← Cross-layer: Single-purpose utility classes
```

### Load Order (Non-Negotiable)

```html
<link rel="stylesheet" href="/assets/css/tokens.css">
<link rel="stylesheet" href="/assets/css/base.css">
<link rel="stylesheet" href="/assets/css/layout.css">
<link rel="stylesheet" href="/assets/css/components.css">
<link rel="stylesheet" href="/assets/css/utilities.css">
<!-- Page-specific CSS last, if needed -->
```

---

## Component Library Structure

### Layer 1 — Atoms (Primitives)

The smallest indivisible UI units. Never decomposed further.

| Atom | File Reference | Purpose |
|------|---------------|----------|
| Button | `ButtonSystem.md` | All actionable triggers |
| Input | `FormSystem.md` | Text entry fields |
| Textarea | `FormSystem.md` | Multi-line text entry |
| Select | `FormSystem.md` | Dropdown selection |
| Checkbox | `FormSystem.md` | Boolean toggle |
| Radio | `FormSystem.md` | Exclusive selection |
| Label | `TypographyComponentSystem.md` | Form and UI labels |
| Icon | `docs/visual-identity/IconSystem.md` | Heroicons inline SVG |
| Badge | `StateSystem.md` | Status indicators |
| Avatar | Inline spec (below) | User/team representation |
| Divider | `TypographyComponentSystem.md` | Visual separation |
| Spinner | `StateSystem.md` | Loading indicator |

### Layer 2 — Molecules (Components)

Two or more atoms working together as a unit.

| Molecule | Composed Of | Purpose |
|----------|------------|----------|
| Form Field | Label + Input + Helper text + Error | Complete input unit |
| Search Bar | Input + Icon + Button | Search interaction |
| Nav Item | Link + optional Icon + optional Badge | Navigation link |
| Card (base) | Container + optional Image + Content | Content container |
| Alert | Icon + Text + optional Button | System messages |
| Stat Block | Number + Label + optional Icon | Key metrics display |
| Testimonial Quote | Avatar + Quote + Attribution | Social proof unit |
| Tag / Pill | Label + optional Icon | Categorization |

### Layer 3 — Organisms (Sections)

Full page sections assembled from molecules and atoms.

| Organism | File Reference | Purpose |
|---------|---------------|----------|
| Navbar | `NavigationSystem.md` | Site-wide navigation |
| Footer | `NavigationSystem.md` | Site-wide footer |
| Hero | `HeroSystem.md` | Page header/entry point |
| Feature Grid | `CardSystem.md` | Services/features display |
| Pricing Section | `CardSystem.md` | Pricing plans |
| Testimonials | `CardSystem.md` | Social proof section |
| CTA Section | `HeroSystem.md` | Conversion section |
| Blog Grid | `CardSystem.md` | Article listings |
| Stats Section | Inline | Key metrics row |
| FAQ Accordion | Inline | Q&A section |
| Contact Form | `FormSystem.md` | Lead capture form |
| Process Steps | Inline | Step-by-step section |

### Layer 4 — Templates (Page Layouts)

Page-level structure assembled from organisms.

| Template | Organism Composition |
|----------|---------------------|
| **Landing Page** | Navbar + Hero (Conversion) + Features + Testimonials + CTA + Footer |
| **Service Page** | Navbar + Hero (Split) + Features + Process + Pricing + FAQ + CTA + Footer |
| **Blog Listing** | Navbar + Hero (Minimal) + Blog Grid + CTA + Footer |
| **Blog Post** | Navbar + Post Header + Body + CTA + Footer |
| **Contact Page** | Navbar + Hero (Minimal) + Contact Form + Map/Info + Footer |
| **Portfolio/Case Study** | Navbar + Hero (Image) + Case Content + Results + CTA + Footer |
| **About Page** | Navbar + Hero (Centered) + Story + Team + Values + CTA + Footer |

---

## Reusability Principles

### 1. One Component, Many Contexts
A component must work in at least 3 different contexts before it enters the system. If it only works in one context, it is a one-off — not a component.

### 2. Configuration Over Duplication
Variants are configuration options on one component — not separate components.

```html
<!-- ✅ One component with variant class -->
<button class="btn btn--primary btn--lg">Book a Call</button>
<button class="btn btn--secondary btn--md">Learn More</button>

<!-- ❌ Two separate components that do the same thing -->
<button class="cta-button-gold">Book a Call</button>
<button class="learn-more-button">Learn More</button>
```

### 3. Token Consumption (Never Hardcode)
Components reference tokens. Tokens define values. This means changing a token updates every component simultaneously.

### 4. Accessibility by Default
Accessibility is baked into the component — not added to implementations. A button component includes focus states, aria attributes, and keyboard behavior by definition.

### 5. State Completeness
Every interactive component must define all states: default, hover, focus, active, disabled, and loading (where applicable). Incomplete state definitions are incomplete components.

---

## Avatar Component Specification

```html
<!-- Avatar with image -->
<div class="avatar avatar--md">
  <img src="team-photo.jpg" alt="Alexander Roman, Founder" />
</div>

<!-- Avatar with initials fallback -->
<div class="avatar avatar--md avatar--initials" aria-label="Alexander Roman">
  <span aria-hidden="true">AR</span>
</div>
```

```css
.avatar {
  border-radius: var(--radius-full);
  overflow: hidden;
  background: var(--color-surface-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid var(--color-border);
}

.avatar--xs  { width: 24px;  height: 24px;  font-size: var(--text-xs); }
.avatar--sm  { width: 32px;  height: 32px;  font-size: var(--text-xs); }
.avatar--md  { width: 48px;  height: 48px;  font-size: var(--text-sm); }
.avatar--lg  { width: 64px;  height: 64px;  font-size: var(--text-base); }
.avatar--xl  { width: 96px;  height: 96px;  font-size: var(--text-xl); }
.avatar--2xl { width: 128px; height: 128px; font-size: var(--text-3xl); }

.avatar img  { width: 100%; height: 100%; object-fit: cover; }

.avatar--initials span {
  font-family: var(--font-body);
  font-weight: var(--weight-semibold);
  color: var(--color-text-muted);
  letter-spacing: var(--tracking-wide);
}
```

---

## Scalability Rules

1. **Industry-agnostic by default.** Components contain no industry-specific copy, imagery, or assumptions.
2. **White-label ready.** All color values reference tokens — the entire system can be recolored for a client by overriding `:root` tokens.
3. **Content-length tolerant.** Components must not break when content is shorter or longer than the design example.
4. **No fixed heights on content containers.** Use `min-height` where necessary, never `height`.
5. **No magic numbers.** Every value in every component traces back to a token.

---

## Related Documents
- `docs/visual-identity/ColorSystem.md` — Token reference
- `docs/visual-identity/TypographySystem.md` — Font and scale tokens
- `docs/visual-identity/DesignLanguage.md` — Spacing, shape, depth philosophy
- `docs/brand-governance/DesignSystemGovernance.md` — How new components are approved
- All `docs/design-system-engine/` files — Component specifications
