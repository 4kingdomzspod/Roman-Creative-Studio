/**
 * CRM_OutreachWorkflow.gs
 * ---------------------------------------------------------------------------
 * Three menu actions that carry an outreach forward after a brief has been
 * sent: Mark as Contacted, Schedule Follow-Up, and Generate Follow-Up
 * Message. All three act on whichever Prospects row(s) are selected, reuse
 * getSelectedProspectRows_ (CRM_Actions.gs) and getLiveProspectsHeaders_
 * (CRM_Outreach.gs), and — like every other action in this CRM — only ever
 * edit specific cells on an explicitly selected row. Nothing is deleted,
 * archived, or moved to another sheet by anything in this file.
 *
 * Generate Follow-Up Message reuses the Outreach Brief already stored on
 * Prospects (Sprint 5) rather than re-deriving anything from Website
 * Audits — the follow-up stays consistent with whatever was actually sent
 * the first time. It's deterministic/template-based: no AI API, no
 * external service, nothing invented beyond what's already in the stored
 * brief and the prospect's own Status.
 *
 * Prospects.Next Follow Up is the single source of truth for a prospect's
 * next follow-up date; syncFollowUpsFromProspects_ below makes the
 * "Follow Ups" sheet a synchronized operational view of it (never the
 * other way around). Sync only ever creates a Follow Ups row for a
 * prospect that both has a Next Follow Up date AND isn't
 * Won/Closed/Do Not Contact/Archived, updates Due/Priority/Status on an
 * existing row by normalized Business match, and never touches that row's
 * own Reminder/Notes — so manually-entered operational data is preserved.
 */

// ---------------------------------------------------------------------------
// Mark as Contacted
// ---------------------------------------------------------------------------

// Default follow-up window used only when a prospect is actually contacted
// and doesn't already have a Next Follow Up date — the moment of contact is
// exactly when a follow-up becomes meaningful (not merely existing as a
// prospect, which never auto-schedules anything — see CRM_NextAction.gs /
// initializeProspectRow_ in CRM_Actions.gs).
const CONTACT_FOLLOWUP_DEFAULT_DAYS = 3;

function menuMarkAsContacted_() {
  const rows = getSelectedProspectRows_(); // CRM_Actions.gs
  if (!rows) return;

  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const prospects = ss.getSheetByName('Prospects');
  const pHeaders = getLiveProspectsHeaders_(prospects); // CRM_Outreach.gs
  const bIdx = pHeaders.indexOf('Business');
  const statusIdx = pHeaders.indexOf('Status');
  const lastContactIdx = pHeaders.indexOf('Last Contact');
  const nfuIdx = pHeaders.indexOf('Next Follow Up');

  const targets = [];
  let missingBusiness = 0;
  rows.forEach(function (r) {
    const business = String(prospects.getRange(r, bIdx + 1).getValue() || '').trim();
    if (business === '') { missingBusiness++; return; }
    const existingFollowUp = nfuIdx !== -1 ? String(prospects.getRange(r, nfuIdx + 1).getValue() || '').trim() : '';
    targets.push({ row: r, business: business, existingFollowUp: existingFollowUp });
  });

  if (targets.length === 0) {
    ui.alert('Mark as Contacted', 'The selected row(s) don’t have a Business name — nothing to update.', ui.ButtonSet.OK);
    return;
  }

  const question = targets.length === 1
    ? 'Mark ' + targets[0].business + ' as Contacted (Status + Last Contact set to today)?'
    : 'Mark these ' + targets.length + ' prospects as Contacted (Status + Last Contact set to today)?';
  if (ui.alert('Mark as Contacted', question, ui.ButtonSet.YES_NO) !== ui.Button.YES) return;

  const today = new Date();
  let followUpsGenerated = 0;
  targets.forEach(function (t) {
    if (statusIdx !== -1) prospects.getRange(t.row, statusIdx + 1).setValue('Contacted');
    if (lastContactIdx !== -1) prospects.getRange(t.row, lastContactIdx + 1).setValue(today).setNumberFormat('yyyy-mm-dd');
    // Generate a follow-up date only when appropriate: the prospect is
    // actually being contacted right now AND doesn't already have one — an
    // existing future (or past) date set by the user is never overwritten.
    if (nfuIdx !== -1 && t.existingFollowUp === '') {
      const followUpDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + CONTACT_FOLLOWUP_DEFAULT_DAYS);
      prospects.getRange(t.row, nfuIdx + 1).setValue(followUpDate).setNumberFormat('yyyy-mm-dd');
      followUpsGenerated++;
    }
  });

  if (typeof syncFollowUpsFromProspects_ === 'function') syncFollowUpsFromProspects_(); // keep Follow Ups reconciled

  const summary = (targets.length === 1 ? '1 prospect' : targets.length + ' prospects') + ' marked as Contacted.' +
    (followUpsGenerated ? '\nFollow-up date set (+' + CONTACT_FOLLOWUP_DEFAULT_DAYS + ' days) for ' + followUpsGenerated + ' prospect(s) that had none.' : '') +
    (missingBusiness ? '\n(' + missingBusiness + ' other selected row(s) had no Business name and were skipped.)' : '');
  ui.alert('Mark as Contacted', summary, ui.ButtonSet.OK);
}

