# Financial KPIs
# Roman Creative Studio — Financial Operating System
# Section 8 of 15 | ERD Version 1.0

---

## Purpose

Define the complete set of financial Key Performance Indicators (KPIs) for Roman Creative Studio — with formulas, targets, RAG thresholds, review cadence, and data sources.

**Business Value:** You cannot manage what you don't measure. These 25 financial KPIs transform raw financial data into actionable signals that drive better business decisions.

**Owner:** CEO / CFO  
**Version:** 1.0  
**Related Documents:** FinancialDashboard.md, MRRArchitecture.md, Profitability.md, BusinessScenarios.md

---

## KPI Category Overview

| Category | KPIs | Review Cadence |
|----------|------|----------------|
| Revenue | FIN-01 through FIN-07 | Monthly |
| MRR & ARR | FIN-08 through FIN-12 | Monthly |
| Profitability | FIN-13 through FIN-17 | Monthly |
| Cash Flow | FIN-18 through FIN-21 | Weekly/Monthly |
| Business Health | FIN-22 through FIN-25 | Quarterly |

---

## Revenue KPIs

### FIN-01: Monthly Revenue
| Field | Detail |
|-------|--------|
| **Formula** | Sum of all payments received in calendar month |
| **Target (Year 1)** | $5,000/month by Month 6; $8,000/month by Month 12 |
| **Green** | ≥ monthly target |
| **Yellow** | 80–99% of target |
| **Red** | <80% of target |
| **Source** | Stripe |
| **Cadence** | Monthly |
| **Type** | Lagging |

### FIN-02: Annual Revenue (YTD)
| Field | Detail |
|-------|--------|
| **Formula** | Sum of all payments Jan 1 – today |
| **Target (Year 1)** | $60,000 |
| **Green** | On pace or ahead |
| **Yellow** | 85–99% of year-to-date pace |
| **Red** | <85% of pace |
| **Source** | Stripe |
| **Cadence** | Monthly |
| **Type** | Lagging |

### FIN-03: Average Project Value (APV)
| Field | Detail |
|-------|--------|
| **Formula** | Total project revenue ÷ Number of projects closed |
| **Target (Year 1)** | >$4,500 |
| **Target (Year 2)** | >$6,000 |
| **Green** | ≥ target |
| **Yellow** | $3,500–4,499 |
| **Red** | <$3,500 |
| **Source** | Stripe |
| **Cadence** | Monthly |
| **Type** | Lagging |

### FIN-04: Revenue by Service Type
| Field | Detail |
|-------|--------|
| **Formula** | Project revenue vs. MRR revenue vs. other |
| **Target (Year 1)** | MRR = 30%+ of total revenue by Month 12 |
| **Target (Year 2)** | MRR = 50%+ of total revenue |
| **Source** | Stripe + manual tagging |
| **Cadence** | Monthly |
| **Purpose** | Track shift from project-dependent to recurring |

### FIN-05: Revenue Per Client
| Field | Detail |
|-------|--------|
| **Formula** | Total revenue ÷ Number of active clients |
| **Target** | >$3,000/client over 12-month relationship |
| **Source** | Stripe + HubSpot |
| **Cadence** | Quarterly |
| **Purpose** | Identifies underserved clients and LTV issues |

### FIN-06: Revenue Concentration
| Field | Detail |
|-------|--------|
| **Formula** | Largest single client revenue ÷ Total revenue |
| **Target** | No single client >25% of revenue |
| **Green** | <20% |
| **Yellow** | 20–25% |
| **Red** | >25% |
| **Cadence** | Monthly |
| **Purpose** | Risk management — avoid client dependency |

### FIN-07: Pipeline Value
| Field | Detail |
|-------|--------|
| **Formula** | Sum of (deal value × close probability) for all active opportunities |
| **Probabilities** | Discovery 20% / Proposal 50% / Negotiation 80% |
| **Target** | 3× monthly revenue target |
| **Green** | ≥3× target |
| **Yellow** | 1.5–2.9× target |
| **Red** | <1.5× target |
| **Source** | HubSpot CRM |
| **Cadence** | Weekly |
| **Type** | Leading |

