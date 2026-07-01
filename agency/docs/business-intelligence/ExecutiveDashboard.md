# Executive Dashboard Architecture

**Owner:** Alexander Roman / CEO  
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Status:** Architecture Defined — Implementation Pending

---

## Purpose

Design the architecture for an executive dashboard that gives Alexander a complete real-time view of Roman Creative Studio's business health across revenue, pipeline, projects, marketing, and operations — from a single screen.

---

## Business Value

An executive dashboard eliminates the need to check 6 different tools to understand how the business is performing. It surfaces the 20% of data that drives 80% of decisions. It enables proactive management rather than reactive firefighting.

---

## Dashboard Access

- **URL:** `admin.romancreativestudio.co/dashboard` (see `InternalDashboardArchitecture.md`)
- **Auth:** Supabase Auth + TOTP MFA (mandatory)
- **Refresh:** Real-time for project/task data; hourly for analytics; daily for financial summaries
- **Mobile:** Responsive layout — key KPIs visible on phone in portrait mode

---

## Dashboard Layout Architecture

### Layout Grid
```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER: RCS Admin    Today: Jul 1, 2026    [Notifications 3]   │
├───────────────────────────────┬─────────────────────────────────┤
│  LEFT SIDEBAR (Nav)           │  MAIN CONTENT AREA              │
│  ─────────────────            │  ────────────────────────────   │
│  Overview          ●          │  [Section varies by route]      │
│  Revenue                      │                                 │
│  Pipeline                     │                                 │
│  Projects                     │                                 │
│  Marketing                    │                                 │
│  SEO                          │                                 │
│  Clients                      │                                 │
│  Reports                      │                                 │
│  Goals                        │                                 │
│  Settings                     │                                 │
└───────────────────────────────┴─────────────────────────────────┘
```

### Responsive Breakpoints
- **Desktop (1280px+):** Full sidebar + content grid
- **Tablet (768–1279px):** Collapsed sidebar, icon-only nav
- **Mobile (<768px):** Bottom navigation bar, single-column content

---

## Section 1 — Overview Home

**Route:** `/dashboard`  
**Purpose:** Single-screen summary of all critical business dimensions.  
**Refresh:** On page load + every 5 minutes

### Layout (Desktop — 12 column grid)

```
ROW 1 — Top KPI Strip (4 cards)
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ MRR          │ Active       │ Open Leads   │ Pipeline     │
│ $0/mo        │ Projects     │ 0            │ Value        │
│ ↑ +0%        │ 0            │ 0 qualified  │ $0           │
└──────────────┴──────────────┴──────────────┴──────────────┘

ROW 2 — Revenue Chart (8 col) + Goal Progress (4 col)
┌───────────────────────────────────┬─────────────────────┐
│ Monthly Revenue (last 12 months)  │ Q3 2026 Goals       │
│ [Bar chart — one bar per month]   │ ● Revenue: 0/10k    │
│                                   │ ● Leads: 0/20       │
│                                   │ ● MRR: $0/$2k       │
│                                   │ ● Projects: 0/3     │
└───────────────────────────────────┴─────────────────────┘

ROW 3 — Pipeline (6 col) + Active Projects (6 col)
┌────────────────────────────────┬────────────────────────┐
│ Lead Pipeline Funnel           │ Active Projects        │
│ Visitors  [██████████] 0       │ [No active projects]   │
│ Leads     [████████░░] 0       │                        │
│ Qualified [██████░░░░] 0       │                        │
│ Discovery [████░░░░░░] 0       │                        │
│ Proposal  [██░░░░░░░░] 0       │                        │
│ Clients   [█░░░░░░░░░] 0       │                        │
└────────────────────────────────┴────────────────────────┘

ROW 4 — Marketing (4 col) + Tasks Due (4 col) + Announcements (4 col)
┌─────────────────┬─────────────────┬─────────────────────┐
│ Website Traffic │ Tasks Due Today │ Announcements       │
│ 7d: 0 visits    │ [No tasks]      │ [No announcements]  │
│ 30d: 0 visits   │                 │                     │
│ Trend: —        │                 │                     │
└─────────────────┴─────────────────┴─────────────────────┘
```

---

## Section 2 — Revenue Overview

**Route:** `/dashboard/revenue`  
**Data Sources:** Stripe, Supabase `invoices` and `payments` tables  
**Refresh:** Daily at midnight

### Widgets

**2.1 — MRR Tracker**
- Definition: Sum of all active recurring subscription amounts
- Formula: `SUM(active_subscriptions.amount) / 100`
- Display: Current MRR, MRR 3 months ago, MRR 12 months ago, trend arrow
- Chart: MRR line chart, 24-month rolling window

