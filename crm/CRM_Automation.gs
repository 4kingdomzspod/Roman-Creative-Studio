/**
 * CRM_Automation.gs
 * ---------------------------------------------------------------------------
 * A small, safe automation layer: a daily maintenance REPORT (never an
 * automatic fix), an installable daily trigger to run it unattended, and an
 * Automation Status view. Nothing in this file edits a Prospect, Proposal,
 * Client, or Revenue record — it only reads and reports, then stores its own
 * bookkeeping (Enabled / Last Run Time / Last Run Result) on a Settings
 * panel, the exact same pattern CRM_Sync.gs already uses for Auto Sync.
 *
 * Reuses: buildHealthProspectRecords_ / buildCompletenessSection_ /
 * buildDuplicatesSection_ / buildConsistencySection_ / buildIntegritySection_
 * (CRM_Health.gs), buildAging_ / getSheetRows_ / getDistinctBusinesses_
 * (CRM_Analytics.gs), isAutoSyncEnabled_ / GITHUB_OWNER / GITHUB_REPO
 * (CRM_Sync.gs), formatScoreDate_ (CRM_Scoring.gs), writeSectionHeader_
 * (CRM_Dashboard.gs). No completeness/duplicate/consistency/aging detection
 * is reimplemented here — this file only assembles a summary and manages
 * the trigger.
 */

const AUTOMATION_LABEL_COL = 11; // column K (Settings) — separate from GitHub Sync's H:I panel
const AUTOMATION_VALUE_COL = 12; // column L
const AUTOMATION_ROWS = { header: 1, enabled: 2, lastRunTime: 3, lastRunResult: 4 };
const MAINTENANCE_TRIGGER_HANDLER = 'dailyMaintenanceTrigger_';

// ---------------------------------------------------------------------------
// Settings automation panel (mirrors CRM_Sync.gs's ensureSyncStatusBlock_)
// ---------------------------------------------------------------------------

function ensureAutomationStatusBlock_(sheet) {
  if (sheet.getRange(AUTOMATION_ROWS.header, AUTOMATION_LABEL_COL).getValue() === '') {
    writeSectionHeader_(sheet, AUTOMATION_ROWS.header, AUTOMATION_LABEL_COL, AUTOMATION_VALUE_COL, 'Automation'); // CRM_Dashboard.gs
  }

  const labels = {};
  labels[AUTOMATION_ROWS.enabled] = 'Daily Maintenance Enabled';
  labels[AUTOMATION_ROWS.lastRunTime] = 'Last Maintenance Run';
  labels[AUTOMATION_ROWS.lastRunResult] = 'Last Maintenance Result';

  Object.keys(labels).forEach(function (rowStr) {
    const row = Number(rowStr);
    const labelCell = sheet.getRange(row, AUTOMATION_LABEL_COL);
    if (labelCell.getValue() === '') {
      labelCell.setValue(labels[row]).setFontWeight('bold').setBackground('#eceef5');
    }
  });

  const enabledCell = sheet.getRange(AUTOMATION_ROWS.enabled, AUTOMATION_VALUE_COL);
  if (enabledCell.getValue() === '') {
    enabledCell.insertCheckboxes(); // unchecked by default — opt-in, same convention as Auto Sync
  }

  sheet.setColumnWidth(AUTOMATION_LABEL_COL, 170);
  sheet.setColumnWidth(AUTOMATION_VALUE_COL, 240);
}

function isMaintenanceEnabled_(settingsSheet) {
  return settingsSheet.getRange(AUTOMATION_ROWS.enabled, AUTOMATION_VALUE_COL).getValue() === true;
}

// ---------------------------------------------------------------------------
// A. Daily CRM Maintenance report — read-only, reuses CRM_Health.gs's own
// section builders directly rather than re-detecting anything.
// ---------------------------------------------------------------------------

