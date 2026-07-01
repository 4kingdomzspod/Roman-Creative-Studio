# Business Intelligence Architecture

**Owner:** Alexander Roman / CEO  
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Status:** Architecture Defined — Implementation Pending

---

## Purpose

Document the complete Business Intelligence architecture for Roman Creative Studio — defining data sources, reporting structures, analytical frameworks, historical reporting systems, trend analysis methodologies, forecasting approaches, benchmarking standards, and the cadence for quarterly and annual reviews.

---

## Business Value

Business Intelligence transforms raw data into decisions. Without BI, an agency grows by luck; with it, growth is engineered. This architecture creates the operating system for evidence-based leadership that will scale with the agency from solo founder to multi-team operation.

---

## BI Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA SOURCES                             │
│  GA4 │ Search Console │ Stripe │ Supabase │ MailerLite      │
│  HubSpot │ Calendly │ Clarity │ Ahrefs │ Formspree          │
└─────────────────────────┬───────────────────────────────────┘
                          │ ETL / Sync
┌─────────────────────────▼───────────────────────────────────┐
│                  DATA WAREHOUSE                             │
│              Supabase (primary store)                       │
│  kpi_snapshots │ revenue │ leads │ projects │ traffic       │
└─────────────────────────┬───────────────────────────────────┘
                          │ Query Layer
┌─────────────────────────▼───────────────────────────────────┐
│              REPORTING & DASHBOARDS                         │
│  Executive Dashboard │ Client Reports │ Weekly Digest       │
│  Monthly Review │ Quarterly OKR │ Annual Plan               │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Data Sources

### Primary Sources

| Source | Data Type | Integration | Sync Frequency |
|--------|-----------|-------------|----------------|
| Google Analytics 4 | Website traffic, events, conversions | GA4 API | Daily |
| Google Search Console | Organic rankings, impressions, CTR | Search Console API | Daily |
| Stripe | Revenue, invoices, subscriptions | Stripe webhooks + API | Real-time |
| Supabase | Projects, clients, tasks, contacts | Native | Real-time |
| MailerLite | Email subscribers, campaign performance | MailerLite API | Daily |
| HubSpot | Lead pipeline, deal stages | HubSpot API | Daily |
| Calendly | Discovery calls booked, held, canceled | Calendly webhooks | Real-time |
| Microsoft Clarity | Heatmaps, session recordings | Clarity dashboard (manual) | Weekly review |
| Formspree | Contact form submissions | Formspree webhooks | Real-time |

### Secondary Sources (Future)

| Source | Data Type | Priority |
|--------|-----------|----------|
| Ahrefs / SEMrush | Keyword rankings, backlinks | High |
| QuickBooks | Accounting, tax, expenses | High |
| Google Business Profile | Local search presence | Medium |
| Podcast host analytics | Episode downloads, audience | Medium |
| Social media platforms | Follower growth, engagement | Low |

---

## 2. Data Warehouse Schema

### Core Analytics Tables (Supabase)

