# RCS CRM Builder v1

A single Google Apps Script that turns a blank Google Sheet into the Roman Creative Studio outreach/sales CRM: 11 sheets, formatted headers, filters, alternating rows, dropdown validation pulled from a shared Settings sheet, a live formula-driven Dashboard, one-click CSV import, menu-driven lead workflow actions (Move to Outreach / Convert to Client / Archive Lead), and a GitHub sync that pulls `outreach/prospects.csv` straight from this repo.

Script: [`RCS_CRM_Builder.gs`](./RCS_CRM_Builder.gs)

## What it builds

| Sheet | Purpose | Columns |
|---|---|---|
| Dashboard | Live KPI/pipeline/activity view — see below | — (formula-driven, no headers) |
| Prospects | Master prospect list | Business, Industry, City, Website, Phone, Email, Contact, Priority, Status, Website Score, Last Contact, Next Follow Up, Notes, Archived Date |
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

- **Lead Status** — matches the status flow already documented in `outreach/OUTREACH_PLAYBOOK.md`, plus `Archived` (added for the Archive Lead workflow action below).
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

## Workflow Automation v1

Three menu actions cut down on manually retyping a prospect's details into another sheet. Each acts on whichever row(s) are currently selected in Prospects — select one row, several rows, or a whole block, then run the action.

**Move to Outreach** — copies the selected Prospect(s) into Outreach Pipeline:
| Outreach Pipeline field | Comes from |
|---|---|
| Business | Prospects.Business |
| Stage | Prospects.Status (copied as-is) |
| Contacted | Prospects.Last Contact |
| Notes | Prospects.Notes (preserved) |

Outreach Pipeline has no Website column, so duplicates are matched on Business name alone. Method, Response, Next Action, and Owner are left blank rather than guessed — there's no corresponding data on a Prospects row to carry over honestly.

**Convert to Client** — copies the selected Prospect(s) into Clients:
| Clients field | Comes from |
|---|---|
| Business | Prospects.Business |
| Start | Today's date |
| Status | `Discovery` (the first stage of the real build workflow in `process.html`) |
| Website | Prospects.Website |
| Notes | Prospects.Notes (preserved) |

Duplicates are matched on Business + Website, same convention as everywhere else in this CRM. Package and Monthly are left blank — pricing isn't decided at the moment of conversion, so nothing is invented there.

**Archive Lead** — the one action that edits Prospects in place rather than copying elsewhere: sets Status to `Archived` and stamps the new Archived Date column with today's date. (Prospects gained an `Archived Date` column for this — see the schema-evolution note below.)

**Confirmation:** every action shows a Yes/No confirmation dialog naming what it's about to do (and how many rows, for a multi-row selection) before touching anything. Declining does nothing.

**Duplicates and reruns:** all three actions rebuild their duplicate-check set from the live target sheet on every call and also guard against duplicates *within* the same selection, so re-running an action on a row that was already moved/converted just reports it as skipped — nothing gets added twice. Archive Lead is a plain in-place edit (no new rows), so running it again on an already-archived row simply re-writes the same Status and refreshes the Archived Date.

**What's preserved:** these actions only ever append new rows below existing data (a single `setValues` call, same as Import Prospects) or edit specific cells on the selected Prospects row — never a full-sheet rewrite. Existing rows, headers, banding, and validation dropdowns stay untouched; only the destination sheet's filter is refreshed afterward so it covers the newly added rows.

