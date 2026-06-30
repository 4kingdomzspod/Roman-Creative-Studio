# Icon Guidelines

## Icon Philosophy

Icons at Roman Creative Studio serve one purpose: **to reinforce meaning, not to decorate**. Every icon should make content faster to understand. If an icon doesn't help, it shouldn't be there.

---

## Icon Style

### Stroke Style
- **Line icons** (outline/stroke) preferred over filled icons for consistency with the dark theme
- Stroke width: **1.5px** as the standard; **2px** for larger icon contexts
- Corner style: **rounded** to match the brand's use of border-radius
- Style source: Heroicons, Feather Icons, Lucide — all use consistent stroke-based geometry

### Size Scale
| Context | Size |
|---------|------|
| Inline with text | 16–20px |
| Card / feature icons | 24–32px |
| Section / emphasis icons | 40–48px |
| Hero / display icons | 56–64px |

---

## Icon Colors

| Context | Color |
|---------|-------|
| Default / neutral | `rgba(240,239,233,0.65)` (muted warm white) |
| Brand accent | `#D4AF37` (gold) |
| On gold background | `#0C0E11` (charcoal) |
| Disabled / inactive | `rgba(240,239,233,0.30)` |

---

## Icon Containers

When icons appear in cards or feature blocks, they often use a container:

```css
.icon-container {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: rgba(212,175,55,0.10);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #D4AF37;
}
```

Do **not** use bright colored icon containers (red, blue, green backgrounds) — they conflict with the dark brand palette.

---

## SVG Implementation

All icons should be implemented as inline SVGs or via a consistent icon library reference — not as `<img>` tags (which prevent color control via CSS).

```html
<!-- Preferred: inline SVG -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <!-- icon paths -->
</svg>
```

Using `stroke="currentColor"` allows icon color to be controlled by the parent element's `color` property.

---

## Accessibility

- Decorative icons: `aria-hidden="true"` (most icons fall here)
- Functional icons (standalone clickable): include `aria-label` on the parent button/link
- Never rely on an icon alone to communicate critical information — always pair with text

---

## What to Avoid

- Mixing icon styles (outline + filled in the same section)
- Emoji as UI icons
- Low-resolution icon images (always use SVG)
- Icons sized inconsistently within the same component
- Icon-only CTAs without accessible labels
