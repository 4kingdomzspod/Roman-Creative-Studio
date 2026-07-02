# QA (Quality Assurance) System
## Roman Creative Studio — Phase 6, Document 8

---

### Purpose

Quality assurance is the final defense between a professional product and an embarrassing one. The QA phase happens internally — before the client ever sees the staging site. The goal is to deliver a staging site that needs minimal client-facing revisions because all technical and structural issues have already been resolved.

**Rule:** Nothing goes to the client before internal QA is 100% complete. No exceptions.

---

## Section 1 — QA Checklist

This checklist is completed on every project before the staging link is shared with the client. Every item must be checked and confirmed. Incomplete items are fixed before proceeding.

---

### Block 1: Responsive Behavior

**Test on:** Chrome DevTools (375px, 768px, 1024px, 1440px) + at least 1 physical mobile device

```
[ ] 320px — No horizontal scroll, all text readable, no overflow elements
[ ] 375px — iPhone standard: hero headline fits, CTA full-width, nav hamburger works
[ ] 414px — iPhone Plus: same checks
[ ] 768px — Tablet: grid layout transitions correct, nav switches to desktop
[ ] 1024px — Small desktop: full nav visible, all layouts stable
[ ] 1280px — Standard desktop: all intended layouts confirmed
[ ] 1440px — Wide desktop: no content overflow, max-width containers respected

[ ] No element overflows its container at any breakpoint
[ ] Images scale correctly at all breakpoints (no distortion)
[ ] Typography scale applies correctly at all breakpoints
[ ] Navigation hamburger opens/closes correctly on mobile
[ ] Mobile drawer: Escape key closes, focus trapped, outside click closes
[ ] All touch targets ≥ 44px on mobile
[ ] Forms: correct keyboard types triggered (email, tel, etc.)
[ ] Footer stacks correctly on mobile
```

---

### Block 2: Cross-Browser Testing

```
[ ] Chrome (latest) — desktop + mobile
[ ] Safari (latest) — desktop
[ ] Safari on iOS (latest) — mobile
[ ] Firefox (latest) — desktop
[ ] Edge (latest) — desktop

For each browser:
[ ] Layout renders correctly
[ ] Fonts load correctly
[ ] CSS custom properties (variables) work
[ ] Animations/transitions play correctly
[ ] Forms submit correctly
[ ] No console errors
```

---

### Block 3: Performance

**Tool:** Google PageSpeed Insights (pagespeed.web.dev)

```
[ ] Mobile LCP: < 2.5 seconds
[ ] Mobile CLS: < 0.1
[ ] Mobile INP: < 200ms
[ ] Desktop Performance Score: ≥ 90
[ ] Mobile Performance Score: ≥ 75

[ ] All images are WebP format (JPEG fallback for OG images only)
[ ] All images have explicit width + height attributes
[ ] Hero image has fetchpriority="high" and is NOT lazy-loaded
[ ] All below-fold images have loading="lazy"
[ ] No render-blocking scripts in <head>
[ ] JS files are deferred or loaded at end of body
[ ] CSS is minified (production build)
[ ] Total page weight < 1MB
[ ] Web fonts preloaded for critical weights
[ ] font-display: swap applied on all @font-face rules
```

---

### Block 4: Accessibility

**Tool:** Lighthouse Accessibility (target ≥ 95), plus manual keyboard test

```
[ ] Lighthouse Accessibility Score: ≥ 95
[ ] Skip link present and functional (visible on focus)
[ ] All images have descriptive alt text (decorative images: alt="")
[ ] All form inputs have associated <label> elements
[ ] Focus ring visible on all interactive elements
  (2px solid #D4AF37, outline-offset: 3px)
[ ] Heading hierarchy is correct: one H1, no skipped levels
[ ] Color contrast: all text/background combinations pass WCAG AA
  (4.5:1 for normal text, 3:1 for large text)
[ ] Keyboard navigation: Tab through entire page without mouse
  — all interactive elements reachable and operable
[ ] Mobile nav: ARIA attributes correct
  (aria-expanded, aria-controls, aria-label on hamburger)
[ ] Accordion (if present): aria-expanded + aria-controls correct
[ ] Modal (if present): role="dialog", aria-modal, focus trapped
[ ] prefers-reduced-motion: animations disabled when set
[ ] Language attribute on <html>: lang="en"
```

