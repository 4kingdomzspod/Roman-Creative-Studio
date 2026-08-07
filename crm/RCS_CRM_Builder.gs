/**
 * RCS CRM Builder v1
 * ---------------------------------------------------------------------------
 * Builds/updates the Roman Creative Studio CRM inside the Google Sheet this
 * script is bound to. Safe to run repeatedly: it only creates what's missing
 * and never overwrites existing row data.
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
    headers: [], // reserved — see buildDashboard_()
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

function buildDashboard_(sheet) {
  // "Reserve only" — no headers or tabular formatting are prescribed for
  // this sheet. Just make sure it exists and is clearly labeled as reserved
  // for a future KPI/summary build, without inventing fake metrics.
  const cell = sheet.getRange(1, 1);
  if (cell.getValue() === '') {
    cell.setValue('Dashboard — reserved for KPI/summary view (build in a later sprint)');
  }
  cell.setFontWeight('bold');
  sheet.setFrozenRows(1);
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
