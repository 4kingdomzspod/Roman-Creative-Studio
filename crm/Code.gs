/**
 * RCS CRM — Core Orchestrator
 * Canonical CRM home: /crm
 * Modular architecture preserved; this file owns menu, build orchestrator,
 * shared formatting helpers, and CRM-wide safety policy.
 *
 * SAFETY POLICY:
 * - Roman Creative Studio is a permanent INTERNAL TEST ACCOUNT.
 * - The test account may exercise CRM workflows, but is excluded from
 *   production sales metrics, revenue goals, pipeline performance, and
 *   production outreach queues.
 * - Website audits/research are read-only. CRM has no permitted pathway to
 *   edit, deploy, publish, delete, or mutate RCS website source/hosting.
 * - Safety metadata is stored in Settings columns N:P so it cannot collide
 *   with the existing GitHub Sync (H:I) or Automation (K:L) panels.
 */

const RCS_CRM_SAFETY = Object.freeze({
  VERSION: '1.1',
  INTERNAL_TEST_BUSINESS: 'Roman Creative Studio',
  INTERNAL_TEST_DOMAIN: 'romancreativestudio.co',
  REVENUE_GOAL: 10000,
  CANONICAL_CRM_FOLDER: 'crm',
  WEBSITE_MUTATION_ALLOWED: false
});

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('RCS CRM')
    .addItem('Build / Update CRM', 'buildRCSCRM')
    .addItem('Daily Revenue Command Center', 'openDailyCommandCenter_')
    .addItem('Import Prospects...', 'showImportDialog_')
    .addItem('Sync Prospects', 'menuSyncProspects_')
    .addItem('Repair Prospects', 'menuRepairProspects_')
    .addItem('Sync Follow Ups', 'menuSyncFollowUps_')
    .addSubMenu(ui.createMenu('Auto Sync')
      .addItem('Enable Auto Sync', 'enableAutoSync_')
      .addItem('Disable Auto Sync', 'disableAutoSync_'))
    .addSubMenu(ui.createMenu('Website Audit')
      .addItem('Audit Selected Prospect', 'menuAuditSelectedProspect_')
      .addItem('Audit Website URL', 'menuAuditWebsiteUrl_')
      .addItem('Audit Eligible Prospects', 'menuAuditEligibleProspects_')
      .addItem('Record Manual Audit', 'menuRecordManualAudit_'))
    .addSubMenu(ui.createMenu('Outreach Tools')
      .addItem('Generate Outreach Brief', 'menuGenerateOutreachBrief_')
      .addItem('Generate Brief for Selected Prospect', 'menuGenerateOutreachBrief_')
      .addItem('Mark as Contacted', 'menuMarkAsContacted_')
      .addItem('Schedule Follow-Up', 'menuScheduleFollowUp_')
      .addItem('Generate Follow-Up Message', 'menuGenerateFollowUpMessage_'))
    .addSubMenu(ui.createMenu('Lead Intelligence')
      .addItem('Score Selected Prospect(s)', 'menuScoreSelectedProspects_')
      .addItem('Score All Prospects', 'menuScoreAllProspects_')
      .addItem('Show Top Leads', 'menuShowTopLeads_'))
    .addItem('Pipeline Intelligence', 'openPipelineIntelligence_')
    .addItem('CRM Health', 'openCrmHealthAudit_')
    .addItem('Next Actions', 'openNextActions_')
    .addSubMenu(ui.createMenu('Automation')
      .addItem('Run CRM Maintenance', 'menuRunCrmMaintenance_')
      .addItem('Automation Status', 'menuAutomationStatus_')
      .addItem('Enable Daily Maintenance', 'enableDailyMaintenance_')
      .addItem('Disable Daily Maintenance', 'disableDailyMaintenance_'))
    .addSubMenu(ui.createMenu('Outreach Automation')
      .addItem('Prepare Selected Prospect', 'menuPrepareSelectedProspect_')
      .addItem('Prepare Eligible Prospects', 'menuPrepareEligibleProspects_')
      .addItem('Resume Batch', 'menuResumeOutreachBatch_')
      .addItem('Outreach Automation Status', 'menuOutreachAutomationStatus_')
      .addItem('Configure API Status', 'menuConfigureApiStatus_'))
    .addSeparator()
    .addItem('Move to Outreach', 'menuMoveToOutreach_')
    .addItem('Convert to Client', 'menuConvertToClient_')
    .addItem('Archive Lead', 'menuArchiveLead_')
    .addSeparator()
    .addItem('RCS Safety Check', 'runRcsSafetyCheck_')
    .addToUi();
}

