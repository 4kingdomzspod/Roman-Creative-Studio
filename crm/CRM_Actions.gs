/**
 * CRM_Actions.gs
 * ---------------------------------------------------------------------------
 * Three menu actions — Move to Outreach, Convert to Client, Archive Lead —
 * that act on whichever Prospects row(s) are currently selected. Each
 * confirms before doing anything, reports what happened, and only ever
 * copies data forward or edits the selected Prospects row in place —
 * nothing is deleted, so all three are safe to run again.
 */

function getHeaders_(sheetName) {
  const def = SHEET_DEFS.find(function (d) { return d.name === sheetName; });
  return def ? def.headers : [];
}

// ---------------------------------------------------------------------------
// Prospect initialization — the ONE canonical entry point every Prospect
// creation path calls: CSV import and Auto Sync (CRM_Import.gs/CRM_Sync.gs,
// same importProspectsFromCsv_), manual typing (Code.gs's onEdit), and the
// Repair Prospects backfill below. A row that never gets initialized is
// exactly the bug this closes: Status/Lead Score/Score Tier/Score Reasons
// silently staying blank forever.
//
// Idempotent and non-destructive by construction: it only ever acts when
// Status is currently blank, so calling it on an already-initialized row
// (or twice on the same row) is always a safe no-op. It never touches Next
// Follow Up — a brand-new prospect gets a Next Action ("Contact Prospect",
// via the existing CRM_NextAction.gs), not an auto-scheduled follow-up.
// Reuses CRM_Scoring.gs's scoreProspectRow_ unchanged — no second scoring
// engine — and never fabricates Priority/contact info that isn't on file.
// ---------------------------------------------------------------------------

const PROSPECT_DEFAULT_STATUS = 'New';

function initializeProspectRow_(prospects, headers, row) {
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });
  function field(name) { return idx[name] !== undefined ? prospects.getRange(row, idx[name] + 1).getValue() : ''; }

  const business = String(field('Business') || '').trim();
  if (business === '') return { changed: false };

  const currentStatus = String(field('Status') || '').trim();
  if (currentStatus !== '') return { changed: false, business: business }; // already initialized — never overwritten

  if (idx['Status'] !== undefined) prospects.getRange(row, idx['Status'] + 1).setValue(PROSPECT_DEFAULT_STATUS);

  // Score columns are provisioned additively (CRM_Scoring.gs), same as every
  // other optional Prospects column in this CRM — guarded so this still
  // works even if scoring has never been run on this sheet before.
  if (typeof ensureScoreColumns_ === 'function') ensureScoreColumns_(prospects);
  const liveHeaders = typeof getLiveProspectsHeaders_ === 'function' ? getLiveProspectsHeaders_(prospects) : headers;
  if (typeof scoreProspectRow_ === 'function') scoreProspectRow_(prospects, liveHeaders, row);

  return { changed: true, business: business };
}

// "RCS CRM > Repair Prospects" — safe backfill for records that predate (or
// otherwise missed) initialization. Reuses initializeProspectRow_ exactly;
// safe to run any number of times, on any number of prospects, including
// ones already fully initialized (no-op for those).
function menuRepairProspects_() {
  const ui = SpreadsheetApp.getUi();
  const prospects = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Prospects');
  if (!prospects) { ui.alert('Prospects sheet not found.'); return; }

  const lastRow = prospects.getLastRow();
  if (lastRow < 2) {
    ui.alert('Repair Prospects', 'No prospects on file yet.', ui.ButtonSet.OK);
    return;
  }

  const headers = typeof getLiveProspectsHeaders_ === 'function' ? getLiveProspectsHeaders_(prospects) : getHeaders_('Prospects');
  let initialized = 0, alreadyOk = 0, blank = 0;
  for (let r = 2; r <= lastRow; r++) {
    const result = initializeProspectRow_(prospects, headers, r);
    if (result.changed) initialized++;
    else if (result.business) alreadyOk++;
    else blank++;
  }

  ui.alert('Repair Prospects',
    'Initialized (blank Status -> New + scored): ' + initialized +
    '\nAlready had a Status (untouched): ' + alreadyOk +
    (blank ? '\nRows with no Business name (skipped): ' + blank : '') +
    '\n\nNo existing Status, Priority, contact info, or other data was changed. Safe to run again anytime.',
    ui.ButtonSet.OK);
}

