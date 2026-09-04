/**
 * Roman Creative Studio — Operational CRM
 * Google Sheets / Apps Script
 *
 * Run setupRCSCRM() once from Extensions > Apps Script.
 */

const SHEETS = {
  DASHBOARD: 'Dashboard',
  PROSPECTS: 'Prospects',
  AUDITS: 'Website Audits',
  OUTREACH: 'Outreach Pipeline',
  FOLLOWUPS: 'Follow Ups',
  MEETINGS: 'Meetings',
  PROPOSALS: 'Proposals',
  CLIENTS: 'Clients',
  REVENUE: 'Revenue',
  REFERRALS: 'Referrals Network',
  ACTIVITY: 'Activity Log',
  SETTINGS: 'Settings'
};

const HEADERS = {
  'Prospects': ['Prospect ID','Business Name','Contact Name','Email','Phone','Website','Industry','Location','Lead Source','Stage','Priority','Potential Value','Created Date','Last Contact Date','Next Follow-Up','Decision Maker?','Notes'],
  'Website Audits': ['Audit ID','Prospect ID','Business Name','Audit Date','Website','Performance','Mobile','SEO','Conversion','Design','Key Problems','Recommended Fixes','Audit Link','Status'],
  'Outreach Pipeline': ['Outreach ID','Prospect ID','Business Name','Contact Name','Channel','Date Sent','Message/Asset','Status','Response Date','Response','Next Action','Next Action Date','Notes'],
  'Follow Ups': ['Follow-Up ID','Prospect ID','Business Name','Contact Name','Due Date','Type','Channel','Status','Completed Date','Outcome','Next Follow-Up Date','Notes'],
  'Meetings': ['Meeting ID','Prospect ID','Business Name','Contact Name','Meeting Date','Meeting Type','Status','Pain/Need','Budget','Timeline','Decision Maker?','Notes','Next Action','Next Action Date'],
  'Proposals': ['Proposal ID','Prospect ID','Business Name','Proposal Date','Amount','Package','Status','Sent Date','Decision Date','Contract Signed?','Deposit Required','Deposit Received?','Proposal Link','Next Follow-Up Date','Notes'],
  'Clients': ['Client ID','Prospect ID','Business Name','Primary Contact','Email','Phone','Start Date','Project','Contract Value','Deposit Received','Status','Target Launch','Care Plan?','Notes'],
  'Revenue': ['Revenue ID','Client ID','Business Name','Invoice/Payment Date','Type','Amount','Status','Payment Method','Reference','Notes'],
  'Referrals Network': ['Referral ID','Source Name','Source Type','Contact','Email','Phone','Referred Prospect ID','Date','Status','Revenue Generated','Notes'],
  'Activity Log': ['Activity ID','Date','Prospect/Client ID','Business Name','Type','Description','Outcome','Next Action','Next Action Date','Owner'],
  'Settings': ['Setting','Value','Notes']
};

function onOpen() {
  SpreadsheetApp.getUi().createMenu('RCS CRM')
    .addItem('Setup / Repair CRM','setupRCSCRM')
    .addItem('Refresh Dashboard','refreshDashboard')
    .addItem('Create Daily Follow-Up View','createDailyFollowUpView')
    .addToUi();
}

function setupRCSCRM() {
  const ss = SpreadsheetApp.getActive();
  Object.keys(HEADERS).forEach(name => {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    const headers = HEADERS[name];
    sh.getRange(1,1,1,headers.length).setValues([headers]);
    sh.setFrozenRows(1);
    sh.getRange(1,1,1,headers.length).setFontWeight('bold');
    sh.getRange(1,1,1,headers.length).createFilter();
    sh.autoResizeColumns(1, headers.length);
  });

  setupSettings(ss);
  setupValidations(ss);
  setupFormulas(ss);
  buildDashboard(ss);
  formatSheets(ss);
  createDailyFollowUpView();
  SpreadsheetApp.getUi().alert('RCS CRM is set up. Start on the Dashboard, then add prospects.');
}

function setupSettings(ss) {
  const sh = ss.getSheetByName(SHEETS.SETTINGS);
  if (sh.getLastRow() > 1) return;
  const rows = [
    ['90-Day Revenue Goal',10000,'Change only if the goal changes.'],
    ['Owner','Alexander Roman','CRM owner'],
    ['Default Follow-Up Days',3,'Use for manual follow-up planning.'],
    ['Currency','USD',''],
    ['Stages','New,Research,Contacted,Follow-Up,Responded,Meeting,Proposal,Negotiation,Won,Lost,Nurture','Primary sales stages'],
    ['Outreach Channels','Email,Phone,Text,Instagram,Facebook,LinkedIn,In Person,Referral,Other',''],
    ['Proposal Statuses','Draft,Sent,Negotiating,Accepted,Declined,Expired',''],
    ['Client Statuses','Onboarding,Active,Complete,Maintenance,Inactive','']
  ];
  sh.getRange(2,1,rows.length,3).setValues(rows);
}

