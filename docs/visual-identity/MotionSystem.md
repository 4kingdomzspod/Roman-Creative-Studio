# Motion & Animation Style System
**Roman Creative Studio — Visual Identity System**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

Define how motion is used across Roman Creative Studio's brand and client work. Motion is not decoration — it is a communication tool. Every animation should serve a functional purpose: guide attention, confirm actions, communicate state changes, or create a sense of premium craft.

---

## Core Motion Philosophy

> **Motion should feel inevitable — not surprising.**

The RCS motion system is built on four principles:

| Principle | Description |
|-----------|-------------|
| **Purposeful** | Every animation has a reason. No motion for decoration alone. |
| **Subtle** | Never call attention to itself. The content, not the motion, is the star. |
| **Consistent** | Same speed and easing for the same type of interaction everywhere. |
| **Accessible** | Always respect `prefers-reduced-motion`. No motion by default if disabling is complex. |

---

## Duration Scale

```css
:root {
  --duration-instant:   75ms;   /* Immediate feedback — checkbox toggle, radio */
  --duration-fast:     150ms;   /* Hover states, focus rings, small state changes */
  --duration-normal:   250ms;   /* Most transitions — buttons, links, cards */
  --duration-moderate: 350ms;   /* Dropdowns, drawers opening */
  --duration-slow:     500ms;   /* Page sections fading in, large reveals */
  --duration-deliberate: 700ms; /* Hero animations, large image transitions */
  --duration-dramatic: 1000ms;  /* Splash screens, brand moments only */
}
```

**Rule:** When in doubt, use `--duration-normal` (250ms). It reads as responsive without feeling rushed.

---

## Easing Functions

```css
:root {
  /* Standard — element moves at natural deceleration */
  --ease-out:      cubic-bezier(0.0, 0.0, 0.2, 1.0);

  /* Entrance — element enters with momentum, settles */
  --ease-in-out:   cubic-bezier(0.4, 0.0, 0.2, 1.0);

  /* Exit — element leaves quickly */
  --ease-in:       cubic-bezier(0.4, 0.0, 1.0, 1.0);

  /* Springy — slight overshoot for interactive elements */
  --ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1.0);

  /* Linear — progress bars, loading states only */
  --ease-linear:   linear;
}
```

### When to Use Each

| Easing | Use Case |
|--------|----------|
| `--ease-out` | Default for almost everything. Feels natural. |
| `--ease-in-out` | Elements moving from one position to another (drawers, modals) |
| `--ease-in` | Dismissing elements (toasts leaving, modals closing) |
| `--ease-spring` | Interactive delight moments — icon hover, CTA button press |
| `--ease-linear` | Progress bars, skeleton loaders, spinners |

---

## Hover States

### Buttons

```css
.btn {
  transition:
    background-color var(--duration-fast) var(--ease-out),
    box-shadow       var(--duration-fast) var(--ease-out),
    transform        var(--duration-fast) var(--ease-out),
    color            var(--duration-fast) var(--ease-out);
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0px);
  transition-duration: 75ms;
}
```

### Cards

```css
.card {
  transition:
    transform    var(--duration-normal) var(--ease-out),
    box-shadow   var(--duration-normal) var(--ease-out),
    border-color var(--duration-normal) var(--ease-out);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  border-color: rgba(212, 175, 55, 0.35);
}
```

### Navigation Links

```css
.nav-link {
  transition:
    color      var(--duration-fast) var(--ease-out),
    opacity    var(--duration-fast) var(--ease-out);
}

/* Underline slide-in effect */
.nav-link::after {
  content: '';
  display: block;
  height: 1px;
  background: var(--color-brand-gold);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-normal) var(--ease-out);
}

.nav-link:hover::after {
  transform: scaleX(1);
}
```

### Gold Glow Effect

```css
/* For brand accent elements on hover */
.icon-container {
  transition:
    background-color var(--duration-normal) var(--ease-out),
    box-shadow       var(--duration-normal) var(--ease-out);
}

.icon-container:hover {
  background-color: rgba(212, 175, 55, 0.20);
  box-shadow: 0 0 12px rgba(212, 175, 55, 0.25);
}
```

---

## Micro-Interactions

### Focus Ring (Keyboard Navigation)

```css
:focus-visible {
  outline: 2px solid var(--color-brand-gold);
  outline-offset: 3px;
  transition: outline-offset var(--duration-fast) var(--ease-out);
}
```

