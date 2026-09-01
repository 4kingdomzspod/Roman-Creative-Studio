/**
 * CRM_Audits.gs
 * ---------------------------------------------------------------------------
 * Website Audit: fetches one page (plus robots.txt/sitemap.xml and up to a
 * handful of internal links), runs a set of checks that can genuinely be
 * verified from what was fetched, and logs a scored row to Website Audits.
 *
 * This is explicitly NOT a Lighthouse/PageSpeed run, a real mobile-render
 * test, or an accessibility-compliance audit. Every check below is either a
 * direct read of the fetched HTML/HTTP response, or a plainly-labeled
 * heuristic (page size, fetch duration) — nothing here claims to measure
 * something it didn't actually measure. See crm/README.md for the full
 * "what is / isn't measured" breakdown.
 */

// Safety limits — one primary page fetch + a few lightweight checks, never
// a crawl. AUDIT_MAX_LINK_CHECKS caps how many same-origin links (found on
// the fetched page) get an extra status check; AUDIT_MAX_HTML_CHARS caps
// how much of a very large page is actually scanned by the regex checks
// (the true page size used for the Performance heuristic is measured
// before this truncation).
const AUDIT_MAX_LINK_CHECKS = 5;
const AUDIT_MAX_HTML_CHARS = 500000;

// Overall-score category weights. Documented here and in crm/README.md —
// changing them changes what "the score" means, so they're not buried.
const AUDIT_WEIGHTS = { mobile: 0.25, seo: 0.35, performance: 0.20, accessibility: 0.20 };

// ---------------------------------------------------------------------------
// Manual audit fallback — for a prospect whose automated audit can't run
// (blocked, 403/404, timeout, etc.). Reuses the existing Website Audits
// schema/row-writer (saveAuditRecord_) unchanged for the automated path;
// adds exactly two columns so a saved record's origin is never ambiguous.
// Score/Notes are reused as-is (a manual score is a score; manual findings
// are notes) rather than duplicating them under new field names.
// ---------------------------------------------------------------------------

const MANUAL_AUDIT_COLUMNS = ['Audit Status', 'Audit Source'];
const AUDIT_SOURCE_AUTOMATED = 'Automated';
const AUDIT_SOURCE_MANUAL = 'Manual';
const AUDIT_STATUS_COMPLETED = 'Completed';
const AUDIT_STATUS_MANUAL_FINDINGS_ONLY = 'Manual - Findings Only (No Score)';

// Additive only, same pattern as CRM_Scoring.gs's ensureScoreColumns_ —
// appends whichever of MANUAL_AUDIT_COLUMNS are missing, never reorders or
// overwrites. Called from saveAuditRecord_ so both the automated and manual
// paths provision it on demand; a Website Audits sheet built before this
// fix gets the columns the first time either path writes a row.
function ensureManualAuditColumns_(sheet) {
  ensureHeaders_(sheet, MANUAL_AUDIT_COLUMNS); // Code.gs
  const lastCol = sheet.getLastColumn();
  applyBasicFilter_(sheet, lastCol); // Code.gs
  autoResizeColumns_(sheet, lastCol); // Code.gs
}

// ---------------------------------------------------------------------------
// Audit eligibility / re-queue — a Prospects-level cache of "what happened
// the last time this business's website was auditable" so a prospect that
// was skipped (no Website on file at import time) is automatically picked
// up once a Website is added later, without a second audit engine and
// without ever re-auditing (duplicating) a business that already has a
// Website Audits record.
//
// Four states, matching the CRM-wide model this column exists to represent:
//   Not Audited        — default/blank; nothing has been attempted yet.
//   Automated Success   — the automated engine (auditUrl_) succeeded and the
//                          row was saved to Website Audits.
//   Automated Failed    — the automated engine could not complete (bad URL,
//                          403/404/timeout/etc.) — never written to Website
//                          Audits (a failed audit still isn't a data point,
//                          CRM_Audits.gs), so this column is the only place
//                          that state is ever recorded.
//   Manual Audit         — a human recorded findings via Record Manual Audit.
//
// This column is a CACHE, not the source of truth: Website Audits stays the
// source of truth for anything that actually has a record there. Every
// reader of this cache (classifyAuditQueueRow_ below) re-verifies against
// the live Website Audits record before ever treating a row as eligible,
// so a stale/blank cache (e.g. a sheet built before this fix, or a business
// audited through a path that predates this column) self-heals instead of
// triggering a duplicate audit.
// ---------------------------------------------------------------------------

const WEBSITE_AUDIT_STATE_COLUMN = ['Website Audit State'];
const AUDIT_STATE_NOT_AUDITED = 'Not Audited';
const AUDIT_STATE_AUTOMATED_SUCCESS = 'Automated Success';
const AUDIT_STATE_AUTOMATED_FAILED = 'Automated Failed';
const AUDIT_STATE_MANUAL_AUDIT = 'Manual Audit';

// Same values as CRM_OutreachAutomation.gs's own OUTREACH_AUTOMATION_EXCLUDED_STATUSES,
// declared independently here — this CRM's established convention is for
// each feature to keep its own exclusion list (CRM_Scoring.gs's
// SCORE_EXCLUDED_STATUSES, CRM_CommandCenter.gs's HOT_ACTION_EXCLUDED_STATUSES,
// etc.) rather than share one cross-file constant.
const AUDIT_QUEUE_EXCLUDED_STATUSES = ['archived', 'do not contact', 'closed — lost', 'closed — not interested'];

// A single audit fetch is a handful of HTTP calls (not a Tavily+Gemini round
// trip), so a capped batch comfortably finishes in one Apps Script
// execution — no resumable-trigger machinery needed here. Run the action
// again for any remainder, same as the user-facing message says.
const AUDIT_ELIGIBLE_MAX_BATCH_SIZE = 15;

function ensureWebsiteAuditStateColumn_(sheet) {
  ensureHeaders_(sheet, WEBSITE_AUDIT_STATE_COLUMN); // Code.gs
  const lastCol = sheet.getLastColumn();
  applyBasicFilter_(sheet, lastCol); // Code.gs
  autoResizeColumns_(sheet, lastCol); // Code.gs
}

