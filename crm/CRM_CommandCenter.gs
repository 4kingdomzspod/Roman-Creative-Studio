/**
 * CRM_CommandCenter.gs
 * ---------------------------------------------------------------------------
 * Daily Revenue Command Center: "What should I do today to generate
 * revenue?" — a single, read-only report built entirely from data already
 * on Prospects, Website Audits, Meetings, Proposals, and Revenue. No new
 * sheet, no new stored fields, no AI/external API, no automatic writes of
 * any kind.
 *
 * Reuses: getLiveProspectsHeaders_ / findLatestAuditForBusiness_ /
 * isAuditDataComplete_ / OUTREACH_BRIEF_COLUMN (CRM_Outreach.gs),
 * isExcludedFromTopLeads_ / formatScoreDate_ (CRM_Scoring.gs), getHeaders_
 * (CRM_Actions.gs), isExcludedProspect_ (CRM_Health.gs — guarded, since this
 * file's own buildProspectRecords_ is reused by legacy regression harnesses
 * that may not load CRM_Health.gs). No scoring model, audit logic, or
 * exclusion rule is reimplemented here — this file only reads and ranks.
 *
 * The $10K Tracker / Funnel / Revenue Math section reuses CRM_Analytics.gs's
 * buildAnalyticsProspectRecords_ / getDistinctBusinesses_ / getSheetRows_ /
 * buildOverview_ / buildFunnel_ / buildValue_ / numOrNull_ / pct_ unchanged
 * — no second funnel/value engine. REVENUE_SPRINT_GOAL is the same constant
 * CRM_Dashboard.gs's KPI card already uses (one value, not redeclared).
 * REVENUE_SPRINT_END_DATE is read from Script Properties (yyyy-mm-dd, same
 * mechanism as the Tavily/Gemini keys) — Days Remaining/Weekly-Monthly
 * Required/Pace Status are N/A until it's set; nothing here guesses a date.
 * Any conversion-rate-derived figure (Weighted Pipeline, contacts/meetings/
 * proposals/wins needed) is N/A below ANALYTICS_MIN_SAMPLE, never invented.
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
  const outstandingPayments = getOutstandingPayments_(ss);
  const tracker = build10KTracker_(ss);

  const summary = {
    hot: categorized.hot.length,
    dueToday: categorized.dueToday.length,
    overdue: categorized.overdue.length,
    highPriorityUncontacted: categorized.highPriorityUncontacted.length,
    auditedUncontacted: categorized.auditedUncontacted.length,
    meetings: meetings.length,
    proposals: proposals.length,
    outstandingPayments: outstandingPayments.length
  };

  const actions = buildRankedActions_(categorized, meetings, proposals, outstandingPayments);
  const message = formatCommandCenterMessage_(summary, actions, tracker);

  ui.alert('Daily Revenue Command Center', message, ui.ButtonSet.OK);
  return { summary: summary, actions: actions, tracker: tracker }; // read-only result, useful for tests
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
    if (typeof isExcludedProspect_ === 'function' && isExcludedProspect_(business)) return; // CRM_Health.gs — the agency itself, never a sales prospect

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

// Unpaid Revenue rows — "Outstanding payments/revenue actions" (queue item
// 6). Reuses getSheetRows_/numOrNull_ (CRM_Analytics.gs) rather than a new
// Revenue reader. Sorted by amount, largest first, when formatted below —
// no due-date field exists on Revenue to sort by instead. Guarded so this
// still works (returns none) if CRM_Analytics.gs hasn't been added yet —
// same defensive pattern this CRM already uses for every other optional
// cross-file dependency.
function getOutstandingPayments_(ss) {
  if (typeof getSheetRows_ !== 'function' || typeof numOrNull_ !== 'function') return [];
  const rows = getSheetRows_(ss, 'Revenue'); // CRM_Analytics.gs
  const out = [];
  rows.forEach(function (r) {
    const business = String(r.Client || '').trim();
    if (business === '' || r.Paid === true) return;
    out.push({
      business: business,
      invoice: String(r.Invoice || '').trim(),
      amount: numOrNull_(r.Amount) // CRM_Analytics.gs
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

function buildRankedActions_(categorized, meetings, proposals, outstandingPayments) {
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

  (outstandingPayments || []).slice().sort(function (a, b) { return (b.amount || 0) - (a.amount || 0) || a.business.localeCompare(b.business); })
    .forEach(function (r) {
      const key = r.business.trim().toLowerCase();
      if (seenBusiness[key]) return;
      seenBusiness[key] = true;
      actions.push(buildRevenueAction_(r));
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

function buildRevenueAction_(r) {
  return {
    business: r.business,
    reason: 'OUTSTANDING PAYMENT' + (r.invoice ? ' — ' + r.invoice : '') + (r.amount !== null ? ' — $' + r.amount : ''),
    detail: '',
    action: 'Follow Up on Payment'
  };
}

// ---------------------------------------------------------------------------
// $10K Tracker / Funnel / Revenue Math — reuses CRM_Analytics.gs's
// buildOverview_/buildFunnel_/buildValue_ unchanged (no second engine).
// REVENUE_SPRINT_GOAL is CRM_Dashboard.gs's constant, not redeclared here.
// ---------------------------------------------------------------------------

// Optional Script Properties key (yyyy-mm-dd), same mechanism as the
// Tavily/Gemini keys — Days Remaining/Weekly-Monthly Required/Pace Status
// are all N/A until this is set; never guessed.
const REVENUE_SPRINT_END_DATE_PROPERTY = 'REVENUE_SPRINT_END_DATE';

function getRevenueSprintEndDate_() {
  if (typeof PropertiesService === 'undefined') return null;
  const raw = PropertiesService.getScriptProperties().getProperty(REVENUE_SPRINT_END_DATE_PROPERTY);
  if (!raw) return null;
  const d = new Date(String(raw).trim() + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

// Actual PAID revenue whose Payment Date falls in the trailing `daysBack`
// days (inclusive of today) — the real, non-invented basis for Pace Status
// and the "Revenue This Week" figure, same style CRM_Dashboard.gs's KPI
// formula already uses (rolling window, not a calendar week).
function sumRevenueSince_(revenueRows, daysBack) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cutoff = new Date(today.getTime() - daysBack * 86400000);
  let total = 0;
  revenueRows.forEach(function (r) {
    if (r.Paid !== true) return;
    const d = parseDateOrNull_(r['Payment Date']);
    if (!d) return;
    const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (d0.getTime() >= cutoff.getTime() && d0.getTime() <= today.getTime()) {
      const amt = numOrNull_(r.Amount); // CRM_Analytics.gs
      if (amt !== null) total += amt;
    }
  });
  return Math.round(total * 100) / 100;
}

// Unavailable-but-safe shape: every field the formatter reads is present
// (as null/N/A), so formatCommandCenterMessage_ never has to special-case
// a missing tracker. Used only if CRM_Analytics.gs/CRM_Dashboard.gs haven't
// been added to the project yet.
function emptyTracker_() {
  return {
    goal: 0, collected: 0, remaining: 0, daysRemaining: null, weeklyRequired: null, monthlyRequired: null,
    paceStatus: 'N/A', revenueThisWeek: 0, activePipeline: null, weightedPipeline: null,
    dealsWon: 0, avgDeal: null,
    revenueMath: { winsNeeded: null, proposalsNeeded: null, meetingsNeeded: null, contactsNeeded: null },
    funnel: { available: false, message: 'Pipeline Intelligence (CRM_Analytics.gs) not available.' }
  };
}

function build10KTracker_(ss) {
  if (typeof buildAnalyticsProspectRecords_ !== 'function' || typeof buildOverview_ !== 'function' ||
    typeof buildFunnel_ !== 'function' || typeof buildValue_ !== 'function' || typeof REVENUE_SPRINT_GOAL === 'undefined') {
    return emptyTracker_(); // CRM_Analytics.gs / CRM_Dashboard.gs not loaded yet — same guarded-optional-dependency pattern used elsewhere in this CRM
  }

  const prospects = ss.getSheetByName('Prospects');
  const records = prospects ? buildAnalyticsProspectRecords_(prospects) : []; // CRM_Analytics.gs
  const meetingBusinesses = getDistinctBusinesses_(ss, 'Meetings'); // CRM_Analytics.gs
  const clientBusinesses = getDistinctBusinesses_(ss, 'Clients');
  const proposalRows = getSheetRows_(ss, 'Proposals').filter(function (p) { return String(p.Business || '').trim() !== ''; });
  const revenueRows = getSheetRows_(ss, 'Revenue');

  const overview = buildOverview_(records, meetingBusinesses, proposalRows, clientBusinesses); // CRM_Analytics.gs
  const funnel = buildFunnel_(records, meetingBusinesses, proposalRows, clientBusinesses); // CRM_Analytics.gs
  const value = buildValue_(proposalRows, revenueRows, overview.clientsCount); // CRM_Analytics.gs

  const collected = value.wonRevenue || 0;
  const remaining = Math.max(0, REVENUE_SPRINT_GOAL - collected); // CRM_Dashboard.gs constant
  const revenueThisWeek = sumRevenueSince_(revenueRows, 6);

  const endDate = getRevenueSprintEndDate_();
  let daysRemaining = null, weeklyRequired = null, monthlyRequired = null, paceStatus = 'N/A';
  if (endDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    daysRemaining = Math.max(0, Math.round((endDate.getTime() - today.getTime()) / 86400000));
    if (daysRemaining > 0) {
      weeklyRequired = Math.round((remaining / daysRemaining) * 7 * 100) / 100;
      monthlyRequired = Math.round((remaining / daysRemaining) * 30 * 100) / 100;
      paceStatus = revenueThisWeek >= weeklyRequired ? 'ON PACE' : 'BEHIND PACE';
    } else {
      paceStatus = remaining <= 0 ? 'GOAL REACHED' : 'BEHIND PACE';
    }
  }

  // Weighted Pipeline: active proposal value scaled by the ACTUAL historical
  // Proposal->Client conversion rate (buildFunnel_, unchanged) — never a
  // guessed probability. N/A whenever that rate itself is N/A.
  const weightedPipeline = (value.activeProposalValue !== null && funnel.available && funnel.proposalToClientPct !== null)
    ? Math.round(value.activeProposalValue * (funnel.proposalToClientPct / 100) * 100) / 100
    : null;

  return {
    goal: REVENUE_SPRINT_GOAL, collected: collected, remaining: remaining,
    daysRemaining: daysRemaining, weeklyRequired: weeklyRequired, monthlyRequired: monthlyRequired,
    paceStatus: paceStatus, revenueThisWeek: revenueThisWeek,
    activePipeline: value.activeProposalValue, weightedPipeline: weightedPipeline,
    dealsWon: overview.clientsCount, avgDeal: value.avgWonProjectValue,
    revenueMath: buildRevenueMath_(funnel, value, remaining),
    funnel: funnel
  };
}

// Contacts/meetings/proposals/wins needed for the remaining goal amount,
// using ACTUAL RCS conversion rates only — any stage whose sample size is
// below ANALYTICS_MIN_SAMPLE (CRM_Analytics.gs) stays N/A rather than
// projecting off a single lucky (or unlucky) conversion.
function buildRevenueMath_(funnel, value, remaining) {
  const out = { winsNeeded: null, proposalsNeeded: null, meetingsNeeded: null, contactsNeeded: null };
  if (remaining <= 0) return { winsNeeded: 0, proposalsNeeded: 0, meetingsNeeded: 0, contactsNeeded: 0 };
  if (!value.avgWonProjectValue) return out;

  out.winsNeeded = Math.ceil(remaining / value.avgWonProjectValue);
  if (!funnel.available) return out;

  const stageCount = {};
  funnel.stages.forEach(function (s) { stageCount[s.name] = s.count; });

  if (funnel.proposalToClientPct !== null && stageCount['Proposal'] >= ANALYTICS_MIN_SAMPLE) { // CRM_Analytics.gs
    out.proposalsNeeded = Math.ceil(out.winsNeeded / (funnel.proposalToClientPct / 100));
  }
  if (out.proposalsNeeded !== null && funnel.meetingToProposalPct !== null && stageCount['Meeting'] >= ANALYTICS_MIN_SAMPLE) {
    out.meetingsNeeded = Math.ceil(out.proposalsNeeded / (funnel.meetingToProposalPct / 100));
  }
  if (out.meetingsNeeded !== null && stageCount['Contacted'] >= ANALYTICS_MIN_SAMPLE) {
    const contactedToMeetingPct = pct_(stageCount['Meeting'], stageCount['Contacted']); // CRM_Analytics.gs
    if (contactedToMeetingPct !== null && contactedToMeetingPct > 0) {
      out.contactsNeeded = Math.ceil(out.meetingsNeeded / (contactedToMeetingPct / 100));
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Report formatting
// ---------------------------------------------------------------------------

function money_(v) { return v !== null && v !== undefined ? '$' + v : 'N/A'; }
function numOrNA_(v) { return v !== null && v !== undefined ? String(v) : 'N/A'; }
function pctOrNA_(v) { return v !== null && v !== undefined ? v + '%' : 'N/A'; }

function formatCommandCenterMessage_(summary, actions, tracker) {
  const lines = [];
  lines.push('RCS DAILY REVENUE COMMAND CENTER — ' + formatScoreDate_(new Date())); // CRM_Scoring.gs
  lines.push('');

  // At-a-glance banner, matching the requested TODAY format exactly.
  lines.push('TODAY');
  lines.push('🔥 ' + summary.hot + ' prospect(s) ready');
  lines.push('📩 ' + summary.dueToday + ' follow-up(s) due');
  lines.push('⚠️ ' + summary.overdue + ' overdue');
  lines.push('📅 ' + summary.meetings + ' meeting(s)');
  lines.push('📄 ' + summary.proposals + ' proposal(s)');
  lines.push('💰 ' + money_(tracker.activePipeline) + ' pipeline');
  lines.push('🎯 ' + money_(tracker.remaining) + ' remaining to $' + tracker.goal);
  lines.push('');

  lines.push('PIPELINE HEALTH');
  lines.push('Hot Leads: ' + summary.hot + ' | Follow-Ups Due Today: ' + summary.dueToday + ' | Overdue Follow-Ups: ' + summary.overdue);
  lines.push('Uncontacted High-Priority: ' + summary.highPriorityUncontacted + ' | Audited/Uncontacted: ' + summary.auditedUncontacted);
  lines.push('Upcoming Meetings: ' + summary.meetings + ' | Active Proposals: ' + summary.proposals + ' | Outstanding Payments: ' + summary.outstandingPayments);
  lines.push('');

  lines.push('$10K TRACKER');
  lines.push('Goal: $' + tracker.goal + ' | Collected: ' + money_(tracker.collected) + ' | Remaining: ' + money_(tracker.remaining));
  lines.push('Days Remaining: ' + numOrNA_(tracker.daysRemaining) +
    ' | Weekly Required: ' + money_(tracker.weeklyRequired) + ' | Monthly Required: ' + money_(tracker.monthlyRequired));
  if (!tracker.daysRemaining && tracker.paceStatus === 'N/A') {
    lines.push('(Set REVENUE_SPRINT_END_DATE in Script Properties (yyyy-mm-dd) to see Days Remaining / Required pace / Pace Status.)');
  }
  lines.push('Pace Status: ' + tracker.paceStatus + ' (Revenue last 7 days: ' + money_(tracker.revenueThisWeek) + ')');
  lines.push('Active Pipeline: ' + money_(tracker.activePipeline) + ' | Weighted Pipeline: ' + money_(tracker.weightedPipeline));
  lines.push('Deals Won: ' + tracker.dealsWon + ' | Average Deal: ' + money_(tracker.avgDeal));
  lines.push('');

  lines.push('FUNNEL METRICS');
  if (!tracker.funnel.available) {
    lines.push(tracker.funnel.message);
  } else {
    tracker.funnel.stages.forEach(function (s) {
      lines.push('  ' + s.name + ': ' + s.count + (s.pctOfTotal !== null ? ' (' + s.pctOfTotal + '% of total)' : ''));
    });
    lines.push('Contacted→Meeting: ' + pctOrNA_(pct_(tracker.funnel.stages[2].count, tracker.funnel.stages[1].count)) +
      ' | Meeting→Proposal: ' + pctOrNA_(tracker.funnel.meetingToProposalPct) +
      ' | Proposal→Client: ' + pctOrNA_(tracker.funnel.proposalToClientPct));
  }
  lines.push('');

  lines.push('REVENUE MATH (to reach $10K)');
  const rm = tracker.revenueMath;
  lines.push('Wins Needed: ' + numOrNA_(rm.winsNeeded) + ' | Proposals Needed: ' + numOrNA_(rm.proposalsNeeded) +
    ' | Meetings Needed: ' + numOrNA_(rm.meetingsNeeded) + ' | Contacts Needed: ' + numOrNA_(rm.contactsNeeded));
  lines.push('');

  if (actions.length === 0) {
    lines.push('No urgent actions found. Your pipeline is clear.');
    return lines.join('\n').trim();
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
