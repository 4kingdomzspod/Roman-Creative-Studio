/**
 * tests/revenue_command_center_dryrun.js
 * ---------------------------------------------------------------------------
 * Daily Revenue Command Center regression suite (crm/revenue-automation,
 * Phase 14). Same indirect-eval mock-Sheets harness as
 * tests/prospect_lifecycle_dryrun.js, against the real .gs source.
 *
 * Run: node tests/revenue_command_center_dryrun.js
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
    createFilter: function () { sheet.__filter = { remove: function () { sheet.__filter = null; } }; return sheet.__filter; }
  };
  const range = new Proxy(real, {
    get: function (target, prop) {
      if (prop in target) return target[prop];
      if (typeof prop !== 'string') return undefined;
      return function () { return range; };
    }
  });
  return range;
}

function makeSheet(name) {
  const cells = {};
  let maxRow = 0, maxCol = 0;
  const sheet = {
    getName: function () { return name; },
    _get: function (r, c) { const v = cells[r + '_' + c]; return v === undefined ? '' : v; },
    _set: function (r, c, v) { cells[r + '_' + c] = v; if (r > maxRow) maxRow = r; if (c > maxCol) maxCol = c; },
    getLastRow: function () { return maxRow; },
    getLastColumn: function () { return maxCol; },
    getMaxRows: function () { return Math.max(maxRow, 100); },
    getMaxColumns: function () { return Math.max(maxCol, 20); },
    getRange: function (row, col, numRows, numCols) { return makeRange(sheet, row, col, numRows || 1, numCols || 1); },
    autoResizeColumns: function () { return sheet; },
    getFilter: function () { return sheet.__filter || null; },
    getBandings: function () { return []; },
    setFrozenRows: function () { return sheet; },
    clear: function () { return sheet; },
    __filter: null
  };
  return sheet;
}

function makeSpreadsheet() {
  const sheets = {};
  return {
    getSheetByName: function (n) { return sheets[n] || null; },
    insertSheet: function (n) { const s = makeSheet(n); sheets[n] = s; return s; },
    flush: function () {}
  };
}

const uiMock = {
  alerts: [],
  ButtonSet: { OK: 'OK_BUTTONSET', YES_NO: 'YES_NO_BUTTONSET' },
  Button: { YES: 'YES', NO: 'NO', OK: 'OK' },
  alert: function () { uiMock.alerts.push(Array.prototype.slice.call(arguments)); return uiMock.Button.OK; },
  createMenu: function () { const m = { addItem: function () { return m; }, addSubMenu: function () { return m; }, addSeparator: function () { return m; }, addToUi: function () {} }; return m; }
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

let currentSS = makeSpreadsheet();
global.SpreadsheetApp = { getActiveSpreadsheet: function () { return currentSS; }, getUi: function () { return uiMock; }, BandingTheme: { LIGHT_GREY: 'LIGHT_GREY' } };
global.PropertiesService = propertiesServiceMock;
global.ScriptApp = { getProjectTriggers: function () { return []; }, newTrigger: function () { return { timeBased: function () { return this; }, after: function () { return this; }, create: function () { return {}; } }; } };
global.LockService = { getScriptLock: function () { return { tryLock: function () { return true; }, releaseLock: function () {} }; } };
global.UrlFetchApp = { fetch: function () { return { getResponseCode: function () { return 200; }, getContentText: function () { return '<html></html>'; } }; } };
global.Utilities = {
  formatDate: function (date) {
    const yyyy = date.getFullYear(), mm = String(date.getMonth() + 1).padStart(2, '0'), dd = String(date.getDate()).padStart(2, '0');
    return yyyy + '-' + mm + '-' + dd;
  },
  sleep: function () {}
};
global.Session = { getScriptTimeZone: function () { return 'America/New_York'; } };
global.Logger = { log: function () {} };
global.HtmlService = { createHtmlOutput: function () { return { setWidth: function () { return this; }, setHeight: function () { return this; } }; } };

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
  const meetings = currentSS.insertSheet('Meetings');
  const proposals = currentSS.insertSheet('Proposals');
  const clients = currentSS.insertSheet('Clients');
  const revenue = currentSS.insertSheet('Revenue');
  const audits = currentSS.insertSheet('Website Audits');
  global.ensureHeaders_(prospects, global.getHeaders_('Prospects'));
  global.ensureHeaders_(meetings, global.getHeaders_('Meetings'));
  global.ensureHeaders_(proposals, global.getHeaders_('Proposals'));
  global.ensureHeaders_(clients, global.getHeaders_('Clients'));
  global.ensureHeaders_(revenue, global.getHeaders_('Revenue'));
  global.ensureHeaders_(audits, global.getHeaders_('Website Audits'));
  uiMock.alerts.length = 0;
  scriptProps = {};
  return { ss: currentSS, prospects: prospects, meetings: meetings, proposals: proposals, clients: clients, revenue: revenue };
}

function setProspectRow(prospects, row, fields) {
  global.ensureHeaders_(prospects, Object.keys(fields)); // additively provisions optional columns (Lead Score/Score Tier, etc.)
  const headers = global.getLiveProspectsHeaders_(prospects);
  const idx = {}; headers.forEach(function (h, i) { idx[h] = i; });
  const rowVals = prospects.getRange(row, 1, 1, headers.length).getValues()[0];
  Object.keys(fields).forEach(function (h) { rowVals[idx[h]] = fields[h]; });
  prospects.getRange(row, 1, 1, headers.length).setValues([rowVals]);
}
function addRevenueRow(revenue, row, month, client, invoice, amount, paid, paymentDate) {
  revenue.getRange(row, 1, 1, 6).setValues([[month, client, invoice, amount, paid, paymentDate || '']]);
}
function addProposalRow(proposals, row, business, pkg, value, sent, status) {
  proposals.getRange(row, 1, 1, 7).setValues([[business, pkg, value, sent, status, '', '']]);
}
function addMeetingRow(meetings, row, business, contact, date, type) {
  meetings.getRange(row, 1, 1, 7).setValues([[business, contact, date, type, '', '', '']]);
}
function lastAlertText() { const a = uiMock.alerts[uiMock.alerts.length - 1]; return a ? String(a[1]) : ''; }

// ===========================================================================
// 1. Empty CRM
// ===========================================================================
(function test01_emptyCrm() {
  resetEnvironment();
  let threw = false, result;
  try { result = global.openDailyCommandCenter_(); } catch (e) { threw = true; }
  check('empty CRM: never throws', !threw);
  check('empty CRM: no urgent actions', result.actions.length === 0);
  check('empty CRM: $10K tracker still present (goal/remaining shown)', result.tracker.goal === 10000 && result.tracker.remaining === 10000);
  check('empty CRM: collected is $0', result.tracker.collected === 0);
  check('empty CRM: funnel reports unavailable rather than throwing', result.tracker.funnel.available === false);
  check('empty CRM: message says pipeline is clear', /pipeline is clear/i.test(lastAlertText()));
})();

// ===========================================================================
// 2. Prospects only
// ===========================================================================
(function test02_prospectsOnly() {
  const env = resetEnvironment();
  setProspectRow(env.prospects, 2, { Business: 'Acme Roofing', Status: 'New', Priority: 'High', 'Lead Score': 85, 'Score Tier': 'Hot' });
  setProspectRow(env.prospects, 3, { Business: 'Beacon Dental', Status: 'New', Priority: 'High' });
  const result = global.openDailyCommandCenter_();
  check('prospects only: hot prospect counted', result.summary.hot === 1);
  check('prospects only: high-priority uncontacted counted', result.summary.highPriorityUncontacted >= 1);
  check('prospects only: no meetings/proposals/payments', result.summary.meetings === 0 && result.summary.proposals === 0 && result.summary.outstandingPayments === 0);
})();

// ===========================================================================
// 3. Follow-ups only (due today + overdue)
// ===========================================================================
(function test03_followUpsOnly() {
  const env = resetEnvironment();
  const today = new Date();
  const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  setProspectRow(env.prospects, 2, { Business: 'Due Today Co', Status: 'Contacted', 'Next Follow Up': today });
  setProspectRow(env.prospects, 3, { Business: 'Overdue Co', Status: 'Contacted', 'Next Follow Up': yesterday });
  const result = global.openDailyCommandCenter_();
  check('follow-ups only: due-today counted', result.summary.dueToday === 1);
  check('follow-ups only: overdue counted', result.summary.overdue === 1);
  check('follow-ups only: both appear in top actions', result.actions.some(function (a) { return a.business === 'Due Today Co'; }) && result.actions.some(function (a) { return a.business === 'Overdue Co'; }));
})();

// ===========================================================================
// 4. Meetings
// ===========================================================================
(function test04_meetings() {
  const env = resetEnvironment();
  const today = new Date();
  addMeetingRow(env.meetings, 2, 'Riverside Cafe', 'Dana', today, 'Discovery Call');
  const result = global.openDailyCommandCenter_();
  check('meetings: counted', result.summary.meetings === 1);
  check('meetings: appears in top actions', result.actions.some(function (a) { return a.business === 'Riverside Cafe' && /MEETING/.test(a.reason); }));
})();

// ===========================================================================
// 5. Proposals
// ===========================================================================
(function test05_proposals() {
  const env = resetEnvironment();
  addProposalRow(env.proposals, 2, 'Iconic Rentals', 'Growth', 2500, '2026-08-01', 'Sent');
  const result = global.openDailyCommandCenter_();
  check('proposals: active proposal counted', result.summary.proposals === 1);
  check('proposals: appears in top actions with value', result.actions.some(function (a) { return a.business === 'Iconic Rentals' && /\$2500/.test(a.reason); }));
})();

// ===========================================================================
// 6. Revenue (outstanding + collected)
// ===========================================================================
(function test06_revenue() {
  const env = resetEnvironment();
  addRevenueRow(env.revenue, 2, '2026-08', 'Paid Client', 'INV-1', 1000, true, new Date());
  addRevenueRow(env.revenue, 3, '2026-08', 'Unpaid Client', 'INV-2', 500, false);
  const result = global.openDailyCommandCenter_();
  check('revenue: collected reflects only Paid rows', result.tracker.collected === 1000);
  check('revenue: outstanding payment counted', result.summary.outstandingPayments === 1);
  check('revenue: outstanding client appears in top actions', result.actions.some(function (a) { return a.business === 'Unpaid Client' && /OUTSTANDING PAYMENT/.test(a.reason); }));
})();

// ===========================================================================
// 7. Mixed pipeline (everything at once)
// ===========================================================================
(function test07_mixedPipeline() {
  const env = resetEnvironment();
  setProspectRow(env.prospects, 2, { Business: 'Hot Co', Status: 'New', 'Lead Score': 90, 'Score Tier': 'Hot' });
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  setProspectRow(env.prospects, 3, { Business: 'Overdue Co', Status: 'Contacted', 'Next Follow Up': yesterday });
  addMeetingRow(env.meetings, 2, 'Meeting Co', 'Sam', new Date(), 'Call');
  addProposalRow(env.proposals, 2, 'Proposal Co', 'Starter', 1500, '2026-08-01', 'Sent');
  addRevenueRow(env.revenue, 2, '2026-08', 'Unpaid Co', 'INV-3', 300, false);
  addRevenueRow(env.revenue, 3, '2026-08', 'Paid Co', 'INV-4', 2000, true, new Date());
  let threw = false, result;
  try { result = global.openDailyCommandCenter_(); } catch (e) { threw = true; }
  check('mixed pipeline: never throws', !threw);
  check('mixed pipeline: every category represented in the queue', result.actions.length >= 5);
  check('mixed pipeline: no duplicate businesses in the action list', (function () {
    const seen = {}; return result.actions.every(function (a) { const k = a.business.toLowerCase(); if (seen[k]) return false; seen[k] = true; return true; });
  })());
  check('mixed pipeline: tracker collected reflects only paid revenue', result.tracker.collected === 2000);
})();

// ===========================================================================
// 8. $0 revenue
// ===========================================================================
(function test08_zeroRevenue() {
  const env = resetEnvironment();
  setProspectRow(env.prospects, 2, { Business: 'Some Co', Status: 'New' });
  const result = global.openDailyCommandCenter_();
  check('$0 revenue: collected is 0', result.tracker.collected === 0);
  check('$0 revenue: remaining is the full goal', result.tracker.remaining === result.tracker.goal);
  check('$0 revenue: never reports GOAL REACHED', result.tracker.paceStatus !== 'GOAL REACHED');
})();

// ===========================================================================
// 9. Partial revenue toward $10K
// ===========================================================================
(function test09_partialRevenue() {
  const env = resetEnvironment();
  addRevenueRow(env.revenue, 2, '2026-08', 'Client A', 'INV-1', 4000, true, new Date());
  const result = global.openDailyCommandCenter_();
  check('partial revenue: collected = 4000', result.tracker.collected === 4000);
  check('partial revenue: remaining = 6000', result.tracker.remaining === 6000);
})();

// ===========================================================================
// 10. Completed $10K
// ===========================================================================
(function test10_completedGoal() {
  const env = resetEnvironment();
  addRevenueRow(env.revenue, 2, '2026-08', 'Client A', 'INV-1', 7000, true, new Date());
  addRevenueRow(env.revenue, 3, '2026-08', 'Client B', 'INV-2', 4000, true, new Date());
  const result = global.openDailyCommandCenter_();
  check('completed $10K: collected exceeds goal', result.tracker.collected === 11000);
  check('completed $10K: remaining floors at 0, never negative', result.tracker.remaining === 0);
})();

// ===========================================================================
// 11. Insufficient historical data (funnel/revenue-math all N/A, not invented)
// ===========================================================================
(function test11_insufficientHistoricalData() {
  const env = resetEnvironment();
  setProspectRow(env.prospects, 2, { Business: 'Lonely Co', Status: 'Contacted' });
  const result = global.openDailyCommandCenter_();
  check('insufficient data: revenue math wins-needed is N/A (no avg deal data)', result.tracker.revenueMath.winsNeeded === null);
  check('insufficient data: weighted pipeline is N/A (no proposal->client rate)', result.tracker.weightedPipeline === null);
  check('insufficient data: pace status is N/A without a configured sprint end date', result.tracker.paceStatus === 'N/A');
  check('insufficient data: message tells the user how to configure the end date', /REVENUE_SPRINT_END_DATE/.test(lastAlertText()));
})();

// ===========================================================================
// 12. Overdue follow-ups (dedicated check: never silently dropped, ranked first)
// ===========================================================================
(function test12_overdueFollowUps() {
  const env = resetEnvironment();
  const old = new Date(); old.setDate(old.getDate() - 10);
  setProspectRow(env.prospects, 2, { Business: 'Very Overdue', Status: 'Contacted', 'Next Follow Up': old, 'Lead Score': 50 });
  setProspectRow(env.prospects, 3, { Business: 'Hot But Not Overdue', Status: 'New', 'Lead Score': 95, 'Score Tier': 'Hot' });
  const result = global.openDailyCommandCenter_();
  check('overdue: counted correctly', result.summary.overdue === 1);
  check('overdue: overdue prospect ranks ahead of a merely-hot one', result.actions[0].business === 'Very Overdue');
})();

// ===========================================================================
// 13. Repeated dashboard refresh — deterministic, no drift, no writes
// ===========================================================================
(function test13_repeatedRefresh() {
  const env = resetEnvironment();
  setProspectRow(env.prospects, 2, { Business: 'Steady Co', Status: 'Contacted', 'Lead Score': 70 });
  addRevenueRow(env.revenue, 2, '2026-08', 'Steady Client', 'INV-1', 1500, true, new Date());
  const first = global.openDailyCommandCenter_();
  const businessBefore = String(env.prospects.getRange(2, 1).getValue());
  const second = global.openDailyCommandCenter_();
  const third = global.openDailyCommandCenter_();
  check('repeated refresh: identical tracker across 3 runs', JSON.stringify(first.tracker) === JSON.stringify(second.tracker) && JSON.stringify(second.tracker) === JSON.stringify(third.tracker));
  check('repeated refresh: identical action list across 3 runs', JSON.stringify(first.actions) === JSON.stringify(third.actions));
  check('repeated refresh: never writes to Prospects (read-only)', String(env.prospects.getRange(2, 1).getValue()) === businessBefore);
  check('repeated refresh: Revenue row count unchanged (no fabricated revenue)', env.revenue.getLastRow() === 2);
})();

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log('Revenue Command Center dry-run results: ' + results.passed + '/' + results.total + ' passed');
if (results.failed > 0) {
  console.log('FAILURES:');
  results.failures.forEach(function (f) { console.log('  - ' + f); });
  process.exit(1);
} else {
  console.log('All Revenue Command Center checks passed.');
  process.exit(0);
}
