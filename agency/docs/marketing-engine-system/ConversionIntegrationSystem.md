# Conversion Integration System
## Roman Creative Studio — Phase 7: Marketing Engine System

---

## Purpose of This Document

This document defines how every marketing channel and content asset converts qualified visitors and readers into Discovery Call bookings. Generating traffic, followers, and email subscribers is irrelevant if that attention does not translate into revenue. Every piece of marketing at RCS has a defined conversion path.

---

## Conversion Integration Philosophy

> **Every content piece must lead somewhere. Attention without direction is wasted. The job of every marketing asset is to move the right person one step closer to booking a Discovery Call.**

Conversion at RCS is not aggressive or pushy. It is structured and clear. The best clients do not want to be sold to — they want to be shown a clear path.

---

## The RCS Conversion Funnel

```
Awareness
  │  (Google search / Social media / Referral / Email)
  ▼
Interest
  │  (Blog article / Industry page / Case study / Social post)
  ▼
Consideration
  │  (Portfolio / Service page / Lead magnet / Case study)
  ▼
Intent
  │  (Discovery Call booking page / Contact form)
  ▼
Conversion
  │  (Discovery Call booked)
  ▼
Qualification
     (Sales System — see Phase 5)
```

Marketing is responsible for stages 1–4 (Awareness through Intent). Sales takes over at Conversion.

---

## CTA Placement Rules by Page Type

### Homepage
| Position | CTA | Type |
|---|---|---|
| Hero section (above fold) | `Book a Free Discovery Call` | Primary button |
| Hero section | `View Our Work` | Secondary button |
| Services section | `Learn More →` (per service) | Tertiary link |
| Case study / portfolio section | `See the Full Case Study →` | Tertiary link |
| Final section | `Book a Free Discovery Call` | Primary button |

### Service Pages
| Position | CTA | Type |
|---|---|---|
| Above fold | `Book a Free Discovery Call` | Primary button |
| After problem/solution section | `Book a Free Discovery Call` | Primary button |
| End of page | `Book a Free Discovery Call` | Primary button |

**Rule:** Service pages have one CTA only: book the Discovery Call. No lead magnet CTAs on service pages — visitors here are commercial-intent and should go directly to booking.

### Industry Pages
| Position | CTA | Type |
|---|---|---|
| Above fold | `Book a Free Discovery Call` | Primary button |
| After features section | `Download the [Industry] Website Guide` | Lead magnet CTA |
| After case study / proof section | `Book a Free Discovery Call` | Primary button |
| End of page | `Book a Free Discovery Call` | Primary button |

**Rule:** Industry pages offer the lead magnet as a secondary option for visitors not yet ready to book. This captures them into the email nurture sequence.

### Blog Articles
| Position | CTA | Type |
|---|---|---|
| After introduction (first 300 words) | Inline text link to related service/industry page | Passive internal link |
| Mid-article (50–60% scroll depth) | `Download the [Relevant Lead Magnet]` | Lead magnet CTA |
| End of article | `Book a Free Discovery Call` | Primary CTA block |

**Rule:** Blog articles have two CTAs: a lead magnet mid-article (for readers in research phase) and a Discovery Call at the end (for readers ready to act).

### Portfolio / Case Study Pages
| Position | CTA | Type |
|---|---|---|
| End of each case study | `Ready to get results like this? Book a Discovery Call.` | Primary button |
| Portfolio index page | `Start a Project →` | Primary button |

---

## Discovery Call Booking Funnel

### Booking Page Requirements
The Discovery Call booking page (`/book/` or `/discovery-call/`) must include:

- **Headline:** `Book Your Free Discovery Call`
- **Subheadline:** `30 minutes. No obligation. Walk away with clarity on what your website needs.`
- **What to expect (3 bullet points):**
  - We'll review your current website and identify what's holding it back
  - We'll discuss your business goals and what you need to achieve them
  - You'll leave with a clear recommendation — whether or not we work together
- **Embedded scheduling widget** (Calendly or equivalent)
- **Trust signals below the form:** 1–2 short testimonials from past clients
- **No navigation menu** on this page (removes distraction from conversion)
- **No footer links** on this page (same reason)

### Booking Confirmation Flow
```
Booking page → Scheduling widget (select time) → Confirmation page

Confirmation page:
  └ Headline: "You're booked. Here's what happens next."
  └ 3 steps: "Check your email for confirmation" / "We'll review your website before the call" / "Come ready to talk about your goals"
  └ CTA: "While you wait, read our [most relevant case study]"
```

