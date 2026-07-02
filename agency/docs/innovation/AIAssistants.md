# AI Assistants & Products — Roman Creative Studio
## Innovation Lab | Section 4
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Owner:** Chief Innovation Officer + AI Product Strategist  
**Status:** Research & Planning Phase

---

## Overview

RCS AI Products are purpose-built AI tools that solve specific problems for our target clients: small-to-mid-size service businesses. These are not general-purpose AI tools — they are trained on our methodology, our frameworks, and our domain expertise in web design, branding, SEO, and digital marketing.

**Strategic Rationale:** AI products have near-zero marginal cost, 24/7 availability, and scale without adding headcount. They can also serve as lead generation tools (free tiers bring prospects into our ecosystem).

**Build Approach:** We will use the Anthropic Claude API as our primary AI engine. Products will be built on Next.js with Supabase for user management and usage tracking.

---

## AI Product Catalog

### AI-01: Website Audit AI

**Purpose:** Analyze any website URL and generate a comprehensive audit report covering design, performance, SEO, and accessibility.

**Problem Solved:** Getting a professional website audit typically costs $500–$2,000 and takes 1–2 weeks. Businesses often skip it and make decisions without data.

**Target Users:** Small business owners, marketing managers, DIY website owners

**How It Works:**
1. User enters their website URL
2. System crawls key pages (Puppeteer/Playwright headless browser)
3. Runs Lighthouse for performance/accessibility scores
4. Claude API analyzes design screenshots + crawled content
5. Structured report generated with prioritized recommendations
6. Report delivered as PDF + in-app view

**Required Data:**
- Website URL
- Industry (for competitive context)
- Primary goal (leads, sales, information, booking)
- Optional: competitor URLs for comparison

**Potential APIs:**
- Anthropic Claude API (analysis + recommendations)
- Lighthouse CI (performance/accessibility scores)
- Playwright (screenshot capture)
- PageSpeed Insights API (performance data)
- Screaming Frog API or custom crawler (page inventory)
- html-pdf or Puppeteer (PDF generation)

**Business Model:**
- Free: 1 audit/month (lead generation)
- Pro: $29/mo — 10 audits/month + white-label PDF
- Agency: $79/mo — Unlimited audits + client management dashboard
- Per-report: $19 one-time for non-subscribers

**Lead Generation Strategy:** Free audit results include a CTA to book a consultation. Integration with our Calendly booking flow. Email capture before report delivery.

**Maintenance Requirements:**
- Monthly model fine-tuning review
- Lighthouse API version monitoring
- Website crawler error handling
- PDF template updates quarterly

**Future Roadmap:**
- Scheduled recurring audits (weekly change monitoring)
- Competitor comparison feature
- Industry benchmark database
- Remediation service upsell (direct connection to RCS team)

---

### AI-02: SEO Assistant

**Purpose:** Generate keyword research, on-page optimization recommendations, and content briefs for local service businesses.

**Problem Solved:** SEO tools like Ahrefs and SEMrush are expensive ($100–$400/mo) and complex for non-experts. Small businesses need actionable SEO guidance without the learning curve.

**Target Users:** Small service business owners, office managers handling marketing, freelance marketers serving SMBs

**How It Works:**
1. User enters business type + location + current website
2. System generates target keyword list (local + service-specific)
3. Claude API analyzes current pages for on-page SEO gaps
4. Content brief generated for missing keyword coverage
5. Monthly tracking recommendations provided

**Required Data:**
- Business type and primary services
- Geographic service area
- Current website URL
- Top 2–3 competitors (optional)

**Potential APIs:**
- Anthropic Claude API (analysis, recommendations, content briefs)
- DataForSEO API (keyword data, search volumes)
- Google Search Console API (existing performance data, if connected)
- Google My Business API (local presence data)

**Business Model:**
- Free: Basic keyword list + 3 recommendations
- Pro: $49/mo — Full keyword research + monthly content calendar + on-page audits
- Agency: $149/mo — Client management, white-label reports, bulk analysis

