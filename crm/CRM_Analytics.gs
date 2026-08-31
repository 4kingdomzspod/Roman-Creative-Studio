/**
 * CRM_Analytics.gs
 * ---------------------------------------------------------------------------
 * Pipeline Intelligence & Analytics: "How is RCS's sales pipeline actually
 * performing?" — a single, read-only report built entirely from Prospects,
 * Website Audits, Meetings, Proposals, Clients, and Revenue data. No new
 * sheet, no new stored fields, no AI/external API, no automatic writes.
 *
 * This CRM has no historical stage-transition log (only a current Status
 * value on Prospects) and no stored prospect-creation date. Every metric
 * below is either genuinely computable from what's actually stored, or is
 * explicitly labeled "Not available from current CRM data" / "Insufficient
 * historical date data" — nothing here is estimated, forecast, or invented.
 *
 * Reuses: buildProspectRecords_ / compareDateToToday_ / parseDateOrNull_ /
 * ACTIVE_PROPOSAL_STATUSES (CRM_CommandCenter.gs), getLiveProspectsHeaders_
 * (CRM_Outreach.gs), isExcludedFromTopLeads_ / formatScoreDate_
 * (CRM_Scoring.gs), getHeaders_ (CRM_Actions.gs), isExcludedProspect_
 * (CRM_Health.gs — guarded). No scoring, exclusion, or date logic is
 * reimplemented — this file only reads, aggregates, and ranks.
 */

const ANALYTICS_STALE_DAYS = 30;   // "no recent activity" / "stalled" threshold
const ANALYTICS_MIN_SAMPLE = 3;    // minimum prospects before showing a conversion %

// ---------------------------------------------------------------------------
// Menu entry point
// ---------------------------------------------------------------------------

function openPipelineIntelligence_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const prospects = ss.getSheetByName('Prospects');

  const records = prospects ? buildAnalyticsProspectRecords_(prospects) : [];
  const meetingBusinesses = getDistinctBusinesses_(ss, 'Meetings');
  const clientBusinesses = getDistinctBusinesses_(ss, 'Clients');
  const proposalRows = getSheetRows_(ss, 'Proposals').filter(function (p) { return String(p.Business || '').trim() !== ''; });
  const revenueRows = getSheetRows_(ss, 'Revenue');

  const overview = buildOverview_(records, meetingBusinesses, proposalRows, clientBusinesses);
  const funnel = buildFunnel_(records, meetingBusinesses, proposalRows, clientBusinesses);
  const value = buildValue_(proposalRows, revenueRows, overview.clientsCount);
  const velocity = buildVelocity_(proposalRows, ss);
  const aging = buildAging_(records, proposalRows);
  const risks = buildRisks_(records, proposalRows);
  const industry = buildIndustryAnalysis_(records, clientBusinesses, revenueRows);
  const leadSource = { message: 'Lead-source analytics unavailable from current schema — Prospects has no stored lead-source/referral field, and Referral Network isn’t linked to individual prospects.' };
  const dataQuality = buildDataQuality_(prospects, ss);

  const report = {
    overview: overview, funnel: funnel, value: value, velocity: velocity, aging: aging,
    risks: risks, industry: industry, leadSource: leadSource, dataQuality: dataQuality
  };

  ui.alert('Pipeline Intelligence', formatPipelineReport_(report), ui.ButtonSet.OK);
  return report; // read-only result, useful for tests
}

// ---------------------------------------------------------------------------
// Shared readers (read-only; generic across sheets, resolve columns by
// header name rather than position)
// ---------------------------------------------------------------------------

function readField_(row, idx, name) {
  return idx[name] !== undefined ? row[idx[name]] : '';
}

