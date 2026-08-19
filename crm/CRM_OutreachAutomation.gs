/**
 * CRM_OutreachAutomation.gs
 * ---------------------------------------------------------------------------
 * Sprint 13A — Automated Outreach Preparation Engine (prep only, never send).
 *
 * Pipeline for one selected Prospects row:
 *   Prospect -> Tavily research -> existing Website Audit (reused, not
 *   duplicated) -> Gemini analysis of research+audit+CRM context ->
 *   Outreach Research / Outreach Angle / Outreach Message saved to
 *   Prospects, status READY_FOR_REVIEW. Nothing is ever sent anywhere —
 *   every result dialog says so explicitly, and no send/email API is
 *   called anywhere in this file.
 *
 * Reuses: getSelectedProspectRows_ (CRM_Actions.gs), getLiveProspectsHeaders_
 * / findLatestAuditForBusiness_ / OUTREACH_BRIEF_COLUMN (CRM_Outreach.gs),
 * normalizeUrl_ / performAndSaveAudit_ (CRM_Audits.gs) for the Website Audit
 * step — no audit/scoring/matching logic is reimplemented here.
 * ensureHeaders_ / applyBasicFilter_ / autoResizeColumns_ (Code.gs) provision
 * this sprint's five new Prospects columns the same additive, self-contained
 * way Sprint 5's Outreach Brief and Sprint 7's Score columns were — see
 * ensureOutreachAutomationColumns_ below. CRM_Builder.gs is not touched.
 *
 * API keys: read only from Script Properties (TAVILY_API_KEY,
 * GEMINI_API_KEY) via getOutreachAutomationConfig_(). A key is never
 * written to a log, an alert, a sheet cell, or a returned error message —
 * every network call/error path below was written to only ever surface a
 * plain status word ("Configured"/"Missing") or a generic failure message,
 * never the key value or the raw request.
 */

const OUTREACH_AUTOMATION_FIELDS = [
  'Outreach Research', 'Outreach Angle', 'Outreach Message',
  'Outreach Prepared At', 'Outreach Preparation Status'
];

const OUTREACH_AUTOMATION_STATES = {
  NOT_READY: 'NOT_READY',
  RESEARCHING: 'RESEARCHING',
  AUDITING: 'AUDITING',
  GENERATING: 'GENERATING',
  READY: 'READY_FOR_REVIEW',
  FAILED: 'FAILED'
};

// A prospect in one of these states (by Status, case-insensitive) or with
// an Archived Date on file is never prepared for outreach — same style of
// per-sprint exclusion list as CRM_CommandCenter.gs's
// HOT_ACTION_EXCLUDED_STATUSES / CRM_Scoring.gs's SCORE_EXCLUDED_STATUSES,
// sized to what this specific workflow needs (a closed-lost or declined
// prospect should never get a freshly generated outreach message).
const OUTREACH_AUTOMATION_EXCLUDED_STATUSES = ['archived', 'do not contact', 'closed — lost', 'closed — not interested'];

const TAVILY_SEARCH_URL = 'https://api.tavily.com/search';
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_GENERATE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent';

// ---------------------------------------------------------------------------
// Menu entry points
// ---------------------------------------------------------------------------

function menuPrepareSelectedProspect_() {
  prepareSelectedProspect_(true);
}

function menuOutreachAutomationStatus_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  ui.alert('Outreach Automation Status', formatOutreachAutomationStatus_(ss), ui.ButtonSet.OK);
}

function menuConfigureApiStatus_() {
  const ui = SpreadsheetApp.getUi();
  ui.alert('Configure API Status', formatApiConfigStatus_(), ui.ButtonSet.OK);
}

// ---------------------------------------------------------------------------
// Configuration — keys read only from Script Properties, never persisted
// or displayed anywhere by this file.
// ---------------------------------------------------------------------------

