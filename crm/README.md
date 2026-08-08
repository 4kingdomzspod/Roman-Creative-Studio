# RCS CRM — Sprint 1 Core + Sprint 2 Prospect Workflow

A Google Apps Script, split across six files, that builds/updates the Roman Creative Studio outreach/sales CRM inside a Google Sheet: 11 sheets, exact headers, Settings-backed dropdown validation, consistent formatting, a live formula-driven Dashboard, one-click CSV import, and menu-driven prospect actions (Move to Outreach / Convert to Client / Archive Lead).

**Container-bound script only.** This does not require, and does not use, a Web App deployment, an API executable, an Add-on, or a Library. It's plain Apps Script attached directly to a Google Sheet — the only "deployment" step is pasting the code in and running one function once.

## Files

| File | Responsibility |
|---|---|
| [`Code.gs`](./Code.gs) | The `RCS CRM` menu, the `buildRCSCRM()` orchestrator, and the shared sheet/formatting helpers used by every other file (create-sheet-if-missing, additive header repair, freeze/style/banding/filter/resize). |
| [`CRM_Builder.gs`](./CRM_Builder.gs) | The schema: `SHEET_DEFS` — the 11 sheet names, their exact headers, and which columns get a dropdown. No logic, just the CRM's shape in one place. |
| [`CRM_Settings.gs`](./CRM_Settings.gs) | `SETTINGS_LISTS` — the six dropdown lists — plus the logic that seeds/extends the Settings sheet and applies validation elsewhere. |
| [`CRM_Dashboard.gs`](./CRM_Dashboard.gs) | Builds the Dashboard sheet: KPI cards, the pipeline-by-status breakdown, and the conversion/client metrics — all formulas. |
| [`CRM_Import.gs`](./CRM_Import.gs) | *(Sprint 2)* "Import Prospects..." — the CSV dialog, the RFC4180 parser, and `importProspectsFromCsv_`, the shared import logic. |
| [`CRM_Actions.gs`](./CRM_Actions.gs) | *(Sprint 2)* Move to Outreach / Convert to Client / Archive Lead — act on the selected Prospects row(s). |

Apps Script shares one global scope across every `.gs` file in a project (no imports/exports needed — a function or `const` defined in one file is callable/readable from any other), so this split is purely for readability; functionally it behaves as one script.

## What it builds

Running `buildRCSCRM()` creates or updates exactly these 11 sheets:

Dashboard, Prospects, Outreach Pipeline, Follow Ups, Meetings, Proposals, Clients, Revenue, Website Audits, Referral Network, Settings

| Sheet | Columns |
|---|---|
| Dashboard | — (formula-driven, no headers — see below) |
| Prospects | Business, Industry, City, Website, Phone, Email, Contact, Priority, Status, Website Score, Last Contact, Next Follow Up, Notes, Archived Date |
| Outreach Pipeline | Business, Stage, Contacted, Method, Response, Next Action, Owner, Notes |
| Follow Ups | Business, Due, Priority, Status, Reminder, Notes |
| Meetings | Business, Contact, Date, Type, Outcome, Proposal, Notes |
| Proposals | Business, Package, Value, Sent, Status, Decision, Notes |
| Clients | Business, Package, Start, Monthly, Status, Website, Notes |
| Revenue | Month, Client, Invoice, Amount, Paid, Payment Date |
| Website Audits | Business, Date, Mobile, SEO, Performance, Accessibility, Score, Notes |
| Referral Network | Name, Company, Relationship, Industry, Last Contact, Referrals, Notes |
| Settings | Lead Status, Priority, Industry, Outreach Method, Proposal Status, Project Status |

Every sheet except Dashboard gets: a frozen header row, a dark header with white bold text, a basic filter, auto-resized columns, and alternating row banding pre-applied 300 rows ahead so new rows stay styled automatically without needing to re-run the builder.

### Settings dropdown lists

| List | Values |
|---|---|
| Lead Status | New, Contacted, Follow-up 1 Sent, Follow-up 2 Sent, No Response, Call Booked, Proposal Pending, Proposal Sent, Won, Closed — Lost, Nurture, Closed — Not Interested, Do Not Contact, Archived |
| Priority | High, Medium, Low |
| Industry | Contractors, Dentists, Churches, Landscaping, HVAC, Roofing, Electricians, Plumbing, Auto Detailing, Luxury Rentals |
| Outreach Method | Email, Instagram DM, Facebook DM, Phone Call, In-Person, Referral |
| Proposal Status | Draft, Sent, Under Review, Accepted, Declined, Expired |
| Project Status | Discovery, Strategy, Design, Development, Launch, Active, Paused, Completed |

