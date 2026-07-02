# Launch System
## Roman Creative Studio — Phase 6, Document 9

---

### The Launch Philosophy

Launch is a controlled, documented, professional event — not a rushed "I'll send you the link when it's done."

The day a website goes live is the highest-visibility moment of the entire project. The client will share it with colleagues, post it on social media, and reference it in sales conversations. A launch with a broken form, a missing page, or a redirect error is not just a technical problem — it is a trust-destroying first impression for every person they show it to.

Launch is the last gate before the client's business represents itself to the world. It is treated accordingly.

---

## Section 1 — Pre-Launch Checklist

Completed the day before or the morning of launch, after all revisions are done and final approval is received.

```
PRE-LAUNCH CHECKLIST
Project:   [Name]
Date:      [Date]

APPROVALS
  [ ] Final client approval received in writing
  [ ] QA checklist 100% complete
  [ ] All revision items implemented and confirmed

DOMAIN & HOSTING
  [ ] Domain registrar access confirmed
  [ ] Hosting environment ready (GitHub Pages / Netlify / other)
  [ ] DNS propagation plan documented
    — Nameservers to update: [details]
    — A records / CNAME to update: [details]
    — Expected propagation time: 1–48 hours
  [ ] Client has been informed of potential propagation window

SSL & SECURITY
  [ ] SSL certificate configured on hosting
  [ ] HTTPS enforcement active (HTTP redirects to HTTPS)
  [ ] No mixed content warnings

FINAL CODE REVIEW
  [ ] All placeholder content removed ("Lorem ipsum", test emails, etc.)
  [ ] All staging/test links updated to live URLs
  [ ] Canonical tags updated to live domain (not staging URL)
  [ ] sitemap.xml URLs point to live domain
  [ ] robots.txt points to live sitemap URL
  [ ] noindex meta tags removed (if used on staging)
  [ ] GA4 measurement ID is production ID (not dev/test)

FORMS & INTEGRATIONS
  [ ] Contact form recipient updated to Alexander@romancreativestudio.co
  [ ] Contact form tested on live domain (submit a test)
  [ ] Any booking integration tested live
  [ ] Any third-party embeds tested live

PERFORMANCE
  [ ] Final PageSpeed run on live URL (after DNS propagates)
  [ ] Mobile performance score ≥ 75
  [ ] No new errors introduced during deployment

SEARCH ENGINE
  [ ] Google Search Console property verified for live domain
  [ ] sitemap.xml submitted to Search Console
  [ ] Request indexing on homepage via Search Console

BACKUP
  [ ] Final codebase committed and pushed to GitHub
  [ ] All design files backed up (Figma, assets)
  [ ] Project files archived in organized folder structure
```

---

## Section 2 — Deployment Steps

### For GitHub Pages (Primary Hosting)

```
Step 1: Ensure all final code is committed to main branch
  git add .
  git commit -m "Final production build — [Client Name] launch"
  git push origin main

Step 2: Verify GitHub Pages is enabled
  Settings → Pages → Source: main branch / root

Step 3: Confirm .nojekyll file is in repository root
  (prevents Jekyll processing)

Step 4: Update custom domain in GitHub Pages settings
  Settings → Pages → Custom domain: [client-domain.com]

Step 5: Update DNS at domain registrar
  For GitHub Pages custom domain:
    A records pointing to GitHub IPs:
      185.199.108.153
      185.199.109.153
      185.199.110.153
      185.199.111.153
    Or CNAME record: www → [username].github.io

Step 6: Enable "Enforce HTTPS" in GitHub Pages settings
  (available after SSL certificate is issued — may take 1–24 hours)

Step 7: Wait for DNS propagation
  Check: https://dnschecker.org with client domain

Step 8: Visit live site and run post-launch tests
```

---

## Section 3 — Post-Launch Testing

Completed immediately after DNS propagates and site is live:

```
POST-LAUNCH TESTS

[ ] Homepage loads correctly at www.[domain] and [domain] (without www)
[ ] All pages load without errors
[ ] HTTPS active — padlock visible in browser
[ ] HTTP redirects to HTTPS automatically
[ ] Contact form submits successfully on live domain
[ ] Notification email received at Alexander@romancreativestudio.co
[ ] Google Analytics live — Real-Time report shows pageview
[ ] Mobile experience confirmed on physical device
[ ] Logo and all images loading correctly
[ ] No console errors
[ ] 404 page displays correctly for invalid URLs
```

---

## Section 4 — Go-Live Confirmation to Client

Sent immediately after post-launch tests pass:

```
Subject: 🚀 [Business Name] is Live — [Domain]

Hi [First Name],

Your website is live.

[domain.com]

A few notes:
  ✓ SSL certificate active — visitors will see the secure padlock
  ✓ Analytics is tracking from this moment
  ✓ All forms are live and sending to [their email]
  ✓ DNS is fully propagated globally

NEXT STEPS
  → Share it. Post it. Update your email signature. Send it
     to your Google Business Profile. Tell everyone.
  → Your 30-day post-launch support window starts today.
     Any bugs or technical issues: reply here and I'll
     address within 24 hours.
  → We'll schedule your training session this week.

I'm proud of what we built. Congratulations.

Alexander
Roman Creative Studio
```

---

## Section 5 — Launch Anti-Patterns

| Anti-Pattern | Risk | Prevention |
|---|---|---|
| Launching on a Friday afternoon | No support available for weekend issues | Launch Monday–Wednesday only |
| Launching without written final approval | Client disputes what was launched | Require written sign-off every time |
| Sending live URL before post-launch tests | Client sees broken form or error | Test first, share second |
| Not waiting for SSL before sharing | Browser shows security warning | Enforce HTTPS before sharing link |
| Not testing forms on live domain | Forms worked on staging, not live | Always re-test forms post-deployment |
| Not submitting sitemap to Search Console | Delayed indexing | Submit on launch day |

---

## Section 6 — Launch Day Communication

**The client should be kept informed of the launch timeline:**

**Morning of launch:**
```
"We're launching [Business Name] today. I'll send you the
confirmation once DNS is fully propagated and all post-launch
checks are complete. Typically 1–4 hours from now."
```

**If propagation takes longer than expected:**
```
"DNS propagation is taking a bit longer than typical —
this is normal and outside our control. I'm monitoring it
and will send confirmation as soon as it's fully live globally.
Estimate: [updated time]."
```
