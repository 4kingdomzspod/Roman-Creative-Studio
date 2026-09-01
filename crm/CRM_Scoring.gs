/**
 * CRM_Scoring.gs
 * ---------------------------------------------------------------------------
 * The "RCS Lead Priority Score" — a transparent, deterministic 0-100 score
 * computed only from data already on Prospects and Website Audits. No AI
 * API, no external service, no invented values: any input that's missing
 * simply contributes 0 points, and every score comes with a plain-English
 * breakdown of exactly how it was reached.
 *
 * IMPORTANT: this score does NOT predict probability of closing. It's a
 * prioritization aid built from existing CRM signals (audit quality,
 * declared Priority, reachability, outreach progress, follow-up timing,
 * funnel status) — nothing here is a sales forecast, and no UI text in
 * this file should ever imply one.
 *
 * Schema note: like Sprint 5's Outreach Brief column, CRM_Builder.gs isn't
 * touched this sprint. The three scoring columns (Lead Score, Score Tier,
 * Score Reasons) are provisioned additively via Code.gs's own ensureHeaders_
 * helper the first time scoring is used — see ensureScoreColumns_ below.
 */

const SCORE_COLUMNS = ['Lead Score', 'Score Tier', 'Score Reasons'];

const SCORE_TIER_HOT_MIN = 80;
const SCORE_TIER_WARM_MIN = 60;

// Point weights. These sum to exactly 100 (30+20+10+5+10+10+15), so the
// Math.min(100, ...) cap in computeLeadScore_ is a safety net, not a
// normally-triggered path.
const SCORE_WEIGHTS = {
  auditMax: 30,
  priorityHigh: 20,
  priorityMedium: 10,
  contactMax: 10,      // up to 10: +5 for a phone on file, +5 for an email on file
  websiteExists: 5,
  briefExists: 10,
  followUpDue: 10,
  statusMax: 15
};

// Status -> engagement points (up to SCORE_WEIGHTS.statusMax). Anything not
// listed here (New, No Response, Closed states, Do Not Contact, Archived,
// blank, or any value not in the Lead Status list) scores 0 — there's no
// engagement signal to credit for a lead that hasn't moved forward.
const SCORE_STATUS_POINTS = {
  'call booked': 15,
  'proposal sent': 15,
  'won': 15,
  'proposal pending': 12,
  'follow-up 2 sent': 10,
  'follow-up 1 sent': 8,
  'contacted': 6,
  'nurture': 4
};

// Prospects whose Status is one of these (or who have an Archived Date on
// file) are never labeled Hot, and never appear in Show Top Leads,
// regardless of what their raw score adds up to.
const SCORE_EXCLUDED_STATUSES = ['archived', 'do not contact'];

// ---------------------------------------------------------------------------
// Menu entry points
// ---------------------------------------------------------------------------

function menuScoreSelectedProspects_() {
  const rows = getSelectedProspectRows_(); // CRM_Actions.gs — also covers "wrong sheet" / "nothing selected"
  if (!rows) return;

  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const prospects = ss.getSheetByName('Prospects');

  const question = rows.length === 1
    ? 'Calculate the RCS Lead Priority Score for this prospect?'
    : 'Calculate the RCS Lead Priority Score for these ' + rows.length + ' prospects?';
  if (ui.alert('Lead Intelligence', question, ui.ButtonSet.YES_NO) !== ui.Button.YES) return;

  ensureScoreColumns_(prospects);
  const headers = getLiveProspectsHeaders_(prospects); // CRM_Outreach.gs
  const bIdx = headers.indexOf('Business');

  let scored = 0, skipped = 0;
  rows.forEach(function (r) {
    const business = String(prospects.getRange(r, bIdx + 1).getValue() || '').trim();
    if (business === '') { skipped++; return; }
    scoreProspectRow_(prospects, headers, r);
    scored++;
  });

  ui.alert('Lead Intelligence', 'Scored: ' + scored +
    (skipped ? '\nSkipped (no Business name): ' + skipped : '') +
    '\n\nRCS Lead Priority Score reflects existing CRM data only — it does not predict probability of closing.',
    ui.ButtonSet.OK);
}

