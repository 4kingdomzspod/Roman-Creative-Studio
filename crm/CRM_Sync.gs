/**
 * CRM_Sync.gs
 * ---------------------------------------------------------------------------
 * "RCS CRM > Sync Prospects" + "RCS CRM > Auto Sync". Pulls
 * outreach/prospects.csv from GitHub and runs it through the exact same
 * importProspectsFromCsv_() (CRM_Import.gs) used by the manual CSV import —
 * same column matching/aliases, same duplicate skipping, same append-only
 * behavior. Nothing about how a row gets imported differs between "upload
 * a file" and "sync from GitHub" — only where the CSV text comes from.
 *
 * The GitHub Sync panel lives on Settings in columns H:I (separate from the
 * six dropdown-list columns in A:F) and is the single source of truth for
 * Auto Sync Enabled / Last Sync Time / Last Commit SHA / Last Sync Result —
 * no hidden state in PropertiesService or anywhere else, so what's on the
 * sheet is always the whole story.
 */

// Where "Sync Prospects" pulls outreach/prospects.csv from. GITHUB_TOKEN is
// only needed if this repo is ever made private — a public repo's contents
// and commit history are readable by GitHub's API with no auth. Leave it
// blank for a public repo. If set, it's sent as an Authorization header and
// is never written to a log, an alert, or the Settings sheet — the only
// thing GitHub-Sync-related that becomes visible anywhere is the commit SHA.
const GITHUB_OWNER = 'RomanCreativeStudio';
const GITHUB_REPO = 'Roman-Creative-Studio';
const GITHUB_BRANCH = 'main';
const GITHUB_CSV_PATH = 'outreach/prospects.csv';
const GITHUB_TOKEN = '';

const SYNC_LABEL_COL = 8;  // column H
const SYNC_VALUE_COL = 9;  // column I
const SYNC_ROWS = { header: 1, enabled: 2, lastSyncTime: 3, lastSha: 4, lastResult: 5 };
const AUTO_SYNC_HANDLER = 'hourlySyncTrigger_';

// ---------------------------------------------------------------------------
// Settings sync panel
// ---------------------------------------------------------------------------

// Idempotent: only fills in labels/checkbox that aren't already there, and
// never touches the live values (Enabled state, Last Sync Time/SHA/Result)
// once they exist — those are state, not config to be reset on every build.
function ensureSyncStatusBlock_(sheet) {
  if (sheet.getRange(SYNC_ROWS.header, SYNC_LABEL_COL).getValue() === '') {
    writeSectionHeader_(sheet, SYNC_ROWS.header, SYNC_LABEL_COL, SYNC_VALUE_COL, 'GitHub Sync');
  }

  const labels = {};
  labels[SYNC_ROWS.enabled] = 'Auto Sync Enabled';
  labels[SYNC_ROWS.lastSyncTime] = 'Last Sync Time';
  labels[SYNC_ROWS.lastSha] = 'Last Commit SHA';
  labels[SYNC_ROWS.lastResult] = 'Last Sync Result';

  Object.keys(labels).forEach(function (rowStr) {
    const row = Number(rowStr);
    const labelCell = sheet.getRange(row, SYNC_LABEL_COL);
    if (labelCell.getValue() === '') {
      labelCell.setValue(labels[row]).setFontWeight('bold').setBackground('#eceef5');
    }
  });

  const enabledCell = sheet.getRange(SYNC_ROWS.enabled, SYNC_VALUE_COL);
  if (enabledCell.getValue() === '') {
    enabledCell.insertCheckboxes(); // unchecked (FALSE) by default — auto sync is opt-in
  }

  sheet.setColumnWidth(SYNC_LABEL_COL, 150);
  sheet.setColumnWidth(SYNC_VALUE_COL, 220);
}

function isAutoSyncEnabled_(settingsSheet) {
  return settingsSheet.getRange(SYNC_ROWS.enabled, SYNC_VALUE_COL).getValue() === true;
}