function buildDailyMaintenanceReport_(ss) {
  const prospects = ss.getSheetByName('Prospects');
  const records = prospects ? buildHealthProspectRecords_(prospects) : []; // CRM_Health.gs
  const proposalRows = getSheetRows_(ss, 'Proposals').filter(function (p) { return String(p.Business || '').trim() !== ''; }); // CRM_Analytics.gs
  const clientRows = getSheetRows_(ss, 'Clients').filter(function (c) { return String(c.Business || '').trim() !== ''; }); // CRM_Analytics.gs
  const clientBusinesses = getDistinctBusinesses_(ss, 'Clients'); // CRM_Analytics.gs

  const completeness = buildCompletenessSection_(prospects, ss, records); // CRM_Health.gs
  const duplicates = buildDuplicatesSection_(records); // CRM_Health.gs
  const consistency = buildConsistencySection_(records, proposalRows, clientRows); // CRM_Health.gs
  const integrity = buildIntegritySection_(records, duplicates, clientBusinesses); // CRM_Health.gs
  const staleness = buildAging_(records, proposalRows); // CRM_Analytics.gs

  const report = {
    overdueFollowUps: staleness.overdueFollowUpCount,
    missingNextFollowUp: completeness.activeMissingNextFollowUp,
    missingContactInfo: integrity.noContactInfoCount,
    staleActiveProspects: staleness.neverContactedCount + staleness.staleContactCount,
    staleActiveProposals: staleness.staleProposals.length,
    incompleteClients: completeness.clientsMissingFields,
    invalidStatuses: consistency.invalidStatusCount,
    duplicateGroups: duplicates.groups.length,
    duplicateBusinesses: duplicates.affectedCount
  };
  report.totalIssues = report.overdueFollowUps + report.missingNextFollowUp + report.missingContactInfo +
    report.staleActiveProspects + report.staleActiveProposals + report.incompleteClients +
    report.invalidStatuses + report.duplicateBusinesses;

  return report;
}

function formatMaintenanceReport_(report) {
  const lines = [];
  lines.push('DAILY CRM MAINTENANCE — ' + formatScoreDate_(new Date())); // CRM_Scoring.gs
  lines.push('');
  lines.push('Overdue Follow-Ups: ' + report.overdueFollowUps);
  lines.push('Prospects Missing Next Follow Up: ' + report.missingNextFollowUp);
  lines.push('Active Prospects Missing Contact Info: ' + report.missingContactInfo);
  lines.push('Stale Active Prospects (never / no recent contact): ' + report.staleActiveProspects);
  lines.push('Active Proposals Needing Attention (stalled): ' + report.staleActiveProposals);
  lines.push('Incomplete Client Records: ' + report.incompleteClients);
  lines.push('Invalid/Unknown Statuses: ' + report.invalidStatuses);
  lines.push('Duplicate Business Groups: ' + report.duplicateGroups + ' (' + report.duplicateBusinesses + ' businesses affected)');
  lines.push('');
  lines.push(report.totalIssues === 0
    ? 'No maintenance issues found. CRM looks clean.'
    : 'Total flagged conditions: ' + report.totalIssues + '. This is a reporting pass only — nothing was changed automatically. See RCS CRM > CRM Health for full detail and recommended actions.');
  return lines.join('\n');
}

function summarizeMaintenanceReport_(report) {
  return 'Issues: ' + report.totalIssues + ' (Overdue ' + report.overdueFollowUps + ', Missing NFU ' + report.missingNextFollowUp +
    ', No Contact Info ' + report.missingContactInfo + ', Stale ' + report.staleActiveProspects +
    ', Stalled Proposals ' + report.staleActiveProposals + ', Incomplete Clients ' + report.incompleteClients +
    ', Invalid Status ' + report.invalidStatuses + ', Duplicates ' + report.duplicateBusinesses + ')';
}

// Shared by the menu item, the trigger, and Enable/Disable — always
// recomputes fresh (deterministic for unchanged data) and records its own
// bookkeeping on the Settings panel. Never edits a Prospect/Proposal/
// Client/Revenue row.
function runDailyMaintenance_(interactive) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const settingsSheet = ss.getSheetByName('Settings');

  const report = buildDailyMaintenanceReport_(ss);
  const summary = summarizeMaintenanceReport_(report);

  if (settingsSheet) {
    ensureAutomationStatusBlock_(settingsSheet);
    settingsSheet.getRange(AUTOMATION_ROWS.lastRunTime, AUTOMATION_VALUE_COL).setValue(new Date()).setNumberFormat('yyyy-mm-dd hh:mm');
    settingsSheet.getRange(AUTOMATION_ROWS.lastRunResult, AUTOMATION_VALUE_COL).setValue(summary);
  }

  if (interactive) {
    SpreadsheetApp.getUi().alert('CRM Maintenance', formatMaintenanceReport_(report), SpreadsheetApp.getUi().ButtonSet.OK);
  } else {
    Logger.log('CRM Maintenance: ' + summary);
  }

  return report; // read-only result, useful for tests
}

// D. Manual run.
function menuRunCrmMaintenance_() {
  runDailyMaintenance_(true);
}

// ---------------------------------------------------------------------------
// B. Automation Status — read-only.
// ---------------------------------------------------------------------------