---

## MRR & ARR KPIs

### FIN-08: Monthly Recurring Revenue (MRR)
| Field | Detail |
|-------|--------|
| **Formula** | Sum of all active recurring subscription charges/month |
| **Target (Month 6)** | $1,000 |
| **Target (Month 12)** | $3,000 |
| **Target (Month 24)** | $8,000 |
| **Green** | ≥ target |
| **Yellow** | 75–99% of target |
| **Red** | <75% of target |
| **Source** | Stripe subscriptions |
| **Cadence** | Monthly |

### FIN-09: Annual Recurring Revenue (ARR)
| Field | Detail |
|-------|--------|
| **Formula** | MRR × 12 |
| **Target (Year 1 end)** | $36,000 |
| **Target (Year 2 end)** | $96,000 |
| **Source** | Calculated from MRR |
| **Cadence** | Monthly |

### FIN-10: MRR Growth Rate
| Field | Detail |
|-------|--------|
| **Formula** | (MRR this month − MRR last month) ÷ MRR last month × 100 |
| **Target (Year 1)** | 15–20%/month |
| **Target (Year 2)** | 8–12%/month |
| **Green** | ≥10%/month |
| **Yellow** | 5–9% |
| **Red** | <5% or negative |
| **Cadence** | Monthly |

### FIN-11: MRR Churn Rate
| Field | Detail |
|-------|--------|
| **Formula** | Cancelled MRR ÷ Total MRR at start of month × 100 |
| **Target** | <3%/month |
| **Green** | ≤3% |
| **Yellow** | 3–5% |
| **Red** | >5% |
| **Source** | Stripe (cancelled subscriptions) |
| **Cadence** | Monthly |

### FIN-12: Average Revenue Per User (ARPU / MRR per client)
| Field | Detail |
|-------|--------|
| **Formula** | MRR ÷ Number of active care plan clients |
| **Target** | >$400/client/month |
| **Green** | ≥$400 |
| **Yellow** | $250–$399 |
| **Red** | <$250 |
| **Cadence** | Monthly |
| **Purpose** | Tracks upsell success (Care → SEO → Growth) |

---

## Profitability KPIs

### FIN-13: Gross Profit Margin
| Field | Detail |
|-------|--------|
| **Formula** | (Revenue − Direct costs) ÷ Revenue × 100 |
| **Direct costs** | Contractor fees, software for project, hosting costs |
| **Target** | ≥65% |
| **Green** | ≥65% |
| **Yellow** | 50–64% |
| **Red** | <50% |
| **Cadence** | Monthly |

### FIN-14: Net Profit Margin
| Field | Detail |
|-------|--------|
| **Formula** | (Revenue − All expenses incl. owner pay) ÷ Revenue × 100 |
| **Target** | >20% |
| **Green** | ≥20% |
| **Yellow** | 10–19% |
| **Red** | <10% |
| **Cadence** | Monthly |

### FIN-15: Effective Hourly Rate (EHR)
| Field | Detail |
|-------|--------|
| **Formula** | Revenue earned ÷ Hours worked on that project/service |
| **Target** | >$150/hour (minimum viable) |
| **Green** | ≥$200/hour |
| **Yellow** | $150–$199/hour |
| **Red** | <$150/hour |
| **Cadence** | Per project; monthly average |
| **Source** | Time tracking + Stripe |

### FIN-16: Expense Ratio
| Field | Detail |
|-------|--------|
| **Formula** | Total operating expenses (excl. owner pay) ÷ Revenue × 100 |
| **Target** | <35% of revenue |
| **Green** | ≤35% |
| **Yellow** | 35–45% |
| **Red** | >45% |
| **Cadence** | Monthly |

