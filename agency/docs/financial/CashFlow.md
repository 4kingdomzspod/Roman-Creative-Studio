# Cash Flow
# Roman Creative Studio — Financial Operating System
# Section 7 of 15 | ERD Version 1.0

---

## Overview

Cash flow is the oxygen of a service business. Revenue on paper means nothing if cash doesn't arrive when expenses are due. This document defines the full cash flow architecture for Roman Creative Studio — payment timing, collection policies, expense scheduling, reserve strategy, and scenario planning.

**Cash Flow Mantra:** Get paid before you deliver. Build reserves before you spend. Invest only from surplus.

---

## Payment Schedule Architecture

### Project Payment Structure (All Tiers)

All projects use a 3-milestone payment structure. No exceptions.

```
Project Lifecycle Cash Flow:

  SIGNED CONTRACT
        │
        ▼
  ┌─────────────────────────────────────────┐
  │  Milestone 1: Deposit (50%)             │
  │  Due: Upon contract signing             │
  │  Work begins after payment received     │
  └─────────────────────────────────────────┘
        │
        ▼
  [Design Phase]
        │
        ▼
  ┌─────────────────────────────────────────┐
  │  Milestone 2: Design Approval (25%)     │
  │  Due: Upon client design approval       │
  │  Development begins after payment       │
  └─────────────────────────────────────────┘
        │
        ▼
  [Development Phase]
        │
        ▼
  ┌─────────────────────────────────────────┐
  │  Milestone 3: Launch Payment (25%)      │
  │  Due: 24 hours before website goes live │
  │  Launch occurs after payment received   │
  └─────────────────────────────────────────┘
        │
        ▼
  LAUNCH DAY
```

### Payment Timing by Tier

#### BUILD Project — $3,500 Typical
| Milestone | Amount | Timing | Cash Received |
|-----------|--------|--------|---------------|
| Deposit | $1,750 (50%) | Day 0 — contract signing | Day 0–1 |
| Design approval | $875 (25%) | Day 14–21 — after client approves mockups | Day 14–22 |
| Launch payment | $875 (25%) | Day 27–35 — before launch | Day 27–36 |
| **Total** | **$3,500** | | **30–36 days** |

#### GROW Project — $6,500 Typical
| Milestone | Amount | Timing | Cash Received |
|-----------|--------|--------|---------------|
| Deposit | $3,250 (50%) | Day 0 | Day 0–1 |
| Design approval | $1,625 (25%) | Day 21–28 | Day 21–29 |
| Launch payment | $1,625 (25%) | Day 42–56 | Day 42–57 |
| **Total** | **$6,500** | | **42–57 days** |

#### SCALE Project — $12,000 Minimum
| Milestone | Amount | Timing | Cash Received |
|-----------|--------|--------|---------------|
| Deposit | $6,000 (50%) | Day 0 | Day 0–1 |
| Design approval | $3,000 (25%) | Day 28–35 | Day 28–36 |
| Launch payment | $3,000 (25%) | Day 60–90 | Day 60–91 |
| **Total** | **$12,000** | | **60–91 days** |

---

## Recurring Billing Schedule

### MRR Billing Architecture

All Care Plan billing runs through Stripe auto-charge on the 1st of each month.

```
Monthly Billing Cycle:

  Day 1: Stripe auto-charges all active subscriptions
  Day 1-2: Payment processing + confirmation emails sent
  Day 3: Failed payment notifications sent (Stripe dunning)
  Day 5: First retry for failed payments
  Day 10: Second retry for failed payments
  Day 14: Final notice — service pause warning
  Day 21: Service paused (if still unpaid)
  Day 30: Contract termination notice (if still unpaid)
```

### Recurring Cash Flow Calendar (Monthly)

| Day of Month | Cash Flow Event |
|-------------|----------------|
| 1st | All MRR auto-charges processed |
| 1st | Owner draw #1 (50% of planned monthly draw) |
| 1st–5th | Review prior month revenue + expense actuals |
| 5th | Tax reserve funding (25–30% of all income received) |
| 5th | Emergency reserve contribution ($250) |
| 10th | Growth fund contribution ($200) |
| 15th | Owner draw #2 (remaining 50% of planned draw) |
| 15th | Review pipeline — any invoices outstanding? |
| Last day | Prepare next month projections (15 min) |

---

## Cash Flow Projections

### Month-by-Month Year 1 Cash Flow (Expected Scenario)

**Assumptions:**
- Projects close: 1 BUILD/month starting Month 3, 1 GROW at Month 5, 1 SCALE at Month 9
- MRR: $197 per client starting Month 3 (converts from project)
- Expenses: $2,000–$2,500/month (owner pay $2,000 + operations ~$300–$500)

