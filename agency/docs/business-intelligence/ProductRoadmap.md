# Product Roadmap

**Owner:** Alexander Roman / CEO / Product Lead  
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Status:** Vision Defined — Stage 1 Products Only Active

---

## Purpose

Document the long-term product vision and development roadmap for Roman Creative Studio. Define each product’s vision, objectives, dependencies, priority, estimated timeline, and business value. This roadmap spans the full scaling journey from static website to multi-product company.

---

## Business Value

A product roadmap ensures RCS builds in the right order. Building the client portal before the agency has 5 clients wastes resources. Building courses before an audience is built guarantees failure. This roadmap sequences product development to maximize ROI at each stage.

---

## Product Portfolio Overview

| Product | Category | Stage | Status |
|---------|----------|-------|--------|
| Website Platform | Marketing | Stage 1 | Live (in progress) |
| Client Portal | Service Delivery | Stage 2–3 | Architecture complete |
| Resource Center | Lead Generation | Stage 1–2 | Planned |
| Agency Dashboard | Operations | Stage 2–3 | Architecture complete |
| Design System | Internal Tools | Stage 1–2 | In progress |
| Template Library | Digital Product | Stage 3–4 | Concept |
| AI Services | Service Enhancement | Stage 2–3 | Architecture complete |
| Courses | Education | Stage 4–5 | Vision |
| Podcast | Content/Brand | Stage 1+ | Planned |
| Community | Audience | Stage 4–5 | Vision |
| Software Products | SaaS | Stage 7–9 | Long-term vision |

---

## Product 1 — Website Platform

**Vision:** The RCS website is the best example of what RCS builds — a conversion machine that generates consistent inbound leads, demonstrates premium design and technical quality, and ranks for target keywords across all served industries.

**Category:** Marketing  
**Stage:** 1 (active now)  
**Priority:** Critical

### Objectives
1. Generate 8+ qualified leads per month through organic + direct channels
2. Rank on page 1 for 10+ target local and industry keywords (Year 1)
3. Achieve Lighthouse scores: 90+ Performance, 95+ Accessibility on all key pages
4. Serve as a live demo of RCS capabilities to every prospect

### Current Features
- Homepage (hero, services, proof, CTA)
- About page
- Services pages (individual service pages)
- Pricing page (BUILD/GROW/SCALE tiers + Care Plans)
- Contact page (expanded form)
- Blog (planned)
- Podcast page (planned)
- Industry landing pages (planned)
- Resource center (planned)
- Book discovery call page (planned)
- Free audit page (planned)

### Dependencies
- Domain: `romancreativestudio.co` (active)
- Hosting: GitHub Pages (active)
- DNS: Cloudflare (to configure)
- Analytics: GA4 + Search Console (to install)

### Roadmap
```
Now (Phase 8A/8C): Install GA4, Search Console, Clarity
Month 1: Launch audit.html, resources.html
Month 1: Build 5 priority industry landing pages
Month 2: Build blog system (5+ posts)
Month 3: Build book.html with Calendly integration
Month 6: Case studies section
Month 12: Full industry page library (15+ pages)
```

### Success Metrics
- 2,000+ organic sessions/month by Month 12
- 15+ leads/month by Month 12
- All pages score 90+ Performance, 95+ Accessibility

---

## Product 2 — Client Portal

**Vision:** A premium, branded client experience where every active client can see their project status, communicate with RCS, access invoices, download files, view reports, and feel genuinely taken care of — without sending a single email.

**Category:** Service Delivery  
**Stage:** 2–3  
**Priority:** High  
**Architecture:** Complete (see `ClientPortalArchitecture.md`)

### Objectives
1. Eliminate “what’s the status?” emails from clients
2. Create a professional client experience that justifies premium pricing
3. Improve Care Plan retention by making value visible
4. Enable Care Plan clients to self-serve common requests

### Tech Stack
- Next.js 14+ (App Router)
- Supabase (auth, database, storage)
- Stripe (invoice display, payment)
- Resend (notifications)
- Vercel (hosting)

