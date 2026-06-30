# AI Automation Framework
## Roman Creative Studio — Agency Operating System

**Owner:** CTO / Founder
**Version:** 1.0
**Last Updated:** 2026-06-30
**Related Documents:** AutomationRoadmap.md, DiscoveryCallSystem.md, CRMArchitecture.md, IntegrationReadiness.md

---

## Purpose

Define AI-powered internal workflows that multiply the productivity of a one-person agency — allowing Roman Creative Studio to deliver at the quality and volume of a 5-person team while maintaining the personal, premium experience of a boutique studio.

## Business Value

AI automation reduces time spent on repetitive cognitive tasks (writing first drafts, generating reports, summarizing calls), freeing the founder to focus on high-value relationship work, strategy, and creative direction.

---

## AI Framework Philosophy

1. **AI drafts, humans approve.** No AI output goes to clients without human review.
2. **Context is everything.** All AI tools are fed RCS brand voice, client context, and structured inputs.
3. **Augmentation, not replacement.** AI handles the 80% repetitive portion; the founder adds the 20% that makes it personal and premium.
4. **Privacy first.** No client PII sent to external AI APIs without documented consent and data handling agreements.

---

## Automation 1: Proposal Generator

**Purpose:** Generate a complete, personalized project proposal draft within minutes of a discovery call.

**Input:**
- Discovery call summary (from meeting notes template)
- Client name, company, industry, URL
- Selected tier (BUILD/GROW/SCALE)
- Key pain points identified on the call
- Stated goals (e.g., "increase patient bookings by 30%")
- Agreed timeline

**Output:**
- Full proposal document (3-5 pages)
- Executive summary tailored to client's industry
- Scope of work with milestone breakdown
- Investment summary (project fee + optional Care Plan)
- Social proof paragraph (reference similar past clients)
- Call-to-action: review, sign, deposit

**AI Model:** Claude (claude-haiku-4-5 for speed, claude-sonnet-5 for quality)

**System Prompt Template Location:** `docs/ai-prompts/proposal-generator.md`

**Business Value:** Reduces proposal writing time from 3-4 hours to 20 minutes.

**Human Review Required:** Yes — always. Founder reviews for accuracy, tone, and personalization before sending.

**Future API Integrations:** Anthropic API → PandaDoc API (auto-populate template)

---

## Automation 2: Discovery Call Summary Generator

**Purpose:** Transform raw discovery call notes into a structured, actionable summary.

**Input:**
- Raw call notes (bullet points or transcript)
- Client name and company
- Meeting date and duration

**Output:**
- Formatted summary with sections:
  - Client Background
  - Current Website Challenges
  - Business Goals
  - Budget and Timeline
  - Competitor Insights
  - Technical Requirements
  - Recommended Tier
  - Next Steps (with owner and due date)
  - Proposal Recommendation

**AI Model:** Claude claude-sonnet-5

**System Prompt Template Location:** `docs/ai-prompts/discovery-summary.md`

**Business Value:** Eliminates 30-60 min of post-call documentation per meeting. Creates a permanent searchable record.

**Human Review Required:** Yes — verify accuracy of budget, timeline, and technical requirements before filing.

**Future API Integrations:** Fireflies.ai/Otter.ai (transcription) → Claude API → CRM (auto-populate contact record)

---

## Automation 3: Meeting Note Summarizer

**Purpose:** Convert unstructured meeting notes into a clean, client-shareable summary.

**Input:**
- Raw meeting notes
- Meeting type (kickoff / design review / check-in)
- Attendees
- Date

**Output:**
- Summary header (meeting type, date, attendees)
- Key Decisions Made
- Action Items (with owner + deadline)
- Open Questions
- Next Meeting Date

**AI Model:** Claude claude-haiku-4-5 (fast, sufficient for structured output)

**Business Value:** Saves 15-20 min per meeting on documentation. Ensures clients and founder have the same record.

**Human Review Required:** Yes — particularly action items and decisions.

---

## Automation 4: Client FAQ Assistant

**Purpose:** Provide instant answers to common client questions from the knowledge base.

