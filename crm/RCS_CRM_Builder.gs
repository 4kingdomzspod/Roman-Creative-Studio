/**
 * RCS CRM Builder v1 (+ Dashboard v1)
 * ---------------------------------------------------------------------------
 * Builds/updates the Roman Creative Studio CRM inside the Google Sheet this
 * script is bound to. Safe to run repeatedly: sheets, headers, and Settings
 * lists only ever get filled in when missing — existing row data is never
 * overwritten. The Dashboard sheet is the one exception: every cell on it is
 * a live formula derived from the other sheets, so it's fully redrawn on
 * every run (see buildDashboard_ for why that's still safe/idempotent).
 *
 * Install: see crm/README.md in the repo for step-by-step setup.
 * Run:     open the sheet, use the "RCS CRM" menu > "Build / Update CRM",
 *          or run buildRCSCRM() directly from the Apps Script editor.
 */

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

// Dropdown lists stored on the Settings sheet, one per column.
// Values are grounded in the existing outreach docs (OUTREACH_PLAYBOOK.md
// status cadence, prospects.csv priority levels, the Sprint 3 industry list,
// and process.html's build phases) rather than invented from scratch.
const SETTINGS_LISTS = {
  'Lead Status': [
    'New', 'Contacted', 'Follow-up 1 Sent', 'Follow-up 2 Sent', 'No Response',
    'Call Booked', 'Proposal Pending', 'Proposal Sent', 'Won',
    'Closed — Lost', 'Nurture', 'Closed — Not Interested', 'Do Not Contact'
  ],
  'Priority': ['High', 'Medium', 'Low'],
  'Industry': [
    'Contractors', 'Dentists', 'Churches', 'Landscaping', 'HVAC', 'Roofing',
    'Electricians', 'Plumbing', 'Auto Detailing', 'Luxury Rentals'
  ],
  'Outreach Method': [
    'Email', 'Instagram DM', 'Facebook DM', 'Phone Call', 'In-Person', 'Referral'
  ],
  'Proposal Status': ['Draft', 'Sent', 'Under Review', 'Accepted', 'Declined', 'Expired'],
  'Project Status': [
    'Discovery', 'Strategy', 'Design', 'Development', 'Launch',
    'Active', 'Paused', 'Completed'
  ]
};

// CSV header aliases for the "Import Prospects" feature — maps a source
// column name to the Prospects header it should land in. Grounded in the
// actual column names used by outreach/prospects.csv (the realistic import
// source for this CRM) rather than guessed. Any CSV header that matches a
// Prospects header exactly (case-insensitive) is mapped automatically and
// doesn't need an alias here.
const IMPORT_HEADER_ALIASES = {
  'Business Name': 'Business',
  'Owner/Contact': 'Contact',
  'Website Quality (1-10)': 'Website Score'
};

// Column header -> Settings list name, per sheet. Only columns listed here
// get a validation dropdown; everything else stays free text.
const SHEET_DEFS = [
  {
    name: 'Dashboard',
    headers: [], // fully formula-driven — see buildDashboard_()
    validations: {}
  },
  {
    name: 'Prospects',
    headers: ['Business', 'Industry', 'City', 'Website', 'Phone', 'Email', 'Contact',
      'Priority', 'Status', 'Website Score', 'Last Contact', 'Next Follow Up', 'Notes'],
    validations: { 'Industry': 'Industry', 'Priority': 'Priority', 'Status': 'Lead Status' }
  },
  {
    name: 'Outreach Pipeline',
    headers: ['Business', 'Stage', 'Contacted', 'Method', 'Response', 'Next Action', 'Owner', 'Notes'],
    validations: { 'Stage': 'Lead Status', 'Method': 'Outreach Method' }
  },
  {
    name: 'Follow Ups',
    headers: ['Business', 'Due', 'Priority', 'Status', 'Reminder', 'Notes'],
    validations: { 'Priority': 'Priority', 'Status': 'Lead Status' }
  },
  {
    name: 'Meetings',
    headers: ['Business', 'Contact', 'Date', 'Type', 'Outcome', 'Proposal', 'Notes'],
    validations: {}
  },
  {
    name: 'Proposals',
    headers: ['Business', 'Package', 'Value', 'Sent', 'Status', 'Decision', 'Notes'],
    validations: { 'Status': 'Proposal Status' }
  },
  {
    name: 'Clients',
    headers: ['Business', 'Package', 'Start', 'Monthly', 'Status', 'Website', 'Notes'],
    validations: { 'Status': 'Project Status' }
  },
  {
    name: 'Revenue',
    headers: ['Month', 'Client', 'Invoice', 'Amount', 'Paid', 'Payment Date'],
    validations: {}
  },
  {
    name: 'Website Audits',
    headers: ['Business', 'Date', 'Mobile', 'SEO', 'Performance', 'Accessibility', 'Score', 'Notes'],
    validations: {}
  },
  {
    name: 'Referral Network',
    headers: ['Name', 'Company', 'Relationship', 'Industry', 'Last Contact', 'Referrals', 'Notes'],
    validations: { 'Industry': 'Industry' }
  },
  {
    name: 'Settings',
    headers: Object.keys(SETTINGS_LISTS), // one list per column
    validations: {}
  }
];

