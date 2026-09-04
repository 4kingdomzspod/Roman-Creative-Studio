/**
 * Roman Creative Studio — Operational CRM v1
 * Google Sheets / Apps Script
 *
 * Run setupRCSCRM() once from Extensions > Apps Script.
 * Then use the RCS CRM menu. The script is designed to be safe to rerun.
 */

const SHEETS = {
  DASHBOARD: 'Dashboard', PROSPECTS: 'Prospects', AUDITS: 'Website Audits',
  OUTREACH: 'Outreach Pipeline', FOLLOWUPS: 'Follow Ups', MEETINGS: 'Meetings',
  PROPOSALS: 'Proposals', CLIENTS: 'Clients', REVENUE: 'Revenue',
  REFERRALS: 'Referrals Network', ACTIVITY: 'Activity Log', SETTINGS: 'Settings', TODAY: 'Today'
};

const HEADERS = {
  Prospects: ['Prospect ID','Business Name','Contact Name','Email','Phone','Website','Industry','Location','Lead Source','Stage','Priority','Potential Value','Created Date','Last Contact Date','Next Follow-Up','Decision Maker?','Notes'],
  'Website Audits': ['Audit ID','Prospect ID','Business Name','Audit Date','Website','Performance','Mobile','SEO','Conversion','Design','Key Problems','Recommended Fixes','Audit Link','Status'],
  'Outreach Pipeline': ['Outreach ID','Prospect ID','Business Name','Contact Name','Channel','Date Sent','Message/Asset','Status','Response Date','Response','Next Action','Next Action Date','Notes'],
  'Follow Ups': ['Follow-Up ID','Prospect ID','Business Name','Contact Name','Due Date','Type','Channel','Status','Completed Date','Outcome','Next Follow-Up Date','Notes'],
  Meetings: ['Meeting ID','Prospect ID','Business Name','Contact Name','Meeting Date','Meeting Type','Status','Pain/Need','Budget','Timeline','Decision Maker?','Notes','Next Action','Next Action Date'],
  Proposals: ['Proposal ID','Prospect ID','Business Name','Proposal Date','Amount','Package','Status','Sent Date','Decision Date','Contract Signed?','Deposit Required','Deposit Received?','Proposal Link','Next Follow-Up Date','Notes'],
  Clients: ['Client ID','Prospect ID','Business Name','Primary Contact','Email','Phone','Start Date','Project','Contract Value','Deposit Received','Status','Target Launch','Care Plan?','Notes'],
  Revenue: ['Revenue ID','Client ID','Business Name','Invoice/Payment Date','Type','Amount','Status','Payment Method','Reference','Notes'],
  'Referrals Network': ['Referral ID','Source Name','Source Type','Contact','Email','Phone','Referred Prospect ID','Date','Status','Revenue Generated','Notes'],
  'Activity Log': ['Activity ID','Date','Prospect/Client ID','Business Name','Type','Description','Outcome','Next Action','Next Action Date','Owner'],
  Settings: ['Setting','Value','Notes']
};

function onOpen() {
  SpreadsheetApp.getUi().createMenu('RCS CRM')
    .addItem('Setup / Repair CRM','setupRCSCRM')
    .addItem('Refresh Dashboard','refreshDashboard')
    .addItem('Create Daily Follow-Up View','createDailyFollowUpView')
    .addItem('Run System Check','validateCRMSetup')
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
    if (sh.getFilter()) sh.getFilter().remove();
    sh.getRange(1,1,1,headers.length).createFilter();
    sh.getRange(1,1,1,headers.length).setFontWeight('bold');
    sh.setRowHeight(1,30);
    sh.autoResizeColumns(1, headers.length);
  });
  setupSettings(ss);
  setupValidations(ss);
  buildDashboard(ss);
  formatSheets(ss);
  createDailyFollowUpView();
  validateCRMSetup(false);
  SpreadsheetApp.getUi().alert('RCS CRM is installed and repaired. Start on Dashboard → Prospects.');
}

