# Internal Dashboard Architecture
## Roman Creative Studio — Agency Operating System

**Owner:** CTO / Founder
**Version:** 1.0
**Last Updated:** 2026-06-30
**Related Documents:** CRMArchitecture.md, ClientPortalArchitecture.md, ReusableComponents.md, SecurityPrivacy.md

---

## Purpose

Define the architecture for a future internal agency dashboard that gives the Roman Creative Studio founder (and eventually the team) a real-time operational view of leads, projects, revenue, tasks, clients, and KPIs — without leaving a single interface.

## Business Value

An internal dashboard replaces a constellation of disconnected spreadsheets, email threads, and PM tools with a single source of operational truth. It surfaces the information that drives decisions at a glance, reduces the cognitive overhead of running a growing agency, and enables delegation to future contractors or employees.

---

## Dashboard Philosophy

> "The dashboard is not for vanity metrics. It is for decisions."

Every section answers one question:
- **Leads:** Where is my next project coming from?
- **Projects:** Is everything on track?
- **Revenue:** Am I hitting my targets?
- **Tasks:** What do I need to do today?
- **Clients:** Who needs attention?
- **KPIs:** Is the business healthy?

---

## Authentication Architecture

**Not implemented yet. Architecture only.**

- Internal dashboard served at: `admin.romancreativestudio.co` (private subdomain)
- Auth: Supabase Auth with email/password + MFA required
- Session timeout: 2 hours of inactivity
- IP allowlist (optional): restrict to known office/VPN IPs
- No public access. Enforce redirect to login for all unauthenticated requests.

---

## Dashboard Route Structure

```
admin.romancreativestudio.co/
├── /                           # Overview (home)
├── /leads                      # CRM pipeline board
├── /projects                   # Active project tracker
│   └── /projects/[id]          # Individual project detail
├── /revenue                    # MRR, ARR, invoices, pipeline value
├── /tasks                      # Daily task list with priority and due dates
├── /clients                    # Client roster with health indicators
│   └── /clients/[id]           # Individual client 360° view
├── /meetings                   # Upcoming meetings + preparation briefs
├── /website-status             # Live site health across all client sites
├── /tickets                    # Support ticket queue
├── /reports                    # Monthly report generation center
├── /kpis                       # Agency KPI dashboard
├── /notifications              # All alerts and action items
└── /docs                       # Link to internal documentation (GitHub)
```

---

## Section 1: Overview (Home)

**Purpose:** The "morning brief" — the first screen seen every workday.

**Widgets:**

```
┌──────────────────────────────────────────────────────────────┐
│ Good morning, Alexander.                       Today: [Date]  │
├──────────────────────────────────────────────────────────────┤
│ NEW LEADS (3)    ACTIVE PROJECTS (2)   MRR $1,194    OPEN TASKS (7) │
├──────────────────────────────────────────────────────────────┤
│ TODAY'S AGENDA                                                       │
│ 10:00am  Discovery Call — Jane Smith, Bright Smile Dental             │
│ 3:00pm   Design Review — Grace Community Church                      │
├──────────────────────────────────────────────────────────────┤
│ OVERDUE ACTIONS                                                      │
│ ⚠️  Proposal due: Dr. Martinez (2 days overdue)                       │
│ ⚠️  Approval awaited: Grace Church Design V2 (4 days)                │
└──────────────────────────────────────────────────────────────┘
```

---

## Section 2: Leads

**Purpose:** Pipeline board view of all active leads.

**View Options:**
- **Kanban Board** (default): Columns for each CRM stage (Lead, Qualified, Discovery, Proposal, Negotiation)
- **List View**: Sortable table by date, stage, value, source

**Lead Card Fields:**
- Contact name + company
- Industry tag
- Estimated project value
- Days in current stage
- Last activity date
- Assigned follow-up date
- Stage-change button

**Filters:** By stage, industry, lead source, date range, assigned user

**KPIs Shown:**
- Total leads this month
- Pipeline value (qualified + proposal stages)
- Weighted pipeline (value × stage probability)
- Lead-to-proposal conversion rate

---

## Section 3: Projects

**Purpose:** Track every active project against its timeline and deliverables.

**List View Columns:**
- Project name
- Client
- Tier (BUILD/GROW/SCALE)
- Current stage
- Progress bar (% complete)
- Target launch date
- Days to launch
- Status badge (On Track / At Risk / Overdue)
- Next action required (and owner)

**Project Detail View:**
- Full 15-stage timeline with current position highlighted
- Milestone checklist with completion status
- Invoice status (M1/M2/M3 paid?)
- Pending approvals with days waiting
- Client contact quick-access
- File folder shortcut
- Recent activity log

