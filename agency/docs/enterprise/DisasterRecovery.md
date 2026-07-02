# Disaster Recovery Plan — Roman Creative Studio
## Enterprise Operating System | Section 8B
**Version:** 1.0
**Last Updated:** 2026-07-01
**Owner:** CTO + CEO
**Review Schedule:** Annual + after any major infrastructure change
**Dependencies:** SecurityFramework.md, BusinessContinuity.md
**Related Documents:** DataGovernance.md, SecurityFramework.md

---

## Purpose

Define how Roman Creative Studio recovers data, systems, and services following a technical failure, data loss event, or infrastructure disaster. Disaster recovery is the technical counterpart to business continuity.

**Business Value:** Data loss is reputational and financial ruin for a digital agency. A client's brand assets, website source code, or project history lost without recovery is a client relationship ended. This plan ensures we can recover from the worst technical scenarios.

---

## Key Metrics

| Metric | Definition | RCS Target |
|--------|-----------|------------|
| **RTO** (Recovery Time Objective) | Max time to restore service after incident | 4 hours (critical systems) |
| **RPO** (Recovery Point Objective) | Max data loss acceptable | 24 hours (daily backups) |
| **MTTR** (Mean Time to Recovery) | Average time to resolve incidents | <2 hours |

---

## Asset Inventory & Criticality

### Tier 1: Critical (RTO 4 hours, RPO 24 hours)
| Asset | Platform | Recovery Method |
|-------|----------|----------------|
| Client website source code | GitHub | Clone from remote |
| Client deliverable files | Figma + Supabase Storage | Restore from cloud |
| Client database (portals) | Supabase | Point-in-time recovery |
| Stripe billing data | Stripe | Always-available cloud |
| Active project documentation | Notion | Export + cloud restore |

### Tier 2: Important (RTO 8 hours, RPO 48 hours)
| Asset | Platform | Recovery Method |
|-------|----------|----------------|
| Internal operational docs | Notion | Export restore |
| Email archives | Google Workspace | Google Vault |
| Design asset library | Figma | Cloud restore |
| Marketing assets | Supabase Storage | Backup restore |

### Tier 3: Operational (RTO 24 hours, RPO 7 days)
| Asset | Platform | Recovery Method |
|-------|----------|----------------|
| Analytics data | GA4 | Cloud, read-only |
| Email marketing | MailerLite | Cloud backup |
| CRM data | Notion | Export weekly |
| Financial records | Spreadsheet + Xero | Cloud backup |

---

## Backup Strategy

### Code & Version Control
**Platform:** GitHub
- All client code in private GitHub repositories
- Every developer pushes code at end of each working session (minimum daily)
- Branch protection: main branch requires PR review before merge
- No force-push to main without CEO + CTO approval

**Local Mirror:**
- Each developer maintains a local clone of all active repositories
- This provides an instant offline backup at any time

**Automated Mirror (Year 2):**
- Configure GitHub Actions to mirror critical repos to Backblaze B2 weekly

---

### Database (Supabase)
**Supabase Built-In:**
- Point-in-time recovery (PITR) available on Pro plan
- Daily automated backups retained for 7 days
- Manual snapshots before major deployments

**Manual Export Schedule:**
- Weekly: Export all database tables to CSV (stored in Supabase Storage + local)
- Monthly: Full database dump (pg_dump) stored encrypted in Backblaze B2
- Before any schema change: manual snapshot