**Maintenance Requirements:**
- Keyword API costs monitoring (DataForSEO usage)
- Algorithm update response (major Google updates)
- Local SEO logic updates (Google Business Profile changes)

**Future Roadmap:**
- Direct Google Search Console integration
- Automated monthly ranking reports
- Content brief → blog post generation
- Internal linking opportunity detection

---

### AI-03: Proposal Generator

**Purpose:** Generate professional, customized project proposals for web design and digital marketing services.

**Problem Solved:** Writing proposals takes 2–4 hours per prospect. With high lead volume, this becomes a bottleneck. Inconsistent proposal quality loses deals.

**Target Users (Internal First):** RCS team. External: Other web design agencies, freelancers.

**How It Works:**
1. User inputs discovery call notes (or answers structured questions)
2. System identifies service tier, scope, timeline, and client profile
3. Claude API generates full proposal: executive summary, scope, process, timeline, investment, next steps
4. User reviews and edits in-browser
5. Export as PDF or shareable link with e-signature (DocuSign API)

**Required Data:**
- Client business name, industry, website
- Primary goals and pain points
- Services requested
- Budget indication
- Timeline expectations
- Competitor context

**Potential APIs:**
- Anthropic Claude API (proposal generation)
- DocuSign API or HelloSign API (e-signature)
- html-pdf (PDF export)
- Stripe (payment deposit link generation)

**Business Model:**
- Internal tool (RCS use only) — Year 1
- SaaS: $39/mo — 20 proposals/month (Year 2)
- Agency: $99/mo — Unlimited proposals + templates + branding

**Maintenance Requirements:**
- Proposal template library updates
- Claude prompt tuning as we refine what converts
- E-signature provider API version monitoring

**Future Roadmap:**
- CRM integration (automatically pull prospect data from HubSpot/Notion)
- Proposal analytics (open rate, time-spent, conversion)
- Follow-up email sequence generator
- Proposal → Contract flow

---

### AI-04: Brand Strategy Assistant

**Purpose:** Help small businesses develop their brand positioning, messaging, and visual direction through guided AI conversation.

**Problem Solved:** Brand strategy from agencies costs $5,000–$25,000. Small businesses either skip it or do it poorly on their own, resulting in inconsistent messaging and weak market differentiation.

**Target Users:** New business owners, rebranding SMBs, solo founders, marketing managers at small companies

**How It Works:**
1. User completes guided brand discovery interview (30 questions across 5 areas)
2. Claude API analyzes responses and generates:
   - Brand positioning statement
   - Brand voice and tone guide
   - 3 visual direction concepts (moodboard descriptions)
   - Tagline options (5 variants)
   - Key messaging for website homepage
3. All outputs packaged as Brand Brief PDF

**Required Data:**
- Business history and founding story
- Target audience description
- Competitive landscape
- Values and what makes them different
- Current perception vs. desired perception
- Long-term vision

**Potential APIs:**
- Anthropic Claude API (analysis + strategy generation)
- Unsplash API (moodboard image suggestions)
- Google Fonts API (typography pairing suggestions)
- Coolors API or custom (color palette generation)

**Business Model:**
- One-time: $97 — Full brand brief
- Subscribe: $29/mo — Ongoing brand guidance, quarterly refresh
- Agency: $49/report — White-label for marketing agencies

**Maintenance Requirements:**
- Brand strategy framework updates (annual)
- Prompt quality review based on user feedback
- Discovery question refinement

**Future Roadmap:**
- Competitor analysis integration
- Social media content pillar generation
- Website copy generation from brand brief
- Connection to RCS full branding service (upsell)

---

### AI-05: Accessibility Checker

**Purpose:** Automated WCAG 2.1 AA accessibility audit with remediation guidance written in plain English.

**Problem Solved:** Accessibility compliance tools (axe, WAVE) show errors without explaining how to fix them in context. Developers lose hours translating tool output into actual code fixes.

