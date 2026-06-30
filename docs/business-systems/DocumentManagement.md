# Document Management
## Roman Creative Studio — Agency Operating System

**Owner:** Founder
**Version:** 1.0
**Last Updated:** 2026-06-30
**Related Documents:** ClientOnboardingSystem.md, ProjectManagementFramework.md, SecurityPrivacy.md

---

## Purpose

Establish naming conventions, folder structures, version control standards, and retention policies for every document Roman Creative Studio creates, receives, or manages on behalf of clients.

## Business Value

Consistent document management eliminates time lost searching for files, prevents version confusion, enables delegation (contractors can find anything), protects the business legally, and builds trust with premium clients.

---

## Master Folder Structure

### Agency-Level (Internal)

```
RCS-Agency/
├── 01-Business/
│   ├── Contracts-Templates/
│   ├── Invoices-Sent/
│   ├── Legal/
│   ├── Insurance/
│   └── Tax-Records/
├── 02-Clients/
│   └── [ClientName-Tier-Year]/    # One folder per project
├── 03-Templates/
│   ├── Proposals/
│   ├── Contracts/
│   ├── Invoices/
│   ├── Emails/
│   ├── Meeting-Notes/
│   ├── Onboarding/
│   └── Reports/
├── 04-Marketing/
│   ├── Brand-Assets/
│   ├── Case-Studies/
│   ├── Testimonials/
│   └── Social-Content/
├── 05-Operations/
│   ├── SOPs/
│   ├── Checklists/
│   └── Vendor-Accounts/
└── 06-Archive/
    └── [Year]/
```

### Per-Project (Client-Facing)

```
[ClientName]-[Tier]-[Year]/
├── 01-Brand-Assets/
│   ├── Logos/
│   ├── Fonts/
│   ├── Colors/
│   └── Photography/
├── 02-Content/
│   ├── Copy-Drafts/
│   ├── Copy-Approved/
│   └── Images/
├── 03-Design/
│   ├── Wireframes/
│   ├── Mockups-v1/
│   ├── Mockups-Approved/
│   └── Final-Exports/
├── 04-Development/
│   ├── Staging-Link.txt
│   └── Launch-Checklist.md
├── 05-Contracts-Invoices/
│   ├── Contract-Signed-v1.pdf
│   ├── Invoice-M1-[Date]-Paid.pdf
│   ├── Invoice-M2-[Date]-Paid.pdf
│   └── Invoice-M3-[Date]-Paid.pdf
└── 06-Meeting-Notes/
    ├── YYYY-MM-DD-Discovery.md
    ├── YYYY-MM-DD-Kickoff.md
    ├── YYYY-MM-DD-Design-Review.md
    └── YYYY-MM-DD-Launch-Review.md
```

---

## Naming Conventions

### Universal Rules

1. **No spaces** in file or folder names — use hyphens (`-`)
2. **No special characters** except hyphens and underscores
3. **Dates** always in `YYYY-MM-DD` format (ISO 8601) for correct sorting
4. **Version numbers** in format `v1`, `v2`, `v3`
5. **Status suffixes**: `-Draft`, `-Review`, `-Approved`, `-Final`, `-Archive`
6. **Capitalize first letter** of each word in folder names
7. **Lowercase** all file names

### Document-Specific Naming

| Document Type | Format | Example |
|--------------|--------|----------|
| Proposal | `proposal-[ClientSlug]-[Tier]-[YYYY-MM-DD].pdf` | `proposal-brightsmile-dental-GROW-2026-01-15.pdf` |
| Contract | `contract-[ClientSlug]-[Tier]-signed-[YYYY-MM-DD].pdf` | `contract-brightsmile-dental-GROW-signed-2026-01-18.pdf` |
| Invoice | `invoice-[ClientSlug]-M[1/2/3]-[YYYY-MM-DD]-[status].pdf` | `invoice-brightsmile-dental-M1-2026-01-18-paid.pdf` |
| Meeting Notes | `[YYYY-MM-DD]-[ClientSlug]-[type].md` | `2026-01-20-brightsmile-kickoff.md` |
| Design File | `[ClientSlug]-[page]-v[N]-[status].fig` | `brightsmile-homepage-v2-approved.fig` |
| Monthly Report | `report-[ClientSlug]-[YYYY-MM].pdf` | `report-brightsmile-2026-05.pdf` |
| Case Study | `case-study-[ClientSlug]-[YYYY].pdf` | `case-study-brightsmile-2026.pdf` |
| Brand Guide | `[ClientSlug]-brand-guidelines-v[N].pdf` | `brightsmile-brand-guidelines-v1.pdf` |

### Client Slug Format

ClientSlug = Lowercase company name, hyphens only, max 20 chars

Examples:
- "Bright Smile Dental" → `brightsmile-dental`
- "Grace Community Church" → `grace-community`
- "Apex Fitness Studio" → `apex-fitness`

