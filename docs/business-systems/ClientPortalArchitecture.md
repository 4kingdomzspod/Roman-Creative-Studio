# Client Portal Architecture
## Roman Creative Studio — Agency Operating System

**Owner:** CTO / Founder
**Version:** 1.0
**Last Updated:** 2026-06-30
**Related Documents:** CRMArchitecture.md, ReusableComponents.md, SecurityPrivacy.md, IntegrationReadiness.md

---

## Purpose

Define the complete architecture for a future client-facing portal that gives Roman Creative Studio clients real-time visibility into their projects, invoices, files, reports, and support tickets — without requiring an email thread for every question.

## Business Value

A client portal reduces founder time spent on status updates, increases client trust and perceived value, differentiates RCS from freelancers who communicate only via email, and enables scalable delivery of Care Plan monthly reports.

---

## Architecture Overview

```
client-portal/
├── /login                      # Auth entry point
├── /dashboard                  # Home: overview of all active items
├── /projects                   # Project list + individual project view
│   └── /projects/[id]          # Project detail: timeline, status, approvals
├── /invoices                   # Invoice list + payment portal
│   └── /invoices/[id]          # Invoice detail + pay button
├── /contracts                  # Signed contract archive
├── /files                      # Shared asset library
├── /meetings                   # Meeting notes archive
├── /requests                   # Website change request form
├── /tickets                    # Support ticket queue
├── /reports                    # Monthly reports archive
│   └── /reports/[month]        # Individual report (SEO, analytics, etc.)
├── /hosting                    # Hosting status and renewal info
├── /analytics                  # Embedded GA4 summary (future)
├── /care-plan                  # Care Plan details, billing, renewal
├── /knowledge-base             # Client education resources
└── /announcements              # RCS updates and service announcements
```

---

## Authentication Architecture

**Not implemented yet. Architecture only.**

### Auth Strategy

| Approach | Description | Recommended Phase |
|----------|-------------|------------------|
| Magic Link (email) | Client receives a login link — no password required | Phase 1 |
| Password + MFA | Standard email/password with optional 2FA | Phase 2 |
| SSO (Google Workspace) | Single sign-on for enterprise clients | Phase 3 |

**Recommended Tool:** Supabase Auth (free tier, PostgreSQL-backed, row-level security, magic links supported)

**Alternative:** Clerk (developer-friendly, pre-built UI components, free tier available)

### Access Control Levels

| Role | Access |
|------|--------|
| Client (Owner) | Full portal access for their own account |
| Client (Viewer) | Read-only, no billing, no file uploads |
| RCS Admin | Full access to all client portals |
| RCS Contractor | Assigned project access only |

### Row-Level Security Policy (Supabase)

```sql
-- Clients can only read their own project data
CREATE POLICY "client_own_projects"
ON projects FOR SELECT
USING (auth.uid() = client_user_id);
```

---

## Section Specifications

### 1. Dashboard

**Purpose:** Single-glance overview of everything happening right now.

**Components:**
- `DashboardWelcomeCard` — Personalized greeting + project status summary
- `ActiveProjectCard` — Current project with progress bar and next milestone
- `InvoiceDueCard` — Unpaid invoices with pay button
- `RecentActivityFeed` — Last 5 actions across all sections
- `SupportTicketBadge` — Open tickets count
- `CarePlanStatusCard` — Plan tier, next billing date, hours used this month
- `QuickActionBar` — "Submit Request" | "View Report" | "Book Meeting"

**Data Sources:** Projects table, Invoices table, Tickets table, CareSubscriptions table

---

### 2. Projects

**Purpose:** Full visibility into the project timeline, deliverables, and approvals.

**List View Components:**
- Project name, tier (BUILD/GROW/SCALE), status badge, launch date
- Progress indicator (% complete)

**Detail View Components:**
- `ProjectTimelineCard` — Visual milestone timeline (Discovery → Design → Dev → Launch)
- `MilestoneChecklist` — Each milestone with status (complete/in-progress/upcoming)
- `ApprovalCard` — Pending design approvals with preview image and approve/request-revision buttons
- `RevisionLog` — History of all revision requests
- `ProjectFilesTab` — Quick access to shared files for this project
- `ContactCard` — Assigned RCS contact

**Status Values:** `planning` | `research` | `design` | `development` | `review` | `launched`

---

### 3. Invoices

**Purpose:** Transparent billing record with self-serve payment.

**List View:** Invoice number, amount, due date, status (paid/pending/overdue)

**Detail View:**
- Line items with descriptions
- Payment method on file
- Pay Now button (Stripe Checkout redirect)
- Download PDF
- Payment history for this project

**Invoice Statuses:** `draft` | `sent` | `viewed` | `paid` | `overdue` | `refunded`

---

### 4. Contracts

