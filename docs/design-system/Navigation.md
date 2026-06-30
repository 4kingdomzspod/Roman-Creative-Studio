# Navigation

## Overview

The navigation is the most critical UI component on the site — it appears on every page, provides wayfinding, and is the primary vehicle for brand identity.

---

## Structure

```html
<nav class="nav">
  <div class="nav-inner">
    <a class="nav-brand" href="/">
      <div class="nav-brand-mark">
        <img src="/assets/images/image-1782772947464.jpg" alt="Roman Creative Studio logo" />
      </div>
      <div class="nav-brand-text">
        <span class="nav-brand-name">Roman Creative Studio</span>
        <span class="nav-brand-tagline">Digital Agency</span>
      </div>
    </a>
    <ul class="nav-links"><!-- links --></ul>
    <div class="nav-cta"><!-- CTA button --></div>
    <button class="nav-toggle"><!-- mobile hamburger --></button>
  </div>
</nav>
```

---

## Key Measurements

| Element | Value |
|---------|-------|
| Logo mark size | `72px × 72px` |
| Logo border | `2px solid rgba(212,175,55,0.75)` |
| Logo glow (box-shadow) | `0 0 18px rgba(212,175,55,0.30)` |
| Logo border-radius | `var(--radius-xl)` |
| Brand name font-size | `var(--text-lg)` |
| Nav background | `rgba(12,14,17,0.95)` with backdrop blur |
| Nav height | Approximately 80–90px |

---

## Scroll Behavior

- Nav starts transparent or with minimal background at top of page
- On scroll past ~80px: background darkens and blur applies (`nav--scrolled` class added via JS)
- Transition: smooth `0.3s` ease

---

## Mobile Behavior

- At `< 768px`: links collapse, hamburger menu appears
- Tapping hamburger opens full-width dropdown or overlay menu
- Mobile menu should close on: link tap, outside click, ESC key
- Mobile CTA button appears in the open menu

---

## Active State

The current page's nav link should have an active indicator:
```css
.nav-link.active {
  color: var(--color-brand);
}
```

Implement via `aria-current="page"` on the active link.

---

## Accessibility

- `<nav>` must have `aria-label="Main navigation"`
- Mobile toggle button: `aria-expanded="false/true"` and `aria-controls="nav-menu"`
- Mobile menu: `id="nav-menu"` matching the `aria-controls` value
- Skip navigation link at very top of `<body>` for keyboard users:

```html
<a href="#main-content" class="skip-nav">Skip to main content</a>
```

---

## Logo Hover State

```css
.nav-brand:hover .nav-brand-mark {
  border-color: rgba(212,175,55,1);
  box-shadow: 0 0 28px rgba(212,175,55,0.50), 0 2px 12px rgba(0,0,0,0.60);
}
```

Transition: `border-color` and `box-shadow` on `var(--transition-fast)`.