---

## Document Standards

### Contracts

**Required Sections:**
1. Parties (client and RCS)
2. Scope of Work (exact pages, features, integrations)
3. Payment Schedule (50/25/25 milestone structure)
4. Timeline and Milestones
5. Revision Policy
6. Intellectual Property
7. Client Responsibilities (asset delivery, approval timelines)
8. Cancellation and Refund Policy
9. Confidentiality
10. Limitation of Liability
11. Governing Law and Jurisdiction
12. Signatures (e-signature platform)

**Version Control:** Major scope changes require a new signed addendum, not a new contract.

**Storage:** Original signed PDF in `05-Contracts-Invoices/` and a copy in `RCS-Agency/01-Business/Contracts-Archive/`

**Retention:** 7 years minimum after project completion.

---

### Invoices

**Required Fields:**
- Invoice number (sequential: INV-2026-001, INV-2026-002, etc.)
- Issue date
- Due date (Net 7 for standard; Net 14 for first invoice)
- Client name and address
- RCS name and address
- Line items with description and amount
- Payment instructions (Stripe link, ACH, or check)
- Late payment terms (1.5%/month after due date)

**Milestone Labels:**
- Milestone 1: "Project Commencement Fee — 50%"
- Milestone 2: "Design Approval Fee — 25%"
- Milestone 3: "Project Launch Fee — 25%"

**Retention:** 7 years minimum.

---

### Proposals

**Required Sections:**
1. Cover page (client name, RCS branding, date, proposal number)
2. Executive Summary
3. Understanding Your Business (from discovery call)
4. Proposed Solution and Scope of Work
5. Project Timeline
6. Investment (project fee + optional Care Plan)
7. What Happens Next (sign + deposit)
8. About Roman Creative Studio (1 page)
9. Relevant Work Samples

**Format:** PDF (exported from template tool, not sent as editable document)

**Validity:** Proposal pricing valid for 30 days from delivery date.

---

### Meeting Notes

**Required Sections:**
```
MEETING NOTES
Date: YYYY-MM-DD
Type: [Discovery / Kickoff / Design Review / Check-In / Launch]
Attendees: [Names and roles]
Duration: [X minutes]

SUMMARY
[2-3 sentence overview]

DECISIONS MADE
- Decision 1
- Decision 2

ACTION ITEMS
| Action | Owner | Due Date |
|--------|-------|----------|
| [Item] | [Who] | [Date] |

OPEN QUESTIONS
- Question 1
- Question 2

NEXT MEETING
Date: [Date]
Purpose: [Description]
```

**Storage:** Filed in client folder `06-Meeting-Notes/` + copy sent to client via email within 24 hours.

---

### Research Documents

**Stored in:** `RCS-Agency/02-Clients/[Project]/Research/` (internal) or delivered in client folder.

**Types:**
- Competitor Analysis
- Keyword Research
- Audience Persona
- Technical Audit Notes
- Content Inventory (if migrating)

**Format:** Markdown (`.md`) preferred for easy version control in GitHub.

---

### Assets

**Photography Standards:**
- Original files in highest available resolution
- Optimized web versions (WebP, max 1920px wide) stored separately
- Stock photos: preserve license file alongside image

**Logo Standards:**
- SVG (vector) is required for web
- PNG with transparent background for social/print fallback
- Original design source file (AI or Figma) preserved

**Font Standards:**
- License file preserved with font files
- Web font (WOFF2 preferred) separate from desktop (OTF/TTF)

---

## Version History

All documents follow semantic versioning:
- `v1.0` — First approved version
- `v1.1` — Minor change (copy edit, date update)
- `v2.0` — Major revision (scope change, redesign)

**Rule:** Never overwrite an approved document. Create a new version and archive the old one.

**Git-tracked documents** (in repo): All `.md` files in `docs/` are version-controlled via Git with commit history as the version log.

---

## Retention Policy

| Document Type | Retention Period |
|--------------|------------------|
| Signed contracts | 7 years |
| Invoices | 7 years |
| Tax records | 7 years |
| Proposals (signed) | 3 years |
| Meeting notes | 3 years |
| Design files | 5 years (or until client requests deletion) |
| Client assets | 1 year post-project (then offload to client) |
| Email correspondence | 2 years |

---

## Technical Notes

- Google Drive is the current document storage platform
- All sensitive documents (contracts, invoices with payment info) must have restricted sharing — specific people only, not "anyone with the link"
- Credentials and passwords: **never stored in Drive** — use 1Password or Bitwarden exclusively
- Monthly Drive audit: check for orphaned files, stale sharing permissions, and storage usage

## Future Enhancements

- Automated folder creation on new project start (triggered by Stripe deposit webhook)
- Document templates stored in Notion with auto-population via CRM data
- Digital signature integrated into client portal (no third-party tool required)
- AI document review: flag contracts missing required sections before sending
