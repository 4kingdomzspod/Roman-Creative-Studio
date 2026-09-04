/**
 * RCS CRM — Core Orchestrator
 * ---------------------------------------------------------------------------
 * Canonical CRM home: /crm
 * This file coordinates the modular CRM files in this folder.
 *
 * SAFETY BOUNDARY:
 * - CRM operates on CRM/Google Sheet data only.
 * - The CRM may read a website for audit/research purposes through the
 *   dedicated audit modules, but it must never edit, deploy, publish, delete,
 *   or mutate website source files or hosting configuration.
 * - Roman Creative Studio is a permanent INTERNAL TEST ACCOUNT. It may be
 *   used to exercise CRM workflows, but it is excluded from production sales
 *   metrics, revenue goals, daily queues, and lead-performance reporting.
 * - This file intentionally preserves the modular CRM architecture below.
 *
 * File layout:
 *   Code.gs                    - menu, buildRCSCRM() orchestrator, safety helpers
 *   CRM_Builder.gs             - sheet schema
 *   CRM_Settings.gs            - Settings lists + validation
 *   CRM_Dashboard.gs           - Dashboard
 *   CRM_Import.gs              - prospect import
 *   CRM_Actions.gs             - prospect actions/conversion/archive/repair
 *   CRM_Sync.gs                - GitHub -> Prospects sync
 *   CRM_Audits.gs              - website audit/read-only research
 *   CRM_Outreach.gs             - outreach brief
 *   CRM_OutreachWorkflow.gs    - contact/follow-up workflow
 *   CRM_Scoring.gs             - lead scoring
 *   CRM_CommandCenter.gs       - daily revenue command center
 *   CRM_Analytics.gs           - pipeline intelligence
 *   CRM_Health.gs              - CRM health audit
 *   CRM_Automation.gs           - maintenance/automation
 *   CRM_NextAction.gs           - next-action engine
 *   CRM_OutreachAutomation.gs  - outreach preparation; never sends automatically
 *
 * Safe to run repeatedly: the builder/settings modules are designed to add
 * missing structure without clearing CRM records.
 */

const RCS_CRM_SAFETY = Object.freeze({
  VERSION: '1.1',
  INTERNAL_TEST_BUSINESS: 'Roman Creative Studio',
  INTERNAL_TEST_DOMAIN: 'romancreativestudio.co',
  REVENUE_GOAL: 10000,
  CANONICAL_FOLDER: 'crm',
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

// Simple trigger: only initializes a manually-created Prospects row.
// RCS remains usable as an internal test record; it is never silently
// converted into production reporting by this trigger.
function onEdit(e) {
  try {
    if (!e || !e.range) return;
    const sheet = e.range.getSheet();
    if (sheet.getName() !== 'Prospects') return;
    if (e.range.getNumRows() !== 1 || e.range.getNumColumns() !== 1) return;
    if (e.range.getRow() < 2) return;

    const headers = typeof getLiveProspectsHeaders_ === 'function'
      ? getLiveProspectsHeaders_(sheet)
      : getHeaders_('Prospects');
    const businessCol = headers.indexOf('Business') + 1;
    if (businessCol === 0 || e.range.getColumn() !== businessCol) return;

    if (typeof initializeProspectRow_ === 'function') {
      initializeProspectRow_(sheet, headers, e.range.getRow());
    }
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
    const sheet = ss.getSheetByName(def.name);
    applyValidations_(sheet, def.headers, def.validations, settingsSheet);
  });

  ensureInternalTestBusinessSetting_();
  SpreadsheetApp.flush();
  notify_('RCS CRM is up to date: ' + SHEET_DEFS.length + ' sheets checked.');
}

// ---------------------------------------------------------------------------
// Sheet lifecycle
// ---------------------------------------------------------------------------

function getOrCreateSheet_(ss, name) {
  const existing = ss.getSheetByName(name);
  if (existing) return existing;
  return ss.insertSheet(name);
}

function maybeRepurposeDefaultSheet_(ss) {
  const sheets = ss.getSheets();
  if (sheets.length !== 1) return;

  const only = sheets[0];
  const looksDefault = /^Sheet ?1$/i.test(only.getName());
  const isEmpty = only.getLastRow() === 0 && only.getLastColumn() === 0;

  if (looksDefault && isEmpty && !ss.getSheetByName('Dashboard')) {
    only.setName('Dashboard');
  }
}

function ensureHeaders_(sheet, headers) {
  if (headers.length === 0) return;

  const scanWidth = Math.max(headers.length, sheet.getLastColumn());
  const currentRow = scanWidth > 0 ? sheet.getRange(1, 1, 1, scanWidth).getValues()[0] : [];
  const existingHeaders = currentRow
    .map(function (h) { return String(h).trim(); })
    .filter(function (h) { return h !== ''; });

  if (existingHeaders.length === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    return;
  }

  const existingSet = {};
  existingHeaders.forEach(function (h) { existingSet[h.toLowerCase()] = true; });

  const missing = headers.filter(function (h) { return !existingSet[h.toLowerCase()]; });
  if (missing.length === 0) return;

  const startCol = existingHeaders.length + 1;
  sheet.getRange(1, startCol, 1, missing.length).setValues([missing]);
}

function formatDataSheet_(sheet, numCols) {
  if (numCols === 0) return;

  freezeHeaderRow_(sheet);
  styleHeaderRow_(sheet, numCols);
  applyAlternatingBanding_(sheet, numCols);
  applyBasicFilter_(sheet, numCols);
  autoResizeColumns_(sheet, numCols);
}

function freezeHeaderRow_(sheet) {
  sheet.setFrozenRows(1);
}

function styleHeaderRow_(sheet, numCols) {
  sheet.getRange(1, 1, 1, numCols)
    .setBackground(HEADER_BG)
    .setFontColor(HEADER_FG)
    .setFontWeight('bold')
    .setVerticalAlignment('middle');
}

function applyAlternatingBanding_(sheet, numCols) {
  sheet.getBandings().forEach(function (banding) { banding.remove(); });

  const rowCount = Math.max(sheet.getMaxRows() - 1, BANDING_FUTURE_ROWS);
  const range = sheet.getRange(2, 1, rowCount, numCols);
  range.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);
}

