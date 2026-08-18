/**
 * CRM_CommandCenter.gs
 * ---------------------------------------------------------------------------
 * Daily Sales Command Center: "What should I work on today?" — a single,
 * read-only report built entirely from data already on Prospects, Website
 * Audits, Meetings, and Proposals. No new sheet, no new stored fields, no
 * AI/external API, no automatic writes of any kind.
 *
 * Reuses: getLiveProspectsHeaders_ / findLatestAuditForBusiness_ /
 * isAuditDataComplete_ / OUTREACH_BRIEF_COLUMN (CRM_Outreach.gs),
 * isExcludedFromTopLeads_ / formatScoreDate_ (CRM_Scoring.gs), getHeaders_
 * (CRM_Actions.gs). No scoring model, audit logic, or exclusion rule is
 * reimplemented here — this file only reads and ranks.
 */

// Hot leads whose Status shows the deal is already resolved don't need a
// daily action from this report.
const HOT_ACTION_EXCLUDED_STATUSES = ['won', 'closed — lost', 'closed — not interested'];

// Proposal statuses that still need human follow-through (Draft hasn't been
// sent yet; Accepted/Declined/Expired are already resolved).
const ACTIVE_PROPOSAL_STATUSES = ['sent', 'under review'];

// ---------------------------------------------------------------------------
// Menu entry point
// ---------------------------------------------------------------------------

function openDailyCommandCenter_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const prospects = ss.getSheetByName('Prospects');

  const records = prospects ? buildProspectRecords_(prospects) : [];
  const categorized = categorizeProspects_(records);
  const meetings = getUpcomingMeetings_(ss);
  const proposals = getActiveProposals_(ss);

  const summary = {
    hot: categorized.hot.length,
    dueToday: categorized.dueToday.length,
    overdue: categorized.overdue.length,
    highPriorityUncontacted: categorized.highPriorityUncontacted.length,
    auditedUncontacted: categorized.auditedUncontacted.length,
    meetings: meetings.length,
    proposals: proposals.length
  };

  const actions = buildRankedActions_(categorized, meetings, proposals);
  const message = formatCommandCenterMessage_(summary, actions);

  ui.alert('Daily Command Center', message, ui.ButtonSet.OK);
  return { summary: summary, actions: actions }; // read-only result, useful for tests
}

// ---------------------------------------------------------------------------
// Reading Prospects (read-only — never writes)
// ---------------------------------------------------------------------------

function buildProspectRecords_(prospects) {
  const lastRow = prospects.getLastRow();
  if (lastRow < 2) return [];

  const headers = getLiveProspectsHeaders_(prospects); // CRM_Outreach.gs — tolerates missing optional columns
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });

  const data = prospects.getRange(2, 1, lastRow - 1, headers.length).getValues();
  const records = [];

  data.forEach(function (row) {
    function field(name) { return idx[name] !== undefined ? row[idx[name]] : ''; }

    const business = String(field('Business') || '').trim();
    if (business === '') return; // blank Business rows are skipped, never guessed

    const status = String(field('Status') || '').trim();
    const priority = String(field('Priority') || '').trim();
    const lastContact = field('Last Contact');
    const nextFollowUpRaw = field('Next Follow Up');
    const archivedDate = field('Archived Date');
    const outreachBrief = String(field(OUTREACH_BRIEF_COLUMN) || '').trim(); // CRM_Outreach.gs constant
    const leadScoreRaw = field('Lead Score');
    const scoreTier = String(field('Score Tier') || '').trim();
    const statusLower = status.toLowerCase();

    records.push({
      business: business,
      website: String(field('Website') || '').trim(),
      priority: priority,
      status: status,
      statusLower: statusLower,
      nextFollowUpStatus: compareDateToToday_(nextFollowUpRaw),
      nextFollowUpDisplay: nextFollowUpRaw ? formatScoreDate_(nextFollowUpRaw) : '', // CRM_Scoring.gs
      outreachBrief: outreachBrief,
      leadScoreNum: (leadScoreRaw !== '' && leadScoreRaw !== null && !isNaN(Number(leadScoreRaw))) ? Number(leadScoreRaw) : null,
      scoreTier: scoreTier,
      excluded: isExcludedFromTopLeads_(status, archivedDate), // CRM_Scoring.gs — Archived / Do Not Contact
      uncontacted: (statusLower === '' || statusLower === 'new') && String(lastContact || '').trim() === ''
    });
  });

  return records;
}