// The only writer of the Website Audit State column. Provisions it on
// demand so this is safe to call on a Prospects sheet built before this fix.
function stampProspectAuditState_(prospects, row, state) {
  ensureWebsiteAuditStateColumn_(prospects);
  const headers = getLiveProspectsHeaders_(prospects); // CRM_Outreach.gs
  const idx = headers.indexOf('Website Audit State');
  if (idx === -1) return; // defensive only — ensureWebsiteAuditStateColumn_ just added it
  prospects.getRange(row, idx + 1).setValue(state);
}

function isAuditQueueExcludedStatus_(status, archivedDate) {
  const statusKey = String(status || '').trim().toLowerCase();
  return AUDIT_QUEUE_EXCLUDED_STATUSES.indexOf(statusKey) !== -1 || String(archivedDate || '').trim() !== '';
}

// Resolves what a prospect's audit state SHOULD be, purely from the live
// Website Audits record (if any) — the source of truth this cache defers
// to. Never invents a "failed" state here: a failed automated audit has no
// Website Audits row to find (by design, see saveAuditRecord_ below), so
// this can only ever resolve to a real, already-saved success/manual record.
function resolveWebsiteAuditStateFromRecord_(business, website) {
  const existing = findLatestAuditForBusiness_(business, website); // CRM_Outreach.gs
  if (!existing) return null;
  return existing.source === AUDIT_SOURCE_MANUAL ? AUDIT_STATE_MANUAL_AUDIT : AUDIT_STATE_AUTOMATED_SUCCESS;
}

// Single source of truth for "is this Prospects row eligible to be queued
// for an automated audit right now" — used by the batch scan below and its
// own summary counts, so eligibility is never computed two different ways.
//
// reason codes: 'blank_business' | 'rcs_excluded' | 'excluded_status' |
// 'missing_website' | 'already_audited' | 'previously_failed'
function classifyAuditQueueRow_(business, status, archivedDate, website, cachedState) {
  if (business === '') return { eligible: false, reason: 'blank_business' };
  if (typeof isExcludedProspect_ === 'function' && isExcludedProspect_(business)) return { eligible: false, reason: 'rcs_excluded' }; // CRM_Health.gs
  if (isAuditQueueExcludedStatus_(status, archivedDate)) return { eligible: false, reason: 'excluded_status' };
  if (website === '') return { eligible: false, reason: 'missing_website' };

  const stateKey = String(cachedState || '').trim();
  // A previously-failed automated attempt is not retried automatically —
  // it waits for a human (fix the site, retry manually, or record a Manual
  // Audit), matching the documented "FAILED -> Manual Audit available"
  // workflow rather than silently hammering a possibly-blocking site.
  if (stateKey === AUDIT_STATE_AUTOMATED_FAILED) return { eligible: false, reason: 'previously_failed' };
  if (stateKey === AUDIT_STATE_AUTOMATED_SUCCESS || stateKey === AUDIT_STATE_MANUAL_AUDIT) return { eligible: false, reason: 'already_audited' };

  // Cached state is blank/Not Audited — verify live before treating as
  // eligible, so a row that predates this column (or was audited through a
  // path before this cache existed) is backfilled instead of re-audited.
  const resolved = resolveWebsiteAuditStateFromRecord_(business, website);
  if (resolved) return { eligible: false, reason: 'already_audited', backfillState: resolved };

  return { eligible: true };
}

// ---------------------------------------------------------------------------
// Menu entry points
// ---------------------------------------------------------------------------

function menuAuditSelectedProspect_() {
  const rows = getSelectedProspectRows_(); // CRM_Actions.gs
  if (!rows) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const prospects = ss.getSheetByName('Prospects');
  const pHeaders = getHeaders_('Prospects'); // CRM_Actions.gs
  const bIdx = pHeaders.indexOf('Business');
  const wIdx = pHeaders.indexOf('Website');

  const ui = SpreadsheetApp.getUi();
  const candidates = [];
  rows.forEach(function (r) {
    const rowValues = prospects.getRange(r, 1, 1, pHeaders.length).getValues()[0];
    const business = String(rowValues[bIdx] || '').trim();
    const website = String(rowValues[wIdx] || '').trim();
    if (business !== '' && website !== '') candidates.push({ business: business, website: website, row: r });
  });
  const skippedNoUrl = rows.length - candidates.length;

  if (candidates.length === 0) {
    ui.alert('Website Audit', 'None of the selected row(s) have both a Business name and a Website — nothing to audit.', ui.ButtonSet.OK);
    return;
  }

  const question = candidates.length === 1
    ? 'Audit ' + candidates[0].business + ' (' + candidates[0].website + ')?'
    : 'Audit ' + candidates.length + ' selected prospects’ websites?';
  if (ui.alert('Website Audit', question, ui.ButtonSet.YES_NO) !== ui.Button.YES) return;

  // Stamps Website Audit State on the Prospects row this candidate came
  // from either way — keeps the audit-eligibility cache (above) in sync
  // with every path that can produce a real audit result, not just the
  // batch below, so a prospect audited this way is never re-queued for a
  // duplicate automated audit later.
  const results = candidates.map(function (c) {
    const normalized = normalizeUrl_(c.website);
    if (!normalized) {
      stampProspectAuditState_(prospects, c.row, AUDIT_STATE_AUTOMATED_FAILED);
      return { ok: false, business: c.business, url: c.website, message: 'That doesn’t look like a usable website URL.' };
    }
    const audit = performAndSaveAudit_(c.business, normalized);
    audit.business = c.business;
    audit.url = normalized;
    stampProspectAuditState_(prospects, c.row, (audit.ok && audit.saved) ? AUDIT_STATE_AUTOMATED_SUCCESS : AUDIT_STATE_AUTOMATED_FAILED);
    return audit;
  });

  showAuditResults_(results, skippedNoUrl);
}

function menuAuditWebsiteUrl_() {
  const html = HtmlService.createHtmlOutput(AUDIT_URL_DIALOG_HTML).setWidth(460).setHeight(420);
  SpreadsheetApp.getUi().showModalDialog(html, 'Audit Website URL');
}

// Called from the dialog via google.script.run. Always returns a plain
// { ok, ... } object and never throws — an uncaught exception escaping a
// google.script.run entry point is a well-known way for the calling
// dialog's success/failure callback to never fire, leaving the UI stuck
// on "Auditing...". The try/catch here is the last-resort guarantee that
// the dialog always gets a result to render, on top of the fact that
// auditUrl_() and saveAuditRecord_() already handle their own failures.
function runUrlAudit_(rawUrl) {
  try {
    const normalized = normalizeUrl_(rawUrl);
    if (!normalized) {
      return { ok: false, message: 'That doesn’t look like a usable website URL.' };
    }

    const business = deriveBusinessNameFromUrl_(normalized);
    const audit = performAndSaveAudit_(business, normalized);
    audit.business = business;
    audit.url = normalized;
    return audit;
  } catch (e) {
    return { ok: false, message: 'Unexpected error while auditing: ' + ((e && e.message) || e) };
  }
}

