# Form System
**Roman Creative Studio — Design System Engine**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

Define a scalable, accessible form architecture used across all RCS websites and client builds. Forms are the primary conversion mechanism — contact forms, booking requests, quote submissions. Every form element in the system is defined here.

---

## Form Architecture

Every form is composed of these layers:

```
Form (.form)
  └── Form Group (.form-group)         ← Wraps one field
        ├── Label (.form-label)           ← Visible label
        ├── Input / Textarea / Select    ← The control
        ├── Helper text (.form-helper)    ← Optional guidance
        └── Error message (.form-error)   ← Validation feedback
```

---

## Base Tokens (Form-Specific)

```css
:root {
  /* Form sizing */
  --form-height-sm:  36px;
  --form-height-md:  44px;  /* default, meets touch target */
  --form-height-lg:  52px;

  /* Form colors (reference global tokens) */
  --form-border:        var(--color-border-strong);
  --form-border-focus:  var(--color-brand-gold);
  --form-border-error:  var(--color-error);
  --form-border-success: var(--color-success);
  --form-bg:            var(--color-surface-muted);
  --form-bg-disabled:   var(--color-surface);
  --form-text:          var(--color-text);
  --form-placeholder:   var(--color-text-subtle);
  --form-label-color:   var(--color-text-muted);
  --form-helper-color:  var(--color-text-subtle);
  --form-error-color:   var(--color-error);
  --form-success-color: var(--color-success);
  --form-radius:        var(--radius-md);
}
```

---

## 1. Labels

```css
.form-label {
  display: block;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--form-label-color);
  margin-bottom: var(--space-2);
  line-height: var(--leading-tight);
}

/* Required indicator */
.form-label .required-mark {
  color: var(--color-error);
  margin-left: 3px;
  aria-hidden: true;
}
```

```html
<label for="email" class="form-label">
  Email address
  <span class="required-mark" aria-hidden="true">*</span>
  <span class="sr-only">(required)</span>
</label>
```

---

## 2. Text Input

```css
.form-input {
  display: block;
  width: 100%;
  min-height: var(--form-height-md);
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--weight-regular);
  color: var(--form-text);
  background-color: var(--form-bg);
  border: 1.5px solid var(--form-border);
  border-radius: var(--form-radius);
  line-height: var(--leading-normal);
  transition:
    border-color var(--duration-fast) var(--ease-out),
    box-shadow   var(--duration-fast) var(--ease-out),
    background-color var(--duration-fast) var(--ease-out);
  appearance: none;
  -webkit-appearance: none;
}

.form-input::placeholder {
  color: var(--form-placeholder);
}

.form-input:hover:not(:disabled):not(:focus) {
  border-color: var(--color-border-strong);
  background-color: var(--color-surface);
}

.form-input:focus {
  outline: none;
  border-color: var(--form-border-focus);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.20);
  background-color: var(--color-surface);
}

.form-input:disabled {
  opacity: 0.50;
  cursor: not-allowed;
  background-color: var(--form-bg-disabled);
}

/* Validation states */
.form-input--error {
  border-color: var(--form-border-error);
}
.form-input--error:focus {
  border-color: var(--form-border-error);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
}

.form-input--success {
  border-color: var(--form-border-success);
}
.form-input--success:focus {
  border-color: var(--form-border-success);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
}

/* Sizes */
.form-input--sm { min-height: var(--form-height-sm); font-size: var(--text-sm); padding: var(--space-2) var(--space-3); }
.form-input--lg { min-height: var(--form-height-lg); font-size: var(--text-lg); padding: var(--space-4) var(--space-5); }
```

---

## 3. Textarea

```css
.form-textarea {
  /* Inherits all .form-input rules, plus: */
  min-height: 120px;
  height: auto;
  resize: vertical;
  line-height: var(--leading-relaxed);
  padding-top: var(--space-3);
}

/* Prevent horizontal resize — breaks layouts */
.form-textarea {
  resize: vertical;
  min-height: 120px;
  max-height: 400px;
}
```

```html
<div class="form-group">
  <label for="message" class="form-label">Message</label>
  <textarea
    id="message"
    name="message"
    class="form-input form-textarea"
    rows="5"
    placeholder="Tell us about your project..."
  ></textarea>
</div>
```

---

## 4. Select Dropdown

```css
.form-select {
  /* Inherits .form-input */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23F0EFE9' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-3) center;
  background-size: 16px;
  padding-right: var(--space-10);
  cursor: pointer;
}
```

