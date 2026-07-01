# KPI Definitions & Targets

**Owner:** Alexander Roman / CEO  
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Status:** Defined — Tracking Not Yet Active

---

## Purpose

Define every Key Performance Indicator for Roman Creative Studio with its formula, target, review frequency, owner, and recommended dashboard widget. This document is the single source of truth for what “good” looks like across every business dimension.

---

## Business Value

KPIs without definitions are useless — two people will measure the same thing differently and reach opposite conclusions. This document ensures every metric means the same thing to everyone and connects to a specific business outcome.

---

## KPI Framework

RCS KPIs are organized into three categories:
- **Sales & Revenue** — Does the business make money and grow?
- **Website & Marketing** — Does marketing attract and convert the right people?
- **Operations** — Does the business deliver reliably and efficiently?

Each KPI is rated by:
- **Lag vs Lead:** Lag = measures past outcomes. Lead = predicts future outcomes.
- **Cadence:** How often it should be reviewed.
- **Health Thresholds:** Green / Amber / Red benchmarks.

---

## Category 1 — Sales & Revenue KPIs

---

### KPI-S01 — Qualified Leads

**Definition:** A contact who has submitted the contact form or booked a discovery call AND meets at least 2 of: (1) has a clear project, (2) has a realistic budget, (3) has decision-making authority.  
**Formula:** Count of contacts tagged `qualified` in CRM in the measurement period  
**Target:** 8+ qualified leads/month  
**Minimum Threshold:** 4/month (Amber: 4–7, Red: <4)  
**Review Frequency:** Weekly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lead indicator (predicts future revenue)  
**Widget:** KPI card with 30-day trend on Pipeline dashboard

---

### KPI-S02 — Discovery Calls Held

**Definition:** Discovery calls that were scheduled AND completed (not no-showed or rescheduled indefinitely).  
**Formula:** Count of completed discovery calls in period  
**Target:** 6+/month  
**Thresholds:** Green: 6+, Amber: 3–5, Red: <3  
**Review Frequency:** Weekly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lead  
**Widget:** KPI card on Pipeline dashboard; linked to Calendly data

---

### KPI-S03 — Proposal Acceptance Rate

**Definition:** Percentage of sent proposals that result in a signed contract.  
**Formula:** `(Proposals Won / Proposals Sent) × 100`  
**Target:** 40%+  
**Industry Benchmark:** 25–35% (web design agencies, SPI Research 2024)  
**Thresholds:** Green: 40%+, Amber: 25–39%, Red: <25%  
**Review Frequency:** Monthly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lag  
**Widget:** Gauge chart on Pipeline dashboard

---

### KPI-S04 — Close Rate (Lead to Client)

**Definition:** Percentage of all qualified leads that become paying clients.  
**Formula:** `(New Clients / Qualified Leads) × 100` (same period, accounting for typical sales cycle)  
**Target:** 20%+  
**Thresholds:** Green: 20%+, Amber: 10–19%, Red: <10%  
**Review Frequency:** Monthly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lag  
**Widget:** Funnel chart on Pipeline dashboard

---

### KPI-S05 — Average Project Value (APV)

**Definition:** Average revenue per completed project, excluding Care Plans.  
**Formula:** `Total Project Revenue / Number of Projects Completed`  
**Target:** $5,000+ (weighted toward GROW and SCALE tier)  
**Thresholds:** Green: $5k+, Amber: $3k–$4,999, Red: <$3k  
**Review Frequency:** Monthly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lag  
**Widget:** KPI card on Revenue dashboard; trend line

---

### KPI-S06 — Monthly Revenue

**Definition:** Total cash collected in the calendar month (project payments + care plan revenue).  
**Formula:** `SUM(payments.amount) WHERE payment_date in current month`  
**Target:** $10,000+/month (Year 1); $25,000+/month (Year 2)  
**Thresholds:** Green: on/above target, Amber: 75–99% of target, Red: <75% of target  
**Review Frequency:** Monthly (reviewed first business day of next month)  
**Owner:** Alexander Roman  
**Lag/Lead:** Lag  
**Widget:** Revenue bar chart on Overview + Revenue dashboard

---

### KPI-S07 — Annual Revenue

**Definition:** Total cash collected in the calendar year.  
**Formula:** `SUM(monthly_revenue) for all months in year`  
**Target:** $120,000 (Year 1); $300,000 (Year 2)  
**Review Frequency:** Quarterly progress review; annual reset  
**Owner:** Alexander Roman  
**Lag/Lead:** Lag  
**Widget:** Progress bar with annual target on Goals dashboard

