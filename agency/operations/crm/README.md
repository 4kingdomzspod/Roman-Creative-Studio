# Roman Creative Studio — Operational CRM

## Purpose

This is the **90-day execution CRM** for Roman Creative Studio. It uses Google Sheets so there is no paid CRM dependency and keeps the workflow centered on selling.

## Included

- Dashboard with the $10,000 90-day goal
- Prospects
- Website Audits
- Outreach Pipeline
- Follow Ups
- Meetings
- Proposals
- Clients
- Revenue
- Referrals Network
- Activity Log
- Settings
- Today action view

## Setup

1. Create/open the Google Sheet that will be the RCS CRM.
2. Open **Extensions → Apps Script**.
3. Replace the default Apps Script with `Code.gs` from this folder.
4. Save.
5. Run `setupRCSCRM()` once.
6. Approve the Google authorization prompt.
7. Reload the Sheet.
8. Open **RCS CRM → Run System Check**.

The setup is designed to be rerunnable. It repairs headers, filters, validations, dashboard formulas, formatting, and the Today view without requiring you to rebuild the workbook.

## Daily workflow

**Prospects:** add the business, decision-maker, website, stage, priority, and notes. The Created Date is stamped automatically.

**Website Audits:** record the audit, key problems, recommended fixes, and audit link.

**Outreach Pipeline:** record each outreach attempt. When Status becomes `Sent`, the CRM stamps Date Sent, schedules the default follow-up, updates the prospect stage/contact date, and logs the activity.

**Follow Ups:** use the Dashboard or Today sheet as the daily action queue. Mark a follow-up `Completed` when done; completion is stamped and logged.

**Meetings:** record the pain/need, budget, timeline, decision-maker status, and next action. Completing a meeting updates the prospect stage to `Responded` so the deal can move forward without losing the meeting record.

**Proposals:** when Status becomes `Sent`, the CRM stamps Sent Date and creates the default next follow-up date. When Status becomes `Accepted`, the prospect becomes `Won` and a client record is created automatically unless one already exists.

**Revenue:** record every payment here. Dashboard revenue collected counts only Revenue rows marked `Paid`.

## Definition of done

The CRM is operational when this chain works in the actual Google Sheet:

`Prospect → Audit → Outreach → Follow-Up → Meeting → Proposal → Accepted → Client → Revenue → Dashboard`

A manual end-to-end test in the live Google Sheet is required because Apps Script behavior depends on the Sheet and authorization environment.

## 90-day freeze rule

Once the end-to-end test passes, freeze this system. During the 90-day journey, only make changes that:

- fix a real bug
- prevent lost data/history
- reduce friction in prospecting
- reduce friction in follow-up
- reduce friction in meetings/proposals
- improve client/revenue tracking

Do **not** turn this into a custom SaaS, Supabase application, client portal, ticketing system, accounting platform, or advanced AI automation project during the 90-day push.

**Goal:** spend time selling and delivering, not maintaining the CRM.