function getOutreachAutomationConfig_() {
  const props = PropertiesService.getScriptProperties();
  return {
    tavilyKey: String(props.getProperty('TAVILY_API_KEY') || '').trim(),
    geminiKey: String(props.getProperty('GEMINI_API_KEY') || '').trim()
  };
}

function formatApiConfigStatus_() {
  const config = getOutreachAutomationConfig_();
  return 'Tavily: ' + (config.tavilyKey ? 'Configured' : 'Missing') +
    '\nGemini: ' + (config.geminiKey ? 'Configured' : 'Missing') +
    '\n\nKeys are read from Script Properties (Project Settings > Script Properties) and are never shown here or anywhere else.';
}

// ---------------------------------------------------------------------------
// Main workflow — exactly one selected Prospects row.
// ---------------------------------------------------------------------------

// interactive=true shows UI alerts/confirmations (menu use); interactive=false
// (available for future non-interactive callers/tests) suppresses alerts and
// treats any confirmation as declined-by-default for safety. Always returns
// a plain result object, useful for tests.
function prepareSelectedProspect_(interactive) {
  const ui = SpreadsheetApp.getUi();
  const rows = getSelectedProspectRows_(); // CRM_Actions.gs — also covers "wrong sheet" / "nothing selected"
  if (!rows) return { ok: false, message: 'No usable selection.' };

  if (rows.length !== 1) {
    const message = 'Select exactly one Prospects row to prepare outreach for (selected: ' + rows.length + ').';
    if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
    return { ok: false, message: message };
  }

  const config = getOutreachAutomationConfig_();
  const missingKeys = [];
  if (!config.tavilyKey) missingKeys.push('TAVILY_API_KEY');
  if (!config.geminiKey) missingKeys.push('GEMINI_API_KEY');
  if (missingKeys.length > 0) {
    const message = 'Outreach preparation needs ' + missingKeys.join(' and ') +
      ' set in Script Properties (Project Settings > Script Properties) first. No prospect data was changed.';
    if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
    return { ok: false, message: message };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const prospects = ss.getSheetByName('Prospects');
  const row = rows[0];

  ensureOutreachAutomationColumns_(prospects);
  const headers = getLiveProspectsHeaders_(prospects); // CRM_Outreach.gs
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });
  const rowValues = prospects.getRange(row, 1, 1, headers.length).getValues()[0];
  function field(name) { return idx[name] !== undefined ? rowValues[idx[name]] : ''; }

  const business = String(field('Business') || '').trim();
  if (business === '') {
    const message = 'The selected row has no Business name — nothing to prepare.';
    if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
    return { ok: false, message: message };
  }

  const status = String(field('Status') || '').trim();
  const archivedDate = field('Archived Date');
  if (isExcludedFromOutreachAutomation_(status, archivedDate)) {
    const message = business + ' is ' + (status || 'Archived') + ' — not eligible for outreach preparation.';
    if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
    return { ok: false, message: message };
  }

  const website = String(field('Website') || '').trim();
  if (website === '') {
    const message = business + ' has no Website on file — a Website is required to prepare outreach.';
    if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
    return { ok: false, message: message };
  }

  const existingBrief = String(field(OUTREACH_BRIEF_COLUMN) || '').trim(); // CRM_Outreach.gs — read-only, never overwritten by this file
  const existingResearch = String(field('Outreach Research') || '').trim();
  const existingMessage = String(field('Outreach Message') || '').trim();
  const existingStatus = String(field('Outreach Preparation Status') || '').trim();

  const alreadyReady = existingStatus === OUTREACH_AUTOMATION_STATES.READY;
  const hasPriorOutput = existingMessage !== '';
  if (alreadyReady || hasPriorOutput) {
    const question = business + ' already has a prepared outreach message' +
      (alreadyReady ? ' (READY_FOR_REVIEW)' : '') + '. Regenerate and overwrite it?';
    const confirmed = interactive ? (ui.alert('Outreach Automation', question, ui.ButtonSet.YES_NO) === ui.Button.YES) : false;
    if (!confirmed) {
      const message = 'Kept the existing prepared outreach for ' + business + ' — nothing was changed.';
      if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
      return { ok: false, message: message, skipped: true };
    }
  }

  function setField(name, value) {
    if (idx[name] === undefined) return;
    prospects.getRange(row, idx[name] + 1).setValue(value);
  }
  function setStatus(state) { setField('Outreach Preparation Status', state); }

  // Stage 1 — Tavily research. Reused if a prior run already gathered it
  // and the field is still blank never happened, but reuse is only safe
  // when we're re-running after a later-stage failure — a full regenerate
  // (confirmed above) always re-researches, since the whole point of
  // "regenerate" is a fresh pass.
  let researchText = existingResearch;
  const canReuseResearch = !hasPriorOutput && !alreadyReady && existingResearch !== '' && existingStatus === OUTREACH_AUTOMATION_STATES.FAILED;
  if (!canReuseResearch) {
    setStatus(OUTREACH_AUTOMATION_STATES.RESEARCHING);
    const research = callTavilySearch_(config.tavilyKey, business, website);
    if (!research.ok) {
      setStatus(OUTREACH_AUTOMATION_STATES.FAILED);
      const message = business + ': research step failed — ' + research.message;
      if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
      return { ok: false, message: message, stage: 'RESEARCHING' };
    }
    researchText = formatResearchSummary_(research);
    setField('Outreach Research', researchText);
  }

  // Stage 2 — Website Audit: reuse Sprint 5's lookup; only run a fresh audit
  // (CRM_Audits.gs, unchanged) if none is found yet.
  setStatus(OUTREACH_AUTOMATION_STATES.AUDITING);
  const auditResult = getOrRunWebsiteAudit_(business, website);
  if (!auditResult.ok) {
    setStatus(OUTREACH_AUTOMATION_STATES.FAILED);
    const message = business + ': Website Audit step failed — ' + auditResult.message + ' Outreach cannot be marked ready without a successful audit.';
    if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
    return { ok: false, message: message, stage: 'AUDITING' };
  }

  // Stage 3 — Gemini analysis of research + audit + CRM context.
  setStatus(OUTREACH_AUTOMATION_STATES.GENERATING);
  const industry = String(field('Industry') || '').trim();
  const city = String(field('City') || '').trim();
  const priority = String(field('Priority') || '').trim();
  const analysis = callGeminiAnalysis_(config.geminiKey, {
    business: business, website: website, industry: industry, city: city,
    priority: priority, status: status, existingBrief: existingBrief,
    research: researchText, audit: auditResult.audit
  });
  if (!analysis.ok) {
    setStatus(OUTREACH_AUTOMATION_STATES.FAILED);
    const message = business + ': analysis/message generation step failed — ' + analysis.message;
    if (interactive) ui.alert('Outreach Automation', message, ui.ButtonSet.OK);
    return { ok: false, message: message, stage: 'GENERATING' };
  }

  // Stage 4 — save + READY_FOR_REVIEW. Only these fields are written; every
  // other Prospects column (including the unrelated Sprint 5 Outreach Brief
  // and Sprint 7 scoring columns) is left exactly as it was.
  setField('Outreach Angle', analysis.outreachAngle);
  setField('Outreach Message', analysis.outreachMessage);
  setField('Outreach Prepared At', new Date());
  if (idx['Outreach Prepared At'] !== undefined) {
    prospects.getRange(row, idx['Outreach Prepared At'] + 1).setNumberFormat('yyyy-mm-dd hh:mm');
  }
  setStatus(OUTREACH_AUTOMATION_STATES.READY);

  const result = {
    ok: true,
    business: business,
    website: website,
    research: researchText,
    outreachAngle: analysis.outreachAngle,
    outreachMessage: analysis.outreachMessage,
    auditRanNew: auditResult.ranNew,
    status: OUTREACH_AUTOMATION_STATES.READY
  };
  if (interactive) ui.alert('Outreach Automation — Ready for Review', formatPreparationResult_(result), ui.ButtonSet.OK);
  return result;
}