function menuScoreAllProspects_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const prospects = ss.getSheetByName('Prospects');
  const ui = SpreadsheetApp.getUi();
  if (!prospects) { ui.alert('Prospects sheet not found.'); return; }

  const lastRow = prospects.getLastRow();
  if (lastRow < 2) {
    ui.alert('Lead Intelligence', 'No prospects to score yet.', ui.ButtonSet.OK);
    return;
  }

  if (ui.alert('Lead Intelligence',
    'Calculate the RCS Lead Priority Score for every prospect with a Business name? This updates Lead Score / Score Tier / Score Reasons and preserves every other field.',
    ui.ButtonSet.YES_NO) !== ui.Button.YES) return;

  ensureScoreColumns_(prospects);
  const headers = getLiveProspectsHeaders_(prospects); // CRM_Outreach.gs
  const bIdx = headers.indexOf('Business');

  let scored = 0, skipped = 0;
  for (let r = 2; r <= lastRow; r++) {
    const business = String(prospects.getRange(r, bIdx + 1).getValue() || '').trim();
    if (business === '') { skipped++; continue; }
    scoreProspectRow_(prospects, headers, r);
    scored++;
  }

  ui.alert('Lead Intelligence', 'Scored: ' + scored +
    (skipped ? '\nSkipped (no Business name): ' + skipped : '') +
    '\n\nRCS Lead Priority Score reflects existing CRM data only — it does not predict probability of closing.',
    ui.ButtonSet.OK);
}

function menuShowTopLeads_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const prospects = ss.getSheetByName('Prospects');
  const ui = SpreadsheetApp.getUi();
  if (!prospects) { ui.alert('Prospects sheet not found.'); return; }

  const lastRow = prospects.getLastRow();
  if (lastRow < 2) {
    ui.alert('Top Leads', 'No prospects yet — nothing to show.', ui.ButtonSet.OK);
    return;
  }

  const headers = getLiveProspectsHeaders_(prospects); // CRM_Outreach.gs
  const scoreIdx = headers.indexOf('Lead Score');
  if (scoreIdx === -1) {
    ui.alert('Top Leads', 'No prospects have been scored yet. Run Score All Prospects or Score Selected Prospect(s) first.', ui.ButtonSet.OK);
    return;
  }

  const bIdx = headers.indexOf('Business');
  const tierIdx = headers.indexOf('Score Tier');
  const reasonsIdx = headers.indexOf('Score Reasons');
  const statusIdx = headers.indexOf('Status');
  const nfuIdx = headers.indexOf('Next Follow Up');
  const archivedIdx = headers.indexOf('Archived Date');

  const data = prospects.getRange(2, 1, lastRow - 1, headers.length).getValues();
  const leads = [];
  let excludedCount = 0;

  data.forEach(function (row) {
    const business = String(row[bIdx] || '').trim();
    if (business === '') return;
    if (typeof isExcludedProspect_ === 'function' && isExcludedProspect_(business)) return; // CRM_Health.gs — the agency itself, never shown in Top Leads

    const scoreVal = row[scoreIdx];
    if (scoreVal === '' || scoreVal === null || scoreVal === undefined) return; // not scored yet

    const status = statusIdx !== -1 ? String(row[statusIdx] || '').trim() : '';
    const archivedDate = archivedIdx !== -1 ? row[archivedIdx] : '';
    if (isExcludedFromTopLeads_(status, archivedDate)) { excludedCount++; return; }

    leads.push({
      business: business,
      score: Number(scoreVal),
      tier: tierIdx !== -1 ? row[tierIdx] : '',
      reasons: reasonsIdx !== -1 ? row[reasonsIdx] : '',
      nextFollowUp: nfuIdx !== -1 ? row[nfuIdx] : '',
      status: status
    });
  });

  leads.sort(function (a, b) { return b.score - a.score; });
  const top = leads.slice(0, 10);

  ui.alert('Top Leads — RCS Lead Priority Score', formatTopLeadsMessage_(top, excludedCount), ui.ButtonSet.OK);
}

// ---------------------------------------------------------------------------
// Prospects column provisioning (self-contained, like Sprint 5's Outreach
// Brief column — see file header note on why this doesn't go through
// CRM_Builder.gs this sprint)
// ---------------------------------------------------------------------------

// Additive only: reuses Code.gs's own ensureHeaders_, which already only
// ever appends whichever of the given headers are missing, after whatever
// column is currently last — never reorders or overwrites existing columns.
function ensureScoreColumns_(sheet) {
  ensureHeaders_(sheet, SCORE_COLUMNS); // Code.gs
  const lastCol = sheet.getLastColumn();
  applyBasicFilter_(sheet, lastCol); // Code.gs
  autoResizeColumns_(sheet, lastCol); // Code.gs
}

// ---------------------------------------------------------------------------
// Scoring a single row
// ---------------------------------------------------------------------------

