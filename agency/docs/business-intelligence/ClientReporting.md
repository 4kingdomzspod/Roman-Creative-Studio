# Client Reporting Standards

**Owner:** Alexander Roman / CEO  
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Status:** Template Defined — Delivery System Pending

---

## Purpose

Design the premium monthly reporting system for Care Plan clients. Define the report structure, data requirements, delivery process, tone standards, and automation architecture.

---

## Report Tiers

| Plan | Monthly Rate | Report Depth | Delivery |
|------|-------------|--------------|----------|
| Care Plan | $197/mo | Core report (7 sections) | Email PDF + Portal |
| SEO Retainer | $497/mo | Full report (10 sections) | Email PDF + Portal + Video |
| Growth Partner | $997/mo | Executive report (12 sections) | Email PDF + Portal + Video + 30-min review call |

---

## Report Delivery Standards

- **Delivery date:** By the 5th business day of each month (covering prior month)
- **Format:** PDF (Resend email) + portal display
- **From:** `Alexander@romancreativestudio.co`
- **Subject line:** `[Client Name] — [Month Year] Website Report`
- **Tone:** Professional but warm; data-forward; action-oriented

---

## Report Generation Process

### Manual Process (Current)
```
Step 1: Pull GA4 data for prior month
Step 2: Pull Search Console data
Step 3: Run Lighthouse audit on homepage + 3 key pages
Step 4: Check SSL and security headers
Step 5: Compile work log from project management system
Step 6: Write narrative summaries
Step 7: Export to PDF
Step 8: Send via email + upload to client portal
Estimated time: 90–120 minutes per client
```

### Automated Process (Phase 2 — Month 3+)
```
Scheduled Supabase Edge Function → Claude API (claude-haiku-4-5) generates narratives
→ PDF generated → Resend delivers email → Portal updated
Estimated time: <5 minutes per client, 0 human effort
```

---

## Related Documents

- `KPIDefinitions.md` — metric definitions used in reports
- `AIAutomationFramework.md` — AI automation for report generation
- `ClientPortalArchitecture.md` — portal report delivery system