function setupValidations(ss) {
  const list = (sheetName, col, values) => {
    const sh = ss.getSheetByName(sheetName);
    sh.getRange(2,col,999,1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(values,true).setAllowInvalid(false).build()
    );
  };
  list('Prospects',10,['New','Research','Contacted','Follow-Up','Responded','Meeting','Proposal','Negotiation','Won','Lost','Nurture']);
  list('Prospects',11,['High','Medium','Low']);
  list('Outreach Pipeline',5,['Email','Phone','Text','Instagram','Facebook','LinkedIn','In Person','Referral','Other']);
  list('Outreach Pipeline',8,['Planned','Sent','Responded','No Response','Closed']);
  list('Follow Ups',6,['Initial','Follow-Up 1','Follow-Up 2','Follow-Up 3','Proposal Follow-Up','Nurture','Other']);
  list('Follow Ups',7,['Email','Phone','Text','Instagram','Facebook','LinkedIn','In Person','Other']);
  list('Follow Ups',8,['Open','Completed','Skipped']);
  list('Meetings',6,['Discovery','Proposal Review','Follow-Up','Kickoff','Other']);
  list('Meetings',7,['Scheduled','Completed','Cancelled','No-Show']);
  list('Proposals',7,['Draft','Sent','Negotiating','Accepted','Declined','Expired']);
  list('Clients',11,['Onboarding','Active','Complete','Maintenance','Inactive']);
  list('Revenue',5,['Deposit','Milestone','Final','Care Plan','SEO','Other']);
  list('Revenue',7,['Pending','Paid','Partial','Refunded','Cancelled']);
  list('Referrals Network',3,['Client','Partner','Friend','Community','Other']);
  list('Referrals Network',9,['New','Contacted','Qualified','Won','Lost']);
}

function setupFormulas(ss) {
  const p = ss.getSheetByName('Prospects');
  p.getRange('A2').setFormula('=IF(B2="","","P-"&TEXT(ROW()-1,"0000"))');
  p.getRange('A2').copyTo(p.getRange('A2:A1000'));
  p.getRange('M2').setFormula('=IF(B2="","",IF(M2="",TODAY(),M2))');

  const a = ss.getSheetByName('Website Audits');
  a.getRange('A2').setFormula('=IF(C2="","","A-"&TEXT(ROW()-1,"0000"))');
  a.getRange('A2').copyTo(a.getRange('A2:A1000'));

  const o = ss.getSheetByName('Outreach Pipeline');
  o.getRange('A2').setFormula('=IF(C2="","","O-"&TEXT(ROW()-1,"0000"))');
  o.getRange('A2').copyTo(o.getRange('A2:A1000'));

  const f = ss.getSheetByName('Follow Ups');
  f.getRange('A2').setFormula('=IF(C2="","","F-"&TEXT(ROW()-1,"0000"))');
  f.getRange('A2').copyTo(f.getRange('A2:A1000'));

  const m = ss.getSheetByName('Meetings');
  m.getRange('A2').setFormula('=IF(C2="","","M-"&TEXT(ROW()-1,"0000"))');
  m.getRange('A2').copyTo(m.getRange('A2:A1000'));

  const pr = ss.getSheetByName('Proposals');
  pr.getRange('A2').setFormula('=IF(C2="","","PR-"&TEXT(ROW()-1,"0000"))');
  pr.getRange('A2').copyTo(pr.getRange('A2:A1000'));

  const c = ss.getSheetByName('Clients');
  c.getRange('A2').setFormula('=IF(B2="","","C-"&TEXT(ROW()-1,"0000"))');
  c.getRange('A2').copyTo(c.getRange('A2:A1000'));

  const r = ss.getSheetByName('Revenue');
  r.getRange('A2').setFormula('=IF(C2="","","R-"&TEXT(ROW()-1,"0000"))');
  r.getRange('A2').copyTo(r.getRange('A2:A1000'));

  const ref = ss.getSheetByName('Referrals Network');
  ref.getRange('A2').setFormula('=IF(B2="","","RF-"&TEXT(ROW()-1,"0000"))');
  ref.getRange('A2').copyTo(ref.getRange('A2:A1000'));

  const act = ss.getSheetByName('Activity Log');
  act.getRange('A2').setFormula('=IF(D2="","","ACT-"&TEXT(ROW()-1,"0000"))');
  act.getRange('A2').copyTo(act.getRange('A2:A2000'));
}