// Public entry point for google.script.run — Apps Script client calls should
// go through a non-underscore-suffixed function rather than reaching into an
// internal-convention name directly. Delegates to runUrlAudit_() unchanged.
function runUrlAudit(rawUrl) {
  return runUrlAudit_(rawUrl);
}

// ---------------------------------------------------------------------------
// "RCS CRM → Website Audit → Audit Eligible Prospects" — the re-queue fix.
// Handles both halves of the reported gap: a prospect imported with a
// Website is eligible immediately, and a prospect that had no Website at
// import time (skipped) becomes eligible the moment a Website is added,
// without needing to rebuild/re-import anything. No new prospect rows are
// ever created here — only the existing row's Website Audit State cell and
// (via the unmodified performAndSaveAudit_) Website Audits are written.
// ---------------------------------------------------------------------------

function menuAuditEligibleProspects_() {
  auditEligibleProspectsBatch_(true);
}

// Scans every Prospects row via classifyAuditQueueRow_ and:
//  - self-heals (backfills, never re-audits) any row whose cache is stale
//    but which already has a real Website Audits record — this is what
//    keeps "prospect imported with website" and "existing successful audit"
//    behavior unchanged for data that predates this feature;
//  - runs the existing, unmodified audit engine (performAndSaveAudit_) on
//    every genuinely eligible row, capped at AUDIT_ELIGIBLE_MAX_BATCH_SIZE
//    per run.
function auditEligibleProspectsBatch_(interactive) {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const prospects = ss.getSheetByName('Prospects');
  if (!prospects) {
    const message = 'Prospects sheet not found.';
    if (interactive) ui.alert('Website Audit', message, ui.ButtonSet.OK);
    return { ok: false, message: message };
  }

  ensureWebsiteAuditStateColumn_(prospects);
  const headers = getLiveProspectsHeaders_(prospects); // CRM_Outreach.gs
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });

  const lastRow = prospects.getLastRow();
  const eligibleRows = [];
  const backfills = []; // { row, state } — rows that already have a real audit on file
  let excluded = 0;

  if (lastRow >= 2) {
    const data = prospects.getRange(2, 1, lastRow - 1, headers.length).getValues();
    data.forEach(function (rowValues, i) {
      function field(name) { return idx[name] !== undefined ? rowValues[idx[name]] : ''; }
      const business = String(field('Business') || '').trim();
      const status = String(field('Status') || '').trim();
      const archivedDate = field('Archived Date');
      const website = String(field('Website') || '').trim();
      const cachedState = field('Website Audit State');

      const classification = classifyAuditQueueRow_(business, status, archivedDate, website, cachedState);
      if (classification.eligible) {
        eligibleRows.push(2 + i);
      } else {
        excluded++;
        if (classification.backfillState) backfills.push({ row: 2 + i, state: classification.backfillState });
      }
    });
  }

  // Self-heal first — cheap (no network calls), and guarantees a prospect
  // that already has a real Website Audits record is never counted toward,
  // or processed by, the network-calling loop below.
  backfills.forEach(function (b) { stampProspectAuditState_(prospects, b.row, b.state); });

  const totalEligible = eligibleRows.length;
  const toProcess = eligibleRows.slice(0, AUDIT_ELIGIBLE_MAX_BATCH_SIZE);

  if (totalEligible === 0) {
    const message = 'No newly-eligible prospects to audit (excluded or already audited: ' + excluded + ').';
    if (interactive) ui.alert('Website Audit', message, ui.ButtonSet.OK);
    return { ok: true, eligible: 0, excluded: excluded, processed: 0, audited: 0, failed: 0 };
  }

  if (interactive) {
    const confirmMessage = 'Newly-eligible prospects (never audited): ' + totalEligible +
      '\nThis run will process: ' + toProcess.length +
      (totalEligible > toProcess.length ? ' (run again for the remaining ' + (totalEligible - toProcess.length) + ')' : '') +
      '\n\nRun the automated Website Audit for each?';
    if (ui.alert('Website Audit — Audit Eligible Prospects', confirmMessage, ui.ButtonSet.YES_NO) !== ui.Button.YES) {
      return { ok: false, message: 'Cancelled.', eligible: totalEligible, excluded: excluded, cancelled: true };
    }
  }

  let audited = 0, failed = 0;
  const failures = [];
  toProcess.forEach(function (row) {
    const rowValues = prospects.getRange(row, 1, 1, headers.length).getValues()[0];
    const business = String(rowValues[idx['Business']] || '').trim();
    const website = String(rowValues[idx['Website']] || '').trim();
    const normalized = normalizeUrl_(website);

    if (!normalized) {
      stampProspectAuditState_(prospects, row, AUDIT_STATE_AUTOMATED_FAILED);
      failed++;
      failures.push(business + ': that doesn’t look like a usable website URL.');
      return;
    }

    const audit = performAndSaveAudit_(business, normalized); // CRM_Audits.gs — unchanged engine, no second implementation
    if (audit.ok && audit.saved) {
      stampProspectAuditState_(prospects, row, AUDIT_STATE_AUTOMATED_SUCCESS);
      audited++;
    } else {
      stampProspectAuditState_(prospects, row, AUDIT_STATE_AUTOMATED_FAILED);
      failed++;
      failures.push(business + ': ' + (audit.message || audit.saveError || 'audit did not complete.'));
    }
  });

  const remaining = totalEligible - toProcess.length;
  const summary = {
    ok: true, eligible: totalEligible, excluded: excluded, processed: toProcess.length,
    audited: audited, failed: failed, remaining: remaining, failures: failures
  };

  if (interactive) {
    const lines = [
      'Eligible: ' + totalEligible,
      'Processed: ' + toProcess.length,
      'Automated Success: ' + audited,
      'Automated Failed: ' + failed,
      'Excluded / already audited: ' + excluded
    ];
    if (remaining > 0) lines.push('', remaining + ' more eligible — run Audit Eligible Prospects again to continue.');
    if (failed > 0) lines.push('', 'Failed (Manual Audit is available for these):', failures.slice(0, 10).join('\n'));
    ui.alert('Website Audit — Audit Eligible Prospects', lines.join('\n'), ui.ButtonSet.OK);
  }

  return summary;
}