// Reads whichever rows are selected on the active sheet, provided that
// sheet is Prospects. Returns null (after alerting) if the selection isn't
// usable, so callers can just check for null and bail.
function getSelectedProspectRows_() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (sheet.getName() !== 'Prospects') {
    ui.alert('Select one or more rows in the Prospects sheet first.');
    return null;
  }

  const range = sheet.getActiveRange();
  if (!range) {
    ui.alert('Select one or more rows in the Prospects sheet first.');
    return null;
  }

  const startRow = range.getRow();
  const numRows = range.getNumRows();
  const rows = [];
  for (let r = startRow; r < startRow + numRows; r++) {
    if (r >= 2) rows.push(r); // skip the header row if it's part of the selection
  }

  if (rows.length === 0) {
    ui.alert('Select a data row (not just the header) in Prospects.');
    return null;
  }
  return rows;
}

// Builds a set of dedupeKey_() values (CRM_Import.gs) from a sheet's
// existing rows, for duplicate checks. Pass websiteColIndex -1 for a
// target sheet (like Outreach Pipeline) that has no Website column — the
// key then falls back to Business name alone, the only shared identifier.
function buildExistingKeySet_(sheet, businessColIndex, websiteColIndex) {
  const count = Math.max(sheet.getLastRow() - 1, 0);
  const keys = {};
  if (count === 0) return keys;

  const businessValues = sheet.getRange(2, businessColIndex + 1, count, 1).getValues();
  const websiteValues = websiteColIndex !== -1
    ? sheet.getRange(2, websiteColIndex + 1, count, 1).getValues()
    : null;

  for (let i = 0; i < count; i++) {
    const business = businessValues[i][0];
    const website = websiteValues ? websiteValues[i][0] : '';
    keys[dedupeKey_(business, website)] = true;
  }
  return keys;
}

function menuMoveToOutreach_() {
  const rows = getSelectedProspectRows_();
  if (!rows) return;

  const ui = SpreadsheetApp.getUi();
  const question = rows.length === 1
    ? 'Copy this prospect into Outreach Pipeline?'
    : 'Copy these ' + rows.length + ' prospects into Outreach Pipeline?';
  if (ui.alert('Move to Outreach', question, ui.ButtonSet.YES_NO) !== ui.Button.YES) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const prospects = ss.getSheetByName('Prospects');
  const pipeline = ss.getSheetByName('Outreach Pipeline');
  const pHeaders = getHeaders_('Prospects');
  const oHeaders = getHeaders_('Outreach Pipeline');

  const bIdx = pHeaders.indexOf('Business');
  const statusIdx = pHeaders.indexOf('Status');
  const lastContactIdx = pHeaders.indexOf('Last Contact');
  const notesIdx = pHeaders.indexOf('Notes');

  const oBusinessIdx = oHeaders.indexOf('Business');
  const oStageIdx = oHeaders.indexOf('Stage');
  const oContactedIdx = oHeaders.indexOf('Contacted');
  const oNotesIdx = oHeaders.indexOf('Notes');

  // Outreach Pipeline has no Website column, so the duplicate key here is
  // Business name alone (websiteColIndex -1) — the only field both sheets share.
  const existingKeys = buildExistingKeySet_(pipeline, oBusinessIdx, -1);
  const batchKeys = {};
  const newRows = [];
  let moved = 0, skipped = 0, errors = 0;

  rows.forEach(function (r) {
    const rowValues = prospects.getRange(r, 1, 1, pHeaders.length).getValues()[0];
    const business = String(rowValues[bIdx] || '').trim();
    if (business === '') { errors++; return; }

    const key = dedupeKey_(business, '');
    if (existingKeys[key] || batchKeys[key]) { skipped++; return; }
    batchKeys[key] = true;

    const newRow = new Array(oHeaders.length).fill('');
    newRow[oBusinessIdx] = business;
    if (oStageIdx !== -1 && statusIdx !== -1) newRow[oStageIdx] = rowValues[statusIdx];
    if (oContactedIdx !== -1 && lastContactIdx !== -1) newRow[oContactedIdx] = rowValues[lastContactIdx];
    if (oNotesIdx !== -1 && notesIdx !== -1) newRow[oNotesIdx] = rowValues[notesIdx];

    newRows.push(newRow);
    moved++;
  });

  if (newRows.length > 0) {
    pipeline.getRange(pipeline.getLastRow() + 1, 1, newRows.length, oHeaders.length).setValues(newRows);
    applyBasicFilter_(pipeline, oHeaders.length);
    autoResizeColumns_(pipeline, oHeaders.length);
  }

  ui.alert('Move to Outreach', 'Moved: ' + moved + '\nSkipped (duplicate): ' + skipped +
    '\nErrors (missing Business Name): ' + errors, ui.ButtonSet.OK);
}

