# SEO Standards

## Every Page Must Have

- [ ] `<title>` tag: `{Page Title} | Roman Creative Studio` (50–60 chars)
- [ ] `<meta name="description">`: 150–160 characters, includes primary keyword
- [ ] One `<h1>` that includes the primary keyword
- [ ] Logical heading hierarchy (h1 → h2 → h3)
- [ ] All images with descriptive `alt` text
- [ ] Canonical URL (`<link rel="canonical" href="...">`) if there's any risk of duplicate content
- [ ] Open Graph tags (see below)

---

## Open Graph Tags (Required on All Pages)

```html
<meta property="og:title" content="Page Title | Roman Creative Studio">
<meta property="og:description" content="Page description (same as meta description is fine)">
<meta property="og:image" content="https://romancreativestudio.com/assets/images/og-image.jpg">
<meta property="og:url" content="https://romancreativestudio.com/page-url">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

**Action item:** Create a branded OG image (1200×630px) for use across all pages.

---

## Structured Data (JSON-LD)

### Homepage — LocalBusiness
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Roman Creative Studio",
  "description": "Premium digital agency helping businesses build, grow, and scale.",
  "url": "https://romancreativestudio.com",
  "email": "Alexander@romancreativestudio.co",
  "priceRange": "$$",
  "serviceArea": {"@type": "Country", "name": "US"}
}
```

### Service Pages — Service Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Dental Website Design",
  "provider": {"@type": "Organization", "name": "Roman Creative Studio"},
  "description": "Custom website design for dental practices."
}
```

---

## Technical SEO Checklist

- [ ] `sitemap.xml` exists and lists all public pages
- [ ] `robots.txt` exists with sitemap reference
- [ ] Google Search Console verified with sitemap submitted
- [ ] Google Analytics 4 tracking installed and verified
- [ ] No broken links (audit monthly)
- [ ] HTTPS active (SSL certificate current)
- [ ] Mobile-friendly (test with Google Mobile-Friendly Test)
- [ ] Core Web Vitals passing (Lighthouse score 85+ on mobile)
- [ ] No duplicate content or accidental index of staging URLs

---

## Page Speed Standards

| Metric | Target |
|--------|--------|
| Lighthouse Performance (mobile) | 85+ |
| LCP (Largest Contentful Paint) | < 2.5s |
| CLS (Cumulative Layout Shift) | < 0.1 |
| FID / INP (Interaction) | < 200ms |

Key optimizations:
- Convert all images to WebP with fallback
- Add `loading="lazy"` to below-fold images
- Add explicit `width` and `height` to all images
- Minify CSS in production (future)
- Serve from CDN (GitHub Pages provides this automatically)