// Extends CRM_CommandCenter.gs's buildProspectRecords_ (reused, not
// reimplemented) with the extra fields Analytics needs that Command Center
// doesn't expose: Industry, days since Last Contact, contact-info presence,
// and the raw Archived Date (for separating Archived vs. Do Not Contact).
function buildAnalyticsProspectRecords_(prospects) {
  const base = buildProspectRecords_(prospects); // CRM_CommandCenter.gs
  if (base.length === 0) return [];

  const headers = getLiveProspectsHeaders_(prospects); // CRM_Outreach.gs
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });
  const lastRow = prospects.getLastRow();
  const data = prospects.getRange(2, 1, lastRow - 1, headers.length).getValues();

  // Aligned by row position, not by Business name: a Business name is not
  // guaranteed unique (two rows can legitimately share one — e.g. duplicate
  // data entry), so a name-keyed lookup would let a later row's Industry/
  // Archived Date/contact info silently overwrite an earlier row's for both.
  // base and this pass both filter identically (skip blank Business) and
  // walk the same row range in the same order, so index-aligning is safe.
  const extraByRow = [];
  data.forEach(function (row) {
    const business = String(readField_(row, idx, 'Business') || '').trim();
    if (business === '' || (typeof isExcludedProspect_ === 'function' && isExcludedProspect_(business))) return; // CRM_Health.gs — stays aligned with buildProspectRecords_'s own skip
    extraByRow.push({
      industry: String(readField_(row, idx, 'Industry') || '').trim(),
      archivedDateRaw: readField_(row, idx, 'Archived Date'),
      daysSinceContact: daysSince_(readField_(row, idx, 'Last Contact')),
      hasContactInfo: String(readField_(row, idx, 'Phone') || '').trim() !== '' || String(readField_(row, idx, 'Email') || '').trim() !== ''
    });
  });

  return base.map(function (r, i) {
    return Object.assign({}, r, extraByRow[i] || { industry: '', archivedDateRaw: '', daysSinceContact: null, hasContactInfo: false });
  });
}

function getDistinctBusinesses_(ss, sheetName) {
  const set = {};
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return set;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return set;
  const headers = getHeaders_(sheetName); // CRM_Actions.gs — static schema
  const bIdx = headers.indexOf('Business');
  if (bIdx === -1) return set;
  sheet.getRange(2, bIdx + 1, lastRow - 1, 1).getValues().forEach(function (row) {
    const b = String(row[0] || '').trim();
    if (b !== '') set[b.toLowerCase()] = true;
  });
  return set;
}

// Returns every non-entirely-blank row as a {Header: value} object. Sheet-
// agnostic on purpose (Revenue's identity column is "Client", not
// "Business") — callers filter by whichever field represents identity.
function getSheetRows_(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const headers = getHeaders_(sheetName); // CRM_Actions.gs
  const data = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  const out = [];
  data.forEach(function (row) {
    const isBlank = row.every(function (v) { return v === '' || v === null || v === undefined; });
    if (isBlank) return;
    const obj = {};
    headers.forEach(function (h, i) { obj[h] = row[i]; });
    out.push(obj);
  });
  return out;
}

function daysSince_(value) {
  const d = parseDateOrNull_(value); // CRM_CommandCenter.gs
  if (!d) return null;
  const today = new Date();
  const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.round((t0 - d0) / 86400000);
}

function pct_(numerator, denominator) {
  return denominator > 0 ? Math.round((numerator / denominator) * 1000) / 10 : null;
}

function numOrNull_(v) {
  return (v !== '' && v !== null && v !== undefined && !isNaN(Number(v))) ? Number(v) : null;
}

function avgOrNull_(values) {
  return values.length > 0 ? Math.round((values.reduce(function (a, b) { return a + b; }, 0) / values.length) * 100) / 100 : null;
}

function sumOrNull_(values) {
  return values.length > 0 ? values.reduce(function (a, b) { return a + b; }, 0) : null;
}

// ---------------------------------------------------------------------------
// Pipeline Overview
// ---------------------------------------------------------------------------

