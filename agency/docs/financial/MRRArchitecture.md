# MRR Architecture
# Roman Creative Studio — Financial Operating System
# Section 4 of 15 | ERD Version 1.0

---

## Overview

Monthly Recurring Revenue (MRR) is the financial foundation of a stable, scalable agency. This document defines the full MRR architecture for Roman Creative Studio — every recurring stream, its pricing, delivery model, margin profile, and growth trajectory.

**MRR Goal (Year 1 End):** $3,000/month  
**MRR Goal (Year 2 End):** $8,000/month  
**MRR Goal (Year 3 End):** $20,000/month  
**MRR Milestone — Agency Viable:** $5,000/month (covers all operating costs)  
**MRR Milestone — Hiring Ready:** $8,000/month (can support first contractor)

---

## MRR Service Architecture

### Tier 1 — Website Care Plans

Core recurring revenue. Every project client should convert to a Care Plan post-launch.

#### MRR-01: Website Care — $197/month

| Field | Detail |
|-------|--------|
| **Code** | MRR-01 |
| **Name** | Website Care |
| **Price** | $197/month |
| **Billing** | Monthly, auto-charge |
| **Contract** | Month-to-month (30-day cancel) |
| **Margin** | ~85% |
| **Delivery Hours** | ~2 hours/month per client |
| **EHR** | ~$84/hour |

**Included Services:**
- WordPress core, plugin, theme updates
- Weekly automated backups (offsite)
- Uptime monitoring (99.9% SLA target)
- Security scanning (weekly)
- SSL certificate management
- Monthly performance check
- Basic content updates (up to 30 min/month)
- Monthly status email

**Not Included:** New pages, redesign, SEO work, custom development, analytics reporting

**Conversion Target:** 80% of all project clients convert to Care Plan within 30 days of launch

---

#### MRR-02: SEO Retainer — $497/month

| Field | Detail |
|-------|--------|
| **Code** | MRR-02 |
| **Name** | SEO Retainer |
| **Price** | $497/month |
| **Billing** | Monthly, auto-charge |
| **Contract** | 3-month minimum, then month-to-month |
| **Margin** | ~75% |
| **Delivery Hours** | ~4–5 hours/month per client |
| **EHR** | ~$99–124/hour |

**Included Services (everything in Care, plus):**
- Google Search Console monitoring
- Monthly keyword ranking report
- Google Business Profile optimization
- 1 SEO-optimized blog post per month
- Technical SEO health check
- Local citation audit (quarterly)
- Monthly SEO report with recommendations
- Schema markup maintenance

**Not Included:** Paid ads management, content strategy overhaul, link building campaigns, social media

**Best For:** Local service businesses (dental, construction, healthcare, legal)

---

#### MRR-03: Growth Partner — $997/month

| Field | Detail |
|-------|--------|
| **Code** | MRR-03 |
| **Name** | Growth Partner |
| **Price** | $997/month |
| **Billing** | Monthly, auto-charge |
| **Contract** | 6-month minimum, then monthly |
| **Margin** | ~70% |
| **Delivery Hours** | ~8–10 hours/month per client |
| **EHR** | ~$100–125/hour |

**Included Services (everything in SEO Retainer, plus):**
- Monthly 30-minute strategy call
- 2 blog posts per month
- Email newsletter (monthly, up to 500 words)
- Landing page A/B test (quarterly)
- Conversion rate analysis
- Competitor monitoring (quarterly)
- Lead tracking setup and reporting
- Priority support (same-day response)
- Quarterly roadmap planning session
- Annual website performance audit

**Not Included:** Paid ads budget management, social media posting, video production

**Best For:** Growth-focused businesses with 6–12 month horizon goals

---

### Tier 2 — Hosting & Infrastructure

#### MRR-04: Managed Hosting — $49/month

| Field | Detail |
|-------|--------|
| **Code** | MRR-04 |
| **Name** | Managed Hosting |
| **Price** | $49/month |
| **Billing** | Monthly |
| **Contract** | Month-to-month |
| **Margin** | ~65% |
| **Cost Basis** | ~$17/month (Kinsta/WP Engine reseller or VPS) |

**Included:**
- Managed WordPress hosting
- CDN included
- Daily backups
- Staging environment
- SSL included
- Email hosting (up to 5 accounts) via Google Workspace or Zoho

**Note:** Often bundled into Care Plans. Sold standalone when client has their own care provider.

---

#### MRR-05: Accessibility Monitoring — $97/month

| Field | Detail |
|-------|--------|
| **Code** | MRR-05 |
| **Name** | Accessibility Monitoring |
| **Price** | $97/month |
| **Billing** | Monthly |
| **Contract** | Month-to-month |
| **Margin** | ~90% |
| **Delivery Hours** | ~1 hour/month |
| **EHR** | ~$87/hour |

