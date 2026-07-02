# AI Automation Framework
## Roman Creative Studio — Agency Operating System

**Owner:** CTO / Founder
**Version:** 1.0
**Last Updated:** 2026-06-30
**Related Documents:** AutomationRoadmap.md, DiscoveryCallSystem.md, CRMArchitecture.md, IntegrationReadiness.md

---

## Purpose

Define AI-powered internal workflows that multiply the productivity of a one-person agency — allowing Roman Creative Studio to deliver at the quality and volume of a 5-person team while maintaining the personal, premium experience of a boutique studio.

## AI Framework Philosophy

1. **AI drafts, humans approve.** No AI output goes to clients without human review.
2. **Context is everything.** All AI tools are fed RCS brand voice, client context, and structured inputs.
3. **Augmentation, not replacement.** AI handles the 80% repetitive portion; the founder adds the 20% that makes it personal and premium.
4. **Privacy first.** No client PII sent to external AI APIs without documented consent.

---

## Automation 1: Proposal Generator

**AI Model:** Claude (claude-haiku-4-5 for speed, claude-sonnet-5 for quality)
**Business Value:** Reduces proposal writing time from 3-4 hours to 20 minutes.
**Human Review Required:** Yes — always.

**Input:** Discovery call summary, client name/industry/URL, selected tier (BUILD/GROW/SCALE), pain points, goals, timeline
**Output:** Full proposal (3-5 pages), executive summary, scope of work, investment summary, social proof, CTA

---

## Automation 2: Discovery Call Summary Generator

**AI Model:** Claude claude-sonnet-5
**Business Value:** Eliminates 30-60 min of post-call documentation per meeting.
**Human Review Required:** Yes — verify accuracy of budget, timeline, technical requirements.

**Output Sections:** Client Background, Current Challenges, Business Goals, Budget/Timeline, Competitor Insights, Technical Requirements, Recommended Tier, Next Steps, Proposal Recommendation

---

## Automation 3: Meeting Note Summarizer

**AI Model:** Claude claude-haiku-4-5
**Business Value:** Saves 15-20 min per meeting on documentation.
**Output:** Summary header, Key Decisions, Action Items (with owner + deadline), Open Questions, Next Meeting Date

---

## Automation 4: Client FAQ Assistant

**AI Model:** Claude claude-haiku-4-5 with knowledge base as context
**Deployment:** Future client portal chatbot widget
**Business Value:** Reduces support email volume by 30-50%.
**Future:** Supabase Vector Store (knowledge base embeddings) → Anthropic API

---

## Automation 5: Content Draft Assistant

**AI Model:** Claude claude-sonnet-5
**Business Value:** Reduces copywriting time per page from 2-3 hours to 30-45 min.
**Output:** Full page copy draft with H1/H2/H3 hierarchy, hero headline options, AIDA/StoryBrand body copy, CTA text options

---

## Automation 6: SEO Assistant

**AI Model:** Claude claude-sonnet-5
**Business Value:** 10x faster keyword research and on-page optimization.
**Output (Brief Mode):** Primary/secondary/LSI keywords, title tag, meta description, H1, internal links, content outline
**Output (Optimization Mode):** Revised copy with keywords, schema markup suggestion, accessibility improvements

---

## Automation 7: Accessibility Review Assistant

**AI Model:** Claude claude-sonnet-5
**Business Value:** Reduces audit time from hours to minutes.
**Output:** Findings list (Critical/High/Medium/Low), WCAG criterion, recommended fix, code snippet, pass/fail by WCAG principle

---

## Automation 8: Website Audit Assistant

**AI Model:** Claude claude-sonnet-5
**Business Value:** Delivers a premium, personalized audit in minutes. Converts audit requests into discovery calls.
**Future:** Google PageSpeed Insights API + Lighthouse API → Claude API → PDF generation
**Output:** Conversion/SEO/Performance/Design/Accessibility scores (0-10), top 5 priority recommendations, competitor comparison table, proposed RCS solution

---

## Automation 9: Case Study Generator

**AI Model:** Claude claude-sonnet-5
**Business Value:** Removes the writing barrier from case study creation.
**Output:** Full case study (6 sections), headline options, meta description, social media excerpt

---

## Automation 10: Monthly Report Generator

**AI Model:** Claude claude-haiku-4-5
**Business Value:** Eliminates 2-3 hours per client per month on manual reporting.
**Future:** GA4 Data API + Search Console API → Claude API → PDF generation → Resend
**Output:** Professional PDF report, executive summary in plain language, metrics table (MoM comparison), key wins, next month's priorities

---

## Automation 11: Internal Knowledge Assistant

**AI Model:** Claude claude-sonnet-5 with internal docs as context
**Business Value:** Reduces time searching documentation. Enables faster contractor onboarding.
**Future:** GitHub docs → embedding pipeline → Supabase Vector → Anthropic API

---

## AI Prompt Library

All system prompts stored at `docs/ai-prompts/`: proposal-generator, discovery-summary, meeting-notes, content-draft, seo-brief, seo-optimize, accessibility-review, website-audit, case-study, monthly-report, knowledge-assistant

## Model Selection Guide

| Use Case | Model |
|----------|-------|
| Complex reasoning, proposals, copy | claude-sonnet-5 |
| Fast structured tasks, summaries | claude-haiku-4-5 |
| Real-time chatbot | claude-haiku-4-5 |

## Data Privacy

- Never send full client contracts, invoices, or personal financial data to external AI APIs
- Use client ID references, not full names, in batch processing pipelines
- Opt-in documentation required before client data is processed by AI
- All AI integrations use the Anthropic API directly; API keys in environment variables only