function buildOverview_(records, meetingBusinesses, proposalRows, clientBusinesses) {
  const active = records.filter(function (r) { return !r.excluded; });

  const byStatus = {};
  records.forEach(function (r) {
    const key = r.status || '(blank)';
    byStatus[key] = (byStatus[key] || 0) + 1;
  });

  const hotCount = active.filter(function (r) { return r.scoreTier === 'Hot' || (r.leadScoreNum !== null && r.leadScoreNum >= 80); }).length;
  const warmCount = active.filter(function (r) { return r.scoreTier === 'Warm' && !(r.leadScoreNum !== null && r.leadScoreNum >= 80); }).length;
  const coldCount = active.filter(function (r) { return r.scoreTier === 'Cold'; }).length;
  const unscoredCount = active.filter(function (r) { return !r.scoreTier; }).length;
  const contactedCount = active.filter(function (r) { return r.statusLower !== '' && r.statusLower !== 'new'; }).length;

  const closedLostCount = records.filter(function (r) {
    return r.statusLower === 'closed — lost' || r.statusLower === 'closed — not interested';
  }).length;
  const dncCount = records.filter(function (r) { return r.statusLower === 'do not contact'; }).length;
  // Mutually exclusive with dncCount: Archived status, or a stray Archived
  // Date on a non-"Do Not Contact" row (that combination is treated as DNC).
  const archivedCount = records.filter(function (r) {
    return r.statusLower !== 'do not contact' && (r.statusLower === 'archived' || String(r.archivedDateRaw || '').trim() !== '');
  }).length;

  return {
    totalProspectRows: records.length,
    activePipelineCount: active.length,
    byStatus: byStatus,
    hotCount: hotCount, warmCount: warmCount, coldCount: coldCount, unscoredCount: unscoredCount,
    contactedCount: contactedCount,
    meetingsCount: Object.keys(meetingBusinesses).length,
    activeProposalsCount: proposalRows.filter(function (p) { return ACTIVE_PROPOSAL_STATUSES.indexOf(String(p.Status || '').trim().toLowerCase()) !== -1; }).length,
    clientsCount: Object.keys(clientBusinesses).length,
    closedLostCount: closedLostCount,
    archivedCount: archivedCount,
    dncCount: dncCount
  };
}

// ---------------------------------------------------------------------------
// Conversion Funnel — CURRENT-STATE only (no historical stage-transition
// log exists in this CRM's schema)
// ---------------------------------------------------------------------------

function buildFunnel_(records, meetingBusinesses, proposalRows, clientBusinesses) {
  const total = records.length;
  if (total === 0) {
    return { available: false, message: 'No prospects on file — funnel not available.' };
  }

  const proposalBusinesses = {};
  proposalRows.forEach(function (p) {
    const b = String(p.Business || '').trim();
    if (b !== '') proposalBusinesses[b.toLowerCase()] = true;
  });

  const contactedCount = records.filter(function (r) { return r.statusLower !== '' && r.statusLower !== 'new'; }).length;
  const meetingCount = records.filter(function (r) { return meetingBusinesses[r.business.toLowerCase()]; }).length;
  const proposalCount = records.filter(function (r) { return proposalBusinesses[r.business.toLowerCase()]; }).length;
  const clientCount = records.filter(function (r) { return clientBusinesses[r.business.toLowerCase()]; }).length;

  return {
    available: true,
    label: 'CURRENT-STATE FUNNEL',
    note: 'Based on current Status/records only — this CRM does not store historical stage-transition timestamps, so this reflects a snapshot, not a true cohort conversion rate.',
    stages: [
      { name: 'Prospects', count: total, pctOfTotal: 100 },
      { name: 'Contacted', count: contactedCount, pctOfTotal: pct_(contactedCount, total) },
      { name: 'Meeting', count: meetingCount, pctOfTotal: pct_(meetingCount, total) },
      { name: 'Proposal', count: proposalCount, pctOfTotal: pct_(proposalCount, total) },
      { name: 'Won/Client', count: clientCount, pctOfTotal: pct_(clientCount, total) }
    ],
    overallConversionPct: pct_(clientCount, total),
    proposalToClientPct: proposalCount > 0 ? pct_(clientCount, proposalCount) : null,
    meetingToProposalPct: meetingCount > 0 ? pct_(proposalCount, meetingCount) : null
  };
}

