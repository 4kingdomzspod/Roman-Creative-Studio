# Typography

## Type Scale

All type sizes are defined as CSS custom properties in `tokens.css`.

| Token | Value | Use |
|-------|-------|-----|
| `--text-xs` | `0.75rem` / 12px | Labels, captions, badges |
| `--text-sm` | `0.875rem` / 14px | Small body text, helper text |
| `--text-base` | `1rem` / 16px | Body text default |
| `--text-lg` | `1.125rem` / 18px | Lead text, nav brand name |
| `--text-xl` | `1.25rem` / 20px | Card headings, sub-section titles |
| `--text-2xl` | `1.5rem` / 24px | Section subheadings |
| `--text-3xl` | `1.875rem` / 30px | Section headings |
| `--text-4xl` | `2.25rem` / 36px | Page headings |
| `--text-5xl` | `3rem` / 48px | Hero subheadings |
| `--text-6xl` | `3.75rem` / 60px | Hero headings (desktop) |

---

## Font Weights

| Token | Value | Use |
|-------|-------|-----|
| `--weight-normal` | `400` | Body text |
| `--weight-medium` | `500` | Emphasized body, labels |
| `--weight-semibold` | `600` | Card headings, nav items |
| `--weight-bold` | `700` | Section headings |
| `--weight-extrabold` | `800` | Hero headings |

---

## Line Heights

| Token | Value | Use |
|-------|-------|-----|
| `--leading-tight` | `1.2` | Large display headings |
| `--leading-snug` | `1.375` | Section headings |
| `--leading-normal` | `1.5` | Body text (default) |
| `--leading-relaxed` | `1.625` | Long-form content |

---

## Type Hierarchy in Practice

### Hero Heading
```css
font-size: var(--text-6xl);   /* 60px desktop */
font-weight: var(--weight-extrabold);
line-height: var(--leading-tight);
color: #ffffff;
```
At mobile (`< 768px`): reduce to `var(--text-4xl)` or `var(--text-5xl)`.

### Hero Emphasis (gold)
```css
color: #D4AF37;
font-style: italic;
```

### Section Heading
```css
font-size: var(--text-3xl);
font-weight: var(--weight-bold);
color: var(--color-text);
```

### Body Text
```css
font-size: var(--text-base);
font-weight: var(--weight-normal);
line-height: var(--leading-normal);
color: var(--color-text-muted);
```

### Navigation Brand Name
```css
font-size: var(--text-lg);  /* recently updated from --text-base */
font-weight: var(--weight-semibold);
color: var(--color-text);
```

---

## Accessibility

- Minimum body text size: `16px` (`--text-base`) — never set body text below this
- Do not use `font-size` values in `px` directly — use rem-based tokens so user font preferences are respected
- Line length: aim for 60–75 characters per line for body text
- Do not use `letter-spacing` on body text (reduces readability)

---

## Responsive Behavior

All heading sizes should scale down on mobile using CSS clamp or media query overrides:

```css
@media (max-width: 768px) {
  .hero-heading {
    font-size: var(--text-4xl);
  }
}
```

Ensure all text remains legible and properly spaced at 375px viewport width.