const HEADER_BG = '#1a1a2e';   // dark header background
const HEADER_FG = '#ffffff';  // white bold header text
const BANDING_FUTURE_ROWS = 300; // pre-band this many data rows so new rows stay styled

// ---------------------------------------------------------------------------
// Entry points
// ---------------------------------------------------------------------------

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('RCS CRM')
    .addItem('Build / Update CRM', 'buildRCSCRM')
    .addItem('Import Prospects...', 'showImportDialog_')
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

  // Validations depend on the Settings sheet already existing/populated,
  // so this runs after every sheet above has been created.
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

function ensureHeaders_(sheet, headers) {
  if (headers.length === 0) return;

  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const isBlank = firstRow.every(function (cell) { return cell === '' || cell === null; });

  if (isBlank) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  // If row 1 already has content, leave it untouched — preserves whatever
  // is already there instead of assuming it's safe to overwrite.
}

// ---------------------------------------------------------------------------
// Dashboard layout (all cells are formulas/labels derived from the other
// sheets — nothing here is a manually-entered record, so every run clears
// and redraws the whole sheet from scratch. That's what makes it safe to
// re-run and guarantees there's never more than one copy of a section.)
// ---------------------------------------------------------------------------

const DASHBOARD_COLS = 16;          // A:P — width of the KPI row, reused for the title bar
const PIPELINE_LIST_ROWS = 30;      // generous cap so a longer Settings list still fits

const DASHBOARD_ROWS = {
  title: 1,
  updated: 2,
  kpiHeader: 4,
  kpiLabel: 5,
  kpiValue: 6,
  pipelineHeader: 8,
  pipelineSubHeader: 9,
  pipelineFirstRow: 10 // occupies rows 10..(10 + PIPELINE_LIST_ROWS - 1) = 10..39
};
DASHBOARD_ROWS.metricsHeader = DASHBOARD_ROWS.pipelineFirstRow + PIPELINE_LIST_ROWS + 1; // 41
DASHBOARD_ROWS.metricsLabel = DASHBOARD_ROWS.metricsHeader + 1;   // 42
DASHBOARD_ROWS.metricsValue = DASHBOARD_ROWS.metricsHeader + 2;   // 43
DASHBOARD_ROWS.activityHeader = DASHBOARD_ROWS.metricsValue + 2;  // 45
DASHBOARD_ROWS.activityColumns = DASHBOARD_ROWS.activityHeader + 1; // 46
DASHBOARD_ROWS.activityFirstRow = DASHBOARD_ROWS.activityHeader + 2; // 47

// KPI cards, in the exact order requested. Every formula reads live from the
// source sheets — no hardcoded counts or totals anywhere on this sheet.
const DASHBOARD_KPIS = [
  { label: 'Total Prospects', formula: '=COUNTA(Prospects!A2:A)', format: '0' },
  { label: 'New Leads', formula: '=COUNTIF(Prospects!I2:I,"New")', format: '0' },
  { label: 'Contacted', formula: '=COUNTIF(Prospects!I2:I,"Contacted")', format: '0' },
  { label: 'Follow Ups Due', formula: '=COUNTIFS(\'Follow Ups\'!A2:A,"<>",\'Follow Ups\'!B2:B,"<="&TODAY(),\'Follow Ups\'!B2:B,"<>")', format: '0' },
  { label: 'Meetings Booked', formula: '=COUNTA(Meetings!A2:A)', format: '0' },
  { label: 'Proposals Sent', formula: '=COUNTA(Proposals!D2:D)', format: '0' },
  { label: 'Active Clients', formula: '=COUNTIF(Clients!E2:E,"Active")', format: '0' },
  { label: 'Monthly Revenue', formula: '=SUMIFS(Revenue!D2:D,Revenue!F2:F,">="&EOMONTH(TODAY(),-1)+1,Revenue!F2:F,"<="&EOMONTH(TODAY(),0),Revenue!E2:E,TRUE)', format: '$#,##0.00' }
];

