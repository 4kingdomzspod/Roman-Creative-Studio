# RCS CRM — Sprint 1 Core

A Google Apps Script, split across four files, that builds/updates the Roman Creative Studio outreach/sales CRM inside a Google Sheet: 11 sheets, exact headers, Settings-backed dropdown validation, consistent formatting, and a live formula-driven Dashboard.

**Container-bound script only.** This does not require, and does not use, a Web App deployment, an API executable, an Add-on, or a Library. It's plain Apps Script attached directly to a Google Sheet — the only "deployment" step is pasting the code in and running one function once.

## Files

| File | Responsibility |
|---|---|
| [`Code.gs`](./Code.gs) | The `RCS CRM` menu, the `buildRCSCRM()` orchestrator, and the shared sheet/formatting helpers used by the other files (create-sheet-if-missing, additive header repair, freeze/style/banding/filter/resize). |
| [`CRM_Builder.gs`](./CRM_Builder.gs) | The schema: `SHEET_DEFS` — the 11 sheet names, their exact headers, and which columns get a dropdown. No logic, just the CRM's shape in one place. |
| [`CRM_Settings.gs`](./CRM_Settings.gs) | `SETTINGS_LISTS` — the six dropdown lists — plus the logic that seeds/extends the Settings sheet and applies validation elsewhere. |
| [`CRM_Dashboard.gs`](./CRM_Dashboard.gs) | Builds the Dashboard sheet: KPI cards, the pipeline-by-status breakdown, and the conversion/client metrics — all formulas. |

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

## Safety / idempotency

- `buildRCSCRM()` is safe to run any number of times.
- **Sheets:** created only if missing (looked up by name) — never duplicated.
- **Headers:** written in full only on a truly blank sheet. On a sheet that already has headers, only whichever target headers are missing get appended *after* the existing ones — never inserted in the middle, never duplicated, never reordered.
- **Settings lists:** seeded in full the first time; on later runs, only canonical values not already present in that column get appended after what's there — a team's own additions to a list are never touched.
- **Data rows:** never read, moved, or deleted by anything in `Code.gs`, `CRM_Builder.gs`, or `CRM_Settings.gs`. Formatting operations (banding, filters, validation, column width) only touch formatting/structure, never cell values.
- **Dashboard is the one deliberate exception:** every cell on it is computed from the other sheets, so `buildDashboard_()` clears and redraws that one sheet on every run — there's nothing to lose, since it holds no manually-entered records, and this is what guarantees no duplicate Dashboard sections rather than trying to diff and patch a formula layout in place.

## Install steps

1. Open the target Google Sheet (a blank sheet is fine — the script also works on a sheet that already has data, including one already using an earlier version of this CRM).
2. **Extensions > Apps Script.**
3. In the Apps Script editor, delete the default `Code.gs` placeholder content, then create four script files matching the names in this folder — **Code**, **CRM_Builder**, **CRM_Settings**, **CRM_Dashboard** — and paste the matching file's contents into each (use the **+** next to "Files" in the left sidebar to add each one; Apps Script appends `.gs` automatically).
4. **Save** the project (e.g. name it "RCS CRM").
5. In the function dropdown at the top of the editor, select **`buildRCSCRM`** and click **Run**.
6. The first run prompts for authorization — Google's standard OAuth consent for a script to edit its own spreadsheet (Apps Script will list "See, edit, create, and delete your spreadsheets" — that's the only permission this script needs in Sprint 1). Review and click **Allow**.
7. Switch back to the spreadsheet tab and refresh the page (or close/reopen the sheet). An **RCS CRM** menu appears in the menu bar with a single item, **Build / Update CRM** — use it any time afterward instead of going back into the script editor.

Re-running (from the menu or the editor) is always safe — see Safety/idempotency above.

## Sprint 1 scope

Built in this sprint: the 11-sheet schema, headers, Settings lists, dropdown validation, formatting, the live Dashboard, and the single-item `RCS CRM` menu (**Build / Update CRM** only).

