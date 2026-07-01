# Forecasting Models

**Owner:** Alexander Roman / CEO / CFO  
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Status:** Models Defined — Historical Data Not Yet Available

---

## Purpose

Document the forecasting models for Roman Creative Studio across revenue, leads, capacity, hiring, projects, cash flow, recurring revenue, service demand, and industry expansion. Define the assumptions, variables, and review schedules for each model.

---

## Business Value

Forecasting is not prediction — it is structured thinking about the future. A model that is wrong by 30% is still infinitely more useful than no model at all, because it forces explicit assumptions that can be tested, refined, and improved. Forecasting enables proactive decisions rather than reactive panic.

---

## Forecasting Principles

1. **Bottom-up, not top-down.** Start with what's real: current pipeline, booked projects, active subscribers. Add assumptions for new business.
2. **Three scenarios always.** Conservative, Expected, Optimistic. Never a single-point forecast.
3. **Explicit assumptions.** Every model documents what it assumes. No black-box forecasting.
4. **Monthly recalibration.** Actuals are entered monthly. Models are adjusted if actuals deviate >15% from expected.
5. **No fabricated data.** Starting values are zero or stated assumptions when historical data is unavailable.

---

## Model 1 — Revenue Forecast

### Purpose
Project monthly and annual revenue for the next 12 months.

### Inputs
```
Fixed Inputs (known):
  - Active project remaining milestones (amount + expected month)
  - Active Care Plan subscriptions (amount × 12)
  - Signed proposals awaiting deposit

Variable Inputs (assumed):
  - New projects per month: [X]
  - Average project value: [APV]
  - Care Plan conversion rate: % of project clients who subscribe
  - MRR growth rate: % per month
  - Churn rate: % of Care Plan clients canceling per month
```

### Formula
```
Monthly Revenue = Project Revenue + Care Plan Revenue

Project Revenue = (New Projects × APV) + (Active Projects × Milestone Schedule)
Care Plan Revenue = Previous MRR + (New Subscribers × Plan Rate) - (Churned Subscribers × Plan Rate)
```

### Scenario Table

| Scenario | New Projects/Mo | APV | Care Plan Conv. | MRR Growth |
|----------|----------------|-----|-----------------|------------|
| Conservative | 0.5 | $3,500 | 30% | 3%/mo |
| Expected | 1 | $5,000 | 40% | 7%/mo |
| Optimistic | 2 | $6,500 | 55% | 12%/mo |

*Note: Starting from $0 baseline (no historical data). Update scenarios after first 3 months of real data.*

### Review Schedule
- Monthly: Update actuals, recalibrate next 3-month window
- Quarterly: Reassess full 12-month model, revise scenarios

---

## Model 2 — Lead Forecast

### Purpose
Project the number of qualified leads per month needed to hit revenue targets.

### Formula
```
Leads Required = Revenue Target / (Close Rate × APV)

Backward calculation example:
  Revenue Target: $10,000/mo
  APV: $5,000
  Close Rate: 20%
  Projects needed: 2
  Leads required: 2 / 0.20 = 10 qualified leads
```

### Lead Source Model
```
Total Leads = Organic + Referral + Social + Podcast + Email + Direct

Estimated source split (assumption, to be validated):
  Organic Search: 30%
  Referral: 30%
  Social Media: 15%
  Podcast: 10%
  Email/Newsletter: 10%
  Direct/Other: 5%
```

### Assumptions
- Website organic traffic grows 10% per month after GA4/SEO activation
- Referral rate increases as client base grows (compound effect)
- Social and podcast contribute to awareness; direct lead conversion is lower
- Revise source split quarterly based on CRM attribution data

### Review Schedule
- Weekly: Monitor actual lead count vs forecast
- Monthly: Update source attribution actuals

---

## Model 3 — Capacity Forecast

### Purpose
Determine how many simultaneous projects Alexander can manage at full quality without burnout.

### Capacity Inputs
```
Available Hours per Week: 40
Hours Breakdown:
  — Client project work: 28 hours (70%)
  — Sales/discovery calls: 4 hours (10%)
  — Marketing/content: 4 hours (10%)
  — Admin/operations: 4 hours (10%)

Project Hours by Tier:
  BUILD package:  ~40 hours total over 35 days
  GROW package:   ~70 hours total over 50 days
  SCALE package:  ~120+ hours total over 90 days
```

### Simultaneous Project Capacity
```
Weekly available project hours: 28
Average active hours per project per week:
  BUILD: 40h / 5 weeks = 8h/week → max 3.5 BUILD at once → cap at 3
  GROW:  70h / 7 weeks = 10h/week → max 2.8 GROW at once → cap at 2
  SCALE: 120h / 13 weeks = 9h/week → max 3 SCALE at once → cap at 2

Sustainable capacity recommendation:
  Maximum: 2–3 active projects at any time (mixed tiers)
  Optimal: 2 projects for quality and mental bandwidth
```

