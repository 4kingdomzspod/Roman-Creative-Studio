# Forms

## Form Philosophy

Forms are conversion points. Every unnecessary field is a reason to abandon. Every confusing label is friction. Our forms should be **as short as possible, as clear as possible, and as trustworthy as possible**.

---

## Contact Form Standard

Minimum required fields:
1. Name
2. Email
3. Phone (optional — but include for high-intent leads)
4. Message / "Tell us about your project"

Avoid asking for: company size, budget (in the form), timeline, referral source — get these in the discovery call.

---

## Field Styles

```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-label {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text);
}

.form-input,
.form-textarea,
.form-select {
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  color: var(--color-text);
  font-size: var(--text-base);
  transition: border-color var(--transition-fast);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-brand);
  box-shadow: 0 0 0 3px rgba(212,175,55,0.15);
}
```

---

## Form Button

- Always a **primary gold button**
- Full width on mobile, auto width on desktop
- Copy: action-specific ("Send Message", "Book My Call", "Get My Free Audit")
- Show loading state during submission

---

## Validation

- Validate on blur (when user leaves field), not on every keystroke
- Error messages: below the field, red text, `aria-live="polite"`
- Success state: clear confirmation message (don't just reset the form silently)

```css
.form-error {
  color: #DC2626;
  font-size: var(--text-sm);
  margin-top: var(--space-1);
}

.form-input.has-error {
  border-color: #DC2626;
}
```

---

## Accessibility

- Every input **must** have a `<label>` element associated via `for` / `id`
- Never use `placeholder` as a substitute for a label
- `required` fields: add `aria-required="true"` and visible indicator (asterisk with legend)
- Form submission errors: announce via `role="alert"` or `aria-live` region
- Tab order must follow visual reading order

---

## Trust Signals Near Forms

Place these near every contact form:
- Privacy reassurance ("We never share your information")
- Response time expectation ("We respond within 1 business day")
- Social proof (small testimonial quote or star rating)
- What happens next ("After you submit, we'll schedule a 30-minute discovery call")
