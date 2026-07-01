# SaaS Ideas — Roman Creative Studio
## Innovation Lab | Section 8B
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Owner:** Chief Innovation Officer + SaaS Architect  
**Status:** Research & Validation Phase

---

## Overview

This document catalogs SaaS product ideas that could evolve from RCS's agency expertise. These are not committed projects — they are validated hypotheses awaiting evidence. Each idea must clear the Innovation Decision Framework (score 15+/18) before entering active development.

**SaaS vs. Agency:** SaaS scales without headcount. A $29/mo product with 500 subscribers generates $14,500/mo with no additional labor. This is the financial logic behind building SaaS alongside the agency.

**Timing Principle:** We do not build SaaS until the agency generates enough cash flow to fund a 6-month build runway without affecting operations. Estimated trigger: $10k+/mo agency revenue.

---

## SaaS Idea Catalog

### SAAS-01: Agency CRM for Web Designers
**Category:** Vertical SaaS  
**Target:** Freelance web designers and small agencies (1–5 people)  
**Problem:** Generic CRMs (HubSpot, Salesforce) are overkill and expensive. Spreadsheet tracking is error-prone. There is no CRM designed specifically for the web design sales and project lifecycle.

**Core Features:**
- Lead pipeline with web design-specific stages (Prospect → Discovery → Proposal → Contract → Onboarding → Active → Care Plan)
- Proposal creation and tracking (with e-signature)
- Project kickoff automation
- Care plan / retainer tracking
- Revenue tracking (project + recurring)
- Client health score
- Follow-up reminders and sequences
- Pre-built email templates for agency communication

**Pricing Model:**
- Solo: $29/mo — 1 user, unlimited clients
- Team: $79/mo — up to 5 users
- Agency: $149/mo — unlimited users + white-label

**Market Validation Questions:**
1. Do web designers/freelancers actively complain about CRM options? (yes — Twitter, Reddit evidence)
2. Would they pay $29/mo? (validate via survey)
3. What do they currently use? (Notion, Trello, Spreadsheets, Dubsado)
4. What's the #1 pain point they'd pay to solve?

**Competitive Landscape:**
- Dubsado: Popular but cluttered, not design-specific, $35/mo
- HoneyBook: Wedding/event oriented, $36/mo
- 17hats: General service business, $45/mo
- Gap: None are opinionated about the web design workflow

**RCS Advantage:** We ARE the target customer. We can build the exact tool we wish existed and validate on ourselves first.

**Build Complexity:** High (8–12 months to MVP)  
**Revenue Potential:** $50k–$200k ARR at 200–700 paying customers  
**Priority Score:** 14/18 (just below threshold — needs more validation)  
**Decision Date:** Revisit Month 18 with market evidence

---

### SAAS-02: Website Accessibility Monitor
**Category:** Compliance SaaS  
**Target:** Web agencies, in-house web teams, accessibility consultants  
**Problem:** Website accessibility regresses over time. New content is added, code is updated, plugins break things. There is no affordable "set and forget" accessibility monitoring tool with actionable remediation.

**Core Features:**
- Weekly automated accessibility scans (axe-core + custom rules)
- Change detection (flag new issues introduced since last scan)
- Prioritized issue list with severity scoring
- Remediation guidance (plain English + code examples, powered by Claude API)
- Historical trend charts (are you getting better or worse?)
- Client report generation (for agencies to share with clients)
- Multi-site management (agency dashboard)
- Slack/email alerts on new critical issues

**Pricing Model:**
- Starter: $19/mo — 1 website, weekly scans
- Pro: $49/mo — 5 websites, weekly scans + reports
- Agency: $149/mo — 25 websites + white-label reports + client management

**Market Validation:**
- ADA website lawsuits increasing year-over-year (2,300+ in 2023)
- WCAG compliance demand growing in healthcare, education, government
- No dominant "affordable agency" solution in this space
- Potential enterprise customers: law firms, healthcare networks, municipalities

**Competitive Landscape:**
- AudioEye: Enterprise-focused, expensive ($49–$199/mo per site)
- UserWay: AI overlay (legally controversial)
- Deque Systems: Enterprise only
- Gap: Affordable, agency-first monitoring with AI remediation

**RCS Advantage:** Accessibility is a core competency and differentiator. We already do manual accessibility work — we'd be automating our own expertise.

**Build Complexity:** Medium (4–6 months to MVP)  
**Revenue Potential:** $100k–$500k ARR at 500–3,000 paying customers  
**Priority Score:** 16/18 (above threshold — high potential)  
**Decision Date:** Month 12 with MVP scoping

---

### SAAS-03: Local Business Website Grader
**Category:** Lead Generation SaaS / Freemium Tool  
**Target:** Local service businesses (dental, legal, construction, healthcare)  
**Problem:** Small business owners don't know how their website performs on the metrics that matter to their leads (load speed, mobile experience, local SEO, clear CTAs, trust signals).

**Core Features:**
- Enter URL + industry + location
- Automated scan: performance, mobile, SEO, conversion elements, trust signals
- Industry-benchmarked scoring ("Your dental practice website scores 62/100 — average is 71")
- Prioritized improvement recommendations
- PDF report with RCS branding
- Email capture before full report reveal
- Upsell: "Book a free consultation" CTA at bottom of report

**Business Model:**
- Free tool (lead generation for RCS)
- White-label version for other agencies: $99/mo
- API access for agencies to embed in their own tools: $199/mo

**Strategic Value:** This is primarily a lead generation tool. If 50 local businesses/month complete the audit, and 5% convert to consultation, that's 2–3 new client conversations/month from the tool alone.

