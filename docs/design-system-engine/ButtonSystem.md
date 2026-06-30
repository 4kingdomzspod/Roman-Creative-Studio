# Button System
**Roman Creative Studio — Design System Engine**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

The button is the primary trigger for all user actions. Every clickable action in the RCS system — form submissions, navigation prompts, CTAs, destructive actions — uses a variant of this button system. No one-off button styles are created.

---

## Button Variants

### Variant Hierarchy

| Variant | Class | Use Case | Max Per Section |
|---------|-------|----------|-----------------|
| **Primary** | `.btn--primary` | The single most important action | 1 |
| **Secondary** | `.btn--secondary` | Supporting action alongside primary | 2 |
| **Tertiary** | `.btn--tertiary` | Low-emphasis text action | No limit |
| **Ghost** | `.btn--ghost` | Transparent with border, neutral emphasis | No limit |
| **Destructive** | `.btn--destructive` | Delete, remove, irreversible actions | 1 |
| **Icon Only** | `.btn--icon` | Compact icon trigger, no label | No limit |

**Rule:** Never place two Primary buttons in the same visual section. One primary action per section, always.

---

## Size System

| Size | Class | Height | Padding (V × H) | Font Size | Icon Size |
|------|-------|--------|------------------|-----------|----------|
| Small | `.btn--sm` | 36px | 8px × 14px | `--text-xs` (12px) | 16px |
| Medium | `.btn--md` | 44px | 10px × 20px | `--text-sm` (14px) | 16px |
| Large | `.btn--lg` | 52px | 14px × 28px | `--text-base` (16px) | 20px |
| XLarge | `.btn--xl` | 60px | 16px × 32px | `--text-lg` (18px) | 20px |

**Default size:** `.btn--md` unless context requires otherwise.
**Mobile default:** `.btn--lg` on mobile for touch target compliance (minimum 44px).

---

## Complete CSS Implementation

```css
/* ============================================================
   BASE BUTTON
============================================================ */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-weight: var(--weight-semibold);
  font-size: var(--text-sm);
  line-height: 1;
  letter-spacing: var(--tracking-wide);
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  padding: 10px var(--space-5);
  min-height: 44px;
  position: relative;
  overflow: hidden;
  transition:
    background-color var(--duration-fast) var(--ease-out),
    border-color     var(--duration-fast) var(--ease-out),
    color            var(--duration-fast) var(--ease-out),
    box-shadow       var(--duration-fast) var(--ease-out),
    transform        var(--duration-fast) var(--ease-out),
    opacity          var(--duration-fast) var(--ease-out);
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.btn:hover  { transform: translateY(-1px); }
.btn:active { transform: translateY(0);    transition-duration: 50ms; }

/* ============================================================
   VARIANTS
============================================================ */

/* Primary — Gold fill */
.btn--primary {
  background-color: var(--color-brand-gold);
  border-color:     var(--color-brand-gold);
  color:            var(--color-bg);
}
.btn--primary:hover {
  background-color: var(--color-brand-gold-dark);
  border-color:     var(--color-brand-gold-dark);
  box-shadow:       var(--shadow-brand-md);
}
.btn--primary:focus-visible {
  outline: 2px solid var(--color-brand-gold);
  outline-offset: 3px;
  box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.20);
}
.btn--primary:active {
  background-color: var(--color-brand-gold-dark);
  box-shadow: none;
}

/* Secondary — Gold outline */
.btn--secondary {
  background-color: transparent;
  border-color:     var(--color-brand-gold);
  color:            var(--color-brand-gold);
}
.btn--secondary:hover {
  background-color: var(--color-brand-gold-subtle);
  box-shadow:       var(--shadow-brand-sm);
}
.btn--secondary:focus-visible {
  outline: 2px solid var(--color-brand-gold);
  outline-offset: 3px;
}

/* Tertiary — Text only, no border */
.btn--tertiary {
  background-color: transparent;
  border-color:     transparent;
  color:            var(--color-brand-gold);
  padding-inline:   var(--space-2);
}
.btn--tertiary:hover {
  background-color: var(--color-brand-gold-subtle);
  border-color:     transparent;
}
.btn--tertiary:focus-visible {
  outline: 2px solid var(--color-brand-gold);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}

/* Ghost — Neutral outline */
.btn--ghost {
  background-color: transparent;
  border-color:     var(--color-border-strong);
  color:            var(--color-text);
}
.btn--ghost:hover {
  background-color: var(--color-surface-elevated);
  border-color:     var(--color-border-strong);
}
.btn--ghost:focus-visible {
  outline: 2px solid var(--color-brand-gold);
  outline-offset: 3px;
}

/* Destructive — Error-toned */
.btn--destructive {
  background-color: var(--color-error);
  border-color:     var(--color-error);
  color:            var(--color-white);
}
.btn--destructive:hover {
  background-color: #b91c1c;
  border-color:     #b91c1c;
  box-shadow:       0 4px 12px rgba(220, 38, 38, 0.30);
}
.btn--destructive:focus-visible {
  outline: 2px solid var(--color-error);
  outline-offset: 3px;
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.20);
}

/* ============================================================
   SIZES
============================================================ */
.btn--sm {
  font-size: var(--text-xs);
  padding: var(--space-2) 14px;
  min-height: 36px;
  gap: var(--space-1);
}
.btn--md { /* default — already defined in .btn */ }
.btn--lg {
  font-size: var(--text-base);
  padding: 14px var(--space-7);
  min-height: 52px;
}
.btn--xl {
  font-size: var(--text-lg);
  padding: var(--space-4) var(--space-8);
  min-height: 60px;
}

/* Full width modifier */
.btn--full { width: 100%; }

/* ============================================================
   ICON SUPPORT
============================================================ */
.btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  stroke-width: 1.5;
}

.btn--lg svg, .btn--xl svg {
  width: 20px;
  height: 20px;
}

/* Icon-only button */
.btn--icon {
  padding: var(--space-2);
  min-width: 44px;
  width: 44px;
  height: 44px;
}
.btn--icon.btn--sm {
  min-width: 36px;
  width: 36px;
  height: 36px;
  padding: var(--space-1);
}

/* ============================================================
   LOADING STATE
============================================================ */
.btn--loading {
  color: transparent;
  pointer-events: none;
  cursor: not-allowed;
}

.btn--loading::after {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: var(--radius-full);
  animation: btn-spin 600ms linear infinite;
  color: var(--color-bg); /* for primary button spinner */
}

.btn--secondary.btn--loading::after,
.btn--ghost.btn--loading::after {
  color: var(--color-brand-gold);
}

@keyframes btn-spin {
  to { transform: rotate(360deg); }
}

/* ============================================================
   DISABLED STATE
============================================================ */
.btn:disabled,
.btn[aria-disabled="true"] {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
  transform: none;
  box-shadow: none;
}

/* ============================================================
   REDUCED MOTION
============================================================ */
@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }
  .btn:hover  { transform: none; }
  .btn:active { transform: none; }
  .btn--loading::after {
    animation: none;
    border-top-color: currentColor;
    opacity: 0.5;
  }
}
```

