# Accessibility System (Built-In)
**Roman Creative Studio — Design System Engine**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

Accessibility is built into the design system at the component level — not added as an afterthought. This document defines the accessibility implementation for every component in the system. Reading this alongside the component specifications ensures nothing is missed.

**Standard:** WCAG 2.1 AA minimum. AAA target for all new work.

> See `docs/brand-governance/AccessibilityGovernance.md` for policy and enforcement rules. This document covers **implementation**.

---

## Global Accessibility Infrastructure

### 1. Skip Link (Required on Every Page)

```html
<!-- First element inside <body> — no exceptions -->
<a href="#main-content" class="skip-link">Skip to main content</a>
```

```css
.skip-link {
  position: absolute;
  top: -100px;
  left: var(--space-4);
  background: var(--color-brand-gold);
  color: var(--color-bg);
  font-weight: var(--weight-semibold);
  font-size: var(--text-sm);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  text-decoration: none;
  z-index: 9999;
  transition: top var(--duration-fast) var(--ease-out);
}

.skip-link:focus {
  top: var(--space-4);
}
```

### 2. Screen-Reader Utilities

```css
/* Visually hidden but accessible to screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Visually hidden until focused */
.sr-only-focusable:not(:focus):not(:focus-within) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 3. Global Focus Ring

```css
:focus-visible {
  outline: 2px solid var(--color-brand-gold);
  outline-offset: 3px;
  border-radius: inherit;
}

/* Mouse users don't see outline */
:focus:not(:focus-visible) {
  outline: none;
}
```

### 4. Reduced Motion (Global Override)

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration:        0.01ms !important;
    animation-iteration-count: 1      !important;
    transition-duration:       0.01ms !important;
    scroll-behavior:           auto   !important;
  }
}
```

---

## Component-Level Accessibility

### Buttons

```html
<!-- ✅ Native button — keyboard accessible by default -->
<button type="button" class="btn btn--primary">Book a Call</button>

<!-- ✅ Link styled as button — only for navigation -->
<a href="/contact" class="btn btn--primary">Book a Call</a>

<!-- ✅ Icon-only button — must have aria-label -->
<button type="button" class="btn btn--ghost btn--icon" aria-label="Close menu">
  <svg aria-hidden="true"><!-- X icon --></svg>
</button>

<!-- ✅ Loading state -->
<button type="submit" class="btn btn--primary btn--loading" aria-busy="true" aria-label="Sending message, please wait">
  Send Message
</button>

<!-- ❌ Never do this -->
<div class="btn btn--primary" onclick="...">Click</div>
```

**Keyboard behavior:**
- `<button>`: Activates on `Enter` + `Space` natively
- `<a>`: Activates on `Enter` natively. If used as button trigger, add `role="button"` and handle `Space` in JS.

---

### Forms

```html
<!-- Every input must have an associated label -->
<label for="email" class="form-label">Email address</label>
<input type="email" id="email" name="email" autocomplete="email"
  required aria-required="true" />

<!-- Required field announcement -->
<label for="name" class="form-label">
  Name
  <span aria-hidden="true" class="required-mark">*</span>
  <span class="sr-only">(required)</span>
</label>

<!-- Error state announcement -->
<input type="email" id="email" class="form-input form-input--error"
  aria-invalid="true"
  aria-describedby="email-error" />
<span id="email-error" class="form-error" role="alert">
  Please enter a valid email address.
</span>

<!-- Form status live region — announces success/error to screen readers -->
<div id="form-status" aria-live="polite" aria-atomic="true" class="sr-only"></div>
```

**JS pattern for live region:**
```js
// On form success:
document.getElementById('form-status').textContent = 'Your message was sent successfully.';

// On form error:
document.getElementById('form-status').textContent = 'There was an error sending your message. Please try again.';
```

---

### Navigation

```html
<!-- Main nav — labeled to differentiate from footer nav -->
<nav role="navigation" aria-label="Main navigation">
  ...
  <!-- Active link — current page indicator for screen readers -->
  <a href="/services" class="navbar__link" aria-current="page">Services</a>
</nav>

<!-- Mobile menu toggle -->
<button
  type="button"
  aria-expanded="false"
  aria-controls="mobile-nav"
  aria-label="Open navigation menu"
>
  ...
</button>

<!-- Mobile drawer -->
<nav
  id="mobile-nav"
  aria-label="Mobile navigation"
  aria-hidden="true"  <!-- toggled by JS -->
>
  ...
</nav>

<!-- Footer nav -->
<nav aria-label="Footer navigation"> ... </nav>
```

**Focus management for mobile nav:**
- When opened: Move focus to close button (`closeBtn.focus()`)
- When closed: Return focus to hamburger button (`hamburger.focus()`)
- While open: Trap focus within drawer (Tab cycles through drawer links only)
- Escape key: Closes drawer and returns focus

```js
// Focus trap implementation
function trapFocus(element) {
  const focusable = element.querySelectorAll(
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  element.addEventListener('keydown', function(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}
```

