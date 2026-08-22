/**
 * CRM_OutreachAutomation.gs
 * ---------------------------------------------------------------------------
 * Sprint 13A — Automated Outreach Preparation Engine (prep only, never send).
 *
 * Pipeline for one selected Prospects row:
 *   Prospect -> Tavily research -> existing Website Audit (reused, not
 *   duplicated) -> Gemini analysis of research+audit+CRM context ->
 *   Outreach Research / Outreach Angle / Outreach Message saved to
 *   Prospects, status READY_FOR_REVIEW. Nothing is ever sent anywhere —
 *   every result dialog says so explicitly, and no send/email API is
 *   called anywhere in this file.
 *
 * Reuses: getSelectedProspectRows_ (CRM_Actions.gs), getLiveProspectsHeaders_
 * / findLatestAuditForBusiness_ / OUTREACH_BRIEF_COLUMN (CRM_Outreach.gs),
 * normalizeUrl_ / performAndSaveAudit_ (CRM_Audits.gs) for the Website Audit
 * step — no audit/scoring/matching logic is reimplemented here.
 * ensureHeaders_ / applyBasicFilter_ / autoResizeColumns_ (Code.gs) provision
 * this sprint's five new Prospects columns the same additive, self-contained
 * way Sprint 5's Outreach Brief and Sprint 7's Score columns were — see
 * ensureOutreachAutomationColumns_ below. CRM_Builder.gs is not touched.
 *
 * API keys: read only from Script Properties (TAVILY_API_KEY,
 * GEMINI_API_KEY) via getOutreachAutomationConfig_(). A key is never
 * written to a log, an alert, a sheet cell, or a returned error message —
 * every network call/error path below was written to only ever surface a
 * plain status word ("Configured"/"Missing") or a generic failure message,
 * never the key value or the raw request.
 *
 * Sprint 13B adds "Prepare Eligible Prospects" — the same pipeline above,
 * run sequentially (never concurrently) across every eligible Prospects row,
 * up to OUTREACH_AUTOMATION_MAX_BATCH_SIZE per batch. It is a thin
 * scan-and-loop wrapper: prepareOneProspectRow_ is the one and only place
 * the research/audit/Gemini/retry/eligibility logic lives, called
 * identically by both the single-row and batch entry points.
 *
 * Sprint 13C makes that batch resumable, since even 10 prospects can exceed
 * Apps Script's ~6-minute execution limit. Progress (which rows, how far
 * along, running counts) is persisted to Script Properties — no CRM schema
 * change — and each execution stops itself after OUTREACH_BATCH_TIME_BUDGET_MS
 * regardless of how many rows are left, scheduling a single idempotent
 * time-based trigger (same removeAndRecreate pattern CRM_Automation.gs's
 * daily-maintenance trigger already uses) to continue automatically, with
 * "Resume Batch" always available as a manual fallback. LockService guards
 * against two executions (a manual click and an auto-resume) claiming the
 * same chunk at once.
 */

const OUTREACH_AUTOMATION_FIELDS = [
  'Outreach Research', 'Outreach Angle', 'Outreach Message',
  'Outreach Prepared At', 'Outreach Preparation Status'
];

const OUTREACH_AUTOMATION_STATES = {
  NOT_READY: 'NOT_READY',
  RESEARCHING: 'RESEARCHING',
  AUDITING: 'AUDITING',
  GENERATING: 'GENERATING',
  READY: 'READY_FOR_REVIEW',
  FAILED: 'FAILED'
};

// A prospect in one of these states (by Status, case-insensitive) or with
// an Archived Date on file is never prepared for outreach — same style of
// per-sprint exclusion list as CRM_CommandCenter.gs's
// HOT_ACTION_EXCLUDED_STATUSES / CRM_Scoring.gs's SCORE_EXCLUDED_STATUSES,
// sized to what this specific workflow needs (a closed-lost or declined
// prospect should never get a freshly generated outreach message).
const OUTREACH_AUTOMATION_EXCLUDED_STATUSES = ['archived', 'do not contact', 'closed — lost', 'closed — not interested'];

// Sprint 13B — Prepare Eligible Prospects (batch). Sequential only, capped
// per run so a single "Prepare Eligible Prospects" click can't accidentally
// burn through a large multiple of the Tavily/Gemini quota. Change this one
// constant to raise/lower the cap; nothing else needs to change.
const OUTREACH_AUTOMATION_MAX_BATCH_SIZE = 10;

// Sprint 13C — resumable batch execution. Progress lives only in Script
// Properties (transient, cleared when the batch finishes) — never a new CRM
// column. 4.5 minutes leaves real safety margin under Apps Script's 6-minute
// per-execution limit even on a slow Tavily/Gemini round trip.
const OUTREACH_BATCH_STATE_KEY = 'OUTREACH_BATCH_STATE_JSON';
const OUTREACH_BATCH_TIME_BUDGET_MS = 4.5 * 60 * 1000;
const OUTREACH_BATCH_TRIGGER_HANDLER = 'resumeOutreachBatchTrigger_';
const OUTREACH_BATCH_RESUME_DELAY_MS = 60 * 1000;

const TAVILY_SEARCH_URL = 'https://api.tavily.com/search';
// gemini-2.0-flash was shut down by Google on 2026-06-01 (all requests to it
// now 404). gemini-3.7-flash is the current stable model for this endpoint —
// verified against Google's Gemini API docs. If Google retires this model in
// turn, this is the one constant that needs to change.
const GEMINI_MODEL = 'gemini-3.7-flash';
const GEMINI_GENERATE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent';