// ---------------------------------------------------------------------------
// Pipeline Value — only real stored monetary fields; never fabricated
// ---------------------------------------------------------------------------

function buildValue_(proposalRows, revenueRows, wonClientCount) {
  const activeProposals = proposalRows.filter(function (p) { return ACTIVE_PROPOSAL_STATUSES.indexOf(String(p.Status || '').trim().toLowerCase()) !== -1; });
  const activeProposalValue = sumOrNull_(activeProposals.map(function (p) { return numOrNull_(p.Value); }).filter(function (v) { return v !== null; }));

  const acceptedValues = proposalRows
    .filter(function (p) { return String(p.Status || '').trim().toLowerCase() === 'accepted'; })
    .map(function (p) { return numOrNull_(p.Value); }).filter(function (v) { return v !== null; });
  const avgWonProjectValue = avgOrNull_(acceptedValues);

  const declinedValues = proposalRows
    .filter(function (p) { return String(p.Status || '').trim().toLowerCase() === 'declined'; })
    .map(function (p) { return numOrNull_(p.Value); }).filter(function (v) { return v !== null; });
  const closedLostValue = sumOrNull_(declinedValues);

  const paidAmounts = revenueRows.filter(function (r) { return r.Paid === true; }).map(function (r) { return numOrNull_(r.Amount); }).filter(function (v) { return v !== null; });
  const wonRevenue = sumOrNull_(paidAmounts);
  const allAmounts = revenueRows.map(function (r) { return numOrNull_(r.Amount); }).filter(function (v) { return v !== null; });
  const totalInvoiced = sumOrNull_(allAmounts);

  return {
    activeProposalCount: activeProposals.length,
    activeProposalValue: activeProposalValue,
    avgWonProjectValue: avgWonProjectValue,
    closedLostValue: closedLostValue,
    wonRevenue: wonRevenue,
    totalInvoiced: totalInvoiced,
    wonClientCount: wonClientCount
  };
}

// ---------------------------------------------------------------------------
// Sales Velocity — only where stored dates genuinely support it
// ---------------------------------------------------------------------------

function buildVelocity_(proposalRows, ss) {
  const clientRows = getSheetRows_(ss, 'Clients').filter(function (c) { return String(c.Business || '').trim() !== ''; });

  const earliestSentByBusiness = {};
  proposalRows.forEach(function (p) {
    const b = String(p.Business || '').trim().toLowerCase();
    if (b === '') return;
    const sent = parseDateOrNull_(p.Sent); // CRM_CommandCenter.gs
    if (!sent) return;
    if (!earliestSentByBusiness[b] || sent < earliestSentByBusiness[b]) earliestSentByBusiness[b] = sent;
  });

  const proposalToClientDays = [];
  clientRows.forEach(function (c) {
    const b = String(c.Business || '').trim().toLowerCase();
    const start = parseDateOrNull_(c.Start);
    const sent = earliestSentByBusiness[b];
    if (!start || !sent) return;
    const days = Math.round((start.getTime() - sent.getTime()) / 86400000);
    if (days >= 0) proposalToClientDays.push(days);
  });

  const activeProposalAges = proposalRows
    .filter(function (p) { return ACTIVE_PROPOSAL_STATUSES.indexOf(String(p.Status || '').trim().toLowerCase()) !== -1; })
    .map(function (p) { return daysSince_(p.Sent); })
    .filter(function (d) { return d !== null; });

  return {
    avgProspectCreationToClientMessage: 'Insufficient historical date data — Prospects has no stored creation/added date.',
    avgProposalToClientDays: avgOrNull_(proposalToClientDays),
    avgProposalToClientSampleSize: proposalToClientDays.length,
    avgActiveProspectAgeMessage: 'Insufficient historical date data — Prospects has no stored creation date (see Pipeline Aging for days-since-last-contact instead).',
    avgActiveProposalAgeDays: avgOrNull_(activeProposalAges)
  };
}

