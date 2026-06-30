# Card System
**Roman Creative Studio — Design System Engine**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

Define a complete, reusable card architecture. Cards are the primary content container across all RCS websites — used for services, features, testimonials, blog posts, pricing, and more. Every card type shares a base and extends it with a semantic modifier.

---

## Base Card Architecture

```css
/* ============================================================
   BASE CARD
============================================================ */
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  transition:
    transform        var(--duration-normal) var(--ease-out),
    box-shadow       var(--duration-normal) var(--ease-out),
    border-color     var(--duration-normal) var(--ease-out);
}

/* Hover elevation — applies to all interactive cards */
.card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-border-strong);
}

/* Brand hover — gold border on hover */
.card--hoverable-brand:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-brand-md);
  border-color: var(--color-border-brand);
}

/* Elevated surface */
.card--elevated {
  background-color: var(--color-surface-elevated);
}

/* Featured — gold border always visible */
.card--featured {
  border-color: var(--color-border-brand);
  box-shadow: var(--shadow-brand-sm);
}

/* Clickable card — entire card is a link */
.card--clickable {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.card--clickable:focus-visible {
  outline: 2px solid var(--color-brand-gold);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .card { transition: none; }
  .card--hoverable:hover,
  .card--hoverable-brand:hover { transform: none; }
}
```

---

## 1. Service Card

**Purpose:** Display a single service offering with icon, title, description, and optional CTA link.

```css
.card--service {
  gap: var(--space-5);
}

.card--service .card-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background-color: var(--color-brand-gold-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background-color var(--duration-normal) var(--ease-out),
              box-shadow       var(--duration-normal) var(--ease-out);
}

.card--service .card-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-brand-gold);
  stroke-width: 1.5;
}

.card--service:hover .card-icon {
  background-color: rgba(212, 175, 55, 0.20);
  box-shadow: var(--shadow-brand-sm);
}

.card--service .card-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text);
  line-height: var(--leading-tight);
}

.card--service .card-body {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: var(--leading-relaxed);
  flex: 1;
}

.card--service .card-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-brand-gold);
  text-decoration: none;
  margin-top: auto;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
  transition: gap var(--duration-fast) var(--ease-out);
}

.card--service .card-link:hover { gap: var(--space-2); }
```

```html
<article class="card card--service card--hoverable-brand">
  <div class="card-icon">
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
    </svg>
  </div>
  <h3 class="card-title">Web Design</h3>
  <p class="card-body">Custom websites built for performance, conversion, and your specific industry.</p>
  <a href="/services/web-design" class="card-link">
    Learn more
    <svg aria-hidden="true" width="14" height="14" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  </a>
</article>
```

---

## 2. Feature Card

**Purpose:** Highlight a single feature or value proposition. Typically used in 3–4 column grids.

```css
.card--feature {
  align-items: center;
  text-align: center;
  gap: var(--space-4);
  padding: var(--space-8) var(--space-6);
}

.card--feature .card-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-xl);
  background-color: var(--color-brand-gold-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-inline: auto;
}

.card--feature .card-icon svg {
  width: 28px;
  height: 28px;
  color: var(--color-brand-gold);
}

.card--feature .card-title {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
  color: var(--color-text);
}

.card--feature .card-body {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: var(--leading-relaxed);
}
```

---

## 3. Testimonial Card

**Purpose:** Display a client testimonial with quote, avatar, name, and attribution.

```css
.card--testimonial {
  gap: var(--space-5);
  position: relative;
}

.card--testimonial .card-quote-mark {
  font-family: var(--font-display);
  font-size: 64px;
  line-height: 1;
  color: var(--color-brand-gold);
  opacity: 0.40;
  position: absolute;
  top: var(--space-4);
  right: var(--space-6);
  pointer-events: none;
  select: none;
}

.card--testimonial .card-quote {
  font-size: var(--text-base);
  color: var(--color-text);
  line-height: var(--leading-relaxed);
  font-style: italic;
  flex: 1;
}

.card--testimonial .card-stars {
  display: flex;
  gap: var(--space-1);
}

.card--testimonial .card-stars svg {
  width: 16px;
  height: 16px;
  color: var(--color-brand-gold);
  fill: var(--color-brand-gold);
}

.card--testimonial .card-author {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}

.card--testimonial .card-author-name {
  font-weight: var(--weight-semibold);
  font-size: var(--text-sm);
  color: var(--color-text);
}

.card--testimonial .card-author-role {
  font-size: var(--text-xs);
  color: var(--color-text-subtle);
}
```

