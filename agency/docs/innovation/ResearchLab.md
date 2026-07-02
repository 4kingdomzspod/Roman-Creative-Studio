# Research Lab — Roman Creative Studio
## Innovation Lab | Section 9
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Owner:** Chief Innovation Officer  
**Status:** Active

---

## Overview

The RCS Research Lab is the structured process by which we monitor, evaluate, and selectively adopt emerging technologies, design trends, business models, and industry shifts. Research is not optional — it is how we maintain relevance and competitive advantage.

**Research Mission:** Know what's coming before our clients need to ask about it. Be the agency that introduces solutions, not the one that reacts to client demands.

**Time Budget:** CEO allocates 2 hours/week to Research Lab activities in Year 1. This grows proportionally with team size.

---

## Research Domains

### Domain 1: AI & Automation
**Relevance:** Directly impacts our services, our tools, and our competitive position.

**Key Questions:**
- What AI capabilities are emerging that we should integrate into services?
- Which current manual processes can be automated this quarter?
- What AI tools could we build that our clients need?
- How are competitors using AI, and what does that mean for our positioning?

**Monitoring Sources:**
- Anthropic blog and model release notes
- OpenAI developer changelog
- Google AI research blog
- Simon Willison's blog (simonwillison.net)
- The Batch (deeplearning.ai newsletter)
- AI Twitter/X: Yann LeCun, Andrej Karpathy, Swyx
- Hacker News (top AI threads)

**Monthly Output:** AI Trends Brief (1 page, internal)

---

### Domain 2: Web Standards & Browser APIs
**Relevance:** We build websites. Web standards directly affect what we can build and how we build it.

**Key Questions:**
- What new CSS features are landing in browsers?
- Which JavaScript APIs reduce our need for third-party dependencies?
- What's shipping in Chrome, Firefox, Safari that changes our approach?
- What deprecations are coming that affect existing client sites?

**Monitoring Sources:**
- web.dev (Google)
- MDN Web Docs changelog
- Chrome Developer blog
- Safari Release Notes
- CSS-Tricks
- Smashing Magazine
- Browser compatibility: caniuse.com
- State of CSS / State of JS surveys (annual)

**Monthly Output:** Web Standards Watch (brief internal note)

---

### Domain 3: SEO & Search
**Relevance:** SEO is a core service offering and client value driver.

**Key Questions:**
- What algorithm updates has Google announced or confirmed?
- How is AI affecting search (Google AI Overviews, Perplexity, etc.)?
- What ranking factors are gaining/losing importance?
- What content formats are performing better or worse?

**Monitoring Sources:**
- Google Search Central blog
- Search Engine Journal
- Search Engine Land
- Barry Schwartz (rustybrick on X)
- Ahrefs blog
- Semrush Sensor (algorithm change monitoring)
- Marie Haynes newsletter

**Monthly Output:** SEO Intelligence Update (internal)

---

### Domain 4: Design Trends
**Relevance:** Design trends affect what clients expect, what converts, and how we differentiate.

**Key Questions:**
- What visual design directions are emerging in premium service businesses?
- What UI patterns are users now expecting (based on iOS, popular apps)?
- What design approaches are becoming overused and should be retired?
- What's working in high-converting landing pages right now?

**Monitoring Sources:**
- Awwwards (daily)
- Dribbble (weekly)
- Behance (weekly)
- Mobbin (mobile patterns)
- Lapa Ninja (landing pages)
- Dark Mode Design
- Refero.design
- Design newsletters: TLDR Design, Dense Discovery

**Monthly Output:** Design Trends Folder (Figma board with 10–20 reference images + notes)

---

### Domain 5: Agency Business Models
**Relevance:** We are building an agency business — we should track how successful agencies evolve.

**Key Questions:**
- What pricing models are other creative agencies experimenting with?
- What productized service models are generating the most revenue?
- What niches are becoming over-served vs. underserved?
- What hiring and team structures are working for agencies our size?

**Monitoring Sources:**
- Brennan Dunn (Double Your Freelancing)
- Agency research newsletters
- SPI Pro community
- The Agency Collective
- Web Design Business podcast
- Twitter/X: agency owner accounts
- Annual surveys: Agency Benchmarks, Orbit Media

**Monthly Output:** Agency Model Notes (quick bullets in Research Notion database)

---

### Domain 6: Accessibility & Compliance
**Relevance:** Accessibility is a core differentiator and legal requirement for clients.

**Key Questions:**
- What WCAG updates are coming (WCAG 2.2, WCAG 3.0)?
- What ADA lawsuit trends should clients know about?
- What assistive technology updates affect our implementation?
- What new accessibility tools and testing methods are available?

