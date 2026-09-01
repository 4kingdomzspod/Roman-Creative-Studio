/**
 * tests/audit_workflow_dryrun.js
 * ---------------------------------------------------------------------------
 * crm/revenue-automation regression suite: validates the audit re-queue fix
 * (CRM_Audits.gs's classifyAuditQueueRow_ / auditEligibleProspectsBatch_ /
 * the "Website Audit State" Prospects cache) end to end against the REAL
 * .gs source, via the same indirect-eval mock-Sheets harness used by
 * tests/manual_audit_dryrun.js and tests/rcs_prospect_exclusion_dryrun.js.
 *
 * Covers the 14 required scenarios (14 is the full existing regression
 * suite — see the command that runs alongside this file, not an assertion
 * here):
 *   1. Prospect imported with website -> audit eligibility unchanged
 *   2. Prospect imported without website -> skipped as expected
 *   3. Website later added to a skipped prospect -> becomes audit eligible
 *   4. Newly added website does not create a duplicate prospect
 *   5. Existing successful audit is not duplicated
 *   6. HTTP 403 remains an automated failure
 *   7. HTTP 404 remains an automated failure
 *   8. Manual audit can be recorded after a failure
 *   9. Manual score is distinguished from an automated score
 *   10. Lead Intelligence handles a manual audit correctly
 *   11. Command Center handles a manual audit correctly
 *   12. RCS remains excluded
 *   13. Existing Follow-Up behavior remains unchanged
 *
 * Run: node tests/audit_workflow_dryrun.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crmDir = path.join(__dirname, '..', 'crm');

// ---------------------------------------------------------------------------
// Minimal Sheets mock (same shape as tests/manual_audit_dryrun.js)
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
  const followUps = currentSS.insertSheet('Follow Ups');
  global.ensureHeaders_(prospects, global.getHeaders_('Prospects'));
  global.ensureHeaders_(audits, global.getHeaders_('Website Audits'));
  global.ensureHeaders_(followUps, global.getHeaders_('Follow Ups'));
  global.buildSettingsSheet_(settings); // CRM_Settings.gs
  currentSS.__setActiveSheet('Prospects');
  uiMock.alerts.length = 0;
  scriptProps = {};
  return { ss: currentSS, prospects: prospects, audits: audits, settings: settings, followUps: followUps };
}

function setRow(sheet, row, headers, fields) {
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });
  const vals = new Array(headers.length).fill('');
  Object.keys(fields).forEach(function (h) { if (idx[h] !== undefined) vals[idx[h]] = fields[h]; });
  sheet.getRange(row, 1, 1, headers.length).setValues([vals]);
}

function prospectRowAt(prospects, row) {
  const headers = global.getLiveProspectsHeaders_(prospects);
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });
  const vals = prospects.getRange(row, 1, 1, headers.length).getValues()[0];
  const out = {};
  headers.forEach(function (h, i) { out[h] = vals[i]; });
  return out;
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

function importCsv(csvText) {
  return global.importProspectsFromCsv_(csvText);
}

// ===========================================================================
// 1. Prospect imported with website -> audit eligibility unchanged
// ===========================================================================
(function () {
  const env = resetEnvironment();
  const csv = 'Business,Website\n"' + BUSINESS + '",' + WEBSITE + '\n';
  const importResult = importCsv(csv);
  check('1. import with website: one prospect imported', importResult.imported === 1);

  const p = prospectRowAt(env.prospects, 2);
  const classification = global.classifyAuditQueueRow_(p['Business'], p['Status'], p['Archived Date'], p['Website'], p['Website Audit State']);
  check('1. import with website: immediately classified eligible for the automated audit queue', classification.eligible === true);

  fetchImpl = function () { return mockResponse(200, GOOD_AUDIT_HTML); };
  const summary = global.auditEligibleProspectsBatch_(false);
  check('1. import with website: batch finds it eligible and audits it', summary.eligible === 1 && summary.audited === 1);
  check('1. import with website: Website Audits gained exactly one row', env.audits.getLastRow() === 2);
  check('1. import with website: Prospects Website Audit State stamped Automated Success', prospectRowAt(env.prospects, 2)['Website Audit State'] === 'Automated Success');
})();

// ===========================================================================
// 2. Prospect imported without website -> skipped as expected
// ===========================================================================
(function () {
  const env = resetEnvironment();
  const csv = 'Business,Website\nNo Website Co,\n';
  const importResult = importCsv(csv);
  check('2. import without website: one prospect imported (Website blank)', importResult.imported === 1);

  const p = prospectRowAt(env.prospects, 2);
  check('2. import without website: Website is blank on the imported row', p['Website'] === '');
  const classification = global.classifyAuditQueueRow_(p['Business'], p['Status'], p['Archived Date'], p['Website'], p['Website Audit State']);
  check('2. import without website: classified NOT eligible', classification.eligible === false);
  check('2. import without website: reason is missing_website', classification.reason === 'missing_website');

  const summary = global.auditEligibleProspectsBatch_(false);
  check('2. import without website: batch finds 0 eligible for this prospect', summary.eligible === 0);
  check('2. import without website: no Website Audits row was written', env.audits.getLastRow() === 1);
})();

// ===========================================================================
// 3. Website later added to a skipped prospect -> becomes audit eligible
// ===========================================================================
(function () {
  const env = resetEnvironment();
  importCsv('Business,Website\n"' + BUSINESS + '",\n');
  const beforeAdd = prospectRowAt(env.prospects, 2);
  check('3. before adding a website: not eligible (missing_website)',
    global.classifyAuditQueueRow_(beforeAdd['Business'], beforeAdd['Status'], beforeAdd['Archived Date'], beforeAdd['Website'], beforeAdd['Website Audit State']).reason === 'missing_website');

  // Simulate a human manually filling in the Website cell on the existing row.
  const headers = global.getLiveProspectsHeaders_(env.prospects);
  const wIdx = headers.indexOf('Website');
  env.prospects.getRange(2, wIdx + 1).setValue(WEBSITE);

  const afterAdd = prospectRowAt(env.prospects, 2);
  const classification = global.classifyAuditQueueRow_(afterAdd['Business'], afterAdd['Status'], afterAdd['Archived Date'], afterAdd['Website'], afterAdd['Website Audit State']);
  check('3. after adding a website: now classified eligible', classification.eligible === true);

  fetchImpl = function () { return mockResponse(200, GOOD_AUDIT_HTML); };
  const summary = global.auditEligibleProspectsBatch_(false);
  check('3. after adding a website: the batch actually audits it', summary.audited === 1);
  check('3. after adding a website: Website Audits gained exactly one row', env.audits.getLastRow() === 2);
  check('3. after adding a website: Prospects row stamped Automated Success', prospectRowAt(env.prospects, 2)['Website Audit State'] === 'Automated Success');
})();

// ===========================================================================
// 4. Newly added website does not create a duplicate prospect
// ===========================================================================
(function () {
  const env = resetEnvironment();
  importCsv('Business,Website\n"' + BUSINESS + '",\n');
  check('4. one Prospects row after import', env.prospects.getLastRow() === 2);

  const headers = global.getLiveProspectsHeaders_(env.prospects);
  const wIdx = headers.indexOf('Website');
  env.prospects.getRange(2, wIdx + 1).setValue(WEBSITE);
  check('4. still exactly one Prospects row right after adding a website', env.prospects.getLastRow() === 2);

  fetchImpl = function () { return mockResponse(200, GOOD_AUDIT_HTML); };
  global.auditEligibleProspectsBatch_(false);
  check('4. still exactly one Prospects row after the audit batch runs — no duplicate created', env.prospects.getLastRow() === 2);
  check('4. the single row is still the same business', prospectRowAt(env.prospects, 2)['Business'] === BUSINESS);
})();

// ===========================================================================
// 5. Existing successful audit is not duplicated
// ===========================================================================
(function () {
  const env = resetEnvironment();
  const headers = global.getHeaders_('Prospects');
  setRow(env.prospects, 2, headers, { Business: BUSINESS, Website: WEBSITE, Status: 'New' });

  // Simulate an audit that was already on file BEFORE this feature existed:
  // a real Website Audits row, but the Prospects row's Website Audit State
  // cache was never populated (it didn't exist yet).
  fetchImpl = function () { return mockResponse(200, GOOD_AUDIT_HTML); };
  global.performAndSaveAudit_(BUSINESS, WEBSITE);
  check('5. pre-existing audit on file', env.audits.getLastRow() === 2);
  check('5. Prospects cache still blank (as if written before this feature)', !prospectRowAt(env.prospects, 2)['Website Audit State']);

  const summary = global.auditEligibleProspectsBatch_(false);
  check('5. the batch does not treat this prospect as eligible', summary.eligible === 0);
  check('5. Website Audits still has exactly one row — no duplicate was written', env.audits.getLastRow() === 2);
  check('5. the Prospects cache was backfilled from the existing record instead of re-auditing', prospectRowAt(env.prospects, 2)['Website Audit State'] === 'Automated Success');
})();

// ===========================================================================
// 6. HTTP 403 remains an automated failure
// ===========================================================================
(function () {
  const env = resetEnvironment();
  const headers = global.getHeaders_('Prospects');
  setRow(env.prospects, 2, headers, { Business: BUSINESS, Website: WEBSITE, Status: 'New' });

  fetchImpl = function () { return mockResponse(403, 'Forbidden'); };
  const summary = global.auditEligibleProspectsBatch_(false);
  check('6. HTTP 403: batch reports 1 failed, 0 audited', summary.failed === 1 && summary.audited === 0);
  check('6. HTTP 403: no row written to Website Audits (unchanged automated-failure behavior)', env.audits.getLastRow() === 1);
  check('6. HTTP 403: Prospects cache marked Automated Failed', prospectRowAt(env.prospects, 2)['Website Audit State'] === 'Automated Failed');

  // A previously-failed prospect is not silently retried on the next scan.
  const p = prospectRowAt(env.prospects, 2);
  const classification = global.classifyAuditQueueRow_(p['Business'], p['Status'], p['Archived Date'], p['Website'], p['Website Audit State']);
  check('6. HTTP 403: no longer counted eligible on a later scan (reason previously_failed)', classification.eligible === false && classification.reason === 'previously_failed');
})();

// ===========================================================================
// 7. HTTP 404 remains an automated failure
// ===========================================================================
(function () {
  const env = resetEnvironment();
  const headers = global.getHeaders_('Prospects');
  setRow(env.prospects, 2, headers, { Business: BUSINESS, Website: WEBSITE, Status: 'New' });

  fetchImpl = function () { return mockResponse(404, 'Not Found'); };
  const summary = global.auditEligibleProspectsBatch_(false);
  check('7. HTTP 404: batch reports 1 failed, 0 audited', summary.failed === 1 && summary.audited === 0);
  check('7. HTTP 404: no row written to Website Audits (unchanged automated-failure behavior)', env.audits.getLastRow() === 1);
  check('7. HTTP 404: Prospects cache marked Automated Failed', prospectRowAt(env.prospects, 2)['Website Audit State'] === 'Automated Failed');
})();

// ===========================================================================
// 8. Manual audit can be recorded after a failure
// ===========================================================================
(function () {
  const env = resetEnvironment();
  const headers = global.getHeaders_('Prospects');
  setRow(env.prospects, 2, headers, { Business: BUSINESS, Website: WEBSITE, Status: 'New' });

  fetchImpl = function () { return mockResponse(403, 'Forbidden'); };
  global.auditEligibleProspectsBatch_(false);
  check('8. automated audit failed first, as expected', prospectRowAt(env.prospects, 2)['Website Audit State'] === 'Automated Failed');

  const manual = global.recordManualAudit_(BUSINESS, WEBSITE, '65', 'No mobile-friendly layout; outdated contact info.', 2);
  check('8. manual audit after failure reports ok=true', manual.ok === true);
  check('8. manual audit after failure creates exactly one Website Audits row', env.audits.getLastRow() === 2);
  check('8. Prospects cache updated to Manual Audit (no longer Automated Failed)', prospectRowAt(env.prospects, 2)['Website Audit State'] === 'Manual Audit');

  const p = prospectRowAt(env.prospects, 2);
  const classification = global.classifyAuditQueueRow_(p['Business'], p['Status'], p['Archived Date'], p['Website'], p['Website Audit State']);
  check('8. no longer queued for an automated retry after a manual audit', classification.eligible === false && classification.reason === 'already_audited');
})();

// ===========================================================================
// 9. Manual score is distinguished from an automated score
// ===========================================================================
(function () {
  const env = resetEnvironment();
  const manual = global.recordManualAudit_(BUSINESS, WEBSITE, '65', 'Manual findings.', 2);
  check('9. manual audit recorded', manual.ok === true);
  const manualRow = auditRowAt(env.audits, 2);
  check('9. manual row: Audit Source = Manual', manualRow['Audit Source'] === 'Manual');
  check('9. manual row: Score present but never labeled automated', manualRow['Score'] === 65 && manualRow['Mobile'] === '');

  const env2 = resetEnvironment();
  fetchImpl = function () { return mockResponse(200, GOOD_AUDIT_HTML); };
  global.performAndSaveAudit_(BUSINESS, WEBSITE);
  const autoRow = auditRowAt(env2.audits, 2);
  check('9. automated row: Audit Source = Automated, never Manual', autoRow['Audit Source'] === 'Automated');
})();

// ===========================================================================
// 10. Lead Intelligence handles a manual audit correctly
// ===========================================================================
(function () {
  const env = resetEnvironment();
  const headers = global.getHeaders_('Prospects');
  setRow(env.prospects, 2, headers, { Business: BUSINESS, Website: WEBSITE, Priority: 'High', Status: 'New' });
  global.recordManualAudit_(BUSINESS, WEBSITE, '90', 'Strong findings.', 2);

  global.ensureScoreColumns_(env.prospects);
  const liveHeaders = global.getLiveProspectsHeaders_(env.prospects);
  const scored = global.scoreProspectRow_(env.prospects, liveHeaders, 2);
  check('10. Lead Intelligence contributes real points for a scored manual audit', scored.score >= 27); // 90/100 * 30 max
  check('10. Score Reasons explicitly say "(Manual)"', /Website Audit \(Manual\):/.test(scored.reasons));
})();

// ===========================================================================
// 11. Command Center handles a manual audit correctly
// ===========================================================================
(function () {
  const env = resetEnvironment();
  const headers = global.getHeaders_('Prospects');
  setRow(env.prospects, 2, headers, { Business: BUSINESS, Website: WEBSITE, Priority: 'High', Status: 'New' });
  global.recordManualAudit_(BUSINESS, WEBSITE, '55', 'Manual findings for Command Center visibility.', 2);

  const records = global.buildProspectRecords_(env.prospects);
  const categorized = global.categorizeProspects_(records);
  const inAudited = categorized.auditedUncontacted.some(function (r) { return r.business === BUSINESS; });
  check('11. Command Center places the manually-audited, uncontacted prospect in auditedUncontacted', inAudited);
})();

// ===========================================================================
// 12. RCS remains excluded
// ===========================================================================
(function () {
  const env = resetEnvironment();
  const headers = global.getHeaders_('Prospects');
  setRow(env.prospects, 2, headers, { Business: 'Roman Creative Studio', Website: 'https://romancreativestudio.co', Status: 'New' });
  setRow(env.prospects, 3, headers, { Business: 'Legit Dental Co', Website: 'https://legitdental.example', Status: 'New' });

  const rcsRow = prospectRowAt(env.prospects, 2);
  const classification = global.classifyAuditQueueRow_(rcsRow['Business'], rcsRow['Status'], rcsRow['Archived Date'], rcsRow['Website'], rcsRow['Website Audit State']);
  check('12. RCS itself is classified rcs_excluded, never eligible', classification.eligible === false && classification.reason === 'rcs_excluded');

  fetchImpl = function () { return mockResponse(200, GOOD_AUDIT_HTML); };
  const summary = global.auditEligibleProspectsBatch_(false);
  check('12. the batch only audits the legitimate prospect (RCS never counted eligible)', summary.eligible === 1 && summary.audited === 1);
  check('12. RCS never gets a Website Audits row from the batch', global.findLatestAuditForBusiness_('Roman Creative Studio', 'https://romancreativestudio.co') === null);

  const records = global.buildProspectRecords_(env.prospects);
  check('12. RCS is still excluded from prospect records entirely', records.length === 1 && records[0].business === 'Legit Dental Co');
})();

// ===========================================================================
// 13. Existing Follow-Up behavior remains unchanged
// ===========================================================================
(function () {
  const env = resetEnvironment();
  const headers = global.getHeaders_('Prospects');
  const followUpDate = new Date(2026, 0, 15);
  setRow(env.prospects, 2, headers, { Business: BUSINESS, Website: WEBSITE, Priority: 'High', Status: 'New', 'Next Follow Up': followUpDate });

  const before = global.syncFollowUpsFromProspects_();
  check('13. Follow Ups sync still creates a row before the audit column exists', before.ok === true && before.created === 1);
  check('13. Follow Ups sheet gained the expected row', env.followUps.getLastRow() === 2);

  // Now run the audit-eligible batch — this is what provisions the new
  // "Website Audit State" column on Prospects for the first time.
  fetchImpl = function () { return mockResponse(200, GOOD_AUDIT_HTML); };
  global.auditEligibleProspectsBatch_(false);
  check('13. Website Audit State column now exists on Prospects', global.getLiveProspectsHeaders_(env.prospects).indexOf('Website Audit State') !== -1);

  // Follow-Up sync must still work identically afterward (header-relative
  // lookups mean an unrelated additive column changes nothing).
  const after = global.syncFollowUpsFromProspects_();
  check('13. Follow Ups sync still runs cleanly after the new column was added', after.ok === true);
  check('13. existing Follow Ups row was updated in place, not duplicated', after.updated === 1 && after.created === 0 && env.followUps.getLastRow() === 2);
})();

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log('\nAudit workflow dry-run results: ' + results.passed + '/' + results.total + ' passed');
if (results.failed > 0) {
  console.log('FAILURES:');
  results.failures.forEach(function (f) { console.log('  - ' + f); });
  process.exit(1);
} else {
  console.log('All audit workflow checks passed.');
  process.exit(0);
}
