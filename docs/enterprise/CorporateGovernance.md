# Corporate Governance — Roman Creative Studio
## Enterprise Operating System | Section 1
**Version:** 1.0
**Last Updated:** 2026-07-01
**Owner:** CEO
**Review Schedule:** Annual (January) + as structure changes
**Dependencies:** EnterpriseVision.md, SuccessionStrategy.md
**Related Documents:** AnnualPlanning.md, OKRFramework.md, CompanyPlaybook.md

---

## Purpose

Define how Roman Creative Studio makes decisions, delegates authority, resolves conflicts, and maintains accountability as the organization grows from a solo founder to a multi-person leadership team.

**Business Value:** Governance prevents the two failure modes of growing companies: (1) founder bottleneck where nothing moves without one person's approval, and (2) uncoordinated autonomy where everyone acts independently with no alignment. Clear governance enables speed with accountability.

---

## Governance Principles

1. **Subsidiarity:** Decisions are made at the lowest level where the decision-maker has the information and authority to decide well.
2. **Transparency:** All significant decisions are documented. The reason for the decision is recorded, not just the outcome.
3. **Accountability:** Every decision has an owner. No committee owns a decision — a person does.
4. **Proportionality:** The governance overhead matches the stakes. A $50 tool purchase does not need CEO approval.
5. **Speed:** Good governance accelerates decisions; it does not slow them down.

---

## Leadership Structure by Stage

### Stage 1: Solo Founder (Current)
```
CEO (Alexander)
│
├── All strategic decisions
├── All financial decisions
├── All client decisions
├── All hiring decisions
└── All product decisions
```
**Note:** All authority is with the founder. The governance documentation exists now so the transition to Stage 2 is smooth, not chaotic.

---

### Stage 2: Founder + Key Contractor/Employee (Year 2)
```
CEO (Alexander)
│
├── Creative Director (design decisions, client creative direction)
├── Lead Engineer (technical decisions, code standards)
└── Operations Manager (process, scheduling, admin)
```

**Delegation in Stage 2:**
- Creative Director: Approves final design deliverables without CEO sign-off for projects under $10k
- Lead Engineer: Approves technical architecture decisions for standard projects
- Operations Manager: Approves vendor tool purchases under $200/mo

---

### Stage 3: Studio Leadership Team (Year 3–4)
```
CEO
│
├── COO (operations, team, process)
│   ├── Operations Manager
│   └── Project Manager(s)
│
├── Creative Director
│   ├── Designers
│   └── Copywriter
│
├── CTO / Lead Engineer
│   ├── Frontend Developers
│   └── Backend Developer
│
├── Chief Marketing Officer
│   └── SEO / Content
│
└── Chief Innovation Officer (part-time/fractional)
    └── Product & AI
```

---

### Stage 4: Company Leadership Team (Year 5–8)
- CEO
- COO (President)
- CFO
- CTO
- CMO
- CPO (Chief Product Officer)
- CIO (Chief Innovation Officer)
- CLO (Chief Legal Officer — fractional)
- CISO (Chief Information Security Officer — fractional)

---

### Future: Board of Directors (Year 5+)

**When to form a Board:** When RCS raises outside capital, seeks acquisition, or exceeds $5M annual revenue.

**Initial Board Composition:**
- Founder/CEO (Chair)
- 1 independent director (operations/scaling expertise)
- 1 independent director (creative/brand expertise)
- 1 independent director (technology/SaaS expertise)
- 1 independent director (finance/investment expertise)

**Board Responsibilities:**
- Annual strategy review and approval
- CEO performance evaluation
- Major financial decisions (>$500k)
- M&A approval
- Equity and compensation policy

**Board Meeting Cadence:** Quarterly (2 hours) + Annual retreat (full day)

---

## Strategic Committees

As team grows, working committees handle domain-specific governance:

### Leadership Committee (Stage 3+)
**Members:** CEO + all department heads
**Cadence:** Monthly (90 minutes)
**Decisions:** Company OKRs, hiring approvals, major vendor decisions, policy changes

### Financial Committee (Stage 3+)
**Members:** CEO + CFO + COO
**Cadence:** Monthly (60 minutes)
**Decisions:** Budget variances, investment approvals, pricing changes, compensation adjustments

### Technical Architecture Committee (Stage 3+)
**Members:** CTO + Lead Engineers + CPO
**Cadence:** Quarterly (2 hours)
**Decisions:** Tech stack changes, security policies, infrastructure investments

### Innovation Committee (Stage 3+)
**Members:** CEO + CIO + CPO
**Cadence:** Monthly (60 minutes)
**Decisions:** New product approvals, experiment budget, R&D investments

---

## Authority Matrix

### Financial Authority

