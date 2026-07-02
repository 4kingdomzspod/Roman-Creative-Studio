# Training
# Roman Creative Studio — Team & Leadership Operating System
# Section 8 of 19 | ERD Version 1.0

---

## Purpose

Define the complete internal training system for Roman Creative Studio — ensuring every team member develops the skills, knowledge, and standards required to deliver exceptional work.

**Business Value:** Reduces dependence on external training. Builds institutional knowledge. Ensures quality standards are transmitted to every hire. Creates a culture of continuous learning.

**Owner:** CEO / Creative Director / Operations Manager  
**Version:** 1.0  
**Related Documents:** Onboarding.md, CareerPaths.md, KnowledgeBase.md, PromotionFramework.md

---

## Training Philosophy

1. **Learning is ongoing, not one-time.** Training never stops. Standards evolve, tools change, and skills compound.
2. **Documentation is the curriculum.** Every training module is backed by written documentation in Notion/KnowledgeBase.
3. **Learn by doing.** Theory without practice is useless. Every module includes a hands-on project.
4. **Teach to learn.** Every senior team member is expected to teach. Teaching deepens mastery.
5. **Education budget is sacred.** Every employee gets an education budget. Use it or lose it.

---

## Training Module Index

### Module 01: Company & Brand
**Who:** All team members  
**When:** Week 1 of onboarding  
**Format:** Reading + CEO video walkthrough  
**Duration:** 3–4 hours

**Topics:**
- Roman Creative Studio mission, values, and story
- Brand voice and tone guide
- Client avatar: who we serve and why
- Service tier overview (BUILD / GROW / SCALE)
- Care plan overview (Care / SEO Retainer / Growth Partner)
- Competitive positioning: what makes RCS different
- The RCS quality standard: what "good" looks like here

**Completion criteria:** Pass 10-question quiz on brand fundamentals with >80% score.

---

### Module 02: Design Standards
**Who:** All designers, developers (fundamentals), PMs (overview)  
**When:** Week 1–2 for designers, Week 3–4 for developers  
**Format:** Reading + Figma practice files + design critique session  
**Duration:** 8–12 hours (designers) / 2–3 hours (overview)

**Topics:**
- Design system: tokens, components, naming conventions
- Typography standards (Inter, Plus Jakarta Sans, sizing scale)
- Color system (CSS custom properties, brand palette, neutrals)
- Grid system: 12-column, breakpoints, spacing
- Responsive design: mobile-first approach
- Icon system and asset management
- Figma file organization standards
- Component naming conventions
- Figma → Developer handoff process
- Design QA checklist

**Completion criteria:** Complete a sample homepage redesign in Figma using the design system. Reviewed and approved by Creative Director.

---

### Module 03: Accessibility Standards
**Who:** All team members (fundamentals), Designers and Developers (advanced)  
**When:** Week 2–3  
**Format:** Reading + axe scan practice + screen reader demo  
**Duration:** 4–6 hours (advanced) / 1–2 hours (fundamentals)

**Topics:**
- WCAG 2.1 AA overview: what it means and why it matters
- Four principles: Perceivable, Operable, Understandable, Robust
- Color contrast ratios (4.5:1 text, 3:1 UI elements)
- Focus management and keyboard navigation
- ARIA roles, labels, and live regions
- Alt text standards (descriptive vs. decorative)
- Form accessibility (labels, errors, fieldsets)
- Heading hierarchy (H1 → H6 logical structure)
- Testing tools: axe DevTools, WAVE, Lighthouse, NVDA/VoiceOver
- Common violations and how to fix them
- Accessibility audit process

**Completion criteria:** Run a full accessibility audit on a sample site using axe + Lighthouse. Document findings in required format.

---

### Module 04: Development Standards
**Who:** All developers  
**When:** Week 1–2  
**Format:** Reading + code review of sample files + practice PR  
**Duration:** 8–10 hours

