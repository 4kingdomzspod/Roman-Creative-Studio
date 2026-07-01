# Client Reporting Standards

**Owner:** Alexander Roman / CEO  
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Status:** Template Defined — Delivery System Pending

---

## Purpose

Design the premium monthly reporting system for Care Plan clients. Define the report structure, data requirements, delivery process, tone standards, and automation architecture. Reports should communicate the tangible value of the Care Plan relationship and strengthen client retention.

---

## Business Value

Care Plan clients who receive clear, professional monthly reports churn at a significantly lower rate. The report is not administrative overhead — it is a retention tool, a trust builder, and proof that the $197–$997/mo investment is justified. A great report turns a client into an advocate.

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
- **Format:** PDF (Resend email) + portal display (client portal reports tab)
- **From:** `Alexander@romancreativestudio.co`
- **Subject line:** `[Client Name] — [Month Year] Website Report`
- **Tone:** Professional but warm; data-forward; action-oriented
- **Length:** 6–10 pages (PDF); summary card in portal

---

## Report Sections

---

### Section 1 — Executive Summary

**Included in:** All tiers  
**Content:**
- 2–3 sentences summarizing the month in plain English
- Top 3 wins for the month
- 1 challenge or opportunity identified
- Overall website health status: Green / Amber / Red

**Tone example:**
> "Your website had a strong month in June. Organic traffic increased 18% compared to May, and you received 14 contact form submissions — your highest ever. The one area to watch is your mobile load time, which we're addressing this month."

---

### Section 2 — Traffic Report

**Included in:** All tiers  
**Data source:** Google Analytics 4  
**Content:**

| Metric | This Month | Last Month | Change |
|--------|------------|------------|--------|
| Total Sessions | | | |
| Organic Sessions | | | |
| Direct Sessions | | | |
| Referral Sessions | | | |
| New vs Returning (%) | | | |

- Top 5 pages by sessions
- Traffic source breakdown (pie chart)
- Notable traffic events (viral post, new referral, etc.)

**Interpretation note:** Include 1–2 sentences explaining what the numbers mean, not just what they are.

---

### Section 3 — SEO Report

**Included in:** All tiers  
**Data sources:** Google Search Console, (SEO Retainer+) Ahrefs/SEMrush  
**Content (Care Plan):**
- Total impressions this month
- Total clicks from search
- Average CTR
- Average position
- Top 5 ranking keywords

**Additional content (SEO Retainer+):**
- Keyword rank change table (target keywords: position this month vs last)
- New keywords entering top 20
- Declining keywords (with investigation notes)
- Backlinks acquired this month
- Competitor visibility comparison

---

### Section 4 — Conversions Report

**Included in:** All tiers  
**Data source:** Google Analytics 4  
**Content:**

| Conversion | Count | vs Last Month |
|------------|-------|---------------|
| Contact form submissions | | |
| Phone clicks | | |
| Email link clicks | | |
| Resource downloads | | |
| Booking page visits | | |

- Conversion rate: form submits / total sessions
- Best-converting page this month
- CTA performance (which buttons get the most clicks)

---

### Section 5 — Accessibility Report

**Included in:** All tiers  
**Data source:** Lighthouse CI (automated monthly run)  
**Content:**
- Lighthouse Accessibility score (0–100)
- WCAG 2.1 AA status: Pass / Needs Attention
- Issues found (if any) + resolution status
- Score trend (last 3 months)

**Standard note (if score 95+):**
> "Your website meets WCAG 2.1 AA accessibility standards this month. This means visitors with disabilities can use your site, and you're protected from accessibility-related legal risk."

---

### Section 6 — Performance Report

**Included in:** All tiers  
**Data source:** Lighthouse CI, Search Console Core Web Vitals  
**Content:**

| Metric | Desktop | Mobile | Status |
|--------|---------|--------|--------|
| Performance Score | | | Pass/Fail |
| LCP (Largest Contentful Paint) | | | Pass/Fail |
| INP (Interaction to Next Paint) | | | Pass/Fail |
| CLS (Cumulative Layout Shift) | | | Pass/Fail |
| Page Size | | | |
| Load Time (3G) | | | |

- Performance trend (last 3 months)
- Any performance improvements made this month

---

### Section 7 — Security Report

**Included in:** All tiers  
**Data source:** Cloudflare, manual checks  
**Content:**
- SSL certificate status and expiry date
- Security headers status
- Cloudflare security events (blocked requests, if applicable)
- Software update status (if client has a CMS)
- Last backup date and status

---

### Section 8 — Website Care Activity

**Included in:** All tiers  
**Data source:** Internal project management system  
**Content:**
- List of all work completed this month under the Care Plan
- Each item: what was done, why, time spent
- Total hours used vs plan allotment (if hour-limited plan)