function menuConvertToClient_() {
  const rows = getSelectedProspectRows_();
  if (!rows) return;

  const ui = SpreadsheetApp.getUi();
  const question = rows.length === 1
    ? 'Convert this prospect into a Client? Start Date will be set to today.'
    : 'Convert these ' + rows.length + ' prospects into Clients? Start Date will be set to today.';
  if (ui.alert('Convert to Client', question, ui.ButtonSet.YES_NO) !== ui.Button.YES) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const prospects = ss.getSheetByName('Prospects');
  const clients = ss.getSheetByName('Clients');
  const pHeaders = getHeaders_('Prospects');
  const cHeaders = getHeaders_('Clients');

  const bIdx = pHeaders.indexOf('Business');
  const websiteIdx = pHeaders.indexOf('Website');
  const notesIdx = pHeaders.indexOf('Notes');

  const cBusinessIdx = cHeaders.indexOf('Business');
  const cStartIdx = cHeaders.indexOf('Start');
  const cStatusIdx = cHeaders.indexOf('Status');
  const cWebsiteIdx = cHeaders.indexOf('Website');
  const cNotesIdx = cHeaders.indexOf('Notes');

  const existingKeys = buildExistingKeySet_(clients, cBusinessIdx, cWebsiteIdx);
  const batchKeys = {};
  const newRows = [];
  const today = new Date();
  let converted = 0, skipped = 0, errors = 0;

  rows.forEach(function (r) {
    const rowValues = prospects.getRange(r, 1, 1, pHeaders.length).getValues()[0];
    const business = String(rowValues[bIdx] || '').trim();
    if (business === '') { errors++; return; }

    const website = websiteIdx !== -1 ? String(rowValues[websiteIdx] || '').trim() : '';
    const key = dedupeKey_(business, website);
    if (existingKeys[key] || batchKeys[key]) { skipped++; return; }
    batchKeys[key] = true;

    const newRow = new Array(cHeaders.length).fill('');
    newRow[cBusinessIdx] = business;
    if (cStartIdx !== -1) newRow[cStartIdx] = today;
    // "Discovery" is the first stage of the real build workflow documented
    // in process.html — the natural starting Project Status on conversion.
    if (cStatusIdx !== -1) newRow[cStatusIdx] = 'Discovery';
    if (cWebsiteIdx !== -1) newRow[cWebsiteIdx] = website;
    if (cNotesIdx !== -1 && notesIdx !== -1) newRow[cNotesIdx] = rowValues[notesIdx];

    newRows.push(newRow);
    converted++;
  });

  if (newRows.length > 0) {
    const startRow = clients.getLastRow() + 1;
    clients.getRange(startRow, 1, newRows.length, cHeaders.length).setValues(newRows);
    if (cStartIdx !== -1) clients.getRange(startRow, cStartIdx + 1, newRows.length, 1).setNumberFormat('yyyy-mm-dd');
    applyBasicFilter_(clients, cHeaders.length);
    autoResizeColumns_(clients, cHeaders.length);
  }

  ui.alert('Convert to Client', 'Converted: ' + converted + '\nSkipped (duplicate): ' + skipped +
    '\nErrors (missing Business Name): ' + errors, ui.ButtonSet.OK);
}

function menuArchiveLead_() {
  const rows = getSelectedProspectRows_();
  if (!rows) return;

  const ui = SpreadsheetApp.getUi();
  const question = rows.length === 1
    ? 'Mark this prospect as Archived?'
    : 'Mark these ' + rows.length + ' prospects as Archived?';
  if (ui.alert('Archive Lead', question, ui.ButtonSet.YES_NO) !== ui.Button.YES) return;

  const prospects = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Prospects');
  const headers = getHeaders_('Prospects');
  const statusIdx = headers.indexOf('Status');
  const archivedDateIdx = headers.indexOf('Archived Date');
  const today = new Date();

  rows.forEach(function (r) {
    if (statusIdx !== -1) prospects.getRange(r, statusIdx + 1).setValue('Archived');
    if (archivedDateIdx !== -1) {
      prospects.getRange(r, archivedDateIdx + 1).setValue(today).setNumberFormat('yyyy-mm-dd');
    }
  });

  ui.alert('Archive Lead', (rows.length === 1 ? '1 prospect' : rows.length + ' prospects') + ' archived.', ui.ButtonSet.OK);
}
