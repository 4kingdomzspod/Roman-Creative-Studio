# Integration Readiness Architecture

**Owner:** Alexander Roman / Technical Lead  
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Status:** Architecture Complete — No Live Integrations Active

---

## Purpose

Document the modular integration architecture for Roman Creative Studio's business systems. This document defines how each third-party service connects to the RCS ecosystem, what data flows between systems, and the implementation order when ready to activate. No API keys are stored here. No live connections are configured. This is the blueprint.

---

## Business Value

Building integration architecture before implementation prevents costly rewrites, ensures clean data pipelines, and allows any integration to be activated independently without disrupting others. A modular architecture means RCS can start with free tiers and upgrade tools without re-engineering the stack.

---

## Integration Principles

1. **Modular by default** — each integration is self-contained and can be removed without breaking others
2. **One source of truth** — Supabase is the canonical data store; all integrations sync to/from it
3. **Webhook-first** — prefer event-driven over polling wherever possible
4. **No vendor lock-in** — use abstraction layers so tools can be swapped
5. **Fail gracefully** — integrations should degrade silently, not crash the application
6. **Audit everything** — all integration events are logged with timestamp, source, and outcome

---

## Integration Registry

| ID | Service | Category | Priority | Status |
|----|---------|----------|----------|--------|
| INT-01 | Calendly | Scheduling | P1 | Planned |
| INT-02 | Google Workspace | Productivity | P1 | Planned |
| INT-03 | Stripe | Billing | P1 | Planned |
| INT-04 | Resend | Email Delivery | P1 | Planned |
| INT-05 | MailerLite | Email Marketing | P1 | Planned |
| INT-06 | Supabase | Database / Auth | P1 | Planned |
| INT-07 | Google Analytics 4 | Analytics | P2 | Planned |
| INT-08 | Google Search Console | SEO | P2 | Planned |
| INT-09 | HubSpot | CRM | P2 | Planned |
| INT-10 | Notion | Knowledge Base | P2 | Planned |
| INT-11 | GitHub | Version Control | P2 | Active (manual) |
| INT-12 | Cloudflare | DNS / Security | P2 | Planned |
| INT-13 | QuickBooks | Accounting | P3 | Planned |
| INT-14 | Anthropic Claude API | AI | P2 | Planned |

---

## INT-01 — Calendly

**Purpose:** Automated discovery call scheduling, eliminating back-and-forth email scheduling.  
**Category:** Scheduling  
**Plan Required:** Calendly Standard ($10/mo) or Teams ($16/mo)

### Data Flow
```
Website CTA → Calendly Embed → Booking Confirmed
    ↓
Calendly Webhook → Zapier → Supabase (lead record updated)
    ↓
Resend → Confirmation email to prospect
    ↓
Resend → Pre-call questionnaire email (24h before)
```

### Integration Points
- Embed: `book.html` page (inline widget or redirect)
- Webhook endpoint: `api.romancreativestudio.co/webhooks/calendly`
- Events to capture: `invitee.created`, `invitee.canceled`, `invitee.rescheduled`

### Fields to Sync to Supabase
- `invitee_email`, `invitee_name`, `event_start_time`, `event_type_name`, `cancellation_reason`

### Environment Variables Required
```
CALENDLY_WEBHOOK_SIGNING_KEY=
CALENDLY_API_TOKEN=
CALENDLY_EVENT_TYPE_UUID=
```

---

## INT-02 — Google Workspace

**Purpose:** Professional email (`@romancreativestudio.co`), Google Drive for client file delivery, Google Meet for discovery calls.  
**Category:** Productivity  
**Plan Required:** Google Workspace Business Starter ($6/user/mo)

### Components
- **Gmail:** `Alexander@romancreativestudio.co` (primary business email)
- **Google Drive:** Client folder structure mirroring `DocumentManagement.md`
- **Google Meet:** Default video call platform for discovery calls
- **Google Calendar:** Sync with Calendly for availability
- **Google Docs:** Proposal drafting and internal collaboration

### Integration Points
- Drive folder creation: triggered on new project creation in Supabase
- Meet links: auto-generated via Calendly integration (no separate API needed)
- Calendar sync: Calendly reads Google Calendar availability natively

### No API Integration Required
Google Workspace is used directly — no custom API connection needed at this stage. Drive API integration is a Phase 3 enhancement.

### Environment Variables Required
```
GOOGLE_WORKSPACE_DOMAIN=romancreativestudio.co
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
```

---

## INT-03 — Stripe

