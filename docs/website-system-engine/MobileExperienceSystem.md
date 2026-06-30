# Mobile Experience System
## Roman Creative Studio — Phase 4, Document 9

---

### Mobile-First Philosophy

Mobile is not a responsive afterthought. It is the primary design surface.

The majority of website visitors arrive on mobile devices. For service businesses, this percentage is typically 60–75%. Every layout, every CTA, every navigation interaction must be designed for a thumb on a 375px screen before it is designed for a mouse on a 1440px screen.

This document defines mobile-specific standards for the Roman Creative Studio website beyond what Phase 2B (ResponsiveRules) and Phase 3 (ResponsiveBehaviorSystem) already cover.

---

## Section 1 — Mobile Navigation

### 1.1 Mobile Navbar Behavior

```
Height: 64px
Background: rgba(12,14,17,0.92) with backdrop-filter: blur(16px)
Position: sticky top-0
Z-index: 100

Contains:
  Left:   Logo (max 160px wide, 40px tall)
  Right:  Hamburger menu button (44px × 44px touch target)
```

### 1.2 Mobile Drawer Rules

- Opens from left (slides in from off-screen left edge)
- Covers full viewport height
- Background: `var(--color-bg)` with slight transparency blur on content behind
- Close button (X) in top-right of drawer, 44px touch target
- All nav links: minimum 48px height (generous touch target)
- Primary CTA ("Book a Call"): gold button, full-width, at bottom of drawer
- Escape key closes drawer
- Clicking outside drawer closes it
- Focus trapped inside drawer when open

### 1.3 Mobile Navigation Content

```
[Logo + close button row]
──────────────
▶ Services         [accordion toggle]
    Brand Identity
    Website Design
    Website Redesign
    SEO Optimization
    Conversion Optimization
    Website Care
▶ Industries        [accordion toggle]
    Dental / Church / Healthcare
    Local Business / Real Estate
    Restaurant / Startups
──────────────
  Portfolio
  About
  Blog
  Contact
──────────────
  [Book a Free Discovery Call]   ← Full-width gold button
```

---

## Section 2 — Mobile CTA Strategy

### 2.1 CTA Sizing Rules

- All CTA buttons: minimum 44px height (iOS minimum), target 48–52px
- On hero sections: full-width buttons below 480px (`width: 100%`)
- CTA group: stacked vertically on mobile (Primary above Secondary)
- Gap between stacked CTAs: `var(--space-3)` (12px)

### 2.2 Sticky Mobile CTA Bar

For high-intent pages (homepage, service pages, industry pages), implement a sticky bottom CTA bar on mobile:

```css
.mobile-cta-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
  z-index: 50;
}

@media (max-width: 767px) {
  .mobile-cta-bar {
    display: block;
  }
}

.mobile-cta-bar .btn {
  width: 100%;
}
```

```html
<div class="mobile-cta-bar" aria-label="Book a discovery call">
  <a href="/contact/" class="btn btn--primary btn--md">Book a Free Discovery Call</a>
</div>
```

