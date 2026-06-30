# Color System

**Roman Creative Studio Visual Identity System — Phase 2B**
*Version 1.0 | Last Updated: June 2026*

---

## Purpose of This Document

This document defines the complete token-based color architecture for Roman Creative Studio. Every color used across the website, marketing, and future products must trace back to a token defined here. No off-system color values are permitted.

---

## Architecture Overview

Colors are organized into four layers:

1. **Brand Core** — The identity colors. Non-negotiable.
2. **UI Surface** — Background and structural colors for the dark interface.
3. **Text** — All text and icon colors.
4. **Semantic** — Status and feedback colors (success, warning, error, info).

All tokens are defined as CSS custom properties and must be declared in `assets/css/tokens.css`.

---

## Layer 1: Brand Core Colors

---

### Primary — Gold

| Property | Value |
|----------|-------|
| **Token** | `--color-brand-gold` |
| **HEX** | `#D4AF37` |
| **RGB** | `rgb(212, 175, 55)` |
| **HSL** | `hsl(46, 65%, 52%)` |
| **Usage** | Primary CTAs, interactive states, brand accent, logo border, icon highlights, section dividers |
| **Contrast on `#0C0E11`** | ~9.8:1 ✅ WCAG AAA |
| **Contrast on `#1B1E23`** | ~7.2:1 ✅ WCAG AA |
| **Notes** | Primary action color. Use sparingly to maintain impact. Never use as a large background field. |

---

### Primary Hover — Gold Dark

| Property | Value |
|----------|-------|
| **Token** | `--color-brand-gold-dark` |
| **HEX** | `#C9A84C` |
| **RGB** | `rgb(201, 168, 76)` |
| **HSL** | `hsl(42, 55%, 54%)` |
| **Usage** | Button hover states, secondary gold contexts, subtle gold text |
| **Contrast on `#0C0E11`** | ~8.1:1 ✅ WCAG AAA |
| **Notes** | Always paired with `--color-brand-gold`. Never used as the primary gold. |

---

### Primary Tint — Gold Subtle

| Property | Value |
|----------|-------|
| **Token** | `--color-brand-gold-subtle` |
| **HEX** | N/A (alpha) |
| **RGB** | `rgba(212, 175, 55, 0.12)` |
| **Usage** | Icon container backgrounds, tinted card backgrounds on hover, badge backgrounds |
| **Notes** | Not for text. Decorative/structural use only. Test on all surface colors before use. |

---

### Primary Glow — Gold Glow

| Property | Value |
|----------|-------|
| **Token** | `--color-brand-gold-glow` |
| **RGB** | `rgba(212, 175, 55, 0.30)` |
| **Usage** | Box shadows, glow effects on interactive gold elements (logo hover, CTA hover) |
| **Notes** | Use exclusively in `box-shadow`. Never as a border or background on its own. |

---

### Secondary — Charcoal

| Property | Value |
|----------|-------|
| **Token** | `--color-brand-charcoal` |
| **HEX** | `#0C0E11` |
| **RGB** | `rgb(12, 14, 17)` |
| **HSL** | `hsl(220, 17%, 6%)` |
| **Usage** | Page background, text on gold backgrounds (buttons, badges), deepest background layer |
| **Contrast of `#F0EFE9` on this** | ~15.8:1 ✅ WCAG AAA |
| **Notes** | The brand's defining background. The depth against which everything else is read. |

---

### Accent — Warm White

| Property | Value |
|----------|-------|
| **Token** | `--color-accent-warm-white` |
| **HEX** | `#F0EFE9` |
| **RGB** | `rgb(240, 239, 233)` |
| **HSL** | `hsl(50, 20%, 93%)` |
| **Usage** | Primary text, heading text, high-emphasis UI elements |
| **Contrast on `#0C0E11`** | ~15.8:1 ✅ WCAG AAA |
| **Notes** | Warm white instead of pure white reduces harshness on dark backgrounds. This is a deliberate brand decision — do not substitute `#FFFFFF` for body text. |

---

## Layer 2: UI Surface Colors

All surface colors are for the dark theme (Version 1.0). Light mode tokens to be added in Version 2.0.

---

### Background — Page Base

| Property | Value |
|----------|-------|
| **Token** | `--color-bg` |
| **HEX** | `#0C0E11` |
| **RGB** | `rgb(12, 14, 17)` |
| **HSL** | `hsl(220, 17%, 6%)` |
| **Usage** | Page background, hero sections, deepest layer of the UI |

---

### Surface — Primary

| Property | Value |
|----------|-------|
| **Token** | `--color-surface` |
| **HEX** | `#1B1E23` |
| **RGB** | `rgb(27, 30, 35)` |
| **HSL** | `hsl(220, 13%, 12%)` |
| **Usage** | Cards, content sections, form backgrounds, sidebar areas |

---

### Surface — Elevated

| Property | Value |
|----------|-------|
| **Token** | `--color-surface-elevated` |
| **HEX** | `#252930` |
| **RGB** | `rgb(37, 41, 48)` |
| **HSL** | `hsl(220, 13%, 17%)` |
| **Usage** | Modals, dropdowns, tooltips, popovers — elements that sit above primary surface |

