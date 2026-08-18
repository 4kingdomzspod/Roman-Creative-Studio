/**
 * CRM_Outreach.gs
 * ---------------------------------------------------------------------------
 * Turns an existing Website Audits record into a concise, deterministic
 * sales/outreach brief and stores it on the matching Prospects row. No AI
 * API, no external service, no web crawling beyond what CRM_Audits.gs
 * already did — every line of a generated brief is assembled from fields
 * already stored in Website Audits by that sprint's audit engine.
 *
 * "Generate Outreach Brief" and "Generate Brief for Selected Prospect" are
 * two menu labels for the exact same action (both act on whichever
 * Prospects row(s) are selected) — kept as one handler rather than two
 * near-duplicate implementations, per the "no duplicate CRM logic" brief
 * for this sprint.
 *
 * Schema note: CRM_Builder.gs (the normal source of Prospects' header list)
 * is intentionally not touched this sprint, so the "Outreach Brief" column
 * can't be added through the usual SHEET_DEFS/ensureHeaders_ path. Instead
 * this file provisions it itself, additively, the first time a brief is
 * generated — see ensureOutreachBriefColumn_ below.
 */

const OUTREACH_BRIEF_COLUMN = 'Outreach Brief';
const OUTREACH_POSITIVE_THRESHOLD = 70; // category score at/above this counts as a strength

// ---------------------------------------------------------------------------
// Menu entry point
// ---------------------------------------------------------------------------

function menuGenerateOutreachBrief_() {
  const rows = getSelectedProspectRows_(); // CRM_Actions.gs — also covers "wrong sheet" / "nothing selected"
  if (!rows) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const prospects = ss.getSheetByName('Prospects');
  const ui = SpreadsheetApp.getUi();

  ensureOutreachBriefColumn_(prospects);
  const pHeaders = getLiveProspectsHeaders_(prospects);
  const bIdx = pHeaders.indexOf('Business');
  const wIdx = pHeaders.indexOf('Website');
  const briefIdx = pHeaders.indexOf(OUTREACH_BRIEF_COLUMN);

  const targets = [];
  let missingBusiness = 0;
  rows.forEach(function (r) {
    const rowValues = prospects.getRange(r, 1, 1, pHeaders.length).getValues()[0];
    const business = String(rowValues[bIdx] || '').trim();
    if (business === '') { missingBusiness++; return; }
    targets.push({
      row: r,
      business: business,
      website: wIdx !== -1 ? String(rowValues[wIdx] || '').trim() : '',
      existingBrief: String(rowValues[briefIdx] || '').trim()
    });
  });

  if (targets.length === 0) {
    ui.alert('Outreach Brief', 'The selected row(s) don’t have a Business name — nothing to generate.', ui.ButtonSet.OK);
    return;
  }

  const hasExisting = targets.some(function (t) { return t.existingBrief !== ''; });
  if (hasExisting) {
    const question = targets.length === 1
      ? targets[0].business + ' already has an Outreach Brief. Replace it?'
      : 'One or more selected prospects already have an Outreach Brief. Replace existing brief(s)?';
    if (ui.alert('Outreach Brief', question, ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  }

  let generated = 0, missingAudit = 0, incompleteAudit = 0;
  const details = [];

  targets.forEach(function (t) {
    const auditRow = findLatestAuditForBusiness_(t.business, t.website);
    if (!auditRow) {
      missingAudit++;
      details.push(t.business + ': no Website Audit found — run Website Audit first.');
      return;
    }
    if (!isAuditDataComplete_(auditRow)) {
      incompleteAudit++;
      details.push(t.business + ': audit record is incomplete — could not generate a brief.');
      return;
    }

    const brief = buildOutreachBrief_(t.business, t.website, auditRow);
    prospects.getRange(t.row, briefIdx + 1).setValue(brief);
    generated++;
  });

  showOutreachBriefResults_(targets, generated, missingAudit, incompleteAudit, missingBusiness, details);
}

// ---------------------------------------------------------------------------
// Prospects column provisioning (self-contained — see file header note on
// why this doesn't go through CRM_Builder.gs/ensureHeaders_ this sprint)
// ---------------------------------------------------------------------------

// Additive only: appends "Outreach Brief" at the end of the header row if
// it isn't already present under any casing; never reorders or renames an
// existing column, never touches row 2+.
function ensureOutreachBriefColumn_(sheet) {
  const lastCol = sheet.getLastColumn();
  const currentHeaders = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  const hasColumn = currentHeaders.some(function (h) {
    return String(h).trim().toLowerCase() === OUTREACH_BRIEF_COLUMN.toLowerCase();
  });
  if (hasColumn) return;

  const newCol = lastCol + 1;
  sheet.getRange(1, newCol).setValue(OUTREACH_BRIEF_COLUMN);
  // Keep the filter and column width correct for the newly added column —
  // same pattern used after any append elsewhere in this CRM.
  applyBasicFilter_(sheet, newCol); // Code.gs
  autoResizeColumns_(sheet, newCol); // Code.gs
}

// Reads Prospects' actual current header row from the sheet itself, rather
// than the static SHEET_DEFS list (CRM_Builder.gs) — that list doesn't
// know about Outreach Brief since this file adds it independently.
function getLiveProspectsHeaders_(sheet) {
  const lastCol = sheet.getLastColumn();
  if (lastCol === 0) return [];
  return sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) { return String(h).trim(); });
}

