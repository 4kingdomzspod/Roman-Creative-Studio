# RCS CRM Builder v1

A single Google Apps Script that turns a blank Google Sheet into the Roman Creative Studio outreach/sales CRM: 11 sheets, formatted headers, filters, alternating rows, dropdown validation pulled from a shared Settings sheet, and a live formula-driven Dashboard.

Script: [`RCS_CRM_Builder.gs`](./RCS_CRM_Builder.gs)

## What it builds

| Sheet | Purpose | Columns |
|---|---|---|
| Dashboard | Live KPI/pipeline/activity view — see below | — (formula-driven, no headers) |
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

## Dashboard v1

Unlike every other sheet, Dashboard holds no manually-entered records — every cell is a label or a live formula pulling from the other 10 sheets. Because of that, `buildDashboard_()` clears and redraws the whole sheet on every run instead of trying to detect what changed; the end state is always identical for the same underlying data, so this can never produce duplicate sections and never touches the real records on Prospects/Clients/Revenue/etc.

**Key Metrics (8 cards)**, all `COUNTA`/`COUNTIF`/`COUNTIFS`/`SUMIFS` formulas against the other sheets — nothing hardcoded:

| Card | Formula source |
|---|---|
| Total Prospects | Count of all rows in Prospects |
| New Leads | Prospects where Status = "New" |
| Contacted | Prospects where Status = "Contacted" |
| Follow Ups Due | Follow Ups rows with a Due date on or before today |
| Meetings Booked | Count of all logged rows in Meetings |
| Proposals Sent | Count of Proposals with a Sent date filled in |
| Active Clients | Clients where Status = "Active" |
| Monthly Revenue | Sum of Revenue.Amount where Payment Date falls in the current calendar month and Paid is checked, using `EOMONTH(TODAY(), ...)` so the window always tracks the current month |

**Pipeline Summary** — one row per value currently listed under Settings!Lead Status, each with a live `COUNTIF` against Prospects.Status. Reads the list length dynamically (blank-guarded up to 30 rows), so adding a new status in Settings is picked up on the next rebuild without any code change.

**Recent Activity** — the 10 most recent Outreach Pipeline rows, sorted by Contacted date descending, via `SORT(FILTER(...))` wrapped in `IFERROR(...,"No outreach activity logged yet")` so an empty pipeline shows a message instead of a formula error.

**Conversion & Client Metrics:**
- **Outreach Conversion %** — Meetings Booked ÷ total rows logged in Outreach Pipeline (of everyone we logged a touch for, how many turned into a booked meeting).
- **Proposal Close %** — Proposals with Status "Accepted" ÷ Proposals with a Sent date filled in.
- **Client Count** — total rows in Clients, regardless of status (a companion to the Active Clients KPI card above, which is filtered to Active only).

Both percentage formulas are wrapped in `IFERROR(...,0)` so an empty CRM shows 0% instead of a `#DIV/0!` error.

## Import Prospects v1

**RCS CRM > Import Prospects...** opens a dialog with a file picker for a CSV of leads. The CSV is read client-side (`FileReader`) and its raw text is sent to `importProspectsFromCsv_` via `google.script.run` — no Drive API or Picker setup required, and no extra OAuth scopes beyond what the CRM already needs.

**How it matches columns:** each CSV header is matched to a Prospects header by exact name (case-insensitive), plus three aliases grounded in the real column names used by `outreach/prospects.csv` — `Business Name` → `Business`, `Owner/Contact` → `Contact`, `Website Quality (1-10)` → `Website Score`. Any CSV column that still doesn't match anything (e.g. `Google Rating`, `Pain Points`, `Personalized Opening`, `Contacted`, `Follow-up Date` from `prospects.csv`) is skipped and listed back in the report as "not imported" — nothing is silently dropped without being surfaced, and nothing is force-mapped into the wrong field.

**Duplicate detection:** a row is a duplicate if its Business + Website (both trimmed, case-insensitive) already exists in Prospects — checked against both the existing sheet data and other rows earlier in the same file, so importing the same file twice, or a file with repeated rows, only ever adds each business once.

