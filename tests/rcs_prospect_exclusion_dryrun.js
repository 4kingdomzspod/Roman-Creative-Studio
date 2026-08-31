/**
 * tests/rcs_prospect_exclusion_dryrun.js
 * ---------------------------------------------------------------------------
 * crm/revenue-automation regression suite: validates that Roman Creative
 * Studio (the agency running this CRM) is excluded from every prospect-
 * intelligence surface via the one canonical isExcludedProspect_ helper
 * (CRM_Health.gs), against the REAL .gs source, via the same indirect-eval
 * mock-Sheets harness used by tests/prospect_lifecycle_dryrun.js.
 *
 * Covers the 7 required scenarios:
 *   1. excluded from Top Leads
 *   2. excluded from Pipeline Intelligence
 *   3. excluded from Daily Revenue Command Center prospect counts/actions
 *   4. does not affect lead scoring analytics (hot/warm/cold counts)
 *   5. legitimate businesses remain included
 *   6. case/spacing normalization still excludes RCS
 *   7. existing Prospect/Follow-Up/Revenue behavior remains unchanged
 *
 * Run: node tests/rcs_prospect_exclusion_dryrun.js
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
// UI / Properties mocks
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

// ---------------------------------------------------------------------------
// Global Apps Script surface
// ---------------------------------------------------------------------------

let currentSS = makeSpreadsheet();
global.SpreadsheetApp = {
  getActiveSpreadsheet: function () { return currentSS; },
  getUi: function () { return uiMock; },
  BandingTheme: { LIGHT_GREY: 'LIGHT_GREY' }
};
global.UrlFetchApp = { fetch: function () { throw new Error('not used by this suite'); } };
global.PropertiesService = propertiesServiceMock;
global.ScriptApp = {
  getProjectTriggers: function () { return []; },
  newTrigger: function () { const b = { timeBased: function () { return b; }, everyHours: function () { return b; }, everyDays: function () { return b; }, atHour: function () { return b; }, after: function () { return b; }, create: function () { return {}; } }; return b; },
  deleteTrigger: function () {}
};
global.LockService = { getScriptLock: function () { return { tryLock: function () { return true; }, releaseLock: function () {} }; } };
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
  uiMock.alerts.length = 0;
  scriptProps = {};
  return { ss: currentSS, prospects: prospects, audits: audits, followUps: followUps, proposals: proposals, clients: clients, revenue: revenue, settings: settings };
}

function setRow(sheet, row, headers, fields) {
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });
  const vals = new Array(headers.length).fill('');
  Object.keys(fields).forEach(function (h) { if (idx[h] !== undefined) vals[idx[h]] = fields[h]; });
  sheet.getRange(row, 1, 1, headers.length).setValues([vals]);
}

function readField(sheet, row, headerList, name) {
  const idx = headerList.indexOf(name);
  return idx === -1 ? undefined : sheet.getRange(row, idx + 1).getValue();
}

const RCS_NAME = 'Roman Creative Studio';

function pastDate(daysAgo) { const d = new Date(); d.setDate(d.getDate() - daysAgo); return d; }
function futureDate(daysAhead) { const d = new Date(); d.setDate(d.getDate() + daysAhead); return d; }

// Fields that would make a row score Hot (matches CRM_Scoring.gs's weights:
// audit + High priority + phone/email + website + brief + due follow-up +
// engaged status easily clears SCORE_TIER_HOT_MIN).
function hotEligibleFields(business) {
  return {
    Business: business, Industry: 'Web Design', City: 'Sebring', Website: 'https://example.com/' + business.replace(/\s+/g, ''),
    Priority: 'High', Phone: '555-0100', Email: 'hi@example.com', Status: 'Call Booked',
    'Next Follow Up': pastDate(1), 'Outreach Brief': 'Some brief text on file.'
  };
}

// ===========================================================================
// Setup shared across scenarios 1-4: RCS + one legitimate hot-eligible
// prospect, both scored via the real scoring engine.
// ===========================================================================
function buildHotScenario() {
  const env = resetEnvironment();
  const headers = global.getLiveProspectsHeaders_(env.prospects);
  setRow(env.prospects, 2, headers, hotEligibleFields(RCS_NAME));
  setRow(env.prospects, 3, headers, hotEligibleFields('Acme Roofing'));

  // A completed website audit (+30 of the 100 possible points) so both rows
  // genuinely clear SCORE_TIER_HOT_MIN — proves the RCS exclusion, not a
  // scoring shortfall, is what keeps it out of every Hot-based count below.
  const auditHeaders = global.getHeaders_('Website Audits');
  setRow(env.audits, 2, auditHeaders, { Business: RCS_NAME, Date: new Date(), Mobile: 'Yes', SEO: 'Good', Performance: 'Good', Accessibility: 'Good', Score: 90, Notes: '' });
  setRow(env.audits, 3, auditHeaders, { Business: 'Acme Roofing', Date: new Date(), Mobile: 'Yes', SEO: 'Good', Performance: 'Good', Accessibility: 'Good', Score: 90, Notes: '' });

  global.ensureScoreColumns_(env.prospects);
  const liveHeaders = global.getLiveProspectsHeaders_(env.prospects);
  global.scoreProspectRow_(env.prospects, liveHeaders, 2);
  global.scoreProspectRow_(env.prospects, liveHeaders, 3);
  return Object.assign(env, { headers: liveHeaders });
}

// ===========================================================================
// 1. Roman Creative Studio is excluded from Top Leads
// ===========================================================================
(function () {
  const env = buildHotScenario();
  global.menuShowTopLeads_();
  const msg = uiMock.alerts[uiMock.alerts.length - 1];
  check('1. Top Leads message does not mention Roman Creative Studio', msg.indexOf('Roman Creative Studio') === -1);
  check('1. Top Leads message does include the legitimate hot prospect', msg.indexOf('Acme Roofing') !== -1);
})();

// ===========================================================================
// 2. Roman Creative Studio is excluded from Pipeline Intelligence
// ===========================================================================
(function () {
  const env = buildHotScenario();
  const report = global.openPipelineIntelligence_();
  check('2. Pipeline Intelligence totalProspectRows excludes RCS (1, not 2)', report.overview.totalProspectRows === 1);
  check('2. Pipeline Intelligence funnel total excludes RCS (1, not 2)', report.funnel.stages[0].count === 1);
  const riskBusinesses = report.risks.map(function (r) { return r.business; });
  check('2. Pipeline Intelligence risks never name Roman Creative Studio', riskBusinesses.indexOf(RCS_NAME) === -1);
})();

// ===========================================================================
// 3. Roman Creative Studio is excluded from Daily Revenue Command Center
//    prospect counts/actions
// ===========================================================================
(function () {
  const env = buildHotScenario();
  const result = global.openDailyCommandCenter_();
  check('3. Command Center hot summary counts only the legitimate prospect (1, not 2)', result.summary.hot === 1);
  const actionBusinesses = result.actions.map(function (a) { return a.business; });
  check('3. Command Center actions never name Roman Creative Studio', actionBusinesses.indexOf(RCS_NAME) === -1);
  check('3. Command Center actions do include the legitimate hot prospect', actionBusinesses.indexOf('Acme Roofing') !== -1);
})();

// ===========================================================================
// 4. Roman Creative Studio does not affect lead scoring analytics
//    (even though it scores Hot exactly like the legitimate prospect, it
//    must not inflate hotCount/warmCount/coldCount/unscoredCount)
// ===========================================================================
(function () {
  const env = buildHotScenario();
  // Confirm RCS really would have scored Hot, to prove the exclusion (not a
  // scoring quirk) is what keeps it out of the analytics counts below.
  const rcsScore = readField(env.prospects, 2, env.headers, 'Lead Score');
  check('4. sanity: RCS row was actually scored Hot by the real engine (proves exclusion, not scoring, is doing the work)', Number(rcsScore) >= 80);

  const report = global.openPipelineIntelligence_();
  check('4. Pipeline Intelligence hotCount reflects only the legitimate prospect (1, not 2)', report.overview.hotCount === 1);

  const tracker = global.build10KTracker_(env.ss);
  check('4. $10K Tracker funnel Prospects stage excludes RCS (1, not 2)', tracker.funnel.stages[0].count === 1);
})();

// ===========================================================================
// 5. Legitimate businesses remain included (cross-check across all three
//    reports at once, using a plainly non-agency business name)
// ===========================================================================
(function () {
  const env = resetEnvironment();
  const headers = global.getLiveProspectsHeaders_(env.prospects);
  setRow(env.prospects, 2, headers, { Business: 'Sunshine Dental', Industry: 'Dentists', City: 'Sebring', Website: 'https://sunshinedental.example', Priority: 'Medium', Status: 'New' });
  global.ensureScoreColumns_(env.prospects);
  const liveHeaders = global.getLiveProspectsHeaders_(env.prospects);
  global.scoreProspectRow_(env.prospects, liveHeaders, 2);

  const pipeline = global.openPipelineIntelligence_();
  check('5. a legitimate business counts toward Pipeline Intelligence totals', pipeline.overview.totalProspectRows === 1);

  const cc = global.openDailyCommandCenter_();
  check('5. a legitimate business is reachable by the Command Center record builder (not silently dropped)', global.buildProspectRecords_(env.prospects).length === 1);
})();

// ===========================================================================
// 6. Case/spacing normalization still excludes RCS
// ===========================================================================
(function () {
  const variants = ['roman creative studio', 'ROMAN CREATIVE STUDIO', '  Roman   Creative   Studio  ', 'Roman creative STUDIO'];
  variants.forEach(function (variant) {
    check('6. isExcludedProspect_ matches variant "' + variant + '"', global.isExcludedProspect_(variant) === true);
  });
  check('6. isExcludedProspect_ does NOT match an unrelated business containing similar words', global.isExcludedProspect_('Roman Family Studio Rentals') === false);
  check('6. isExcludedProspect_ does NOT match a business merely containing "Studio"', global.isExcludedProspect_('Bright Studio Photography') === false);

  const env = resetEnvironment();
  const headers = global.getLiveProspectsHeaders_(env.prospects);
  setRow(env.prospects, 2, headers, { Business: '  roman   CREATIVE studio  ', Status: 'New' });
  setRow(env.prospects, 3, headers, { Business: 'Roman Family Studio Rentals', Status: 'New' }); // legitimate — must NOT be excluded
  const records = global.buildProspectRecords_(env.prospects);
  check('6. a case/spacing-variant RCS row is still excluded from buildProspectRecords_', records.length === 1);
  check('6. the remaining record is the legitimate, differently-named business', records[0].business === 'Roman Family Studio Rentals');
})();

// ===========================================================================
// 7. Existing Prospect/Follow-Up/Revenue behavior remains unchanged
// ===========================================================================
(function () {
  const env = resetEnvironment();
  const headers = global.getLiveProspectsHeaders_(env.prospects);

  // 7a. initializeProspectRow_ lifecycle is untouched for a normal prospect.
  setRow(env.prospects, 2, headers, { Business: 'Legit Plumbing Co' });
  const initResult = global.initializeProspectRow_(env.prospects, headers, 2);
  check('7a. initializeProspectRow_ still initializes a normal new prospect (Status=New)', readField(env.prospects, 2, headers, 'Status') === 'New');
  check('7a. initializeProspectRow_ still reports changed:true for a normal prospect', initResult.changed === true);

  // 7b. Follow-Up sync still creates a row for a legitimate prospect, and now
  // correctly skips one for RCS even if RCS carries a Next Follow Up date.
  setRow(env.prospects, 3, headers, { Business: 'Legit Plumbing Co Two', Status: 'Contacted', 'Next Follow Up': futureDate(3) });
  setRow(env.prospects, 4, headers, { Business: RCS_NAME, Status: 'Contacted', 'Next Follow Up': futureDate(3) });
  const syncResult = global.syncFollowUpsFromProspects_();
  check('7b. Sync Follow Ups still creates a row for the legitimate prospect', syncResult.created === 1);
  const fLastRow = env.followUps.getLastRow();
  const fHeaders = global.getHeaders_('Follow Ups');
  const followUpBusinesses = [];
  for (let r = 2; r <= fLastRow; r++) followUpBusinesses.push(readField(env.followUps, r, fHeaders, 'Business'));
  check('7b. Follow Ups sheet never gains a row for Roman Creative Studio', followUpBusinesses.indexOf(RCS_NAME) === -1);
  check('7b. Follow Ups sheet does contain the legitimate prospect', followUpBusinesses.indexOf('Legit Plumbing Co Two') !== -1);

  // 7c. Revenue reading is completely untouched — even a Revenue row
  // literally naming Roman Creative Studio as Client must pass through
  // unmodified (this suite never touches Revenue/Clients read logic).
  const revenueHeaders = global.getHeaders_('Revenue');
  setRow(env.revenue, 2, revenueHeaders, { Client: RCS_NAME, Invoice: 'INV-RCS-001', Amount: 500, Paid: true });
  const revenueRows = global.getSheetRows_(env.ss, 'Revenue');
  check('7c. a Revenue row naming Roman Creative Studio is still read back unmodified', revenueRows.length === 1 && revenueRows[0].Client === RCS_NAME && revenueRows[0].Amount === 500);

  // 7d. CSV import: RCS is skipped, a legitimate business in the same file
  // still imports normally (existing duplicate handling untouched).
  const csv = 'Business,Website\n' + RCS_NAME + ',romancreativestudio.example\nLegit HVAC Co,legithvac.example\n';
  const importResult = global.importProspectsFromCsv_(csv);
  check('7d. CSV import imports exactly the one legitimate business', importResult.imported === 1);
  check('7d. CSV import skips Roman Creative Studio (counted as skipped, not an error)', importResult.skipped === 1 && importResult.errors === 0);
  const allBusinessesAfterImport = [];
  const lastRow = env.prospects.getLastRow();
  const liveHeadersNow = global.getLiveProspectsHeaders_(env.prospects);
  const bIdx = liveHeadersNow.indexOf('Business');
  for (let r = 2; r <= lastRow; r++) allBusinessesAfterImport.push(String(env.prospects.getRange(r, bIdx + 1).getValue()));
  check('7d. Prospects sheet never gains a new Roman Creative Studio row via import', allBusinessesAfterImport.filter(function (b) { return b === RCS_NAME; }).length === 1); // the one already seeded at row 4, not a new one
})();

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log('\nRCS prospect-exclusion dry-run results: ' + results.passed + '/' + results.total + ' passed');
if (results.failed > 0) {
  console.log('FAILURES:');
  results.failures.forEach(function (f) { console.log('  - ' + f); });
  process.exit(1);
} else {
  console.log('All RCS prospect-exclusion checks passed.');
  process.exit(0);
}
