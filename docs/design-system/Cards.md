# Cards

## Card Philosophy

Cards group related content and create visual hierarchy on information-dense pages. At Roman Creative Studio, cards should feel **premium and spacious** — not cluttered or template-like.

---

## Card Variants

### Service Card
Used on the homepage and service overview pages to present what we do.

**Structure:**
- Icon container (48px, gold tinted background)
- Heading
- Description
- Optional: CTA link

**Key styles:**
```css
.service-card {
  background: var(--color-surface);    /* #1B1E23 */
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.service-card:hover {
  border-color: rgba(212,175,55,0.35);
  box-shadow: 0 8px 32px rgba(0,0,0,0.30);
}
```

### Portfolio / Work Card
Displays a project thumbnail with title and industry tag.

**Structure:**
- Image (aspect ratio: 16:9 or 4:3)
- Industry tag (badge)
- Project title
- Brief description
- View project link

### Testimonial Card
Dark card with quote, attribution, and avatar or initials.

**Structure:**
- Quote marks (decorative gold `“`)
- Quote text
- Avatar circle (gold background, dark initials)
- Name + title / company

### Pricing Card
Must clearly communicate value at each tier.

**Structure:**
- Tier name
- Price (large display size)
- Description
- Feature list (checkmarks)
- CTA button
- "Most popular" badge on featured tier

### Industry / Audience Card
For "Who We Serve" grids.

**Structure:**
- Icon or emoji
- Industry name
- 1-line description
- Optional: link to industry page

---

## Grid Layouts

| Card Type | Desktop Columns | Tablet | Mobile |
|-----------|----------------|--------|--------|
| Service cards | 3 | 2 | 1 |
| Portfolio cards | 3 | 2 | 1 |
| Testimonial cards | 3 | 2 | 1 |
| Pricing cards | 3 | 2 | 1 |
| Industry cards | 4 | 3 | 2 |

---

## Accessibility

- Cards with links: entire card should be clickable (use a positioned `<a>` overlay or `::after` technique)
- Images in cards must have descriptive `alt` text
- Do not nest interactive elements inside an already-interactive card
- Hover effects should not be the only indicator of interactivity — use visible borders or focus styles

---

## What Not to Do

- Don't use white or light backgrounds for cards (breaks dark theme)
- Don't use drop shadows that are too heavy — cards should feel elevated, not floating
- Don't mix card sizes within the same grid
- Don't cram too much content into a card — if it needs more than 4 lines of body text, reconsider the design