**Purpose:** Invoice generation, payment collection, deposit processing, recurring Care Plan billing.  
**Category:** Billing  
**Plan Required:** Stripe (pay-per-transaction, 2.9% + 30¢)

### Data Flow
```
Proposal Accepted → Stripe Invoice Created → Client Receives Email
    ↓
Client Pays → Stripe Webhook → Supabase (payment record)
    ↓
Resend → Payment confirmation email
    ↓
[If Care Plan] → Stripe Subscription → Monthly auto-charge
```

### Integration Points
- Webhook endpoint: `api.romancreativestudio.co/webhooks/stripe`
- Events to capture: `invoice.paid`, `invoice.payment_failed`, `customer.subscription.created`, `customer.subscription.deleted`, `charge.refunded`
- Client portal: Display invoices via Stripe Customer Portal embed

### Payment Structure
- Project deposits: 50% of project total
- Milestone payments: 25% design approval, 25% launch
- Care Plans: Monthly recurring via Stripe Subscriptions

### Products to Create in Stripe
```
BUILD Package      $3,500  (one-time)
GROW Package       $6,500  (one-time)
SCALE Package      custom  (one-time)
Care Plan          $197/mo (recurring)
SEO Retainer       $497/mo (recurring)
Growth Partner     $997/mo (recurring)
```

### Environment Variables Required
```
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_CARE_PLAN_PRICE_ID=
STRIPE_SEO_RETAINER_PRICE_ID=
STRIPE_GROWTH_PARTNER_PRICE_ID=
```

---

## INT-04 — Resend

**Purpose:** Transactional email delivery for all automated system emails (confirmations, invoices, onboarding, etc.)  
**Category:** Email Delivery  
**Plan Required:** Resend Free (3,000 emails/mo) → Pro ($20/mo) when scaling

### Data Flow
```
Event Trigger (booking, payment, form submit) → Supabase Function
    ↓
Resend API → Email Delivered → Delivery Event Logged in Supabase
```

### Email Templates to Build
1. Discovery call confirmation
2. Pre-call questionnaire
3. Post-call follow-up (3 variants: hot, warm, disqualified)
4. Proposal sent notification
5. Contract signed confirmation
6. Invoice issued
7. Payment received
8. Project kickoff welcome
9. Weekly project status update
10. Project launch announcement
11. Care plan activation
12. Monthly care plan report

### Domain Setup
- Sending domain: `mail.romancreativestudio.co`
- DNS records: SPF, DKIM, DMARC (configure in Cloudflare)
- From address: `Alexander@romancreativestudio.co`
- Reply-to: `Alexander@romancreativestudio.co`

### Environment Variables Required
```
RESEND_API_KEY=
RESEND_FROM_EMAIL=Alexander@romancreativestudio.co
RESEND_FROM_NAME=Alexander at Roman Creative Studio
```

---

## INT-05 — MailerLite

**Purpose:** Email marketing, newsletter, lead nurture sequences, broadcast campaigns.  
**Category:** Email Marketing  
**Plan Required:** MailerLite Free (up to 1,000 subscribers) → Growing Business ($9/mo)

### Data Flow
```
Contact Form Submit / Newsletter Signup → Zapier
    ↓
MailerLite API → Subscriber Added to List
    ↓
MailerLite Automation → Welcome sequence triggered
```

### Groups / Lists to Create
- `leads` — unqualified inquiries
- `qualified-leads` — post-discovery call, proposal stage
- `clients-active` — current paying clients
- `clients-past` — completed projects
- `newsletter` — general subscribers
- `care-plan` — active care plan clients

### Automations to Build in MailerLite
1. **New Lead Welcome** — 5-email nurture over 14 days
2. **Post-Discovery Follow-up** — 3-email sequence if no proposal accepted
3. **Client Onboarding** — 4-email sequence over first 2 weeks
4. **Monthly Newsletter** — broadcast template
5. **Care Plan Monthly** — automated monthly report email

### Environment Variables Required
```
MAILERLITE_API_KEY=
MAILERLITE_GROUP_ID_LEADS=
MAILERLITE_GROUP_ID_CLIENTS=
MAILERLITE_GROUP_ID_NEWSLETTER=
```

---

## INT-06 — Supabase

**Purpose:** Primary database, authentication, real-time subscriptions, edge functions, and file storage for client portal and internal dashboard.  
**Category:** Backend / Database  
**Plan Required:** Supabase Free → Pro ($25/mo) when portal launches

### Projects to Create
```
Project 1: rcs-portal      → portal.romancreativestudio.co
Project 2: rcs-admin       → admin.romancreativestudio.co
```