### Capacity Warning Triggers
- At 2 active projects: flag calendar before accepting new work
- At 3 active projects: no new projects until one completes (unless SCALE)
- Care Plan clients: each adds ~4h/mo overhead (included in admin allocation)

### Contractor Capacity (Phase 2)
When capacity is exceeded:
- Hire design contractor: adds ~20h/week design capacity
- Hire development contractor: adds ~20h/week development capacity
- This roughly doubles capacity; see `HiringForecast` model

### Review Schedule
- Weekly: Review active project count vs capacity
- Monthly: Review actual hours per project vs estimate

---

## Model 4 — Hiring Forecast

### Purpose
Determine when to make the first hire or contractor engagement based on capacity and revenue.

### Hiring Triggers
```
Contractor (first hire):
  Trigger 1: Capacity consistently at 3 projects for 2+ months
  Trigger 2: MRR >= $3,000 (enough to absorb contractor cost)
  Trigger 3: Revenue >= $8,000/month for 3 consecutive months

Part-time Employee:
  Trigger: Revenue >= $15,000/month for 3 consecutive months
  Role: Operations/Admin (freeing Alexander for billable work)

Full-time Employee (Designer or Developer):
  Trigger: Revenue >= $25,000/month stable
  Revenue per FTE target: $150,000 ARR per FTE (industry standard for boutique agencies)
```

### Hiring Cost Model
```
Freelance Contractor:
  Rate: $50–$75/hour (design) or $60–$80/hour (development)
  Engagement: Project-based, 10–20 hours per project
  Impact on gross margin: -10 to -15% per project

Part-time Admin/Ops:
  Cost: $20–25/hour, 20 hours/week = $1,600–$2,000/mo
  Value: Frees 8–12 hours of Alexander time per week for billable work
  Break-even: ~2 additional hours of billable work per week

Full-time Designer:
  Cost: $55,000–$75,000/year salary
  Required revenue to justify: $220,000–$300,000 ARR
```

### Review Schedule
- Monthly: Check revenue and capacity triggers
- Quarterly: Formal hiring decision review

---

## Model 5 — Project Forecast

### Purpose
Project the number of projects Alexander will complete in each of the next 12 months.

### Formula
```
Projects Completed per Month = f(new projects signed, project duration, capacity)

Simplified model:
  Projects completed = Projects started 35–90 days ago that have reached launch stage

Projected:
  Month 1–3: 1 project/month (building pipeline)
  Month 4–6: 1–2 projects/month (growing pipeline)
  Month 7–12: 2–3 projects/month (established pipeline)
```

### Project Mix Forecast
Targeted tier mix (Expected scenario):
- 40% BUILD ($3,500 avg)
- 40% GROW ($6,500 avg)
- 20% SCALE ($12,000+ avg)

Blended APV at this mix: $6,300

### Review Schedule
- Monthly: Update with actuals
- Quarterly: Reassess tier mix based on real inquiry distribution

---

## Model 6 — Cash Flow Forecast

### Purpose
Project month-by-month cash inflows and outflows to prevent cash gaps.

### Inflows
```
+ Project deposits (50% at contract signing)
+ Project milestone 2 payments (25% at design approval)
+ Project milestone 3 payments (25% at launch)
+ Monthly Care Plan subscriptions (Stripe auto-charge, 1st of month)
```

### Outflows
```
- Software subscriptions: ~$200–$400/month
  (Vercel, Supabase, MailerLite, Calendly, Stripe fees, Google Workspace)
- Contractor payments: variable (per project)
- Marketing spend: variable (optional, initially $0)
- Taxes: ~25–30% of net profit (set aside monthly)
- Equipment: irregular (amortized)
```

### Cash Reserve Target
- Minimum: 2 months of operating expenses in reserve
- Recommended: 3 months of operating expenses
- Operating expenses baseline: ~$500–$800/month (solo, lean)

### Cash Flow Red Flags
- 2+ invoices overdue >14 days: immediate follow-up
- Cash reserve below 1 month of expenses: pause all discretionary spending
- Monthly net income negative 2 months in a row: strategic review required

### Review Schedule
- Monthly: Update actuals, review reserve level
- Quarterly: Full cash flow model review

---

## Model 7 — Recurring Revenue Forecast

### Purpose
Project MRR growth over 12–24 months.

### Formula
```
MRR(next month) = MRR(this month)
  + (New Subscribers × Plan Rate)
  - (Churned Subscribers × Plan Rate)
  ± (Upgrades and Downgrades net)

New Subscribers per Month = New Projects Completed × Care Plan Conversion Rate
```

### MRR Milestone Targets

| MRR Target | Meaning | Est. Timeline |
|------------|---------|---------------|
| $500/mo | First recurring revenue | Month 3–4 |
| $1,000/mo | 5 Care Plan clients | Month 5–6 |
| $2,000/mo | 10 clients or upsells | Month 8–10 |
| $5,000/mo | ~20 clients mix | Month 14–18 |
| $10,000/mo | Scale stage | Month 24+ |

