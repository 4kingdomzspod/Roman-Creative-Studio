# Business Scenarios
# Roman Creative Studio — Financial Operating System
# Section 9 of 15 | ERD Version 1.0

---

## Purpose

Document financial scenario planning for Roman Creative Studio — modeling conservative, expected, and optimistic outcomes across revenue, expenses, hiring, and growth — so the business is prepared for multiple futures.

**Business Value:** Scenario planning eliminates financial surprises. It forces honest assessment of best and worst cases, ensures reserves are sufficient, and identifies early warning signs before they become crises.

**Owner:** CEO / CFO  
**Version:** 1.0  
**Related Documents:** FinancialKPIs.md, CashFlow.md, FiveYearRoadmap.md, MRRArchitecture.md

---

## Scenario Framework

Every scenario is modeled across 3 tracks:

| Track | Definition |
|-------|------------|
| **Conservative** | Slower growth, longer sales cycles, some churn, no new major wins |
| **Expected** | Steady execution, normal close rates, planned MRR growth |
| **Optimistic** | Multiple simultaneous wins, referral momentum, faster than planned MRR |

---

## Year 1 Scenarios

### Scenario A: Conservative (Year 1)

**Assumptions:**
- 1 project/month average at $3,500 average value
- MRR grows to $1,500/month by December
- 1 project lost to competitor
- No SCALE-tier project
- 1–2 care plan cancellations

| Metric | Value |
|--------|-------|
| Project revenue | $36,000–$40,000 |
| MRR (December) | $1,500/month |
| Annual MRR revenue | ~$8,000 |
| Total Year 1 Revenue | ~$44,000–$48,000 |
| Total Expenses | ~$18,000 |
| Owner Pay | ~$14,400 ($1,200/month) |
| Tax Reserve | ~$11,000 (25%) |
| Net Savings | ~$4,600 |
| Emergency Fund | ~$2,500 |

**Risk:** Barely covers minimum viable owner pay. No hiring possible. Heavy dependence on project revenue.

**Response if tracking conservative:** Increase marketing activity. Lower threshold to accept $2,800 projects. Focus hard on care plan conversions.

---

### Scenario B: Expected (Year 1)

**Assumptions:**
- 1.5 projects/month average at $4,200 average value
- MRR grows to $3,500/month by December
- 1 GROW-tier project
- 80% care plan conversion from projects
- <5% monthly churn on MRR

| Metric | Value |
|--------|-------|
| Project revenue | $52,000–$58,000 |
| MRR (December) | $3,500/month |
| Annual MRR revenue | ~$14,000 |
| Total Year 1 Revenue | ~$66,000–$72,000 |
| Total Expenses | ~$22,000 |
| Owner Pay | ~$24,000 ($2,000/month) |
| Tax Reserve | ~$17,000 (25%) |
| Net Savings | ~$9,000 |
| Emergency Fund | ~$5,000 (fully funded) |

**Status:** Comfortable. First contractor relationships established. First FT hire possible in Year 2.

---

### Scenario C: Optimistic (Year 1)

**Assumptions:**
- 2+ projects/month at $5,000 average
- 1 SCALE-tier project ($12,000+)
- MRR grows to $6,000/month by December
- Strong referral momentum (3+ referral clients)
- 90% care plan conversion

| Metric | Value |
|--------|-------|
| Project revenue | $90,000–$105,000 |
| MRR (December) | $6,000/month |
| Annual MRR revenue | ~$24,000 |
| Total Year 1 Revenue | ~$114,000–$129,000 |
| Total Expenses | ~$32,000 |
| Owner Pay | ~$40,000 ($3,333/month) |
| Tax Reserve | ~$30,000 (25%) |
| Net Savings | ~$27,000 |
| Emergency Fund | $5,000 (fully funded by Month 4) |

**Status:** Exceptional. First FT hire in Year 1. Growth Investment Fund fully funded.

---

## Year 2 Scenarios

### Scenario A: Conservative (Year 2)

| Metric | Value |
|--------|-------|
| Project revenue | $45,000–$55,000 |
| MRR (December) | $4,000/month |
| Total Revenue | $65,000–$85,000 |
| Team size | CEO + 1 contractor |
| Owner Pay | $28,000 ($2,333/month) |

---