**Alert Triggers:**
- ⚠️ Approval awaited > 3 days
- ⚠️ Content not received by deadline
- ⚠️ Project is 5+ days behind target
- ✅ Milestone completed

---

## Section 4: Revenue

**Purpose:** Financial visibility across project income and recurring revenue.

**Metrics Displayed:**

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

**Charts (future):**
- Monthly revenue trend (12 months)
- Revenue by tier (BUILD/GROW/SCALE)
- MRR growth over time
- Revenue vs. target

**Invoice Table:**
- All invoices with status, amount, due date, days outstanding
- Quick actions: Send reminder, Mark paid, Download PDF

---

## Section 5: Tasks

**Purpose:** Daily prioritized task list for the founder and any contractors.

**Task Fields:**
- Title
- Project/client link
- Priority (P1 Critical / P2 High / P3 Medium / P4 Low)
- Due date
- Stage (corresponds to PM stage)
- Assigned to
- Status (todo / in-progress / blocked / done)

**Views:**
- **Today** (default): Due today + overdue
- **This Week:** All tasks due this week
- **By Project:** Tasks grouped by active project
- **Backlog:** Future tasks not yet scheduled

---

## Section 6: Clients

**Purpose:** Full client roster with health indicators.

**Client List Columns:**
- Client name + company
- Industry
- Active project? (badge)
- Care Plan tier
- MRR contribution
- Last contact date
- Health score (Green/Yellow/Red)
- Next renewal date

**Client Health Score Logic:**
| Score | Criteria |
|-------|----------|
| Green | Active Care Plan + last contact < 30 days + no outstanding issues |
| Yellow | No active Care Plan OR last contact 30-60 days OR 1 open ticket |
| Red | Inactive > 90 days OR billing issue OR 2+ open tickets |

**Client 360° View:**
- Contact info
- Full project history
- Invoice history
- Care Plan status
- All meeting notes
- Support tickets
- Monthly reports
- Notes and tags

---

## Section 7: Upcoming Meetings

**Purpose:** Prep for calls before they happen.

**Meeting Card includes:**
- Meeting type and title
- Client name
- Date, time, duration
- Zoom/Meet link
- Pre-call brief (pulled from CRM: last notes, open questions, current project stage)
- Quick links: discovery notes, proposal, project folder

**Integrations:** Google Calendar sync, Calendly webhook

---

## Section 8: Website Status

**Purpose:** Monitor uptime and health of all client websites under Care Plan.

**Per-Site Metrics:**
- URL
- Uptime % (last 30 days)
- Last checked
- SSL expiry date
- Domain expiry date
- Last backup
- Performance score (Lighthouse)

**Alert Triggers:**
- 🚨 Site down
- ⚠️ SSL expires in < 30 days
- ⚠️ Domain expires in < 60 days
- ⚠️ Performance score dropped > 10 points

**Integration:** UptimeRobot or Uptime Kuma (self-hosted) webhooks

---

## Section 9: Support Tickets

**Purpose:** Manage inbound change requests and support issues from Care Plan clients.

**Ticket Fields:**
- Ticket ID
- Client
- Type (Content Update / Bug Fix / New Feature / Question)
- Priority (Low / Medium / High / Critical)
- Status (Open / In Progress / Pending Client / Resolved)
- Created date
- SLA deadline (calculated from priority)
- Assigned to

**SLA Breach Alerts:** Automatic notification when a ticket is within 4 hours of SLA breach.

---

## Section 10: KPI Dashboard

**Purpose:** Monthly agency health scorecard.

**Primary KPIs:**

| KPI | Formula | Target |
|-----|---------|--------|
| Monthly Revenue | Sum of paid invoices + MRR | $20k/mo |
| New Leads | Count of new leads | 20/mo |
| Lead-to-Client Rate | Clients signed / Leads | > 20% |
| Average Project Value | Total project revenue / count | > $6,000 |
| Proposal Win Rate | Signed / Proposals sent | > 40% |
| Care Plan Count | Active subscriptions | Growing |
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

---

## Technical Notes

- Dashboard must never be publicly accessible — enforce auth on all routes
- Sensitive financial data (Stripe, revenue) requires additional confirmation before display
- Dashboard should be mobile-responsive for on-the-go access
- All dashboard data should have a "last updated" timestamp
- Data refreshes: real-time for alerts/notifications; 15-min cache for analytics

## Future Enhancements

- AI-generated weekly business summary ("Here's what happened this week")
- Predictive lead scoring integrated into the leads board
- Revenue forecasting with confidence intervals
- Contractor workspace with scoped access to assigned projects only
- Mobile app (React Native) for founder-on-the-go
