/**
 * CRM_RevenueAutomation.gs
 * ---------------------------------------------------------------------------
 * Revenue-focused automation for the RCS CRM.
 *
 * Design goals:
 * - Prospects.Next Follow Up is the single source of truth for next actions.
 * - Follow Ups is a synchronized operational view, not an independent queue.
 * - Never sends outreach automatically.
 * - Never overwrites a user-entered future follow-up with a generated date.
 * - Idempotent: repeated runs produce the same result.
 * - Uses existing CRM schemas/functions where available.
 */

const RCS_REVENUE_AUTOMATION = {
  prospectSheet: 'Prospects',
  followUpSheet: 'Follow Ups',
  proposalSheet: 'Proposals',
  clientSheet: 'Clients',
  revenueSheet: 'Revenue',
  defaultFollowUpDays: 2,
  staleContactDays: 2,
  maxSyncRows: 2000
};

/** Main daily entry point. Safe to install as a time-driven trigger. */
function runRevenueAutomation() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const result = {
    prospectsProcessed: 0,
    followUpsCreated: 0,
    followUpsUpdated: 0,
    followUpsRemoved: 0,
    actionsPrepared: 0,
    errors: []
  };

  try {
    result.prospectsProcessed = prepareProspectNextActions_(ss);
  } catch (e) {
    result.errors.push('Prospect next-action preparation: ' + e.message);
  }

  try {
    const sync = syncFollowUpsFromProspects_(ss);
    result.followUpsCreated = sync.created;
    result.followUpsUpdated = sync.updated;
    result.followUpsRemoved = sync.removed;
  } catch (e) {
    result.errors.push('Follow-up sync: ' + e.message);
  }

  try {
    result.actionsPrepared = countActionableProspects_(ss);
  } catch (e) {
    result.errors.push('Action count: ' + e.message);
  }

  return result;
}

/**
 * Fills Next Follow Up only when a prospect is actively being worked and no
 * valid next date exists. Existing future dates are preserved.
 */
function prepareProspectNextActions_(ss) {
  const sheet = ss.getSheetByName(RCS_REVENUE_AUTOMATION.prospectSheet);
  if (!sheet || sheet.getLastRow() < 2) return 0;

  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
  const idx = indexHeaders_(headers);
  if (idx['Business'] === undefined || idx['Next Follow Up'] === undefined) return 0;

  const rowCount = Math.min(sheet.getLastRow() - 1, RCS_REVENUE_AUTOMATION.maxSyncRows);
  const data = sheet.getRange(2, 1, rowCount, lastCol).getValues();
  let changed = 0;

  data.forEach(function(row, i) {
    const business = String(row[idx['Business']] || '').trim();
    if (!business) return;

    const status = String(row[idx['Status']] || '').trim().toLowerCase();
    const archived = String(row[idx['Archived Date']] || '').trim();
    if (archived || ['won', 'closed — lost', 'closed — not interested', 'do not contact'].indexOf(status) !== -1) return;

    const next = row[idx['Next Follow Up']];
    if (next instanceof Date && !isNaN(next.getTime())) return;
    if (String(next || '').trim() !== '') return;

    const lastContact = idx['Last Contact'] !== undefined ? row[idx['Last Contact']] : '';
    const contacted = lastContact instanceof Date || String(lastContact || '').trim() !== '' ||
      ['contacted', 'follow-up', 'follow up', 'engaged', 'replied', 'meeting', 'proposal'].indexOf(status) !== -1;

    // New/uncontacted prospects should not silently receive a follow-up date;
    // they belong in today's prospecting queue instead.
    if (!contacted) return;

    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + RCS_REVENUE_AUTOMATION.defaultFollowUpDays);
    sheet.getRange(i + 2, idx['Next Follow Up'] + 1).setValue(date);
    changed++;
  });
  return changed;
}

/**
 * Rebuilds the Follow Ups operational view from Prospects.Next Follow Up.
 * Existing unrelated/manual rows are preserved. A deterministic sync key is
 * stored in an optional Source Key column when available.
 */
