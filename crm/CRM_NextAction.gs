/**
 * CRM_NextAction.gs
 * ---------------------------------------------------------------------------
 * Next-Action Engine: "What should I act on next?" — a single, read-only,
 * ranked report across Prospects, Meetings, Proposals, and Clients. It never
 * scores anything itself (Sprint 7's RCS Lead Priority Score is read as-is)
 * and never re-detects completeness/duplicate/consistency/aging conditions
 * that CRM Health/Analytics already compute — this file only ranks and
 * displays.
 *
 * Reuses: buildHealthProspectRecords_ (CRM_Health.gs, itself already
 * extending CRM_Analytics.gs's buildAnalyticsProspectRecords_ and
 * CRM_CommandCenter.gs's buildProspectRecords_ — one call gets Business,
 * Status, Priority, Lead Score/Tier, Next Follow Up, Phone/Email, and the
 * Archived/DNC exclusion flag), buildAging_/getSheetRows_ (CRM_Analytics.gs)
 * for stalled proposals, getUpcomingMeetings_/compareDateToToday_/
 * parseDateOrNull_/sortByLeadScoreThenBusiness_/sortByDateThenBusiness_/
 * HOT_ACTION_EXCLUDED_STATUSES (CRM_CommandCenter.gs), getHeaders_
 * (CRM_Actions.gs), normalizeBusinessKey_ (CRM_Health.gs), formatScoreDate_
 * (CRM_Scoring.gs). No date parsing, scoring, exclusion, or staleness rule
 * is reimplemented here.
 *
 * Follow Ups sheet: inspected (Business, Due, Priority, Status, Reminder,
 * Notes) but deliberately NOT wired in as a data source. No existing CRM
 * feature — Import, Actions, Sync, Command Center, Analytics, Health, or
 * Automation — ever writes a row to it (only the Dashboard's static
 * "Follow Ups Due" formula reads it); Prospects.Next Follow Up is the one
 * live follow-up mechanism every other sprint already uses. Building a
 * second, parallel read path for a sheet nothing populates would be exactly
 * the kind of invented feature this sprint's anti-fabrication rule forbids.
 */

const NEXT_ACTION_CATEGORIES = {
  FOLLOW_UP: 'FOLLOW UP',
  CONTACT: 'CONTACT',
  PREPARE_MEETING: 'PREPARE MEETING',
  REVIEW_PROPOSAL: 'REVIEW PROPOSAL',
  UPDATE_CRM: 'UPDATE CRM'
};

const NEXT_ACTION_LIMIT = 10;

// ---------------------------------------------------------------------------
// Menu entry point
// ---------------------------------------------------------------------------

function openNextActions_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const report = buildNextActionsReport_(ss);
  ui.alert('Next Actions', formatNextActionsMessage_(report), ui.ButtonSet.OK);
  return report; // read-only result, useful for tests
}

// ---------------------------------------------------------------------------
// Report assembly — one deterministic pass through the 7 priority buckets,
// one entry per business (first/highest-priority bucket wins), capped.
// ---------------------------------------------------------------------------

function buildNextActionsReport_(ss) {
  const prospects = ss.getSheetByName('Prospects');
  const records = prospects ? buildHealthProspectRecords_(prospects) : []; // CRM_Health.gs
  const recordsByBusiness = {};
  records.forEach(function (r) { recordsByBusiness[normalizeBusinessKey_(r.business)] = r; }); // CRM_Health.gs

  const proposalRows = getSheetRows_(ss, 'Proposals').filter(function (p) { return String(p.Business || '').trim() !== ''; }); // CRM_Analytics.gs
  const clientRows = getSheetRows_(ss, 'Clients').filter(function (c) { return String(c.Business || '').trim() !== ''; }); // CRM_Analytics.gs

  // A business already tracked via a Meeting or a Proposal has a next-action
  // mechanism outside of Prospects.Next Follow Up — category 4 would
  // otherwise swallow it with a generic "missing" message and hide the more
  // specific, more useful category 5/6 signal.
  const trackedElsewhere = getAllMeetingBusinesses_(ss);
  proposalRows.forEach(function (p) { trackedElsewhere[normalizeBusinessKey_(String(p.Business || '').trim())] = true; });

  const buckets = [
    { key: 'overdue', items: buildOverdueFollowUps_(records) },
    { key: 'dueToday', items: buildDueTodayFollowUps_(records) },
    { key: 'highScore', items: buildHighScoreNeedingAction_(records) },
    { key: 'missingNextFollowUp', items: buildMissingNextFollowUp_(records, trackedElsewhere) },
    { key: 'meetings', items: buildMeetingsNeedingAttention_(ss, recordsByBusiness) },
    { key: 'stalledProposals', items: buildStalledProposals_(records, proposalRows, recordsByBusiness) },
    { key: 'otherActive', items: buildOtherActiveOpportunities_(clientRows, records, recordsByBusiness) }
  ];

  const summary = {};
  const seenBusiness = {};
  const deduped = [];

  buckets.forEach(function (b) {
    summary[b.key] = b.items.length;
    b.items.forEach(function (entry) {
      const key = normalizeBusinessKey_(entry.business); // CRM_Health.gs
      if (seenBusiness[key]) return; // no duplicate businesses in the final list
      seenBusiness[key] = true;
      deduped.push(entry);
    });
  });

  return {
    summary: summary,
    totalFound: deduped.length,
    actions: deduped.slice(0, NEXT_ACTION_LIMIT)
  };
}