**Included:**
- Automated WCAG 2.1 AA scanning (weekly)
- Monthly accessibility health report
- Issue triage and priority classification
- Remediation recommendations
- ADA compliance documentation
- Annual full accessibility audit (1 hour)

**Target Market:** Healthcare, legal, government contractors, enterprises

---

#### MRR-06: Performance Monitoring — $79/month

| Field | Detail |
|-------|--------|
| **Code** | MRR-06 |
| **Name** | Performance Monitoring |
| **Price** | $79/month |
| **Billing** | Monthly |
| **Contract** | Month-to-month |
| **Margin** | ~88% |
| **Delivery Hours** | ~0.5–1 hour/month |

**Included:**
- Core Web Vitals tracking (weekly)
- Page speed scoring (Google PageSpeed Insights)
- Uptime monitoring with instant alerts
- Monthly performance report
- Basic optimization recommendations
- Quarterly performance deep-dive

---

### Tier 3 — AI & Automation Services

#### MRR-07: AI Automation Maintenance — $297/month

| Field | Detail |
|-------|--------|
| **Code** | MRR-07 |
| **Name** | AI Automation Maintenance |
| **Price** | $297/month |
| **Billing** | Monthly |
| **Contract** | 3-month minimum |
| **Margin** | ~78% |
| **Delivery Hours** | ~3–4 hours/month |
| **EHR** | ~$74–99/hour |

**Included:**
- Maintenance of AI automations built during project
- Prompt tuning and response quality monitoring
- API usage cost monitoring and optimization
- Workflow health checks (Zapier/Make.com)
- Monthly automation performance report
- Minor automation adjustments (up to 2 hours/month)

**Add-on to:** GROW or SCALE projects that included AI integration

---

#### MRR-08: CRM & Email Maintenance — $197/month

| Field | Detail |
|-------|--------|
| **Code** | MRR-08 |
| **Name** | CRM & Email Maintenance |
| **Price** | $197/month |
| **Billing** | Monthly |
| **Contract** | Month-to-month |
| **Margin** | ~82% |
| **Delivery Hours** | ~2 hours/month |

**Included:**
- HubSpot or MailerLite list hygiene (monthly)
- Automation sequence monitoring
- Deliverability health check
- Unsubscribe/bounce management
- Monthly email performance report
- Sequence adjustment recommendations

---

### Tier 4 — Reporting & Analytics

#### MRR-09: Analytics & Reporting — $149/month

| Field | Detail |
|-------|--------|
| **Code** | MRR-09 |
| **Name** | Analytics & Reporting |
| **Price** | $149/month |
| **Billing** | Monthly |
| **Contract** | Month-to-month |
| **Margin** | ~85% |
| **Delivery Hours** | ~1–2 hours/month (automated reports) |

**Included:**
- GA4 dashboard setup and maintenance
- Monthly traffic and conversion report
- Goal tracking review
- Search Console integration
- Custom event tracking maintenance
- Quarterly insight summary

**Note:** Phase 2 target — automate report generation with Claude API. Margin increases to ~95%.

---

### Tier 5 — Consulting Retainers

#### MRR-10: Strategy Consulting Retainer — $500/month

| Field | Detail |
|-------|--------|
| **Code** | MRR-10 |
| **Name** | Strategy Consulting Retainer |
| **Price** | $500/month |
| **Billing** | Monthly |
| **Contract** | 3-month minimum |
| **Margin** | ~95% |
| **Delivery Hours** | 2 hours/month (2 × 1-hour calls) |
| **EHR** | $250/hour |

**Included:**
- 2 × 60-minute strategy sessions
- Written session summary and action items
- Async Q&A via email (up to 5 per month)
- Resource recommendations

**Stage:** Year 2+ after portfolio and reputation established

---

## MRR Bundle Architecture

Bundles increase average MRR per client and reduce churn.

### Bundle A — Care + Hosting
**Price:** $229/month (saves $17 vs separate)  
**Margin:** ~82%  
**Target:** Clients who want simple, hands-off maintenance

### Bundle B — SEO Starter
**Price:** $597/month  
**Includes:** Care ($197) + SEO Retainer ($497) → $694 value, $97 savings  
**Margin:** ~78%  
**Target:** Local businesses who want to rank

### Bundle C — Growth Stack
**Price:** $997/month (Growth Partner plan)  
**Includes:** All Care + SEO + Growth services  
**Margin:** ~70%  
**Target:** Businesses committed to 12-month growth

### Bundle D — Full Agency Retainer
**Price:** $1,497/month  
**Includes:** Growth Partner + AI Automation Maintenance + Analytics  
**Margin:** ~72%  
**Target:** SCALE-tier clients post-launch (Stage 3+)