// ---------------------------------------------------------------------------
// Manual audit fallback ("RCS CRM → Website Audit → Record Manual Audit")
// ---------------------------------------------------------------------------
//
// For a prospect whose automated audit can't run (blocked/403/404/timeout/
// etc.). Never triggered automatically by a failed automated audit — that
// failure is just shown to the user (existing behavior, unchanged); a human
// decides to record a manual audit afterward, from this separate menu item.
// Reuses getSelectedProspectRows_ (CRM_Actions.gs), the same "select a row
// in Prospects first" convention every other prospect action uses, and
// saveAuditRecord_ (this file) for the actual write — no second Website
// Audits writer.

function menuRecordManualAudit_() {
  const rows = getSelectedProspectRows_(); // CRM_Actions.gs
  if (!rows) return;

  const ui = SpreadsheetApp.getUi();
  if (rows.length !== 1) {
    ui.alert('Record Manual Audit', 'Select exactly one prospect (a manual audit records findings for one business at a time).', ui.ButtonSet.OK);
    return;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const prospects = ss.getSheetByName('Prospects');
  const pHeaders = getHeaders_('Prospects'); // CRM_Actions.gs — Business/Website are always in the static base schema
  const bIdx = pHeaders.indexOf('Business');
  const wIdx = pHeaders.indexOf('Website');
  const rowValues = prospects.getRange(rows[0], 1, 1, pHeaders.length).getValues()[0];
  const business = String(rowValues[bIdx] || '').trim();
  const website = String(rowValues[wIdx] || '').trim();

  if (business === '' || website === '') {
    ui.alert('Record Manual Audit', 'This prospect needs both a Business name and a Website on file before recording a manual audit.', ui.ButtonSet.OK);
    return;
  }

  const html = HtmlService.createHtmlOutput(buildManualAuditDialogHtml_(business, website, rows[0])).setWidth(480).setHeight(420);
  SpreadsheetApp.getUi().showModalDialog(html, 'Record Manual Audit');
}

// Scans Prospects for the row matching a given Business+Website, reusing
// dedupeKey_'s exact trimmed/lowercased comparison (CRM_Import.gs) — the
// same identity check used everywhere else duplicate/matching logic already
// runs. Fallback used only when recordManualAudit_ wasn't given a row
// directly (e.g. an older caller); returns null (never throws) if the sheet
// or a match isn't found.
function findProspectRowByBusinessWebsite_(prospects, headers, business, website) {
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });
  if (idx['Business'] === undefined) return null;

  const lastRow = prospects.getLastRow();
  if (lastRow < 2) return null;

  const targetKey = dedupeKey_(business, website); // CRM_Import.gs
  const data = prospects.getRange(2, 1, lastRow - 1, headers.length).getValues();
  for (let i = 0; i < data.length; i++) {
    const b = data[i][idx['Business']];
    const w = idx['Website'] !== undefined ? data[i][idx['Website']] : '';
    if (dedupeKey_(b, w) === targetKey) return 2 + i;
  }
  return null;
}

// Never throws — every failure mode (missing prospect, invalid score,
// blank findings, a Sheets error mid-write) returns { ok: false, message }
// so the dialog's callback always gets a result. Only ever writes a row via
// saveAuditRecord_ with { source: 'Manual', ... } — never claims the
// automated auditor produced this data, and never invents a score: a blank
// score input stays blank on the sheet, it does not become 0 or a guess.
//
// `row` is optional (the dialog always supplies it — see
// menuRecordManualAudit_ / buildManualAuditDialogHtml_ below — every prior
// caller/test that omits it keeps working unchanged): when given, it's used
// directly to stamp the audit-eligibility cache (CRM_Audits.gs, above);
// otherwise the matching Prospects row is looked up by Business+Website.
// Either way, a lookup miss never fails the manual audit itself — the
// Website Audits row saved above is the real record.
function recordManualAudit_(business, website, scoreText, notes, row) {
  try {
    business = String(business || '').trim();
    website = String(website || '').trim();
    const findings = String(notes || '').trim();

    if (business === '' || website === '') {
      return { ok: false, message: 'Business and Website are required.' };
    }
    if (findings === '') {
      return { ok: false, message: 'Enter what you found on the site — a manual audit needs at least some findings.' };
    }

    let score = '';
    const scoreInput = String(scoreText || '').trim();
    if (scoreInput !== '') {
      const parsed = Number(scoreInput);
      if (isNaN(parsed) || parsed < 0 || parsed > 100) {
        return { ok: false, message: 'Manual score must be a number from 0 to 100, or left blank.' };
      }
      score = Math.round(parsed);
    }

    const status = score === '' ? AUDIT_STATUS_MANUAL_FINDINGS_ONLY : AUDIT_STATUS_COMPLETED;
    const manualAudit = { score: score, notes: findings, mobileLabel: '', seoLabel: '', performanceLabel: '', accessibilityLabel: '' };
    const saveResult = saveAuditRecord_(business, manualAudit, { source: AUDIT_SOURCE_MANUAL, status: status });

    if (!saveResult.saved) {
      return { ok: false, message: saveResult.message || 'Could not save the manual audit.' };
    }

    try {
      const prospects = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Prospects');
      if (prospects) {
        const liveHeaders = getLiveProspectsHeaders_(prospects); // CRM_Outreach.gs
        const targetRow = (typeof row === 'number' && row >= 2)
          ? row
          : findProspectRowByBusinessWebsite_(prospects, liveHeaders, business, website);
        if (targetRow) stampProspectAuditState_(prospects, targetRow, AUDIT_STATE_MANUAL_AUDIT);
      }
    } catch (stampErr) {
      // The eligibility cache is a convenience, not the record of truth —
      // never let a failure here change whether the manual audit itself is
      // reported as saved.
    }

    return { ok: true, business: business, website: website, score: score === '' ? null : score, status: status };
  } catch (e) {
    return { ok: false, message: 'Unexpected error while recording the manual audit: ' + ((e && e.message) || e) };
  }
}

