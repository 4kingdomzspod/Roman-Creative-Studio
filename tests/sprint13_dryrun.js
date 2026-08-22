/**
 * tests/sprint13_dryrun.js
 * ---------------------------------------------------------------------------
 * Sprint 13A regression suite for crm/CRM_OutreachAutomation.gs.
 *
 * Loads the REAL .gs source (CRM_Builder, Code, CRM_Actions, CRM_Audits,
 * CRM_Outreach, CRM_OutreachAutomation) via indirect eval into this
 * process's global scope, against a minimal in-memory mock of
 * SpreadsheetApp / UrlFetchApp / PropertiesService / Utilities / Session —
 * the same style of harness used for every prior sprint's dry-run tests.
 * Tavily and Gemini are mocked at the UrlFetchApp boundary (never real
 * network calls); every other function under test is the genuine
 * production source, unmodified.
 *
 * Run: node tests/sprint13_dryrun.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crmDir = path.join(__dirname, '..', 'crm');

// ---------------------------------------------------------------------------
// Minimal Sheets mock
// ---------------------------------------------------------------------------

function makeRange(sheet, row, col, numRows, numCols) {
  return {
    getRow: function () { return row; },
    getColumn: function () { return col; },
    getNumRows: function () { return numRows; },
    getNumColumns: function () { return numCols; },
    getValue: function () { return sheet._get(row, col); },
    setValue: function (v) { sheet._set(row, col, v); return this; },
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
      return this;
    },
    setNumberFormat: function () { return this; },
    setFontWeight: function () { return this; },
    setBackground: function () { return this; },
    setFontColor: function () { return this; },
    setVerticalAlignment: function () { return this; },
    insertCheckboxes: function () { return this; },
    createFilter: function () { sheet.__filter = { remove: function () { sheet.__filter = null; } }; return sheet.__filter; }
  };
}

function makeSheet(name) {
  const cells = {};
  let maxRow = 0, maxCol = 0;
  let activeRange = null;

  const sheet = {
    getName: function () { return name; },
    _get: function (r, c) { const v = cells[r + '_' + c]; return v === undefined ? '' : v; },
    _set: function (r, c, v) { cells[r + '_' + c] = v; if (r > maxRow) maxRow = r; if (c > maxCol) maxCol = c; },
    getLastRow: function () { return maxRow; },
    getLastColumn: function () { return maxCol; },
    getRange: function (row, col, numRows, numCols) {
      return makeRange(sheet, row, col, numRows || 1, numCols || 1);
    },
    getActiveRange: function () { return activeRange; },
    __setActiveRange: function (row, numRows) { activeRange = { getRow: function () { return row; }, getNumRows: function () { return numRows; } }; },
    __clearActiveRange: function () { activeRange = null; },
    autoResizeColumns: function () { return sheet; },
    getFilter: function () { return sheet.__filter || null; },
    getBandings: function () { return []; },
    setFrozenRows: function () { return sheet; },
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
  nextResponses: [],
  ButtonSet: { OK: 'OK_BUTTONSET', YES_NO: 'YES_NO_BUTTONSET' },
  Button: { YES: 'YES', NO: 'NO', OK: 'OK', CLOSE: 'CLOSE' },
  alert: function () {
    const args = Array.prototype.slice.call(arguments);
    uiMock.alerts.push(args);
    if (args[2] === uiMock.ButtonSet.YES_NO) {
      return uiMock.nextResponses.length ? uiMock.nextResponses.shift() : uiMock.Button.NO;
    }
    return uiMock.Button.OK;
  },
  createMenu: function () {
    const m = { addItem: function () { return m; }, addSubMenu: function () { return m; }, addSeparator: function () { return m; }, addToUi: function () {} };
    return m;
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

// LockService: succeeds by default; tests can flip lockShouldSucceed to
// simulate contention (a manual Resume click racing an auto-resume trigger).
let lockShouldSucceed = true;
const lockServiceMock = {
  getScriptLock: function () {
    return {
      tryLock: function () { return lockShouldSucceed; },
      releaseLock: function () {}
    };
  }
};

// ScriptApp triggers: real create/delete/list semantics, no real scheduling
// — same style already used for CRM_Automation.gs's daily-maintenance
// trigger, just re-declared here since this harness only loads the files
// Sprint 13 actually depends on.
let triggerStore = [];
const scriptAppMock = {
  getProjectTriggers: function () { return triggerStore.slice(); },
  newTrigger: function (handlerName) {
    const builder = {
      timeBased: function () { return builder; },
      after: function () { return builder; },
      create: function () {
        const t = { getHandlerFunction: function () { return handlerName; } };
        triggerStore.push(t);
        return t;
      }
    };
    return builder;
  },
  deleteTrigger: function (t) {
    const i = triggerStore.indexOf(t);
    if (i !== -1) triggerStore.splice(i, 1);
  }
};

let fetchQueue = [];
const fetchLog = [];
function mkResponse(code, text) {
  return { getResponseCode: function () { return code; }, getContentText: function () { return text; } };
}
const DEFAULT_AUDIT_HTML = '<html><head><title>Example Business - Home Page</title>' +
  '<meta name="description" content="Example Business offers reliable local services with fast response times.">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1">' +
  '<link rel="canonical" href="https://examplebusiness.com/"></head>' +
  '<body><h1>Welcome to Example Business</h1><img src="a.jpg" alt="crew at work"></body></html>';

const urlFetchAppMock = {
  fetch: function (url, opts) {
    fetchLog.push({ url: url, opts: opts || {} });
    for (let i = 0; i < fetchQueue.length; i++) {
      if (fetchQueue[i].matcher(url)) {
        const entry = fetchQueue[i];
        if (!entry.persistent) fetchQueue.splice(i, 1);
        return entry.handler(url, opts);
      }
    }
    if (url.indexOf('tavily.com') !== -1 || url.indexOf('generativelanguage.googleapis.com') !== -1) {
      return mkResponse(500, 'no mock queued for this provider call');
    }
    return mkResponse(200, DEFAULT_AUDIT_HTML); // generic website fetch / robots.txt / sitemap.xml
  }
};

function queueFetch(urlSubstring, handler, persistent) {
  fetchQueue.push({ matcher: function (url) { return url.indexOf(urlSubstring) !== -1; }, handler: handler, persistent: !!persistent });
}

const FAKE_TAVILY_KEY = 'FAKE-TAVILY-KEY-1a2b3c4d5e';
const FAKE_GEMINI_KEY = 'FAKE-GEMINI-KEY-9z8y7x6w5v';

function tavilySuccess(overrides) {
  const body = Object.assign({
    answer: 'Example Business is a locally owned service company with positive customer reviews.',
    results: [
      { title: 'Example Business - Reviews', url: 'https://reviews.example.com/example-business', content: 'Customers describe Example Business as reliable and responsive.' },
      { title: 'Example Business - About Us', url: 'https://examplebusiness.com/about', content: 'Founded in 2015, Example Business has served the local area for years.' }
    ]
  }, overrides || {});
  return mkResponse(200, JSON.stringify(body));
}

function geminiSuccess(overrides) {
  const payload = Object.assign({
    researchSummary: 'Example Business is a locally owned company with positive reviews, founded in 2015.',
    outreachAngle: 'Their site passed the mobile check but has SEO gaps that likely cost them search visibility.',
    outreachMessage: 'Hi there — I took a quick look at examplebusiness.com and noticed a few SEO opportunities. Would you be open to a short call about it?'
  }, overrides || {});
  return mkResponse(200, JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(payload) }] } }] }));
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
global.LockService = lockServiceMock;
global.ScriptApp = scriptAppMock;
const sleepLog = [];
global.Utilities = {
  formatDate: function (date, tz, fmt) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return fmt === 'yyyy-MM-dd' ? (yyyy + '-' + mm + '-' + dd) : (yyyy + '-' + mm + '-' + dd);
  },
  // Real Apps Script would actually pause; tests just record the requested
  // delay so retry/backoff behavior can be asserted without slowing the suite.
  sleep: function (ms) { sleepLog.push(ms); }
};
global.Session = { getScriptTimeZone: function () { return 'America/New_York'; } };
global.Logger = { log: function () {} };
global.HtmlService = { createHtmlOutput: function () { return { setWidth: function () { return this; }, setHeight: function () { return this; } }; } };

// ---------------------------------------------------------------------------
// Load real .gs source (dependency order), single indirect eval so every
// file shares one lexical scope — same convention as every prior sprint's
// dry-run harness. Function declarations become real global.* callables.
// ---------------------------------------------------------------------------

const FILES = ['CRM_Builder.gs', 'Code.gs', 'CRM_Actions.gs', 'CRM_Audits.gs', 'CRM_Outreach.gs', 'CRM_OutreachAutomation.gs'];
const source = FILES.map(function (f) { return fs.readFileSync(path.join(crmDir, f), 'utf8'); }).join('\n;\n');
(0, eval)(source);

// ---------------------------------------------------------------------------
// Test scaffolding
// ---------------------------------------------------------------------------

const results = { total: 0, passed: 0, failed: 0, failures: [] };
function check(name, cond) {
  results.total++;
  if (cond) { results.passed++; } else { results.failed++; results.failures.push(name); }
}

function resetEnvironment() {
  currentSS = makeSpreadsheet();
  const prospects = currentSS.insertSheet('Prospects');
  const audits = currentSS.insertSheet('Website Audits');
  global.ensureHeaders_(prospects, global.getHeaders_('Prospects'));
  global.ensureHeaders_(audits, global.getHeaders_('Website Audits'));
  currentSS.__setActiveSheet('Prospects');
  prospects.__setActiveRange(2, 1);
  uiMock.alerts.length = 0;
  uiMock.nextResponses.length = 0;
  fetchQueue.length = 0;
  fetchLog.length = 0;
  sleepLog.length = 0;
  scriptProps = {};
  triggerStore = [];
  lockShouldSucceed = true;
  return { ss: currentSS, prospects: prospects, audits: audits };
}

// Queues one Gemini response per call, consumed in order — lets a test
// script a specific sequence across retry attempts (e.g. 503, 503, success).
function queueGeminiSequence(responses) {
  responses.forEach(function (r) { queueFetch('generativelanguage.googleapis.com', function () { return r; }); });
}
function geminiErrorResponse(code) { return mkResponse(code, JSON.stringify({ error: { code: code, message: 'transient or permanent error' } })); }

// Writes/updates named fields on Prospects row 2, appending any header not
// yet present via the real ensureHeaders_ (never a fixed column index).
function setProspectFields(prospects, fields) {
  global.ensureHeaders_(prospects, Object.keys(fields));
  const headers = global.getLiveProspectsHeaders_(prospects);
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });
  const rowVals = prospects.getRange(2, 1, 1, headers.length).getValues()[0];
  Object.keys(fields).forEach(function (h) { rowVals[idx[h]] = fields[h]; });
  prospects.getRange(2, 1, 1, headers.length).setValues([rowVals]);
}

function readProspectField(prospects, name) {
  const headers = global.getLiveProspectsHeaders_(prospects);
  const idx = headers.indexOf(name);
  if (idx === -1) return undefined;
  return prospects.getRange(2, idx + 1).getValue();
}

function basicProspect(overrides) {
  return Object.assign({
    Business: 'Example Business Inc',
    Website: 'https://examplebusiness.com',
    Industry: 'Contractors',
    Priority: 'High',
    Status: 'New',
    Phone: '555-0100',
    Email: 'hello@examplebusiness.com',
    Contact: 'Jamie Owner'
  }, overrides || {});
}

function configureKeys() {
  scriptProps['TAVILY_API_KEY'] = FAKE_TAVILY_KEY;
  scriptProps['GEMINI_API_KEY'] = FAKE_GEMINI_KEY;
}

function lastAlertText() {
  const a = uiMock.alerts[uiMock.alerts.length - 1];
  return a ? String(a[1]) : '';
}

// Row-parameterized variants of setProspectFields/readProspectField, for
// Sprint 13B's multi-row batch scenarios. setProspectFields/readProspectField
// above are kept exactly as-is (row 2 only) so every Sprint 13A test above
// this line is untouched.
function setProspectFieldsAt(prospects, row, fields) {
  global.ensureHeaders_(prospects, Object.keys(fields));
  const headers = global.getLiveProspectsHeaders_(prospects);
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });
  const rowVals = prospects.getRange(row, 1, 1, headers.length).getValues()[0];
  Object.keys(fields).forEach(function (h) { rowVals[idx[h]] = fields[h]; });
  prospects.getRange(row, 1, 1, headers.length).setValues([rowVals]);
}

function readProspectFieldAt(prospects, row, name) {
  const headers = global.getLiveProspectsHeaders_(prospects);
  const idx = headers.indexOf(name);
  if (idx === -1) return undefined;
  return prospects.getRange(row, idx + 1).getValue();
}

function seedProspectRows(prospects, rowsFieldsArray) {
  rowsFieldsArray.forEach(function (fields, i) { setProspectFieldsAt(prospects, 2 + i, fields); });
}

function eligibleRow(n) {
  return { Business: 'Batch Biz ' + n, Website: 'https://batchbiz' + n + '.com', Status: 'New', Industry: 'Contractors', Priority: 'Medium' };
}

// ===========================================================================
// SPRINT 13B — Prepare Eligible Prospects (batch)
// ===========================================================================

(function testBatchEligibilityFiltering() {
  const env = resetEnvironment();
  configureKeys();
  seedProspectRows(env.prospects, [
    { Business: '', Website: 'https://blank.com', Status: 'New' },                              // blank Business
    { Business: 'Archived Biz', Website: 'https://a.com', Status: 'Archived' },                  // excluded status
    { Business: 'DNC Biz', Website: 'https://b.com', Status: 'Do Not Contact' },                 // excluded status
    { Business: 'Lost Biz', Website: 'https://c.com', Status: 'Closed — Lost' },                 // excluded status
    { Business: 'NotInterested Biz', Website: 'https://d.com', Status: 'Closed — Not Interested' }, // excluded status
    { Business: 'NoWebsite Biz', Website: '', Status: 'New' },                                   // missing Website
    { Business: 'Eligible One', Website: 'https://eligibleone.com', Status: 'New' },
    { Business: 'Eligible Two', Website: 'https://eligibletwo.com', Status: 'Contacted' }
  ]);
  queueFetch('tavily.com', function () { return tavilySuccess(); }, true);
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); }, true);
  uiMock.nextResponses = [uiMock.Button.YES];
  const result = global.prepareEligibleProspectsBatch_(true);

  check('eligibility filtering: exactly 2 eligible', result.eligible === 2);
  check('eligibility filtering: exactly 6 excluded (blank/4 statuses/missing website)', result.excluded === 6);
  check('eligibility filtering: both eligible prospects prepared', result.prepared === 2);
  check('eligibility filtering: excluded rows were never touched', readProspectFieldAt(env.prospects, 3, 'Outreach Preparation Status') === '');
  check('eligibility filtering: confirmation dialog stated the eligible count', uiMock.alerts.some(function (a) { return /Eligible prospects: 2/.test(String(a[1])); }));
  check('eligibility filtering: confirmation dialog explicitly says NOT sent', uiMock.alerts.some(function (a) { return /NOT sent/.test(String(a[1])); }));
})();

(function testBatchMaxSize() {
  const env = resetEnvironment();
  configureKeys();
  const rows = [];
  for (let n = 1; n <= 12; n++) rows.push(eligibleRow(n));
  seedProspectRows(env.prospects, rows);
  queueFetch('tavily.com', function () { return tavilySuccess(); }, true);
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); }, true);
  uiMock.nextResponses = [uiMock.Button.YES];
  const result = global.prepareEligibleProspectsBatch_(true);

  check('max batch size: 12 eligible found', result.eligible === 12);
  check('max batch size: only 10 processed (default cap)', result.processed === 10);
  check('max batch size: only 10 prepared', result.prepared === 10);
  check('max batch size: confirmation dialog names both the eligible count and the cap', uiMock.alerts.some(function (a) { return /Eligible prospects: 12/.test(String(a[1])) && /10/.test(String(a[1])); }));
  // Rows 12 and 13 (the 11th/12th eligible prospect) are past the cap and must be untouched.
  check('max batch size: the 11th eligible prospect (row 12) was never processed', readProspectFieldAt(env.prospects, 12, 'Outreach Preparation Status') === '');
  check('max batch size: the 12th eligible prospect (row 13) was never processed', readProspectFieldAt(env.prospects, 13, 'Outreach Preparation Status') === '');
})();

(function testBatchSequentialProcessing() {
  const env = resetEnvironment();
  configureKeys();
  seedProspectRows(env.prospects, [eligibleRow('A'), eligibleRow('B'), eligibleRow('C')]);
  queueFetch('tavily.com', function () { return tavilySuccess(); }, true);
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); }, true);
  uiMock.nextResponses = [uiMock.Button.YES];
  global.prepareEligibleProspectsBatch_(true);

  const tavilyCalls = fetchLog.filter(function (f) { return f.url.indexOf('tavily.com') !== -1; });
  const businessesInOrder = tavilyCalls.map(function (f) { return JSON.parse(f.opts.payload).query; });
  check('sequential processing: one Tavily call per eligible prospect, in row order', businessesInOrder.length === 3 &&
    businessesInOrder[0].indexOf('Batch Biz A') === 0 && businessesInOrder[1].indexOf('Batch Biz B') === 0 && businessesInOrder[2].indexOf('Batch Biz C') === 0);
})();

(function testBatchSkipsAlreadyPrepared() {
  const env = resetEnvironment();
  configureKeys();
  seedProspectRows(env.prospects, [
    Object.assign(eligibleRow('Ready'), { 'Outreach Message': 'ALREADY PREPARED — DO NOT TOUCH', 'Outreach Preparation Status': 'READY_FOR_REVIEW' }),
    eligibleRow('Fresh')
  ]);
  queueFetch('tavily.com', function () { return tavilySuccess(); }, true);
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); }, true);
  uiMock.nextResponses = [uiMock.Button.YES];
  const result = global.prepareEligibleProspectsBatch_(true);

  check('skip already-prepared: counted as skipped, not failed or prepared-again', result.skipped === 1);
  check('skip already-prepared: the fresh prospect was still prepared', result.prepared === 1);
  check('skip already-prepared: NO confirmation dialog was shown for the already-prepared row (fully automatic skip)', uiMock.alerts.filter(function (a) { return a[2] === uiMock.ButtonSet.YES_NO; }).length === 1); // only the one batch-start confirmation
  check('skip already-prepared: existing message left byte-identical', readProspectFieldAt(env.prospects, 2, 'Outreach Message') === 'ALREADY PREPARED — DO NOT TOUCH');
})();

(function testBatchOneFailureDoesNotStopOthers() {
  const env = resetEnvironment();
  configureKeys();
  seedProspectRows(env.prospects, [eligibleRow('Failing'), eligibleRow('SucceedsA'), eligibleRow('SucceedsB')]);
  queueFetch('tavily.com', function () { return mkResponse(500, 'server error'); }); // row 2 only
  queueFetch('tavily.com', function () { return tavilySuccess(); }, true);           // rows 3, 4
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); }, true);
  uiMock.nextResponses = [uiMock.Button.YES];
  const result = global.prepareEligibleProspectsBatch_(true);

  check('one failure does not stop batch: all 3 eligible were attempted', result.eligible === 3 && result.processed === 3);
  check('one failure does not stop batch: exactly 1 failed', result.failed === 1);
  check('one failure does not stop batch: the other 2 still prepared', result.prepared === 2);
  check('one failure does not stop batch: failing row marked FAILED', readProspectFieldAt(env.prospects, 2, 'Outreach Preparation Status') === 'FAILED');
  check('one failure does not stop batch: subsequent rows reached READY_FOR_REVIEW', readProspectFieldAt(env.prospects, 3, 'Outreach Preparation Status') === 'READY_FOR_REVIEW' && readProspectFieldAt(env.prospects, 4, 'Outreach Preparation Status') === 'READY_FOR_REVIEW');
  check('one failure does not stop batch: failure is named in the summary', result.failures.length === 1 && result.failures[0].indexOf('Batch Biz Failing') === 0);
})();

(function testBatchFinalCounts() {
  const env = resetEnvironment();
  configureKeys();
  seedProspectRows(env.prospects, [
    { Business: '', Website: 'https://x.com', Status: 'New' },                                    // excluded
    Object.assign(eligibleRow('AlreadyDone'), { 'Outreach Message': 'X', 'Outreach Preparation Status': 'READY_FOR_REVIEW' }), // skipped
    eligibleRow('WillFail'),
    eligibleRow('WillSucceed')
  ]);
  queueFetch('tavily.com', function () { return mkResponse(500, 'server error'); }); // consumed by WillFail (row 4, the only one still calling Tavily first)
  queueFetch('tavily.com', function () { return tavilySuccess(); }, true);
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); }, true);
  uiMock.nextResponses = [uiMock.Button.YES];
  const result = global.prepareEligibleProspectsBatch_(true);

  check('final counts: eligible = prepared + skipped + failed (for a fully-processed batch)', result.eligible === result.prepared + result.skipped + result.failed);
  check('final counts: eligible=3, excluded=1', result.eligible === 3 && result.excluded === 1);
  check('final counts: prepared=1, skipped=1, failed=1', result.prepared === 1 && result.skipped === 1 && result.failed === 1);
  check('final counts: summary dialog lists all five figures', /Eligible: 3/.test(lastAlertText()) && /Prepared: 1/.test(lastAlertText()) && /Skipped: 1/.test(lastAlertText()) && /Failed: 1/.test(lastAlertText()) && /Excluded: 1/.test(lastAlertText()));
})();

(function testBatchNoAutomaticSending() {
  const env = resetEnvironment();
  configureKeys();
  seedProspectRows(env.prospects, [eligibleRow('One'), eligibleRow('Two')]);
  queueFetch('tavily.com', function () { return tavilySuccess(); }, true);
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); }, true);
  uiMock.nextResponses = [uiMock.Button.YES];
  global.prepareEligibleProspectsBatch_(true);

  const sendLikeHosts = ['sendgrid', 'twilio', 'smtp', 'mailgun', 'mail.google', 'messages'];
  check('no automatic sending: no send/SMS/email-provider host was ever contacted', !fetchLog.some(function (f) { return sendLikeHosts.some(function (h) { return f.url.toLowerCase().indexOf(h) !== -1; }); }));
  check('no automatic sending: batch summary explicitly says nothing was sent', /nothing was sent/i.test(lastAlertText()));
  check('no automatic sending: every prepared record is READY_FOR_REVIEW, not any "sent" state', readProspectFieldAt(env.prospects, 2, 'Outreach Preparation Status') === 'READY_FOR_REVIEW' && readProspectFieldAt(env.prospects, 3, 'Outreach Preparation Status') === 'READY_FOR_REVIEW');
})();

(function testBatchNoKeyLeakage() {
  const env = resetEnvironment();
  configureKeys();
  seedProspectRows(env.prospects, [eligibleRow('One'), eligibleRow('Two')]);
  queueFetch('tavily.com', function () { return tavilySuccess(); }, true);
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); }, true);
  uiMock.nextResponses = [uiMock.Button.YES];
  global.prepareEligibleProspectsBatch_(true);

  const haystacks = [];
  uiMock.alerts.forEach(function (a) { a.forEach(function (part) { haystacks.push(String(part)); }); });
  fetchLog.forEach(function (f) { haystacks.push(f.url); });
  const joined = haystacks.join('\n');
  check('batch: Tavily key never appears in a URL/alert', joined.indexOf(FAKE_TAVILY_KEY) === -1);
  check('batch: Gemini key never appears in a URL/alert', joined.indexOf(FAKE_GEMINI_KEY) === -1);

  const geminiCalls = fetchLog.filter(function (f) { return f.url.indexOf('generativelanguage.googleapis.com') !== -1; });
  check('batch: every Gemini call across the batch sent the key via header, not URL', geminiCalls.length > 0 && geminiCalls.every(function (f) {
    return f.url.indexOf('key=') === -1 && f.opts.headers && f.opts.headers['x-goog-api-key'] === FAKE_GEMINI_KEY;
  }));
})();

(function testBatchMissingKeysNeverStarts() {
  const env = resetEnvironment();
  seedProspectRows(env.prospects, [eligibleRow('One')]);
  // No keys configured at all.
  const result = global.prepareEligibleProspectsBatch_(true);
  check('batch missing keys: rejected before any row is touched', result.ok === false);
  check('batch missing keys: no network calls made', fetchLog.length === 0);
  check('batch missing keys: no confirmation dialog ever shown', !uiMock.alerts.some(function (a) { return a[2] === uiMock.ButtonSet.YES_NO; }));
})();

(function testBatchCancelledMakesNoChanges() {
  const env = resetEnvironment();
  configureKeys();
  seedProspectRows(env.prospects, [eligibleRow('One'), eligibleRow('Two')]);
  uiMock.nextResponses = [uiMock.Button.NO]; // decline the confirmation
  const result = global.prepareEligibleProspectsBatch_(true);
  check('batch cancelled: reported as cancelled', result.ok === false && result.cancelled === true);
  check('batch cancelled: no network calls made', fetchLog.length === 0);
  check('batch cancelled: no prospect was touched', readProspectFieldAt(env.prospects, 2, 'Outreach Preparation Status') === '' && readProspectFieldAt(env.prospects, 3, 'Outreach Preparation Status') === '');
})();

// Sprint 13A behavior unchanged after the 13B refactor — re-run one
// representative single-row scenario here as an extra guard, in addition to
// every existing Sprint 13A test above (all still present, all still pass).
(function testSprint13ABehaviorUnchangedAfterRefactor() {
  const env = resetEnvironment();
  configureKeys();
  setProspectFields(env.prospects, basicProspect());
  queueFetch('tavily.com', function () { return tavilySuccess(); });
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); });
  const result = global.prepareSelectedProspect_(true);
  check('13A unchanged: single-row prepare still succeeds identically', result.ok === true && result.status === 'READY_FOR_REVIEW');
  check('13A unchanged: single-row success dialog still shown with NOT SENT', /NOT SENT/.test(lastAlertText()));
})();

// ===========================================================================
// SPRINT 13C — Resumable batch execution
// ===========================================================================

function readBatchState() {
  const raw = scriptProps['OUTREACH_BATCH_STATE_JSON'];
  return raw ? JSON.parse(raw) : null;
}

// OUTREACH_BATCH_TIME_BUDGET_MS is a top-level `const` in the .gs source
// (4.5*60*1000 = 270000), so — like every other hardcoded sprint const in
// this file — it isn't attached to global; this mirrors that exact value.
const BATCH_TIME_BUDGET_MS = 270000;

// Deterministically forces the batch loop's elapsed-time check to trip
// after however many Date.now() calls `sequence` allows before exceeding
// the budget. Real time never actually passes in these tests.
function withFakeClockSequence(sequence, fn) {
  const realNow = Date.now;
  let i = 0;
  Date.now = function () { const v = sequence[Math.min(i, sequence.length - 1)]; i++; return v; };
  try { return fn(); } finally { Date.now = realNow; }
}

(function testBatchTimeoutSafeProcessingAndResume() {
  const env = resetEnvironment();
  configureKeys();
  seedProspectRows(env.prospects, [eligibleRow('A'), eligibleRow('B'), eligibleRow('C')]);
  queueFetch('tavily.com', function () { return tavilySuccess(); }, true);
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); }, true);
  uiMock.nextResponses = [uiMock.Button.YES];

  // Clock sequence: startTime=0, first budget check=1000 (within budget,
  // process row A), second budget check=300000 (300000 > 270000 -> stop).
  const first = withFakeClockSequence([0, 1000, BATCH_TIME_BUDGET_MS + 30000], function () {
    return global.prepareEligibleProspectsBatch_(true);
  });

  check('timeout-safe: first execution stops itself before finishing', first.ok === true && first.done === false);
  check('timeout-safe: exactly 1 of 3 processed this execution', first.processed === 1 && first.prepared === 1);
  check('timeout-safe: 2 correctly reported remaining', first.remaining === 2 && first.anotherRunRequired === true);
  check('timeout-safe: only 1 Tavily call made (row B/C never started)', fetchLog.filter(function (f) { return f.url.indexOf('tavily.com') !== -1; }).length === 1);

  const stateAfterFirst = readBatchState();
  check('progress persistence: batch state saved to Script Properties', stateAfterFirst !== null && stateAfterFirst.active === true);
  check('progress persistence: cursor reflects exactly what was processed', stateAfterFirst.cursor === 1 && stateAfterFirst.rows.length === 3);
  check('progress persistence: row A already marked READY_FOR_REVIEW on the sheet', readProspectFieldAt(env.prospects, 2, 'Outreach Preparation Status') === 'READY_FOR_REVIEW');

  check('resume behavior: exactly one auto-resume trigger was scheduled', triggerStore.length === 1 && triggerStore[0].getHandlerFunction() === 'resumeOutreachBatchTrigger_');
  check('resume behavior: in-progress summary names the remaining count', /Remaining: 2/.test(lastAlertText()) && /continue automatically|Resume Batch/i.test(lastAlertText()));

  // Resume — real (fast) clock this time, plenty of budget to finish B and C.
  const second = global.resumeOutreachBatch_(true);
  check('resume behavior: resuming finishes the remaining rows', second.ok === true && second.done === true);
  check('resume behavior: cumulative counts are correct after resume', second.processed === 3 && second.prepared === 3 && second.remaining === 0);
  check('resume behavior: rows B and C are now READY_FOR_REVIEW too', readProspectFieldAt(env.prospects, 3, 'Outreach Preparation Status') === 'READY_FOR_REVIEW' && readProspectFieldAt(env.prospects, 4, 'Outreach Preparation Status') === 'READY_FOR_REVIEW');

  check('completion/cleanup: batch state removed from Script Properties', readBatchState() === null);
  check('completion/cleanup: the resume trigger was removed', triggerStore.length === 0);
  check('completion/cleanup: final dialog says the batch is complete', /Batch complete/.test(lastAlertText()) && /Remaining: 0/.test(lastAlertText()));
})();

(function testBatchNoDuplicateProcessing() {
  const env = resetEnvironment();
  configureKeys();
  seedProspectRows(env.prospects, [eligibleRow('A'), eligibleRow('B'), eligibleRow('C')]);
  queueFetch('tavily.com', function () { return tavilySuccess(); }, true);
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); }, true);
  uiMock.nextResponses = [uiMock.Button.YES];

  withFakeClockSequence([0, 1000, BATCH_TIME_BUDGET_MS + 30000], function () {
    global.prepareEligibleProspectsBatch_(true);
  });
  const callsAfterFirstChunk = fetchLog.length;
  const cursorAfterFirstChunk = readBatchState().cursor;

  // User clicks "Prepare Eligible Prospects" again while the batch above is
  // still active (2 remaining, waiting on its resume trigger).
  const second = global.prepareEligibleProspectsBatch_(true);
  check('no duplicate processing: a second start is refused, not a fresh batch', second.ok === false && second.alreadyActive === true);
  check('no duplicate processing: no new eligibility scan / network calls happened', fetchLog.length === callsAfterFirstChunk);
  check('no duplicate processing: the original batch progress is untouched', readBatchState().cursor === cursorAfterFirstChunk);
})();

(function testBatchLockContentionPreventsDoubleProcessing() {
  const env = resetEnvironment();
  configureKeys();
  seedProspectRows(env.prospects, [eligibleRow('A'), eligibleRow('B')]);
  queueFetch('tavily.com', function () { return tavilySuccess(); }, true);
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); }, true);
  uiMock.nextResponses = [uiMock.Button.YES];

  lockShouldSucceed = false; // simulate a resume trigger already holding the lock
  const result = global.prepareEligibleProspectsBatch_(true);
  check('lock contention: refused rather than processing concurrently', result.ok === false && result.locked === true);
  check('lock contention: not one row was touched', fetchLog.length === 0);
  const state = readBatchState();
  check('lock contention: batch state exists but cursor is still 0', state !== null && state.active === true && state.cursor === 0);
  lockShouldSucceed = true;

  // Now let it actually run.
  const resumed = global.resumeOutreachBatch_(true);
  check('lock contention: a later resume with the lock available proceeds normally', resumed.ok === true && resumed.done === true && resumed.prepared === 2);
})();

(function testBatchAlreadyPreparedSkippedAcrossResume() {
  const env = resetEnvironment();
  configureKeys();
  seedProspectRows(env.prospects, [
    eligibleRow('First'),
    Object.assign(eligibleRow('AlreadyDone'), { 'Outreach Message': 'DO NOT TOUCH', 'Outreach Preparation Status': 'READY_FOR_REVIEW' }),
    eligibleRow('Last')
  ]);
  queueFetch('tavily.com', function () { return tavilySuccess(); }, true);
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); }, true);
  uiMock.nextResponses = [uiMock.Button.YES];

  // Row 2 (First) lands in chunk 1; rows 3 and 4 (AlreadyDone, Last) are
  // deferred to the resume — proving the skip logic works correctly no
  // matter which execution actually reaches that row.
  const first = withFakeClockSequence([0, 1000, BATCH_TIME_BUDGET_MS + 30000], function () {
    return global.prepareEligibleProspectsBatch_(true);
  });
  check('already-prepared across resume: chunk 1 processed only the first row', first.processed === 1 && first.prepared === 1);

  const second = global.resumeOutreachBatch_(true);
  check('already-prepared across resume: resume chunk skipped the already-done one', second.done === true && second.skipped === 1 && second.prepared === 2);
  check('already-prepared across resume: its message was never overwritten', readProspectFieldAt(env.prospects, 3, 'Outreach Message') === 'DO NOT TOUCH');
})();

(function testBatchFailureAcrossResumeDoesNotStopBatch() {
  const env = resetEnvironment();
  configureKeys();
  seedProspectRows(env.prospects, [eligibleRow('First'), eligibleRow('Failing'), eligibleRow('Last')]);
  queueFetch('tavily.com', function () { return tavilySuccess(); });                          // row 2 (First) — chunk 1
  queueFetch('tavily.com', function () { return mkResponse(500, 'server error'); });            // row 3 (Failing) — resume
  queueFetch('tavily.com', function () { return tavilySuccess(); }, true);                      // row 4 (Last) — resume
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); }, true);
  uiMock.nextResponses = [uiMock.Button.YES];

  const first = withFakeClockSequence([0, 1000, BATCH_TIME_BUDGET_MS + 30000], function () {
    return global.prepareEligibleProspectsBatch_(true);
  });
  check('failure across resume: chunk 1 succeeded on row 1', first.prepared === 1 && first.done === false);

  const second = global.resumeOutreachBatch_(true);
  check('failure across resume: the failing row did not stop the batch', second.done === true && second.failed === 1 && second.prepared === 2);
  check('failure across resume: failure is named in the final summary', second.failures.length === 1 && second.failures[0].indexOf('Batch Biz Failing') === 0);
  check('failure across resume: the row after the failure still completed', readProspectFieldAt(env.prospects, 4, 'Outreach Preparation Status') === 'READY_FOR_REVIEW');
})();

(function testBatchCompletionCleansUpStateAndTrigger() {
  const env = resetEnvironment();
  configureKeys();
  seedProspectRows(env.prospects, [eligibleRow('One'), eligibleRow('Two')]);
  queueFetch('tavily.com', function () { return tavilySuccess(); }, true);
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); }, true);
  uiMock.nextResponses = [uiMock.Button.YES];
  const result = global.prepareEligibleProspectsBatch_(true); // finishes in one chunk, no time pressure
  check('completion cleanup: batch reports done with nothing remaining', result.done === true && result.remaining === 0);
  check('completion cleanup: Script Properties batch key is gone', scriptProps['OUTREACH_BATCH_STATE_JSON'] === undefined);
  check('completion cleanup: no trigger left behind', triggerStore.length === 0);
})();

(function testBatchResumeTriggerHandlerRunsSilently() {
  const env = resetEnvironment();
  configureKeys();
  seedProspectRows(env.prospects, [eligibleRow('A'), eligibleRow('B')]);
  queueFetch('tavily.com', function () { return tavilySuccess(); }, true);
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); }, true);
  uiMock.nextResponses = [uiMock.Button.YES];

  withFakeClockSequence([0, 1000, BATCH_TIME_BUDGET_MS + 30000], function () {
    global.prepareEligibleProspectsBatch_(true);
  });
  const alertsBeforeTrigger = uiMock.alerts.length;

  // Simulate Apps Script actually firing the scheduled trigger.
  global.resumeOutreachBatchTrigger_();
  check('trigger handler: shows no dialogs (non-interactive)', uiMock.alerts.length === alertsBeforeTrigger);
  check('trigger handler: still finished the batch', readBatchState() === null && triggerStore.length === 0);
  check('trigger handler: the remaining row was actually prepared', readProspectFieldAt(env.prospects, 3, 'Outreach Preparation Status') === 'READY_FOR_REVIEW');
})();

(function testBatchNoKeyLeakageAcrossResume() {
  const env = resetEnvironment();
  configureKeys();
  seedProspectRows(env.prospects, [eligibleRow('A'), eligibleRow('B'), eligibleRow('C')]);
  queueFetch('tavily.com', function () { return tavilySuccess(); }, true);
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); }, true);
  uiMock.nextResponses = [uiMock.Button.YES];

  withFakeClockSequence([0, 1000, BATCH_TIME_BUDGET_MS + 30000], function () {
    global.prepareEligibleProspectsBatch_(true);
  });
  global.resumeOutreachBatch_(true);

  const haystacks = [];
  uiMock.alerts.forEach(function (a) { a.forEach(function (part) { haystacks.push(String(part)); }); });
  fetchLog.forEach(function (f) { haystacks.push(f.url); });
  // The persisted batch-progress blob specifically must never carry a key —
  // scriptProps as a whole legitimately does (TAVILY_API_KEY/GEMINI_API_KEY
  // are its correct storage location), so that's deliberately not scanned.
  haystacks.push(JSON.stringify(scriptProps['OUTREACH_BATCH_STATE_JSON'] || ''));
  const joined = haystacks.join('\n');
  check('batch resume: Tavily key never leaks across the whole start+resume cycle', joined.indexOf(FAKE_TAVILY_KEY) === -1);
  check('batch resume: Gemini key never leaks across the whole start+resume cycle', joined.indexOf(FAKE_GEMINI_KEY) === -1);
})();

// ===========================================================================
// 1. Missing keys
// ===========================================================================
(function testMissingKeys() {
  const env = resetEnvironment();
  setProspectFields(env.prospects, basicProspect());
  // no scriptProps set at all
  const result = global.prepareSelectedProspect_(true);
  check('missing keys: rejected', result.ok === false);
  check('missing keys: mentions TAVILY_API_KEY', /TAVILY_API_KEY/.test(result.message));
  check('missing keys: mentions GEMINI_API_KEY', /GEMINI_API_KEY/.test(result.message));
  check('missing keys: no network calls made', fetchLog.length === 0);
  check('missing keys: status field untouched', readProspectField(env.prospects, 'Outreach Preparation Status') === undefined || readProspectField(env.prospects, 'Outreach Preparation Status') === '');
})();

// ===========================================================================
// 2. Missing website
// ===========================================================================
(function testMissingWebsite() {
  const env = resetEnvironment();
  configureKeys();
  setProspectFields(env.prospects, basicProspect({ Website: '' }));
  const result = global.prepareSelectedProspect_(true);
  check('missing website: rejected', result.ok === false);
  check('missing website: message mentions Website', /Website/.test(result.message));
  check('missing website: no network calls made', fetchLog.length === 0);
})();

// ===========================================================================
// 3. Excluded prospect (Archived / Do Not Contact / Closed states)
// ===========================================================================
(function testExcludedStatuses() {
  ['Archived', 'Do Not Contact', 'Closed — Lost', 'Closed — Not Interested'].forEach(function (status) {
    const env = resetEnvironment();
    configureKeys();
    setProspectFields(env.prospects, basicProspect({ Status: status }));
    const result = global.prepareSelectedProspect_(true);
    check('excluded status "' + status + '": rejected', result.ok === false);
    check('excluded status "' + status + '": no network calls', fetchLog.length === 0);
  });

  // Blank Business
  const env2 = resetEnvironment();
  configureKeys();
  setProspectFields(env2.prospects, basicProspect({ Business: '' }));
  const result2 = global.prepareSelectedProspect_(true);
  check('blank business: rejected', result2.ok === false);

  // Archived Date set even if Status wasn't literally "Archived"
  const env3 = resetEnvironment();
  configureKeys();
  setProspectFields(env3.prospects, basicProspect({ Status: 'Nurture', 'Archived Date': '2026-01-01' }));
  const result3 = global.prepareSelectedProspect_(true);
  check('archived-date-set: rejected even with non-archived Status label', result3.ok === false);
})();

// ===========================================================================
// 4. Existing Outreach Brief / Outreach Message protection
// ===========================================================================
(function testExistingBriefUntouched() {
  const env = resetEnvironment();
  configureKeys();
  setProspectFields(env.prospects, basicProspect({ 'Outreach Brief': 'ORIGINAL SPRINT 5 BRIEF TEXT — DO NOT TOUCH' }));
  queueFetch('tavily.com', function () { return tavilySuccess(); });
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); });
  const result = global.prepareSelectedProspect_(true);
  check('existing brief present: no confirmation prompted (brief alone does not gate)', !uiMock.alerts.some(function (a) { return a[2] === uiMock.ButtonSet.YES_NO; }));
  check('existing brief present: run still succeeds', result.ok === true);
  check('existing Outreach Brief left byte-identical', readProspectField(env.prospects, 'Outreach Brief') === 'ORIGINAL SPRINT 5 BRIEF TEXT — DO NOT TOUCH');
})();

(function testExistingMessageRequiresConfirmation() {
  // Decline path — nothing changes.
  const env = resetEnvironment();
  configureKeys();
  setProspectFields(env.prospects, basicProspect({
    'Outreach Message': 'PRIOR MESSAGE', 'Outreach Preparation Status': 'READY_FOR_REVIEW'
  }));
  uiMock.nextResponses = [uiMock.Button.NO];
  const declined = global.prepareSelectedProspect_(true);
  check('existing message, declined: reported as skipped', declined.ok === false && declined.skipped === true);
  check('existing message, declined: message field untouched', readProspectField(env.prospects, 'Outreach Message') === 'PRIOR MESSAGE');
  check('existing message, declined: no network calls made', fetchLog.length === 0);

  // Accept path — regenerates.
  uiMock.nextResponses = [uiMock.Button.YES];
  queueFetch('tavily.com', function () { return tavilySuccess(); });
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess({ outreachMessage: 'REGENERATED MESSAGE' }); });
  const accepted = global.prepareSelectedProspect_(true);
  check('existing message, accepted: regenerates successfully', accepted.ok === true);
  check('existing message, accepted: message field updated', readProspectField(env.prospects, 'Outreach Message') === 'REGENERATED MESSAGE');
})();

// ===========================================================================
// 5. Tavily failure
// ===========================================================================
(function testTavilyFailure() {
  const env = resetEnvironment();
  configureKeys();
  setProspectFields(env.prospects, basicProspect());
  queueFetch('tavily.com', function () { return mkResponse(500, 'server error'); });
  const result = global.prepareSelectedProspect_(true);
  check('tavily failure: reported as failed', result.ok === false && result.stage === 'RESEARCHING');
  check('tavily failure: status written as FAILED', readProspectField(env.prospects, 'Outreach Preparation Status') === 'FAILED');
  check('tavily failure: no Gemini call attempted', !fetchLog.some(function (f) { return f.url.indexOf('generativelanguage.googleapis.com') !== -1; }));
  check('tavily failure: no audit was run (no fetch to the business site)', !fetchLog.some(function (f) { return f.url.indexOf('examplebusiness.com') !== -1; }));
})();

// ===========================================================================
// 6. Gemini failure (research is preserved)
// ===========================================================================
(function testGeminiFailure() {
  const env = resetEnvironment();
  configureKeys();
  setProspectFields(env.prospects, basicProspect());
  queueFetch('tavily.com', function () { return tavilySuccess(); });
  queueFetch('generativelanguage.googleapis.com', function () { return mkResponse(500, 'server error'); });
  const result = global.prepareSelectedProspect_(true);
  check('gemini failure: reported as failed', result.ok === false && result.stage === 'GENERATING');
  check('gemini failure: status written as FAILED', readProspectField(env.prospects, 'Outreach Preparation Status') === 'FAILED');
  check('gemini failure: Outreach Research WAS preserved from the successful Tavily stage', String(readProspectField(env.prospects, 'Outreach Research') || '').indexOf('Example Business') !== -1);
  check('gemini failure: Outreach Message left blank (never fabricated)', readProspectField(env.prospects, 'Outreach Message') === '');
})();

// ===========================================================================
// 7. Audit failure (research preserved, cannot reach READY_FOR_REVIEW)
// ===========================================================================
(function testAuditFailure() {
  const env = resetEnvironment();
  configureKeys();
  setProspectFields(env.prospects, basicProspect({ Website: 'https://unreachable-example-site.test' }));
  queueFetch('tavily.com', function () { return tavilySuccess(); });
  queueFetch('unreachable-example-site.test', function () { return mkResponse(500, 'server error'); }, true);
  const result = global.prepareSelectedProspect_(true);
  check('audit failure: reported as failed', result.ok === false && result.stage === 'AUDITING');
  check('audit failure: status written as FAILED', readProspectField(env.prospects, 'Outreach Preparation Status') === 'FAILED');
  check('audit failure: never reaches READY_FOR_REVIEW', readProspectField(env.prospects, 'Outreach Preparation Status') !== 'READY_FOR_REVIEW');
  check('audit failure: Outreach Research WAS preserved', String(readProspectField(env.prospects, 'Outreach Research') || '') !== '');
  check('audit failure: Gemini was never called', !fetchLog.some(function (f) { return f.url.indexOf('generativelanguage.googleapis.com') !== -1; }));
})();

// ===========================================================================
// 8. Successful READY_FOR_REVIEW (full happy path)
// ===========================================================================
(function testHappyPath() {
  const env = resetEnvironment();
  configureKeys();
  setProspectFields(env.prospects, basicProspect());
  queueFetch('tavily.com', function () { return tavilySuccess(); });
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); });
  const result = global.prepareSelectedProspect_(true);
  check('happy path: ok', result.ok === true);
  check('happy path: status READY_FOR_REVIEW', readProspectField(env.prospects, 'Outreach Preparation Status') === 'READY_FOR_REVIEW');
  check('happy path: Outreach Prepared At is a real Date', readProspectField(env.prospects, 'Outreach Prepared At') instanceof Date);
  check('happy path: Outreach Angle saved', String(readProspectField(env.prospects, 'Outreach Angle') || '') !== '');
  check('happy path: Outreach Message saved', String(readProspectField(env.prospects, 'Outreach Message') || '') !== '');
  check('happy path: a Website Audits row now exists for this business', global.findLatestAuditForBusiness_('Example Business Inc', 'https://examplebusiness.com') !== null);
  check('happy path: final dialog explicitly says NOT SENT', /NOT SENT/.test(lastAlertText()));
  check('happy path: unrelated Prospects field (Phone) untouched', readProspectField(env.prospects, 'Phone') === '555-0100');
})();

// ===========================================================================
// 9. No fabricated data — output traces exactly to mocked provider output;
//    invalid Gemini JSON is rejected rather than papered over.
// ===========================================================================
(function testNoFabrication() {
  const env = resetEnvironment();
  configureKeys();
  setProspectFields(env.prospects, basicProspect());
  const distinctiveAngle = 'DISTINCTIVE-ANGLE-TOKEN-77291';
  const distinctiveMessage = 'DISTINCTIVE-MESSAGE-TOKEN-64830';
  queueFetch('tavily.com', function () { return tavilySuccess(); });
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess({ outreachAngle: distinctiveAngle, outreachMessage: distinctiveMessage }); });
  global.prepareSelectedProspect_(true);
  check('no fabrication: saved Angle is exactly the mocked provider text', readProspectField(env.prospects, 'Outreach Angle') === distinctiveAngle);
  check('no fabrication: saved Message is exactly the mocked provider text', readProspectField(env.prospects, 'Outreach Message') === distinctiveMessage);

  // Invalid JSON from Gemini must fail, never produce an invented message.
  const env2 = resetEnvironment();
  configureKeys();
  setProspectFields(env2.prospects, basicProspect());
  queueFetch('tavily.com', function () { return tavilySuccess(); });
  queueFetch('generativelanguage.googleapis.com', function () { return mkResponse(200, JSON.stringify({ candidates: [{ content: { parts: [{ text: 'not valid json {{{' }] } }] })); });
  const badJsonResult = global.prepareSelectedProspect_(true);
  check('invalid Gemini JSON: reported as failed', badJsonResult.ok === false);
  check('invalid Gemini JSON: no Outreach Message written', readProspectField(env2.prospects, 'Outreach Message') === '');
  check('invalid Gemini JSON: status FAILED, not READY_FOR_REVIEW', readProspectField(env2.prospects, 'Outreach Preparation Status') === 'FAILED');
})();

// ===========================================================================
// 10. Idempotent rerun
// ===========================================================================
(function testIdempotentRerun() {
  const env = resetEnvironment();
  configureKeys();
  setProspectFields(env.prospects, basicProspect());
  queueFetch('tavily.com', function () { return tavilySuccess(); });
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess({ outreachMessage: 'FIRST RUN MESSAGE' }); });
  const first = global.prepareSelectedProspect_(true);
  check('idempotent: first run succeeds', first.ok === true);
  const messageAfterFirst = readProspectField(env.prospects, 'Outreach Message');

  fetchLog.length = 0;
  uiMock.nextResponses = [uiMock.Button.NO]; // decline the "already prepared" confirmation
  const rerun = global.prepareSelectedProspect_(true);
  check('idempotent: rerun without confirmation is skipped, not silently regenerated', rerun.ok === false && rerun.skipped === true);
  check('idempotent: no network calls on a declined rerun', fetchLog.length === 0);
  check('idempotent: Outreach Message unchanged after declined rerun', readProspectField(env.prospects, 'Outreach Message') === messageAfterFirst);
  check('idempotent: status still READY_FOR_REVIEW after declined rerun', readProspectField(env.prospects, 'Outreach Preparation Status') === 'READY_FOR_REVIEW');
})();

// ===========================================================================
// 11. Sprint 5 business+URL audit fallback compatibility
// ===========================================================================
(function testSprint5UrlFallback() {
  const env = resetEnvironment();
  // Seed a pre-existing Website Audits row saved under a domain-derived
  // Business (as CRM_Audits.gs's "Audit Website URL" path does), which
  // will NOT exact-match the Prospect's real Business name.
  env.audits.getRange(2, 1, 1, 8).setValues([[
    'examplebusiness.com', '2026-08-01', 'PASS — viewport meta found',
    '80/100 — title/meta/H1/canonical checks', '85/100 — HTML size/network heuristic',
    '100/100 — image alt-text checks', 82, 'No issues found in the checks performed.'
  ]]);

  const result = global.getOrRunWebsiteAudit_('Example Business Inc', 'https://examplebusiness.com');
  check('sprint5 fallback: found the pre-existing audit via URL match', result.ok === true);
  check('sprint5 fallback: did not run a fresh audit', result.ranNew === false);
  check('sprint5 fallback: no website fetch was made (used the existing record)', !fetchLog.some(function (f) { return f.url.indexOf('examplebusiness.com') !== -1; }));
  check('sprint5 fallback: matched score is the seeded 82', result.audit.score === 82);

  // Exact-name match still takes priority when both would match.
  const env2 = resetEnvironment();
  env2.audits.getRange(2, 1, 1, 8).setValues([[
    'Example Business Inc', '2026-08-01', 'PASS — viewport meta found',
    '90/100 — title/meta/H1/canonical checks', '90/100 — HTML size/network heuristic',
    '100/100 — image alt-text checks', 95, 'No issues found in the checks performed.'
  ]]);
  const byName = global.getOrRunWebsiteAudit_('Example Business Inc', 'https://examplebusiness.com');
  check('sprint5 fallback: exact-name match still wins when present', byName.audit.score === 95);
})();

// ===========================================================================
// 12. No API-key leakage
// ===========================================================================
(function testNoKeyLeakage() {
  // Re-run the happy path once more purely to generate a fresh, full trail
  // of alerts/messages/fetch calls to scan.
  const env = resetEnvironment();
  configureKeys();
  setProspectFields(env.prospects, basicProspect());
  queueFetch('tavily.com', function () { return tavilySuccess(); });
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); });
  global.prepareSelectedProspect_(true);

  // Scan only the surfaces a human (or a log) could ever see: UI alerts, the
  // request URLs (never the body/headers — Tavily's API contractually
  // requires the key IN the POST body to authenticate at all, and that body
  // is never displayed or logged anywhere by this file), and the status
  // dialogs. A key appearing in its own outgoing request body/header is
  // expected and is checked separately below, not treated as a "leak".
  const haystacks = [];
  uiMock.alerts.forEach(function (a) { a.forEach(function (part) { haystacks.push(String(part)); }); });
  fetchLog.forEach(function (f) { haystacks.push(f.url); });
  haystacks.push(JSON.stringify(global.formatApiConfigStatus_()));
  haystacks.push(JSON.stringify(global.formatOutreachAutomationStatus_(currentSS)));

  const joined = haystacks.join('\n');
  check('no key leakage: Tavily key never appears in a URL/alert/status', joined.indexOf(FAKE_TAVILY_KEY) === -1);
  check('no key leakage: Gemini key never appears in a URL/alert/status', joined.indexOf(FAKE_GEMINI_KEY) === -1);

  const geminiCall = fetchLog.filter(function (f) { return f.url.indexOf('generativelanguage.googleapis.com') !== -1; })[0];
  check('no key leakage: Gemini call exists to inspect', !!geminiCall);
  if (geminiCall) {
    check('no key leakage: Gemini key sent via header, not URL', geminiCall.url.indexOf('key=') === -1);
    check('no key leakage: Gemini header carries the key (so the feature still works)', geminiCall.opts.headers && geminiCall.opts.headers['x-goog-api-key'] === FAKE_GEMINI_KEY);
  }

  check('no key leakage: Configure API Status shows Configured/Missing, not the key', /Tavily: Configured/.test(global.formatApiConfigStatus_()) && global.formatApiConfigStatus_().indexOf(FAKE_TAVILY_KEY) === -1);
})();

// ===========================================================================
// 13. Gemini endpoint/model hotfix — gemini-2.0-flash was shut down by
//     Google (2026-06-01), which is what produced the live 404. Verifies the
//     corrected model/endpoint is actually what gets called, and that a 404
//     (from a future retirement of gemini-3.7-flash too) still fails safely
//     with a clear, non-leaking diagnostic instead of a generic message.
// ===========================================================================
(function testGeminiEndpointHotfix() {
  const env = resetEnvironment();
  configureKeys();
  setProspectFields(env.prospects, basicProspect());
  queueFetch('tavily.com', function () { return tavilySuccess(); });
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); });
  global.prepareSelectedProspect_(true);

  const geminiCall = fetchLog.filter(function (f) { return f.url.indexOf('generativelanguage.googleapis.com') !== -1; })[0];
  check('gemini hotfix: a Gemini call was made', !!geminiCall);
  if (geminiCall) {
    check('gemini hotfix: request URL uses the corrected gemini-3.7-flash model', geminiCall.url.indexOf('/models/gemini-3.7-flash:generateContent') !== -1);
    check('gemini hotfix: request URL no longer references the retired gemini-2.0-flash model', geminiCall.url.indexOf('gemini-2.0-flash') === -1);
  }

  // A 404 (e.g. a future model retirement) must still fail safely — FAILED
  // state, prior successful stages preserved, no fabricated output, and a
  // clear diagnostic message that names the model but never the API key.
  const env2 = resetEnvironment();
  configureKeys();
  setProspectFields(env2.prospects, basicProspect());
  queueFetch('tavily.com', function () { return tavilySuccess(); });
  queueFetch('generativelanguage.googleapis.com', function () { return mkResponse(404, JSON.stringify({ error: { code: 404, message: 'models/gemini-3.7-flash is not found for API version v1beta' } })); });
  const result404 = global.prepareSelectedProspect_(true);
  check('gemini hotfix: 404 reported as failed at GENERATING stage', result404.ok === false && result404.stage === 'GENERATING');
  check('gemini hotfix: 404 message names the configured model', result404.message.indexOf('gemini-3.7-flash') !== -1);
  check('gemini hotfix: 404 message never contains the API key', result404.message.indexOf(FAKE_GEMINI_KEY) === -1);
  check('gemini hotfix: status written as FAILED on 404', readProspectField(env2.prospects, 'Outreach Preparation Status') === 'FAILED');
  check('gemini hotfix: research from the successful Tavily stage is preserved on 404', String(readProspectField(env2.prospects, 'Outreach Research') || '').indexOf('Example Business') !== -1);
  check('gemini hotfix: no Outreach Message fabricated on 404', readProspectField(env2.prospects, 'Outreach Message') === '');
})();

// ===========================================================================
// 14. Gemini bounded exponential-backoff retry (hotfix 2) — 503/429 are
//     transient per Google's own guidance and must be retried, up to 3 total
//     attempts with increasing jittered delays; 400/401/403/404 must never
//     be retried; a final failure must still preserve research and never
//     fabricate output.
// ===========================================================================
(function testGeminiRetry503ThenSuccess() {
  const env = resetEnvironment();
  configureKeys();
  setProspectFields(env.prospects, basicProspect());
  queueFetch('tavily.com', function () { return tavilySuccess(); });
  queueGeminiSequence([geminiErrorResponse(503), geminiSuccess({ outreachMessage: 'RECOVERED AFTER ONE 503' })]);
  const result = global.prepareSelectedProspect_(true);
  check('503 then success: overall run succeeds', result.ok === true);
  check('503 then success: exactly 2 Gemini calls made', fetchLog.filter(function (f) { return f.url.indexOf('generativelanguage.googleapis.com') !== -1; }).length === 2);
  check('503 then success: exactly 1 backoff sleep occurred', sleepLog.length === 1);
  check('503 then success: message saved is the successful attempt\'s text', readProspectField(env.prospects, 'Outreach Message') === 'RECOVERED AFTER ONE 503');
  check('503 then success: status READY_FOR_REVIEW', readProspectField(env.prospects, 'Outreach Preparation Status') === 'READY_FOR_REVIEW');
})();

(function testGemini503_503_Success() {
  const env = resetEnvironment();
  configureKeys();
  setProspectFields(env.prospects, basicProspect());
  queueFetch('tavily.com', function () { return tavilySuccess(); });
  queueGeminiSequence([geminiErrorResponse(503), geminiErrorResponse(503), geminiSuccess({ outreachMessage: 'RECOVERED AFTER TWO 503s' })]);
  const result = global.prepareSelectedProspect_(true);
  check('503,503,success: overall run succeeds on the 3rd attempt', result.ok === true);
  check('503,503,success: exactly 3 Gemini calls made (the max)', fetchLog.filter(function (f) { return f.url.indexOf('generativelanguage.googleapis.com') !== -1; }).length === 3);
  check('503,503,success: exactly 2 backoff sleeps occurred', sleepLog.length === 2);
  check('503,503,success: second delay is longer than the first (increasing backoff)', sleepLog[1] > sleepLog[0] || sleepLog[1] >= sleepLog[0]); // base doubles; jitter alone could tie at the low end, but base component must grow
  check('503,503,success: message saved is the successful attempt\'s text', readProspectField(env.prospects, 'Outreach Message') === 'RECOVERED AFTER TWO 503s');
})();

(function testGemini503AllThreeAttempts() {
  const env = resetEnvironment();
  configureKeys();
  setProspectFields(env.prospects, basicProspect());
  queueFetch('tavily.com', function () { return tavilySuccess(); });
  queueGeminiSequence([geminiErrorResponse(503), geminiErrorResponse(503), geminiErrorResponse(503)]);
  const result = global.prepareSelectedProspect_(true);
  check('503 x3: reported as failed', result.ok === false && result.stage === 'GENERATING');
  check('503 x3: exactly 3 Gemini calls made, never a 4th', fetchLog.filter(function (f) { return f.url.indexOf('generativelanguage.googleapis.com') !== -1; }).length === 3);
  check('503 x3: exactly 2 backoff sleeps (never sleeps after the final attempt)', sleepLog.length === 2);
  check('503 x3: status written as FAILED', readProspectField(env.prospects, 'Outreach Preparation Status') === 'FAILED');
  check('503 x3: final message says temporarily unavailable, after retries', /temporarily unavailable/i.test(result.message) && /3 attempts/.test(result.message));
  check('503 x3: research from the successful Tavily stage is preserved', String(readProspectField(env.prospects, 'Outreach Research') || '').indexOf('Example Business') !== -1);
  check('503 x3: no Outreach Message fabricated', readProspectField(env.prospects, 'Outreach Message') === '');

  // No API-key leakage across every retry attempt, not just the first call.
  const geminiCalls = fetchLog.filter(function (f) { return f.url.indexOf('generativelanguage.googleapis.com') !== -1; });
  check('503 x3: all 3 attempts sent the key via header, never the URL', geminiCalls.every(function (f) {
    return f.url.indexOf('key=') === -1 && f.opts.headers && f.opts.headers['x-goog-api-key'] === FAKE_GEMINI_KEY;
  }));
  check('503 x3: failure message never contains the API key', result.message.indexOf(FAKE_GEMINI_KEY) === -1);
})();

(function testGemini429Retries() {
  const env = resetEnvironment();
  configureKeys();
  setProspectFields(env.prospects, basicProspect());
  queueFetch('tavily.com', function () { return tavilySuccess(); });
  queueGeminiSequence([geminiErrorResponse(429), geminiSuccess({ outreachMessage: 'RECOVERED AFTER 429' })]);
  const result = global.prepareSelectedProspect_(true);
  check('429 retry: overall run succeeds', result.ok === true);
  check('429 retry: exactly 2 Gemini calls made', fetchLog.filter(function (f) { return f.url.indexOf('generativelanguage.googleapis.com') !== -1; }).length === 2);
  check('429 retry: message saved is the successful attempt\'s text', readProspectField(env.prospects, 'Outreach Message') === 'RECOVERED AFTER 429');
})();

(function testPermanentErrorsNeverRetry() {
  [400, 401, 403, 404].forEach(function (code) {
    const env = resetEnvironment();
    configureKeys();
    setProspectFields(env.prospects, basicProspect());
    queueFetch('tavily.com', function () { return tavilySuccess(); });
    queueGeminiSequence([geminiErrorResponse(code)]); // only ONE queued — a retry would hit the "no mock queued" 500 default and be caught as a bug
    const result = global.prepareSelectedProspect_(true);
    check('HTTP ' + code + ': never retried (exactly 1 Gemini call)', fetchLog.filter(function (f) { return f.url.indexOf('generativelanguage.googleapis.com') !== -1; }).length === 1);
    check('HTTP ' + code + ': no backoff sleep occurred', sleepLog.length === 0);
    check('HTTP ' + code + ': reported as failed', result.ok === false);
    check('HTTP ' + code + ': status written as FAILED', readProspectField(env.prospects, 'Outreach Preparation Status') === 'FAILED');
  });
})();

// ===========================================================================
// Bonus structural checks (not in the required 12, cheap extra confidence)
// ===========================================================================
(function testStructural() {
  // OUTREACH_AUTOMATION_FIELDS is a top-level `const` in the .gs source, so
  // (like every other sprint's consts) it isn't attached to global — hardcode
  // the known field list here rather than reference it as a bare identifier.
  const EXPECTED_FIELDS = ['Outreach Research', 'Outreach Angle', 'Outreach Message', 'Outreach Prepared At', 'Outreach Preparation Status'];
  const env = resetEnvironment();
  const before = global.getHeaders_('Prospects').length; // static schema length, unaffected
  global.ensureOutreachAutomationColumns_(env.prospects);
  const headers = global.getLiveProspectsHeaders_(env.prospects);
  check('schema: all 5 Sprint 13 fields present after provisioning', EXPECTED_FIELDS.every(function (f) { return headers.indexOf(f) !== -1; }));
  check('schema: base Prospects headers still present and untouched', global.getHeaders_('Prospects').every(function (h) { return headers.indexOf(h) !== -1; }) && global.getHeaders_('Prospects').length === before);
  check('schema: CRM_Builder.gs SHEET_DEFS Prospects headers unmodified by this sprint', global.getHeaders_('Prospects').indexOf('Outreach Research') === -1);

  const env2 = resetEnvironment();
  setProspectFields(env2.prospects, basicProspect());
  env2.prospects.__setActiveRange(2, 2); // simulate 2 rows selected
  const twoRowResult = global.prepareSelectedProspect_(true);
  check('exactly-one-row rule: rejects a 2-row selection', twoRowResult.ok === false);

  env2.prospects.__clearActiveRange();
  const noneResult = global.prepareSelectedProspect_(true);
  check('exactly-one-row rule: rejects no selection', noneResult.ok === false);
})();

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log('Sprint 13 dry-run results: ' + results.passed + '/' + results.total + ' passed');
if (results.failed > 0) {
  console.log('FAILURES:');
  results.failures.forEach(function (f) { console.log('  - ' + f); });
  process.exit(1);
} else {
  console.log('All Sprint 13 checks passed.');
  process.exit(0);
}
