# Hero Sections

## Hero Philosophy

The hero section is the most important real estate on any page. It has one job: communicate who we are and what we do clearly enough that the right visitor immediately understands they're in the right place — and wants to go further.

**The hero makes one promise. The rest of the page keeps it.**

---

## Homepage Hero (Dark Theme)

### Structure
```html
<section class="hero hero-dark">
  <div class="container">
    <div class="hero-badge"><!-- small category label --></div>
    <h1 class="hero-heading">We Build Digital Experiences<br>
      That <em style="color:#D4AF37!important;">Grow</em> Businesses
    </h1>
    <p class="hero-sub"><!-- supporting copy --></p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="/contact">Start Your Project</a>
      <a class="btn btn-secondary" href="/portfolio">View Our Work</a>
    </div>
    <!-- optional: trust bar / social proof -->
  </div>
</section>
```

### Key Styles
```css
.hero-dark {
  background: #0C0E11;
  padding: var(--space-32) 0 var(--space-20);
}

.hero-heading {
  color: #ffffff !important;
  font-weight: 800;
  font-size: var(--text-6xl);  /* scales down on mobile */
  line-height: var(--leading-tight);
}

.hero-heading em {
  color: #D4AF37 !important;
  font-style: italic;
}

.hero-sub {
  color: rgba(255,255,255,0.85) !important;
  font-size: var(--text-xl);
  max-width: 640px;
}
```

---

## Hero Variants

### Centered Hero
For pages with a single focused message (pricing, contact, about).
- Text centered
- No split layout
- CTA buttons centered below heading

### Split Hero (Future)
For pages where a visual/image adds context (portfolio, case study, specific industry).
- 60/40 split: text left, image right
- Image should relate directly to the heading promise

### Industry Page Hero
For service/industry pages (`services/dentist-websites.html`, etc.):
- Industry-specific headline targeting the client's primary pain or goal
- Shorter, more specific than homepage hero
- Single primary CTA (usually "Book a Call" or "Get a Free Audit")

---

## What Not to Do

- Do not use `-webkit-text-stroke` or `text-stroke` for outline effects (removed)
- Do not use more than two CTA buttons in a hero
- Do not use hero images as decorative backgrounds without sufficient contrast
- Do not write hero headings over 12 words
- Do not put form fields directly in the hero (reduces focus)

---

## Responsive

| Breakpoint | Heading Size | Padding |
|------------|-------------|------|
| Desktop (1200px+) | `--text-6xl` (60px) | `128px top` |
| Tablet (768px–12px) | `--text-5xl` (48px) | `80px top` |
| Mobile (<768px) | `--text-4xl` (36px) | `64px top` |

---

## SEO Notes

- Every page has exactly **one `<h1>`** — always in the hero
- The `<h1>` should contain the primary keyword for the page
- Hero badge/label text should not be an `<h2>` — use `<span>` or `<p>` to preserve heading hierarchy