### FIN-17: Owner Compensation Ratio
| Field | Detail |
|-------|--------|
| **Formula** | Owner draws + salary ÷ Revenue × 100 |
| **Target** | 30–40% of revenue |
| **Green** | 30–40% |
| **Yellow** | 20–29% (underpaying) or 41–50% (overpaying) |
| **Red** | <20% or >50% |
| **Cadence** | Monthly |

---

## Cash Flow KPIs

### FIN-18: Cash Flow (MTD)
| Field | Detail |
|-------|--------|
| **Formula** | Revenue collected − Expenses paid (month to date) |
| **Target** | Positive every month |
| **Green** | Positive |
| **Yellow** | Break-even (±5%) |
| **Red** | Negative |
| **Cadence** | Weekly |

### FIN-19: Days Sales Outstanding (DSO)
| Field | Detail |
|-------|--------|
| **Formula** | (Outstanding invoices ÷ Revenue) × 30 |
| **Target** | <7 days |
| **Green** | ≤7 days |
| **Yellow** | 8–14 days |
| **Red** | >14 days |
| **Cadence** | Weekly |
| **Purpose** | Fast collection = healthy cash flow |

### FIN-20: Business Runway
| Field | Detail |
|-------|--------|
| **Formula** | Cash balance ÷ Average monthly expenses |
| **Target** | ≥90 days |
| **Green** | ≥90 days |
| **Yellow** | 60–89 days |
| **Red** | <60 days |
| **Cadence** | Monthly |

### FIN-21: Tax Reserve Ratio
| Field | Detail |
|-------|--------|
| **Formula** | Tax savings balance ÷ YTD revenue × 100 |
| **Target** | ≥25% |
| **Green** | ≥25% |
| **Yellow** | 20–24% |
| **Red** | <20% |
| **Cadence** | Monthly |

---

## Business Health KPIs

### FIN-22: Customer Acquisition Cost (CAC)
| Field | Detail |
|-------|--------|
| **Formula** | Total sales + marketing spend ÷ New clients acquired |
| **Target (Year 1)** | <$500 |
| **Target (Year 2)** | <$750 |
| **Cadence** | Quarterly |

### FIN-23: Client Lifetime Value (LTV)
| Field | Detail |
|-------|--------|
| **Formula** | Average annual revenue per client × Average client lifespan (years) |
| **Target** | >$10,000 |
| **Target (Year 2)** | >$15,000 |
| **Source** | Stripe + HubSpot |
| **Cadence** | Quarterly |

### FIN-24: LTV:CAC Ratio
| Field | Detail |
|-------|--------|
| **Formula** | LTV ÷ CAC |
| **Target** | >3:1 |
| **Green** | ≥5:1 |
| **Yellow** | 3:1–4.9:1 |
| **Red** | <3:1 |
| **Cadence** | Quarterly |

### FIN-25: MRR Coverage Ratio
| Field | Detail |
|-------|--------|
| **Formula** | MRR ÷ Monthly fixed expenses |
| **Milestone** | 1.0 = breakeven (MRR covers all fixed costs) |
| **Target** | ≥1.5 |
| **Green** | ≥1.5 |
| **Yellow** | 1.0–1.49 |
| **Red** | <1.0 (MRR doesn't cover fixed costs) |
| **Cadence** | Monthly |

---

## KPI Dashboard Review Protocol

### Weekly (10 min — CEO)
- FIN-07: Pipeline value
- FIN-18: Cash flow MTD
- FIN-19: DSO (outstanding invoices)

### Monthly (30 min — CEO)
- All 25 KPIs reviewed
- Red flags documented with action plans
- Prior month vs. target comparison
- Updated in FinancialDashboard.md

### Quarterly (60 min — CEO + Finance Manager)
- Trend analysis across all KPIs
- Year-to-date vs. annual plan
- Adjustment to targets if needed
- Business scenario update (see BusinessScenarios.md)

---

*Document: FinancialKPIs.md | Phase 9 Section 8 | Version 1.0 | 2026-07-01*