---

## HTML Patterns

```html
<!-- Primary CTA -->
<a href="/book" class="btn btn--primary btn--lg">
  Book a Free Discovery Call
</a>

<!-- Secondary with leading icon -->
<a href="/work" class="btn btn--secondary btn--md">
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18" />
  </svg>
  View Our Work
</a>

<!-- Tertiary text link -->
<button type="button" class="btn btn--tertiary btn--sm">
  Learn more
  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
</button>

<!-- Loading state (JS adds class) -->
<button type="submit" class="btn btn--primary btn--md btn--loading" aria-busy="true" aria-label="Submitting...">
  Submit
</button>

<!-- Disabled -->
<button type="button" class="btn btn--primary btn--md" disabled aria-disabled="true">
  Unavailable
</button>

<!-- Destructive with confirmation pattern -->
<button
  type="button"
  class="btn btn--destructive btn--sm"
  aria-label="Delete project permanently"
  data-confirm="Are you sure? This cannot be undone."
>
  <svg aria-hidden="true"><!-- trash icon --></svg>
  Delete Project
</button>

<!-- Icon-only button -->
<button
  type="button"
  class="btn btn--ghost btn--icon"
  aria-label="Close menu"
>
  <svg aria-hidden="true"><!-- X icon --></svg>
</button>
```

---

## States Reference

| State | Visual Change | CSS Class / Attribute |
|-------|--------------|----------------------|
| Default | Defined per variant | base `.btn--[variant]` |
| Hover | Subtle background shift, -1px lift | `:hover` |
| Focus | Gold outline 2px, 3px offset | `:focus-visible` |
| Active | Returns to 0 position, box-shadow removed | `:active` |
| Loading | Content hidden, spinner visible, pointer-events off | `.btn--loading` + `aria-busy="true"` |
| Disabled | 45% opacity, no pointer events | `:disabled` or `aria-disabled="true"` |

---

## Accessibility Requirements

| Requirement | Implementation |
|------------|----------------|
| Keyboard activation | `<button>` activates on `Enter` and `Space` natively |
| `<a>` as button | Only when navigating to a URL. Add `role="button"` if used as trigger |
| Loading state | Add `aria-busy="true"` + `aria-label="[action] in progress"` |
| Disabled state | Use `disabled` attribute (not just class) or `aria-disabled="true"` |
| Icon-only | Must have `aria-label` on button. Icon has `aria-hidden="true"` |
| Color contrast | Primary: charcoal on gold ~7.9:1 ✅ AAA. All variants verified. |
| Touch target | Minimum `min-height: 44px` on all sizes except `--sm` (acceptable at 36px in non-primary use) |

---

## Anti-Patterns

```html
<!-- ❌ Never create a one-off button class -->
<button class="homepage-cta-button">...</button>

<!-- ❌ Never use a div or span as a button -->
<div class="btn btn--primary" onclick="...">Click me</div>

<!-- ❌ Never place two primary buttons in one section -->
<section>
  <button class="btn btn--primary">Book a Call</button>
  <button class="btn btn--primary">Get a Quote</button>  <!-- ❌ -->
</section>

<!-- ❌ Never use vague button labels -->
<button class="btn btn--primary">Click Here</button>
<button class="btn btn--primary">Submit</button>
<button class="btn btn--primary">Go</button>

<!-- ❌ Never remove focus ring without replacement -->
<style>.btn:focus { outline: none; }</style>  <!-- ❌ accessibility violation -->
```

---

## Related Documents
- `docs/visual-identity/ColorSystem.md` — Color token reference
- `docs/visual-identity/MotionSystem.md` — Transition token reference
- `docs/design-system-engine/AccessibilitySystem.md` — Focus state standards
- `docs/design-system-engine/FormSystem.md` — Button use within forms