**Deliberately not included in Sprint 1** (per the sprint scope): CSV import, GitHub sync, auto-sync triggers, or the lead-workflow menu actions (Move to Outreach / Convert to Client / Archive Lead) from earlier iterations of this script. The goal this sprint was a clean, minimal, correct foundation — not feature parity with anything built before it.

## Sprint 2 (planned): GitHub Sync

Sprint 2 will add a sync that pulls `outreach/prospects.csv` from `RomanCreativeStudio/Roman-Creative-Studio` (branch `main`) into Prospects, on the same "match columns, skip duplicates, append only new rows" model. The file layout here leaves a clean seam for that: a new `CRM_Sync.gs` (plus whatever CSV-parsing/import helpers it needs) can reuse `getOrCreateSheet_`, `ensureHeaders_`, and the `SHEET_DEFS` schema from `CRM_Builder.gs` without any changes to `Code.gs`, `CRM_Builder.gs`, `CRM_Settings.gs`, or `CRM_Dashboard.gs` — Sprint 2 only adds files and a menu item, it doesn't rewrite Sprint 1.

## Testing performed before delivery

All of the following ran against a mocked Apps Script `SpreadsheetApp` API in Node (`node --check` for syntax, then a full functional dry run — the closest verification possible outside Google's actual runtime, since `SpreadsheetApp` and its formula engine only exist there):

- **Syntax:** each of the 4 `.gs` files individually passed `node --check`.
- **Load-order safety:** the 4 files were concatenated and evaluated in *reverse* file order (Dashboard, Settings, Builder, Code — the worst case for any top-level constant that might assume another file already ran) and built cleanly with no exceptions. This specifically validates a real hazard that was designed around: `CRM_Builder.gs`'s `SHEET_DEFS` does **not** compute the Settings sheet's headers from `CRM_Settings.gs`'s `SETTINGS_LISTS` at top-level const-init time (Apps Script doesn't guarantee file load order), so it can't break regardless of which file Apps Script happens to evaluate first.
- **All 11 sheets** were verified present by name after a build.
- **Headers** were verified to match the spec exactly, column-for-column, on all 9 data sheets (Prospects, Outreach Pipeline, Follow Ups, Meetings, Proposals, Clients, Revenue, Website Audits, Referral Network).
- **Settings lists** were verified to match the spec exactly, value-for-value and in order, for all 6 lists.
- **Validations** were verified present on the expected columns (Prospects Industry/Priority/Status, Clients Status, Proposals Status).
- **Dashboard formulas** were verified: all 8 KPI cards have the correct label in the correct cell with a real formula underneath; the Pipeline Summary's first row formula correctly references `Settings!A2`; all 3 conversion/client metric cards are present and correctly labeled; and — since Sprint 1's dashboard spec doesn't include a Recent Activity feed (only KPIs, pipeline summary, and conversion/client metrics) — confirmed no such section exists, keeping the build to exactly what was asked for.
- **Idempotency / data preservation:** inserted fake test rows directly into Prospects and Outreach Pipeline, ran `buildRCSCRM()` a second time, and confirmed: sheet count unchanged (no duplicates), both test rows' values unchanged, the Prospects header row unchanged, no duplicate header row appeared anywhere, and the Settings Lead Status list was still exactly 14 values with no duplicates. Ran a third build for extra confidence — same result.
- **No Web App deployment:** confirmed by construction — nothing in any of the 4 files calls `doGet`/`doPost`, defines a Web App entry point, or otherwise requires a deployment step; `buildRCSCRM()` is invoked directly (menu click or "Run" in the editor), which is all a container-bound script ever needs.

## Remaining issues

None identified. Sprint 1 is scoped to schema + formatting + Dashboard + one menu item, and every part of that was verified per above. Nothing outside that scope (import, sync, workflow actions) is present, matching the sprint's explicit exclusion list.
