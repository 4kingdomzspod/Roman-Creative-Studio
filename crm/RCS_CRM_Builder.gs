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