function isExcludedFromOutreachAutomation_(status, archivedDate) {
  const statusKey = String(status || '').trim().toLowerCase();
  return OUTREACH_AUTOMATION_EXCLUDED_STATUSES.indexOf(statusKey) !== -1 || String(archivedDate || '').trim() !== '';
}

// ---------------------------------------------------------------------------
// Prospects column provisioning — additive only, same pattern as Sprint 5's
// ensureOutreachBriefColumn_ / Sprint 7's ensureScoreColumns_: reuse Code.gs's
// own ensureHeaders_ rather than touching CRM_Builder.gs's schema list.
// ---------------------------------------------------------------------------

function ensureOutreachAutomationColumns_(sheet) {
  ensureHeaders_(sheet, OUTREACH_AUTOMATION_FIELDS); // Code.gs
  const lastCol = sheet.getLastColumn();
  applyBasicFilter_(sheet, lastCol); // Code.gs
  autoResizeColumns_(sheet, lastCol); // Code.gs
}

// ---------------------------------------------------------------------------
// Website Audit reuse — never reimplements auditUrl_/scoring; only decides
// whether a fresh audit needs to run before reading it back.
// ---------------------------------------------------------------------------

function getOrRunWebsiteAudit_(business, website) {
  const found = findLatestAuditForBusiness_(business, website); // CRM_Outreach.gs — Sprint 5's two-argument fallback
  if (found) return { ok: true, audit: found, ranNew: false };

  const normalized = normalizeUrl_(website); // CRM_Audits.gs
  if (!normalized) {
    return { ok: false, message: 'The Website on file ("' + website + '") is not a usable URL.' };
  }

  const audit = performAndSaveAudit_(business, normalized); // CRM_Audits.gs — unchanged, runs + saves
  if (!audit.ok) {
    return { ok: false, message: audit.message };
  }

  const refetched = findLatestAuditForBusiness_(business, website);
  if (!refetched) {
    return { ok: false, message: 'Website Audit completed but the saved record could not be re-read.' };
  }
  return { ok: true, audit: refetched, ranNew: true };
}

