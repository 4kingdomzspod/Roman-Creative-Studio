# Financial Dashboard
# Roman Creative Studio — Financial Operating System
# Section 5 of 15 | ERD Version 1.0

---

## Overview

The Financial Dashboard is the executive command center for all money-related decisions at Roman Creative Studio. It aggregates revenue, expenses, pipeline, MRR, cash position, and projections into a single view reviewed weekly and monthly.

**Dashboard URL (Future):** `admin.romancreativestudio.co/financial`  
**Access:** Owner only (Alexander Roman)  
**Data Source:** Stripe + QuickBooks + Supabase + manual inputs  
**Review Cadence:** Weekly (5-min scan) + Monthly (30-min deep review)

---

## Dashboard Layout — ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│  FINANCIAL DASHBOARD          Roman Creative Studio    July 2026    │
│  admin.romancreativestudio.co/financial                             │
├─────────────┬─────────────┬─────────────┬──────────────────────────┤
│ MONTHLY REV │ ANNUAL REV  │    MRR      │    ARR                   │
│  $0         │  $0         │  $0         │  $0                      │
│  vs $5k tgt │  vs $72k tgt│  vs $3k tgt │  vs $36k tgt             │
├─────────────┴─────────────┴─────────────┴──────────────────────────┤
│ CASH FLOW       │ OUTSTANDING    │ PIPELINE VALUE  │ PROFIT MARGIN │
│ $0              │ $0             │ $0              │ 0%            │
│ +/- vs last mo  │ 0 invoices     │ 0 proposals     │ vs 65% target │
├─────────────────┴────────────────┴─────────────────┴───────────────┤
│                        REVENUE TREND (12 months)                    │
│  $8k │                                                              │
│  $6k │                                                              │
│  $4k │                                                              │
│  $2k │                                                              │
│   $0 │────────────────────────────────────────────────────────── │
│       Jul Aug Sep Oct Nov Dec Jan Feb Mar Apr May Jun               │
├─────────────────────────┬───────────────────────────────────────────┤
│   MRR BREAKDOWN         │   EXPENSE BREAKDOWN                       │
│   Care:     $0 (0)      │   Software:  $0                           │
│   SEO:      $0 (0)      │   Marketing: $0                           │
│   Growth:   $0 (0)      │   Education: $0                           │
│   Other:    $0 (0)      │   Legal:     $0                           │
│   ─────────────────     │   Other:     $0                           │
│   Total:    $0/mo       │   ──────────────────                      │
│                         │   Total:     $0/mo                        │
├─────────────────────────┼───────────────────────────────────────────┤
│   PIPELINE              │   INVOICES OUTSTANDING                    │
│   Discovery:  $0 (0)    │   0–30 days:  $0                          │
│   Proposals:  $0 (0)    │   31–60 days: $0                          │
│   Negotiation:$0 (0)    │   60+ days:   $0 ← OVERDUE               │
│   ─────────────────     │   ──────────────────                      │
│   Weighted:   $0        │   Total:      $0                          │
├─────────────────────────┼───────────────────────────────────────────┤
│   TAX & SAVINGS         │   GROWTH FUNDS                            │
│   Tax Reserve: $0 (0%)  │   Emergency:  $0/$5k target               │
│   Business Svgs: $0     │   Investment: $0/$2k target               │
│   Owner Pay:   $0       │   Education:  $0/$1k target               │
└─────────────────────────┴───────────────────────────────────────────┘
```

---

## Widget Specifications

### Row 1 — Primary Revenue Metrics

#### Widget 1: Monthly Revenue
| Field | Detail |
|-------|--------|
| **Label** | Monthly Revenue |
| **Value** | Total revenue collected this calendar month |
| **Source** | Stripe payments received |
| **Sub-label** | vs. monthly target ($5,000 Year 1) |
| **RAG** | Green ≥$5k / Yellow $3–$5k / Red <$3k |
| **Refresh** | Daily |

#### Widget 2: Annual Revenue
| Field | Detail |
|-------|--------|
| **Label** | Annual Revenue (YTD) |
| **Value** | Total revenue collected Jan 1 – today |
| **Source** | Stripe |
| **Sub-label** | vs. annual target ($72,000 Year 1) |
| **RAG** | Green ≥ pace / Yellow 80–100% pace / Red <80% pace |
| **Refresh** | Daily |

#### Widget 3: MRR
| Field | Detail |
|-------|--------|
| **Label** | MRR (Monthly Recurring Revenue) |
| **Value** | Sum of all active recurring subscription charges |
| **Source** | Stripe subscriptions |
| **Sub-label** | vs. MRR target |
| **RAG** | Green ≥$3k / Yellow $1–$3k / Red <$1k |
| **Refresh** | Daily |

#### Widget 4: ARR
| Field | Detail |
|-------|--------|
| **Label** | ARR (Annual Recurring Revenue) |
| **Value** | MRR × 12 |
| **Formula** | MRR × 12 |
| **Note** | Theoretical annualized value of current MRR |
| **Refresh** | Calculated from MRR |

---

### Row 2 — Cash & Pipeline

#### Widget 5: Cash Flow
| Field | Detail |
|-------|--------|
| **Label** | Cash Flow (MTD) |
| **Value** | Revenue collected − Expenses paid this month |
| **Source** | Stripe + QuickBooks |
| **Sub-label** | +/- vs last month |
| **RAG** | Green positive / Yellow break-even / Red negative |
| **Refresh** | Daily |

#### Widget 6: Outstanding Invoices
| Field | Detail |
|-------|--------|
| **Label** | Outstanding Invoices |
| **Value** | Total value of sent-but-unpaid invoices |
| **Source** | Stripe invoices (open status) |
| **Sub-label** | Number of open invoices |
| **Alert** | Flag any invoice 30+ days overdue in red |
| **Refresh** | Daily |

#### Widget 7: Pipeline Value
| Field | Detail |
|-------|--------|
| **Label** | Pipeline Value |
| **Value** | Weighted sum of proposals in Discovery + Proposal + Negotiation |
| **Formula** | Discovery × 20% + Proposal × 50% + Negotiation × 80% |
| **Source** | Manual CRM tracking (HubSpot or spreadsheet) |
| **Refresh** | Weekly |

#### Widget 8: Profit Margin
| Field | Detail |
|-------|--------|
| **Label** | Gross Profit Margin (MTD) |
| **Value** | (Revenue − Direct costs) / Revenue × 100 |
| **Target** | ≥65% gross margin |
| **RAG** | Green ≥65% / Yellow 50–65% / Red <50% |
| **Refresh** | Monthly |

---

### Row 3 — Revenue Trend Chart

#### Widget 9: Revenue Trend (12-Month Bar Chart)
| Field | Detail |
|-------|--------|
| **Type** | Bar chart |
| **X-axis** | Last 12 calendar months |
| **Y-axis** | Revenue ($) |
| **Series** | Project Revenue (blue) + MRR (gold) |
| **Source** | Stripe |
| **Annotations** | Mark target line at current monthly goal |
| **Refresh** | Monthly |

---

### Row 4 — MRR & Expenses

#### Widget 10: MRR Breakdown
| Field | Detail |
|-------|--------|
| **Label** | MRR by Plan |
| **Value** | Care / SEO Retainer / Growth Partner / Other (count + $) |
| **Source** | Stripe subscription metadata |
| **Display** | List with subtotals + total |
| **Refresh** | Daily |

#### Widget 11: Expense Breakdown
| Field | Detail |
|-------|--------|
| **Label** | Monthly Expenses by Category |
| **Categories** | Software, Marketing, Education, Legal/Insurance, Contractors, Other |
| **Source** | QuickBooks categories or manual spreadsheet |
| **Display** | List with % of revenue |
| **Target** | Total expenses <35% of revenue |
| **Refresh** | Monthly |

---

### Row 5 — Pipeline & Invoices

#### Widget 12: Pipeline by Stage
| Field | Detail |
|-------|--------|
| **Label** | Active Pipeline |
| **Stages** | Discovery / Proposal / Negotiation |
| **Value** | Count + dollar value per stage |
| **Weighted Total** | Pipeline × close probability |
| **Source** | HubSpot CRM or manual tracking |
| **Refresh** | Weekly |

#### Widget 13: Invoices Aging
| Field | Detail |
|-------|--------|
| **Label** | Invoice Aging Report |
| **Buckets** | 0–30 days / 31–60 days / 60+ days (overdue) |
| **Alert** | Red highlight on 60+ day invoices |
| **Source** | Stripe invoices |
| **Action** | Click → view invoice + send reminder |
| **Refresh** | Daily |

---

### Row 6 — Tax, Savings & Growth

#### Widget 14: Tax Reserve
| Field | Detail |
|-------|--------|
| **Label** | Tax Reserve |
| **Value** | Current balance set aside for taxes |
| **Target** | 25–30% of net revenue |
| **Note** | Separate savings account, not operating account |
| **RAG** | Green ≥25% / Yellow 15–25% / Red <15% |
| **Refresh** | Monthly |

#### Widget 15: Business Savings
| Field | Detail |
|-------|--------|
| **Label** | Business Savings |
| **Buckets** | Emergency Fund / Growth Investment / Education |
| **Targets** | Emergency $5k / Investment $2k / Education $1k |
| **Source** | Manual (bank account balance) |
| **Refresh** | Monthly |

#### Widget 16: Owner Pay
| Field | Detail |
|-------|--------|
| **Label** | Owner Compensation (MTD) |
| **Value** | Total paid to self this month (draws + salary) |
| **Note** | Separate from business operating expenses |
| **Target** | Year 1: $2,000–$3,000/month minimum viable |
| **Refresh** | Monthly |

#### Widget 17: Software Costs
| Field | Detail |
|-------|--------|
| **Label** | Software Subscriptions |
| **Value** | Total monthly SaaS spend |
| **Source** | Tracked in SoftwareCosts.md |
| **Target** | <$500/month Year 1, <$1,000/month Year 2 |
| **Refresh** | Monthly |

---

## Dashboard Implementation Phases

### Phase 1 — Manual Spreadsheet (Now → Month 3)

**Tool:** Google Sheets  
**Update frequency:** Weekly (manual entry, ~20 min)  
**Data entered manually:**
- Revenue from Stripe dashboard
- Expenses from bank/card statement
- Pipeline from CRM notes
- MRR from Stripe subscriptions
- Savings balances from bank

**Template structure:**
```
Tab 1: Monthly Summary
Tab 2: Revenue Log (date, client, service, amount, type)
Tab 3: Expense Log (date, category, vendor, amount)
Tab 4: MRR Tracker (client, plan, start date, monthly value)
Tab 5: Pipeline (prospect, stage, value, probability, next step)
Tab 6: Tax Reserve Log
Tab 7: Annual Summary
```

---

### Phase 2 — Semi-Automated (Month 4–12)

**Tools:** Stripe + QuickBooks integration + manual override  
**Automation targets:**
- Stripe → QuickBooks sync (automatic)
- Monthly revenue pulled automatically
- Expense categories auto-coded in QuickBooks
- Weekly email digest of key metrics (via Zapier)

**Still manual:** Pipeline, MRR breakdown, savings, tax reserve

---

### Phase 3 — Full Dashboard (Year 2+)

**Platform:** `admin.romancreativestudio.co` (Next.js + Supabase)  
**Data integrations:**
- Stripe API → revenue, MRR, invoices
- QuickBooks API → expenses, P&L
- Supabase → custom metrics, KPI snapshots
- HubSpot API → pipeline

**Features:**
- Real-time dashboard with all 17 widgets
- Email alert when metrics go red
- Monthly PDF financial report (auto-generated)
- Forecast vs. actual comparison
- Year-over-year comparison charts

---

## Monthly Financial Review Protocol

Review scheduled: **First Monday of each month, 9:00 AM**  
Duration: 30–45 minutes  
Format: Solo review with notes

### Review Checklist

**Revenue (10 min)**
- [ ] Total revenue vs. monthly target
- [ ] YTD revenue vs. annual target
- [ ] Revenue by type (project vs. MRR)
- [ ] MRR change vs. last month (growth, churn, expansion)
- [ ] Highest and lowest earning months YTD

**Expenses (10 min)**
- [ ] Total expenses vs. budget
- [ ] Software costs vs. cap ($500/mo Year 1)
- [ ] Any unexpected expenses?
- [ ] Tax reserve funded at 25–30%?
- [ ] Savings accounts on track?

**Pipeline (5 min)**
- [ ] Total pipeline value
- [ ] Weighted pipeline value
- [ ] Expected close dates for active proposals
- [ ] Revenue forecast for next 90 days

**Health Check (5 min)**
- [ ] Gross margin ≥65%?
- [ ] Any invoices 30+ days overdue?
- [ ] Cash flow positive?
- [ ] Any concentration risk (single client >30% of revenue)?

**Action Items (10 min)**
- [ ] Log 3 financial actions for the month
- [ ] Update annual revenue projection
- [ ] Note any pricing or service changes needed

---

## Financial Alerts

Critical alerts that require same-day response:

| Alert | Trigger | Action |
|-------|---------|--------|
| Invoice overdue | 30+ days unpaid | Send formal payment notice |
| Cash flow negative | MTD expenses > revenue | Review + reduce discretionary spend |
| MRR churn | Any cancellation | Client retention call within 48h |
| Tax reserve <20% | Reserve falls below 20% | Fund reserve before paying self |
| Pipeline empty | $0 in proposal/negotiation | Activate lead generation immediately |
| Expense spike | Single category >150% of budget | Investigate and approve/reverse |

---

*Document: FinancialDashboard.md | Phase 9 Section 5 | Version 1.0 | 2026-07-01*
