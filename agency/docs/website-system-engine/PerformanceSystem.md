# Performance System
## Roman Creative Studio — Phase 4, Document 10

---

### Why Performance = Conversion

Page speed is not a technical metric — it is a conversion metric.

- 53% of mobile visitors abandon a page that takes longer than 3 seconds to load (Google)
- A 1-second delay in page load time reduces conversions by 7% (Akamai)
- Core Web Vitals are a confirmed Google ranking factor since 2021
- A fast website signals professionalism — directly supporting the premium positioning of RCS

---

## Section 1 — Core Web Vitals Targets

| Metric | Definition | Target (Good) | Acceptable | Poor |
|---|---|---|---|---|
| LCP (Largest Contentful Paint) | Load time of largest visible element | < 2.5s | 2.5s–4.0s | > 4.0s |
| FID / INP (Interaction to Next Paint) | Response time to first interaction | < 200ms | 200–500ms | > 500ms |
| CLS (Cumulative Layout Shift) | Visual stability during load | < 0.1 | 0.1–0.25 | > 0.25 |
| TTFB (Time to First Byte) | Server response time | < 600ms | 600ms–1.8s | > 1.8s |

**RCS targets: all metrics in the "Good" range on both mobile and desktop.**

Verify monthly with:
- [PageSpeed Insights](https://pagespeed.web.dev)
- Google Search Console → Core Web Vitals report
- Lighthouse (Chrome DevTools)

---

## Section 2 — Image Optimization

Images are the #1 performance bottleneck on most websites. Every image optimization decision has a measurable impact.

### 2.1 Format Rules

| Image Type | Primary Format | Fallback |
|---|---|---|
| Photographs | WebP | JPEG |
| Graphics / illustrations | WebP | PNG |
| Logos | SVG | — |
| Icons | SVG inline | — |
| OG/social images | JPEG | — |
| Animated images | WebP (animated) | GIF (never for static) |

### 2.2 Compression Targets

| Use Case | Max File Size | Resolution |
|---|---|---|
| Hero image (full-width) | 200KB | 1440×810px max |
| Section background | 150KB | 1440px wide |
| Card thumbnail | 50KB | 800×450px |
| Team photo | 80KB | 600×600px |
| OG image | 100KB | 1200×630px |
| Logo (raster fallback) | 20KB | 400px wide |

**Compression tools:** Squoosh, ImageOptim, Sharp (Node.js)
**Target:** Smallest file size where quality degradation is not visible at display size

### 2.3 Responsive Images

```html
<picture>
  <source
    srcset="hero-480.webp 480w, hero-768.webp 768w, hero-1200.webp 1200w"
    sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px"
    type="image/webp">
  <img
    src="hero-1200.jpg"
    alt="[Descriptive alt text]"
    width="1200"
    height="675"
    loading="eager"
    fetchpriority="high">
</picture>
```

**Rules:**
- Hero images: `loading="eager"` + `fetchpriority="high"` (never lazy-load above the fold)
- All other images: `loading="lazy"`
- Always include `width` and `height` attributes (prevents CLS)
- Use `<picture>` for WebP with JPEG fallback

### 2.4 Image Delivery

For GitHub Pages (static hosting):
- Images are served from the same CDN as the HTML
- No additional image CDN needed at current scale
- All images stored in `/assets/images/` with organized subdirectories

If upgrading hosting:
- Consider Cloudflare Images or similar CDN for automatic format conversion

---

## Section 3 — CSS Performance

### 3.1 CSS Architecture Rules

The 4-layer CSS architecture from Phase 3 is already optimized:
```
tokens.css    → Custom properties only (no selectors)
base.css       → Element resets + global typography
layout.css     → Grid, container, section systems
components.css → Component patterns
```

**Performance rules:**
- Load all CSS in `<head>` via `<link rel="stylesheet">`
- No `@import` inside CSS files (creates render-blocking waterfall)
- Inline critical CSS for above-the-fold content (advanced optimization)
- No unused CSS in production — periodically audit and remove orphaned selectors

### 3.2 Critical CSS

For maximum LCP performance, inline the CSS required to render above-the-fold content:

```html
<head>
  <!-- Inline critical CSS (navbar + hero) -->
  <style>
    /* Paste minified navbar + hero CSS here */
    :root { --color-bg: #0C0E11; /* ... critical tokens ... */ }
    .navbar { ... }
    .hero { ... }
  </style>

  <!-- Load full CSS non-render-blocking -->
  <link rel="preload" href="/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/css/main.css"></noscript>
</head>
```

**Note:** This is an advanced optimization. Implement after site is live and baseline performance is measured.

---

## Section 4 — JavaScript Performance

### 4.1 JavaScript Rules

- RCS website uses **no JavaScript framework** (React, Vue, etc.) — vanilla JS only
- All JS must be `defer`red or loaded at end of `<body>`
- No synchronous `<script>` tags in `<head>` (render-blocking)

```html
<!-- In <head>: Only preloads, no scripts -->
<link rel="preload" href="/js/main.js" as="script">

<!-- At end of <body>: Load scripts deferred -->
<script src="/js/main.js" defer></script>
```

### 4.2 Third-Party Script Rules

Every third-party script adds load time. Treat each one as a performance cost:

| Script | Load Strategy | Notes |
|---|---|---|
| Google Analytics 4 | `async` in head | Minimal impact |
| Google Tag Manager | `async` in head | Audit tags regularly |
| Calendly embed | Load on click only | Never load full Calendly CSS on every page |
| Chat widget | Load after page interactive | Never block initial render |
| Social media embeds | `loading="lazy"` iframe | Never inline-load |

### 4.3 JavaScript File Organization

```
/js/
  main.js        → Bundled: navbar, scroll effects, form validation
  analytics.js   → Analytics initialization (async)
  calendly.js    → Calendly loader (loaded on CTA click)
```

**Rule:** No per-page inline `<script>` blocks for behavior logic. All JS is in external files.

---

## Section 5 — Font Loading Performance

### 5.1 Font Loading Strategy

```html
<head>
  <!-- Preload the most critical font weights -->
  <link rel="preload" href="/assets/fonts/cormorant-garamond-semibold.woff2"
        as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/inter-regular.woff2"
        as="font" type="font/woff2" crossorigin>
</head>
```

### 5.2 Font-Face Rules

```css
@font-face {
  font-family: 'Cormorant Garamond';
  src: url('/assets/fonts/cormorant-garamond-semibold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;  /* Show fallback font immediately, swap when loaded */
}

@font-face {
  font-family: 'Inter';
  src: url('/assets/fonts/inter-variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

**`font-display: swap`** prevents invisible text during font load (FOIT) — shows fallback system font immediately.

### 5.3 Font Subsetting

- Load only the character sets actually used
- For Latin-only content: add `unicode-range: U+0000-00FF` to `@font-face`
- Use variable fonts where available (Inter Variable) — one file, all weights

---

## Section 6 — Lazy Loading

### 6.1 What to Lazy Load

```html
<!-- Below-fold images -->
<img src="card-thumbnail.webp" loading="lazy" alt="..." width="800" height="450">

<!-- Below-fold iframes (maps, videos) -->
<iframe src="https://maps.google.com/..." loading="lazy" title="Office location"></iframe>
```

### 6.2 What NOT to Lazy Load

- Hero image (LCP element — must load immediately)
- Logo in navbar
- Any image visible in the first viewport without scrolling
- Critical CSS

### 6.3 JavaScript-Based Lazy Loading (IntersectionObserver)

For scroll animations and non-image elements:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
```

---

## Section 7 — HTML Performance

### 7.1 `<head>` Tag Order

The order of tags in `<head>` affects rendering performance:

```html
<head>
  <!-- 1. Charset and viewport FIRST (no dependencies) -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- 2. Title and meta -->
  <title>Page Title | Roman Creative Studio</title>
  <meta name="description" content="...">
  <link rel="canonical" href="...">

  <!-- 3. Preloads (before stylesheets) -->
  <link rel="preload" href="/assets/fonts/inter-variable.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/images/hero.webp" as="image">

  <!-- 4. Stylesheets -->
  <link rel="stylesheet" href="/css/main.css">

  <!-- 5. OG / Twitter meta -->
  <meta property="og:title" content="...">

  <!-- 6. Async scripts only -->
  <script async src="/js/analytics.js"></script>

  <!-- 7. Favicon -->
  <link rel="icon" href="/favicon.ico">
</head>
```

### 7.2 DOM Size Rules

- Maximum DOM nodes per page: 1500 (Google recommendation)
- Maximum DOM depth: 32 levels
- Avoid: Deeply nested div structures for visual layout only
- Use: Semantic HTML that naturally reduces nesting depth

---

## Section 8 — Performance Monitoring

### 8.1 Monthly Performance Audit

1. Run Lighthouse on homepage, top service page, top industry page
2. Record scores in a simple tracking document
3. Flag any Core Web Vital in "Needs Improvement" or "Poor" range
4. Identify largest contributor to LCP (usually hero image or render-blocking resource)
5. Fix and re-test

### 8.2 Performance Budget

| Asset | Budget |
|---|---|
| Total HTML | < 50KB per page |
| Total CSS | < 100KB (minified) |
| Total JS | < 150KB (minified + deferred) |
| Total images (per page) | < 600KB |
| Total page weight | < 1MB |
| Web fonts | < 100KB |

### 8.3 Performance Anti-Patterns

| Anti-Pattern | Impact | Fix |
|---|---|---|
| Hero image not preloaded | High LCP | Add `fetchpriority="high"` + preload link |
| No `width`/`height` on images | High CLS | Always include explicit dimensions |
| Synchronous `<script>` in `<head>` | Render blocking | Use `defer` or `async` |
| Loading full Calendly CSS on every page | +100KB+ | Load on click only |
| Multiple render-blocking stylesheets | Slow FCP | Consolidate into single CSS file |
| Unoptimized WebP images | Slow LCP | Compress with Squoosh / Sharp |
| `@import` in CSS | Waterfall delay | Use `<link>` in HTML instead |