### Core Tables
- `contacts` — leads and clients
- `projects` — all client projects
- `invoices` — billing records
- `payments` — payment events
- `tasks` — project tasks
- `documents` — file metadata
- `messages` — client-RCS communication
- `audit_log` — all system events

### Auth Configuration
- Portal: Magic link (Phase 1), password + MFA (Phase 2)
- Admin: Email + password + TOTP MFA (required)
- Session timeout: 2 hours (admin), 8 hours (portal)
- Row-level security: enabled on all tables

### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=
```

---

## INT-07 — Google Analytics 4

**Purpose:** Website traffic analytics, conversion tracking, lead source attribution.  
**Category:** Analytics  
**Plan Required:** Free

### Events to Track
```
page_view           — all pages
form_submit         — contact form, audit form
cta_click           — all primary CTA buttons
calendly_open       — discovery call CTA clicked
pricing_view        — pricing page viewed
service_page_view   — individual service page viewed
resource_download   — lead magnet downloaded
```

### Conversion Goals
- Goal 1: Contact form submitted
- Goal 2: Discovery call booked
- Goal 3: Audit form submitted

### Implementation
- Add GA4 snippet to `<head>` of all HTML pages
- Use `gtag()` for custom event tracking
- Link to Google Search Console for SEO data

### Environment Variables Required
```
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## INT-08 — Google Search Console

**Purpose:** SEO performance monitoring, indexing status, keyword rankings, Core Web Vitals.  
**Category:** SEO  
**Plan Required:** Free

### Setup Steps
1. Verify domain ownership via Cloudflare DNS TXT record
2. Submit sitemap: `https://romancreativestudio.co/sitemap.xml`
3. Link to GA4 property
4. Monitor weekly: impressions, clicks, average position, Core Web Vitals

### No API Integration Required
Search Console data is reviewed manually weekly. GSC API integration is a Phase 3 enhancement for automated reporting.

---

## INT-09 — HubSpot

**Purpose:** Interim CRM for lead tracking, pipeline management, and deal tracking until Supabase custom CRM is built.  
**Category:** CRM  
**Plan Required:** HubSpot Free

### Pipeline Stages
Mirror the CRM lifecycle from `CRMArchitecture.md`:
`Visitor → Lead → Qualified → Discovery → Proposal → Negotiation → Client`

### Data Sync
- New contact form submissions → HubSpot contact via Zapier
- Discovery call booked → Deal created, stage = Discovery
- Proposal sent → Deal stage = Proposal
- Contract signed → Deal stage = Client, contact tagged `active-client`

### Migration Plan
When Supabase portal is live, export HubSpot data as CSV → import to Supabase contacts table → deactivate HubSpot.

### Environment Variables Required
```
HUBSPOT_ACCESS_TOKEN=
HUBSPOT_PORTAL_ID=
```

---

## INT-10 — Notion

**Purpose:** Internal knowledge base, SOPs, team documentation, client brief storage.  
**Category:** Knowledge Base  
**Plan Required:** Notion Plus ($8/user/mo)

### Workspaces to Create
```
RCS Internal
  ├── Operations
  ├── Sales & Marketing
  ├── Client Projects
  ├── Knowledge Base
  └── AI Prompts
```

### Sync with Supabase
Phase 3 enhancement: sync project status from Supabase to Notion project database for unified visibility.

### No API Integration Required (Phase 1)
Notion used manually as documentation hub. API integration planned for Phase 3.

---

## INT-11 — GitHub

**Purpose:** Version control for all website code, client project code, and internal tools.  
**Category:** Version Control  
**Status:** Active (used manually)

### Repository Structure
```
4kingdomzspod/roman-creative-studio   → RCS main website
4kingdomzspod/4KingdomPodcast         → Podcast site
[future] 4kingdomzspod/rcs-portal     → Client portal (Next.js)
[future] 4kingdomzspod/rcs-admin      → Internal dashboard (Next.js)
[future] 4kingdomzspod/client-*       → Per-client project repos
```

### GitHub Actions (Phase 2)
- Auto-deploy `main` branch to GitHub Pages on push
- Lighthouse CI check on pull requests
- Broken link checker on weekly schedule

---

## INT-12 — Cloudflare

**Purpose:** DNS management, DDoS protection, CDN, SSL certificates, email routing.  
**Category:** DNS / Security  
**Plan Required:** Cloudflare Free → Pro ($20/mo) for advanced WAF