**Applied validation dropdowns:**
- Prospects: Industry, Priority, Status (Lead Status)
- Outreach Pipeline: Stage (Lead Status), Method (Outreach Method)
- Follow Ups: Priority, Status (Lead Status)
- Proposals: Status (Proposal Status)
- Clients: Status (Project Status)
- Referral Network: Industry

Each dropdown sources from a generous 50-row range on its Settings column (not just however many canonical values there are today), so a value the team appends manually in Settings also becomes a selectable option elsewhere — no re-run needed.

Columns without an obvious matching list (e.g. Meetings.Type, Meetings.Outcome) are left as free text rather than forcing a dropdown that isn't backed by a real category.

### Dashboard

Every cell on Dashboard is a label or a live formula reading from the other 10 sheets — nothing is hardcoded.

**Key Metrics (8 cards):**

| Card | Formula source |
|---|---|
| Total Prospects | Count of all rows in Prospects |
| New Leads | Prospects where Status = "New" |
| Contacted | Prospects where Status = "Contacted" |
| Follow Ups Due | Follow Ups rows with a Due date on or before today |
| Meetings Booked | Count of all logged rows in Meetings |
| Proposals Sent | Count of Proposals with a Sent date filled in |
| Active Clients | Clients where Status = "Active" |
| Monthly Revenue | Sum of Revenue.Amount where Payment Date falls in the current calendar month and Paid is checked (`EOMONTH(TODAY(),...)`, so the window always tracks the current month) |

**Pipeline Summary** — one row per value currently listed under Settings!Lead Status, each with a live `COUNTIF` against Prospects.Status. Reads the list dynamically (blank-guarded up to 30 rows), so adding a status in Settings shows up on the next rebuild with no code change.

**Conversion & Client Metrics:**
- **Outreach Conversion %** — Meetings Booked ÷ total rows logged in Outreach Pipeline.
- **Proposal Close %** — Proposals with Status "Accepted" ÷ Proposals with a Sent date filled in.
- **Client Count** — total rows in Clients, regardless of status.

Both percentage formulas and the empty-range count formulas resolve to `0` (via `IFERROR` or plain `COUNT*` semantics) rather than an error on a brand-new, empty CRM.

## Import Prospects (Sprint 2)

**RCS CRM > Import Prospects...** opens a dialog with a file picker for a CSV of leads. The file is read client-side (`FileReader`) and its raw text is sent to `importProspectsFromCsv_` via `google.script.run` — no Drive API or Picker setup, no OAuth scopes beyond what the CRM already needs.

**Column matching:** each CSV header is matched to a Prospects header by exact name (case-insensitive), plus three aliases:
- `Business Name` → `Business`
- `Owner/Contact` → `Contact`
- `Website Quality (1-10)` → `Website Score`

Any CSV column that still doesn't match anything is skipped and listed back in the report as "not imported" — nothing is silently dropped, and nothing is force-mapped into the wrong field.

**Required field:** a row with no Business Name can't be imported — it's counted as an error with a row-numbered message, not silently skipped and not force-imported with a blank name.

**Duplicate detection:** a row is a duplicate if its Business + Website (both trimmed, case-insensitive) already exists in Prospects — checked against both the existing sheet data and other rows earlier in the same file. Importing the same file twice, or a file with repeated rows, only ever adds each business once.

**CSV parsing:** a hand-rolled RFC4180 parser handles quoted fields, embedded commas and newlines inside quotes, and escaped `""` quotes — a naive `split('\n')`/`split(',')` would break on any multi-line Notes field, which real prospect data has.

**What gets reported**, shown directly in the dialog: Imported (new rows appended), Skipped (duplicates), Errors (missing Business Name), and any CSV columns that couldn't be matched.

**What's preserved:** new rows are appended below existing data with a single `setValues` call — nothing is cleared or rewritten, so existing rows, headers, banding, and validation (all pre-applied by `buildRCSCRM()` across a generous future-proofed range) are untouched. Only the Prospects filter is refreshed afterward so it covers the newly imported rows.

## Prospect Actions (Sprint 2)

Three menu actions act on whichever row(s) are currently selected in Prospects — select one row or a multi-row block, then run the action. Each shows a Yes/No confirmation naming what it's about to do (and how many rows, for a multi-row selection) before touching anything; declining does nothing.

**Move to Outreach** — copies the selected Prospect(s) into Outreach Pipeline:

