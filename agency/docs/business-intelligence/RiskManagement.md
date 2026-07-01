# Risk Management

**Owner:** Alexander Roman / CEO  
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Status:** Framework Defined — Active Monitoring Begins Month 1

---

## Purpose

Document all material risks to Roman Creative Studio across financial, legal, technical, security, operational, marketing, hiring, client concentration, platform dependency, and disaster recovery dimensions. Define mitigation plans and monitoring protocols for each risk.

---

## Business Value

Risk management is not pessimism — it is professional preparation. Identifying risks before they materialize allows cheap mitigations. Ignoring them until they occur means expensive, reactive responses. A founder who has thought through their risks makes better daily decisions.

---

## Risk Framework

Each risk is assessed on two dimensions:
- **Likelihood:** 1 (rare) – 5 (near-certain)
- **Impact:** 1 (minor) – 5 (existential)
- **Risk Score:** Likelihood × Impact (1–25)
- **Priority:** Critical (16–25) / High (9–15) / Medium (4–8) / Low (1–3)

---

## Financial Risks

### FIN-01 — Revenue Drought
**Description:** Extended period (2+ months) with no new project revenue.  
**Likelihood:** 3 | **Impact:** 4 | **Score:** 12 | **Priority:** High

**Mitigation:**
- Build 2+ months cash reserve before investing in growth
- MRR target: $1,000+/month before Month 6 (provides safety floor)
- Maintain a warm outreach list of 10+ prospects at all times
- Diversify lead sources (SEO, referral, social, podcast) from Day 1

**Monitoring:** If monthly revenue <50% of target for 2 consecutive months, activate outreach campaign immediately.

---

### FIN-02 — Scope Creep Margin Erosion
**Description:** Client projects expand beyond contract scope, consuming unbilled time.  
**Likelihood:** 4 | **Impact:** 3 | **Score:** 12 | **Priority:** High

**Mitigation:**
- Detailed project scope document signed before work begins
- Change order process documented in `ProjectManagementFramework.md`
- Track actual vs estimated hours per project
- Issue change order (additional invoice) for any out-of-scope work

**Monitoring:** Review actual vs estimated hours at end of each project stage.

---

### FIN-03 — Late or Non-Payment
**Description:** Client delays or refuses to pay an invoice.  
**Likelihood:** 3 | **Impact:** 3 | **Score:** 9 | **Priority:** High

**Mitigation:**
- 50% deposit required before work begins (no exceptions)
- Work paused if milestone payment 14+ days overdue
- Stripe auto-charge for Care Plan subscriptions (no manual invoicing risk)
- Clear late payment terms in contract (1.5%/month after 30 days)

**Monitoring:** Invoice aging report reviewed weekly.

---

### FIN-04 — Pricing Too Low
**Description:** Services priced below market, suppressing margins and attracting wrong-fit clients.  
**Likelihood:** 3 | **Impact:** 2 | **Score:** 6 | **Priority:** Medium

**Mitigation:**
- Annual pricing review; increase by 10–15% per year minimum
- Track gross margin per project; flag projects <50% margin
- Remove hourly pricing entirely (value-based only)
- Raise prices when booked >3 weeks out consistently

---

## Legal Risks

### LEG-01 — Client Dispute / Chargebacks
**Description:** Client disputes work quality and demands refund or issues Stripe chargeback.  
**Likelihood:** 2 | **Impact:** 4 | **Score:** 8 | **Priority:** Medium

**Mitigation:**
- Detailed written contract with clear scope, deliverables, and revision limits
- Written approval at each milestone (email or portal signature)
- Document all client-approved decisions
- Maintain all communication in writing
- No refunds after design approval (per contract terms)

**Monitoring:** Any chargeback reviewed within 24 hours; respond to Stripe with documentation.

---

### LEG-02 — Copyright / IP Infringement
**Description:** Using unlicensed images, fonts, or code in client deliverables.  
**Likelihood:** 2 | **Impact:** 4 | **Score:** 8 | **Priority:** Medium