// ---------------------------------------------------------------------------
// Pipeline Aging
// ---------------------------------------------------------------------------

function buildAging_(records, proposalRows) {
  const active = records.filter(function (r) { return !r.excluded; });

  const overdueFollowUpCount = active.filter(function (r) { return r.nextFollowUpStatus === 'past'; }).length;
  const neverContactedCount = active.filter(function (r) { return r.daysSinceContact === null; }).length;
  const staleContactCount = active.filter(function (r) { return r.daysSinceContact !== null && r.daysSinceContact > ANALYTICS_STALE_DAYS; }).length;

  const staleProposals = proposalRows
    .filter(function (p) { return ACTIVE_PROPOSAL_STATUSES.indexOf(String(p.Status || '').trim().toLowerCase()) !== -1; })
    .map(function (p) { return { business: String(p.Business || '').trim(), daysSinceSent: daysSince_(p.Sent) }; })
    .filter(function (p) { return p.daysSinceSent !== null && p.daysSinceSent > ANALYTICS_STALE_DAYS; });

  return {
    oldestActiveProspects: { message: 'Not available from current CRM data — Prospects has no stored creation/added date.' },
    overdueFollowUpCount: overdueFollowUpCount,
    neverContactedCount: neverContactedCount,
    staleContactCount: staleContactCount,
    staleContactThresholdDays: ANALYTICS_STALE_DAYS,
    staleProposals: staleProposals,
    staleProposalThresholdDays: ANALYTICS_STALE_DAYS
  };
}

// ---------------------------------------------------------------------------
// Pipeline Risks — ranked, deduped by business, capped at 10. Reuses
// Sprint 7's Lead Score/Score Tier fields directly; no new scoring model.
// ---------------------------------------------------------------------------

const RISK_CATEGORY_ORDER = ['hotNoAction', 'overdue', 'highPriorityUncontacted', 'staleContact', 'staleProposal', 'noNextAction'];

function buildRisks_(records, proposalRows) {
  const active = records.filter(function (r) { return !r.excluded; });
  const buckets = { hotNoAction: [], overdue: [], highPriorityUncontacted: [], staleContact: [], staleProposal: [], noNextAction: [] };

  active.forEach(function (r) {
    const isHot = r.scoreTier === 'Hot' || (r.leadScoreNum !== null && r.leadScoreNum >= 80);
    const hasNoAction = r.nextFollowUpStatus === 'past' || r.nextFollowUpStatus === null;
    if (isHot && hasNoAction) { buckets.hotNoAction.push(r); return; }
    if (r.nextFollowUpStatus === 'past') { buckets.overdue.push(r); return; }
    if (r.priority.toLowerCase() === 'high' && r.uncontacted) { buckets.highPriorityUncontacted.push(r); return; }
    if (r.daysSinceContact !== null && r.daysSinceContact > ANALYTICS_STALE_DAYS) { buckets.staleContact.push(r); return; }
    if (r.nextFollowUpStatus === null && r.statusLower !== '' && r.statusLower !== 'new') { buckets.noNextAction.push(r); }
  });

  proposalRows.forEach(function (p) {
    if (ACTIVE_PROPOSAL_STATUSES.indexOf(String(p.Status || '').trim().toLowerCase()) === -1) return;
    const days = daysSince_(p.Sent);
    if (days !== null && days > ANALYTICS_STALE_DAYS) {
      buckets.staleProposal.push({ business: String(p.Business || '').trim(), daysSinceSent: days, status: p.Status });
    }
  });

  const seen = {};
  const ranked = [];
  RISK_CATEGORY_ORDER.forEach(function (key) {
    buckets[key].forEach(function (item) {
      const bkey = item.business.trim().toLowerCase();
      if (seen[bkey]) return;
      seen[bkey] = true;
      ranked.push(buildRiskEntry_(key, item));
    });
  });

  return ranked.slice(0, 10);
}