function setupSettings(ss) {
  const sh = ss.getSheetByName(SHEETS.SETTINGS);
  if (sh.getLastRow() <= 1) {
    sh.getRange(2,1,8,3).setValues([
      ['90-Day Revenue Goal',10000,''],['Owner','Alexander Roman',''],['Default Follow-Up Days',3,''],['Currency','USD',''],
      ['Stages','New,Research,Contacted,Follow-Up,Responded,Meeting,Proposal,Negotiation,Won,Lost,Nurture',''],
      ['Outreach Channels','Email,Phone,Text,Instagram,Facebook,LinkedIn,In Person,Referral,Other',''],
      ['Proposal Statuses','Draft,Sent,Negotiating,Accepted,Declined,Expired',''],
      ['Client Statuses','Onboarding,Active,Complete,Maintenance,Inactive','']
    ]);
  }
}

function setupValidations(ss) {
  const list = (sheet, col, values) => ss.getSheetByName(sheet).getRange(2,col,999,1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(values,true).setAllowInvalid(false).build());
  const checkbox = (sheet, col) => ss.getSheetByName(sheet).getRange(2,col,999,1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireCheckbox().setAllowInvalid(false).build());
  list('Prospects',10,['New','Research','Contacted','Follow-Up','Responded','Meeting','Proposal','Negotiation','Won','Lost','Nurture']);
  list('Prospects',11,['High','Medium','Low']); checkbox('Prospects',16);
  list('Website Audits',14,['Draft','Complete']);
  list('Outreach Pipeline',5,['Email','Phone','Text','Instagram','Facebook','LinkedIn','In Person','Referral','Other']);
  list('Outreach Pipeline',8,['Planned','Sent','Responded','No Response','Closed']);
  list('Follow Ups',6,['Initial','Follow-Up 1','Follow-Up 2','Follow-Up 3','Proposal Follow-Up','Nurture','Other']);
  list('Follow Ups',7,['Email','Phone','Text','Instagram','Facebook','LinkedIn','In Person','Other']);
  list('Follow Ups',8,['Open','Completed','Skipped']);
  list('Meetings',6,['Discovery','Proposal Review','Follow-Up','Kickoff','Other']); list('Meetings',7,['Scheduled','Completed','Cancelled','No-Show']); checkbox('Meetings',11);
  list('Proposals',7,['Draft','Sent','Negotiating','Accepted','Declined','Expired']); checkbox('Proposals',10); checkbox('Proposals',12);
  list('Clients',11,['Onboarding','Active','Complete','Maintenance','Inactive']); checkbox('Clients',10); checkbox('Clients',13);
  list('Revenue',5,['Deposit','Milestone','Final','Care Plan','SEO','Other']); list('Revenue',7,['Pending','Paid','Partial','Refunded','Cancelled']);
  list('Referrals Network',3,['Client','Partner','Friend','Community','Other']); list('Referrals Network',9,['New','Contacted','Qualified','Won','Lost']);
}

function nextId_(sheetName, prefix) {
  const sh = SpreadsheetApp.getActive().getSheetByName(sheetName);
  if (!sh) return prefix + '-0001';
  const ids = sh.getRange(2,1,Math.max(sh.getLastRow()-1,1),1).getValues().flat();
  let max = 0;
  ids.forEach(id => { const m = String(id || '').match(new RegExp('^' + prefix + '-(\\d+)$')); if (m) max = Math.max(max, Number(m[1])); });
  return prefix + '-' + String(max + 1).padStart(4,'0');
}

