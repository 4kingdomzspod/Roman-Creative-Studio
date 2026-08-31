/**
 * tests/github_sync_dryrun.js
 * ---------------------------------------------------------------------------
 * crm/revenue-automation regression suite: validates the repaired GitHub
 * Sync authentication (crm/CRM_Sync.gs) end to end against the REAL .gs
 * source, via the same indirect-eval mock-Sheets harness used by
 * tests/prospect_lifecycle_dryrun.js.
 *
 * Covers exactly the 8 required scenarios:
 *   1. token present -> authenticated request (Authorization: Bearer sent)
 *   2. token missing -> clear configuration error, no fetch attempted
 *   3. 200 response -> normal sync
 *   4. rate-limit response -> correct error
 *   5. authentication failure (401) -> correct error
 *   6. repository/file failure (404) -> correct error
 *   7. imported Prospect still passes through canonical initializeProspectRow_
 *   8. existing duplicate handling remains intact
 * Plus one bonus check: a bare 403 (no rate-limit headers) is classified as
 * a permission failure, not mislabeled "rate limit" (spec requirement 4).
 *
 * Run: node tests/github_sync_dryrun.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crmDir = path.join(__dirname, '..', 'crm');

// ---------------------------------------------------------------------------
// Minimal Sheets mock (same shape as tests/prospect_lifecycle_dryrun.js)
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
  alerts: [], // each entry: { title, message }
  ButtonSet: { OK: 'OK_BUTTONSET', YES_NO: 'YES_NO_BUTTONSET' },
  Button: { YES: 'YES', NO: 'NO', OK: 'OK' },
  alert: function () {
    const args = Array.prototype.slice.call(arguments);
    uiMock.alerts.push({ title: args[0], message: args[1] });
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

let fetchLog = []; // { url, opts }
let fetchImpl = function () { throw new Error('fetchImpl not set for this scenario'); };
const urlFetchAppMock = {
  fetch: function (url, opts) {
    fetchLog.push({ url: url, opts: opts || {} });
    return fetchImpl(url, opts);
  }
};
function mockResponse(code, body, headers) {
  return { getResponseCode: function () { return code; }, getContentText: function () { return body; }, getHeaders: function () { return headers || {}; } };
}

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
  newTrigger: function () { const b = { timeBased: function () { return b; }, everyHours: function () { return b; }, create: function () { return {}; } }; return b; },
  deleteTrigger: function () {}
};
global.Utilities = {
  formatDate: function (date, tz, fmt) {
    const yyyy = date.getFullYear(), mm = String(date.getMonth() + 1).padStart(2, '0'), dd = String(date.getDate()).padStart(2, '0');
    return yyyy + '-' + mm + '-' + dd + ' 00:00';
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
  const settings = currentSS.insertSheet('Settings');
  global.ensureHeaders_(prospects, global.getHeaders_('Prospects'));
  global.buildSettingsSheet_(settings); // CRM_Settings.gs — seeds SETTINGS_LISTS in A:F
  currentSS.__setActiveSheet('Prospects');
  uiMock.alerts.length = 0;
  fetchLog = [];
  scriptProps = {};
  return { ss: currentSS, prospects: prospects, settings: settings };
}

function lastAlertMessage() {
  return uiMock.alerts.length ? uiMock.alerts[uiMock.alerts.length - 1].message : '';
}

const CSV_ONE_ROW = 'Business Name,Industry,City,Website,Priority,Notes\n' +
  'GitHub Sync Test Co,Roofing,Sebring,githubsynctestco.com,High,Synced from GitHub\n';

function readField(sheet, row, name) {
  const headers = global.getLiveProspectsHeaders_(sheet);
  const idx = headers.indexOf(name);
  return idx === -1 ? undefined : sheet.getRange(row, idx + 1).getValue();
}

// ===========================================================================
// 1. Token present -> authenticated request sent with Bearer header
// ===========================================================================
(function () {
  const env = resetEnvironment();
  scriptProps.GITHUB_TOKEN = 'TEST-TOKEN-abc123';
  fetchImpl = function (url) {
    if (url.indexOf('api.github.com') !== -1) return mockResponse(200, JSON.stringify([{ sha: 'sha-auth-1' }]));
    return mockResponse(200, CSV_ONE_ROW);
  };
  global.menuSyncProspects_();
  check('1. a GitHub request was actually made when a token is configured', fetchLog.length > 0);
  const authHeaders = fetchLog.map(function (f) { return f.opts.headers && f.opts.headers['Authorization']; });
  check('1. every GitHub request carries "Authorization: Bearer <token>"', authHeaders.every(function (h) { return h === 'Bearer TEST-TOKEN-abc123'; }));
  check('1. requests use the current X-GitHub-Api-Version header', fetchLog.every(function (f) { return !!(f.opts.headers && f.opts.headers['X-GitHub-Api-Version']); }));
})();

// ===========================================================================
// 2. Token missing -> clear configuration error, no fetch attempted
// ===========================================================================
(function () {
  const env = resetEnvironment();
  delete scriptProps.GITHUB_TOKEN;
  fetchImpl = function () { throw new Error('must not be called when token is missing'); };
  let threw = false;
  try { global.menuSyncProspects_(); } catch (e) { threw = true; }
  check('2. missing token does not throw', !threw);
  check('2. missing token makes zero GitHub requests (no unauthenticated calls)', fetchLog.length === 0);
  check('2. missing token reports the exact required configuration message',
    lastAlertMessage() === 'GitHub sync requires GITHUB_TOKEN in Apps Script → Project Settings → Script Properties.');
})();

// ===========================================================================
// 3. 200 response -> normal sync
// ===========================================================================
(function () {
  const env = resetEnvironment();
  scriptProps.GITHUB_TOKEN = 'TEST-TOKEN-normal';
  fetchImpl = function (url) {
    if (url.indexOf('api.github.com') !== -1) return mockResponse(200, JSON.stringify([{ sha: 'sha-normal-1' }]));
    return mockResponse(200, CSV_ONE_ROW);
  };
  global.menuSyncProspects_();
  check('3. a 200/200 sync imports the new prospect', lastAlertMessage().indexOf('Imported: 1') !== -1);
  check('3. Prospects sheet actually gained the row', env.prospects.getLastRow() === 2);
  check('3. Settings Last Commit SHA updated', env.settings.getRange(4, 9).getValue() === 'sha-normal-1');
})();

// ===========================================================================
// 4. Rate-limit response -> correct error (X-RateLimit-Remaining: 0)
// ===========================================================================
(function () {
  const env = resetEnvironment();
  scriptProps.GITHUB_TOKEN = 'TEST-TOKEN-ratelimit';
  fetchImpl = function () {
    return mockResponse(403, '{"message":"API rate limit exceeded"}',
      { 'X-RateLimit-Remaining': '0', 'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + 3600) });
  };
  global.menuSyncProspects_();
  check('4. a genuine 403 rate limit (X-RateLimit-Remaining: 0) is reported as a rate-limit error',
    /rate limit/i.test(lastAlertMessage()));
  check('4. rate-limit message does not expose the token', lastAlertMessage().indexOf('TEST-TOKEN-ratelimit') === -1);
})();

// ===========================================================================
// 5. Authentication failure (401) -> correct error
// ===========================================================================
(function () {
  const env = resetEnvironment();
  scriptProps.GITHUB_TOKEN = 'TEST-TOKEN-badauth';
  fetchImpl = function () {
    return mockResponse(401, '{"message":"Bad credentials"}');
  };
  global.menuSyncProspects_();
  check('5. a 401 is reported as an authentication failure, not a generic error',
    /authentication failed/i.test(lastAlertMessage()));
  check('5. a 401 is NOT mislabeled as a rate limit', !/rate limit/i.test(lastAlertMessage()));
  check('5. auth-failure message does not expose the token', lastAlertMessage().indexOf('TEST-TOKEN-badauth') === -1);
})();

// ===========================================================================
// 6. Repository/file failure (404) -> correct error
// ===========================================================================
(function () {
  const env = resetEnvironment();
  scriptProps.GITHUB_TOKEN = 'TEST-TOKEN-404';
  fetchImpl = function (url) {
    if (url.indexOf('api.github.com') !== -1) return mockResponse(200, JSON.stringify([{ sha: 'sha-404-1' }]));
    return mockResponse(404, 'Not Found');
  };
  global.menuSyncProspects_();
  check('6. a 404 on the raw file fetch is reported with the HTTP code', lastAlertMessage().indexOf('404') !== -1);
  check('6. Settings Last Commit SHA is NOT updated when the file fetch itself failed', env.settings.getRange(4, 9).getValue() === '');
})();

// ===========================================================================
// 7. Imported Prospect still passes through canonical initializeProspectRow_
// ===========================================================================
(function () {
  const env = resetEnvironment();
  scriptProps.GITHUB_TOKEN = 'TEST-TOKEN-init';
  fetchImpl = function (url) {
    if (url.indexOf('api.github.com') !== -1) return mockResponse(200, JSON.stringify([{ sha: 'sha-init-1' }]));
    return mockResponse(200, CSV_ONE_ROW);
  };
  global.menuSyncProspects_();
  check('7. a GitHub-synced row gets Status="New" from the canonical initializeProspectRow_ (not blank)',
    readField(env.prospects, 2, 'Status') === 'New');
  check('7. a GitHub-synced row gets a real numeric Lead Score from the shared scoring engine',
    typeof readField(env.prospects, 2, 'Lead Score') === 'number');
})();

// ===========================================================================
// 8. Existing duplicate handling remains intact
// ===========================================================================
(function () {
  const env = resetEnvironment();
  scriptProps.GITHUB_TOKEN = 'TEST-TOKEN-dupe';
  fetchImpl = function (url) {
    if (url.indexOf('api.github.com') !== -1) return mockResponse(200, JSON.stringify([{ sha: 'sha-dupe-1' }]));
    return mockResponse(200, CSV_ONE_ROW);
  };
  global.menuSyncProspects_();
  check('8. first sync imports the business', env.prospects.getLastRow() === 2);

  fetchImpl = function (url) {
    if (url.indexOf('api.github.com') !== -1) return mockResponse(200, JSON.stringify([{ sha: 'sha-dupe-2' }])); // new commit, same business
    return mockResponse(200, CSV_ONE_ROW);
  };
  global.menuSyncProspects_();
  check('8. re-syncing the same business under a new commit SHA imports 0 (duplicate skipped)',
    lastAlertMessage().indexOf('Imported: 0') !== -1 && lastAlertMessage().indexOf('Skipped (duplicates): 1') !== -1);
  check('8. Prospects row count unchanged after the duplicate-only sync', env.prospects.getLastRow() === 2);
})();

// ===========================================================================
// Bonus: bare 403 (no rate-limit headers) is a permission failure, not
// mislabeled "rate limit" (spec requirement 4: differentiate failure kinds)
// ===========================================================================
(function () {
  const env = resetEnvironment();
  scriptProps.GITHUB_TOKEN = 'TEST-TOKEN-perm';
  fetchImpl = function () {
    return mockResponse(403, '{"message":"Resource not accessible by personal access token"}');
  };
  global.menuSyncProspects_();
  check('bonus. a 403 with no X-RateLimit-Remaining header is classified as a permission failure', /denied|permission/i.test(lastAlertMessage()));
  check('bonus. that permission failure is NOT mislabeled as a rate limit', !/rate limit/i.test(lastAlertMessage()));
})();

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log('\nGitHub Sync dry-run results: ' + results.passed + '/' + results.total + ' passed');
if (results.failed > 0) {
  console.log('FAILURES:');
  results.failures.forEach(function (f) { console.log('  - ' + f); });
  process.exit(1);
} else {
  console.log('All GitHub Sync checks passed.');
  process.exit(0);
}
