/**
 * CRM_Health.gs
 * ---------------------------------------------------------------------------
 * CRM Data Quality & Health Audit: "Is the RCS CRM data clean, complete,
 * consistent, and trustworthy?" — a single, read-only report covering
 * completeness, likely duplicates, consistency against Settings, pipeline
 * integrity, staleness, and one deterministic 0-100 CRM Health Score.
 *
 * This is NOT the Sprint 7 Lead Score — it never scores a prospect. It
 * scores the CRM's own data quality, from measurable conditions only.
 *
 * Reuses: buildAnalyticsProspectRecords_ / getSheetRows_ / getDistinctBusinesses_
 * / readField_ / buildDataQuality_ / buildAging_ / ANALYTICS_STALE_DAYS
 * (CRM_Analytics.gs), getLiveProspectsHeaders_ (CRM_Outreach.gs), getHeaders_
 * (CRM_Actions.gs), SETTINGS_LISTS (CRM_Settings.gs). No completeness, aging,
 * or exclusion logic is reimplemented — this file only reads, cross-checks,
 * and scores.
 */

// ---------------------------------------------------------------------------
// Menu entry point
// ---------------------------------------------------------------------------

function openCrmHealthAudit_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const prospects = ss.getSheetByName('Prospects');

  const records = prospects ? buildHealthProspectRecords_(prospects) : [];
  const proposalRows = getSheetRows_(ss, 'Proposals').filter(function (p) { return String(p.Business || '').trim() !== ''; }); // CRM_Analytics.gs
  const clientRows = getSheetRows_(ss, 'Clients').filter(function (c) { return String(c.Business || '').trim() !== ''; }); // CRM_Analytics.gs
  const clientBusinesses = getDistinctBusinesses_(ss, 'Clients'); // CRM_Analytics.gs

  const completeness = buildCompletenessSection_(prospects, ss, records);
  const duplicates = buildDuplicatesSection_(records);
  const consistency = buildConsistencySection_(records, proposalRows, clientRows);
  const integrity = buildIntegritySection_(records, duplicates, clientBusinesses);
  const staleness = buildAging_(records, proposalRows); // CRM_Analytics.gs — direct reuse, not reimplemented

  const score = computeHealthScore_(records, completeness, duplicates, consistency, integrity);
  const fixes = buildPriorityFixes_(completeness, duplicates, consistency, integrity);

  const report = { completeness: completeness, duplicates: duplicates, consistency: consistency, integrity: integrity, staleness: staleness, score: score, fixes: fixes };
  ui.alert('CRM Health', formatHealthReport_(report), ui.ButtonSet.OK);
  return report; // read-only result, useful for tests
}

// ---------------------------------------------------------------------------
// Reading Prospects — extends CRM_Analytics.gs's own record builder (which
// already extends CRM_CommandCenter.gs's) with the raw Website/Phone/Email
// values Health needs for duplicate detection and missing-field checks.
// ---------------------------------------------------------------------------

function buildHealthProspectRecords_(prospects) {
  const base = buildAnalyticsProspectRecords_(prospects); // CRM_Analytics.gs
  if (base.length === 0) return [];

  const headers = getLiveProspectsHeaders_(prospects); // CRM_Outreach.gs
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });
  const lastRow = prospects.getLastRow();
  const data = prospects.getRange(2, 1, lastRow - 1, headers.length).getValues();

  // Aligned by row position, not by Business name — same reasoning as
  // CRM_Analytics.gs's own extension pass just above it in this call chain:
  // duplicate detection specifically needs to handle two rows that share an
  // identical Business name, so a name-keyed lookup here would be exactly
  // backwards for this file's own purpose.
  const extraByRow = [];
  data.forEach(function (row) {
    const business = String(readField_(row, idx, 'Business') || '').trim(); // CRM_Analytics.gs
    if (business === '') return;
    extraByRow.push({
      website: String(readField_(row, idx, 'Website') || '').trim(),
      phone: String(readField_(row, idx, 'Phone') || '').trim(),
      email: String(readField_(row, idx, 'Email') || '').trim()
    });
  });

  return base.map(function (r, i) {
    return Object.assign({}, r, extraByRow[i] || { website: '', phone: '', email: '' });
  });
}

// ---------------------------------------------------------------------------
// Data Completeness
// ---------------------------------------------------------------------------