// ---------------------------------------------------------------------------
// Reading audit data (read-only — never writes to Website Audits)
// ---------------------------------------------------------------------------

// Website Audits can hold more than one record per business (repeated
// audits are appended, never overwritten — see CRM_Audits.gs). This picks
// the most recent one by Date ('yyyy-mm-dd' sorts correctly as a string).
//
// `website` is optional and only ever consulted as a fallback — every
// existing single-argument call (CRM_CommandCenter.gs, CRM_Scoring.gs) is
// unaffected, since it's `undefined` there and the fallback phase below
// exits immediately for a blank/undefined value, before touching any row.
//
// The fallback exists because "Audit Website URL" (CRM_Audits.gs) isn't
// tied to a Prospects row at all — it saves the audit under a domain-
// derived Business (deriveBusinessNameFromUrl_), which won't match a real
// Prospects.Business string like "Roman Creative Studio". Website Audits
// has no URL column of its own (and this fix doesn't add one), but a
// domain-derived Business value *is* itself a URL-ish string, so comparing
// it against the Prospect's own Website (both reduced to a bare host) finds
// exactly that case — deterministic string comparison only, never fuzzy.
function findLatestAuditForBusiness_(business, website) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Website Audits');
  if (!sheet) return null;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;

  const data = sheet.getRange(2, 1, lastRow - 1, 8).getValues(); // Business,Date,Mobile,SEO,Performance,Accessibility,Score,Notes
  const key = business.trim().toLowerCase();

  const byName = pickLatestAuditRow_(data, function (row) {
    return String(row[0] || '').trim().toLowerCase() === key;
  });
  if (byName) return formatAuditRow_(byName);

  const websiteKey = normalizeAuditUrlKey_(website);
  if (websiteKey === '') return null;

  const byUrl = pickLatestAuditRow_(data, function (row) {
    return normalizeAuditUrlKey_(row[0]) === websiteKey;
  });
  return byUrl ? formatAuditRow_(byUrl) : null;
}

function pickLatestAuditRow_(data, matches) {
  let best = null;
  data.forEach(function (row) {
    if (!matches(row)) return;
    if (!best || String(row[1]) >= String(best[1])) best = row;
  });
  return best;
}

function formatAuditRow_(best) {
  return {
    business: best[0], date: best[1], mobile: best[2], seo: best[3],
    performance: best[4], accessibility: best[5], score: best[6], notes: best[7]
  };
}