function buildAutomationStatus_(ss) {
  const settingsSheet = ss.getSheetByName('Settings');
  return {
    autoSyncEnabled: settingsSheet ? isAutoSyncEnabled_(settingsSheet) : false, // CRM_Sync.gs
    maintenanceEnabled: settingsSheet ? isMaintenanceEnabled_(settingsSheet) : false,
    lastRunTime: settingsSheet ? settingsSheet.getRange(AUTOMATION_ROWS.lastRunTime, AUTOMATION_VALUE_COL).getValue() : '',
    lastRunResult: settingsSheet ? settingsSheet.getRange(AUTOMATION_ROWS.lastRunResult, AUTOMATION_VALUE_COL).getValue() : '',
    triggerCount: ScriptApp.getProjectTriggers().filter(function (t) { return t.getHandlerFunction() === MAINTENANCE_TRIGGER_HANDLER; }).length,
    githubConfigured: typeof GITHUB_OWNER !== 'undefined' && !!GITHUB_OWNER // CRM_Sync.gs constant, reused as-is
  };
}

function formatAutomationStatus_(status) {
  const lines = [];
  lines.push('AUTOMATION STATUS');
  lines.push('');
  lines.push('Auto Sync: ' + (status.autoSyncEnabled ? 'Enabled' : 'Disabled'));
  lines.push('Daily Maintenance: ' + (status.maintenanceEnabled ? 'Enabled' : 'Disabled'));
  lines.push('Maintenance Trigger Count: ' + status.triggerCount +
    (status.triggerCount === 1 ? ' (OK)' : (status.triggerCount === 0 ? ' (none installed)' : ' (WARNING: expected exactly 1)')));
  lines.push('Last Maintenance Run: ' + (status.lastRunTime ? formatScoreDate_(status.lastRunTime) : 'Never run')); // CRM_Scoring.gs
  lines.push('Last Maintenance Result: ' + (status.lastRunResult || '(none)'));
  lines.push('GitHub Sync Configured: ' + (status.githubConfigured ? 'Yes (' + GITHUB_OWNER + '/' + GITHUB_REPO + ')' : 'No'));
  return lines.join('\n');
}

function menuAutomationStatus_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const status = buildAutomationStatus_(ss);
  SpreadsheetApp.getUi().alert('Automation Status', formatAutomationStatus_(status), SpreadsheetApp.getUi().ButtonSet.OK);
}

// ---------------------------------------------------------------------------
// C. Daily Maintenance trigger — installable, exactly one at a time.
// ---------------------------------------------------------------------------

function enableDailyMaintenance_() {
  removeMaintenanceTriggers_();
  ScriptApp.newTrigger(MAINTENANCE_TRIGGER_HANDLER).timeBased().everyDays(1).atHour(6).create();

  const settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
  ensureAutomationStatusBlock_(settingsSheet);
  settingsSheet.getRange(AUTOMATION_ROWS.enabled, AUTOMATION_VALUE_COL).setValue(true);

  SpreadsheetApp.getUi().alert('Automation', 'Daily Maintenance enabled — a report will run automatically once a day (~6am, script time zone).', SpreadsheetApp.getUi().ButtonSet.OK);
}

function disableDailyMaintenance_() {
  removeMaintenanceTriggers_();

  const settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
  ensureAutomationStatusBlock_(settingsSheet);
  settingsSheet.getRange(AUTOMATION_ROWS.enabled, AUTOMATION_VALUE_COL).setValue(false);

  SpreadsheetApp.getUi().alert('Automation', 'Daily Maintenance disabled.', SpreadsheetApp.getUi().ButtonSet.OK);
}

// Deletes only this automation's own triggers (matched by handler function
// name) before (re)creating one — repeated Enable clicks never produce more
// than one, and Disable never touches Auto Sync's or any other trigger.
function removeMaintenanceTriggers_() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === MAINTENANCE_TRIGGER_HANDLER) ScriptApp.deleteTrigger(t);
  });
}

// The actual daily trigger callback. Re-checks Daily Maintenance Enabled
// itself (rather than trusting the trigger's mere existence), and never lets
// a failure go unhandled — no UI is available here, so every outcome is
// logged instead of alerted. Purely a reporting pass: no automatic edits.
function dailyMaintenanceTrigger_() {
  try {
    const settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
    if (!settingsSheet || !isMaintenanceEnabled_(settingsSheet)) return;
    runDailyMaintenance_(false);
  } catch (e) {
    Logger.log('dailyMaintenanceTrigger_ failed: ' + e.message);
  }
}