// Reads one Prospects row's relevant fields, computes its score, and writes
// Lead Score / Score Tier / Score Reasons in place. Every other cell on the
// row (including Website Score, an unrelated pre-existing column) is left
// untouched — only these three cells are ever written by this function.
function scoreProspectRow_(prospects, headers, row) {
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });
  const rowValues = prospects.getRange(row, 1, 1, headers.length).getValues()[0];

  function field(name) { return idx[name] !== undefined ? rowValues[idx[name]] : ''; }

  const business = String(field('Business') || '').trim();
  const fields = {
    business: business,
    priority: field('Priority'),
    phone: field('Phone'),
    email: field('Email'),
    website: field('Website'),
    status: field('Status'),
    nextFollowUp: field('Next Follow Up'),
    archivedDate: field('Archived Date'),
    outreachBrief: field(OUTREACH_BRIEF_COLUMN) // CRM_Outreach.gs constant; '' if column doesn't exist yet
  };

  const result = computeLeadScore_(fields);

  if (idx['Lead Score'] !== undefined) prospects.getRange(row, idx['Lead Score'] + 1).setValue(result.score);
  if (idx['Score Tier'] !== undefined) prospects.getRange(row, idx['Score Tier'] + 1).setValue(result.tier);
  if (idx['Score Reasons'] !== undefined) prospects.getRange(row, idx['Score Reasons'] + 1).setValue(result.reasons);

  return { row: row, business: business, score: result.score, tier: result.tier, reasons: result.reasons, excluded: result.excluded };
}

// ---------------------------------------------------------------------------
// Score engine (pure function — no sheet access, easy to unit test)
// ---------------------------------------------------------------------------

// fields: { business, priority, phone, email, website, status,
//           nextFollowUp, archivedDate, outreachBrief }
// Returns { score, tier, reasons, excluded }. Deterministic: the same
// fields object always produces the same score and reasons text.
function computeLeadScore_(fields) {
  const reasons = [];
  let total = 0;

  // Website Audit Score — up to 30. Missing/incomplete audit data = 0,
  // never an invented value. A manual audit with no score entered (findings
  // only) must score exactly like "no audit" here — audit.score of '' is
  // deliberately NOT treated as 0 (Number('') === 0 in JS, which would
  // otherwise silently fabricate a real-looking 0/100 for a site nobody
  // actually scored).
  const audit = findLatestAuditForBusiness_(fields.business, fields.website); // CRM_Outreach.gs — reuses Sprint 5's URL fallback
  const hasAuditScore = audit && audit.score !== '' && audit.score !== null && audit.score !== undefined;
  const auditScore = hasAuditScore ? Number(audit.score) : NaN;
  if (hasAuditScore && !isNaN(auditScore)) {
    const pts = Math.round((auditScore / 100) * SCORE_WEIGHTS.auditMax);
    total += pts;
    const sourceLabel = audit.source === 'Manual' ? ' (Manual)' : '';
    reasons.push('Website Audit' + sourceLabel + ': ' + auditScore + '/100 (+' + pts + ' pts)');
  } else {
    reasons.push('No website audit on file (0 pts)');
  }

  // Priority: High +20, Medium +10, Low/unset +0.
  const priority = String(fields.priority || '').trim().toLowerCase();
  if (priority === 'high') {
    total += SCORE_WEIGHTS.priorityHigh;
    reasons.push('Priority: High (+' + SCORE_WEIGHTS.priorityHigh + ' pts)');
  } else if (priority === 'medium') {
    total += SCORE_WEIGHTS.priorityMedium;
    reasons.push('Priority: Medium (+' + SCORE_WEIGHTS.priorityMedium + ' pts)');
  } else if (priority === 'low') {
    reasons.push('Priority: Low (0 pts)');
  } else {
    reasons.push('Priority not set (0 pts)');
  }

  // Contact information available — up to 10 (+5 phone, +5 email). A
  // Contact *name* alone isn't counted — it's not a channel to reach the
  // business, only phone/email actually are.
  let contactPts = 0;
  const contactParts = [];
  if (String(fields.phone || '').trim() !== '') { contactPts += 5; contactParts.push('phone'); }
  if (String(fields.email || '').trim() !== '') { contactPts += 5; contactParts.push('email'); }
  total += contactPts;
  reasons.push(contactParts.length
    ? 'Contact info on file (' + contactParts.join(' + ') + ') (+' + contactPts + ' pts)'
    : 'No contact info on file (0 pts)');

  // Website exists — +5.
  if (String(fields.website || '').trim() !== '') {
    total += SCORE_WEIGHTS.websiteExists;
    reasons.push('Website on file (+' + SCORE_WEIGHTS.websiteExists + ' pts)');
  } else {
    reasons.push('No website on file (0 pts)');
  }

  // Outreach Brief exists — +10 (Sprint 5's column; may not exist yet).
  if (String(fields.outreachBrief || '').trim() !== '') {
    total += SCORE_WEIGHTS.briefExists;
    reasons.push('Outreach Brief on file (+' + SCORE_WEIGHTS.briefExists + ' pts)');
  } else {
    reasons.push('No Outreach Brief generated (0 pts)');
  }

  // Follow-up currently due/overdue — +10.
  const hasFollowUp = fields.nextFollowUp !== null && fields.nextFollowUp !== undefined && String(fields.nextFollowUp).trim() !== '';
  const followUpDue = hasFollowUp && isFollowUpDueOrOverdue_(fields.nextFollowUp);
  if (followUpDue) {
    total += SCORE_WEIGHTS.followUpDue;
    reasons.push('Follow-up due/overdue (+' + SCORE_WEIGHTS.followUpDue + ' pts)');
  } else if (hasFollowUp) {
    reasons.push('Follow-up scheduled but not yet due (0 pts)');
  } else {
    reasons.push('No follow-up scheduled (0 pts)');
  }

  // Status / engagement signal — up to 15.
  const statusKey = String(fields.status || '').trim().toLowerCase();
  const statusPts = SCORE_STATUS_POINTS[statusKey] || 0;
  total += statusPts;
  reasons.push(fields.status
    ? 'Status "' + fields.status + '" (+' + statusPts + ' pts)'
    : 'No status set (0 pts)');

  const score = Math.min(100, Math.max(0, Math.round(total)));
  let tier = scoreTier_(score);

  const excluded = isExcludedFromTopLeads_(fields.status, fields.archivedDate);
  if (excluded) {
    if (tier === 'Hot') {
      tier = 'Warm';
      reasons.push('Tier capped at Warm — Archived/Do Not Contact prospects are never scored Hot.');
    } else {
      reasons.push('Note: prospect is Archived/Do Not Contact — excluded from Top Leads.');
    }
  }

  return { score: score, tier: tier, reasons: reasons.join('; '), excluded: excluded };
}

