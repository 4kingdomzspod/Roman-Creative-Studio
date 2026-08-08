/**
 * CRM_Settings.gs
 * ---------------------------------------------------------------------------
 * The six dropdown lists stored on the Settings sheet, one per column, and
 * the logic that seeds/extends them and wires up validation on the other
 * sheets. Values here match Sprint 1's spec exactly — nothing invented.
 */

const SETTINGS_LISTS = {
  'Lead Status': [
    'New', 'Contacted', 'Follow-up 1 Sent', 'Follow-up 2 Sent', 'No Response',
    'Call Booked', 'Proposal Pending', 'Proposal Sent', 'Won',
    'Closed — Lost', 'Nurture', 'Closed — Not Interested', 'Do Not Contact', 'Archived'
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

const SETTINGS_SCAN_ROWS = 50; // headroom per column for canonical + any user-added values

// Seeds each Settings column the first time; on later runs only appends
// whichever canonical values aren't already present in that column — after
// whatever's already there, never reordering or removing anything a team
// added on their own.
function buildSettingsSheet_(sheet) {
  const listNames = Object.keys(SETTINGS_LISTS);

  listNames.forEach(function (listName, i) {
    const col = i + 1;
    const headerCell = sheet.getRange(1, col);
    if (headerCell.getValue() === '') headerCell.setValue(listName);

    const existingValues = sheet.getRange(2, col, SETTINGS_SCAN_ROWS, 1).getValues()
      .map(function (row) { return row[0]; })
      .filter(function (v) { return v !== '' && v !== null; });

    const existingSet = {};
    existingValues.forEach(function (v) { existingSet[String(v).trim()] = true; });

    const missing = SETTINGS_LISTS[listName].filter(function (v) { return !existingSet[v]; });
    if (missing.length === 0) return;

    const startRow = 2 + existingValues.length;
    sheet.getRange(startRow, col, missing.length, 1)
      .setValues(missing.map(function (v) { return [v]; }));
  });
}

// Applies a "value must be in this range" dropdown to a column, sourcing
// from a generous range on Settings (SETTINGS_SCAN_ROWS, not just the
// canonical list's own length) so a value the team appends manually in
// Settings also becomes a selectable option elsewhere.
function applyValidations_(sheet, headers, validationMap, settingsSheet) {
  Object.keys(validationMap).forEach(function (headerName) {
    const colIndex = headers.indexOf(headerName) + 1; // 1-based
    if (colIndex === 0) return;

    const listName = validationMap[headerName];
    const listColIndex = Object.keys(SETTINGS_LISTS).indexOf(listName) + 1;
    if (listColIndex === 0) return;

    const sourceRange = settingsSheet.getRange(2, listColIndex, SETTINGS_SCAN_ROWS, 1);

    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInRange(sourceRange, true)
      .setAllowInvalid(false)
      .build();

    const dataRowCount = Math.max(sheet.getMaxRows() - 1, BANDING_FUTURE_ROWS);
    sheet.getRange(2, colIndex, dataRowCount, 1).setDataValidation(rule);
  });
}