// Conversion + client summary cards, reusing the same card widget as the KPIs.
const DASHBOARD_METRICS = [
  { label: 'Outreach Conversion %', formula: '=IFERROR(COUNTA(Meetings!A2:A)/COUNTA(\'Outreach Pipeline\'!A2:A),0)', format: '0.0%' },
  { label: 'Proposal Close %', formula: '=IFERROR(COUNTIF(Proposals!E2:E,"Accepted")/COUNTA(Proposals!D2:D),0)', format: '0.0%' },
  { label: 'Client Count', formula: '=COUNTA(Clients!A2:A)', format: '0' }
];

function buildDashboard_(sheet) {
  // Every cell on this sheet is computed from the other sheets, so it's
  // safe (and the simplest way to guarantee no duplicate sections) to wipe
  // it and redraw from scratch on every run. This never touches Prospects,
  // Clients, Revenue, etc. — those are the real records and are only ever
  // added to, never cleared, elsewhere in this script.
  sheet.clear();
  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).breakApart();

  for (let c = 1; c <= DASHBOARD_COLS; c++) sheet.setColumnWidth(c, 95);
  sheet.setHiddenGridlines(true);

  writeTitleBar_(sheet);
  writeKpiSection_(sheet);
  writePipelineSummary_(sheet);
  writeConversionMetrics_(sheet);
  writeRecentActivity_(sheet);

  sheet.setFrozenRows(2);
}

function writeTitleBar_(sheet) {
  const title = sheet.getRange(DASHBOARD_ROWS.title, 1, 1, DASHBOARD_COLS).merge();
  title.setValue('RCS CRM — Dashboard')
    .setBackground(HEADER_BG)
    .setFontColor(HEADER_FG)
    .setFontWeight('bold')
    .setFontSize(14)
    .setVerticalAlignment('middle');
  sheet.setRowHeight(DASHBOARD_ROWS.title, 32);

  const updated = sheet.getRange(DASHBOARD_ROWS.updated, 1, 1, DASHBOARD_COLS).merge();
  updated.setFormula('="Last updated: "&TEXT(NOW(),"mmm d, yyyy h:mm am/pm")')
    .setFontStyle('italic')
    .setFontColor('#666666')
    .setFontSize(9);
}

function writeKpiSection_(sheet) {
  writeSectionHeader_(sheet, DASHBOARD_ROWS.kpiHeader, 1, DASHBOARD_COLS, 'Key Metrics');
  DASHBOARD_KPIS.forEach(function (kpi, i) {
    writeKpiCard_(sheet, i, DASHBOARD_ROWS.kpiLabel, kpi.label, kpi.formula, kpi.format);
  });
}

function writeConversionMetrics_(sheet) {
  writeSectionHeader_(sheet, DASHBOARD_ROWS.metricsHeader, 1, 6, 'Conversion & Client Metrics');
  DASHBOARD_METRICS.forEach(function (metric, i) {
    writeKpiCard_(sheet, i, DASHBOARD_ROWS.metricsLabel, metric.label, metric.formula, metric.format);
  });
}

// Prospects broken down by Status, one row per value currently listed on
// Settings!Lead Status. Blank-guarded so it never runs ahead of the list.
function writePipelineSummary_(sheet) {
  writeSectionHeader_(sheet, DASHBOARD_ROWS.pipelineHeader, 1, 4, 'Pipeline Summary — Prospects by Status');
  writeSubHeader_(sheet, DASHBOARD_ROWS.pipelineSubHeader, 1, ['Stage', 'Count']);

  for (let i = 0; i < PIPELINE_LIST_ROWS; i++) {
    const settingsRow = 2 + i;
    const sheetRow = DASHBOARD_ROWS.pipelineFirstRow + i;

    sheet.getRange(sheetRow, 1).setFormula(
      '=IF(Settings!A' + settingsRow + '="","",Settings!A' + settingsRow + ')'
    );
    sheet.getRange(sheetRow, 2).setFormula(
      '=IF(Settings!A' + settingsRow + '="","",COUNTIF(Prospects!$I$2:$I,Settings!A' + settingsRow + '))'
    ).setNumberFormat('0');
  }
}

