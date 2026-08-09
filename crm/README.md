# RCS CRM — Sprint 1 Core + Sprint 2 Prospect Workflow + Sprint 3 GitHub Sync + Sprint 4 Website Audit + Sprint 5 Outreach Intelligence + Sprint 6 Outreach Execution + Follow-Up

A Google Apps Script, split across ten files, that builds/updates the Roman Creative Studio outreach/sales CRM inside a Google Sheet: 11 sheets, exact headers, Settings-backed dropdown validation, consistent formatting, a live formula-driven Dashboard, one-click CSV import, menu-driven prospect actions (Move to Outreach / Convert to Client / Archive Lead), a GitHub sync (manual + hourly auto-sync) that pulls `outreach/prospects.csv` straight from this repo, a Website Audit tool that fetches and scores a prospect's site, an Outreach Brief generator that turns a saved audit into a ready-to-send sales brief, and an Outreach Execution workflow (Mark as Contacted / Schedule Follow-Up / Generate Follow-Up Message) that carries a prospect forward after that brief has been sent.

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

Apps Script shares one global scope across every `.gs` file in a project (no imports/exports needed — a function or `const` defined in one file is callable/readable from any other), so this split is purely for readability; functionally it behaves as one script.

## What it builds

Running `buildRCSCRM()` creates or updates exactly these 11 sheets:

Dashboard, Prospects, Outreach Pipeline, Follow Ups, Meetings, Proposals, Clients, Revenue, Website Audits, Referral Network, Settings

| Sheet | Columns |
|---|---|
| Dashboard | — (formula-driven, no headers — see below) |
| Prospects | Business, Industry, City, Website, Phone, Email, Contact, Priority, Status, Website Score, Last Contact, Next Follow Up, Notes, Archived Date — plus **Outreach Brief**, added the first time a brief is generated (see Outreach Brief below; this one column isn't provisioned by `buildRCSCRM()`) |
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
- **Audits Completed** *(Sprint 4)* — count of all rows in Website Audits (`COUNTA('Website Audits'!A2:A)`). Added as a 4th card in this same row rather than redesigning the Dashboard — the row widened from 3 cards (columns A:F) to 4 (A:H).

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

### Results

After a single audit, the dialog/alert shows: Business, URL, Overall Score, Mobile, SEO, Performance, Accessibility, Top issues (up to 3), and an "Audit saved to Website Audits" confirmation. Auditing multiple selected Prospects at once shows a compact per-business score list plus Audited/Failed/Skipped counts instead of stacking multiple detailed blocks.

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

## Safety / idempotency

- `buildRCSCRM()` is safe to run any number of times.
- **Sheets:** created only if missing (looked up by name) — never duplicated.
- **Headers:** written in full only on a truly blank sheet. On a sheet that already has headers, only whichever target headers are missing get appended *after* the existing ones — never inserted in the middle, never duplicated, never reordered. This is what let Sprint 2 rely on `Archived Date` reaching a Prospects sheet built with a version of this script that predates it, with no manual migration step.
- **Settings lists:** seeded in full the first time; on later runs, only canonical values not already present in that column get appended after what's there — a team's own additions to a list are never touched.
- **Data rows:** never read, moved, or deleted by `Code.gs`, `CRM_Builder.gs`, or `CRM_Settings.gs`. Import, GitHub Sync, Website Audit, Outreach Brief, Outreach Execution (Mark as Contacted / Schedule Follow-Up / Generate Follow-Up Message), and the three Prospect Actions only ever *append* new rows elsewhere or edit specific cells on an explicitly selected/matched Prospects row — see the sections above for exactly what each one touches. A failed audit writes nothing at all; a brief that can't be generated (no audit / incomplete audit) writes nothing at all; Mark as Contacted and Schedule Follow-Up write nothing if declined at their confirmation step; Generate Follow-Up Message never writes to Notes unless the save is explicitly confirmed. Formatting operations (banding, filters, validation, column width) only touch formatting/structure, never cell values.
- **Mark as Contacted never touches Next Follow Up, and Schedule Follow-Up never touches Status/Last Contact** — the two actions are deliberately independent, matching the sprint's explicit "do not automatically change Next Follow Up" constraint.
- **Outreach Brief's own column** is provisioned additively by `CRM_Outreach.gs` itself (not through `CRM_Builder.gs`/`ensureHeaders_`, since that file wasn't touched this sprint) — same append-only, never-reorder rule, just a self-contained implementation of it.
- **Triggers:** `enableAutoSync_` always removes every existing sync trigger before creating a new one, so repeated clicks never produce more than one. `disableAutoSync_` removes it and is a harmless no-op if none exists.
- **`Code.gs` doesn't hard-depend on `CRM_Sync.gs`:** the one line `buildRCSCRM()` added for the Sync panel is guarded (`if (typeof ensureSyncStatusBlock_ === 'function')`), so the CRM still builds correctly even if `CRM_Sync.gs` hasn't been added to the project yet — useful mid-setup, and also what let Sprint 1's and Sprint 2's original standalone test suites keep passing unmodified against this sprint's `Code.gs`.
- **Dashboard is the one deliberate exception:** every cell on it is computed from the other sheets, so `buildDashboard_()` clears and redraws that one sheet on every run — there's nothing to lose, since it holds no manually-entered records, and this is what guarantees no duplicate Dashboard sections rather than trying to diff and patch a formula layout in place.

