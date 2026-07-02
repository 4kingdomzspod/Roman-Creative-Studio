# Internal Dashboard Architecture
## Roman Creative Studio — Agency Operating System

**Owner:** CTO / Founder
**Version:** 1.0
**Last Updated:** 2026-06-30
**Related Documents:** CRMArchitecture.md, ClientPortalArchitecture.md, ReusableComponents.md, SecurityPrivacy.md

---

## Purpose

Define the architecture for a future internal agency dashboard that gives the founder (and eventually the team) a real-time operational view of leads, projects, revenue, tasks, clients, and KPIs.

## Dashboard Philosophy

Every section answers one question:
- **Leads:** Where is my next project coming from?
- **Projects:** Is everything on track?
- **Revenue:** Am I hitting my targets?
- **Tasks:** What do I need to do today?
- **Clients:** Who needs attention?
- **KPIs:** Is the business healthy?

---

## Authentication

- URL: `admin.romancreativestudio.co` (private subdomain)
- Auth: Supabase Auth with email/password + **MFA required**
- Session timeout: 2 hours of inactivity
- IP allowlist: optional restriction to known office/VPN IPs
- No public access — all unauthenticated requests redirect to login

---

## Dashboard Route Structure

```
admin.romancreativestudio.co/
├── /                  # Overview (home)
├── /leads             # CRM pipeline board
├── /projects          # Active project tracker
│   └── /projects/[id] # Individual project detail
├── /revenue           # MRR, ARR, invoices, pipeline value
├── /tasks             # Daily task list
├── /clients           # Client roster with health indicators
│   └── /clients/[id]  # Individual client 360° view
├── /meetings          # Upcoming meetings + preparation briefs
├── /website-status    # Live site health across all client sites
├── /tickets           # Support ticket queue
├── /reports           # Monthly report generation center
├── /kpis              # Agency KPI dashboard
└── /notifications     # All alerts and action items
```

---

## Section 1: Overview (Home)

**Widgets:**
- NEW LEADS (count) / ACTIVE PROJECTS (count) / MRR ($) / OPEN TASKS (count)
- TODAY'S AGENDA: Discovery Call, Design Review (from calendar)
- OVERDUE ACTIONS: overdue proposals, pending approvals with days waiting

## Section 2: Leads

**Views:** Kanban Board (default by CRM stage) or List View (sortable table)
**Lead Card Fields:** Contact name/company, industry tag, estimated project value, days in stage, last activity, follow-up date, stage-change button
**KPIs:** Total leads/month, pipeline value, weighted pipeline, lead-to-proposal rate

## Section 3: Projects

**List View Columns:** Project name, Client, Tier (BUILD/GROW/SCALE), stage, progress bar, target launch, days to launch, status badge (On Track / At Risk / Overdue), next action required

**Project Detail View:** 15-stage timeline, milestone checklist, invoice status (M1/M2/M3), pending approvals with days waiting, client contact quick-access, file folder shortcut, recent activity log

**Alert Triggers:**
- ⚠️ Approval awaited > 3 days
- ⚠️ Content not received by deadline
- ⚠️ Project 5+ days behind target
- ✅ Milestone completed

## Section 4: Revenue

| Metric | Description |
|--------|-------------|
| MRR | Monthly Recurring Revenue from Care Plans |
| ARR | Annualized Recurring Revenue |
| Project Pipeline Value | Sum of open project proposals |
| This Month Revenue | Invoices paid in current calendar month |
| Outstanding Invoices | Unpaid invoices total |
| YTD Revenue | Year-to-date total |
| Average Project Value | Mean of all closed projects |
| Care Plan Churn | % of Care Plans cancelled this quarter |

## Section 5: Tasks

**Task Fields:** Title, project/client link, priority (P1-P4), due date, stage, assigned to, status
**Views:** Today (due today + overdue), This Week, By Project, Backlog

## Section 6: Clients

**Client Health Score:**
| Score | Criteria |
|-------|----------|
| Green | Active Care Plan + last contact < 30 days + no open issues |
| Yellow | No Care Plan OR last contact 30-60 days OR 1 open ticket |
| Red | Inactive > 90 days OR billing issue OR 2+ open tickets |

**Client 360° View:** Contact info, full project history, invoice history, Care Plan status, all meeting notes, support tickets, monthly reports, notes and tags

## Section 7: Upcoming Meetings

Meeting Card includes: meeting type, client name, date/time/duration, Zoom/Meet link, pre-call brief (CRM notes, open questions, project stage), quick links to discovery notes, proposal, project folder.

## Section 8: Website Status

**Per-Site Metrics:** URL, uptime % (30 days), SSL expiry, domain expiry, last backup, Lighthouse performance score
**Alert Triggers:** Site down, SSL < 30 days, domain < 60 days, performance dropped > 10 points
**Integration:** UptimeRobot or Uptime Kuma webhooks

## Section 9: Support Tickets

**SLA Breach Alerts:** Automatic notification when within 4 hours of SLA breach.
**Ticket Fields:** Ticket ID, client, type, priority (Low/Medium/High/Critical), status (Open/In Progress/Pending Client/Resolved), created date, SLA deadline, assigned to

## Section 10: KPI Dashboard

| KPI | Formula | Target |
|-----|---------|--------|
| Monthly Revenue | Sum paid invoices + MRR | $20k/mo |
| New Leads | Count of new leads | 20/mo |
| Lead-to-Client Rate | Clients signed / Leads | > 20% |
| Average Project Value | Total revenue / count | > $6,000 |
| Proposal Win Rate | Signed / Proposals sent | > 40% |
| Care Plan MRR | Sum of recurring revenue | > $5,000/mo |
| Care Plan Churn Rate | Cancelled / Total | < 5%/mo |
| Client NPS | Survey score | > 50 |
| On-Time Launch Rate | On-time / Total launched | > 85% |

---

## Tech Stack Recommendation

| Layer | Recommended |
|-------|-------------|
| Frontend | Next.js (App Router) |
| Auth | Supabase Auth + MFA |
| Database | Supabase (PostgreSQL) |
| Charts | Recharts or Tremor |
| Calendar | Google Calendar API |
| Uptime Monitoring | Uptime Kuma (self-hosted) |
| Hosting | Vercel |
