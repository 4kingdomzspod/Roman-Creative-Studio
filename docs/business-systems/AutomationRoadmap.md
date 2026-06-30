# Automation Roadmap
## Roman Creative Studio — Agency Operating System

**Owner:** CTO / Founder
**Version:** 1.0
**Last Updated:** 2026-06-30
**Related Documents:** CRMArchitecture.md, AIAutomationFramework.md, IntegrationReadiness.md

---

## Purpose

Map every workflow at Roman Creative Studio that is suitable for full or partial automation — documenting the current manual state, the target automated state, the trigger, tools required, and the human touchpoints that must remain.

## Business Value

Automation is not about removing people from the process — it is about removing people from the *repetitive logistics* of the process so they can invest their attention where it matters: relationships, strategy, and craft.

---

## Automation Principles

1. **Automate the predictable. Personalize the important.**
2. **Every automation has a human checkpoint before client delivery.**
3. **Simple tools before complex ones.** Email rules before Zapier. Zapier before custom webhooks.
4. **Log everything.** Every automated action should be traceable.
5. **Fail gracefully.** Automation failures should notify the founder, not silently drop data.

---

## Tier 1: Immediate Automations (Week 1-4)

These can be built with simple tools (Zapier, Formspree, MailerLite) and require no custom code.

### AUTO-01: Contact Form → CRM + Notification

**Current State:** Form submits locally (JS mock). Data is lost.

**Target State:**
```
Contact Form Submit
    ↓
Formspree / Resend (backend)
    ↓
  ├─ Lead record created in CRM (HubSpot/Airtable)
  ├─ Confirmation email sent to lead ("We received your message")
  └─ Notification to founder (email/SMS with lead details)
```

**Trigger:** Form submission event
**Tools:** Formspree or custom Resend endpoint + Zapier + HubSpot Free
**Human Checkpoint:** Founder reviews new lead within 4 business hours
**Effort:** Low (2-4 hours setup)
**Priority:** CRITICAL — implement immediately

---

### AUTO-02: Lead Magnet Download → Email Sequence

**Current State:** `resources.html` links are placeholder. No backend.

**Target State:**
```
Resource Download Request (email form on resources.html)
    ↓
MailerLite subscriber created (tagged by resource type)
    ↓
Delivery email sent with download link
    ↓
6-email nurture sequence (see EmailMarketingSystem.md)
```

**Trigger:** Form submission on resources.html
**Tools:** MailerLite (already available via MCP) + Resend for delivery
**Human Checkpoint:** None — fully automated. Founder reviews sequence performance monthly.
**Effort:** Low
**Priority:** HIGH

---

### AUTO-03: Discovery Call Booking → Confirmation + Pre-Call Brief

**Current State:** `book.html` has no live Calendly integration.

**Target State:**
```
Calendly Booking Confirmed
    ↓
  ├─ CRM: Lead stage → Discovery
  ├─ Confirmation email to prospect (with Zoom link + pre-call questionnaire)
  ├─ 24hr reminder to prospect
  ├─ 1hr reminder to prospect
  └─ Pre-call brief auto-generated and emailed to founder
```

**Trigger:** Calendly webhook: `invitee.created`
**Tools:** Calendly + Zapier + MailerLite/Resend
**Human Checkpoint:** Founder reviews pre-call brief before the meeting
**Effort:** Low-Medium
**Priority:** CRITICAL

---

### AUTO-04: No-Show Follow-Up

**Current State:** Founder manually sends follow-up emails.

**Target State:**
```
Calendly: Meeting end time passes with no completion event
    ↓
30-minute delay
    ↓
Zapier checks: Did meeting happen? (Calendly API)
    ↓
  If no-show:
    ├─ Email sent to prospect: "Looks like something came up"
    └─ CRM: Flag as No-Show, set 48hr follow-up task
```

**Trigger:** Calendly event time + absence of completion signal
**Tools:** Calendly + Zapier + Resend
**Human Checkpoint:** Founder reviews no-show log daily
**Effort:** Medium
**Priority:** MEDIUM

---

### AUTO-05: Newsletter Subscription → MailerLite

**Current State:** Newsletter checkbox on contact.html captures consent but delivers it nowhere.

**Target State:**
```
Contact Form Submit (newsletter: checked)
    ↓
MailerLite API: Add subscriber to "Website Contacts" group
    ↓
Welcome email sequence triggered
```

**Trigger:** Contact form with newsletter=true
**Tools:** MailerLite API + form backend
**Human Checkpoint:** None
**Effort:** Low (< 1 hour once form backend exists)
**Priority:** HIGH

---

## Tier 2: Growth Automations (Month 2-3)

Require CRM + e-signature platform + Stripe integration.

### AUTO-06: Deposit Received → Project Launch

**Current State:** Founder manually sends welcome email, creates folders, sets up PM tool.

**Target State:**
```
Stripe: Payment received (invoice: Milestone 1)
    ↓
  ├─ CRM: Stage → Client
  ├─ PM Tool: Project created from template
  ├─ Google Drive: Client folder structure created
  ├─ Welcome email sent (with folder link and next steps)
  ├─ Milestone 2 and 3 invoices created (draft)
  └─ Brand questionnaire email triggered
```

**Trigger:** Stripe webhook: `payment_intent.succeeded` (milestone 1 invoice)
**Tools:** Stripe + Zapier + Google Drive API + PM Tool API + Resend
**Human Checkpoint:** Founder reviews project setup within 24 hours
**Effort:** High (full-day setup)
**Priority:** HIGH

---

### AUTO-07: Design Approval → Milestone 2 Invoice