**Recovery Process:**
1. Identify recovery point (what's the last clean backup?)
2. Restore via Supabase dashboard PITR or from pg_dump
3. Verify data integrity (row counts, key records)
4. Resume application operations
5. Post-incident review: what caused the loss?

---

### File Storage (Client Assets)
**Figma:**
- Files are cloud-stored with version history (30 days on Professional plan)
- Export critical deliverables as PDF/PNG after each major milestone
- Store exports in Supabase Storage and/or Google Drive

**Supabase Storage:**
- Configured with multi-region replication on Pro plan
- Download and archive large client asset folders to external drive quarterly

**Local Backup:**
- All delivered client files downloaded to encrypted external drive monthly
- External drive stored in a separate physical location

---

### Email & Communication
**Google Workspace:**
- Enable Google Vault for email retention (7-year policy)
- Export critical email threads related to client contracts annually

**Notion:**
- Full workspace export (Markdown + CSV) — monthly
- Export stored in Supabase Storage

---

### Financial Data
**Stripe:** Cloud-native, always available — no additional backup needed
**Accounting Software:** Export quarterly to CSV; stored in encrypted folder
**Physical:** All signed contracts scanned and stored in Supabase Storage

---

## Disaster Scenarios & Recovery Procedures

### DR-01: GitHub Repository Corrupted or Deleted

**Detection:** Repository unavailable or data missing

**Recovery Steps:**
1. Check GitHub status (githubstatus.com) — platform issue or user action?
2. If user error (accidental delete): Contact GitHub Support within 1 hour (repos recoverable for 90 days)
3. If local clones exist: push clean version from local clone
4. If automated mirror exists: restore from Backblaze mirror
5. Notify affected client of delay + estimated recovery time
6. Root cause analysis: how did this happen? Prevent recurrence.

**RTO:** 2 hours

---

### DR-02: Supabase Database Data Loss

**Detection:** Application errors, missing records, corrupted data

**Recovery Steps:**
1. Immediately take application offline (to prevent further writes to corrupted state)
2. Assess scope: which tables, how many records, what time period?
3. Identify last clean backup point
4. Restore via Supabase PITR dashboard
5. If PITR unavailable: restore from weekly CSV export (manual re-import)
6. Verify restored data against known record counts
7. Bring application back online with monitoring
8. Notify affected users if their data was impacted

**RTO:** 4 hours
**RPO:** 24 hours (daily backup window)

---

### DR-03: Primary Workstation Loss (Fire, Theft, Failure)

**Detection:** Computer inaccessible or destroyed

**Recovery Steps:**
1. All code is on GitHub — accessible from any machine immediately
2. All design files are in Figma cloud — accessible from any machine
3. All docs are in Notion — accessible from any machine
4. Purchase or borrow replacement hardware
5. Install development environment (see onboarding setup checklist)
6. Clone all active repos from GitHub
7. Resume work — expected full productivity in 4–8 hours

**RTO:** 4–8 hours
**Data loss risk:** Minimal if daily push discipline is maintained

---

### DR-04: Ransomware / Malware Infection

**Detection:** Files encrypted, unusual system behavior, ransom demand

**Immediate Response (0–30 min):**
1. Disconnect infected machine from all networks immediately
2. Do NOT pay ransom without consulting cyber insurance provider
3. Notify CEO and security contact immediately
4. Isolate: identify what systems were touched
5. Document: screenshot ransom message (for insurance/law enforcement)

**Recovery Steps:**
1. Wipe infected machine — do not try to salvage
2. Restore all data from cloud sources (GitHub, Figma, Notion, Supabase)
3. Change ALL passwords from a clean device
4. Enable MFA on all accounts
5. Contact cyber insurance provider
6. File police report (for insurance purposes)
7. Notify affected clients if their data was accessed

**RTO:** 24–48 hours
**Key protection:** All critical data in cloud means ransomware affects local files only, not primary data stores.

---

### DR-05: Vercel / Hosting Outage (Client Sites Down)

**Detection:** Client sites returning 5xx errors; Vercel status page shows incident

**Response:**
1. Confirm it's Vercel platform issue (not our code) via status.vercel.com
2. Notify affected clients proactively: "Your site is experiencing a brief outage due to a platform issue at our hosting provider. We're monitoring and expect restoration shortly."
3. If outage >2 hours: assess emergency migration options (Netlify failover, Cloudflare Pages)
4. Do NOT make code changes during platform outage — wait for restoration
5. Once restored: verify all client sites fully operational

**RTO:** Depends on Vercel restoration (typically <2 hours for major incidents)

---

## Recovery Runbook Location

Detailed step-by-step runbooks for each DR scenario are maintained in Notion:
```
RCS Operations Hub
└── Security & Continuity
    ├── DR Runbooks
    │   ├── DR-01: GitHub Recovery
    │   ├── DR-02: Database Recovery
    │   ├── DR-03: Workstation Loss
    │   ├── DR-04: Ransomware
    │   └── DR-05: Hosting Outage
    └── Incident Log
```

---

## DR Testing Schedule

| Test | Frequency | Method | Owner |
|------|-----------|--------|-------|
| Database restore test | Quarterly | Restore to staging from latest backup | Lead Engineer |
| GitHub repo clone test | Monthly | Clone active repo to temp location | Lead Engineer |
| Workstation recovery simulation | Annual | Set up new machine from scratch | Lead Engineer |
| Backup verification | Monthly | Spot-check 3 files across backup sources | CTO |
| BCP tabletop | Annual | Walk through 2 DR scenarios with team | CEO + CTO |

---

## Future Improvements

- Automated backup verification (hash check) by Year 2
- Geographic backup distribution (primary + secondary cloud regions) by Year 2
- Cyber insurance policy with DR coverage by Year 2
- Dedicated backup tool (Backblaze B2 or AWS S3 lifecycle) by Year 2
- Formal DR test report template by Year 2