| Month | Project Revenue | MRR Revenue | Total In | Expenses | Net Cash Flow | Cumulative |
|-------|----------------|------------|---------|----------|---------------|------------|
| M1 | $0 | $0 | $0 | $500 | -$500 | -$500 |
| M2 | $1,750 (deposit) | $0 | $1,750 | $1,500 | +$250 | -$250 |
| M3 | $1,750 (balance) | $197 | $1,947 | $2,000 | -$53 | -$303 |
| M4 | $3,500 (new) | $394 | $3,894 | $2,200 | +$1,694 | +$1,391 |
| M5 | $5,250* | $594 | $5,844 | $2,300 | +$3,544 | +$4,935 |
| M6 | $3,250 (deposit) | $791 | $4,041 | $2,300 | +$1,741 | +$6,676 |
| M7 | $1,625 + $3,500 | $988 | $6,113 | $2,500 | +$3,613 | +$10,289 |
| M8 | $1,625 (balance) | $1,185 | $2,810 | $2,500 | +$310 | +$10,599 |
| M9 | $6,000 (deposit) | $1,382 | $7,382 | $2,500 | +$4,882 | +$15,481 |
| M10 | $3,000 | $1,579 | $4,579 | $2,500 | +$2,079 | +$17,560 |
| M11 | $5,250 + $3,000 | $1,776 | $10,026 | $2,800 | +$7,226 | +$24,786 |
| M12 | $3,500 (new) | $1,973 | $5,473 | $3,000 | +$2,473 | +$27,259 |
| **TOTAL** | **~$40,450** | **~$10,859** | **~$51,309** | **~$27,100** | **~$24,209** | |

*M5 includes GROW project deposit $3,250 + BUILD completion $1,750 + BUILD deposit $250

---

## Cash Flow Gaps — Identification & Management

### Common Gap Scenarios

#### Scenario 1: Project Pipeline Dry Month
**Trigger:** No new projects close; only MRR revenue
**Cash Flow Impact:** Revenue = MRR only (Year 1 = $0–$2,000/month early stage)
**Risk:** Cannot cover operating expenses + owner pay
**Response Protocol:**
1. Review all active proposals — accelerate close
2. Reactivate past clients (check-in email + care plan offer)
3. Post on social about availability + quick-turnaround projects
4. Draw from emergency reserve only if gap >45 days
5. Reduce discretionary spending immediately

#### Scenario 2: Client Payment Delay
**Trigger:** Client misses payment deadline (invoice 14+ days past due)
**Cash Flow Impact:** Expected cash does not arrive
**Response Protocol:**
1. Day 8: Friendly email reminder
2. Day 14: Work pause notification (per contract)
3. Day 21: Formal demand letter with 1.5% late fee
4. Day 30: Collections warning
5. Day 45+: Collections process or small claims (if >$1,000)

#### Scenario 3: Large Unexpected Expense
**Trigger:** Equipment failure, legal issue, security breach
**Response Protocol:**
1. Evaluate necessity (can we operate without it?)
2. Draw from emergency reserve (document reason)
3. Delay discretionary purchases until reserve replenished
4. Do not draw from tax reserve — tax liability still exists

#### Scenario 4: Two Projects Simultaneous (Revenue Spike)
**Trigger:** Two large projects close in same month
**Response Protocol:**
1. Separate tax reserve allocation for both (25–30% set aside immediately)
2. Do not increase owner pay until 90-day trend confirmed
3. Allocate surplus to emergency fund first, then growth investment
4. Avoid lifestyle inflation — reinvest in systems

---

## Reserve Strategy

### Three-Bucket Reserve System

```
┌─────────────────────────────────────────────────────────┐
│                  CASH RESERVE SYSTEM                    │
│                                                         │
│  BUCKET 1: OPERATING ACCOUNT                            │
│  Purpose: Day-to-day income and expenses                │
│  Balance: 1–2 months operating expenses (~$3,000–$6,000) │
│  Bank: Primary business checking                        │
│                                                         │
│  BUCKET 2: TAX RESERVE                                  │
│  Purpose: Quarterly estimated tax payments              │
│  Balance: 25–30% of all revenue received                │
│  Bank: Separate savings account (HYSA)                  │
│  NEVER touch except for tax payments                    │
│                                                         │
│  BUCKET 3: EMERGENCY RESERVE                            │
│  Purpose: Business continuity under stress              │
│  Target: $5,000 (6 months lean operations)              │
│  Bank: Separate savings account (different bank)        │
│  Access: Only in genuine emergency                      │
└─────────────────────────────────────────────────────────┘
```

### Reserve Build Schedule

| Month | Emergency Reserve Contribution | Tax Reserve | Running Emergency Balance |
|-------|-------------------------------|-------------|---------------------------|
| M1 | $0 (no revenue) | $0 | $0 |
| M2 | $100 | 25% of income | $100 |
| M3 | $150 | 25% of income | $250 |
| M4 | $250 | 25% of income | $500 |
| M5 | $500 | 25% of income | $1,000 |
| M6–M9 | $500/month | 25% of income | $3,000 |
| M10–M14 | $500/month | 25% of income | **$5,000 TARGET** |

**Once emergency reserve hits $5,000:** Redirect $500/month to growth investment fund.

---

## Expense Payment Scheduling

### Fixed Expenses (Pay on specific date)

