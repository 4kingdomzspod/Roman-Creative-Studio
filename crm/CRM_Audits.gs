/**
 * CRM_Audits.gs
 * ---------------------------------------------------------------------------
 * Website Audit: fetches one page (plus robots.txt/sitemap.xml and up to a
 * handful of internal links), runs a set of checks that can genuinely be
 * verified from what was fetched, and logs a scored row to Website Audits.
 *
 * This is explicitly NOT a Lighthouse/PageSpeed run, a real mobile-render
 * test, or an accessibility-compliance audit. Every check below is either a
 * direct read of the fetched HTML/HTTP response, or a plainly-labeled
 * heuristic (page size, fetch duration) — nothing here claims to measure
 * something it didn't actually measure. See crm/README.md for the full
 * "what is / isn't measured" breakdown.
 */

// Safety limits — one primary page fetch + a few lightweight checks, never
// a crawl. AUDIT_MAX_LINK_CHECKS caps how many same-origin links (found on
// the fetched page) get an extra status check; AUDIT_MAX_HTML_CHARS caps
// how much of a very large page is actually scanned by the regex checks
// (the true page size used for the Performance heuristic is measured
// before this truncation).
const AUDIT_MAX_LINK_CHECKS = 5;
const AUDIT_MAX_HTML_CHARS = 500000;

// Overall-score category weights. Documented here and in crm/README.md —
// changing them changes what "the score" means, so they're not buried.
const AUDIT_WEIGHTS = { mobile: 0.25, seo: 0.35, performance: 0.20, accessibility: 0.20 };

// ---------------------------------------------------------------------------
// Menu entry points
// ---------------------------------------------------------------------------

function menuAuditSelectedProspect_() {
  const rows = getSelectedProspectRows_(); // CRM_Actions.gs
  if (!rows) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const prospects = ss.getSheetByName('Prospects');
  const pHeaders = getHeaders_('Prospects'); // CRM_Actions.gs
  const bIdx = pHeaders.indexOf('Business');
  const wIdx = pHeaders.indexOf('Website');

  const ui = SpreadsheetApp.getUi();
  const candidates = [];
  rows.forEach(function (r) {
    const rowValues = prospects.getRange(r, 1, 1, pHeaders.length).getValues()[0];
    const business = String(rowValues[bIdx] || '').trim();
    const website = String(rowValues[wIdx] || '').trim();
    if (business !== '' && website !== '') candidates.push({ business: business, website: website });
  });
  const skippedNoUrl = rows.length - candidates.length;

  if (candidates.length === 0) {
    ui.alert('Website Audit', 'None of the selected row(s) have both a Business name and a Website — nothing to audit.', ui.ButtonSet.OK);
    return;
  }

  const question = candidates.length === 1
    ? 'Audit ' + candidates[0].business + ' (' + candidates[0].website + ')?'
    : 'Audit ' + candidates.length + ' selected prospects’ websites?';
  if (ui.alert('Website Audit', question, ui.ButtonSet.YES_NO) !== ui.Button.YES) return;

  const results = candidates.map(function (c) {
    const normalized = normalizeUrl_(c.website);
    if (!normalized) {
      return { ok: false, business: c.business, url: c.website, message: 'That doesn’t look like a usable website URL.' };
    }
    const audit = performAndSaveAudit_(c.business, normalized);
    audit.business = c.business;
    audit.url = normalized;
    return audit;
  });

  showAuditResults_(results, skippedNoUrl);
}

function menuAuditWebsiteUrl_() {
  const html = HtmlService.createHtmlOutput(AUDIT_URL_DIALOG_HTML).setWidth(460).setHeight(420);
  SpreadsheetApp.getUi().showModalDialog(html, 'Audit Website URL');
}

// Called from the dialog via google.script.run.
function runUrlAudit_(rawUrl) {
  const normalized = normalizeUrl_(rawUrl);
  if (!normalized) {
    return { ok: false, message: 'That doesn’t look like a usable website URL.' };
  }

  const business = deriveBusinessNameFromUrl_(normalized);
  const audit = performAndSaveAudit_(business, normalized);
  audit.business = business;
  audit.url = normalized;
  return audit;
}

// ---------------------------------------------------------------------------
// URL handling
// ---------------------------------------------------------------------------

