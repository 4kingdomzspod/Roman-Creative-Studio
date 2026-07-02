# Internal Tools — Roman Creative Studio
## Innovation Lab | Section 8
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Owner:** Chief Innovation Officer + Lead Software Engineer  
**Status:** Active Planning

---

## Overview

RCS Internal Tools are custom-built software systems that automate, streamline, and systematize agency operations. We build these tools when the cost of building is lower than the long-term cost of manual work or off-the-shelf software limitations.

**Build vs. Buy Decision Framework:**
- Buy if: Good SaaS solution exists at <$200/mo and covers 90%+ of needs
- Build if: No suitable solution exists, or building = competitive advantage
- Automate first: Can Zapier + existing tools solve this? If yes, do that first.

---

## Tool Catalog

### TOOL-01: Client Portal
**Status:** Year 2 Build  
**Priority:** High  
**Domain:** portal.romancreativestudio.co

**Purpose:** A branded client-facing portal where clients can track project progress, review deliverables, approve milestones, and communicate with their project team.

**Problem Solved:**
- Clients email asking "what's the status?" constantly
- No central place for clients to review and approve work
- File sharing via email creates version confusion
- Communication scattered across email, Slack, text

**Core Features:**
- Dashboard: Active project(s) with phase progress
- File Review: Upload and approve/request changes on deliverables
- Milestone Tracker: Visual timeline with completed/upcoming milestones
- Invoice & Payments: Stripe-powered payment portal (view invoices, pay deposits)
- Messaging: Threaded communication with project team
- Document Library: Contract, brief, brand assets, final deliverables
- Meeting Scheduler: Calendly embed for quick booking

**Tech Stack:**
```
Frontend: Next.js 14 (App Router)
Auth: Supabase Auth (magic link + Google OAuth)
Database: Supabase PostgreSQL
File Storage: Supabase Storage
Payments: Stripe Customer Portal
Email: Resend
Deployment: Vercel
```

**Build Estimate:** 6–8 weeks (1 developer)  
**Alternative Before Build:** Notion client portal + Stripe payment links (Year 1 interim solution)

---

### TOOL-02: Internal Admin Dashboard
**Status:** Year 2 Build  
**Priority:** High  
**Domain:** admin.romancreativestudio.co

**Purpose:** Internal command center for the RCS team — project management, financial tracking, KPI dashboards, and client health monitoring.

**Problem Solved:**
- KPIs tracked in spreadsheets are error-prone and not real-time
- No single view of agency financial health
- Project status requires checking multiple tools

**Core Features:**
- KPI Dashboard: 28 operational KPIs + 25 financial KPIs (live)
- Revenue Dashboard: MRR, ARR, pipeline, forecasted revenue
- Project Overview: All active projects with status and health score
- Client Health Score: Aggregated health per client account
- Team Capacity: Hours logged vs. available per team member
- Lead Pipeline: All active leads with stage and probability
- Financial Snapshot: Cash, runway, monthly P&L
- Alert Center: Red/amber KPI notifications

**Tech Stack:**
```
Frontend: Next.js 14 with Recharts/Tremor for data viz
Auth: Supabase Auth with MFA required
Database: Supabase PostgreSQL (same DB as portal)
Deployment: Vercel
Access: IP restriction + MFA (admin accounts only)
```

**Build Estimate:** 8–12 weeks (1 developer)  
**Pre-Build Interim:** Google Sheets + Looker Studio dashboard (Year 1)

---

### TOOL-03: Proposal Builder
**Status:** Year 1 Internal Prototype  
**Priority:** High  
**Type:** Internal tool first, potential SaaS product Year 2

**Purpose:** Generate customized, branded project proposals from discovery call inputs in under 15 minutes.

**Problem Solved:**
- Proposals take 2–4 hours to write manually
- Quality varies by who writes the proposal
- No versioning or tracking of sent proposals
- No analytics on proposal open rates or conversion

**Core Features:**
- Discovery input form (structured questions)
- Claude API generation of proposal body
- Rich text editor for customization
- Branded PDF export (RCS template)
- Shareable link with password protection
- Read receipt (notify when opened)
- E-signature integration (HelloSign API)
- Proposal analytics (open rate, time spent, sections read)
- Proposal library (save winning proposals as templates)

**Tech Stack:**
```
Frontend: Next.js
AI: Anthropic Claude API (claude-sonnet-5)
PDF: Puppeteer / react-pdf
E-Signature: HelloSign API
Database: Supabase
Email: Resend
```

**Year 1 Interim:** Use Notion template + manual PDF export.

---

### TOOL-04: Project Management System
**Status:** Year 1 — Use Notion until custom build justified  
**Priority:** Medium

**Current Solution:** Notion databases for:
- Project tracker
- Client database
- Task management
- Meeting notes
- Document storage

**When to Build Custom:**
- Notion limitations hit (5+ active projects, 3+ team members)
- Custom workflow requirements not met by Notion
- Data integration needs with Portal and Admin Dashboard

**Future Custom Features:**
- Timeline view with dependencies
- Automated status updates based on task completion
- Client communication log
- Time tracking built-in
- Integration with Portal (client sees project status, team manages internally)

---

### TOOL-05: Estimator Tool
**Status:** Year 1 Build (simple version)  
**Priority:** High

**Purpose:** Internal tool for generating accurate project time and cost estimates.

**Problem Solved:**
- Estimates vary by team member — inconsistent profitability
- No historical data to inform future estimates
- New team members can't estimate accurately

**Core Features:**
- Project type selector
- Feature/complexity checklist
- Time database (historical averages by task type)
- Complexity multipliers (client type, scope ambiguity, integration complexity)
- Output: Hours by phase, total hours, recommended price range
- Save estimates for future reference
- Track actual vs. estimated (feeds back into time database)

