# Knowledge Base
# Roman Creative Studio — Team & Leadership Operating System
# Section 13 of 19 | ERD Version 1.0

---

## Purpose

Define the structure, standards, and ownership of Roman Creative Studio's Knowledge Base — ensuring that every process, tool, workflow, and system is documented so no single person's absence can disrupt business operations.

**Business Value:** Tribal knowledge is a liability. Every undocumented process is a single point of failure. The Knowledge Base is the institutional memory of RCS — it grows stronger with every new hire and every completed project.

**Owner:** CEO / Operations Manager  
**Version:** 1.0  
**Related Documents:** Training.md, CommunicationStandards.md, Onboarding.md, SuccessionPlanning.md

---

## Knowledge Base Principles

1. **If you did it more than once, document it.** Any repeating task deserves a written process.
2. **Document for a new hire.** Write as if someone starting tomorrow has no context.
3. **Ownership is mandatory.** Every document has an owner. Ownerless docs rot.
4. **Version everything.** Mark when documents were updated and what changed.
5. **Dead docs are worse than no docs.** Outdated documentation actively misleads. Review and update quarterly.
6. **Link aggressively.** Documents should reference related documents. No knowledge should exist in isolation.

---

## Knowledge Base Structure (Notion)

```
Roman Creative Studio — Knowledge Base
├── 🏢 Company
│   ├── Mission, Vision, Values
│   ├── Brand Guide & Voice
│   ├── Company History & Story
│   └── Contact Directory
├── 💼 Services
│   ├── Service Tier Definitions (BUILD / GROW / SCALE)
│   ├── Care Plan Definitions
│   ├── Pricing Guide (internal)
│   └── Service Delivery Checklists
├── 👥 Team
│   ├── Org Chart (current)
│   ├── Role Descriptions
│   ├── Employee Files (private)
│   └── Contractor Directory
├── 📝 Processes
│   ├── Sales Process
│   ├── Project Delivery Process
│   ├── Care Plan Delivery Process
│   ├── Onboarding Process
│   ├── Offboarding Process
│   ├── Invoicing & Collections Process
│   └── Hiring Process
├── 🔧 Tools
│   ├── Tool Stack Overview
│   ├── Slack Guide
│   ├── Figma Workflow
│   ├── GitHub Workflow
│   ├── HubSpot CRM Guide
│   ├── Stripe Guide
│   ├── MailerLite Guide
│   ├── Notion Guide
│   └── Calendly Setup Guide
├── 📈 Financial
│   ├── Budget
│   ├── Software Costs
│   ├── Revenue Model
│   └── Cash Flow Tracker
├── 🎨 Design
│   ├── Design System Documentation
│   ├── Figma File Structure Guide
│   ├── Design QA Checklist
│   ├── Accessibility Standards
│   └── Brand Asset Library
├── 💻 Development
│   ├── Code Standards
│   ├── Git Workflow
│   ├── Deployment Process
│   ├── Security Standards
│   └── Performance Checklist
├── 📣 Marketing
│   ├── Content Calendar
│   ├── SEO Playbook
│   ├── Email Templates
│   └── Lead Magnet Library
└── 📁 Archive
    └── Outdated docs (dated, not deleted)
```

---

## Document Template Standard

Every document in the Knowledge Base must include these fields:

```markdown
# Document Title

**Purpose:** One sentence describing what this document is and why it exists.
**Owner:** Name of person responsible for keeping it accurate.
**Last Updated:** YYYY-MM-DD
**Version:** X.X
**Related Documents:** Links to 2-5 related docs

---
[Document content here]

---
*Future Improvements: Notes on what this document still needs.*
```

---

## Process Documentation Standard

Every process document must include:

1. **Trigger:** What starts this process? (new client signed, invoice sent, etc.)
2. **Owner:** Who is responsible for this process?
3. **Steps:** Numbered, specific, actionable
4. **Decision points:** If X, do Y. If not X, do Z.
5. **Tools used:** Which tools are involved at each step?
6. **Output:** What does success look like? What is produced?
7. **Common errors:** What goes wrong most often and how to avoid it.

---

## Knowledge Base Ownership Model

| Department | KB Owner | Backup Owner |
|-----------|----------|--------------|
| Company / Culture | CEO | Operations Manager |
| Sales Process | CEO / Sales Manager | Account Manager |
| Design Standards | Creative Director | Senior Designer |
| Development Standards | Engineering Director | Senior Developer |
| Finance | Finance Manager | CEO |
| Marketing | Marketing Manager | CEO |
| Operations | Operations Manager | CEO |
| Client Success | Account Manager | CEO |

**Owner responsibilities:**
- Review all docs in their section quarterly
- Update docs within 5 business days of process change
- Archive outdated docs (never delete)
- Train new hires on their section during onboarding

---

## Documentation Debt Policy

**Documentation Debt** = processes that exist but are not documented.

**Anti-tribal knowledge rule:** No team member should be the sole source of knowledge for any process. If someone were to leave tomorrow, could we continue without them?

**Quarterly documentation audit:**
1. List every repeating task done in the quarter
2. Check each against the Knowledge Base
3. If undocumented: add to a 2-week documentation sprint
4. Assign owner and due date to each gap

**New hire contribution:** Every new hire is required to document at least 1 process that was explained to them verbally during their first 30 days. "If you had to explain it to someone, write it down."

---

## Knowledge Base Review Cadence

| Review | Cadence | Owner | Action |
|--------|---------|-------|--------|
| Quick scan | Weekly | Section owners | Flag any obviously outdated pages |
| Section review | Quarterly | Section owners | Verify accuracy, update version |
| Full KB audit | Annual | Operations Manager + CEO | Remove dead pages, fill gaps, restructure if needed |

---

## Tool Documentation Format

Every tool in the stack gets its own documentation page:

```markdown
# [Tool Name] Guide

**What it does:** Brief description
**Who uses it:** Role(s)
**Access:** How to get access
**Cost:** Monthly cost
**Owner:** Who manages this tool at RCS

## Setup
[Step-by-step setup instructions]

## How We Use It
[RCS-specific workflow, not the tool's generic tutorial]

## Common Tasks
- How to do [task 1]
- How to do [task 2]

## Troubleshooting
- [Problem]: [Solution]

## Alternatives Considered
[Why we chose this tool over X]
```

---

*Document: KnowledgeBase.md | Phase 10 Section 13 | Version 1.0 | 2026-07-01*