---

### KPI-S08 — Monthly Recurring Revenue (MRR)

**Definition:** Predictable monthly revenue from active Care Plan subscriptions only (excludes one-time project revenue).  
**Formula:** `SUM(active_subscriptions.monthly_amount)`  
**Target:** $2,000/month (Year 1); $10,000/month (Year 2)  
**Thresholds:** Green: on/above target, Amber: 50–99%, Red: <50%  
**Review Frequency:** Weekly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lag (but highly predictive of future stability)  
**Widget:** MRR line chart on Revenue dashboard

---

### KPI-S09 — Gross Margin

**Definition:** Revenue minus direct project costs (contractor payments, software per-project costs, hosting costs).  
**Formula:** `(Revenue - Direct Costs) / Revenue × 100`  
**Target:** 65%+ gross margin  
**Industry Benchmark:** 50–70% for boutique digital agencies  
**Thresholds:** Green: 65%+, Amber: 50–64%, Red: <50%  
**Review Frequency:** Monthly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lag  
**Widget:** Margin gauge on Revenue dashboard

---

### KPI-S10 — Net Margin

**Definition:** Profit after all costs (including fixed overhead: software subscriptions, marketing, etc.).  
**Formula:** `(Revenue - Total Costs) / Revenue × 100`  
**Target:** 40%+ net margin  
**Thresholds:** Green: 40%+, Amber: 20–39%, Red: <20%  
**Review Frequency:** Monthly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lag  
**Widget:** KPI card on Revenue dashboard

---

### KPI-S11 — Customer Lifetime Value (LTV)

**Definition:** Total revenue expected from an average client across the entire relationship.  
**Formula:** `(Average Project Value + (Monthly Care Plan × Average Care Plan Duration)) × (1 + Referrals per Client × APV)`  
**Target:** $8,000+ LTV per client  
**Review Frequency:** Quarterly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lead (informs acquisition spend decisions)  
**Widget:** KPI card on Revenue dashboard; updated quarterly

---

### KPI-S12 — Customer Acquisition Cost (CAC)

**Definition:** Total sales and marketing spend divided by the number of new clients acquired.  
**Formula:** `Total Marketing + Sales Spend / New Clients Acquired` (same period)  
**Target:** <$500 CAC (LTV:CAC ratio should be 10:1 or better given high LTV)  
**Thresholds:** Green: <$500, Amber: $500–$1,000, Red: >$1,000  
**Review Frequency:** Quarterly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lag  
**Widget:** KPI card on Marketing dashboard

---

### KPI-S13 — Client Retention Rate

**Definition:** Percentage of Care Plan clients still active after 12 months.  
**Formula:** `(Care Plan Clients Active at Month 12 / Care Plan Clients at Month 0) × 100`  
**Target:** 80%+ annual retention  
**Industry Benchmark:** 70–85% for agency retainers  
**Thresholds:** Green: 80%+, Amber: 65–79%, Red: <65%  
**Review Frequency:** Monthly (rolling 12-month)  
**Owner:** Alexander Roman  
**Lag/Lead:** Lag  
**Widget:** Retention rate KPI card on Revenue dashboard

---

### KPI-S14 — Churn Rate

**Definition:** Percentage of Care Plan clients who cancel in a given month.  
**Formula:** `Cancellations in Month / Active Subscribers at Start of Month × 100`  
**Target:** <3%/month  
**Thresholds:** Green: <3%, Amber: 3–6%, Red: >6%  
**Review Frequency:** Monthly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lag  
**Widget:** Churn rate KPI card; alert if Red

---

### KPI-S15 — Referral Rate

**Definition:** Percentage of new clients who were referred by an existing client.  
**Formula:** `New Clients with Source = 'Referral' / Total New Clients × 100`  
**Target:** 30%+ of new clients from referrals  
**Thresholds:** Green: 30%+, Amber: 15–29%, Red: <15%  
**Review Frequency:** Monthly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lag (measures relationship quality)  
**Widget:** Referral rate KPI card on Pipeline dashboard

---

## Category 2 — Website & Marketing KPIs

---

### KPI-W01 — Organic Traffic

**Definition:** Sessions from search engines (Google, Bing) only.  
**Formula:** GA4 `Sessions` filtered by `Session source = organic`  
**Target:** 500 organic sessions/month (Month 6); 2,000/month (Month 12)  
**Thresholds (Month 12):** Green: 2,000+, Amber: 1,000–1,999, Red: <1,000  
**Review Frequency:** Weekly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lead (organic traffic drives future leads)  
**Widget:** Organic traffic line chart on SEO dashboard