---

### Surface — Muted

| Property | Value |
|----------|-------|
| **Token** | `--color-surface-muted` |
| **HEX** | `#121417` |
| **RGB** | `rgb(18, 20, 23)` |
| **HSL** | `hsl(220, 12%, 8%)` |
| **Usage** | Alternate section backgrounds (zebra-striping sections), nav background |

---

### Border — Default

| Property | Value |
|----------|-------|
| **Token** | `--color-border` |
| **RGB** | `rgba(255, 255, 255, 0.08)` |
| **Usage** | Default card borders, section dividers, table borders, input borders |
| **Notes** | Subtle. Should define without demanding attention. |

---

### Border — Strong

| Property | Value |
|----------|-------|
| **Token** | `--color-border-strong` |
| **RGB** | `rgba(255, 255, 255, 0.16)` |
| **Usage** | Emphasized borders on hover, focused input borders (non-brand), visible separators |

---

### Border — Brand

| Property | Value |
|----------|-------|
| **Token** | `--color-border-brand` |
| **RGB** | `rgba(212, 175, 55, 0.35)` |
| **Usage** | Card hover borders, selected state borders, brand-accented component borders |

---

## Layer 3: Text Colors

---

### Text — Primary

| Property | Value |
|----------|-------|
| **Token** | `--color-text` |
| **HEX** | `#F0EFE9` |
| **RGB** | `rgb(240, 239, 233)` |
| **Usage** | All primary body text, heading text (when not using pure white), labels |
| **Contrast on `--color-bg`** | ~15.8:1 ✅ AAA |
| **Contrast on `--color-surface`** | ~12.1:1 ✅ AAA |

---

### Text — Secondary

| Property | Value |
|----------|-------|
| **Token** | `--color-text-muted` |
| **RGB** | `rgba(240, 239, 233, 0.65)` |
| **Usage** | Supporting body text, card descriptions, secondary labels |
| **Contrast on `--color-bg`** | ~7.2:1 ✅ AA |
| **Contrast on `--color-surface`** | ~5.8:1 ✅ AA |

---

### Text — Tertiary

| Property | Value |
|----------|-------|
| **Token** | `--color-text-subtle` |
| **RGB** | `rgba(240, 239, 233, 0.45)` |
| **Usage** | Timestamps, metadata, placeholder text, inactive labels, captions |
| **Contrast on `--color-bg`** | ~3.8:1 ⚠️ AA Large only |
| **Notes** | **Use only for non-essential UI text at 18px+ or bold 14px+.** Do NOT use for body copy or important information. |

---

### Text — Inverse (on Gold)

| Property | Value |
|----------|-------|
| **Token** | `--color-text-inverse` |
| **HEX** | `#0C0E11` |
| **RGB** | `rgb(12, 14, 17)` |
| **Usage** | Text on gold/yellow backgrounds (primary buttons, gold badges, gold headers) |
| **Contrast on `#D4AF37`** | ~9.8:1 ✅ AAA |

---

### Text — Brand

| Property | Value |
|----------|-------|
| **Token** | `--color-text-brand` |
| **HEX** | `#D4AF37` |
| **Usage** | Gold emphasis text, hero heading accents (em elements), active nav links, inline brand references |
| **Contrast on `--color-bg`** | ~9.8:1 ✅ AAA |
| **Contrast on `--color-surface`** | ~7.2:1 ✅ AA |

---

### Text — Pure White (Display Only)

| Property | Value |
|----------|-------|
| **Token** | `--color-white` |
| **HEX** | `#FFFFFF` |
| **Usage** | Hero headings (display text at 40px+), high-emphasis single words only |
| **Notes** | Do NOT use `#FFFFFF` for body text. Use `--color-text` (`#F0EFE9`) for all body copy. Pure white is reserved for display impact. |

---

## Layer 4: Semantic Colors

---

### Success

| Property | Value |
|----------|-------|
| **Token** | `--color-success` |
| **HEX** | `#22C55E` |
| **RGB** | `rgb(34, 197, 94)` |
| **HSL** | `hsl(142, 69%, 45%)` |
| **Subtle token** | `--color-success-subtle` = `rgba(34, 197, 94, 0.12)` |
| **Usage** | Success states, confirmation messages, positive indicators, completion badges |
| **Contrast on `--color-bg`** | ~6.4:1 ✅ AA |

---

### Warning

| Property | Value |
|----------|-------|
| **Token** | `--color-warning` |
| **HEX** | `#F59E0B` |
| **RGB** | `rgb(245, 158, 11)` |
| **HSL** | `hsl(37, 92%, 50%)` |
| **Subtle token** | `--color-warning-subtle` = `rgba(245, 158, 11, 0.12)` |
| **Usage** | Warning states, caution notices, pending status |
| **Contrast on `--color-bg`** | ~8.3:1 ✅ AAA |

---

### Error

