# Hero System
**Roman Creative Studio — Design System Engine**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

Define all hero section patterns used across RCS websites. The hero is the first thing a visitor sees — it must immediately communicate value, establish brand authority, and direct the user toward action. Every hero variant is defined here as a reusable structure.

---

## Hero Architecture

Every hero is composed of:

```
Section (.section.section--hero)
  └── Container (.container)
        └── Hero wrapper (.hero)
              ├── Eyebrow label  (optional)
              ├── Headline H1   (required)
              ├── Subheadline   (optional)
              ├── CTA group     (required)
              └── Visual element (optional, variant-dependent)
```

---

## Base Hero CSS

```css
.hero {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--color-brand-gold);
  background-color: var(--color-brand-gold-subtle);
  border: 1px solid var(--color-border-brand);
  border-radius: var(--radius-full);
  padding: var(--space-1) var(--space-3);
  width: fit-content;
}

.hero-headline {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: 600;
  color: var(--color-text);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tighter);
  max-width: 18ch;
}

@media (min-width: 768px) {
  .hero-headline { font-size: var(--text-5xl); }
}

@media (min-width: 1024px) {
  .hero-headline { font-size: var(--text-display); }
}

/* Gold highlight within headline */
.hero-headline .highlight {
  color: var(--color-brand-gold);
}

.hero-subheadline {
  font-size: var(--text-lg);
  color: var(--color-text-muted);
  line-height: var(--leading-relaxed);
  max-width: 55ch;
}

@media (min-width: 768px) {
  .hero-subheadline { font-size: var(--text-xl); }
}

.hero-cta-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: flex-start;
}

@media (min-width: 480px) {
  .hero-cta-group {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
}

.hero-trust {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-text-subtle);
}

.hero-trust-avatars {
  display: flex;
}

.hero-trust-avatars .avatar {
  margin-left: -8px;
  border: 2px solid var(--color-bg);
}

.hero-trust-avatars .avatar:first-child {
  margin-left: 0;
}
```

---

## Variant 1: Centered Hero

**Use for:** Homepage, about page, generic landing pages.

```css
.hero--centered {
  align-items: center;
  text-align: center;
}

.hero--centered .hero-headline { max-width: 22ch; }
.hero--centered .hero-subheadline { max-width: 60ch; }

.hero--centered .hero-cta-group {
  justify-content: center;
}

.hero--centered .hero-trust {
  justify-content: center;
}
```

```html
<section class="section section--hero section--bg-default">
  <div class="container">
    <div class="hero hero--centered">
      <span class="hero-eyebrow">
        <svg aria-hidden="true" width="12" height="12"><!-- star/spark icon --></svg>
        Web Design Agency
      </span>

      <h1 class="hero-headline">
        Websites That <span class="highlight">Build Trust</span> and Drive Growth
      </h1>

      <p class="hero-subheadline">
        Roman Creative Studio builds premium, conversion-focused websites for businesses ready to grow. Strategy, design, and technology — in one studio.
      </p>

      <div class="hero-cta-group">
        <a href="/contact" class="btn btn--primary btn--lg">Book a Free Discovery Call</a>
        <a href="/work" class="btn btn--ghost btn--lg">View Our Work</a>
      </div>

      <div class="hero-trust">
        <div class="hero-trust-avatars">
          <div class="avatar avatar--sm"><img src="client-1.jpg" alt="" /></div>
          <div class="avatar avatar--sm"><img src="client-2.jpg" alt="" /></div>
          <div class="avatar avatar--sm"><img src="client-3.jpg" alt="" /></div>
        </div>
        <span>Trusted by 50+ businesses</span>
      </div>
    </div>
  </div>
</section>
```

---

## Variant 2: Split Hero

**Use for:** Service pages, feature-focused pages with a strong visual element.

```css
.hero--split {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-10);
  align-items: center;
}

@media (min-width: 1024px) {
  .hero--split {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-16);
  }
}

.hero--split .hero-content { /* left column */ }

.hero--split .hero-visual {
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xl);
}

.hero--split .hero-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  aspect-ratio: 4 / 3;
}

/* Reverse: visual left, text right */
.hero--split-reverse .hero-content {
  order: 1;
}
@media (min-width: 1024px) {
  .hero--split-reverse .hero-content { order: 0; }
}
```

---

## Variant 3: Image Background Hero

**Use for:** Portfolio, case study headers, dramatic industry landing pages.

```css
.hero--image {
  position: relative;
  min-height: 560px;
  align-items: flex-end;
  justify-content: flex-start;
  padding-bottom: var(--space-16);
  overflow: hidden;
  border-radius: var(--radius-2xl);
}

.hero--image .hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 0;
  transition: transform var(--duration-deliberate) var(--ease-out);
}

.hero--image:hover .hero-bg {
  transform: scale(1.02);
}

.hero--image .hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(12, 14, 17, 0.90) 40%,
    rgba(12, 14, 17, 0.40) 70%,
    rgba(12, 14, 17, 0.10)
  );
  z-index: 1;
}

.hero--image .hero-content {
  position: relative;
  z-index: 2;
  max-width: 640px;
}

@media (prefers-reduced-motion: reduce) {
  .hero--image:hover .hero-bg { transform: none; }
}
```

---

## Variant 4: Minimal Hero

**Use for:** Blog listing, simple interior pages, contact page.

```css
.hero--minimal {
  padding-block: var(--space-12);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 0;
}

.hero--minimal .hero-headline {
  font-size: var(--text-3xl);
  max-width: none;
}

@media (min-width: 768px) {
  .hero--minimal .hero-headline { font-size: var(--text-4xl); }
}

.hero--minimal .hero-subheadline {
  font-size: var(--text-base);
}
```

---

## Variant 5: Conversion Hero

**Use for:** High-intent landing pages, campaign pages, pricing page header.

```css
.hero--conversion {
  align-items: center;
  text-align: center;
}

.hero--conversion .hero-headline {
  max-width: 20ch;
  font-size: var(--text-5xl);
}

@media (min-width: 1024px) {
  .hero--conversion .hero-headline { font-size: var(--text-display); }
}

.hero--conversion .hero-cta-group {
  justify-content: center;
}

/* Inline form variant */
.hero--conversion .hero-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
  max-width: 480px;
  margin-inline: auto;
}

@media (min-width: 480px) {
  .hero--conversion .hero-form {
    flex-direction: row;
  }

  .hero--conversion .hero-form .form-input {
    flex: 1;
  }
}
```

---

## Headline Hierarchy Rules

| Rule | Specification |
|------|---------------|
| Always H1 | The hero headline is always an `<h1>`. One per page. |
| Max line length | 18–22 characters for centered; 15–18 for split |
| Highlight word | Maximum 2–3 words in gold highlight per headline |
| Eyebrow label | Optional. Always all-caps Inter. Always gold. |
| Subheadline | Maximum 2 sentences. Explains the H1, doesn't repeat it. |

## CTA Placement Rules

| Rule | Specification |
|------|---------------|
| Primary CTA | Always first, always `.btn--primary` |
| Secondary CTA | Optional. Always `.btn--ghost` or `.btn--secondary` |
| Max CTAs in hero | 2. More than 2 creates decision paralysis. |
| Mobile CTA | Full-width at mobile breakpoint |
| CTA gap | `--space-3` between buttons |

---

## Related Documents
- `docs/design-system-engine/LayoutSystem.md` — Section and container classes
- `docs/design-system-engine/ButtonSystem.md` — CTA button specs
- `docs/visual-identity/TypographySystem.md` — Display type at hero scale
- `docs/visual-identity/PhotographySystem.md` — Background image direction