*These are targets based on Expected scenario assumptions, not guarantees.*

### Expansion Revenue Model
MRR can grow without new clients through upgrades:
- Care Plan ($197) → SEO Retainer ($497): +$300/mo per upgrade
- SEO Retainer ($497) → Growth Partner ($997): +$500/mo per upgrade
- Upgrade trigger: proactively offer upgrade when Care Plan client shows engagement with SEO content or asks SEO questions

### Review Schedule
- Weekly: Monitor new subscriptions and cancellations
- Monthly: Full MRR model update

---

## Model 8 — Service Demand Forecast

### Purpose
Anticipate which services and industries will drive the most demand and prepare accordingly.

### Demand Signals to Monitor
- Website traffic to industry-specific pages (which industries search most)
- Form submission industry distribution ("I'm a...": dropdown data)
- CRM industry tags on closed deals
- Industry keyword search volume trends (SEMrush)

### Service Mix Forecast

Current hypothesis (no data yet):
```
Year 1 expected mix:
  Local businesses (dental, medical, retail): 40%
  Nonprofits / churches: 20%
  Startups / tech: 20%
  Other: 20%
```

Revise quarterly based on actual CRM data.

### Service Evolution Forecast
```
Year 1: Website design + Care Plans (core)
Year 2: SEO retainers scale up; first AI-enhanced service offering
Year 3: Template products; course/resource revenue
Year 4+: SaaS or platform revenue
```

### Review Schedule
- Quarterly: Review industry mix from CRM, update hypothesis

---

## Model 9 — Industry Expansion Forecast

### Purpose
Determine which industry verticals to invest in SEO content and landing pages based on market size, competition, and conversion potential.

### Industry Scoring Matrix

| Industry | Market Size | Competition | Conv. Potential | Priority Score |
|----------|------------|-------------|-----------------|----------------|
| Dental / Medical | High | High | High | 8/10 |
| Local Services (plumbing, HVAC) | High | Medium | High | 8/10 |
| Church / Nonprofit | Medium | Low | Medium | 7/10 |
| Real Estate | High | High | Medium | 6/10 |
| Restaurant | High | High | Low | 5/10 |
| Fitness / Wellness | Medium | Medium | Medium | 6/10 |
| Startup / Tech | Medium | High | High | 6/10 |
| Beauty / Salon | Medium | Low | Medium | 6/10 |
| Construction | High | Low | High | 8/10 |
| Education | Medium | Medium | Medium | 5/10 |

*Scores based on assumptions. Validate with actual CRM data after first 6 months.*

### Expansion Sequence
1. Build industry pages for top 3 priority industries (dental, construction, local services)
2. Monitor traffic and conversion for 3 months
3. Expand to next tier based on performance data
4. Invest in SEO-specific content for industries generating leads

### Review Schedule
- Quarterly: Update scoring based on actual performance data

---

## Forecast Model Registry

| Model | File | Review Cadence | Data Required |
|-------|------|----------------|---------------|
| Revenue | `docs/forecasts/RevenueModel.xlsx` | Monthly | Stripe, Supabase |
| Lead | `docs/forecasts/LeadModel.xlsx` | Monthly | HubSpot, GA4 |
| Capacity | `docs/forecasts/CapacityModel.xlsx` | Weekly | Project tracker |
| Hiring | `docs/forecasts/HiringModel.xlsx` | Quarterly | Revenue, capacity |
| Project | `docs/forecasts/ProjectModel.xlsx` | Monthly | Project tracker |
| Cash Flow | `docs/forecasts/CashFlowModel.xlsx` | Monthly | Stripe, expenses |
| MRR | `docs/forecasts/MRRModel.xlsx` | Weekly | Stripe |
| Service Demand | `docs/forecasts/ServiceDemandModel.xlsx` | Quarterly | CRM, GA4 |
| Industry | `docs/forecasts/IndustryModel.xlsx` | Quarterly | CRM, GA4 |

*Excel/Google Sheets templates to be created when forecasting becomes active (Month 1–2).*

---

## Technical Notes

- All forecast actuals stored in Supabase `kpi_snapshots` table
- Forecast models maintained as Google Sheets (accessible offline, easy to update)
- Monthly forecast vs actuals comparison automated via Supabase Edge Function (Phase 2)
- No AI-generated projections without labeling them as projections

---

## Future Enhancements

- [ ] Monte Carlo simulation for revenue scenarios (when 12+ months of data exists)
- [ ] Rolling 12-month forecast updated automatically from Supabase data
- [ ] Scenario comparison dashboard: view all 3 scenarios side-by-side in admin dashboard
- [ ] Industry demand heatmap from GA4 industry page performance

---

## Related Documents

- `KPIDefinitions.md` — all metric definitions used in models
- `BusinessIntelligence.md` — BI architecture that feeds forecasts
- `ScalingRoadmap.md` — growth stage targets inform forecast scenarios
- `RiskManagement.md` — downside scenarios for each model
- `InternalDashboardArchitecture.md` — forecast widget display