**2.2 — ARR Projection**
- Formula: `MRR × 12`
- Display: Current ARR, YTD ARR, end-of-year ARR projection

**2.3 — Revenue Breakdown**
- Donut chart: Website Projects vs Care Plans vs SEO Retainers vs Growth Partner
- Table: Each revenue stream with amount, % of total, MoM change

**2.4 — Invoice Aging**
- Table: All outstanding invoices
- Columns: Invoice #, Client, Amount, Due Date, Days Outstanding, Status
- Color-coded: Green (current), Amber (7–14 days), Red (15+ days overdue)

**2.5 — Payment History**
- Table: All payments received, last 90 days
- Columns: Date, Client, Invoice #, Amount, Method

**2.6 — Revenue Forecast (90-day)**
- Based on: active projects × remaining milestone payments + projected new projects
- Displayed as range (conservative / expected / optimistic)
- See `ForecastingModels.md` for calculation methodology

---

## Section 3 — Lead Pipeline

**Route:** `/dashboard/pipeline`  
**Data Sources:** HubSpot (Phase 1), Supabase contacts table (Phase 2)  
**Refresh:** On page load

### Widgets

**3.1 — Pipeline Kanban View**
- Columns: Visitor → Lead → Qualified → Discovery → Proposal → Negotiation → Client
- Each card: Contact name, company, estimated value, days in stage, source
- Color-coded by health: Green (moving), Amber (stale 7+ days), Red (stale 14+ days)

**3.2 — Pipeline Metrics**
- Total pipeline value
- Weighted pipeline value (by conversion probability per stage)
- Average time in each stage
- Stage conversion rates

**3.3 — Lead Source Breakdown**
- Bar chart: Organic / Referral / Social / Podcast / Direct / Other
- Table: Source, lead count, qualified count, conversion rate

**3.4 — Discovery Call Calendar**
- This week's booked calls
- Next week's booked calls
- Last 30 days: calls held, no-shows, conversion to proposal

**3.5 — Proposal Tracker**
- All open proposals with status and value
- Proposal open rate (% viewed by prospect)
- Time to decision (days from sent to response)

---

## Section 4 — Projects

**Route:** `/dashboard/projects`  
**Data Sources:** Supabase `projects` and `tasks` tables  
**Refresh:** Real-time

### Widgets

**4.1 — Project Health Grid**
- Card grid: one card per active project
- Each card: Client name, project name, stage, % complete, health status, next milestone, due date
- Health indicators: Green / Amber / Red (matching `ProjectManagementFramework.md` definitions)

**4.2 — Capacity Gauge**
- Current: X active projects
- Maximum sustainable: [defined in `ForecastingModels.md`]
- Available capacity indicator

**4.3 — Project Timeline Gantt**
- Horizontal timeline showing all active projects
- Stage bars color-coded by status
- Key milestone markers

**4.4 — Upcoming Milestones**
- Table: Next 14 days of milestones across all projects
- Columns: Due Date, Project, Milestone, Status, Blocking?

**4.5 — Project Velocity**
- Average days per project stage (last 10 completed projects)
- On-time delivery rate
- Average revision count

---

## Section 5 — Marketing Performance

**Route:** `/dashboard/marketing`  
**Data Sources:** GA4, MailerLite, Search Console  
**Refresh:** Hourly (analytics data has inherent delay)

### Widgets

**5.1 — Website Traffic**
- Sessions (7d, 30d, 90d) with trend vs prior period
- Top 10 pages by sessions
- Traffic source breakdown: Organic / Direct / Referral / Social / Email
- New vs returning visitor ratio

**5.2 — Conversion Funnel**
- Visitors → Form Views → Form Submits → Discovery Calls
- Conversion rate at each step
- Drop-off visualization

**5.3 — Email Marketing**
- List size trend (30-day)
- Last campaign: open rate, click rate, unsubscribes
- Automation performance: sequences active, email steps sent, open rates

**5.4 — Content Performance**
- Blog posts: views, avg time on page, leads generated
- Resources: downloads by asset
- Industry pages: traffic, conversion rate, rankings

---

## Section 6 — SEO Performance

**Route:** `/dashboard/seo`  
**Data Sources:** Google Search Console, GA4, (future) Ahrefs/SEMrush  
**Refresh:** Daily

### Widgets

**6.1 — Organic Traffic Trend**
- Line chart: organic sessions, 12-month rolling
- vs prior period comparison