// Adds https:// when no protocol is given, and rejects anything that isn't
// a plausible http/https URL (including other protocols like ftp:// or
// mailto: — those get rejected outright rather than mangled).
function normalizeUrl_(input) {
  let url = String(input || '').trim();
  if (url === '') return null;

  // Matches ANY "scheme:" prefix, not just ones using "//" — mailto: and
  // tel: don't use "//" the way http:// and ftp:// do, so checking only
  // for "scheme://" would miss them and let them get "https://" prepended
  // (mangling "mailto:foo@x.com" into a bogus-but-regex-passing URL).
  const schemeMatch = url.match(/^([a-z][a-z0-9+.-]*):/i);
  if (schemeMatch) {
    const scheme = schemeMatch[1].toLowerCase();
    if (scheme !== 'http' && scheme !== 'https') return null;
  } else {
    url = 'https://' + url;
  }

  if (!/^https?:\/\/[^\s/]+\.[^\s/]+/i.test(url)) return null;
  return url;
}

function getOrigin_(url) {
  const m = url.match(/^(https?:\/\/[^/]+)/i);
  return m ? m[1] : url;
}

function deriveBusinessNameFromUrl_(url) {
  const m = url.match(/^https?:\/\/(?:www\.)?([^/]+)/i);
  return m ? m[1] : url;
}

// ---------------------------------------------------------------------------
// Fetching (every network call is try/catch'd — a fetch failure anywhere
// here becomes a clear result, never an uncaught exception)
// ---------------------------------------------------------------------------

function fetchAuditPage_(url) {
  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
    return { ok: true, code: response.getResponseCode(), text: response.getContentText() };
  } catch (e) {
    return { ok: false, message: describeAuditFetchError_(e) };
  }
}

function checkAuxiliaryUrl_(url) {
  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
    const code = response.getResponseCode();
    return { reachable: code >= 200 && code < 400 };
  } catch (e) {
    return { reachable: false };
  }
}

function checkBrokenLinks_(links) {
  let broken = 0;
  links.forEach(function (link) {
    try {
      const response = UrlFetchApp.fetch(link, { muteHttpExceptions: true, followRedirects: true });
      if (response.getResponseCode() >= 400) broken++;
    } catch (e) {
      broken++; // unreachable counts as broken for this heuristic
    }
  });
  return broken;
}

function describeAuditFetchError_(e) {
  const msg = String((e && e.message) || e);
  if (/timeout/i.test(msg)) return 'The site took too long to respond (timeout).';
  if (/dns|address|resolve|unknown host/i.test(msg)) return 'Could not resolve the domain — check the URL is correct.';
  if (/ssl|certificate/i.test(msg)) return 'SSL/certificate error while connecting to the site.';
  if (/refused|unreachable|connect/i.test(msg)) return 'Connection failed — the site appears to be unreachable.';
  return 'Network error while fetching the site: ' + msg;
}

// ---------------------------------------------------------------------------
// HTML checks — plain string/regex reads of the fetched markup. No DOM
// parser is available in Apps Script, so these are pattern matches, not a
// real parse tree; good enough for presence/absence/count checks, which is
// all any of these claim to answer.
// ---------------------------------------------------------------------------

function extractTitle_(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!m) return null;
  const text = m[1].replace(/\s+/g, ' ').trim();
  return text === '' ? null : text;
}

function extractMetaContent_(html, name) {
  const re1 = new RegExp('<meta[^>]+name=["\']' + name + '["\'][^>]*content=["\']([^"\']*)["\']', 'i');
  const re2 = new RegExp('<meta[^>]+content=["\']([^"\']*)["\'][^>]*name=["\']' + name + '["\']', 'i');
  const m = html.match(re1) || html.match(re2);
  return m ? m[1] : null;
}

function extractOgContent_(html, prop) {
  const re1 = new RegExp('<meta[^>]+property=["\']og:' + prop + '["\'][^>]*content=["\']([^"\']*)["\']', 'i');
  const re2 = new RegExp('<meta[^>]+content=["\']([^"\']*)["\'][^>]*property=["\']og:' + prop + '["\']', 'i');
  const m = html.match(re1) || html.match(re2);
  return m ? m[1] : null;
}