function stampAndAutomate_(e) {
  if (!e || !e.range) return;
  const sh = e.range.getSheet(); const row = e.range.getRow();
  if (row < 2) return;
  const name = sh.getName(); const v = e.value;
  const rowValues = sh.getRange(row,1,1,sh.getLastColumn()).getValues()[0];
  const set = (col,val) => sh.getRange(row,col).setValue(val);

  const idMap = {
    Prospects:['P',2], 'Website Audits':['A',3], 'Outreach Pipeline':['O',3], 'Follow Ups':['F',3],
    Meetings:['M',3], Proposals:['PR',3], Clients:['C',2], Revenue:['R',3], 'Referrals Network':['RF',2], 'Activity Log':['ACT',4]
  };
  if (idMap[name] && !rowValues[0] && rowValues[idMap[name][1]-1]) set(1,nextId_(name,idMap[name][0]));

  if (name === 'Prospects' && rowValues[1] && !rowValues[12]) set(13,new Date());
  if (name === 'Outreach Pipeline' && e.range.getColumn() === 8 && v === 'Sent') {
    if (!rowValues[5]) set(6,new Date());
    if (!rowValues[11]) set(12,addDays_(new Date(), defaultFollowUpDays_()));
    createFollowUpIfMissing_(rowValues);
    updateProspectFromOutreach_(rowValues);
    logActivity_(rowValues[1],rowValues[2],'Outreach','Outreach sent via ' + rowValues[4],'Sent',rowValues[10],rowValues[11]);
  }
  if (name === 'Follow Ups' && e.range.getColumn() === 8 && v === 'Completed') {
    if (!rowValues[8]) set(9,new Date());
    if (rowValues[1]) updateProspectContactDate_(rowValues[1]);
    logActivity_(rowValues[1],rowValues[2],'Follow-Up','Follow-up completed','Completed',rowValues[9],rowValues[10]);
  }
  if (name === 'Meetings' && e.range.getColumn() === 7 && v === 'Completed') {
    if (rowValues[1]) updateProspectStage_(rowValues[1],'Responded');
    logActivity_(rowValues[1],rowValues[2],'Meeting','Meeting completed','Completed',rowValues[12],rowValues[13]);
  }
  if (name === 'Proposals' && e.range.getColumn() === 7 && v === 'Sent') {
    if (!rowValues[7]) set(8,new Date());
    if (!rowValues[13]) set(14,addDays_(new Date(),defaultFollowUpDays_()));
    updateProspectStage_(rowValues[1],'Proposal');
    logActivity_(rowValues[1],rowValues[2],'Proposal','Proposal sent','Sent','Follow up',rowValues[13]);
  }
  if (name === 'Proposals' && e.range.getColumn() === 7 && v === 'Accepted') {
    if (!rowValues[8]) set(9,new Date());
    updateProspectStage_(rowValues[1],'Won');
    createClientFromProposal_(rowValues);
    logActivity_(rowValues[1],rowValues[2],'Sale','Proposal accepted','Won','Onboard client',new Date());
  }
  if (name === 'Revenue' && e.range.getColumn() === 7 && v === 'Paid') {
    logActivity_(rowValues[1],rowValues[2],'Revenue','Payment recorded','Paid','Continue delivery',null);
  }
}

function onEdit(e) { stampAndAutomate_(e); }

function defaultFollowUpDays_() {
  const v = SpreadsheetApp.getActive().getSheetByName(SHEETS.SETTINGS).getRange('B4').getValue();
  return Number(v) || 3;
}
function addDays_(date,days) { const d = new Date(date); d.setDate(d.getDate()+Number(days)); return d; }
function updateProspectStage_(id,stage) { if (!id) return; const sh=SpreadsheetApp.getActive().getSheetByName(SHEETS.PROSPECTS); const ids=sh.getRange(2,1,Math.max(sh.getLastRow()-1,1),1).getValues().flat(); const i=ids.indexOf(id); if(i>=0) sh.getRange(i+2,10).setValue(stage); }
function updateProspectContactDate_(id) { if (!id) return; const sh=SpreadsheetApp.getActive().getSheetByName(SHEETS.PROSPECTS); const ids=sh.getRange(2,1,Math.max(sh.getLastRow()-1,1),1).getValues().flat(); const i=ids.indexOf(id); if(i>=0) sh.getRange(i+2,14).setValue(new Date()); }
function updateProspectFromOutreach_(r) { if (r[1]) updateProspectStage_(r[1],'Contacted'); updateProspectContactDate_(r[1]); }

function createFollowUpIfMissing_(r) {
  const ss=SpreadsheetApp.getActive(), sh=ss.getSheetByName(SHEETS.FOLLOWUPS);
  const prospectId=r[1], business=r[2], contact=r[3], due=r[11]; if(!prospectId || !due) return;
  const last=Math.max(sh.getLastRow()-1,1);
  const rows=sh.getRange(2,2,last,10).getValues();
  const dueKey=new Date(due).setHours(0,0,0,0);
  const duplicate=rows.some(x => x[0]===prospectId && x[3] && new Date(x[3]).setHours(0,0,0,0)===dueKey && x[6]!=='Completed');
  if(duplicate) return;
  const nr=sh.getLastRow()+1;
  sh.getRange(nr,1,1,12).setValues([[nextId_(SHEETS.FOLLOWUPS,'F'),prospectId,business,contact,due,'Follow-Up 1',r[4],'Open','', '', '', 'Auto-created from outreach']]);
}