function applyBasicFilter_(sheet, numCols) {
  const existing = sheet.getFilter();
  if (existing) existing.remove();

  const lastRow = Math.max(sheet.getLastRow(), 1);
  sheet.getRange(1, 1, lastRow, numCols).createFilter();
}

function autoResizeColumns_(sheet, numCols) {
  sheet.autoResizeColumns(1, numCols);
}

// ---------------------------------------------------------------------------
// RCS safety boundary
// ---------------------------------------------------------------------------

function isInternalTestBusiness_(business) {
  const value = String(business || '').trim().toLowerCase();
  return value === RCS_CRM_SAFETY.INTERNAL_TEST_BUSINESS.toLowerCase();
}

function isInternalTestWebsite_(website) {
  const value = String(website || '').trim().toLowerCase();
  return value.indexOf(RCS_CRM_SAFETY.INTERNAL_TEST_DOMAIN) !== -1;
}

function isInternalTestRecord_(business, website) {
  return isInternalTestBusiness_(business) || isInternalTestWebsite_(website);
}

function shouldExcludeFromProduction_(business, website) {
  return isInternalTestRecord_(business, website);
}

function ensureInternalTestBusinessSetting_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const settings = ss.getSheetByName('Settings');
  if (!settings) return;

  const headerRow = settings.getRange(1, 1, 1, Math.max(6, settings.getLastColumn())).getValues()[0];
  let col = headerRow.findIndex(function (h) {
    return String(h).trim().toLowerCase() === 'internal test business';
  }) + 1;

  // Keep the safety marker in a dedicated column so existing Settings lists
  // remain untouched. This is intentionally additive.
  if (col === 0) {
    col = Math.max(settings.getLastColumn() + 1, 7);
    settings.getRange(1, col).setValue('Internal Test Business');
  }
  settings.getRange(2, col).setValue(RCS_CRM_SAFETY.INTERNAL_TEST_BUSINESS);

  const domainCol = col + 1;
  settings.getRange(1, domainCol).setValue('Internal Test Website');
  settings.getRange(2, domainCol).setValue(RCS_CRM_SAFETY.INTERNAL_TEST_DOMAIN);

  const policyCol = col + 2;
  settings.getRange(1, policyCol).setValue('Website Mutation Allowed');
  settings.getRange(2, policyCol).setValue('FALSE');
}

function getInternalTestBusiness_() {
  return RCS_CRM_SAFETY.INTERNAL_TEST_BUSINESS;
}

function getInternalTestDomain_() {
  return RCS_CRM_SAFETY.INTERNAL_TEST_DOMAIN;
}

function crmWebsiteMutationAllowed_() {
  return false;
}

function assertCrmOnlyOperation_() {
  if (RCS_CRM_SAFETY.WEBSITE_MUTATION_ALLOWED !== false) {
    throw new Error('CRM safety violation: website mutation is not permitted.');
  }
  return true;
}

function runRcsSafetyCheck_() {
  const failures = [];
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (RCS_CRM_SAFETY.CANONICAL_FOLDER !== 'crm') {
    failures.push('Canonical CRM folder is not /crm.');
  }
  if (RCS_CRM_SAFETY.WEBSITE_MUTATION_ALLOWED !== false) {
    failures.push('Website mutation policy is not locked to FALSE.');
  }
  if (!isInternalTestBusiness_(RCS_CRM_SAFETY.INTERNAL_TEST_BUSINESS)) {
    failures.push('Internal test business matcher failed.');
  }
  if (!isInternalTestWebsite_('https://' + RCS_CRM_SAFETY.INTERNAL_TEST_DOMAIN)) {
    failures.push('Internal test website matcher failed.');
  }
  if (ss && ss.getSheetByName('Settings')) {
    ensureInternalTestBusinessSetting_();
  } else {
    failures.push('Settings sheet is missing.');
  }

  if (failures.length) {
    throw new Error('RCS SAFETY CHECK FAILED: ' + failures.join(' | '));
  }

  const message = [
    'RCS CRM safety check passed.',
    'Canonical CRM home: /crm',
    'Internal test business: ' + RCS_CRM_SAFETY.INTERNAL_TEST_BUSINESS,
    'Internal test website: ' + RCS_CRM_SAFETY.INTERNAL_TEST_DOMAIN,
    'Website mutation/deployment: LOCKED OFF'
  ].join('\n');

  notify_(message);
  return { ok: true, message: message };
}

function assertNotProductionRecord_(business, website) {
  // Call this before any production-only reporting/action is performed.
  // It does not block testing; it only provides a consistent guard for
  // production-only code paths.
  if (shouldExcludeFromProduction_(business, website)) {
    throw new Error('Internal RCS test account is excluded from production-only operations.');
  }
  return true;
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function notify_(message) {
  try {
    SpreadsheetApp.getUi().alert(message);
  } catch (e) {
    Logger.log(message);
  }
}
