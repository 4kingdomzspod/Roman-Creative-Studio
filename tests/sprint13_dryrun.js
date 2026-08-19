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
    return { getProperty: function (k) { return Object.prototype.hasOwnProperty.call(scriptProps, k) ? scriptProps[k] : null; } };
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
global.Utilities = {
  formatDate: function (date, tz, fmt) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return fmt === 'yyyy-MM-dd' ? (yyyy + '-' + mm + '-' + dd) : (yyyy + '-' + mm + '-' + dd);
  }
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
  scriptProps = {};
  return { ss: currentSS, prospects: prospects, audits: audits };
}

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
