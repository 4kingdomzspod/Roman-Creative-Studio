/**
 * CRM_Import.gs
 * ---------------------------------------------------------------------------
 * "RCS CRM > Import Prospects..." — one-click CSV import into Prospects. A
 * dialog reads the chosen file client-side (FileReader) and sends its raw
 * text to importProspectsFromCsv_ via google.script.run — no Drive API or
 * Picker setup, no extra OAuth scopes beyond what the CRM already needs.
 *
 * importProspectsFromCsv_ is written to be reusable as-is by a future
 * GitHub Sync (Sprint 3): anything that can produce a CSV string can hand
 * it to this same function and get the same column matching, duplicate
 * skipping, and append-only behavior.
 */

// CSV header aliases — maps a source column name to the Prospects header it
// should land in. Any CSV header that matches a Prospects header exactly
// (case-insensitive) is mapped automatically and doesn't need an alias here.
const IMPORT_HEADER_ALIASES = {
  'Business Name': 'Business',
  'Owner/Contact': 'Contact',
  'Website Quality (1-10)': 'Website Score'
};

function showImportDialog_() {
  const html = HtmlService.createHtmlOutput(IMPORT_DIALOG_HTML)
    .setWidth(480)
    .setHeight(420);
  SpreadsheetApp.getUi().showModalDialog(html, 'Import Prospects');
}

// RFC4180-style CSV parser: handles quoted fields, embedded commas/newlines
// inside quotes, and escaped "" quotes. A naive split('\n') would break on
// any multi-line Notes field, which real prospect data has.
function parseCsv_(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') { inQuotes = true; continue; }
    if (ch === ',') { row.push(field); field = ''; continue; }
    if (ch === '\r') { continue; }
    if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; continue; }
    field += ch;
  }

  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

// Shared duplicate-detection key, reused by CRM_Actions.gs too — a business
// is the "same" prospect if Business + Website match (trimmed, case-
// insensitive). Website blank on both sides degenerates to matching on
// Business name alone, which is the right behavior, not a special case.
function dedupeKey_(business, website) {
  return String(business || '').trim().toLowerCase() + '|' + String(website || '').trim().toLowerCase();
}

// Entry point called from the dialog. Returns
// { imported, skipped, errors, errorMessages, ignoredColumns }.
function importProspectsFromCsv_(csvText) {
  const result = { imported: 0, skipped: 0, errors: 0, errorMessages: [], ignoredColumns: [] };

  if (!csvText || csvText.trim() === '') {
    result.errorMessages.push('The file was empty — nothing to import.');
    return result;
  }

  const rows = parseCsv_(csvText);
  if (rows.length === 0) {
    result.errorMessages.push('No rows found in the file.');
    return result;
  }

  const prospectsDef = SHEET_DEFS.find(function (d) { return d.name === 'Prospects'; });
  const targetHeaders = prospectsDef.headers;
  const csvHeaders = rows[0].map(function (h) { return String(h).trim(); });

  const colMap = {}; // csvColIndex -> targetHeaderIndex
  csvHeaders.forEach(function (h, i) {
    if (h === '') return;
    const normalized = h.toLowerCase();
    let targetIndex = targetHeaders.findIndex(function (t) { return t.toLowerCase() === normalized; });
    if (targetIndex === -1 && IMPORT_HEADER_ALIASES[h]) {
      targetIndex = targetHeaders.indexOf(IMPORT_HEADER_ALIASES[h]);
    }
    if (targetIndex !== -1) {
      colMap[i] = targetIndex;
    } else {
      result.ignoredColumns.push(h);
    }
  });

  const businessTargetIndex = targetHeaders.indexOf('Business');
  const websiteTargetIndex = targetHeaders.indexOf('Website');
  const csvBusinessCol = Object.keys(colMap).find(function (k) { return colMap[k] === businessTargetIndex; });

  if (csvBusinessCol === undefined) {
    result.errorMessages.push('No "Business" (or "Business Name") column found — cannot import without a business name.');
    return result;
  }

  if (rows.length === 1) {
    // Header row only, no data rows — a valid, if uneventful, import.
    return result;
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Prospects');
  if (!sheet) {
    result.errorMessages.push('Prospects sheet not found — run "Build / Update CRM" first.');
    return result;
  }

  const existingCount = Math.max(sheet.getLastRow() - 1, 0);
  const existingKeys = {};
  if (existingCount > 0) {
    const existingBusiness = sheet.getRange(2, businessTargetIndex + 1, existingCount, 1).getValues();
    const existingWebsite = sheet.getRange(2, websiteTargetIndex + 1, existingCount, 1).getValues();
    for (let r = 0; r < existingCount; r++) {
      existingKeys[dedupeKey_(existingBusiness[r][0], existingWebsite[r][0])] = true;
    }
  }

  const batchKeys = {};
  const newRows = [];

  for (let r = 1; r < rows.length; r++) {
    const csvRow = rows[r];
    const isBlankRow = csvRow.every(function (cell) { return String(cell).trim() === ''; });
    if (isBlankRow) continue; // blank line in the file, not a data error

    const businessValue = String(csvRow[Number(csvBusinessCol)] || '').trim();
    if (businessValue === '') {
      result.errors++;
      result.errorMessages.push('Row ' + (r + 1) + ': missing Business Name — skipped.');
      continue;
    }

    const mappedRow = new Array(targetHeaders.length).fill('');
    Object.keys(colMap).forEach(function (csvIdx) {
      const value = csvRow[Number(csvIdx)];
      mappedRow[colMap[csvIdx]] = value !== undefined ? value : '';
    });

    const websiteValue = websiteTargetIndex !== -1 ? String(mappedRow[websiteTargetIndex] || '').trim() : '';
    const key = dedupeKey_(businessValue, websiteValue);

    if (existingKeys[key] || batchKeys[key]) {
      result.skipped++;
      continue;
    }
    batchKeys[key] = true;
    newRows.push(mappedRow);
  }

  if (newRows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, targetHeaders.length).setValues(newRows);
    result.imported = newRows.length;

    // Formatting/banding/validation were already pre-applied across a
    // generous future range by buildRCSCRM(), so newly appended rows
    // already carry them — only the filter's range needs refreshing so it
    // covers the rows that were just added.
    applyBasicFilter_(sheet, targetHeaders.length);
    autoResizeColumns_(sheet, targetHeaders.length);
  }

  return result;
}

