# Data Governance — Roman Creative Studio
## Enterprise Operating System | Section 5A
**Version:** 1.0
**Last Updated:** 2026-07-01
**Owner:** CTO + CISO
**Review Schedule:** Annual + on major infrastructure change
**Dependencies:** SecurityFramework.md, PrivacyFramework.md, ComplianceFramework.md
**Related Documents:** DisasterRecovery.md, KnowledgeManagement.md

---

## Purpose

Establish rules and standards for how Roman Creative Studio manages, organizes, protects, and maintains data across all systems — from client deliverable files to operational databases to analytics.

**Business Value:** Data that can't be found is data that doesn't exist. Data that isn't protected is a liability. Data governance ensures our information is organized, accessible to those who need it, protected from those who don't, and retained only as long as necessary.

---

## Data Classification

### Level 1: Confidential
Data that, if exposed, causes serious harm to clients, team, or RCS.

**Examples:**
- Client credentials (passwords, API keys, logins)
- Client financial information
- Signed contracts with payment terms
- Employee salary and compensation data
- Business financial statements
- Personal data subject to GDPR/CCPA

**Controls:**
- Stored in encrypted systems only
- Access restricted to need-to-know
- Never transmitted via email unencrypted
- Never in Notion public pages or shared links

---

### Level 2: Internal
Data used for internal operations, not for public sharing but not critical to protect.

**Examples:**
- Project documentation and meeting notes
- Internal processes and SOPs
- Team communication and decisions
- Operational KPIs and dashboards
- Vendor relationships and pricing

**Controls:**
- Access limited to RCS team members
- Not shared publicly
- Stored in internal tools (Notion private, GitHub private)

---

### Level 3: Client-Accessible
Data shared with clients as part of project delivery or portal access.

**Examples:**
- Project status and milestones
- Deliverable files and assets
- Invoices and payment history
- Project communication threads

**Controls:**
- Shared via secure channels (client portal, Dropbox, Google Drive with link)
- Not shared with other clients
- Access revoked upon project completion (client retains their own copies)

---

### Level 4: Public
Data intentionally published for public consumption.

**Examples:**
- Website content
- Blog posts
- Portfolio case studies (with client permission)
- Marketing materials
- Social media content

**Controls:**
- Review before publishing (no confidential or internal data accidentally included)
- Portfolio requires client permission (contract clause)

---

## Data Ownership

| Data Domain | Owner | Steward | Access Level |
|-------------|-------|---------|-------------|
| Client project files | CEO | Project Manager | Level 2–3 |
| Client credentials | CEO + CTO | Lead Engineer | Level 1 |
| Financial records | CEO + CFO | COO | Level 1 |
| Employee records | CEO + COO | HR | Level 1 |
| Operational docs | COO | Department Heads | Level 2 |
| Source code | CTO | Lead Engineer | Level 2 |
| Analytics data | CMO | Marketing | Level 2 |
| Marketing content | CMO | Content Manager | Level 3–4 |
| Product assets | CPO | CIO | Level 2 |

---

## Data Storage Standards

### By Data Type

| Data Type | Primary Storage | Backup | Classification |
|-----------|----------------|--------|----------------|
| Source code | GitHub (private) | Local clone | Level 2 |
| Database | Supabase | Supabase PITR + weekly export | Level 1–2 |
| Design files | Figma (cloud) | Supabase Storage export | Level 2–3 |
| Client credentials | 1Password | 1Password cloud backup | Level 1 |
| Contracts | Supabase Storage | Encrypted local copy | Level 1 |
| Financial records | Accounting software + CSV | Google Drive encrypted | Level 1 |
| Operational docs | Notion | Monthly Notion export | Level 2 |
| Email | Google Workspace | Google Vault | Level 1–2 |
| Analytics | GA4 | BigQuery export (Year 2) | Level 2 |

---

## Data Naming Standards

### File Naming Convention
```
[YYYY-MM-DD]_[client-slug]_[project-slug]_[description]_v[N].[ext]

Examples:
2026-03-15_dental-plus_website-rebrand_homepage-wireframe_v2.fig
2026-06-01_oak-construction_brand-identity_logo-final_v1.ai
2026-07-30_rcs-internal_care-plan-proposal_template_v3.pdf
```

### Folder Structure (Per Client Project)
```
/clients
  /[client-slug]
    /01-discovery
    /02-strategy
    /03-design
      /wireframes
      /mockups
      /assets
    /04-development
    /05-content
    /06-deliverables
      /final-exports
    /07-handoff
    /contracts
    /correspondence
```

### Database Naming Standards
- Tables: `snake_case`, plural nouns (`client_projects`, `invoice_items`)
- Columns: `snake_case` (`created_at`, `client_id`, `project_status`)
- Primary keys: `id` (UUID)
- Foreign keys: `[referenced_table_singular]_id`
- Timestamps: `created_at`, `updated_at` on all tables
- Boolean columns: `is_[state]` or `has_[property]` (`is_active`, `has_paid`)

---

## Data Quality Standards

### Accuracy
- All client records verified at project kickoff
- Financial records reconciled monthly
- Contact information updated when clients inform us of changes
- No orphaned or duplicate records in primary database

### Completeness
- All client projects have: name, contact, status, start date, contract, invoices
- All transactions have: date, amount, category, project reference
- All team members have: name, role, access level, start date

### Timeliness
- Financial data updated within 48 hours of transaction
- Project status updated same day as milestone completion
- New client data entered same day as contract signing

---

## Data Lifecycle Management

### Stage 1: Creation / Collection
- Data created in the appropriate system (not duplicated across systems)
- Classification assigned at creation
- Ownership assigned at creation

### Stage 2: Storage & Use
- Stored in appropriate system per classification
- Access controlled per classification
- Quality maintained per standards

### Stage 3: Archival
- Data no longer actively needed but required for compliance: archived
- Archive location: Supabase Storage (encrypted) or Google Drive (encrypted)
- Archive index maintained in Notion

### Stage 4: Deletion
- Data past retention period: deleted
- Deletion is secure (not just "move to trash")
- Deletion confirmed and logged
- Cannot retrieve after secure deletion — this is intentional

---

## Data Access Audit Log

All access to Level 1 (Confidential) data must be logged:
- Who accessed it
- When
- Why
- What action was taken

**Implemented via:** Supabase Row Level Security + audit_log table; 1Password access log; GitHub audit log

---

## Analytics & Business Intelligence

### Data Warehouse (Year 2)
As described in Phase 8C, BI data stores in Supabase:
- `kpi_snapshots` — 28 operational KPIs
- `revenue_monthly` — revenue by stream
- `lead_funnel_monthly` — lead and conversion metrics
- `traffic_daily` — website analytics

**Data Governance for BI:**
- All KPI data inputs are owned (named owner per KPI)
- Manual inputs made within 48 hours of period close
- Automated inputs audited monthly for accuracy
- Historical data never modified without documented reason

---

## Future Improvements

- Formal data catalog (searchable inventory of all data assets) by Year 3
- Automated data quality checks by Year 3
- Data lineage documentation (where does each piece of data come from?) by Year 3
- Row-level security audit for all Supabase tables by Year 2
- Data governance training for all team members by Year 2