function buildCompletenessSection_(prospects, ss, records) {
  const base = buildDataQuality_(prospects, ss); // CRM_Analytics.gs — reused, not reimplemented
  const active = records.filter(function (r) { return !r.excluded; });

  const missingIndustry = active.filter(function (r) { return !r.industry; }).length;
  const missingWebsite = active.filter(function (r) { return !r.website; }).length;

  const incomplete = {};
  active.forEach(function (r) {
    const hasIssue = r.statusLower === '' || !r.hasContactInfo || r.nextFollowUpStatus === null;
    if (hasIssue) incomplete[r.business.toLowerCase()] = true;
  });

  return Object.assign({}, base, {
    missingIndustry: missingIndustry,
    missingWebsite: missingWebsite,
    activeProspectCount: active.length,
    incompleteActiveCount: Object.keys(incomplete).length
  });
}

// ---------------------------------------------------------------------------
// Duplicates — deterministic exact-match on normalized identifiers only.
// No fuzzy matching is implemented or claimed.
// ---------------------------------------------------------------------------

function normalizeBusinessKey_(s) { return String(s || '').trim().toLowerCase().replace(/\s+/g, ' '); }

function normalizeDomainKey_(s) {
  let v = String(s || '').trim().toLowerCase();
  if (v === '') return '';
  v = v.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/+$/, '');
  return v;
}

function normalizePhoneKey_(s) { return String(s || '').replace(/\D/g, ''); }
function normalizeEmailKey_(s) { return String(s || '').trim().toLowerCase(); }

const DUPLICATE_MATCH_DIMENSIONS = [
  { label: 'normalized Business name', normalize: normalizeBusinessKey_, getValue: function (r) { return r.business; } },
  { label: 'normalized Website/domain', normalize: normalizeDomainKey_, getValue: function (r) { return r.website; } },
  { label: 'normalized Email', normalize: normalizeEmailKey_, getValue: function (r) { return r.email; } },
  { label: 'normalized Phone', normalize: normalizePhoneKey_, getValue: function (r) { return r.phone; } }
];

function buildDuplicatesSection_(records) {
  const groups = [];

  DUPLICATE_MATCH_DIMENSIONS.forEach(function (dim) {
    const buckets = {};
    records.forEach(function (r) {
      const norm = dim.normalize(dim.getValue(r));
      if (norm === '') return;
      if (!buckets[norm]) buckets[norm] = [];
      buckets[norm].push(r.business);
    });
    Object.keys(buckets).forEach(function (norm) {
      const businesses = buckets[norm];
      if (businesses.length < 2) return;
      groups.push({ reason: dim.label, matchValue: norm, businesses: businesses });
    });
  });

  // Keyed by normalizeBusinessKey_ (not plain .toLowerCase()) so a business
  // affected by two different match dimensions is counted once consistently
  // with how business-name matching itself normalizes (whitespace collapsed).
  const affected = {};
  groups.forEach(function (g) { g.businesses.forEach(function (b) { affected[normalizeBusinessKey_(b)] = true; }); });

  return { groups: groups, affectedCount: Object.keys(affected).length, affectedBusinessesSet: affected };
}

// ---------------------------------------------------------------------------
// Consistency — every "invalid value" check compares against SETTINGS_LISTS,
// the CRM's own source of truth. A blank value is a completeness issue, not
// a consistency one, so it's never flagged here.
// ---------------------------------------------------------------------------

function isInSettingsList_(value, list) {
  const v = String(value || '').trim().toLowerCase();
  if (v === '') return true;
  return list.some(function (item) { return item.toLowerCase() === v; });
}

function buildConsistencySection_(records, proposalRows, clientRows) {
  const invalidStatus = records.filter(function (r) { return !isInSettingsList_(r.status, SETTINGS_LISTS['Lead Status']); }); // CRM_Settings.gs
  const invalidPriority = records.filter(function (r) { return !isInSettingsList_(r.priority, SETTINGS_LISTS['Priority']); });
  const invalidIndustry = records.filter(function (r) { return !isInSettingsList_(r.industry, SETTINGS_LISTS['Industry']); });
  const invalidProposalStatus = proposalRows.filter(function (p) { return !isInSettingsList_(p.Status, SETTINGS_LISTS['Proposal Status']); });
  const invalidClientStatus = clientRows.filter(function (c) { return !isInSettingsList_(c.Status, SETTINGS_LISTS['Project Status']); });
  const malformedEmails = records.filter(function (r) { return r.email && r.email.indexOf('@') === -1; });

  return {
    invalidStatusCount: invalidStatus.length,
    invalidPriorityCount: invalidPriority.length,
    invalidIndustryCount: invalidIndustry.length,
    invalidProposalStatusCount: invalidProposalStatus.length,
    invalidClientStatusCount: invalidClientStatus.length,
    malformedEmailCount: malformedEmails.length,
    totalProspects: records.length,
    totalProposals: proposalRows.length,
    totalClients: clientRows.length
  };
}