// Most recent 10 touches logged in Outreach Pipeline, newest first. IFERROR
// covers the empty-CRM case, where FILTER would otherwise return #N/A.
function writeRecentActivity_(sheet) {
  writeSectionHeader_(sheet, DASHBOARD_ROWS.activityHeader, 1, 6, 'Recent Activity — Outreach Pipeline');
  writeSubHeader_(sheet, DASHBOARD_ROWS.activityColumns, 1,
    ['Business', 'Stage', 'Contacted', 'Method', 'Response', 'Next Action']);

  sheet.getRange(DASHBOARD_ROWS.activityFirstRow, 1).setFormula(
    '=IFERROR(ARRAY_CONSTRAIN(SORT(FILTER(\'Outreach Pipeline\'!A2:F,\'Outreach Pipeline\'!A2:A<>""),3,FALSE),10,6),"No outreach activity logged yet")'
  );
  sheet.getRange(DASHBOARD_ROWS.activityFirstRow, 3, 10, 1).setNumberFormat('yyyy-mm-dd');
}

// ---------------------------------------------------------------------------
// Dashboard widgets
// ---------------------------------------------------------------------------

function writeSectionHeader_(sheet, row, colStart, colEnd, title) {
  const range = sheet.getRange(row, colStart, 1, colEnd - colStart + 1).merge();
  range.setValue(title)
    .setBackground(HEADER_BG)
    .setFontColor(HEADER_FG)
    .setFontWeight('bold')
    .setFontSize(10)
    .setVerticalAlignment('middle');
  sheet.setRowHeight(row, 24);
}

function writeSubHeader_(sheet, row, colStart, labels) {
  labels.forEach(function (label, i) {
    sheet.getRange(row, colStart + i)
      .setValue(label)
      .setBackground('#eceef5')
      .setFontWeight('bold')
      .setFontSize(9);
  });
}

// A 2-column-wide label/value card, e.g. card index 0 -> columns A:B,
// card index 1 -> columns C:D, and so on.
function writeKpiCard_(sheet, cardIndex, labelRow, label, formula, numberFormat) {
  const colStart = 1 + cardIndex * 2;

  const labelRange = sheet.getRange(labelRow, colStart, 1, 2).merge();
  labelRange.setValue(label)
    .setBackground('#eceef5')
    .setFontWeight('bold')
    .setFontSize(9)
    .setHorizontalAlignment('center')
    .setWrap(true);

  const valueRange = sheet.getRange(labelRow + 1, colStart, 1, 2).merge();
  valueRange.setFormula(formula)
    .setFontWeight('bold')
    .setFontSize(18)
    .setHorizontalAlignment('center')
    .setBorder(true, true, true, true, false, false);
  if (numberFormat) valueRange.setNumberFormat(numberFormat);
}

// ---------------------------------------------------------------------------
// Formatting (idempotent — safe to re-run)
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
// Settings sheet + validation
// ---------------------------------------------------------------------------

function buildSettingsSheet_(sheet) {
  const listNames = Object.keys(SETTINGS_LISTS);

  listNames.forEach(function (listName, i) {
    const col = i + 1;
    const headerCell = sheet.getRange(1, col);

    if (headerCell.getValue() === '') {
      headerCell.setValue(listName);
    }

    const values = SETTINGS_LISTS[listName];
    const existingBelow = sheet.getRange(2, col, values.length, 1).getValues()
      .some(function (row) { return row[0] !== '' && row[0] !== null; });

    // Only seed default values the first time — never stomp on a list the
    // team has already customized in the sheet.
    if (!existingBelow) {
      sheet.getRange(2, col, values.length, 1)
        .setValues(values.map(function (v) { return [v]; }));
    }
  });
}

function applyValidations_(sheet, headers, validationMap, settingsSheet) {
  Object.keys(validationMap).forEach(function (headerName) {
    const colIndex = headers.indexOf(headerName) + 1; // 1-based
    if (colIndex === 0) return;

    const listName = validationMap[headerName];
    const listColIndex = Object.keys(SETTINGS_LISTS).indexOf(listName) + 1;
    if (listColIndex === 0) return;

    const listLength = SETTINGS_LISTS[listName].length;
    const sourceRange = settingsSheet.getRange(2, listColIndex, listLength, 1);

    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInRange(sourceRange, true)
      .setAllowInvalid(false)
      .build();

    const dataRowCount = Math.max(sheet.getMaxRows() - 1, BANDING_FUTURE_ROWS);
    sheet.getRange(2, colIndex, dataRowCount, 1).setDataValidation(rule);
  });
}

