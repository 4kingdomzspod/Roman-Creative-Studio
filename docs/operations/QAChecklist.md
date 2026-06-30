# QA Checklist

Run this checklist before presenting any staging site to a client and before every production launch.

---

## Content
- [ ] All placeholder text replaced with real content
- [ ] Contact email correct: `Alexander@romancreativestudio.co`
- [ ] Website URL correct: `romancreativestudio.com`
- [ ] Phone number correct (if applicable)
- [ ] Business address correct (if applicable)
- [ ] Social links working and pointing to correct profiles
- [ ] No spelling or grammar errors (read every page)
- [ ] Dates and copyright year current

---

## Functionality
- [ ] All navigation links working
- [ ] All internal links working (no 404s)
- [ ] All external links opening in new tab with `rel="noopener"`
- [ ] Contact form submits successfully
- [ ] Form confirmation message displays correctly
- [ ] Form notification email received
- [ ] Booking embed loads and functions (if present)
- [ ] No JavaScript console errors

---

## Design
- [ ] Matches approved design at all breakpoints
- [ ] Logo displays correctly (72px, gold border, correct image)
- [ ] Brand colors correct (gold `#D4AF37`, charcoal `#0C0E11`)
- [ ] Typography consistent (no stray font families or sizes)
- [ ] No broken images
- [ ] All images optimized (< 150KB for hero, < 80KB for cards)
- [ ] Icons consistent in style and size

---

## Mobile
- [ ] Test at 375px width (iPhone SE)
- [ ] Test at 390px width (iPhone 14)
- [ ] Test at 768px width (iPad)
- [ ] Mobile nav opens and closes correctly
- [ ] All text readable without zooming
- [ ] All buttons meet 44px minimum tap target
- [ ] No horizontal scrollbar at any mobile size
- [ ] Forms usable on mobile keyboard

---

## Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest on Mac)
- [ ] Edge (latest)
- [ ] Safari on iOS (real device or BrowserStack)

---

## SEO
- [ ] Title tag present and correct on every page
- [ ] Meta description present and under 160 characters
- [ ] H1 present and correct (one per page)
- [ ] All images have alt text
- [ ] Canonical tag present if needed
- [ ] Open Graph tags present
- [ ] No `noindex` meta tags on pages that should be indexed

---

## Accessibility
- [ ] Lighthouse accessibility score 90+
- [ ] All images have appropriate alt text
- [ ] All form inputs have associated labels
- [ ] Tab order makes sense
- [ ] Focus states visible on all interactive elements
- [ ] Color contrast passes (verify with WebAIM checker)
- [ ] Skip navigation link present

---

## Performance
- [ ] Lighthouse performance score 85+ (mobile)
- [ ] All images lazy-loaded below the fold
- [ ] No render-blocking resources
- [ ] Total page weight under 2MB (aim for under 1MB)

---

## Pre-Launch
- [ ] DNS pointed correctly
- [ ] SSL certificate active (HTTPS)
- [ ] Old site backed up (if replacing)
- [ ] Analytics tracking confirmed on live domain
- [ ] Search Console sitemap submitted
- [ ] 301 redirects set up for any changed URLs
- [ ] Client has received login credentials and hosting information
