# Project Management Framework
## Roman Creative Studio — Agency Operating System

**Owner:** Founder / Lead Developer
**Version:** 1.0
**Last Updated:** 2026-06-30
**Related Documents:** ClientOnboardingSystem.md, CRMArchitecture.md, DocumentManagement.md

---

## Purpose

Define a repeatable, stage-gated project delivery workflow for every Roman Creative Studio website project — from initial inquiry through post-launch care. Each stage has clear deliverables, checklists, approval requirements, and exit criteria.

## Business Value

A structured project management framework prevents scope creep, ensures consistent quality, reduces revision cycles, enables delegation to contractors, and creates a defensible record in case of disputes.

---

## Project Tiers and Timelines

| Tier | Pages | Target Timeline |
|------|-------|----------------|
| BUILD | Up to 6 | 4–5 weeks |
| GROW | Up to 10 | 5–7 weeks |
| SCALE | Custom | 8–16 weeks |

*Timelines assume timely asset delivery and approvals from the client.*

---

## Stage 1: Inquiry

**Purpose:** Initial contact and qualification.

**Deliverables:**
- CRM contact record created
- Pre-qualification notes logged

**Checklist:**
- [ ] Lead source recorded
- [ ] Initial response sent within 4 business hours
- [ ] Pre-qualification criteria evaluated
- [ ] GDPR consent recorded

**Approval Requirements:** None
**Owner:** Founder
**Exit Criteria:** Lead responds and meets qualification criteria → Discovery Call scheduled

---

## Stage 2: Discovery

**Purpose:** Deep-dive consultation to understand the business, goals, and fit.

**Deliverables:**
- Pre-call questionnaire completed by prospect
- Discovery call notes (raw + AI-summarized)
- Tier recommendation recorded

**Checklist:**
- [ ] Pre-call questionnaire sent and received
- [ ] Discovery call held and recorded (with consent)
- [ ] Post-call notes completed using standard template
- [ ] CRM updated (stage, notes, tier recommendation)
- [ ] AI discovery summary generated and reviewed

**Approval Requirements:** None
**Owner:** Founder
**Exit Criteria:** Decision to proceed with proposal → Stage 3

---

## Stage 3: Proposal

**Purpose:** Deliver a tailored, high-quality proposal that reflects RCS expertise.

**Deliverables:**
- Custom proposal document (AI-assisted, founder-approved)
- Cover note email

**Checklist:**
- [ ] Proposal generated using AI Proposal Generator
- [ ] Proposal reviewed and personalized by founder
- [ ] Correct tier, pricing, and scope confirmed
- [ ] Sent via e-signature platform within 48 hours of call
- [ ] CRM follow-up reminders set (Day 3, Day 7)

**Approval Requirements:** None (internal quality review only)
**Owner:** Founder
**Exit Criteria:** Prospect accepts proposal → Stage 4

---

## Stage 4: Contract

**Purpose:** Formalize the engagement with a legally binding agreement.

**Deliverables:**
- Signed contract (both parties)
- Contract stored in client folder

**Contract Must Include:**
- Scope of work (exact pages and features)
- Payment schedule (50/25/25)
- Revision policy (number of rounds per stage)
- Timeline with key milestones
- Intellectual property ownership (client owns final work on full payment)
- Cancellation and refund terms
- Confidentiality clause
- Governing law

**Checklist:**
- [ ] Contract template populated with client-specific details
- [ ] Sent via e-signature platform (PandaDoc/DocuSign)
- [ ] Both parties have signed
- [ ] Signed copy archived in client folder
- [ ] CRM updated to Client stage

**Approval Requirements:** Both party signatures
**Owner:** Founder
**Exit Criteria:** Contract fully signed → Stage 5

---

## Stage 5: Invoice (Deposit)

**Purpose:** Collect the 50% deposit to formally start the project.

**Deliverables:**
- Milestone 1 invoice sent via Stripe
- Payment confirmed

**Checklist:**
- [ ] Milestone 1 invoice created in Stripe
- [ ] Invoice sent to client
- [ ] Payment confirmed
- [ ] Onboarding workflow triggered
- [ ] Welcome email sent

**Approval Requirements:** Payment receipt
**Owner:** Founder
**Exit Criteria:** Deposit received → Onboarding begins → Stage 6 (Research)

---

## Stage 6: Research

**Purpose:** Gather all intelligence needed before the first pixel is designed.

**Deliverables:**
- Brand questionnaire responses filed
- Competitor analysis notes
- Audience research summary
- Content collected (or deadline set)
- Hosting/domain access secured

**Checklist:**
- [ ] Brand questionnaire received and reviewed
- [ ] 2-3 competitor sites analyzed (design, SEO, conversion)
- [ ] Target audience persona defined
- [ ] Keyword research completed for primary pages
- [ ] All content received OR content deadline confirmed
- [ ] Hosting credentials received and stored securely
- [ ] Kickoff meeting held and notes documented
- [ ] Onboarding checklist complete

**Approval Requirements:** None
**Owner:** Founder
**Exit Criteria:** Research complete + content ready (or deadline set) → Stage 7

