# RCS CRM — Sprint 1 Core + Sprint 2 Prospect Workflow + Sprint 3 GitHub Sync

A Google Apps Script, split across seven files, that builds/updates the Roman Creative Studio outreach/sales CRM inside a Google Sheet: 11 sheets, exact headers, Settings-backed dropdown validation, consistent formatting, a live formula-driven Dashboard, one-click CSV import, menu-driven prospect actions (Move to Outreach / Convert to Client / Archive Lead), and a GitHub sync (manual + hourly auto-sync) that pulls `outreach/prospects.csv` straight from this repo.

**Container-bound script only.** This does not require, and does not use, a Web App deployment, an API executable, an Add-on, or a Library. It's plain Apps Script attached directly to a Google Sheet — the only "deployment" step is pasting the code in and running one function once.

## Files

| File | Responsibility |
|---|---|
| [`Code.gs`](./Code.gs) | The `RCS CRM` menu, the `buildRCSCRM()` orchestrator, and the shared sheet/formatting helpers used by every other file (create-sheet-if-missing, additive header repair, freeze/style/banding/filter/resize). |
| [`CRM_Builder.gs`](./CRM_Builder.gs) | The schema: `SHEET_DEFS` — the 11 sheet names, their exact headers, and which columns get a dropdown. No logic, just the CRM's shape in one place. |
| [`CRM_Settings.gs`](./CRM_Settings.gs) | `SETTINGS_LISTS` — the six dropdown lists — plus the logic that seeds/extends the Settings sheet and applies validation elsewhere. |
| [`CRM_Dashboard.gs`](./CRM_Dashboard.gs) | Builds the Dashboard sheet: KPI cards, the pipeline-by-status breakdown, and the conversion/client metrics — all formulas. |
| [`CRM_Import.gs`](./CRM_Import.gs) | *(Sprint 2)* "Import Prospects..." — the CSV dialog, the RFC4180 parser, and `importProspectsFromCsv_`, the shared import logic reused by Sprint 3's sync. |
| [`CRM_Actions.gs`](./CRM_Actions.gs) | *(Sprint 2)* Move to Outreach / Convert to Client / Archive Lead — act on the selected Prospects row(s). |
| [`CRM_Sync.gs`](./CRM_Sync.gs) | *(Sprint 3)* "Sync Prospects" + Auto Sync — pulls `outreach/prospects.csv` from GitHub and hands it to `importProspectsFromCsv_`. |

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
| Settings | Lead Status, Priority, Industry, Outreach Method, Proposal Status, Project Status, plus a GitHub Sync panel (columns H:I — see below) |

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

`importProspectsFromCsv_` is what Sprint 3's GitHub Sync calls directly — the exact same function, unmodified.

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

## GitHub Sync + Auto Sync (Sprint 3)

**RCS CRM > Sync Prospects** fetches `outreach/prospects.csv` from `RomanCreativeStudio/Roman-Creative-Studio` (branch `main`) and runs it through the exact same `importProspectsFromCsv_()` used by manual CSV import — identical column matching/aliases, duplicate skipping, and append-only behavior. Nothing about how a row gets imported differs between "upload a file" and "sync from GitHub"; only where the CSV text comes from.

