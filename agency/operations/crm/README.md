# RCS Operational CRM

## Purpose

This is the **minimum viable operating CRM** for Roman Creative Studio's 90-day journey. It is intentionally built around Google Sheets so there is no paid CRM dependency.

The system covers the revenue path:

**Prospect → Audit → Outreach → Follow-Up → Meeting → Proposal → Client → Revenue**

It also provides a Dashboard for daily execution and a lightweight Activity Log for history.

## What is intentionally NOT included

Do not expand this into a custom SaaS, Supabase app, client portal, ticketing system, AI automation platform, or accounting system during the 90-day journey. Those belong after the revenue goal unless a real client requirement makes them necessary.

## Setup

1. Create a blank Google Sheet for RCS CRM.
2. Open **Extensions → Apps Script**.
3. Replace the default script with `Code.gs` from this folder.
4. Save and run `setupRCSCRM` once.
5. Approve the Google authorization prompt.
6. Return to the Sheet and use the **RCS CRM** menu.

The setup creates the tabs, headers, dropdowns, formulas, dashboard metrics, and daily follow-up views.

## Operating rule

If an action can be completed in the CRM in under a minute, log it. If logging it starts taking more time than selling, simplify the data—not the selling.

## Definition of done

The CRM is considered operational when this test passes:

1. Add a prospect.
2. Add an audit.
3. Log outreach.
4. Create a follow-up.
5. Record a response.
6. Create a meeting and next action.
7. Create a proposal and amount.
8. Mark the proposal accepted.
9. Create the client record.
10. Record revenue/payment.
11. Confirm Dashboard metrics update.

Once this passes, **freeze the CRM**. Only fix bugs or add something that directly removes friction from prospecting, follow-up, closing, or revenue tracking.