### Checkbox / Toggle

```css
.checkbox-indicator {
  transition:
    background-color var(--duration-instant) var(--ease-out),
    border-color     var(--duration-instant) var(--ease-out);
}

.checkmark {
  transition:
    transform  var(--duration-fast) var(--ease-spring),
    opacity    var(--duration-fast) var(--ease-out);
}

.checkbox:checked .checkmark {
  transform: scale(1);
  opacity: 1;
}

.checkbox:not(:checked) .checkmark {
  transform: scale(0.5);
  opacity: 0;
}
```

### Form Field Focus

```css
.form-input {
  transition:
    border-color var(--duration-fast) var(--ease-out),
    box-shadow   var(--duration-fast) var(--ease-out);
}

.form-input:focus {
  border-color: var(--color-brand-gold);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.20);
}
```

### Loading Spinner

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.spinner {
  animation: spin 800ms var(--ease-linear) infinite;
  border: 2px solid rgba(212, 175, 55, 0.20);
  border-top-color: var(--color-brand-gold);
  border-radius: 50%;
}
```

### Skeleton Loader Pulse

```css
@keyframes skeleton-pulse {
  0%   { opacity: 1; }
  50%  { opacity: 0.4; }
  100% { opacity: 1; }
}

.skeleton {
  background: var(--color-surface-elevated);
  animation: skeleton-pulse 1.5s var(--ease-in-out) infinite;
  border-radius: var(--radius-sm);
}
```

---

## Page & Section Transitions

### Section Fade-In on Scroll

```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity   var(--duration-slow) var(--ease-out),
    transform var(--duration-slow) var(--ease-out);
}

.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

```js
// IntersectionObserver pattern
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
```

### Staggered List Animation

```css
.stagger-item {
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity   var(--duration-normal) var(--ease-out),
    transform var(--duration-normal) var(--ease-out);
}

.stagger-item:nth-child(1) { transition-delay: 0ms; }
.stagger-item:nth-child(2) { transition-delay: 75ms; }
.stagger-item:nth-child(3) { transition-delay: 150ms; }
.stagger-item:nth-child(4) { transition-delay: 225ms; }
.stagger-item:nth-child(5) { transition-delay: 300ms; }
.stagger-item:nth-child(6) { transition-delay: 375ms; }
```

---

## Modal & Overlay Transitions

### Modal Backdrop

```css
.modal-backdrop {
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.modal-backdrop.is-open {
  opacity: 1;
}
```

### Modal Panel

```css
.modal-panel {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
  transition:
    opacity   var(--duration-moderate) var(--ease-out),
    transform var(--duration-moderate) var(--ease-out);
}

.modal-panel.is-open {
  opacity: 1;
  transform: translateY(0) scale(1);
}
```

---

## Accessibility — Reduced Motion

All motion must be disabled or minimized for users who prefer reduced motion.

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

  .animate-on-scroll {
    opacity: 1;
    transform: none;
  }

  .stagger-item {
    opacity: 1;
    transform: none;
  }
}
```

**Rule:** Never rely on animation to convey critical information. Color, text, and icons must always be the primary communication layer.

---

## Motion Anti-Patterns

The following are explicitly prohibited:

| Anti-Pattern | Why |
|--------------|-----|
| Bounce on page load | Feels cheap, not premium |
| Auto-playing video with sound | Accessibility violation |
| Looping background animations | Distracting, performance cost |
| Animation on every hover simultaneously | Visual chaos |
| Transitions longer than 700ms for UI | Feels broken/slow |
| 3D transforms without GPU consideration | Performance risk |
| Infinite pulse animations on text | Extremely distracting |

---

## Motion Decision Checklist

Before adding any animation, answer:

- [ ] What purpose does this motion serve? (Guide attention / Confirm action / Show state change)
- [ ] Is it under 500ms for standard UI? Under 700ms for large reveals?
- [ ] Does it use the defined duration and easing tokens?
- [ ] Is it disabled under `prefers-reduced-motion`?
- [ ] Does it still function if animation is completely off?
- [ ] Does it add performance cost that outweighs the benefit?

---

## Related Documents
- `docs/visual-identity/AccessibilitySystem.md` — Full `prefers-reduced-motion` requirements
- `docs/design-system/Buttons.md` — Button hover/active states
- `docs/design-system/Cards.md` — Card hover implementation
- `docs/design-system/Forms.md` — Form field focus transitions
