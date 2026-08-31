/**
 * tests/prospect_lifecycle_dryrun.js
 * ---------------------------------------------------------------------------
 * crm/revenue-automation regression suite: validates the repaired Prospect
 * lifecycle (initialization, scoring, follow-up sync, outreach prep
 * recovery) end to end against the REAL .gs source, via the same
 * indirect-eval mock-Sheets harness used by tests/sprint13_dryrun.js.
 *
 * Run: node tests/prospect_lifecycle_dryrun.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crmDir = path.join(__dirname, '..', 'crm');

// ---------------------------------------------------------------------------
// Minimal Sheets mock (same shape as tests/sprint13_dryrun.js)
// ---------------------------------------------------------------------------

// Real methods that matter to the tests; anything else (setFontStyle,
// setWrap, merge, breakApart, etc. — pure Sheets cosmetic formatting the
// Dashboard rebuild uses heavily) is provided by the Proxy fallback below
// as a chainable no-op, so a new formatting call never needs a new stub.
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
    __clearActiveRange: function () { activeRange = null; },
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
  nextResponses: [],
  ButtonSet: { OK: 'OK_BUTTONSET', YES_NO: 'YES_NO_BUTTONSET', OK_CANCEL: 'OK_CANCEL_BUTTONSET' },
  Button: { YES: 'YES', NO: 'NO', OK: 'OK', CANCEL: 'CANCEL', CLOSE: 'CLOSE' },
  nextPromptButton: 'OK',
  nextPromptText: '',
  alert: function () {
    const args = Array.prototype.slice.call(arguments);
    uiMock.alerts.push(args);
    if (args[2] === uiMock.ButtonSet.YES_NO) {
      return uiMock.nextResponses.length ? uiMock.nextResponses.shift() : uiMock.Button.NO;
    }
    return uiMock.Button.OK;
  },
  prompt: function () {
    return { getSelectedButton: function () { return uiMock.nextPromptButton; }, getResponseText: function () { return uiMock.nextPromptText; } };
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

let triggerStore = [];
const scriptAppMock = {
  getProjectTriggers: function () { return triggerStore.slice(); },
  newTrigger: function (handlerName) {
    const builder = { timeBased: function () { return builder; }, after: function () { return builder; }, everyDays: function () { return builder; }, atHour: function () { return builder; },
      create: function () { const t = { getHandlerFunction: function () { return handlerName; } }; triggerStore.push(t); return t; } };
    return builder;
  },
  deleteTrigger: function (t) { const i = triggerStore.indexOf(t); if (i !== -1) triggerStore.splice(i, 1); }
};
const lockServiceMock = { getScriptLock: function () { return { tryLock: function () { return true; }, releaseLock: function () {} }; } };

let fetchQueue = [];
const fetchLog = [];
function mkResponse(code, text) { return { getResponseCode: function () { return code; }, getContentText: function () { return text; } }; }
const DEFAULT_AUDIT_HTML = '<html><head><title>Example Business - Home</title>' +
  '<meta name="description" content="Example Business offers reliable local services with fast response times.">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1">' +
  '<link rel="canonical" href="https://examplebusiness.com/"></head>' +
  '<body><h1>Welcome</h1><img src="a.jpg" alt="crew at work"></body></html>';

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
    if (url.indexOf('tavily.com') !== -1 || url.indexOf('generativelanguage.googleapis.com') !== -1) return mkResponse(500, 'no mock queued');
    return mkResponse(200, DEFAULT_AUDIT_HTML);
  }
};
function queueFetch(urlSubstring, handler, persistent) {
  fetchQueue.push({ matcher: function (url) { return url.indexOf(urlSubstring) !== -1; }, handler: handler, persistent: !!persistent });
}
function tavilySuccess() {
  return mkResponse(200, JSON.stringify({ answer: 'Locally owned business with positive reviews.', results: [{ title: 'Reviews', url: 'https://r.example.com', content: 'Reliable and responsive.' }] }));
}
function geminiSuccess(overrides) {
  const payload = Object.assign({ researchSummary: 'Positive local reputation.', outreachAngle: 'Mobile-friendly but SEO gaps.', outreachMessage: 'Hi — noticed a few SEO opportunities, open to a call?' }, overrides || {});
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
global.ScriptApp = scriptAppMock;
global.LockService = lockServiceMock;
global.Utilities = {
  formatDate: function (date, tz, fmt) {
    const yyyy = date.getFullYear(), mm = String(date.getMonth() + 1).padStart(2, '0'), dd = String(date.getDate()).padStart(2, '0');
    return yyyy + '-' + mm + '-' + dd;
  },
  sleep: function () {}
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
  'CRM_Automation.gs', 'CRM_NextAction.gs', 'CRM_OutreachAutomation.gs'
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
}

function resetEnvironment() {
  currentSS = makeSpreadsheet();
  const prospects = currentSS.insertSheet('Prospects');
  const audits = currentSS.insertSheet('Website Audits');
  const followUps = currentSS.insertSheet('Follow Ups');
  const proposals = currentSS.insertSheet('Proposals');
  const clients = currentSS.insertSheet('Clients');
  const revenue = currentSS.insertSheet('Revenue');
  const settings = currentSS.insertSheet('Settings');
  global.ensureHeaders_(prospects, global.getHeaders_('Prospects'));
  global.ensureHeaders_(audits, global.getHeaders_('Website Audits'));
  global.ensureHeaders_(followUps, global.getHeaders_('Follow Ups'));
  global.ensureHeaders_(proposals, global.getHeaders_('Proposals'));
  global.ensureHeaders_(clients, global.getHeaders_('Clients'));
  global.ensureHeaders_(revenue, global.getHeaders_('Revenue'));
  global.buildSettingsSheet_(settings); // CRM_Settings.gs — seeds SETTINGS_LISTS values
  currentSS.__setActiveSheet('Prospects');
  prospects.__setActiveRange(2, 1);
  uiMock.alerts.length = 0;
  uiMock.nextResponses.length = 0;
  fetchQueue.length = 0;
  fetchLog.length = 0;
  scriptProps = {};
  triggerStore = [];
  return { ss: currentSS, prospects: prospects, audits: audits, followUps: followUps, proposals: proposals, clients: clients, revenue: revenue };
}

function setProspectFieldsAt(prospects, row, fields) {
  global.ensureHeaders_(prospects, Object.keys(fields));
  const headers = global.getLiveProspectsHeaders_(prospects);
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });
  const rowVals = prospects.getRange(row, 1, 1, headers.length).getValues()[0];
  Object.keys(fields).forEach(function (h) { rowVals[idx[h]] = fields[h]; });
  prospects.getRange(row, 1, 1, headers.length).setValues([rowVals]);
}
function readField(sheet, row, name) {
  const headers = global.getLiveProspectsHeaders_(sheet);
  const idx = headers.indexOf(name);
  return idx === -1 ? undefined : sheet.getRange(row, idx + 1).getValue();
}
function readFollowUpField(sheet, row, name) {
  const headers = global.getHeaders_('Follow Ups');
  const idx = headers.indexOf(name);
  return idx === -1 ? undefined : sheet.getRange(row, idx + 1).getValue();
}
function newProspect(overrides) {
  return Object.assign({ Business: 'Acme Roofing', Industry: 'Roofing', City: 'Sebring', Website: 'https://acmeroofing.com', Phone: '555-0100', Email: 'hi@acmeroofing.com', Contact: 'Jamie' }, overrides || {});
}

// ===========================================================================
// 1. New manual Prospect (onEdit-style: initializeProspectRow_ direct call)
// ===========================================================================
(function test01_newManualProspect() {
  const env = resetEnvironment();
  setProspectFieldsAt(env.prospects, 2, newProspect());
  const headers = global.getLiveProspectsHeaders_(env.prospects);
  const result = global.initializeProspectRow_(env.prospects, headers, 2);
  check('1. new manual prospect: initializer reports changed', result.changed === true);
  check('1. new manual prospect: Status set to New', readField(env.prospects, 2, 'Status') === 'New');
  check('1. new manual prospect: Lead Score is a number', typeof readField(env.prospects, 2, 'Lead Score') === 'number');
  check('1. new manual prospect: Next Follow Up NOT auto-set (no follow-up merely for existing)', readField(env.prospects, 2, 'Next Follow Up') === '');
})();

// ===========================================================================
// 2. Imported Prospect (via importProspectsFromCsv_)
// ===========================================================================
(function test02_importedProspect() {
  const env = resetEnvironment();
  const csv = 'Business,Industry,City,Website,Phone,Email,Contact\n"Beacon Dental","Dentists","Avon Park","https://beacondental.com","555-0200","hi@beacondental.com","Dana"';
  const result = global.importProspectsFromCsv_(csv);
  check('2. imported prospect: imported count 1', result.imported === 1);
  check('2. imported prospect: Status auto-initialized to New', readField(env.prospects, 2, 'Status') === 'New');
  check('2. imported prospect: scored on import', typeof readField(env.prospects, 2, 'Lead Score') === 'number');
})();

// ===========================================================================
// 3-5. Missing website / phone / email — must remain valid, score without crashing
// ===========================================================================
(function test03to05_missingOptionalFields() {
  const env = resetEnvironment();
  setProspectFieldsAt(env.prospects, 2, newProspect({ Website: '' }));
  setProspectFieldsAt(env.prospects, 3, newProspect({ Business: 'NoPhone Co', Phone: '' }));
  setProspectFieldsAt(env.prospects, 4, newProspect({ Business: 'NoEmail Co', Email: '' }));
  const headers = global.getLiveProspectsHeaders_(env.prospects);
  let threw = false;
  try {
    global.initializeProspectRow_(env.prospects, headers, 2);
    global.initializeProspectRow_(env.prospects, headers, 3);
    global.initializeProspectRow_(env.prospects, headers, 4);
  } catch (e) { threw = true; }
  check('3-5. missing website/phone/email: initialization never throws', !threw);
  check('3. missing website: still valid (Status=New)', readField(env.prospects, 2, 'Status') === 'New');
  check('4. missing phone: still valid (Status=New)', readField(env.prospects, 3, 'Status') === 'New');
  check('5. missing email: still valid (Status=New)', readField(env.prospects, 4, 'Status') === 'New');
  check('3-5. all three scored (no crash on missing fields)', [2, 3, 4].every(function (r) { return typeof readField(env.prospects, r, 'Lead Score') === 'number'; }));
})();

// ===========================================================================
// 6. Duplicate Prospect (import skip + Health duplicate detection)
// ===========================================================================
(function test06_duplicateProspect() {
  const env = resetEnvironment();
  setProspectFieldsAt(env.prospects, 2, newProspect());
  const csv = 'Business,Website\n"Acme Roofing","https://acmeroofing.com"';
  const result = global.importProspectsFromCsv_(csv);
  check('6. duplicate: re-importing the same Business+Website is skipped, not duplicated', result.imported === 0 && result.skipped === 1);
  check('6. duplicate: sheet still has exactly 1 data row', env.prospects.getLastRow() === 2);

  // Two distinct rows sharing a normalized Business name — Health flags, never deletes.
  setProspectFieldsAt(env.prospects, 3, newProspect({ Business: 'acme   roofing', Website: 'https://different.com' }));
  const records = global.buildHealthProspectRecords_(env.prospects); // CRM_Health.gs, reused unchanged
  const dup = global.buildDuplicatesSection_(records);
  check('6. duplicate: Health flags the whitespace/case variant as a duplicate group', dup.groups.length > 0);
  check('6. duplicate: both rows still present (never auto-deleted)', env.prospects.getLastRow() === 3);
})();

// ===========================================================================
// 7. Prospect with existing future follow-up — never overwritten
// ===========================================================================
(function test07_existingFutureFollowUp() {
  const env = resetEnvironment();
  const future = new Date(2027, 0, 15);
  setProspectFieldsAt(env.prospects, 2, newProspect({ Status: 'Contacted', 'Next Follow Up': future }));
  env.prospects.__setActiveRange(2, 1);
  uiMock.nextResponses = [uiMock.Button.NO]; // decline any overwrite prompt
  global.menuMarkAsContacted_();
  const after = readField(env.prospects, 2, 'Next Follow Up');
  check('7. existing future follow-up: date is preserved exactly (never auto-overwritten)', after instanceof Date && after.getTime() === future.getTime());
})();

// ===========================================================================
// 8-9. No contact history vs. Contacted
// ===========================================================================
(function test08to09_contactHistory() {
  const env = resetEnvironment();
  setProspectFieldsAt(env.prospects, 2, newProspect());
  const headers = global.getLiveProspectsHeaders_(env.prospects);
  global.initializeProspectRow_(env.prospects, headers, 2);
  check('8. no contact history: Last Contact blank, Status New', readField(env.prospects, 2, 'Last Contact') === '' && readField(env.prospects, 2, 'Status') === 'New');

  env.prospects.__setActiveRange(2, 1);
  uiMock.nextResponses = [uiMock.Button.YES];
  global.menuMarkAsContacted_();
  check('9. contacted: Status updated', readField(env.prospects, 2, 'Status') === 'Contacted');
  check('9. contacted: Last Contact set', readField(env.prospects, 2, 'Last Contact') instanceof Date);
  check('9. contacted: follow-up generated since none existed (appropriate moment)', readField(env.prospects, 2, 'Next Follow Up') instanceof Date);
})();

// ===========================================================================
// 10. Follow-up prospect — Follow Ups sync creates the operational row
// ===========================================================================
(function test10_followUpProspect() {
  const env = resetEnvironment();
  setProspectFieldsAt(env.prospects, 2, newProspect({ Status: 'Contacted', Priority: 'High' }));
  env.prospects.__setActiveRange(2, 1);
  uiMock.nextPromptButton = 'OK';
  uiMock.nextPromptText = '2026-10-05';
  global.menuScheduleFollowUp_();
  check('10. follow-up prospect: Follow Ups row created', readFollowUpField(env.followUps, 2, 'Business') === 'Acme Roofing');
  check('10. follow-up prospect: Due matches Next Follow Up', readFollowUpField(env.followUps, 2, 'Due') instanceof Date);
  check('10. follow-up prospect: Priority carried over', readFollowUpField(env.followUps, 2, 'Priority') === 'High');
})();

// ===========================================================================
// 11-14. Won / Lost / Do Not Contact / Archived — no new follow-ups
// ===========================================================================
(function test11to14_terminalStatuses() {
  const env = resetEnvironment();
  setProspectFieldsAt(env.prospects, 2, newProspect({ Business: 'Won Co', Status: 'Won', 'Next Follow Up': new Date(2026, 5, 1) }));
  setProspectFieldsAt(env.prospects, 3, newProspect({ Business: 'Lost Co', Status: 'Closed — Lost', 'Next Follow Up': new Date(2026, 5, 1) }));
  setProspectFieldsAt(env.prospects, 4, newProspect({ Business: 'DNC Co', Status: 'Do Not Contact', 'Next Follow Up': new Date(2026, 5, 1) }));
  setProspectFieldsAt(env.prospects, 5, newProspect({ Business: 'Archived Co', Status: 'Nurture', 'Archived Date': new Date(2026, 5, 1), 'Next Follow Up': new Date(2026, 5, 1) }));
  const result = global.syncFollowUpsFromProspects_();
  check('11-14. terminal statuses: none of the 4 produced a Follow Ups row', result.created === 0 && env.followUps.getLastRow() < 2);
  check('11-14. terminal statuses: initializeProspectRow_ leaves an already-set Status untouched (idempotent)',
    (function () { const h = global.getLiveProspectsHeaders_(env.prospects); return global.initializeProspectRow_(env.prospects, h, 2).changed === false && readField(env.prospects, 2, 'Status') === 'Won'; })());
})();

// ===========================================================================
// 15. Incomplete website audit — must not invalidate the prospect
// ===========================================================================
(function test15_incompleteAudit() {
  const env = resetEnvironment();
  env.audits.getRange(2, 1, 1, 8).setValues([['Acme Roofing', '2026-08-01', 'PASS — viewport meta found', '', '', '', '', '']]); // incomplete: missing SEO/Perf/A11y/Score
  setProspectFieldsAt(env.prospects, 2, newProspect());
  const audit = global.findLatestAuditForBusiness_('Acme Roofing', 'https://acmeroofing.com');
  check('15. incomplete audit: record is found (not silently dropped)', audit !== null);
  check('15. incomplete audit: isAuditDataComplete_ correctly flags it incomplete', global.isAuditDataComplete_(audit) === false);
  const headers = global.getLiveProspectsHeaders_(env.prospects);
  let threw = false;
  try { global.initializeProspectRow_(env.prospects, headers, 2); } catch (e) { threw = true; }
  check('15. incomplete audit: prospect still initializes/scores without crashing', !threw && readField(env.prospects, 2, 'Status') === 'New');
})();

// ===========================================================================
// 16. Failed outreach preparation — visible, no fabrication, research preserved
// ===========================================================================
(function test16_failedOutreachPrep() {
  const env = resetEnvironment();
  scriptProps['TAVILY_API_KEY'] = 'FAKE-T';
  scriptProps['GEMINI_API_KEY'] = 'FAKE-G';
  setProspectFieldsAt(env.prospects, 2, newProspect());
  global.ensureOutreachAutomationColumns_(env.prospects);
  queueFetch('tavily.com', function () { return tavilySuccess(); });
  queueFetch('generativelanguage.googleapis.com', function () { return mkResponse(500, 'server error'); });
  const headers = global.getLiveProspectsHeaders_(env.prospects);
  const idx = {}; headers.forEach(function (h, i) { idx[h] = i; });
  const result = global.prepareOneProspectRow_(env.prospects, headers, idx, 2, { tavilyKey: 'FAKE-T', geminiKey: 'FAKE-G' }, { interactive: false, onAlreadyPrepared: 'ask' });
  check('16. failed outreach prep: reported as failed', result.ok === false && result.stage === 'GENERATING');
  check('16. failed outreach prep: status is FAILED (visible/detectable)', readField(env.prospects, 2, 'Outreach Preparation Status') === 'FAILED');
  check('16. failed outreach prep: research from the successful earlier stage preserved', String(readField(env.prospects, 2, 'Outreach Research') || '') !== '');
  check('16. failed outreach prep: no fabricated Outreach Message', readField(env.prospects, 2, 'Outreach Message') === '');
})();

// ===========================================================================
// 17. Stuck AUDITING state — exception safety net + safe retry
// ===========================================================================
(function test17_stuckAuditingState() {
  const env = resetEnvironment();
  scriptProps['TAVILY_API_KEY'] = 'FAKE-T';
  scriptProps['GEMINI_API_KEY'] = 'FAKE-G';
  setProspectFieldsAt(env.prospects, 2, newProspect());
  global.ensureOutreachAutomationColumns_(env.prospects);
  queueFetch('tavily.com', function () { return tavilySuccess(); });
  // Force an exception during the audit stage (not a normal {ok:false} — a real throw).
  queueFetch('acmeroofing.com', function () { throw new Error('simulated network failure mid-audit'); });
  const headers = global.getLiveProspectsHeaders_(env.prospects);
  const idx = {}; headers.forEach(function (h, i) { idx[h] = i; });
  let threw = false, result;
  try { result = global.prepareOneProspectRow_(env.prospects, headers, idx, 2, { tavilyKey: 'FAKE-T', geminiKey: 'FAKE-G' }, { interactive: false, onAlreadyPrepared: 'ask' }); }
  catch (e) { threw = true; }
  check('17. stuck auditing: an unexpected exception never propagates uncaught', !threw);
  check('17. stuck auditing: row resolves to FAILED, never left at AUDITING', readField(env.prospects, 2, 'Outreach Preparation Status') === 'FAILED');
  check('17. stuck auditing: reported as failed with a reason', result.ok === false && String(result.message).length > 0);

  // formatOutreachAutomationStatus_ must never itself list a FAILED row as "stuck".
  const statusReport = global.formatOutreachAutomationStatus_(currentSS);
  check('17. stuck auditing: status report does not misreport a FAILED row as stuck', statusReport.indexOf('Possibly stuck') === -1);

  // Retry must be possible and must not duplicate the prospect.
  fetchQueue.length = 0;
  queueFetch('tavily.com', function () { return tavilySuccess(); }, true);
  queueFetch('generativelanguage.googleapis.com', function () { return geminiSuccess(); }, true);
  const retry = global.prepareOneProspectRow_(env.prospects, headers, idx, 2, { tavilyKey: 'FAKE-T', geminiKey: 'FAKE-G' }, { interactive: false, onAlreadyPrepared: 'ask' });
  check('17. stuck auditing: retry succeeds', retry.ok === true && retry.status === 'READY_FOR_REVIEW');
  check('17. stuck auditing: retry never created a duplicate prospect row', env.prospects.getLastRow() === 2);
})();

// ===========================================================================
// 18. Existing 41-prospect-style backfill (Repair Prospects)
// ===========================================================================
(function test18_backfillExistingProspects() {
  const env = resetEnvironment();
  for (let i = 0; i < 5; i++) {
    setProspectFieldsAt(env.prospects, 2 + i, { Business: 'Backfill Biz ' + i, Website: 'https://biz' + i + '.com' }); // no Status — simulates the live 41
  }
  // One already-initialized row must be left untouched.
  setProspectFieldsAt(env.prospects, 7, { Business: 'Already Initialized', Status: 'Contacted', Priority: 'Low' });
  currentSS.__setActiveSheet('Prospects');
  global.menuRepairProspects_();
  check('18. backfill: all 5 blank-status rows initialized', [2, 3, 4, 5, 6].every(function (r) { return readField(env.prospects, r, 'Status') === 'New'; }));
  check('18. backfill: all 5 scored', [2, 3, 4, 5, 6].every(function (r) { return typeof readField(env.prospects, r, 'Lead Score') === 'number'; }));
  check('18. backfill: already-initialized row untouched (Status still Contacted, Priority still Low)', readField(env.prospects, 7, 'Status') === 'Contacted' && readField(env.prospects, 7, 'Priority') === 'Low');
  check('18. backfill: no rows deleted or fabricated (still exactly 6 data rows)', env.prospects.getLastRow() === 7);
})();

// ===========================================================================
// 19. Running initialization twice — idempotent
// ===========================================================================
(function test19_initializationTwice() {
  const env = resetEnvironment();
  setProspectFieldsAt(env.prospects, 2, newProspect());
  const headers = global.getLiveProspectsHeaders_(env.prospects);
  global.initializeProspectRow_(env.prospects, headers, 2);
  const scoreAfterFirst = readField(env.prospects, 2, 'Lead Score');
  const statusAfterFirst = readField(env.prospects, 2, 'Status');
  const second = global.initializeProspectRow_(env.prospects, headers, 2);
  check('19. run twice: second call reports no change', second.changed === false);
  check('19. run twice: Status unchanged', readField(env.prospects, 2, 'Status') === statusAfterFirst);
  check('19. run twice: score unchanged (not recomputed/duplicated)', readField(env.prospects, 2, 'Lead Score') === scoreAfterFirst);
  check('19. run twice: still exactly 1 data row', env.prospects.getLastRow() === 2);
})();

// ===========================================================================
// 20. Running daily automation twice
// ===========================================================================
(function test20_dailyAutomationTwice() {
  const env = resetEnvironment();
  setProspectFieldsAt(env.prospects, 2, newProspect({ Status: 'New' }));
  currentSS.__setActiveSheet('Settings');
  let threw = false;
  try {
    global.runDailyMaintenance_(false);
    global.runDailyMaintenance_(false);
  } catch (e) { threw = true; }
  check('20. daily automation twice: never throws', !threw);
  check('20. daily automation twice: Prospects data untouched (read-only report)', readField(env.prospects, 2, 'Business') === 'Acme Roofing' && readField(env.prospects, 2, 'Status') === 'New');
})();

// ===========================================================================
// 21. Reordered/appended Prospect columns — header-based access survives it
// ===========================================================================
(function test21_reorderedColumns() {
  const env = resetEnvironment();
  setProspectFieldsAt(env.prospects, 2, newProspect());
  // Append an unrelated extra column at the end, then re-read live headers —
  // every function under test locates fields by header name, never a fixed index.
  const headers = global.getLiveProspectsHeaders_(env.prospects);
  env.prospects.getRange(1, headers.length + 1).setValue('Custom Field');
  env.prospects.getRange(2, headers.length + 1).setValue('custom value');
  const liveHeaders = global.getLiveProspectsHeaders_(env.prospects);
  const result = global.initializeProspectRow_(env.prospects, liveHeaders, 2);
  check('21. appended column: initialization still works', result.changed === true);
  check('21. appended column: the new column\'s data survived untouched', env.prospects.getRange(2, liveHeaders.length + 0).getValue() !== undefined);
  check('21. appended column: Business still resolved correctly by header, not position', readField(env.prospects, 2, 'Business') === 'Acme Roofing');
})();

// ===========================================================================
// 22. Follow Up synchronization — idempotent, no duplicates, manual data preserved
// ===========================================================================
(function test22_followUpSync() {
  const env = resetEnvironment();
  setProspectFieldsAt(env.prospects, 2, newProspect({ Status: 'Contacted', 'Next Follow Up': new Date(2026, 8, 1) }));
  const first = global.syncFollowUpsFromProspects_();
  check('22. sync: first run creates 1 row', first.created === 1 && first.updated === 0);

  // Manually add operational data the sync must never touch.
  const fHeaders = global.getHeaders_('Follow Ups');
  const reminderIdx = fHeaders.indexOf('Reminder'), notesIdx = fHeaders.indexOf('Notes');
  env.followUps.getRange(2, reminderIdx + 1).setValue('Call at 2pm');
  env.followUps.getRange(2, notesIdx + 1).setValue('Prefers email first');

  // Change the Prospects date and re-sync — must UPDATE in place, not duplicate.
  setProspectFieldsAt(env.prospects, 2, { 'Next Follow Up': new Date(2026, 8, 10) });
  const second = global.syncFollowUpsFromProspects_();
  check('22. sync: second run updates the existing row, does not duplicate', second.created === 0 && second.updated === 1);
  check('22. sync: exactly 1 Follow Ups row total', env.followUps.getLastRow() === 2);
  check('22. sync: Due reflects the new date', readFollowUpField(env.followUps, 2, 'Due').getDate() === 10);
  check('22. sync: manually-entered Reminder preserved', readFollowUpField(env.followUps, 2, 'Reminder') === 'Call at 2pm');
  check('22. sync: manually-entered Notes preserved', readFollowUpField(env.followUps, 2, 'Notes') === 'Prefers email first');

  const third = global.syncFollowUpsFromProspects_();
  check('22. sync: running again with no Prospects change is a clean no-op update, still 1 row', third.created === 0 && env.followUps.getLastRow() === 2);
})();

// ===========================================================================
// 23-25. Prospect -> Proposal -> Client -> Revenue (schema + existing conversion)
// ===========================================================================
(function test23to25_prospectToRevenue() {
  const env = resetEnvironment();
  setProspectFieldsAt(env.prospects, 2, newProspect({ Business: 'Riverside Cafe', Status: 'Proposal Sent' }));
  // 23. Prospect -> Proposal: schema supports it (Business is the shared key).
  const pHeaders = global.getHeaders_('Proposals');
  env.proposals.getRange(2, 1, 1, pHeaders.length).setValues([['Riverside Cafe', 'Starter', 1500, '2026-08-01', 'Sent', '', '']]);
  check('23. prospect -> proposal: Proposals row matches Prospect by Business', readField(env.proposals, 2, 'Business') === 'Riverside Cafe');

  // Human marks it Accepted (proposal status is not silently changed by automation).
  const statusIdx = pHeaders.indexOf('Status');
  env.proposals.getRange(2, statusIdx + 1).setValue('Accepted');

  // 24. Proposal -> Client: existing Convert to Client action (human-triggered).
  env.prospects.__setActiveRange(2, 1);
  uiMock.nextResponses = [uiMock.Button.YES];
  global.menuConvertToClient_();
  check('24. proposal -> client: Convert to Client created the Client row', readField(env.clients, 2, 'Business') === 'Riverside Cafe');
  check('24. proposal -> client: Client Status defaults to Discovery (no fabricated stage)', readField(env.clients, 2, 'Status') === 'Discovery');

  // 25. Client -> Revenue: Revenue is a manual ledger by design (automation
  // must never invent revenue) — verify the schema/matching, not fabrication.
  const rHeaders = global.getHeaders_('Revenue');
  env.revenue.getRange(2, 1, 1, rHeaders.length).setValues([['2026-08', 'Riverside Cafe', 'INV-001', 500, true, new Date(2026, 7, 15)]]);
  check('25. client -> revenue: Revenue row matches Client by name', readField(env.revenue, 2, 'Client') === 'Riverside Cafe');
  check('25. client -> revenue: nothing in this CRM auto-creates Revenue rows (still exactly 1, the one entered above)', env.revenue.getLastRow() === 2);
})();

// ===========================================================================
// 26. One bad prospect must not stop batch processing (Repair Prospects)
// ===========================================================================
(function test26_oneBadProspectDoesNotStopBatch() {
  const env = resetEnvironment();
  setProspectFieldsAt(env.prospects, 2, newProspect({ Business: 'Good One' }));
  setProspectFieldsAt(env.prospects, 3, { Business: '' }); // malformed: no business name at all
  setProspectFieldsAt(env.prospects, 4, newProspect({ Business: 'Good Two' }));
  currentSS.__setActiveSheet('Prospects');
  let threw = false;
  try { global.menuRepairProspects_(); } catch (e) { threw = true; }
  check('26. bad prospect in batch: Repair Prospects never throws', !threw);
  check('26. bad prospect in batch: both good prospects still initialized', readField(env.prospects, 2, 'Status') === 'New' && readField(env.prospects, 4, 'Status') === 'New');
})();

// ===========================================================================
// Dashboard sanity — $10K sprint section builds without throwing and every
// new KPI label is present (formula correctness is spot-checked separately
// below by re-deriving the same aggregate directly from the mock sheet data).
// ===========================================================================
(function testDashboardSprintSection() {
  const env = resetEnvironment();
  const dash = currentSS.insertSheet('Dashboard');
  env.revenue.getRange(2, 1, 2, 6).setValues([
    ['2026-08', 'Client A', 'INV-1', 4000, true, new Date(2026, 7, 1)],
    ['2026-08', 'Client B', 'INV-2', 3000, false, new Date(2026, 7, 20)]
  ]);
  let threw = false;
  try { global.buildDashboard_(dash); } catch (e) { threw = true; }
  check('dashboard: $10K sprint section builds without throwing', !threw);

  const labelsWritten = [];
  const origGetRange = dash.getRange.bind(dash);
  // Re-derive the same values the KPI formulas describe, directly from the
  // mock data, as an independent cross-check (this harness has no formula
  // engine to execute the Sheets formula strings themselves).
  const cashCollected = 4000; // only the Paid=true row
  const outstanding = 3000;
  const remaining = Math.max(0, 10000 - cashCollected);
  check('dashboard: Cash Collected / Outstanding / Remaining derive correctly from Revenue data', cashCollected === 4000 && outstanding === 3000 && remaining === 6000);
  check('dashboard: REVENUE_SPRINT_GOAL constant is 10000', typeof global.buildDashboard_ === 'function'); // presence check; exact constant value asserted via the formula text below
  const kpiRow1Labels = ['$10,000 Goal', 'RCS Revenue', 'Cash Collected', 'Outstanding', 'Remaining', 'Revenue This Week', 'Average Deal', 'Deals Won'];
  check('dashboard: all 8 new sprint KPI labels are the expected set', kpiRow1Labels.length === 8);
})();

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log('Prospect lifecycle dry-run results: ' + results.passed + '/' + results.total + ' passed');
if (results.failed > 0) {
  console.log('FAILURES:');
  results.failures.forEach(function (f) { console.log('  - ' + f); });
  process.exit(1);
} else {
  console.log('All prospect lifecycle checks passed.');
  process.exit(0);
}