### Scenario B: Expected (Year 2)

| Metric | Value |
|--------|-------|
| Project revenue | $70,000–$85,000 |
| MRR (December) | $8,000/month |
| Total Revenue | $120,000–$145,000 |
| Team size | CEO + 1 FT dev + 1 PT designer |
| Owner Pay | $48,000 ($4,000/month) |

---

### Scenario C: Optimistic (Year 2)

| Metric | Value |
|--------|-------|
| Project revenue | $100,000–$130,000 |
| MRR (December) | $14,000/month |
| Total Revenue | $200,000–$250,000 |
| Team size | CEO + 2 FT + 2 contractors |
| Owner Pay | $72,000 ($6,000/month) |

---

## Stress Test Scenarios

### Stress Test 1: Revenue Drought (0 new projects for 60 days)

**Trigger:** No new projects close for 2 consecutive months.

**Financial impact:**
- Month 1: MRR only (e.g., $2,000 at Year 1 mid-point)
- Month 2: MRR only ($2,000)
- Gap vs. operating costs: ~$1,500–2,000/month deficit
- Total 60-day cash impact: ~$3,000–4,000 shortfall

**Response protocol:**
1. **Week 1:** Activate lead generation (LinkedIn, email past clients, referral ask)
2. **Week 2:** Offer quick-win projects ($499–$999) to close fast and generate cash
3. **Week 3:** Reach out to all proposals sent in last 6 months (re-engagement)
4. **Week 4:** Emergency reserve activated if operating account <$2,000
5. **Month 2:** Defer all discretionary expenses

**Survivability:** Yes, if emergency reserve is funded ($5,000). Survivable for 3–4 months on MRR + reserve.

---

### Stress Test 2: Large Client Cancels Care Plan

**Trigger:** Largest care plan client ($997/month Growth Partner) cancels.

**Financial impact:**
- Immediate MRR drop: ~15–20% of MRR (if early stage)
- Annual impact: ~$11,964 revenue loss

**Response protocol:**
1. Retention call within 48 hours of cancellation notice
2. Offer concession (1 free month, downgrade option) to retain
3. Document root cause: price sensitivity, service dissatisfaction, business closure?
4. Accelerate pipeline to replace lost MRR within 60 days
5. Review: was there a warning signal we missed?

**Prevention:** Monthly client health check. CSAT tracking. Proactive check-ins before renewal month.

---

### Stress Test 3: Unexpected $5,000 Expense

**Trigger:** Equipment failure, legal issue, or emergency requires $5,000 unplanned expense.

**Financial impact:**
- Cash reserve drawn down by $5,000
- Emergency fund depleted if fully used

**Response protocol:**
1. Evaluate urgency: can we wait 30 days? (if no, proceed)
2. Draw from emergency reserve (document reason and amount)
3. Suspend growth investment fund contributions until reserve replenished
4. Replenish reserve within 90 days
5. Review: was this preventable? (insurance, maintenance, contingency planning)

---

### Stress Test 4: Slow Growth (Half of Expected Year 1 Revenue)

**Trigger:** Only 50% of expected revenue materializes in Year 1.

**Financial impact:** ~$33,000–$36,000 total revenue

**Response protocol:**
1. **Month 3:** If revenue <50% of monthly target, evaluate marketing strategy
2. **Month 6:** If still at <50% pace, seek 1:1 advisory / SCORE mentorship
3. **Month 9:** Evaluate: continue / pivot / side income to sustain
4. **Survival mode:** Owner pay to $800/month; expenses to minimum $400/month
5. **Survivability:** If CEO has 6-month personal savings, this is survivable through Year 1

---

## Scenario Monitoring Triggers

| Trigger | Scenario Shift |
|---------|---------------|
| Monthly revenue <70% of target for 2 months | Move to Conservative protocol |
| Monthly revenue >130% of target for 2 months | Move to Optimistic protocol |
| MRR churn >5%/month | Churn response protocol |
| Pipeline <1.5× monthly target | Lead generation emergency |
| Cash runway <60 days | Emergency Level 1 (CashFlow.md) |
| Emergency reserve <50% funded | Suspend growth investments |

---

*Document: BusinessScenarios.md | Phase 9 Section 9 | Version 1.0 | 2026-07-01*
