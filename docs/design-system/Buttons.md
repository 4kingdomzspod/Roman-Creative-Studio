# Buttons

## Button Philosophy

Every button should drive a single, clear action. Button hierarchy communicates importance — primary for the main CTA, secondary for supporting actions, ghost for low-emphasis actions.

---

## Button Variants

### Primary Button (Gold)
The main call-to-action. Used once per section (never two primary buttons side by side).

```html
<a href="/contact" class="btn btn-primary">Start Your Project</a>
```

```css
.btn-primary {
  background: var(--color-brand);    /* #D4AF37 */
  color: #0C0E11;                    /* dark text on gold */
  font-weight: var(--weight-semibold);
  padding: var(--space-3) var(--space-8);
  border-radius: var(--radius-full);
  border: 2px solid transparent;
  transition: all var(--transition-fast);
}

.btn-primary:hover {
  background: var(--color-brand-muted);
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(212,175,55,0.35);
}
```

### Secondary Button (Outlined)
Supporting action alongside a primary button.

```html
<a href="/portfolio" class="btn btn-secondary">View Our Work</a>
```

```css
.btn-secondary {
  background: transparent;
  color: var(--color-text);
  border: 2px solid rgba(240,239,233,0.25);
  padding: var(--space-3) var(--space-8);
  border-radius: var(--radius-full);
}

.btn-secondary:hover {
  border-color: rgba(212,175,55,0.60);
  color: var(--color-brand);
}
```

### Ghost Button (Text-Only Style)
Low-emphasis action, typically "Learn more" or navigation.

```css
.btn-ghost {
  background: transparent;
  color: var(--color-brand);
  border: none;
  padding: var(--space-2) var(--space-4);
  font-weight: var(--weight-medium);
}
```

---

## Button Sizes

| Size | Padding | Font Size | Use |
|------|---------|-----------|-----|
| Small | `8px 20px` | `--text-sm` | Inline CTAs, tags |
| Default | `12px 32px` | `--text-base` | Most CTAs |
| Large | `16px 40px` | `--text-lg` | Hero section CTAs |

---

## CTA Copy Guidelines

| Use | Avoid |
|-----|-------|
| "Start Your Project" | "Submit" |
| "Book a Free Call" | "Click Here" |
| "View Our Work" | "Learn More" (generic) |
| "Get Your Free Audit" | "Get Started" (vague) |

CTA copy should always describe the specific action and the benefit. Generic labels reduce click-through.

---

## Accessibility

- All buttons and links must have visible focus states
- `<a>` tags used as buttons must have descriptive `href` values or `aria-label`
- Do not use `<div>` or `<span>` as buttons — use `<button>` or `<a>`
- Disabled buttons should have `aria-disabled="true"` and reduced opacity (not `pointer-events: none` alone)
- Minimum tap target: 44px × 44px (mobile)

---

## Never Do

- Two primary (gold) buttons in the same row or section
- Buttons without visible hover/focus state
- CTA text that says "Submit", "Click Here", or "Go"
- Using `onClick` JavaScript navigation instead of proper `<a href>`
