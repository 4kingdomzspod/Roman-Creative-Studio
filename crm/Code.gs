/**
 * RCS CRM — Sprint 1 Core + Sprint 2 Prospect Workflow
 * ---------------------------------------------------------------------------
 * Builds/updates the Roman Creative Studio CRM inside the Google Sheet this
 * script is bound to. Container-bound script only — no Web App, API
 * executable, Add-on, or Library deployment required or used anywhere here.
 *
 * File layout:
 *   Code.gs           - menu, buildRCSCRM() orchestrator, shared sheet/format helpers
 *   CRM_Builder.gs    - the 11-sheet schema (names, headers, validation map)
 *   CRM_Settings.gs   - Settings dropdown lists + validation application
 *   CRM_Dashboard.gs  - the formula-driven Dashboard sheet
 *   CRM_Import.gs     - "Import Prospects..." CSV dialog + import logic
 *   CRM_Actions.gs    - Move to Outreach / Convert to Client / Archive Lead
 *
 * Safe to run repeatedly: sheets, headers, and Settings values are only
 * ever added when missing — existing row data is never overwritten or
 * cleared. Dashboard is the one exception: every cell on it is a formula
 * derived from the other sheets, so it's redrawn fresh each run (see
 * buildDashboard_ in CRM_Dashboard.gs) — nothing on it is a manually
 * entered record, so there's nothing to lose by redrawing it.
 *
 * Install / run: see crm/README.md.
 *
 * Sprint 3 (not built yet): GitHub Sync, Auto Sync, and Website Audit. This
 * file layout leaves a clean seam for that — a new CRM_Sync.gs can reuse
 * getOrCreateSheet_, ensureHeaders_, SHEET_DEFS, and importProspectsFromCsv_
 * (CRM_Import.gs) without any changes to the files that exist today.
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('RCS CRM')
    .addItem('Build / Update CRM', 'buildRCSCRM')
    .addItem('Import Prospects...', 'showImportDialog_')
    .addSeparator()
    .addItem('Move to Outreach', 'menuMoveToOutreach_')
    .addItem('Convert to Client', 'menuConvertToClient_')
    .addItem('Archive Lead', 'menuArchiveLead_')
    .addToUi();
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