// Public entry point for google.script.run — same convention as
// runUrlAudit/runUrlAudit_ above.
function recordManualAudit(business, website, scoreText, notes, row) {
  return recordManualAudit_(business, website, scoreText, notes, row);
}

// Minimal HTML-attribute/text escaping for values interpolated into the
// dialog markup below (Business/Website are user-entered data on Prospects
// and must not be trusted as safe HTML).
function escapeHtml_(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Client-side dialog: Business/Website shown for confirmation (read-only —
// if either is wrong, fix it on the Prospects row first, not here), an
// optional 0-100 score field, a required findings/notes textarea, and a
// Record button. Reports the same saved/not-saved shape as the automated
// audit dialogs above.
function buildManualAuditDialogHtml_(business, website, row) {
  const safeBusiness = escapeHtml_(business);
  const safeWebsite = escapeHtml_(website);
  // Server-controlled (the caller's own selected-row number, never user
  // input), so embedding it as a bare numeric/null literal is safe.
  const rowLiteral = (typeof row === 'number' && row >= 2) ? String(row) : 'null';
  return '<!DOCTYPE html><html><head><base target="_top">' +
    '<style>' +
    'body{font-family:Arial,sans-serif;font-size:13px;color:#222;padding:4px 8px;}' +
    'h3{margin:0 0 4px;font-size:15px;}' +
    'p.hint{color:#666;margin-top:0;}' +
    '.field{margin:10px 0;}' +
    'label{display:block;font-weight:bold;margin-bottom:4px;}' +
    'input[type=text],textarea{width:100%;box-sizing:border-box;padding:8px;border:1px solid #ccc;border-radius:4px;font-size:13px;font-family:inherit;}' +
    'textarea{min-height:90px;resize:vertical;}' +
    'button{background:#1a1a2e;color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:13px;}' +
    'button:disabled{background:#999;cursor:default;}' +
    '#status{margin-top:14px;line-height:1.5;white-space:pre-wrap;}' +
    '</style></head><body>' +
    '<h3>Record Manual Audit</h3>' +
    '<p class="hint">Business: <strong>' + safeBusiness + '</strong><br>Website: <strong>' + safeWebsite + '</strong></p>' +
    '<div class="field"><label for="scoreInput">Manual Score (0-100, optional — leave blank if you\'re not scoring it)</label>' +
    '<input type="text" id="scoreInput" placeholder="e.g. 65"></div>' +
    '<div class="field"><label for="notesInput">Findings / Notes (required)</label>' +
    '<textarea id="notesInput" placeholder="What did you see on the site? e.g. no mobile-friendly layout, outdated contact info, no HTTPS..."></textarea></div>' +
    '<button id="recordBtn">Record Manual Audit</button>' +
    '<div id="status"></div>' +
    '<script>' +
    'document.getElementById("recordBtn").addEventListener("click", function () {' +
    '  var score = document.getElementById("scoreInput").value;' +
    '  var notes = document.getElementById("notesInput").value;' +
    '  var status = document.getElementById("status");' +
    '  var btn = document.getElementById("recordBtn");' +
    '  if (!notes.trim()) { status.textContent = "Enter findings/notes first."; return; }' +
    '  btn.disabled = true;' +
    '  status.textContent = "Recording...";' +
    '  google.script.run.withSuccessHandler(function (result) {' +
    '    btn.disabled = false;' +
    '    if (!result || !result.ok) { status.textContent = "Not saved: " + ((result && result.message) || "No result was returned."); return; }' +
    '    status.textContent = "Saved as a Manual audit (Audit Source = Manual)." +' +
    '      (result.score !== null ? " Score: " + result.score + "/100." : " No score recorded — findings only.") +' +
    '      " This will never be shown as an automated result.";' +
    '  }).withFailureHandler(function (err) {' +
    '    btn.disabled = false;' +
    '    status.textContent = "Not saved: " + ((err && err.message) || String(err) || "Unknown error.");' +
    '  }).recordManualAudit(' + JSON.stringify(business) + ', ' + JSON.stringify(website) + ', score, notes, ' + rowLiteral + ');' +
    '});' +
    '</script></body></html>';
}

// ---------------------------------------------------------------------------
// URL handling
// ---------------------------------------------------------------------------

// Adds https:// when no protocol is given, and rejects anything that isn't
// a plausible http/https URL (including other protocols like ftp:// or
// mailto: — those get rejected outright rather than mangled).
function normalizeUrl_(input) {
  let url = String(input || '').trim();
  if (url === '') return null;

  // Matches ANY "scheme:" prefix, not just ones using "//" — mailto: and
  // tel: don't use "//" the way http:// and ftp:// do, so checking only
  // for "scheme://" would miss them and let them get "https://" prepended
  // (mangling "mailto:foo@x.com" into a bogus-but-regex-passing URL).
  const schemeMatch = url.match(/^([a-z][a-z0-9+.-]*):/i);
  if (schemeMatch) {
    const scheme = schemeMatch[1].toLowerCase();
    if (scheme !== 'http' && scheme !== 'https') return null;
  } else {
    url = 'https://' + url;
  }

  if (!/^https?:\/\/[^\s/]+\.[^\s/]+/i.test(url)) return null;
  return url;
}

function getOrigin_(url) {
  const m = url.match(/^(https?:\/\/[^/]+)/i);
  return m ? m[1] : url;
}

function deriveBusinessNameFromUrl_(url) {
  const m = url.match(/^https?:\/\/(?:www\.)?([^/]+)/i);
  return m ? m[1] : url;
}

// ---------------------------------------------------------------------------
// Fetching (every network call is try/catch'd — a fetch failure anywhere
// here becomes a clear result, never an uncaught exception)
// ---------------------------------------------------------------------------

function fetchAuditPage_(url) {
  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
    return { ok: true, code: response.getResponseCode(), text: response.getContentText() };
  } catch (e) {
    return { ok: false, message: describeAuditFetchError_(e) };
  }
}

function checkAuxiliaryUrl_(url) {
  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
    const code = response.getResponseCode();
    return { reachable: code >= 200 && code < 400 };
  } catch (e) {
    return { reachable: false };
  }
}

function checkBrokenLinks_(links) {
  let broken = 0;
  links.forEach(function (link) {
    try {
      const response = UrlFetchApp.fetch(link, { muteHttpExceptions: true, followRedirects: true });
      if (response.getResponseCode() >= 400) broken++;
    } catch (e) {
      broken++; // unreachable counts as broken for this heuristic
    }
  });
  return broken;
}