// ---------------------------------------------------------------------------
// Menu entry points
// ---------------------------------------------------------------------------

function menuPrepareSelectedProspect_() {
  prepareSelectedProspect_(true);
}

function menuPrepareEligibleProspects_() {
  prepareEligibleProspectsBatch_(true);
}

function menuResumeOutreachBatch_() {
  resumeOutreachBatch_(true);
}

function menuOutreachAutomationStatus_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  ui.alert('Outreach Automation Status', formatOutreachAutomationStatus_(ss), ui.ButtonSet.OK);
}

function menuConfigureApiStatus_() {
  const ui = SpreadsheetApp.getUi();
  ui.alert('Configure API Status', formatApiConfigStatus_(), ui.ButtonSet.OK);
}

// ---------------------------------------------------------------------------
// Configuration — keys read only from Script Properties, never persisted
// or displayed anywhere by this file.
// ---------------------------------------------------------------------------

function getOutreachAutomationConfig_() {
  const props = PropertiesService.getScriptProperties();
  return {
    tavilyKey: String(props.getProperty('TAVILY_API_KEY') || '').trim(),
    geminiKey: String(props.getProperty('GEMINI_API_KEY') || '').trim()
  };
}

function formatApiConfigStatus_() {
  const config = getOutreachAutomationConfig_();
  return 'Tavily: ' + (config.tavilyKey ? 'Configured' : 'Missing') +
    '\nGemini: ' + (config.geminiKey ? 'Configured' : 'Missing') +
    '\n\nKeys are read from Script Properties (Project Settings > Script Properties) and are never shown here or anywhere else.';
}

// ---------------------------------------------------------------------------
// Main workflow — exactly one selected Prospects row. Thin wrapper: resolves
// the selection, then delegates the actual pipeline to prepareOneProspectRow_
// (shared with the Sprint 13B batch below — see that function for the full
// research/audit/Gemini/save logic, which lives in exactly one place).
// ---------------------------------------------------------------------------

// interactive=true shows UI alerts/confirmations (menu use); interactive=false
// (available for future non-interactive callers/tests) suppresses alerts and
// treats any confirmation as declined-by-default for safety. Always returns
// a plain result object, useful for tests.
function prepareSelectedProspect_(interactive) {
  const ui = SpreadsheetApp.getUi();
  const rows = getSelectedProspectRows_(); // CRM_Actions.gs — also covers "wrong sheet" / "nothing selected"
  if (!rows) return { ok: false, message: 'No usable selection.' };

  if (rows.length !== 1) {
    const message = 'Select exactly one Prospects row to prepare outreach for (selected: ' + rows.length + ').';
    if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
    return { ok: false, message: message };
  }

  const config = getOutreachAutomationConfig_();
  const missingKeys = [];
  if (!config.tavilyKey) missingKeys.push('TAVILY_API_KEY');
  if (!config.geminiKey) missingKeys.push('GEMINI_API_KEY');
  if (missingKeys.length > 0) {
    const message = 'Outreach preparation needs ' + missingKeys.join(' and ') +
      ' set in Script Properties (Project Settings > Script Properties) first. No prospect data was changed.';
    if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
    return { ok: false, message: message };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const prospects = ss.getSheetByName('Prospects');
  const row = rows[0];

  ensureOutreachAutomationColumns_(prospects);
  const headers = getLiveProspectsHeaders_(prospects); // CRM_Outreach.gs
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });

  const result = prepareOneProspectRow_(prospects, headers, idx, row, config, { interactive: interactive, onAlreadyPrepared: 'ask' });
  if (result.ok && interactive) {
    ui.alert('Outreach Automation — Ready for Review', formatPreparationResult_(result), ui.ButtonSet.OK);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Sprint 13B/13C — batch: "Prepare Eligible Prospects" / "Resume Batch".
// Scans every Prospects row, filters to eligible ones (reusing the exact
// same outreachAutomationExclusionReason_ classifier the single-row path
// uses), caps the batch at OUTREACH_AUTOMATION_MAX_BATCH_SIZE, then runs
// each one through the SAME prepareOneProspectRow_ pipeline sequentially —
// never concurrently. An already-prepared prospect is skipped automatically
// (never overwritten without the explicit single-row confirmation), and one
// prospect's failure never stops the rest.
//
// Sprint 13C: a single execution may not have time to finish all of them
// (Apps Script's ~6-minute limit), so progress is persisted to Script
// Properties (OUTREACH_BATCH_STATE_KEY) after every row. If time runs out
// mid-batch, the current execution stops itself, schedules one idempotent
// resume trigger, and returns — the next execution (that trigger, or a
// manual "Resume Batch") picks up exactly where this one left off.
// ---------------------------------------------------------------------------

function prepareEligibleProspectsBatch_(interactive) {
  const ui = SpreadsheetApp.getUi();

  const existing = getOutreachBatchState_();
  if (existing && existing.active) {
    const message = 'A batch is already in progress (' + (existing.rows.length - existing.cursor) + ' of ' +
      existing.rows.length + ' remaining). It will continue automatically, or run Resume Batch now.';
    if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
    return { ok: false, message: message, alreadyActive: true };
  }

  const config = getOutreachAutomationConfig_();
  const missingKeys = [];
  if (!config.tavilyKey) missingKeys.push('TAVILY_API_KEY');
  if (!config.geminiKey) missingKeys.push('GEMINI_API_KEY');
  if (missingKeys.length > 0) {
    const message = 'Outreach preparation needs ' + missingKeys.join(' and ') +
      ' set in Script Properties (Project Settings > Script Properties) first. No prospect data was changed.';
    if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
    return { ok: false, message: message };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const prospects = ss.getSheetByName('Prospects');
  if (!prospects) {
    const message = 'Prospects sheet not found.';
    if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
    return { ok: false, message: message };
  }

  ensureOutreachAutomationColumns_(prospects);
  const headers = getLiveProspectsHeaders_(prospects); // CRM_Outreach.gs
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });

  const eligibleRows = [];
  let excludedCount = 0;
  const lastRow = prospects.getLastRow();
  if (lastRow >= 2) {
    const data = prospects.getRange(2, 1, lastRow - 1, headers.length).getValues();
    data.forEach(function (rowValues, i) {
      function field(name) { return idx[name] !== undefined ? rowValues[idx[name]] : ''; }
      const business = String(field('Business') || '').trim();
      const status = String(field('Status') || '').trim();
      const archivedDate = field('Archived Date');
      const website = String(field('Website') || '').trim();
      const reason = outreachAutomationExclusionReason_(business, status, archivedDate, website);
      if (reason) { excludedCount++; return; }
      eligibleRows.push(2 + i); // sheet row number
    });
  }

  const totalEligible = eligibleRows.length;
  const toProcess = eligibleRows.slice(0, OUTREACH_AUTOMATION_MAX_BATCH_SIZE);

  if (totalEligible === 0) {
    const message = 'No eligible prospects to prepare outreach for (excluded: ' + excludedCount + ').';
    if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
    return { ok: false, message: message, eligible: 0, excluded: excludedCount };
  }

  if (interactive) {
    const confirmMessage = 'Eligible prospects: ' + totalEligible +
      '\nMaximum batch size: ' + OUTREACH_AUTOMATION_MAX_BATCH_SIZE + ' (this run will process ' + toProcess.length + ')' +
      '\n\nResearch and messages will be prepared but NOT sent.\n\nContinue?';
    const confirmed = ui.alert('Outreach Automation — Prepare Eligible Prospects', confirmMessage, ui.ButtonSet.YES_NO) === ui.Button.YES;
    if (!confirmed) {
      return { ok: false, message: 'Batch preparation cancelled.', cancelled: true, eligible: totalEligible, excluded: excludedCount };
    }
  }

  saveOutreachBatchState_({
    active: true,
    rows: toProcess,
    cursor: 0,
    prepared: 0,
    skipped: 0,
    failed: 0,
    totalEligible: totalEligible,
    excluded: excludedCount,
    failures: [],
    startedAt: new Date().toISOString()
  });

  return runOutreachBatchChunk_(interactive);
}