// ---------------------------------------------------------------------------
// 1-2. Follow-ups (Prospects.Next Follow Up) — overdue / due today
// ---------------------------------------------------------------------------

function buildOverdueFollowUps_(records) {
  return sortByLeadScoreThenBusiness_(records.filter(function (r) { // CRM_CommandCenter.gs
    return !r.excluded && r.nextFollowUpStatus === 'past';
  })).map(function (r) {
    return buildActionEntry_(r, 'FOLLOW-UP OVERDUE — ' + (r.nextFollowUpDisplay || '(date unavailable)'), NEXT_ACTION_CATEGORIES.FOLLOW_UP);
  });
}

function buildDueTodayFollowUps_(records) {
  return sortByLeadScoreThenBusiness_(records.filter(function (r) {
    return !r.excluded && r.nextFollowUpStatus === 'today';
  })).map(function (r) {
    return buildActionEntry_(r, 'FOLLOW-UP DUE TODAY', NEXT_ACTION_CATEGORIES.FOLLOW_UP);
  });
}

// ---------------------------------------------------------------------------
// 3. High-score prospects needing action — reuses Sprint 7's stored Lead
// Score/Score Tier as-is (same Hot definition already used by
// CRM_CommandCenter.gs/CRM_Analytics.gs's risk ranking). Closed/Won/Lost
// deals need no more selling action even if the score is high.
// ---------------------------------------------------------------------------

function buildHighScoreNeedingAction_(records) {
  return sortByLeadScoreThenBusiness_(records.filter(function (r) {
    if (r.excluded || HOT_ACTION_EXCLUDED_STATUSES.indexOf(r.statusLower) !== -1) return false; // CRM_CommandCenter.gs
    return r.scoreTier === 'Hot' || (r.leadScoreNum !== null && r.leadScoreNum >= 80);
  })).map(function (r) {
    const scoreText = r.leadScoreNum !== null ? 'Score ' + r.leadScoreNum : 'Score unavailable';
    return buildActionEntry_(r, 'HIGH SCORE — ' + scoreText, NEXT_ACTION_CATEGORIES.CONTACT);
  });
}

// ---------------------------------------------------------------------------
// 4. Active prospects missing a next follow-up — a genuine data gap, not an
// overdue date (compareDateToToday_ already returns null for blank/
// unparseable, never 'past'). Excludes any business already tracked via a
// Meeting or a Proposal (categories 5/6 own that signal more specifically —
// see buildNextActionsReport_'s trackedElsewhere set).
// ---------------------------------------------------------------------------

function buildMissingNextFollowUp_(records, trackedElsewhere) {
  return sortByLeadScoreThenBusiness_(records.filter(function (r) {
    if (r.excluded || HOT_ACTION_EXCLUDED_STATUSES.indexOf(r.statusLower) !== -1) return false;
    if (trackedElsewhere[normalizeBusinessKey_(r.business)]) return false; // CRM_Health.gs
    return r.nextFollowUpStatus === null;
  })).map(function (r) {
    return buildActionEntry_(r, 'NO NEXT FOLLOW-UP SCHEDULED', NEXT_ACTION_CATEGORIES.UPDATE_CRM);
  });
}

