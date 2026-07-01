# Knowledge Management — Roman Creative Studio
## Enterprise Operating System | Section 5
**Version:** 1.0
**Last Updated:** 2026-07-01
**Owner:** COO + Documentation Lead
**Review Schedule:** Quarterly (audit); Annual (full review)
**Dependencies:** CompanyPlaybook.md
**Related Documents:** KnowledgeBase.md (docs/team/), QualityManagement.md

---

## Purpose

Ensure that all critical operational knowledge at Roman Creative Studio is documented, organized, findable, owned, and maintained — so that no critical knowledge exists only in one person's memory.

**Business Value:** Knowledge that lives only in people's heads leaves with those people. Every time a team member or contractor departs and takes undocumented knowledge with them, the company pays again to relearn it. This framework makes the organization smarter than any individual.

---

## Knowledge Management Principles

1. **Document before departing:** Any completed process, decision, or system is documented before the person who did it moves on.
2. **Written beats verbal:** If it was communicated verbally, it gets documented. Verbal-only decisions create confusion.
3. **Findability matters:** A document that can't be found is a document that doesn't exist.
4. **Ownership is mandatory:** Every document has a named owner responsible for keeping it current.
5. **Living documents:** Documentation is never "done." It evolves with the business.
6. **Just enough detail:** Documents should be detailed enough for a capable person to execute without the original author. No more.

---

## Knowledge Taxonomy

### Tier 1: Institutional Knowledge (Strategic)
The "why" and "what" of the company.
- Mission, vision, values
- Strategic plans
- Brand standards
- Pricing philosophy
- Client relationship principles
- Non-negotiables

**Home:** GitHub docs/ repository (permanent, version-controlled)

---

### Tier 2: Operational Knowledge (Process)
The "how" of getting work done.
- Service delivery SOPs
- Project management processes
- Client onboarding and offboarding
- Financial processes
- HR processes
- Technology runbooks

**Home:** Notion (Operations Hub) + GitHub docs/ for permanent standards

---

### Tier 3: Project Knowledge (Contextual)
Information specific to a client, project, or engagement.
- Client discovery notes
- Project briefs and proposals
- Meeting notes
- Design decisions and rationale
- Technical implementation notes
- Feedback and revision history

**Home:** Notion (per-client workspace) + GitHub (per-project repo)

---

### Tier 4: Reference Knowledge (External)
External information we've curated for recurring use.
- Technology documentation bookmarks
- Industry research
- Competitive intelligence
- Legal and compliance references
- Design inspiration
- Vendor documentation

**Home:** Notion (Research Lab) + Browser bookmarks organized

---

## Documentation Standards

### Required Fields for Every Document
```
# Document Title
## Section / Area
**Version:** [N.N]
**Last Updated:** [date]
**Owner:** [name or role]
**Review Schedule:** [frequency]
**Dependencies:** [what must exist for this to work]
**Related Documents:** [cross-references]
```

### Document Quality Standards
- **Title:** Clear, specific, searchable
- **Purpose:** First section states why this document exists in 1–2 sentences
- **Length:** As long as needed, as short as possible
- **Steps:** Numbered, action verbs, one action per step
- **Screenshots/diagrams:** Used where words are insufficient
- **Last updated:** Always current (stale date = unreliable document)
- **Owner:** Always named (no orphaned documents)

### Version Control
- Major version (1.0 → 2.0): Significant restructure or strategic change
- Minor version (1.0 → 1.1): Additions, corrections, improvements
- Patch (1.1 → 1.1.1): Typo fixes, minor clarifications
- Changes to docs/ in GitHub are version-controlled automatically via Git
- Notion documents: manually update version field; note changes in document footer

---

## Naming Standards

### File Naming (GitHub docs/)
```
PascalCase for document names:
- ServiceDelivery.md (process docs)
- ClientOnboarding.md (process docs)
- Q3-2026-OKRs.md (time-specific docs)
- RiskManagement.md (framework docs)
```

### Notion Page Naming
```
[EMOJI] [Title] — kept consistent within each workspace area
Example:
📊 Revenue Dashboard
👤 Team Directory
📁 Client Projects
🔐 Security & Compliance
```

### GitHub Repository Naming
```
kebab-case for repos:
- roman-creative-studio (main site)
- rcs-client-portal (portal app)
- rcs-admin-dashboard (admin app)
- client-[client-slug]-website (client repos)
```

---