| Outreach Pipeline field | Comes from |
|---|---|
| Business | Prospects.Business |
| Stage | Prospects.Status |
| Contacted | Prospects.Last Contact |
| Notes | Prospects.Notes |

Outreach Pipeline has no Website column, so duplicates are matched on Business name alone.

**Convert to Client** — copies the selected Prospect(s) into Clients:

| Clients field | Comes from |
|---|---|
| Business | Prospects.Business |
| Website | Prospects.Website |
| Notes | Prospects.Notes |
| Start | Today's date |
| Status | `Discovery` |

Duplicates are matched on Business + Website, the same convention used everywhere else in this CRM.

**Archive Lead** — the one action that edits Prospects in place rather than copying elsewhere: sets Status to `Archived` and stamps the Archived Date column with today's date.

**Never deletes records.** All three actions only ever append a new row elsewhere or edit the selected Prospects row's own cells — nothing is ever removed. **Reruns are duplicate-safe:** duplicate checks are rebuilt from the live target sheet on every call and also guard against duplicates *within* the same selection, so running an action again on an already-moved/converted row just reports a skip; running Archive Lead again on an already-archived row simply re-writes the same Status and refreshes the Archived Date.

## Safety / idempotency

- `buildRCSCRM()` is safe to run any number of times.
- **Sheets:** created only if missing (looked up by name) — never duplicated.
- **Headers:** written in full only on a truly blank sheet. On a sheet that already has headers, only whichever target headers are missing get appended *after* the existing ones — never inserted in the middle, never duplicated, never reordered. This is what let Sprint 2 rely on `Archived Date` reaching a Prospects sheet built with a version of this script that predates it, with no manual migration step.
- **Settings lists:** seeded in full the first time; on later runs, only canonical values not already present in that column get appended after what's there — a team's own additions to a list are never touched.
- **Data rows:** never read, moved, or deleted by `Code.gs`, `CRM_Builder.gs`, or `CRM_Settings.gs`. Import and the three Prospect Actions only ever *append* new rows elsewhere or edit specific cells on an explicitly selected Prospects row — see Import Prospects and Prospect Actions above for exactly what each one touches. Formatting operations (banding, filters, validation, column width) only touch formatting/structure, never cell values.
- **Dashboard is the one deliberate exception:** every cell on it is computed from the other sheets, so `buildDashboard_()` clears and redraws that one sheet on every run — there's nothing to lose, since it holds no manually-entered records, and this is what guarantees no duplicate Dashboard sections rather than trying to diff and patch a formula layout in place.

## Install steps

1. Open the target Google Sheet (a blank sheet is fine — the script also works on a sheet that already has data, including one already using an earlier version of this CRM).
2. **Extensions > Apps Script.**
3. In the Apps Script editor, delete the default `Code.gs` placeholder content, then create six script files matching the names in this folder — **Code**, **CRM_Builder**, **CRM_Settings**, **CRM_Dashboard**, **CRM_Import**, **CRM_Actions** — and paste the matching file's contents into each (use the **+** next to "Files" in the left sidebar to add each one; Apps Script appends `.gs` automatically).
4. **Save** the project (e.g. name it "RCS CRM").
5. In the function dropdown at the top of the editor, select **`buildRCSCRM`** and click **Run**.
6. The first run prompts for authorization — Google's standard OAuth consent for a script to edit its own spreadsheet (Apps Script will list "See, edit, create, and delete your spreadsheets" — that's the only permission this script needs). Review and click **Allow**.
7. Switch back to the spreadsheet tab and refresh the page (or close/reopen the sheet). An **RCS CRM** menu appears in the menu bar: **Build / Update CRM**, **Import Prospects...**, and — below a separator — **Move to Outreach**, **Convert to Client**, and **Archive Lead**, which act on whichever Prospects row(s) are selected.

Re-running `buildRCSCRM()` (from the menu or the editor) is always safe — see Safety/idempotency above.

## Sprint 1 scope (done)

The 11-sheet schema, headers, Settings lists, dropdown validation, formatting, and the live Dashboard.

## Sprint 2 scope (done, this update)

Import Prospects (CSV dialog + column matching/aliases + duplicate protection) and the three Prospect Actions (Move to Outreach / Convert to Client / Archive Lead), added as two new files without modifying `Code.gs`'s `buildRCSCRM()`, `CRM_Builder.gs`, `CRM_Settings.gs`, or `CRM_Dashboard.gs` — only `Code.gs`'s `onOpen()` menu changed, to add the new items.

**Deliberately not included in Sprint 2:** GitHub Sync, Auto Sync, or Website Audit scoring. The goal this sprint was CSV import and the three prospect-workflow actions — nothing more.