```html
<div class="form-group">
  <label for="service" class="form-label">Service Interest</label>
  <select id="service" name="service" class="form-input form-select">
    <option value="" disabled selected>Select a service…</option>
    <option value="web-design">Website Design</option>
    <option value="seo">SEO & Content</option>
    <option value="branding">Brand Identity</option>
    <option value="maintenance">Website Maintenance</option>
  </select>
</div>
```

---

## 5. Checkbox

```css
.form-checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  cursor: pointer;
}

.form-checkbox {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  cursor: pointer;
}

.form-checkbox-indicator {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 2px; /* optical alignment with label */
  border: 1.5px solid var(--form-border);
  border-radius: var(--radius-sm);
  background-color: var(--form-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color var(--duration-instant) var(--ease-out),
    border-color     var(--duration-instant) var(--ease-out);
}

.form-checkbox-indicator svg {
  width: 12px;
  height: 12px;
  stroke: var(--color-bg);
  opacity: 0;
  transform: scale(0.5);
  transition:
    opacity   var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-spring);
}

/* Checked state */
.form-checkbox:checked + .form-checkbox-indicator {
  background-color: var(--color-brand-gold);
  border-color:     var(--color-brand-gold);
}

.form-checkbox:checked + .form-checkbox-indicator svg {
  opacity: 1;
  transform: scale(1);
}

/* Focus state */
.form-checkbox:focus-visible + .form-checkbox-indicator {
  outline: 2px solid var(--color-brand-gold);
  outline-offset: 3px;
}

/* Hover */
.form-checkbox-group:hover .form-checkbox-indicator {
  border-color: var(--color-brand-gold);
}

.form-checkbox-label {
  font-size: var(--text-sm);
  color: var(--color-text);
  line-height: var(--leading-normal);
}
```

```html
<label class="form-checkbox-group">
  <input type="checkbox" class="form-checkbox" name="agree" id="agree" required />
  <span class="form-checkbox-indicator">
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  </span>
  <span class="form-checkbox-label">
    I agree to the <a href="/terms">terms and conditions</a>
  </span>
</label>
```

---

## 6. Radio Button

```css
.form-radio-group {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  cursor: pointer;
}

.form-radio {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.form-radio-indicator {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 2px;
  border: 1.5px solid var(--form-border);
  border-radius: var(--radius-full);
  background-color: var(--form-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    border-color     var(--duration-instant) var(--ease-out),
    background-color var(--duration-instant) var(--ease-out);
}

.form-radio-indicator::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background-color: var(--color-bg);
  opacity: 0;
  transform: scale(0);
  transition:
    opacity   var(--duration-fast) var(--ease-out),
    transform var(--duration-fast) var(--ease-spring);
}

.form-radio:checked + .form-radio-indicator {
  background-color: var(--color-brand-gold);
  border-color:     var(--color-brand-gold);
}

.form-radio:checked + .form-radio-indicator::after {
  opacity: 1;
  transform: scale(1);
}

.form-radio:focus-visible + .form-radio-indicator {
  outline: 2px solid var(--color-brand-gold);
  outline-offset: 3px;
}
```

---

## 7. Helper Text & Error Messages

```css
.form-helper {
  display: block;
  font-size: var(--text-xs);
  color: var(--form-helper-color);
  margin-top: var(--space-2);
  line-height: var(--leading-normal);
}

.form-error {
  display: flex;
  align-items: flex-start;
  gap: var(--space-1);
  font-size: var(--text-xs);
  color: var(--form-error-color);
  margin-top: var(--space-2);
  line-height: var(--leading-normal);
}

.form-error svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  margin-top: 1px;
}

.form-success-message {
  display: flex;
  align-items: flex-start;
  gap: var(--space-1);
  font-size: var(--text-xs);
  color: var(--form-success-color);
  margin-top: var(--space-2);
}
```

```html
<!-- Error state -->
<div class="form-group">
  <label for="email" class="form-label">Email address <span class="required-mark" aria-hidden="true">*</span></label>
  <input
    type="email"
    id="email"
    name="email"
    class="form-input form-input--error"
    aria-invalid="true"
    aria-describedby="email-error"
    value="notanemail"
  />
  <span class="form-error" id="email-error" role="alert">
    <svg aria-hidden="true"><!-- exclamation icon --></svg>
    Please enter a valid email address.
  </span>
</div>
```

---

## 8. Form Group & Layout

```css
.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--space-5);
}

.form-group:last-child {
  margin-bottom: 0;
}

/* Two-column form grid */
.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-5);
}

@media (min-width: 640px) {
  .form-grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Full-width span in 2-col grid */
.form-group--full {
  grid-column: 1 / -1;
}
```