**What gets reported**, shown directly in the dialog after import:
- **Imported** — new rows appended.
- **Skipped** — duplicates (already in the sheet, or repeated within the file).
- **Errors** — rows missing a Business Name (can't import a nameless prospect); each gets a row-numbered message.
- Any CSV columns that couldn't be matched to a Prospects header.

**Why it's safe to rerun:** duplicate checks are rebuilt from the live sheet on every call, so re-importing the same file (or a file with overlapping rows) only ever adds what's genuinely new. New rows are appended below the existing data with a single `setValues` call — nothing is cleared or rewritten, so existing rows, headers, banding, and validation dropdowns (all pre-applied by `buildRCSCRM()` across a generous future-proofed range) are untouched. The only formatting call the import re-runs is the Prospects filter, which is removed and recreated over the new full range so it actually covers the newly imported rows instead of going stale.

## Install steps

1. Open the target Google Sheet (a blank sheet is fine — the script also works on a sheet that already has data).
2. **Extensions > Apps Script.**
3. Delete any placeholder code in `Code.gs`, then paste in the full contents of [`RCS_CRM_Builder.gs`](./RCS_CRM_Builder.gs).
4. **Save** the project (e.g. name it "RCS CRM Builder").
5. In the function dropdown at the top of the editor, select **`buildRCSCRM`** and click **Run**.
6. The first run will prompt for authorization — this is Google's standard OAuth consent for a script to edit its own spreadsheet. Review and click **Allow**.
7. Switch back to the spreadsheet tab and refresh the page. An **RCS CRM** menu now appears in the menu bar, with two items: **Build / Update CRM** (re-run any time to add missing sheets or re-apply formatting) and **Import Prospects...** (see above).

Re-running is always safe: it only creates sheets/headers/settings values that are missing, never deletes or overwrites existing row data, and reformatting (freeze/filter/resize/colors/banding/validation) is reapplied cleanly every time.

## Validation performed before delivery

- Syntax-checked with `node --check` (Apps Script's V8 runtime is standard ES2015+ JavaScript).
- Dry-run against a mocked Sheets API (Node), extended to cover `merge`/`breakApart`/`clear`/column-width calls the Dashboard build uses, across three back-to-back `buildRCSCRM()` runs:
  1. **Blank CRM.** Produced exactly 11 sheets (default `Sheet1` renamed to `Dashboard`). Verified all 8 KPI formulas landed in the correct cells in the requested order, the Pipeline Summary block correctly reads `Settings!A2:A31`, the Recent Activity spill formula is in place with its `IFERROR` guard, and the row-40 spacer between Pipeline Summary and the metrics section is blank (no bleed-through between sections).
  2. **Immediate re-run, no data changes.** Merge count and total populated-cell count on Dashboard were identical before and after (28 merges, 97 cells both times) — confirms nothing is duplicated or drifting on repeat runs.
  3. **Added real rows to Prospects and Outreach Pipeline, then rebuilt.** Confirmed those rows were untouched by the dashboard rebuild, sheet count stayed at 11, and scanning column A for the "Key Metrics" header string found exactly one occurrence — no duplicate sections.
  - No exceptions thrown across any of the three runs.
- **Empty-CRM zero-value behavior** is verified by formula semantics rather than a live run (see caveat below): `COUNTA`/`COUNTIF`/`COUNTIFS`/`SUMIFS` all evaluate to `0` on empty ranges by definition, and the two percentage formulas and the Recent Activity spill are explicitly wrapped in `IFERROR` to turn what would otherwise be `#DIV/0!` or `#N/A` into `0`/a friendly message.
- Because Apps Script's `SpreadsheetApp` API and its formula engine only exist inside Google's runtime, this dry run (structure, cell placement, idempotency, data preservation) is the closest verification possible outside of actually running it in Sheets — confirm live formula output on first real run per the install steps above.

**Import Prospects** was dry-run separately (20 assertions, all passing) directly against `parseCsv_`/`importProspectsFromCsv_` with a mocked Sheets API:
- The CSV parser was checked against a quoted field with an embedded comma, an escaped `""` quote, and a multi-line quoted field — all parsed correctly rather than breaking on a naive `split('\n')`.
- **Blank CSV** (empty string) and **header-only CSV** both returned `imported: 0, skipped: 0, errors: 0` with no exception — the "blank CSV imports correctly" requirement.
- A `prospects.csv`-shaped file (real header names, aliases and all) imported 2 valid rows correctly mapped through the three aliases, flagged 1 row with a missing Business Name as an error, and listed the 5 unmatched columns (`Google Rating`, `Pain Points`, `Personalized Opening`, `Contacted`, `Follow-up Date`) as not imported.
- **Re-importing the exact same file** afterward produced `imported: 0, skipped: 2` and left the sheet at exactly the same row count — confirms rerun safety and duplicate skipping against existing data.
- A file with the same business listed twice produced `imported: 1, skipped: 1` — within-batch duplicates are caught too, not just duplicates against the sheet.
- A file with no recognizable Business column returned a clear error message and imported nothing, instead of guessing.
- After all of the above, Prospects' filter, banding, and validation rules (captured from the original `buildRCSCRM()` run) were confirmed still present and untouched — appending rows doesn't disturb existing formatting.