function buildRiskEntry_(key, item) {
  if (key === 'staleProposal') {
    return {
      business: item.business,
      reason: 'PROPOSAL ' + String(item.status || '').toUpperCase(),
      detail: 'Risk: proposal has had no recent activity (' + item.daysSinceSent + ' days since sent).'
    };
  }
  const scoreText = item.leadScoreNum !== null ? 'Score ' + item.leadScoreNum : 'Score unavailable';
  if (key === 'hotNoAction') return { business: item.business, reason: 'HOT — ' + scoreText, detail: 'Risk: high-value prospect has no scheduled next action.' };
  if (key === 'overdue') return { business: item.business, reason: 'FOLLOW-UP OVERDUE', detail: 'Risk: scheduled follow-up date has passed.' };
  if (key === 'highPriorityUncontacted') return { business: item.business, reason: 'HIGH PRIORITY — Uncontacted', detail: 'Risk: high-priority prospect has never been contacted.' };
  if (key === 'staleContact') return { business: item.business, reason: 'NO RECENT ACTIVITY', detail: 'Risk: no contact recorded in ' + item.daysSinceContact + '+ days.' };
  return { business: item.business, reason: 'NO NEXT FOLLOW-UP', detail: 'Risk: engaged prospect has no scheduled next action.' };
}

// ---------------------------------------------------------------------------
// Performance by Industry
// ---------------------------------------------------------------------------

function buildIndustryAnalysis_(records, clientBusinesses, revenueRows) {
  const groups = {};
  const businessToIndustry = {};
  records.forEach(function (r) {
    const key = r.industry || '(blank)';
    if (!groups[key]) groups[key] = { industry: key, total: 0, active: 0, clients: 0 };
    groups[key].total++;
    if (!r.excluded) groups[key].active++;
    if (clientBusinesses[r.business.toLowerCase()]) groups[key].clients++;
    businessToIndustry[r.business.toLowerCase()] = key;
  });

  const revenueByIndustry = {};
  let unattributedRevenue = 0;
  revenueRows.forEach(function (row) {
    const amount = numOrNull_(row.Amount);
    if (amount === null) return;
    const client = String(row.Client || '').trim();
    const industry = client !== '' ? businessToIndustry[client.toLowerCase()] : undefined;
    if (industry === undefined) { unattributedRevenue += amount; return; }
    revenueByIndustry[industry] = (revenueByIndustry[industry] || 0) + amount;
  });

  const rows = Object.keys(groups).map(function (key) {
    const g = groups[key];
    const sampleTooSmall = g.total < ANALYTICS_MIN_SAMPLE;
    return {
      industry: g.industry, total: g.total, active: g.active, clients: g.clients,
      conversionPct: sampleTooSmall ? null : pct_(g.clients, g.total),
      sampleTooSmall: sampleTooSmall,
      revenue: revenueByIndustry[key] !== undefined ? revenueByIndustry[key] : null
    };
  });

  rows.sort(function (a, b) { return (b.clients - a.clients) || ((b.revenue || 0) - (a.revenue || 0)); });

  return { rows: rows, unattributedRevenue: unattributedRevenue, sortNote: 'sorted by clients won, descending' };
}

// ---------------------------------------------------------------------------
// Data Quality
// ---------------------------------------------------------------------------

