# Document Management
## Roman Creative Studio — Agency Operating System

**Owner:** Founder
**Version:** 1.0
**Last Updated:** 2026-06-30
**Related Documents:** ClientOnboardingSystem.md, ProjectManagementFramework.md, SecurityPrivacy.md

---

## Purpose

Establish naming conventions, folder structures, version control standards, and retention policies for every document Roman Creative Studio creates, receives, or manages on behalf of clients.

---

## Master Folder Structure

### Agency-Level (Internal)
```
RCS-Agency/
├── 01-Business/ (Contracts-Templates, Invoices-Sent, Legal, Insurance, Tax-Records)
├── 02-Clients/ ([ClientName-Tier-Year]/)
├── 03-Templates/ (Proposals, Contracts, Invoices, Emails, Meeting-Notes, Onboarding, Reports)
├── 04-Marketing/ (Brand-Assets, Case-Studies, Testimonials, Social-Content)
├── 05-Operations/ (SOPs, Checklists, Vendor-Accounts)
└── 06-Archive/ ([Year]/)
```

### Per-Project (Client-Facing)
```
[ClientName]-[Tier]-[Year]/
├── 01-Brand-Assets/ (Logos, Fonts, Colors, Photography)
├── 02-Content/ (Copy-Drafts, Copy-Approved, Images)
├── 03-Design/ (Wireframes, Mockups-v1, Mockups-Approved, Final-Exports)
├── 04-Development/ (Staging-Link.txt, Launch-Checklist.md)
├── 05-Contracts-Invoices/ (Contract-Signed-v1.pdf, Invoice-M1/M2/M3-[Date]-[status].pdf)
└── 06-Meeting-Notes/ (YYYY-MM-DD-[type].md)
```

---

## Naming Conventions

### Universal Rules
1. No spaces — use hyphens (`-`)
2. No special characters except hyphens and underscores
3. Dates in `YYYY-MM-DD` format (ISO 8601) for correct sorting
4. Version numbers: `v1`, `v2`, `v3`
5. Status suffixes: `-Draft`, `-Review`, `-Approved`, `-Final`, `-Archive`
6. Capitalize first letter of each word in folder names; lowercase all file names

### Document-Specific Naming

| Document Type | Format | Example |
|--------------|--------|----------|
| Proposal | `proposal-[ClientSlug]-[Tier]-[YYYY-MM-DD].pdf` | `proposal-brightsmile-dental-GROW-2026-01-15.pdf` |
| Contract | `contract-[ClientSlug]-[Tier]-signed-[YYYY-MM-DD].pdf` | `contract-brightsmile-dental-GROW-signed-2026-01-18.pdf` |
| Invoice | `invoice-[ClientSlug]-M[1/2/3]-[YYYY-MM-DD]-[status].pdf` | `invoice-brightsmile-dental-M1-2026-01-18-paid.pdf` |
| Meeting Notes | `[YYYY-MM-DD]-[ClientSlug]-[type].md` | `2026-01-20-brightsmile-kickoff.md` |
| Monthly Report | `report-[ClientSlug]-[YYYY-MM].pdf` | `report-brightsmile-2026-05.pdf` |

**Client Slug Format:** Lowercase, hyphens only, max 20 chars. Example: "Bright Smile Dental" → `brightsmile-dental`

---

## Document Standards

### Contracts (Required Sections)
1. Parties | 2. Scope of Work (exact pages, features, integrations) | 3. Payment Schedule (50/25/25) | 4. Timeline and Milestones | 5. Revision Policy | 6. Intellectual Property | 7. Client Responsibilities | 8. Cancellation and Refund Policy | 9. Confidentiality | 10. Limitation of Liability | 11. Governing Law | 12. Signatures (e-signature platform)

**Retention:** 7 years minimum.

### Invoices (Required Fields)
- Invoice number (sequential: INV-2026-001, INV-2026-002...)
- Issue date, due date (Net 7 first invoice; Net 14 others)
- Client name and address; RCS name and address
- Line items with description and amount
- Payment instructions (Stripe link, ACH, or check)
- Late payment terms (1.5%/month after due date)

**Milestone Labels:**
- M1: "Project Commencement Fee — 50%"
- M2: "Design Approval Fee — 25%"
- M3: "Project Launch Fee — 25%"

**Retention:** 7 years minimum.

### Proposals (Required Sections)
1. Cover page | 2. Executive Summary | 3. Understanding Your Business | 4. Proposed Solution & Scope | 5. Project Timeline | 6. Investment (project fee + optional Care Plan) | 7. What Happens Next | 8. About RCS | 9. Work Samples

**Validity:** 30 days from delivery date.

### Meeting Notes (Required Sections)
```
Date / Type (Discovery/Kickoff/Design Review/Check-In/Launch) / Attendees / Duration
Summary (2-3 sentences)
Decisions Made (bulleted)
Action Items (table: Action | Owner | Due Date)
Open Questions
Next Meeting
```

---

## Version History

- `v1.0` — First approved version
- `v1.1` — Minor change
- `v2.0` — Major revision

**Rule:** Never overwrite an approved document. Create a new version and archive the old one.

---

## Retention Policy

| Document Type | Retention Period |
|--------------|------------------|
| Signed contracts | 7 years |
| Invoices | 7 years |
| Tax records | 7 years |
| Proposals (signed) | 3 years |
| Meeting notes | 3 years |
| Design files | 5 years |
| Client assets | 1 year post-project |
| Email correspondence | 2 years |

---

## Technical Notes
- Google Drive is the current document storage platform
- Sensitive documents (contracts, invoices): restricted sharing — specific people only, not "anyone with the link"
- Credentials and passwords: **never stored in Drive** — use 1Password or Bitwarden exclusively
- Monthly Drive audit: check for orphaned files, stale sharing permissions, storage usage
