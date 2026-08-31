/**
 * CRM_Sync.gs
 * ---------------------------------------------------------------------------
 * "RCS CRM > Sync Prospects" + "RCS CRM > Auto Sync". Pulls
 * outreach/prospects.csv from GitHub and runs it through the exact same
 * importProspectsFromCsv_() (CRM_Import.gs) used by the manual CSV import —
 * same column matching/aliases, same duplicate skipping, same append-only
 * behavior (which itself calls initializeProspectRow_, unchanged) — nothing
 * about how a row gets imported differs between "upload a file" and "sync
 * from GitHub" — only where the CSV text comes from.
 *
 * The GitHub Sync panel lives on Settings in columns H:I (separate from the
 * six dropdown-list columns in A:F) and is the single source of truth for
 * Auto Sync Enabled / Last Sync Time / Last Commit SHA / Last Sync Result —
 * no hidden state in PropertiesService or anywhere else, so what's on the
 * sheet is always the whole story.
 *
 * GITHUB_TOKEN: read only from Script Properties (getGithubToken_) via the
 * same mechanism already used for the Tavily/Gemini keys
 * (CRM_OutreachAutomation.gs) — never hard-coded, never logged, never
 * written to a Sheet, never echoed in an error message. Required: a missing
 * token fails immediately with one clear, actionable message before any
 * GitHub request is attempted (no repeated unauthenticated calls). Sent via
 * `Authorization: Bearer <token>`, GitHub's current documented format.
 */

const GITHUB_OWNER = 'RomanCreativeStudio';
const GITHUB_REPO = 'Roman-Creative-Studio';
const GITHUB_BRANCH = 'main';
const GITHUB_CSV_PATH = 'outreach/prospects.csv';
const GITHUB_API_VERSION = '2022-11-28';
const GITHUB_TOKEN_PROPERTY = 'GITHUB_TOKEN';

function getGithubToken_() {
  return String(PropertiesService.getScriptProperties().getProperty(GITHUB_TOKEN_PROPERTY) || '').trim();
}

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

function githubHeaders_(token) {
  return {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': GITHUB_API_VERSION,
    'Authorization': 'Bearer ' + token
  };
}

// Single classifier shared by every GitHub call below — the one place that
// tells apart authentication failure / permission failure / actual rate
// limit / missing repo-or-file / other HTTP failure, so a 403 is never
// blindly reported as "rate limit" (GitHub returns 403 for several
// different reasons; only X-RateLimit-Remaining: 0 actually means that).
// Never reads or echoes the token — only the response GitHub sent back.
function classifyGithubResponse_(response, contextLabel) {
  const code = response.getResponseCode();
  if (code >= 200 && code < 300) return { ok: true, code: code };

  let bodyMessage = '';
  try { bodyMessage = String(JSON.parse(response.getContentText() || '{}').message || ''); } catch (e) { /* non-JSON body — ignore */ }

  if (code === 401) {
    return { ok: false, kind: 'auth', message: 'GitHub authentication failed (401) — GITHUB_TOKEN is invalid, expired, or revoked. Generate a new token and update it in Script Properties.' };
  }

  if (code === 403) {
    const headers = response.getHeaders() || {};
    const remaining = headers['X-RateLimit-Remaining'] || headers['x-ratelimit-remaining'];
    const reset = headers['X-RateLimit-Reset'] || headers['x-ratelimit-reset'];
    if (String(remaining) === '0') {
      return { ok: false, kind: 'rate_limit', message: 'GitHub API rate limit reached (403) — 0 requests remaining, resets ' + formatRateLimitReset_(reset) + '.' };
    }
    if (/abuse detection/i.test(bodyMessage)) {
      return { ok: false, kind: 'rate_limit', message: 'GitHub API secondary rate limit triggered (403) — please wait a few minutes and try again.' };
    }
    return { ok: false, kind: 'permission', message: 'GitHub denied the request (403) — GITHUB_TOKEN likely lacks access to ' + GITHUB_OWNER + '/' + GITHUB_REPO + ' (check the token\'s repository access/scopes).' };
  }

  if (code === 404) {
    return { ok: false, kind: 'not_found', message: 'GitHub returned 404 while ' + contextLabel + ' — the repository/branch/file may not exist, or GITHUB_TOKEN may not have access to it.' };
  }

  return { ok: false, kind: 'other', message: 'GitHub API returned HTTP ' + code + ' while ' + contextLabel + '.' };
}

function formatRateLimitReset_(resetHeader) {
  const ts = Number(resetHeader);
  if (!ts || isNaN(ts)) return 'at an unknown time';
  return Utilities.formatDate(new Date(ts * 1000), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
}

// One lightweight call: the latest commit that actually touched
// GITHUB_CSV_PATH. This is what "no unnecessary CSV downloads" is built
// on — checking this is cheap, so runProspectsSync_ can skip the (larger)
// raw file fetch and the import entirely when nothing has changed.
function getLatestProspectsCommitSha_(token) {
  const url = 'https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO +
    '/commits?path=' + encodeURIComponent(GITHUB_CSV_PATH) + '&sha=' + GITHUB_BRANCH + '&per_page=1';

  try {
    const response = UrlFetchApp.fetch(url, { headers: githubHeaders_(token), muteHttpExceptions: true });
    const outcome = classifyGithubResponse_(response, 'looking up commits for ' + GITHUB_CSV_PATH);
    if (!outcome.ok) return outcome;

    const commits = JSON.parse(response.getContentText());
    if (!commits || commits.length === 0) {
      return { ok: false, kind: 'not_found', message: 'No commit history found for ' + GITHUB_CSV_PATH + ' on branch ' + GITHUB_BRANCH + ' — the file may not exist at this path.' };
    }

    return { ok: true, sha: commits[0].sha };
  } catch (e) {
    return { ok: false, kind: 'network', message: 'Network error while contacting the GitHub API: ' + e.message };
  }
}

// Fetches the file's raw content pinned to a specific commit SHA, so what
// gets imported is guaranteed to match the SHA that was just checked — no
// race with something else being pushed in between the two calls.
function fetchRawFileAtCommit_(sha, token) {
  const url = 'https://raw.githubusercontent.com/' + GITHUB_OWNER + '/' + GITHUB_REPO + '/' + sha + '/' + GITHUB_CSV_PATH;

  try {
    const response = UrlFetchApp.fetch(url, { headers: githubHeaders_(token), muteHttpExceptions: true });
    const outcome = classifyGithubResponse_(response, 'fetching ' + GITHUB_CSV_PATH + ' at commit ' + sha.slice(0, 7));
    if (!outcome.ok) return outcome;
    return { ok: true, csvText: response.getContentText() };
  } catch (e) {
    return { ok: false, kind: 'network', message: 'Network error while fetching the file from GitHub: ' + e.message };
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

  // Required, checked before any GitHub request is attempted — never falls
  // back to an unauthenticated call, and never retries one on a schedule.
  const token = getGithubToken_();
  if (!token) {
    reportSyncResult_(interactive, 'GitHub sync requires GITHUB_TOKEN in Apps Script → Project Settings → Script Properties.');
    return;
  }

  const shaResult = getLatestProspectsCommitSha_(token);
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

  const rawResult = fetchRawFileAtCommit_(shaResult.sha, token);
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
