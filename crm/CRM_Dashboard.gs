/**
 * CRM_Dashboard.gs
 * ---------------------------------------------------------------------------
 * Builds the Dashboard sheet. Every cell here is a label or a live formula
 * derived from the other 10 sheets — nothing is a manually-entered record,
 * so buildDashboard_ clears and redraws the whole sheet on every run. The
 * end state is always identical for the same underlying data, so this can
 * never produce duplicate sections, and it never touches the real records
 * on Prospects/Clients/Revenue/etc. — those are only ever added to
 * elsewhere in this script, never cleared.
 */

const DASHBOARD_COLS = 16;      // A:P — width of the KPI row, reused for the title bar
const PIPELINE_LIST_ROWS = 30;  // generous cap so a longer Settings list still fits

const DASHBOARD_ROWS = {
  title: 1,
  updated: 2,
  kpiHeader: 4,
  kpiLabel: 5,
  kpiValue: 6,
  pipelineHeader: 8,
  pipelineSubHeader: 9,
  pipelineFirstRow: 10 // occupies rows 10..(10 + PIPELINE_LIST_ROWS - 1) = 10..39
};
DASHBOARD_ROWS.metricsHeader = DASHBOARD_ROWS.pipelineFirstRow + PIPELINE_LIST_ROWS + 1; // 41
DASHBOARD_ROWS.metricsLabel = DASHBOARD_ROWS.metricsHeader + 1; // 42
DASHBOARD_ROWS.metricsValue = DASHBOARD_ROWS.metricsHeader + 2; // 43

// KPI cards, in the exact order requested. Every formula reads live from
// the source sheets — no hardcoded counts, totals, or business metrics
// anywhere on this sheet.
const DASHBOARD_KPIS = [
  { label: 'Total Prospects', formula: '=COUNTA(Prospects!A2:A)', format: '0' },
  { label: 'New Leads', formula: '=COUNTIF(Prospects!I2:I,"New")', format: '0' },
  { label: 'Contacted', formula: '=COUNTIF(Prospects!I2:I,"Contacted")', format: '0' },
  { label: 'Follow Ups Due', formula: '=COUNTIFS(\'Follow Ups\'!A2:A,"<>",\'Follow Ups\'!B2:B,"<="&TODAY(),\'Follow Ups\'!B2:B,"<>")', format: '0' },
  { label: 'Meetings Booked', formula: '=COUNTA(Meetings!A2:A)', format: '0' },
  { label: 'Proposals Sent', formula: '=COUNTA(Proposals!D2:D)', format: '0' },
  { label: 'Active Clients', formula: '=COUNTIF(Clients!E2:E,"Active")', format: '0' },
  { label: 'Monthly Revenue', formula: '=SUMIFS(Revenue!D2:D,Revenue!F2:F,">="&EOMONTH(TODAY(),-1)+1,Revenue!F2:F,"<="&EOMONTH(TODAY(),0),Revenue!E2:E,TRUE)', format: '$#,##0.00' }
];

// Conversion + client summary cards, reusing the same card widget as the KPIs.
// "Audits Completed" (Sprint 4) and "Hot Leads" (Sprint 7) were both added
// here rather than the 8-card Key Metrics row above, since that row's
// contents match Sprint 1's spec exactly and these are small additions,
// not a redesign.
//
// "Hot Leads" counts Prospects whose Score Tier column reads "Hot". The
// scoring columns (CRM_Scoring.gs) are appended additively and aren't at a
// fixed column position, so this locates "Score Tier" by header name via
// INDEX/MATCH rather than a hardcoded column letter — IFERROR guards the
// count at 0 for a CRM where scoring hasn't been run yet (no such column).
const DASHBOARD_METRICS = [
  { label: 'Outreach Conversion %', formula: '=IFERROR(COUNTA(Meetings!A2:A)/COUNTA(\'Outreach Pipeline\'!A2:A),0)', format: '0.0%' },
  { label: 'Proposal Close %', formula: '=IFERROR(COUNTIF(Proposals!E2:E,"Accepted")/COUNTA(Proposals!D2:D),0)', format: '0.0%' },
  { label: 'Client Count', formula: '=COUNTA(Clients!A2:A)', format: '0' },
  { label: 'Audits Completed', formula: '=COUNTA(\'Website Audits\'!A2:A)', format: '0' },
  { label: 'Hot Leads', formula: '=IFERROR(COUNTIF(INDEX(Prospects!A2:Z,0,MATCH("Score Tier",Prospects!A1:Z1,0)),"Hot"),0)', format: '0' }
];

function buildDashboard_(sheet) {
  sheet.clear();
  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).breakApart();

  for (let c = 1; c <= DASHBOARD_COLS; c++) sheet.setColumnWidth(c, 95);
  sheet.setHiddenGridlines(true);

  writeTitleBar_(sheet);
  writeKpiSection_(sheet);
  writePipelineSummary_(sheet);
  writeConversionMetrics_(sheet);

  sheet.setFrozenRows(2);
}