function onEdit(e) {
  try {
    if (!e || !e.range) return;
    const sheet = e.range.getSheet();
    if (sheet.getName() !== 'Prospects') return;
    if (e.range.getNumRows() !== 1 || e.range.getNumColumns() !== 1 || e.range.getRow() < 2) return;
    const headers = typeof getLiveProspectsHeaders_ === 'function' ? getLiveProspectsHeaders_(sheet) : getHeaders_('Prospects');
    const businessCol = headers.indexOf('Business') + 1;
    if (businessCol === 0 || e.range.getColumn() !== businessCol) return;
    if (typeof initializeProspectRow_ === 'function') initializeProspectRow_(sheet, headers, e.range.getRow());
  } catch (err) {
    Logger.log('onEdit failed: ' + err.message);
  }
}

function buildRCSCRM() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  maybeRepurposeDefaultSheet_(ss);

  SHEET_DEFS.forEach(function (def) {
    const sheet = getOrCreateSheet_(ss, def.name);
    if (def.name === 'Dashboard') {
      buildDashboard_(sheet);
      return;
    }
    if (def.name === 'Settings') {
      buildSettingsSheet_(sheet);
      formatDataSheet_(sheet, Object.keys(SETTINGS_LISTS).length);
      if (typeof ensureSyncStatusBlock_ === 'function') ensureSyncStatusBlock_(sheet);
      if (typeof ensureAutomationStatusBlock_ === 'function') ensureAutomationStatusBlock_(sheet);
      return;
    }
    ensureHeaders_(sheet, def.headers);
    formatDataSheet_(sheet, def.headers.length);
  });

  const settingsSheet = ss.getSheetByName('Settings');
  SHEET_DEFS.forEach(function (def) {
    if (!def.validations || Object.keys(def.validations).length === 0) return;
    applyValidations_(ss.getSheetByName(def.name), def.headers, def.validations, settingsSheet);
  });

  ensureInternalTestBusinessSetting_();
  SpreadsheetApp.flush();
  notify_('RCS CRM is up to date: ' + SHEET_DEFS.length + ' sheets checked.');
}

function getOrCreateSheet_(ss, name) {
  const existing = ss.getSheetByName(name);
  return existing || ss.insertSheet(name);
}

function maybeRepurposeDefaultSheet_(ss) {
  const sheets = ss.getSheets();
  if (sheets.length !== 1) return;
  const only = sheets[0];
  if (/^Sheet ?1$/i.test(only.getName()) && only.getLastRow() === 0 && only.getLastColumn() === 0 && !ss.getSheetByName('Dashboard')) {
    only.setName('Dashboard');
  }
}

function ensureHeaders_(sheet, headers) {
  if (headers.length === 0) return;
  const scanWidth = Math.max(headers.length, sheet.getLastColumn());
  const currentRow = sheet.getRange(1, 1, 1, scanWidth).getValues()[0];
  const existingHeaders = currentRow.map(function (h) { return String(h).trim(); }).filter(function (h) { return h !== ''; });
  if (existingHeaders.length === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return;
  }
  const existingSet = {};
  existingHeaders.forEach(function (h) { existingSet[h.toLowerCase()] = true; });
  const missing = headers.filter(function (h) { return !existingSet[h.toLowerCase()]; });
  if (missing.length) sheet.getRange(1, existingHeaders.length + 1, 1, missing.length).setValues([missing]);
}

function formatDataSheet_(sheet, numCols) {
  if (numCols === 0) return;
  freezeHeaderRow_(sheet);
  styleHeaderRow_(sheet, numCols);
  applyAlternatingBanding_(sheet, numCols);
  applyBasicFilter_(sheet, numCols);
  autoResizeColumns_(sheet, numCols);
}

function freezeHeaderRow_(sheet) { sheet.setFrozenRows(1); }

function styleHeaderRow_(sheet, numCols) {
  sheet.getRange(1, 1, 1, numCols).setBackground(HEADER_BG).setFontColor(HEADER_FG).setFontWeight('bold').setVerticalAlignment('middle');
}