---

## Stage 7: Wireframes

**Purpose:** Define information architecture and user flow before investing in visual design.

**Deliverables:**
- Low-fidelity wireframes for all agreed pages
- Sitemap (if new architecture)
- Content priority map (what goes above the fold on each page)

**Checklist:**
- [ ] Sitemap reviewed against contracted scope
- [ ] Wireframes created for all pages
- [ ] Navigation structure defined
- [ ] CTA hierarchy defined per page
- [ ] Mobile wireframes included for key pages
- [ ] Wireframes shared with client in shared folder
- [ ] Client walkthrough meeting scheduled (optional for BUILD; recommended for GROW+)

**Approval Requirements:** Client written approval on wireframes before design begins.
**Owner:** Founder / Designer
**Exit Criteria:** Wireframes approved → Stage 8

---

## Stage 8: UI Design

**Purpose:** Create high-fidelity visual designs that express the brand and drive conversion.

**Deliverables:**
- High-fidelity Figma mockups for all pages
- Desktop and mobile designs
- Design system documentation (colors, typography, component library)
- Interactive prototype (GROW and SCALE tiers)

**Checklist:**
- [ ] Designs built in Figma (not Canva, not Adobe XD)
- [ ] Brand guidelines applied consistently
- [ ] RCS design tokens applied (colors, typography, spacing)
- [ ] Conversion hierarchy verified on homepage and service pages
- [ ] Accessibility: color contrast checked (WCAG AA minimum)
- [ ] Mobile designs completed
- [ ] Internal design review completed before sharing
- [ ] Designs shared with client via Figma view link
- [ ] Feedback consolidated into one revision round
- [ ] Revision 1 completed
- [ ] Design approved in writing (email)

**Approval Requirements:** Client written approval on final designs.
**Owner:** Founder / Designer
**Exit Criteria:** Designs approved → Milestone 2 invoice sent → Stage 9

---

## Stage 9: Development

**Purpose:** Build the approved design into a production-quality, hand-coded website.

**Deliverables:**
- Pixel-perfect HTML/CSS/JS implementation (or CMS build per scope)
- All pages responsive (320px to 1440px)
- All images optimized (WebP, lazy loading, correct dimensions)
- All forms functional (with real backend for GROW/SCALE)
- All third-party integrations implemented per scope
- Staging site accessible to client for review

**Checklist:**
- [ ] Development environment set up
- [ ] Design token system implemented
- [ ] All pages built (verify against scope)
- [ ] Navigation: desktop and mobile
- [ ] Forms: functional with spam protection
- [ ] Images: optimized, lazy loaded, correct alt text
- [ ] Performance: Lighthouse score > 90 on all pages
- [ ] Third-party integrations implemented and tested
- [ ] Staging site shared with client
- [ ] Client feedback consolidated
- [ ] Development revision completed

**Approval Requirements:** Client written approval on staging site.
**Owner:** Founder / Developer
**Exit Criteria:** Staging approved → Stage 10 (Testing)

---

## Stage 10: Testing

**Purpose:** Verify quality, cross-browser compatibility, and correct functionality before launch.

**Testing Checklist:**

```
CROSS-BROWSER TESTING
[ ] Chrome (latest)
[ ] Safari (latest, macOS and iOS)
[ ] Firefox (latest)
[ ] Edge (latest)
[ ] Mobile Chrome (Android)
[ ] Mobile Safari (iOS)

RESPONSIVE TESTING
[ ] 320px (iPhone SE)
[ ] 375px (iPhone 14)
[ ] 768px (iPad)
[ ] 1024px (iPad landscape)
[ ] 1280px (laptop)
[ ] 1440px (desktop)

FUNCTIONALITY TESTING
[ ] All navigation links work
[ ] All CTAs link to correct destination
[ ] Contact form submits and triggers confirmation
[ ] Booking integration works end-to-end
[ ] All images load correctly
[ ] No console errors
[ ] External links open in new tab with rel="noopener"
[ ] 404 page exists and is styled

PERFORMANCE
[ ] Google Lighthouse: Performance > 90
[ ] Google Lighthouse: SEO > 90
[ ] Google Lighthouse: Best Practices > 90
[ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
[ ] Total page weight < 2MB on homepage

SECURITY
[ ] HTTPS enforced (SSL active)
[ ] No exposed API keys in source
[ ] Form inputs sanitized
[ ] robots.txt correct
[ ] .nojekyll present (GitHub Pages)
```

**Owner:** Founder / Developer
**Exit Criteria:** All critical and high tests pass → Stage 11

---

## Stage 11: Accessibility Review

**Purpose:** Verify WCAG 2.1 AA compliance on all public pages.

**Accessibility Checklist:**
```
[ ] All images have descriptive alt text
[ ] All form inputs have associated labels
[ ] Color contrast ratio ≥ 4.5:1 for normal text
[ ] Color contrast ratio ≥ 3:1 for large text and UI components
[ ] All interactive elements keyboard accessible
[ ] Focus indicators visible and styled
[ ] Skip navigation link present
[ ] Heading hierarchy correct (H1 → H2 → H3, no skips)
[ ] ARIA labels on icon-only buttons
[ ] No auto-playing media without controls
[ ] Error messages associated with form inputs
[ ] Landmark roles present (header, main, nav, footer)
[ ] Language attribute on <html> tag
[ ] Tested with screen reader (NVDA/VoiceOver)
[ ] Tested with keyboard only (no mouse)
[ ] Validated with automated tool (axe, WAVE, or Lighthouse)
```

