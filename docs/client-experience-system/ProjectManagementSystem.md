# Project Management System
## Roman Creative Studio — Phase 6, Document 4

---

### Purpose

The Project Management System is the internal backbone that keeps every project on track, on time, and on scope. It defines how work is organized, tracked, and reported — ensuring nothing falls through the cracks and the client always knows the current status.

**Rule:** Every project has visible progress tracking from day one.

---

## Section 1 — Project Management Tool

### Recommended: Notion (Primary) or Linear / Trello (Alternative)

RCS uses a consistent project management structure regardless of tool. The tool is secondary to the system.

**Each project workspace contains:**
```
Project Folder Structure:

/[Client Name] — [Project Name]
  /1-Discovery
    Kickoff call notes
    Questionnaire responses
    Research notes
  /2-Strategy
    Site map
    Content outline
    SEO keyword map
    Strategy document (v1, v2, approved)
  /3-Design
    Wireframes
    Design mockups (v1, v2, approved)
    Design feedback log
  /4-Development
    Build notes
    Staging link
    Integration notes
  /5-QA
    QA checklist
    Bug log
    Resolution notes
  /6-Launch
    Launch checklist
    DNS notes
    Go-live confirmation
  /7-Post-Launch
    Training materials
    Client login credentials (secure)
    30-day check-in notes
  /Project Files
    Contract
    Proposal
    Invoices
    All exported deliverable files
```

---

## Section 2 — Milestone System

### 2.1 Defined Project Milestones

Every project has the same named milestones, regardless of scope:

| Milestone | Trigger | Client Notification |
|---|---|---|
| M0: Project Start | Deposit received | Welcome email sent |
| M1: Kickoff Complete | Kickoff call done | Recap email + timeline |
| M2: Research Complete | All assets received | Internal only |
| M3: Strategy Approved | Client approves strategy doc | Strategy delivery email |
| M4: Wireframes Approved | Client approves wireframes | Wireframe delivery email |
| M5: Design Approved | Client approves visual design | Design approval confirmation |
| M6: Development Complete | Staging site ready | Staging delivery email |
| M7: QA Passed | Internal QA 100% complete | Internal only |
| M8: Revisions Complete | Client approves staging | Revision confirmation email |
| M9: Final Approval | Written sign-off received | Launch initiation email |
| M10: Launch | Site live | Go-live confirmation email |
| M11: Training Complete | Training session done | Post-training recap email |
| M12: Retention Start | 30-day check-in | Care Plan offer email |

### 2.2 Milestone Documentation

Every milestone must be documented with:
- Date completed
- Client confirmation (if required)
- Any notes or issues from that phase

This creates a paper trail that protects both RCS and the client.

---

## Section 3 — Task Structure

### 3.1 Task Categories

**Internal tasks** (not visible to client):
- Research and competitive analysis
- Internal design drafts
- Code review
- QA testing
- Documentation

**Client-facing tasks** (require client action):
- Complete questionnaire
- Send assets by [date]
- Review and approve strategy document
- Attend design review call
- Provide consolidated feedback
- Review staging site
- Final approval sign-off
- Training session attendance

### 3.2 Task Format Standard

Every task entry includes:
```
Task:      [Clear, action-oriented title]
Owner:     [Alexander / Client]
Due:       [Specific date — never "this week"]
Status:    [Not Started / In Progress / Waiting / Complete / Blocked]
Notes:     [Any relevant context]
```

---

## Section 4 — Progress Reporting System

### 4.1 Internal Progress Tracking

**Daily:** Review open tasks. Update statuses. Flag anything blocked.

**Weekly:** Review milestone progress. Are we on track for the next client-facing milestone?

**Per milestone:** Document completion, any issues, and client communication sent.

### 4.2 Client-Facing Progress Updates

Clients receive progress communication at milestones — not on a daily or weekly calendar.

**Exception:** If a milestone is delayed by more than 2 business days from the committed date, notify the client proactively before the deadline:

```
Subject: [Project Name] — Timeline Update

Hi [Name],

I wanted to give you an update before [milestone date].

[Honest reason for delay — e.g., "The design phase needed an additional
day to reach the quality standard for your project."]

New milestone date: [Date]

This won't affect the final launch date — [explanation of how buffer
was absorbed] / [or honest acknowledgment if launch shifts].

Appreciate your patience.

Alexander
```

**Rule:** Never let a deadline pass without communicating. Silence after a missed internal deadline damages trust faster than any other event in a project.

---

## Section 5 — Revision Tracking System

Every revision round is logged:

```
REVISION LOG — [Project Name]

Phase: Design
Round: 1
Date received: [Date]
Feedback source: [Client name]
Items submitted: [Number]

Feedback items:
  1. [Item] — Status: [Implemented / Declined / Modified]
  2. [Item] — Status: [Implemented / Declined / Modified]
  ...

Revisions delivered: [Date]
Client confirmation: [Yes / Pending]
```

**Why log declines:** If RCS declines a revision request (out of scope, contradicts strategy, or brand guidelines), that decision is documented with reasoning. This prevents revisiting the same conversation later.

---

## Section 6 — Scope Control System

### 6.1 What Is a Change Order

A change order is required any time the client requests something outside the contracted scope of work.

**Triggers for a change order:**
- Additional pages beyond contracted count
- New features not in the original proposal
- Copywriting (if not included in scope)
- Photography sourcing beyond what was agreed
- Significant redesign after design was approved
- Rush delivery request

### 6.2 Change Order Template

```
CHANGE ORDER REQUEST

Project:         [Name]
Date:            [Date]
Requested by:    [Client Name]
Description:     [Clear description of the additional work]
Impact on scope: [Additional deliverable]
Impact on timeline: [Extension, if any]
Additional investment: $[Amount]

To proceed: Reply "Approved" to this email and
I'll send an updated invoice.
```

**Rule:** No additional work begins until the change order is approved in writing and the additional invoice is paid (or added to the next milestone payment).

---

## Section 7 — Project Health Check

At the midpoint of every project (approximately at design approval), run an internal project health check:

```
PROJECT HEALTH CHECK — [Project Name]

Date:           [Date]
Milestone:      [Current milestone]

Timeline:
  [ ] On track for launch date
  [ ] Slightly behind — buffer available
  [ ] Behind — client notification needed

Scope:
  [ ] Within contracted scope
  [ ] Change order pending: [description]

Client relationship:
  [ ] Positive — communication flowing smoothly
  [ ] Neutral — no major issues
  [ ] Needs attention — [issue description]

Outstanding client actions:
  [ ] All assets received
  [ ] [Pending item] — due: [date]

Risks to flag:
  [Any concern that could affect delivery quality or timeline]
```