function describeAuditFetchError_(e) {
  const msg = String((e && e.message) || e);
  if (/timeout/i.test(msg)) return 'The site took too long to respond (timeout).';
  if (/dns|address|resolve|unknown host/i.test(msg)) return 'Could not resolve the domain — check the URL is correct.';
  if (/ssl|certificate/i.test(msg)) return 'SSL/certificate error while connecting to the site.';
  if (/refused|unreachable|connect/i.test(msg)) return 'Connection failed — the site appears to be unreachable.';
  return 'Network error while fetching the site: ' + msg;
}

// ---------------------------------------------------------------------------
// HTML checks — plain string/regex reads of the fetched markup. No DOM
// parser is available in Apps Script, so these are pattern matches, not a
// real parse tree; good enough for presence/absence/count checks, which is
// all any of these claim to answer.
// ---------------------------------------------------------------------------

function extractTitle_(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return null;
  const text = m[1].replace(/\s+/g, ' ').trim();
  return text === '' ? null : text;
}

function extractMetaContent_(html, name) {
  const re1 = new RegExp('<meta[^>]+name=["\']' + name + '["\'][^>]*content=["\']([^"\']*)["\']', 'i');
  const re2 = new RegExp('<meta[^>]+content=["\']([^"\']*)["\'][^>]*name=["\']' + name + '["\']', 'i');
  const m = html.match(re1) || html.match(re2);
  return m ? m[1] : null;
}

function extractOgContent_(html, prop) {
  const re1 = new RegExp('<meta[^>]+property=["\']og:' + prop + '["\'][^>]*content=["\']([^"\']*)["\']', 'i');
  const re2 = new RegExp('<meta[^>]+content=["\']([^"\']*)["\'][^>]*property=["\']og:' + prop + '["\']', 'i');
  const m = html.match(re1) || html.match(re2);
  return m ? m[1] : null;
}