---

## MRR Financial Projections

### Year 1 MRR Build (Conservative)

| Month | New Clients | Churn | Net MRR | Cumulative MRR |
|-------|------------|-------|---------|----------------|
| M1 | 0 | 0 | $0 | $0 |
| M2 | 0 | 0 | $0 | $0 |
| M3 | 1 × Care | 0 | +$197 | $197 |
| M4 | 1 × Care | 0 | +$197 | $394 |
| M5 | 1 × SEO | 0 | +$497 | $891 |
| M6 | 1 × Care | 0 | +$197 | $1,088 |
| M7 | 1 × SEO | 0 | +$497 | $1,585 |
| M8 | 1 × Growth | 0 | +$997 | $2,582 |
| M9 | 1 × Care | 0 | +$197 | $2,779 |
| M10 | 1 × Care | 1 × Care | $0 | $2,779 |
| M11 | 1 × SEO | 0 | +$497 | $3,276 |
| M12 | 1 × Growth | 0 | +$997 | $4,273 |

**Year 1 End MRR (Conservative):** ~$4,273/month  
**Year 1 End MRR (Expected):** ~$5,500/month  
**Year 1 End MRR (Optimistic):** ~$8,000/month

### Year 2 MRR Targets

| Scenario | Target MRR | Active Clients |
|----------|-----------|----------------|
| Conservative | $8,000 | 12–15 |
| Expected | $12,000 | 15–20 |
| Optimistic | $18,000 | 20–28 |

### Year 3 MRR Targets

| Scenario | Target MRR | Notes |
|----------|-----------|-------|
| Conservative | $15,000 | Solo + 1 contractor |
| Expected | $22,000 | Small team |
| Optimistic | $35,000 | Agency model |

---

## MRR Metrics & KPIs

| Metric | Formula | Target |
|--------|---------|--------|
| **MRR Growth Rate** | (MRR this month − last month) / last month | 10–15%/month (early stage) |
| **Churn Rate** | Cancelled MRR / Total MRR | <5%/month |
| **Net MRR Growth** | New MRR + Expansion MRR − Churn MRR | Positive every month |
| **ARPU** | Total MRR / Active clients | >$400/month target |
| **MRR Concentration** | Largest client MRR / Total MRR | <20% (avoid dependency) |
| **MRR Coverage Ratio** | MRR / Monthly operating expenses | >1.0 = agency viable |
| **Expansion MRR** | Upgrades from existing clients | Track separately |
| **Reactivation MRR** | Re-signed churned clients | Track separately |

---

## MRR Operations

### Billing Infrastructure
- **Platform:** Stripe (recurring billing, invoicing, dunning)
- **Payment method:** Credit card or ACH auto-charge
- **Billing date:** 1st of month or anniversary date
- **Invoice delivery:** Automated via Stripe + Resend
- **Failed payment:** Auto-retry 3×, then email notification, then service pause Day 14

### Onboarding to Care Plan
1. Project launch day: Send Care Plan welcome email with Stripe payment link
2. Client signs Care Plan agreement (DocuSign or PDF)
3. Stripe subscription activated
4. Client added to care plan tracking sheet
5. First monthly report scheduled (30 days post-launch)
6. Quarterly check-in calendar invite sent

### Offboarding from Care Plan
1. Client requests cancellation (30-day notice required per contract)
2. Final month services delivered in full
3. Final backup provided to client (ZIP download)
4. Hosting transfer instructions sent (if applicable)
5. Offboarding survey sent
6. Referral ask included in final email

### MRR Review Cadence
- **Weekly:** MRR dashboard check (5 min)
- **Monthly:** Full MRR report — new, churned, net, ARPU
- **Quarterly:** MRR growth analysis vs targets, pricing review
- **Annually:** MRR model update, pricing increases, tier restructure if needed

---

## Content Updates Policy

Content updates are included in Care Plans with defined limits to prevent scope creep.

| Plan | Included Monthly | Overage Rate |
|------|-----------------|-------------|
| Care ($197) | 30 min/month | $125/hour |
| SEO Retainer ($497) | 1 hour/month | $125/hour |
| Growth Partner ($997) | 2 hours/month | $125/hour |

**What counts as a content update:**
- Text changes to existing pages
- Image swaps (client-supplied)
- Menu or navigation changes
- Contact info or hours updates
- Simple form changes

**What does NOT count (requires separate quote):**
- New pages
- Design changes
- New features or functionality
- Blog post writing (except SEO/Growth plans)
- Video or animation

---

*Document: MRRArchitecture.md | Phase 9 Section 4 | Version 1.0 | 2026-07-01*