function buildDataQuality_(prospects, ss) {
  const result = {
    prospectsMissingBusiness: 0, prospectsMissingStatus: 0,
    activeMissingNextFollowUp: 0, activeMissingContactInfo: 0,
    proposalsMissingDateOrValue: 0, clientsMissingFields: 0
  };

  if (prospects) {
    const lastRow = prospects.getLastRow();
    if (lastRow >= 2) {
      const headers = getLiveProspectsHeaders_(prospects); // CRM_Outreach.gs
      const idx = {};
      headers.forEach(function (h, i) { idx[h] = i; });
      prospects.getRange(2, 1, lastRow - 1, headers.length).getValues().forEach(function (row) {
        const business = String(readField_(row, idx, 'Business') || '').trim();
        if (business === '') { result.prospectsMissingBusiness++; return; }
        if (typeof isExcludedProspect_ === 'function' && isExcludedProspect_(business)) return; // CRM_Health.gs — the agency itself, excluded from data-quality counts too
        const status = String(readField_(row, idx, 'Status') || '').trim();
        if (status === '') result.prospectsMissingStatus++;

        const excluded = isExcludedFromTopLeads_(status, readField_(row, idx, 'Archived Date')); // CRM_Scoring.gs
        if (!excluded) {
          if (String(readField_(row, idx, 'Next Follow Up') || '').trim() === '') result.activeMissingNextFollowUp++;
          const phone = String(readField_(row, idx, 'Phone') || '').trim();
          const email = String(readField_(row, idx, 'Email') || '').trim();
          if (phone === '' && email === '') result.activeMissingContactInfo++;
        }
      });
    }
  }

  getSheetRows_(ss, 'Proposals').filter(function (p) { return String(p.Business || '').trim() !== ''; }).forEach(function (p) {
    const sent = String(p.Sent || '').trim();
    const hasValue = numOrNull_(p.Value) !== null;
    if (sent === '' || !hasValue) result.proposalsMissingDateOrValue++;
  });

  getSheetRows_(ss, 'Clients').filter(function (c) { return String(c.Business || '').trim() !== ''; }).forEach(function (c) {
    if (String(c.Start || '').trim() === '' || String(c.Status || '').trim() === '') result.clientsMissingFields++;
  });

  return result;
}

// ---------------------------------------------------------------------------
// Report formatting
// ---------------------------------------------------------------------------