// Manual continuation of an already-started batch — the fallback the batch
// always offers alongside its automatic resume trigger.
function resumeOutreachBatch_(interactive) {
  const ui = SpreadsheetApp.getUi();
  const state = getOutreachBatchState_();
  if (!state || !state.active) {
    const message = 'No batch is currently in progress.';
    if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
    return { ok: false, message: message };
  }
  return runOutreachBatchChunk_(interactive);
}

// The installable time-trigger's handler — same try/catch + Logger.log
// pattern CRM_Automation.gs's dailyMaintenanceTrigger_ already uses for
// safe unattended execution.
function resumeOutreachBatchTrigger_() {
  try {
    runOutreachBatchChunk_(false);
  } catch (e) {
    Logger.log('resumeOutreachBatchTrigger_ failed: ' + e.message);
  }
}

// Processes rows from the persisted batch state, starting at its cursor,
// one at a time, reusing prepareOneProspectRow_ unchanged — until either
// every row is done or OUTREACH_BATCH_TIME_BUDGET_MS elapses, whichever
// comes first. Progress is saved after every single row, so a mid-batch
// crash/timeout never loses more than the row in flight. LockService
// prevents a manual Resume Batch click and an auto-resume trigger (or two
// overlapping triggers) from both claiming the same chunk at once.
function runOutreachBatchChunk_(interactive) {
  const ui = SpreadsheetApp.getUi();
  const state = getOutreachBatchState_();
  if (!state || !state.active) {
    return { ok: false, message: 'No batch is currently in progress.' };
  }

  const lock = LockService.getScriptLock();
  const gotLock = lock.tryLock(5000);
  if (!gotLock) {
    const message = 'Another batch execution is already running — please wait for it to finish.';
    if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
    return { ok: false, message: message, locked: true };
  }

  try {
    const config = getOutreachAutomationConfig_();
    if (!config.tavilyKey || !config.geminiKey) {
      const message = 'Outreach preparation needs TAVILY_API_KEY and GEMINI_API_KEY set in Script Properties — batch paused, resume once they are set.';
      if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
      return { ok: false, message: message };
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const prospects = ss.getSheetByName('Prospects');
    const headers = getLiveProspectsHeaders_(prospects); // CRM_Outreach.gs
    const idx = {};
    headers.forEach(function (h, i) { idx[h] = i; });

    const startTime = Date.now();
    while (state.cursor < state.rows.length) {
      if (Date.now() - startTime > OUTREACH_BATCH_TIME_BUDGET_MS) break; // out of time this execution — resume later

      const row = state.rows[state.cursor];
      let result;
      try {
        result = prepareOneProspectRow_(prospects, headers, idx, row, config, { interactive: false, onAlreadyPrepared: 'skip' });
      } catch (e) {
        result = { ok: false, message: 'Unexpected error: ' + describeOutreachApiError_(e) };
      }

      if (result.ok) {
        state.prepared++;
      } else if (result.skipped) {
        state.skipped++;
      } else {
        state.failed++;
        state.failures.push((result.business || 'Row ' + row) + ': ' + result.message);
        if (state.failures.length > 10) state.failures = state.failures.slice(0, 10);
      }
      state.cursor++;
      saveOutreachBatchState_(state); // after EVERY row — never more than one row of progress at risk
    }

    const remaining = state.rows.length - state.cursor;
    const done = remaining === 0;
    if (done) {
      clearOutreachBatchState_(); // deletes state + any pending resume trigger
    } else {
      scheduleOutreachBatchResume_(); // idempotent — replaces any existing pending trigger, never duplicates
    }

    const summary = {
      totalEligible: state.totalEligible,
      prepared: state.prepared,
      skipped: state.skipped,
      failed: state.failed,
      excluded: state.excluded,
      remaining: remaining,
      anotherRunRequired: !done
    };
    if (interactive) {
      ui.alert(done ? 'Outreach Automation — Batch Complete' : 'Outreach Automation — Batch In Progress',
        formatBatchSummary_(summary, state.failures), ui.ButtonSet.OK);
    }
    return {
      ok: true,
      done: done,
      eligible: state.totalEligible,
      excluded: state.excluded,
      processed: state.cursor,
      prepared: state.prepared,
      skipped: state.skipped,
      failed: state.failed,
      remaining: remaining,
      anotherRunRequired: !done,
      failures: state.failures.slice()
    };
  } finally {
    lock.releaseLock();
  }
}

// ---------------------------------------------------------------------------
// Batch state — Script Properties only (OUTREACH_BATCH_STATE_KEY), never a
// CRM column: it's execution progress, not CRM data, and is deleted the
// moment the batch completes. Trigger management mirrors CRM_Automation.gs's
// MAINTENANCE_TRIGGER_HANDLER/removeMaintenanceTriggers_ pattern exactly —
// remove-then-create guarantees at most one pending resume trigger ever.
// ---------------------------------------------------------------------------

function getOutreachBatchState_() {
  const raw = PropertiesService.getScriptProperties().getProperty(OUTREACH_BATCH_STATE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null; // corrupt/unreadable state is treated as "no batch in progress", never crashes
  }
}

function saveOutreachBatchState_(state) {
  PropertiesService.getScriptProperties().setProperty(OUTREACH_BATCH_STATE_KEY, JSON.stringify(state));
}

function clearOutreachBatchState_() {
  PropertiesService.getScriptProperties().deleteProperty(OUTREACH_BATCH_STATE_KEY);
  removeOutreachBatchTriggers_();
}

function removeOutreachBatchTriggers_() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === OUTREACH_BATCH_TRIGGER_HANDLER) ScriptApp.deleteTrigger(t);
  });
}