**Mitigation:**
- Only use properly licensed assets (Google Fonts, Unsplash/licensed stock, purchased icons)
- Asset license checklist in project delivery QA
- Contract states client provides licensed materials or approves RCS-sourced assets
- Font licensing checked before use in any commercial project

---

### LEG-03 — Privacy / GDPR Violation
**Description:** Improper handling of client or visitor personal data triggering a complaint or fine.  
**Likelihood:** 2 | **Impact:** 4 | **Score:** 8 | **Priority:** Medium

**Mitigation:**
- Privacy policy published and current
- Cookie consent banner for EU visitors (when traffic warrants)
- Data deletion process documented (`SecurityPrivacy.md`)
- Third-party tools vetted for GDPR compliance

---

### LEG-04 — Accessibility Legal Claim
**Description:** A client's website built by RCS is subject to ADA/accessibility complaint.  
**Likelihood:** 2 | **Impact:** 3 | **Score:** 6 | **Priority:** Medium

**Mitigation:**
- WCAG 2.1 AA compliance required on all deliverables (non-negotiable)
- Lighthouse accessibility score 95+ before launch
- Contract includes accessibility standard statement
- Care Plan includes monthly accessibility monitoring

---

## Technical Risks

### TECH-01 — Website Goes Down
**Description:** `romancreativestudio.co` becomes inaccessible.  
**Likelihood:** 2 | **Impact:** 3 | **Score:** 6 | **Priority:** Medium

**Mitigation:**
- GitHub Pages uptime SLA: 99.9% (backed by GitHub)
- Cloudflare cache serves last-known-good version during GitHub outages
- Recovery time: <15 minutes (see `SecurityPrivacy.md` DR plan)

**Monitoring:** UptimeRobot (free) configured to alert if site down for 5+ minutes.

---

### TECH-02 — Client Website Goes Down (Care Plan)
**Description:** A Care Plan client's website experiences an outage.  
**Likelihood:** 3 | **Impact:** 4 | **Score:** 12 | **Priority:** High

**Mitigation:**
- Monthly backup verification for all Care Plan client sites
- Cloudflare proxy for client sites where applicable (provides DDoS and CDN)
- 4-hour emergency response SLA in Care Plan contract
- Incident response playbook per `SecurityPrivacy.md`

**Monitoring:** UptimeRobot configured per client site.

---

### TECH-03 — Data Loss
**Description:** Supabase data loss due to misconfiguration, deletion, or provider failure.  
**Likelihood:** 1 | **Impact:** 5 | **Score:** 5 | **Priority:** Medium

**Mitigation:**
- Supabase Point-in-Time Recovery (PITR) active on Pro plan
- Weekly manual export of critical tables to Google Drive
- Never run destructive database operations without backup confirmation

---

### TECH-04 — Dependency Deprecation
**Description:** A key library, tool, or API is deprecated or breaks.  
**Likelihood:** 3 | **Impact:** 2 | **Score:** 6 | **Priority:** Medium

**Mitigation:**
- Pin dependency versions in all projects
- Monitor deprecation notices for: Next.js, Supabase, Stripe.js
- Annual dependency audit and upgrade
- Design system built on vanilla CSS (no framework dependency for core site)

---

## Security Risks

### SEC-01 — API Key Exposure
**Description:** An API key is accidentally committed to GitHub or shared insecurely.  
**Likelihood:** 3 | **Impact:** 5 | **Score:** 15 | **Priority:** High

**Mitigation:**
- `.gitignore` includes all `.env` files
- GitHub secret scanning enabled
- Never share API keys over email, Slack, or documents
- Key rotation procedure documented (`SecurityPrivacy.md`)

**Monitoring:** Immediate rotation if exposure suspected. GitHub will email if a key is detected in a commit.

---

### SEC-02 — Admin Account Compromise
**Description:** Alexander's admin account credentials are stolen.  
**Likelihood:** 2 | **Impact:** 5 | **Score:** 10 | **Priority:** High

**Mitigation:**
- TOTP MFA required on all admin accounts
- 1Password for all credential storage
- Unique password for every service
- Session timeout: 2 hours on admin dashboard
- Recovery codes stored in 1Password vault offline

---