---

### KPI-W02 — Bounce Rate

**Definition:** Percentage of sessions where the visitor viewed only one page and left.  
*(Note: GA4 uses "Engagement Rate" — inverse of bounce rate. Target engagement rate 55%+.)*  
**Formula:** `Engaged Sessions / Total Sessions × 100` (GA4 Engagement Rate)  
**Target:** 55%+ engagement rate  
**Thresholds:** Green: 55%+, Amber: 40–54%, Red: <40%  
**Review Frequency:** Monthly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lead  
**Widget:** Engagement rate KPI card on Marketing dashboard

---

### KPI-W03 — Form Conversion Rate

**Definition:** Percentage of website visitors who complete the contact form.  
**Formula:** `Form Submits / Total Sessions × 100`  
**Target:** 2%+ form conversion rate  
**Industry Benchmark:** 1–3% for service business websites  
**Thresholds:** Green: 2%+, Amber: 1–1.9%, Red: <1%  
**Review Frequency:** Monthly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lead  
**Widget:** Conversion funnel on Marketing dashboard

---

### KPI-W04 — Resource Downloads

**Definition:** Number of lead magnet downloads per month.  
**Formula:** GA4 `resource_download` event count  
**Target:** 50+/month (Month 6); 200+/month (Month 12)  
**Review Frequency:** Monthly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lead  
**Widget:** Event count card on Marketing dashboard

---

### KPI-W05 — Newsletter Signups

**Definition:** New subscribers added to MailerLite per month.  
**Formula:** MailerLite new subscribers added in period  
**Target:** 25+/month (Month 6); 100+/month (Month 12)  
**Review Frequency:** Monthly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lead  
**Widget:** Subscriber growth chart on Marketing dashboard

---

### KPI-W06 — Page Speed Score

**Definition:** Lighthouse Performance score for the homepage on mobile.  
**Formula:** Lighthouse `performance` score (0–100)  
**Target:** 90+ on mobile  
**Thresholds:** Green: 90+, Amber: 70–89, Red: <70  
**Review Frequency:** Monthly (automated via Lighthouse CI)  
**Owner:** Alexander Roman  
**Lag/Lead:** Lag  
**Widget:** Gauge on SEO dashboard

---

### KPI-W07 — Accessibility Score

**Definition:** Lighthouse Accessibility score for all key pages.  
**Formula:** Lighthouse `accessibility` score (0–100)  
**Target:** 95+ on all pages  
**Thresholds:** Green: 95+, Amber: 80–94, Red: <80  
**Review Frequency:** Monthly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lag  
**Widget:** Score card on SEO dashboard

---

### KPI-W08 — SEO Score

**Definition:** Average organic position for all tracked target keywords.  
**Formula:** `Average position across [keyword list]` from Search Console  
**Target:** Average position <20 (Year 1); <10 (Year 2)  
**Review Frequency:** Monthly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lag  
**Widget:** Average position trend on SEO dashboard

---

## Category 3 — Operations KPIs

---

### KPI-O01 — Average Project Duration

**Definition:** Average calendar days from signed contract to project launch.  
**Formula:** `AVG(launch_date - contract_signed_date)` across completed projects  
**Target:** ≤35 days for BUILD; ≤50 days for GROW; ≤90 days for SCALE  
**Thresholds:** Green: at/below target, Amber: 110–130% of target, Red: >130% of target  
**Review Frequency:** After each project completion  
**Owner:** Alexander Roman  
**Lag/Lead:** Lag  
**Widget:** Average duration trend on Projects dashboard

---

### KPI-O02 — On-Time Delivery Rate

**Definition:** Percentage of projects launched on or before the originally agreed launch date.  
**Formula:** `Projects Launched On Time / Total Projects Launched × 100`  
**Target:** 80%+  
**Thresholds:** Green: 80%+, Amber: 65–79%, Red: <65%  
**Review Frequency:** Monthly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lag  
**Widget:** KPI card on Projects dashboard

---

### KPI-O03 — Average Revision Count

**Definition:** Average number of revision rounds per project stage (design and development).  
**Formula:** `Total Revision Requests / Total Projects`  
**Target:** ≤2 revision rounds per stage  
**Thresholds:** Green: ≤2, Amber: 3–4, Red: 5+  
**Review Frequency:** After each project completion  
**Owner:** Alexander Roman  
**Lag/Lead:** Lag (reflects brief quality and alignment)  
**Widget:** KPI card on Projects dashboard