function hasViewportMeta_(html) {
  return /<meta[^>]+name=["']viewport["'][^>]*>/i.test(html);
}

function countH1_(html) {
  const matches = html.match(/<h1[\s>]/gi);
  return matches ? matches.length : 0;
}

function extractCanonicalHref_(html) {
  const re1 = /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']*)["']/i;
  const re2 = /<link[^>]+href=["']([^"']*)["'][^>]*rel=["']canonical["']/i;
  const m = html.match(re1) || html.match(re2);
  return m ? m[1] : null;
}

function countImagesMissingAlt_(html) {
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  let missing = 0;
  imgs.forEach(function (tag) {
    const m = tag.match(/alt\s*=\s*["']([^"']*)["']/i);
    if (!m || m[1].trim() === '') missing++;
  });
  return { total: imgs.length, missing: missing };
}

// Same-origin links found on the fetched page, capped at `cap`. Skips
// mailto:/tel:/javascript: and anything cross-origin — this is deliberately
// narrow (only obvious, cheap-to-resolve internal links), not a crawler.
function extractInternalLinks_(html, origin, cap) {
  const hrefs = [];
  const seen = {};
  const re = /<a\b[^>]*href=["']([^"'#]+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html)) !== null && hrefs.length < cap) {
    const href = m[1].trim();
    if (href === '' || /^(mailto:|tel:|javascript:)/i.test(href)) continue;

    let full;
    if (/^https?:\/\//i.test(href)) {
      if (href.indexOf(origin) !== 0) continue;
      full = href;
    } else if (href.indexOf('/') === 0) {
      full = origin + href;
    } else {
      continue; // ambiguous relative path — skip rather than guess
    }

    if (!seen[full]) { seen[full] = true; hrefs.push(full); }
  }
  return hrefs;
}

// ---------------------------------------------------------------------------
// Scoring — each category is 0-100 based only on checks actually performed.
// ---------------------------------------------------------------------------

function scoreSeo_(checks) {
  let score = 0;
  if (checks.title) {
    score += 25;
    if (checks.titleLength >= 10 && checks.titleLength <= 60) score += 5;
  }
  if (checks.metaDescription) {
    score += 25;
    if (checks.metaDescriptionLength >= 50 && checks.metaDescriptionLength <= 160) score += 5;
  }
  if (checks.h1Count === 1) score += 20;
  else if (checks.h1Count > 1) score += 15; // has one, just more than one — partial credit
  if (checks.canonical) score += 20;
  return score;
}

// Explicitly a page-size/network heuristic — fetch duration measured by
// this script's own wall-clock timing (a real, if narrow, signal) plus raw
// HTML size. Not Lighthouse, not PageSpeed, not Core Web Vitals.
function scorePerformance_(durationMs, htmlSize) {
  let score = 0;
  if (durationMs < 1000) score += 50;
  else if (durationMs < 3000) score += 35;
  else if (durationMs < 6000) score += 20;
  else score += 5;

  if (htmlSize < 100000) score += 50;
  else if (htmlSize < 300000) score += 35;
  else if (htmlSize < 800000) score += 20;
  else score += 5;

  return score;
}

// Image alt-text only, matching what's actually checked — not a general
// accessibility-compliance score.
function scoreAccessibility_(imgTotal, imgMissing) {
  if (imgTotal === 0) return 100; // nothing to flag
  return Math.round((100 * (imgTotal - imgMissing)) / imgTotal);
}

function computeOverallScore_(mobilePass, seoScore, performanceScore, accessibilityScore) {
  const mobileScore = mobilePass ? 100 : 0;
  const weighted = mobileScore * AUDIT_WEIGHTS.mobile +
    seoScore * AUDIT_WEIGHTS.seo +
    performanceScore * AUDIT_WEIGHTS.performance +
    accessibilityScore * AUDIT_WEIGHTS.accessibility;
  return Math.round(weighted);
}

// ---------------------------------------------------------------------------
// Audit engine
// ---------------------------------------------------------------------------

// Runs every check against a single normalized URL. Returns
// { ok: false, message } on any failure (fetch error, non-2xx, empty body),
// or the full scored result on success. Never throws.
function auditUrl_(url) {
  const startTime = Date.now();
  const fetchResult = fetchAuditPage_(url);
  if (!fetchResult.ok) return { ok: false, message: fetchResult.message };

  const durationMs = Date.now() - startTime;

  if (fetchResult.code < 200 || fetchResult.code >= 300) {
    return { ok: false, message: 'The site returned HTTP ' + fetchResult.code + ' — could not run the audit.' };
  }

  const rawText = fetchResult.text || '';
  if (rawText.trim() === '') {
    return { ok: false, message: 'The page returned an empty response — nothing to analyze.' };
  }

  const html = rawText.length > AUDIT_MAX_HTML_CHARS ? rawText.slice(0, AUDIT_MAX_HTML_CHARS) : rawText;
  const isHttps = /^https:\/\//i.test(url);

  const title = extractTitle_(html);
  const metaDescription = extractMetaContent_(html, 'description');
  const hasViewport = hasViewportMeta_(html);
  const h1Count = countH1_(html);
  const canonical = extractCanonicalHref_(html);
  const imgStats = countImagesMissingAlt_(html);
  const ogTitle = extractOgContent_(html, 'title');
  const ogImage = extractOgContent_(html, 'image');

  const origin = getOrigin_(url);
  const robots = checkAuxiliaryUrl_(origin + '/robots.txt');
  const sitemap = checkAuxiliaryUrl_(origin + '/sitemap.xml');

  const internalLinks = extractInternalLinks_(html, origin, AUDIT_MAX_LINK_CHECKS);
  const brokenLinkCount = checkBrokenLinks_(internalLinks);

  const seoChecks = {
    title: !!title,
    titleLength: title ? title.length : 0,
    metaDescription: !!metaDescription,
    metaDescriptionLength: metaDescription ? metaDescription.length : 0,
    h1Count: h1Count,
    canonical: !!canonical
  };
  const seoScore = scoreSeo_(seoChecks);
  const performanceScore = scorePerformance_(durationMs, rawText.length);
  const accessibilityScore = scoreAccessibility_(imgStats.total, imgStats.missing);
  const overallScore = computeOverallScore_(hasViewport, seoScore, performanceScore, accessibilityScore);

  const issues = [];
  if (!isHttps) issues.push('not using HTTPS');
  if (!hasViewport) issues.push('no mobile viewport meta tag');
  if (!title) issues.push('missing page title');
  else if (title.length < 10 || title.length > 60) issues.push('title length not ideal (' + title.length + ' characters)');
  if (!metaDescription) issues.push('missing meta description');
  else if (metaDescription.length < 50 || metaDescription.length > 160) issues.push('meta description length not ideal (' + metaDescription.length + ' characters)');
  if (h1Count === 0) issues.push('no H1 heading found');
  else if (h1Count > 1) issues.push('multiple H1 headings found (' + h1Count + ')');
  if (imgStats.missing > 0) issues.push(imgStats.missing + ' image' + (imgStats.missing === 1 ? '' : 's') + ' missing alt text');
  if (!canonical) issues.push('no canonical tag');
  if (!robots.reachable) issues.push('robots.txt not reachable');
  if (!sitemap.reachable) issues.push('sitemap.xml not reachable');
  if (!ogTitle && !ogImage) issues.push('missing Open Graph title/image tags');
  if (brokenLinkCount > 0) issues.push(brokenLinkCount + ' internal link' + (brokenLinkCount === 1 ? '' : 's') + ' returned an error');

  const notes = issues.length > 0
    ? 'Opportunities: ' + issues.join('; ') + '.'
    : 'No issues found in the checks performed.';

  return {
    ok: true,
    score: overallScore,
    mobileLabel: hasViewport ? 'PASS — viewport meta found' : 'FAIL — no viewport meta tag found',
    seoLabel: seoScore + '/100 — title/meta/H1/canonical checks',
    performanceLabel: performanceScore + '/100 — HTML size/network heuristic',
    accessibilityLabel: accessibilityScore + '/100 — image alt-text checks',
    notes: notes,
    issues: issues
  };
}

// Runs the audit and, on success, appends a row to Website Audits. On a
// failed audit (bad fetch, non-2xx, empty body), nothing is written — a
// failed audit isn't a data point. On a successful audit, the returned
// object's `saved` flag reflects whether the row write itself actually
// succeeded — audit.ok being true only ever meant "the site was reachable
// and scored," never "and the row was saved," so callers must not assume
// one implies the other.
function performAndSaveAudit_(business, url) {
  const audit = auditUrl_(url);
  if (!audit.ok) return audit;

  const saveResult = saveAuditRecord_(business, audit);
  audit.saved = saveResult.saved;
  if (!saveResult.saved) audit.saveError = saveResult.message;
  return audit;
}

// Returns { saved: true } once the row is actually written, or
// { saved: false, message } otherwise. Never throws: every failure mode
// (missing sheet, missing/renamed schema, a Sheets API error mid-write) is
// caught and turned into a returned result instead of an uncaught
// exception, so a caller can never mistake "didn't throw" for "saved."
//
// opts is optional and defaults to the automated path's existing behavior
// unchanged ({ source: 'Automated', status: 'Completed' }) — the manual
// audit fallback (below) is the only caller that ever passes a different
// opts, so every existing call site (performAndSaveAudit_) keeps writing
// exactly the row shape it always has.
function saveAuditRecord_(business, audit, opts) {
  const source = (opts && opts.source) || AUDIT_SOURCE_AUTOMATED;
  const status = (opts && opts.status) || AUDIT_STATUS_COMPLETED;

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Website Audits');
    if (!sheet) {
      return { saved: false, message: 'Website Audits sheet not found.' };
    }

    ensureManualAuditColumns_(sheet); // additive — safe/idempotent for the automated path too
    const headers = getLiveProspectsHeaders_(sheet); // CRM_Outreach.gs — reads the sheet's actual current header row, not just the static 8-column schema
    if (!headers || headers.length === 0) {
      return { saved: false, message: 'Website Audits column schema not found.' };
    }

    const idx = {};
    headers.forEach(function (h, i) { idx[h] = i; });

    const row = new Array(headers.length).fill('');
    row[idx['Business']] = business;
    row[idx['Date']] = formatAuditDate_(new Date());
    row[idx['Mobile']] = audit.mobileLabel || '';
    row[idx['SEO']] = audit.seoLabel || '';
    row[idx['Performance']] = audit.performanceLabel || '';
    row[idx['Accessibility']] = audit.accessibilityLabel || '';
    // audit.score can legitimately be 0 (a real score), so this must not
    // use `||` (0 is falsy) — only undefined/null/'' mean "no score at all."
    row[idx['Score']] = (audit.score !== undefined && audit.score !== null && audit.score !== '') ? audit.score : '';
    row[idx['Notes']] = audit.notes || '';
    if (idx['Audit Status'] !== undefined) row[idx['Audit Status']] = status;
    if (idx['Audit Source'] !== undefined) row[idx['Audit Source']] = source;

    // Always appended below the current last row — a repeat audit of the
    // same business becomes a new row, never a replacement of the old one.
    // Applies identically to a manual re-audit: findLatestAuditForBusiness_
    // (CRM_Outreach.gs) always resolves to whichever row was written last.
    const targetRow = sheet.getLastRow() + 1;
    sheet.getRange(targetRow, 1, 1, headers.length).setValues([row]);

    // Confirm the write actually landed before reporting success — reads
    // back the cell we just set rather than trusting setValues() not to
    // have silently no-op'd on a stale range reference.
    const writtenBusiness = sheet.getRange(targetRow, idx['Business'] + 1).getValue();
    if (String(writtenBusiness || '').trim() !== String(business || '').trim()) {
      return { saved: false, message: 'Row write did not verify — sheet may be protected or out of sync.' };
    }

    applyBasicFilter_(sheet, headers.length); // Code.gs
    autoResizeColumns_(sheet, headers.length); // Code.gs
    return { saved: true };
  } catch (e) {
    return { saved: false, message: 'Could not write to Website Audits: ' + ((e && e.message) || e) };
  }
}

