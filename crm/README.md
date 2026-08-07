# RCS CRM Builder v1

A single Google Apps Script that turns a blank Google Sheet into the Roman Creative Studio outreach/sales CRM: 11 sheets, formatted headers, filters, alternating rows, and dropdown validation pulled from a shared Settings sheet.

Script: [`RCS_CRM_Builder.gs`](./RCS_CRM_Builder.gs)

## What it builds

| Sheet | Purpose | Columns |
|---|---|---|
| Dashboard | Reserved for a future KPI/summary view — intentionally left blank in v1 | — |
| Prospects | Master prospect list | Business, Industry, City, Website, Phone, Email, Contact, Priority, Status, Website Score, Last Contact, Next Follow Up, Notes |
| Outreach Pipeline | Per-contact outreach stage tracking | Business, Stage, Contacted, Method, Response, Next Action, Owner, Notes |
| Follow Ups | Due/overdue follow-up queue | Business, Due, Priority, Status, Reminder, Notes |
| Meetings | Discovery call log | Business, Contact, Date, Type, Outcome, Proposal, Notes |
| Proposals | Sent proposals and outcomes | Business, Package, Value, Sent, Status, Decision, Notes |
| Clients | Active/won client roster | Business, Package, Start, Monthly, Status, Website, Notes |
| Revenue | Invoice/payment log | Month, Client, Invoice, Amount, Paid, Payment Date |
| Website Audits | Per-prospect audit scoring | Business, Date, Mobile, SEO, Performance, Accessibility, Score, Notes |
| Referral Network | Referral partner contacts | Name, Company, Relationship, Industry, Last Contact, Referrals, Notes |
| Settings | Dropdown source lists (see below) | Lead Status, Priority, Industry, Outreach Method, Proposal Status, Project Status |

Every sheet except Dashboard gets: a frozen header row, a basic filter, auto-resized columns, a dark header with white bold text, and alternating row shading (pre-applied 300+ rows ahead so new rows stay styled automatically).

### Settings dropdown lists

The Settings sheet stores six lists, one per column, used to drive data validation elsewhere. Values are grounded in what's already established in this repo rather than invented:

- **Lead Status** — matches the status flow already documented in `outreach/OUTREACH_PLAYBOOK.md`.
- **Priority** — High / Medium / Low, matching `outreach/prospects.csv`.
- **Industry** — the 10 industries from the outreach research sprints.
- **Project Status** — Discovery, Strategy, Design, Development, Launch, Active, Paused, Completed, matching the build workflow described in `process.html`.
- **Outreach Method** and **Proposal Status** are standard CRM option sets (not business-specific claims), consistent with the channels already used in `outreach/cold-email.md`, `outreach/instagram-dm.md`, and `outreach/personalized-dms.md`.

Applied validation dropdowns:
- Prospects: Industry, Priority, Status (Lead Status)
- Outreach Pipeline: Stage (Lead Status), Method (Outreach Method)
- Follow Ups: Priority, Status (Lead Status)
- Proposals: Status (Proposal Status)
- Clients: Status (Project Status)
- Referral Network: Industry

Columns without an obvious matching list (e.g. Meetings.Type, Meetings.Outcome) are left as free text rather than forcing a dropdown that isn't backed by a real category.

## Install steps

1. Open the target Google Sheet (a blank sheet is fine — the script also works on a sheet that already has data).
2. **Extensions > Apps Script.**
3. Delete any placeholder code in `Code.gs`, then paste in the full contents of [`RCS_CRM_Builder.gs`](./RCS_CRM_Builder.gs).
4. **Save** the project (e.g. name it "RCS CRM Builder").
5. In the function dropdown at the top of the editor, select **`buildRCSCRM`** and click **Run**.
6. The first run will prompt for authorization — this is Google's standard OAuth consent for a script to edit its own spreadsheet. Review and click **Allow**.
7. Switch back to the spreadsheet tab and refresh the page. An **RCS CRM** menu now appears in the menu bar — use **RCS CRM > Build / Update CRM** any time you want to re-run it (e.g. after adding a new sheet manually, or to re-apply formatting).

Re-running is always safe: it only creates sheets/headers/settings values that are missing, never deletes or overwrites existing row data, and reformatting (freeze/filter/resize/colors/banding/validation) is reapplied cleanly every time.

## Validation performed before delivery

- Syntax-checked with `node --check` (Apps Script's V8 runtime is standard ES2015+ JavaScript).
- Dry-run against a mocked Sheets API (Node) covering two full `buildRCSCRM()` runs back to back:
  - Run 1 on a blank spreadsheet (default `Sheet1`) produced exactly 11 sheets, correctly renaming the default sheet to `Dashboard` instead of leaving an orphan tab.
  - Manually inserted a row of data into Prospects, then ran `buildRCSCRM()` a second time.
  - Confirmed: sheet count stayed at 11 (no duplicates), the inserted row's values were untouched, headers were unchanged, and validation rules were applied to the correct columns on Prospects and Proposals.
  - No exceptions thrown in either run.
- Because Apps Script's `SpreadsheetApp` API only exists inside Google's runtime, this dry run is the closest verification possible outside of actually running it in Sheets — final confirmation should happen on first real run per the install steps above.
