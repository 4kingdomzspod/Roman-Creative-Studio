# Integration Readiness Architecture

**Owner:** Alexander Roman / Technical Lead
**Version:** 1.0
**Last Updated:** 2026-07-01
**Status:** Architecture Complete — No Live Integrations Active

---

## Purpose

Document the modular integration architecture for Roman Creative Studio's business systems. Defines how each third-party service connects to the RCS ecosystem, what data flows between systems, and the implementation order when ready to activate. No API keys are stored here. This is the blueprint.

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
**Plan:** Standard ($10/mo) or Teams ($16/mo)
**Webhook endpoint:** `api.romancreativestudio.co/webhooks/calendly`
**Events:** `invitee.created`, `invitee.canceled`, `invitee.rescheduled`
**Fields to sync:** invitee_email, invitee_name, event_start_time, event_type_name, cancellation_reason
```
Env: CALENDLY_WEBHOOK_SIGNING_KEY, CALENDLY_API_TOKEN, CALENDLY_EVENT_TYPE_UUID
```

## INT-02 — Google Workspace
**Plan:** Business Starter ($6/user/mo)
**Components:** Gmail (`Alexander@romancreativestudio.co`), Google Drive (client folders), Google Meet (discovery calls), Google Calendar (Calendly sync)
**No API integration required at Phase 1.**
```
Env: GOOGLE_WORKSPACE_DOMAIN, GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET
```

## INT-03 — Stripe
**Data flow:** Proposal accepted → Invoice created → Client pays → Supabase payment record → Resend confirmation
**Webhook endpoint:** `api.romancreativestudio.co/webhooks/stripe`
**Events:** `invoice.paid`, `invoice.payment_failed`, `customer.subscription.created/deleted`, `charge.refunded`

**Products to create in Stripe:**
```
BUILD Package      $3,500  (one-time)
GROW Package       $6,500  (one-time)
SCALE Package      custom  (one-time)
Care Plan          $197/mo (recurring)
SEO Retainer       $497/mo (recurring)
Growth Partner     $997/mo (recurring)
```
```
Env: STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET,
     STRIPE_CARE_PLAN_PRICE_ID, STRIPE_SEO_RETAINER_PRICE_ID, STRIPE_GROWTH_PARTNER_PRICE_ID
```

## INT-04 — Resend
**Plan:** Free (3,000 emails/mo) → Pro ($20/mo) when scaling
**Sending domain:** `mail.romancreativestudio.co`
**From:** `Alexander@romancreativestudio.co`
**Email templates:** discovery call confirmation, pre-call questionnaire, post-call follow-up (3 variants), proposal sent, contract signed, invoice issued, payment received, project kickoff, weekly status, launch announcement, care plan activation, monthly report
```
Env: RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_FROM_NAME
```

## INT-05 — MailerLite
**Plan:** Free (up to 1,000 subscribers)
**Groups:** leads, qualified-leads, clients-active, clients-past, newsletter, care-plan
**Automations:** New Lead Welcome (5-email/14 days), Post-Discovery Follow-up (3-email), Client Onboarding (4-email), Monthly Newsletter, Care Plan Monthly
```
Env: MAILERLITE_API_KEY, MAILERLITE_GROUP_ID_LEADS, MAILERLITE_GROUP_ID_CLIENTS, MAILERLITE_GROUP_ID_NEWSLETTER
```

## INT-06 — Supabase
**Projects:** `rcs-portal` (portal.romancreativestudio.co), `rcs-admin` (admin.romancreativestudio.co)
**Core Tables:** contacts, projects, invoices, payments, tasks, documents, messages, audit_log
**Auth:** Portal = Magic link (Phase 1) → password + MFA (Phase 2); Admin = email + TOTP MFA (required)
**Session:** 2 hours (admin), 8 hours (portal); RLS enabled on all tables
```
Env: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET
```

## INT-07 — Google Analytics 4
**Events to track:** page_view, form_submit, cta_click, calendly_open, pricing_view, service_page_view, resource_download
**Conversion Goals:** Contact form submitted, Discovery call booked, Audit form submitted
```
Env: GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

## INT-08 — Google Search Console
**Setup:** Verify via Cloudflare DNS TXT; submit sitemap `https://romancreativestudio.co/sitemap.xml`; link to GA4
**No API integration required.** GSC API is a Phase 3 enhancement for automated reporting.

## INT-09 — HubSpot
**Plan:** HubSpot Free (interim CRM)
**Pipeline stages:** Visitor → Lead → Qualified → Discovery → Proposal → Negotiation → Client
**Migration plan:** When Supabase portal is live, export HubSpot CSV → import to Supabase contacts → deactivate HubSpot.
```
Env: HUBSPOT_ACCESS_TOKEN, HUBSPOT_PORTAL_ID
```

## INT-10 — Notion
**Plan:** Notion Plus ($8/user/mo)
**Workspaces:** Operations, Sales & Marketing, Client Projects, Knowledge Base, AI Prompts
**No API integration required at Phase 1.**

## INT-11 — GitHub
**Status:** Active (used manually)
**Repositories:** roman-creative-studio (main), 4KingdomPodcast, [future] rcs-portal, rcs-admin, client-*
**GitHub Actions (Phase 2):** Auto-deploy main → GitHub Pages, Lighthouse CI on PRs, weekly broken link checker

## INT-12 — Cloudflare
**Plan:** Free → Pro ($20/mo) for advanced WAF
**Security:** SSL/TLS Full (Strict), HSTS enabled, WAF default rules, Bot Fight Mode
**Email routing:** `info@` → `Alexander@romancreativestudio.co`
```
Env: CLOUDFLARE_ZONE_ID, CLOUDFLARE_API_TOKEN
```

## INT-13 — QuickBooks
**Plan:** Simple Start ($17.50/mo)
**Chart of Accounts:** 4000 Website Design, 4100 Care Plan Revenue, 4200 SEO Retainer, 4300 Consulting; 6000 Software, 6100 Contractor, 6200 Marketing, 6300 Professional Development
```
Env: QUICKBOOKS_CLIENT_ID, QUICKBOOKS_CLIENT_SECRET, QUICKBOOKS_REFRESH_TOKEN, QUICKBOOKS_REALM_ID
```

## INT-14 — Anthropic Claude API
**Model Selection:** claude-sonnet-5 (quality tasks), claude-haiku-4-5 (speed tasks)
**Integration Points:** Supabase Edge Functions (AI tasks), Internal dashboard (AI assistant), Contact form (auto-qualification scoring)
**Rate Limit Strategy:** Queue via Supabase job queue; retry with exponential backoff; cache repeated outputs
```
Env: ANTHROPIC_API_KEY, ANTHROPIC_DEFAULT_MODEL=claude-sonnet-5, ANTHROPIC_FAST_MODEL=claude-haiku-4-5-20251001
```

---

## Integration Activation Order

| Phase | Integrations | Trigger |
|-------|-------------|--------|
| Phase 1 (Now) | Cloudflare DNS, Google Workspace, Resend, MailerLite, GA4, Search Console | Website launch |
| Phase 2 (Month 1) | Calendly, HubSpot, Stripe, Zapier | First client |
| Phase 3 (Month 3+) | Supabase, Client Portal | Portal build |
| Phase 4 (Month 6+) | Claude API, QuickBooks, Notion API | Scale |

## Technical Notes
- All webhook endpoints require HMAC signature verification
- API keys in environment variables only — never in code or docs
- Integration events must be idempotent — duplicate webhooks must not create duplicate records
- All API calls: 10-second timeout and retry logic
