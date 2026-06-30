# State System
**Roman Creative Studio — Design System Engine**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

Define all global UI states used across the design system. Every interactive component has a lifecycle — loading, empty, error, success, disabled. These states must be defined, consistent, and accessible. An undefined state is an inconsistent user experience waiting to happen.

---

## State Taxonomy

| State | When It Applies |
|-------|-----------------|
| **Loading** | Data is being fetched, action is processing |
| **Empty** | No data exists to display yet |
| **Error** | Something went wrong — user or system error |
| **Success** | Action completed successfully |
| **Disabled** | Interaction is not available in this context |
| **Skeleton** | Page-level content is loading (replaces loading spinner for layouts) |

---

## 1. Loading States

### Spinner (Inline)

Use for button loading states and small inline loads.

```css
.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(212, 175, 55, 0.20);
  border-top-color: var(--color-brand-gold);
  border-radius: var(--radius-full);
  animation: spin 700ms linear infinite;
  flex-shrink: 0;
}

.spinner--sm { width: 14px; height: 14px; border-width: 1.5px; }
.spinner--lg { width: 28px; height: 28px; border-width: 2.5px; }

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
    border-top-color: var(--color-brand-gold);
    opacity: 0.6;
  }
}
```

### Page Loading Overlay

Use for full-page transitions (rare).

```css
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(12, 14, 17, 0.80);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
```

---

## 2. Skeleton Loading States

Skeletons replace layout content while data loads. They prevent layout shift and communicate structure before content arrives.

```css
@keyframes skeleton-pulse {
  0%   { opacity: 1; }
  50%  { opacity: 0.4; }
  100% { opacity: 1; }
}

.skeleton {
  background: var(--color-surface-elevated);
  border-radius: var(--radius-sm);
  animation: skeleton-pulse 1.8s var(--ease-in-out) infinite;
  display: block;
}

/* Text line skeletons */
.skeleton-text-lg  { height: 28px; width: 60%; margin-bottom: var(--space-3); }
.skeleton-text-md  { height: 20px; width: 80%; margin-bottom: var(--space-2); }
.skeleton-text-sm  { height: 16px; width: 90%; margin-bottom: var(--space-2); }
.skeleton-text-xs  { height: 12px; width: 40%; }

/* Shape skeletons */
.skeleton-circle   { border-radius: var(--radius-full); }
.skeleton-avatar   { width: 48px; height: 48px; border-radius: var(--radius-full); flex-shrink: 0; }
.skeleton-thumb    { width: 100%; aspect-ratio: 16 / 9; border-radius: var(--radius-md); }
.skeleton-btn      { height: 44px; width: 140px; border-radius: var(--radius-md); }
.skeleton-badge    { height: 24px; width: 80px; border-radius: var(--radius-full); }

@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; opacity: 0.5; }
}
```

### Skeleton Card Pattern

```html
<article class="card" aria-label="Loading content" aria-busy="true">
  <span class="skeleton skeleton-thumb"></span>
  <div class="stack stack-sm" style="padding: var(--space-5);">
    <span class="skeleton skeleton-badge"></span>
    <span class="skeleton skeleton-text-lg"></span>
    <span class="skeleton skeleton-text-md"></span>
    <span class="skeleton skeleton-text-sm"></span>
    <span class="skeleton skeleton-text-xs" style="margin-top: var(--space-3);"></span>
  </div>
</article>
```

---

## 3. Empty States

Empty states appear when a page, section, or list has no content. They must tell the user: what's missing, why, and what they can do.

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-16) var(--space-6);
  gap: var(--space-4);
}

.empty-state-icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-xl);
  background: var(--color-surface-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-2);
}

.empty-state-icon svg {
  width: 28px;
  height: 28px;
  color: var(--color-text-subtle);
  stroke-width: 1.5;
}

.empty-state-title {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
  color: var(--color-text);
}

.empty-state-description {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  max-width: 320px;
  line-height: var(--leading-relaxed);
}
```

```html
<div class="empty-state">
  <div class="empty-state-icon">
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  </div>
  <h3 class="empty-state-title">No posts yet</h3>
  <p class="empty-state-description">We're working on new content. Check back soon.</p>
  <a href="/contact" class="btn btn--secondary btn--md">Get in Touch</a>
</div>
```

---

## 4. Error States

### Inline Field Error (Form)
Covered in `FormSystem.md` — `.form-error` + `aria-live="polite"`.

### Alert / Banner Error

```css
.alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
}

.alert-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 1px;
}