function applyAlternatingBanding_(sheet, numCols) {
  sheet.getBandings().forEach(function (banding) { banding.remove(); });
  const rowCount = Math.max(sheet.getMaxRows() - 1, BANDING_FUTURE_ROWS);
  sheet.getRange(2, 1, rowCount, numCols).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);
}

function applyBasicFilter_(sheet, numCols) {
  const existing = sheet.getFilter();
  if (existing) existing.remove();
  sheet.getRange(1, 1, Math.max(sheet.getLastRow(), 1), numCols).createFilter();
}

function autoResizeColumns_(sheet, numCols) { sheet.autoResizeColumns(1, numCols); }

// ---------------------------------------------------------------------------
// RCS safety boundary
// ---------------------------------------------------------------------------

function isInternalTestBusiness_(business) {
  return String(business || '').trim().toLowerCase() === RCS_CRM_SAFETY.INTERNAL_TEST_BUSINESS.toLowerCase();
}

function isInternalTestWebsite_(website) {
  return String(website || '').trim().toLowerCase().indexOf(RCS_CRM_SAFETY.INTERNAL_TEST_DOMAIN.toLowerCase()) !== -1;
}

function isInternalTestRecord_(business, website) {
  return isInternalTestBusiness_(business) || isInternalTestWebsite_(website);
}

function shouldExcludeFromProduction_(business, website) {
  return isInternalTestRecord_(business, website);
}

function assertNotProductionRecord_(business, website) {
  if (shouldExcludeFromProduction_(business, website)) {
    throw new Error('Roman Creative Studio is an internal CRM test account and cannot be used in production-only operations.');
  }
  return true;
}

function crmWebsiteMutationAllowed_() { return false; }

function assertCrmOnlyOperation_() {
  if (RCS_CRM_SAFETY.WEBSITE_MUTATION_ALLOWED !== false || crmWebsiteMutationAllowed_() !== false) {
    throw new Error('CRM safety violation: website mutation/deployment is disabled.');
  }
  return true;
}

function ensureInternalTestBusinessSetting_() {
  const settings = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
  if (!settings) return;

  // N:P is intentionally outside the existing Settings data/panels:
  // Lead Status..Project Status = A:F, GitHub Sync = H:I, Automation = K:L.
  const businessCol = 14; // N
  settings.getRange(1, businessCol, 2, 3).setValues([
    ['Internal Test Business', 'Internal Test Website', 'Website Mutation Allowed'],
    [RCS_CRM_SAFETY.INTERNAL_TEST_BUSINESS, RCS_CRM_SAFETY.INTERNAL_TEST_DOMAIN, 'FALSE']
  ]);
  settings.getRange(1, businessCol, 1, 3).setBackground(HEADER_BG).setFontColor(HEADER_FG).setFontWeight('bold');
}

function getInternalTestBusiness_() { return RCS_CRM_SAFETY.INTERNAL_TEST_BUSINESS; }
function getInternalTestDomain_() { return RCS_CRM_SAFETY.INTERNAL_TEST_DOMAIN; }

function runRcsSafetyCheck_() {
  const failures = [];
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (RCS_CRM_SAFETY.CANONICAL_CRM_FOLDER !== 'crm') failures.push('Canonical CRM folder policy is incorrect.');
  if (RCS_CRM_SAFETY.WEBSITE_MUTATION_ALLOWED !== false) failures.push('Website mutation policy is not locked off.');
  if (crmWebsiteMutationAllowed_() !== false) failures.push('Website mutation helper is not locked off.');
  if (!isInternalTestBusiness_('Roman Creative Studio')) failures.push('Internal test business matcher failed.');
  if (!isInternalTestWebsite_('https://romancreativestudio.co')) failures.push('Internal test website matcher failed.');
  if (!ss.getSheetByName('Settings')) failures.push('Settings sheet is missing.');
  if (failures.length) throw new Error('RCS SAFETY CHECK FAILED: ' + failures.join(' | '));
  ensureInternalTestBusinessSetting_();
  const message = 'RCS CRM safety check PASSED.\n\nCRM home: /crm\nInternal test account: Roman Creative Studio\nInternal website: romancreativestudio.co\nWebsite edit/deploy/delete: DISABLED\nProduction reporting exclusion: ENABLED';
  notify_(message);
  return { ok: true, message: message };
}

function notify_(message) {
  try { SpreadsheetApp.getUi().alert(message); }
  catch (e) { Logger.log(message); }
}