## Sprint 3 (planned): GitHub Sync, Auto Sync, Website Audit

Sprint 3 will add a sync that pulls `outreach/prospects.csv` from `RomanCreativeStudio/Roman-Creative-Studio` (branch `main`) into Prospects, an hourly auto-sync trigger, and Website Audit scoring. The file layout leaves a clean seam for the sync piece specifically: a new `CRM_Sync.gs` can call `importProspectsFromCsv_` (`CRM_Import.gs`) directly with whatever CSV text it fetches from GitHub — the column matching, alias handling, and duplicate protection are already built and don't need to be reimplemented or modified.

## Testing performed before delivery

All of the following ran against a mocked Apps Script `SpreadsheetApp`/`Ui` API in Node (`node --check` for syntax, then a full functional dry run — the closest verification possible outside Google's actual runtime, since `SpreadsheetApp` and its formula engine only exist there). 62 assertions, all passing, plus a separate 60-assertion Sprint 1 regression pass, plus individual syntax checks — nothing was committed until every check below passed.

- **Syntax:** all 6 `.gs` files individually passed `node --check`.
- **File-load-order safety:** all 6 files were concatenated and evaluated in both forward order (Code, CRM_Builder, CRM_Settings, CRM_Dashboard, CRM_Import, CRM_Actions) and full reverse order, and both built 11 sheets with no exceptions. (`CRM_Builder.gs`'s `SHEET_DEFS` still doesn't compute the Settings sheet's headers from `CRM_Settings.gs`'s `SETTINGS_LISTS` at top-level const-init time, for the same reason established in Sprint 1 — Apps Script doesn't guarantee file load order.)
- **Dashboard regression:** confirmed the Sprint 1 Dashboard — title, all 8 KPI cards with real formulas, Pipeline Summary header, Conversion & Client Metrics header — is unaffected by the two new files.
- **Import: blank CSV** and **header-only CSV** both returned `imported: 0, skipped: 0, errors: 0` with no exception.
- **Import: aliases** — a CSV using `Business Name`/`Owner/Contact`/`Website Quality (1-10)` headers (plus an unrelated `Google Rating` column) correctly mapped all three aliased fields and reported `Google Rating` as not imported.
- **Import: missing Business** — a row with no business name was counted as an error with a row-numbered message, not imported and not silently dropped.
- **Import: within-file duplicate** — the same business listed twice in one file imported once and skipped the repeat.
- **Import: existing-row duplicate protection** — re-importing the same file afterward skipped all matching rows against the now-populated sheet, imported nothing new, and left the row count unchanged.
- **Prospect Actions: correct field mapping** — verified Move to Outreach's Business/Stage/Contacted/Notes mapping, Convert to Client's Business/Website/Notes/Start(today)/Status(Discovery) mapping, and Archive Lead's Status/Archived Date, all against real values on a test row, not just report text.
- **Rerun/idempotency** — Move to Outreach and Convert to Client were each run twice on the same row; the second run appended nothing and reported a skip.
- **Multi-row selection** — selecting two Prospects rows and running Move to Outreach moved both in one pass.
- **Edge cases** — a blank-Business row on an action produced no throw and no row appended; declining the Yes/No confirmation (mocked "No") appended nothing; running an action from a non-Prospects sheet showed a guard alert instead of throwing.
- **Archived Date, additive schema, and legacy-sheet upgrade** — built a simulated *pre-Sprint-2* Prospects sheet (13 columns, no Archived Date, with a real data row) directly, then ran `buildRCSCRM()`: `Archived Date` was appended at column 14 without moving `Status` from column 9, and the pre-existing row and its Notes were untouched. Then ran Archive Lead directly against that freshly-upgraded sheet and confirmed it correctly set Status and Archived Date on the newly-added column — the additive-header path and the new feature were tested together, not just in isolation.
- **Existing data preservation** — every scenario above that appended or edited rows was checked against sheets that already had prior test data in them; nothing was ever cleared, reordered, or overwritten.
- **Formatting preserved** — Prospects/Outreach Pipeline/Clients filters, banding, and validation rules were all confirmed still present after every import and action ran.

## Remaining issues

None identified. Sprint 2 is scoped to Import Prospects and the three Prospect Actions, added as two new files with no changes to Sprint 1's `buildRCSCRM()`, schema, Settings logic, or Dashboard beyond the `onOpen()` menu additions — verified directly via the Dashboard regression and Sprint 1 test passes. GitHub Sync, Auto Sync, and Website Audit remain out of scope until Sprint 3, matching this sprint's explicit exclusion list.