// ---------------------------------------------------------------------------
// Import Prospects (CSV)
// ---------------------------------------------------------------------------
// One-click import: "RCS CRM > Import Prospects..." opens a dialog with a
// file picker. The CSV is read client-side (FileReader) and its text is
// sent to importProspectsFromCsv_ via google.script.run — no Drive API or
// OAuth scopes beyond what the CRM already needs. Duplicate businesses
// (matched on Business + Website) are skipped; only genuinely new rows are
// appended, so this is safe to run again with the same file.

function showImportDialog_() {
  const html = HtmlService.createHtmlOutput(IMPORT_DIALOG_HTML)
    .setWidth(480)
    .setHeight(420);
  SpreadsheetApp.getUi().showModalDialog(html, 'Import Prospects');
}

// RFC4180-style CSV parser: handles quoted fields, embedded commas/newlines
// inside quotes, and escaped "" quotes. A naive split('\n') would break on
// any multi-line Notes/Pain Points field, which real prospect data has.
function parseCsv_(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') { inQuotes = true; continue; }
    if (ch === ',') { row.push(field); field = ''; continue; }
    if (ch === '\r') { continue; }
    if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; continue; }
    field += ch;
  }

  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

function dedupeKey_(business, website) {
  return String(business || '').trim().toLowerCase() + '|' + String(website || '').trim().toLowerCase();
}

// Entry point called from the dialog. Returns
// { imported, skipped, errors, errorMessages, ignoredColumns } so the
// dialog can render the exact report the task calls for.
function importProspectsFromCsv_(csvText) {
  const result = { imported: 0, skipped: 0, errors: 0, errorMessages: [], ignoredColumns: [] };

  if (!csvText || csvText.trim() === '') {
    result.errorMessages.push('The file was empty — nothing to import.');
    return result;
  }

  const rows = parseCsv_(csvText);
  if (rows.length === 0) {
    result.errorMessages.push('No rows found in the file.');
    return result;
  }

  const prospectsDef = SHEET_DEFS.find(function (d) { return d.name === 'Prospects'; });
  const targetHeaders = prospectsDef.headers;
  const csvHeaders = rows[0].map(function (h) { return String(h).trim(); });

  const colMap = {}; // csvColIndex -> targetHeaderIndex
  csvHeaders.forEach(function (h, i) {
    if (h === '') return;
    const normalized = h.toLowerCase();
    let targetIndex = targetHeaders.findIndex(function (t) { return t.toLowerCase() === normalized; });
    if (targetIndex === -1 && IMPORT_HEADER_ALIASES[h]) {
      targetIndex = targetHeaders.indexOf(IMPORT_HEADER_ALIASES[h]);
    }
    if (targetIndex !== -1) {
      colMap[i] = targetIndex;
    } else {
      result.ignoredColumns.push(h);
    }
  });

  const businessTargetIndex = targetHeaders.indexOf('Business');
  const websiteTargetIndex = targetHeaders.indexOf('Website');
  const csvBusinessCol = Object.keys(colMap).find(function (k) { return colMap[k] === businessTargetIndex; });

  if (csvBusinessCol === undefined) {
    result.errorMessages.push('No "Business" (or "Business Name") column found — cannot import without a business name.');
    return result;
  }

  if (rows.length === 1) {
    // Header row only, no data rows — a valid, if uneventful, import.
    return result;
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Prospects');
  const existingCount = Math.max(sheet.getLastRow() - 1, 0);
  const existingKeys = {};
  if (existingCount > 0) {
    const existingBusiness = sheet.getRange(2, businessTargetIndex + 1, existingCount, 1).getValues();
    const existingWebsite = sheet.getRange(2, websiteTargetIndex + 1, existingCount, 1).getValues();
    for (let r = 0; r < existingCount; r++) {
      existingKeys[dedupeKey_(existingBusiness[r][0], existingWebsite[r][0])] = true;
    }
  }

  const batchKeys = {};
  const newRows = [];

  for (let r = 1; r < rows.length; r++) {
    const csvRow = rows[r];
    const isBlankRow = csvRow.every(function (cell) { return String(cell).trim() === ''; });
    if (isBlankRow) continue; // blank line in the file, not a data error

    const businessValue = String(csvRow[Number(csvBusinessCol)] || '').trim();
    if (businessValue === '') {
      result.errors++;
      result.errorMessages.push('Row ' + (r + 1) + ': missing Business Name — skipped.');
      continue;
    }

    const mappedRow = new Array(targetHeaders.length).fill('');
    Object.keys(colMap).forEach(function (csvIdx) {
      const value = csvRow[Number(csvIdx)];
      mappedRow[colMap[csvIdx]] = value !== undefined ? value : '';
    });

    const websiteValue = websiteTargetIndex !== -1 ? String(mappedRow[websiteTargetIndex] || '').trim() : '';
    const key = dedupeKey_(businessValue, websiteValue);

    if (existingKeys[key] || batchKeys[key]) {
      result.skipped++;
      continue;
    }
    batchKeys[key] = true;
    newRows.push(mappedRow);
  }

  if (newRows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, targetHeaders.length).setValues(newRows);
    result.imported = newRows.length;

    // Formatting/banding/validation were already pre-applied across a
    // generous future range by buildRCSCRM(), so newly appended rows
    // already carry them — only the filter's range needs refreshing so it
    // covers the rows that were just added.
    applyBasicFilter_(sheet, targetHeaders.length);
    autoResizeColumns_(sheet, targetHeaders.length);
  }

  return result;
}