### Dependencies
- Supabase project created and configured
- Stripe products and subscriptions active
- Domain `portal.romancreativestudio.co` configured
- At least 3 active Care Plan clients to test with

### Roadmap
```
Stage 2 Prep: Supabase project creation, schema design
Stage 3 Build Phase 1: Auth (magic link) + project dashboard
Stage 3 Build Phase 2: Invoices + tasks + file sharing
Stage 3 Build Phase 3: Reports + knowledge base + support tickets
Stage 4: MFA, contractor access, advanced reporting
```

### Success Metrics
- 90%+ of active clients using portal within 60 days of launch
- “What’s the status?” emails reduced by 80%
- Care Plan retention improves by 10%+ post-launch

---

## Product 3 — Resource Center

**Vision:** A library of high-value free resources (guides, checklists, templates) that attracts website visitors, converts them to email subscribers, and nurtures them toward booking a discovery call.

**Category:** Lead Generation  
**Stage:** 1–2  
**Priority:** High

### Objectives
1. Generate 200+ resource downloads per month by Month 12
2. Convert 30%+ of downloaders to email subscribers
3. Convert 5%+ of subscribers to qualified leads within 90 days
4. Build topical authority for SEO on target keywords

### Planned Resources
```
Tier 1 (Launch): 3 resources
  • "Website Launch Checklist for Local Businesses" (PDF)
  • "5 Reasons Your Website Isn't Getting Leads" (Guide)
  • "How Much Should a Website Cost?" (Pricing Guide)

Tier 2 (Month 3): 3 more resources
  • "SEO Starter Guide for Small Businesses" (PDF)
  • "Dental Practice Website Blueprint" (Industry guide)
  • "Website Accessibility Checklist" (Checklist)

Tier 3 (Month 6): Industry-specific resources
  • One resource per major industry vertical
```

### Dependencies
- `resources.html` page (to be built)
- MailerLite active with download-triggered automation
- Formspree or Supabase for email capture
- PDF design for each resource

### Success Metrics
- 200+ downloads/month (Month 12)
- 30%+ email capture rate
- 5%+ of downloaders become leads within 90 days

---

## Product 4 — Agency Dashboard (Internal)

**Vision:** A private, secure internal dashboard giving Alexander a complete real-time view of every business dimension — revenue, leads, projects, marketing, SEO, tasks, and goals — from one screen.

**Category:** Operations  
**Stage:** 2–3  
**Priority:** High  
**Architecture:** Complete (see `ExecutiveDashboard.md` + `InternalDashboardArchitecture.md`)

### Objectives
1. Eliminate the need to check 6+ tools manually each week
2. Enable proactive management of project health and pipeline
3. Surface revenue and MRR trends automatically
4. Replace manual weekly reporting with automated weekly digest

### Dependencies
- Supabase database active and populated
- Stripe connected and syncing
- GA4 API access configured
- At least 3 months of data for trend displays

### Roadmap
```
Stage 2: Build admin.romancreativestudio.co
Phase 1: Auth + overview dashboard + pipeline
Phase 2: Revenue + projects + marketing sections
Phase 3: AI assistant + automated weekly digest
```

---

## Product 5 — RCS Design System

**Vision:** A documented, implementation-ready design system covering all tokens, components, patterns, and standards that enables RCS to build any product consistently and efficiently.

**Category:** Internal Tools  
**Stage:** 1–2  
**Priority:** High (ongoing)

### Objectives
1. Ensure visual consistency across all RCS products
2. Reduce design decision time by 50%
3. Enable future contractors to build within brand without constant guidance
4. Serve as a demonstration of RCS’s design capabilities

### Components
- Color tokens (`tokens.css` — complete)
- Typography scale (complete)
- Spacing system (complete)
- Component library (CSS components — in progress)
- React/Next.js component library (planned, Stage 3)
- Figma design library (planned, Stage 2)
- Storybook documentation (planned, Stage 3)

### Dependencies
- None (builds on existing CSS architecture)

