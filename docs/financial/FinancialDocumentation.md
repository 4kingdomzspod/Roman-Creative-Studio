# Financial Documentation
# Roman Creative Studio — Financial Operating System
# Section 12 of 15 | ERD Version 1.0

---

## Purpose

Define the complete financial documentation standards for Roman Creative Studio — what records exist, where they live, who owns them, and how long they're retained.

**Business Value:** Clean financial documentation enables accurate tax filing, informed business decisions, audit readiness, and clean handoffs to bookkeepers, CPAs, and future finance team members. Undocumented finances are a liability.

**Owner:** CEO / Finance Manager  
**Version:** 1.0  
**Related Documents:** Budgeting.md, CashFlow.md, FinancialDashboard.md, SoftwareCosts.md

---

## Financial Document Registry

### Category 1: Revenue Documents

| Document | Description | Created By | Stored In | Retention |
|----------|-------------|-----------|-----------|----------|
| Client Invoice | Invoice for project milestone or MRR | CEO / Stripe auto | Stripe + Google Drive | 7 years |
| Payment Confirmation | Stripe receipt or bank confirmation | Stripe auto | Stripe dashboard | 7 years |
| Proposal | Signed scope of work + investment | CEO | Google Drive / HubSpot | 7 years |
| Client Contract | Signed service agreement | CEO | Google Drive (secure) | 7 years |
| Care Plan Agreement | Signed MRR subscription agreement | CEO | Google Drive (secure) | 7 years |
| Refund Record | Documentation of any client refund | CEO | Stripe + manual log | 7 years |

### Category 2: Expense Documents

| Document | Description | Created By | Stored In | Retention |
|----------|-------------|-----------|-----------|----------|
| Vendor Invoice | Invoice received from vendor or contractor | Vendor | Google Drive / QuickBooks | 7 years |
| Receipt | Proof of purchase for any business expense | CEO | Expensify / Google Drive | 7 years |
| Contractor Agreement | Signed IC agreement | CEO + Contractor | Google Drive (secure) | 7 years |
| W-9 Form | Contractor tax ID form | Contractor | Google Drive (secure) | 7 years |
| 1099-NEC | Annual contractor payment report | CEO | QuickBooks / Google Drive | 7 years |
| Subscription Log | Record of all SaaS subscriptions | CEO | SoftwareCosts.md + spreadsheet | Annual |

### Category 3: Financial Reports

| Document | Description | Frequency | Stored In |
|----------|-------------|-----------|----------|
| Monthly P&L | Revenue − Expenses = Net income | Monthly | QuickBooks / Google Sheets |
| Monthly Revenue Log | All payments received by date | Monthly | Stripe export + Google Sheets |
| Monthly Expense Log | All expenses by category | Monthly | QuickBooks / Google Sheets |
| Cash Flow Statement | Cash in vs. cash out | Monthly | Google Sheets |
| Balance Sheet | Assets, liabilities, equity | Quarterly | QuickBooks |
| Annual P&L | Full year financial summary | Annual | QuickBooks + PDF export |
| Tax Return (Federal) | Annual federal income tax | Annual | Secure drive + CPA files |
| Tax Return (State) | Annual state income tax | Annual | Secure drive + CPA files |
| Quarterly Estimated Tax | IRS Form 1040-ES | Quarterly | Google Drive |

### Category 4: Tax Documents

| Document | Due Date | Filed By | Retained |
|----------|---------|---------|----------|
| Quarterly estimated taxes | Apr 15, Jun 15, Sep 15, Jan 15 | CEO | 7 years |
| Annual federal return (Schedule C or Corp) | April 15 (or Oct 15 with extension) | CPA | 7 years |
| Annual state return | Varies by state | CPA | 7 years |
| 1099-NEC for contractors | January 31 | CEO | 7 years |
| W-2 (when employees exist) | January 31 | Gusto | 7 years |
| Sales tax (if applicable) | Varies by state | CEO | 7 years |

---

## Financial Record-Keeping System

### Phase 1: Manual (Stage 1 — Now)

**Tools:** Google Sheets + Stripe + personal bank account (separated)

