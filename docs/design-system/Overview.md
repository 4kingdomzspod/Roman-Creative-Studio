# Design System Overview

## What This Is

The Roman Creative Studio Design System is the complete visual and component language for the website and all client-facing materials. It ensures consistency, maintainability, and speed — every decision is made once and applied everywhere.

---

## Architecture

The CSS is structured in four layers, each importing the previous:

```
tokens.css       ← Design decisions (colors, spacing, type scale, radii, shadows)
    ↓
base.css         ← Reset, root element styles, typography defaults
    ↓
layout.css       ← Container, grid, section, column systems
    ↓
components.css   ← All UI components (nav, hero, cards, buttons, forms, footer...)
```

This layering means:
- Changing a token updates every component that uses it
- No component-level magic numbers — all values trace back to tokens
- Onboarding a new page requires only linking the same 4 CSS files

---

## File Locations

| File | Path | Size |
|------|------|------|
| Design tokens | `assets/css/tokens.css` | 12.8 KB |
| Base / reset | `assets/css/base.css` | 5.8 KB |
| Layout system | `assets/css/layout.css` | 5.3 KB |
| Components | `assets/css/components.css` | 46.1 KB |

---

## Design Principles

1. **Dark first** — all components are designed for the dark charcoal theme
2. **Gold as the accent** — `#D4AF37` signals brand, action, and emphasis
3. **Warm white for text** — `#F0EFE9` instead of pure white to reduce eye strain
4. **Generous spacing** — whitespace communicates premium quality
5. **Subtle depth** — layered backgrounds create dimension without gradients
6. **Accessible contrast** — all text meets WCAG AA minimum (4.5:1 for body)

---

## How to Use This Documentation

Each section of the design system documentation covers:
- **Purpose** — what this element does
- **Tokens** — the CSS variables that power it
- **Usage** — how to implement it
- **Variants** — all supported variations
- **Accessibility** — requirements and notes
- **Responsive** — behavior at different breakpoints

---

## Live Reference

The live design system reference page is available at:  
`/design-system.html` — shows all components rendered in the browser.

Always check the live page after making changes to any CSS file.