function formatAuditDate_(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

// ---------------------------------------------------------------------------
// Results UI
// ---------------------------------------------------------------------------

function formatSingleAuditResult_(r) {
  if (!r.ok) return r.business + ' — audit failed: ' + r.message;

  const topIssues = r.issues && r.issues.length ? r.issues.slice(0, 3).join('; ') : 'None found';
  const saveLine = r.saved
    ? 'Audit saved to Website Audits.'
    : 'Audit completed but was NOT saved to Website Audits' + (r.saveError ? ' (' + r.saveError + ')' : '') + '.';
  return 'Business: ' + r.business +
    '\nURL: ' + r.url +
    '\nOverall Score: ' + r.score + '/100' +
    '\nMobile: ' + r.mobileLabel +
    '\nSEO: ' + r.seoLabel +
    '\nPerformance: ' + r.performanceLabel +
    '\nAccessibility: ' + r.accessibilityLabel +
    '\nTop issues: ' + topIssues +
    '\n\n' + saveLine;
}

function showAuditResults_(results, skippedNoUrl) {
  const ui = SpreadsheetApp.getUi();
  let message;

  if (results.length === 1) {
    message = formatSingleAuditResult_(results[0]);
  } else {
    const audited = results.filter(function (r) { return r.ok; }).length;
    const failed = results.length - audited;
    const lines = results.map(function (r) {
      if (!r.ok) return r.business + ' — failed: ' + r.message;
      return r.business + ' — ' + r.score + '/100' + (r.saved ? '' : ' (NOT SAVED)');
    });
    message = 'Audited: ' + audited + (failed ? ', Failed: ' + failed : '') +
      '\n\n' + lines.join('\n');
  }

  if (skippedNoUrl > 0) {
    message += '\n\n(' + skippedNoUrl + ' other selected row(s) had no Business/Website and were skipped.)';
  }

  ui.alert('Website Audit', message, ui.ButtonSet.OK);
}

// Client-side dialog: URL input + Run Audit button + a results area that
// reports the same fields as the Prospect-audit alert.
const AUDIT_URL_DIALOG_HTML = '<!DOCTYPE html><html><head><base target="_top">' +
  '<style>' +
  'body{font-family:Arial,sans-serif;font-size:13px;color:#222;padding:4px 8px;}' +
  'h3{margin:0 0 10px;font-size:15px;}' +
  'p.hint{color:#666;margin-top:0;}' +
  'input[type=text]{width:100%;box-sizing:border-box;padding:8px;margin:8px 0;border:1px solid #ccc;border-radius:4px;font-size:13px;}' +
  'button{background:#1a1a2e;color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:13px;}' +
  'button:disabled{background:#999;cursor:default;}' +
  '#status{margin-top:16px;line-height:1.5;white-space:pre-wrap;}' +
  '</style></head><body>' +
  '<h3>Audit Website URL</h3>' +
  '<p class="hint">Enter a website URL. Checks one page plus robots.txt/sitemap.xml — no full-site crawl.</p>' +
  '<input type="text" id="urlInput" placeholder="example.com or https://example.com">' +
  '<button id="auditBtn">Run Audit</button>' +
  '<div id="status"></div>' +
  '<script>' +
  'document.getElementById("auditBtn").addEventListener("click", function () {' +
  '  var input = document.getElementById("urlInput");' +
  '  var status = document.getElementById("status");' +
  '  var btn = document.getElementById("auditBtn");' +
  '  if (!input.value.trim()) { status.textContent = "Enter a URL first."; return; }' +
  '  btn.disabled = true;' +
  '  status.textContent = "Auditing...";' +
  '  google.script.run.withSuccessHandler(function (result) {' +
  '    btn.disabled = false;' +
  '    if (!result || !result.ok) { status.textContent = "Audit failed: " + ((result && result.message) || "No result was returned."); return; }' +
  '    var topIssues = (result.issues && result.issues.length) ? result.issues.slice(0, 3).join("; ") : "None found";' +
  '    var saveLine = result.saved ? "Audit saved to Website Audits." : ("Audit completed but was NOT saved to Website Audits" + (result.saveError ? " (" + result.saveError + ")" : "") + ".");' +
  '    status.textContent = "Business: " + result.business +' +
  '      "\\nURL: " + result.url +' +
  '      "\\nOverall Score: " + result.score + "/100" +' +
  '      "\\nMobile: " + result.mobileLabel +' +
  '      "\\nSEO: " + result.seoLabel +' +
  '      "\\nPerformance: " + result.performanceLabel +' +
  '      "\\nAccessibility: " + result.accessibilityLabel +' +
  '      "\\nTop issues: " + topIssues +' +
  '      "\\n\\n" + saveLine;' +
  '  }).withFailureHandler(function (err) {' +
  '    btn.disabled = false;' +
  '    status.textContent = "Audit failed: " + ((err && err.message) || String(err) || "Unknown error.");' +
  '  }).runUrlAudit(input.value);' +
  '});' +
  '</script></body></html>';