// ---------------------------------------------------------------------------
// Pipeline Integrity — only cross-sheet checks the existing schema makes
// reliable (a direct Business-name match), nothing inferred.
// ---------------------------------------------------------------------------

// Statuses that legitimately explain a Prospects record also existing in
// Clients without being flagged as "stale."
const HEALTH_CONVERTED_OK_STATUSES = ['won', 'archived', 'closed — lost', 'closed — not interested'];

function buildIntegritySection_(records, duplicates, clientBusinesses) {
  const active = records.filter(function (r) { return !r.excluded; });

  const noContactInfo = active.filter(function (r) { return !r.hasContactInfo; });
  const noNextAction = active.filter(function (r) { return r.nextFollowUpStatus === null; });
  const overdue = active.filter(function (r) { return r.nextFollowUpStatus === 'past'; });
  const activeDuplicates = active.filter(function (r) { return duplicates.affectedBusinessesSet[r.business.toLowerCase()]; });

  const issueBusinesses = {};
  [noContactInfo, noNextAction, activeDuplicates].forEach(function (list) {
    list.forEach(function (r) { issueBusinesses[r.business.toLowerCase()] = true; });
  });

  // Archived/Do Not Contact prospects that still carry a live Next Follow Up.
  const closedButScheduled = records.filter(function (r) {
    return r.excluded && (r.nextFollowUpStatus === 'past' || r.nextFollowUpStatus === 'today' || r.nextFollowUpStatus === 'future');
  });

  // Prospects that exist in Clients (i.e. were actually converted) but whose
  // Prospects.Status wasn't updated to reflect that (Convert to Client,
  // Sprint 2, never touches Status by design).
  const convertedButStatusStale = records.filter(function (r) {
    return clientBusinesses[r.business.toLowerCase()] && HEALTH_CONVERTED_OK_STATUSES.indexOf(r.statusLower) === -1;
  });

  return {
    activeProspectCount: active.length,
    noContactInfoCount: noContactInfo.length,
    noNextActionCount: noNextAction.length,
    overdueCount: overdue.length,
    activeDuplicateCount: activeDuplicates.length,
    distinctIssueCount: Object.keys(issueBusinesses).length,
    closedButScheduledCount: closedButScheduled.length,
    convertedButStatusStaleCount: convertedButStatusStale.length
  };
}

// ---------------------------------------------------------------------------
// CRM Health Score — 5 equally-weighted categories, each a plain
// issue-rate calculation. No hidden weights, nothing scored on a prospect.
// ---------------------------------------------------------------------------

function scoreFromRate_(issueCount, total) {
  if (total <= 0) return 100; // nothing to evaluate = not penalized
  return Math.max(0, Math.round(100 * (1 - issueCount / total)));
}

function buildFreshnessScore_(records) {
  const active = records.filter(function (r) { return !r.excluded; });
  const stale = {};
  active.forEach(function (r) {
    const isStale = r.nextFollowUpStatus === 'past' || r.daysSinceContact === null ||
      (r.daysSinceContact !== null && r.daysSinceContact > ANALYTICS_STALE_DAYS); // CRM_Analytics.gs
    if (isStale) stale[r.business.toLowerCase()] = true;
  });
  return scoreFromRate_(Object.keys(stale).length, active.length);
}

