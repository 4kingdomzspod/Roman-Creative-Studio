# RCS CRM — Sprint 1 Core + Sprint 2 Prospect Workflow + Sprint 3 GitHub Sync + Sprint 4 Website Audit + Sprint 5 Outreach Intelligence + Sprint 6 Outreach Execution + Follow-Up + Sprint 7 Lead Scoring + Prioritization + Sprint 8 Daily Sales Command Center + Sprint 9 Pipeline Intelligence & Analytics + Sprint 10 CRM Data Quality & Health Audit + Sprint 11 Automation & Daily Maintenance + Sprint 12 Next-Action Engine

A Google Apps Script, split across sixteen files, that builds/updates the Roman Creative Studio outreach/sales CRM inside a Google Sheet: 11 sheets, exact headers, Settings-backed dropdown validation, consistent formatting, a live formula-driven Dashboard, one-click CSV import, menu-driven prospect actions (Move to Outreach / Convert to Client / Archive Lead), a GitHub sync (manual + hourly auto-sync) that pulls `outreach/prospects.csv` straight from this repo, a Website Audit tool that fetches and scores a prospect's site, an Outreach Brief generator that turns a saved audit into a ready-to-send sales brief, an Outreach Execution workflow (Mark as Contacted / Schedule Follow-Up / Generate Follow-Up Message) that carries a prospect forward after that brief has been sent, a transparent, deterministic Lead Scoring system (the "RCS Lead Priority Score") that tells RCS which prospects deserve attention first, a read-only Daily Sales Command Center that answers "what should I work on today?" in one ranked report, a read-only Pipeline Intelligence & Analytics report that answers "how is the pipeline actually performing?", a read-only CRM Health Audit — a data-quality/duplicate/consistency checker with its own 0-100 CRM Health Score — that answers "is the underlying data trustworthy enough to believe any of that?", an Automation & Daily Maintenance layer — a read-only daily maintenance report plus an optional installable daily trigger — that keeps the CRM operationally clean without ever editing a record automatically, and a Next-Action Engine — a single, read-only, 7-priority-tier ranked report across Prospects/Meetings/Proposals/Clients — that answers "what should I act on next?" using Sprint 7's own Lead Score, never a second one.

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
| [`CRM_Audits.gs`](./CRM_Audits.gs) | *(Sprint 4)* Website Audit — fetches one page (+ robots.txt/sitemap.xml + a few internal links), runs verifiable checks, scores it, and logs a row to Website Audits. |
| [`CRM_Outreach.gs`](./CRM_Outreach.gs) | *(Sprint 5)* Outreach Brief — turns a Prospects row's latest Website Audits record into a deterministic, template-based sales brief stored back on Prospects. |
| [`CRM_OutreachWorkflow.gs`](./CRM_OutreachWorkflow.gs) | *(Sprint 6)* Mark as Contacted / Schedule Follow-Up / Generate Follow-Up Message — carries an outreach forward on the selected Prospects row(s), reusing the stored Outreach Brief for message generation. |
| [`CRM_Scoring.gs`](./CRM_Scoring.gs) | *(Sprint 7)* RCS Lead Priority Score — a deterministic 0-100 score, tier, and human-readable reasons computed from existing Prospects + Website Audits data; Score Selected Prospect(s) / Score All Prospects / Show Top Leads. |
| [`CRM_CommandCenter.gs`](./CRM_CommandCenter.gs) | *(Sprint 8)* Daily Sales Command Center — a single read-only, ranked "what to work on today" report built from existing Prospects/Website Audits/Meetings/Proposals data. Never writes anything. |
| [`CRM_Analytics.gs`](./CRM_Analytics.gs) | *(Sprint 9)* Pipeline Intelligence — a single read-only report covering pipeline overview, current-state conversion funnel, proposal/revenue value, sales velocity, aging, ranked risks, and performance by industry, all from existing data. Never writes anything. |
| [`CRM_Health.gs`](./CRM_Health.gs) | *(Sprint 10)* CRM Health Audit — a single read-only report covering data completeness, likely duplicate prospects, consistency against Settings, pipeline integrity, staleness, and a deterministic 0-100 CRM Health Score. Never writes anything. |
| [`CRM_Automation.gs`](./CRM_Automation.gs) | *(Sprint 11)* Automation & Daily Maintenance — a read-only Daily CRM Maintenance report, an Automation Status view, and an optional installable daily trigger to run the report unattended. Never edits a Prospect/Proposal/Client/Revenue record. |
| [`CRM_NextAction.gs`](./CRM_NextAction.gs) | *(Sprint 12)* Next-Action Engine — a single, read-only, 7-priority-tier ranked "what should I act on next?" report across Prospects/Meetings/Proposals/Clients. Reuses Sprint 7's Lead Score as-is; never writes anything. |

Apps Script shares one global scope across every `.gs` file in a project (no imports/exports needed — a function or `const` defined in one file is callable/readable from any other), so this split is purely for readability; functionally it behaves as one script.

## What it builds

Running `buildRCSCRM()` creates or updates exactly these 11 sheets:

Dashboard, Prospects, Outreach Pipeline, Follow Ups, Meetings, Proposals, Clients, Revenue, Website Audits, Referral Network, Settings

| Sheet | Columns |
|---|---|
| Dashboard | — (formula-driven, no headers — see below) |
| Prospects | Business, Industry, City, Website, Phone, Email, Contact, Priority, Status, Website Score, Last Contact, Next Follow Up, Notes, Archived Date — plus **Outreach Brief** (added the first time a brief is generated) and **Lead Score / Score Tier / Score Reasons** (added the first time scoring is run) — see Outreach Brief and Lead Scoring below; none of these columns are provisioned by `buildRCSCRM()` |
| Outreach Pipeline | Business, Stage, Contacted, Method, Response, Next Action, Owner, Notes |
| Follow Ups | Business, Due, Priority, Status, Reminder, Notes |
| Meetings | Business, Contact, Date, Type, Outcome, Proposal, Notes |
| Proposals | Business, Package, Value, Sent, Status, Decision, Notes |
| Clients | Business, Package, Start, Monthly, Status, Website, Notes |
| Revenue | Month, Client, Invoice, Amount, Paid, Payment Date |
| Website Audits | Business, Date, Mobile, SEO, Performance, Accessibility, Score, Notes |
| Referral Network | Name, Company, Relationship, Industry, Last Contact, Referrals, Notes |
| Settings | Lead Status, Priority, Industry, Outreach Method, Proposal Status, Project Status, plus a GitHub Sync panel (columns H:I) and an Automation panel (columns K:L — see below) |

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
- **Audits Completed** *(Sprint 4)* — count of all rows in Website Audits (`COUNTA('Website Audits'!A2:A)`). Added as a 4th card in this same row rather than redesigning the Dashboard — the row widened from 3 cards (columns A:F) to 4 (A:H).
- **Hot Leads** *(Sprint 7)* — count of Prospects whose Score Tier reads "Hot" (`=IFERROR(COUNTIF(INDEX(Prospects!A2:Z,0,MATCH("Score Tier",Prospects!A1:Z1,0)),"Hot"),0)`). Added as a 5th card in this same row — widened from 4 cards (A:H) to 5 (A:J). The formula locates the Score Tier column by header name via `INDEX`/`MATCH` rather than a hardcoded column letter, since that column's position depends on when scoring was first run (see Lead Scoring below) — `IFERROR` resolves it to `0` on a CRM where scoring hasn't been run yet, rather than an error.

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

## Website Audit (Sprint 4)

**RCS CRM > Website Audit > Audit Selected Prospect** reads the Business + Website from whichever Prospects row(s) are selected, confirms before running (naming the business, or the count for a multi-row selection), skips any selected row missing a Business or Website with a clear note rather than guessing, and never modifies the Prospects row itself. **RCS CRM > Website Audit > Audit Website URL** opens a small dialog for auditing any URL — not tied to a Prospects row — normalizing a bare domain like `example.com` to `https://example.com` and rejecting anything that isn't a usable http/https URL (including other schemes like `mailto:` or `ftp://`, which are rejected outright rather than mangled into a bogus URL).

**One page fetch, not a crawl.** Each audit makes: one request for the main page, one for `/robots.txt`, one for `/sitemap.xml`, and up to 5 requests for same-origin links found on that one page (capped — never a recursive crawl, never "a large number of requests"). Every network call is wrapped in try/catch; a DNS failure, timeout, SSL error, connection refusal, non-200 response, or empty response all become a specific, readable message — the menu and script never crash.

### What is actually measured

Every check below is either a direct read of the HTTP response / fetched HTML, or a heuristic explicitly labeled as such. Nothing here is invented or assumed.

| Check | How it's verified |
|---|---|
| HTTPS | The URL's own scheme (`https://` vs `http://`) — not a redirect-chain inspection, since Apps Script's `UrlFetchApp` doesn't expose the final post-redirect URL. |
| HTTP status | The real response code from the fetch. |
| Page title | Presence + character length of `<title>…</title>`. |
| Meta description | Presence + character length of `<meta name="description" content="…">` (attribute order doesn't matter). |
| Viewport meta | Presence of `<meta name="viewport" …>` — this is the entire "Mobile" check; there is no real mobile-rendering test. |
| H1 | Count of `<h1>` tags — flags both zero and more-than-one. |
| Image alt text | Every `<img>` tag on the page, checked for a non-empty `alt` attribute. |
| Canonical URL | Presence of `<link rel="canonical" href="…">`. |
| robots.txt / sitemap.xml | A real fetch to each, checked for a reachable (2xx/3xx) response. |
| Open Graph title/image | Presence of `og:title` / `og:image` meta tags. |
| Page HTML size | The actual byte length of the fetched response body (used, labeled, as a Performance heuristic input). |
| Fetch duration | Wall-clock time (`Date.now()` before/after the fetch) for this script's own request to the page — a real, if narrow, network-latency signal. |
| Broken internal links (light) | Up to 5 same-origin links found on the page, each fetched and checked for a 4xx/5xx response. |

### What is NOT measured (and never claimed)

- **No real Lighthouse or PageSpeed score.** Performance is explicitly labeled `"NN/100 — HTML size/network heuristic"` — page size plus this script's own fetch-duration timing, nothing more.
- **No Core Web Vitals** (LCP, CLS, INP, etc.) — these require a real browser render, which Apps Script cannot do.
- **No actual mobile rendering.** "Mobile" is a single binary check — does a viewport meta tag exist — labeled `PASS`/`FAIL`, not a score, and not a claim that the site was actually rendered on a mobile device.
- **No accessibility-compliance audit.** "Accessibility" is image alt-text coverage only, labeled `"NN/100 — image alt-text checks"` — not WCAG conformance, contrast checking, keyboard navigation, ARIA, or anything beyond what's named.
- **No SEO ranking or traffic data.** The SEO score reflects only the on-page checks named in its own label (`"NN/100 — title/meta/H1/canonical checks"`) — not search rankings, backlinks, or real-world visibility.

### Scoring

Each category is scored 0–100 from only the checks actually performed:

- **SEO** (max 100): title present (25, +5 if length is 10–60 chars), meta description present (25, +5 if length is 50–160 chars), exactly one H1 (20; more than one gets partial credit at 15), canonical tag present (20).
- **Performance** (max 100, explicitly an HTML-size/network heuristic — never described as Lighthouse/PageSpeed): fetch duration under 1s/3s/6s/over (50/35/20/5 points) + HTML size under 100KB/300KB/800KB/over (50/35/20/5 points).
- **Accessibility** (max 100): percentage of `<img>` tags with real (non-empty) alt text; a page with no images scores 100 (nothing to flag).
- **Mobile**: binary PASS (viewport meta found) or FAIL — contributes 100 or 0 to the overall score, not a graded number.

**Overall score** is a weighted average of the four categories — Mobile 25%, SEO 35%, Performance 20%, Accessibility 20% (`AUDIT_WEIGHTS` at the top of `CRM_Audits.gs`) — rounded to the nearest whole number.

### Notes

Generated only from checks that actually found something, in the exact format `"Opportunities: missing meta description; 6 images missing alt text; no canonical tag."` — or `"No issues found in the checks performed."` when nothing was flagged. Nothing is invented; an issue only appears if its corresponding check genuinely failed.

### Storage

Every completed audit appends one row to Website Audits — **never overwrites** a previous audit, including re-auditing the same business, which becomes a new row with a new Date rather than replacing the old record (so score history over time is preserved). A failed audit (network error, non-200, empty page) writes nothing. Date is stored as `yyyy-mm-dd`.

`saveAuditRecord_` never throws and always reports back whether the row genuinely landed: it verifies the write by reading the cell back, and any failure (missing sheet, missing schema, a Sheets API error mid-write) is caught and returned as `{ saved: false, message }` rather than an uncaught exception. `runUrlAudit_` (the function the URL-audit dialog calls) is wrapped the same way, so it always returns a plain result object instead of ever letting an exception escape to the dialog — the historical cause of a dialog hanging on "Auditing..." with no error shown.

### Results

After a single audit, the dialog/alert shows: Business, URL, Overall Score, Mobile, SEO, Performance, Accessibility, Top issues (up to 3), and a save-status line. **"Audit saved to Website Audits" is only shown when the row write was actually confirmed** — if the audit itself succeeded but the save didn't (sheet missing, write error), the line instead reads "Audit completed but was NOT saved to Website Audits" with the specific reason, so a real save failure can never be mistaken for a successful one. Auditing multiple selected Prospects at once shows a compact per-business score list (each flagged `(NOT SAVED)` if its row didn't actually write) plus Audited/Failed/Skipped counts instead of stacking multiple detailed blocks. The Audit Website URL dialog itself is defensive against a missing/malformed result and never gets stuck showing "Auditing..." — both its success and failure callbacks always render a final message.

## Outreach Brief (Sprint 5)

**RCS CRM > Outreach Tools > Generate Outreach Brief** and **Generate Brief for Selected Prospect** are two menu labels for the exact same action — both act on whichever Prospects row(s) are selected. They're kept as one handler (`menuGenerateOutreachBrief_`) rather than two near-identical implementations, per this sprint's "no duplicate CRM logic" instruction.

**What it does:** for each selected Prospects row, looks up that business's most recent Website Audits record (by Business name, latest Date if there are several — see Website Audit's storage behavior above) and assembles a plain-text brief from fields already stored there. **No AI API, no external service, no additional web fetch** — generation is a deterministic template filled in from `Mobile`/`SEO`/`Performance`/`Accessibility`/`Score`/`Notes` on the matched Website Audits row. Running it twice on the same audit data produces byte-identical output.

**Brief format:**

```
OUTREACH BRIEF
Business: ...
Website: ...
Audit Date: ...

OVERALL FINDINGS
Overall Score: NN/100  (Mobile: ...; SEO: ...; Performance: ...; Accessibility: ...)

TOP ISSUES
1. ...
2. ...
3. ...

POSITIVE FINDINGS
- ...

OPENING
"I took a quick look at your website and noticed ..."

VALUE
"RCS can help improve your ..."

CTA
"Would you be open to a quick conversation about it?"
```

**Where every line comes from — nothing is invented:**
- **Top Issues** — parsed directly from the audit's `Notes` field (`"Opportunities: a; b; c."` → up to the first 3 of `a`, `b`, `c`). If Notes says no issues were found, this section says so instead of inventing a problem.
- **Positive Findings** — Mobile is listed if its stored label starts with `PASS`; SEO/Performance/Accessibility are listed if their stored score is ≥ 70 (`OUTREACH_POSITIVE_THRESHOLD` in `CRM_Outreach.gs`) — each shown using its own already-computed label text, not a new claim.
- **Opening** — references the actual top issue(s) found (e.g. `"...and noticed missing meta description and no canonical tag."`); if there genuinely were none, falls back to a neutral opening rather than naming a problem that wasn't found.
- **Value** — names the genuine weak categories (score below the same 70 threshold, or Mobile FAIL) — up to 2 of them — rather than a generic pitch unrelated to what was actually found.
- **CTA** — the fixed line from this sprint's spec, used verbatim; it's an invitation, not a factual claim, so it doesn't need to be grounded in audit data.

**Safe handling:**
- **No selection / wrong sheet** — reuses `getSelectedProspectRows_` (`CRM_Actions.gs`), which already covers both.
- **Missing Business** — a selected row with no Business name is skipped and counted, never silently guessed.
- **Missing audit** — no matching Website Audits record → clear message, nothing written, told to run Website Audit first.
- **Incomplete audit data** — a matched record missing Score or any of the four category labels → clear message, nothing written, rather than generating a brief with holes in it.
- **Existing brief** — if any target already has a non-blank Outreach Brief, one Yes/No confirmation asks whether to replace it before anything is touched; declining leaves every existing brief exactly as it was.
- **Multiple prospects** — processes every valid selected row and reports aggregate counts (Generated / No audit found / Incomplete audit data) plus per-business detail lines, rather than one alert per row.

