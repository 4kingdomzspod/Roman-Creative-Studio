# Coding Standards

## Philosophy

Code at Roman Creative Studio should be:
- **Readable** — another developer can understand it without explanation
- **Consistent** — naming, structure, and patterns are predictable
- **Accessible** — semantic HTML and ARIA where needed
- **Performant** — no unnecessary code, no unoptimized assets
- **Maintainable** — components are reusable; changes don't break other things

---

## HTML Standards

### Document Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title | Roman Creative Studio</title>
  <meta name="description" content="150-160 character description.">
  <!-- OG tags -->
  <!-- CSS -->
</head>
<body>
  <a href="#main-content" class="skip-nav">Skip to main content</a>
  <nav aria-label="Main navigation"><!-- nav --></nav>
  <main id="main-content"><!-- content --></main>
  <footer><!-- footer --></footer>
  <!-- JS at end of body -->
</body>
</html>
```

### Rules
- Use semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<header>`)
- One `<h1>` per page — always in the hero
- Heading order must be logical (h1 → h2 → h3, no skipping)
- All images: `alt`, `width`, `height` attributes required
- No inline styles for layout (use CSS classes)
- No `<br>` for spacing (use margins)
- No deprecated elements (`<center>`, `<font>`, `<b>` for styling)

---

## CSS Standards

### Token Usage
- **Always** use CSS custom properties from `tokens.css` for colors, spacing, typography, and radii
- Never hardcode values that have a token equivalent
- Exception: service pages currently use hardcoded values — migrating is a tracked task

### Naming (BEM-inspired, not strict BEM)
```css
/* Block */
.card {}

/* Element */
.card-title {}
.card-body {}
.card-footer {}

/* Modifier */
.card--featured {}
.card--large {}
```

### Organization Within Files
1. Custom properties / variables (if component-level)
2. Base / reset styles
3. Layout (display, grid, flex)
4. Spacing (padding, margin)
5. Typography (font, color, line-height)
6. Visual (background, border, shadow)
7. Interaction (hover, focus, active)
8. Responsive (media queries last)

### Media Queries
```css
/* Mobile first — base styles target mobile */
.component { /* mobile */ }

@media (min-width: 768px) { /* tablet */ }
@media (min-width: 1024px) { /* desktop */ }
@media (min-width: 1280px) { /* wide */ }
```

---

## JavaScript Standards

- Vanilla JS only (no frameworks for the current site)
- All JS in `assets/js/main.js` unless a page requires isolated scripts
- No inline `onclick` handlers — use `addEventListener`
- Use `const` and `let`; never `var`
- Descriptive function and variable names
- Comment complex logic; don't comment obvious operations

---

## File Naming

| Type | Convention | Example |
|------|-----------|--------|
| HTML pages | kebab-case | `dentist-websites.html` |
| CSS files | kebab-case | `components.css` |
| JS files | kebab-case | `main.js` |
| Images | kebab-case, descriptive | `founder-portrait.jpg` |
| Markdown docs | PascalCase | `BrandVoice.md` |

---

## Git Commit Message Format

```
type: short description (50 chars max)

Optional longer explanation if needed.
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Examples:
- `feat: add restaurant industry service page`
- `fix: correct mobile nav overflow on iOS Safari`
- `docs: update pricing philosophy`
- `perf: convert founder.jpg to WebP`
