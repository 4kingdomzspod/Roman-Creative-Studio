# Color Tokens

## Brand Color Palette

### Dark Theme Backgrounds
| Token | Value | Use |
|-------|-------|-----|
| `--color-bg` | `#0C0E11` | Page background (deepest) |
| `--color-surface` | `#1B1E23` | Card and section backgrounds |
| `--color-surface-muted` | `#121417` | Alternate section backgrounds |
| `--color-border` | `rgba(255,255,255,0.08)` | Subtle borders between elements |
| `--color-border-strong` | `rgba(255,255,255,0.16)` | More visible borders |

### Text Colors
| Token | Value | Use |
|-------|-------|-----|
| `--color-text` | `#F0EFE9` | Primary body text (warm white) |
| `--color-text-muted` | `rgba(240,239,233,0.65)` | Secondary / supporting text |
| `--color-text-subtle` | `rgba(240,239,233,0.45)` | Placeholder, captions, metadata |
| `--color-white` | `#FFFFFF` | Pure white (hero headings, special cases) |

### Brand / Gold
| Token | Value | Use |
|-------|-------|-----|
| `--color-brand` | `#D4AF37` | Primary gold — CTAs, accents, logo border |
| `--color-brand-muted` | `#C9A84C` | Secondary gold — hover states, secondary accents |
| `--color-brand-subtle` | `rgba(212,175,55,0.10)` | Icon containers, tinted backgrounds |
| `--color-brand-glow` | `rgba(212,175,55,0.30)` | Box shadows, glow effects |

### Semantic Colors
| Token | Value | Use |
|-------|-------|-----|
| `--color-success` | `#22C55E` | Success states, positive indicators |
| `--color-error` | `#DC2626` | Error states, destructive actions |
| `--color-warning` | `#F59E0B` | Warning states |
| `--color-info` | `#3B82F6` | Informational states |

---

## Hardcoded Values (Service Pages)

Service pages (`services/dentist-websites.html`, `services/church-websites.html`) currently use hardcoded hex values instead of token references. These are the canonical values:

| Context | Hardcoded Value | Should Become |
|---------|----------------|---------------|
| Page background | `#0C0E11` | `var(--color-bg)` |
| Section background | `#1B1E23` | `var(--color-surface)` |
| Muted section | `#121417` | `var(--color-surface-muted)` |
| Primary text | `#F0EFE9` | `var(--color-text)` |
| Muted text | `rgba(240,239,233,0.65)` | `var(--color-text-muted)` |
| Gold | `#D4AF37` | `var(--color-brand)` |

Migrating these to token references is a medium-priority task.

---

## Accessibility

### Contrast Ratios (Dark Theme)

| Foreground | Background | Ratio | WCAG |
|------------|-----------|-------|------|
| `#F0EFE9` on `#0C0E11` | — | ~14:1 | ✅ AAA |
| `rgba(240,239,233,0.65)` on `#1B1E23` | — | ~7:1 | ✅ AA |
| `#D4AF37` on `#0C0E11` | — | ~8:1 | ✅ AA |
| `#D4AF37` on `#1B1E23` | — | ~6:1 | ✅ AA |

> **Note:** Muted text (`rgba(240,239,233,0.45)`) on dark backgrounds should only be used for non-essential UI elements (metadata, captions) — not body copy.

---

## Do Not Use

- Old token names: `--navy-950`, `--neutral-50`, `--brand-600`, `--neutral-600` — these are undefined
- Pure black `#000000` as a background — use `#0C0E11`
- Pure white `#FFFFFF` for body text — use `#F0EFE9`
- Bright colors as backgrounds (`red`, `blue`, `green`) — use semantic tokens or tinted versions
