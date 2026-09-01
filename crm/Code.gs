/**
 * RCS CRM — Sprint 1 Core + Sprint 2 Prospect Workflow + Sprint 3 GitHub
 * Sync + Sprint 4 Website Audit + Sprint 5 Outreach Intelligence + Sprint 6
 * Outreach Execution + Follow-Up + Sprint 7 Lead Scoring + Prioritization +
 * Sprint 8 Daily Sales Command Center + Sprint 9 Pipeline Intelligence &
 * Analytics + Sprint 10 CRM Data Quality & Health Audit + Sprint 11
 * Automation & Daily Maintenance + Sprint 12 Next-Action Engine + Sprint 13
 * Automated Outreach Preparation Engine (+ Sprint 13B batch preparation,
 * Sprint 13C resumable batch execution)
 * ---------------------------------------------------------------------------
 * Builds/updates the Roman Creative Studio CRM inside the Google Sheet this
 * script is bound to. Container-bound script only — no Web App, API
 * executable, Add-on, or Library deployment required or used anywhere here.
 *
 * File layout:
 *   Code.gs               - menu, buildRCSCRM() orchestrator, shared sheet/format helpers
 *   CRM_Builder.gs        - the 11-sheet schema (names, headers, validation map)
 *   CRM_Settings.gs       - Settings dropdown lists + validation application
 *   CRM_Dashboard.gs      - the formula-driven Dashboard sheet
 *   CRM_Import.gs         - "Import Prospects..." CSV dialog + import logic
 *   CRM_Actions.gs        - Move to Outreach / Convert to Client / Archive Lead;
 *                           initializeProspectRow_ / Repair Prospects — the
 *                           canonical Prospect initialization every creation
 *                           path (import, sync, manual entry) calls
 *   CRM_Sync.gs           - "Sync Prospects" + Auto Sync (GitHub -> Prospects)
 *   CRM_Audits.gs         - Website Audit: fetch + score a site, log to Website Audits
 *   CRM_Outreach.gs       - Outreach Brief: turns a Website Audits record into a
 *                           deterministic, template-based sales brief on Prospects
 *   CRM_OutreachWorkflow.gs - Mark as Contacted / Schedule Follow-Up / Generate
 *                           Follow-Up Message, built on top of the Outreach Brief
 *   CRM_Scoring.gs        - RCS Lead Priority Score: deterministic 0-100 score +
 *                           tier + reasons from existing Prospects/Website Audits data
 *   CRM_CommandCenter.gs  - Daily Revenue Command Center: read-only ranked daily
 *                           action queue (prospects/follow-ups/meetings/proposals/
 *                           outstanding payments) + $10K Tracker/Funnel/Revenue Math,
 *                           built from existing Prospects/Meetings/Proposals/Revenue
 *                           data and CRM_Analytics.gs's funnel/value engine
 *   CRM_Analytics.gs      - Pipeline Intelligence: read-only funnel/value/aging/risk/
 *                           industry analytics built from existing CRM data only
 *   CRM_Health.gs         - CRM Health Audit: read-only completeness/duplicate/
 *                           consistency/integrity/staleness checks + a 0-100 CRM Health Score
 *   CRM_Automation.gs     - Daily CRM Maintenance report, Automation Status, and an
 *                           optional installable daily trigger — reporting only, no
 *                           automatic edits, reuses CRM_Health.gs/CRM_Analytics.gs
 *   CRM_NextAction.gs     - Next-Action Engine: read-only, ranked "what should I act
 *                           on next?" report across Prospects/Meetings/Proposals/
 *                           Clients, reusing Sprint 7's Lead Score as-is
 *   CRM_OutreachAutomation.gs - Prepares (never sends) a personalized outreach
 *                           message for one selected prospect, or in a
 *                           sequential batch across every eligible prospect:
 *                           Tavily research + the existing Website Audit +
 *                           Gemini analysis, saved to Prospects as
 *                           READY_FOR_REVIEW
 *
 * Safe to run repeatedly: sheets, headers, and Settings values are only
 * ever added when missing — existing row data is never overwritten or
 * cleared. Dashboard is the one exception: every cell on it is a formula
 * derived from the other sheets, so it's redrawn fresh each run (see
 * buildDashboard_ in CRM_Dashboard.gs) — nothing on it is a manually
 * entered record, so there's nothing to lose by redrawing it.
 *
 * Install / run: see crm/README.md.
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('RCS CRM')
    .addItem('Build / Update CRM', 'buildRCSCRM')
    .addItem('Daily Revenue Command Center', 'openDailyCommandCenter_')
    .addItem('Import Prospects...', 'showImportDialog_')
    .addItem('Sync Prospects', 'menuSyncProspects_')
    .addItem('Repair Prospects', 'menuRepairProspects_')
    .addItem('Sync Follow Ups', 'menuSyncFollowUps_')
    .addSubMenu(ui.createMenu('Auto Sync')
      .addItem('Enable Auto Sync', 'enableAutoSync_')
      .addItem('Disable Auto Sync', 'disableAutoSync_'))
    .addSubMenu(ui.createMenu('Website Audit')
      .addItem('Audit Selected Prospect', 'menuAuditSelectedProspect_')
      .addItem('Audit Website URL', 'menuAuditWebsiteUrl_')
      .addItem('Record Manual Audit', 'menuRecordManualAudit_'))
    .addSubMenu(ui.createMenu('Outreach Tools')
      .addItem('Generate Outreach Brief', 'menuGenerateOutreachBrief_')
      .addItem('Generate Brief for Selected Prospect', 'menuGenerateOutreachBrief_')
      .addItem('Mark as Contacted', 'menuMarkAsContacted_')
      .addItem('Schedule Follow-Up', 'menuScheduleFollowUp_')
      .addItem('Generate Follow-Up Message', 'menuGenerateFollowUpMessage_'))
    .addSubMenu(ui.createMenu('Lead Intelligence')
      .addItem('Score Selected Prospect(s)', 'menuScoreSelectedProspects_')
      .addItem('Score All Prospects', 'menuScoreAllProspects_')
      .addItem('Show Top Leads', 'menuShowTopLeads_'))
    .addItem('Pipeline Intelligence', 'openPipelineIntelligence_')
    .addItem('CRM Health', 'openCrmHealthAudit_')
    .addItem('Next Actions', 'openNextActions_')
    .addSubMenu(ui.createMenu('Automation')
      .addItem('Run CRM Maintenance', 'menuRunCrmMaintenance_')
      .addItem('Automation Status', 'menuAutomationStatus_')
      .addItem('Enable Daily Maintenance', 'enableDailyMaintenance_')
      .addItem('Disable Daily Maintenance', 'disableDailyMaintenance_'))
    .addSubMenu(ui.createMenu('Outreach Automation')
      .addItem('Prepare Selected Prospect', 'menuPrepareSelectedProspect_')
      .addItem('Prepare Eligible Prospects', 'menuPrepareEligibleProspects_')
      .addItem('Resume Batch', 'menuResumeOutreachBatch_')
      .addItem('Outreach Automation Status', 'menuOutreachAutomationStatus_')
      .addItem('Configure API Status', 'menuConfigureApiStatus_'))
    .addSeparator()
    .addItem('Move to Outreach', 'menuMoveToOutreach_')
    .addItem('Convert to Client', 'menuConvertToClient_')
    .addItem('Archive Lead', 'menuArchiveLead_')
    .addToUi();
}

// Simple trigger (no installation needed, same as onOpen) — the manual-entry
// counterpart to CSV import/Auto Sync both funneling through
// initializeProspectRow_ (CRM_Actions.gs). Reacts only to a Business name
// being typed directly into a Prospects row whose Status is still blank;
// every other edit (including the Status/Score cells this itself writes)
// is ignored on the column check below, so there is no re-trigger loop.
// Simple triggers can't call services like UrlFetchApp, but
// initializeProspectRow_ only ever reads/writes this spreadsheet's own
// cells (its scoring step reads Website Audits, never fetches anything),
// so it's fully compatible.
function onEdit(e) {
  try {
    if (!e || !e.range) return;
    const sheet = e.range.getSheet();
    if (sheet.getName() !== 'Prospects') return;
    if (e.range.getNumRows() !== 1 || e.range.getNumColumns() !== 1) return; // single-cell edits only
    if (e.range.getRow() < 2) return; // header row

    const headers = typeof getLiveProspectsHeaders_ === 'function' ? getLiveProspectsHeaders_(sheet) : getHeaders_('Prospects');
    const businessCol = headers.indexOf('Business') + 1;
    if (businessCol === 0 || e.range.getColumn() !== businessCol) return;

    if (typeof initializeProspectRow_ === 'function') initializeProspectRow_(sheet, headers, e.range.getRow());
  } catch (err) {
    Logger.log('onEdit failed: ' + err.message);
  }
}

function buildRCSCRM() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  maybeRepurposeDefaultSheet_(ss);

  SHEET_DEFS.forEach(function (def) {
    const sheet = getOrCreateSheet_(ss, def.name);

    if (def.name === 'Dashboard') {
      buildDashboard_(sheet);
      return;
    }

    if (def.name === 'Settings') {
      buildSettingsSheet_(sheet);
      formatDataSheet_(sheet, Object.keys(SETTINGS_LISTS).length);
      // GitHub Sync panel (CRM_Sync.gs) — columns H:I, outside the
      // dropdown-list columns. Guarded so Code.gs still builds a working
      // CRM even if CRM_Sync.gs hasn't been added to the project yet.
      if (typeof ensureSyncStatusBlock_ === 'function') ensureSyncStatusBlock_(sheet);
      // Automation panel (CRM_Automation.gs) — columns K:L, separate from
      // the GitHub Sync panel above. Same guard for the same reason.
      if (typeof ensureAutomationStatusBlock_ === 'function') ensureAutomationStatusBlock_(sheet);
      return;
    }

    ensureHeaders_(sheet, def.headers);
    formatDataSheet_(sheet, def.headers.length);
  });

  // Validations depend on Settings already existing/populated, so this
  // runs after every sheet above has been created.
  const settingsSheet = ss.getSheetByName('Settings');
  SHEET_DEFS.forEach(function (def) {
    if (!def.validations || Object.keys(def.validations).length === 0) return;
    const sheet = ss.getSheetByName(def.name);
    applyValidations_(sheet, def.headers, def.validations, settingsSheet);
  });

  SpreadsheetApp.flush();
  notify_('RCS CRM is up to date: ' + SHEET_DEFS.length + ' sheets checked.');
}

// ---------------------------------------------------------------------------
// Sheet lifecycle
// ---------------------------------------------------------------------------

function getOrCreateSheet_(ss, name) {
  const existing = ss.getSheetByName(name);
  if (existing) return existing;
  return ss.insertSheet(name);
}

// If the spreadsheet is the untouched default blank sheet (just "Sheet1"
// with nothing in it), rename it to "Dashboard" instead of leaving an
// orphan empty tab alongside the 11 CRM sheets.
function maybeRepurposeDefaultSheet_(ss) {
  const sheets = ss.getSheets();
  if (sheets.length !== 1) return;

  const only = sheets[0];
  const looksDefault = /^Sheet ?1$/i.test(only.getName());
  const isEmpty = only.getLastRow() === 0 && only.getLastColumn() === 0;

  if (looksDefault && isEmpty && !ss.getSheetByName('Dashboard')) {
    only.setName('Dashboard');
  }
}

// Writes the full header row on a brand-new sheet. On a sheet that already
// has headers, it only appends whichever headers from the target list are
// missing — added to the end, after whatever is already there. That's what
// lets a schema addition reach an already-built sheet without disturbing
// any existing column's position, name, or data (requirement: "Add missing
// columns only at the end").
function ensureHeaders_(sheet, headers) {
  if (headers.length === 0) return;

  const scanWidth = Math.max(headers.length, sheet.getLastColumn());
  const currentRow = scanWidth > 0 ? sheet.getRange(1, 1, 1, scanWidth).getValues()[0] : [];
  const existingHeaders = currentRow
    .map(function (h) { return String(h).trim(); })
    .filter(function (h) { return h !== ''; });

  if (existingHeaders.length === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return;
  }

  const existingSet = {};
  existingHeaders.forEach(function (h) { existingSet[h.toLowerCase()] = true; });

  const missing = headers.filter(function (h) { return !existingSet[h.toLowerCase()]; });
  if (missing.length === 0) return;

  const startCol = existingHeaders.length + 1;
  sheet.getRange(1, startCol, 1, missing.length).setValues([missing]);
}

// ---------------------------------------------------------------------------
// Formatting (idempotent — safe to re-run, never touches cell values below
// the header row, never clears a data sheet)
// ---------------------------------------------------------------------------

function formatDataSheet_(sheet, numCols) {
  if (numCols === 0) return;

  freezeHeaderRow_(sheet);
  styleHeaderRow_(sheet, numCols);
  applyAlternatingBanding_(sheet, numCols);
  applyBasicFilter_(sheet, numCols);
  autoResizeColumns_(sheet, numCols);
}

function freezeHeaderRow_(sheet) {
  sheet.setFrozenRows(1);
}

function styleHeaderRow_(sheet, numCols) {
  sheet.getRange(1, 1, 1, numCols)
    .setBackground(HEADER_BG)
    .setFontColor(HEADER_FG)
    .setFontWeight('bold')
    .setVerticalAlignment('middle');
}

function applyAlternatingBanding_(sheet, numCols) {
  // Remove any existing banding first — Sheets throws if a new banding
  // range overlaps one that's already there, so this keeps re-runs clean.
  // Bandings are a formatting object, not cell data — removing/reapplying
  // never touches a single value.
  sheet.getBandings().forEach(function (banding) { banding.remove(); });

  const rowCount = Math.max(sheet.getMaxRows() - 1, BANDING_FUTURE_ROWS);
  const range = sheet.getRange(2, 1, rowCount, numCols);
  range.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);
}

function applyBasicFilter_(sheet, numCols) {
  const existing = sheet.getFilter();
  if (existing) existing.remove();

  const lastRow = Math.max(sheet.getLastRow(), 1);
  sheet.getRange(1, 1, lastRow, numCols).createFilter();
}

function autoResizeColumns_(sheet, numCols) {
  sheet.autoResizeColumns(1, numCols);
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function notify_(message) {
  try {
    SpreadsheetApp.getUi().alert(message);
  } catch (e) {
    // getUi() throws if run from a context with no UI (e.g. a trigger) —
    // fall back to the execution log instead of failing the run.
    Logger.log(message);
  }
}
