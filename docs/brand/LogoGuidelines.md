# Logo Guidelines

## The Roman Creative Studio Logo

### Primary Logo Asset
- **File:** `assets/images/image-1782772947464.jpg`
- **Usage:** Navigation (all pages), footer (all pages), proposals, presentations

---

## Logo in Navigation

### Current Implementation
The logo is displayed as a **72px × 72px square** with rounded corners.

```css
.nav-brand-mark {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-xl);
  background: #080A0D;
  border: 2px solid rgba(212,175,55,0.75);
  box-shadow: 0 0 18px rgba(212,175,55,0.30), 0 2px 10px rgba(0,0,0,0.50);
  overflow: hidden;
}

.nav-brand-mark img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

### Hover State
Border intensifies to full gold opacity; glow expands.

```css
.nav-brand:hover .nav-brand-mark {
  border-color: rgba(212,175,55,1);
  box-shadow: 0 0 28px rgba(212,175,55,0.50), 0 2px 12px rgba(0,0,0,0.60);
}
```

---

## Brand Colors (Logo Context)

| Color | Hex | Use |
|-------|-----|-----|
| Gold | `#D4AF37` | Logo border, accent glow |
| Dark Gold | `#C9A84C` | Secondary gold contexts |
| Deep Dark | `#080A0D` | Logo background container |

---

## Clear Space

Always maintain clear space equal to the logo's border-radius around the logo mark. No text, icons, or graphics should intrude into this space.

---

## What Not to Do

- Do not stretch or distort the logo
- Do not place the logo on a light background without adjusting the container
- Do not remove the gold border in digital contexts — it is a deliberate brand element
- Do not reduce the logo below 48px in any digital context
- Do not apply filters or color overlays to the logo image

---

## Future Needs

- **SVG logo version** — for scalability and vector export (proposals, print)
- **Horizontal lockup** — logo + wordmark side by side at small nav heights
- **Favicon** — properly sized `.ico` / `.png` versions for browser tab
- **Social profile version** — square crop optimized for circle display (Instagram, LinkedIn)
- **White/reversed version** — for use on gold or dark backgrounds in print
- **Dark mode variant** — already handled by current dark container approach
