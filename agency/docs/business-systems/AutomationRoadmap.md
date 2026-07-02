# Automation Roadmap
## Roman Creative Studio — Agency Operating System

**Owner:** CTO / Founder
**Version:** 1.0
**Last Updated:** 2026-06-30
**Related Documents:** CRMArchitecture.md, AIAutomationFramework.md, IntegrationReadiness.md

---

## Purpose

Map every workflow at Roman Creative Studio suitable for full or partial automation — documenting the current manual state, target automated state, trigger, tools required, and human touchpoints that must remain.

## Automation Principles

1. **Automate the predictable. Personalize the important.**
2. **Every automation has a human checkpoint before client delivery.**
3. **Simple tools before complex ones.** Email rules before Zapier. Zapier before custom webhooks.
4. **Log everything.** Every automated action must be traceable.
5. **Fail gracefully.** Automation failures notify the founder, never silently drop data.

---

## Tier 1: Immediate Automations (Week 1-4)

### AUTO-01: Contact Form → CRM + Notification
**Tools:** Formspree or Resend + Zapier + HubSpot Free | **Priority:** CRITICAL
```
Contact Form Submit → Formspree/Resend → CRM record + confirmation email + founder notification
```

### AUTO-02: Lead Magnet Download → Email Sequence
**Tools:** MailerLite + Resend | **Priority:** HIGH
```
Resource Download → MailerLite subscriber (tagged by resource) → delivery email → 6-email nurture
```

### AUTO-03: Discovery Call Booking → Confirmation + Pre-Call Brief
**Tools:** Calendly + Zapier + MailerLite/Resend | **Priority:** CRITICAL
```
Calendly Booking → CRM stage=Discovery + confirmation email + 24hr/1hr reminders + pre-call brief to founder
```

### AUTO-04: No-Show Follow-Up
**Tools:** Calendly + Zapier + Resend | **Priority:** MEDIUM
```
Calendly event time passes → no completion signal → no-show email to prospect + CRM flag
```

### AUTO-05: Newsletter Subscription → MailerLite
**Tools:** MailerLite API + form backend | **Priority:** HIGH
```
Contact Form (newsletter=true) → MailerLite subscriber in "Website Contacts" group → welcome sequence
```

---

## Tier 2: Growth Automations (Month 2-3)

### AUTO-06: Deposit Received → Project Launch
**Tools:** Stripe + Zapier + Google Drive API + PM Tool API + Resend | **Priority:** HIGH
```
Stripe payment received → CRM stage=Client + PM project created + Drive folder + welcome email + M2/M3 invoices (draft) + brand questionnaire
```

### AUTO-07: Design Approval → Milestone 2 Invoice
**Tools:** Stripe API + Resend | **Priority:** MEDIUM
```
CRM: Design Approved → Stripe M2 invoice sent → client email: "invoice attached"
```

### AUTO-08: Site Launch → Post-Launch Sequence
**Tools:** MailerLite sequence or Resend | **Priority:** HIGH
```
CRM stage=Launch:
  Day 0: Launch celebration email
  Day 3: Care Plan offer
  Day 14: Testimonial request
  Day 30: 30-day check-in
  Day 45: Case study invitation (if Care Plan active)
```

### AUTO-09: Care Plan Renewal Reminder
**Tools:** Stripe webhooks + Resend | **Priority:** MEDIUM
```
60 days before anniversary: "Let's review your results" email
30 days before: "Annual review + what's next" email
Stripe subscription renews automatically
```

### AUTO-10: Billing Failure → Recovery
**Tools:** Stripe built-in retry + Resend | **Priority:** HIGH
```
Stripe payment failed:
  Day 0: Stripe auto-retry
  Day 1: "Trouble processing payment" email
  Day 3: Second retry
  Day 5: "Care plan at risk" email
  Day 7: CRM flag + founder notification
  Day 10: Care Plan paused; founder contacts client directly
```

---

## Tier 3: Intelligence Automations (Month 4-6)

### AUTO-11: Discovery Notes → AI Proposal Draft
**Tools:** Claude API + custom automation script
```
Founder completes post-call notes → AI Proposal Generator → draft emailed to founder → founder edits → sent via e-signature
```

### AUTO-12: Monthly Report Auto-Generation
**Tools:** GA4 API + Search Console API + Claude API + PDF library + Resend
```
1st of month → pull GA4 + GSC data → Claude API generates narrative → PDF → email to client → archive in portal
```

### AUTO-13: Website Audit Request → AI Audit Report
**Tools:** Lighthouse API + Claude API + Resend + CRM webhook
```
Audit form submitted → Lighthouse tests → Claude narrative → PDF report → email to prospect + CRM lead record
```

---

## Automation Stack Summary

| Layer | Tool | Purpose |
|-------|------|---------|
| Form Backend | Formspree or Resend | Capture and route form submissions |
| Email Marketing | MailerLite | Nurture sequences, newsletters |
| Transactional Email | Resend | Operational emails |
| Workflow Automation | Zapier | Connect tools without code |
| Calendar | Calendly | Discovery call booking |
| Payments | Stripe | Invoices, subscriptions, billing |
| CRM | HubSpot Free (interim) | Lead and client lifecycle |
| AI Processing | Anthropic Claude API | Proposals, reports, summaries |
| Document Automation | PandaDoc | Proposal templates, e-signatures |