function hasViewportMeta_(html) {
  return /<meta[^>]+name=["']viewport["'][^>]*>/i.test(html);
}

function countH1_(html) {
  const matches = html.match(/<h1[\s>]/gi);
  return matches ? matches.length : 0;
}

function extractCanonicalHref_(html) {
  const re1 = /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']*)["']/i;
  const re2 = /<link[^>]+href=["']([^"']*)["'][^>]*rel=["']canonical["']/i;
  const m = html.match(re1) || html.match(re2);
  return m ? m[1] : null;
}

function countImagesMissingAlt_(html) {
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  let missing = 0;
  imgs.forEach(function (tag) {
    const m = tag.match(/alt\s*=\s*["']([^"']*)["']/i);
    if (!m || m[1].trim() === '') missing++;
  });
  return { total: imgs.length, missing: missing };
}

// Same-origin links found on the fetched page, capped at `cap`. Skips
// mailto:/tel:/javascript: and anything cross-origin — this is deliberately
// narrow (only obvious, cheap-to-resolve internal links), not a crawler.
function extractInternalLinks_(html, origin, cap) {
  const hrefs = [];
  const seen = {};
  const re = /<a\b[^>]*href=["']([^"'#]+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html)) !== null && hrefs.length < cap) {
    const href = m[1].trim();
    if (href === '' || /^(mailto:|tel:|javascript:)/i.test(href)) continue;

    let full;
    if (/^https?:\/\//i.test(href)) {
      if (href.indexOf(origin) !== 0) continue;
      full = href;
    } else if (href.indexOf('/') === 0) {
      full = origin + href;
    } else {
      continue; // ambiguous relative path — skip rather than guess
    }

    if (!seen[full]) { seen[full] = true; hrefs.push(full); }
  }
  return hrefs;
}

// ---------------------------------------------------------------------------
// Scoring — each category is 0-100 based only on checks actually performed.
// ---------------------------------------------------------------------------

function scoreSeo_(checks) {
  let score = 0;
  if (checks.title) {
    score += 25;
    if (checks.titleLength >= 10 && checks.titleLength <= 60) score += 5;
  }
  if (checks.metaDescription) {
    score += 25;
    if (checks.metaDescriptionLength >= 50 && checks.metaDescriptionLength <= 160) score += 5;
  }
  if (checks.h1Count === 1) score += 20;
  else if (checks.h1Count > 1) score += 15; // has one, just more than one — partial credit
  if (checks.canonical) score += 20;
  return score;
}

// Explicitly a page-size/network heuristic — fetch duration measured by
// this script's own wall-clock timing (a real, if narrow, signal) plus raw
// HTML size. Not Lighthouse, not PageSpeed, not Core Web Vitals.
function scorePerformance_(durationMs, htmlSize) {
  let score = 0;
  if (durationMs < 1000) score += 50;
  else if (durationMs < 3000) score += 35;
  else if (durationMs < 6000) score += 20;
  else score += 5;

  if (htmlSize < 100000) score += 50;
  else if (htmlSize < 300000) score += 35;
  else if (htmlSize < 800000) score += 20;
  else score += 5;

  return score;
}

// Image alt-text only, matching what's actually checked — not a general
// accessibility-compliance score.
function scoreAccessibility_(imgTotal, imgMissing) {
  if (imgTotal === 0) return 100; // nothing to flag
  return Math.round((100 * (imgTotal - imgMissing)) / imgTotal);
}

function computeOverallScore_(mobilePass, seoScore, performanceScore, accessibilityScore) {
  const mobileScore = mobilePass ? 100 : 0;
  const weighted = mobileScore * AUDIT_WEIGHTS.mobile +
    seoScore * AUDIT_WEIGHTS.seo +
    performanceScore * AUDIT_WEIGHTS.performance +
    accessibilityScore * AUDIT_WEIGHTS.accessibility;
  return Math.round(weighted);
}

// ---------------------------------------------------------------------------
// Audit engine
// ---------------------------------------------------------------------------

// Runs every check against a single normalized URL. Returns
// { ok: false, message } on any failure (fetch error, non-2xx, empty body),
// or the full scored result on success. Never throws.
function auditUrl_(url) {
  const startTime = Date.now();
  const fetchResult = fetchAuditPage_(url);
  if (!fetchResult.ok) return { ok: false, message: fetchResult.message };

  const durationMs = Date.now() - startTime;

  if (fetchResult.code < 200 || fetchResult.code >= 300) {
    return { ok: false, message: 'The site returned HTTP ' + fetchResult.code + ' — could not run the audit.' };
  }

  const rawText = fetchResult.text || '';
  if (rawText.trim() === '') {
    return { ok: false, message: 'The page returned an empty response — nothing to analyze.' };
  }

  const html = rawText.length > AUDIT_MAX_HTML_CHARS ? rawText.slice(0, AUDIT_MAX_HTML_CHARS) : rawText;
  const isHttps = /^https:\/\//i.test(url);

  const title = extractTitle_(html);
  const metaDescription = extractMetaContent_(html, 'description');
  const hasViewport = hasViewportMeta_(html);
  const h1Count = countH1_(html);
  const canonical = extractCanonicalHref_(html);
  const imgStats = countImagesMissingAlt_(html);
  const ogTitle = extractOgContent_(html, 'title');
  const ogImage = extractOgContent_(html, 'image');

  const origin = getOrigin_(url);
  const robots = checkAuxiliaryUrl_(origin + '/robots.txt');
  const sitemap = checkAuxiliaryUrl_(origin + '/sitemap.xml');

  const internalLinks = extractInternalLinks_(html, origin, AUDIT_MAX_LINK_CHECKS);
  const brokenLinkCount = checkBrokenLinks_(internalLinks);

  const seoChecks = {
    title: !!title,
    titleLength: title ? title.length : 0,
    metaDescription: !!metaDescription,
    metaDescriptionLength: metaDescription ? metaDescription.length : 0,
    h1Count: h1Count,
    canonical: !!canonical
  };
  const seoScore = scoreSeo_(seoChecks);
  const performanceScore = scorePerformance_(durationMs, rawText.length);
  const accessibilityScore = scoreAccessibility_(imgStats.total, imgStats.missing);
  const overallScore = computeOverallScore_(hasViewport, seoScore, performanceScore, accessibilityScore);

  const issues = [];
  if (!isHttps) issues.push('not using HTTPS');
  if (!hasViewport) issues.push('no mobile viewport meta tag');
  if (!title) issues.push('missing page title');
  else if (title.length < 10 || title.length > 60) issues.push('title length not ideal (' + title.length + ' characters)');
  if (!metaDescription) issues.push('missing meta description');
  else if (metaDescription.length < 50 || metaDescription.length > 160) issues.push('meta description length not ideal (' + metaDescription.length + ' characters)');
  if (h1Count === 0) issues.push('no H1 heading found');
  else if (h1Count > 1) issues.push('multiple H1 headings found (' + h1Count + ')');
  if (imgStats.missing > 0) issues.push(imgStats.missing + ' image' + (imgStats.missing === 1 ? '' : 's') + ' missing alt text');
  if (!canonical) issues.push('no canonical tag');
  if (!robots.reachable) issues.push('robots.txt not reachable');
  if (!sitemap.reachable) issues.push('sitemap.xml not reachable');
  if (!ogTitle && !ogImage) issues.push('missing Open Graph title/image tags');
  if (brokenLinkCount > 0) issues.push(brokenLinkCount + ' internal link' + (brokenLinkCount === 1 ? '' : 's') + ' returned an error');

  const notes = issues.length > 0
    ? 'Opportunities: ' + issues.join('; ') + '.'
    : 'No issues found in the checks performed.';

  return {
    ok: true,
    score: overallScore,
    mobileLabel: hasViewport ? 'PASS — viewport meta found' : 'FAIL — no viewport meta tag found',
    seoLabel: seoScore + '/100 — title/meta/H1/canonical checks',
    performanceLabel: performanceScore + '/100 — HTML size/network heuristic',
    accessibilityLabel: accessibilityScore + '/100 — image alt-text checks',
    notes: notes,
    issues: issues
  };
}

// Runs the audit and, on success, appends a row to Website Audits. On
// failure, nothing is written — a failed audit isn't a data point.
function performAndSaveAudit_(business, url) {
  const audit = auditUrl_(url);
  if (!audit.ok) return audit;

  saveAuditRecord_(business, audit);
  return audit;
}

function saveAuditRecord_(business, audit) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Website Audits');
  if (!sheet) return; // defensive; buildRCSCRM() always creates this sheet

  const headers = getHeaders_('Website Audits'); // CRM_Actions.gs
  const idx = {};
  headers.forEach(function (h, i) { idx[h] = i; });

  const row = new Array(headers.length).fill('');
  row[idx['Business']] = business;
  row[idx['Date']] = formatAuditDate_(new Date());
  row[idx['Mobile']] = audit.mobileLabel;
  row[idx['SEO']] = audit.seoLabel;
  row[idx['Performance']] = audit.performanceLabel;
  row[idx['Accessibility']] = audit.accessibilityLabel;
  row[idx['Score']] = audit.score;
  row[idx['Notes']] = audit.notes;

  // Always appended below the current last row — a repeat audit of the
  // same business becomes a new row, never a replacement of the old one.
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, headers.length).setValues([row]);
  applyBasicFilter_(sheet, headers.length); // Code.gs
  autoResizeColumns_(sheet, headers.length); // Code.gs
}