function scheduleOutreachBatchResume_() {
  removeOutreachBatchTriggers_();
  ScriptApp.newTrigger(OUTREACH_BATCH_TRIGGER_HANDLER).timeBased().after(OUTREACH_BATCH_RESUME_DELAY_MS).create();
}

function formatBatchSummary_(summary, failures) {
  const lines = [
    'Eligible: ' + summary.totalEligible,
    'Prepared: ' + summary.prepared,
    'Skipped: ' + summary.skipped,
    'Failed: ' + summary.failed,
    'Excluded: ' + summary.excluded,
    'Remaining: ' + summary.remaining,
    ''
  ];
  lines.push(summary.anotherRunRequired
    ? 'This batch is not finished — ' + summary.remaining + ' prospect(s) remain. It will continue automatically in about a minute, or run Resume Batch now.'
    : 'Batch complete — nothing remaining.');
  lines.push('');
  lines.push('All prepared messages are saved as READY_FOR_REVIEW for human review — nothing was sent to any business.');
  if (failures.length > 0) {
    lines.push('');
    lines.push('Failures:');
    failures.slice(0, 10).forEach(function (f) { lines.push('- ' + f); });
    if (failures.length > 10) lines.push('...and ' + (failures.length - 10) + ' more.');
  }
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Eligibility — single source of truth, used by both the single-row path
// (for its specific rejection message) and the batch filter above (for
// counting exclusions). Never duplicated, never reimplemented differently
// in two places.
// ---------------------------------------------------------------------------

function isExcludedFromOutreachAutomation_(status, archivedDate) {
  const statusKey = String(status || '').trim().toLowerCase();
  return OUTREACH_AUTOMATION_EXCLUDED_STATUSES.indexOf(statusKey) !== -1 || String(archivedDate || '').trim() !== '';
}

// Returns null when eligible, or a short machine-readable reason code when
// not: 'blank_business' | 'excluded_status' | 'missing_website'.
function outreachAutomationExclusionReason_(business, status, archivedDate, website) {
  if (business === '') return 'blank_business';
  if (isExcludedFromOutreachAutomation_(status, archivedDate)) return 'excluded_status';
  if (website === '') return 'missing_website';
  return null;
}

// ---------------------------------------------------------------------------
// The actual preparation pipeline for ONE Prospects row — the single place
// Tavily research, the Website Audit reuse, Gemini analysis (with its
// retry logic), response validation, and eligibility are implemented. Called
// by both prepareSelectedProspect_ (one row, interactive, asks before
// overwriting) and prepareEligibleProspectsBatch_ (many rows, silent,
// automatically skips anything already prepared instead of asking).
//
// opts: { interactive: bool, onAlreadyPrepared: 'ask' | 'skip' }
//   'ask'  — prompts the same YES/NO confirmation the single-row flow always
//            has (interactive:false treats a suppressed prompt as declined).
//   'skip' — never prompts; an already-prepared prospect is always left
//            untouched and reported back as skipped (used by the batch, so
//            up to 10 prospects never means up to 10 modal dialogs).
// ---------------------------------------------------------------------------

function prepareOneProspectRow_(prospects, headers, idx, row, config, opts) {
  const ui = SpreadsheetApp.getUi();
  const interactive = !!opts.interactive;
  const rowValues = prospects.getRange(row, 1, 1, headers.length).getValues()[0];
  function field(name) { return idx[name] !== undefined ? rowValues[idx[name]] : ''; }

  const business = String(field('Business') || '').trim();
  const status = String(field('Status') || '').trim();
  const archivedDate = field('Archived Date');
  const website = String(field('Website') || '').trim();

  const reason = outreachAutomationExclusionReason_(business, status, archivedDate, website);
  if (reason === 'blank_business') {
    const message = 'The selected row has no Business name — nothing to prepare.';
    if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
    return { ok: false, message: message };
  }
  if (reason === 'excluded_status') {
    const message = business + ' is ' + (status || 'Archived') + ' — not eligible for outreach preparation.';
    if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
    return { ok: false, message: message, business: business };
  }
  if (reason === 'missing_website') {
    const message = business + ' has no Website on file — a Website is required to prepare outreach.';
    if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
    return { ok: false, message: message, business: business };
  }

  const existingBrief = String(field(OUTREACH_BRIEF_COLUMN) || '').trim(); // CRM_Outreach.gs — read-only, never overwritten by this file
  const existingResearch = String(field('Outreach Research') || '').trim();
  const existingMessage = String(field('Outreach Message') || '').trim();
  const existingStatus = String(field('Outreach Preparation Status') || '').trim();

  const alreadyReady = existingStatus === OUTREACH_AUTOMATION_STATES.READY;
  const hasPriorOutput = existingMessage !== '';
  if (alreadyReady || hasPriorOutput) {
    if (opts.onAlreadyPrepared === 'skip') {
      const message = business + ' already has a prepared outreach message — skipped (not overwritten automatically).';
      return { ok: false, message: message, skipped: true, business: business };
    }
    const question = business + ' already has a prepared outreach message' +
      (alreadyReady ? ' (READY_FOR_REVIEW)' : '') + '. Regenerate and overwrite it?';
    const confirmed = interactive ? (ui.alert('Outreach Automation', question, ui.ButtonSet.YES_NO) === ui.Button.YES) : false;
    if (!confirmed) {
      const message = 'Kept the existing prepared outreach for ' + business + ' — nothing was changed.';
      if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
      return { ok: false, message: message, skipped: true, business: business };
    }
  }

  function setField(name, value) {
    if (idx[name] === undefined) return;
    prospects.getRange(row, idx[name] + 1).setValue(value);
  }
  function setStatus(state) { setField('Outreach Preparation Status', state); }

  // Stage 1 — Tavily research. Reused if a prior run already gathered it
  // and the field is still blank never happened, but reuse is only safe
  // when we're re-running after a later-stage failure — a full regenerate
  // (confirmed above) always re-researches, since the whole point of
  // "regenerate" is a fresh pass.
  let researchText = existingResearch;
  const canReuseResearch = !hasPriorOutput && !alreadyReady && existingResearch !== '' && existingStatus === OUTREACH_AUTOMATION_STATES.FAILED;
  if (!canReuseResearch) {
    setStatus(OUTREACH_AUTOMATION_STATES.RESEARCHING);
    const research = callTavilySearch_(config.tavilyKey, business, website);
    if (!research.ok) {
      setStatus(OUTREACH_AUTOMATION_STATES.FAILED);
      const message = business + ': research step failed — ' + research.message;
      if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
      return { ok: false, message: message, stage: 'RESEARCHING', business: business };
    }
    researchText = formatResearchSummary_(research);
    setField('Outreach Research', researchText);
  }

  // Stage 2 — Website Audit: reuse Sprint 5's lookup; only run a fresh audit
  // (CRM_Audits.gs, unchanged) if none is found yet.
  setStatus(OUTREACH_AUTOMATION_STATES.AUDITING);
  const auditResult = getOrRunWebsiteAudit_(business, website);
  if (!auditResult.ok) {
    setStatus(OUTREACH_AUTOMATION_STATES.FAILED);
    const message = business + ': Website Audit step failed — ' + auditResult.message + ' Outreach cannot be marked ready without a successful audit.';
    if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
    return { ok: false, message: message, stage: 'AUDITING', business: business };
  }

  // Stage 3 — Gemini analysis of research + audit + CRM context.
  setStatus(OUTREACH_AUTOMATION_STATES.GENERATING);
  const industry = String(field('Industry') || '').trim();
  const city = String(field('City') || '').trim();
  const priority = String(field('Priority') || '').trim();
  const analysis = callGeminiAnalysis_(config.geminiKey, {
    business: business, website: website, industry: industry, city: city,
    priority: priority, status: status, existingBrief: existingBrief,
    research: researchText, audit: auditResult.audit
  });
  if (!analysis.ok) {
    setStatus(OUTREACH_AUTOMATION_STATES.FAILED);
    const message = business + ': analysis/message generation step failed — ' + analysis.message;
    if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
    return { ok: false, message: message, stage: 'GENERATING', business: business };
  }

  // Stage 4 — save + READY_FOR_REVIEW. Only these fields are written; every
  // other Prospects column (including the unrelated Sprint 5 Outreach Brief
  // and Sprint 7 scoring columns) is left exactly as it was.
  setField('Outreach Angle', analysis.outreachAngle);
  setField('Outreach Message', analysis.outreachMessage);
  setField('Outreach Prepared At', new Date());
  if (idx['Outreach Prepared At'] !== undefined) {
    prospects.getRange(row, idx['Outreach Prepared At'] + 1).setNumberFormat('yyyy-mm-dd hh:mm');
  }
  setStatus(OUTREACH_AUTOMATION_STATES.READY);

  return {
    ok: true,
    business: business,
    website: website,
    research: researchText,
    outreachAngle: analysis.outreachAngle,
    outreachMessage: analysis.outreachMessage,
    auditRanNew: auditResult.ranNew,
    status: OUTREACH_AUTOMATION_STATES.READY
  };
}

// ---------------------------------------------------------------------------
// Prospects column provisioning — additive only, same pattern as Sprint 5's
// ensureOutreachBriefColumn_ / Sprint 7's ensureScoreColumns_: reuse Code.gs's
// own ensureHeaders_ rather than touching CRM_Builder.gs's schema list.
// ---------------------------------------------------------------------------

function ensureOutreachAutomationColumns_(sheet) {
  ensureHeaders_(sheet, OUTREACH_AUTOMATION_FIELDS); // Code.gs
  const lastCol = sheet.getLastColumn();
  applyBasicFilter_(sheet, lastCol); // Code.gs
  autoResizeColumns_(sheet, lastCol); // Code.gs
}

// ---------------------------------------------------------------------------
// Website Audit reuse — never reimplements auditUrl_/scoring; only decides
// whether a fresh audit needs to run before reading it back.
// ---------------------------------------------------------------------------

function getOrRunWebsiteAudit_(business, website) {
  const found = findLatestAuditForBusiness_(business, website); // CRM_Outreach.gs — Sprint 5's two-argument fallback
  if (found) return { ok: true, audit: found, ranNew: false };

  const normalized = normalizeUrl_(website); // CRM_Audits.gs
  if (!normalized) {
    return { ok: false, message: 'The Website on file ("' + website + '") is not a usable URL.' };
  }

  const audit = performAndSaveAudit_(business, normalized); // CRM_Audits.gs — unchanged, runs + saves
  if (!audit.ok) {
    return { ok: false, message: audit.message };
  }

  const refetched = findLatestAuditForBusiness_(business, website);
  if (!refetched) {
    return { ok: false, message: 'Website Audit completed but the saved record could not be re-read.' };
  }
  return { ok: true, audit: refetched, ranNew: true };
}

// ---------------------------------------------------------------------------
// Tavily research (isolated provider call)
// ---------------------------------------------------------------------------

function callTavilySearch_(apiKey, business, website) {
  try {
    const query = business + ' ' + normalizeAuditUrlKey_(website); // CRM_Outreach.gs — bare host, no protocol noise
    const payload = {
      api_key: apiKey,
      query: query.trim(),
      search_depth: 'basic',
      max_results: 5,
      include_answer: true
    };
    const response = UrlFetchApp.fetch(TAVILY_SEARCH_URL, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    const code = response.getResponseCode();
    if (code === 401 || code === 403) return { ok: false, message: 'Tavily rejected the request — check TAVILY_API_KEY.' };
    if (code < 200 || code >= 300) return { ok: false, message: 'Tavily research failed (HTTP ' + code + ').' };

    const data = JSON.parse(response.getContentText());
    const results = (data.results || []).slice(0, 5).map(function (r) {
      return { title: String(r.title || '').trim(), url: String(r.url || '').trim(), content: String(r.content || '').trim().slice(0, 500) };
    });
    return { ok: true, answer: String(data.answer || '').trim(), results: results };
  } catch (e) {
    return { ok: false, message: 'Tavily research error: ' + describeOutreachApiError_(e) };
  }
}

function formatResearchSummary_(research) {
  const lines = [];
  if (research.answer) lines.push(research.answer);
  research.results.forEach(function (r) {
    if (!r.title && !r.content) return;
    lines.push('- ' + (r.title || r.url) + (r.content ? ': ' + r.content : ''));
  });
  return lines.length > 0 ? lines.join('\n') : 'No research results were returned.';
}

// Retry policy for transient Gemini failures only (503/429/408/500/504 —
// Google's documented "temporary, back off and retry" codes). 400/401/403/404
// are permanent request problems (bad request, bad key, model not found) and
// are never retried — the first response decides those immediately.
const GEMINI_MAX_ATTEMPTS = 3;
const GEMINI_RETRYABLE_CODES = [429, 500, 503, 504, 408];
const GEMINI_RETRY_BASE_DELAY_MS = 500; // attempt 1->2 wait ~500-1000ms, 2->3 wait ~1000-1500ms

// ---------------------------------------------------------------------------
// Gemini analysis (isolated provider call) — combines research + audit +
// CRM context into JSON so results can be parsed deterministically; the
// prompt explicitly forbids inventing anything not present in the inputs.
// ---------------------------------------------------------------------------

function callGeminiAnalysis_(apiKey, context) {
  try {
    const prompt = buildGeminiPrompt_(context);
    const payload = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.4 }
    };

    const fetched = fetchGeminiWithRetries_(payload, apiKey);
    if (!fetched.ok) return fetched;

    const data = JSON.parse(fetched.contentText);
    const candidates = data.candidates || [];
    const textPart = candidates.length > 0 && candidates[0].content && candidates[0].content.parts && candidates[0].content.parts[0]
      ? candidates[0].content.parts[0].text
      : '';
    if (!textPart) return { ok: false, message: 'Gemini returned no content.' };

    let parsed;
    try {
      parsed = JSON.parse(textPart);
    } catch (parseErr) {
      return { ok: false, message: 'Gemini response was not valid JSON — could not safely use it.' };
    }

    const researchSummary = String(parsed.researchSummary || '').trim();
    const outreachAngle = String(parsed.outreachAngle || '').trim();
    const outreachMessage = String(parsed.outreachMessage || '').trim();
    if (!outreachAngle || !outreachMessage) {
      return { ok: false, message: 'Gemini response was missing required fields.' };
    }

    return { ok: true, researchSummary: researchSummary, outreachAngle: outreachAngle, outreachMessage: outreachMessage };
  } catch (e) {
    return { ok: false, message: 'Gemini analysis error: ' + describeOutreachApiError_(e) };
  }
}