**Example:**
```
• Updated homepage hero copy per your request (Jun 15) — 45 min
• Fixed contact form not sending on mobile Safari (Jun 18) — 1.5 hours
• Optimized 3 homepage images for faster load (Jun 22) — 30 min
• Monthly SEO meta description review — 1 hour
Total: 3 hours 45 min
```

---

### Section 9 — Recommendations

**Included in:** All tiers  
**Content:**
- 2–3 specific, actionable recommendations for next month
- Prioritized by impact
- Each recommendation: what to do, why, estimated impact

**Format:**
```
Recommendation 1: [Title]
What: [One sentence action]
Why: [Data-backed reason]
Impact: [Expected improvement]
Priority: High / Medium / Low
```

---

### Section 10 — Next Month Goals

**Included in:** SEO Retainer + Growth Partner  
**Content:**
- 3–5 specific goals for the coming month
- Each with a measurable target
- Linked to the recommendations from Section 9

---

### Section 11 — Quarterly Roadmap

**Included in:** Growth Partner only  
**Content:**
- What's planned for the next 3 months
- Quarterly theme (e.g., "Q3: Local SEO Expansion")
- Key milestones with estimated dates
- Dependencies (client actions required)

---

### Section 12 — Annual Progress

**Included in:** Growth Partner only (delivered in December + June)  
**Content:**
- Year-to-date metric summaries
- Progress toward annual goals set at engagement start
- Website evolution timeline (what's changed since we started)
- Business impact narrative

---

## Report Generation Process

### Manual Process (Current)
```
Step 1: Pull GA4 data for prior month (first business day)
Step 2: Pull Search Console data
Step 3: Run Lighthouse audit on homepage + 3 key pages
Step 4: Check SSL and security headers
Step 5: Compile work log from project management system
Step 6: Write narrative summaries in Google Doc template
Step 7: Export to PDF
Step 8: Send via email + upload to client portal
Estimated time: 90–120 minutes per client
```

### Automated Process (Phase 2 — Month 3+)
```
Step 1: Scheduled Supabase Edge Function pulls all data sources
Step 2: Data structured into JSON report object
Step 3: Claude API (claude-haiku-4-5) generates narrative summaries
Step 4: Next.js report renderer generates PDF via Puppeteer
Step 5: PDF stored in Supabase Storage
Step 6: Resend delivers email with PDF attachment
Step 7: Client portal `reports` tab updated automatically
Estimated time: <5 minutes per client, 0 human effort
```

---

## Report Tone Guide

| Do | Don't |
|----|-------|
| Use plain English | Use technical jargon |
| Explain what numbers mean | List numbers without context |
| Celebrate wins genuinely | Oversell mediocre results |
| Be honest about challenges | Hide problems |
| Give specific next steps | Give vague suggestions |
| Reference the client's business | Be generic |
| Use active voice | Use passive voice |

---

## Report Design Standards

- **Branding:** RCS gold + charcoal; client's logo in header
- **Typography:** Inter (body), Plus Jakarta Sans (headings)
- **Color coding:** Green (positive), Amber (watch), Red (needs attention)
- **Charts:** Bar charts for trends; pie/donut for breakdowns; simple tables for data
- **Logo placement:** RCS logo bottom footer; client logo top header
- **Page count:** Target 6–10 pages (no padding, no fluff)

---

## Client Report Template Files

```
docs/templates/
  ClientReport-CarePlan.md          (Care Plan template)
  ClientReport-SEORetainer.md       (SEO Retainer template)
  ClientReport-GrowthPartner.md     (Growth Partner template)
  ClientReport-AnnualReview.md      (Annual review template)
```

*(Templates to be created as part of Phase 8C implementation)*

---

## Technical Notes

- PDF generation: Puppeteer (headless Chrome) or React-PDF
- Report storage: Supabase Storage bucket `client-reports` (private, RLS-protected)
- Portal access: client sees reports tab listing all their reports by month
- Report data retention: indefinite (reports are business records)
- Lighthouse automation: GitHub Actions workflow runs monthly on 1st of month

---

## Future Enhancements

- [ ] Video report option: Loom walkthrough of key findings (Growth Partner tier)
- [ ] Interactive HTML report (not just PDF) with live chart data
- [ ] Client report portal with year-over-year comparison view
- [ ] Benchmark comparison: "Your traffic grew 18% vs industry average of 5%"
- [ ] Client satisfaction survey embedded in report (1-question NPS)

---

## Related Documents

- `KPIDefinitions.md` — metric definitions used in reports
- `AIAutomationFramework.md` — AI automation for report generation (AUTO-09)
- `ClientPortalArchitecture.md` — portal report delivery system
- `CommunicationStandards.md` — report tone and delivery standards
- `IntegrationReadiness.md` — GA4, Search Console, Lighthouse integrations