// Reduces a URL-ish string to a bare, comparable host: strips http(s)://,
// strips a leading www., then cuts at the first /, ?, or # — handling a
// trailing slash, a path, a query string, and a hash fragment all in the
// same step. Deterministic only; not a real URL parser.
function normalizeAuditUrlKey_(value) {
  let v = String(value || '').trim().toLowerCase();
  if (v === '') return '';
  v = v.replace(/^https?:\/\//, '').replace(/^www\./, '');
  v = v.split(/[/?#]/)[0];
  return v;
}

function isAuditDataComplete_(auditRow) {
  if (!auditRow) return false;
  if (auditRow.score === '' || auditRow.score === null || auditRow.score === undefined) return false;
  if (!auditRow.mobile || !auditRow.seo || !auditRow.performance || !auditRow.accessibility) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Parsing stored audit labels (CRM_Audits.gs's own output formats)
// ---------------------------------------------------------------------------

// "78/100 — title/meta/H1/canonical checks" -> { score: 78, description: '...' }
function parseCategoryLabel_(label) {
  const m = String(label || '').match(/^(\d+)\/100\s*—\s*(.+)$/);
  if (!m) return null;
  return { score: Number(m[1]), description: m[2].trim() };
}

// "PASS — viewport meta found" -> { pass: true, description: '...' }
function parseMobileLabel_(label) {
  const m = String(label || '').match(/^(PASS|FAIL)\s*—\s*(.+)$/i);
  if (!m) return null;
  return { pass: /pass/i.test(m[1]), description: m[2].trim() };
}

// "Opportunities: a; b; c." -> ['a','b','c']; anything else (including the
// "No issues found..." message) -> [] rather than guessing.
function parseOpportunities_(notes) {
  const text = String(notes || '').trim();
  const m = text.match(/^Opportunities:\s*(.+?)\.?\s*$/i);
  if (!m) return [];
  return m[1].split(';').map(function (s) { return s.trim(); }).filter(function (s) { return s !== ''; });
}

// ---------------------------------------------------------------------------
// Brief assembly — every fact below traces directly to a parsed audit
// field; nothing here is invented.
// ---------------------------------------------------------------------------

function buildOutreachBrief_(business, website, auditRow) {
  const issues = parseOpportunities_(auditRow.notes);
  const topIssues = issues.slice(0, 3);

  const mobileParsed = parseMobileLabel_(auditRow.mobile);
  const seoParsed = parseCategoryLabel_(auditRow.seo);
  const performanceParsed = parseCategoryLabel_(auditRow.performance);
  const accessibilityParsed = parseCategoryLabel_(auditRow.accessibility);

  const positives = [];
  if (mobileParsed && mobileParsed.pass) positives.push('Mobile: ' + auditRow.mobile);
  if (seoParsed && seoParsed.score >= OUTREACH_POSITIVE_THRESHOLD) positives.push('SEO: ' + auditRow.seo);
  if (performanceParsed && performanceParsed.score >= OUTREACH_POSITIVE_THRESHOLD) positives.push('Performance: ' + auditRow.performance);
  if (accessibilityParsed && accessibilityParsed.score >= OUTREACH_POSITIVE_THRESHOLD) positives.push('Accessibility: ' + auditRow.accessibility);

  const weakAreas = [];
  if (mobileParsed && !mobileParsed.pass) weakAreas.push('mobile-friendliness');
  if (seoParsed && seoParsed.score < OUTREACH_POSITIVE_THRESHOLD) weakAreas.push('SEO');
  if (performanceParsed && performanceParsed.score < OUTREACH_POSITIVE_THRESHOLD) weakAreas.push('page performance');
  if (accessibilityParsed && accessibilityParsed.score < OUTREACH_POSITIVE_THRESHOLD) weakAreas.push('accessibility');

  const overallFindings = 'Overall Score: ' + auditRow.score + '/100  (Mobile: ' + auditRow.mobile +
    '; SEO: ' + auditRow.seo + '; Performance: ' + auditRow.performance + '; Accessibility: ' + auditRow.accessibility + ')';

  const opening = topIssues.length > 0
    ? 'I took a quick look at your website and noticed ' + joinForSentence_(topIssues) + '.'
    : 'I took a quick look at your website — solid work overall. I wanted to reach out about a couple of small opportunities I noticed.';

  const value = weakAreas.length > 0
    ? 'RCS can help improve your ' + joinForSentence_(weakAreas.slice(0, 2)) + ' so more visitors turn into calls and bookings.'
    : 'RCS can help keep your site performing well as your business grows, with ongoing support and updates.';

  const cta = 'Would you be open to a quick conversation about it?';

  const lines = [
    'OUTREACH BRIEF',
    'Business: ' + business,
    'Website: ' + (website || '(not on file)'),
    'Audit Date: ' + auditRow.date,
    '',
    'OVERALL FINDINGS',
    overallFindings,
    '',
    'TOP ISSUES'
  ];
  if (topIssues.length > 0) {
    topIssues.forEach(function (issue, i) { lines.push((i + 1) + '. ' + issue); });
  } else {
    lines.push('No significant issues found in the audit.');
  }
  lines.push('');
  lines.push('POSITIVE FINDINGS');
  if (positives.length > 0) {
    positives.forEach(function (p) { lines.push('- ' + p); });
  } else {
    lines.push('- No standout strengths identified in this audit.');
  }
  lines.push('');
  lines.push('OPENING');
  lines.push('"' + opening + '"');
  lines.push('');
  lines.push('VALUE');
  lines.push('"' + value + '"');
  lines.push('');
  lines.push('CTA');
  lines.push('"' + cta + '"');

  return lines.join('\n');
}

function joinForSentence_(items) {
  if (items.length === 1) return items[0];
  if (items.length === 2) return items[0] + ' and ' + items[1];
  return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1];
}

// ---------------------------------------------------------------------------
// Results UI
// ---------------------------------------------------------------------------

function showOutreachBriefResults_(targets, generated, missingAudit, incompleteAudit, missingBusiness, details) {
  const ui = SpreadsheetApp.getUi();
  let message;

  if (targets.length === 1 && generated === 1) {
    message = 'Outreach brief generated for ' + targets[0].business + ' and saved to the Outreach Brief column.';
  } else if (targets.length === 1) {
    message = details.length ? details[0] : 'No brief was generated.';
  } else {
    message = 'Generated: ' + generated +
      (missingAudit ? '\nNo audit found: ' + missingAudit : '') +
      (incompleteAudit ? '\nIncomplete audit data: ' + incompleteAudit : '');
    if (details.length) message += '\n\n' + details.slice(0, 10).join('\n');
  }

  if (missingBusiness > 0) {
    message += '\n\n(' + missingBusiness + ' other selected row(s) had no Business name and were skipped.)';
  }

  ui.alert('Outreach Brief', message, ui.ButtonSet.OK);
}