function categorizeProspects_(records) {
  const overdue = [], dueToday = [], hot = [], highPriorityUncontacted = [], auditedUncontacted = [];

  records.forEach(function (r) {
    if (r.excluded) return; // Archived / Do Not Contact never appear in outreach recommendations

    if (r.nextFollowUpStatus === 'past') overdue.push(r);
    else if (r.nextFollowUpStatus === 'today') dueToday.push(r);

    const isHot = r.scoreTier === 'Hot' || (r.leadScoreNum !== null && r.leadScoreNum >= 80);
    if (isHot && HOT_ACTION_EXCLUDED_STATUSES.indexOf(r.statusLower) === -1) hot.push(r);

    if (r.priority.toLowerCase() === 'high' && r.uncontacted) highPriorityUncontacted.push(r);
  });

  // A second, narrower pass: only look up Website Audits for uncontacted
  // prospects (the only ones this category cares about) rather than every row.
  records.forEach(function (r) {
    if (r.excluded || !r.uncontacted) return;
    const audit = findLatestAuditForBusiness_(r.business, r.website); // CRM_Outreach.gs — reuses Sprint 5's URL fallback
    if (!audit) return;
    r.auditComplete = isAuditDataComplete_(audit); // CRM_Outreach.gs
    auditedUncontacted.push(r);
  });

  return {
    overdue: overdue, dueToday: dueToday, hot: hot,
    highPriorityUncontacted: highPriorityUncontacted, auditedUncontacted: auditedUncontacted
  };
}

// ---------------------------------------------------------------------------
// Reading Meetings / Proposals (read-only, static schema via getHeaders_)
// ---------------------------------------------------------------------------

function getUpcomingMeetings_(ss) {
  const sheet = ss.getSheetByName('Meetings');
  if (!sheet) return [];
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const headers = getHeaders_('Meetings'); // CRM_Actions.gs — static schema, not modified by any sprint
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });
  const data = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();

  const out = [];
  data.forEach(function (row) {
    const business = String(row[idx['Business']] || '').trim();
    if (business === '') return;
    const dateVal = row[idx['Date']];
    const status = compareDateToToday_(dateVal);
    if (status !== 'today' && status !== 'future') return; // only genuinely upcoming, never a blank/invalid/past date
    out.push({
      business: business,
      type: String(row[idx['Type']] || '').trim(),
      dateDisplay: formatScoreDate_(dateVal),
      dateForSort: parseDateOrNull_(dateVal)
    });
  });
  return out;
}

function getActiveProposals_(ss) {
  const sheet = ss.getSheetByName('Proposals');
  if (!sheet) return [];
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const headers = getHeaders_('Proposals'); // CRM_Actions.gs
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });
  const data = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();

  const out = [];
  data.forEach(function (row) {
    const business = String(row[idx['Business']] || '').trim();
    if (business === '') return;
    const status = String(row[idx['Status']] || '').trim();
    if (ACTIVE_PROPOSAL_STATUSES.indexOf(status.toLowerCase()) === -1) return;
    const value = row[idx['Value']];
    out.push({
      business: business,
      status: status,
      value: (value !== '' && value !== null && !isNaN(Number(value))) ? Number(value) : null,
      sentDisplay: row[idx['Sent']] ? formatScoreDate_(row[idx['Sent']]) : '',
      sentForSort: parseDateOrNull_(row[idx['Sent']])
    });
  });
  return out;
}