function writeTitleBar_(sheet) {
  const title = sheet.getRange(DASHBOARD_ROWS.title, 1, 1, DASHBOARD_COLS).merge();
  title.setValue('RCS CRM — Dashboard')
    .setBackground(HEADER_BG)
    .setFontColor(HEADER_FG)
    .setFontWeight('bold')
    .setFontSize(14)
    .setVerticalAlignment('middle');
  sheet.setRowHeight(DASHBOARD_ROWS.title, 32);

  const updated = sheet.getRange(DASHBOARD_ROWS.updated, 1, 1, DASHBOARD_COLS).merge();
  updated.setFormula('="Last updated: "&TEXT(NOW(),"mmm d, yyyy h:mm am/pm")')
    .setFontStyle('italic')
    .setFontColor('#666666')
    .setFontSize(9);
}

function writeKpiSection_(sheet) {
  writeSectionHeader_(sheet, DASHBOARD_ROWS.kpiHeader, 1, DASHBOARD_COLS, 'Key Metrics');
  DASHBOARD_KPIS.forEach(function (kpi, i) {
    writeKpiCard_(sheet, i, DASHBOARD_ROWS.kpiLabel, kpi.label, kpi.formula, kpi.format);
  });
}

function writeConversionMetrics_(sheet) {
  // 5 cards * 2 columns each = 10 columns (A:J), well within DASHBOARD_COLS (16).
  writeSectionHeader_(sheet, DASHBOARD_ROWS.metricsHeader, 1, 10, 'Conversion & Client Metrics');
  DASHBOARD_METRICS.forEach(function (metric, i) {
    writeKpiCard_(sheet, i, DASHBOARD_ROWS.metricsLabel, metric.label, metric.formula, metric.format);
  });
}

// Prospects broken down by Status, one row per value currently listed on
// Settings!Lead Status. Blank-guarded so it never runs ahead of the list.
function writePipelineSummary_(sheet) {
  writeSectionHeader_(sheet, DASHBOARD_ROWS.pipelineHeader, 1, 4, 'Pipeline Summary — Prospects by Status');
  writeSubHeader_(sheet, DASHBOARD_ROWS.pipelineSubHeader, 1, ['Stage', 'Count']);

  for (let i = 0; i < PIPELINE_LIST_ROWS; i++) {
    const settingsRow = 2 + i;
    const sheetRow = DASHBOARD_ROWS.pipelineFirstRow + i;

    sheet.getRange(sheetRow, 1).setFormula(
      '=IF(Settings!A' + settingsRow + '="","",Settings!A' + settingsRow + ')'
    );
    sheet.getRange(sheetRow, 2).setFormula(
      '=IF(Settings!A' + settingsRow + '="","",COUNTIF(Prospects!$I$2:$I,Settings!A' + settingsRow + '))'
    ).setNumberFormat('0');
  }
}

// ---------------------------------------------------------------------------
// Dashboard widgets
// ---------------------------------------------------------------------------

function writeSectionHeader_(sheet, row, colStart, colEnd, title) {
  const range = sheet.getRange(row, colStart, 1, colEnd - colStart + 1).merge();
  range.setValue(title)
    .setBackground(HEADER_BG)
    .setFontColor(HEADER_FG)
    .setFontWeight('bold')
    .setFontSize(10)
    .setVerticalAlignment('middle');
  sheet.setRowHeight(row, 24);
}

function writeSubHeader_(sheet, row, colStart, labels) {
  labels.forEach(function (label, i) {
    sheet.getRange(row, colStart + i)
      .setValue(label)
      .setBackground('#eceef5')
      .setFontWeight('bold')
      .setFontSize(9);
  });
}

// A 2-column-wide label/value card, e.g. card index 0 -> columns A:B,
// card index 1 -> columns C:D, and so on.
function writeKpiCard_(sheet, cardIndex, labelRow, label, formula, numberFormat) {
  const colStart = 1 + cardIndex * 2;

  const labelRange = sheet.getRange(labelRow, colStart, 1, 2).merge();
  labelRange.setValue(label)
    .setBackground('#eceef5')
    .setFontWeight('bold')
    .setFontSize(9)
    .setHorizontalAlignment('center')
    .setWrap(true);

  const valueRange = sheet.getRange(labelRow + 1, colStart, 1, 2).merge();
  valueRange.setFormula(formula)
    .setFontWeight('bold')
    .setFontSize(18)
    .setHorizontalAlignment('center')
    .setBorder(true, true, true, true, false, false);
  if (numberFormat) valueRange.setNumberFormat(numberFormat);
}