**Current State:** Founder manually sends invoice after receiving written design approval.

**Target State:**
```
Client emails approval (or clicks "Approve" in future portal)
    ↓
CRM: Milestone: Design Approved
    ↓
Stripe: Milestone 2 invoice sent automatically
    ↓
Resend: Email to client: "Your design is approved — invoice attached"
```

**Trigger:** Manual trigger in CRM (or future portal approval event)
**Tools:** Stripe API + Resend
**Human Checkpoint:** Founder confirms approval before triggering
**Effort:** Medium
**Priority:** MEDIUM

---

### AUTO-08: Site Launch → Post-Launch Sequence

**Current State:** Founder manually sends launch celebration, testimonial request, Care Plan offer.

**Target State:**
```
CRM: Stage → Launch
    ↓
  Day 0: Launch celebration email to client
  Day 3: Care Plan offer email
  Day 14: Testimonial request email
  Day 30: 30-day check-in email ("How's everything going?")
  Day 45: Case study invitation (if Care Plan active)
```

**Trigger:** CRM stage change to "Launch"
**Tools:** MailerLite sequence or Resend + date-based automation
**Human Checkpoint:** Founder personalizes Day 0 email before sending
**Effort:** Medium
**Priority:** HIGH

---

### AUTO-09: Care Plan Renewal Reminder

**Current State:** No renewal reminder system.

**Target State:**
```
60 days before Care Plan anniversary:
    ↓
Email: "Your care plan anniversary is coming up — let's review your results"
    ↓
30 days before:
    ↓
Email: "Annual review + what's next for your site"
    ↓
Stripe: Subscription renews automatically (no action needed unless upgrade)
```

**Trigger:** Stripe subscription + date calculation
**Tools:** Stripe webhooks + Resend
**Human Checkpoint:** Founder reviews account 30 days before renewal; reaches out if upgrade opportunity
**Effort:** Medium
**Priority:** MEDIUM

---

### AUTO-10: Billing Failure → Recovery

**Current State:** No automated billing failure handling.

**Target State:**
```
Stripe: Payment failed
    ↓
  Day 0: Automated Stripe retry
  Day 1: Email to client: "We had trouble processing your payment"
  Day 3: Second Stripe retry
  Day 5: Email: "Action required — your care plan is at risk"
  Day 7: CRM: Flag as At-Risk; founder notification
  Day 10: If still failed: Care Plan paused; founder contacts client directly
```

**Trigger:** Stripe webhook: `invoice.payment_failed`
**Tools:** Stripe built-in retry + Stripe webhook + Resend
**Human Checkpoint:** Founder contacts client directly if billing fails 3 times
**Effort:** Low (Stripe handles most of this natively)
**Priority:** HIGH

---

## Tier 3: Intelligence Automations (Month 4-6)

Require custom development or advanced API integrations.

### AUTO-11: Discovery Notes → AI Proposal Draft

```
Founder completes post-call notes template
    ↓
AI Proposal Generator (Anthropic API)
    ↓
Proposal draft emailed to founder for review
    ↓
Founder edits and personalizes
    ↓
Sent via e-signature platform
```

**Tools:** Claude API + custom automation script
**Human Checkpoint:** Founder reviews + edits before sending (mandatory)
**Effort:** High

---

### AUTO-12: Monthly Report Auto-Generation

```
1st of each month:
    ↓
GA4 Data API: Pull last 30 days metrics
    ↓
Google Search Console API: Pull keyword + impression data
    ↓
Claude API: Generate report narrative
    ↓
PDF generation
    ↓
Resend: Email report to client
    ↓
Portal: Archive report in client portal
```

**Tools:** GA4 API + Search Console API + Claude API + PDF library + Resend
**Human Checkpoint:** Founder reviews AI-generated report before delivery
**Effort:** Very High (full custom build)

---

### AUTO-13: Website Audit Request → AI Audit Report

```
Audit request form submitted (audit.html)
    ↓
Queue: Audit job created
    ↓
Lighthouse API: Run performance + SEO + accessibility tests
    ↓
Claude API: Generate audit narrative
    ↓
PDF report generated
    ↓
Email delivered to prospect
    ↓
CRM: Lead record created + discovery call CTA included
```

**Tools:** Lighthouse API + Claude API + Resend + CRM webhook
**Human Checkpoint:** Founder reviews before delivery (initially); can move to fully auto once quality is verified
**Effort:** High

---

## Automation Stack Summary

| Layer | Tool | Purpose |
|-------|------|---------|
| Form Backend | Formspree or Resend | Capture and route form submissions |
| Email Marketing | MailerLite | Nurture sequences, newsletters |
| Transactional Email | Resend | Operational emails (confirmations, invoices) |
| Workflow Automation | Zapier | Connect tools without code |
| Calendar | Calendly | Discovery call booking and reminders |
| Payments | Stripe | Invoices, subscriptions, billing failure handling |
| CRM | HubSpot Free (interim) | Lead and client lifecycle |
| AI Processing | Anthropic Claude API | Proposals, reports, summaries |
| Document Automation | PandaDoc | Proposal templates, e-signatures |

---

## Technical Notes

- All Zapier flows should log errors to a dedicated Slack channel or email alias
- Stripe webhooks must be verified using the webhook signature secret (not just endpoint URL)
- All automation templates must be tested in a staging environment before activating in production
- Automation logs should be retained for 90 days minimum

## Future Enhancements

- Full n8n self-hosted automation platform to replace Zapier (more control, lower cost at scale)
- Multi-step agentic AI workflows with human approval gates
- Real-time Slack notifications for all critical business events
- Automated competitive intelligence monitoring