// Client-side dialog: file picker + Import button + a results area that
// reports Imported/Skipped/Errors after the server call resolves.
const IMPORT_DIALOG_HTML = '<!DOCTYPE html><html><head><base target="_top">' +
  '<style>' +
  'body{font-family:Arial,sans-serif;font-size:13px;color:#222;padding:4px 8px;}' +
  'h3{margin:0 0 10px;font-size:15px;}' +
  'p.hint{color:#666;margin-top:0;}' +
  'input[type=file]{margin:12px 0;}' +
  'button{background:#1a1a2e;color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:13px;}' +
  'button:disabled{background:#999;cursor:default;}' +
  '#status{margin-top:16px;line-height:1.5;}' +
  '</style></head><body>' +
  '<h3>Import Prospects</h3>' +
  '<p class="hint">Choose a CSV file. Columns are matched to the Prospects headers automatically; rows already in the sheet (matched on Business + Website) are skipped.</p>' +
  '<input type="file" id="csvFile" accept=".csv,text/csv">' +
  '<br><button id="importBtn">Import</button>' +
  '<div id="status"></div>' +
  '<script>' +
  'document.getElementById("importBtn").addEventListener("click", function () {' +
  '  var fileInput = document.getElementById("csvFile");' +
  '  var status = document.getElementById("status");' +
  '  var btn = document.getElementById("importBtn");' +
  '  if (!fileInput.files.length) { status.textContent = "Choose a CSV file first."; return; }' +
  '  btn.disabled = true;' +
  '  status.textContent = "Reading file...";' +
  '  var reader = new FileReader();' +
  '  reader.onload = function (e) {' +
  '    status.textContent = "Importing...";' +
  '    google.script.run.withSuccessHandler(function (result) {' +
  '      btn.disabled = false;' +
  '      var html = "<strong>Imported:</strong> " + result.imported +' +
  '        "<br><strong>Skipped (duplicates):</strong> " + result.skipped +' +
  '        "<br><strong>Errors:</strong> " + result.errors;' +
  '      if (result.ignoredColumns && result.ignoredColumns.length) {' +
  '        html += "<br><br>Columns not imported (no matching Prospects field): " + result.ignoredColumns.join(", ");' +
  '      }' +
  '      if (result.errorMessages && result.errorMessages.length) {' +
  '        html += "<br><br>" + result.errorMessages.slice(0, 10).join("<br>");' +
  '      }' +
  '      status.innerHTML = html;' +
  '    }).withFailureHandler(function (err) {' +
  '      btn.disabled = false;' +
  '      status.textContent = "Import failed: " + err.message;' +
  '    }).importProspectsFromCsv_(e.target.result);' +
  '  };' +
  '  reader.readAsText(fileInput.files[0]);' +
  '});' +
  '</script></body></html>';

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