| Expense | Amount | Pay Date | Category |
|---------|--------|----------|----------|
| Google Workspace | $12 | 1st | Software |
| Adobe Creative Cloud | $55 | 15th | Software |
| Calendly | $10 | 5th | Software |
| Figma | $15 | 10th | Software |
| Insurance (if monthly) | $100 | 1st | Insurance |
| **Subtotal** | **~$192** | | |

### Variable Expenses (Pay as incurred)
- Contractor payments: Net-14 after invoice received
- Hardware: Only when budgeted + approved
- Education: As purchased, up to monthly cap
- Marketing: As campaigns launch, up to monthly cap

### Annual Lump Expenses (Plan and save for)

| Expense | Annual Cost | Monthly Set-Aside | Month Due |
|---------|------------|------------------|----------|
| Domain renewals | $50–$100 | $8 | January |
| Annual software (annual billing discount) | $200–$400 | $25 | Various |
| Business insurance (annual) | $900–$1,400 | $100 | January |
| CPA / tax prep | $500–$1,500 | $100 | March/April |
| LLC/registered agent renewal | $50–$150 | $12 | January |

---

## Seasonal Cash Flow Planning

### Agency Business Seasonality

| Quarter | Revenue Pattern | Action |
|---------|----------------|--------|
| Q1 (Jan–Mar) | Historically slow | Lead generation focus; push for annual retainer renewals |
| Q2 (Apr–Jun) | Ramp up | Spring project push; proposal volume increases |
| Q3 (Jul–Sep) | Strongest (new fiscal year for many businesses) | Best time to close SCALE-tier projects |
| Q4 (Oct–Dec) | Mixed: strong through October, slow December | Annual planning calls; upsell care plan renewals |

### Holiday / Low-Revenue Planning

**Annual slow periods:**
- Thanksgiving week (US): Low close rate — shift to admin + planning
- Christmas–New Year: 10–14 day effective business pause for many clients
- Summer Fridays: Many clients hard to reach July–August

**Cash flow protection for slow periods:**
1. Invoice for November projects by October 15
2. Collect December deposits before December 20
3. Build 2-month cash buffer before Q4 each year
4. Pre-schedule all MRR payments — no gaps in recurring revenue

---

## Growth Investment Strategy

### Investment Decision Framework

Growth investments are only made from surplus — after operating expenses, owner pay, tax reserve, and emergency reserve are all funded.

```
Investment Priority Order:

  Revenue ─▶ Operating Expenses
           ─▶ Tax Reserve (25–30%)
           ─▶ Owner Compensation (40% cap)
           ─▶ Emergency Reserve (until $5k)
           ─▶ SURPLUS AVAILABLE
                    │
                    ▼
            Growth Investments:
            1. Revenue-generating tools
            2. Education that enables new services
            3. Marketing experiments with clear ROI
            4. Equipment for capability expansion
            5. Paid advertising (Year 2+)
```

### Growth Investment Checklist
Before any growth investment:
- [ ] Emergency reserve ≥ $2,500 (50% funded)
- [ ] Tax reserve ≥ 25% of YTD revenue
- [ ] No overdue invoices outstanding
- [ ] Cash balance ≥ 60-day operating expense coverage
- [ ] Clear ROI hypothesis documented
- [ ] 90-day break-even path identified

---

## Cash Flow KPIs

| KPI | Formula | Target | Review Cadence |
|-----|---------|--------|----------------|
| **Days Sales Outstanding (DSO)** | Avg days from invoice to payment | <7 days | Monthly |
| **Cash Conversion Rate** | Cash collected / Revenue earned | >95% | Monthly |
| **Runway** | Cash balance / Monthly expenses | ≥90 days | Monthly |
| **Expense Ratio** | Total expenses / Revenue | <35% (excl. owner pay) | Monthly |
| **Reserve Coverage** | Emergency fund / Monthly expenses | ≥6 months | Quarterly |
| **MRR Coverage** | MRR / Monthly fixed expenses | >1.0 = breakeven | Monthly |
| **Tax Reserve Ratio** | Tax savings / YTD revenue | ≥25% | Monthly |

---

## Cash Flow Emergency Protocol

### Emergency Level 1 — Cash Tight (Runway <60 days)
**Actions:**
- Freeze all discretionary spending
- Accelerate pipeline — follow up all proposals within 24 hours
- Offer past clients quick-turnaround project (content updates, performance optimization)
- Consider dropping price on next project by 10% to close faster
- Do NOT touch emergency reserve yet

### Emergency Level 2 — Cash Critical (Runway <30 days)
**Actions:**
- All Level 1 actions
- Draw from emergency reserve (document reason)
- Cancel all non-essential subscriptions immediately
- Defer owner pay for current period
- Contact 2–3 past clients for immediate work opportunities
- Explore 0% APR business credit card for bridge (last resort)

### Emergency Level 3 — Cash Crisis (Runway <14 days)
**Actions:**
- All Level 2 actions
- Sell a discounted project package (e.g., landing page for $999 — quick win)
- Reach out to network for referrals immediately
- Consider short-term personal loan to bridge (document as business loan)
- Consult with SCORE mentor or small business advisor
- Review all contracts for acceleration clauses

---

*Document: CashFlow.md | Phase 9 Section 7 | Version 1.0 | 2026-07-01*