function updateSyncStatus_(settingsSheet, sha, resultText) {
  settingsSheet.getRange(SYNC_ROWS.lastSyncTime, SYNC_VALUE_COL)
    .setValue(new Date())
    .setNumberFormat('yyyy-mm-dd hh:mm');
  settingsSheet.getRange(SYNC_ROWS.lastSha, SYNC_VALUE_COL).setValue(sha);
  settingsSheet.getRange(SYNC_ROWS.lastResult, SYNC_VALUE_COL).setValue(resultText);
}

// ---------------------------------------------------------------------------
// GitHub calls
// ---------------------------------------------------------------------------

function githubHeaders_() {
  const headers = { 'Accept': 'application/vnd.github+json' };
  if (GITHUB_TOKEN) headers['Authorization'] = 'token ' + GITHUB_TOKEN;
  return headers;
}

// One lightweight call: the latest commit that actually touched
// GITHUB_CSV_PATH. This is what "no unnecessary CSV downloads" is built
// on — checking this is cheap, so runProspectsSync_ can skip the (larger)
// raw file fetch and the import entirely when nothing has changed.
function getLatestProspectsCommitSha_() {
  const url = 'https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO +
    '/commits?path=' + encodeURIComponent(GITHUB_CSV_PATH) + '&sha=' + GITHUB_BRANCH + '&per_page=1';

  try {
    const response = UrlFetchApp.fetch(url, { headers: githubHeaders_(), muteHttpExceptions: true });
    const code = response.getResponseCode();

    if (code === 403) {
      return { ok: false, message: 'GitHub API rate limit reached (403). This is more likely on Google\'s shared IP pool for unauthenticated requests — set GITHUB_TOKEN in the script for a higher limit if this keeps happening.' };
    }
    if (code !== 200) {
      return { ok: false, message: 'GitHub API returned HTTP ' + code + ' while looking up commits for ' + GITHUB_CSV_PATH + '.' };
    }

    const commits = JSON.parse(response.getContentText());
    if (!commits || commits.length === 0) {
      return { ok: false, message: 'No commit history found for ' + GITHUB_CSV_PATH + ' on branch ' + GITHUB_BRANCH + ' — the file may not exist at this path.' };
    }

    return { ok: true, sha: commits[0].sha };
  } catch (e) {
    return { ok: false, message: 'Network error while contacting the GitHub API: ' + e.message };
  }
}

// Fetches the file's raw content pinned to a specific commit SHA, so what
// gets imported is guaranteed to match the SHA that was just checked — no
// race with something else being pushed in between the two calls.
function fetchRawFileAtCommit_(sha) {
  const url = 'https://raw.githubusercontent.com/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/' + sha + '/' + GITHUB_CSV_PATH;

  try {
    const response = UrlFetchApp.fetch(url, { headers: githubHeaders_(), muteHttpExceptions: true });
    const code = response.getResponseCode();

    if (code === 404) {
      return { ok: false, message: GITHUB_CSV_PATH + ' was not found at commit ' + sha.slice(0, 7) + ' — it may have been moved or deleted.' };
    }
    if (code !== 200) {
      return { ok: false, message: 'GitHub returned HTTP ' + code + ' while fetching ' + GITHUB_CSV_PATH + ' at commit ' + sha.slice(0, 7) + '.' };
    }
    return { ok: true, csvText: response.getContentText() };
  } catch (e) {
    return { ok: false, message: 'Network error while fetching the file from GitHub: ' + e.message };
  }
}

// ---------------------------------------------------------------------------
// Sync
// ---------------------------------------------------------------------------

function menuSyncProspects_() {
  runProspectsSync_(true);
}