---

### Block 5: SEO Structure

```
[ ] Each page has a unique <title> tag (max 60 chars)
[ ] Each page has a unique <meta name="description"> (max 155 chars)
[ ] Each page has exactly one <h1> containing primary keyword
[ ] Heading hierarchy correct on all pages (H1 → H2 → H3)
[ ] All images have keyword-relevant, descriptive alt text
[ ] Canonical tag present on all pages
[ ] Open Graph tags present on all pages (og:title, og:description, og:image, og:url)
[ ] Twitter Card tags present
[ ] robots.txt present and correct
[ ] sitemap.xml present and includes all pages
[ ] sitemap.xml submitted to Google Search Console
[ ] JSON-LD structured data: LocalBusiness on homepage
[ ] JSON-LD structured data: Service on service pages
[ ] JSON-LD structured data: FAQPage on pages with FAQ sections
[ ] No noindex tags on pages that should be indexed
[ ] Internal links: no broken links, all anchors functional
[ ] URL structure: all lowercase, hyphens, trailing slash consistent
```

---

### Block 6: Functionality Testing

```
[ ] All navigation links work correctly
[ ] All footer links work correctly
[ ] All CTA buttons link to correct destinations
[ ] Contact form submits successfully
[ ] Contact form sends notification to Alexander@romancreativestudio.co
[ ] Form success state displays correctly
[ ] Form validation works: required fields flagged, email format validated
[ ] Any booking/Calendly integration loads correctly
[ ] Any third-party embeds load (Google Maps, YouTube, etc.)
[ ] 404 page exists and is branded
[ ] SSL certificate active (https:// on all pages)
[ ] No mixed content warnings (http:// assets on https:// pages)
[ ] No broken images (all src paths valid)
[ ] No console errors in browser developer tools
```

---

### Block 7: Design Consistency

```
[ ] All pages use only approved brand colors (from design tokens)
[ ] No hardcoded color values in CSS (all use var(--color-*))
[ ] No hardcoded spacing values (all use var(--space-*))
[ ] Typography hierarchy consistent across all pages
[ ] Cormorant Garamond used only at 30px+ for display/headings
[ ] Inter used for all body/UI text
[ ] Button styles consistent across all pages
[ ] Icon style consistent: Heroicons outline only, stroke-width: 1.5
[ ] Gold accent used once per section maximum
[ ] "One gold element per section" rule observed
[ ] Spacing rhythm consistent across all sections
[ ] Card styles consistent with design system
[ ] Focus ring style consistent across all interactive elements
```

---

### Block 8: Analytics & Tracking

```
[ ] Google Analytics 4 tag present and firing
[ ] GA4 test event received in DebugView
[ ] Google Search Console property created
[ ] sitemap.xml submitted to Search Console
[ ] Contact form submission tracked as GA4 event
[ ] Primary CTA click tracked as GA4 event
[ ] No duplicate analytics tags
```

---

### QA Sign-Off

```
QA COMPLETION RECORD

Project:          [Name]
Date completed:   [Date]
Completed by:     Alexander

All 8 blocks:     [ ] Complete
Issues found:     [Number]
Issues resolved:  [Number]

Blocks with zero issues:
  [ ] Responsive     [ ] Cross-browser    [ ] Performance
  [ ] Accessibility  [ ] SEO              [ ] Functionality
  [ ] Design         [ ] Analytics

Approved for client staging delivery:  [ ] YES
```

**If any block has unresolved issues: staging link is NOT sent. Issues are resolved first.**
