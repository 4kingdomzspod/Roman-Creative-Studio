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

**1. Prospects:** add the business, decision-maker, website, industry/location, stage, priority, potential value, and notes. The Prospect ID and Created Date are stamped automatically.

**2. Website Audits:** record the audit, key problems, recommended fixes, scores, and audit link against the Prospect ID.

**3. Outreach Pipeline:** record each outreach attempt. When Status becomes `Sent`, the CRM stamps Date Sent, schedules a default follow-up, updates the prospect to `Contacted`, updates Last Contact Date, and logs the activity. When Status becomes `Responded`, it records the response and moves the prospect to `Responded`.

**4. Follow Ups:** use the Dashboard or Today sheet as the daily action queue. Mark a follow-up `Completed` when done; completion is stamped and logged. If a Next Follow-Up Date is entered, the next task is created automatically.

**5. Meetings:** record the pain/need, budget, timeline, decision-maker status, notes, and next action. Scheduling a meeting moves the prospect to `Meeting`. Completing the meeting logs the event without incorrectly moving the prospect backward in the pipeline.

**6. Proposals:** when Status becomes `Sent`, the CRM stamps Sent Date, creates the default next follow-up date, moves the prospect to `Proposal`, and logs the event. When Status becomes `Accepted`, Decision Date is stamped, the prospect becomes `Won`, and exactly one Client is created for that Prospect ID.

**7. Revenue:** record every payment against the Client ID. Dashboard Revenue Collected counts only Revenue rows marked `Paid`.

## Definition of done

The CRM is operational when this chain works in the actual Google Sheet:

`Prospect → Audit → Outreach → Follow-Up → Meeting → Proposal → Accepted → Client → Revenue → Dashboard`

A manual end-to-end test in the live Google Sheet is required because Apps Script behavior depends on the Sheet and authorization environment.

## Acceptance test

Use `CRM-TEST.md` after installation. It deliberately uses a fake business and requires the complete workflow to pass before the CRM is frozen.

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