**Build Complexity:** Low–Medium (2–3 months to MVP)  
**Revenue Potential (white-label):** $20k–$60k ARR  
**Strategic Value:** Very high (lead gen)  
**Priority Score:** 17/18  
**Decision Date:** Month 10 — build MVP as lead gen, evaluate white-label demand

---

### SAAS-04: Client Feedback & Approval Platform
**Category:** Agency Workflow SaaS  
**Target:** Web design and creative agencies  
**Problem:** Getting client feedback on designs is painful. Email threads lose context. Comments on screenshots are vague. Approvals are verbal and disputed.

**Core Features:**
- Upload design files (Figma embed, images, PDFs)
- Clients leave pinned comments directly on the design
- Version comparison (v1 vs. v2 side-by-side)
- Formal approval button with timestamp and email confirmation
- Revision round tracking
- Notification system for both sides
- Integrated with project status

**Pricing Model:**
- Free: 1 active project
- Pro: $29/mo — 10 active projects
- Agency: $79/mo — Unlimited projects + custom domain

**Competitive Landscape:**
- Pastel: Close, but limited features, $99/mo
- Bugherd: Dev-focused, $39/mo
- Zeplin: Design handoff, not approval-focused
- Gap: Affordable, design-review specific with formal approval workflow

**Build Complexity:** Medium (4–6 months)  
**Revenue Potential:** $40k–$150k ARR  
**Priority Score:** 13/18 (below threshold — good space but crowded)  
**Decision Date:** Revisit Year 3 if competitors don't improve

---

### SAAS-05: Content Calendar AI for Local Businesses
**Category:** Content Marketing SaaS  
**Target:** Local service businesses managing their own marketing  
**Problem:** Content planning is time-consuming. Most small business owners post inconsistently and without strategy.

**Core Features:**
- Business profile setup (industry, location, audience, goals)
- AI generates 90-day content calendar
- Platform-specific posts (Facebook, Instagram, Google Business Profile, LinkedIn)
- Scheduled publishing via social API connections
- Post idea bank (replenished monthly)
- Engagement tracking
- Monthly strategy refresh

**Pricing Model:**
- Starter: $29/mo — 1 business, 30 posts/month planned
- Pro: $59/mo — 3 businesses, full calendar, scheduling
- Agency: $149/mo — 20 clients, white-label

**Competitive Landscape:**
- Buffer: Scheduling but no AI strategy
- Later: Instagram-focused, no AI
- Jasper: Writing but no calendar or scheduling
- Gap: Strategy + writing + scheduling in one tool for local businesses

**Build Complexity:** High (6–9 months for full version)  
**Revenue Potential:** $100k–$400k ARR  
**Priority Score:** 14/18  
**Decision Date:** Month 24 — evaluate after AI product suite is stable

---

### SAAS-06: White-Label Client Portal for Agencies
**Category:** White-Label SaaS  
**Target:** Web design agencies (5–50 employees)  
**Problem:** Agencies need a client portal (project tracking, file sharing, approvals, invoicing) but can't afford to build one. Existing tools (ClickUp, Asana) aren't client-facing.

**Core Features:**
- White-label branding (agency logo, colors, domain)
- Client-facing project dashboard
- Milestone tracking
- File sharing and approval
- Invoice and payment (Stripe)
- Messaging
- Client onboarding templates

**Pricing Model:**
- Starter: $79/mo — up to 5 active clients
- Pro: $149/mo — up to 25 active clients
- Scale: $299/mo — unlimited clients + custom domain + priority support

**Strategic Note:** This is essentially TOOL-01 (our Client Portal) packaged as a white-label SaaS for other agencies. Build once, sell many.

**Build Complexity:** Medium (after TOOL-01 is built, 2–3 months to white-label)  
**Revenue Potential:** $100k–$400k ARR  
**Priority Score:** 15/18 (meets threshold if TOOL-01 is built)  
**Decision Date:** Month 20 — after our own portal is validated

---

## SaaS Evaluation Summary

| ID | Idea | Priority Score | Build Complexity | Decision Date |
|----|------|----------------|-----------------|---------------|
| SAAS-02 | Accessibility Monitor | 16/18 | Medium | Month 12 |
| SAAS-03 | Local Business Grader | 17/18 | Low-Medium | Month 10 |
| SAAS-06 | White-Label Client Portal | 15/18 | Medium | Month 20 |
| SAAS-01 | Agency CRM | 14/18 | High | Month 18 |
| SAAS-05 | Content Calendar AI | 14/18 | High | Month 24 |
| SAAS-04 | Client Feedback Platform | 13/18 | Medium | Year 3 |

---

## SaaS Development Principles

1. **Internal first:** Build for ourselves before building for others.
2. **Validate before building:** 50 people on a waitlist before writing production code.
3. **Small first:** MVP in 3 months or it's too big.
4. **Free tier = lead gen:** Every SaaS has a free tier that feeds the RCS agency pipeline.
5. **Niche obsessively:** Do not try to serve everyone. Own a narrow segment deeply.
6. **One at a time:** Do not build two SaaS products simultaneously.

---

## Financial Requirements for SaaS Investment

**Minimum agency stability before SaaS build:**
- Agency MRR: $5,000+/mo
- Operating runway: 6 months cash
- Team: At least 1 dedicated developer available
- Owner time: CEO can dedicate 10+ hours/week to product without harming agency

**Funding Sources (in priority order):**
1. Agency profits (bootstrapped)
2. Revenue from digital products and courses
3. Small business loan (if MVP proves traction)
4. Angel investment (only if seeking $500k+ for scale)

---

## Review Cadence

- **Monthly:** Review SaaS pipeline; any new ideas get scored
- **Quarterly:** Deep review of top 3 ideas — market evidence update
- **Annual:** SaaS strategy session — commit to 1 idea or defer all