**The Outreach Brief column:** `CRM_Builder.gs` (the normal source of Prospects' header list) is intentionally not touched this sprint, so this column can't be provisioned through the usual `SHEET_DEFS`/`ensureHeaders_` path used everywhere else. Instead, `CRM_Outreach.gs` provisions it itself the first time a brief is generated — appended after whatever the last column currently is, exactly the same additive-only rule as everywhere else in this CRM (never inserted in the middle, never reorders existing columns). One consequence worth knowing: unlike every other schema column, `Outreach Brief` won't appear just from running **Build / Update CRM** — it only appears once **Generate Outreach Brief** has been run at least once.

**What's preserved:** brief generation only ever writes to a single Prospects row's own Outreach Brief cell (an edit, not an append/delete elsewhere) — Business, Website, and every other Prospects field are untouched, and Website Audits is read-only from this feature's perspective (never written to). Filter and column width are refreshed only at the moment the Outreach Brief column is first added.

**"Audit Status" column:** intentionally not added. The task allowed it only "if useful/required" with an explicit preference to avoid it, and it wasn't needed — audit presence/completeness is checked live against Website Audits at brief-generation time, so a separate cached status field on Prospects would just be one more thing that could drift out of sync with the real data.

## Outreach Execution + Follow-Up (Sprint 6)

Three menu actions under **RCS CRM > Outreach Tools** carry an outreach forward once a brief has actually been sent. All three act on whichever Prospects row(s) are currently selected (reusing `getSelectedProspectRows_` from `CRM_Actions.gs`, the same guard used by the Sprint 2 actions and Website Audit), read the live header row (`getLiveProspectsHeaders_`, `CRM_Outreach.gs`) rather than the static schema, and never delete, archive, or move anything to another sheet.

**Mark as Contacted** — sets `Status` to `Contacted` and `Last Contact` to today's date on every selected row that has a Business name; rows with a blank Business are skipped and counted, not guessed at. A single Yes/No confirmation (naming the business, or the count for a multi-row selection) is shown before anything is written; declining leaves `Status` and `Last Contact` untouched. Every other field on the row — Website, Priority, Notes, Next Follow Up, etc. — is left exactly as it was. **Next Follow Up is never touched by this action** (the task explicitly said not to auto-change it) — scheduling a follow-up is a separate, deliberate action. Re-running it on an already-Contacted row simply re-writes the same Status and refreshes Last Contact to today; nothing is duplicated.

**Schedule Follow-Up** — prompts once (`ui.prompt`, a plain `yyyy-mm-dd` text entry — chosen over a new HtmlService dialog for consistency with the rest of this file and to avoid a new dialog file for a single date value) for the follow-up date, validates it's both correctly formatted and a real calendar date (rejects `2026-02-30`), then writes it to `Next Follow Up` on every selected row with a Business name. **If any selected row already has a Next Follow Up date, one confirmation asks before overwriting it** — naming the existing date; declining leaves every existing date exactly as it was, for every row in the selection (not just the one that already had a date). Cancelling the date prompt itself does nothing and shows no further alert. All other fields, including Notes, are untouched.

**Generate Follow-Up Message** — deterministic and template-based, exactly like Sprint 5's Outreach Brief: **no AI API, no external service, nothing invented.** Restricted to a single selected row (unlike the other two actions) since it displays and optionally saves one specific message — a multi-row selection shows a clear "select a single prospect" message instead of guessing which row to use. Requires an existing Outreach Brief on that Prospects row (Sprint 5); if there isn't one, it says so and points to **Generate Outreach Brief** rather than fabricating content. The message references the real top issue pulled from the stored brief's own `TOP ISSUES` section (not a placeholder), and opens with one of five templates keyed to the prospect's current `Status` — `Contacted`, `Follow-up 1 Sent`, `Follow-up 2 Sent`, `No Response`, `Nurture` (the exact five Lead Status values named in this sprint's spec) — falling back to one neutral default template for any other status (`New`, `Won`, etc.) rather than refusing to generate a message. The message is **always shown first** (`ui.alert`, satisfying "display for copy/use" even if nothing gets saved), then a separate Yes/No asks whether to save it to Notes; declining leaves Notes completely untouched. Accepting **appends** a dated `[Follow-Up yyyy-mm-dd]: ...` block to any existing Notes content rather than overwriting it, consistent with this CRM's general preserve-existing-data rule. Regenerating the same message twice from the same Status/brief produces byte-identical text.

**What's preserved:** all three actions only ever edit specific cells (`Status`, `Last Contact`, `Next Follow Up`, or `Notes`) on the exact Prospects row(s) selected — no new sheet, no row insertion/deletion, no changes to Website Audits or the stored Outreach Brief text itself.

## Lead Scoring (Sprint 7)

**RCS CRM > Lead Intelligence > Score Selected Prospect(s) / Score All Prospects / Show Top Leads** compute the **"RCS Lead Priority Score"** — a transparent, deterministic 0-100 score built only from data already on Prospects and Website Audits. **No AI API, no external service, no invented values** — any input that's missing simply contributes 0 points, and every score comes with a plain-English breakdown of exactly how it was reached.

**This score does not predict probability of closing.** It's a prioritization aid, not a sales forecast — that disclaimer appears verbatim in every result dialog and in Show Top Leads, and no UI text anywhere in this feature implies otherwise.

**Score components (weights sum to exactly 100):**

| Factor | Points | How it's measured |
|---|---|---|
| Website Audit Score | up to 30 | The latest Website Audits record for that Business (`findLatestAuditForBusiness_`, Sprint 5), scaled: `round(auditScore / 100 * 30)`. No audit on file = 0. |
| Priority | High +20 / Medium +10 / Low or unset +0 | Prospects.Priority, read as-is — any value other than exactly High/Medium/Low (including blank) is treated as unset, never guessed. |
| Contact info available | up to 10 | +5 if Phone is on file, +5 if Email is on file. A Contact *name* alone doesn't count — it's not a channel to actually reach the business. |
| Website exists | +5 | Prospects.Website is non-blank. |
| Outreach Brief exists | +10 | The Sprint 5 Outreach Brief column is non-blank (0 if that column doesn't exist yet — nothing invented). |
| Follow-up due/overdue | +10 | Prospects.Next Follow Up is today or earlier. A future date scores 0 ("not yet due"); no date scores 0 ("no follow-up scheduled") — the reason text distinguishes the two. |
| Status / engagement signal | up to 15 | Call Booked/Proposal Sent/Won = 15, Proposal Pending = 12, Follow-up 2 Sent = 10, Follow-up 1 Sent = 8, Contacted = 6, Nurture = 4. Any other status (New, No Response, Closed states, Do Not Contact, Archived, blank, or anything unrecognized) = 0 — there's no engagement signal to credit. |

The final score is capped at 100 (`Math.min(100, ...)`) as a safety net, though the weights above never actually sum past 100.

**Tiers:** 80-100 = **Hot**, 60-79 = **Warm**, 0-59 = **Cold**.

**Archived / Do Not Contact — never scored Hot:** if a prospect's Status is exactly "Archived" or "Do Not Contact" (case-insensitive), or its Archived Date is filled in, its computed tier is capped at Warm even if the raw point total would reach Hot — the reasons text says so explicitly (`"Tier capped at Warm — Archived/Do Not Contact prospects are never scored Hot."`). These prospects are also **excluded entirely from Show Top Leads**, regardless of score, so a Do Not Contact lead can never surface as something to act on. The underlying numeric score itself is still computed and stored honestly (so the data stays meaningful for anyone auditing it) — only the *tier label* and *Top Leads visibility* are constrained.

**Score Selected Prospect(s)** — scores whichever Prospects row(s) are currently selected (`getSelectedProspectRows_`, `CRM_Actions.gs` — same wrong-sheet/no-selection guard as every other row-based action), after a Yes/No confirmation naming the business or the count. Rows with no Business name are skipped and counted, not guessed at.

**Score All Prospects** — scores every Prospects row with a Business name, after one confirmation. Skips blank-Business rows. Re-running it (on the same or updated data) overwrites the three scoring cells in place — this is a live "current score," not an append-only log like Website Audits, so re-scoring is expected and produces no duplicate rows or columns.

**Show Top Leads** — displays the top 10 scored, non-excluded prospects sorted by score descending, as `Business | Score | Tier | Reasons | Next Follow Up | Status` per row, in a single alert (**no new sheet is created**). If nothing has been scored yet, it says so and points to Score All Prospects instead of showing an empty or misleading list.

**Deterministic:** `computeLeadScore_` is a pure function — the same Prospects/Website Audits inputs always produce the exact same score, tier, and reasons text, byte-for-byte, on every run.

**The three scoring columns (Lead Score, Score Tier, Score Reasons):** like Sprint 5's Outreach Brief column, `CRM_Builder.gs` isn't touched this sprint, so these can't go through the normal `SHEET_DEFS`/`ensureHeaders_` build path automatically. Instead `CRM_Scoring.gs` provisions them itself the first time any scoring action runs, by calling Code.gs's own `ensureHeaders_` directly — the same additive-only, append-after-the-last-column, never-reorder guarantee used everywhere else in this CRM, just invoked from a new caller. They won't appear from a fresh **Build / Update CRM** run alone — only once scoring has actually been used at least once.

**What's preserved:** scoring only ever writes to a row's own Lead Score / Score Tier / Score Reasons cells — every other Prospects field (including the pre-existing, unrelated "Website Score" column) is left exactly as it was. Website Audits and the stored Outreach Brief text are read-only from this feature's perspective.

## Daily Sales Command Center (Sprint 8)

**RCS CRM > Daily Command Center** (`openDailyCommandCenter_`) answers one question — *"what should I work on today to move RCS prospects toward revenue?"* — as a single alert. **It is entirely read-only**: it only ever calls `getValues()`/`getValue()` against Prospects, Website Audits, Meetings, and Proposals, and never writes a cell, creates a sheet, creates a trigger, or sends anything. It's built entirely from Sprint 1-7 data and doesn't introduce a new scoring model — every "Hot," "Score," or exclusion rule it uses is the exact one from `CRM_Scoring.gs`, `CRM_Outreach.gs`, and `CRM_Audits.gs`, called directly rather than reimplemented.

**Data sources:** Prospects (Status, Priority, Last Contact, Next Follow Up, Archived Date, and the optional Sprint 5/7 Outreach Brief / Lead Score / Score Tier columns when present), Website Audits (via `findLatestAuditForBusiness_`), Meetings, and Proposals — each read via `getHeaders_`/`getLiveProspectsHeaders_`, never a hardcoded column letter.

**Seven categories**, checked for every non-excluded prospect (plus Meetings/Proposals rows):

| # | Category | Condition |
|---|---|---|
| 1 | Overdue follow-up | Next Follow Up is a real date before today |
| 2 | Follow-up due today | Next Follow Up is exactly today |
| 3 | Hot lead needing action | Score Tier = "Hot" or Lead Score ≥ 80, and Status isn't already Won/Closed |
| 4 | High-priority uncontacted | Priority = High, and Status is blank/"New" with no Last Contact |
| 5 | Audited but uncontacted | A Website Audits record exists for the business, and the prospect is uncontacted (same definition as #4) |
| 6 | Upcoming meeting | Meetings.Date is today or a real future date |
| 7 | Active proposal | Proposals.Status is "Sent" or "Under Review" (Draft hasn't been sent yet; Accepted/Declined/Expired are already resolved) |

**Exclusions:** any prospect that's Archived, Do Not Contact, or has a non-blank Archived Date (`isExcludedFromTopLeads_`, `CRM_Scoring.gs`) is skipped from **every** category, not just the Hot one — an excluded prospect never appears in the report at all, regardless of how urgent it would otherwise look.

**Ranking:** one deterministic function walks the categories in the priority order above; within categories 1-5 ties are broken by existing Lead Score descending (no score = sorts last), and Meetings/Proposals are ordered by date ascending (soonest first). **A business appears at most once in the final list** — if it qualifies for more than one category (e.g. an overdue follow-up that's also a Hot lead), only its highest-priority entry is kept. The list is capped at the top 10; the Pipeline Health counts at the top of the report always reflect the true, uncapped totals for each category.

**Every entry names:** the Business, a reason line (with the relevant score/status/date), a detail line when there's something specific worth stating, and one recommended next action — phrased to point at an action that will actually work given what's on file (e.g. it never recommends "Generate Follow-Up Message" for a prospect with no Outreach Brief yet, since that action would immediately fail; it recommends contacting them directly instead).

**Empty states:** a CRM with no prospects, no follow-ups, no audits, no meetings, or no proposals — or one where the Sprint 5/7 optional columns were never provisioned — produces a report with all-zero Pipeline Health counts and `"No urgent actions found. Your pipeline is clear."` instead of an empty or broken list. Blank-Business rows and malformed/blank dates are silently skipped, never guessed at or thrown on.

**Doesn't depend on the active sheet or a selection** — unlike the row-based actions elsewhere in this CRM, Daily Command Center reads Prospects/Meetings/Proposals directly, so it works no matter which sheet is currently open.

## Pipeline Intelligence & Analytics (Sprint 9)

**RCS CRM > Pipeline Intelligence** (`openPipelineIntelligence_`) answers *"how is RCS's sales pipeline actually performing?"* as a single alert covering eight sections. **It is entirely read-only** — like Daily Command Center, it never writes a cell, creates a sheet, or calls an external service; it's built entirely from Prospects, Website Audits, Meetings, Proposals, Clients, and Revenue, and reuses Sprint 7/8's scoring, exclusion, and date logic directly (`buildProspectRecords_`, `compareDateToToday_`, `parseDateOrNull_`, `ACTIVE_PROPOSAL_STATUSES` from `CRM_CommandCenter.gs`; `isExcludedFromTopLeads_`, `formatScoreDate_` from `CRM_Scoring.gs`) rather than reimplementing any of it.

**The core design constraint:** this CRM stores a *current* Status per prospect, not a *history* of status changes, and Prospects has no stored creation/added date at all. Every section below is honest about that limit — a metric that would require data this schema doesn't have says so explicitly (`"Not available from current CRM data"` / `"Insufficient historical date data"`) instead of estimating, inferring, or inventing one. Nothing in this report is a forecast or a probability.

**Pipeline Overview** — Active Pipeline count (total minus Archived/Do Not Contact), a full Status breakdown, Hot/Warm/Cold/Unscored counts (reusing Sprint 7's Score Tier/Lead Score fields as-is), Contacted/Meetings/Active Proposals/Clients, and a separate HISTORICAL/CLOSED line for Closed-Lost, Closed-Not-Interested, Archived, and Do Not Contact — **Archived/DNC are never counted as active pipeline**, and Archived vs. Do Not Contact are reported as distinct, non-overlapping counts.

**Conversion Funnel — explicitly labeled `CURRENT-STATE FUNNEL`.** Stage counts are cross-referenced against real records, not guessed from Status text alone: *Prospects* (every record) → *Contacted* (Status beyond blank/New) → *Meeting* (a matching Meetings row exists) → *Proposal* (a matching Proposals row exists) → *Won/Client* (a matching Clients row exists), each also shown as a % of the total Prospects count. Also reports Overall Prospect→Client, Proposal→Client, and Meeting→Proposal conversion — each `null`/"N/A" rather than `NaN` or a crash when its denominator is zero. The report states directly, every time, that this is a snapshot of current records, not a true historical cohort conversion rate, since no stage-transition timestamps are stored anywhere in this CRM.

**Pipeline Value** — Active Proposal count/value (Sent + Under Review, `ACTIVE_PROPOSAL_STATUSES` reused from Sprint 8), Average Won Project Value (Proposals with Status exactly "Accepted"), Closed/Lost Value (Status "Declined"), Won Revenue (Revenue rows where `Paid === true`, matching the same convention as the Dashboard's own Monthly Revenue formula), Total Invoiced (every Revenue row regardless of Paid), and Won Clients (Clients sheet row count). Every one of these is `null` → `"Not available from current CRM data"` when there's nothing valid to compute from, never a fabricated `$0`.

**Sales Velocity** — Prospect-Creation→Client is *always* reported unavailable (Prospects has no creation date field, full stop). Proposal→Client averages real day-differences between a business's earliest Proposals `Sent` date and its Clients `Start` date, matched by Business name (same name-matching convention used by `findLatestAuditForBusiness_` elsewhere in this CRM) — reported with its sample size, or "Insufficient historical date data" if no valid pair exists. Average Active Proposal Age averages real days-since-`Sent` for currently active proposals.

**Pipeline Aging** — "Oldest Active Prospects" is explicitly unavailable (same no-creation-date limitation). What *is* reported, all from real stored dates: Overdue Follow-Ups, prospects Never Contacted (blank Last Contact) vs. prospects with No Contact in 30+ days (`ANALYTICS_STALE_DAYS`), and Stalled Active Proposals (30+ days since Sent, still Sent/Under Review). "Age since available CRM date" (days since Last Contact / days since Sent) is never presented as "time in stage" or "prospect age," since this CRM doesn't store either.

**Pipeline Risks** — one ranked, deduplicated list (a business appears at most once, capped at 10) across six severity-ordered categories: (1) a Hot lead with no scheduled/overdue next action, (2) an overdue follow-up, (3) a High-priority prospect never contacted, (4) an active prospect with no contact in 30+ days, (5) a stalled active proposal, (6) an engaged prospect with no next follow-up scheduled at all. Reuses Sprint 7's Lead Score/Score Tier fields directly — **no second scoring model is created**.

**Performance by Industry** — for each Industry value present on Prospects: prospect count, active count, clients/wins, a current-state conversion % (only shown when the sample is at least `ANALYTICS_MIN_SAMPLE` = 3 prospects — below that it reads `"(sample too small for a reliable %)"` instead of a real-looking but statistically meaningless number), and revenue attributed via matching each Revenue row's `Client` name back to a Prospects Business (unmatched revenue is tracked separately as "unattributed," never silently dropped or misattributed to the wrong industry). Sorted by clients won, descending — a stated, documented choice, not an arbitrary one.

**Performance by Lead Source** — **unavailable, always.** Prospects has no lead-source/referral field, and the Referral Network sheet tracks referral *partners*, not which prospects came from which partner — there's no link between the two. Rather than invent a new column just to power this section, it reports the limitation plainly.

**Data Quality** — a compact section: Prospects missing Business/Status, active prospects missing Next Follow Up or any contact info (Phone and Email both blank), Proposals missing a Sent date or Value, and Clients missing Start or Status — because every metric above is only as reliable as this underlying data.

**Doesn't depend on the active sheet or a selection**, same as Daily Command Center — it reads Prospects/Meetings/Proposals/Clients/Revenue directly regardless of what's currently open.

A time-range filter (All Time / Last 30 Days / Last 90 Days / This Year) was considered and deliberately **not** built this sprint — Prospects has no creation date to filter cohorts by, and building reliable date-range infrastructure around the dates that *do* exist (Last Contact, Sent, Start) would add real complexity for a feature that couldn't apply consistently across every section anyway. All-time is the only view this schema can support honestly.

## CRM Health Audit (Sprint 10)

**RCS CRM > CRM Health** (`openCrmHealthAudit_`) answers *"is the RCS CRM data clean, complete, consistent, and trustworthy?"* — because Sprint 7-9's scores, funnels, and dollar figures are only as reliable as the data underneath them. **It is entirely read-only**, exactly like Daily Command Center and Pipeline Intelligence: no cell is ever edited, no row deleted, no record merged, no trigger created. It reuses Sprint 7-9's own building blocks directly (`buildAnalyticsProspectRecords_`, `buildDataQuality_`, `buildAging_`, `ANALYTICS_STALE_DAYS` from `CRM_Analytics.gs`; `SETTINGS_LISTS` from `CRM_Settings.gs`) rather than recomputing completeness or staleness a second time.

**Data Completeness** — reuses `CRM_Analytics.gs`'s own Data Quality check (Business/Status missing, active prospects missing Next Follow Up or contact info, Proposals missing Sent/Value, Clients missing Start/Status) and adds two more the Analytics report didn't need: prospects missing Industry and missing Website.

**Duplicates — deterministic exact-match only, nothing fuzzy.** Four identifiers are each normalized and grouped: Business name (trimmed, lowercased, internal whitespace collapsed), Website/domain (protocol and `www.` stripped, trailing slash removed), Email (trimmed, lowercased), and Phone (digits only, punctuation stripped). Any two-or-more records sharing a normalized value form a group, reported with its matching reason and the businesses involved. **Nothing is ever merged, edited, or deleted** — CRM Health only reports groups for a human to review. A business implicated by more than one match dimension (e.g. it matches on both Business name and Website) is still only counted once in the affected-business total, not once per dimension.

**Consistency — checked against `SETTINGS_LISTS`, this CRM's own source of truth.** Status, Priority, and Industry on Prospects, Status on Proposals, and Status on Clients are each compared (case-insensitively) against their real Settings dropdown list; a value not found in that list is flagged. **A blank value is never flagged here** — that's a completeness issue, reported separately, not a consistency one. One additional lightweight format check: an Email that doesn't contain `@` is flagged as malformed.

**Pipeline Integrity** — active prospects with no contact info, no Next Follow Up, or an overdue one; active prospects caught up in a duplicate group; and two cross-sheet checks the schema makes genuinely reliable via a direct Business-name match (the same convention `findLatestAuditForBusiness_` and every dedupe key in this CRM already use): an Archived/Do Not Contact prospect that still has a live (today-or-future) Next Follow Up set, and a prospect that exists in Clients (i.e. was actually converted) but whose Prospects.Status was never updated to reflect that (Convert to Client, Sprint 2, never touches Status by design, so this is an expected, honest finding, not a bug in the check).

**Stale Data** — reuses `CRM_Analytics.gs`'s `buildAging_` directly: Oldest Active Prospects is explicitly unavailable (no creation date stored, same limitation documented under Pipeline Intelligence), while Overdue Follow-Ups, Never Contacted, No Contact 30+ Days, and Stalled Active Proposals are all real, stored-date-derived counts.

**CRM Health Score — NOT the Sprint 7 Lead Score.** This never scores a prospect; it scores the CRM's own data quality. Five equally-weighted categories, each a plain, explained issue-rate calculation — no hidden weights:

| Category | Formula |
|---|---|
| Completeness | 100 × (1 − *active prospects with a completeness issue* ÷ *active prospect count*) |
| Duplicate Risk | 100 × (1 − *businesses in a duplicate group* ÷ *total prospect records*) |
| Consistency | 100 × (1 − *invalid field values found* ÷ *Prospects + Proposals + Clients records*) |
| Pipeline Integrity | 100 × (1 − *active prospects with an integrity issue* ÷ *active prospect count*) |
| Freshness | 100 × (1 − *active prospects overdue/never-contacted/stale* ÷ *active prospect count*) |

Each score is rounded and floored at 0. **A denominator of zero (nothing to evaluate) scores that category 100** — an empty or tiny CRM isn't penalized for having no data to check. `CRM Health` (the overall number) is the simple average of the five — stated as such, not a hidden weighting.

**Priority Fixes** — the top 10 issues (by impact tier, then by affected-record count), each with the affected record count, why it matters, and a recommended manual action. **CRM Health never fixes anything automatically** — every recommendation is something a person does in the sheet.

**Doesn't depend on the active sheet or a selection**, same as Daily Command Center and Pipeline Intelligence.

**A real bug caught by this sprint's own testing:** `CRM_Analytics.gs`'s `buildAnalyticsProspectRecords_` (Sprint 9) extended each Prospects row with extra fields (Industry, Archived Date, days since Last Contact, contact-info presence) via a lookup keyed by *Business name* — but Business name isn't guaranteed unique, and duplicate detection is this sprint's entire premise. Two prospects sharing an identical Business name would have had the *second* row's Industry/Archived Date/contact-info silently overwrite the first's for *both* rows. Fixed by aligning that extension by row position instead (the same order Command Center's own per-row pass already walks), in both `CRM_Analytics.gs` and this sprint's own `CRM_Health.gs`, which shares the identical pattern for Website/Phone/Email. The full Sprint 9 regression suite (76 assertions) was re-run afterward and still passes unmodified — the fix doesn't change behavior for any prospect with a unique Business name, which is what every existing test used.

## Automation & Daily Maintenance (Sprint 11)

**RCS CRM > Automation** answers *"is the CRM being kept clean day to day, without anyone having to remember to run Pipeline Intelligence or CRM Health manually?"* — a small, safe automation layer on top of the read-only reports already built in Sprints 8-10. **It never edits, deletes, archives, merges, or reassigns a Prospect, Proposal, Client, or Revenue record.** Every feature here is either a reporting pass or bookkeeping about the automation's own run history, stored on its own Settings panel — the exact same pattern `CRM_Sync.gs` already uses for Auto Sync. It reuses `buildHealthProspectRecords_`/`buildCompletenessSection_`/`buildDuplicatesSection_`/`buildConsistencySection_`/`buildIntegritySection_` (`CRM_Health.gs`), `buildAging_`/`getSheetRows_`/`getDistinctBusinesses_` (`CRM_Analytics.gs`), `isAutoSyncEnabled_`/`GITHUB_OWNER`/`GITHUB_REPO` (`CRM_Sync.gs`), `formatScoreDate_` (`CRM_Scoring.gs`), and `writeSectionHeader_` (`CRM_Dashboard.gs`) — **no completeness, duplicate, consistency, integrity, or aging detection is reimplemented anywhere in this file.**

**A. Daily CRM Maintenance** — `RCS CRM > Automation > Run CRM Maintenance` builds one report covering: overdue follow-ups, prospects missing Next Follow Up, active prospects missing contact info, stale active prospects (never contacted or no contact in 30+ days), active proposals needing attention (stalled 30+ days), incomplete client records, invalid/unknown statuses, and duplicate business groups — each figure computed by calling straight into CRM Health's own section builders and CRM Analytics' own aging function, never a second implementation of the same check. **This is a reporting/maintenance pass only** — nothing is ever automatically edited, deleted, archived, merged, or reassigned; the report itself says so explicitly whenever it finds anything, and points to CRM Health for full detail.

**B. Automation Status** — `RCS CRM > Automation > Automation Status` shows, in one alert: Auto Sync Enabled/Disabled (reading Sprint 3's own flag as-is), Daily Maintenance Enabled/Disabled, the live Daily Maintenance trigger count (flagged if it's ever anything other than exactly 0 or 1), the last maintenance run's timestamp and one-line result (if any run has happened), and whether GitHub Sync's own required configuration (`GITHUB_OWNER`) is present — reusing that real constant rather than inventing a new "configuration" concept.

**C. Daily Maintenance trigger** — `Enable Daily Maintenance` / `Disable Daily Maintenance` install/remove one optional daily time-driven trigger (`dailyMaintenanceTrigger_`, ~6am script time zone), mirroring `CRM_Sync.gs`'s Auto Sync trigger pattern exactly: `Enable` always removes any existing trigger for this same handler before creating a new one, so repeated clicks never produce more than one; `Disable` removes only this automation's own trigger and never touches Auto Sync's `hourlySyncTrigger_` or any other trigger in the project. The trigger callback itself re-checks the Daily Maintenance Enabled flag on Settings before doing anything (never trusts the trigger's mere existence), runs the identical maintenance report the menu item runs, and is wrapped in a try/catch that logs instead of throwing — there's no UI available to a trigger, and an unattended trigger that throws repeatedly is how Google ends up silently disabling it.

**D. Manual run** — `Run CRM Maintenance` (feature A above) is also the manual, on-demand entry point; it shows the report in a dialog and records its own run bookkeeping on the Settings panel, exactly like the trigger does when run unattended.

**Settings Automation panel:** columns K:L on Settings (separate from the GitHub Sync panel at H:I and the six dropdown-list columns at A:F) hold: **Daily Maintenance Enabled** — a checkbox, unchecked by default (opt-in, same convention as Auto Sync), **Last Maintenance Run**, and **Last Maintenance Result** (a one-line summary, e.g. `Issues: 3 (Overdue 1, Missing NFU 0, ...)`). Provisioned idempotently by `ensureAutomationStatusBlock_` — only fills in blank cells, never resets a live Enabled flag or run history on a rebuild.

**Safety — Automation never:** changes Prospect Status, Lead Score, Score Tier, or Score Reasons; modifies an audit, a proposal, a client, or revenue; sends outreach, email, or SMS; deletes data; merges records; or creates more than one of its own trigger. Archived/Do Not Contact prospects are excluded from every active-pipeline finding, the same exclusion rule (`excluded`, from `buildHealthProspectRecords_`) used by CRM Health. The only writes this file ever performs are to its own three bookkeeping cells on the Automation Settings panel — everything else is `getValues()`/`getValue()` only.

**Idempotent by design:** running the maintenance report twice against unchanged data produces a byte-identical result; repeated Enable calls always leave exactly one trigger; repeated Disable calls are a harmless no-op once already disabled.

## Next-Action Engine (Sprint 12)

**RCS CRM > Next Actions** (`openNextActions_`) answers *"what should I act on next?"* as one ranked, read-only report across Prospects, Meetings, Proposals, and Clients. **It never scores anything** — Sprint 7's stored Lead Score/Score Tier are read exactly as-is (`scoreDisplay` shows the real stored number and tier, or `"Not scored"` when neither exists — never a computed or fabricated substitute) — and it never re-detects a condition CRM Health/Analytics already compute; it reuses `buildHealthProspectRecords_` (`CRM_Health.gs`, itself already extending `CRM_Analytics.gs`'s and `CRM_CommandCenter.gs`'s own record builders — one call gets Business/Status/Priority/Lead Score/Tier/Next Follow Up/Phone/Email/the Archived-DNC exclusion flag), `buildAging_`/`getSheetRows_` (`CRM_Analytics.gs`) for stalled proposals, and `getUpcomingMeetings_`/`compareDateToToday_`/`sortByLeadScoreThenBusiness_`/`sortByDateThenBusiness_`/`HOT_ACTION_EXCLUDED_STATUSES` (`CRM_CommandCenter.gs`) — no date parsing, scoring, or exclusion rule is reimplemented anywhere in this file.

**Seven priority tiers**, in this exact fixed order — a business appears at most once in the final list, under its *highest*-priority qualifying tier:

| # | Tier | Condition | Action category |
|---|---|---|---|
| 1 | Overdue follow-ups | Prospects.Next Follow Up is a real date before today | `FOLLOW UP` |
| 2 | Follow-ups due today | Prospects.Next Follow Up is exactly today | `FOLLOW UP` |
| 3 | High-score prospects needing action | Score Tier "Hot" or Lead Score ≥ 80 (Sprint 7, read as-is), and Status isn't already Won/Closed | `CONTACT` |
| 4 | Active prospects missing a next follow-up | No Next Follow Up date on file, Status isn't Won/Closed, and the business isn't already tracked via a Meeting or a Proposal (see below) | `UPDATE CRM` |
| 5 | Meetings requiring attention | A Meetings row that's upcoming (today/future — reused directly from Command Center), **or** one whose Date is in the past with a blank Outcome (a genuinely new check this sprint adds) | `PREPARE MEETING` (upcoming) / `UPDATE CRM` (Outcome not logged) |
| 6 | Stalled proposals | Sent/Under Review 30+ days ago (`ANALYTICS_STALE_DAYS`, via `buildAging_`'s own `staleProposals` — not recomputed) | `REVIEW PROPOSAL` |
| 7 | Other active opportunities with a missing next action | A Client whose Status is "Paused" (an active project with no next step recorded anywhere in this schema), or an active, non-excluded, non-closed prospect with neither a Phone nor an Email on file | `UPDATE CRM` |

**Tier 4 doesn't swallow tiers 5/6:** a prospect with a scheduled Meeting or an open Proposal already has a next-action mechanism tracked outside of Prospects.Next Follow Up, so tier 4 explicitly excludes any business appearing in Meetings (any row) or Proposals (any row) — this was caught by this sprint's own testing (see below) and fixed before commit, so a business with a meeting or proposal always surfaces its specific, more useful tier-5/6 reason instead of a generic "missing" one.

**Every entry shows, where the data exists:** Business, current Status, Lead Score/Tier (`"Not scored"` if never scored), the specific reason the action is needed, Next Follow-Up date (`"(none)"` if blank), Phone/Email (`"Not on file"` if neither exists), and one of exactly five deterministic **Suggested Action Categories** — `FOLLOW UP`, `CONTACT`, `PREPARE MEETING`, `REVIEW PROPOSAL`, `UPDATE CRM` — assigned by the fixed table above, never freeform text.

**Exclusions:**
- **Archived / Do Not Contact** (`r.excluded`, from `buildHealthProspectRecords_`) never appear as an active action, in any tier, under any circumstance — not even a Hot score or a genuinely overdue date overrides this.
- **Closed/Won/Lost** (`HOT_ACTION_EXCLUDED_STATUSES` — Won, Closed — Lost, Closed — Not Interested) are excluded from tiers 3/4/7, since a resolved deal needs no more selling action — **except** tiers 1/2: a Won/Closed record with a genuinely stored overdue/due-today Next Follow Up date still surfaces there, per the sprint's own "unless a legitimate stored follow-up requires attention" rule.
- **Missing/malformed dates never read as overdue.** `compareDateToToday_` returns `null` (not `'past'`) for a blank or unparseable Next Follow Up — such a record instead surfaces, correctly, as tier 4's "missing next follow-up" data gap.

**Top 10, with the true count always shown:** the final ranked list is capped at 10 (`NEXT_ACTION_LIMIT`), and the report header always states `"showing N of totalFound"` — the true, uncapped count — so a busy day's real scope is never hidden by the cap; per-tier summary counts (shown at the top of the report) are also uncapped.

**Follow Ups sheet — inspected, deliberately not used as a data source.** No existing CRM feature (Import, Actions, Sync, Command Center, Analytics, Health, or Automation) has ever written a row to it — only the Dashboard's static `Follow Ups Due` formula reads it — and Prospects.Next Follow Up is the one live follow-up mechanism every other sprint already relies on. Building a second, parallel read path for a sheet nothing populates would itself be the kind of invented feature this sprint's anti-fabrication rule forbids, so it was left alone.

**Doesn't depend on the active sheet or a selection**, same as Daily Command Center, Pipeline Intelligence, and CRM Health.

## Safety / idempotency

- `buildRCSCRM()` is safe to run any number of times.
- **Sheets:** created only if missing (looked up by name) — never duplicated.
- **Headers:** written in full only on a truly blank sheet. On a sheet that already has headers, only whichever target headers are missing get appended *after* the existing ones — never inserted in the middle, never duplicated, never reordered. This is what let Sprint 2 rely on `Archived Date` reaching a Prospects sheet built with a version of this script that predates it, with no manual migration step.
- **Settings lists:** seeded in full the first time; on later runs, only canonical values not already present in that column get appended after what's there — a team's own additions to a list are never touched.
- **Data rows:** never read, moved, or deleted by `Code.gs`, `CRM_Builder.gs`, or `CRM_Settings.gs`. Import, GitHub Sync, Website Audit, Outreach Brief, Outreach Execution (Mark as Contacted / Schedule Follow-Up / Generate Follow-Up Message), Lead Scoring, and the three Prospect Actions only ever *append* new rows elsewhere or edit specific cells on an explicitly selected/matched Prospects row — see the sections above for exactly what each one touches. A failed audit writes nothing at all; a brief that can't be generated (no audit / incomplete audit) writes nothing at all; Mark as Contacted and Schedule Follow-Up write nothing if declined at their confirmation step; Generate Follow-Up Message never writes to Notes unless the save is explicitly confirmed; declining a scoring confirmation writes nothing and doesn't even provision the scoring columns. Formatting operations (banding, filters, validation, column width) only touch formatting/structure, never cell values.
- **Mark as Contacted never touches Next Follow Up, and Schedule Follow-Up never touches Status/Last Contact** — the two actions are deliberately independent, matching the sprint's explicit "do not automatically change Next Follow Up" constraint.
- **Outreach Brief's own column** is provisioned additively by `CRM_Outreach.gs` itself (not through `CRM_Builder.gs`/`ensureHeaders_`, since that file wasn't touched this sprint) — same append-only, never-reorder rule, just a self-contained implementation of it.
- **The three Lead Scoring columns** are provisioned additively by `CRM_Scoring.gs` calling `Code.gs`'s own `ensureHeaders_` directly (again without touching `CRM_Builder.gs`) — same append-only, never-reorder rule as Outreach Brief, and correctly appends after Outreach Brief's column if that one was added first.
- **Scoring never changes Status, Priority, or any other field it reads** — it only ever writes Lead Score / Score Tier / Score Reasons, and re-scoring (Score All Prospects run again) updates those three cells in place rather than creating new rows or columns.
- **Daily Command Center is fully read-only** — `CRM_CommandCenter.gs` contains no `setValue`/`setValues` call anywhere; it only reads Prospects, Website Audits, Meetings, and Proposals and displays one alert. It creates no sheet, no trigger, and sends nothing.
- **Pipeline Intelligence is fully read-only** — `CRM_Analytics.gs` contains no `setValue`/`setValues` call anywhere either; it only reads Prospects, Website Audits, Meetings, Proposals, Clients, and Revenue and displays one alert. No sheet, no trigger, no external call, no fabricated metric — every number either comes from a real stored value or is explicitly labeled unavailable.
- **CRM Health is fully read-only** — `CRM_Health.gs` contains no `setValue`/`setValues` call anywhere either; it only reads Prospects, Proposals, and Clients and displays one alert. It never merges, deletes, or edits a duplicate record it finds — every duplicate group and every priority fix is a report for a human to act on manually.
- **Triggers:** `enableAutoSync_` always removes every existing sync trigger before creating a new one, so repeated clicks never produce more than one. `disableAutoSync_` removes it and is a harmless no-op if none exists. `enableDailyMaintenance_`/`disableDailyMaintenance_` follow the identical pattern for `dailyMaintenanceTrigger_`, matched strictly by handler function name, so the two features' triggers never interfere with each other.
- **Automation is fully read-only against CRM data** — `CRM_Automation.gs` contains no `setValue`/`setValues` call against Prospects, Proposals, Clients, or Revenue anywhere; the only cells it ever writes are its own three bookkeeping cells (Enabled / Last Maintenance Run / Last Maintenance Result) on the Automation Settings panel. It creates no new sheet, sends no email/SMS/outreach, and calls no external API or AI service.
- **The Next-Action Engine is fully read-only** — `CRM_NextAction.gs` contains no `setValue`/`setValues` call anywhere; it only reads Prospects, Meetings, Proposals, and Clients and displays one alert. No new sheet, no trigger, no external call, no AI, and no second scoring model — Sprint 7's Lead Score is read exactly as stored.
- **`Code.gs` doesn't hard-depend on `CRM_Sync.gs`:** the one line `buildRCSCRM()` added for the Sync panel is guarded (`if (typeof ensureSyncStatusBlock_ === 'function')`), so the CRM still builds correctly even if `CRM_Sync.gs` hasn't been added to the project yet — useful mid-setup, and also what let Sprint 1's and Sprint 2's original standalone test suites keep passing unmodified against this sprint's `Code.gs`.
- **Dashboard is the one deliberate exception:** every cell on it is computed from the other sheets, so `buildDashboard_()` clears and redraws that one sheet on every run — there's nothing to lose, since it holds no manually-entered records, and this is what guarantees no duplicate Dashboard sections rather than trying to diff and patch a formula layout in place.

## Install steps

1. Open the target Google Sheet (a blank sheet is fine — the script also works on a sheet that already has data, including one already using an earlier version of this CRM).
2. **Extensions > Apps Script.**
3. In the Apps Script editor, delete the default `Code.gs` placeholder content, then create sixteen script files matching the names in this folder — **Code**, **CRM_Builder**, **CRM_Settings**, **CRM_Dashboard**, **CRM_Import**, **CRM_Actions**, **CRM_Sync**, **CRM_Audits**, **CRM_Outreach**, **CRM_OutreachWorkflow**, **CRM_Scoring**, **CRM_CommandCenter**, **CRM_Analytics**, **CRM_Health**, **CRM_Automation**, **CRM_NextAction** — and paste the matching file's contents into each (use the **+** next to "Files" in the left sidebar to add each one; Apps Script appends `.gs` automatically).
4. **Save** the project (e.g. name it "RCS CRM").
5. In the function dropdown at the top of the editor, select **`buildRCSCRM`** and click **Run**.
6. The first run prompts for authorization — Google's standard OAuth consent for a script to edit its own spreadsheet (Apps Script will list "See, edit, create, and delete your spreadsheets"). Review and click **Allow**. The first time **Sync Prospects**, **Auto Sync**, **Website Audit**, or **Enable Daily Maintenance** is used, a second authorization prompt appears for "Connect to an external service" (`UrlFetchApp`, for Sync/Audit only) and permission to manage triggers (for Auto Sync and Daily Maintenance) — both standard Apps Script consent prompts, not anything specific to this script. Outreach Brief, Outreach Execution (Mark as Contacted / Schedule Follow-Up / Generate Follow-Up Message), Lead Scoring, Daily Command Center, Pipeline Intelligence, CRM Health, running/checking Automation manually, and Next Actions need no extra authorization beyond the base spreadsheet scope, since none of them make any network calls.
7. Switch back to the spreadsheet tab and refresh the page (or close/reopen the sheet). An **RCS CRM** menu appears in the menu bar: **Build / Update CRM**, **Daily Command Center**, **Import Prospects...**, **Sync Prospects**, an **Auto Sync** submenu (Enable/Disable), a **Website Audit** submenu (Audit Selected Prospect / Audit Website URL), an **Outreach Tools** submenu (Generate Outreach Brief / Generate Brief for Selected Prospect — both do the same thing — plus Mark as Contacted / Schedule Follow-Up / Generate Follow-Up Message), a **Lead Intelligence** submenu (Score Selected Prospect(s) / Score All Prospects / Show Top Leads), **Pipeline Intelligence**, **CRM Health**, **Next Actions**, an **Automation** submenu (Run CRM Maintenance / Automation Status / Enable Daily Maintenance / Disable Daily Maintenance), and — below a separator — **Move to Outreach**, **Convert to Client**, and **Archive Lead**, which act on whichever Prospects row(s) are selected.

Re-running `buildRCSCRM()` (from the menu or the editor) is always safe — see Safety/idempotency above.

## Sprint 1 scope (done)

The 11-sheet schema, headers, Settings lists, dropdown validation, formatting, and the live Dashboard.

## Sprint 2 scope (done)

Import Prospects (CSV dialog + column matching/aliases + duplicate protection) and the three Prospect Actions (Move to Outreach / Convert to Client / Archive Lead).

## Sprint 3 scope (done)

GitHub Sync (manual, via `RCS CRM > Sync Prospects`) and Auto Sync (hourly trigger via `RCS CRM > Auto Sync`), added as one new file (`CRM_Sync.gs`) that reuses `importProspectsFromCsv_` from `CRM_Import.gs` unmodified. `CRM_Builder.gs`, `CRM_Settings.gs`, `CRM_Import.gs`, and `CRM_Actions.gs` were **not** modified at all that sprint. `Code.gs` changed in two small, targeted ways: `onOpen()` gained the Sync Prospects item and the Auto Sync submenu, and `buildRCSCRM()` gained one guarded call to provision the Settings Sync panel.

## Sprint 4 scope (done, this update)

Website Audit — fetch, score, and log a prospect's website — added as one new file (`CRM_Audits.gs`) that reuses `getSelectedProspectRows_`/`getHeaders_` (`CRM_Actions.gs`) and `applyBasicFilter_`/`autoResizeColumns_` (`Code.gs`) without modifying any of them. `CRM_Builder.gs`, `CRM_Settings.gs`, `CRM_Import.gs`, `CRM_Actions.gs`, and `CRM_Sync.gs` were **not** modified at all this sprint. Two other files changed in small, targeted ways: `Code.gs`'s `onOpen()` gained the Website Audit submenu (no changes to `buildRCSCRM()` this time), and `CRM_Dashboard.gs` gained one 4th card ("Audits Completed") in the existing Conversion & Client Metrics row, widening that row's header span from 6 to 8 columns — the 8-card Key Metrics row and every other Dashboard section are untouched.

**Deliberately not included in Sprint 4:** anything beyond what Website Audit needed — no new Settings lists, no schema changes to any sheet other than what was already there (Website Audits' columns already matched this sprint's spec exactly), no external API key or token of any kind.

## Sprint 5 scope (done, this update)

Outreach Brief — turn a saved Website Audits record into a deterministic sales brief — added as one new file (`CRM_Outreach.gs`) that reuses `getSelectedProspectRows_` (`CRM_Actions.gs`) and `applyBasicFilter_`/`autoResizeColumns_` (`Code.gs`) without modifying any of them. `CRM_Builder.gs`, `CRM_Settings.gs`, `CRM_Dashboard.gs`, `CRM_Import.gs`, `CRM_Actions.gs`, and `CRM_Sync.gs` were **not** modified at all this sprint — `CRM_Dashboard.gs` in particular wasn't touched since nothing in this sprint's scope needed a Dashboard change. `Code.gs` changed only to add the Outreach Tools submenu (`onOpen()`); `buildRCSCRM()` is unchanged.

**Deliberately not included in Sprint 5:** an "Audit Status" column on Prospects (allowed only "if useful/required" with an explicit preference to avoid it — see Outreach Brief above for why it wasn't needed), any AI/LLM API call, any additional web fetch beyond what Website Audit already stored, and any change to how Website Audits records are written (Outreach Brief is read-only against that sheet).

## Sprint 6 scope (done, this update)

Outreach Execution + Follow-Up — Mark as Contacted, Schedule Follow-Up, and Generate Follow-Up Message — added as one new file (`CRM_OutreachWorkflow.gs`) that reuses `getSelectedProspectRows_` (`CRM_Actions.gs`), `getLiveProspectsHeaders_`/`OUTREACH_BRIEF_COLUMN` (`CRM_Outreach.gs`), and `formatAuditDate_` (`CRM_Audits.gs`) without modifying any of them. `CRM_Builder.gs`, `CRM_Settings.gs`, `CRM_Dashboard.gs`, `CRM_Import.gs`, `CRM_Actions.gs`, `CRM_Sync.gs`, and `CRM_Audits.gs` were **not** modified at all this sprint. `Code.gs` changed only to add the three new items to the existing Outreach Tools submenu (`onOpen()`); `buildRCSCRM()` is unchanged, and the two pre-existing Outreach Tools menu items keep their exact prior labels/targets.

**Deliberately not included in Sprint 6:** any AI/LLM API call, any new sheet, any new external service, any change to how Website Audits or the Outreach Brief text itself are written, and any automatic cross-field side effect — Mark as Contacted never touches Next Follow Up, and neither action ever moves a row to another sheet or archives/deletes anything, per the sprint's explicit constraints.

## Sprint 7 scope (done, this update)

Lead Scoring + Prioritization — the RCS Lead Priority Score — added as one new file (`CRM_Scoring.gs`) that reuses `getSelectedProspectRows_` (`CRM_Actions.gs`), `getLiveProspectsHeaders_`/`OUTREACH_BRIEF_COLUMN`/`findLatestAuditForBusiness_` (`CRM_Outreach.gs`), `formatAuditDate_` (`CRM_Audits.gs`), and `ensureHeaders_`/`applyBasicFilter_`/`autoResizeColumns_` (`Code.gs`) without modifying any of them. `CRM_Builder.gs`, `CRM_Settings.gs`, `CRM_Import.gs`, `CRM_Actions.gs`, `CRM_Sync.gs`, `CRM_Audits.gs`, `CRM_Outreach.gs`, and `CRM_OutreachWorkflow.gs` were **not** modified at all this sprint. Two other files changed in small, targeted ways: `Code.gs`'s `onOpen()` gained the Lead Intelligence submenu (no changes to `buildRCSCRM()`), and `CRM_Dashboard.gs` gained one 5th card ("Hot Leads") in the existing Conversion & Client Metrics row, widening that row's header span from 8 to 10 columns — the 8-card Key Metrics row, Pipeline Summary, and every other Dashboard section are untouched.

**Deliberately not included in Sprint 7:** any AI/LLM API call, any claim that the score predicts probability of closing (checked directly by tests — see below), any new sheet (Show Top Leads is a single alert, not a sheet), any automatic Status/Priority/data change as a side effect of scoring, and any modification to `CRM_Builder.gs` (the three scoring columns are provisioned the same additive, self-contained way Sprint 5's Outreach Brief column was).

## Sprint 8 scope (done, this update)

Daily Sales Command Center — added as one new file (`CRM_CommandCenter.gs`) that reuses `getLiveProspectsHeaders_`/`OUTREACH_BRIEF_COLUMN`/`findLatestAuditForBusiness_`/`isAuditDataComplete_` (`CRM_Outreach.gs`), `isExcludedFromTopLeads_`/`formatScoreDate_` (`CRM_Scoring.gs`), and `getHeaders_` (`CRM_Actions.gs`) without modifying any of them and without reimplementing any exclusion, scoring, or audit-lookup logic. `CRM_Builder.gs`, `CRM_Settings.gs`, `CRM_Import.gs`, `CRM_Actions.gs`, `CRM_Sync.gs`, `CRM_Audits.gs`, `CRM_Outreach.gs`, `CRM_OutreachWorkflow.gs`, `CRM_Scoring.gs`, and — unlike Sprint 7 — `CRM_Dashboard.gs` too, were **not** modified at all this sprint (this sprint added no Dashboard KPI; the Pipeline Health counts live inside the Command Center's own report). `Code.gs` changed only to add the one new top-level **Daily Command Center** menu item; `buildRCSCRM()` is unchanged.

**Deliberately not included in Sprint 8:** any AI/LLM API call, any new sheet or stored field (everything is computed fresh on each run from existing sheets), any automatic write of any kind (it's read-only end to end — see Safety/idempotency above), any new scoring model (Hot/Warm/Cold and Lead Score come straight from Sprint 7, untouched), and any email or external notification.

## Sprint 9 scope (done, this update)

Pipeline Intelligence & Analytics — added as one new file (`CRM_Analytics.gs`) that reuses `buildProspectRecords_`/`compareDateToToday_`/`parseDateOrNull_`/`ACTIVE_PROPOSAL_STATUSES` (`CRM_CommandCenter.gs`), `getLiveProspectsHeaders_` (`CRM_Outreach.gs`), `isExcludedFromTopLeads_`/`formatScoreDate_` (`CRM_Scoring.gs`), and `getHeaders_` (`CRM_Actions.gs`) without modifying any of them and without reimplementing any exclusion, scoring, date-parsing, or active-proposal logic. `CRM_Builder.gs`, `CRM_Settings.gs`, `CRM_Import.gs`, `CRM_Actions.gs`, `CRM_Sync.gs`, `CRM_Audits.gs`, `CRM_Outreach.gs`, `CRM_OutreachWorkflow.gs`, `CRM_Scoring.gs`, `CRM_CommandCenter.gs`, and — as in Sprint 8 — `CRM_Dashboard.gs`, were **not** modified at all this sprint. `Code.gs` changed only to add the one new top-level **Pipeline Intelligence** menu item; `buildRCSCRM()` is unchanged.

**Deliberately not included in Sprint 9:** any AI/LLM API call, any new sheet or stored field, any fabricated historical conversion/stage-duration/revenue/probability/forecast (the mandatory constraint this whole sprint was built around — see the section above for exactly what's labeled unavailable and why), any time-range filter (considered and explicitly declined — see the Pipeline Intelligence section above), any new scoring model, and any automatic write of any kind.

## Sprint 10 scope (done, this update)

CRM Data Quality & Health Audit — added as one new file (`CRM_Health.gs`) that reuses `buildAnalyticsProspectRecords_`/`getSheetRows_`/`getDistinctBusinesses_`/`readField_`/`buildDataQuality_`/`buildAging_`/`ANALYTICS_STALE_DAYS` (`CRM_Analytics.gs`), `getLiveProspectsHeaders_` (`CRM_Outreach.gs`), `getHeaders_` (`CRM_Actions.gs`), and `SETTINGS_LISTS` (`CRM_Settings.gs`) without reimplementing any completeness, aging, or exclusion logic. `CRM_Builder.gs`, `CRM_Settings.gs`, `CRM_Import.gs`, `CRM_Actions.gs`, `CRM_Sync.gs`, `CRM_Audits.gs`, `CRM_Outreach.gs`, `CRM_OutreachWorkflow.gs`, `CRM_Scoring.gs`, `CRM_CommandCenter.gs`, and `CRM_Dashboard.gs` were **not** modified at all this sprint. `Code.gs` changed only to add the one new top-level **CRM Health** menu item; `buildRCSCRM()` is unchanged.

**One exception to "leave other modules untouched," made because it was directly load-bearing for this sprint's own core feature:** `CRM_Analytics.gs`'s `buildAnalyticsProspectRecords_` had a real, previously-undetected bug — its per-row field extension was keyed by Business name, which silently corrupted data for any two prospects sharing an identical name. Since duplicate detection (this sprint's central feature) specifically needs to handle that exact case correctly, the bug was fixed at its root (see the CRM Health Audit section above for the full explanation) rather than worked around locally. The Sprint 9 regression suite was re-run afterward and still passes all 76 assertions unmodified.

**Deliberately not included in Sprint 10:** any AI/LLM API call, any automatic merge/fix/delete of a detected issue (every finding is a report, not an action), any fuzzy or approximate matching for duplicate detection (exact-match on normalized identifiers only, clearly labeled as such), any new sheet, and any second lead-scoring system (the CRM Health Score scores the CRM's own data quality — it never scores a prospect, and Sprint 7's Lead Score is read as-is, not recomputed).

## Sprint 11 scope (done, this update)

Automation & Daily Maintenance — added as one new file (`CRM_Automation.gs`) that reuses `buildHealthProspectRecords_`/`buildCompletenessSection_`/`buildDuplicatesSection_`/`buildConsistencySection_`/`buildIntegritySection_` (`CRM_Health.gs`), `buildAging_`/`getSheetRows_`/`getDistinctBusinesses_` (`CRM_Analytics.gs`), `isAutoSyncEnabled_`/`GITHUB_OWNER`/`GITHUB_REPO` (`CRM_Sync.gs`), `formatScoreDate_` (`CRM_Scoring.gs`), and `writeSectionHeader_` (`CRM_Dashboard.gs`) without reimplementing any completeness, duplicate, consistency, integrity, or aging detection. `CRM_Builder.gs`, `CRM_Settings.gs`, `CRM_Import.gs`, `CRM_Actions.gs`, `CRM_Sync.gs`, `CRM_Audits.gs`, `CRM_Outreach.gs`, `CRM_OutreachWorkflow.gs`, `CRM_Scoring.gs`, `CRM_CommandCenter.gs`, `CRM_Analytics.gs`, `CRM_Health.gs`, and `CRM_Dashboard.gs` were **not** modified at all this sprint. `Code.gs` changed only to add the one new **Automation** submenu (`onOpen()`) and one guarded call to provision the Automation Settings panel (`buildRCSCRM()`), mirroring exactly how the GitHub Sync panel was added in Sprint 3; `buildRCSCRM()`'s sheet-building logic itself is otherwise unchanged.

**Deliberately not included in Sprint 11:** any AI/LLM API call, any external service call of any kind, any email/SMS sending, any new sheet, any automatic edit/delete/archive/merge/reassignment of a Prospect/Proposal/Client/Revenue record (every finding is a report, not an action — see Automation & Daily Maintenance above), any second implementation of completeness/duplicate/consistency/integrity/aging detection (all of it is reused directly from `CRM_Health.gs`/`CRM_Analytics.gs`), and any second scoring model.

## Sprint 12 scope (done, this update)

Next-Action Engine — added as one new file (`CRM_NextAction.gs`) that reuses `buildHealthProspectRecords_` (`CRM_Health.gs`), `buildAging_`/`getSheetRows_` (`CRM_Analytics.gs`), `getUpcomingMeetings_`/`compareDateToToday_`/`parseDateOrNull_`/`sortByLeadScoreThenBusiness_`/`sortByDateThenBusiness_`/`HOT_ACTION_EXCLUDED_STATUSES` (`CRM_CommandCenter.gs`), `getHeaders_` (`CRM_Actions.gs`), `normalizeBusinessKey_` (`CRM_Health.gs`), and `formatScoreDate_` (`CRM_Scoring.gs`) without reimplementing any date-parsing, scoring, exclusion, or staleness rule. `CRM_Builder.gs`, `CRM_Settings.gs`, `CRM_Dashboard.gs`, `CRM_Import.gs`, `CRM_Actions.gs`, `CRM_Sync.gs`, `CRM_Audits.gs`, `CRM_Outreach.gs`, `CRM_OutreachWorkflow.gs`, `CRM_Scoring.gs`, `CRM_CommandCenter.gs`, `CRM_Analytics.gs`, `CRM_Health.gs`, and `CRM_Automation.gs` were **not** modified at all this sprint. `Code.gs` changed only to add the one new top-level **Next Actions** menu item (`onOpen()`); `buildRCSCRM()` is unchanged — this sprint needed no new Settings bookkeeping panel.

**A real design bug caught by this sprint's own testing (not a test-script bug):** the first version of tier 4 ("missing next follow-up") matched any active, non-closed prospect with no Prospects.Next Follow Up date — with no awareness of Meetings or Proposals. Since a prospect can be actively tracked via a scheduled Meeting or an open Proposal without ever having a separate Next Follow Up date set on Prospects, and tier 4 ranks above tiers 5/6, this meant a business with an upcoming meeting or a stalled proposal would get swallowed by a generic "NO NEXT FOLLOW-UP SCHEDULED" / `UPDATE CRM` entry instead of ever surfacing its actual, more specific, more useful tier-5/6 signal — silently defeating the point of having dedicated Meetings/Proposals tiers at all. Fixed by having `buildNextActionsReport_` compute the set of businesses already tracked via any Meetings or Proposals row and excluding them from tier 4's candidate set (see the Next-Action Engine section above). Caught directly by this sprint's own priority-ordering and meetings/proposals tests before commit — no prior sprint's file or test needed any change.

**Deliberately not included in Sprint 12:** any AI/LLM API call, any external service call of any kind, any new sheet, any Settings bookkeeping panel (nothing about this report needs to persist between runs), any second scoring model (Sprint 7's Lead Score is read exactly as stored), a live read path against the Follow Ups sheet (inspected, deliberately not wired in — see above for why), and any invented deadline, probability, revenue figure, stage history, or customer-intent signal not already a real stored value.

## Testing performed before delivery

All of the following ran against a mocked Apps Script `SpreadsheetApp`/`Ui`/`UrlFetchApp`/`ScriptApp` API in Node (`node --check` for syntax, then a full functional dry run — the closest verification possible outside Google's actual runtime, since these services and the Sheets formula engine only exist there). Nothing was committed until every check below passed.

**Sprint 12 (76 assertions, all passing):**
- **Syntax:** all 16 `.gs` files individually passed `node --check`.
- **File-load-order safety:** all 16 files were concatenated and evaluated in both full reverse order and forward order, and both built 11 sheets with no exceptions.
- **Empty CRM:** confirmed the report doesn't throw, `actions` is empty, `totalFound` is 0, and every per-tier summary count is 0.
- **Overdue follow-ups:** a prospect with a Next Follow Up before today is counted, with the correct reason, `FOLLOW UP` action category, and a contact display combining phone and email; a future follow-up is confirmed absent entirely.
- **Follow-ups due today:** a Next Follow Up of exactly today produces the exact `FOLLOW-UP DUE TODAY` reason text and `FOLLOW UP` category.
- **High-score prospects needing action:** both qualifying conditions (Score Tier exactly "Hot" even with a sub-80 raw number, and a raw score ≥80 even with a lagging Warm tier label) are independently counted, with the exact stored score/tier shown; a genuine Warm/sub-80 prospect and a Won prospect with a would-be-Hot score are both confirmed excluded.
- **Missing next follow-up:** a prospect with no Next Follow Up is flagged with the exact `NO NEXT FOLLOW-UP SCHEDULED` reason and `UPDATE CRM` category; a prospect with a real date, and a Won prospect missing a date, are both confirmed excluded (resolved deals need no more selling action).
- **Meetings requiring attention:** an upcoming meeting produces a `PREPARE MEETING` entry naming its date and type; a past meeting with a blank Outcome produces a distinct `UPDATE CRM` "OUTCOME NOT LOGGED" entry; a past meeting with a real logged Outcome is confirmed to need no attention.
- **Stalled proposals:** a proposal 40 days since Sent (still Sent/Under Review) is flagged via `CRM_Analytics.gs`'s own `buildAging_` with the exact day count and `REVIEW PROPOSAL` category; a fresh 2-day proposal is confirmed not flagged.
- **Other active opportunities:** a Paused Client and a prospect with neither Phone nor Email are both counted under this tier with their exact reason text and `UPDATE CRM` category; an Active-status client is confirmed not flagged.
- **Priority ordering:** one qualifying business seeded per all 7 tiers simultaneously confirmed the returned order matches the documented 1-7 priority exactly.
- **Cross-tier dedup:** a business qualifying for both tier 1 (overdue) and tier 3 (high score) appears exactly once, correctly kept under its higher-priority tier-1 reason — while each tier's own summary count still independently (pre-dedup) reflects that the business qualified there too.
- **Archived/DNC exclusion:** confirmed an Archived prospect with both an overdue date and a Hot score, and a Do Not Contact prospect that would otherwise trip the no-contact-info tier, both never appear anywhere in the report.
- **Closed/Won/Lost exclusion, with its stated exception:** a Won prospect with no follow-up data is confirmed absent entirely, while a Won prospect with a genuinely stored overdue Next Follow Up date is confirmed to still surface, specifically under the overdue tier — proving the "unless a legitimate stored follow-up requires attention" rule is implemented precisely, not as a blanket Won exclusion.
- **Missing/malformed dates:** a non-date string in Next Follow Up is confirmed never counted as overdue or due-today, and instead correctly falls through to the missing-next-follow-up tier.
- **Blank Business rows:** seeded simultaneously across Prospects, Proposals, Clients, and Meetings — confirmed no throw and nothing is reported from any of them.
- **Duplicate records:** two Prospects rows sharing an identical Business name are both confirmed to independently qualify at the per-tier bucket level, while the final deduped action list correctly shows the business only once.
- **Lead Score integration:** a scored prospect shows its exact stored score and tier, byte-for-byte, never recomputed; an unscored prospect reads `"Not scored"`, never a fabricated number.
- **Deterministic output:** two consecutive report builds against unchanged data produce a byte-identical JSON result.
- **Top-10 limiting:** 15 qualifying overdue prospects seeded — confirmed the action list caps at exactly 10, while `totalFound` and the tier's own summary count both still report the true, uncapped 15.
- **Menu entry point + message formatting:** `openNextActions_` is confirmed to show a "Next Actions" dialog and return the same report shape as the underlying builder; the formatted message is confirmed to name the business and show its `ACTION:` category line; a separate empty-report case confirms the exact "no next actions found" message.
- **Read-only guarantee:** captured Prospects', Proposals', Clients', and Meetings' entire cell data before and after running Next Actions — confirmed byte-for-byte identical across all four, proving no write of any kind occurred.
- **One real design bug caught and fixed during this sprint's own testing** (not a test-script bug): tier 4 ("missing next follow-up") originally had no awareness of Meetings/Proposals, so a business with an upcoming meeting or a stalled proposal but no separate Prospects.Next Follow Up date was silently swallowed by a generic tier-4 entry instead of surfacing its actual, more specific tier-5/6 signal. Fixed by excluding any business already tracked via a Meetings or Proposals row from tier 4's candidate set — full explanation in the Next-Action Engine section and Sprint 12 scope above.

**Regression (all twelve re-run unmodified against this sprint's actual files, 0 failures):**
- **Sprint 1 suite** (73 assertions) still passes.
- **Sprint 2 suite** (61 assertions) still passes.
- **Sprint 3 suite** (56 assertions) still passes.
- **Sprint 4 suite** (88 assertions) still passes.
- **Sprint 4 fix suite** (28 assertions) still passes.
- **Sprint 5 suite** (54 assertions) still passes.
- **Sprint 6 suite** (66 assertions) still passes.
- **Sprint 7 suite** (110 assertions) still passes.
- **Sprint 8 suite** (75 assertions) still passes.
- **Sprint 9 suite** (76 assertions) still passes.
- **Sprint 10 suite** (60 assertions) still passes.
- **Sprint 11 suite** (62 assertions) still passes — confirming `Code.gs`'s new Next Actions menu item didn't disturb Automation or anything else Sprint 11 depends on.

**Sprint 11 (62 assertions, all passing):**
- **Syntax:** all 15 `.gs` files individually passed `node --check`.
- **File-load-order safety:** all 15 files were concatenated and evaluated in both full reverse order and forward order, and both built 11 sheets with no exceptions.
- **Settings Automation panel:** confirmed provisioned by `buildRCSCRM()` — header at K1, all 3 labels, the Enabled checkbox defaulting to unchecked — and confirmed the pre-existing GitHub Sync panel (H:I) is untouched by it.
- **Empty CRM:** confirmed the maintenance report doesn't throw and every count (including `totalIssues`) is exactly 0.
- **Overdue follow-up detection:** a prospect with a Next Follow Up before today is counted; one 3 days out is not.
- **Missing-action detection:** a prospect missing Next Follow Up and a separate prospect missing both Phone and Email are each counted exactly once, isolated from a fully-complete control row.
- **Stale-record detection:** a never-contacted prospect (blank Last Contact) and a 45-day-stale-contact prospect both count toward Stale Active Prospects; a 1-day-fresh contact does not.
- **Proposal/client checks:** a 45-day-stalled active proposal is counted while a 2-day-fresh one is not; an incomplete Client row (missing Start + Status) is counted while a complete one is not.
- **Invalid/unknown status detection:** one deliberately invalid Status is counted, a valid one is not.
- **Duplicate detection integration:** two prospects sharing a normalized Website/domain (distinct Business names) produce exactly 1 duplicate group and 2 affected businesses, calling straight into `CRM_Health.gs`'s own `buildDuplicatesSection_` rather than a second implementation.
- **Archived/DNC exclusion:** Archived prospects (including one with an overdue Next Follow Up) are confirmed excluded from missing-contact-info, overdue-follow-up, missing-next-follow-up, and stale-active-prospect counts alike.
- **Manual execution:** `menuRunCrmMaintenance_` shows a "CRM Maintenance" dialog and records a real `Date` for Last Maintenance Run plus a summary string starting with `Issues:` for Last Maintenance Result.
- **Automation Status:** confirmed correct before/after values for Auto Sync Enabled, Daily Maintenance Enabled, trigger count, and Last Maintenance Run across an enable/run cycle; confirmed GitHub Configured reflects the real `GITHUB_OWNER` constant; confirmed `menuAutomationStatus_` shows an "Automation Status" dialog.
- **Trigger enable / repeated enable / exactly one trigger:** the first `enableDailyMaintenance_()` call installs exactly one trigger; three additional repeated calls still leave exactly one; the Enabled checkbox reads `true` afterward.
- **Disable / repeated disable:** `disableDailyMaintenance_()` removes the trigger; two additional repeated calls leave 0 triggers; the Enabled checkbox reads `false` afterward.
- **Unrelated trigger preservation:** seeded a real Auto Sync trigger first (`enableAutoSync_`), then enabled Daily Maintenance twice, disabled it, and disabled Auto Sync — confirmed at every step that each feature's trigger count is affected only by its own Enable/Disable calls, never the other's.
- **Trigger execution without UI:** `dailyMaintenanceTrigger_()` called directly (simulating a real trigger firing) runs without throwing, never calls `ui.alert`, and still records Last Maintenance Run — proving the trigger path needs no UI.
- **Trigger re-checks its own Enabled flag:** calling `dailyMaintenanceTrigger_()` without ever enabling Daily Maintenance is confirmed to be a complete no-op (Last Maintenance Run stays blank) — it doesn't trust the trigger's mere existence.
- **Trigger error handling:** with Daily Maintenance enabled, `buildDailyMaintenanceReport_` was temporarily monkey-patched to throw; confirmed `dailyMaintenanceTrigger_()` still doesn't throw and that the failure was actually logged (not silently swallowed).
- **Deterministic output:** two consecutive `buildDailyMaintenanceReport_` calls against unchanged data produce a byte-identical JSON report.
- **No data mutation:** captured Prospects', Proposals', and Clients' entire cell data before running a manual run, an enable, a trigger firing, and a disable — confirmed byte-for-byte identical afterward across all three (only the Automation's own Settings panel legitimately changes).
- **No duplicate findings:** a single prospect that is simultaneously overdue and missing contact info is confirmed counted exactly once in each relevant bucket, and not also counted as "missing Next Follow Up" (a date does exist, it's just overdue).
- **Blank rows, missing fields, missing dates:** blank-Business rows seeded across Prospects/Proposals/Clients simultaneously, plus a prospect with no Last Contact/Next Follow Up at all — confirmed no throw, blank-Business rows excluded from every count, and `totalIssues` remains a valid non-negative number.

**Regression (all eleven re-run unmodified against this sprint's actual files, 0 failures):**
- **Sprint 1 suite** (73 assertions) still passes.
- **Sprint 2 suite** (61 assertions) still passes.
- **Sprint 3 suite** (56 assertions) still passes.
- **Sprint 4 suite** (88 assertions) still passes.
- **Sprint 4 fix suite** (28 assertions) still passes.
- **Sprint 5 suite** (54 assertions) still passes.
- **Sprint 6 suite** (66 assertions) still passes.
- **Sprint 7 suite** (110 assertions) still passes.
- **Sprint 8 suite** (75 assertions) still passes.
- **Sprint 9 suite** (76 assertions) still passes.
- **Sprint 10 suite** (60 assertions) still passes — confirming `Code.gs`'s new Automation submenu and the new Automation Settings panel didn't disturb CRM Health or anything else Sprint 10 depends on.

**Sprint 10 (60 assertions, all passing):**
- **Syntax:** all 14 `.gs` files individually passed `node --check`.
- **File-load-order safety:** all 14 files were concatenated and evaluated in both full reverse order and forward order, and both built 11 sheets with no exceptions.
- **Normalization helpers** (pure functions): confirmed Business-key collapses whitespace and lowercases, domain-key strips protocol/`www.`/trailing slash, phone-key strips all non-digit characters, and email-key trims and lowercases — each tested against a deliberately messy input.
- **Health-score boundary math** (`scoreFromRate_`, a pure function): 0-of-10 → 100, 10-of-10 → 0, 5-of-10 → 50, 0-of-0 → 100 (nothing to evaluate is never penalized), and 3-of-7 → 57 (rounding verified).
- **Empty CRM:** confirmed no throw, a 100/100 overall score with every category at 100, zero duplicate groups, and zero priority fixes.
- **Missing fields:** a 3-prospect scenario, each deliberately missing exactly one field (Industry / Website / Status), confirmed each completeness counter isolates correctly.
- **Duplicate detection — one clean group per dimension:** 8 prospects seeded in 4 matching pairs (Business name, Website/domain, Email, Phone) confirmed exactly 4 groups, the correct matching reason on each, and that all 8 original records remain fully intact afterward (nothing merged or deleted).
- **Duplicate detection — cross-dimension double-counting:** a 3-row scenario where one business is implicated by two different match reasons confirmed it's counted once in the affected-business total, not twice.
- **Consistency vs. Settings:** invalid Status/Priority/Industry/Proposal-Status/Client-Status values are each detected independently; a blank Status is confirmed **not** flagged (that's a completeness issue, not a consistency one); a valid value typed in a different case is confirmed **not** flagged (case-insensitive matching against `SETTINGS_LISTS` works); a malformed email (no `@`) is detected.
- **Stale records:** confirmed the staleness section (reused directly from `CRM_Analytics.gs`'s `buildAging_`) correctly reports overdue follow-ups, 45-day-stale contacts, and the explicit "not available" message for Oldest Active Prospects.
- **Pipeline integrity + cross-sheet checks:** confirmed active-prospect no-contact-info and no-next-action detection in isolation; confirmed an Archived prospect with a still-scheduled Next Follow Up is flagged while a "clean" Archived prospect (no follow-up) is not; confirmed a prospect that exists in Clients but whose Status wasn't updated to reflect conversion is flagged, while one correctly marked "Won" is not.
- **Archived/DNC handling:** confirmed an Archived prospect is excluded from active-pipeline integrity counts entirely, but is still checked for consistency (an invalid Priority on an Archived record is still caught).
- **Priority Fixes top-10 limit:** a comprehensive scenario triggering all 15 possible issue types simultaneously confirmed the list caps at exactly 10, every entry has a positive record count, and entries are sorted by impact tier.
- **Deterministic repeated output:** two consecutive runs against unchanged data produce a byte-identical JSON report.
- **Blank Business rows:** seeded across Prospects, Proposals, and Clients simultaneously — confirmed no throw and none are counted toward any check.
- **No-data behavior:** a CRM with only Prospects populated (no Proposals/Clients/Meetings) computes a real, valid 0-100 score without throwing.
- **Wrong-sheet handling:** running CRM Health while Revenue (not Prospects) is the active sheet doesn't throw and still finds the same results.
- **Read-only guarantee:** captured Prospects', Proposals', and Clients' entire cell data before and after running the audit — confirmed byte-for-byte identical across all three, proving no write of any kind occurred.
- **One real bug caught and fixed during this sprint's own testing** (not a test-script bug): `CRM_Analytics.gs`'s `buildAnalyticsProspectRecords_` merged each row's extra fields (Industry, Archived Date, days since Last Contact, contact-info presence) via a Business-name-keyed lookup — when two rows shared an identical Business name (exactly the scenario Sprint 10's own duplicate-detection tests exercise), the second row's data silently overwrote the first's for both. Fixed by aligning the merge by row position instead, in both `CRM_Analytics.gs` and this sprint's `CRM_Health.gs`. Two accompanying test-script mistakes (under-specified fixtures that let unrelated records trip the same counters as the ones under test) were also found and fixed while diagnosing this — documented in the commit as test-only fixes, distinct from the real source bug.

**Regression (all ten re-run unmodified against this sprint's actual files, 0 failures):**
- **Sprint 1 suite** (73 assertions) still passes.
- **Sprint 2 suite** (61 assertions) still passes.
- **Sprint 3 suite** (56 assertions) still passes.
- **Sprint 4 suite** (88 assertions) still passes.
- **Sprint 4 fix suite** (28 assertions) still passes.
- **Sprint 5 suite** (54 assertions) still passes.
- **Sprint 6 suite** (66 assertions) still passes.
- **Sprint 7 suite** (110 assertions) still passes.
- **Sprint 8 suite** (75 assertions) still passes.
- **Sprint 9 suite** (76 assertions) still passes unmodified **even after the `CRM_Analytics.gs` bug fix** — confirming the fix changes behavior only for the previously-broken duplicate-Business-name case, which no existing Sprint 9 test exercised.

**Sprint 9 (76 assertions, all passing):**
- **Syntax:** all 13 `.gs` files individually passed `node --check`.
- **File-load-order safety:** all 13 files were concatenated and evaluated in both full reverse order and forward order, and both built 11 sheets with no exceptions.
- **Empty CRM:** confirmed no throw, all-zero overview totals, the funnel reporting unavailable, every value field `null`, empty risks/industry lists, and both the lead-source and prospect-creation-velocity messages stating unavailability explicitly.
- **Active pipeline counts + status grouping:** 3 seeded prospects (1 New, 2 Contacted) produced the correct total, active count, and per-status breakdown.
- **Archived/DNC exclusion:** confirmed Archived and Do Not Contact prospects are both excluded from Active Pipeline yet still counted in the total, and reported as two separate, non-overlapping counts.
- **Current-state funnel:** built a real 5-stage scenario (a New-only prospect, a Contacted one, one with a real Meeting, one with a Meeting+Proposal, and one with a Meeting+Proposal+Client record) and verified every stage count and every conversion percentage against hand-computed values (20% overall, 50% proposal→client, 66.7% meeting→proposal) — confirmed the funnel is explicitly labeled `CURRENT-STATE FUNNEL`.
- **Zero-denominator handling:** no proposals on file correctly yields `null` (N/A) for proposal→client, not `NaN`; a real 0% (not null) is shown when the denominator itself is nonzero but the numerator is genuinely zero.
- **Proposal value calculations:** 6 proposals across Sent/Under Review/Accepted/Accepted/Declined/Draft — confirmed active value sums only Sent+Under Review, average won value averages Accepted only, and closed/lost value sums Declined only, each excluding the other statuses correctly.
- **Revenue calculations:** confirmed Won Revenue sums only `Paid === true` rows and Total Invoiced sums every row regardless of Paid — same convention as the Dashboard's own Monthly Revenue formula.
- **Aging calculations:** confirmed overdue-follow-up, never-contacted (blank Last Contact), and stale-contact (40 days > the 30-day threshold) counts are each independently correct, and that a genuinely fresh contact (5 days) is not miscounted as stale; confirmed a stale active proposal (40 days since Sent) is detected by business name.
- **Pipeline Risks — full ranking order:** seeded one qualifying business per all 6 risk categories simultaneously and confirmed the returned order matches the documented severity order exactly, and that a Hot lead with an overdue follow-up is correctly bucketed under the Hot reason (higher priority) rather than the overdue one.
- **Top-10 risk limit:** 15 qualifying overdue prospects seeded — confirmed the risk list is capped at exactly 10.
- **Hot Lead integration:** confirmed the Overview's Hot count correctly recognizes both Score-Tier-exactly-"Hot" and Lead-Score-≥-80 prospects (reading Sprint 7's own stored fields, not recomputing anything), and that a genuine Warm/sub-80 prospect is excluded.
- **Industry analysis:** a 3-industry scenario (Roofing: 5 prospects/2 clients/$1200 revenue, Plumbing: 2 prospects/1 client, HVAC: 4 prospects/0 clients) confirmed correct conversion percentages, the sample-too-small guard triggering only for Plumbing (n=2 < `ANALYTICS_MIN_SAMPLE`=3), a genuine 0% being shown for HVAC (sample sufficient, real zero — distinct from "too small to tell"), correct clients-won-descending sort order, and revenue correctly attributed by Client-name-to-Business match, with a deliberately-unmatched Revenue row tracked separately as unattributed rather than silently dropped or misattributed.
- **Lead-source analytics:** confirmed the report always states unavailability from the current schema, regardless of what's seeded — there's no field to analyze, so nothing is fabricated.
- **Missing dates / missing values:** malformed date strings and blank Proposal Values across Prospects/Proposals/Clients never throw, are correctly excluded from date- and value-based calculations, and are correctly flagged in Data Quality.
- **Insufficient historical date data:** confirmed Prospect-Creation→Client is always reported unavailable; confirmed Proposal→Client velocity is `null` with no valid Sent/Start pair, and computes a real, correct day-count (15 days) once one genuinely exists.
- **Deterministic repeated output:** two consecutive calls against unchanged data produce a byte-identical JSON report.
- **Blank Business rows:** seeded simultaneously across Prospects, Meetings, Proposals, and Clients — confirmed no throw and none are counted anywhere.
- **Wrong-sheet handling:** running Pipeline Intelligence while Revenue (not Prospects) is the active sheet doesn't throw and still finds the same results.
- **Read-only guarantee:** captured Prospects' and Proposals' entire cell data before and after running the report — confirmed byte-for-byte identical, proving no write of any kind occurred.

**Regression (all nine re-run unmodified against this sprint's actual files, 0 failures):**
- **Sprint 1 suite** (73 assertions) still passes.
- **Sprint 2 suite** (61 assertions) still passes.
- **Sprint 3 suite** (56 assertions) still passes.
- **Sprint 4 suite** (88 assertions) still passes.
- **Sprint 4 fix suite** (28 assertions) still passes.
- **Sprint 5 suite** (54 assertions) still passes.
- **Sprint 6 suite** (66 assertions) still passes.
- **Sprint 7 suite** (110 assertions) still passes.
- **Sprint 8 suite** (75 assertions) still passes — confirming `Code.gs`'s new top-level menu item didn't disturb Daily Command Center or anything else Sprint 8 depends on.

**Sprint 8 (75 assertions, all passing):**
- **Syntax:** all 12 `.gs` files individually passed `node --check`.
- **File-load-order safety:** all 12 files were concatenated and evaluated in both full reverse order and forward order, and both built 11 sheets with no exceptions.
- **Empty CRM:** no prospects, no meetings, no proposals — confirmed no throw, an all-zero Pipeline Health summary, an empty action list, and the exact `"No urgent actions found. Your pipeline is clear."` message.
- **Overdue follow-up detection:** a prospect with a Next Follow Up date before today is counted and appears with a `FOLLOW-UP OVERDUE` reason.
- **Follow-up due today:** a Next Follow Up of exactly today is counted and appears with `FOLLOW-UP DUE TODAY`.
- **Future follow-up exclusion:** a Next Follow Up 10 days out is counted in neither overdue nor due-today, and doesn't appear in the action list at all.
- **Hot Lead detection:** both qualifying conditions tested independently — Score Tier exactly "Hot" (even with a raw score below 80), and Lead Score ≥ 80 (even with a lagging Warm tier label) — both correctly counted as hot leads.
- **Cold/Warm exclusion:** Warm (65) and Cold (20) scored prospects are confirmed absent from the hot-lead count and the action list's HOT-tagged entries.
- **Archived exclusion:** a prospect with a would-be-Hot score (95) and an overdue follow-up, but Status "Archived," is confirmed excluded from *every* category (overdue, hot, high-priority) and from the action list entirely — not just downgraded.
- **Do Not Contact exclusion:** same result for Status "Do Not Contact."
- **High-priority uncontacted detection:** a High-priority prospect with blank Status and no Last Contact is counted; an already-contacted High-priority prospect and a Low-priority uncontacted prospect are both correctly excluded from this category.
- **Audited/uncontacted detection:** an uncontacted prospect with a real Website Audits record is counted and recommended for "Generate Outreach Brief"; an uncontacted prospect with no audit at all is excluded from this category.
- **Upcoming meeting detection:** a meeting dated tomorrow is counted; one dated 5 days ago is excluded; a blank-Business meeting row doesn't throw and is skipped.
- **Active proposal detection:** Sent and Under Review proposals are both counted (Sent includes its dollar Value in the reason text); Accepted and Draft proposals are both excluded.
- **Ranking order:** seeded one qualifying business per all 7 categories simultaneously and confirmed the returned action order matches the category priority exactly, 1 through 7.
- **Lead Score tie-breaking:** two prospects in the same category (both overdue) with different Lead Scores — confirmed the higher score ranks first.
- **Duplicate action prevention:** a single business qualifying for both overdue follow-up (category 1) and hot lead (category 3) appears exactly once in the final list, keeping the higher-priority (overdue) reason text, not the hot-lead one.
- **Blank Business handling:** blank-Business rows seeded simultaneously in Prospects, Meetings, and Proposals — confirmed no throw and none of the three are counted anywhere.
- **Missing optional columns:** ran the command center against a Prospects sheet that never had Lead Score/Score Tier/Outreach Brief provisioned — confirmed no throw, overdue follow-ups still detected correctly, and no false "hot lead" reported in their absence.
- **Malformed/blank dates:** a non-date string and a blank value in Next Follow Up, plus a non-date string in a Meeting's Date — confirmed no throw and none are miscounted as overdue/due-today/upcoming.
- **Deterministic repeated output:** calling `openDailyCommandCenter_()` twice against unchanged data produces byte-identical summary and action-list JSON both times.
- **Wrong-sheet handling:** running the command center while Clients (not Prospects) is the active sheet doesn't throw and still finds the same results — confirms the report doesn't depend on the active sheet or a selection.
- **Maximum result limit:** 15 qualifying overdue prospects seeded — confirmed the action list is capped at exactly 10, while the Pipeline Health summary still reports the true, uncapped count of 15.
- **Read-only guarantee:** captured Prospects' entire cell data and Website Audits' row count before and after running the command center — confirmed byte-for-byte identical, proving no write of any kind occurred.

**Regression (all eight re-run unmodified against this sprint's actual files, 0 failures):**
- **Sprint 1 suite** (73 assertions) still passes.
- **Sprint 2 suite** (61 assertions) still passes.
- **Sprint 3 suite** (56 assertions) still passes.
- **Sprint 4 suite** (88 assertions) still passes.
- **Sprint 4 fix suite** (28 assertions) still passes.
- **Sprint 5 suite** (54 assertions) still passes.
- **Sprint 6 suite** (66 assertions) still passes.
- **Sprint 7 suite** (110 assertions) still passes — confirming `Code.gs`'s new top-level menu item didn't disturb Lead Intelligence or anything else Sprint 7 depends on, and that `CRM_Dashboard.gs` being untouched this sprint kept the Hot Leads KPI intact.

**Sprint 7 (110 assertions, all passing):**
- **Syntax:** all 11 `.gs` files individually passed `node --check`.
- **File-load-order safety:** all 11 files were concatenated and evaluated in both full reverse order and forward order, and both built 11 sheets with no exceptions.
- **`scoreTier_` boundaries:** 59 → Cold, 60 → Warm, 79 → Warm, 80 → Hot, plus 0 → Cold and 100 → Hot — the exact boundary values named in the sprint spec.
- **`computeLeadScore_` — fully maxed prospect:** every factor present (100/100 audit, High priority, phone + email, website, Outreach Brief, an overdue follow-up, Call Booked status) scores exactly 100, tier Hot, and the reasons text names every individual contribution — confirms the 0-100 cap holds without overshoot on a legitimately maximal input.
- **`computeLeadScore_` — fully blank prospect:** every factor missing scores exactly 0, tier Cold, and each of the 7 reason lines explicitly states "0 pts" for its own missing factor — confirms missing data always reads as 0, never an invented value.
- **Unrecognized Priority value** (e.g. "Urgent") is treated identically to a missing one (0 pts, "Priority not set") rather than guessed.
- **Partial contact info:** phone-only and email-only each score exactly +5 (not the full +10), with reasons naming which one was found.
- **Follow-up timing:** an overdue date and a date of exactly today both score +10; a future date scores 0 with "not yet due"; no date at all scores 0 with "no follow-up scheduled" — the two 0-point cases are distinguished in the reasons text.
- **Website Audit integration:** seeded two Website Audits records for the same business at different dates and confirmed the score uses the **latest** one (by date) via the existing `findLatestAuditForBusiness_` — and confirmed a business with no audit record at all scores 0 for that factor specifically.
- **Deterministic repeated scoring:** calling `computeLeadScore_` twice with identical inputs produces an identical score, tier, and byte-identical reasons text both times.
- **Archived / Do Not Contact handling:** a prospect whose raw point total would reach Hot (≥80) but whose Status is "Archived" has its tier capped at Warm, with the reasons text explicitly stating the cap; same result for "Do Not Contact." A non-blank Archived Date alone (with an unrelated Status) also triggers exclusion; an ordinary prospect with neither is confirmed *not* excluded.
- **Additive column provisioning:** confirmed Prospects starts at 14 columns, gains Lead Score/Score Tier/Score Reasons at columns 15/16/17 after first use, that column 9 (Status) is untouched, and that calling the provisioning function again doesn't add duplicates. A second scenario provisions scoring columns onto a sheet that already has Sprint 5's Outreach Brief column at column 15, and confirms Outreach Brief is preserved in place while the three scoring columns append after it (16/17/18) — proving the two independently-provisioned column sets compose correctly.
- **Score Selected Prospect(s):** confirmation shown before any write; correct Lead Score/Score Tier/Score Reasons written; every unrelated field (Business, Website, Priority, the pre-existing "Website Score" column, Notes, Status) confirmed untouched afterward.
- **Confirmation cancellation:** declining the Yes/No leaves the sheet at its original 14 columns — scoring columns aren't even provisioned if the user declines.
- **Blank Business handling:** a selected row with no Business name is not scored and is counted in a "Skipped" line rather than throwing or guessing.
- **Multi-row selection:** a 2-row selection scores both rows independently, with the High-priority row correctly scoring higher than the Low-priority row.
- **Wrong-sheet handling:** running Score Selected Prospect(s) while a non-Prospects sheet is active does not throw and shows a clear redirect message.
- **Score All Prospects:** scores every row with a Business name, skips a blank-Business row, reports accurate Scored/Skipped counts, and leaves an unrelated row's Notes untouched. Re-running it after changing the underlying audit data updates the score **in place** — confirmed no new rows or columns were added and the new reasons text reflects the updated audit score.
- **Show Top Leads:** seeded 12 ordinary prospects plus one high-scoring Archived prospect; confirmed the Archived one never appears in the list (regardless of its raw score), the required `Business | Score | Tier | Reasons | Next Follow Up | Status` header is present, the list is sorted by score descending, is capped at exactly 10 rows, an exclusion count note is shown, and the "does not predict probability of closing" disclaimer is present in the message. A separate case confirms Show Top Leads before any scoring has run shows a clear "run scoring first" message rather than an empty or broken list.
- **Dashboard "Hot Leads":** confirmed the label and the exact `IFERROR(COUNTIF(INDEX(...),"Hot"),0)` formula are present as the 5th card in the Conversion & Client Metrics row, that the existing Client Count (3rd) and Audits Completed (4th) cards are untouched, and that the 8-card Key Metrics row is completely unaffected by this sprint.
- **Formatting preserved:** Prospects' filter/banding/validation all confirmed present after every scoring action ran.

**Regression (all seven re-run unmodified against this sprint's actual files, 0 failures):**
- **Sprint 1 suite** (73 assertions) still passes.
- **Sprint 2 suite** (61 assertions) still passes.
- **Sprint 3 suite** (56 assertions) still passes.
- **Sprint 4 suite** (88 assertions) still passes.
- **Sprint 4 fix suite** (28 assertions, from the Website Audit save-confirmation fix) still passes.
- **Sprint 5 suite** (54 assertions) still passes.
- **Sprint 6 suite** (66 assertions) still passes — confirming `Code.gs`'s new Lead Intelligence submenu and `CRM_Dashboard.gs`'s widened metrics row didn't disturb anything Sprint 6 depends on.

**Sprint 6 (66 assertions, all passing):**
- **Syntax:** all 10 `.gs` files individually passed `node --check`.
- **File-load-order safety:** all 10 files were concatenated and evaluated in both full reverse order and forward order, and both built 11 sheets with no exceptions.
- **`isValidDateString_`** (pure function): a valid `yyyy-mm-dd` string is accepted; malformed text, wrong separators (slashes), and an impossible calendar date (`2026-02-30`) are all rejected; an empty string is rejected.
- **`parseBriefTopIssues_`** (pure function): correctly extracts the real issue list from a stored Outreach Brief's `TOP ISSUES` section; correctly treats "No significant issues found in the audit." as zero issues rather than as an issue itself; returns `[]` for blank brief text.
- **Mark as Contacted — correct update + data preservation:** confirmation shown before any write; `Status` set to `Contacted`; `Last Contact` set to a real `Date` object; Notes, Website, and Priority on the same row all confirmed untouched.
- **Mark as Contacted — idempotency:** running it a second time on an already-Contacted row doesn't throw, leaves `Status` at `Contacted`, and doesn't create a duplicate row.
- **Mark as Contacted — blank Business:** a selected row with no Business name doesn't throw, produces a clear alert, and its `Status` is confirmed untouched (still `New`).
- **Mark as Contacted — confirmation cancellation:** declining the Yes/No prompt leaves both `Status` and `Last Contact` exactly as they were.
- **Mark as Contacted — multi-row:** a 2-row selection updates both rows' `Status` and `Last Contact` correctly.
- **Schedule Follow-Up — creation:** `Next Follow Up` is written as a real `Date` object matching the entered date; no overwrite-confirmation is asked when there was no existing date.
- **Schedule Follow-Up — existing date requires confirmation:** confirmed the overwrite question is asked when a date already exists, and confirming it updates the date.
- **Schedule Follow-Up — declining overwrite:** declining the overwrite question leaves the original date in place, byte-for-byte.
- **Schedule Follow-Up — invalid date input:** an invalid date string produces a clear error with no crash and writes nothing.
- **Schedule Follow-Up — cancel the prompt entirely:** cancelling the `ui.prompt` dialog itself writes nothing and shows no further alert.
- **Schedule Follow-Up — data preservation + multi-row:** a 2-row selection both get `Next Follow Up` set correctly, and an unrelated row's Notes are confirmed untouched throughout.
- **Generate Follow-Up Message — missing Outreach Brief:** a selected prospect with no stored brief produces a clear message pointing to Generate Outreach Brief, with no crash.
- **Generate Follow-Up Message — status-specific templates:** all 5 named statuses (`Contacted`, `Follow-up 1 Sent`, `Follow-up 2 Sent`, `No Response`, `Nurture`) produce genuinely different, correctly-worded messages; an unrecognized status (`Won`) falls back to the default template without throwing; the message correctly references the real top issue pulled from the stored brief, not a placeholder.
- **Generate Follow-Up Message — display + save-to-Notes confirmation:** the message is always displayed first; the save confirmation is asked afterward; accepting it appends to (rather than overwrites) existing Notes content.
- **Generate Follow-Up Message — declining save:** declining leaves Notes exactly as it was before.
- **Generate Follow-Up Message — deterministic repetition:** generating twice in a row from the same Business/Status/brief produces identical message text both times.
- **Generate Follow-Up Message — multi-row rejection:** a multi-row selection doesn't throw and shows a clear "select a single prospect" message instead of guessing.
- **Generate Follow-Up Message — missing Business:** a selected row with no Business name doesn't throw and produces a clear message.
- **Wrong sheet (all three actions):** `menuMarkAsContacted_`, `menuScheduleFollowUp_`, and `menuGenerateFollowUpMessage_` were each called with a non-Prospects sheet active and none threw.
- **Data preservation + formatting:** an unrelated row's Website/Industry confirmed untouched; Prospects' filter/banding/validation all confirmed present after every action ran; sheet count still exactly 11 (no new sheet was created).

**Regression (all five re-run unmodified against this sprint's actual files, 0 failures):**
- **Sprint 1 suite** (73 assertions) still passes.
- **Sprint 2 suite** (61 assertions) still passes.
- **Sprint 3 suite** (56 assertions) still passes.
- **Sprint 4 suite** (88 assertions) still passes.
- **Sprint 5 suite** (54 assertions) still passes — confirming `Code.gs`'s three new Outreach Tools menu items didn't disturb Generate Outreach Brief / Generate Brief for Selected Prospect or anything else Sprint 5 depends on.

**Sprint 5 (54 assertions, all passing):**
- **Syntax:** all 9 `.gs` files individually passed `node --check`.
- **File-load-order safety:** all 9 files were concatenated and evaluated in both full reverse order and forward order, and both built 11 sheets with no exceptions.
- **Parsing helpers** (pure functions): `parseCategoryLabel_` correctly splits `"78/100 — title/meta/H1/canonical checks"` into score + description; `parseMobileLabel_` correctly reads PASS and FAIL; `parseOpportunities_` correctly splits `"Opportunities: a; b; c."` into `['a','b','c']` and returns `[]` for both the "No issues found" message and blank Notes.
- **Outreach Brief column provisioning:** confirmed Prospects starts at its normal 14 columns, gained `Outreach Brief` at column 15 after the first brief generation, that column 9 (`Status`) was untouched by the append, and that calling the provisioning function again does not add a second copy of the column.
- **Selected Prospect with a matching audit:** ran a full brief generation against a realistic audit record and checked the actual saved cell text field-by-field — correct Business/Website/Audit Date, Overall Score matching the stored Score exactly, Top Issues matching the parsed Opportunities list, Positive Findings correctly including categories ≥ 70 and correctly excluding the one category (SEO, scored 55) below the threshold, an Opening sentence that names the real top issues (not a placeholder), a Value line naming the real weak category, and the CTA matching the spec text exactly. Also confirmed the Prospects row's other fields (Status) were untouched.
- **Missing audit:** a selected prospect with no Website Audits record produced a clear message and left the Outreach Brief cell blank.
- **Missing Business:** a selected row with no Business name did not throw and produced a clear "nothing to generate" message.
- **Incomplete audit data:** a Website Audits record with blank Mobile/SEO/Performance/Accessibility fields (Score present) was correctly rejected as incomplete, with a clear message and nothing written.
- **Existing brief — decline:** re-running against a prospect that already had a brief triggered the replace-confirmation question, and declining it left the existing brief text byte-for-byte unchanged.
- **Existing brief — accept:** accepting the replacement against a newer audit record (different date, score, and issues) produced a brief that was verifiably different from the original and correctly reflected every new value.
- **Repeated generation is deterministic:** regenerating twice in a row from the same underlying audit data produced byte-identical brief text both times.
- **Multiple prospects in one selection:** a 4-row selection mixing a missing-audit case, a missing-Business case, an incomplete-audit case, and a genuinely valid case produced the correct aggregate counts (`Generated: 1`, `No audit found: 1`, `Incomplete audit data: 1`, plus the missing-Business skip note) and the one valid business's brief was actually written.
- **Wrong sheet:** running the action while a non-Prospects sheet is active does not throw.
- **Data preservation:** confirmed an unrelated Prospects row's Business/Website were untouched, that Website Audits' row count was unchanged (brief generation never writes to it), and that Prospects' filter/banding/validation all survived the new column being added.
- One real test-script bug (not a source bug) was caught and fixed during this sprint: an early assertion checked `alerts[0]` without first clearing the mock's alert log after the setup `buildRCSCRM()` calls, so it was reading a leftover "CRM is up to date" message instead of the actual result alert — fixed by clearing the mock's state before the functional tests begin and asserting against the correct alert.

**Regression (all four re-run unmodified against this sprint's actual files, 0 failures):**
- **Sprint 1 suite** (60 assertions, 4 files) still passes.
- **Sprint 2 suite** (62 assertions, 6 files) still passes.
- **Sprint 3 suite** (57 assertions, 7 files) still passes.
- **Sprint 4 suite** (91 assertions, 8 files) still passes — confirming `Code.gs`'s new Outreach Tools submenu didn't disturb anything Sprint 4 depends on (Website Audit's own menu items, the Dashboard "Audits Completed" card, etc.).

**Sprint 4 (91 assertions, all passing):**
- **Syntax:** all 8 `.gs` files individually passed `node --check`.
- **File-load-order safety:** all 8 files were concatenated and evaluated in both full reverse order and forward order, and both built 11 sheets with no exceptions.
- **`normalizeUrl_`:** a bare domain gets `https://` prepended; explicit `http://`/`https://` pass through unchanged; garbage text and an empty string are rejected; `ftp://` and `mailto:` are rejected outright rather than getting mangled into a bogus-but-technically-URL-shaped string (this caught a real bug during testing — `mailto:` doesn't use `//` the way `http://` does, so the first version of the scheme check missed it; fixed and re-verified before anything was committed).
- **Scoring unit tests** (pure functions, controlled inputs, no network involved): `scoreSeo_` at 100 (everything ideal), 0 (nothing present), and 15 (multiple-H1 partial credit); `scorePerformance_` at 100 (fast + small) and 10 (slow + huge); `scoreAccessibility_` at 100 (no images to flag) and 50 (half missing alt text); `computeOverallScore_` at 100, 0, and 75 (mobile-only failure, verifying the 25% mobile weight lands exactly).
- **Valid, well-built site:** a realistic good-practice HTML fixture (title, meta description, viewport, single H1, canonical, OG tags, both images with real alt text) scored ≥ 80 overall, with every individual "missing X" issue correctly absent and all four category labels matching the exact spec'd format.
- **Poorly-built site:** a bare-minimum HTML fixture (no head metadata, 2 of 3 images missing alt text) scored < 40 overall, with every expected issue present — missing title, missing meta description, no H1, no canonical, "2 images missing alt text" (the exact count, not just "some"), missing Open Graph tags.
- **HTTPS detection:** an `http://` (not `https://`) URL correctly flagged "not using HTTPS"; an `https://` URL did not.
- **Multiple H1s:** a 2-H1 fixture produced "multiple H1 headings found (2)" with the exact count.
- **robots.txt / sitemap.xml:** both unreachable (404/500) → both flagged; both reachable (200) → neither flagged.
- **HTTP error responses:** a 404 and a 500 on the main page each returned `ok: false` with the status code in the message, no exception, no partial/garbage audit result.
- **Network exception:** a thrown fetch error (simulating DNS failure) was caught and returned as a readable `ok: false` result rather than propagating out of `auditUrl_`.
- **Empty response body:** a whitespace-only page body was caught as a distinct failure case ("empty response — nothing to analyze") rather than silently scoring a blank page.
- **Invalid URL never reaches the network layer:** confirmed `normalizeUrl_` rejects bad input before any fetch would be attempted.
- **Audit row creation:** ran a real audit and read back the actual appended Website Audits row cell-by-cell, confirming Business/Date(`yyyy-mm-dd`)/Mobile/SEO/Performance/Accessibility/Score/Notes all match the returned audit result exactly — not just that "a row exists."
- **A failed audit writes nothing:** confirmed the Website Audits row count is unchanged after an audit that failed (404).
- **Repeated audits create separate rows:** the same business was audited 3 times total; confirmed the sheet grew by 3 separate rows (not 1 overwritten row), and all 3 are independently present.
- **Selected Prospect mapping:** selected a real Prospects row, ran the audit, and confirmed the saved audit row's Business came from the Prospects record (not the URL/domain) — and that the Prospects row itself (its Status) was untouched by the audit.
- **Missing-website prospect handling:** a selected row with no Website produced a clear "nothing to audit" alert and wrote no audit row, rather than crashing or silently guessing a URL.
- **Wrong-sheet guard:** running the audit action while a non-Prospects sheet is active does not throw.
- **Audit Website URL dialog path** (`runUrlAudit_`): a bare domain was normalized correctly, a business name was derived from the domain, the audit succeeded and saved a row, and a blank/invalid input was rejected cleanly.
- **Dashboard "Audits Completed":** confirmed the label and the exact `COUNTA('Website Audits'!A2:A)` formula are present as the 4th card in the Conversion & Client Metrics row, that the existing Client Count card (3rd) is untouched, and that the 8-card Key Metrics row is completely unaffected by this sprint.
- **Formatting preserved:** Website Audits' filter, and Prospects' filter/banding/validation, all confirmed present after every audit ran.

**Regression (all three re-run unmodified against this sprint's actual files, 0 failures):**
- **Sprint 1 suite** (60 assertions, 4 files) still passes.
- **Sprint 2 suite** (62 assertions, 6 files) still passes.
- **Sprint 3 suite** (57 assertions, 7 files) still passes — confirming `CRM_Dashboard.gs`'s widened metrics row and `Code.gs`'s new submenu didn't disturb anything Sprint 3 depends on.

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

## Remaining limitations

These are inherent to what's achievable inside Apps Script without a real browser, not bugs to fix later — see "What is NOT measured" above for the full list. Worth calling out specifically:
- HTML is checked with regex/string matching, not a real DOM parser (none is available in Apps Script) — this is reliable for presence/absence/count checks (title, meta tags, H1 count, image alt attributes) but could misread unusual or deliberately obfuscated markup.
- The HTTPS check reads the requested URL's own scheme; it does not follow and inspect a possible `http://` → `https://` redirect chain, since `UrlFetchApp`'s response object doesn't expose the final post-redirect URL.
- Broken-link checking is intentionally shallow (up to 5 same-origin links from the one fetched page) — by design, not an oversight, per the "no large numbers of requests" requirement.
- Fetch-duration timing measures this script's own request from Google's servers to the target site, not a real user's network conditions — labeled as a heuristic for exactly that reason.

**Sprint 5 additions:**
- **Outreach Brief quality is bounded by what Website Audit stored.** The brief only ever restates/reorganizes data already on the matched Website Audits row — it can't surface anything the audit didn't check (see Website Audit's own "what is NOT measured" list above), and a thin or generic-sounding brief on a site with few detected issues is an honest reflection of a limited automated audit, not a sign the brief generator is broken.
- **Business-name matching is exact-text (trimmed, case-insensitive).** If a Prospects row's Business name doesn't match the Website Audits Business name exactly (e.g. "Acme Roofing" vs. "Acme Roofing LLC"), the brief generator reports "no audit found" even though a relevant audit exists under a slightly different name — there's no fuzzy matching. Re-running Website Audit from the Prospects row itself (rather than typing the business name differently in two places) avoids this.
- **"Outreach Brief" doesn't appear on a fresh Build/Update CRM run** — it's provisioned the first time a brief is actually generated, not by `buildRCSCRM()`, per the constraint on not modifying `CRM_Builder.gs` this sprint (documented in the Outreach Brief section above).

**Sprint 6 additions:**
- **Generate Follow-Up Message's quality is bounded by the stored Outreach Brief.** It restates the brief's own top issue rather than re-deriving anything from Website Audits — if the brief was thin (few detected issues), the follow-up message will be too, which is an honest reflection of the underlying audit rather than a sign this feature is broken.
- **Status-specific templates cover exactly the 5 Lead Status values named in this sprint's spec** (`Contacted`, `Follow-up 1 Sent`, `Follow-up 2 Sent`, `No Response`, `Nurture`). Any other status (`New`, `Call Booked`, `Proposal Sent`, `Won`, etc.) gets one neutral default template rather than a tailored one — by design, since the sprint only specified those 5.
- **Schedule Follow-Up's date entry is a plain `yyyy-mm-dd` text prompt**, not a calendar picker widget — Apps Script's built-in `ui.prompt` has no native date picker, and adding an HtmlService dialog for a single value would have been more than this sprint's "keep it minimal" instruction called for.

**Sprint 7 additions:**
- **The RCS Lead Priority Score is not a sales forecast.** It's a weighted count of existing CRM signals (audit quality, declared Priority, reachability, outreach progress, follow-up timing, funnel status) — it does not model, and was never intended to model, an actual probability of a deal closing. This is stated directly in every result dialog and in Show Top Leads, not just here.
- **A thin score reflects thin CRM data, not a broken scorer.** A prospect with no audit, no brief, and no contact info on file will score low even if it's genuinely a great lead — the score can only ever reflect what's actually recorded in Prospects/Website Audits, same limitation as Outreach Brief above.
- **The Status → engagement-points mapping only credits the specific Lead Status values listed in this sprint's spec** (Call Booked/Proposal Sent/Won = 15, Proposal Pending = 12, Follow-up 2 Sent = 10, Follow-up 1 Sent = 8, Contacted = 6, Nurture = 4). Any other status, including legitimate ones like "New," scores 0 for that factor — by design, since a lead that hasn't been engaged yet has no engagement signal to credit.
- **"Lead Score" / "Score Tier" / "Score Reasons" don't appear on a fresh Build/Update CRM run** — like Outreach Brief, they're provisioned the first time a scoring action is actually run, not by `buildRCSCRM()`, per the constraint on not modifying `CRM_Builder.gs` this sprint.
- **Business-name matching for the Website Audit factor is exact-text**, same limitation and same fix (re-run Website Audit from the Prospects row) as Outreach Brief's audit lookup, since both reuse `findLatestAuditForBusiness_`.

**Sprint 8 additions:**
- **The Command Center's recommendations are exactly as good as the underlying CRM data.** It surfaces existing signals (follow-up dates, Lead Score, Priority, contact history, audit/brief presence, meeting dates, proposal status) — it never infers, predicts, or invents anything not already on a sheet, same discipline as every prior sprint's data-facing feature.
- **"Uncontacted" is inferred from Status (blank/"New") + a blank Last Contact**, not a separate stored field — a prospect manually marked "Contacted" with an empty Last Contact, or vice versa, could read as contacted/uncontacted in a way that doesn't match reality. Keeping Status and Last Contact in sync (which Mark as Contacted, Sprint 6, already does) avoids this.
- **"Hot lead needing action" excludes Won/Closed-Lost/Closed-Not-Interested statuses** so an already-resolved deal doesn't clutter a daily action list — any other status, including ones outside this sprint's spec, is still treated as needing action if the score/tier qualifies.
- **The 10-item cap is on the ranked action list only** — the Pipeline Health counts at the top of the report always reflect true, uncapped totals, so a busy day's real scope is never hidden by the cap.
- **No new Dashboard KPI this sprint** — Pipeline Health lives inside the Command Center's own report; `CRM_Dashboard.gs` was intentionally left untouched.

**Sprint 9 additions:**
- **This CRM has no historical stage-transition log.** The Conversion Funnel is explicitly labeled `CURRENT-STATE FUNNEL` and the report states directly that it's a snapshot, not a cohort conversion rate — a prospect that bounced between statuses over months and a prospect that moved straight through look identical in this data, and the report doesn't pretend otherwise.
- **Prospects has no stored creation/added date**, so "Oldest Active Prospects," "average age of active prospects," and "average days from prospect creation to client" are *always* reported unavailable — there is no seeded scenario that would ever change this, since the field simply doesn't exist in the schema. Pipeline Aging substitutes the closest honest proxy (days since Last Contact) under its own clearly distinct label, never presented as "prospect age."
- **Proposal→Client velocity and industry revenue attribution both rely on Business-name matching** between sheets (Proposals/Clients by Business, Revenue by Client name against Prospects Business) — same exact-text, case-insensitive convention used everywhere else in this CRM (`findLatestAuditForBusiness_`, dedupe keys, etc.). A name typed differently in two places won't be linked; this is a known, documented tradeoff, not a bug.
- **Lead-source analytics are permanently unavailable** — Prospects has no source/referral field, and Referral Network tracks referral partners, not which prospects came from which partner. No field was added just to power this section, per the sprint's explicit instruction.
- **Industry conversion percentages are suppressed below a 3-prospect sample** (`ANALYTICS_MIN_SAMPLE`) rather than shown as a real-looking number computed from too little data — a industry with 1 prospect and 1 client would otherwise misleadingly read "100%."
- **No new Dashboard KPI this sprint** — like Sprint 8, `CRM_Dashboard.gs` was intentionally left untouched; all Sprint 9 output lives inside the Pipeline Intelligence report itself.

**Sprint 10 additions:**
- **Duplicate detection is exact-match only, on normalized identifiers — never fuzzy.** "Acme Roofing Inc" and "Acme Roofing LLC" will not be linked; only differences in case, whitespace, protocol/`www.`/trailing-slash (for websites), and punctuation (for phone numbers) are normalized away. This is a deliberate scope boundary, not an oversight — the sprint explicitly required not claiming fuzzy matching unless actually implemented.
- **"Affected businesses" in the Duplicates section is counted by normalized Business identity, not by raw row count.** Two rows that are themselves a business-name-duplicate pair (e.g. "Acme Roofing" / "ACME  Roofing") count as one affected identity spanning two rows — consistent with how the business-name match itself is normalized, and documented plainly in the report's own wording ("business(es) affected").
- **The CRM Health Score is a data-quality score, not a business-performance score.** A CRM full of low-value but perfectly complete, consistent, duplicate-free, and fresh prospects would score 100; that says nothing about whether those prospects are good leads — for that, see the Sprint 7 Lead Score and Sprint 9 Pipeline Intelligence, which this file never touches or recomputes.
- **The two cross-sheet integrity checks rely on exact Business-name matching**, the same convention as everywhere else in this CRM — a name typed differently between Prospects and Clients won't be linked by these checks.
- **No new Dashboard KPI this sprint** — like Sprints 8 and 9, `CRM_Dashboard.gs` was intentionally left untouched; all Sprint 10 output lives inside the CRM Health report itself.

**Sprint 11 additions:**
- **Automation is a reporting/maintenance pass, not an auto-fix tool.** Every condition it surfaces (overdue follow-ups, missing fields, stale records, duplicates, invalid statuses, incomplete clients) is something a person still has to act on manually — the same conditions CRM Health already reports, summarized here for a fast daily glance and, optionally, an unattended daily run. Nothing is ever archived, merged, reassigned, or deleted automatically, by design.
- **The Daily Maintenance trigger fires once a day, not continuously.** Between runs, the "Last Maintenance Run"/"Last Maintenance Result" shown in Automation Status reflect the most recent run, not live real-time state — for up-to-the-second detail, run CRM Health or Run CRM Maintenance manually.
- **The installable trigger runs at a fixed approximate time (~6am, script time zone)** — there's no UI for choosing a different hour this sprint, matching Auto Sync's own fixed hourly cadence rather than adding new configuration surface for a single time value.
- **No new Dashboard KPI this sprint** — like Sprints 8-10, `CRM_Dashboard.gs` was intentionally left untouched; all Sprint 11 output lives inside the Automation report and status view themselves.

**Sprint 12 additions:**
- **The Next-Action Engine surfaces conditions; it never resolves them.** Every entry is something a person still acts on — the report never edits Status, Lead Score, a date, an Outcome, or any other field on anyone's behalf.
- **Meeting/Proposal "tracked elsewhere" exclusion is presence-only, not recency-aware.** Tier 4 excludes any business with *any* Meetings or Proposals row, even a very old, long-resolved one — it doesn't check whether that meeting/proposal is itself still relevant. In practice this is rarely visible: a business with only a stale, irrelevant meeting/proposal and no Next Follow Up would previously have shown a generic tier-4 entry anyway.
- **"Other active opportunities" (tier 7) covers exactly two schema-grounded signals** — a Paused Client and a prospect with no Phone/Email at all — not a general catch-all. Clients has no next-action field of its own to check beyond Status, and Prospects' contact-info completeness is the one remaining "can't even be reached" gap this schema can express honestly.
- **Follow Ups sheet is not a live data source** — see the Next-Action Engine section above for the reasoning (nothing else in this CRM ever writes to it).
- **No new Dashboard KPI this sprint** — like Sprints 8-11, `CRM_Dashboard.gs` was intentionally left untouched; all Sprint 12 output lives inside the Next Actions report itself.

No functional gaps identified against any sprint's scope. `CRM_Builder.gs`, `CRM_Settings.gs`, `CRM_Import.gs`, `CRM_Actions.gs`, `CRM_Sync.gs`, `CRM_Audits.gs`, `CRM_Outreach.gs`, `CRM_OutreachWorkflow.gs`, `CRM_Scoring.gs`, `CRM_CommandCenter.gs`, and `CRM_Dashboard.gs` are byte-for-byte unchanged from before Sprint 10, confirmed by the standalone Sprint 1-9 regression suites all passing unmodified (`CRM_Analytics.gs` is the sole exception, carrying one targeted bug fix — see the Sprint 10 scope section above). No fabricated Lighthouse, PageSpeed, Core Web Vitals, real mobile-rendering, accessibility-compliance, SEO-ranking, historical-conversion, stage-duration, revenue, probability, or forecast claims appear anywhere in the code, labels, or stored results — every category label states plainly what was actually checked, every line of a generated Outreach Brief or follow-up message traces back to specific stored data, the RCS Lead Priority Score never claims to predict probability of closing, the Daily Command Center never claims a fact it can't trace to an actual cell, Pipeline Intelligence explicitly labels every metric this schema genuinely can't support rather than estimating one, and CRM Health never fixes, merges, or deletes anything it finds — every finding is a report for a human to act on.
