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

## Related Documents

- `BusinessIntelligenceAudit.md` — current BI readiness
- `KPIDefinitions.md` — all metric definitions
- `ExecutiveDashboard.md` — dashboard architecture
- `ForecastingModels.md` — forecasting methodology
- `ClientReporting.md` — client-facing reporting
