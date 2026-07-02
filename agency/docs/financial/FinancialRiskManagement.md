# Financial Risk Management
# Roman Creative Studio — Financial Operating System
# Section 13 of 15 | ERD Version 1.0

---

## Purpose

Identify, assess, and mitigate the financial risks facing Roman Creative Studio — from revenue concentration to tax liability, cash flow gaps to legal exposure.

**Business Value:** Most small business failures are preventable. This document systematically identifies threats before they materialize and defines response protocols that keep the business alive through adverse conditions.

**Owner:** CEO / CFO  
**Version:** 1.0  
**Related Documents:** CashFlow.md, BusinessScenarios.md, FinancialKPIs.md, SecurityPrivacy.md, RiskManagement.md

---

## Risk Assessment Framework

**Risk Score = Likelihood (1–5) × Impact (1–5)**

| Score Range | Priority Level |
|------------|---------------|
| 20–25 | Critical — act immediately |
| 12–19 | High — mitigation required within 30 days |
| 6–11 | Medium — monitor and plan |
| 1–5 | Low — document and review quarterly |

---

## Financial Risk Register

### FRISK-01: Zero Revenue at Launch
**Category:** Revenue  
**Likelihood:** 4/5 (common for new agencies)  
**Impact:** 5/5 (business cannot sustain without revenue)  
**Risk Score:** 20 — Critical

**Description:** The business launches with no clients and no revenue, creating immediate cash pressure and founder stress.

**Mitigations:**
- Start with 1–2 warm referral clients before formal launch
- Maintain 3–6 months personal savings before going full-time
- Lower minimum price to $1,500 for first 2 projects to build portfolio quickly
- Offer free audit to 5 businesses to generate discovery calls
- Set 90-day revenue target and weekly milestone check-ins

**Current Status:** Stage 1 — active risk. Monitor weekly.

---

### FRISK-02: Client Concentration Risk
**Category:** Revenue  
**Likelihood:** 3/5  
**Impact:** 4/5  
**Risk Score:** 12 — High

**Description:** One client represents >25% of total revenue. If they cancel, revenue drops significantly.

**Mitigations:**
- Cap any single client at 25% of total MRR (flag if approaching)
- Diversify across at least 3 industries
- Diversify across at least 5 clients before any single client exceeds 25%
- Build recurring revenue so no project client creates >20% of total revenue

**Trigger:** Immediate diversification action if any client hits 25% of revenue.

---

### FRISK-03: Tax Underpayment
**Category:** Tax  
**Likelihood:** 3/5  
**Impact:** 4/5 (penalty + interest + cash shock)  
**Risk Score:** 12 — High

**Description:** Failure to pay quarterly estimated taxes results in penalties and a large unexpected tax bill.

**Mitigations:**
- Fund tax reserve of 25–30% of every dollar received
- Make quarterly estimated payments (Apr 15, Jun 15, Sep 15, Jan 15)
- Work with CPA by Month 3 to calibrate estimate
- Never use tax reserve for operations (separate account, separate bank)

**Current Status:** Tax reserve account required at first revenue dollar.

---

### FRISK-04: Client Non-Payment
**Category:** Cash Flow  
**Likelihood:** 3/5  
**Impact:** 3/5  
**Risk Score:** 9 — Medium

**Description:** A client fails to pay an invoice, creating a cash flow gap.

**Mitigations:**
- 50% deposit required before work begins (non-negotiable)
- Stripe auto-billing for MRR (reduces manual payment risk)
- Work paused Day 14 of non-payment (per contract)
- Formal collections process documented (CashFlow.md)
- Late payment fee: 1.5%/month after Day 21

**Historical note:** Requiring deposits eliminates >90% of non-payment risk. Projects without deposits are high-risk.

---

### FRISK-05: Unexpected Business Expense
**Category:** Cash Flow  
**Likelihood:** 3/5  
**Impact:** 3/5  
**Risk Score:** 9 — Medium

**Description:** Sudden equipment failure, legal dispute, or emergency requires unplanned cash outlay.

