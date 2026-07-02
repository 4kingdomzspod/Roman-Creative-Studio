# CRM Architecture
## Roman Creative Studio — Agency Operating System

**Owner:** Revenue Operations / Founder
**Version:** 1.0
**Last Updated:** 2026-06-30
**Related Documents:** BusinessSystemsAudit.md, DiscoveryCallSystem.md, AutomationRoadmap.md, ClientOnboardingSystem.md

---

## Purpose

Define the complete customer relationship lifecycle for Roman Creative Studio — from first website visit to long-term advocate. Each stage is documented with entry/exit criteria, automation opportunities, KPIs, and owner assignments.

## CRM Philosophy

RCS is a premium, relationship-driven agency. The CRM is a relationship intelligence system — not a sales machine. Every touchpoint should feel personal, premium, and intentional.

## Lifecycle Overview

```
Visitor → Lead → Qualified Lead → Discovery Call → Proposal
    → Negotiation → Client → Active Project → Launch
    → Maintenance → Advocate → Referral
```

---

## Stage Summary

| Stage | Entry Criteria | Key Automation | KPI |
|-------|---------------|---------------|-----|
| 1. Visitor | Any page view | GA4 segments | Sessions, bounce rate, visitor→lead rate |
| 2. Lead | Form submit, booking, resource download | CRM record + confirmation + founder notification | Leads/mo, time to first response (< 4 hrs) |
| 3. Qualified Lead | Responds + meets BANT | Pre-qual form + Calendly link | Qualified lead rate, disqualification reasons |
| 4. Discovery Call | Calendly booking | 24hr/1hr reminders + pre-call questionnaire | Show rate (> 80%), call-to-proposal rate (> 60%) |
| 5. Proposal | Discovery call completed | Template auto-populated + e-signature + Day 3/7 follow-up | Proposal-to-close rate (> 40%), time to deliver (< 48hrs) |
| 6. Negotiation | Prospect has questions | None — founder-led | Conversion rate, common objections |
| 7. Client | Contract signed + 50% deposit received | Welcome sequence + PM project + Drive folder | Time from signed to kickoff (< 5 days) |
| 8. Active Project | Kickoff complete | Milestone invoices + weekly updates + approval reminders | On-time delivery (> 85%), revision rounds (≤ 3) |
| 9. Launch | All approved + final invoice paid | Celebration email + GSC submission + Care Plan offer Day 3 + testimonial Day 14 | Care Plan conversion at launch (> 50%) |
| 10. Maintenance | Care Plan subscription active | Monthly reports + Stripe recurring + renewal reminders | MRR, churn rate (< 5%/mo), avg lifetime (> 18 mo) |
| 11. Advocate | Care Plan 3+ months + positive testimonial | VIP segment + quarterly touchpoint + referral program | NPS, testimonials collected, case studies |
| 12. Referral | Advocate refers new prospect | Unique referral link + referral bonus on signed contract | Referrals/quarter, referral close rate |

---

## CRM Data Schema

### Contact Record
```
contact_id, first_name, last_name, email (unique), phone, company, industry,
website, stage, lead_source, budget_range, assigned_to, created_at,
last_activity_at, notes, tags, newsletter (bool), gdpr_consent (bool), gdpr_consent_date
```

### Project Record
```
project_id, client_id (FK), name, tier (BUILD/GROW/SCALE), value (cents),
status, start_date, target_launch, actual_launch,
milestone_1_paid, milestone_2_paid, milestone_3_paid,
care_plan (bool), care_plan_tier (care/seo/growth_partner), care_plan_start
```

---

## Recommended Interim CRM Tools

| Tool | Cost | Best For |
|------|------|----------|
| HubSpot Free | $0 | Pipeline visualization, email logging |
| Notion CRM | ~$8/mo | Flexibility, documentation integration |
| Airtable | ~$10/mo | Structured data, automations |
| Custom (Supabase) | ~$25/mo | Full control, future portal integration |

**Recommendation:** Start with HubSpot Free. Migrate to Supabase-backed custom CRM when client portal is built.
