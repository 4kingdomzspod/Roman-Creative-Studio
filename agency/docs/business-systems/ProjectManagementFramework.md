# Project Management Framework
## Roman Creative Studio — Agency Operating System

**Owner:** Founder / Lead Developer
**Version:** 1.0
**Last Updated:** 2026-06-30
**Related Documents:** ClientOnboardingSystem.md, CRMArchitecture.md, DocumentManagement.md

---

## Purpose

Define a repeatable, stage-gated project delivery workflow for every Roman Creative Studio website project — from initial inquiry through post-launch care.

## Project Tiers and Timelines

| Tier | Pages | Target Timeline |
|------|-------|----------------|
| BUILD | Up to 6 | 4–5 weeks |
| GROW | Up to 10 | 5–7 weeks |
| SCALE | Custom | 8–16 weeks |

*Timelines assume timely asset delivery and approvals from the client.*

---

## Stage Overview

| Stage | Purpose | Approval Required | Exit Criteria |
|-------|---------|------------------|--------------|
| 1. Inquiry | Initial contact and qualification | None | Lead qualified → Discovery Call scheduled |
| 2. Discovery | Deep-dive consultation | None | Decision to proceed → Proposal |
| 3. Proposal | Deliver tailored proposal | None (internal review only) | Prospect accepts |
| 4. Contract | Formalize engagement | Both party signatures | Contract fully signed |
| 5. Invoice (Deposit) | Collect 50% deposit | Payment receipt | Deposit received → Onboarding begins |
| 6. Research | Gather all intelligence | None | Research complete + content ready |
| 7. Wireframes | Define IA and user flow | Client written approval | Wireframes approved → design begins |
| 8. UI Design | High-fidelity visual designs | Client written approval | Designs approved → M2 invoice sent |
| 9. Development | Build approved design | Client written approval on staging | Staging approved → Testing |
| 10. Testing | Verify quality, cross-browser | None | All critical/high tests pass |
| 11. Accessibility Review | Verify WCAG 2.1 AA | None | No Critical/High issues |
| 12. SEO Review | Verify on-page SEO | None | All SEO items checked |
| 13. Launch | Go live on production domain | Final payment received | Site live → Stage 14 |
| 14. Training | Client training (60 min) | None | Training complete |
| 15. Care Plan | Ongoing monthly maintenance | N/A | Until client cancels or upgrades |

---

## Stage 10: Testing Checklist

```
CROSS-BROWSER: Chrome, Safari (macOS+iOS), Firefox, Edge, Mobile Chrome, Mobile Safari
RESPONSIVE: 320px, 375px, 768px, 1024px, 1280px, 1440px
FUNCTIONALITY: All nav links, CTAs, forms (submit + confirmation), booking end-to-end,
               images load, no console errors, external links open in new tab, 404 styled
PERFORMANCE: Lighthouse Performance > 90, SEO > 90, Best Practices > 90
             Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1; page weight < 2MB
SECURITY: HTTPS enforced, no exposed API keys, forms sanitized, robots.txt correct
```

## Stage 11: Accessibility Review Checklist

```
[ ] All images have descriptive alt text
[ ] All form inputs have associated labels
[ ] Color contrast ≥ 4.5:1 (normal text), ≥ 3:1 (large text + UI components)
[ ] All interactive elements keyboard accessible
[ ] Focus indicators visible and styled
[ ] Skip navigation link present
[ ] Heading hierarchy correct (no skips)
[ ] ARIA labels on icon-only buttons
[ ] No auto-playing media without controls
[ ] Landmark roles present (header, main, nav, footer)
[ ] `lang` attribute on `<html>`
[ ] Tested with NVDA/VoiceOver + keyboard-only
```

## Stage 12: SEO Checklist

```
[ ] Unique, keyword-optimized <title> (55-60 chars) per page
[ ] Unique meta description (150-160 chars) per page
[ ] Canonical tag per page
[ ] Open Graph + Twitter Card tags on all pages
[ ] JSON-LD schema on homepage (LocalBusiness minimum)
[ ] One H1 per page; H2/H3 for semantic structure
[ ] Keyword-relevant alt text on all images
[ ] Internal linking: conversion pages linked from multiple pages
[ ] sitemap.xml accurate + submitted to Google Search Console
[ ] robots.txt correct (no staging pages indexed)
[ ] GA4 activated and tracking
```

## Stage 13: Launch Checklist

```
PRE-LAUNCH:
[ ] Final invoice (M3 — 25%) sent and paid
[ ] DNS transfer plan confirmed with client
[ ] Backup of old site created (if migrating)
[ ] Launch window agreed (avoid Friday afternoons)

LAUNCH:
[ ] DNS updated to point to new hosting
[ ] SSL certificate activated
[ ] HTTPS redirect in place (HTTP → HTTPS)
[ ] Site verified live at correct URL
[ ] Old site 301 redirects in place (if URLs changed)
[ ] Google Search Console: submit sitemap
[ ] GA4: verify data flowing

POST-LAUNCH (24 hours):
[ ] All pages verified live and rendering correctly
[ ] All forms tested in production
[ ] All CTAs and booking links confirmed working
[ ] Client notified: launch celebration email sent
[ ] 30-day post-launch support window started
```

## Project Health Indicators

| Indicator | Green | Yellow | Red |
|-----------|-------|--------|-----|
| Days since last client response | < 3 | 3-7 | > 7 |
| Revision rounds used | 0-1 | 2 | 3+ (scope risk) |
| Days to launch (vs. target) | On track | +1 week | +2 weeks |
| Outstanding approvals | 0 | 1 | 2+ |