**Monthly tasks:**
1. Export Stripe payments for the month
2. Export bank statement
3. Categorize all expenses in Google Sheets
4. Calculate gross margin and net income
5. Fund tax reserve (25% of revenue)
6. File monthly summary in Google Drive → Finance → [Year] → [Month]

**Google Drive structure:**
```
Finance/
├── 2026/
│   ├── Revenue/
│   │   ├── Invoices/
│   │   └── Monthly-Revenue-Log.xlsx
│   ├── Expenses/
│   │   ├── Receipts/
│   │   └── Monthly-Expense-Log.xlsx
│   ├── Tax/
│   │   ├── Quarterly-Estimates/
│   │   └── Tax-Reserve-Log.xlsx
│   └── Annual/
│       └── 2026-Annual-Summary.xlsx
├── Contracts/
│   ├── Client-Contracts/
│   └── Contractor-Agreements/
└── Templates/
    ├── Invoice-Template.xlsx
    └── Proposal-Template.docx
```

### Phase 2: Semi-Automated (Stage 2–3)

**Tools:** QuickBooks Online + Stripe sync + Google Drive

- Stripe payments sync automatically to QuickBooks
- Expenses entered in QuickBooks with receipt photos (QuickBooks mobile)
- Monthly P&L generated automatically
- CPA has read-only QuickBooks access for quarterly review

### Phase 3: Fully Managed (Stage 3+)

**Tools:** QuickBooks + Gusto + dedicated bookkeeper

- Bookkeeper reconciles books monthly
- CPA reviews quarterly and files annually
- CFO or Finance Manager oversees and reports to CEO
- Supabase BI layer for real-time executive reporting

---

## Monthly Financial Close Process

**Due by:** 5th of each month (for prior month)

**Checklist:**
- [ ] All revenue entered and categorized (Stripe export)
- [ ] All expenses entered and categorized (receipts filed)
- [ ] Bank accounts reconciled (no unmatched transactions)
- [ ] Tax reserve funded (25% of revenue received)
- [ ] MRR reconciled (active clients × plan = expected MRR)
- [ ] Outstanding invoices reviewed (anything >14 days?)
- [ ] Monthly P&L generated and saved
- [ ] Cash flow statement updated
- [ ] Financial dashboard updated
- [ ] Any anomalies or questions noted for CPA

**Time required (Stage 1):** 45–60 minutes/month with organized records  
**Time required (Stage 2 with bookkeeper):** 15 minutes CEO review

---

## CPA Relationship

**When to hire:** Year 1, by Month 3 (at least for initial consultation)

**Services:**
- Business structure advice (LLC, S-Corp election)
- Quarterly estimated tax review and calculation
- Annual federal and state tax preparation
- Year-end tax planning (timing of expenses, retirement accounts)
- Audit support (if needed)

**CPA costs:**
- Initial consultation: $150–$300
- Quarterly review: $100–$200/quarter
- Annual tax preparation: $500–$1,500
- S-Corp payroll setup: $200–$400 one-time

**Questions to ask Year 1 CPA:**
1. Should I elect S-Corp status? At what revenue level does it make sense?
2. What quarterly estimated tax amount should I pay?
3. What business expenses can I deduct as a home-office-based freelancer?
4. Should I contribute to a SEP-IRA or Solo 401(k)? When?
5. What is the most tax-efficient way to pay myself?

---

## Document Retention Policy

| Category | Retention Period |
|----------|----------------|
| Tax returns | Minimum 7 years |
| Tax supporting documents (receipts, invoices) | 7 years |
| Client contracts | 7 years after contract end |
| Contractor agreements + W-9 | 7 years after last payment |
| Employee records (when applicable) | 7 years after termination |
| Bank statements | 7 years |
| Financial reports (P&L, balance sheets) | 7 years |
| Insurance policies | Duration + 7 years |
| Correspondence re: disputes | 7 years after resolution |

**Storage:** Secure Google Drive (encrypted) + local encrypted backup  
**Access:** CEO only for sensitive documents; Finance Manager at Stage 3+

---

*Document: FinancialDocumentation.md | Phase 9 Section 12 | Version 1.0 | 2026-07-01*