| Decision | Stage 1 | Stage 2 | Stage 3 | Stage 4 |
|----------|---------|---------|---------|---------||
| Tool/software < $100/mo | CEO | Dept Head | Dept Head | Dept Head |
| Tool/software $100–$500/mo | CEO | CEO | COO | COO |
| Tool/software > $500/mo | CEO | CEO | CEO | CFO + CEO |
| Contractor/vendor < $5k | CEO | CEO | COO | COO |
| Contractor/vendor $5k–$25k | CEO | CEO | CEO | CFO |
| Contractor/vendor > $25k | CEO | CEO | CEO | Board |
| Hiring (any) | CEO | CEO | CEO + COO | COO |
| Salary adjustment | CEO | CEO | CEO | CFO + CEO |
| Investment/CapEx > $10k | CEO | CEO | CEO | Board |
| Pricing changes | CEO | CEO | CEO | CEO |

### Operational Authority

| Decision | Stage 1 | Stage 2 | Stage 3 |
|----------|---------|---------|--------|
| Project scope change < 10% | CEO | PM | PM |
| Project scope change 10–25% | CEO | CEO | Account Manager |
| Project scope change > 25% | CEO | CEO | CEO |
| Client discount up to 10% | CEO | Account Manager | Account Manager |
| Client discount > 10% | CEO | CEO | CEO |
| Deadline extension (client) | CEO | PM | PM |
| Contractor onboarding | CEO | COO | HR/COO |
| Client termination | CEO | CEO | CEO |
| Policy exceptions | CEO | CEO | CEO |

### Creative Authority

| Decision | Stage 2 | Stage 3 |
|----------|---------|---------|
| Design direction (client) | Creative Director | Creative Director |
| Brand standards deviation | CEO | CEO |
| Portfolio case study approval | CEO | CEO + CMO |
| External design collaboration | CEO | Creative Director |

---

## Decision Documentation Standard

All decisions at the COO level or above must be documented in the Decision Log (Notion database).

**Decision Log Entry Format:**
```
Date: [date]
Decision: [what was decided — one sentence]
Context: [why this decision was needed]
Options Considered: [2–3 alternatives evaluated]
Rationale: [why this option was chosen]
Owner: [who is accountable for execution]
Review Date: [when to assess if decision was correct]
Outcome: [filled in at review date]
```

**What goes in the Decision Log:**
- Vendor changes
- Pricing changes
- Hiring decisions
- Technology stack changes
- Service offering changes
- Policy changes
- Major client decisions

**What does not need the Decision Log:**
- Routine project tasks
- Day-to-day communication
- Tool configuration

---

## Escalation Process

### When to Escalate

Escalate to the next authority level when:
- A decision exceeds your authority threshold (see Authority Matrix)
- A decision has significant risk or irreversibility
- You and a peer cannot reach agreement
- A decision affects another department significantly
- A client is dissatisfied at a level you cannot resolve

### Escalation Path

```
Team Member
    ↓ (if stuck)
Department Head
    ↓ (if stuck)
COO
    ↓ (if stuck or financial)
CEO
    ↓ (if major financial/legal/strategic)
Board (Stage 4+)
```

### Escalation SLA
- Team → Dept Head: Response within 4 business hours
- Dept Head → COO: Response within 8 business hours
- COO → CEO: Response within 24 business hours
- Emergency (client, legal, security): CEO response within 2 hours

---

## Governance Calendar

| Cadence | Meeting | Participants | Duration |
|---------|---------|--------------|----------|
| Weekly | Leadership Standup | All dept heads | 30 min |
| Monthly | Leadership Review | CEO + dept heads | 90 min |
| Monthly | Financial Review | CEO + CFO/COO | 60 min |
| Quarterly | OKR Review | Leadership team | 2 hours |
| Quarterly | Board Meeting (Stage 4+) | Board + CEO | 2 hours |
| Annual | Strategic Planning | Leadership team | 2 days |
| Annual | Culture & Values Review | All hands | 2 hours |

---

## Conflict Resolution

### Peer-Level Conflict (between department heads)
1. Direct conversation first — 48 hours to resolve
2. Joint session with COO if unresolved
3. CEO final decision if still unresolved
4. All resolutions documented in Decision Log

### Performance Conflict
- Follow PerformanceReviews.md process
- No performance action is taken without documentation
- Final decisions require COO + CEO agreement

### Client Conflict
- Follow client communication standards in CommunicationStandards.md
- Legal escalation requires CEO approval
- No legal threats issued without CLO consultation

---

## Corporate Entity & Legal Structure

### Current Structure (Stage 1)
- Business type: [LLC / Sole Proprietorship — update as appropriate]
- State of formation: [State]
- EIN: [Secured]
- Business bank: [Separate business account]
- Accounting method: [Cash basis, transitioning to accrual at $250k revenue]

### Recommended Transitions
| Revenue Milestone | Legal Action |
|-------------------|--------------|
| First dollar | Form LLC, open business bank account |
| $50k/year | File S-Corp election (if beneficial) |
| $250k/year | Switch to accrual accounting, hire CPA |
| $1M/year | Corporate counsel on retainer |
| $5M/year | Consider C-Corp for investment/acquisition readiness |

---

## Future Improvements

- Formal governance policy document (reviewed by attorney) by Year 3
- Board charter document by Year 5
- Corporate secretary role by Year 4 (ensures governance records are maintained)
- Annual governance audit by Year 3
- D&O insurance review by Year 3
