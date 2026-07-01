# Quality Management — Roman Creative Studio
## Enterprise Operating System | Section 4
**Version:** 1.0
**Last Updated:** 2026-07-01
**Owner:** COO + Creative Director + CTO
**Review Schedule:** Semi-annual
**Dependencies:** CompanyPlaybook.md, OKRFramework.md
**Related Documents:** All service delivery docs; docs/team/Training.md

---

## Purpose

Define measurable quality standards for every domain of RCS work, ensuring that every client deliverable, internal document, product, and communication reflects the same standard of excellence.

**Business Value:** Quality is the only sustainable competitive advantage for a creative agency. Price can be undercut. Technology changes. But a reputation for consistent, exceptional quality compounds over time and commands premium rates. Quality management is how we protect and build that reputation systematically.

---

## Quality Philosophy

**RCS Standard:** Every deliverable should make the person who receives it feel like they're working with the best agency they've ever hired.

**How we achieve this:**
1. Standards are written down (this document)
2. Standards are measurable (not subjective)
3. Standards are checked before delivery (QA process)
4. Standards are improved based on feedback and post-mortems
5. Standards apply to everyone equally — founder included

---

## Quality Domain 1: Brand & Design

### Brand Consistency Standards

| Standard | Threshold | Measurement |
|----------|-----------|-------------|
| Brand colors accurate (within 2ΔE of spec) | 100% | Visual check + color picker |
| Typography matches brand spec | 100% | Style check before export |
| Logo usage follows brand guide rules | 100% | Brand guide checklist |
| Grid/spacing consistent throughout | 100% | Figma auto-layout audit |
| Iconography style is cohesive | 100% | Visual audit |

### Design Quality Standards

| Standard | Threshold | Measurement |
|----------|-----------|-------------|
| Visual hierarchy is clear | 100% | Eye-tracking review with team |
| CTA is immediately identifiable | 100% | 5-second test |
| Mobile design matches desktop intent | 100% | Device preview in Figma |
| Whitespace is consistent (8pt grid) | 100% | Figma grid audit |
| No compressed or distorted images | 100% | Visual inspection |
| All text is legible at intended size | 100% | At-size preview |

### Design QA Checklist (Required Before Client Presentation)
- [ ] All layers named descriptively (no "Rectangle 47")
- [ ] All text styles applied from shared styles (not manual overrides)
- [ ] All color styles applied from shared styles
- [ ] Auto-layout applied to all repeating components
- [ ] Mobile, tablet, and desktop frames present
- [ ] All images properly clipped/masked
- [ ] No missing fonts
- [ ] Prototype flows linked correctly (if applicable)
- [ ] File organized by page (Cover, Wireframes, Design, Components)

---

## Quality Domain 2: Development

### Code Quality Standards

| Standard | Threshold | Measurement |
|----------|-----------|-------------|
| Lighthouse Performance | ≥90/100 | Lighthouse CI |
| Lighthouse Accessibility | ≥95/100 | Lighthouse CI |
| Lighthouse Best Practices | ≥90/100 | Lighthouse CI |
| Lighthouse SEO | ≥90/100 | Lighthouse CI |
| WCAG 2.1 AA violations | 0 critical | axe-core scan |
| Core Web Vitals: LCP | ≤2.5s | PageSpeed Insights |
| Core Web Vitals: FID/INP | ≤100ms | PageSpeed Insights |
| Core Web Vitals: CLS | ≤0.1 | PageSpeed Insights |
| Mobile PageSpeed Score | ≥80 | PageSpeed Insights |
| HTML validation errors | 0 critical | W3C Validator |
| JavaScript console errors | 0 on launch | DevTools audit |
| Broken links | 0 | Screaming Frog scan |

### Code Standards
- Semantic HTML (no div soup)
- BEM CSS naming convention
- CSS custom properties for all configurable values
- No inline styles
- No `!important` without documented reason
- JavaScript: ES6+, no jQuery for new projects
- Git commits: descriptive messages, present tense ("Add hero animation" not "added hero animation")
- All code reviewed before merge to main

### Pre-Launch Development QA Checklist
- [ ] All Lighthouse scores meet thresholds (run 3 times, take median)
- [ ] axe DevTools scan: zero critical violations
- [ ] Tested in: Chrome, Firefox, Safari, Edge (latest stable)
- [ ] Tested on: iOS Safari, Android Chrome (real device or BrowserStack)
- [ ] All forms tested: submit success, submit error, validation
- [ ] All links tested (internal and external)
- [ ] 404 page exists and is on-brand
- [ ] Analytics (GA4) verified tracking
- [ ] Meta tags: title, description, og:image on all pages
- [ ] Favicon set
- [ ] sitemap.xml generated and submitted
- [ ] robots.txt configured correctly
- [ ] SSL certificate active
- [ ] www and non-www redirect consistent
- [ ] Console errors: zero
- [ ] No placeholder content (Lorem ipsum, temp images)
- [ ] Client has been provided all credentials and access

---

## Quality Domain 3: Accessibility

### Accessibility Standards (WCAG 2.1 AA)

All RCS client deliverables must meet WCAG 2.1 AA minimum:

