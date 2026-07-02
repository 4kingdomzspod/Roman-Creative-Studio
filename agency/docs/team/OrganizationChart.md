# Organization Chart
# Roman Creative Studio — Team & Leadership Operating System
# Section 1 of 19 | ERD Version 1.0

---

## Purpose

Define the complete organizational hierarchy of Roman Creative Studio — current state and future state — so every team member understands reporting lines, collaboration structures, and decision-making authority at every stage of growth.

**Business Value:** Eliminates confusion about who owns what. Enables hiring decisions to be strategic rather than reactive. Creates a scalable org model before the first hire.

**Owner:** CEO (Alexander Roman)  
**Version:** 1.0  
**Related Documents:** DepartmentStructure.md, RoleDescriptions.md, HiringRoadmap.md, SuccessionPlanning.md

---

## Current State — Stage 1: Solo Founder (2026)

```
┌─────────────────────────────────────────┐
│         ALEXANDER ROMAN                 │
│         Founder & CEO                   │
│                                         │
│  • Strategy & Vision                    │
│  • Client Relationships                 │
│  • Creative Direction                   │
│  • Web Design & Development             │
│  • SEO & Marketing                      │
│  • Sales & Business Development         │
│  • Finance & Operations                 │
│  • Customer Support                     │
└─────────────────────────────────────────┘

Contractors (as needed):
  • Copywriter (project-based)
  • Photographer (project-based)
  • SEO Specialist (overflow)
```

---

## Future State — Stage 2: First Hires (Year 2, $8k+ MRR)

```
                    ┌─────────────────┐
                    │  Alexander Roman │
                    │  CEO / Founder   │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
   ┌────────┴───────┐ ┌──────┴──────┐ ┌──────┴──────┐
   │ Project Manager│ │  Designer   │ │  Developer  │
   │  (Contractor)  │ │ (Part-time) │ │ (Contractor)│
   └────────────────┘ └─────────────┘ └─────────────┘
```

---

## Future State — Stage 3: Small Agency (Year 3, $20k+ MRR)

```
                         ┌──────────────────┐
                         │  Alexander Roman  │
                         │  CEO / Founder    │
                         └────────┬─────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
    ┌─────────┴────────┐ ┌────────┴───────┐ ┌────────┴───────┐
    │  Creative Director│ │    Operations  │ │  Sales/Growth  │
    │  (Full-time)      │ │    Manager     │ │  Manager       │
    └─────────┬────────┘ └────────┬───────┘ └────────────────┘
              │                   │
    ┌─────────┼────────┐ ┌────────┼───────┐
    │         │        │ │        │       │
 ┌──┴──┐  ┌──┴──┐ ┌───┴┐│ ┌──────┴┐ ┌───┴────┐
 │ UI  │  │ UX  │ │Dev ││ │ PM    │ │ Support│
 │ Des │  │ Des │ │(FT)││ │       │ │        │
 └─────┘  └─────┘ └────┘│ └───────┘ └────────┘
                         │
                   ┌─────┴──────┐
                   │ Bookkeeper │
                   │ (Part-time)│
                   └────────────┘
```

---

## Future State — Stage 4: Growing Agency (Year 5, $60k+ MRR)

```
                              ┌──────────────────────┐
                              │    Alexander Roman    │
                              │    CEO & Founder      │
                              └────────────┬──────────┘
                                           │
          ┌──────────────────┬─────────────┼─────────────┬──────────────────┐
          │                  │             │             │                  │
   ┌──────┴──────┐  ┌────────┴──────┐ ┌───┴───────┐ ┌──┴─────────┐ ┌─────┴──────┐
   │   Creative  │  │  Engineering  │ │ Marketing │ │  Finance & │ │ Operations │
   │  Director   │  │  Director     │ │ Director  │ │  Legal     │ │  Director  │
   └──────┬──────┘  └────────┬──────┘ └───┬───────┘ └──┬─────────┘ └─────┬──────┘
          │                  │             │             │                  │
   ┌──────┼──────┐   ┌───────┼───────┐    │          ┌──┴──┐        ┌─────┼──────┐
   │      │      │   │       │       │    │          │ CFO │        │     │      │
  UI    UX   Brand  FE     BE    QA  SEO+Content  (Frac)        PM  Spt  CS
  Des   Des   Des  Dev    Dev   Spec  Writer                    Mgr Spec Spec
```

---

## Future State — Stage 5: National Agency (Year 7–10, $120k+ MRR)

```
                              ┌──────────────────────┐
                              │    Alexander Roman    │
                              │    CEO & Chairman     │
                              └────────────┬──────────┘
                                           │
                              ┌────────────┴──────────┐
                              │    Chief of Staff /   │
                              │    COO                │
                              └────────────┬──────────┘
                                           │
     ┌──────────┬──────────┬──────────┬───┴──────┬──────────┬──────────┐
     │          │          │          │          │          │          │
   CCO        CTO        CMO        CFO        CPO        CLO        CXO
  (Creative) (Tech)  (Marketing) (Finance) (Product)  (Legal)  (Experience)
     │          │          │          │          │
  Design    Engineering  Marketing  Finance  Product
  Team        Team        Team       Team     Team
```

---

## Reporting Relationships

### Decision Authority Matrix

| Decision Type | Stage 1 | Stage 2 | Stage 3 | Stage 4+ |
|--------------|---------|---------|---------|----------|
| Client pricing | CEO | CEO | CEO + Sales | Sales Director |
| Hire/fire | CEO | CEO | CEO | Dept Director + CEO |
| Tool purchases <$100/mo | CEO | CEO | Dept Director | Dept Director |
| Tool purchases >$100/mo | CEO | CEO | CEO | COO |
| Client disputes | CEO | CEO | PM + CEO | Account Manager |
| Creative direction | CEO | Creative Director | Creative Director | CCO |
| Technical architecture | CEO | Developer | Engineering Director | CTO |
| Financial decisions >$1k | CEO | CEO | CEO | CFO + CEO |

---

## Collaboration Model

### Cross-Department Collaboration (Stage 3+)

```
Creative ←──────────────────── Engineering
   │    (design handoff specs)      │
   │                                │
   ▼                                ▼
Marketing ◄───────────── Project Management
   │         (content needs)        │
   │                                │
   ▼                                ▼
 Sales ◄──────────────────── Client Success
         (handoff at close)         │
                                    ▼
                               Finance
                          (invoice triggers)
```

### Communication Channels by Relationship

| Relationship | Primary Channel | Cadence |
|-------------|----------------|--------|
| CEO ↔ Department Directors | 1:1 + Slack | Weekly |
| Director ↔ Team Members | 1:1 + Slack | Weekly |
| Cross-department | Slack #project channels | As needed |
| All-hands | Meeting (video) | Monthly |
| Async updates | Notion/documentation | Daily |

---

## Org Design Principles

1. **Flat until it breaks.** Stay lean. Add management layers only when communication quality degrades.
2. **Player-coaches first.** Early hires do individual work AND contribute to team direction.
3. **Document before you delegate.** Every responsibility must be documented before it's handed off.
4. **No single points of failure.** Every critical function needs backup documentation and cross-training.
5. **Culture first.** The first 5 hires define the culture of the next 50. Choose character over credentials.

---

*Document: OrganizationChart.md | Phase 10 Section 1 | Version 1.0 | 2026-07-01*