### Success Metrics
- All new pages built using design system tokens (100%)
- New contractor onboarded using design system in <4 hours
- Figma library matches CSS system with 100% fidelity

---

## Product 6 — Template Library

**Vision:** A premium library of website templates built to RCS standards: accessible, performant, SEO-ready, and conversion-optimized. Sold directly to DIY businesses and developers.

**Category:** Digital Product  
**Stage:** 3–4  
**Priority:** Medium

### Objectives
1. Generate $2,000+/month in passive template revenue (Stage 4)
2. Demonstrate RCS design quality to prospects who can’t yet afford a custom build
3. Create a pipeline of future agency clients (template buyers who outgrow DIY)

### Product Vision
```
Template tiers:
  Starter Templates: $97 (HTML/CSS, 3–5 pages)
  Professional Templates: $297 (Next.js, 8+ pages, full animations)
  Industry Bundles: $497 (3 templates for 1 industry)
  White-Label License: $997 (resell rights for agencies)
```

### Dependencies
- RCS design system mature (Stage 2 complete)
- Portfolio of 10+ completed client projects (for credibility)
- E-commerce capability (Stripe, Gumroad, or Lemon Squeezy)
- Marketing audience (2,500+ email subscribers)

### Success Metrics
- 10+ templates available at launch
- $1,000+ revenue in first 30 days
- Template buyers converting to agency clients: 5%+

---

## Product 7 — AI-Enhanced Services

**Vision:** RCS integrates AI into its service delivery to reduce production time, improve quality consistency, and offer capabilities competitors cannot — while keeping human judgment and creativity at the center.

**Category:** Service Enhancement  
**Stage:** 2–3  
**Priority:** High  
**Architecture:** Complete (see `AIAutomationFramework.md`)

### AI Service Components
1. **AI-assisted proposals:** Claude generates first draft from discovery call notes (saves 2–3 hours)
2. **AI SEO copy:** Claude generates meta descriptions, page copy drafts, blog outlines
3. **AI monthly reports:** Claude writes report narratives from data; human reviews and approves
4. **AI lead scoring:** Claude scores form submissions by quality
5. **AI content briefs:** Claude generates content briefs for blog posts

### Dependencies
- Anthropic Claude API key
- Supabase Edge Functions (for AI triggers)
- At least 3 months of project data (for report automation)

### Success Metrics
- Proposal creation time reduced from 3 hours to 45 minutes
- Monthly report creation time reduced from 90 minutes to <5 minutes (automated)
- Lead response time reduced to <5 minutes (AI qualification email)

---

## Product 8 — Courses

**Vision:** RCS launches a premium online course teaching local business owners how to get results from their website: SEO, conversion optimization, content strategy, and working effectively with a web agency.

**Category:** Education  
**Stage:** 4–5  
**Priority:** Low (future)

### Objectives
1. Generate $50,000+ annually from course sales
2. Build audience of 5,000+ potential agency clients
3. Establish Alexander as a recognized educator in the digital agency space

### Course Concepts
```
Course 1: "Your Website Is Not Working: Fix It"
  Audience: Small business owners with underperforming websites
  Format: 6-week self-paced (12 video modules)
  Price: $297

Course 2: "How to Hire a Web Agency (And Not Get Burned)"
  Audience: Business owners preparing to hire an agency
  Format: 2-hour masterclass
  Price: $97

Course 3: "Local SEO in 90 Days"
  Audience: Local business owners
  Format: 8-week guided program
  Price: $497
```

### Dependencies
- Email list of 5,000+ subscribers
- 10+ strong client case studies
- Video production setup
- Course platform (Teachable, Kajabi, or Podia)
- Audience trust established through 2+ years of content

---

## Product 9 — Podcast

**Vision:** The 4 Kingdoms Podcast becomes a top-100 podcast in its category, driving brand awareness, inbound leads, partnership opportunities, and a loyal audience for future product launches.

**Category:** Content / Brand  
**Stage:** 1+  
**Priority:** Medium (parallel track)

