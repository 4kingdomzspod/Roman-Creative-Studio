# Client Lifetime Value
# Roman Creative Studio — Financial Operating System
# Section 10 of 15 | ERD Version 1.0

---

## Purpose

Document the complete Client Lifetime Value (LTV) architecture for Roman Creative Studio — how LTV is calculated, what drives it, how to increase it, and how to use it in pricing and acquisition decisions.

**Business Value:** LTV determines how much we can afford to spend acquiring a client. It tells us which service tiers are most valuable long-term. It identifies the difference between good clients and truly great clients.

**Owner:** CEO / Revenue Operations  
**Version:** 1.0  
**Related Documents:** MRRArchitecture.md, PricingStrategy.md, FinancialKPIs.md, RevenueModel.md

---

## LTV Formula

```
Basic LTV:
  LTV = Average Annual Revenue per Client × Average Client Lifespan (years)

Advanced LTV (with margin):
  LTV = Average Annual Revenue per Client × Gross Margin % × Average Client Lifespan

Example (Growth Partner client):
  Average Annual Revenue: $997/month × 12 = $11,964
  Gross Margin: 70%
  Average Lifespan: 3 years
  LTV = $11,964 × 0.70 × 3 = $25,124
```

---

## LTV by Client Tier

### Tier 1: Project-Only Client (No Care Plan)

| Phase | Revenue |
|-------|--------|
| Initial project | $3,500–$12,000 |
| Future project (20% re-hire rate) | $3,500–$6,000 |
| Referrals (1.2 referrals per client avg) | 1.2 × project avg |
| **5-Year LTV (estimated)** | **$5,000–$9,000** |
| **Margin** | 65–80% |

**Assessment:** Low LTV. These clients are valuable for portfolio and referrals but create feast-or-famine revenue.

---

### Tier 2: Project + Care Plan Client (Care — $197/month)

| Phase | Revenue |
|-------|--------|
| Initial project | $3,500–$6,500 |
| Care plan (2 years avg) | $197 × 24 = $4,728 |
| Upsell to SEO (30% probability) | $497 × 12 = $5,964 |
| Referrals | 1.3 × avg project |
| **5-Year LTV (estimated)** | **$14,000–$22,000** |
| **Margin** | 70–85% |

**Assessment:** Core LTV tier. Goal is to convert 80% of project clients to at least Care Plan.

---

### Tier 3: Project + SEO Retainer Client ($497/month)

| Phase | Revenue |
|-------|--------|
| Initial project | $5,000–$9,000 |
| SEO Retainer (3 years avg) | $497 × 36 = $17,892 |
| Upsell opportunities | $2,000–$5,000 |
| Referrals (higher quality) | 1.5 × avg project |
| **5-Year LTV (estimated)** | **$28,000–$40,000** |
| **Margin** | 72–80% |

**Assessment:** High-value tier. SEO clients see results over time, creating strong retention.

---

### Tier 4: Project + Growth Partner Client ($997/month)

| Phase | Revenue |
|-------|--------|
| Initial project (GROW or SCALE) | $6,500–$15,000 |
| Growth Partner (4 years avg) | $997 × 48 = $47,856 |
| Annual site updates / redesign | $3,000–$6,000 every 3 years |
| Referrals (best advocates) | 2× avg project |
| **5-Year LTV (estimated)** | **$60,000–$85,000** |
| **Margin** | 68–78% |

**Assessment:** Premium LTV tier. These are the anchor clients of a healthy agency. Target: 3–5 Growth Partner clients by Year 3.

---

### Tier 5: SCALE Project + Full Retainer Stack

| Phase | Revenue |
|-------|--------|
| SCALE project | $12,000–$25,000 |
| Growth Partner ($997/month) | $47,856 (48 months) |
| AI Automation maintenance ($297/month) | $14,256 (48 months) |
| Analytics & Reporting ($149/month) | $7,152 (48 months) |
| Annual platform work | $5,000–$10,000 |
| **5-Year LTV (estimated)** | **$86,000–$104,000** |
| **Margin** | 65–75% |

**Assessment:** Enterprise LTV. These clients fund a team. 2–3 of these = agency stability.

---

## LTV Drivers

### Driver 1: Care Plan Conversion Rate
**Impact:** Each 10% improvement in conversion adds ~$2,000–$5,000 to average client LTV  
**Current target:** 80% conversion within 30 days of launch  
**Lever:** Post-launch follow-up sequence (automated via MailerLite + Calendly)

### Driver 2: Plan Tier (Average MRR per Client)
**Impact:** Moving 1 client from Care ($197) to SEO ($497) adds $3,600/year to LTV  
**Target:** 20% of Care clients upgrade to SEO Retainer within 12 months  
**Lever:** Monthly report + proactive SEO conversation at 6-month care plan anniversary

### Driver 3: Retention / Churn
**Impact:** Every additional year retained adds full-year revenue to LTV  
**Target:** <3% monthly MRR churn  
**Lever:** Proactive check-ins, QBRs, monthly report quality, relationship depth

### Driver 4: Referral Rate
**Impact:** High LTV clients generate higher-quality referrals  
**Target:** 1.5 referrals per active client per year  
**Lever:** Referral program (10% kickback or credit), referral ask at 90-day milestone

### Driver 5: Project Repeat Business
**Impact:** 20–30% of past clients return for new projects (site updates, new pages, rebrands)  
**Target:** 25% re-project rate within 3 years  
**Lever:** Annual check-in call, care plan annual review with roadmap conversation

---

## LTV Segmentation

### Client Health Score (Monthly Assessment)

| Factor | Weight | Green | Yellow | Red |
|--------|--------|-------|--------|-----|
| CSAT (last report rating) | 30% | ≥4.5 | 3.5–4.4 | <3.5 |
| Plan tier | 25% | Growth | SEO | Care |
| Tenure | 20% | >12 months | 6–12 months | <6 months |
| Engagement (opens reports, replies) | 15% | High | Medium | Low |
| Payment history | 10% | Always on time | 1 late | 2+ late |

**Score ≥80 (Green):** Advocate candidate. Ask for referral and testimonial.  
**Score 60–79 (Yellow):** At-risk. Schedule proactive check-in call.  
**Score <60 (Red):** Churn risk. CEO or AM escalation within 5 days.

---

## LTV vs. CAC Benchmark

| Year | Target LTV | Target CAC | LTV:CAC Ratio |
|------|-----------|-----------|---------------|
| Year 1 | $8,000 | $300 | 26:1 |
| Year 2 | $14,000 | $500 | 28:1 |
| Year 3 | $22,000 | $750 | 29:1 |
| Year 5 | $35,000 | $1,500 | 23:1 |

**Note:** High LTV:CAC ratios at Year 1–3 reflect low marketing spend (referral-driven). As paid acquisition begins (Year 3+), CAC rises but LTV should rise faster through higher-tier clients.

---

## LTV Improvement Roadmap

### Months 1–6: Foundation
- Launch care plan conversion email sequence
- Set 80% conversion target
- Track first cohort LTV manually

### Months 7–12: Optimization
- Launch care plan upsell campaign (Care → SEO)
- Implement client health score tracking
- Activate referral program

### Year 2: Automation
- Automate monthly reports (Claude API + Supabase Edge Function)
- Build LTV tracking in Supabase
- Quarterly cohort LTV analysis

### Year 3+: Advanced
- Predictive churn modeling (client health score + tenure)
- LTV by industry segment analysis
- Client expansion revenue tracking (Expansion MRR)

---

*Document: ClientLifetimeValue.md | Phase 9 Section 10 | Version 1.0 | 2026-07-01*
