# Accessibility Governance
**Roman Creative Studio — Brand Governance System**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

Accessibility is not a feature to add at the end of a project. It is a baseline quality standard enforced from the first line of design or code. This document defines how RCS enforces accessibility compliance across all work — internal and client-facing.

**Compliance standard: WCAG 2.1 AA — mandatory minimum. WCAG 2.1 AAA — target standard.**

A website that fails accessibility requirements is a website that is not production-ready. It will not ship.

---

## 1. Mandatory Compliance Standard

### WCAG 2.1 AA — Required for All Work

No RCS website, page, or component ships unless it passes WCAG 2.1 AA. This applies to:
- All RCS owned properties (romancreativestudio.co and all subdomains)
- All client websites built by RCS
- All proposal and presentation documents (where technically applicable)
- All social media graphics (where technically applicable)

### WCAG 2.1 AAA — Target for All New Work

All new work produced after this governance system's publication date should aim for WCAG 2.1 AAA. AAA compliance is not mandatory for retroactive fixes, but it is mandatory for all new components and pages.

---

## 2. Contrast Ratio Enforcement

### Minimum Requirements (Non-Negotiable)

| Text Type | Minimum Ratio | WCAG Level |
|-----------|--------------|------------|
| Normal body text (< 18px regular, < 14px bold) | **4.5:1** | AA |
| Large text (≥ 18px regular, ≥ 14px bold) | **3:1** | AA |
| UI components (form borders, buttons) | **3:1** | AA |
| Icons and graphical elements | **3:1** | AA |

### Approved RCS Palette Contrast (Verified)

The following combinations are pre-approved. Any combination not on this list requires manual contrast verification before use.

| Foreground | Background | Ratio | Status |
|------------|------------|-------|--------|
| `--color-text` on `--color-bg` | ~15.8:1 | ✅ AAA |
| `--color-text` on `--color-surface` | ~13.2:1 | ✅ AAA |
| `--color-text` on `--color-surface-elevated` | ~11.4:1 | ✅ AAA |
| `--color-text-muted` on `--color-bg` | ~9.8:1 | ✅ AAA |
| `--color-text-subtle` on `--color-bg` | ~6.7:1 | ✅ AA |
| `--color-brand-gold` on `--color-bg` | ~7.9:1 | ✅ AAA |
| `--color-brand-gold` on `--color-surface` | ~6.6:1 | ✅ AAA |
| `--color-text-inverse` on `--color-brand-gold` | ~7.9:1 | ✅ AAA |
| `--color-success` on `--color-bg` | ~6.9:1 | ✅ AAA |
| `--color-warning` on `--color-bg` | ~6.2:1 | ✅ AAA |
| `--color-error` on `--color-bg` | ~3.6:1 | ⚠️ Large text only |
| `--color-info` on `--color-bg` | ~4.9:1 | ✅ AA |

**Error color rule:** `--color-error` on dark backgrounds only meets contrast for large text (18px+). At body text size, error states must always include an error icon AND error text label — never color alone.

### Contrast Verification Process

Before any new color combination is used:
1. Test using the WebAIM Contrast Checker or browser DevTools
2. Document the ratio in the component or page spec
3. If the ratio fails, escalate — do not ship with a failing ratio

---

## 3. Focus State Requirements

All interactive elements must have a programmatically visible focus indicator. Removing the focus outline without providing an equivalent replacement is an accessibility violation.

### Required Focus Ring Standard

```css
:focus-visible {
  outline: 2px solid var(--color-brand-gold);
  outline-offset: 3px;
  border-radius: inherit;
}
```

### Enforcement Rules

- ❌ `outline: none` is prohibited unless replaced with an equivalent custom focus indicator
- ❌ `outline: 0` is prohibited without replacement
- ✅ `outline: none` on `:focus` (not `:focus-visible`) is acceptable — hides ring for mouse users only
- ✅ Custom focus styles (border-color + box-shadow on form inputs) are acceptable if they meet 3:1 contrast

### Focus Order Audit

For every page, the tab order must follow logical reading order. Run this check:
1. Start at the top of the page
2. Press Tab repeatedly
3. Verify focus moves left-to-right, top-to-bottom
4. Verify no elements are skipped
5. Verify no focus traps (except intentional modal focus trap)
6. Verify focus is always visible

---

## 4. Screen Reader Compatibility Rules

### Required HTML Structure

Every page must include:

```html
<!-- First element in <body> -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<header role="banner">...</header>
<nav role="navigation" aria-label="Main navigation">...</nav>
<main id="main-content" role="main">...</main>
<footer role="contentinfo">...</footer>
```

### Required ARIA Enforcement

