# Icon System

**Roman Creative Studio Visual Identity System — Phase 2B**
*Version 1.0 | Last Updated: June 2026*

---

## Purpose of This Document

Icons are a communication layer — not decoration. This document defines the single, unified icon language for Roman Creative Studio: which library, which style rules, sizing, color, spacing, accessibility, and how icons integrate into components.

Using one icon family, consistently applied, is what separates a designed system from a collection of downloaded assets.

---

## Icon Family: Heroicons

**Library:** Heroicons (by the Tailwind CSS team)  
**Style:** Outline (stroke-based)  
**Source:** [heroicons.com](https://heroicons.com)

**Why Heroicons:**
- Consistently designed for the exact stroke style the RCS system requires
- Available as inline SVG (full CSS color control via `currentColor`)
- Open source, no licensing concerns
- Excellent breadth of UI and business icons
- Actively maintained

---

## System Rules

### Rule 1: One Family Only
Heroicons (outline style) is the only sanctioned icon set. Do not mix with Font Awesome, Material Icons, Feather Icons, or any other library. If an icon doesn't exist in Heroicons, submit a request to use a custom SVG that matches the Heroicons style specifications exactly.

### Rule 2: Outline Only
Heroicons has two styles: outline and solid. **Only the outline (stroke) variant is used in Roman Creative Studio.** Solid icons are not part of the system.

Exception: The one permitted use of a solid/filled icon is for active states on toggles or select controls, and only where the outline variant would not communicate state change clearly.

### Rule 3: One Stroke Width
All icons use `stroke-width: 1.5`. This is the Heroicons default and must not be changed. Do not increase or decrease stroke width to make icons feel "heavier" or "lighter" — change the icon size instead.

### Rule 4: Rounded Ends
Heroicons uses `stroke-linecap: round` and `stroke-linejoin: round` by default. These must not be changed. The rounded style is consistent with the brand's use of `border-radius` throughout the design language.

---

## Sizing System

| Size Token | px Value | Use Case |
|------------|----------|----------|
| `--icon-xs` | 16px | Inline with small text, tight UI elements |
| `--icon-sm` | 20px | Default inline icon, form field icons |
| `--icon-md` | 24px | Standard UI icon (most common) |
| `--icon-lg` | 32px | Feature icons in cards, callout blocks |
| `--icon-xl` | 48px | Section-level feature icons |
| `--icon-2xl` | 64px | Hero/display icons, large feature callouts |

**Rule:** Icon size must be chosen based on context, not preference. Larger icons are not "more impactful" — they need the space and visual weight to justify the size.

---

## Color System for Icons

Icons inherit color through `color: currentColor` and `stroke="currentColor"`. Control icon color via the parent element's `color` CSS property.

| Context | Color Token | Value |
|---------|------------|-------|
| Default / neutral | `--color-text-muted` | `rgba(240,239,233,0.65)` |
| Brand / emphasis | `--color-text-brand` | `#D4AF37` |
| In icon container | `--color-text-brand` | `#D4AF37` |
| On gold background | `--color-text-inverse` | `#0C0E11` |
| Disabled | `--color-text-subtle` | `rgba(240,239,233,0.30)` |
| Success | `--color-success` | `#22C55E` |
| Error | `--color-error` | `#DC2626` |
| Warning | `--color-warning` | `#F59E0B` |

---

## Icon Containers

When icons appear in feature cards, benefit sections, or highlight blocks, they use a standardized container:

```css
.icon-container {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: var(--color-brand-gold-subtle);  /* rgba(212,175,55,0.12) */
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-brand);              /* #D4AF37 */
  flex-shrink: 0;
}

/* Large variant for section-level use */
.icon-container--lg {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-xl);
}
```

**Container rules:**
- Background is always the gold-subtle tint — never a bright or saturated color
- Icon inside is always `--color-text-brand` (gold)
- Do not use colored containers (red, blue, green) — they conflict with the brand palette
- Border-radius matches the card component it sits inside

---

## Icon + Text Alignment

Icons paired with text must be optically centered — not just mathematically centered.

```css
.icon-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);    /* 8px */
}

/* For larger icons with multi-line text */
.icon-feature {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);    /* 16px */
}
```

**Alignment rules by size:**
| Icon Size | Text Alignment |
|-----------|---------------|
| 16–20px | `align-items: center` |
| 24px | `align-items: center` |
| 32px+ | `align-items: flex-start` (top-align with first line of text) |

---

## Spacing Rules

| Icon Size | Gap to Adjacent Text |
|-----------|---------------------|
| 16px | `4px` (`--space-1`) |
| 20–24px | `8px` (`--space-2`) |
| 32px | `12px` (`--space-3`) |
| 48px+ | `16px` (`--space-4`) |

---

## Active vs. Inactive States

| State | Color | Additional Styling |
|-------|-------|--------------------|
| Default (inactive) | `--color-text-muted` | No background |
| Hover | `--color-text-brand` | Transition 200ms |
| Active / Selected | `--color-text-brand` | Optional gold container |
| Disabled | `--color-text-subtle` | `opacity: 0.4`, `cursor: not-allowed` |
| Loading | `--color-text-subtle` | Spinning animation (see MotionSystem.md) |

---

## Implementation

### Inline SVG (Preferred)

```html
<svg 
  width="24" 
  height="24" 
  viewBox="0 0 24 24" 
  fill="none" 
  stroke="currentColor" 
  stroke-width="1.5" 
  stroke-linecap="round" 
  stroke-linejoin="round"
  aria-hidden="true"
>
  <!-- icon path here -->
</svg>
```

Using `stroke="currentColor"` allows full control of icon color via CSS `color` property.

### Why Inline SVG Over Icon Fonts or `<img>`

| Method | Color Control | Accessibility | Performance |
|--------|--------------|---------------|-------------|
| Inline SVG | ✅ Full CSS control | ✅ Can be hidden or labeled | ✅ No extra request |
| Icon font | ⚠️ Limited | ❌ Screen reader issues | ⚠️ Extra CSS |
| `<img>` tag | ❌ Cannot style | ⚠️ Requires alt | ⚠️ Extra HTTP request |

---

## Accessibility Rules for Icons

### Decorative Icons (most icons)
Hide from screen readers entirely:
```html
<svg aria-hidden="true" focusable="false">...</svg>
```

### Functional Icons (standalone, no visible text label)
Provide label via parent element:
```html
<button aria-label="Close dialog">
  <svg aria-hidden="true" focusable="false">...</svg>
</button>
```

### Status Icons (success, error, warning)
Pair with visible text — never rely on icon color alone to communicate status:
```html
<span class="status-success">
  <svg aria-hidden="true">...</svg>
  <span>Form submitted successfully</span>
</span>
```

**Rule:** Never use icon color as the only means of communicating information. Users who are color-blind must receive the same information through another signal (text, shape, or position).

---

## What Not to Do

| Never | Why |
|-------|-----|
| Mix Heroicons with another icon library | Breaks visual consistency immediately |
| Use solid/filled variant | Not part of the RCS system |
| Resize icons to non-system sizes (e.g. 18px, 22px) | Breaks the optical grid |
| Use `stroke-width` values other than `1.5` | Destroys the unified weight |
| Use `<img>` tags for icons | Prevents color control via CSS |
| Place icons without sufficient surrounding space | Cluttered, premium-breaking |
| Use icon color alone to convey state | Accessibility failure |

---

## Related Documents

- [Brand Bible — IconGuidelines.md](../brand/IconGuidelines.md)
- [ColorSystem.md](ColorSystem.md)
- [AccessibilitySystem.md](AccessibilitySystem.md)
- [DesignLanguage.md](DesignLanguage.md)

---

*Roman Creative Studio Visual Identity System | Phase 2B | Version 1.0*