```html
<figure class="card card--testimonial">
  <span class="card-quote-mark" aria-hidden="true">“</span>
  <div class="card-stars" aria-label="5 out of 5 stars">
    <!-- 5 star SVGs -->
  </div>
  <blockquote class="card-quote">
    <p>Working with Roman Creative Studio completely transformed our online presence. We saw a 40% increase in calls within the first month.</p>
  </blockquote>
  <figcaption class="card-author">
    <div class="avatar avatar--md">
      <img src="/assets/images/clients/dr-smith.jpg" alt="Dr. Sarah Smith" />
    </div>
    <div>
      <p class="card-author-name">Dr. Sarah Smith</p>
      <p class="card-author-role">Owner, Smith Family Dental</p>
    </div>
  </figcaption>
</figure>
```

---

## 4. Pricing Card

**Purpose:** Present a pricing tier with name, price, features list, and CTA.

```css
.card--pricing {
  gap: var(--space-6);
}

.card--pricing .card-tier {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--color-brand-gold);
}

.card--pricing .card-price {
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
}

.card--pricing .card-price-amount {
  font-family: var(--font-display);
  font-size: var(--text-5xl);
  font-weight: 700;
  color: var(--color-text);
  line-height: 1;
}

.card--pricing .card-price-period {
  font-size: var(--text-sm);
  color: var(--color-text-subtle);
}

.card--pricing .card-features {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  flex: 1;
  list-style: none;
  margin: 0;
  padding: 0;
}

.card--pricing .card-feature-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.card--pricing .card-feature-item svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--color-success);
  margin-top: 2px;
}

.card--pricing .card-cta {
  margin-top: auto;
}

/* Featured pricing card — most popular */
.card--pricing.card--featured .card-tier {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.card--pricing.card--featured .card-badge {
  font-size: var(--text-xs);
  background: var(--color-brand-gold);
  color: var(--color-bg);
  padding: 2px var(--space-2);
  border-radius: var(--radius-full);
  font-weight: var(--weight-semibold);
}
```

---

## 5. Blog Card

**Purpose:** Display a blog post with thumbnail, category, title, excerpt, and metadata.

```css
.card--blog {
  gap: 0;
  padding: 0;
  overflow: hidden;
}

.card--blog .card-thumbnail {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.card--blog .card-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-slow) var(--ease-out);
}

.card--blog:hover .card-thumbnail img {
  transform: scale(1.03);
}

.card--blog .card-content {
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  flex: 1;
}

.card--blog .card-category {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-wider);
  text-transform: uppercase;
  color: var(--color-brand-gold);
}

.card--blog .card-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text);
  line-height: var(--leading-tight);
}

.card--blog .card-excerpt {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: var(--leading-relaxed);
  flex: 1;
}

.card--blog .card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--text-xs);
  color: var(--color-text-subtle);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}
```

---

## 6. Industry/Location Card

**Purpose:** Link to an industry-specific or location-specific service page.

```css
.card--industry {
  position: relative;
  overflow: hidden;
  min-height: 200px;
  justify-content: flex-end;
  padding: var(--space-6);
  gap: var(--space-2);
}

.card--industry .card-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: transform var(--duration-slow) var(--ease-out);
}

.card--industry:hover .card-bg {
  transform: scale(1.04);
}

.card--industry::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(12,14,17,0.90) 40%, rgba(12,14,17,0.20));
  z-index: 1;
}

.card--industry .card-content {
  position: relative;
  z-index: 2;
}

.card--industry .card-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  color: var(--color-text);
}

.card--industry .card-subtitle {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}
```

---

## Card Grid Patterns

```css
/* Standard card grids */
.card-grid-2 { display: grid; grid-template-columns: 1fr; gap: var(--space-5); }
.card-grid-3 { display: grid; grid-template-columns: 1fr; gap: var(--space-5); }
.card-grid-4 { display: grid; grid-template-columns: 1fr; gap: var(--space-5); }

@media (min-width: 640px) {
  .card-grid-2 { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 768px) {
  .card-grid-3 { grid-template-columns: repeat(2, 1fr); }
  .card-grid-4 { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .card-grid-3 { grid-template-columns: repeat(3, 1fr); }
  .card-grid-4 { grid-template-columns: repeat(4, 1fr); }
}
```

---

## Card Rules

| Rule | Specification |
|------|---------------|
| Base padding | `--space-6` (24px) standard, `--space-8` for featured |
| Border radius | `--radius-lg` (12px) — never vary |
| Hover lift | `translateY(-2px)` — standard for all hoverable cards |
| Clickable cards | Use `<a>` or `<article>` with nested `<a>`. Never make div clickable. |
| Fixed height | Never. Cards grow to fit content. |
| Image aspect ratio | 16:9 for blog cards. Square (1:1) for team/avatar. Cover fit always. |
| Max one featured | Only one `.card--featured` in a pricing grid per section |

---

## Related Documents
- `docs/design-system-engine/LayoutSystem.md` — Grid patterns
- `docs/design-system-engine/StateSystem.md` — Skeleton loading for cards
- `docs/visual-identity/DesignLanguage.md` — Depth and elevation philosophy