**Purpose:** Signed agreement archive. Read-only reference.

**Components:**
- Contract list (project name, date signed, version)
- PDF viewer or download link
- Signatory information
- No ability to modify — archive only

---

### 5. Files

**Purpose:** Central asset library for all shared files.

**Directory Structure:**
```
/files
  /brand-assets      # Logos, fonts, colors from client
  /photography       # Photos provided by or sourced for client
  /copy              # Website copy drafts and approvals
  /design-mockups    # Exported design files for approval
  /final-exports     # Launch-ready assets
  /meeting-notes     # PDFs of meeting summaries
```

**Components:**
- Folder browser with breadcrumb navigation
- File cards with: name, type icon, size, uploaded date, uploaded by
- Upload button (client can upload assets)
- Download button
- Preview modal for images and PDFs

**Storage Backend:** Supabase Storage or Google Drive API integration

---

### 6. Meeting Notes

**Purpose:** Permanent record of all meetings, decisions, and action items.

**Components:**
- Meeting list (date, type, attendees, summary headline)
- Detail view: full notes, decisions made, action items with owner and due date
- Export to PDF

**Meeting Types:** Discovery | Kickoff | Design Review | Dev Review | Launch Planning | Monthly Check-in

---

### 7. Website Requests

**Purpose:** Structured intake form for Care Plan content update requests.

**Form Fields:**
- Request type (text change, new page, image update, bug fix, other)
- Page URL affected
- Description
- Priority (low/medium/high)
- Attachments

**SLA by Priority:**
| Priority | Target Response | Target Resolution |
|----------|----------------|------------------|
| Low | 48 hours | 5 business days |
| Medium | 24 hours | 3 business days |
| High | 4 hours | 1 business day |

---

### 8. Monthly Reports

**Purpose:** Deliver monthly performance data to Care Plan clients.

**Report Sections:**
- Executive Summary (2-3 bullet points)
- Traffic Overview (sessions, users, pageviews)
- Top Pages by Traffic
- Lead/Conversion Events
- SEO Keyword Rankings
- Core Web Vitals
- Actions Completed This Month
- Recommendations for Next Month

**Delivery:** Auto-generated and emailed on the 1st of each month. Archived in portal.

---

### 9. Hosting Status

**Purpose:** Give clients visibility into their hosting, uptime, and renewal.

**Components:**
- Hosting provider name and plan
- Domain name + expiry date
- SSL certificate status + expiry
- Uptime percentage (last 30 days)
- Last backup date
- Renewal reminder banner (30 days before)

---

### 10. Knowledge Base (Client-Facing)

**Purpose:** Self-serve answers to common questions — reduce support load.

**Categories:**
- How to Update Your Website Content
- Understanding Your Monthly Report
- How to Submit a Support Request
- What's Included in Your Care Plan
- Domain and Hosting Basics
- SEO Basics for Business Owners

---

## Component Design Specifications

See `ReusableComponents.md` for full component specifications including:
- `ClientDashboardCard`
- `TaskCard`
- `InvoiceCard`
- `ProjectTimeline`
- `StatusBadge`
- `ProgressBar`
- `NotificationBanner`
- `SupportTicket`
- `MeetingNoteSummary`
- `ReportCard`

---

## Tech Stack Recommendation

| Layer | Recommended | Alternative |
|-------|-------------|-------------|
| Frontend | Next.js (App Router) | SvelteKit |
| Auth | Supabase Auth | Clerk |
| Database | Supabase (PostgreSQL) | PlanetScale |
| Storage | Supabase Storage | AWS S3 |
| Payments | Stripe | — |
| Email | Resend | SendGrid |
| Hosting | Vercel | Netlify |

---

## Build Phasing

### Phase 1 — Foundation (Month 1-2)
- Auth with magic link
- Dashboard with static cards
- Projects section (manual data entry by RCS admin)
- Invoice view + Stripe pay link
- Files section (Google Drive embedded)

### Phase 2 — Automation (Month 3-4)
- Monthly report auto-generation
- Website request form → Trello/Linear ticket
- Support ticket system
- Meeting notes archive

### Phase 3 — Intelligence (Month 5-6)
- GA4 embedded analytics
- Hosting status monitoring
- Care Plan billing portal
- AI-generated monthly report drafts

---

## Technical Notes

- Portal must be served on a subdomain: `portal.romancreativestudio.co`
- All routes require authentication — no public access
- Row-level security must ensure client A cannot access client B's data
- Portal should inherit the RCS design system (tokens.css, typography, color palette) for brand consistency
- Mobile-responsive — clients will view reports on their phones

## Future Enhancements

- White-label portal option for enterprise clients
- Client mobile app (React Native)
- Real-time project notifications (Supabase Realtime)
- AI chatbot for support questions
- Two-way contract negotiation within the portal