// ---------------------------------------------------------------------------
// Schedule Follow-Up
// ---------------------------------------------------------------------------

function menuScheduleFollowUp_() {
  const rows = getSelectedProspectRows_(); // CRM_Actions.gs
  if (!rows) return;

  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('Schedule Follow-Up', 'Enter the follow-up date (yyyy-mm-dd):', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() !== ui.Button.OK) return;

  const dateText = response.getResponseText().trim();
  if (!isValidDateString_(dateText)) {
    ui.alert('Schedule Follow-Up', 'That doesn’t look like a valid date — expected yyyy-mm-dd (e.g. 2026-09-15).', ui.ButtonSet.OK);
    return;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const prospects = ss.getSheetByName('Prospects');
  const pHeaders = getLiveProspectsHeaders_(prospects); // CRM_Outreach.gs
  const bIdx = pHeaders.indexOf('Business');
  const nfuIdx = pHeaders.indexOf('Next Follow Up');

  const targets = [];
  let missingBusiness = 0;
  rows.forEach(function (r) {
    const business = String(prospects.getRange(r, bIdx + 1).getValue() || '').trim();
    if (business === '') { missingBusiness++; return; }
    const existing = nfuIdx !== -1 ? String(prospects.getRange(r, nfuIdx + 1).getValue() || '').trim() : '';
    targets.push({ row: r, business: business, existing: existing });
  });

  if (targets.length === 0) {
    ui.alert('Schedule Follow-Up', 'The selected row(s) don’t have a Business name — nothing to schedule.', ui.ButtonSet.OK);
    return;
  }

  const hasExisting = targets.some(function (t) { return t.existing !== ''; });
  if (hasExisting) {
    const question = targets.length === 1
      ? targets[0].business + ' already has a Next Follow Up date (' + targets[0].existing + '). Overwrite it with ' + dateText + '?'
      : 'One or more selected prospects already have a Next Follow Up date. Overwrite existing date(s) with ' + dateText + '?';
    if (ui.alert('Schedule Follow-Up', question, ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  }

  const dateValue = new Date(dateText + 'T00:00:00');
  targets.forEach(function (t) {
    if (nfuIdx !== -1) prospects.getRange(t.row, nfuIdx + 1).setValue(dateValue).setNumberFormat('yyyy-mm-dd');
  });

  if (typeof syncFollowUpsFromProspects_ === 'function') syncFollowUpsFromProspects_(); // keep Follow Ups reconciled

  const summary = 'Next Follow Up set to ' + dateText + ' for ' + targets.length + (targets.length === 1 ? ' prospect.' : ' prospects.') +
    (missingBusiness ? '\n(' + missingBusiness + ' other selected row(s) had no Business name and were skipped.)' : '');
  ui.alert('Schedule Follow-Up', summary, ui.ButtonSet.OK);
}

// yyyy-mm-dd, and a real calendar date (catches e.g. 2026-02-30).
function isValidDateString_(text) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;
  const d = new Date(text + 'T00:00:00');
  if (isNaN(d.getTime())) return false;
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd') === text;
}

// ---------------------------------------------------------------------------
// Generate Follow-Up Message
// ---------------------------------------------------------------------------

// Deterministic, per-Status opening lines. Only the 5 statuses named in
// this sprint's spec get a tailored template; anything else (New, Call
// Booked, Proposal Sent, Won, etc.) falls back to a neutral default rather
// than refusing to generate a message at all.
const OUTREACH_FOLLOWUP_TEMPLATES = {
  'Contacted': function (business, issueClause) {
    return 'Hi, following up on my note about ' + business + '’s website' + issueClause +
      '. Happy to answer any questions or walk through what a quick fix could look like — would you be open to a short call?';
  },
  'Follow-up 1 Sent': function (business, issueClause) {
    return 'Hi again — just wanted to bump this up in case it got buried' + issueClause +
      '. No pressure at all, just let me know if it’s worth a quick conversation.';
  },
  'Follow-up 2 Sent': function (business, issueClause) {
    return 'Hi, last note from me on this for now' + issueClause + '. If a website refresh is ever useful for ' +
      business + ' down the line, I’m happy to help whenever the timing is right.';
  },
  'No Response': function (business, issueClause) {
    return 'Hi, I haven’t heard back so I’ll leave this here for now. If ' + business +
      '’s website ever becomes a priority, feel free to reach out anytime.';
  },
  'Nurture': function (business, issueClause) {
    return 'Hi, checking back in on ' + business + '. Is now a better time to revisit the website conversation' +
      issueClause + ', or should I follow up again later?';
  }
};

function outreachFollowUpDefaultTemplate_(business, issueClause) {
  return 'Hi, following up regarding ' + business + '’s website' + issueClause + '. Would you be open to a quick conversation about it?';
}

function menuGenerateFollowUpMessage_() {
  const rows = getSelectedProspectRows_(); // CRM_Actions.gs
  if (!rows) return;

  const ui = SpreadsheetApp.getUi();
  if (rows.length > 1) {
    ui.alert('Generate Follow-Up Message', 'Select a single prospect to generate a follow-up message.', ui.ButtonSet.OK);
    return;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const prospects = ss.getSheetByName('Prospects');
  const pHeaders = getLiveProspectsHeaders_(prospects); // CRM_Outreach.gs
  const bIdx = pHeaders.indexOf('Business');
  const statusIdx = pHeaders.indexOf('Status');
  const notesIdx = pHeaders.indexOf('Notes');
  const briefIdx = pHeaders.indexOf(OUTREACH_BRIEF_COLUMN); // CRM_Outreach.gs constant

  const row = rows[0];
  const rowValues = prospects.getRange(row, 1, 1, pHeaders.length).getValues()[0];
  const business = String(rowValues[bIdx] || '').trim();

  if (business === '') {
    ui.alert('Generate Follow-Up Message', 'The selected row doesn’t have a Business name — nothing to generate.', ui.ButtonSet.OK);
    return;
  }

  const briefText = briefIdx !== -1 ? String(rowValues[briefIdx] || '').trim() : '';
  if (briefText === '') {
    ui.alert('Generate Follow-Up Message', 'No Outreach Brief found for ' + business +
      ' — generate one first via RCS CRM > Outreach Tools > Generate Outreach Brief.', ui.ButtonSet.OK);
    return;
  }

  const status = statusIdx !== -1 ? String(rowValues[statusIdx] || '').trim() : '';
  const message = buildFollowUpMessage_(business, status, briefText);

  // Always display first — this satisfies "display for copy/use" even if
  // the user declines to save it anywhere.
  ui.alert('Follow-Up Message — ' + business, message, ui.ButtonSet.OK);

  if (notesIdx === -1) return; // nowhere to save it even if they say yes
  const saveResponse = ui.alert('Generate Follow-Up Message', 'Save this message to the Notes field for ' + business + '?', ui.ButtonSet.YES_NO);
  if (saveResponse !== ui.Button.YES) return;

  const existingNotes = String(rowValues[notesIdx] || '').trim();
  const stamped = '[Follow-Up ' + formatAuditDate_(new Date()) + ']: ' + message; // formatAuditDate_ from CRM_Audits.gs
  const newNotes = existingNotes === '' ? stamped : existingNotes + '\n\n' + stamped;
  prospects.getRange(row, notesIdx + 1).setValue(newNotes);
}

function buildFollowUpMessage_(business, status, briefText) {
  const topIssues = parseBriefTopIssues_(briefText);
  const issueClause = topIssues.length > 0 ? ' (specifically around ' + topIssues[0] + ')' : '';
  const templateFn = OUTREACH_FOLLOWUP_TEMPLATES[status] || outreachFollowUpDefaultTemplate_;
  return templateFn(business, issueClause);
}

// Pulls the "TOP ISSUES" list out of a stored Outreach Brief (Sprint 5's
// own text format) — reusing what was already generated rather than
// re-deriving anything from Website Audits again.
function parseBriefTopIssues_(briefText) {
  const m = String(briefText || '').match(/TOP ISSUES\n([\s\S]*?)(?:\n\n|$)/);
  if (!m) return [];
  return m[1].split('\n')
    .map(function (line) { return line.replace(/^\d+\.\s*/, '').trim(); })
    .filter(function (line) { return line !== '' && line.toLowerCase() !== 'no significant issues found in the audit.'; });
}

// ---------------------------------------------------------------------------
// Follow Ups sync — Prospects.Next Follow Up is the single source of truth;
// this makes "Follow Ups" a synchronized operational view of it, never a
// second source. Idempotent: matches existing Follow Ups rows by normalized
// Business (CRM_Health.gs's normalizeBusinessKey_), so a row is updated in
// place rather than duplicated on every call. Never deletes a row, and
// never touches Reminder/Notes on an existing row — those are the
// operational view's own manually-managed fields.
// ---------------------------------------------------------------------------

// Same "no new follow-up" exclusion set named in the Follow-Up Architecture
// spec (Won/Closed/Do Not Contact/Archived) — scoped to this file's own
// need, same pattern as every other per-file exclusion list in this CRM
// (HOT_ACTION_EXCLUDED_STATUSES, SCORE_EXCLUDED_STATUSES, etc.).
const FOLLOWUP_EXCLUDED_STATUSES = ['won', 'closed — lost', 'closed — not interested', 'do not contact', 'archived'];

// Guarded: reuses CRM_Health.gs's normalizeBusinessKey_ (the same
// whitespace-collapsing normalization used by duplicate detection and
// CRM_NextAction.gs) when it's available, falling back to a plain
// trim+lowercase otherwise — same defensive typeof pattern this CRM
// already uses for every other optional cross-file dependency, so this
// file never hard-crashes if CRM_Health.gs happens to be absent.
function followUpBusinessKey_(business) {
  return typeof normalizeBusinessKey_ === 'function'
    ? normalizeBusinessKey_(business)
    : String(business || '').trim().toLowerCase();
}

function menuSyncFollowUps_() {
  const ui = SpreadsheetApp.getUi();
  const result = syncFollowUpsFromProspects_();
  if (!result.ok) { ui.alert('Sync Follow Ups', result.message, ui.ButtonSet.OK); return; }
  ui.alert('Sync Follow Ups', 'Created: ' + result.created + '\nUpdated: ' + result.updated +
    '\n\nFollow Ups now reflects Prospects.Next Follow Up. Reminder/Notes on existing rows were left untouched.', ui.ButtonSet.OK);
}

function syncFollowUpsFromProspects_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const prospects = ss.getSheetByName('Prospects');
  const followUps = ss.getSheetByName('Follow Ups');
  if (!prospects || !followUps) return { ok: false, message: 'Prospects or Follow Ups sheet not found.', created: 0, updated: 0 };

  const pLastRow = prospects.getLastRow();
  if (pLastRow < 2) return { ok: true, created: 0, updated: 0 };

  const pHeaders = getLiveProspectsHeaders_(prospects); // CRM_Outreach.gs
  const pIdx = {};
  pHeaders.forEach(function (h, i) { pIdx[h] = i; });
  const pData = prospects.getRange(2, 1, pLastRow - 1, pHeaders.length).getValues();

  const fHeaders = getHeaders_('Follow Ups'); // CRM_Actions.gs — static schema
  const fIdx = {};
  fHeaders.forEach(function (h, i) { fIdx[h] = i; });
  if (fIdx['Business'] === undefined) return { ok: false, message: 'Follow Ups sheet is missing its Business column.', created: 0, updated: 0 };

  const fLastRow = followUps.getLastRow();
  const existingRowByBusiness = {};
  if (fLastRow >= 2) {
    followUps.getRange(2, fIdx['Business'] + 1, fLastRow - 1, 1).getValues().forEach(function (row, i) {
      const key = followUpBusinessKey_(String(row[0] || '').trim());
      if (key !== '' && existingRowByBusiness[key] === undefined) existingRowByBusiness[key] = 2 + i;
    });
  }

  let created = 0, updated = 0;
  const newRows = [];

  pData.forEach(function (row) {
    function field(name) { return pIdx[name] !== undefined ? row[pIdx[name]] : ''; }
    const business = String(field('Business') || '').trim();
    if (business === '') return;

    const nextFollowUp = field('Next Follow Up');
    if (nextFollowUp === '' || nextFollowUp === null || nextFollowUp === undefined) return; // nothing to sync yet

    const status = String(field('Status') || '').trim();
    const archivedDate = field('Archived Date');
    if (FOLLOWUP_EXCLUDED_STATUSES.indexOf(status.toLowerCase()) !== -1 || String(archivedDate || '').trim() !== '') return; // closed/DNC/archived never get a synced follow-up

    const priority = field('Priority');
    const existingRow = existingRowByBusiness[followUpBusinessKey_(business)];

    if (existingRow !== undefined) {
      if (fIdx['Due'] !== undefined) followUps.getRange(existingRow, fIdx['Due'] + 1).setValue(nextFollowUp).setNumberFormat('yyyy-mm-dd');
      if (fIdx['Priority'] !== undefined) followUps.getRange(existingRow, fIdx['Priority'] + 1).setValue(priority);
      if (fIdx['Status'] !== undefined) followUps.getRange(existingRow, fIdx['Status'] + 1).setValue(status);
      updated++;
    } else {
      const newRow = new Array(fHeaders.length).fill('');
      newRow[fIdx['Business']] = business;
      if (fIdx['Due'] !== undefined) newRow[fIdx['Due']] = nextFollowUp;
      if (fIdx['Priority'] !== undefined) newRow[fIdx['Priority']] = priority;
      if (fIdx['Status'] !== undefined) newRow[fIdx['Status']] = status;
      newRows.push(newRow);
      created++;
    }
  });

  if (newRows.length > 0) {
    const startRow = followUps.getLastRow() + 1;
    followUps.getRange(startRow, 1, newRows.length, fHeaders.length).setValues(newRows);
    if (fIdx['Due'] !== undefined) followUps.getRange(startRow, fIdx['Due'] + 1, newRows.length, 1).setNumberFormat('yyyy-mm-dd');
    applyBasicFilter_(followUps, fHeaders.length); // Code.gs
    autoResizeColumns_(followUps, fHeaders.length); // Code.gs
  }

  return { ok: true, created: created, updated: updated };
}