**6.2 — Keyword Rankings**
- Table: Target keywords, current rank, rank change (MoM), search volume, page ranking
- Filter by: improving / declining / new to top 10

**6.3 — Search Console Summary**
- Total impressions (28-day)
- Total clicks (28-day)
- Average CTR
- Average position

**6.4 — Core Web Vitals**
- LCP, INP, CLS scores for desktop and mobile
- Pass/Fail status
- Trend (improving / stable / degrading)

**6.5 — Indexing Status**
- Pages indexed vs total pages
- Crawl errors
- Last sitemap submission date

---

## Section 7 — Upcoming Renewals

**Route:** `/dashboard/renewals`  
**Data Sources:** Stripe subscriptions, Supabase `projects` table  
**Refresh:** Daily

### Widgets

**7.1 — Renewal Calendar**
- 90-day forward view of all subscription renewals
- Care Plan renewals (monthly — all auto-renew via Stripe)
- Annual contract renewals (flagged 60 days in advance)

**7.2 — Churn Risk Alerts**
- Clients who haven't logged into portal in 30+ days
- Clients with 2+ unresolved support tickets
- Clients who haven't responded to last 2 messages

**7.3 — Upsell Opportunities**
- Care Plan clients eligible for upgrade (e.g., Care → SEO Retainer)
- Project clients with no active Care Plan
- Project clients approaching 12-month mark (website refresh opportunity)

---

## Section 8 — Tasks

**Route:** `/dashboard/tasks`  
**Data Sources:** Supabase `tasks` table  
**Refresh:** Real-time

### Widgets

**8.1 — My Task Queue**
- Grouped by: Overdue / Due Today / Due This Week / Upcoming
- Quick-complete checkboxes
- Filter by project

**8.2 — Client-Awaited Tasks**
- Tasks assigned to clients that are overdue or stale
- Client name, task, days outstanding, quick-message button

**8.3 — Blocked Tasks**
- Any task flagged as blocked with blocking reason

---

## Section 9 — Goals

**Route:** `/dashboard/goals`  
**Data Sources:** Manual entry + auto-pull from KPI sources  
**Refresh:** Daily

### Widgets

**9.1 — Quarterly OKR Tracker**
- Current quarter's Objectives and Key Results
- Each KR: target, current value, % to goal, status (on-track/at-risk/missed)

**9.2 — Annual Milestone Progress**
- Year's strategic milestones
- Each milestone: completion status, ETA, owner

**9.3 — KPI Scoreboard**
- All KPIs from `KPIDefinitions.md`
- Current value vs target, color-coded by performance

---

## Section 10 — Notifications

**Route:** Persistent bell icon in header  
**Refresh:** Real-time via Supabase realtime

### Notification Types

| Type | Trigger | Priority |
|------|---------|----------|
| New lead | Contact form submitted | High |
| Discovery call booked | Calendly webhook | High |
| Invoice paid | Stripe webhook | Medium |
| Invoice overdue | 1 day past due date | High |
| Milestone due | 48 hours before due date | Medium |
| Project health changed to Red | Automated health check | High |
| Client portal login (new device) | Supabase Auth event | Medium |
| New support ticket | Client submits ticket | High |
| Subscription canceled | Stripe webhook | High |
| Goal completed | KPI reaches target | Low |

---

## Technical Notes

- Dashboard is a Next.js App Router application hosted at `admin.romancreativestudio.co`
- All data fetched via Supabase client with RLS (admin role sees all data)
- GA4 and Search Console data pulled via their respective APIs on a scheduled job (daily)
- Charts: Recharts or Tremor library (both React-compatible, open source)
- Real-time updates: Supabase Realtime for task and notification data only
- No sensitive financial data cached on the client — all aggregations computed server-side

---

## Future Enhancements

- [ ] Customizable widget layout (drag-and-drop dashboard builder)
- [ ] Email digest: daily summary delivered at 7am
- [ ] Mobile app (React Native) for on-the-go dashboard access
- [ ] Multi-user support when team grows (role-based widget visibility)
- [ ] Embedded AI assistant: "What's driving the lead drop this week?"
- [ ] Export any widget as PDF or CSV

---

## Related Documents

- `KPIDefinitions.md` — all metrics displayed in dashboard
- `InternalDashboardArchitecture.md` — full technical architecture
- `BusinessIntelligenceAudit.md` — readiness baseline
- `ForecastingModels.md` — revenue and forecast widgets
- `IntegrationReadiness.md` — data source integrations
- `ReusableComponents.md` — UI component library used in dashboard