// All Meetings rows' Business values (regardless of date), so category 4
// can tell "no meeting or proposal tracked at all" apart from "a meeting/
// proposal exists, just not a separate Prospects.Next Follow Up date."
function getAllMeetingBusinesses_(ss) {
  const set = {};
  const sheet = ss.getSheetByName('Meetings');
  if (!sheet) return set;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return set;

  const headers = getHeaders_('Meetings'); // CRM_Actions.gs
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });
  sheet.getRange(2, 1, lastRow - 1, headers.length).getValues().forEach(function (row) {
    const business = String(row[idx['Business']] || '').trim();
    if (business !== '') set[normalizeBusinessKey_(business)] = true; // CRM_Health.gs
  });
  return set;
}

// ---------------------------------------------------------------------------
// 5. Meetings requiring attention — upcoming meetings (reused directly from
// CRM_CommandCenter.gs) plus a genuinely new check this sprint adds: a past
// meeting whose Outcome was never logged (real schema field, real gap).
// ---------------------------------------------------------------------------

function buildMeetingsNeedingAttention_(ss, recordsByBusiness) {
  const upcoming = getUpcomingMeetings_(ss).map(function (m) { // CRM_CommandCenter.gs
    const reason = 'UPCOMING MEETING — ' + m.dateDisplay + (m.type ? ' (' + m.type + ')' : '');
    return buildExternalActionEntry_(m.business, reason, NEXT_ACTION_CATEGORIES.PREPARE_MEETING, recordsByBusiness);
  });

  const missingOutcome = getMeetingsMissingOutcome_(ss).map(function (m) {
    const reason = 'MEETING OCCURRED (' + m.dateDisplay + ') — OUTCOME NOT LOGGED';
    return buildExternalActionEntry_(m.business, reason, NEXT_ACTION_CATEGORIES.UPDATE_CRM, recordsByBusiness);
  });

  return upcoming.concat(missingOutcome);
}

function getMeetingsMissingOutcome_(ss) {
  const sheet = ss.getSheetByName('Meetings');
  if (!sheet) return [];
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const headers = getHeaders_('Meetings'); // CRM_Actions.gs — static schema
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });
  const data = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();

  const out = [];
  data.forEach(function (row) {
    const business = String(row[idx['Business']] || '').trim();
    if (business === '') return;
    const dateVal = row[idx['Date']];
    if (compareDateToToday_(dateVal) !== 'past') return; // CRM_CommandCenter.gs — only a real past date counts
    const outcome = String(row[idx['Outcome']] || '').trim();
    if (outcome !== '') return;
    out.push({ business: business, dateDisplay: formatScoreDate_(dateVal), dateForSort: parseDateOrNull_(dateVal) }); // CRM_Scoring.gs / CRM_CommandCenter.gs
  });
  return sortByDateThenBusiness_(out, 'dateForSort'); // CRM_CommandCenter.gs
}

// ---------------------------------------------------------------------------
// 6. Stalled proposals — reuses CRM_Analytics.gs's buildAging_ directly
// (ANALYTICS_STALE_DAYS, the same 30-day threshold CRM Health/Automation
// already use); no second staleness calculation.
// ---------------------------------------------------------------------------

function buildStalledProposals_(records, proposalRows, recordsByBusiness) {
  const staleness = buildAging_(records, proposalRows); // CRM_Analytics.gs
  return staleness.staleProposals
    .slice()
    .sort(function (a, b) { return b.daysSinceSent - a.daysSinceSent || a.business.localeCompare(b.business); })
    .map(function (p) {
      const reason = 'PROPOSAL STALLED — ' + p.daysSinceSent + ' days since sent';
      return buildExternalActionEntry_(p.business, reason, NEXT_ACTION_CATEGORIES.REVIEW_PROPOSAL, recordsByBusiness);
    });
}

// ---------------------------------------------------------------------------
// 7. Other active opportunities with a missing next action: a Client project
// that's Paused with no next step recorded anywhere in this schema, and an
// active (non-excluded, non-closed) prospect with no contact info at all —
// neither a phone nor an email — meaning no action is even reachable yet.
// ---------------------------------------------------------------------------