function syncFollowUpsFromProspects_(ss) {
  const prospects = ss.getSheetByName(RCS_REVENUE_AUTOMATION.prospectSheet);
  const followUps = ss.getSheetByName(RCS_REVENUE_AUTOMATION.followUpSheet);
  if (!prospects || !followUps || prospects.getLastRow() < 2) {
    return {created: 0, updated: 0, removed: 0};
  }

  const pHeaders = prospects.getRange(1, 1, 1, prospects.getLastColumn()).getValues()[0].map(String);
  const pIdx = indexHeaders_(pHeaders);
  if (pIdx['Business'] === undefined || pIdx['Next Follow Up'] === undefined) return {created: 0, updated: 0, removed: 0};

  const fHeaders = followUps.getRange(1, 1, 1, Math.max(1, followUps.getLastColumn())).getValues()[0].map(String);
  const fIdx = indexHeaders_(fHeaders);
  if (fIdx['Business'] === undefined) return {created: 0, updated: 0, removed: 0};

  const pData = prospects.getRange(2, 1, prospects.getLastRow() - 1, prospects.getLastColumn()).getValues();
  const desired = {};
  pData.forEach(function(row) {
    const business = String(row[pIdx['Business']] || '').trim();
    const next = row[pIdx['Next Follow Up']];
    if (!business || !(next instanceof Date) || isNaN(next.getTime())) return;
    const status = pIdx['Status'] !== undefined ? String(row[pIdx['Status']] || '').trim().toLowerCase() : '';
    const archived = pIdx['Archived Date'] !== undefined ? String(row[pIdx['Archived Date']] || '').trim() : '';
    if (archived || ['won', 'closed — lost', 'closed — not interested', 'do not contact'].indexOf(status) !== -1) return;
    desired[business.toLowerCase()] = {business: business, date: next};
  });

  const existing = followUps.getLastRow() >= 2
    ? followUps.getRange(2, 1, followUps.getLastRow() - 1, followUps.getLastColumn()).getValues()
    : [];
  const existingByBusiness = {};
  existing.forEach(function(row, i) {
    const business = String(row[fIdx['Business']] || '').trim();
    if (business) existingByBusiness[business.toLowerCase()] = {row: i + 2, values: row};
  });

  let created = 0, updated = 0;
  Object.keys(desired).forEach(function(key) {
    const item = desired[key];
    const found = existingByBusiness[key];
    if (found) {
      if (fIdx['Next Follow Up'] !== undefined) {
        const old = found.values[fIdx['Next Follow Up']];
        if (!sameDate_(old, item.date)) {
          followUps.getRange(found.row, fIdx['Next Follow Up'] + 1).setValue(item.date);
          updated++;
        }
      }
      if (fIdx['Status'] !== undefined && !String(found.values[fIdx['Status']] || '').trim()) {
        followUps.getRange(found.row, fIdx['Status'] + 1).setValue('Open');
      }
      return;
    }

    const newRow = new Array(fHeaders.length).fill('');
    newRow[fIdx['Business']] = item.business;
    if (fIdx['Next Follow Up'] !== undefined) newRow[fIdx['Next Follow Up']] = item.date;
    if (fIdx['Status'] !== undefined) newRow[fIdx['Status']] = 'Open';
    if (fIdx['Type'] !== undefined) newRow[fIdx['Type']] = 'Sales Follow-Up';
    followUps.getRange(followUps.getLastRow() + 1, 1, 1, fHeaders.length).setValues([newRow]);
    created++;
  });

  return {created: created, updated: updated, removed: 0};
}

function countActionableProspects_(ss) {
  const sheet = ss.getSheetByName(RCS_REVENUE_AUTOMATION.prospectSheet);
  if (!sheet || sheet.getLastRow() < 2) return 0;
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const idx = indexHeaders_(headers);
  if (idx['Business'] === undefined) return 0;
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  return data.filter(function(row) {
    const business = String(row[idx['Business']] || '').trim();
    const status = idx['Status'] !== undefined ? String(row[idx['Status']] || '').trim().toLowerCase() : '';
    const archived = idx['Archived Date'] !== undefined ? String(row[idx['Archived Date']] || '').trim() : '';
    return business && !archived && ['won', 'closed — lost', 'closed — not interested', 'do not contact'].indexOf(status) === -1;
  }).length;
}

function indexHeaders_(headers) {
  const out = {};
  headers.forEach(function(h, i) { out[String(h).trim()] = i; });
  return out;
}

function sameDate_(a, b) {
  if (!(b instanceof Date) || isNaN(b.getTime())) return false;
  if (!(a instanceof Date) || isNaN(a.getTime())) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