function createClientFromProposal_(r) {
  const ss=SpreadsheetApp.getActive(), sh=ss.getSheetByName(SHEETS.CLIENTS); if(!r[1]) return;
  const ids=sh.getRange(2,2,Math.max(sh.getLastRow()-1,1),1).getValues().flat(); if(ids.indexOf(r[1])>=0) return;
  const p=ss.getSheetByName(SHEETS.PROSPECTS), pids=p.getRange(2,1,Math.max(p.getLastRow()-1,1),1).getValues().flat(), i=pids.indexOf(r[1]);
  const pr=i>=0?p.getRange(i+1,1,1,17).getValues()[0]:[]; const nr=sh.getLastRow()+1;
  sh.getRange(nr,1,1,14).setValues([[nextId_(SHEETS.CLIENTS,'C'),r[1],r[2],pr[2]||'',pr[3]||'',pr[4]||'',new Date(),r[5]||'RCS Website Project',r[4]||0,false,'Onboarding','',false,'Created automatically from accepted proposal']]);
}

function logActivity_(id,business,type,description,outcome,nextAction,nextDate) {
  if(!business) return; const sh=SpreadsheetApp.getActive().getSheetByName(SHEETS.ACTIVITY); const nr=sh.getLastRow()+1;
  sh.getRange(nr,1,1,10).setValues([[nextId_(SHEETS.ACTIVITY,'ACT'),new Date(),id||'',business,type,description,outcome||'',nextAction||'',nextDate||'', 'Alexander Roman']]);
}

function buildDashboard(ss) {
  const sh=ss.getSheetByName(SHEETS.DASHBOARD); sh.clear(); sh.setFrozenRows(2);
  sh.getRange('A1:H1').merge().setValue('ROMAN CREATIVE STUDIO — 90-DAY REVENUE CRM').setFontSize(18).setFontWeight('bold');
  sh.getRange('A3:B12').setValues([
    ['Metric','Value'],['90-Day Revenue Goal','=Settings!B2'],['Revenue Collected','=SUMIF(Revenue!G:G,"Paid",Revenue!F:F)'],['Remaining','=MAX(B4-B5,0)'],
    ['Open Pipeline','=SUMIF(Proposals!G:G,"Sent",Proposals!E:E)+SUMIF(Proposals!G:G,"Negotiating",Proposals!E:E)'],['Prospects','=COUNTA(Prospects!B2:B)'],
    ['Contacted','=COUNTIF(Prospects!J:J,"Contacted")+COUNTIF(Prospects!J:J,"Follow-Up")+COUNTIF(Prospects!J:J,"Responded")+COUNTIF(Prospects!J:J,"Meeting")+COUNTIF(Prospects!J:J,"Proposal")+COUNTIF(Prospects!J:J,"Negotiation")+COUNTIF(Prospects!J:J,"Won")'],
    ['Meetings','=COUNTIF(Meetings!G:G,"Scheduled")+COUNTIF(Meetings!G:G,"Completed")'],['Proposals Sent','=COUNTIF(Proposals!G:G,"Sent")+COUNTIF(Proposals!G:G,"Negotiating")+COUNTIF(Proposals!G:G,"Accepted")'],['Won Deals','=COUNTIF(Proposals!G:G,"Accepted")']
  ]);
  sh.getRange('D3:E8').setValues([['Today',''],['Follow-Ups Due Today','=COUNTIFS(\'Follow Ups\'!E:E,TODAY(),\'Follow Ups\'!H:H,"<>Completed")'],['Follow-Ups Overdue','=COUNTIFS(\'Follow Ups\'!E:E,"<"&TODAY(),\'Follow Ups\'!H:H,"<>Completed")'],['Meetings Today','=COUNTIFS(Meetings!E:E,TODAY(),Meetings!G:G,"<>Cancelled")'],['Clients','=COUNTA(Clients!B2:B)'],['Next Action','See Today sheet']]);
  sh.getRange('A14:H14').merge().setValue('TODAY / OVERDUE FOLLOW-UPS').setFontWeight('bold');
  sh.getRange('A15:H15').setValues([['Business','Contact','Due Date','Type','Channel','Status','Next Follow-Up','Notes']]);
  sh.getRange('A16').setFormula('=IFERROR(FILTER({\'Follow Ups\'!C2:C,\'Follow Ups\'!D2:D,\'Follow Ups\'!E2:E,\'Follow Ups\'!F2:F,\'Follow Ups\'!G2:G,\'Follow Ups\'!H2:H,\'Follow Ups\'!K2:K,\'Follow Ups\'!L2:L},\'Follow Ups\'!E2:E<=TODAY(),\'Follow Ups\'!H2:H<>"Completed"),"No open follow-ups due today or overdue")');
  sh.getRange('A25:H25').merge().setValue('90-DAY RULE: SELL FIRST. The CRM exists to remove friction from prospecting, follow-up, meetings, closing, and revenue tracking.').setFontWeight('bold');
  sh.autoResizeColumns(1,8);
  sh.getRange('B4:B7').setNumberFormat('$#,##0.00');
}
function refreshDashboard(){buildDashboard(SpreadsheetApp.getActive());}