function buildOtherActiveOpportunities_(clientRows, records, recordsByBusiness) {
  const pausedClients = clientRows
    .filter(function (c) { return String(c.Status || '').trim().toLowerCase() === 'paused'; })
    .map(function (c) {
      const business = String(c.Business || '').trim();
      return buildExternalActionEntry_(business, 'CLIENT PROJECT PAUSED — NO NEXT ACTION RECORDED', NEXT_ACTION_CATEGORIES.UPDATE_CRM, recordsByBusiness);
    });

  const noContactInfo = sortByLeadScoreThenBusiness_(records.filter(function (r) {
    if (r.excluded || HOT_ACTION_EXCLUDED_STATUSES.indexOf(r.statusLower) !== -1) return false;
    return !r.hasContactInfo;
  })).map(function (r) {
    return buildActionEntry_(r, 'NO CONTACT INFO ON FILE — CANNOT BE CONTACTED', NEXT_ACTION_CATEGORIES.UPDATE_CRM);
  });

  return pausedClients.concat(noContactInfo);
}

// ---------------------------------------------------------------------------
// Action entry shape — every field traces to a real stored value; a field
// with nothing on file reads a plain, honest placeholder, never a guess.
// ---------------------------------------------------------------------------

function buildActionEntry_(r, reason, actionCategory) {
  return {
    business: r.business,
    status: r.status || '(none)',
    scoreDisplay: r.leadScoreNum !== null ? (r.leadScoreNum + ' (' + (r.scoreTier || 'Unscored') + ')') : 'Not scored',
    reason: reason,
    nextFollowUpDisplay: r.nextFollowUpDisplay || '(none)',
    contactDisplay: buildContactDisplay_(r.phone, r.email),
    actionCategory: actionCategory
  };
}

// Meetings/Proposals/Clients rows aren't Prospects records themselves — this
// looks one up by Business name (the same exact-text match convention used
// everywhere else in this CRM, e.g. findLatestAuditForBusiness_) to fill in
// Status/Score/Contact when available, and says so plainly when it isn't.
function buildExternalActionEntry_(business, reason, actionCategory, recordsByBusiness) {
  const match = recordsByBusiness[normalizeBusinessKey_(business)]; // CRM_Health.gs
  if (match) return buildActionEntry_(match, reason, actionCategory);
  return {
    business: business,
    status: 'Not in Prospects',
    scoreDisplay: 'Not scored',
    reason: reason,
    nextFollowUpDisplay: '(none)',
    contactDisplay: 'Not on file',
    actionCategory: actionCategory
  };
}

function buildContactDisplay_(phone, email) {
  const p = String(phone || '').trim();
  const e = String(email || '').trim();
  if (p && e) return p + ' / ' + e;
  if (p) return p;
  if (e) return e;
  return 'Not on file';
}

// ---------------------------------------------------------------------------
// Report formatting
// ---------------------------------------------------------------------------

function formatNextActionsMessage_(report) {
  const s = report.summary;
  const lines = [];
  lines.push('RCS NEXT ACTIONS — ' + formatScoreDate_(new Date())); // CRM_Scoring.gs
  lines.push('');
  lines.push('Overdue Follow-Ups: ' + s.overdue + ' | Due Today: ' + s.dueToday + ' | High Score Needing Action: ' + s.highScore);
  lines.push('Missing Next Follow-Up: ' + s.missingNextFollowUp + ' | Meetings Needing Attention: ' + s.meetings);
  lines.push('Stalled Proposals: ' + s.stalledProposals + ' | Other Active Opportunities: ' + s.otherActive);
  lines.push('');

  if (report.actions.length === 0) {
    lines.push('No next actions found. Nothing needs attention right now.');
    return lines.join('\n');
  }

  lines.push('NEXT ACTIONS (showing ' + report.actions.length + ' of ' + report.totalFound + ')');
  lines.push('');
  report.actions.forEach(function (a, i) {
    lines.push((i + 1) + '. ' + a.business + ' — ' + a.status);
    lines.push('   ' + a.reason);
    lines.push('   Score: ' + a.scoreDisplay + ' | Next Follow-Up: ' + a.nextFollowUpDisplay + ' | Contact: ' + a.contactDisplay);
    lines.push('   ACTION: ' + a.actionCategory);
    lines.push('');
  });

  if (report.totalFound > report.actions.length) {
    lines.push((report.totalFound - report.actions.length) + ' additional action(s) not shown.');
  }

  return lines.join('\n').trim();
}