// interactive=true (menu click) shows a UI alert; interactive=false
// (hourly trigger) has no UI context available, so it logs instead —
// same pattern notify_() (Code.gs) already uses.
function runProspectsSync_(interactive) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const prospectsSheet = ss.getSheetByName('Prospects');
  const settingsSheet = ss.getSheetByName('Settings');

  if (!prospectsSheet || !settingsSheet) {
    reportSyncResult_(interactive, 'Sync failed: Prospects or Settings sheet not found — run "Build / Update CRM" first.');
    return;
  }

  ensureSyncStatusBlock_(settingsSheet);

  const shaResult = getLatestProspectsCommitSha_();
  if (!shaResult.ok) {
    reportSyncResult_(interactive, 'Sync failed: ' + shaResult.message);
    return;
  }

  const lastSha = settingsSheet.getRange(SYNC_ROWS.lastSha, SYNC_VALUE_COL).getValue();
  if (lastSha && String(lastSha).trim() === shaResult.sha) {
    // Unchanged since the last sync — do not download or import the CSV.
    const upToDateMsg = 'Already up to date — no new commits to ' + GITHUB_CSV_PATH + ' since the last sync.';
    updateSyncStatus_(settingsSheet, shaResult.sha, 'Imported: 0, Skipped: 0, Errors: 0 (no changes)');
    reportSyncResult_(interactive, upToDateMsg + '\nLast Sync: ' + formatSyncTimestamp_());
    return;
  }

  const rawResult = fetchRawFileAtCommit_(shaResult.sha);
  if (!rawResult.ok) {
    reportSyncResult_(interactive, 'Sync failed: ' + rawResult.message);
    return;
  }

  // Same parser, same column matching/aliases, same duplicate skipping,
  // same append-only behavior as the manual "Import Prospects..." dialog
  // — nothing about import logic is reimplemented here.
  const importResult = importProspectsFromCsv_(rawResult.csvText);

  const resultLine = 'Imported: ' + importResult.imported + ', Skipped: ' + importResult.skipped + ', Errors: ' + importResult.errors;
  updateSyncStatus_(settingsSheet, shaResult.sha, resultLine);

  let summary = 'Imported: ' + importResult.imported +
    '\nSkipped (duplicates): ' + importResult.skipped +
    '\nErrors: ' + importResult.errors +
    '\nLast Sync: ' + formatSyncTimestamp_();
  if (importResult.errorMessages && importResult.errorMessages.length) {
    summary += '\n\n' + importResult.errorMessages.slice(0, 10).join('\n');
  }

  reportSyncResult_(interactive, summary);
}

function formatSyncTimestamp_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
}

function reportSyncResult_(interactive, message) {
  if (interactive) {
    SpreadsheetApp.getUi().alert('Sync Prospects', message, SpreadsheetApp.getUi().ButtonSet.OK);
  } else {
    Logger.log('Sync Prospects: ' + message);
  }
}

// ---------------------------------------------------------------------------
// Auto Sync (hourly installable trigger)
// ---------------------------------------------------------------------------

function enableAutoSync_() {
  removeAutoSyncTriggers_();
  ScriptApp.newTrigger(AUTO_SYNC_HANDLER).timeBased().everyHours(1).create();

  const settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
  ensureSyncStatusBlock_(settingsSheet);
  settingsSheet.getRange(SYNC_ROWS.enabled, SYNC_VALUE_COL).setValue(true);

  SpreadsheetApp.getUi().alert('Auto Sync', 'Auto Sync enabled — Prospects will sync from GitHub every hour.', SpreadsheetApp.getUi().ButtonSet.OK);
}

function disableAutoSync_() {
  removeAutoSyncTriggers_();

  const settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
  ensureSyncStatusBlock_(settingsSheet);
  settingsSheet.getRange(SYNC_ROWS.enabled, SYNC_VALUE_COL).setValue(false);

  SpreadsheetApp.getUi().alert('Auto Sync', 'Auto Sync disabled.', SpreadsheetApp.getUi().ButtonSet.OK);
}

// Deletes any existing hourly-sync triggers before (re)creating one, so
// clicking "Enable Auto Sync" more than once never results in two triggers
// double-syncing every hour.
function removeAutoSyncTriggers_() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === AUTO_SYNC_HANDLER) ScriptApp.deleteTrigger(t);
  });
}

// The actual hourly trigger callback. Re-checks Auto Sync Enabled itself
// (rather than trusting the trigger's mere existence) as a safety net, and
// never lets a failure go unhandled — a trigger that throws repeatedly is
// how you end up with Google silently disabling it. No UI is available
// here, so every outcome is logged instead of alerted.
function hourlySyncTrigger_() {
  try {
    const settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Settings');
    if (!settingsSheet || !isAutoSyncEnabled_(settingsSheet)) return;
    runProspectsSync_(false);
  } catch (e) {
    Logger.log('hourlySyncTrigger_ failed: ' + e.message);
  }
}