## Documentation Ownership Model

| Knowledge Area | Primary Owner | Secondary | Review Freq |
|----------------|--------------|-----------|-------------|
| Company strategy & vision | CEO | COO | Annual |
| Financial processes | CFO/CEO | COO | Quarterly |
| Service delivery SOPs | COO | Department Heads | Semi-annual |
| Technology runbooks | CTO | Lead Engineers | Quarterly |
| HR & team policies | COO | HR Director | Annual |
| Client processes | COO | Account Manager | Semi-annual |
| Brand standards | Creative Director | CEO | Annual |
| Security policies | CISO | CTO | Annual |
| Privacy policies | CISO | CEO | Annual |
| Product docs | CPO | CIO | Quarterly |
| Innovation docs | CIO | CPO | Semi-annual |

---

## Knowledge Architecture (Full Notion Structure)

```
RCS Knowledge Hub
├── 🏗️ Company Foundation
│   ├── Mission, Vision, Values
│   ├── Brand Standards
│   ├── Company Playbook (index)
│   └── Decision Log
│
├── 💼 Operations
│   ├── Service Delivery
│   ├── Project Management
│   ├── Client Processes
│   └── Vendor & Tools
│
├── 💰 Finance
│   ├── Revenue Tracking
│   ├── Expense Tracking
│   ├── Financial Reports
│   └── Tax & Compliance
│
├── 👥 Team
│   ├── Team Directory
│   ├── Onboarding
│   ├── Performance
│   └── Recognition
│
├── 🎨 Client Projects
│   ├── [Per-client databases]
│   ├── Project Templates
│   └── Case Studies
│
├── 🔒 Security & Compliance
│   ├── Security Policies
│   ├── Privacy
│   ├── Incident Log
│   └── Compliance Tracker
│
├── 💡 Innovation & Product
│   ├── Research Lab
│   ├── Experiment Tracker
│   ├── Product Pipeline
│   └── Prompt Library
│
├── 📈 Planning
│   ├── Annual Plans
│   ├── Quarterly OKRs
│   └── Strategic Documents
│
└── 📖 Reference
    ├── Industry Research
    ├── Competitive Intelligence
    └── External Resources
```

---

## Anti-Tribal Knowledge Policy

**Tribal knowledge** is information that exists only in one person's memory. It is a liability.

**Triggers that require documentation:**
- "I always do it this way" — document the way
- "You have to know to check X" — document the check
- "Only I know the password to Y" — store in password manager
- "I just remember that for client Z" — document client context
- "Ask me when you need to do that" — write it down instead

**Monthly Tribal Knowledge Hunt:**
At monthly team meeting: "Name one thing you know that isn't documented."
Anyone who names something creates the documentation within 7 days.

---

## Documentation Review Schedule

| Document Type | Review Frequency | Trigger |
|---------------|-----------------|----------|
| Strategic docs (vision, values) | Annual | January |
| Financial processes | Quarterly | Quarter start |
| Service delivery SOPs | Semi-annual | January + July |
| Technology runbooks | Quarterly | Quarter start |
| HR policies | Annual | January |
| Security policies | Annual + on incident | January + event |
| Client-facing docs | Annual | January |
| Product docs | Quarterly | Quarter start |

---

## Documentation Debt

**Documentation debt** = important processes that aren't yet documented.

**Tracking:**
- Documentation debt logged in Notion: "Documentation Backlog"
- Each item: what needs documenting, owner, priority, due date
- Priority 1: Processes that affect clients or revenue if undocumented
- Priority 2: Processes that affect team effectiveness
- Priority 3: Nice-to-have reference material

**Resolution Target:** Zero Priority 1 and Priority 2 documentation debt at all times.

---

## Searchability Standards

A document that can't be found might as well not exist.

**In Notion:**
- Every document has meaningful title (not "Notes from call")
- Tags/properties applied consistently
- Use Notion search with full-text search
- Index page in each workspace section

**In GitHub docs/:**
- README.md in each subdirectory listing all documents
- PascalCase naming for predictability
- Git history provides version search

---

## Future Improvements

- Documentation health score (% of processes documented) tracked quarterly by Year 2
- AI-powered internal search across Notion + GitHub by Year 3
- Documentation automation (meeting notes → Notion auto-drafts) by Year 2
- Public-facing knowledge base (help center) for clients by Year 3
- Documentation contribution tracked in performance reviews by Year 2