**Input:**
- Client question (text)
- Client context (industry, project stage, Care Plan tier)

**Output:**
- Direct answer from knowledge base
- Relevant documentation link
- Escalation flag if question requires human response

**AI Model:** Claude claude-haiku-4-5 with knowledge base as context

**Deployment:** Future client portal chatbot widget

**Business Value:** Reduces support email volume by 30-50%. Provides instant responses outside business hours.

**Human Review Required:** No for standard FAQ responses. Yes for any billing, legal, or escalated issues.

**Future API Integrations:** Supabase Vector Store (knowledge base embeddings) → Anthropic API

---

## Automation 5: Content Draft Assistant

**Purpose:** Generate first drafts of website copy for client projects.

**Input:**
- Client industry and target audience
- Page type (homepage, services, about, contact)
- Key differentiators and proof points
- Tone preferences (professional/friendly/urgent/authoritative)
- Competitor URLs for reference analysis

**Output:**
- Full page copy draft
- H1, H2, H3 hierarchy
- Hero headline and subheadline (3 options)
- Body copy with conversion-focused structure (AIDA or StoryBrand)
- CTA text options

**AI Model:** Claude claude-sonnet-5

**System Prompt Template Location:** `docs/ai-prompts/content-draft.md`

**Business Value:** Reduces copywriting time per page from 2-3 hours to 30-45 min. Enables faster project delivery.

**Human Review Required:** Yes — heavy editing for brand voice, accuracy, and client-specific nuances.

---

## Automation 6: SEO Assistant

**Purpose:** Generate SEO briefs, optimize existing copy, and create meta descriptions.

**Input:**
- Target keyword(s)
- Page URL
- Industry and location
- Existing page content (for optimization)

**Output (Brief Mode):**
- Primary keyword, secondary keywords, LSI terms
- Recommended title tag (55-60 chars)
- Recommended meta description (150-160 chars)
- H1 recommendation
- Internal linking suggestions
- Content outline with suggested word count

**Output (Optimization Mode):**
- Revised copy with keywords naturally integrated
- Schema markup suggestion
- Accessibility improvements

**AI Model:** Claude claude-sonnet-5

**Business Value:** 10x faster keyword research and on-page optimization. Consistent SEO standards across all projects.

**Human Review Required:** Yes — verify keyword intent, brand voice alignment, and accuracy.

---

## Automation 7: Accessibility Review Assistant

**Purpose:** Identify WCAG 2.1 AA accessibility issues in HTML pages.

**Input:**
- HTML file content
- Page URL
- Target screen reader(s)

**Output:**
- Accessibility findings list (Critical / High / Medium / Low)
- Each finding: element, issue, WCAG criterion, recommended fix, code snippet
- Pass/fail summary by WCAG principle (Perceivable, Operable, Understandable, Robust)

**AI Model:** Claude claude-sonnet-5 (strong HTML understanding)

**Business Value:** Replaces manual accessibility auditing on each page. Reduces audit time from hours to minutes.

**Human Review Required:** Yes — AI may miss dynamic behavior issues. Always pair with manual keyboard and screen reader testing.

---

## Automation 8: Website Audit Assistant

**Purpose:** Generate a comprehensive website audit report for prospective clients (the Free Website Audit offer).

**Input:**
- Client URL
- Industry
- Top 2-3 competitors
- Business goals stated in the audit request form

**Output:**
- Executive Summary (3 bullet points)
- Conversion Score (0-10)
- SEO Score (0-10)
- Performance Score (from Lighthouse)
- Design & UX Score (0-10)
- Accessibility Score (0-10)
- Priority recommendations (top 5, ranked by revenue impact)
- Competitor comparison table
- Proposed RCS solution

**AI Model:** Claude claude-sonnet-5

**Business Value:** Delivers a premium, personalized audit in minutes. Converts audit requests into discovery calls.

**Human Review Required:** Yes — scores and recommendations must be verified before delivery.

**Future API Integrations:** Google PageSpeed Insights API + Lighthouse API → Claude API → PDF generation

---

## Automation 9: Case Study Generator