---

### Cards

```html
<!-- Static informational card — no special ARIA needed -->
<article class="card card--service">
  <h3 class="card-title">Web Design</h3>
  <p class="card-body">...</p>
</article>

<!-- Fully clickable card — wrap in <a> -->
<a href="/blog/post-slug" class="card card--blog card--clickable">
  <img src="thumbnail.webp" alt="Blog post: How to improve your dental practice website" />
  <div class="card-content">
    <h3 class="card-title">How to Improve Your Dental Practice Website</h3>
    ...
  </div>
</a>

<!-- Card with link inside — avoid double-link conflict -->
<article class="card card--service">
  <h3 class="card-title">Web Design</h3>
  <p class="card-body">...</p>
  <!-- Single link as the action — not the whole card -->
  <a href="/services/web-design" class="card-link">Learn more <span class="sr-only">about Web Design</span></a>
</article>
```

**Avoid:** Making the same destination reachable by both a card wrapper link AND an inner link. Choose one or the other.

---

### Images

```html
<!-- Informational image — describe the content, not the appearance -->
<img src="team.jpg" alt="Alexander Roman, founder of Roman Creative Studio, smiling in a modern office" />

<!-- Logo — describe and link context -->
<a href="/" aria-label="Roman Creative Studio — Go to homepage">
  <img src="logo.jpg" alt="Roman Creative Studio logo" />
</a>

<!-- Decorative image — empty alt tells screen reader to skip it -->
<img src="divider-texture.svg" alt="" role="presentation" />

<!-- CSS background image — aria-label on the container -->
<section
  style="background-image: url('hero.jpg')"
  aria-label="Modern digital agency workspace with design tools on desk"
>
  ...
</section>

<!-- Complex image (infographic, chart) — provide text description -->
<figure>
  <img src="results-chart.png" alt="Bar chart showing 40% increase in leads after website redesign" aria-describedby="chart-description" />
  <figcaption id="chart-description">
    Before: 25 leads/month. After: 35 leads/month. 40% increase over 90 days post-launch.
  </figcaption>
</figure>
```

---

### Modals & Dialogs

```html
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  id="booking-modal"
>
  <h2 id="modal-title">Book a Free Discovery Call</h2>
  <p id="modal-description">Choose a time that works for you. The call is 30 minutes.</p>
  <!-- form content -->
  <button type="button" aria-label="Close dialog" class="btn btn--ghost btn--icon">
    <svg aria-hidden="true"><!-- X icon --></svg>
  </button>
</div>

<!-- Backdrop — blocks interaction with background -->
<div id="modal-backdrop" aria-hidden="true"></div>
```

**Modal accessibility requirements:**
- Focus trapped within modal while open
- `Escape` key closes modal
- Focus returns to the trigger element that opened the modal on close
- Background content gets `aria-hidden="true"` while modal is open
- Never auto-close a modal on a timer

---

### Accordions

```html
<div class="accordion">
  <h3 class="accordion-header">
    <button
      type="button"
      class="accordion-trigger"
      aria-expanded="false"
      aria-controls="faq-1-panel"
      id="faq-1-btn"
    >
      What is your pricing?
      <svg aria-hidden="true" class="accordion-icon"><!-- chevron --></svg>
    </button>
  </h3>
  <div
    id="faq-1-panel"
    role="region"
    aria-labelledby="faq-1-btn"
    hidden
  >
    <div class="accordion-content">
      <p>...</p>
    </div>
  </div>
</div>
```

**Keyboard behavior:** `Enter`/`Space` toggles. `Tab` moves between headers.

---

## Accessibility Testing per Component

| Component | Keyboard | Screen Reader | Contrast | Reduced Motion |
|-----------|----------|---------------|----------|----------------|
| Button | Tab + Enter/Space | Label, state, role | ✅ AAA | Transform off |
| Form input | Tab, arrow keys | Label, required, error | ✅ AAA | Transition off |
| Navbar | Tab, Escape | Landmark, current page | ✅ AAA | None needed |
| Mobile nav | Tab trap, Escape | Expanded state, hidden | ✅ AAA | Slide off |
| Card (link) | Tab + Enter | Link destination | ✅ AAA | Hover off |
| Hero | Tab through CTAs | H1 present, landmark | ✅ AAA | Scale off |
| Modal | Tab trap, Escape | Dialog role, labels | ✅ AAA | Scale off |
| Accordion | Tab + Enter/Space | Expanded state, region | ✅ AAA | Height off |
| Skeleton | N/A | aria-busy on container | N/A | Pulse off |
| Toast | N/A | aria-live announcement | ✅ AA | Slide off |

---

## Related Documents
- `docs/brand-governance/AccessibilityGovernance.md` — Policy, enforcement, and QA checklist
- `docs/visual-identity/AccessibilitySystem.md` — Color contrast audit table
- `docs/visual-identity/MotionSystem.md` — Reduced motion implementation
- `docs/design-system-engine/NavigationSystem.md` — Focus trap JS implementation