**Target Users:** Web developers (freelance + agency), website owners under ADA compliance pressure, agencies serving healthcare/government/education

**How It Works:**
1. User enters URL or pastes HTML code
2. System runs axe-core and WAVE API scans
3. Claude API receives raw audit data + page context
4. Claude generates: issue summary, severity ranking, specific fix instructions per issue, code examples before/after
5. Results shown in-app + PDF report available

**Required Data:**
- URL or HTML content
- Target audience context (optional — affects severity weighting)

**Potential APIs:**
- Anthropic Claude API (remediation guidance)
- axe-core (automated accessibility scanning)
- WAVE API (additional scan coverage)
- Playwright/Puppeteer (page rendering)

**Business Model:**
- Free: 1 URL scan/week, basic report
- Pro: $19/mo — 50 scans/month + detailed remediation + PDF reports
- Agency: $59/mo — Unlimited scans + client management + white-label

**Maintenance Requirements:**
- WCAG guideline updates (WCAG 2.2 / WCAG 3.0 monitoring)
- axe-core version updates
- Legal landscape monitoring (ADA lawsuit trends)

**Future Roadmap:**
- Monitoring mode (weekly re-scan, alert on new issues)
- Developer browser extension
- CI/CD integration (GitHub Action)
- Accessibility score tracking over time

---

### AI-06: Performance Advisor

**Purpose:** Analyze website performance (Core Web Vitals) and generate a prioritized, implementation-ready improvement plan.

**Problem Solved:** Lighthouse reports tell you what's wrong but not how to fix it — especially for non-developers. Agencies spend significant time translating performance data into client recommendations.

**Target Users:** Web developers, agency account managers, technically curious business owners

**How It Works:**
1. User enters URL
2. System runs Lighthouse + PageSpeed Insights
3. Claude API receives performance data + page technology stack detection
4. Generates: issue list ranked by impact, implementation instructions per issue, estimated improvement per fix, estimated dev hours per fix

**Required Data:**
- URL
- CMS/platform (auto-detected where possible)

**Potential APIs:**
- Anthropic Claude API
- PageSpeed Insights API (Google)
- Lighthouse CI
- Wappalyzer API (tech stack detection)

**Business Model:**
- Free: 3 scans/month
- Pro: $19/mo — Unlimited scans + prioritized fix list
- Agency: $49/mo — Client management + monthly reports

---

### AI-07: Content Planner

**Purpose:** Generate a 90-day content calendar with topic ideas, formats, and briefs aligned to a business's goals and audience.

**Problem Solved:** Content strategy requires significant research and planning. Most small businesses post inconsistently because they run out of ideas and don't have a system.

**Target Users:** Small business owners, marketing coordinators, freelance content creators

**How It Works:**
1. User inputs business type, goals, audience, existing content, channels
2. Claude API generates:
   - 90-day content calendar (blog, social, email)
   - 12 long-form blog topic ideas with SEO angle
   - 30 social post ideas
   - 4 email newsletter concepts
   - Content pillar framework
3. Export as CSV (for Notion/Trello import) or PDF

**Required Data:**
- Business type and primary services
- Target audience persona
- Current content channels
- Business goals (leads, brand awareness, retention)
- Competitor content examples

**Potential APIs:**
- Anthropic Claude API
- DataForSEO (keyword data for blog topics)

**Business Model:**
- One-time: $47 — 90-day plan
- Subscribe: $29/mo — Quarterly content plans + monthly refreshes

---

### AI-08: Design Critique Assistant

**Purpose:** Provide professional design feedback on websites, landing pages, and visual assets using established design principles.

**Problem Solved:** Junior designers and non-designers making web decisions lack access to expert design critique. Hiring a design consultant for feedback is expensive and slow.

**Target Users:** Junior web designers, DIY business owners, marketing teams