**Purpose:** Generate first-draft case studies from project data and client outcomes.

**Input:**
- Client name and industry (with consent)
- Project tier and scope
- Key challenges before RCS
- Solution delivered
- Measurable results (% increase in traffic, leads, bookings)
- Client quote (if provided)

**Output:**
- Full case study following the 6-section structure from CaseStudySystem.md
- Headline (3 options)
- Meta description
- Social media excerpt

**AI Model:** Claude claude-sonnet-5

**Business Value:** Removes the writing barrier from case study creation. A 30-min input session produces a publish-ready draft.

**Human Review Required:** Yes — verify all metrics, obtain client approval before publishing.

---

## Automation 10: Monthly Report Generator

**Purpose:** Auto-generate monthly performance reports for Care Plan clients.

**Input:**
- Client name and domain
- Reporting month
- GA4 data (sessions, users, conversions)
- Google Search Console data (keywords, impressions, clicks)
- Actions completed this month
- Upcoming recommendations

**Output:**
- Professional PDF report (branded with RCS logo)
- Executive summary in plain language
- Metrics table with month-over-month comparison
- Key wins highlighted
- Next month's priorities

**AI Model:** Claude claude-haiku-4-5 (fast, routine task)

**Business Value:** Eliminates 2-3 hours per client per month on manual reporting. Enables scaling Care Plans beyond 5 clients without additional time cost.

**Human Review Required:** Yes — verify all numbers, add personalized notes before sending.

**Future API Integrations:** GA4 Data API + Search Console API → Claude API → PDF generation → Resend (email delivery)

---

## Automation 11: Internal Knowledge Assistant

**Purpose:** Give the RCS team (founder + future contractors) instant access to documented standards, processes, and client context.

**Input:**
- Natural language question (e.g., "What's our process for handling revision round 3 escalations?")

**Output:**
- Direct answer from internal knowledge base
- Relevant documentation section and link
- Confidence indicator

**AI Model:** Claude claude-sonnet-5 with internal docs as context

**Business Value:** Reduces time spent searching documentation. Enables faster onboarding of contractors. Creates a living, queryable operations manual.

**Human Review Required:** No for reference queries. Yes for any process changes or policy updates.

**Future API Integrations:** Notion/GitHub docs → embedding pipeline → Supabase Vector → Anthropic API

---

## AI Prompt Library

All system prompts are stored and version-controlled in:

```
docs/ai-prompts/
├── proposal-generator.md
├── discovery-summary.md
├── meeting-notes.md
├── content-draft.md
├── seo-brief.md
├── seo-optimize.md
├── accessibility-review.md
├── website-audit.md
├── case-study.md
├── monthly-report.md
└── knowledge-assistant.md
```

Each prompt file includes:
- System prompt (role + constraints + output format)
- Input template
- Example output
- Version and change log

---

## Model Selection Guide

| Use Case | Model | Reason |
|----------|-------|---------|
| Complex reasoning, proposals, copy | claude-sonnet-5 | Highest quality output |
| Fast structured tasks, summaries | claude-haiku-4-5 | Speed and cost efficiency |
| Research and analysis | claude-sonnet-5 | Best analytical reasoning |
| Real-time chatbot | claude-haiku-4-5 | Latency requirements |

---

## Data Privacy Considerations

- **Never send** full client contracts, invoices, or personal financial data to external AI APIs
- Use **client ID references**, not full names, in batch processing pipelines
- **Opt-in documentation** required before client data is processed by AI tools
- Store AI-generated outputs in the same secure location as manual documents
- Review Anthropic's data processing terms annually

---

## Technical Notes

- All AI integrations use the Anthropic API (not third-party wrappers)
- API keys stored in environment variables — never in code
- All AI calls are logged for quality review and prompt improvement
- Rate limiting and error handling required on all API calls

## Future Enhancements

- Fine-tuned model on RCS brand voice and past proposals (when volume supports it)
- Multi-step agentic workflows (e.g., audit → proposal → send — with human checkpoints)
- Real-time client portal AI assistant
- Automated competitor monitoring with AI summary