## Install steps

1. Open the target Google Sheet (a blank sheet is fine — the script also works on a sheet that already has data, including one already using an earlier version of this CRM).
2. **Extensions > Apps Script.**
3. In the Apps Script editor, delete the default `Code.gs` placeholder content, then create ten script files matching the names in this folder — **Code**, **CRM_Builder**, **CRM_Settings**, **CRM_Dashboard**, **CRM_Import**, **CRM_Actions**, **CRM_Sync**, **CRM_Audits**, **CRM_Outreach**, **CRM_OutreachWorkflow** — and paste the matching file's contents into each (use the **+** next to "Files" in the left sidebar to add each one; Apps Script appends `.gs` automatically).
4. **Save** the project (e.g. name it "RCS CRM").
5. In the function dropdown at the top of the editor, select **`buildRCSCRM`** and click **Run**.
6. The first run prompts for authorization — Google's standard OAuth consent for a script to edit its own spreadsheet (Apps Script will list "See, edit, create, and delete your spreadsheets"). Review and click **Allow**. The first time **Sync Prospects**, **Auto Sync**, or **Website Audit** is used, a second authorization prompt appears for "Connect to an external service" (`UrlFetchApp`) and, for Auto Sync specifically, permission to manage triggers — both standard Apps Script consent prompts, not anything specific to this script. Outreach Brief and Outreach Execution (Mark as Contacted / Schedule Follow-Up / Generate Follow-Up Message) need no extra authorization beyond the base spreadsheet scope, since neither makes any network calls.
7. Switch back to the spreadsheet tab and refresh the page (or close/reopen the sheet). An **RCS CRM** menu appears in the menu bar: **Build / Update CRM**, **Import Prospects...**, **Sync Prospects**, an **Auto Sync** submenu (Enable/Disable), a **Website Audit** submenu (Audit Selected Prospect / Audit Website URL), an **Outreach Tools** submenu (Generate Outreach Brief / Generate Brief for Selected Prospect — both do the same thing — plus Mark as Contacted / Schedule Follow-Up / Generate Follow-Up Message), and — below a separator — **Move to Outreach**, **Convert to Client**, and **Archive Lead**, which act on whichever Prospects row(s) are selected.

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

## Testing performed before delivery

All of the following ran against a mocked Apps Script `SpreadsheetApp`/`Ui`/`UrlFetchApp`/`ScriptApp` API in Node (`node --check` for syntax, then a full functional dry run — the closest verification possible outside Google's actual runtime, since these services and the Sheets formula engine only exist there). Nothing was committed until every check below passed.

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

No functional gaps identified against any sprint's scope. `CRM_Builder.gs`, `CRM_Settings.gs`, `CRM_Dashboard.gs`, `CRM_Import.gs`, `CRM_Actions.gs`, `CRM_Sync.gs`, and `CRM_Audits.gs` are byte-for-byte unchanged from before Sprint 6, confirmed by the standalone Sprint 1/2/3/4/5 regression suites all passing unmodified. No fabricated Lighthouse, PageSpeed, Core Web Vitals, real mobile-rendering, accessibility-compliance, or SEO-ranking claims appear anywhere in the code, labels, or stored results — every category label states plainly what was actually checked, every line of a generated Outreach Brief traces back to a specific stored audit field, and every follow-up message traces back to that same brief plus the prospect's own Status — nothing invented.