| Pattern | Requirement |
|---------|------------|
| Icon-only buttons | Must have `aria-label` |
| Images | Must have descriptive `alt` or `alt=""` for decorative |
| Form inputs | Must have associated `<label>` or `aria-label` |
| Required fields | Must communicate via `aria-required="true"` or `required` attribute |
| Error messages | Must use `aria-live="polite"` or `aria-describedby` to announce to screen readers |
| Modal dialogs | Must use `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Navigation | Must use `aria-label` to differentiate multiple nav elements |
| Carousels | Must have pause controls and announce slide position |

### Heading Hierarchy Enforcement

Screen readers use heading structure to navigate pages. Any heading hierarchy violation (e.g., H1 → H3 skipping H2) is a navigation defect for screen reader users.

**Verification tool:** Use the WAVE browser extension to audit heading structure before any page ships.

---

## 5. Color-Blind Safety Requirements

**Rule:** Never communicate state or information through color alone.

Every state change must have at minimum **two** of the following:
- Color change
- Icon or symbol
- Text label
- Shape change
- Pattern change

### Mandatory State Indicator Requirements

| State | Color | Icon Required | Text Required |
|-------|-------|--------------|---------------|
| Error | Red | ✅ Yes | ✅ Yes |
| Success | Green | ✅ Yes | ✅ Yes |
| Warning | Amber | ✅ Yes | ✅ Yes |
| Required field | Any | ✅ Yes (asterisk) | ✅ Yes (sr-only) |
| Active nav link | Gold | ✅ Underline/indicator | ✅ Aria-current |
| Disabled state | Muted | ✅ Visual change | ✅ aria-disabled |

### Verified Color-Blind Safe Combinations

The RCS palette (dark backgrounds + gold + white) is safe under all major color blindness types (deuteranopia, protanopia, tritanopia). The gold accent is perceived distinctly under all simulated conditions.

**Simulation test:** Before shipping any new design, test using Chrome's built-in Vision Deficiency emulator (DevTools → Rendering → Emulate vision deficiency).

---

## 6. Text Legibility Enforcement Rules

### Size Minimums

| Context | Minimum Size | Font |
|---------|-------------|------|
| Body copy | `--text-base` (16px) | Inter |
| Small body / descriptions | `--text-sm` (14px) | Inter |
| Captions, labels, meta | `--text-xs` (12px) | Inter |
| Legal / fine print | `--text-xs` (12px minimum) | Inter |
| Display headings | `--text-3xl`+ (use Cormorant only at 30px+) | Cormorant Garamond |
| Navigation links | `--text-sm` (14px) | Inter |
| Button labels | `--text-sm` (14px) | Inter |

**Absolute minimum:** 12px for any text that conveys information. Below 12px is prohibited regardless of context.

### Line Height Minimums

- Body text minimum line-height: 1.5
- Headings minimum line-height: 1.2
- Labels/captions minimum line-height: 1.4

Below these values, text becomes difficult to read for users with dyslexia or low vision.

### Zoom Compliance

- All pages must be fully usable at **200% browser zoom** without horizontal scrolling
- All pages must reflow to a single column at **400% browser zoom**
- No content may be clipped or hidden at any zoom level

---

## 7. Accessibility Approval Gate

No page, component, or release may ship without passing the following gate:

### Automated (Run First)
- [ ] axe DevTools — zero critical violations, zero serious violations
- [ ] WAVE — zero errors
- [ ] Lighthouse Accessibility — score ≥ 95

### Manual (Required in Addition to Automated)
- [ ] Full keyboard navigation verified (Tab through entire page)
- [ ] Skip link tested and functional
- [ ] Screen reader spot-check (VoiceOver/Mac or NVDA/Windows)
- [ ] Color-blind simulation test run
- [ ] 200% zoom test passed
- [ ] All images verified: descriptive alt or alt="" for decorative
- [ ] All forms verified: labels, error states, required field marking
- [ ] All icon buttons verified: aria-label present

### Accessibility Violation Severity

| Severity | Example | Action |
|----------|---------|--------|
| **Critical** | Missing alt text on informational image; form with no labels; contrast fails AA | Block release — fix immediately |
| **Major** | Missing focus state; heading hierarchy violation; color-only state indicator | Fix before release |
| **Minor** | AAA contrast failure (still AA passing); advisory ARIA enhancement | Document and schedule |

---

## Related Documents
- `docs/visual-identity/AccessibilitySystem.md` — Technical implementation reference
- `docs/visual-identity/ColorSystem.md` — Contrast ratio table
- `docs/visual-identity/MotionSystem.md` — `prefers-reduced-motion` implementation
- `docs/operations/QAChecklist.md` — Full QA process
- `docs/brand-governance/BrandViolationPrevention.md` — How violations are escalated