**How It Works:**
1. User uploads screenshot or enters URL
2. Claude API (vision) analyzes the design
3. Generates structured critique: Visual hierarchy, Typography, Color usage, Whitespace, CTA effectiveness, Mobile considerations, Accessibility quick-check
4. Prioritized improvement list with specific recommendations

**Required Data:**
- Design screenshot or URL
- Design goal (homepage, landing page, portfolio, etc.)
- Target audience

**Potential APIs:**
- Anthropic Claude API (vision capability)
- Playwright (screenshot capture for URLs)

**Business Model:**
- Free: 3 critiques/month
- Pro: $19/mo — Unlimited critiques + detailed reports
- Per-critique: $9 one-time

---

### AI-09: Client FAQ Assistant

**Purpose:** A white-label AI chatbot trained on a business's services, policies, and FAQs to handle common client questions 24/7.

**Problem Solved:** Service businesses spend 30–60% of communication time answering the same questions. Every hour spent on repetitive Q&A is an hour not spent on revenue-generating work.

**Target Users:** Service business owners (RCS client profile: dental practices, law firms, construction companies, churches, healthcare)

**How It Works:**
1. Business owner inputs FAQs, service descriptions, pricing, policies
2. System builds knowledge base in Supabase (vector embeddings)
3. Claude API + RAG (Retrieval-Augmented Generation) answers questions
4. Widget embedded on client's website
5. Unknown questions escalated to email or human chat

**Required Data:**
- Business services and descriptions
- Common questions and approved answers
- Business hours and contact info
- Pricing (optional — can be withheld)
- Intake/booking process

**Potential APIs:**
- Anthropic Claude API (conversation)
- Supabase pgvector (knowledge base + retrieval)
- Resend (email escalation notifications)
- Optional: Calendly API (booking handoff)

**Business Model:**
- $97/mo per business — Setup + hosted chatbot + monthly updates
- $497 one-time + $47/mo — Full custom setup + white-label
- Agency reseller: $297/mo for up to 5 client chatbots

**Maintenance Requirements:**
- Knowledge base update process for clients
- Fallback/escalation monitoring
- Monthly conversation review for improvement
- Model updates

**Future Roadmap:**
- CRM integration (capture leads from conversations)
- Appointment booking within chat
- Multi-language support
- Phone/SMS variant

---

### AI-10: Project Estimator

**Purpose:** Generate accurate project estimates and timelines for web design and digital marketing projects based on scope inputs.

**Problem Solved:** Estimating project scope is time-consuming and inconsistent. Junior team members estimate incorrectly, causing scope creep and profitability issues.

**Target Users (Internal First):** RCS team. External: Freelancers, small agencies.

**How It Works:**
1. User inputs project type, features, pages, integrations, quality level
2. System applies RCS standard time database + complexity multipliers
3. Claude API generates: timeline estimate, task breakdown, risk factors, recommended buffer
4. Output: Estimate summary + detailed task list (CSV export)

**Required Data:**
- Project type (website, app, rebrand, etc.)
- Feature list
- Page/screen count
- Third-party integrations
- Client technical sophistication (affects revision cycles)

**Potential APIs:**
- Anthropic Claude API
- Internal time database (Supabase)

**Business Model:**
- Internal tool (Year 1)
- SaaS: $29/mo for freelancers
- Agency: $79/mo for teams

---

### AI-11: Prompt Generator

**Purpose:** Generate optimized prompts for common agency tasks: copywriting, design briefs, SEO research, client communication, and more.

**Problem Solved:** Most people use AI ineffectively because they write weak prompts. An AI-powered prompt generator that understands agency workflows dramatically increases AI output quality.

**Target Users:** Agency teams, freelancers, marketing professionals

**How It Works:**
1. User selects task category and describes their need
2. System applies RCS prompt engineering framework
3. Generates 3 prompt variants (direct, detailed, chain-of-thought)
4. User can test prompt directly in-interface
5. Save to personal prompt library

**Required Data:**
- Task category
- Desired output description
- Audience or context
- Constraints