.alert-content { flex: 1; }
.alert-title {
  font-weight: var(--weight-semibold);
  margin-bottom: var(--space-1);
  color: var(--color-text);
}
.alert-body { color: var(--color-text-muted); }

/* Variants */
.alert--error {
  background: var(--color-error-subtle);
  border-color: rgba(220, 38, 38, 0.30);
}
.alert--error .alert-icon { color: var(--color-error); }

.alert--success {
  background: var(--color-success-subtle);
  border-color: rgba(34, 197, 94, 0.30);
}
.alert--success .alert-icon { color: var(--color-success); }

.alert--warning {
  background: var(--color-warning-subtle);
  border-color: rgba(245, 158, 11, 0.30);
}
.alert--warning .alert-icon { color: var(--color-warning); }

.alert--info {
  background: var(--color-info-subtle);
  border-color: rgba(59, 130, 246, 0.30);
}
.alert--info .alert-icon { color: var(--color-info); }
```

```html
<div class="alert alert--error" role="alert">
  <svg class="alert-icon" aria-hidden="true"><!-- exclamation-circle icon --></svg>
  <div class="alert-content">
    <p class="alert-title">Something went wrong</p>
    <p class="alert-body">We couldn't send your message. Please try again or email us directly at <a href="mailto:Alexander@romancreativestudio.co">Alexander@romancreativestudio.co</a>.</p>
  </div>
</div>
```

### Page-Level Error (404, 500)

See `404.html` in root — full-page error implementation.

**Rules:**
- Error pages always include a way back: homepage link + contact link
- Error copy never says "Error" as the headline. It uses friendly, action-oriented language.
- 404 page: `<meta name="robots" content="noindex">`
- 500 page: Log error server-side. Never expose technical details to user.

---

## 5. Success States

### Inline Form Success
Covered in `FormSystem.md` — `.form-success-state`.

### Toast Notification

```css
.toast-container {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  z-index: 9000;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-5);
  box-shadow: var(--shadow-xl);
  min-width: 280px;
  max-width: 360px;
  pointer-events: auto;

  /* Entrance animation */
  animation: toast-in var(--duration-moderate) var(--ease-out) forwards;
}

.toast--success { border-left: 3px solid var(--color-success); }
.toast--error   { border-left: 3px solid var(--color-error); }
.toast--info    { border-left: 3px solid var(--color-info); }

.toast-icon { flex-shrink: 0; width: 20px; height: 20px; }
.toast-text { font-size: var(--text-sm); color: var(--color-text); flex: 1; }

@keyframes toast-in {
  from { opacity: 0; transform: translateY(8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)   scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .toast { animation: none; }
}
```

---

## 6. Disabled States

```css
/* Applied to any disabled interactive element */
[disabled],
[aria-disabled="true"] {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}

/* Disabled form inputs — slightly different treatment */
.form-input:disabled {
  opacity: 0.50;
  background-color: var(--color-surface);
  cursor: not-allowed;
}

/* Disabled section — entire section locked */
.section--disabled {
  opacity: 0.50;
  pointer-events: none;
  user-select: none;
  position: relative;
}

.section--disabled::after {
  content: '';
  position: absolute;
  inset: 0;
  cursor: not-allowed;
}
```

**Disabled state rules:**
- Never disable a Primary CTA without explaining why (add a tooltip or helper text)
- Disabled `<button>` elements should use `disabled` attribute — not just opacity CSS
- Screen readers must still know an element is disabled: use `aria-disabled="true"` if removing from tab order isn't appropriate

---

## State Completeness Checklist

For every interactive component, verify all states are defined:

| Component | Default | Hover | Focus | Active | Loading | Disabled | Error | Success |
|-----------|---------|-------|-------|--------|---------|----------|-------|---------|
| Button | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| Form Input | ✅ | ✅ | ✅ | — | — | ✅ | ✅ | ✅ |
| Card (hoverable) | ✅ | ✅ | ✅ | — | ✅ (skeleton) | — | — | — |
| Nav Link | ✅ | ✅ | ✅ | ✔ | — | — | — | — |
| Checkbox | ✅ | ✅ | ✅ | — | — | ✅ | ✅ | — |

— = not applicable for this component type

---

## Related Documents
- `docs/design-system-engine/ButtonSystem.md` — Button loading/disabled states
- `docs/design-system-engine/FormSystem.md` — Form validation states
- `docs/design-system-engine/AccessibilitySystem.md` — ARIA live regions for state announcements
- `docs/visual-identity/MotionSystem.md` — Animation tokens for state transitions
