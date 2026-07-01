# Experiment Framework — Roman Creative Studio
## Innovation Lab | Section 9B
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Owner:** Chief Innovation Officer  
**Status:** Active

---

## Overview

The RCS Experiment Framework is the structured process for testing new ideas before committing full resources. It answers the question: "How do we try new things without breaking what works?"

**Principle:** Every significant new initiative starts as an experiment, not a commitment. An experiment has a defined hypothesis, success criteria, timeline, and budget. If it doesn't prove itself, we stop — without guilt or sunk cost bias.

**Budget:** Year 1 experiment budget = $500/quarter + 10% of CEO time (4 hrs/week).

---

## Experiment Types

### Type 1: Idea Validation Experiment
**Purpose:** Test whether a problem exists and whether people will pay to solve it  
**Duration:** 2–4 weeks  
**Cost:** <$100 (survey tools, landing page)

**Process:**
1. Write hypothesis: "We believe [audience] has [problem] and will pay [price] for [solution]"
2. Define validation criteria: "We'll know this is true if [metric] happens within [timeframe]"
3. Build minimum test (landing page, waitlist, survey, or 5 customer interviews)
4. Run test
5. Evaluate: pass/fail/inconclusive
6. Document and decide: proceed to prototype, pivot, or kill

---

### Type 2: Prototype Experiment
**Purpose:** Build the minimum version of a product/service to get real user feedback  
**Duration:** 4–8 weeks  
**Cost:** $100–$500 (tools, hosting, design time)

**Process:**
1. Validated hypothesis from Type 1
2. Define prototype scope (what's the minimum that tests the core assumption?)
3. Build prototype (internal tools, Webflow/Notion MVP, or coded prototype)
4. Recruit 5–10 beta users
5. Observe usage, gather feedback
6. Evaluate against success criteria
7. Decide: proceed to v1, pivot feature set, or kill

---

### Type 3: Market Experiment
**Purpose:** Test pricing, positioning, and sales process for a new offering  
**Duration:** 4–8 weeks  
**Cost:** $200–$1,000 (ads, content, landing page)

**Process:**
1. Define offer precisely (what exactly, for whom, at what price)
2. Build sales landing page
3. Drive qualified traffic (organic content, small paid budget, or partnerships)
4. Measure: conversions, CAC, feedback from non-converters
5. Evaluate against success criteria
6. Decide: launch, iterate positioning, or kill

---

### Type 4: Operational Experiment
**Purpose:** Test a new internal process, tool, or workflow  
**Duration:** 2–4 weeks  
**Cost:** Minimal (time only)

**Process:**
1. Define current state and hypothesis for improvement
2. Implement new process on 1–2 projects (not all at once)
3. Measure: time saved, quality, team satisfaction, client satisfaction
4. Compare to baseline
5. Decide: adopt, refine, or revert

---

## Experiment Template

Every experiment must be documented using this template before starting:

```markdown
# Experiment: [Name]

**Date Started:** [date]
**Type:** [Validation / Prototype / Market / Operational]
**Owner:** [name]
**Budget:** $[amount] + [hours]
**Decision Date:** [date — when we decide go/no-go]

## Hypothesis
"We believe that [specific audience] has [specific problem/need] and will [take specific action — pay, sign up, use] [specific solution] because [reason we believe this is true]."

## Success Criteria
This experiment succeeds if:
- Primary: [measurable outcome — e.g., 20 waitlist signups, 5 paying customers, 30% time reduction]
- Secondary: [supporting evidence]

This experiment fails if:
- [opposite of success — clear fail signal]

## What We're Building / Testing
[Describe exactly what we're building or testing. What's in scope? What's out?]

## Timeline
| Week | Activities |
|------|------------|
| Week 1 | [tasks] |
| Week 2 | [tasks] |

## Resources Required
- Tools: [list]
- Team time: [hours per person]
- External costs: $[amount]

## Results
[Filled in after experiment completes]

**Primary metric result:** [number]
**Pass / Fail / Inconclusive:** [verdict]

**Key learnings:**
1. [learning]
2. [learning]

**Decision:** [Proceed / Pivot / Kill] + rationale
```

---

## Active Experiments Log

| Experiment | Type | Owner | Start Date | Decision Date | Status |
|------------|------|-------|------------|----------------|--------|
| Local Business Website Grader (SAAS-03) | Validation | CIO | Month 10 | Month 11 | Planned |
| Accessibility Monitor MVP (SAAS-02) | Validation | CIO | Month 12 | Month 13 | Planned |
| Prompt Library Product (PROD-01) | Market | CIO | Month 7 | Month 9 | Planned |
| Agency Creator Membership | Market | CIO | Month 10 | Month 14 | Planned |

---

## Decision Rules

### When to Run an Experiment
- Before building any new product or service that requires >40 hours of work
- Before changing pricing on existing offerings
- Before entering a new market or niche
- Before adopting a new technology for client work
- Before hiring for a new role

### When to Kill an Experiment
- Clear fail signal on primary metric
- Evidence that the assumption was wrong (not just execution was weak)
- Cost is exceeding budget by >50% without compelling counter-evidence
- Team consensus that continuing is sunk-cost bias, not evidence-based conviction

### When to Pivot an Experiment
- Primary metric fails but secondary evidence is compelling
- Customer interviews reveal a different, better problem to solve
- Audience is wrong but the solution is right (or vice versa)

### When to Proceed
- Primary success criteria met
- Team has conviction based on evidence, not just enthusiasm
- Clear path from experiment to v1 (resources, timeline, ownership)

---

## Experiment Portfolio Rules

- **Maximum active experiments:** 2 at one time (CEO can only properly run 2)
- **Minimum rest between experiments:** 2 weeks (reflection + documentation)
- **Maximum budget per experiment:** $1,000 without CEO + COO sign-off
- **Kill threshold:** If primary metric is <50% of target at midpoint, evaluate kill immediately

---

## Learning Loop

Every experiment, regardless of outcome, generates organizational learning. This learning is only valuable if it's documented and shared.

**Post-Experiment Review (1 hour meeting):**
1. What did we learn? (3–5 key learnings)
2. What did we expect vs. what happened? (hypothesis review)
3. What would we do differently? (process improvement)
4. What does this mean for other experiments or ideas?
5. Update relevant documents (ProductRoadmap.md, SaaSIdeas.md, research notes)

**Documentation:** Completed experiments archived in Notion Research Lab database.

---

## Experiment Budget Tracker

| Quarter | Budget | Spent | Remaining |
|---------|--------|-------|----------|
| Q1 2026 | $500 | TBD | TBD |
| Q2 2026 | $500 | TBD | TBD |
| Q3 2026 | $500 | TBD | TBD |
| Q4 2026 | $500 | TBD | TBD |
| **Year 1 Total** | **$2,000** | | |

Year 2 experiment budget increases to $1,000/quarter as agency revenue grows.

---

## Integration with Research Lab

Experiments are the action layer of the Research Lab. The flow:

```
Research Lab → Idea Backlog → Innovation Score (15+) → Experiment Framework → Decision
```

No idea goes directly from research to full build. The experiment framework is the mandatory filter.

**Exception:** Operational improvements with <8 hours of implementation cost can skip the formal experiment process. Use judgment.