// ---------------------------------------------------------------------------
// Tavily research (isolated provider call)
// ---------------------------------------------------------------------------

function callTavilySearch_(apiKey, business, website) {
  try {
    const query = business + ' ' + normalizeAuditUrlKey_(website); // CRM_Outreach.gs — bare host, no protocol noise
    const payload = {
      api_key: apiKey,
      query: query.trim(),
      search_depth: 'basic',
      max_results: 5,
      include_answer: true
    };
    const response = UrlFetchApp.fetch(TAVILY_SEARCH_URL, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    const code = response.getResponseCode();
    if (code === 401 || code === 403) return { ok: false, message: 'Tavily rejected the request — check TAVILY_API_KEY.' };
    if (code < 200 || code >= 300) return { ok: false, message: 'Tavily research failed (HTTP ' + code + ').' };

    const data = JSON.parse(response.getContentText());
    const results = (data.results || []).slice(0, 5).map(function (r) {
      return { title: String(r.title || '').trim(), url: String(r.url || '').trim(), content: String(r.content || '').trim().slice(0, 500) };
    });
    return { ok: true, answer: String(data.answer || '').trim(), results: results };
  } catch (e) {
    return { ok: false, message: 'Tavily research error: ' + describeOutreachApiError_(e) };
  }
}

function formatResearchSummary_(research) {
  const lines = [];
  if (research.answer) lines.push(research.answer);
  research.results.forEach(function (r) {
    if (!r.title && !r.content) return;
    lines.push('- ' + (r.title || r.url) + (r.content ? ': ' + r.content : ''));
  });
  return lines.length > 0 ? lines.join('\n') : 'No research results were returned.';
}

// ---------------------------------------------------------------------------
// Gemini analysis (isolated provider call) — combines research + audit +
// CRM context into JSON so results can be parsed deterministically; the
// prompt explicitly forbids inventing anything not present in the inputs.
// ---------------------------------------------------------------------------

function callGeminiAnalysis_(apiKey, context) {
  try {
    const prompt = buildGeminiPrompt_(context);
    const payload = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.4 }
    };
    const response = UrlFetchApp.fetch(GEMINI_GENERATE_URL, {
      method: 'post',
      contentType: 'application/json',
      headers: { 'x-goog-api-key': apiKey }, // header, not query string — never lands in a URL that could be logged
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    const code = response.getResponseCode();
    if (code === 401 || code === 403) return { ok: false, message: 'Gemini rejected the request — check GEMINI_API_KEY.' };
    if (code < 200 || code >= 300) return { ok: false, message: 'Gemini analysis failed (HTTP ' + code + ').' };

    const data = JSON.parse(response.getContentText());
    const candidates = data.candidates || [];
    const textPart = candidates.length > 0 && candidates[0].content && candidates[0].content.parts && candidates[0].content.parts[0]
      ? candidates[0].content.parts[0].text
      : '';
    if (!textPart) return { ok: false, message: 'Gemini returned no content.' };

    let parsed;
    try {
      parsed = JSON.parse(textPart);
    } catch (parseErr) {
      return { ok: false, message: 'Gemini response was not valid JSON — could not safely use it.' };
    }

    const researchSummary = String(parsed.researchSummary || '').trim();
    const outreachAngle = String(parsed.outreachAngle || '').trim();
    const outreachMessage = String(parsed.outreachMessage || '').trim();
    if (!outreachAngle || !outreachMessage) {
      return { ok: false, message: 'Gemini response was missing required fields.' };
    }

    return { ok: true, researchSummary: researchSummary, outreachAngle: outreachAngle, outreachMessage: outreachMessage };
  } catch (e) {
    return { ok: false, message: 'Gemini analysis error: ' + describeOutreachApiError_(e) };
  }
}

function buildGeminiPrompt_(context) {
  const audit = context.audit;
  const lines = [
    'You are helping a web design agency (Roman Creative Studio) prepare a personalized, factual outreach message to a prospective client.',
    'Use ONLY the facts given below. Do not invent, assume, or fabricate any statistic, metric, service, client, result, or claim that is not explicitly present in the data below. If there is not enough information for a strong angle, say so plainly rather than inventing detail.',
    '',
    'BUSINESS: ' + context.business,
    'WEBSITE: ' + context.website,
    'INDUSTRY: ' + (context.industry || '(not on file)'),
    'CITY: ' + (context.city || '(not on file)'),
    'PRIORITY: ' + (context.priority || '(not on file)'),
    'CRM STATUS: ' + (context.status || '(not on file)'),
    '',
    'WEBSITE AUDIT (already measured, not to be re-derived):',
    'Overall Score: ' + audit.score + '/100',
    'Mobile: ' + audit.mobile,
    'SEO: ' + audit.seo,
    'Performance: ' + audit.performance,
    'Accessibility: ' + audit.accessibility,
    'Audit Notes: ' + audit.notes,
    '',
    'RESEARCH (from web search, already gathered):',
    context.research || '(no research results)',
    ''
  ];
  if (context.existingBrief) {
    lines.push('EXISTING DETERMINISTIC OUTREACH BRIEF (for reference only, do not just repeat it verbatim):');
    lines.push(context.existingBrief);
    lines.push('');
  }
  lines.push('Respond with ONLY a JSON object with exactly these three string fields, no other text:');
  lines.push('{"researchSummary": "2-4 sentence summary of what the research above says about this business", ' +
    '"outreachAngle": "1-2 sentence description of the single most relevant, factual reason to reach out now", ' +
    '"outreachMessage": "a short, personalized outreach message (under 150 words) a salesperson could send as-is — it must NOT be sent automatically by anything, it is for human review only"}');
  return lines.join('\n');
}

function describeOutreachApiError_(e) {
  // Deliberately generic: never echoes request/response bodies or headers,
  // which is where an API key could otherwise leak into a returned string.
  const msg = String((e && e.message) || e);
  if (/timeout/i.test(msg)) return 'the request timed out.';
  if (/dns|address|resolve|unknown host/i.test(msg)) return 'could not resolve the API host.';
  if (/ssl|certificate/i.test(msg)) return 'SSL/certificate error while connecting.';
  if (/refused|unreachable|connect/i.test(msg)) return 'connection failed.';
  return 'a network error occurred.';
}

// ---------------------------------------------------------------------------
// Results UI
// ---------------------------------------------------------------------------

function formatPreparationResult_(r) {
  return 'Business: ' + r.business +
    '\nWebsite: ' + r.website +
    (r.auditRanNew ? '\n(A new Website Audit was run as part of this preparation.)' : '') +
    '\n\nRESEARCH SUMMARY\n' + truncateForDialog_(r.research, 600) +
    '\n\nOUTREACH ANGLE\n' + r.outreachAngle +
    '\n\nOUTREACH MESSAGE (draft — for review only)\n' + r.outreachMessage +
    '\n\nStatus: READY_FOR_REVIEW — NOT SENT. This message has been saved to Prospects for human review only; nothing has been sent to ' + r.business + ' or anyone else.';
}

function truncateForDialog_(text, maxChars) {
  const s = String(text || '');
  return s.length > maxChars ? s.slice(0, maxChars) + '…' : s;
}

// Reads Outreach Preparation Status across every Prospects row (dynamic
// header lookup, no fixed column index) and reports counts per state plus
// current API configuration — a broader operational view than "Configure
// API Status", which reports only the two key states.
function formatOutreachAutomationStatus_(ss) {
  const config = getOutreachAutomationConfig_();
  const lines = [
    'Tavily: ' + (config.tavilyKey ? 'Configured' : 'Missing'),
    'Gemini: ' + (config.geminiKey ? 'Configured' : 'Missing'),
    ''
  ];

  const prospects = ss.getSheetByName('Prospects');
  const lastRow = prospects ? prospects.getLastRow() : 0;
  if (!prospects || lastRow < 2) {
    lines.push('No prospects on file yet.');
    return lines.join('\n');
  }

  const headers = getLiveProspectsHeaders_(prospects); // CRM_Outreach.gs
  const statusIdx = headers.indexOf('Outreach Preparation Status');
  if (statusIdx === -1) {
    lines.push('No prospect has had outreach preparation run yet.');
    return lines.join('\n');
  }

  const bIdx = headers.indexOf('Business');
  const data = prospects.getRange(2, 1, lastRow - 1, headers.length).getValues();
  const counts = {};
  Object.keys(OUTREACH_AUTOMATION_STATES).forEach(function (k) { counts[OUTREACH_AUTOMATION_STATES[k]] = 0; });
  let notStarted = 0;

  data.forEach(function (row) {
    const business = bIdx !== -1 ? String(row[bIdx] || '').trim() : '';
    if (business === '') return;
    const state = String(row[statusIdx] || '').trim();
    if (state === '' || counts[state] === undefined) { notStarted++; return; }
    counts[state]++;
  });

  lines.push('Ready for Review: ' + counts[OUTREACH_AUTOMATION_STATES.READY]);
  lines.push('Failed: ' + counts[OUTREACH_AUTOMATION_STATES.FAILED]);
  lines.push('In progress (Researching/Auditing/Generating): ' +
    (counts[OUTREACH_AUTOMATION_STATES.RESEARCHING] + counts[OUTREACH_AUTOMATION_STATES.AUDITING] + counts[OUTREACH_AUTOMATION_STATES.GENERATING]));
  lines.push('Not yet prepared: ' + notStarted);
  return lines.join('\n');
}