### DNS Records to Configure
```
Type    Name                          Value
A       romancreativestudio.co        → GitHub Pages IP
CNAME   www                           → romancreativestudio.co
CNAME   portal                        → Vercel deployment
CNAME   admin                         → Vercel deployment
TXT     @                             → Google Workspace verification
TXT     @                             → SPF record for Resend
CNAME   resend._domainkey             → Resend DKIM
TXT     _dmarc                        → DMARC policy
MX      @                             → Google Workspace MX
```

### Security Configuration
- SSL/TLS: Full (Strict)
- HSTS: Enabled
- WAF: Default rules enabled
- Bot Fight Mode: Enabled
- Email routing: `info@` → `Alexander@romancreativestudio.co`

### Environment Variables Required
```
CLOUDFLARE_ZONE_ID=
CLOUDFLARE_API_TOKEN=
```

---

## INT-13 — QuickBooks

**Purpose:** Accounting, tax preparation, expense tracking, P&L reporting.  
**Category:** Accounting  
**Plan Required:** QuickBooks Simple Start ($17.50/mo)

### Data Flow
```
Stripe Payment Received → Zapier → QuickBooks Invoice Marked Paid
Stripe Subscription → Zapier → QuickBooks Recurring Revenue Entry
```

### Chart of Accounts
```
Income
  4000 Website Design & Development
  4100 Care Plan Revenue
  4200 SEO Retainer Revenue
  4300 Consulting Revenue
Expenses
  6000 Software Subscriptions
  6100 Contractor Payments
  6200 Marketing & Advertising
  6300 Professional Development
```

### Environment Variables Required
```
QUICKBOOKS_CLIENT_ID=
QUICKBOOKS_CLIENT_SECRET=
QUICKBOOKS_REFRESH_TOKEN=
QUICKBOOKS_REALM_ID=
```

---

## INT-14 — Anthropic Claude API

**Purpose:** AI-powered automation for proposal drafting, SEO copy, client briefs, content generation, and internal tooling.  
**Category:** AI  
**Plan Required:** Anthropic API (pay-per-token)

### Use Cases
See `AIAutomationFramework.md` for complete automation list.

### Model Selection
```
claude-sonnet-5        → Quality tasks (proposals, copy, analysis)
claude-haiku-4-5       → Speed tasks (summaries, classification, routing)
```

### Integration Points
- Supabase Edge Functions: AI tasks triggered by database events
- Internal dashboard: AI assistant sidebar
- Contact form: Auto-qualification scoring on submission

### Rate Limit Strategy
- Queue AI requests via Supabase job queue
- Retry with exponential backoff on rate limit errors
- Cache repeated prompt outputs where applicable (e.g., SEO templates)

### Environment Variables Required
```
ANTHROPIC_API_KEY=
ANTHROPIC_DEFAULT_MODEL=claude-sonnet-5
ANTHROPIC_FAST_MODEL=claude-haiku-4-5-20251001
```

---

## Integration Activation Order

| Phase | Integrations | Trigger |
|-------|-------------|--------|
| Phase 1 (Now) | Cloudflare DNS, Google Workspace, Resend | Website launch |
| Phase 1 (Now) | MailerLite, GA4, Search Console | Marketing activation |
| Phase 2 (Month 1) | Calendly, HubSpot, Stripe | First client |
| Phase 2 (Month 1) | Zapier (connecting Phase 1+2) | After tools active |
| Phase 3 (Month 3+) | Supabase, Client Portal | Portal build |
| Phase 4 (Month 6+) | Claude API, QuickBooks, Notion API | Scale |

---

## Technical Notes

- All webhook endpoints require signature verification before processing
- Store all API keys in environment variables only — never in code or docs
- Use a secrets manager (Vercel env vars, Supabase vault) for production
- Integration events must be idempotent — duplicate webhooks should not create duplicate records
- All third-party API calls should have a 10-second timeout and retry logic

---

## Future Enhancements

- [ ] Unified webhook receiver that routes all events to appropriate handlers
- [ ] Integration health dashboard showing last-sync time and error rates per integration
- [ ] Google Drive API for automatic client folder creation
- [ ] Slack integration for internal team notifications
- [ ] Zapier → native integrations migration as volume increases

---

## Related Documents

- `CRMArchitecture.md` — defines data model integrations feed into
- `AIAutomationFramework.md` — AI integrations and automation triggers
- `AutomationRoadmap.md` — phased rollout timeline
- `SecurityPrivacy.md` — secrets management and API key security
- `ClientPortalArchitecture.md` — Supabase and Stripe integration specs