function computeHealthScore_(records, completeness, duplicates, consistency, integrity) {
  const totalProspects = records.length;
  const activeCount = integrity.activeProspectCount;

  const completenessScore = scoreFromRate_(completeness.incompleteActiveCount, activeCount);
  const duplicateScore = scoreFromRate_(duplicates.affectedCount, totalProspects);

  const consistencyIssues = consistency.invalidStatusCount + consistency.invalidPriorityCount + consistency.invalidIndustryCount +
    consistency.invalidProposalStatusCount + consistency.invalidClientStatusCount;
  const consistencyTotal = consistency.totalProspects + consistency.totalProposals + consistency.totalClients;
  const consistencyScore = scoreFromRate_(consistencyIssues, consistencyTotal);

  const integrityScore = scoreFromRate_(integrity.distinctIssueCount, activeCount);
  const freshnessScore = buildFreshnessScore_(records);

  const overall = Math.round((completenessScore + duplicateScore + consistencyScore + integrityScore + freshnessScore) / 5);

  return {
    overall: overall,
    categories: [
      { name: 'Completeness', score: completenessScore, explain: completeness.incompleteActiveCount + ' of ' + activeCount + ' active prospects missing Status, contact info, or Next Follow Up' },
      { name: 'Duplicate Risk', score: duplicateScore, explain: duplicates.affectedCount + ' of ' + totalProspects + ' prospect records involved in a likely duplicate group' },
      { name: 'Consistency', score: consistencyScore, explain: consistencyIssues + ' invalid field value(s) found across ' + consistencyTotal + ' Prospects/Proposals/Clients records' },
      { name: 'Pipeline Integrity', score: integrityScore, explain: integrity.distinctIssueCount + ' of ' + activeCount + ' active prospects missing contact info, a next action, or in a duplicate group' },
      { name: 'Freshness', score: freshnessScore, explain: 'active prospects overdue, never contacted, or with no contact in ' + ANALYTICS_STALE_DAYS + '+ days' }
    ]
  };
}

// ---------------------------------------------------------------------------
// Priority Fixes — top 10, tiered by impact on active pipeline / downstream
// analytics first, then by affected-record count.
// ---------------------------------------------------------------------------

function buildPriorityFixes_(completeness, duplicates, consistency, integrity) {
  const items = [];
  function add(tier, issue, count, why, action) {
    if (count > 0) items.push({ tier: tier, issue: issue, records: count, why: why, action: action });
  }

  add(1, 'Active prospects with no contact information on file', integrity.noContactInfoCount,
    'These prospects can’t be reached even if prioritized.', 'Add a Phone or Email, or archive if unreachable.');
  add(1, 'Active prospects with an overdue follow-up', integrity.overdueCount,
    'Overdue follow-ups stall the pipeline and skew Pipeline Intelligence.', 'Use Generate Follow-Up Message or Schedule Follow-Up.');
  add(1, 'Active prospects with no Next Follow Up scheduled', integrity.noNextActionCount,
    'Without a scheduled next action, these prospects can silently go cold.', 'Schedule a Next Follow Up for each.');
  add(2, 'Likely duplicate prospect records', duplicates.groups.length,
    'Duplicate records split activity/scoring across multiple rows and distort pipeline counts.', 'Review the listed groups and consolidate manually — CRM Health never merges automatically.');
  add(2, 'Archived/Do Not Contact prospects with a live Next Follow Up still set', integrity.closedButScheduledCount,
    'A scheduled follow-up on a closed prospect risks an unwanted outreach attempt.', 'Clear the Next Follow Up date on these records.');
  add(3, 'Prospects with a Status value not found in Settings', consistency.invalidStatusCount,
    'Invalid Status values break dropdown filtering and counts that key off Settings.', 'Correct the Status to a valid Lead Status value.');
  add(3, 'Prospects with a Priority value not found in Settings', consistency.invalidPriorityCount,
    'Invalid Priority values are excluded from Priority-based scoring and reporting.', 'Correct the Priority to High/Medium/Low.');
  add(3, 'Prospects with an Industry value not found in Settings', consistency.invalidIndustryCount,
    'Invalid Industry values are excluded from Performance by Industry in Pipeline Intelligence.', 'Correct the Industry to a valid Settings value.');
  add(3, 'Proposals with a Status value not found in Settings', consistency.invalidProposalStatusCount,
    'Invalid Proposal Status values are excluded from Pipeline Value calculations.', 'Correct the Status to a valid Proposal Status value.');
  add(3, 'Clients with a Status value not found in Settings', consistency.invalidClientStatusCount,
    'Invalid Client Status values are excluded from analytics that key off Project Status.', 'Correct the Status to a valid Project Status value.');
  add(4, 'Converted prospects whose Status wasn’t updated to reflect it', integrity.convertedButStatusStaleCount,
    'These exist in Clients but still show an open Status, which can double-count them as active pipeline.', 'Update Status to Won (or Archived) once conversion is confirmed.');
  add(4, 'Proposals missing a Sent date or Value', completeness.proposalsMissingDateOrValue,
    'Missing dates/values are excluded from Pipeline Value and Sales Velocity.', 'Fill in the missing Sent date and/or Value.');
  add(4, 'Clients missing Start date or Status', completeness.clientsMissingFields,
    'Missing fields are excluded from client-based analytics.', 'Fill in the missing Start date and/or Status.');
  add(5, 'Prospects missing Industry', completeness.missingIndustry,
    'Missing Industry excludes these prospects from Performance by Industry.', 'Fill in the Industry field.');
  add(5, 'Prospects missing Website', completeness.missingWebsite,
    'A missing Website blocks Website Audit and Outreach Brief generation.', 'Fill in the Website field.');

  items.sort(function (a, b) { return (a.tier - b.tier) || (b.records - a.records); });
  return items.slice(0, 10);
}

