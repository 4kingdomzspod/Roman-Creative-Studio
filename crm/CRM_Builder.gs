/**
 * CRM_Builder.gs
 * ---------------------------------------------------------------------------
 * The RCS CRM schema: the 11 sheet names, their exact headers, and which
 * columns get a Settings-backed dropdown. buildRCSCRM() (Code.gs) walks
 * this list to create/update every sheet — this file has no logic of its
 * own, just the schema definition, so it's the one place to look to see
 * exactly what the CRM is supposed to contain.
 */

const HEADER_BG = '#1a1a2e';      // dark header background
const HEADER_FG = '#ffffff';      // white bold header text
const BANDING_FUTURE_ROWS = 300;  // pre-band this many data rows so new rows stay styled

// Column header -> Settings list name, per sheet. Only columns listed here
// get a validation dropdown; everything else stays free text.
const SHEET_DEFS = [
  {
    name: 'Dashboard',
    headers: [], // fully formula-driven — see CRM_Dashboard.gs
    validations: {}
  },
  {
    name: 'Prospects',
    headers: ['Business', 'Industry', 'City', 'Website', 'Phone', 'Email', 'Contact',
      'Priority', 'Status', 'Website Score', 'Last Contact', 'Next Follow Up', 'Notes', 'Archived Date'],
    validations: { 'Industry': 'Industry', 'Priority': 'Priority', 'Status': 'Lead Status' }
  },
  {
    name: 'Outreach Pipeline',
    headers: ['Business', 'Stage', 'Contacted', 'Method', 'Response', 'Next Action', 'Owner', 'Notes'],
    validations: { 'Stage': 'Lead Status', 'Method': 'Outreach Method' }
  },
  {
    name: 'Follow Ups',
    headers: ['Business', 'Due', 'Priority', 'Status', 'Reminder', 'Notes'],
    validations: { 'Priority': 'Priority', 'Status': 'Lead Status' }
  },
  {
    name: 'Meetings',
    headers: ['Business', 'Contact', 'Date', 'Type', 'Outcome', 'Proposal', 'Notes'],
    validations: {}
  },
  {
    name: 'Proposals',
    headers: ['Business', 'Package', 'Value', 'Sent', 'Status', 'Decision', 'Notes'],
    validations: { 'Status': 'Proposal Status' }
  },
  {
    name: 'Clients',
    headers: ['Business', 'Package', 'Start', 'Monthly', 'Status', 'Website', 'Notes'],
    validations: { 'Status': 'Project Status' }
  },
  {
    name: 'Revenue',
    headers: ['Month', 'Client', 'Invoice', 'Amount', 'Paid', 'Payment Date'],
    validations: {}
  },
  {
    name: 'Website Audits',
    headers: ['Business', 'Date', 'Mobile', 'SEO', 'Performance', 'Accessibility', 'Score', 'Notes'],
    validations: {}
  },
  {
    name: 'Referral Network',
    headers: ['Name', 'Company', 'Relationship', 'Industry', 'Last Contact', 'Referrals', 'Notes'],
    validations: { 'Industry': 'Industry' }
  },
  {
    name: 'Settings',
    // Headers are written by buildSettingsSheet_ (CRM_Settings.gs), not
    // here. Deliberately left empty rather than derived from SETTINGS_LISTS
    // at top-level const-init time: Apps Script does not guarantee which
    // .gs file's top-level code runs first, so this file's SHEET_DEFS
    // cannot safely depend on CRM_Settings.gs's SETTINGS_LISTS existing
    // yet. buildRCSCRM() reads SETTINGS_LISTS directly, inside a function
    // body — by then every file has fully loaded, so that's safe.
    headers: [],
    validations: {}
  }
];