// ---------------------------------------------------------------------------
// Date helpers (tolerate blank/malformed values — never throw)
// ---------------------------------------------------------------------------

function parseDateOrNull_(value) {
  if (value === null || value === undefined || value === '') return null;
  const d = (value instanceof Date) ? value : new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

// Returns 'past' | 'today' | 'future' | null (blank/unparseable).
function compareDateToToday_(value) {
  const d = parseDateOrNull_(value);
  if (!d) return null;
  const today = new Date();
  const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  if (d0 < t0) return 'past';
  if (d0 === t0) return 'today';
  return 'future';
}

// ---------------------------------------------------------------------------
// Ranking — one deterministic function, priority order 1-7 per category,
// existing Lead Score descending within a category, one entry per business
// (first/highest-priority category wins), capped at 10.
// ---------------------------------------------------------------------------

function sortByLeadScoreThenBusiness_(list) {
  return list.slice().sort(function (a, b) {
    const as = a.leadScoreNum === null ? -1 : a.leadScoreNum;
    const bs = b.leadScoreNum === null ? -1 : b.leadScoreNum;
    if (bs !== as) return bs - as;
    return a.business.localeCompare(b.business);
  });
}

function sortByDateThenBusiness_(list, dateField) {
  return list.slice().sort(function (a, b) {
    const ad = a[dateField] ? a[dateField].getTime() : Infinity;
    const bd = b[dateField] ? b[dateField].getTime() : Infinity;
    if (ad !== bd) return ad - bd;
    return a.business.localeCompare(b.business);
  });
}

function buildRankedActions_(categorized, meetings, proposals) {
  const groups = [
    { items: sortByLeadScoreThenBusiness_(categorized.overdue), build: buildOverdueAction_ },
    { items: sortByLeadScoreThenBusiness_(categorized.dueToday), build: buildDueTodayAction_ },
    { items: sortByLeadScoreThenBusiness_(categorized.hot), build: buildHotAction_ },
    { items: sortByLeadScoreThenBusiness_(categorized.highPriorityUncontacted), build: buildHighPriorityAction_ },
    { items: sortByLeadScoreThenBusiness_(categorized.auditedUncontacted), build: buildAuditedAction_ }
  ];

  const seenBusiness = {};
  const actions = [];

  groups.forEach(function (g) {
    g.items.forEach(function (r) {
      const key = r.business.trim().toLowerCase();
      if (seenBusiness[key]) return; // no duplicate businesses in the final list
      seenBusiness[key] = true;
      actions.push(g.build(r));
    });
  });

  sortByDateThenBusiness_(meetings, 'dateForSort').forEach(function (m) {
    const key = m.business.trim().toLowerCase();
    if (seenBusiness[key]) return;
    seenBusiness[key] = true;
    actions.push(buildMeetingAction_(m));
  });

  sortByDateThenBusiness_(proposals, 'sentForSort').forEach(function (p) {
    const key = p.business.trim().toLowerCase();
    if (seenBusiness[key]) return;
    seenBusiness[key] = true;
    actions.push(buildProposalAction_(p));
  });

  return actions.slice(0, 10);
}

// ---------------------------------------------------------------------------
// Per-category action text — every line traces to a real field; if the
// underlying fact isn't on file, the detail/action text says so rather
// than guessing (e.g. "No website audit on file yet.").
// ---------------------------------------------------------------------------

function buildOverdueAction_(r) {
  return {
    business: r.business,
    reason: 'FOLLOW-UP OVERDUE — ' + (r.nextFollowUpDisplay || '(date unavailable)'),
    detail: '',
    action: r.outreachBrief ? 'Generate Follow-Up Message' : 'Contact Prospect (Mark as Contacted / Schedule Follow-Up)'
  };
}

function buildDueTodayAction_(r) {
  return {
    business: r.business,
    reason: 'FOLLOW-UP DUE TODAY',
    detail: '',
    action: r.outreachBrief ? 'Generate Follow-Up Message' : 'Contact Prospect (Mark as Contacted / Schedule Follow-Up)'
  };
}

function buildHotAction_(r) {
  const scoreText = r.leadScoreNum !== null ? 'Score ' + r.leadScoreNum : 'Score unavailable';
  const audit = findLatestAuditForBusiness_(r.business, r.website); // CRM_Outreach.gs — reuses Sprint 5's URL fallback
  let detail, action;
  if (!audit) {
    detail = 'No website audit on file yet.';
    action = 'Audit Website';
  } else if (!r.outreachBrief) {
    detail = 'Audit completed, outreach not yet started.';
    action = 'Generate Outreach Brief / Contact Prospect';
  } else if (r.uncontacted) {
    detail = 'Outreach Brief ready, prospect not yet contacted.';
    action = 'Contact Prospect';
  } else {
    detail = 'Engaged lead — worth a status check-in.';
    action = 'Review / Schedule Follow-Up';
  }
  return { business: r.business, reason: 'HOT — ' + scoreText, detail: detail, action: action };
}

function buildHighPriorityAction_(r) {
  return {
    business: r.business,
    reason: 'HIGH PRIORITY — Uncontacted',
    detail: 'No contact recorded yet.',
    action: 'Contact Prospect (Mark as Contacted)'
  };
}

function buildAuditedAction_(r) {
  return {
    business: r.business,
    reason: 'AUDIT COMPLETE — Not Yet Contacted',
    detail: r.outreachBrief
      ? 'Outreach Brief already on file.'
      : (r.auditComplete ? 'Outreach Brief can be generated.' : 'Audit data incomplete — Outreach Brief cannot be generated yet.'),
    action: r.outreachBrief ? 'Contact Prospect' : (r.auditComplete ? 'Generate Outreach Brief' : 'Contact Prospect')
  };
}

function buildMeetingAction_(m) {
  return {
    business: m.business,
    reason: 'UPCOMING MEETING — ' + m.dateDisplay + (m.type ? ' (' + m.type + ')' : ''),
    detail: '',
    action: 'Prepare for Meeting'
  };
}

function buildProposalAction_(p) {
  return {
    business: p.business,
    reason: 'PROPOSAL ' + p.status.toUpperCase() + (p.value !== null ? ' — $' + p.value : ''),
    detail: '',
    action: 'Follow Up on Proposal'
  };
}

// ---------------------------------------------------------------------------
// Report formatting
// ---------------------------------------------------------------------------

function formatCommandCenterMessage_(summary, actions) {
  const lines = [];
  lines.push('RCS DAILY COMMAND CENTER — ' + formatScoreDate_(new Date())); // CRM_Scoring.gs
  lines.push('');
  lines.push('PIPELINE HEALTH');
  lines.push('Hot Leads: ' + summary.hot + ' | Follow-Ups Due Today: ' + summary.dueToday + ' | Overdue Follow-Ups: ' + summary.overdue);
  lines.push('Uncontacted High-Priority: ' + summary.highPriorityUncontacted + ' | Audited/Uncontacted: ' + summary.auditedUncontacted);
  lines.push('Upcoming Meetings: ' + summary.meetings + ' | Active Proposals: ' + summary.proposals);
  lines.push('');

  if (actions.length === 0) {
    lines.push('No urgent actions found. Your pipeline is clear.');
    return lines.join('\n');
  }

  lines.push('TOP ACTIONS (' + actions.length + ')');
  lines.push('');
  actions.forEach(function (a, i) {
    lines.push((i + 1) + '. ' + a.business);
    lines.push('   ' + a.reason);
    if (a.detail) lines.push('   ' + a.detail);
    lines.push('   ACTION: ' + a.action);
    lines.push('');
  });

  return lines.join('\n').trim();
}