**Owner:** Founder / Accessibility Reviewer
**Exit Criteria:** No Critical or High accessibility issues → Stage 12

---

## Stage 12: SEO Review

**Purpose:** Verify on-page SEO is correctly implemented before launch.

**SEO Checklist:**
```
[ ] Each page has a unique, keyword-optimized <title> tag (55-60 chars)
[ ] Each page has a unique meta description (150-160 chars)
[ ] Each page has a canonical tag
[ ] Open Graph tags on all pages
[ ] Twitter Card tags on all pages
[ ] JSON-LD schema on homepage (minimum: LocalBusiness or Organization)
[ ] H1 on every page (exactly one)
[ ] H2s and H3s used for semantic structure
[ ] All images have descriptive, keyword-relevant alt text
[ ] Internal linking: key conversion pages linked from multiple pages
[ ] sitemap.xml accurate and submitted to Google Search Console
[ ] robots.txt correct (no staging pages indexed)
[ ] Google Search Console verified
[ ] GA4 activated and tracking
[ ] Page load time < 3s on 3G (mobile performance)
```

**Owner:** Founder
**Exit Criteria:** All SEO items checked → Stage 13

---

## Stage 13: Launch

**Purpose:** Migrate the website to the production domain and go live.

**Launch Checklist:**
```
PRE-LAUNCH
[ ] Final invoice (Milestone 3 — 25%) sent and paid
[ ] DNS transfer plan confirmed with client
[ ] Backup of old site created (if migrating)
[ ] Launch window agreed (avoid Friday afternoons)

LAUNCH
[ ] DNS updated to point to new hosting
[ ] SSL certificate activated (auto-provision or manual)
[ ] HTTPS redirect in place (HTTP → HTTPS)
[ ] Site verified live at correct URL
[ ] Old site redirects in place (301 redirects for changed URLs)
[ ] Google Search Console: submit sitemap
[ ] GA4: verify data flowing

POST-LAUNCH (24 hours)
[ ] All pages verified live and rendering correctly
[ ] All forms tested in production
[ ] All CTAs and booking links confirmed working
[ ] Client notified: launch celebration email sent
[ ] RCS social media announcement (with client permission)
[ ] 30-day post-launch support window started
```

**Approval Requirements:** Final payment received before DNS transfer.
**Owner:** Founder
**Exit Criteria:** Site live → Stage 14

---

## Stage 14: Training

**Purpose:** Ensure the client can manage their website with confidence.

**Training Session (60 min):**
- How to request content updates (submit to RCS)
- How to access and interpret GA4 (basic overview)
- How to view the monthly report (Care Plan clients)
- How to contact RCS for support
- Introduction to client portal (when available)

**Training Resources Provided:**
- Loom video walkthrough of their specific website
- Quick-reference guide: how to submit a change request
- Link to client knowledge base

**Owner:** Founder
**Exit Criteria:** Training complete → Stage 15 (Care Plan)

---

## Stage 15: Care Plan

**Purpose:** Maintain, protect, and continuously improve the client's website post-launch.

**Care Plan Onboarding Checklist:**
```
[ ] Stripe recurring subscription activated
[ ] Care Plan welcome email sent
[ ] First monthly report scheduled
[ ] Support ticket process confirmed
[ ] Change request process confirmed
[ ] First check-in call scheduled (30 days post-launch)
```

**Monthly Recurring Tasks:**
- [ ] Security scan completed
- [ ] Backup verified
- [ ] Content updates processed (from request queue)
- [ ] Performance check (Lighthouse, Core Web Vitals)
- [ ] Monthly report generated and sent
- [ ] SEO check (rank positions, indexing status)

**Owner:** Founder / Account Manager (future)
**Exit Criteria:** N/A — ongoing until client cancels or upgrades

---

## Project Health Indicators

| Indicator | Green | Yellow | Red |
|-----------|-------|--------|-----|
| Days since last client response | < 3 | 3-7 | > 7 |
| Revision rounds used | 0-1 | 2 | 3+ (scope risk) |
| Days to launch (vs. target) | On track | +1 week | +2 weeks |
| Outstanding approvals | 0 | 1 | 2+ |
| Unanswered content requests | 0 | 1-2 | 3+ |

---

## Technical Notes

- All project status changes must be logged in CRM
- All approvals must be received in writing (email is acceptable)
- All revision requests must be submitted as a consolidated batch, not individual messages
- PM tool (Linear, Notion, or ClickUp) should mirror these 15 stages as a template

## Future Enhancements

- Automated milestone reminders for overdue approvals
- Client-facing project timeline in the client portal
- Contractor onboarding workflow for delegated stages
- AI quality review at Stages 10, 11, and 12
