# CRM Architecture
## Roman Creative Studio — Agency Operating System

**Owner:** Revenue Operations / Founder
**Version:** 1.0
**Last Updated:** 2026-06-30
**Related Documents:** BusinessSystemsAudit.md, DiscoveryCallSystem.md, AutomationRoadmap.md, ClientOnboardingSystem.md

---

## Purpose

Define the complete customer relationship lifecycle for Roman Creative Studio — from first website visit to long-term advocate. Each stage is documented with entry/exit criteria, automation opportunities, KPIs, and owner assignments so that no lead or client relationship is managed by memory alone.

## Business Value

A structured CRM lifecycle eliminates revenue leakage from lost leads, ensures consistent client experiences, enables delegation, and surfaces upsell and referral opportunities at the right moments.

---

## CRM Philosophy

RCS is a premium, relationship-driven agency. The CRM is not a sales machine — it is a relationship intelligence system. Every touchpoint should feel personal, premium, and intentional. Automation handles logistics so the human relationship can focus on strategy and trust.

---

## Lifecycle Overview

```
Visitor → Lead → Qualified Lead → Discovery Call → Proposal
    → Negotiation → Client → Active Project → Launch
    → Maintenance → Advocate → Referral
```

---

## Stage 1: Visitor

**Purpose:** Anonymous person interacting with RCS digital properties.

**Entry Criteria:** Any page view on romancreativestudio.co

**Exit Criteria:** Submits a contact form, books a call, downloads a resource, or subscribes to the email list.

**Automation Opportunities:**
- GA4 pageview events trigger audience segments
- Exit-intent popup offering Free Website Audit (future)
- Scroll-depth triggers for resource lead magnets

**KPIs:**
- Sessions per month
- Pages per session
- Bounce rate by landing page
- Conversion rate (visitor → lead)

**Notifications:** None (anonymous)

**Owner:** Marketing / Founder

**Future Integrations:** GA4, Google Search Console, hotjar (session recording)

---

## Stage 2: Lead

**Purpose:** Someone who has expressed interest by submitting a form, booking a call, or downloading a resource.

**Entry Criteria:**
- Contact form submission on contact.html
- Discovery call booking via Calendly
- Lead magnet download on resources.html
- Direct email to Alexander@romancreativestudio.co

**Exit Criteria:**
- Responds to initial outreach → moves to Qualified Lead
- Does not respond within 5 business days → mark as Cold, add to nurture sequence
- Explicitly uninterested → mark as Disqualified

**Automation Opportunities:**
- Form submission triggers: CRM record creation + confirmation email to lead + notification to founder
- Lead magnet download triggers: delivery email + welcome sequence (see EmailMarketingSystem.md)
- Calendly booking triggers: CRM record creation + confirmation + pre-call questionnaire

**KPIs:**
- Leads per month (by source)
- Lead-to-qualified rate
- Time to first response (target: < 4 hours business hours)

**Notifications:**
- Founder: Instant email/SMS on new lead
- Lead: Confirmation email within 5 min

**Owner:** Founder

**Future Integrations:** Formspree/Resend (form backend), Calendly (scheduling), MailerLite (nurture), HubSpot/Notion (CRM record)

---

## Stage 3: Qualified Lead

**Purpose:** A lead who has been screened and meets baseline criteria for an RCS project.

**Qualification Criteria (BANT-adjusted):**
- **Budget:** Can invest $3,500+ for a project OR $197+/mo for Care Plan
- **Authority:** Decision-maker or has decision-maker access
- **Need:** Has a genuine website or digital growth need RCS can solve
- **Timeline:** Realistic project timeline (not "I need it tomorrow for free")

**Entry Criteria:** Lead has responded to outreach AND meets qualification criteria.

**Exit Criteria:**
- Discovery call scheduled → moves to Discovery Call stage
- Does not meet criteria → mark as Unqualified with reason

**Automation Opportunities:**
- Pre-qualification form sent automatically after lead responds
- CRM fields auto-populated from pre-qual form responses
- If qualified: auto-send Calendly link for discovery call

**KPIs:**
- Qualified lead rate (% of leads that qualify)
- Disqualification reasons (track top 3)
- Time from lead to qualified

**Notifications:**
- Founder: New qualified lead alert
- Lead: Personalized "You're a great fit" email with Calendly link

**Owner:** Founder

---

## Stage 4: Discovery Call

**Purpose:** A 30-minute strategy conversation to deeply understand the prospect's business, goals, challenges, and fit.

**Entry Criteria:** Discovery call scheduled in Calendly.

**Exit Criteria:**
- Call completed + proposal warranted → moves to Proposal
- Call completed + not a fit → mark as Closed-Lost with reason
- No-show (2nd attempt made) → move to Cold Nurture