| Principle | Standard | Threshold |
|-----------|----------|----------|
| Perceivable | Text contrast (normal) | ≥4.5:1 |
| Perceivable | Text contrast (large) | ≥3:1 |
| Perceivable | Non-text contrast (UI) | ≥3:1 |
| Perceivable | All images have alt text | 100% |
| Perceivable | No color as only differentiator | 100% |
| Operable | All features keyboard accessible | 100% |
| Operable | Focus visible on all interactive elements | 100% |
| Operable | No content flashes >3 times/second | 100% |
| Understandable | Form labels present | 100% |
| Understandable | Error messages describe issue and fix | 100% |
| Robust | Valid HTML | 100% |
| Robust | ARIA used correctly | 100% |

### Accessibility QA Process
1. Automated scan: axe DevTools + Lighthouse Accessibility
2. Manual keyboard navigation test (Tab through entire page)
3. Screen reader test: VoiceOver (Mac/iOS) or NVDA (Windows)
4. Color contrast check: all text, all UI components
5. Document results in project QA log

---

## Quality Domain 4: SEO

### Technical SEO Standards (at Launch)

| Standard | Threshold | Tool |
|----------|-----------|------|
| Page title on all pages | 100% | Screaming Frog |
| Meta description on all pages | 100% | Screaming Frog |
| H1 present on all pages (exactly 1) | 100% | Screaming Frog |
| Images have alt text | 100% | axe scan |
| Internal links: no broken | 0 broken | Screaming Frog |
| Canonical tags set correctly | 100% | Screaming Frog |
| Schema markup (local business) | Present | Google Rich Results Test |
| Sitemap submitted | Yes | GSC confirmation |
| Google Search Console verified | Yes | GSC |
| Page speed (mobile) | ≥70 | PageSpeed Insights |

---

## Quality Domain 5: Copywriting

### Content Quality Standards

| Standard | Threshold | Measurement |
|----------|-----------|-------------|
| No spelling errors | 0 | Grammarly + human review |
| No grammatical errors | 0 | Grammarly + human review |
| Reading level | Grade 8 or below | Hemingway App |
| No Lorem Ipsum on launch | 0 instances | Visual review |
| CTAs are specific (not "Click Here") | 100% | Content audit |
| Brand voice matches guide | 100% | Brand voice checklist |
| All links are descriptive (accessibility) | 100% | Manual review |

---

## Quality Domain 6: Client Communication

### Communication Standards

| Standard | Threshold | Measurement |
|----------|-----------|-------------|
| Email response time (business hours) | ≤4 hours | Email timestamp tracking |
| Project status update frequency | Weekly minimum | Project log |
| No missed client deadlines (our side) | 0 | Project tracker |
| Meeting notes sent within 24 hours | 100% | Notion log |
| Feedback documented in writing | 100% | Email/Notion confirmation |

---

## Quality Domain 7: Documentation

### Internal Documentation Standards

| Standard | Threshold |
|----------|-----------|
| All SOPs have named owner | 100% |
| All SOPs have last-updated date | 100% |
| No SOP older than 12 months without review | 0 |
| All processes executable by someone unfamiliar | 100% |
| No broken internal links in Notion | 0 |

---

## Quality Domain 8: AI Outputs

As AI is used in agency work, quality standards apply:

| Standard | Threshold |
|----------|-----------|
| All AI-generated content reviewed by human | 100% |
| AI content fact-checked before delivery | 100% |
| AI content edited for brand voice | 100% |
| No hallucinated facts, links, or statistics | 0 |
| Client informed if AI tools used in their project | 100% |
| AI prompts documented for repeatable outputs | Ongoing |

---

## Quality Domain 9: Product Launches

### Launch Readiness Checklist

**Technical:**
- [ ] All purchase flows tested end-to-end
- [ ] All download/delivery links work
- [ ] Stripe webhooks verified
- [ ] License key delivery tested
- [ ] Support email monitored and ready

**Content:**
- [ ] Sales page proofread (zero typos)
- [ ] All images optimized (<200KB)
- [ ] Demo/preview assets created and uploaded
- [ ] FAQ covers top 5 anticipated objections

**Marketing:**
- [ ] Email sequences scheduled and tested
- [ ] Social posts queued
- [ ] Analytics event tracking confirmed

---

## Quality Assurance Process

### Pre-Delivery QA (Required for All Client Work)

```
Work Completed by Creator
        ↓
Self-Review (creator's own checklist)
        ↓
Peer Review (another team member)
        ↓
QA Review (PM or Quality Lead)
        ↓
Pass: Deliver to Client
Fail: Return to Creator with specific notes
```

### Post-Project Quality Audit
Within 30 days of launch:
- Client satisfaction score (request NPS)
- Technical performance review (Lighthouse re-run)
- Document any quality issues discovered post-launch
- Root cause: what process failure allowed this?
- Update relevant checklist or SOP

---

## Quality Metrics

| Metric | Target | Frequency |
|--------|--------|----------|
| Client NPS | ≥8.0 average | Per project |
| Project on-time delivery | ≥85% | Quarterly |
| Post-launch bugs (critical) | 0 per launch | Per project |
| Lighthouse accessibility score | ≥95 on all launches | Per launch |
| Client revision rounds | ≤2 average | Per project |
| Documentation review completion | 100% of scheduled reviews done | Quarterly |

---

## Future Improvements

- Automated QA pipeline (Lighthouse CI in GitHub Actions) by Year 2
- Quality score card per project (tracked in Supabase) by Year 2
- Third-party accessibility audit on 1 project/quarter by Year 2
- ISO 9001 quality management alignment review by Year 5
- Client quality survey sent at 30 and 90 days post-launch by Year 2