**When to show:** After user scrolls past the hero CTA (use IntersectionObserver to detect)
**When to hide:** On the Contact page (they're already converting)

### 2.3 Phone Number Click-to-Call

All phone numbers displayed on mobile must be wrapped in an `<a href="tel:">` link:

```html
<a href="tel:+1XXXXXXXXXX" class="link-phone">+1 (XXX) XXX-XXXX</a>
```

**Rule:** Never display a phone number as plain text on mobile. Every phone number is a click-to-call.

---

## Section 3 — Mobile Typography

### 3.1 Text Scaling Rules

| Token | Mobile Value | Tablet (768px+) | Desktop (1024px+) |
|---|---|---|---|
| `--text-display` | 40px | 56px | 72px |
| `--text-5xl` | 32px | 48px | 56px |
| `--text-4xl` | 28px | 36px | 40px |
| `--text-3xl` | 24px | 28px | 32px |
| `--text-body` | 16px | 16px | 16px |
| `--text-body-sm` | 14px | 14px | 14px |

**Rules:**
- Never below 14px for any visible text
- Never below 16px for body copy
- Hero headline: max `--text-4xl` on mobile (28–32px) — no display sizes on 320px screens
- Line height for headlines: `var(--leading-tight)` (1.2–1.25)
- Line length: max 68ch, but on mobile aim for 45–55ch for readability

### 3.2 Font Loading Performance

```html
<!-- Preload critical fonts -->
<link rel="preload" href="/assets/fonts/cormorant-garamond-600.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin>
```

**Rule:** Preload only 1–2 font weights — the ones used for body and primary headlines. All other weights load normally.

---

## Section 4 — Mobile Section Stacking

### 4.1 Stacking Order Rules

When layouts collapse from multi-column to single-column on mobile, the stacking order is not automatic — it must be intentional.

**Split / Two-Column Layouts:**
```
Desktop:  [Text Left]  [Image Right]
Mobile:   [Text]       ← Text first
          [Image]      ← Image second (below fold is fine)
```

Rationale: Visitors scan text first. The image supports the message. Never show image before headline on mobile.

**Card Grids:**
```
Desktop:  [Card A]  [Card B]  [Card C]
Tablet:   [Card A]  [Card B]
          [Card C]
Mobile:   [Card A]
          [Card B]
          [Card C]
```

**CTA Groups:**
```
Desktop:  [Primary CTA]  [Secondary CTA]  (side by side)
Mobile:   [Primary CTA]                   (full width)
          [Secondary CTA]                 (full width, below)
```

**Navigation:**
```
Desktop:  Full horizontal nav bar
Mobile:   Logo + hamburger only (drawer for all nav items)
```

### 4.2 Section Padding on Mobile

| Section Type | Mobile Padding | Desktop Padding |
|---|---|---|
| Standard section | `var(--space-12)` top/bottom (48px) | `var(--space-20)` (80px) |
| Compact section | `var(--space-8)` (32px) | `var(--space-12)` (48px) |
| Hero section | `var(--space-16)` (64px) | `var(--space-24)` (96px) |

**Rule:** Never use the same padding on mobile as desktop. Mobile needs tighter vertical rhythm.

---

## Section 5 — Mobile Form Experience

### 5.1 Input Type Rules (from Phase 3 Form System)

| Field | Input Type | Mobile Keyboard Triggered |
|---|---|---|
| Email | `type="email"` | Email keyboard (@ symbol visible) |
| Phone | `type="tel"` | Numeric dial pad |
| URL | `type="url"` | URL keyboard (.com visible) |
| Numbers | `type="number"` | Numeric keyboard |
| Text | `type="text"` | Standard keyboard |

**Rule:** Always use the correct input type. Never use `type="text"` for email or phone fields.

### 5.2 Mobile Form Layout

- All form fields: full-width on mobile (never side-by-side below 768px)
- Label above input, never placeholder-as-label
- Input height: minimum 44px (`--form-height-md`)
- Submit button: full-width on mobile
- Keyboard: form must not be obscured by mobile keyboard (test with virtual keyboard open)

### 5.3 Autocomplete Attributes

```html
<input type="text" name="name" autocomplete="name">
<input type="email" name="email" autocomplete="email">
<input type="tel" name="phone" autocomplete="tel">
```

**Rule:** Always include `autocomplete` attributes. It saves mobile users from retyping common information and significantly reduces friction.

---

## Section 6 — Mobile Performance

### 6.1 Mobile-Specific Image Rules

Use `srcset` to serve appropriately sized images to mobile:

```html
<img
  src="hero-1200.webp"
  srcset="hero-480.webp 480w, hero-768.webp 768w, hero-1200.webp 1200w"
  sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px"
  alt="[descriptive alt text]"
  loading="lazy"
  width="1200"
  height="675"
>
```

**Rule:** Never serve a 1200px image to a 375px screen. It's 10× more data than needed.

### 6.2 Mobile Performance Targets

| Metric | Mobile Target | Desktop Target |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | < 2.0s |
| FID / INP | < 200ms | < 100ms |
| CLS | < 0.1 | < 0.1 |
| Total page weight | < 800KB | < 1.2MB |
| Time to Interactive | < 3.5s | < 2.5s |

### 6.3 What to Defer on Mobile

- Below-fold images: `loading="lazy"`
- Non-critical JavaScript: `defer` or `async`
- Third-party scripts (analytics, chat): load after page interactive
- Video: never autoplay on mobile; use poster image + click to play

---

## Section 7 — Mobile Touch Targets

All interactive elements must meet minimum touch target size:

| Element | Minimum Size | Implementation |
|---|---|---|
| Buttons | 44×44px | `min-height: 44px; min-width: 44px` |
| Links in body text | 44px height zone | Add padding to `<a>` tags |
| Navigation links | 48px height | Generous padding |
| Checkboxes / Radios | 44×44px touch area | Use `label` wrapping entire component |
| Form inputs | 44px height | `--form-height-md: 44px` |
| Icon buttons | 44×44px | Add invisible padding around 24px icon |

**Rule:** If an interactive element looks small, it needs invisible padding added to expand the touch zone — not just visual resizing.

```css
/* Expand touch target without changing visual size */
.icon-button {
  position: relative;
  padding: var(--space-2);
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

---

## Section 8 — Mobile QA Checklist

Before launching any page, verify on physical devices (not just browser devtools):

**Navigation:**
- [ ] Hamburger menu opens/closes cleanly
- [ ] All nav links are accessible and tap accurately
- [ ] Drawer closes on escape key and outside tap
- [ ] Primary CTA button is visible and tappable in drawer

**Content:**
- [ ] No horizontal scroll at 320px, 375px, 414px
- [ ] All text is readable without zooming
- [ ] Hero headline doesn't overflow at 320px
- [ ] Images don't exceed container width

**Forms:**
- [ ] Correct keyboard appears for each field type
- [ ] Labels visible above inputs (not obscured by keyboard)
- [ ] Submit button full-width and accessible
- [ ] Thank you state shows after submission

**Performance:**
- [ ] Page loads in under 3 seconds on 4G
- [ ] No layout shift during load (CLS < 0.1)
- [ ] Images don't load slowly and cause reflow

**CTAs:**
- [ ] All CTA buttons meet 44px minimum tap target
- [ ] Sticky mobile CTA bar appears after scrolling past hero
- [ ] Phone numbers are clickable (tel: links)