// Client-side dialog: file picker + Import button + a results area that
// reports Imported/Skipped/Errors after the server call resolves.
const IMPORT_DIALOG_HTML = '<!DOCTYPE html><html><head><base target="_top">' +
  '<style>' +
  'body{font-family:Arial,sans-serif;font-size:13px;color:#222;padding:4px 8px;}' +
  'h3{margin:0 0 10px;font-size:15px;}' +
  'p.hint{color:#666;margin-top:0;}' +
  'input[type=file]{margin:12px 0;}' +
  'button{background:#1a1a2e;color:#fff;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:13px;}' +
  'button:disabled{background:#999;cursor:default;}' +
  '#status{margin-top:16px;line-height:1.5;}' +
  '</style></head><body>' +
  '<h3>Import Prospects</h3>' +
  '<p class="hint">Choose a CSV file. Columns are matched to the Prospects headers automatically; rows already in the sheet (matched on Business + Website) are skipped.</p>' +
  '<input type="file" id="csvFile" accept=".csv,text/csv">' +
  '<br><button id="importBtn">Import</button>' +
  '<div id="status"></div>' +
  '<script>' +
  'document.getElementById("importBtn").addEventListener("click", function () {' +
  '  var fileInput = document.getElementById("csvFile");' +
  '  var status = document.getElementById("status");' +
  '  var btn = document.getElementById("importBtn");' +
  '  if (!fileInput.files.length) { status.textContent = "Choose a CSV file first."; return; }' +
  '  btn.disabled = true;' +
  '  status.textContent = "Reading file...";' +
  '  var reader = new FileReader();' +
  '  reader.onload = function (e) {' +
  '    status.textContent = "Importing...";' +
  '    google.script.run.withSuccessHandler(function (result) {' +
  '      btn.disabled = false;' +
  '      var html = "<strong>Imported:</strong> " + result.imported +' +
  '        "<br><strong>Skipped (duplicates):</strong> " + result.skipped +' +
  '        "<br><strong>Errors:</strong> " + result.errors;' +
  '      if (result.ignoredColumns && result.ignoredColumns.length) {' +
  '        html += "<br><br>Columns not imported (no matching Prospects field): " + result.ignoredColumns.join(", ");' +
  '      }' +
  '      if (result.errorMessages && result.errorMessages.length) {' +
  '        html += "<br><br>" + result.errorMessages.slice(0, 10).join("<br>");' +
  '      }' +
  '      status.innerHTML = html;' +
  '    }).withFailureHandler(function (err) {' +
  '      btn.disabled = false;' +
  '      status.textContent = "Import failed: " + err.message;' +
  '    }).importProspectsFromCsv_(e.target.result);' +
  '  };' +
  '  reader.readAsText(fileInput.files[0]);' +
  '});' +
  '</script></body></html>';