**Mitigations:**
- Emergency reserve funded to $5,000 before growth investments
- Business insurance (General Liability + Professional Liability) by Month 2
- Equipment maintained; identify failure risks before they happen
- 3-level emergency protocol in CashFlow.md

---

### FRISK-06: Scope Creep Eroding Profitability
**Category:** Profitability  
**Likelihood:** 4/5 (very common in agencies)  
**Impact:** 3/5  
**Risk Score:** 12 — High

**Description:** Unmanaged scope additions reduce effective hourly rate below minimum viable ($150/hour).

**Mitigations:**
- Detailed scope of work in every contract (specific deliverables listed)
- Change order process documented and enforced
- Time tracking on all projects (identify where hours go)
- Revision policy clearly stated in proposal and contract
- CEO reviews EHR monthly; projects below $150/hour trigger scope audit

---

### FRISK-07: MRR Churn Cascade
**Category:** MRR  
**Likelihood:** 2/5  
**Impact:** 4/5  
**Risk Score:** 8 — Medium

**Description:** Multiple care plan clients cancel within the same month, causing significant MRR drop.

**Mitigations:**
- Monthly client health score tracking
- Proactive outreach at Yellow health score
- Stagger renewal dates (not all clients on same billing anniversary)
- Maintain care plan quality: deliver reports on time, respond within 4 hours
- Offboarding survey to identify systemic issues early

---

### FRISK-08: Platform Dependency (Stripe, Vercel, GitHub)
**Category:** Operations  
**Likelihood:** 2/5  
**Impact:** 4/5  
**Risk Score:** 8 — Medium

**Description:** A critical platform (Stripe for billing, Vercel for hosting, GitHub for code) goes down or changes pricing significantly.

**Mitigations:**
- Backup DNS configured (Cloudflare fallback)
- Monthly Stripe export kept locally
- GitHub repos cloned locally monthly
- Alternative payment processor documented (Paddle as Stripe fallback)
- Never rely on a single provider for hosting >80% of client sites

---

### FRISK-09: Legal Dispute with Client
**Category:** Legal  
**Likelihood:** 2/5  
**Impact:** 4/5  
**Risk Score:** 8 — Medium

**Description:** A client disputes scope, quality, or payment, leading to legal action or chargebacks.

**Mitigations:**
- Signed contract before any work begins (always)
- All scope changes documented in writing
- Client approvals documented at each milestone
- Professional Liability (E&O) insurance
- Legal budget of $600/year for attorney consultations
- Dispute resolution clause in all contracts (mediation before litigation)

---

### FRISK-10: Lifestyle Inflation
**Category:** Financial Discipline  
**Likelihood:** 3/5  
**Impact:** 3/5  
**Risk Score:** 9 — Medium

**Description:** Revenue increases but spending increases faster, leaving no business reserves or investment capacity.

**Mitigations:**
- Owner pay cap: 40% of revenue (strictly enforced)
- Tax reserve: 25–30% funded before any draw
- Emergency fund: fully funded before growth investments
- Monthly budget review: actual vs. plan comparison
- Annual budget audit: zero-based review, not just carry-forward

---

## Risk Review Cadence

| Review | Cadence | Owner |
|--------|---------|-------|
| High-priority risks (score ≥12) | Monthly | CEO |
| Medium risks (score 6–11) | Quarterly | CEO |
| Full risk register review | Annually | CEO + CFO |
| New risk identification | Ongoing | CEO |
| Insurance review | Annually (January) | CEO |

---

## Financial Risk Dashboard (Monthly Check)

| Metric | Green | Yellow | Red | Current |
|--------|-------|--------|-----|--------|
| Revenue concentration (max client %) | <20% | 20–25% | >25% | Track |
| Tax reserve ratio | ≥25% | 20–24% | <20% | Track |
| Cash runway | ≥90 days | 60–89 days | <60 days | Track |
| Outstanding invoices >14 days | $0 | $1–$2,000 | >$2,000 | Track |
| MRR churn rate | <3% | 3–5% | >5% | Track |
| Scope creep rate (over-budget projects) | 0 | 1 project | 2+ projects | Track |

---

*Document: FinancialRiskManagement.md | Phase 9 Section 13 | Version 1.0 | 2026-07-01*