**Change detection (no unnecessary downloads):** each sync first makes one lightweight call to GitHub's commits API for the latest commit that touched `outreach/prospects.csv`, and compares that commit SHA against the one stored from the last sync. **If it's unchanged, the raw CSV is never fetched and the importer never runs** — this was verified directly in testing (a raw-fetch call flag that must stay `false`), not just inferred from the reported result. Only a changed SHA triggers fetching the file, pinned to that exact commit (so there's no race with something being pushed in between the two calls), followed by the import.

**Settings Sync panel:** columns H:I on Settings (separate from the six dropdown-list columns in A:F) hold:
- **Auto Sync Enabled** — a checkbox, unchecked by default (auto sync is opt-in).
- **Last Sync Time**
- **Last Commit SHA**
- **Last Sync Result** (e.g. `Imported: 2, Skipped: 0, Errors: 0`)

This is the single source of truth for sync state — nothing is hidden in `PropertiesService` or anywhere else, so what's on the sheet is the whole story, visible to anyone who opens the spreadsheet.

**What gets reported**, both in the alert after a manual sync and in the Settings panel: Imported, Skipped (duplicates), Errors, and Last Sync (timestamp) — plus up to 10 row-level error messages if any rows were skipped for missing a Business Name, same as manual import.

**Auto Sync:** `RCS CRM > Auto Sync > Enable Auto Sync` removes any existing sync trigger first, then creates exactly one hourly time-based trigger and sets the Settings checkbox to `TRUE`. `Disable Auto Sync` removes the trigger and sets the checkbox to `FALSE`. Clicking Enable (or Disable) more than once in a row is a no-op beyond the first click — verified directly by counting triggers after repeated calls, not just by reading the confirmation text. The hourly trigger callback (`hourlySyncTrigger_`) re-checks the Enabled flag itself before doing anything (rather than trusting the trigger's mere existence), runs the identical sync logic used by the menu, and is wrapped in a try/catch that logs instead of throwing — the trigger has no UI to alert, and an unattended trigger that throws repeatedly is how Google ends up silently disabling it.

**Failure handling:** a thrown network exception, a non-200 API response, GitHub's 403 rate limit, a missing/deleted CSV file (404 on the raw fetch), and an empty commit history for the path are all caught and turned into a specific, readable message — never an uncaught exception, whether the sync was run manually or by the hourly trigger.

**GITHUB_TOKEN:** an isolated, empty-by-default config constant at the top of `CRM_Sync.gs`. Left blank, since a public repo's contents and commit history are readable with no auth. If this repo is ever made private, set it there and it's sent as a request header automatically — it is never written to a log, an alert, the Settings sheet, or anywhere else visible; the only GitHub-Sync-related value that ever becomes visible is the commit SHA.

**What's preserved:** exactly what Import Prospects preserves (see above), since the sync reuses that function unmodified. The Settings Sync panel itself is provisioned once via `buildRCSCRM()` and never resets its own live values (Enabled/Last Sync Time/SHA/Result) on a rebuild — only the labels and checkbox get created if they're missing.

## Safety / idempotency

- `buildRCSCRM()` is safe to run any number of times.
- **Sheets:** created only if missing (looked up by name) — never duplicated.
- **Headers:** written in full only on a truly blank sheet. On a sheet that already has headers, only whichever target headers are missing get appended *after* the existing ones — never inserted in the middle, never duplicated, never reordered. This is what let Sprint 2 rely on `Archived Date` reaching a Prospects sheet built with a version of this script that predates it, with no manual migration step.
- **Settings lists:** seeded in full the first time; on later runs, only canonical values not already present in that column get appended after what's there — a team's own additions to a list are never touched.
- **Data rows:** never read, moved, or deleted by `Code.gs`, `CRM_Builder.gs`, or `CRM_Settings.gs`. Import, GitHub Sync, and the three Prospect Actions only ever *append* new rows elsewhere or edit specific cells on an explicitly selected/matched Prospects row — see the sections above for exactly what each one touches. Formatting operations (banding, filters, validation, column width) only touch formatting/structure, never cell values.
- **Triggers:** `enableAutoSync_` always removes every existing sync trigger before creating a new one, so repeated clicks never produce more than one. `disableAutoSync_` removes it and is a harmless no-op if none exists.
- **`Code.gs` doesn't hard-depend on `CRM_Sync.gs`:** the one line `buildRCSCRM()` added for the Sync panel is guarded (`if (typeof ensureSyncStatusBlock_ === 'function')`), so the CRM still builds correctly even if `CRM_Sync.gs` hasn't been added to the project yet — useful mid-setup, and also what let Sprint 1's and Sprint 2's original standalone test suites keep passing unmodified against this sprint's `Code.gs`.
- **Dashboard is the one deliberate exception:** every cell on it is computed from the other sheets, so `buildDashboard_()` clears and redraws that one sheet on every run — there's nothing to lose, since it holds no manually-entered records, and this is what guarantees no duplicate Dashboard sections rather than trying to diff and patch a formula layout in place.

## Install steps

1. Open the target Google Sheet (a blank sheet is fine — the script also works on a sheet that already has data, including one already using an earlier version of this CRM).
2. **Extensions > Apps Script.**
3. In the Apps Script editor, delete the default `Code.gs` placeholder content, then create seven script files matching the names in this folder — **Code**, **CRM_Builder**, **CRM_Settings**, **CRM_Dashboard**, **CRM_Import**, **CRM_Actions**, **CRM_Sync** — and paste the matching file's contents into each (use the **+** next to "Files" in the left sidebar to add each one; Apps Script appends `.gs` automatically).
4. **Save** the project (e.g. name it "RCS CRM").
5. In the function dropdown at the top of the editor, select **`buildRCSCRM`** and click **Run**.
6. The first run prompts for authorization — Google's standard OAuth consent for a script to edit its own spreadsheet (Apps Script will list "See, edit, create, and delete your spreadsheets"). Review and click **Allow**. The first time **Sync Prospects** or **Auto Sync** is used, a second authorization prompt appears for "Connect to an external service" (`UrlFetchApp`) and, for Auto Sync specifically, permission to manage triggers — both standard Apps Script consent prompts, not anything specific to this script.
7. Switch back to the spreadsheet tab and refresh the page (or close/reopen the sheet). An **RCS CRM** menu appears in the menu bar: **Build / Update CRM**, **Import Prospects...**, **Sync Prospects**, an **Auto Sync** submenu (Enable/Disable), and — below a separator — **Move to Outreach**, **Convert to Client**, and **Archive Lead**, which act on whichever Prospects row(s) are selected.

Re-running `buildRCSCRM()` (from the menu or the editor) is always safe — see Safety/idempotency above.

## Sprint 1 scope (done)

The 11-sheet schema, headers, Settings lists, dropdown validation, formatting, and the live Dashboard.

## Sprint 2 scope (done)

Import Prospects (CSV dialog + column matching/aliases + duplicate protection) and the three Prospect Actions (Move to Outreach / Convert to Client / Archive Lead).

## Sprint 3 scope (done, this update)

GitHub Sync (manual, via `RCS CRM > Sync Prospects`) and Auto Sync (hourly trigger via `RCS CRM > Auto Sync`), added as one new file (`CRM_Sync.gs`) that reuses `importProspectsFromCsv_` from `CRM_Import.gs` unmodified. `CRM_Builder.gs`, `CRM_Settings.gs`, `CRM_Dashboard.gs`, `CRM_Import.gs`, and `CRM_Actions.gs` were **not** modified at all this sprint. `Code.gs` changed in two small, targeted ways: `onOpen()` gained the Sync Prospects item and the Auto Sync submenu, and `buildRCSCRM()` gained one guarded call to provision the Settings Sync panel.

**Deliberately not included in Sprint 3:** Website Audit scoring.

## Sprint 4 (planned): Website Audit

Sprint 4 will add Website Audit scoring, populating the Website Audits sheet. The file layout leaves a clean seam for it: a new `CRM_Audit.gs` can reuse `getOrCreateSheet_`/`ensureHeaders_` (`Code.gs`) without changes to any file that exists today.

## Testing performed before delivery

All of the following ran against a mocked Apps Script `SpreadsheetApp`/`Ui`/`UrlFetchApp`/`ScriptApp` API in Node (`node --check` for syntax, then a full functional dry run — the closest verification possible outside Google's actual runtime, since these services and the Sheets formula engine only exist there). Nothing was committed until every check below passed.

**Sprint 3 (57 assertions, all passing):**
- **Syntax:** all 7 `.gs` files individually passed `node --check`.
- **File-load-order safety:** all 7 files were concatenated and evaluated in both forward order and full reverse order, and both built 11 sheets with no exceptions.
- **Settings Sync panel:** confirmed provisioned by `buildRCSCRM()` — header, all 4 labels, checkbox defaulting to unchecked, Last Sync Time/SHA starting blank — and confirmed the six dropdown-list columns (A:F) are untouched by it.
- **GitHub API / network failure handling:** a thrown network exception, an HTTP 500 from the commits API, and a 403 rate-limit response were each reported as a clear, specific message with no uncaught exception; none of them wrote a Last Commit SHA (a failed check shouldn't look like a successful one).
- **Missing CSV:** the commits API succeeding but the raw file returning 404 (file moved/deleted) was reported clearly, and the SHA was not recorded (only the failed step, not a "successful" sync).
- **No commit history for the path** was reported clearly rather than crashing on an empty array.
- **Changed SHA — new prospects imported correctly:** a 2-row CSV imported both rows; verified the Prospects sheet actually contains them (not just the reported count), and that Last Sync Time/SHA/Result were all written to the visible Settings panel.
- **Unchanged SHA — raw CSV fetch confirmed skipped:** re-synced with the same SHA and directly verified (via a call-tracking flag, not just the reported message) that the raw file fetch never happened and the importer never ran.
- **Duplicate prospects skipped / repeated sync:** re-synced the same 2 businesses under a *new* commit SHA and confirmed both were skipped as duplicates with 0 imported; then synced again with 1 genuinely new business mixed in among the 2 already-synced ones and confirmed exactly 1 new row was added.
- **Auto Sync idempotency:** calling `enableAutoSync_` three times in a row left exactly one trigger; calling `disableAutoSync_` three times in a row left exactly zero.
- **Trigger execution with no UI:** `hourlySyncTrigger_` was called directly (simulating a real trigger firing) while disabled (does nothing, no throw), while enabled (runs the sync via `Logger.log`, no throw), and while the sync itself throws a fatal error (still caught and logged, no throw) — the last case exercises the trigger's own try/catch specifically, not just the sync's internal error handling.
- **Token never exposed:** scanned every UI alert produced across the whole test run for `Authorization`/`token ` substrings and confirmed none appear (the token is blank in this public-repo config, so this checks the leak path stays closed regardless).
- **Sprint 1 + Sprint 2 regression, exercised live within the full 7-file build:** Dashboard title/KPI formulas intact; a manual `importProspectsFromCsv_` call (not via sync) still imports correctly and still respects duplicate protection; Move to Outreach and Archive Lead were run directly against freshly-added rows and produced the correct field mappings.
- **Formatting preserved:** Prospects/Outreach Pipeline/Clients filters, banding, and validation were all confirmed present after every sync, import, and action; the Lead Status list was confirmed still exactly 14 values.

**Regression (both re-run unmodified against this sprint's actual files, 0 failures):**
- **Sprint 1 suite** (60 assertions, loading only `Code.gs`/`CRM_Builder.gs`/`CRM_Settings.gs`/`CRM_Dashboard.gs`) still passes — confirms `Code.gs`'s new Sync-panel hookup is properly guarded and doesn't break the CRM when `CRM_Sync.gs` isn't present.
- **Sprint 2 suite** (62 assertions, loading the 6 pre-Sprint-3 files) still passes unmodified.

## Remaining issues

None identified. Sprint 3 is scoped to GitHub Sync + Auto Sync, added as one new file with only two small, guarded, well-isolated touches to `Code.gs` (menu items, one conditional line in `buildRCSCRM()`) — `CRM_Builder.gs`, `CRM_Settings.gs`, `CRM_Dashboard.gs`, `CRM_Import.gs`, and `CRM_Actions.gs` are byte-for-byte unchanged from Sprint 2, confirmed by both the standalone Sprint 1/2 regression suites and the live regression checks inside the Sprint 3 suite. Unchanged-SHA sync skipping the raw download, and Auto Sync creating/removing exactly one trigger, were both verified directly rather than inferred. Website Audit remains out of scope until Sprint 4, matching this sprint's explicit exclusion.