function scoreTier_(score) {
  if (score >= SCORE_TIER_HOT_MIN) return 'Hot';
  if (score >= SCORE_TIER_WARM_MIN) return 'Warm';
  return 'Cold';
}

function isExcludedFromTopLeads_(status, archivedDate) {
  const statusKey = String(status || '').trim().toLowerCase();
  return SCORE_EXCLUDED_STATUSES.indexOf(statusKey) !== -1 || String(archivedDate || '').trim() !== '';
}

// True if the given date value (a real Date, or a date-ish string) is today
// or earlier. False for blank, unparseable, or future dates.
function isFollowUpDueOrOverdue_(value) {
  if (!value) return false;
  const d = (value instanceof Date) ? value : new Date(value);
  if (isNaN(d.getTime())) return false;

  const today = new Date();
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return dateOnly.getTime() <= todayOnly.getTime();
}

// ---------------------------------------------------------------------------
// Results UI
// ---------------------------------------------------------------------------

function formatTopLeadsMessage_(leads, excludedCount) {
  if (leads.length === 0) {
    return 'No scored, eligible prospects to show yet.' +
      (excludedCount > 0 ? ' (' + excludedCount + ' Archived/Do Not Contact prospect(s) were excluded.)' : ' Run Score All Prospects first.');
  }

  const header = 'Business | Score | Tier | Reasons | Next Follow Up | Status';
  const lines = leads.map(function (l) {
    const nfu = l.nextFollowUp ? formatScoreDate_(l.nextFollowUp) : '(none)';
    return l.business + ' | ' + l.score + ' | ' + l.tier + ' | ' + (l.reasons || '(none)') +
      ' | ' + nfu + ' | ' + (l.status || '(none)');
  });

  let msg = 'Top ' + leads.length + ' Lead' + (leads.length === 1 ? '' : 's') + ' by RCS Lead Priority Score\n' +
    '(Reflects existing CRM data only — does not predict probability of closing.)\n\n' +
    header + '\n' + lines.join('\n');

  if (excludedCount > 0) {
    msg += '\n\n(' + excludedCount + ' Archived/Do Not Contact prospect(s) excluded from this list.)';
  }
  return msg;
}

function formatScoreDate_(value) {
  if (value instanceof Date) return formatAuditDate_(value); // CRM_Audits.gs
  return String(value);
}
