# Executive Dashboard Architecture

**Owner:** Alexander Roman / CEO  
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Status:** Architecture Defined — Implementation Pending

---

## Purpose

Design the architecture for an executive dashboard that gives Alexander a complete real-time view of Roman Creative Studio's business health across revenue, pipeline, projects, marketing, and operations — from a single screen.

---

## Dashboard Access

- **URL:** `admin.romancreativestudio.co/dashboard`
- **Auth:** Supabase Auth + TOTP MFA (mandatory)
- **Refresh:** Real-time for project/task data; hourly for analytics; daily for financial summaries
- **Mobile:** Responsive layout — key KPIs visible on phone in portrait mode

---

## Sections

1. **Overview Home** — Single-screen summary of all critical business dimensions
2. **Revenue Overview** — MRR, ARR, revenue breakdown, invoice aging, 90-day forecast
3. **Lead Pipeline** — Kanban view, pipeline metrics, lead source breakdown, discovery call calendar
4. **Projects** — Project health grid, capacity gauge, Gantt timeline, upcoming milestones
5. **Marketing Performance** — Website traffic, conversion funnel, email marketing, content performance
6. **SEO Performance** — Organic traffic trend, keyword rankings, Search Console summary, Core Web Vitals
7. **Upcoming Renewals** — 90-day renewal calendar, churn risk alerts, upsell opportunities
8. **Tasks** — Task queue, client-awaited tasks, blocked tasks
9. **Goals** — Quarterly OKR tracker, annual milestone progress, KPI scoreboard
10. **Notifications** — Real-time alerts (new lead, invoice paid, milestone due, project health change)

---

## Technical Notes

- Dashboard: Next.js App Router at `admin.romancreativestudio.co`
- Data: Supabase client with RLS (admin role sees all)
- Charts: Recharts or Tremor
- Real-time: Supabase Realtime for tasks and notifications
- GA4 and Search Console pulled via API on daily scheduled job

---

## Related Documents

- `KPIDefinitions.md` — all metrics displayed
- `InternalDashboardArchitecture.md` — full technical architecture
- `BusinessIntelligenceAudit.md` — readiness baseline
- `ForecastingModels.md` — revenue and forecast widgets