**Year 1 MVP:** Google Sheets with formulas (1 week to build)  
**Year 2:** Web app with historical data and ML-based improvement

---

### TOOL-06: Onboarding Automation
**Status:** Year 1 (Zapier-based)  
**Priority:** High

**Purpose:** Automate client and team onboarding workflows.

**Client Onboarding Flow (Zapier):**
```
Trigger: Contract signed (HelloSign webhook)
  ↓
Create project in Notion
  ↓
Send welcome email (Resend template)
  ↓
Schedule kickoff call invite (Calendly + Google Calendar)
  ↓
Create Slack channel (if on Slack plan)
  ↓
Send discovery questionnaire (Typeform)
  ↓
Notify team in #new-projects
```

**Employee Onboarding Flow (Zapier):**
```
Trigger: Offer letter signed
  ↓
Create accounts: Google Workspace, Notion, GitHub
  ↓
Send welcome email + Day 1 schedule
  ↓
Add to MailerLite team newsletter
  ↓
Schedule 30/60/90-day calendar events
  ↓
Notify team in #team-announcements
```

---

### TOOL-07: MRR & Revenue Tracker
**Status:** Year 1 — Google Sheets; Year 2 — Supabase dashboard  
**Priority:** High

**Purpose:** Real-time visibility into recurring revenue across all MRR streams.

**Year 1 (Sheets) Tracks:**
- Active Care Plan clients (plan type, monthly value, start date)
- Active retainer clients
- Active product subscriptions
- MRR by stream, MRR total, MRR trend (3-month)
- Churned clients log with churn reason

**Year 2 (Dashboard) Adds:**
- Stripe webhook integration (real-time billing events)
- Automated churn detection
- LTV calculation per client
- MRR forecasting (3-month projection based on trend)
- Slack alert: New MRR, Churned MRR, MRR milestone hit

---

### TOOL-08: SEO Monitoring Dashboard
**Status:** Year 1 — GSC + Ahrefs; Year 2 — Unified internal dashboard  
**Priority:** Medium

**Purpose:** Monitor organic search performance for romancreativestudio.co and generate weekly insight reports.

**Data Sources:**
- Google Search Console API (impressions, clicks, rankings)
- Google Analytics 4 (traffic, conversions)
- Ahrefs API (backlinks, domain rating, keyword tracking)

**Outputs:**
- Weekly performance email (auto-generated Mondays)
- Monthly trend report
- Alert on significant ranking drops (>5 positions for target keywords)
- New backlink notifications

---

## Tools Stack by Year

### Year 1 Stack (Pre-Custom Build)
| Function | Tool | Monthly Cost |
|----------|------|--------------|
| Project Management | Notion | $16 |
| Client Communication | Email + Notion portal | $0 |
| Proposals | Notion template + PDF export | $0 |
| Contracts | HelloSign | $15 |
| Payments | Stripe | 2.9% + 30¢ |
| Scheduling | Calendly | $12 |
| Email Marketing | MailerLite | $0–30 |
| Automation | Zapier | $20–50 |
| Analytics | GA4 + GSC | $0 |
| SEO | Ahrefs Lite | $99 |
| **Total** | | **~$162–222/mo** |

### Year 2 Stack (With Custom Tools)
| Function | Tool | Monthly Cost |
|----------|------|--------------|
| Client Portal | Custom (portal.romancreativestudio.co) | ~$30 (Vercel + Supabase) |
| Admin Dashboard | Custom (admin.romancreativestudio.co) | ~$20 (Vercel) |
| All Year 1 tools | Continued | ~$162–222 |
| Circle.so (Community) | Circle.so Professional | $399 |
| Teachable (Courses) | Teachable Pro | $119 |
| **Total** | | **~$730–800/mo** |

---

## Build Prioritization Matrix

| Tool | Impact | Complexity | Priority Score | Year |
|------|--------|------------|----------------|------|
| TOOL-01 Client Portal | High | High | 8/10 | Year 2 |
| TOOL-02 Admin Dashboard | High | High | 8/10 | Year 2 |
| TOOL-03 Proposal Builder | High | Medium | 9/10 | Year 1 (MVP) |
| TOOL-05 Estimator | Medium | Low | 8/10 | Year 1 (Sheets) |
| TOOL-06 Onboarding | High | Low | 9/10 | Year 1 (Zapier) |
| TOOL-07 MRR Tracker | High | Low | 9/10 | Year 1 (Sheets) |
| TOOL-04 PM System | Medium | High | 5/10 | Year 3+ |
| TOOL-08 SEO Monitor | Medium | Medium | 6/10 | Year 2 |

---

## Implementation Roadmap

| Milestone | Target | Owner |
|-----------|--------|-------|
| TOOL-05 Estimator (Sheets) live | Month 1 | Lead Engineer |
| TOOL-07 MRR Tracker (Sheets) live | Month 1 | CFO |
| TOOL-06 Onboarding (Zapier) built | Month 2 | Operations Manager |
| TOOL-03 Proposal Builder MVP | Month 3–5 | Lead Engineer + CIO |
| TOOL-02 Admin Dashboard (Sheets + Looker) | Month 4 | CFO + CIO |
| TOOL-01 Client Portal build start | Month 10 | Lead Engineer |
| TOOL-01 Client Portal launch | Month 14 | Lead Engineer |
| TOOL-02 Admin Dashboard (custom) | Month 16 | Lead Engineer |
| TOOL-03 External SaaS evaluation | Month 18 | CIO + CPO |