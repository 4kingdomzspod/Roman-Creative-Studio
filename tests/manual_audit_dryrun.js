/**
 * tests/manual_audit_dryrun.js
 * ---------------------------------------------------------------------------
 * crm/revenue-automation regression suite: validates the manual-audit
 * fallback (CRM_Audits.gs's menuRecordManualAudit_/recordManualAudit_) end
 * to end against the REAL .gs source, via the same indirect-eval mock-Sheets
 * harness used by tests/rcs_prospect_exclusion_dryrun.js.
 *
 * Covers the 12 required scenarios (12 is the full existing regression
 * suite — see the command that runs alongside this file, not an assertion
 * here):
 *   1. Automated audit success remains unchanged
 *   2. HTTP 403 remains a failed automated audit
 *   3. HTTP 404 remains a failed automated audit
 *   4. Manual audit can be recorded after an automated failure
 *   5. Manual audit is clearly marked as manual
 *   6. Manual score is not mistaken for an automated score
 *   7. Lead Intelligence recognizes the manual audit where appropriate
 *   8. Command Center recognizes the prospect as audited where appropriate
 *   9. Existing automated audit records remain unchanged
 *   10. Re-running a manual audit does not create duplicates
 *   11. RCS exclusion remains intact
 *
 * Run: node tests/manual_audit_dryrun.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crmDir = path.join(__dirname, '..', 'crm');

// ---------------------------------------------------------------------------
// Minimal Sheets mock (same shape as tests/rcs_prospect_exclusion_dryrun.js)
// ---------------------------------------------------------------------------

function makeRange(sheet, row, col, numRows, numCols) {
  const real = {
    getRow: function () { return row; },
    getColumn: function () { return col; },
    getNumRows: function () { return numRows; },
    getNumColumns: function () { return numCols; },
    getValue: function () { return sheet._get(row, col); },
    setValue: function (v) { sheet._set(row, col, v); return range; },
    getValues: function () {
      const out = [];
      for (let r = 0; r < numRows; r++) {
        const rowArr = [];
        for (let c = 0; c < numCols; c++) rowArr.push(sheet._get(row + r, col + c));
        out.push(rowArr);
      }
      return out;
    },
    setValues: function (vals) {
      for (let r = 0; r < vals.length; r++) {
        for (let c = 0; c < vals[r].length; c++) sheet._set(row + r, col + c, vals[r][c]);
      }
      return range;
    },
    insertCheckboxes: function () { sheet._set(row, col, false); return range; },
    createFilter: function () { sheet.__filter = { remove: function () { sheet.__filter = null; } }; return sheet.__filter; }
  };
  const range = new Proxy(real, {
    get: function (target, prop) {
      if (prop in target) return target[prop];
      if (typeof prop !== 'string') return undefined;
      return function () { return range; }; // chainable formatting no-op
    }
  });
  return range;
}

function makeSheet(name) {
  const cells = {};
  let maxRow = 0, maxCol = 0;
  let activeRange = null;

  const sheet = {
    getName: function () { return name; },
    _get: function (r, c) { const v = cells[r + '_' + c]; return v === undefined ? '' : v; },
    _set: function (r, c, v) { cells[r + '_' + c] = v; if (r > maxRow) maxRow = r; if (c > maxCol) maxCol = c; },
    _setCell: function (r, c, v) { sheet._set(r, c, v); },
    getLastRow: function () { return maxRow; },
    getLastColumn: function () { return maxCol; },
    getMaxRows: function () { return Math.max(maxRow, 100); },
    getMaxColumns: function () { return Math.max(maxCol, 20); },
    getRange: function (row, col, numRows, numCols) {
      return makeRange(sheet, row, col, numRows || 1, numCols || 1);
    },
    getActiveRange: function () { return activeRange; },
    __setActiveRange: function (row, numRows) { activeRange = { getRow: function () { return row; }, getNumRows: function () { return numRows; } }; },
    setActiveRangeForTest: function (row, numRows) { sheet.__setActiveRange(row, numRows); },
    autoResizeColumns: function () { return sheet; },
    getFilter: function () { return sheet.__filter || null; },
    getBandings: function () { return []; },
    setFrozenRows: function () { return sheet; },
    setColumnWidth: function () { return sheet; },
    setRowHeight: function () { return sheet; },
    setHiddenGridlines: function () { return sheet; },
    clear: function () { return sheet; },
    __filter: null
  };
  return sheet;
}

function makeSpreadsheet() {
  const sheets = {};
  let activeSheetName = null;
  return {
    getSheetByName: function (n) { return sheets[n] || null; },
    insertSheet: function (n) { const s = makeSheet(n); sheets[n] = s; return s; },
    getActiveSheet: function () { return sheets[activeSheetName] || null; },
    __setActiveSheet: function (n) { activeSheetName = n; },
    getSheets: function () { return Object.keys(sheets).map(function (k) { return sheets[k]; }); },
    flush: function () {}
  };
}

// ---------------------------------------------------------------------------
// UI / Properties / network mocks
// ---------------------------------------------------------------------------

const uiMock = {
  alerts: [],
  ButtonSet: { OK: 'OK_BUTTONSET', YES_NO: 'YES_NO_BUTTONSET' },
  Button: { YES: 'YES', NO: 'NO', OK: 'OK' },
  alert: function () {
    const args = Array.prototype.slice.call(arguments);
    uiMock.alerts.push(args.join(' | '));
    return uiMock.Button.OK;
  }
};

let scriptProps = {};
const propertiesServiceMock = {
  getScriptProperties: function () {
    return {
      getProperty: function (k) { return Object.prototype.hasOwnProperty.call(scriptProps, k) ? scriptProps[k] : null; },
      setProperty: function (k, v) { scriptProps[k] = v; },
      deleteProperty: function (k) { delete scriptProps[k]; }
    };
  }
};

let fetchImpl = function () { throw new Error('fetchImpl not set for this scenario'); };
const urlFetchAppMock = { fetch: function (url, opts) { return fetchImpl(url, opts); } };
function mockResponse(code, body) {
  return { getResponseCode: function () { return code; }, getContentText: function () { return body; } };
}

const GOOD_AUDIT_HTML = '<html><head><title>Albert Ruiz DDS - Home</title>' +
  '<meta name="description" content="Dr. Albert Ruiz offers dental care with fast appointment scheduling for the whole family.">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1">' +
  '<link rel="canonical" href="http://dralbertruiz.com/"></head>' +
  '<body><h1>Welcome</h1><img src="a.jpg" alt="office"></body></html>';

// ---------------------------------------------------------------------------
// Global Apps Script surface
// ---------------------------------------------------------------------------

let currentSS = makeSpreadsheet();
global.SpreadsheetApp = {
  getActiveSpreadsheet: function () { return currentSS; },
  getUi: function () { return uiMock; },
  BandingTheme: { LIGHT_GREY: 'LIGHT_GREY' }
};
global.UrlFetchApp = urlFetchAppMock;
global.PropertiesService = propertiesServiceMock;
global.ScriptApp = {
  getProjectTriggers: function () { return []; },
  newTrigger: function () { const b = { timeBased: function () { return b; }, everyHours: function () { return b; }, everyDays: function () { return b; }, atHour: function () { return b; }, after: function () { return b; }, create: function () { return {}; } }; return b; },
  deleteTrigger: function () {}
};
global.Utilities = {
  formatDate: function (date, tz, fmt) {
    const yyyy = date.getFullYear(), mm = String(date.getMonth() + 1).padStart(2, '0'), dd = String(date.getDate()).padStart(2, '0');
    return yyyy + '-' + mm + '-' + dd;
  }
};
global.Session = { getScriptTimeZone: function () { return 'America/New_York'; } };
global.Logger = { log: function () {} };
global.HtmlService = { createHtmlOutput: function () { return { setWidth: function () { return this; }, setHeight: function () { return this; } }; } };

// ---------------------------------------------------------------------------
// Load real .gs source, full dependency order (matches Code.gs's own
// documented file layout), single indirect eval so every file shares scope.
// ---------------------------------------------------------------------------

const FILES = [
  'CRM_Builder.gs', 'CRM_Settings.gs', 'Code.gs', 'CRM_Dashboard.gs', 'CRM_Import.gs',
  'CRM_Actions.gs', 'CRM_Sync.gs', 'CRM_Audits.gs', 'CRM_Outreach.gs', 'CRM_OutreachWorkflow.gs',
  'CRM_Scoring.gs', 'CRM_CommandCenter.gs', 'CRM_Analytics.gs', 'CRM_Health.gs',
  'CRM_Automation.gs', 'CRM_NextAction.gs'
];
const source = FILES.map(function (f) { return fs.readFileSync(path.join(crmDir, f), 'utf8'); }).join('\n;\n');
(0, eval)(source);

// ---------------------------------------------------------------------------
// Test scaffolding
// ---------------------------------------------------------------------------

const results = { total: 0, passed: 0, failed: 0, failures: [] };
function check(name, cond) {
  results.total++;
  if (cond) { results.passed++; } else { results.failed++; results.failures.push(name); }
  console.log((cond ? 'PASS' : 'FAIL') + ' — ' + name);
}

function resetEnvironment() {
  currentSS = makeSpreadsheet();
  const prospects = currentSS.insertSheet('Prospects');
  const audits = currentSS.insertSheet('Website Audits');
  const settings = currentSS.insertSheet('Settings');
  global.ensureHeaders_(prospects, global.getHeaders_('Prospects'));
  global.ensureHeaders_(audits, global.getHeaders_('Website Audits'));
  global.buildSettingsSheet_(settings); // CRM_Settings.gs
  currentSS.__setActiveSheet('Prospects');
  uiMock.alerts.length = 0;
  scriptProps = {};
  return { ss: currentSS, prospects: prospects, audits: audits, settings: settings };
}

function setRow(sheet, row, headers, fields) {
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });
  const vals = new Array(headers.length).fill('');
  Object.keys(fields).forEach(function (h) { if (idx[h] !== undefined) vals[idx[h]] = fields[h]; });
  sheet.getRange(row, 1, 1, headers.length).setValues([vals]);
}

function auditRowAt(auditsSheet, row) {
  const headers = global.getLiveProspectsHeaders_(auditsSheet);
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });
  const vals = auditsSheet.getRange(row, 1, 1, headers.length).getValues()[0];
  const out = {};
  headers.forEach(function (h, i) { out[h] = vals[i]; });
  return out;
}

const BUSINESS = 'Albert Ruiz, DDS';
const WEBSITE = 'http://dralbertruiz.com';

// ===========================================================================
// 1. Automated audit success remains unchanged
// ===========================================================================
(function () {
  const env = resetEnvironment();
  fetchImpl = function () { return mockResponse(200, GOOD_AUDIT_HTML); };
  const result = global.performAndSaveAudit_(BUSINESS, WEBSITE);
  check('1. automated success: audit reports ok=true', result.ok === true);
  check('1. automated success: audit reports saved=true', result.saved === true);
  check('1. automated success: Website Audits gained exactly one row', env.audits.getLastRow() === 2);
  const row = auditRowAt(env.audits, 2);
  check('1. automated success: Business correct', row['Business'] === BUSINESS);
  check('1. automated success: Score is a real number, not blank', typeof row['Score'] === 'number');
  check('1. automated success: Mobile/SEO/Performance/Accessibility all populated', row['Mobile'] && row['SEO'] && row['Performance'] && row['Accessibility']);
  check('1. automated success: Audit Source = Automated', row['Audit Source'] === 'Automated');
  check('1. automated success: Audit Status = Completed', row['Audit Status'] === 'Completed');
})();

// ===========================================================================
// 2. HTTP 403 remains a failed automated audit
// ===========================================================================
(function () {
  const env = resetEnvironment();
  fetchImpl = function () { return mockResponse(403, 'Forbidden'); };
  const result = global.performAndSaveAudit_(BUSINESS, WEBSITE);
  check('2. HTTP 403: audit reports ok=false', result.ok === false);
  check('2. HTTP 403: message mentions HTTP 403', /403/.test(result.message));
  check('2. HTTP 403: no row written to Website Audits', env.audits.getLastRow() === 1);
})();

// ===========================================================================
// 3. HTTP 404 remains a failed automated audit
// ===========================================================================
(function () {
  const env = resetEnvironment();
  fetchImpl = function () { return mockResponse(404, 'Not Found'); };
  const result = global.performAndSaveAudit_(BUSINESS, WEBSITE);
  check('3. HTTP 404: audit reports ok=false', result.ok === false);
  check('3. HTTP 404: message mentions HTTP 404', /404/.test(result.message));
  check('3. HTTP 404: no row written to Website Audits', env.audits.getLastRow() === 1);
})();

// ===========================================================================
// 4. Manual audit can be recorded after an automated failure
// ===========================================================================
(function () {
  const env = resetEnvironment();
  fetchImpl = function () { return mockResponse(403, 'Forbidden'); };
  const failed = global.performAndSaveAudit_(BUSINESS, WEBSITE);
  check('4. automated audit failed first, as expected', failed.ok === false && env.audits.getLastRow() === 1);

  const manual = global.recordManualAudit_(BUSINESS, WEBSITE, '65', 'No mobile-friendly layout; outdated contact info; no HTTPS.');
  check('4. manual audit after failure reports ok=true', manual.ok === true);
  check('4. manual audit after failure creates exactly one row', env.audits.getLastRow() === 2);
  const row = auditRowAt(env.audits, 2);
  check('4. manual audit row has the entered findings', row['Notes'].indexOf('mobile-friendly') !== -1);
})();

// ===========================================================================
// 5. Manual audit is clearly marked as manual
// ===========================================================================
(function () {
  const env = resetEnvironment();
  const manual = global.recordManualAudit_(BUSINESS, WEBSITE, '72', 'Reasonable design, slow load time.');
  check('5. manual audit reports ok=true', manual.ok === true);
  const row = auditRowAt(env.audits, 2);
  check('5. Audit Source = Manual', row['Audit Source'] === 'Manual');
  check('5. Audit Status = Completed (score was entered)', row['Audit Status'] === 'Completed');
  check('5. Mobile/SEO/Performance/Accessibility left blank (never fabricated)', row['Mobile'] === '' && row['SEO'] === '' && row['Performance'] === '' && row['Accessibility'] === '');

  // Findings-only (no score entered)
  const env2 = resetEnvironment();
  const manualNoScore = global.recordManualAudit_(BUSINESS, WEBSITE, '', 'Looked fine on a quick check, no score assigned.');
  check('5. manual audit with no score reports ok=true', manualNoScore.ok === true);
  const row2 = auditRowAt(env2.audits, 2);
  check('5. no-score manual audit: Score left blank, not fabricated as 0', row2['Score'] === '');
  check('5. no-score manual audit: Audit Status reflects findings-only', row2['Audit Status'] === 'Manual - Findings Only (No Score)');
  check('5. no-score manual audit: Audit Source still Manual', row2['Audit Source'] === 'Manual');
})();

// ===========================================================================
// 6. Manual score is not mistaken for an automated score
// ===========================================================================
(function () {
  const env = resetEnvironment();
  const headers = global.getHeaders_('Prospects');
  setRow(env.prospects, 2, headers, { Business: BUSINESS, Website: WEBSITE, Priority: 'High', Status: 'New' });
  global.recordManualAudit_(BUSINESS, WEBSITE, '80', 'Manual review findings.');

  global.ensureScoreColumns_(env.prospects);
  const liveHeaders = global.getLiveProspectsHeaders_(env.prospects);
  global.scoreProspectRow_(env.prospects, liveHeaders, 2);
  const reasons = String(env.prospects.getRange(2, liveHeaders.indexOf('Score Reasons') + 1).getValue());
  check('6. Lead Score reasons explicitly say "(Manual)" for a manually-sourced audit', /Website Audit \(Manual\):/.test(reasons));

  // Regression: an automated audit must NOT be tagged "(Manual)"
  const env2 = resetEnvironment();
  fetchImpl = function () { return mockResponse(200, GOOD_AUDIT_HTML); };
  global.performAndSaveAudit_(BUSINESS, WEBSITE);
  setRow(env2.prospects, 2, headers, { Business: BUSINESS, Website: WEBSITE, Priority: 'High', Status: 'New' });
  global.ensureScoreColumns_(env2.prospects);
  const liveHeaders2 = global.getLiveProspectsHeaders_(env2.prospects);
  global.scoreProspectRow_(env2.prospects, liveHeaders2, 2);
  const reasons2 = String(env2.prospects.getRange(2, liveHeaders2.indexOf('Score Reasons') + 1).getValue());
  check('6. an automated audit is NOT tagged "(Manual)" (existing wording unchanged)', /Website Audit: \d+\/100/.test(reasons2) && reasons2.indexOf('(Manual)') === -1);
})();

// ===========================================================================
// 7. Lead Intelligence recognizes the manual audit where appropriate
// ===========================================================================
(function () {
  const env = resetEnvironment();
  const headers = global.getHeaders_('Prospects');
  setRow(env.prospects, 2, headers, { Business: BUSINESS, Website: WEBSITE, Priority: 'High', Status: 'New' });
  global.recordManualAudit_(BUSINESS, WEBSITE, '90', 'Strong findings.');
  global.ensureScoreColumns_(env.prospects);
  const liveHeaders = global.getLiveProspectsHeaders_(env.prospects);
  const scored = global.scoreProspectRow_(env.prospects, liveHeaders, 2);
  check('7. a manual audit with a score contributes real points to Lead Score', scored.score >= 27); // 90/100 * 30 max = 27

  // A manual audit with NO score must contribute 0 pts, not be read as "0/100"
  const env2 = resetEnvironment();
  global.recordManualAudit_(BUSINESS, WEBSITE, '', 'Findings only, no score.');
  setRow(env2.prospects, 2, headers, { Business: BUSINESS, Website: WEBSITE, Priority: '', Status: '' });
  global.ensureScoreColumns_(env2.prospects);
  const liveHeaders2 = global.getLiveProspectsHeaders_(env2.prospects);
  const scored2 = global.scoreProspectRow_(env2.prospects, liveHeaders2, 2);
  const reasons2 = String(scored2.reasons);
  check('7. a no-score manual audit reads as "no website audit on file", not a fabricated 0/100', /No website audit on file/.test(reasons2));
})();

// ===========================================================================
// 8. Command Center recognizes the prospect as audited where appropriate
// ===========================================================================
(function () {
  const env = resetEnvironment();
  const headers = global.getHeaders_('Prospects');
  setRow(env.prospects, 2, headers, { Business: BUSINESS, Website: WEBSITE, Priority: 'High', Status: 'New' });
  const recordsBefore = global.buildProspectRecords_(env.prospects);
  check('8. before any audit, findLatestAuditForBusiness_ returns null', global.findLatestAuditForBusiness_(BUSINESS, WEBSITE) === null);

  global.recordManualAudit_(BUSINESS, WEBSITE, '55', 'Manual findings for Command Center visibility.');
  const audit = global.findLatestAuditForBusiness_(BUSINESS, WEBSITE);
  check('8. after a manual audit, findLatestAuditForBusiness_ finds it', audit !== null && audit.source === 'Manual');

  const records = global.buildProspectRecords_(env.prospects);
  const categorized = global.categorizeProspects_(records);
  // uncontacted + audited -> should appear in auditedUncontacted
  const inAudited = categorized.auditedUncontacted.some(function (r) { return r.business === BUSINESS; });
  check('8. Command Center places the manually-audited, uncontacted prospect in auditedUncontacted', inAudited);
})();

// ===========================================================================
// 9. Existing automated audit records remain unchanged
// ===========================================================================
(function () {
  const env = resetEnvironment();
  fetchImpl = function () { return mockResponse(200, GOOD_AUDIT_HTML); };
  global.performAndSaveAudit_('Existing Automated Co', 'https://existingautomated.com');
  const before = auditRowAt(env.audits, 2);

  global.recordManualAudit_(BUSINESS, WEBSITE, '60', 'A different prospect entirely.');

  const after = auditRowAt(env.audits, 2);
  check('9. the pre-existing automated row is byte-for-byte unchanged after an unrelated manual audit',
    JSON.stringify(before) === JSON.stringify(after));
  check('9. the automated row is still first, the manual row appended after', env.audits.getLastRow() === 3);
})();

// ===========================================================================
// 10. Re-running a manual audit does not create duplicates / conflicting state
// ===========================================================================
(function () {
  const env = resetEnvironment();
  const first = global.recordManualAudit_(BUSINESS, WEBSITE, '50', 'First pass — quick look.');
  check('10. first manual audit recorded', first.ok === true && env.audits.getLastRow() === 2);

  const second = global.recordManualAudit_(BUSINESS, WEBSITE, '58', 'Second pass — corrected findings after a closer look.');
  check('10. second manual audit recorded as a new row (append-only, same as automated re-audits)', second.ok === true && env.audits.getLastRow() === 3);

  const latest = global.findLatestAuditForBusiness_(BUSINESS, WEBSITE);
  check('10. findLatestAuditForBusiness_ resolves to the most recently recorded manual audit, not the first', latest.score === 58);
  check('10. no row was overwritten — both entries still present and distinct', auditRowAt(env.audits, 2)['Score'] === 50 && auditRowAt(env.audits, 3)['Score'] === 58);
})();

// ===========================================================================
// 11. RCS exclusion remains intact
// ===========================================================================
(function () {
  const env = resetEnvironment();
  const headers = global.getHeaders_('Prospects');
  setRow(env.prospects, 2, headers, { Business: 'Roman Creative Studio', Website: 'https://romancreativestudio.co', Status: 'New' });
  setRow(env.prospects, 3, headers, { Business: 'Legit Dental Co', Website: 'https://legitdental.example', Status: 'New' });

  // Even if RCS somehow has a manual audit on file, it must still never appear as a prospect record.
  global.recordManualAudit_('Roman Creative Studio', 'https://romancreativestudio.co', '95', 'Should never matter — RCS is excluded regardless.');

  const records = global.buildProspectRecords_(env.prospects);
  check('11. RCS is still excluded from prospect records even with a manual audit on file', records.length === 1 && records[0].business === 'Legit Dental Co');
})();

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log('\nManual audit dry-run results: ' + results.passed + '/' + results.total + ' passed');
if (results.failed > 0) {
  console.log('FAILURES:');
  results.failures.forEach(function (f) { console.log('  - ' + f); });
  process.exit(1);
} else {
  console.log('All manual audit checks passed.');
  process.exit(0);
}
