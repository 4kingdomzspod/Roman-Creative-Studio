# Accessibility Rules

## Standard

Roman Creative Studio targets **WCAG 2.1 Level AA** compliance for all web properties — both our own site and client work.

This is not optional. Accessibility is:
- A legal requirement in many jurisdictions
- A signal of quality and professionalism
- A requirement for good SEO (many accessibility improvements are also SEO improvements)
- The right thing to do

---

## Color Contrast

| Requirement | Minimum Ratio | Our Standard |
|-------------|--------------|-------------|
| Normal text (< 18pt) | 4.5:1 | Aim for 7:1+ |
| Large text (18pt+ or 14pt bold) | 3:1 | Aim for 4.5:1+ |
| UI components / states | 3:1 | Aim for 4.5:1 |

Verify contrast with: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## Focus States

All interactive elements must show a visible focus indicator:

```css
:focus-visible {
  outline: 2px solid #D4AF37;
  outline-offset: 3px;
  border-radius: 3px;
}
```

Do **not** use `outline: none` without providing a custom focus indicator.

---

## Images

- **Informative images:** `alt` describes what the image communicates, not what it looks like
  - ✅ `alt="Roman Creative Studio dentist website design on laptop and mobile"`
  - ❌ `alt="image" ` or `alt="photo"`
- **Decorative images:** `alt=""` (empty, not omitted)
- **Logo:** `alt="Roman Creative Studio logo"`
- **Team photo:** `alt="Alexander [last name], Founder of Roman Creative Studio"`

---

## Headings

- One `<h1>` per page — always
- Headings must be in logical order: `h1` → `h2` → `h3` (no skipping levels)
- Do not use headings for styling — use CSS classes instead
- Navigation labels, badges, and hero sub-labels should be `<p>` or `<span>`, not headings

---

## Semantic HTML

| Use | Instead of |
|-----|----------|
| `<nav>` | `<div class="nav">` |
| `<main>` | `<div class="main">` |
| `<section>` with label | `<div class="section">` |
| `<button>` | `<div onclick>` |
| `<a href>` | `<div onclick>` for navigation |
| `<ul>/<li>` for lists | `<div>` wrapped items |

---

## Forms

See [Forms.md](Forms.md) for full form accessibility requirements.

Key requirements:
- All inputs labeled via `<label for>` — never placeholder-only
- Error messages connected to inputs via `aria-describedby`
- Required fields marked with `aria-required="true"`

---

## ARIA

Use ARIA only when semantic HTML is insufficient:

| Attribute | Use |
|-----------|-----|
| `aria-label` | When text label isn't visible (icon buttons) |
| `aria-labelledby` | When label is a separate visible element |
| `aria-describedby` | Error messages, hints |
| `aria-expanded` | Accordion, mobile nav, dropdowns |
| `aria-current="page"` | Active nav link |
| `aria-hidden="true"` | Decorative icons |
| `role="alert"` | Form error announcements |

**Never use ARIA to override semantic HTML** — fix the HTML instead.

---

## Skip Navigation

Add this as the first element inside `<body>` on all pages:

```html
<a href="#main-content" class="skip-nav">Skip to main content</a>
```

```css
.skip-nav {
  position: absolute;
  top: -100%;
  left: 0;
  background: #D4AF37;
  color: #0C0E11;
  padding: var(--space-3) var(--space-6);
  font-weight: var(--weight-semibold);
  z-index: 9999;
  transition: top 0.1s;
}

.skip-nav:focus {
  top: 0;
}
```

---

## Testing Checklist

- [ ] Navigate entire page with keyboard only (Tab, Shift+Tab, Enter, Space, Arrow keys)
- [ ] Run Chrome Lighthouse accessibility audit (target 90+)
- [ ] Test with browser zoom at 200% — content should not break or overflow
- [ ] Verify all images have appropriate `alt` text
- [ ] Check heading structure is logical (use HeadingsMap browser extension)
- [ ] Test form submission with keyboard only
- [ ] Verify focus indicator is visible on all interactive elements