**Topics:**
- HTML semantics: the right element for the job
- CSS architecture: tokens.css → base.css → layout.css → components.css
- CSS custom properties: `--color-*` naming system
- JavaScript standards: ES6+, no jQuery unless legacy
- Git workflow: branch naming, commit messages, PR process
- Code review standards: what reviewers check for
- Performance standards: PageSpeed >90, CLS <0.1, LCP <2.5s
- Next.js project structure (if applicable)
- TypeScript conventions (if applicable)
- Component structure and naming
- Testing approach: what to test, how to document
- Deployment process (Vercel / Netlify / GitHub Pages)
- `.nojekyll` and static site considerations

**Completion criteria:** Submit a sample component via PR. Must pass code review from a senior developer or CEO.

---

### Module 05: SEO Standards
**Who:** Designers, Developers, Content Writers, SEO Specialist, PMs  
**When:** Week 2–3  
**Format:** Reading + practical audit exercise  
**Duration:** 4–6 hours (full) / 2 hours (overview)

**Topics:**
- On-page SEO fundamentals: title tags, meta descriptions, H1 hierarchy
- URL structure best practices
- Schema markup: LocalBusiness, WebPage, BlogPosting, FAQPage
- Image optimization: alt text, WebP format, lazy loading
- Internal linking strategy
- Core Web Vitals and their SEO impact
- Google Search Console: setup, monitoring, interpretation
- GA4 basics: goals, events, traffic sources
- Local SEO: Google Business Profile, NAP consistency
- UTM parameters and campaign tracking
- Content brief format used at RCS
- Keyword research methodology (Ahrefs/SEMrush workflow)

**Completion criteria:** Complete an SEO audit on a sample site using the RCS audit checklist. Score must be >75% accuracy.

---

### Module 06: Performance Optimization
**Who:** Developers (required), Designers (overview)  
**When:** Week 2–3  
**Format:** Reading + Lighthouse optimization exercise  
**Duration:** 4–5 hours

**Topics:**
- Core Web Vitals: LCP, INP, CLS explained
- Image optimization: compression, WebP, correct dimensions, lazy load
- Font loading: font-display:swap, subsetting, preconnect
- Critical CSS and render-blocking resources
- JavaScript bundle optimization
- Caching strategies (CDN, browser cache headers)
- Lighthouse audit interpretation
- WebPageTest and GTmetrix usage
- Performance budget setting

**Completion criteria:** Take a site from Lighthouse score <70 to >90 and document the changes made.

---

### Module 07: Communication Standards
**Who:** All team members  
**When:** Week 1  
**Format:** Reading + role-play exercise  
**Duration:** 2–3 hours

**Topics:**
- Async-first communication: when to use async vs. sync
- Slack etiquette: channels, threading, reactions, status
- Email standards: subject lines, response time, professional tone
- Client communication: language, tone, expectations
- Documentation-first: writing before speaking
- Meeting culture: agenda required, notes mandatory
- Feedback delivery: SBI model (Situation-Behavior-Impact)
- Conflict resolution process
- Decision log format
- Status update cadence

**Completion criteria:** No formal test. Manager confirms via 2-week observation checklist.

---

### Module 08: Sales & Proposal Process
**Who:** CEO (always), Sales Manager, Account Manager  
**When:** Week 2–3 for sales-adjacent roles  
**Format:** Reading + shadowed discovery call + proposal draft  
**Duration:** 6–8 hours

**Topics:**
- Ideal client profile: who we want, who we don't
- Discovery call structure (RCS template)
- Value-based selling: outcomes vs. deliverables
- Proposal structure: executive summary, scope, timeline, investment
- Value framing by industry
- Objection handling: price, timeline, competitor comparison
- Follow-up cadence (Day 1, Day 3, Day 7, Day 14)
- CRM usage: HubSpot stages, notes, tasks
- Proposal-to-close process
- Contract execution
- Referral program activation

**Completion criteria:** Draft a mock proposal for a fictional client. Reviewed by CEO.