---

### KPI-O04 — Support Response Time

**Definition:** Average time from client support ticket submission to first response.  
**Formula:** `AVG(first_response_time - ticket_created_time)` in hours  
**Target:** ≤4 business hours for first response  
**Thresholds:** Green: ≤4h, Amber: 4–24h, Red: >24h  
**Review Frequency:** Weekly  
**Owner:** Alexander Roman  
**Lag/Lead:** Lag  
**Widget:** Response time KPI on Clients dashboard; alert if Red

---

### KPI-O05 — Client Satisfaction Score (CSAT)

**Definition:** Average score from post-project and quarterly satisfaction surveys (scale 1–10).  
**Formula:** `AVG(survey_responses.score)`  
**Target:** 9.0+/10 average  
**Thresholds:** Green: 9.0+, Amber: 7.5–8.9, Red: <7.5  
**Review Frequency:** After each project; quarterly for Care Plan clients  
**Owner:** Alexander Roman  
**Lag/Lead:** Lag (but predicts referrals and renewals)  
**Widget:** CSAT gauge on Clients dashboard; trend line

---

## KPI Scoreboard Summary

| KPI ID | Name | Target | Frequency | Category |
|--------|------|--------|-----------|----------|
| S01 | Qualified Leads | 8+/mo | Weekly | Sales |
| S02 | Discovery Calls | 6+/mo | Weekly | Sales |
| S03 | Proposal Acceptance | 40%+ | Monthly | Sales |
| S04 | Close Rate | 20%+ | Monthly | Sales |
| S05 | Avg Project Value | $5,000+ | Monthly | Sales |
| S06 | Monthly Revenue | $10k+ | Monthly | Sales |
| S07 | Annual Revenue | $120k Y1 | Quarterly | Sales |
| S08 | MRR | $2k+ | Weekly | Sales |
| S09 | Gross Margin | 65%+ | Monthly | Sales |
| S10 | Net Margin | 40%+ | Monthly | Sales |
| S11 | LTV | $8,000+ | Quarterly | Sales |
| S12 | CAC | <$500 | Quarterly | Sales |
| S13 | Retention Rate | 80%+ | Monthly | Sales |
| S14 | Churn Rate | <3%/mo | Monthly | Sales |
| S15 | Referral Rate | 30%+ | Monthly | Sales |
| W01 | Organic Traffic | 2,000/mo Y1 | Weekly | Website |
| W02 | Engagement Rate | 55%+ | Monthly | Website |
| W03 | Form Conversion | 2%+ | Monthly | Website |
| W04 | Resource Downloads | 200/mo Y1 | Monthly | Website |
| W05 | Newsletter Signups | 100/mo Y1 | Monthly | Website |
| W06 | Page Speed | 90+ | Monthly | Website |
| W07 | Accessibility | 95+ | Monthly | Website |
| W08 | SEO Score | Avg pos <10 Y2 | Monthly | Website |
| O01 | Avg Project Duration | ≤35–90d | Per project | Ops |
| O02 | On-Time Delivery | 80%+ | Monthly | Ops |
| O03 | Avg Revision Count | ≤2 rounds | Per project | Ops |
| O04 | Support Response | ≤4h | Weekly | Ops |
| O05 | CSAT | 9.0+/10 | Per project | Ops |

---

## Technical Notes

- KPIs stored in Supabase `kpi_snapshots` table: `{kpi_id, date, value, source}`
- Automatic snapshots: GA4, MailerLite, Stripe data pulled via scheduled Supabase Edge Functions
- Manual KPIs (CSAT, revision count) entered in admin dashboard after each event
- Historical KPI data retained indefinitely for trend analysis

---

## Future Enhancements

- [ ] KPI alert system: notify Alexander when any KPI enters Red zone
- [ ] Industry benchmark comparisons updated annually
- [ ] NPS (Net Promoter Score) added when client base reaches 10+
- [ ] Team-level KPIs added when first hire is made
- [ ] KPI roll-up into quarterly OKR scoring

---

## Related Documents

- `ExecutiveDashboard.md` — dashboard widgets for each KPI
- `BusinessIntelligenceAudit.md` — current tracking readiness per KPI
- `ForecastingModels.md` — KPI targets inform forecast models
- `ScalingRoadmap.md` — KPI targets shift at each growth stage
- `InternalDashboardArchitecture.md` — technical implementation