**Automation Opportunities:**
- Pre-call: reminder emails at 24hr and 1hr before
- Pre-call: questionnaire sent 48hr before (see DiscoveryCallSystem.md)
- Post-call: meeting summary template triggered
- Post-call: "Proposal incoming" email sent within 1hr of call end
- Future: AI transcription + summary generation

**KPIs:**
- Show rate (target: > 80%)
- Call-to-proposal rate (target: > 60%)
- Discovery calls per month

**Notifications:**
- Founder: Calendar block + pre-call brief
- Lead: 24hr reminder + 1hr reminder + pre-call questionnaire

**Owner:** Founder

**Future Integrations:** Calendly, Zoom/Google Meet, AI transcription (Fireflies.ai, Otter.ai)

---

## Stage 5: Proposal

**Purpose:** Deliver a tailored, value-based proposal that communicates the ROI of investing in RCS.

**Entry Criteria:** Discovery call completed; decision made to submit a proposal.

**Exit Criteria:**
- Proposal accepted → moves to Negotiation or directly to Client
- Proposal rejected → mark as Closed-Lost; log reason; add to long-term nurture
- No response in 7 days → follow up automatically

**Automation Opportunities:**
- Proposal template auto-populated from CRM fields (company name, tier, goals)
- Sent via e-signature platform (PandaDoc/DocuSign)
- Viewed notification: "Prospect opened your proposal"
- Auto follow-up at Day 3 and Day 7 if no response
- Future: AI proposal generator from discovery notes

**KPIs:**
- Proposal-to-close rate (target: > 40%)
- Average proposal value
- Time from call to proposal delivery (target: < 48 hours)
- Time from proposal to decision

**Notifications:**
- Founder: Proposal opened alert
- Prospect: Proposal delivery email with personal note

**Owner:** Founder

**Future Integrations:** PandaDoc/DocuSign (e-signature), Stripe (deposit link in proposal)

---

## Stage 6: Negotiation

**Purpose:** Address objections, adjust scope if needed, and reach agreement.

**Entry Criteria:** Prospect has questions or requests changes to the proposal.

**Exit Criteria:**
- Agreement reached → moves to Client
- Cannot reach agreement → mark as Closed-Lost; log reason

**Automation Opportunities:**
- Revised proposal version auto-tracked
- Objection patterns logged for future proposal improvements

**KPIs:**
- Negotiation conversion rate
- Common objections (track top 5)
- Average discount given (should be $0 — value-based pricing)

**Notifications:** Manual — founder-led

**Owner:** Founder

---

## Stage 7: Client

**Purpose:** Prospect has accepted the proposal and paid the initial deposit.

**Entry Criteria:**
- Proposal signed via e-signature platform
- 50% deposit received via Stripe

**Exit Criteria:** Kickoff meeting completed → moves to Active Project

**Automation Opportunities:**
- Contract signed triggers: deposit invoice via Stripe + onboarding email sequence + project creation in PM tool
- Welcome email with onboarding checklist sent automatically
- Shared folder created (Google Drive or Notion)
- Kickoff meeting scheduled via Calendly

**KPIs:**
- Time from signed to kickoff (target: < 5 business days)
- Onboarding completion rate

**Notifications:**
- Client: Welcome email + invoice + onboarding checklist
- Founder: New client alert + kickoff prompt

**Owner:** Founder

**Future Integrations:** Stripe (invoicing), Google Drive/Notion (shared workspace), project management tool

---

## Stage 8: Active Project

**Purpose:** Website project in active design and development.

**Entry Criteria:** Kickoff meeting completed; project created in PM tool.

**Exit Criteria:** All pages live, client approval received, final invoice paid → moves to Launch.

**Automation Opportunities:**
- Milestone completions trigger milestone invoices (25% at design, 25% at launch)
- Weekly status update emails sent automatically
- Approval requests trigger reminder if no response in 48 hours
- Revision requests logged in PM tool automatically

**KPIs:**
- On-time delivery rate (target: > 85%)
- Revision rounds per project (target: ≤ 3)
- Client satisfaction at each milestone
- Days from kickoff to launch

**Notifications:**
- Client: Milestone completions, approval requests, weekly updates
- Founder: Overdue tasks, unreviewed approvals

**Owner:** Founder / Lead Developer

---

## Stage 9: Launch

**Purpose:** Website goes live. Final delivery, training, and handoff.

**Entry Criteria:** All pages approved; final invoice paid; DNS transferred.

**Exit Criteria:** Launch checklist completed; client trained; 30-day support window started → moves to Maintenance.

**Automation Opportunities:**
- Launch triggers: celebration email to client + Google Search Console submission + sitemap ping
- Care Plan offer sent 3 days post-launch
- Testimonial request sent 14 days post-launch
- 30-day check-in scheduled automatically

**KPIs:**
- Launch on-time rate
- Post-launch issues logged (target: < 3 minor)
- Care Plan conversion rate at launch (target: > 50%)