### Pre-Call Email Automation
Triggered immediately on booking:
```
Email 1 (Immediate): Booking confirmation
  - Confirmation details (date, time, video link)
  - What to prepare (optional: share website URL and top 2 goals)
  - Alexander's contact if they need to reschedule

Email 2 (24 hours before call): Reminder
  - "Your Discovery Call is tomorrow"
  - Reminder of what to expect
  - Reschedule link
```

---

## Website Traffic → Lead Flow

```
Organic search visitor lands on blog article
  │
  ├─ Reads article → clicks lead magnet CTA mid-article
  │     └ Downloads lead magnet → enters Welcome Sequence
  │     └ Day 7: Discovery Call invitation email
  │
  ├─ Reads article → clicks end-of-article CTA
  │     └ Lands on Discovery Call booking page
  │     └ Books call immediately
  │
  └─ Reads article → clicks internal link to industry page
        └ Reads industry page → books Discovery Call
        OR
        └ Downloads industry lead magnet → enters nurture sequence
```

```
Social media visitor clicks bio link
  │
  ├─ Lands on lead magnet landing page → downloads → nurture sequence
  │
  └─ Lands on portfolio page → views case studies → books Discovery Call
```

```
Email subscriber receives conversion email
  │
  └─ Clicks CTA → lands on Discovery Call booking page → books
```

---

## Lead Qualification Integration

The marketing system pre-qualifies leads before they reach a Discovery Call through:

### 1. Content Alignment
The language, examples, and pricing signals in all marketing content naturally repel price-sensitive leads and attract ROI-minded clients.

**Examples of qualifying language in marketing:**
- `"For service businesses ready to invest in a website that generates ROI"`
- `"Our projects start at $5,000"`  *(include on FAQ page and pricing section if applicable)*
- `"We work with established businesses, not startups on a shoestring budget"` *(optional; use judgment)*

### 2. Lead Magnet Self-Qualification
Visitors who download a lead magnet and engage with the email sequence have already demonstrated:
- Interest in improving their website
- Willingness to invest time in research (a positive signal)
- Awareness of the problem they need solved

### 3. Booking Page Copy
The Discovery Call booking page describes the call as a conversation about ROI, goals, and investment — not a free consultation for price shoppers.

### 4. Discovery Call Form Fields
The booking form asks:
- Business type / industry
- Current website URL
- Primary goal for the call (dropdown)
- Approximate timeline
- *(Optional)* Project budget range

Leads who skip the budget field are not disqualified — it is handled in the Discovery Call itself (see Phase 5 Sales System).

---

## Conversion Tracking Requirements

All marketing conversion points must be tracked in Google Analytics 4:

| Event | GA4 Event Name | Trigger |
|---|---|---|
| Discovery Call booked | `discovery_call_booked` | Booking confirmation page load |
| Lead magnet downloaded | `lead_magnet_download` | Thank you page load |
| Email sign-up | `email_signup` | Form submission |
| Contact form submitted | `contact_form_submitted` | Contact page form submission |
| Blog article read (75% scroll) | `blog_article_engaged` | 75% scroll depth |
| Industry page CTA click | `industry_cta_click` | Button click event |

**Monthly review:** Compare conversion rates by traffic source (organic / social / email / direct) to identify which channels produce the highest-quality leads.

---

## Conversion Optimization Rules

1. **Never have two primary CTAs competing on the same screen.** One primary action per section.
2. **CTA copy is verb-first and outcome-specific.** `"Book a Free Discovery Call"` beats `"Contact Us"` every time.
3. **Remove friction from every conversion point.** Booking page has no navigation. Lead magnet forms have 2 fields only. No CAPTCHA on forms.
4. **Urgency is honest or absent.** Do not manufacture fake scarcity. If there is real limited availability, state it. If not, do not claim it.
5. **Every CTA is tracked.** If a CTA cannot be measured, it cannot be optimized.
6. **Test one variable at a time.** When A/B testing CTAs, button copy, or landing page headlines, change one element at a time and run for a minimum of 2 weeks before drawing conclusions.
7. **Conversion rate targets are reviewed monthly.** If the Discovery Call booking rate from any channel drops below target, diagnose before assuming it is a marketing problem (may be a sales message or positioning issue).

---

## Conversion Integration Checklist (New Marketing Asset Review)

Before any new marketing asset is published, verify:

- [ ] A defined primary CTA is present
- [ ] The CTA links to the correct destination (booking page, lead magnet, or service page)
- [ ] Internal links to at least 1 service or industry page are included
- [ ] The asset is tracked in GA4
- [ ] The asset is added to the content repurposing log
- [ ] The asset's conversion path is documented in the content calendar
- [ ] Brand voice has been reviewed against the Sales Messaging System
- [ ] No competing CTAs are present on the same page or in the same email
