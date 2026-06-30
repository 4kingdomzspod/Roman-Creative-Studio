# Spacing

## Spacing Scale

All spacing values are defined as CSS custom properties. The scale is based on a 4px base unit.

| Token | Value | Use |
|-------|-------|-----|
| `--space-1` | `0.25rem` / 4px | Micro gaps (icon to label) |
| `--space-2` | `0.5rem` / 8px | Tight spacing (tag padding) |
| `--space-3` | `0.75rem` / 12px | Small component padding |
| `--space-4` | `1rem` / 16px | Standard component spacing |
| `--space-5` | `1.25rem` / 20px | Card internal spacing |
| `--space-6` | `1.5rem` / 24px | Section element spacing |
| `--space-8` | `2rem` / 32px | Component gaps |
| `--space-10` | `2.5rem` / 40px | Section padding (mobile) |
| `--space-12` | `3rem` / 48px | Large component gaps |
| `--space-16` | `4rem` / 64px | Section padding (tablet) |
| `--space-20` | `5rem` / 80px | Section padding (desktop) |
| `--space-24` | `6rem` / 96px | Large section spacing |
| `--space-32` | `8rem` / 128px | Hero section padding |

---

## Section Spacing

All content sections use consistent vertical rhythm:

```css
section {
  padding: var(--space-20) 0;   /* 80px desktop */
}

@media (max-width: 768px) {
  section {
    padding: var(--space-12) 0; /* 48px mobile */
  }
}
```

---

## Container Widths

| Context | Max Width |
|---------|----------|
| Default container | `1200px` |
| Narrow (text-heavy) | `800px` |
| Wide (full-bleed cards) | `1400px` |

Containers always have horizontal padding: `var(--space-6)` (24px) minimum.

---

## Grid Gaps

| Grid Type | Gap |
|-----------|-----|
| Feature / service cards | `var(--space-6)` to `var(--space-8)` |
| Portfolio grid | `var(--space-6)` |
| Testimonials | `var(--space-6)` |
| FAQ items | `var(--space-4)` |

---

## Spacing Philosophy

**Generous whitespace is a brand attribute.** Premium agencies don't cram content. Space communicates confidence and quality.

- When in doubt, add more space between sections
- Body content should never touch the container edge (always have padding)
- Headlines need breathing room above and below — never stack headings with zero margin