---

## 9. Form-Level States

### Form Success (After Submission)

```html
<div class="form-success-state" role="status" aria-live="polite">
  <div class="form-success-icon">
    <svg aria-hidden="true"><!-- check circle icon --></svg>
  </div>
  <h3 class="form-success-title">Message Sent!</h3>
  <p class="form-success-body">We'll be in touch within 1 business day.</p>
</div>
```

```css
.form-success-state {
  text-align: center;
  padding: var(--space-10) var(--space-6);
  background: var(--color-success-subtle);
  border: 1px solid var(--color-success);
  border-radius: var(--radius-lg);
}

.form-success-icon svg {
  width: 48px;
  height: 48px;
  color: var(--color-success);
  margin-bottom: var(--space-4);
}

.form-success-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  color: var(--color-text);
  margin-bottom: var(--space-2);
}

.form-success-body {
  font-size: var(--text-base);
  color: var(--color-text-muted);
}
```

---

## 10. Inline Validation Rules

- **Validate on blur**, not on keypress (avoids premature error messages)
- **Re-validate on change** after a field has been errored (real-time error clearing)
- **Never disable the submit button** as a validation gate — validate and show errors on submit attempt
- **Error messages appear below the field** they describe — never as a list above the form
- **Required fields:** Marked with `*` (visual) + `aria-required="true"` or native `required` (semantic)
- **Success state:** Show per-field success icon only on critical fields (email, phone). Not on every field.

---

## 11. Mobile Input Rules

| Input Type | Mobile Keyboard Attribute |
|------------|-------------------------|
| Email | `type="email"` — triggers email keyboard |
| Phone | `type="tel"` — triggers numeric keyboard |
| URL | `type="url"` — triggers URL keyboard |
| Number | `type="number"` or `inputmode="numeric"` |
| Search | `type="search"` — shows search keyboard |
| Currency | `inputmode="decimal"` |

**Autocomplete:** Always provide `autocomplete` attributes:

```html
<input type="text"  name="name"  autocomplete="name" />
<input type="email" name="email" autocomplete="email" />
<input type="tel"   name="phone" autocomplete="tel" />
<input type="text"  name="company" autocomplete="organization" />
```

---

## 12. Contact Form Complete Pattern

```html
<form class="form" id="contact-form" novalidate>
  <div class="form-grid-2">
    <div class="form-group">
      <label for="first-name" class="form-label">
        First name <span class="required-mark" aria-hidden="true">*</span>
        <span class="sr-only">(required)</span>
      </label>
      <input type="text" id="first-name" name="first_name" class="form-input"
        autocomplete="given-name" required />
    </div>
    <div class="form-group">
      <label for="last-name" class="form-label">Last name</label>
      <input type="text" id="last-name" name="last_name" class="form-input"
        autocomplete="family-name" />
    </div>
    <div class="form-group form-group--full">
      <label for="email" class="form-label">
        Email address <span class="required-mark" aria-hidden="true">*</span>
        <span class="sr-only">(required)</span>
      </label>
      <input type="email" id="email" name="email" class="form-input"
        autocomplete="email" required />
    </div>
    <div class="form-group form-group--full">
      <label for="service" class="form-label">Service Interest</label>
      <select id="service" name="service" class="form-input form-select">
        <option value="" disabled selected>Select a service…</option>
        <option value="web-design">Website Design</option>
        <option value="seo">SEO</option>
        <option value="branding">Brand Identity</option>
      </select>
    </div>
    <div class="form-group form-group--full">
      <label for="message" class="form-label">
        Message <span class="required-mark" aria-hidden="true">*</span>
        <span class="sr-only">(required)</span>
      </label>
      <textarea id="message" name="message" class="form-input form-textarea"
        rows="5" placeholder="Tell us about your project..." required></textarea>
    </div>
  </div>

  <div aria-live="polite" class="sr-only" id="form-status"></div>

  <div class="form-group" style="margin-top: var(--space-6);">
    <button type="submit" class="btn btn--primary btn--lg btn--full">
      Send Message
    </button>
  </div>
</form>
```

---

## Related Documents
- `docs/design-system-engine/ButtonSystem.md` — Submit button variants
- `docs/design-system-engine/AccessibilitySystem.md` — Form accessibility requirements
- `docs/design-system-engine/StateSystem.md` — Loading and success states
- `docs/design-system-engine/ResponsiveBehaviorSystem.md` — Mobile input behavior