### Objectives
1. Publish consistently: 2 episodes/month minimum
2. Reach 500+ downloads per episode by Month 12
3. Generate 1+ agency lead per month attributable to podcast
4. Build audience for future course and product launches

### Content Strategy
- Episode formats: Solo (Alexander shares insights), Interview (industry guests), Case study (anonymized client wins)
- Distribution: Spotify, Apple Podcasts, YouTube (audiogram)
- Show notes: SEO-optimized, linked from `romancreativestudio.co/podcast`

### Dependencies
- Recording equipment and setup
- Podcast host account (Buzzsprout, Transistor)
- Cover art and branding
- Consistent publishing schedule

### Success Metrics
- 500+ downloads per episode (Month 12)
- 5%+ of listeners converting to email subscribers
- 1+ agency lead/month from podcast source

---

## Product 10 — Community

**Vision:** A private community for small business owners focused on digital marketing, website performance, and growth. RCS facilitates the community and uses it as both a value-delivery and lead generation channel.

**Category:** Audience  
**Stage:** 4–5  
**Priority:** Low (future)

### Objectives
1. Build a 500+ member community of ideal RCS clients
2. Generate 5+ agency leads per month from community members
3. Test new service ideas and content with a warm, engaged audience

### Dependencies
- Email list of 10,000+
- 3+ years of established content authority
- Community platform (Circle, Skool, or Discord)
- Dedicated community management time (team member)

---

## Product 11 — Software Products

**Vision:** Internal tools built for RCS become standalone SaaS products sold to other agencies and businesses. First candidates: website audit tool, proposal generator, client portal software.

**Category:** SaaS  
**Stage:** 7–9  
**Priority:** Long-term vision

### Potential Products
```
1. "Audit" — Website Audit Tool
   Scans any website for: performance, accessibility, SEO, security
   Output: branded PDF report with prioritized recommendations
   Market: agencies, in-house marketing teams
   Price: $49/mo SaaS or $199 per-report

2. "Propose" — Proposal Generator
   Web agency-specific proposal tool with templates, e-sign, tracking
   Market: freelancers, boutique agencies
   Price: $29/mo

3. "Portal" — White-Label Client Portal
   The RCS client portal packaged for other agencies
   Market: web design agencies without their own portal
   Price: $79/mo per agency
```

### Dependencies
- Internal version proven with 50+ real uses
- Technical team capable of SaaS development and support
- Validated demand from potential customers
- $500,000+ ARR from core agency business (to fund SaaS investment)

---

## Product Priority Matrix

```
HIGH IMPACT + LOW EFFORT (Do First)
  Website Platform improvements (GA4, industry pages, audit.html)
  AI service enhancements (proposals, reports)
  Resource Center (lead magnets)

HIGH IMPACT + HIGH EFFORT (Plan Carefully)
  Client Portal (high impact on retention, 3–6 months to build)
  Agency Dashboard (high impact on operations, 2–3 months)

LOW IMPACT + LOW EFFORT (When Time Allows)
  Podcast (brand, parallel track)
  Design System maturation

LOW IMPACT + HIGH EFFORT (Don't Do Yet)
  Template Library (needs audience first)
  Courses (needs larger email list)
  Community (needs established authority)
  Software Products (needs validated demand + team)
```

---

## Technical Notes

- All new products must use the RCS design system tokens and components
- All products requiring auth use Supabase Auth
- All products requiring payments use Stripe
- All products requiring email use Resend (transactional) + MailerLite (marketing)
- Software products (SaaS) require a separate technical architecture review before building

---

## Future Enhancements

- [ ] Quarterly product roadmap review and reprioritization
- [ ] Customer discovery interviews before building Courses or Community
- [ ] Technical spike for each SaaS product concept before committing
- [ ] Product analytics (separate GA4 property for each major product)

---

## Related Documents

- `ScalingRoadmap.md` — which products are appropriate at each stage
- `AIAutomationFramework.md` — AI services architecture
- `ClientPortalArchitecture.md` — client portal full spec
- `InnovationLab.md` — future product ideas in exploration
- `ForecastingModels.md` — revenue projections including product revenue