```sql
-- KPI snapshots: one row per KPI per day
CREATE TABLE kpi_snapshots (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id      TEXT NOT NULL,        -- 'S01', 'W01', etc.
  snapshot_date DATE NOT NULL,
  value       NUMERIC NOT NULL,
  source      TEXT,                  -- 'ga4', 'stripe', 'manual'
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Revenue summary: one row per month
CREATE TABLE revenue_monthly (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month           DATE NOT NULL,     -- first day of month
  project_revenue NUMERIC DEFAULT 0,
  mrr             NUMERIC DEFAULT 0,
  total_revenue   NUMERIC DEFAULT 0,
  gross_margin    NUMERIC,
  net_margin      NUMERIC,
  new_clients     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Lead funnel: one row per month per stage
CREATE TABLE lead_funnel_monthly (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month         DATE NOT NULL,
  stage         TEXT NOT NULL,       -- 'visitor','lead','qualified','discovery','proposal','client'
  count         INTEGER DEFAULT 0,
  source        TEXT,                -- 'organic','referral','social','direct'
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Traffic summary: one row per day
CREATE TABLE traffic_daily (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date            DATE NOT NULL,
  sessions        INTEGER DEFAULT 0,
  organic         INTEGER DEFAULT 0,
  direct          INTEGER DEFAULT 0,
  referral        INTEGER DEFAULT 0,
  social          INTEGER DEFAULT 0,
  email           INTEGER DEFAULT 0,
  form_submits    INTEGER DEFAULT 0,
  cta_clicks      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. Reporting Architecture

### Report Types

#### 3.1 — Real-Time Dashboard
- **Audience:** Alexander (internal only)
- **Cadence:** Always-on, refreshed per widget schedule
- **Format:** Interactive web dashboard (`admin.romancreativestudio.co/dashboard`)
- **Contents:** All 28 KPIs + live pipeline + project health
- **See:** `ExecutiveDashboard.md`

#### 3.2 — Weekly Digest Email
- **Audience:** Alexander
- **Cadence:** Every Monday at 8am
- **Format:** Email (Resend + AI-generated narrative)
- **Contents:**
  - Revenue last 7 days vs prior 7 days
  - Leads this week vs last week
  - Tasks due this week
  - Projects with health changes
  - 1 insight (AI-generated: "Your highest-converting page last week was...")
- **Generation:** Supabase Edge Function + Claude API (claude-haiku-4-5)

#### 3.3 — Monthly Business Review
- **Audience:** Alexander
- **Cadence:** First Monday of each month
- **Format:** Google Doc + dashboard session
- **Contents:**
  - All KPI actuals vs targets (RAG status for each)
  - Revenue actuals vs forecast
  - Lead volume and conversion rates
  - Top 3 wins, top 3 lessons
  - Marketing performance summary
  - Project delivery performance
  - Decisions made and rationale
- **Template:** `docs/templates/MonthlyReviewTemplate.md`

#### 3.4 — Quarterly OKR Review
- **Audience:** Alexander
- **Cadence:** Last week of each quarter
- **Format:** Structured review document
- **Contents:**
  - OKR scoring (0.0–1.0 for each Key Result)
  - What we committed to vs what we achieved
  - Root cause analysis for missed KRs
  - Next quarter OKR draft
  - Strategic adjustments
- **Template:** `docs/templates/QuarterlyReviewTemplate.md`

#### 3.5 — Annual Plan Document
- **Audience:** Alexander
- **Cadence:** December each year
- **Format:** Comprehensive planning document
- **Contents:**
  - Year in review: all KPIs, milestones, wins, setbacks
  - Financial summary: P&L, MRR growth, client count
  - Scaling stage assessment (per `ScalingRoadmap.md`)
  - Next year revenue and growth targets
  - Hiring plan (if applicable)
  - Product roadmap priorities
  - Marketing strategy updates
  - Risk review and mitigation updates
- **Template:** `docs/templates/AnnualPlanTemplate.md`

#### 3.6 — Client Monthly Report
- **Audience:** Care Plan clients
- **Cadence:** First 5 business days of each month
- **Format:** PDF + portal display
- **Contents:** Per `ClientReporting.md`

---

## 4. Trend Analysis Framework

### Trend Windows

| Window | Use Case | Interpretation |
|--------|----------|----------------|
| 7-day | Tactical monitoring | Identify immediate spikes/drops |
| 30-day | Monthly comparison | Month-over-month performance |
| 90-day | Quarterly view | Trend direction, seasonality |
| 365-day | Annual view | Year-over-year growth |
| All-time | Baseline and cumulative | Total business trajectory |

### Trend Calculation Rules
- All percentage changes calculated as: `(Current - Prior) / Prior × 100`
- Minimum sample required for trend: 4 data points (4 weeks or 4 months)
- Seasonality adjustment: document known seasonal patterns (e.g., slower in December)
- Anomaly detection: flag any single-period change exceeding ±50% for manual review

### Trend Visualization Standards
- Upward trend (positive metric): green arrow ↑
- Downward trend (negative metric): red arrow ↓
- Upward trend (negative metric like churn): red arrow ↑
- Neutral (<5% change): gray dash —
- Insufficient data: gray dash — with tooltip "Insufficient data"

---

## 5. Benchmarking Standards

### Industry Benchmarks

The following benchmarks are sourced from industry reports (SPI Research, Agency Analytics, Promethean Research) and should be updated annually.

| Metric | RCS Target | Agency Benchmark (Boutique) | Source |
|--------|-----------|----------------------------|--------|
| Proposal Win Rate | 40% | 25–35% | SPI Research |
| Gross Margin | 65% | 50–70% | Agency Analytics |
| Client Retention | 80% | 70–85% | SPI Research |
| Avg Project Value | $5,000 | $3,500–$8,000 | Custom research |
| Form Conversion Rate | 2% | 1–3% | HubSpot benchmarks |
| Email Open Rate | 35% | 25–35% | MailerLite benchmarks |
| Organic CTR (average) | 3% | 2–5% | Search Console industry |

### Benchmarking Process
1. Record actual at end of each quarter
2. Compare to benchmark range
3. If consistently above benchmark: raise internal target
4. If consistently below benchmark: root cause analysis required
5. Update benchmarks annually in this document

---

## 6. Growth Dashboards

### Dashboard 1 — Revenue Growth
Purpose: Is the agency growing in revenue year-over-year?  
Key charts: MRR growth curve, ARR trend, project revenue by month, revenue mix pie

### Dashboard 2 — Lead Generation
Purpose: Is marketing generating enough qualified leads to hit revenue targets?  
Key charts: Lead volume trend, source attribution, conversion funnel, pipeline velocity

### Dashboard 3 — Operational Excellence
Purpose: Is the agency delivering quality work on time?  
Key charts: On-time delivery rate, CSAT trend, revision count, project duration

### Dashboard 4 — Content & SEO
Purpose: Is content investment generating organic traffic and leads?  
Key charts: Organic traffic trend, keyword rankings, content ROI (leads per piece), page performance

### Dashboard 5 — Recurring Revenue
Purpose: Is the agency building predictable, stable income?  
Key charts: MRR trend, churn rate, retention curve, Care Plan tier distribution

---

## 7. Forecasting Overview

See `ForecastingModels.md` for full methodology.

BI forecasting philosophy:
- **Bottom-up:** Start with real pipeline data, not top-down targets
- **Three scenarios:** Conservative / Expected / Optimistic for all revenue forecasts
- **Assumption transparency:** Every forecast documents its assumptions explicitly
- **Monthly recalibration:** Actuals vs forecast compared monthly; model adjusted if off >15%
- **No fabrication:** Forecasts are based on real historical data or stated assumptions when data is unavailable

---

## 8. Quarterly Review Cadence

### Q1 Review (April)
- Assess Q1 OKR completion
- Review YTD revenue vs annual target
- Marketing channel performance review
- Product roadmap priority check
- Set Q2 OKRs

### Q2 Review (July)
- Mid-year progress assessment
- First-half P&L review
- Scaling stage reassessment (per `ScalingRoadmap.md`)
- Hiring plan review (if any)
- Set Q3 OKRs

### Q3 Review (October)
- Q3 OKR completion
- Year-end revenue forecast update
- Holiday/Q4 pipeline review
- Annual plan preparation begins
- Set Q4 OKRs

### Q4 Review (December–January)
- Full year review
- Annual KPI scorecard
- P&L summary
- Annual plan for next year (full document)
- Set Year OKRs

---

## 9. Annual Review Structure

The annual review is the most important strategic document of the year. Structure:

**Part 1 — Year in Numbers**
- Revenue, clients, projects (actuals vs targets)
- All 28 KPIs: final year values
- MRR trajectory (start vs end of year)

**Part 2 — What Worked**
- Top 3 client wins
- Top 3 marketing wins
- Top 3 operational improvements

**Part 3 — What Didn't**
- Missed KPIs and root causes
- Lost deals and patterns
- Operational failures and fixes applied

**Part 4 — Strategic Assessment**
- Scaling stage progress (per `ScalingRoadmap.md`)
- Competitive landscape changes
- Industry trends affecting RCS

**Part 5 — Next Year Plan**
- Annual revenue target
- MRR target
- New product/service launches
- Hiring plan
- Marketing strategy
- Technology investment

---

## 10. Executive Summary Format

Every monthly and quarterly report begins with a 1-page Executive Summary:

```
RCS Executive Summary — [Month/Quarter Year]

