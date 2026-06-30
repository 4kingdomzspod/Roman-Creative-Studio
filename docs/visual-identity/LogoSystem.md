# Logo System

**Roman Creative Studio Visual Identity System — Phase 2B**
*Version 1.0 | Last Updated: June 2026*

---

## Purpose of This Document

The logo system defines every variant of the Roman Creative Studio mark — what exists, what needs to be created, how each is used, and the rules that govern all of them. A logo system is not a collection of alternatives; it is a modular architecture where every variant serves a specific, non-overlapping purpose.

---

## Current State

**Primary Logo (Exists):**  
File: `assets/images/image-1782772947464.jpg`  
Format: JPEG (web only)  
Usage: Navigation mark (72px container with gold border), footer

**All other variants listed below are REQUIRED and must be designed.** Specifications are defined here so that a designer can produce each variant to exact system standards.

---

## Logo Architecture

The Roman Creative Studio identity is built around three core elements:

1. **The Mark** — The primary visual symbol (the studio's icon/image)
2. **The Wordmark** — "Roman Creative Studio" in the designated typeface
3. **The Monogram** — "RCS" as a condensed, lockable mark

All logo variants are combinations or derivations of these three elements.

---

## Logo Variants

---

### Variant 1: Primary Logo (Full Lockup)

**Purpose:** Default brand representation across all major contexts.

**Description:**  
The icon mark (square) placed to the left of the stacked wordmark. "Roman Creative Studio" on top line (primary weight), "Digital Agency" or nothing on second line (secondary weight, smaller).

**Usage Context:**
- Proposals and presentations
- Email signatures
- PDF documents
- Letterhead
- Website footer (larger version)

**Minimum Size:** 200px wide (digital) / 2 inches (print)

**Clear Space Rule:** Minimum clear space = height of the letter “R” in the wordmark on all four sides.

**Background Compatibility:**
- Preferred: Dark charcoal `#0C0E11` or `#1B1E23`
- Acceptable: Pure black, very dark navy
- Avoid: Light backgrounds without a high-contrast version

**Scaling Behavior:** Icon mark and wordmark scale proportionally. Below minimum size, use Monogram variant.

**Do:**
- Use on dark backgrounds for maximum impact
- Maintain the gold border on the icon mark container
- Ensure the wordmark is legible at all sizes

**Don't:**
- Stretch or distort proportions
- Remove the icon mark from the lockup
- Use on light backgrounds without the light-mode version

---

### Variant 2: Horizontal Lockup

**Purpose:** Wide-format contexts where vertical space is constrained.

**Description:**  
Icon mark to the left of the single-line wordmark "Roman Creative Studio" — all on one horizontal line.

**Usage Context:**
- Navigation bar (current implementation)
- Browser tabs (larger version)
- Email header banners
- Horizontal sponsorship slots

**Current Implementation (Nav):**
```css
.nav-brand-mark {
  width: 72px;
  height: 72px;
  border: 2px solid rgba(212,175,55,0.75);
  box-shadow: 0 0 18px rgba(212,175,55,0.30);
  border-radius: var(--radius-xl);
}
```

**Minimum Size:** 160px wide / 40px tall

**Clear Space Rule:** Equal to the mark height on all four sides.

**Scaling Behavior:** At nav bar sizes (40–80px tall), icon mark scales down. Below 40px, remove wordmark and show icon mark only.

---

### Variant 3: Stacked Lockup

**Purpose:** Vertical or square contexts where width is constrained.

**Description:**  
Icon mark centered above the wordmark. "Roman Creative Studio" centered below.

**Usage Context:**
- Social media profile headers (not icon — the full stacked lockup)
- Presentation title slides
- Podcast cover art
- Print materials with square constraints

**Minimum Size:** 200px × 200px

**Clear Space Rule:** Equal to mark width on all four sides.

---

### Variant 4: Monogram (RCS)

**Purpose:** Contexts where the full wordmark is not feasible — but more than a pure icon is needed.

**Description:**  
"RCS" rendered in the display typeface (Cormorant Garamond) with custom letterfit. Heavy weight. Gold color on dark background, or reversed on gold.

**Usage Context:**
- Small merchandise (pens, notebooks)
- Email watermarks
- Secondary brand touches
- Social media watermarks on portfolio screenshots

**Minimum Size:** 24px (digital) / 0.25 inch (print)

**Specifications:**
- Typeface: Cormorant Garamond, weight 700
- Color: `#D4AF37` on dark; `#0C0E11` on gold
- Letter spacing: -0.02em (tight, purposeful)

**Do:**
- Use as a secondary mark, not a replacement for the primary logo
- Maintain color integrity

**Don't:**
- Use the monogram as the primary logo on any professional document
- Use in sans-serif or any typeface other than Cormorant Garamond

---

### Variant 5: Icon Mark (Solo)

**Purpose:** Smallest contexts and social media icons where only a symbol is needed.

**Description:**  
The primary logo image alone, in its square container with gold border and rounded corners. No wordmark, no text.

**Usage Context:**
- Browser favicon
- Social media profile picture (Instagram, LinkedIn, Twitter/X, Facebook)
- App icon (future)
- Notification icons
- Small embeds

**Minimum Size:** 16px × 16px (favicon). Recommend 32px+ for all other contexts.

**Specifications:**
- Container: Square with rounded corners (`border-radius: 12px` at 72px; scale proportionally)
- Border: Gold at full opacity for icon-only contexts
- Background: `#080A0D` (slightly darker than page background for contrast)

**Favicon Sizes Required:**
- `16×16px` — browser tab
- `32×32px` — browser bookmark
- `180×180px` — Apple Touch Icon
- `192×192px` — Android Chrome
- `512×512px` — PWA splash

---

### Variant 6: Dark Mode Version

**Current version IS the dark mode version.** The primary logo is designed for dark backgrounds. All implementations default to dark mode.

---

### Variant 7: Light Mode Version

**Status: TO BE CREATED**

**Purpose:** Future use if a light-mode option is introduced for any platform.

**Specifications:**
- Icon mark: Same image with a light container (`#F0EFE9` or `#FFFFFF` background)
- Border: `rgba(212,175,55,0.90)` (slightly stronger on light)
- Wordmark: `#0C0E11` (dark charcoal on light background)
- Gold accent: Maintain `#D4AF37`

**Note:** Do not introduce the light version until the full light-mode design system is defined.

---

### Variant 8: Social Media Profile Icon

**Purpose:** The icon displayed on social network profile pages (circular crop context).

**Description:**  
The icon mark image, cropped to a square with maximum padding of 10% on each side. Designed to survive the circular crop most social platforms apply.

**Required Output:**
- `400×400px` JPG — LinkedIn, Twitter/X
- `320×320px` JPG — Facebook
- `1080×1080px` JPG — Instagram (also serves as high-res source)

**Key Rule:** The subject of the logo must be centered and leave enough margin to survive a circular crop without losing critical visual information.

---

### Variant 9: Wordmark Only

**Status: TO BE CREATED**

**Purpose:** Contexts where the icon mark would be too small to read or is already established.

**Description:**  
"Roman Creative Studio" in Inter, weight 700, letter-spacing -0.02em. "Roman" in white, "Creative Studio" in gold — or all gold, depending on context.

**Usage Context:**
- Document headers where the mark is already present
- Certain print contexts
- Email footer text reference

---

## Logo Container System (Web)

All digital implementations of the icon mark use a container component:

```css
/* Standard nav implementation */
.nav-brand-mark {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-xl);       /* 12px */
  background: #080A0D;
  border: 2px solid rgba(212,175,55,0.75);
  box-shadow:
    0 0 18px rgba(212,175,55,0.30),
    0 2px 10px rgba(0,0,0,0.50);
  overflow: hidden;
  flex-shrink: 0;
}

.nav-brand-mark img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Hover state */
.nav-brand:hover .nav-brand-mark {
  border-color: rgba(212,175,55,1);
  box-shadow:
    0 0 28px rgba(212,175,55,0.50),
    0 2px 12px rgba(0,0,0,0.60);
}
```

**Size Scale for Web:**
| Context | Container Size |
|---------|---------------|
| Navigation (primary) | 72 × 72px |
| Footer | 56 × 56px |
| Favicon (rendered) | 32 × 32px |
| Mobile nav | 60 × 60px |

---

## What NOT to Do

| Never | Why |
|-------|-----|
| Place logo on a mid-range gray background | Insufficient contrast in both directions |
| Stretch the logo horizontally or vertically | Distorts the proportions intentionally set |
| Use the logo at sizes below the minimum | Wordmark becomes illegible, mark loses clarity |
| Add drop shadows, gradients, or effects to the logo | Undermines the visual integrity of the mark |
| Recreate the logo in a different typeface | The mark must remain consistent |
| Use unapproved color variations | Gold and dark are the only sanctioned palette |
| Crowd the logo with competing elements | Clear space rules exist for a reason |

---

## Required Asset Files (To-Be-Created Checklist)

- [ ] Primary full lockup SVG (dark)
- [ ] Horizontal lockup SVG (dark)
- [ ] Stacked lockup SVG (dark)
- [ ] Monogram RCS SVG
- [ ] Icon mark PNG pack (16, 32, 180, 192, 512px)
- [ ] Favicon `.ico` file
- [ ] Social media profile image set (400, 320, 1080px)
- [ ] Light mode variants of above (when light mode is introduced)

---

## Related Documents

- [ColorSystem.md](ColorSystem.md) — Gold token values
- [TypographySystem.md](TypographySystem.md) — Cormorant Garamond for monogram
- [Brand Bible — LogoGuidelines.md](../brand/LogoGuidelines.md)
- [AccessibilitySystem.md](AccessibilitySystem.md) — Contrast requirements

---

*Roman Creative Studio Visual Identity System | Phase 2B | Version 1.0*