function formatPipelineReport_(r) {
  const money = function (v) { return v !== null ? '$' + v : 'Not available from current CRM data'; };
  const lines = [];

  lines.push('RCS PIPELINE INTELLIGENCE — ' + formatScoreDate_(new Date())); // CRM_Scoring.gs
  lines.push('');

  lines.push('PIPELINE OVERVIEW');
  lines.push('Active Pipeline: ' + r.overview.activePipelineCount + ' (of ' + r.overview.totalProspectRows + ' total prospect records)');
  lines.push('Hot: ' + r.overview.hotCount + ' | Warm: ' + r.overview.warmCount + ' | Cold: ' + r.overview.coldCount + ' | Unscored: ' + r.overview.unscoredCount);
  lines.push('Contacted: ' + r.overview.contactedCount + ' | Meetings: ' + r.overview.meetingsCount + ' | Active Proposals: ' + r.overview.activeProposalsCount + ' | Clients: ' + r.overview.clientsCount);
  lines.push('HISTORICAL/CLOSED (excluded from Active Pipeline) — Closed-Lost/Not Interested: ' + r.overview.closedLostCount + ' | Archived: ' + r.overview.archivedCount + ' | Do Not Contact: ' + r.overview.dncCount);
  lines.push('');

  lines.push(r.funnel.available ? 'CONVERSION FUNNEL (' + r.funnel.label + ')' : 'CONVERSION FUNNEL');
  if (!r.funnel.available) {
    lines.push(r.funnel.message);
  } else {
    lines.push(r.funnel.note);
    r.funnel.stages.forEach(function (s) {
      lines.push('  ' + s.name + ': ' + s.count + (s.pctOfTotal !== null ? ' (' + s.pctOfTotal + '% of total)' : ''));
    });
    lines.push('Overall Prospect→Client: ' + (r.funnel.overallConversionPct !== null ? r.funnel.overallConversionPct + '%' : 'N/A'));
    lines.push('Proposal→Client: ' + (r.funnel.proposalToClientPct !== null ? r.funnel.proposalToClientPct + '%' : 'N/A (no proposals on file)'));
    lines.push('Meeting→Proposal: ' + (r.funnel.meetingToProposalPct !== null ? r.funnel.meetingToProposalPct + '%' : 'N/A (no meetings on file)'));
  }
  lines.push('');

  lines.push('PIPELINE VALUE');
  lines.push('Active Proposals: ' + r.value.activeProposalCount + ' totaling ' + money(r.value.activeProposalValue));
  lines.push('Won Revenue (Paid): ' + money(r.value.wonRevenue) + ' | Total Invoiced: ' + money(r.value.totalInvoiced));
  lines.push('Average Won Project Value: ' + money(r.value.avgWonProjectValue) + ' | Closed/Lost Value: ' + money(r.value.closedLostValue));
  lines.push('Won Clients: ' + r.value.wonClientCount);
  lines.push('');

  lines.push('SALES VELOCITY');
  lines.push('Prospect Creation → Client: ' + r.velocity.avgProspectCreationToClientMessage);
  lines.push('Proposal → Client: ' + (r.velocity.avgProposalToClientDays !== null ? r.velocity.avgProposalToClientDays + ' days avg (n=' + r.velocity.avgProposalToClientSampleSize + ')' : 'Insufficient historical date data'));
  lines.push('Average Active Prospect Age: ' + r.velocity.avgActiveProspectAgeMessage);
  lines.push('Average Active Proposal Age: ' + (r.velocity.avgActiveProposalAgeDays !== null ? r.velocity.avgActiveProposalAgeDays + ' days' : 'Insufficient historical date data'));
  lines.push('');

  lines.push('PIPELINE AGING');
  lines.push('Oldest Active Prospects: ' + r.aging.oldestActiveProspects.message);
  lines.push('Overdue Follow-Ups: ' + r.aging.overdueFollowUpCount + ' | Never Contacted (active): ' + r.aging.neverContactedCount + ' | No Contact ' + r.aging.staleContactThresholdDays + '+ Days (active): ' + r.aging.staleContactCount);
  lines.push('Stalled Active Proposals (' + r.aging.staleProposalThresholdDays + '+ days since Sent): ' + r.aging.staleProposals.length);
  lines.push('');

  lines.push('PIPELINE RISKS (top ' + r.risks.length + ')');
  if (r.risks.length === 0) {
    lines.push('No significant pipeline risks detected.');
  } else {
    r.risks.forEach(function (risk, i) {
      lines.push((i + 1) + '. ' + risk.business);
      lines.push('   ' + risk.reason);
      lines.push('   ' + risk.detail);
    });
  }
  lines.push('');

  lines.push('PERFORMANCE BY INDUSTRY (' + r.industry.sortNote + ')');
  if (r.industry.rows.length === 0) {
    lines.push('No industry data on file.');
  } else {
    r.industry.rows.forEach(function (row) {
      const convText = row.sampleTooSmall ? '(sample too small for a reliable %)' : row.conversionPct + '%';
      const revText = row.revenue !== null ? ', $' + row.revenue + ' revenue' : '';
      lines.push(row.industry + ' — ' + row.total + ' prospects, ' + row.clients + ' clients, ' + convText + revText);
    });
  }
  lines.push('');

  lines.push('PERFORMANCE BY LEAD SOURCE');
  lines.push(r.leadSource.message);
  lines.push('');

  lines.push('DATA QUALITY');
  lines.push('Prospects missing Business: ' + r.dataQuality.prospectsMissingBusiness + ' | missing Status: ' + r.dataQuality.prospectsMissingStatus);
  lines.push('Active prospects missing Next Follow Up: ' + r.dataQuality.activeMissingNextFollowUp + ' | missing contact info: ' + r.dataQuality.activeMissingContactInfo);
  lines.push('Proposals missing Sent date or Value: ' + r.dataQuality.proposalsMissingDateOrValue);
  lines.push('Clients missing Start or Status: ' + r.dataQuality.clientsMissingFields);

  return lines.join('\n');
}