| Property | Value |
|----------|-------|
| **Token** | `--color-error` |
| **HEX** | `#DC2626` |
| **RGB** | `rgb(220, 38, 38)` |
| **HSL** | `hsl(0, 72%, 51%)` |
| **Subtle token** | `--color-error-subtle` = `rgba(220, 38, 38, 0.12)` |
| **Usage** | Error states, validation failures, destructive action warnings |
| **Contrast on `--color-bg`** | ~4.9:1 ✅ AA |
| **Notes** | Meets AA but not AAA. Use `--color-error` for text only with at least 14px bold or 18px regular. For error text on error-subtle backgrounds, verify contrast manually. |

---

### Info

| Property | Value |
|----------|-------|
| **Token** | `--color-info` |
| **HEX** | `#3B82F6` |
| **RGB** | `rgb(59, 130, 246)` |
| **HSL** | `hsl(217, 91%, 60%)` |
| **Subtle token** | `--color-info-subtle` = `rgba(59, 130, 246, 0.12)` |
| **Usage** | Informational notices, neutral status, helper messages, links in editorial contexts |
| **Contrast on `--color-bg`** | ~5.9:1 ✅ AA |

---

## CSS Implementation

```css
/* Paste into assets/css/tokens.css */

:root {
  /* === BRAND CORE === */
  --color-brand-gold:        #D4AF37;
  --color-brand-gold-dark:   #C9A84C;
  --color-brand-gold-subtle: rgba(212, 175, 55, 0.12);
  --color-brand-gold-glow:   rgba(212, 175, 55, 0.30);
  --color-brand-charcoal:    #0C0E11;

  /* === UI SURFACES === */
  --color-bg:                #0C0E11;
  --color-surface:           #1B1E23;
  --color-surface-elevated:  #252930;
  --color-surface-muted:     #121417;
  --color-border:            rgba(255, 255, 255, 0.08);
  --color-border-strong:     rgba(255, 255, 255, 0.16);
  --color-border-brand:      rgba(212, 175, 55, 0.35);

  /* === TEXT === */
  --color-text:              #F0EFE9;
  --color-text-muted:        rgba(240, 239, 233, 0.65);
  --color-text-subtle:       rgba(240, 239, 233, 0.45);
  --color-text-inverse:      #0C0E11;
  --color-text-brand:        #D4AF37;
  --color-white:             #FFFFFF;

  /* === SEMANTIC === */
  --color-success:           #22C55E;
  --color-success-subtle:    rgba(34, 197, 94, 0.12);
  --color-warning:           #F59E0B;
  --color-warning-subtle:    rgba(245, 158, 11, 0.12);
  --color-error:             #DC2626;
  --color-error-subtle:      rgba(220, 38, 38, 0.12);
  --color-info:              #3B82F6;
  --color-info-subtle:       rgba(59, 130, 246, 0.12);
}
```

---

## Contrast Quick Reference

| Foreground | Background | Ratio | WCAG |
|------------|-----------|-------|------|
| `#F0EFE9` | `#0C0E11` | ~15.8:1 | ✅ AAA |
| `#F0EFE9` | `#1B1E23` | ~12.1:1 | ✅ AAA |
| `rgba(240,239,233,0.65)` | `#1B1E23` | ~5.8:1 | ✅ AA |
| `rgba(240,239,233,0.45)` | `#0C0E11` | ~3.8:1 | ⚠️ AA Large only |
| `#D4AF37` | `#0C0E11` | ~9.8:1 | ✅ AAA |
| `#D4AF37` | `#1B1E23` | ~7.2:1 | ✅ AA |
| `#0C0E11` | `#D4AF37` | ~9.8:1 | ✅ AAA |
| `#22C55E` | `#0C0E11` | ~6.4:1 | ✅ AA |
| `#F59E0B` | `#0C0E11` | ~8.3:1 | ✅ AAA |
| `#DC2626` | `#0C0E11` | ~4.9:1 | ✅ AA |
| `#3B82F6` | `#0C0E11` | ~5.9:1 | ✅ AA |

*Ratios are approximate. Verify critical combinations with the WebAIM Contrast Checker before production.*

---

## Rules

1. Every color in any RCS design or implementation must reference a token from this document.
2. No raw hex values are permitted in CSS files, component code, or design tools.
3. Any new color must be proposed, justified, and documented here before use.
4. Semantic colors are for status and feedback only — never for decorative use.
5. `--color-text-subtle` is restricted to non-essential UI text at 18px+ regular or 14px+ bold.
6. Gold (`--color-brand-gold`) must never be used as a large background field — only as accent, text, borders, or small UI elements.

---

## Future Notes

Light mode tokens will be added in Version 2.0 of this document. When added, they will mirror this token structure with a `[data-theme="light"]` or `.light` override block. The token names will remain identical — only the values change. This is the primary reason all implementations must use token references, not hardcoded values.

---

## Related Documents

- [AccessibilitySystem.md](AccessibilitySystem.md)
- [DesignLanguage.md](DesignLanguage.md)
- [Brand Bible — BrandPersonality.md](../brand/BrandPersonality.md)
- [Design System — ColorTokens.md](../design-system/ColorTokens.md)

---

*Roman Creative Studio Visual Identity System | Phase 2B | Version 1.0*