**Notifications:**
- Client: Launch announcement email template + training resources
- Founder: Launch checklist reminder

**Owner:** Founder

---

## Stage 10: Maintenance (Care Plan)

**Purpose:** Ongoing support, updates, SEO, and performance monitoring under a recurring Care Plan.

**Entry Criteria:** Care Plan subscription active via Stripe recurring billing.

**Exit Criteria:**
- Client cancels → offboarding workflow, offer final site export
- Upgrade to Growth Partner → moves to expanded scope

**Automation Opportunities:**
- Monthly reports generated and emailed automatically
- Billing handled by Stripe recurring
- Renewal reminders sent 30 days before annual review
- Content update requests routed via support ticket system
- Cancellation triggers: retention offer + offboarding workflow

**KPIs:**
- Monthly Recurring Revenue (MRR)
- Care Plan churn rate (target: < 5%/mo)
- Average Care Plan lifetime (target: > 18 months)
- Support ticket resolution time (target: < 48 hours)

**Notifications:**
- Client: Monthly report delivery + billing receipt
- Founder: Churn risk alerts; billing failures

**Owner:** Founder / Account Manager (future)

**Future Integrations:** Stripe (billing), GA4 (reporting), Google Search Console (SEO data)

---

## Stage 11: Advocate

**Purpose:** Happy long-term client who actively promotes RCS.

**Entry Criteria:** Client has been on Care Plan for 3+ months AND has left a positive testimonial.

**Exit Criteria:** N/A — advocates remain advocates unless relationship ends.

**Automation Opportunities:**
- Advocate identified → add to VIP email segment
- Quarterly "thank you" touchpoint
- Invite to provide case study (see CaseStudySystem.md)
- Referral program offer triggered

**KPIs:**
- Number of advocates
- Net Promoter Score (NPS) — annual survey
- Testimonials collected
- Case studies created

**Owner:** Founder

---

## Stage 12: Referral

**Purpose:** Advocate refers a new business to RCS.

**Entry Criteria:** Advocate shares a referral link or directly introduces a prospect.

**Exit Criteria:** Referred prospect enters the Visitor → Lead lifecycle.

**Automation Opportunities:**
- Unique referral links tracked per advocate
- Referral thank-you sent on first meeting with referred prospect
- Referral bonus sent on signed contract (discount on next Care Plan month, gift card, or cash referral fee)

**KPIs:**
- Referrals per quarter
- Referral close rate (typically higher than cold leads)
- Revenue attributed to referral channel

**Owner:** Founder

---

## CRM Data Schema

### Contact Record Fields

```
contact_id          UUID
first_name          String
last_name           String
email               String (unique)
phone               String
company             String
industry            Enum (dental, church, healthcare, restaurant, startup, ...)
website             URL
stage               Enum (visitor, lead, qualified, discovery, proposal, ...)
lead_source         Enum (organic, referral, social, paid, direct)
budget_range        Enum (3k-5k, 5k-8k, 8k-15k, 15k+, unknown)
assigned_to         User ID
created_at          Timestamp
last_activity_at    Timestamp
notes               Text
tags                Array<String>
newsletter          Boolean
gdpr_consent        Boolean
gdpr_consent_date   Timestamp
```

### Project Record Fields

```
project_id          UUID
client_id           UUID (FK → contact)
name                String
tier                Enum (BUILD, GROW, SCALE)
value               Integer (cents)
status              Enum (discovery, proposal, active, launched, maintenance)
start_date          Date
target_launch       Date
actual_launch       Date
milestone_1_paid    Boolean
milestone_2_paid    Boolean
milestone_3_paid    Boolean
care_plan           Boolean
care_plan_tier      Enum (care, seo, growth_partner)
care_plan_start     Date
created_at          Timestamp
updated_at          Timestamp
```

---

## Recommended Interim CRM Tools

| Tool | Cost | Best For | Limitations |
|------|------|----------|-------------|
| HubSpot Free | $0 | Pipeline visualization, email logging | Limited automation on free tier |
| Notion CRM | ~$8/mo | Flexibility, documentation integration | Manual setup required |
| Airtable | ~$10/mo | Structured data, automations | Less native CRM features |
| Custom (Supabase) | ~$25/mo | Full control, future portal integration | Build time required |

**Recommendation:** Start with HubSpot Free for immediate pipeline visibility. Migrate to Supabase-backed custom CRM when client portal is built.

---

## Technical Notes

- CRM data must be stored in compliance with the Privacy Policy (see privacy.html)
- GDPR consent must be explicitly recorded at lead capture
- All automation should include human review points for high-stakes actions (proposals, contracts)
- CRM schema is designed to be portable between tools

## Future Enhancements

- AI-powered lead scoring based on behavior and qualification signals
- Predictive churn modeling for Care Plan clients
- Revenue forecasting based on pipeline stage and historical close rates
- Automated NPS surveys at key lifecycle moments