**Monitoring Sources:**
- W3C Web Accessibility Initiative (WAI)
- A11y Project
- Adrian Roselli's blog
- Deque blog
- Level Access blog
- ADA Title III case tracker

**Monthly Output:** Accessibility Updates (brief internal note)

---

## Research Infrastructure

### Notion Research Database

Structure:
```
Research Lab
├── Active Research Threads
├── Idea Backlog (unscored)
├── Scored Ideas (Innovation Decision Matrix)
├── Monthly Briefs Archive
├── Competitive Intelligence
├── Tool Evaluations
└── Experiments (link to ExperimentFramework.md)
```

### RSS & Newsletter Stack
| Category | Tool | Frequency |
|----------|------|----------|
| News aggregation | Feedly (or Readwise Reader) | Daily (15 min) |
| Newsletters | Dedicated email inbox | Weekly review |
| Social monitoring | X/Twitter lists by domain | Daily (10 min) |
| Podcast | Pocket Casts | Weekly commute |

### Weekly Research Ritual (2 hours)
- Monday: Scan RSS + newsletters (30 min)
- Wednesday: Deep read on 1 topic (45 min)
- Friday: Log notes to Research Notion database (15 min)
- Weekly: Update Design Trends Figma board (30 min)

---

## Competitive Intelligence

### Competitors to Monitor

**Direct Competitors (same niche, similar market):**
- 3–5 regional web design agencies
- Identified by: client referrals, Google local search, LinkedIn

**Aspirational Competitors (where we want to be):**
- Refinery29, Fantasy, Work & Co (high-end creative agencies)
- Focus: Pricing, positioning, case study quality

**Indirect Competitors (DIY solutions):**
- Squarespace, Wix, Webflow (DIY website builders)
- Focus: What they're adding, pricing changes, market positioning

### What to Track per Competitor
- Services offered and pricing (if public)
- Case studies and portfolio work
- Hiring (LinkedIn job postings — reveals strategy)
- Content and thought leadership
- Technology stack (Wappalyzer)
- Client reviews (Google, Clutch)

### Competitive Intelligence Cadence
- Monthly: Quick scan of competitor websites and social
- Quarterly: Deep review — pricing, positioning, case studies
- Annual: Competitive landscape report (1 page)

---

## Research to Action Pipeline

```
Research Signal
      ↓
Log to Notion Research Database
      ↓
Weekly: Is this relevant enough to act on?
      ↓
  Yes: Add to Idea Backlog
  No: Archive
      ↓
Idea Backlog Review (Monthly)
      ↓
Score with Innovation Decision Framework
      ↓
  Score 15+: Move to Active Experiment
  Score 10-14: Watch List
  Score <10: Deprioritize
      ↓
Experiment (see ExperimentFramework.md)
      ↓
Adopt / Reject / Iterate
```

---

## Technology Radar

Borrowed from ThoughtWorks — a map of where each technology stands:

**ADOPT** (using in production, recommend to clients):
- Next.js 14
- Supabase
- Tailwind CSS
- Anthropic Claude API
- Stripe
- Vercel
- Figma

**TRIAL** (evaluating, using on select projects):
- Astro (static site generation)
- shadcn/ui (component library)
- Drizzle ORM
- Resend (email)

**ASSESS** (watching, not yet using):
- React Server Components (evaluating performance trade-offs)
- WebAssembly (for compute-heavy browser tasks)
- CSS Houdini
- Bun runtime

**HOLD** (stepping back from):
- WordPress (for new projects; legacy support only)
- jQuery (for new projects)
- Bootstrap (for new projects)
- SendGrid (replacing with Resend)

**Review cadence:** Technology Radar updated quarterly.

---

## Output Formats

### Monthly Briefing (internal, 1 page per domain)
Template:
```
## [Domain] Brief — [Month Year]

### Top 3 Signals
1. [Signal + source + implication]
2. [Signal + source + implication]
3. [Signal + source + implication]

### Action Items
- [Specific action, owner, deadline]

### Ideas Generated
- [Ideas that came from this month's research]

### Nothing to Do Yet (watch list)
- [Things to monitor but not act on]
```

### Quarterly Summary (1 page)
- Key themes across all 6 domains
- Technologies adopted or retired this quarter
- Top 3 ideas scored this quarter
- Competitive landscape summary

---

## Research Lab Metrics

| Metric | Target |
|--------|--------|
| Research time per week | 2 hours (Year 1), 4 hours (Year 2+) |
| Ideas logged per month | 5–10 |
| Ideas scored per quarter | 3–6 |
| Ideas that advance to experiment | 1–2 per quarter |
| Technology Radar updates | Quarterly |
| Competitive reviews | Monthly quick / Quarterly deep |