---

### Module 09: Client Service Standards
**Who:** All client-facing team members  
**When:** Week 2  
**Format:** Reading + observed client interaction  
**Duration:** 3–4 hours

**Topics:**
- Client communication tone: professional, warm, clear
- How to deliver bad news (honesty with empathy)
- How to handle scope creep requests
- How to handle dissatisfied clients
- Monthly report delivery standards
- Client success metrics (CSAT, NPS)
- Care plan delivery checklist
- When to escalate to CEO
- Referral request timing and language

**Completion criteria:** Complete a simulated client complaint scenario with manager feedback.

---

### Module 10: AI & Automation
**Who:** All team members (fundamentals), Developers (advanced)  
**When:** Month 1  
**Format:** Reading + hands-on tool exploration  
**Duration:** 3–4 hours (fundamentals) / 6–8 hours (advanced)

**Topics:**
- How Roman Creative Studio uses AI (current and planned)
- Anthropic Claude API: use cases, model selection (Sonnet 5 vs. Haiku 4.5)
- Prompt engineering basics: clear instructions, context, examples
- AI-assisted design workflow
- AI-assisted development (GitHub Copilot, Claude Code)
- AI-assisted content creation: editing AI output, not replacing human judgment
- Automation tools: Zapier, Make.com, Supabase Edge Functions
- AI ethics: accuracy, disclosure, privacy
- What AI should NOT be used for

**Completion criteria:** Complete a role-specific AI task (e.g., write a prompt that generates a client email draft, or build a simple Zapier zap).

---

### Module 11: Documentation Standards
**Who:** All team members  
**When:** Week 2  
**Format:** Reading + KnowledgeBase contribution  
**Duration:** 2 hours

**Topics:**
- Why documentation matters at RCS (anti-tribal-knowledge policy)
- Notion structure: how we organize documentation
- Required fields for every document (purpose, owner, version, date)
- How to write a process document
- How to update existing documentation
- Documentation ownership: who owns what
- What to document vs. what lives in Slack
- Review and version control for docs

**Completion criteria:** Write or update 1 documentation entry in Notion/KnowledgeBase.

---

### Module 12: Git & Version Control
**Who:** Developers (required), Designers (basics), PMs (overview)  
**When:** Week 1 for developers  
**Format:** Reading + CLI practice + PR submission  
**Duration:** 4–6 hours (developers) / 1 hour (others)

**Topics:**
- Git fundamentals: clone, branch, commit, push, pull
- RCS branching strategy: `main`, `develop`, `feature/`, `fix/`, `claude/`
- Commit message standards: imperative, present tense, descriptive
- Pull request process: title, description, review request
- Code review participation: what to look for, how to comment
- Merge conflicts: identification and resolution
- GitHub Projects or Linear for issue tracking
- `.gitignore` standards
- Secrets management: never commit API keys

**Completion criteria:** Submit a complete PR from a feature branch with proper commit messages and description. Reviewed by senior developer.

---

## Annual Training Calendar

| Quarter | Training Focus | Format |
|---------|---------------|--------|
| Q1 | Brand refresh + new year standards review | Team workshop |
| Q2 | Accessibility deep-dive | External speaker or course |
| Q3 | New technology or tool introduction | Workshop |
| Q4 | Year retrospective + next year skill planning | Team workshop |

## Education Budget Policy

| Level | Annual Education Budget |
|-------|------------------------|
| Contractor | $0 (rate includes learning) |
| Part-time (Stage 2) | $250/year |
| Full-time (Stage 3) | $500/year |
| Full-time (Stage 4) | $1,000/year |
| Director / Lead (Stage 4+) | $2,000/year |

**Approved uses:** Online courses, books, certifications, conference tickets  
**Approval process:** Written request to CEO >$200 single expense  
**Use-it-or-lose-it:** Unused budget does not roll over to next year

---

*Document: Training.md | Phase 10 Section 8 | Version 1.0 | 2026-07-01*