function buildDashboard(ss) {
  let sh = ss.getSheetByName('Dashboard');
  sh.clear();
  sh.setFrozenRows(2);
  sh.getRange('A1:H1').merge().setValue('ROMAN CREATIVE STUDIO — 90-DAY REVENUE CRM').setFontSize(18).setFontWeight('bold');
  sh.getRange('A3:B11').setValues([
    ['Metric','Value'],
    ['90-Day Revenue Goal','=Settings!B2'],
    ['Revenue Collected','=SUMIF(Revenue!G:G,"Paid",Revenue!F:F)'],
    ['Remaining','=MAX(B4-B5,0)'],
    ['Open Pipeline','=SUMIF(Proposals!G:G,"Sent",Proposals!E:E)+SUMIF(Proposals!G:G,"Negotiating",Proposals!E:E)'],
    ['Prospects','=COUNTA(Prospects!B2:B)'],
    ['Contacted','=COUNTIF(Prospects!J:J,"Contacted")+COUNTIF(Prospects!J:J,"Follow-Up")+COUNTIF(Prospects!J:J,"Responded")+COUNTIF(Prospects!J:J,"Meeting")+COUNTIF(Prospects!J:J,"Proposal")+COUNTIF(Prospects!J:J,"Negotiation")+COUNTIF(Prospects!J:J,"Won")'],
    ['Meetings','=COUNTIF(Meetings!G:G,"Scheduled")+COUNTIF(Meetings!G:G,"Completed")'],
    ['Proposals Sent','=COUNTIF(Proposals!G:G,"Sent")+COUNTIF(Proposals!G:G,"Negotiating")+COUNTIF(Proposals!G:G,"Accepted")'],
  ]);
  sh.getRange('D3:E8').setValues([
    ['Today',''],
    ['Follow-Ups Due Today','=COUNTIFS(\'Follow Ups\'!E:E,TODAY(),\'Follow Ups\'!H:H,"<>Completed")'],
    ['Follow-Ups Overdue','=COUNTIFS(\'Follow Ups\'!E:E,"<"&TODAY(),\'Follow Ups\'!H:H,"<>Completed")'],
    ['Meetings Today','=COUNTIFS(Meetings!E:E,TODAY(),Meetings!G:G,"<>Cancelled")'],
    ['Won Deals','=COUNTIF(Proposals!G:G,"Accepted")'],
    ['Clients','=COUNTA(Clients!B2:B)']
  ]);
  sh.getRange('A14:H14').merge().setValue('TODAY / OVERDUE FOLLOW-UPS').setFontWeight('bold');
  sh.getRange('A15:H15').setValues([['Business','Contact','Due Date','Type','Channel','Status','Next Action','Notes']]);
  sh.getRange('A16').setFormula('=IFERROR(FILTER({\'Follow Ups\'!C2:C,\'Follow Ups\'!D2:D,\'Follow Ups\'!E2:E,\'Follow Ups\'!F2:F,\'Follow Ups\'!G2:G,\'Follow Ups\'!H2:H,\'Follow Ups\'!K2:K,\'Follow Ups\'!L2:L},\'Follow Ups\'!E2:E<=TODAY(),\'Follow Ups\'!H2:H<>"Completed"),"No open follow-ups due today or overdue")');
  sh.getRange('A25:H25').merge().setValue('90-DAY RULE: SELL FIRST. Only change the CRM to remove friction from selling, follow-up, closing, or revenue tracking.').setFontWeight('bold');
  sh.autoResizeColumns(1,8);
}

function refreshDashboard() {
  buildDashboard(SpreadsheetApp.getActive());
}

function createDailyFollowUpView() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName('Today');
  if (!sh) sh = ss.insertSheet('Today');
  sh.clear();
  sh.getRange('A1:H1').merge().setValue('RCS — TODAY’S ACTIONS').setFontSize(18).setFontWeight('bold');
  sh.getRange('A3:H3').setValues([['Business','Contact','Due Date','Type','Channel','Status','Next Follow-Up','Notes']]);
  sh.getRange('A4').setFormula('=IFERROR(FILTER({\'Follow Ups\'!C2:C,\'Follow Ups\'!D2:D,\'Follow Ups\'!E2:E,\'Follow Ups\'!F2:F,\'Follow Ups\'!G2:G,\'Follow Ups\'!H2:H,\'Follow Ups\'!K2:K,\'Follow Ups\'!L2:L},\'Follow Ups\'!E2:E<=TODAY(),\'Follow Ups\'!H2:H<>"Completed"),"No open follow-ups due")');
  sh.setFrozenRows(3);
  sh.getRange('A3:H3').setFontWeight('bold');
  sh.autoResizeColumns(1,8);
}

function formatSheets(ss) {
  Object.keys(HEADERS).forEach(name => {
    const sh = ss.getSheetByName(name);
    if (!sh) return;
    const cols = HEADERS[name].length;
    sh.getRange(1,1,1,cols).setWrap(true);
    if (name === 'Revenue' || name === 'Proposals' || name === 'Clients') {
      sh.getRange(2,5,999,1).setNumberFormat('$#,##0.00');
      if (name === 'Revenue') sh.getRange(2,6,999,1).setNumberFormat('$#,##0.00');
      if (name === 'Clients') sh.getRange(2,9,999,1).setNumberFormat('$#,##0.00');
    }
    if (name === 'Prospects') sh.getRange(2,12,999,1).setNumberFormat('$#,##0.00');
    sh.setRowHeight(1,30);
  });
}