**Schema evolution note:** Archive Lead needed two things that didn't exist before this version — an `Archived` option in the Lead Status dropdown, and an `Archived Date` column on Prospects. Both `ensureHeaders_()` and `buildSettingsSheet_()` were upgraded to *append* whatever's missing (new header columns at the end, new canonical Settings values after whatever's already listed) instead of only acting on a completely blank sheet/column. That's what lets a CRM built with an earlier version of this script pick up new fields on the next **Build / Update CRM** run without losing anything — existing column positions and Settings customizations are never reordered or removed. One trade-off worth knowing: if a canonical Settings value is deliberately deleted, the next Build/Update CRM run will add it back, since that same repair logic can't distinguish "missing because it's new" from "missing because it was removed on purpose." Settings customization in v1 is additive-only.

## GitHub Sync v1

**RCS CRM > Sync Prospects** pulls the latest `outreach/prospects.csv` straight from this repo's `main` branch and runs it through the exact same `importProspectsFromCsv_()` that powers manual CSV import — same column matching (including the `Business Name`/`Owner/Contact`/`Website Quality (1-10)` aliases), same duplicate skipping, same append-only appending, same reporting shape. Nothing about how a row gets imported differs between "upload a file" and "sync from GitHub" — only where the CSV text comes from.

**How change detection works (avoiding unnecessary imports):** each sync first makes one lightweight call to GitHub's commits API for the latest commit that touched `outreach/prospects.csv`, and compares that commit SHA to the one stored from the last sync. If it's unchanged, the sync stops right there — it never fetches the file itself or re-runs the import — and reports "Already up to date." Only when the SHA differs does it fetch the raw file content (pinned to that exact commit SHA, so there's no race with something else being pushed in between the two calls) and hand it to the importer. This is a real commit SHA from GitHub's commit history for that path, not a blob hash or an ETag guess.

**What's stored, and where:** a small panel on the **Settings** sheet, columns H:I (separate from the six dropdown-list columns in A:F) — `Auto Sync Enabled` (a checkbox, unchecked by default), `Last Sync Time`, `Last Commit SHA`, and `Last Sync Result`. This is the single source of truth for sync state; nothing is hidden in Apps Script's PropertiesService or anywhere else, so what's on the sheet is the whole story and it's visible to anyone who opens the spreadsheet, not just whoever has Apps Script editor access.

**What gets reported**, both in the alert after a manual sync and in the Settings panel: Imported, Skipped (duplicates), Errors, and Last Sync (timestamp) — plus up to 10 row-level error messages if any rows were skipped for missing a Business Name, same as manual import.

**Auto Sync:** `RCS CRM > Auto Sync > Enable Auto Sync` creates an hourly time-based trigger and checks the Settings checkbox; `Disable Auto Sync` removes the trigger and unchecks it. Both remove any existing sync trigger before doing anything else, so clicking Enable twice never results in two triggers double-syncing every hour. The hourly trigger itself (`hourlySyncTrigger_`) re-checks the Enabled checkbox before doing anything (rather than trusting that the trigger's mere existence means it should run) and is wrapped in a try/catch that logs instead of throwing — an unattended trigger that throws repeatedly is how Google ends up silently disabling it. **Don't toggle the checkbox directly** — editing Settings!I2 by hand doesn't create or remove the actual trigger (Apps Script's permission model doesn't allow a simple sheet-edit trigger to manage installable triggers), so it would leave the checkbox out of sync with reality. Always use the Auto Sync submenu.

**Failure handling:** a network error, a non-200 response from GitHub, and a 403 rate limit (more likely on Google's shared outbound IP pool for unauthenticated requests — `GITHUB_TOKEN` at the top of the script can be set for a private repo or a higher rate limit) are all caught and reported as a clear message, whether the sync was triggered manually (an alert) or by the hourly trigger (a log entry, since there's no UI to alert in an unattended context) — never an uncaught exception either way.

**Self-healing:** if `Sync Prospects` runs against a sheet where the CRM scaffold doesn't exist yet or was cleared (Prospects or Settings missing), it calls `buildRCSCRM()` first — already idempotent and safe to call anytime — before doing anything else, so an hourly sync can't get stuck failing forever just because something upstream reset a sheet.

## Install steps

1. Open the target Google Sheet (a blank sheet is fine — the script also works on a sheet that already has data).
2. **Extensions > Apps Script.**
3. Delete any placeholder code in `Code.gs`, then paste in the full contents of [`RCS_CRM_Builder.gs`](./RCS_CRM_Builder.gs).
4. **Save** the project (e.g. name it "RCS CRM Builder").
5. In the function dropdown at the top of the editor, select **`buildRCSCRM`** and click **Run**.
6. The first run will prompt for authorization — this is Google's standard OAuth consent for a script to edit its own spreadsheet. Review and click **Allow**. The first time **Sync Prospects** or **Auto Sync** is used, a second authorization prompt appears for "Connect to an external service" (`UrlFetchApp`) and, for Auto Sync, "manage your triggers" — both standard Apps Script consent prompts, not anything specific to this script.
7. Switch back to the spreadsheet tab and refresh the page. An **RCS CRM** menu now appears in the menu bar: **Build / Update CRM**, **Import Prospects...**, **Sync Prospects**, an **Auto Sync** submenu (Enable/Disable), and — below a separator — **Move to Outreach**, **Convert to Client**, and **Archive Lead**, which act on whichever Prospects row(s) are selected (see Workflow Automation above).

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

**Workflow Automation** was dry-run separately (24 assertions, all passing) against `menuMoveToOutreach_`/`menuConvertToClient_`/`menuArchiveLead_` with a mocked Sheets + Ui API:
- **Upgrade path first:** pre-seeded a sheet shaped like a CRM built with an *older* version of this script — a 13-column Prospects header (no Archived Date) with one real data row, and a 13-value Lead Status list (no Archived) with a custom value manually added in another Settings column. After running `buildRCSCRM()`: `Archived Date` was appended at column 14 without moving `Status` from column 9, the pre-existing Prospects row and its Notes were untouched, `Archived` was appended as the 14th Lead Status value with the original 13 left in the same order, and the unrelated custom Settings value was left exactly as it was.
- **Move to Outreach:** confirmed Stage/Contacted/Notes map correctly from Status/Last Contact/Notes; re-running on the same row reported `skipped: 1` and appended nothing (rerun safety); a multi-row selection moved both rows in one pass.
- **Convert to Client:** confirmed Start Date is a real `Date` object for today, Status defaults to `Discovery`, Website and Notes carry over; re-running on the same row again reported a skip with no new row.
- **Archive Lead:** confirmed Status becomes `Archived` and Archived Date is stamped with today's date on the selected row only — a different row was checked and confirmed untouched.
- **Edge cases:** a row with a blank Business Name produced an error count with no exception; declining the Yes/No confirmation dialog (mocked "No" response) appended nothing; running an action while a non-Prospects sheet is active shows a guard alert instead of throwing.
- Prospects/Clients/Outreach Pipeline filters, banding, and validation rules were all still present at the end — none of the three actions touch formatting beyond refreshing the destination sheet's filter range.

**GitHub Sync** was dry-run separately (27 assertions, all passing) against `runProspectsSync_`/`enableAutoSync_`/`disableAutoSync_`/`hourlySyncTrigger_` with `UrlFetchApp` and `ScriptApp` mocked alongside the Sheets API:
- **Network/API failure handling** — a thrown network exception, a non-200 response (404), and a 403 rate-limit response were each reported as a clear, specific message with no uncaught exception, and none of them wrote a Last Commit SHA (a failed check shouldn't look like a successful one).
- **Empty CSV** — GitHub returning a 200 with an empty file body flowed through the same `importProspectsFromCsv_` empty-CSV handling already covered under Import Prospects: `Imported: 0`, no crash, and the SHA was still recorded (the check itself succeeded, even though the source file happened to be empty).
- **New prospects import correctly** — a 2-row CSV (using the real `prospects.csv` header shape) imported both rows, and the Prospects sheet was confirmed to actually contain them, not just the reported count.
- **No new prospects / avoiding unnecessary imports** — syncing again with an unchanged commit SHA reported "Already up to date" and — verified directly, not just inferred from the report — never even made the raw-file fetch call, let alone re-ran the importer.
- **Duplicate protection** — a new commit SHA whose CSV re-listed the 2 already-imported businesses plus 1 genuinely new one produced `Imported: 1, Skipped: 2`, and the sheet grew by exactly 1 row.
- **Auto Sync idempotency** — calling `enableAutoSync_` twice in a row left exactly one trigger in place (not two); calling `disableAutoSync_` twice was a harmless no-op both times.
- **Unattended context** — `hourlySyncTrigger_` was called directly (simulating an actual trigger firing, no UI available) both while disabled (does nothing, no throw) and while enabled (runs the sync via `Logger.log` instead of an alert, no throw).
- Prospects' filter, banding, and validation rules were confirmed still present after all of the above.