Business Health: [Green / Amber / Red]

Revenue: $X (vs $X target) — [▲ / ▼ / —] X%
MRR: $X (vs $X target)
New Clients: X
Active Projects: X
Open Leads: X

Top Win: [One sentence]
Biggest Challenge: [One sentence]
Most Important Decision This Period: [One sentence]

Look Ahead: [Two sentences on next month/quarter priorities]
```

---

## Technical Notes

- Primary BI storage: Supabase (see schema above)
- Report generation: Supabase Edge Functions + Claude API for narrative generation
- Report delivery: Resend (email) + client portal (PDF display)
- Dashboard: Next.js + Recharts/Tremor (see `ExecutiveDashboard.md`)
- Data retention: All BI data retained indefinitely in Supabase
- Backup: Supabase PITR covers all BI data

---

## Future Enhancements

- [ ] Natural language query interface: "What was revenue in Q2?" → AI answers from data
- [ ] Automated anomaly detection: alert when any metric deviates >20% from trend
- [ ] Cohort analysis: track how clients acquired in different months behave over time
- [ ] Attribution modeling: multi-touch attribution for lead sources
- [ ] Custom BI platform (replacing third-party tools) — see `InnovationLab.md`

---

## Related Documents

- `BusinessIntelligenceAudit.md` — current BI readiness
- `KPIDefinitions.md` — all metric definitions
- `ExecutiveDashboard.md` — dashboard architecture
- `ForecastingModels.md` — forecasting methodology
- `ClientReporting.md` — client-facing reporting
- `IntegrationReadiness.md` — data source integrations