function createDailyFollowUpView(){
  const ss=SpreadsheetApp.getActive(); let sh=ss.getSheetByName(SHEETS.TODAY); if(!sh) sh=ss.insertSheet(SHEETS.TODAY); sh.clear();
  sh.getRange('A1:H1').merge().setValue('RCS — TODAY’S ACTIONS').setFontSize(18).setFontWeight('bold');
  sh.getRange('A3:H3').setValues([['Business','Contact','Due Date','Type','Channel','Status','Next Follow-Up','Notes']]);
  sh.getRange('A4').setFormula('=IFERROR(FILTER({\'Follow Ups\'!C2:C,\'Follow Ups\'!D2:D,\'Follow Ups\'!E2:E,\'Follow Ups\'!F2:F,\'Follow Ups\'!G2:G,\'Follow Ups\'!H2:H,\'Follow Ups\'!K2:K,\'Follow Ups\'!L2:L},\'Follow Ups\'!E2:E<=TODAY(),\'Follow Ups\'!H2:H<>"Completed"),"No open follow-ups due")');
  sh.setFrozenRows(3); sh.getRange('A3:H3').setFontWeight('bold'); sh.autoResizeColumns(1,8);
}

function formatSheets(ss){
  Object.keys(HEADERS).forEach(name=>{const sh=ss.getSheetByName(name); if(!sh)return; const cols=HEADERS[name].length; sh.getRange(1,1,1,cols).setWrap(true); sh.setRowHeight(1,30);
    if(name==='Revenue') sh.getRange(2,6,999,1).setNumberFormat('$#,##0.00');
    if(name==='Proposals') sh.getRange(2,5,999,1).setNumberFormat('$#,##0.00');
    if(name==='Clients') sh.getRange(2,9,999,1).setNumberFormat('$#,##0.00');
    if(name==='Prospects') sh.getRange(2,12,999,1).setNumberFormat('$#,##0.00');
    if(name==='Referrals Network') sh.getRange(2,10,999,1).setNumberFormat('$#,##0.00');
  });
}

function validateCRMSetup(showAlert=true){
  const ss=SpreadsheetApp.getActive(); const checks=[];
  Object.keys(HEADERS).forEach(name=>{const sh=ss.getSheetByName(name); checks.push((sh?'PASS':'FAIL')+' — '+name);});
  const p=ss.getSheetByName(SHEETS.PROSPECTS); const m=ss.getSheetByName(SHEETS.FOLLOWUPS); const d=ss.getSheetByName(SHEETS.DASHBOARD);
  if(p) checks.push((p.getRange('A1').getValue()==='Prospect ID'?'PASS':'FAIL')+' — Prospect ID header');
  if(m) checks.push((m.getRange('A1').getValue()==='Follow-Up ID'?'PASS':'FAIL')+' — Follow-Up ID header');
  if(d) checks.push((String(d.getRange('B4').getFormula()).indexOf('Settings!B2')>=0?'PASS':'FAIL')+' — Revenue goal formula');
  const result=checks.join('\n'); if(showAlert) SpreadsheetApp.getUi().alert('RCS CRM System Check\n\n'+result+'\n\nManual test still required: enter one test prospect, outreach, follow-up, meeting, proposal, acceptance, and payment to confirm your Sheet behaves correctly.');
  return result;
}
