# Client Portal Architecture
## Roman Creative Studio — Agency Operating System

**Owner:** CTO / Founder
**Version:** 1.0
**Last Updated:** 2026-06-30
**Related Documents:** CRMArchitecture.md, ReusableComponents.md, SecurityPrivacy.md, IntegrationReadiness.md

---

## Purpose

Define the complete architecture for a future client-facing portal that gives Roman Creative Studio clients real-time visibility into their projects, invoices, files, reports, and support tickets.

---

## Architecture Overview

```
client-portal/
├── /login                      # Auth entry point
├── /dashboard                  # Home: overview of all active items
├── /projects / /projects/[id]  # Project detail: timeline, status, approvals
├── /invoices / /invoices/[id]  # Invoice detail + pay button
├── /contracts                  # Signed contract archive
├── /files                      # Shared asset library
├── /meetings                   # Meeting notes archive
├── /requests                   # Website change request form
├── /tickets                    # Support ticket queue
├── /reports / /reports/[month] # Monthly reports archive
├── /hosting                    # Hosting status and renewal info
├── /analytics                  # Embedded GA4 summary (future)
├── /care-plan                  # Care Plan details, billing, renewal
├── /knowledge-base             # Client education resources
└── /announcements              # RCS updates
```

---

## Authentication Architecture

**Recommended Tool:** Supabase Auth (magic links, PostgreSQL-backed, row-level security)

| Phase | Method |
|-------|--------|
| Phase 1 | Magic Link (email) — no password required |
| Phase 2 | Password + MFA |
| Phase 3 | SSO (Google Workspace) for enterprise |

### Access Control Levels

| Role | Access |
|------|--------|
| Client (Owner) | Full portal access for their own account |
| Client (Viewer) | Read-only, no billing, no file uploads |
| RCS Admin | Full access to all client portals |
| RCS Contractor | Assigned project access only |

### Row-Level Security Policy (Supabase)
```sql
CREATE POLICY "client_own_projects"
ON projects FOR SELECT
USING (auth.uid() = client_user_id);
```

---

## Section Specifications

### 1. Dashboard
Components: DashboardWelcomeCard, ActiveProjectCard (with progress bar), InvoiceDueCard (with pay button), RecentActivityFeed, SupportTicketBadge, CarePlanStatusCard, QuickActionBar (Submit Request | View Report | Book Meeting)

### 2. Projects
List: Project name, tier, status badge, launch date, progress indicator.
Detail: ProjectTimelineCard (milestone timeline), MilestoneChecklist, ApprovalCard (approve/request-revision buttons), RevisionLog, ProjectFilesTab, ContactCard.
Status Values: `planning | research | design | development | review | launched`

### 3. Invoices
List: Invoice number, amount, due date, status (paid/pending/overdue).
Detail: Line items, payment method, Pay Now button (Stripe Checkout), Download PDF, payment history.
Statuses: `draft | sent | viewed | paid | overdue | refunded`

### 4. Files
```
/files
  /brand-assets  /photography  /copy  /design-mockups  /final-exports  /meeting-notes
```
Features: Folder browser, file cards (name, type, size, date), upload button, preview modal.
Storage Backend: Supabase Storage or Google Drive API.

### 5. Website Requests (Care Plan)
Form fields: request type, page URL, description, priority (low/medium/high), attachments.
SLA: Low → 5 business days; Medium → 3 business days; High → 1 business day.

### 6. Monthly Reports
Auto-generated on 1st of each month. Sections: Executive Summary, Traffic Overview, Top Pages, Lead/Conversion Events, SEO Keyword Rankings, Core Web Vitals, Actions Completed, Next Month Recommendations.

### 7. Hosting Status
Components: provider, domain/SSL expiry dates, uptime % (30 days), last backup, renewal reminder banner (30 days before).

### 8. Knowledge Base (Client-Facing)
Categories: How to Update Content, Understanding Your Monthly Report, How to Submit a Support Request, What's Included in Your Care Plan, Domain and Hosting Basics, SEO Basics for Business Owners.

---

## Tech Stack Recommendation

| Layer | Recommended |
|-------|-------------|
| Frontend | Next.js (App Router) |
| Auth | Supabase Auth |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Payments | Stripe |
| Email | Resend |
| Hosting | Vercel |

## Build Phasing

- **Phase 1 (Month 1-2):** Auth, Dashboard, Projects, Invoice view + Stripe pay link, Files (Google Drive embedded)
- **Phase 2 (Month 3-4):** Monthly report auto-generation, Website request form, Support tickets, Meeting notes archive
- **Phase 3 (Month 5-6):** GA4 analytics, Hosting monitoring, Care Plan billing portal, AI-generated report drafts

**Portal URL:** `portal.romancreativestudio.co`