**Potential APIs:**
- Anthropic Claude API (prompt generation + testing)
- Supabase (prompt library storage)

**Business Model:**
- Free: 10 prompts/month
- Pro: $15/mo — Unlimited generation + personal library
- Team: $39/mo — Shared team library + custom categories

---

## AI Product Development Standards

### Technical Architecture (Standard per Product)

```
Frontend: Next.js 14+
Auth: Supabase Auth
Database: Supabase PostgreSQL
AI Engine: Anthropic Claude API (claude-sonnet-5 for quality, claude-haiku-4-5-20251001 for fast/routine)
File Storage: Supabase Storage
Payments: Stripe
Email: Resend
Deployment: Vercel
Monitoring: Vercel Analytics + Sentry
```

### AI Model Selection by Use Case

| Use Case | Model | Reason |
|----------|-------|--------|
| Complex analysis (audit, strategy, critique) | claude-sonnet-5 | Highest accuracy |
| Structured generation (proposals, briefs) | claude-sonnet-5 | Consistent output |
| Fast, simple tasks (FAQ, prompt gen) | claude-haiku-4-5-20251001 | Speed + cost |
| Vision tasks (design critique) | claude-sonnet-5 | Vision capability |

### Prompt Engineering Standards

1. **System prompt:** Define role, expertise, output format, constraints
2. **User context:** Always include relevant business/industry context
3. **Output format:** Specify structure (JSON, Markdown, sections) explicitly
4. **Guardrails:** Include what NOT to do
5. **Examples:** Include 1–2 examples for complex outputs (few-shot)
6. **Temperature:** 0.3–0.5 for analysis/recommendations; 0.7–0.9 for creative generation

### Usage & Cost Management

- Track token usage per user per product in Supabase
- Set hard limits per pricing tier
- Alert at 80% of tier limit
- Cost target: AI cost < 20% of product revenue
- Monthly cost review: if AI cost > 25% of revenue, adjust pricing or limits

### Data Privacy Standards

- No user data used for model training without explicit consent
- Crawled website data deleted after report generation
- User-uploaded files deleted after processing
- Privacy policy required for all AI products
- GDPR compliance: right to deletion, data portability

---

## Revenue Projection Summary

| Product | Launch Year | Year 1 MRR Target | Year 3 MRR Target |
|---------|-------------|--------------------|--------------------|n| AI-01 Website Audit AI | Year 2 | $500 | $3,000 |
| AI-02 SEO Assistant | Year 2 | $750 | $4,500 |
| AI-03 Proposal Generator | Year 2 | $300 | $2,000 |
| AI-04 Brand Strategy Assistant | Year 2 | $400 | $2,500 |
| AI-05 Accessibility Checker | Year 2 | $250 | $1,500 |
| AI-06 Performance Advisor | Year 2 | $200 | $1,200 |
| AI-07 Content Planner | Year 2 | $350 | $2,000 |
| AI-08 Design Critique | Year 3 | — | $800 |
| AI-09 Client FAQ Assistant | Year 2 | $1,000 | $8,000 |
| AI-10 Project Estimator | Year 3 | — | $1,500 |
| AI-11 Prompt Generator | Year 2 | $200 | $1,000 |
| **Total** | | **$3,950** | **$28,000** |

---

## Implementation Roadmap

| Phase | Timeline | Milestone |
|-------|----------|-----------|
| Research | Month 1–3 | Validate AI-01, AI-09 demand (surveys + interviews) |
| Internal Build | Month 4–8 | Build AI-03, AI-10 for internal use; validate on real projects |
| Beta Launch | Month 9–12 | AI-01 public beta (free tier); AI-09 pilot with 3 clients |
| Paid Launch | Month 13–16 | AI-01, AI-02, AI-09 paid tiers; AI-04 launch |
| Expansion | Month 17–24 | AI-05, AI-06, AI-07, AI-11 launch |
| Full Suite | Year 3 | AI-08, AI-10 + subscription bundle |