function formatAuditDate_(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

// ---------------------------------------------------------------------------
// Results UI
// ---------------------------------------------------------------------------

function formatSingleAuditResult_(r) {
  if (!r.ok) return r.business + ' — audit failed: ' + r.message;

  const topIssues = r.issues && r.issues.length ? r.issues.slice(0, 3).join('; ') : 'None found';
  return 'Business: ' + r.business +
    '\nURL: ' + r.url +
    '\nOverall Score: ' + r.score + '/100' +
    '\nMobile: ' + r.mobileLabel +
    '\nSEO: ' + r.seoLabel +
    '\nPerformance: ' + r.performanceLabel +
    '\nAccessibility: ' + r.accessibilityLabel +
    '\nTop issues: ' + topIssues +
    '\n\nAudit saved to Website Audits.';
}

function showAuditResults_(results, skippedNoUrl) {
  const ui = SpreadsheetApp.getUi();
  let message;

  if (results.length === 1) {
    message = formatSingleAuditResult_(results[0]);
  } else {
    const audited = results.filter(function (r) { return r.ok; }).length;
    const failed = results.length - audited;
    const lines = results.map(function (r) {
      return r.ok ? (r.business + ' — ' + r.score + '/100') : (r.business + ' — failed: ' + r.message);
    });
    message = 'Audited: ' + audited + (failed ? ', Failed: ' + failed : '') +
      '\n\n' + lines.join('\n');
  }

  if (skippedNoUrl > 0) {
    message += '\n\n(' + skippedNoUrl + ' other selected row(s) had no Business/Website and were skipped.)';
  }

  ui.alert('Website Audit', message, ui.ButtonSet.OK);
}

// Client-side dialog: URL input + Run Audit button + a results area that
// reports the same fields as the Prospect-audit alert.
const AUDIT_URL_DIALOG_HTML = '<!DOCTYPE html><html><head><base target="_top">' +
  '<style>' +
  'body{font-family:Arial,sans-serif;font-size:13px;color:#222;padding:4px 8px;}' +
  'h3{margin:0 0 10px;font-size:15px;}' +
  'p.hint{color:#666;margin-top:0;}' +
  'input[type=text]{width:100%;box-sizing:border-box;padding:8px;margin:8px 0;border:1px solid #ccc;border-radius:4px;font-size:13px;}' +
  'button{background:#1a1a2e;color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:13px;}' +
  'button:disabled{background:#999;cursor:default;}' +
  '#status{margin-top:16px;line-height:1.5;white-space:pre-wrap;}' +
  '</style></head><body>' +
  '<h3>Audit Website URL</h3>' +
  '<p class="hint">Enter a website URL. Checks one page plus robots.txt/sitemap.xml — no full-site crawl.</p>' +
  '<input type="text" id="urlInput" placeholder="example.com or https://example.com">' +
  '<button id="auditBtn">Run Audit</button>' +
  '<div id="status"></div>' +
  '<script>' +
  'document.getElementById("auditBtn").addEventListener("click", function () {' +
  '  var input = document.getElementById("urlInput");' +
  '  var status = document.getElementById("status");' +
  '  var btn = document.getElementById("auditBtn");' +
  '  if (!input.value.trim()) { status.textContent = "Enter a URL first."; return; }' +
  '  btn.disabled = true;' +
  '  status.textContent = "Auditing...";' +
  '  google.script.run.withSuccessHandler(function (result) {' +
  '    btn.disabled = false;' +
  '    if (!result.ok) { status.textContent = "Audit failed: " + result.message; return; }' +
  '    var topIssues = (result.issues && result.issues.length) ? result.issues.slice(0, 3).join("; ") : "None found";' +
  '    status.textContent = "Business: " + result.business +' +
  '      "\\nURL: " + result.url +' +
  '      "\\nOverall Score: " + result.score + "/100" +' +
  '      "\\nMobile: " + result.mobileLabel +' +
  '      "\\nSEO: " + result.seoLabel +' +
  '      "\\nPerformance: " + result.performanceLabel +' +
  '      "\\nAccessibility: " + result.accessibilityLabel +' +
  '      "\\nTop issues: " + topIssues +' +
  '      "\\n\\nAudit saved to Website Audits.";' +
  '  }).withFailureHandler(function (err) {' +
  '    btn.disabled = false;' +
  '    status.textContent = "Audit failed: " + err.message;' +
  '  }).runUrlAudit_(input.value);' +
  '});' +
  '</script></body></html>';