// Up to GEMINI_MAX_ATTEMPTS total requests. A retryable HTTP code (503/429/
// 408/500/504) waits an increasing, jittered delay and tries again; any
// other non-2xx code (including 400/401/403/404) returns immediately on the
// first response — never retried. Returns either { ok:true, contentText } on
// a 2xx response, or a well-formed { ok:false, message } failure result.
function fetchGeminiWithRetries_(payload, apiKey) {
  let lastCode = null;
  for (let attempt = 1; attempt <= GEMINI_MAX_ATTEMPTS; attempt++) {
    const response = UrlFetchApp.fetch(GEMINI_GENERATE_URL, {
      method: 'post',
      contentType: 'application/json',
      headers: { 'x-goog-api-key': apiKey }, // header, not query string — never lands in a URL that could be logged
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    const code = response.getResponseCode();
    if (code >= 200 && code < 300) return { ok: true, contentText: response.getContentText() };

    lastCode = code;
    if (code === 401 || code === 403) return { ok: false, message: 'Gemini rejected the request — check GEMINI_API_KEY.' };
    if (code === 404) return { ok: false, message: 'Gemini analysis failed (HTTP 404) — the model "' + GEMINI_MODEL + '" was not found. It may have been retired; check Google\'s current Gemini API model list and update GEMINI_MODEL in CRM_OutreachAutomation.gs.' };

    const retryable = GEMINI_RETRYABLE_CODES.indexOf(code) !== -1;
    if (!retryable) return { ok: false, message: 'Gemini analysis failed (HTTP ' + code + ').' };

    if (attempt === GEMINI_MAX_ATTEMPTS) {
      return { ok: false, message: 'Gemini temporarily unavailable after ' + GEMINI_MAX_ATTEMPTS + ' attempts (HTTP ' + code + '). Please try again later.' };
    }
    Utilities.sleep(geminiRetryDelayMs_(attempt));
  }
  return { ok: false, message: 'Gemini analysis failed (HTTP ' + lastCode + ').' };
}

// Exponential backoff with jitter: attempt 1's wait is base*2^0 plus up to
// one base unit of jitter, attempt 2's is base*2^1 plus jitter, etc. — never
// the same delay twice in a row, and never unbounded (only ever called up to
// GEMINI_MAX_ATTEMPTS-1 times per call, from the loop above).
function geminiRetryDelayMs_(attempt) {
  const backoff = GEMINI_RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
  const jitter = Math.floor(Math.random() * GEMINI_RETRY_BASE_DELAY_MS);
  return backoff + jitter;
}

function buildGeminiPrompt_(context) {
  const audit = context.audit;
  const lines = [
    'You are helping a web design agency (Roman Creative Studio) prepare a personalized, factual outreach message to a prospective client.',
    'Use ONLY the facts given below. Do not invent, assume, or fabricate any statistic, metric, service, client, result, or claim that is not explicitly present in the data below. If there is not enough information for a strong angle, say so plainly rather than inventing detail.',
    '',
    'BUSINESS: ' + context.business,
    'WEBSITE: ' + context.website,
    'INDUSTRY: ' + (context.industry || '(not on file)'),
    'CITY: ' + (context.city || '(not on file)'),
    'PRIORITY: ' + (context.priority || '(not on file)'),
    'CRM STATUS: ' + (context.status || '(not on file)'),
    '',
    'WEBSITE AUDIT (already measured, not to be re-derived):',
    'Overall Score: ' + audit.score + '/100',
    'Mobile: ' + audit.mobile,
    'SEO: ' + audit.seo,
    'Performance: ' + audit.performance,
    'Accessibility: ' + audit.accessibility,
    'Audit Notes: ' + audit.notes,
    '',
    'RESEARCH (from web search, already gathered):',
    context.research || '(no research results)',
    ''
  ];
  if (context.existingBrief) {
    lines.push('EXISTING DETERMINISTIC OUTREACH BRIEF (for reference only, do not just repeat it verbatim):');
    lines.push(context.existingBrief);
    lines.push('');
  }
  lines.push('Respond with ONLY a JSON object with exactly these three string fields, no other text:');
  lines.push('{"researchSummary": "2-4 sentence summary of what the research above says about this business", ' +
    '"outreachAngle": "1-2 sentence description of the single most relevant, factual reason to reach out now", ' +
    '"outreachMessage": "a short, personalized outreach message (under 150 words) a salesperson could send as-is — it must NOT be sent automatically by anything, it is for human review only"}');
  return lines.join('\n');
}

function describeOutreachApiError_(e) {
  // Deliberately generic: never echoes request/response bodies or headers,
  // which is where an API key could otherwise leak into a returned string.
  const msg = String((e && e.message) || e);
  if (/timeout/i.test(msg)) return 'the request timed out.';
  if (/dns|address|resolve|unknown host/i.test(msg)) return 'could not resolve the API host.';
  if (/ssl|certificate/i.test(msg)) return 'SSL/certificate error while connecting.';
  if (/refused|unreachable|connect/i.test(msg)) return 'connection failed.';
  return 'a network error occurred.';
}

// ---------------------------------------------------------------------------
// Results UI
// ---------------------------------------------------------------------------

function formatPreparationResult_(r) {
  return 'Business: ' + r.business +
    '\nWebsite: ' + r.website +
    (r.auditRanNew ? '\n(A new Website Audit was run as part of this preparation.)' : '') +
    '\n\nRESEARCH SUMMARY\n' + truncateForDialog_(r.research, 600) +
    '\n\nOUTREACH ANGLE\n' + r.outreachAngle +
    '\n\nOUTREACH MESSAGE (draft — for review only)\n' + r.outreachMessage +
    '\n\nStatus: READY_FOR_REVIEW — NOT SENT. This message has been saved to Prospects for human review only; nothing has been sent to ' + r.business + ' or anyone else.';
}

function truncateForDialog_(text, maxChars) {
  const s = String(text || '');
  return s.length > maxChars ? s.slice(0, maxChars) + '…' : s;
}

// Reads Outreach Preparation Status across every Prospects row (dynamic
// header lookup, no fixed column index) and reports counts per state plus
// current API configuration — a broader operational view than "Configure
// API Status", which reports only the two key states.
function formatOutreachAutomationStatus_(ss) {
  const config = getOutreachAutomationConfig_();
  const lines = [
    'Tavily: ' + (config.tavilyKey ? 'Configured' : 'Missing'),
    'Gemini: ' + (config.geminiKey ? 'Configured' : 'Missing'),
    ''
  ];

  const batchState = getOutreachBatchState_();
  if (batchState && batchState.active) {
    lines.push('Batch in progress: ' + (batchState.rows.length - batchState.cursor) + ' of ' + batchState.rows.length + ' remaining (Prepared ' +
      batchState.prepared + ' / Skipped ' + batchState.skipped + ' / Failed ' + batchState.failed + ' so far).');
    lines.push('');
  }

  const prospects = ss.getSheetByName('Prospects');
  const lastRow = prospects ? prospects.getLastRow() : 0;
  if (!prospects || lastRow < 2) {
    lines.push('No prospects on file yet.');
    return lines.join('\n');
  }

  const headers = getLiveProspectsHeaders_(prospects); // CRM_Outreach.gs
  const statusIdx = headers.indexOf('Outreach Preparation Status');
  if (statusIdx === -1) {
    lines.push('No prospect has had outreach preparation run yet.');
    return lines.join('\n');
  }

  const bIdx = headers.indexOf('Business');
  const data = prospects.getRange(2, 1, lastRow - 1, headers.length).getValues();
  const counts = {};
  Object.keys(OUTREACH_AUTOMATION_STATES).forEach(function (k) { counts[OUTREACH_AUTOMATION_STATES[k]] = 0; });
  let notStarted = 0;

  data.forEach(function (row) {
    const business = bIdx !== -1 ? String(row[bIdx] || '').trim() : '';
    if (business === '') return;
    const state = String(row[statusIdx] || '').trim();
    if (state === '' || counts[state] === undefined) { notStarted++; return; }
    counts[state]++;
  });

  lines.push('Ready for Review: ' + counts[OUTREACH_AUTOMATION_STATES.READY]);
  lines.push('Failed: ' + counts[OUTREACH_AUTOMATION_STATES.FAILED]);
  lines.push('In progress (Researching/Auditing/Generating): ' +
    (counts[OUTREACH_AUTOMATION_STATES.RESEARCHING] + counts[OUTREACH_AUTOMATION_STATES.AUDITING] + counts[OUTREACH_AUTOMATION_STATES.GENERATING]));
  lines.push('Not yet prepared: ' + notStarted);
  return lines.join('\n');
}