### SEC-03 — Client Data Breach
**Description:** Client or lead data in Supabase is accessed by unauthorized party.  
**Likelihood:** 1 | **Impact:** 5 | **Score:** 5 | **Priority:** Medium

**Mitigation:**
- Row-level security on all Supabase tables
- Service role key never exposed to client browser
- All API endpoints require valid JWT
- Third-party security audit before portal public launch

---

## Operational Risks

### OPS-01 — Founder Illness / Unavailability
**Description:** Alexander is unable to work for 1–4 weeks.  
**Likelihood:** 2 | **Impact:** 4 | **Score:** 8 | **Priority:** Medium

**Mitigation:**
- All active project documentation current at all times
- Emergency contractor contact list maintained
- Client communication template for “brief pause” in `CommunicationStandards.md`
- Business continuity plan: who clients contact if Alexander unavailable
- All credentials in 1Password (accessible from any device)

**Monitoring:** No automatic monitoring; review plan quarterly.

---

### OPS-02 — Burnout
**Description:** Overcommitment leads to declining quality, missed deadlines, and health impact.  
**Likelihood:** 3 | **Impact:** 4 | **Score:** 12 | **Priority:** High

**Mitigation:**
- Hard capacity limit: maximum 3 active projects simultaneously
- “No new projects” trigger when at capacity (per `ForecastingModels.md`)
- Maintain protected personal time (evenings/weekends) by design
- 1 week off per quarter minimum
- Delegate before burnout; hire before burnout

**Monitoring:** Weekly: Is project count at capacity? Am I meeting deadlines? How is energy level?

---

### OPS-03 — Project Delivery Failure
**Description:** A project misses its agreed launch date significantly (>2 weeks late).  
**Likelihood:** 3 | **Impact:** 3 | **Score:** 9 | **Priority:** High

**Mitigation:**
- Conservative project timelines (add 20% buffer to estimates)
- Client content dependency is the #1 delay factor — content deadline in contract
- Weekly milestone check in dashboard
- Proactive communication if delay anticipated (never let client discover it first)

---

## Marketing Risks

### MKT-01 — SEO Algorithm Update
**Description:** Google updates its algorithm, causing significant drop in organic rankings.  
**Likelihood:** 3 | **Impact:** 3 | **Score:** 9 | **Priority:** High

**Mitigation:**
- Build brand search (referrals, direct) alongside SEO — don’t depend on Google alone
- Follow Google Search Central blog for algorithm updates
- Focus on quality, helpful content (resistant to many algorithm changes)
- Diversify lead sources so no single channel exceeds 50% of leads

---

### MKT-02 — Negative Review
**Description:** A dissatisfied client posts a negative review on Google Business Profile.  
**Likelihood:** 2 | **Impact:** 3 | **Score:** 6 | **Priority:** Medium

**Mitigation:**
- CSAT surveys before project completion; address dissatisfaction before it goes public
- Respond professionally to all reviews (positive and negative) within 48 hours
- Build volume of positive reviews to dilute any negative impact
- Contract includes clear scope/revision terms to prevent misaligned expectations

---

## Hiring Risks

### HIR-01 — Wrong Hire
**Description:** First contractor or employee doesn’t meet quality standards or fit.  
**Likelihood:** 3 | **Impact:** 3 | **Score:** 9 | **Priority:** High

**Mitigation:**
- Start with project-based contractors before full-time commitments
- Paid trial project before long-term engagement
- Clear scope, standards, and deliverables documented before engagement
- 90-day review for any employee hire

---

### HIR-02 — Key Contractor Departure
**Description:** A contractor RCS depends on becomes unavailable.  
**Likelihood:** 3 | **Impact:** 3 | **Score:** 9 | **Priority:** High

**Mitigation:**
- Never depend on a single contractor for a critical capability
- Maintain backup contractor relationship in each specialty
- All project assets and code in RCS-owned GitHub repo (not contractor’s)
- Document all processes so work can be handed off

---

## Client Concentration Risk

### CLT-01 — Single Client Represents >40% of Revenue
**Description:** One client churning would cause significant revenue impact.  
**Likelihood:** 3 | **Impact:** 4 | **Score:** 12 | **Priority:** High