// ---------------------------------------------------------------------------
// Report formatting
// ---------------------------------------------------------------------------

function formatHealthReport_(r) {
  const lines = [];
  lines.push('RCS CRM HEALTH AUDIT — ' + formatScoreDate_(new Date())); // CRM_Scoring.gs
  lines.push('');

  lines.push('CRM Health: ' + r.score.overall + '/100');
  r.score.categories.forEach(function (c) {
    lines.push('  ' + c.name + ': ' + c.score + '/100 — ' + c.explain);
  });
  lines.push('');

  lines.push('DATA COMPLETENESS');
  lines.push('Missing Business: ' + r.completeness.prospectsMissingBusiness + ' | Missing Status: ' + r.completeness.prospectsMissingStatus + ' | Missing Industry: ' + r.completeness.missingIndustry + ' | Missing Website: ' + r.completeness.missingWebsite);
  lines.push('Active prospects missing Next Follow Up: ' + r.completeness.activeMissingNextFollowUp + ' | missing contact info: ' + r.completeness.activeMissingContactInfo);
  lines.push('Proposals missing Sent date or Value: ' + r.completeness.proposalsMissingDateOrValue + ' | Clients missing Start or Status: ' + r.completeness.clientsMissingFields);
  lines.push('');

  lines.push('DUPLICATES (' + r.duplicates.groups.length + ' group(s), ' + r.duplicates.affectedCount + ' business(es) affected)');
  if (r.duplicates.groups.length === 0) {
    lines.push('No likely duplicates detected.');
  } else {
    r.duplicates.groups.forEach(function (g) {
      lines.push('  Matched by ' + g.reason + ': ' + g.businesses.join(', '));
    });
  }
  lines.push('');

  lines.push('CONSISTENCY (vs. Settings)');
  lines.push('Invalid Status: ' + r.consistency.invalidStatusCount + ' | Invalid Priority: ' + r.consistency.invalidPriorityCount + ' | Invalid Industry: ' + r.consistency.invalidIndustryCount);
  lines.push('Invalid Proposal Status: ' + r.consistency.invalidProposalStatusCount + ' | Invalid Client Status: ' + r.consistency.invalidClientStatusCount + ' | Malformed Email (no @): ' + r.consistency.malformedEmailCount);
  lines.push('');

  lines.push('PIPELINE INTEGRITY');
  lines.push('No contact info: ' + r.integrity.noContactInfoCount + ' | No next action: ' + r.integrity.noNextActionCount + ' | Overdue: ' + r.integrity.overdueCount + ' | In a duplicate group: ' + r.integrity.activeDuplicateCount);
  lines.push('Closed/Archived but still scheduled: ' + r.integrity.closedButScheduledCount + ' | Converted but Status stale: ' + r.integrity.convertedButStatusStaleCount);
  lines.push('');

  lines.push('STALE DATA');
  lines.push('Oldest Active Prospects: ' + r.staleness.oldestActiveProspects.message);
  lines.push('Overdue Follow-Ups: ' + r.staleness.overdueFollowUpCount + ' | Never Contacted: ' + r.staleness.neverContactedCount + ' | No Contact ' + r.staleness.staleContactThresholdDays + '+ Days: ' + r.staleness.staleContactCount);
  lines.push('Stalled Active Proposals (' + r.staleness.staleProposalThresholdDays + '+ days since Sent): ' + r.staleness.staleProposals.length);
  lines.push('');

  lines.push('PRIORITY FIXES (top ' + r.fixes.length + ')');
  if (r.fixes.length === 0) {
    lines.push('No significant data-quality issues found.');
  } else {
    r.fixes.forEach(function (f, i) {
      lines.push((i + 1) + '. ' + f.issue);
      lines.push('   Records: ' + f.records);
      lines.push('   Why it matters: ' + f.why);
      lines.push('   Recommended action: ' + f.action);
    });
  }

  return lines.join('\n');
}