**Mitigation:**
- Target: no single client represents >25% of revenue by Month 12
- Actively build MRR from multiple small clients (Care Plans) to reduce project dependency
- Monitor revenue concentration monthly in admin dashboard

**Monitoring:** Revenue concentration tracked in `revenue_monthly` table.

---

## Platform Dependency Risk

### PLT-01 — GitHub Pages Discontinuation or Policy Change
**Description:** GitHub changes its Pages product in a way that affects RCS hosting.  
**Likelihood:** 1 | **Impact:** 3 | **Score:** 3 | **Priority:** Low

**Mitigation:**
- Website is static HTML — can be migrated to Netlify, Vercel, or Cloudflare Pages in <1 hour
- All source code in Git; hosting provider is interchangeable

---

### PLT-02 — Stripe Fee Increase or Policy Change
**Description:** Stripe changes fees significantly or restricts a business type.  
**Likelihood:** 1 | **Impact:** 3 | **Score:** 3 | **Priority:** Low

**Mitigation:**
- Monitor Stripe policy updates
- Alternative payment processors researched: Square, Paddle, Lemon Squeezy
- Migration possible in 1–2 weeks with standard Stripe alternative

---

### PLT-03 — Supabase Service Disruption
**Description:** Supabase (portal and admin backend) has significant downtime.  
**Likelihood:** 2 | **Impact:** 3 | **Score:** 6 | **Priority:** Medium

**Mitigation:**
- Monitor Supabase status page
- Portal degrades gracefully during outages (cached data visible)
- Client site is static HTML — unaffected by Supabase downtime
- Critical data backed up weekly to Google Drive

---

## Risk Register Summary

| ID | Risk | Score | Priority | Status |
|----|------|-------|----------|--------|
| FIN-01 | Revenue drought | 12 | High | Monitor |
| FIN-02 | Scope creep | 12 | High | Mitigated |
| FIN-03 | Late payment | 9 | High | Mitigated |
| FIN-04 | Underpricing | 6 | Medium | Monitor |
| LEG-01 | Client dispute | 8 | Medium | Mitigated |
| LEG-02 | IP infringement | 8 | Medium | Mitigated |
| LEG-03 | Privacy violation | 8 | Medium | Monitor |
| LEG-04 | Accessibility claim | 6 | Medium | Mitigated |
| TECH-01 | RCS site down | 6 | Medium | Monitor |
| TECH-02 | Client site down | 12 | High | Mitigated |
| TECH-03 | Data loss | 5 | Medium | Mitigated |
| TECH-04 | Dependency deprecation | 6 | Medium | Monitor |
| SEC-01 | API key exposure | 15 | High | Mitigated |
| SEC-02 | Admin compromise | 10 | High | Mitigated |
| SEC-03 | Client data breach | 5 | Medium | Mitigated |
| OPS-01 | Founder unavailable | 8 | Medium | Monitor |
| OPS-02 | Burnout | 12 | High | Active management |
| OPS-03 | Project delivery failure | 9 | High | Mitigated |
| MKT-01 | SEO algorithm update | 9 | High | Monitor |
| MKT-02 | Negative review | 6 | Medium | Monitor |
| HIR-01 | Wrong hire | 9 | High | Process defined |
| HIR-02 | Contractor departure | 9 | High | Mitigated |
| CLT-01 | Client concentration | 12 | High | Monitor |
| PLT-01 | GitHub Pages changes | 3 | Low | Accepted |
| PLT-02 | Stripe changes | 3 | Low | Accepted |
| PLT-03 | Supabase disruption | 6 | Medium | Mitigated |

---

## Risk Review Cadence

- **Monthly:** Review all High and Critical risks
- **Quarterly:** Full risk register review; update likelihood and impact scores
- **Annually:** Add new risks; retire resolved risks; update mitigation plans

---

## Related Documents

- `SecurityPrivacy.md` — detailed security risk mitigations
- `ForecastingModels.md` — financial risk models (cash flow, capacity)
- `BusinessSystemsAudit.md` — operational risk baseline
- `ScalingRoadmap.md` — risks at each growth stage
- `CommunicationStandards.md` — client communication during risk events
