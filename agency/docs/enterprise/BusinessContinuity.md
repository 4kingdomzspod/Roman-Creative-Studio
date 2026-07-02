# Business Continuity Plan — Roman Creative Studio
## Enterprise Operating System | Section 8
**Version:** 1.0
**Last Updated:** 2026-07-01
**Owner:** CEO + COO
**Review Schedule:** Annual (January) + after any activated incident
**Dependencies:** DisasterRecovery.md, SecurityFramework.md, SuccessionStrategy.md
**Related Documents:** RiskManagement.md, docs/team/SuccessionPlanning.md

---

## Purpose

Ensure Roman Creative Studio can continue delivering services to clients and operating as a business during and after unexpected disruptions — from power outages to cyber incidents to founder incapacitation.

**Business Value:** Disruptions are inevitable. The difference between a company that survives disruption and one that loses clients is whether they planned for it in advance. This plan ensures every team member knows what to do when something goes wrong.

---

## Business Continuity Principles

1. **Client-first:** Client commitments are protected first during any disruption
2. **Transparency:** Clients are informed of delays proactively, not reactively
3. **Redundancy:** No single point of failure for critical systems or knowledge
4. **Proportionality:** Response is scaled to the actual severity of the disruption
5. **Pre-authorization:** Emergency decisions are pre-authorized to avoid bottlenecks during crisis

---

## Threat Matrix

| Threat | Probability | Impact | Category |
|--------|-------------|--------|----------|
| Internet outage (local) | High | Medium | Operational |
| Power outage | Medium | Medium | Operational |
| Key tool/SaaS outage | Medium | Medium | Technical |
| Cloud provider outage | Low | High | Technical |
| Founder short-term illness (1–7 days) | Medium | High | Personnel |
| Founder extended absence (8–90 days) | Low | Critical | Personnel |
| Key contractor unavailable | Medium | Medium | Personnel |
| Cyber incident | Low | High | Security |
| Natural disaster (office/home) | Low | High | Operational |
| Major client cancellation | Medium | High | Financial |
| Data loss event | Low | Critical | Technical |

---

## Scenario Response Plans

### Scenario 1: Internet Outage (Local)
**Detection:** Can't load websites or send email
**Duration estimate:** Hours to 1 day

**Immediate Response (0–30 min):**
1. Diagnose: Is it ISP, router, or device?
2. Enable mobile hotspot on phone as backup
3. Notify any scheduled video calls ("Using hotspot today, may have video issues")
4. Continue work offline where possible (Figma desktop, local VS Code)

**Client Impact Management:**
- If delivery delayed >4 hours: brief email to affected client
- If meeting impacted: reschedule within 24 hours

**Recovery:** Normal operations resume when ISP restored
**RTO (Recovery Time Objective):** 2 hours (via hotspot fallback)

---

### Scenario 2: Power Outage
**Detection:** Loss of power to workspace
**Duration estimate:** Hours to 2 days

**Immediate Response:**
1. Battery backup on laptop: continue working on battery
2. Mobile hotspot: maintain internet via phone
3. Identify alternate workspace: coffee shop, library, coworking space
4. If outage >4 hours: notify affected clients of potential delay

**Alternate Workspaces (pre-identified):**
- [Coffee shop with reliable WiFi — address]
- [Library with power + WiFi — address]
- [Coworking space option — name, address]

**RTO:** 1 hour (relocate to alternate workspace)

---

### Scenario 3: Cloud/SaaS Tool Outage

**Tier 1 Tools (Critical — if down, client work stops):**
- Figma: Use desktop app cached files; notify client of delay if >4 hours
- GitHub: Work locally, push when restored; use Git bundle for urgent sharing
- Vercel: Client sites still live (CDN); no deploys until restored
- Supabase: Switch to read-only mode; queue writes for restoration

**Tier 2 Tools (Important — if down, workflow impaired):**
- Notion: Use local copy of critical SOPs; restore when back online
- MailerLite: Queue emails; send when restored
- Calendly: Send manual meeting links via email
- Stripe: Invoice via email + manual bank transfer as backup

**Tier 3 Tools (Useful — if down, minor inconvenience):**
- Slack: Use email for communication
- Zapier: Manual process the workflow temporarily
- Ahrefs: Defer SEO work until restored

**Status monitoring:** Subscribe to status pages of all Tier 1–2 tools
- status.figma.com
- githubstatus.com
- vercel-status.com
- status.supabase.com
- status.stripe.com

---

### Scenario 4: Founder Short-Term Absence (1–7 days)
**Cause:** Illness, emergency, planned leave

**Pre-Authorization (documented now):**
- Decisions up to $500: Any contractor/employee can proceed
- Client communication: Any team member can communicate within project scope
- Emergency client issue: Escalate to [backup contact: Name, email, phone]
- Payments: Pre-authorized invoices sent automatically via Stripe

**Coverage Protocol:**
- All active project statuses documented in Notion (updated weekly)
- Client contacts list with project context
- Backup point of contact notified: [Name]
- Auto-responder on email: "I'm away [dates] and will respond [date]. For urgent matters: [backup contact]"

**Client Communication Template:**
"Hi [Name], I wanted to let you know I'm briefly out of office until [date]. [Backup name] is aware of your project and can assist with any urgent questions. I'll be back on [date] and will follow up directly."

---

### Scenario 5: Founder Extended Absence (8–90 days)
**Cause:** Major illness, accident, family emergency

See docs/team/SuccessionPlanning.md for full protocol.

**Immediate Triggers (Day 1):**
1. COO or designated backup assumes operational authority
2. Client list audited: active projects, deadlines, contacts
3. Financial authority: COO + CFO can approve expenses up to $5,000
4. All contractor payments continue per existing agreements
5. Client communication sent within 24 hours (CEO medical/personal circumstances — no detail required)

**Week 1 Actions:**
- All active projects reviewed for risk
- Any at-risk deliverables: communicate timeline adjustment to client
- No new major client commitments without consultation
- Monthly retainers continue uninterrupted

**Return Protocol:**
- Structured handback: COO prepares state-of-business briefing
- CEO re-engages gradually (strategy first, then operations)

---

### Scenario 6: Key Contractor Unavailable
**Cause:** Illness, resignation, contract termination

**Prevention:**
- Maintain knowledge transfer: all work documented in Notion + GitHub
- Maintain backup contractor relationships (vetted, never activated until needed)
- Never have a single contractor responsible for >50% of active work

**Response:**
1. Assess impact: which projects are affected, what is at risk?
2. Notify affected clients proactively: "We're making a team adjustment on your project. Here's how it affects your timeline..."
3. Activate backup contractor (contact list in Notion)
4. Brief replacement on project context using documented materials
5. Review scope: can anything be deferred to reduce transition risk?

**RTO:** 5–7 business days to replacement onboarded and productive

---

### Scenario 7: Cyber Incident
See SecurityFramework.md for full incident response.

**BCP Aspect:** Client data protection during cyber incident
1. Immediately disconnect affected systems from network
2. Notify CEO and security contact within 1 hour
3. Assess what client data may be affected
4. If client data is compromised: legal review required before client notification
5. Restore from backups (see DisasterRecovery.md)
6. Document incident fully for insurance and compliance purposes

---

### Scenario 8: Natural Disaster
**Cause:** Hurricane, flood, fire, earthquake affecting primary workspace

**Immediate Response:**
1. Personal safety first — no business decision overrides personal safety
2. Activate remote work mode: all work is cloud-based and accessible from anywhere
3. Notify clients of expected delay (48-hour window)
4. Operate from alternate location or remotely

**Data Protection:** All work is in cloud (GitHub, Figma, Notion, Supabase) — hardware loss does not mean data loss if backups are current.

**Hardware Recovery:**
- Laptop insurance: verify coverage
- Temporary replacement: use any computer to access cloud tools within hours
- New hardware order: 1–2 business days

---

### Scenario 9: Major Client Cancellation
**Definition:** A client representing >20% of monthly revenue cancels

**Financial Response:**
1. Activate financial contingency plan (see CashFlow.md — Gap Scenario protocols)
2. Increase lead generation activity immediately
3. Review all expenses: defer non-essential spend
4. Assess whether freelance/consulting work can bridge the gap

**Operational Response:**
1. Exit cleanly: deliver any outstanding work; process final invoice
2. Request exit feedback (candid conversation)
3. If cancellation was due to RCS quality issue: root cause analysis and process fix

**RTO (Revenue Recovery):** 60–90 days to replace revenue stream

---

## Business Continuity Infrastructure

### Redundancy Requirements

| Asset | Primary | Backup |
|-------|---------|--------|
| Computer | Primary laptop | Tablet + Bluetooth keyboard |
| Internet | Home/office ISP | Mobile hotspot |
| Power | Grid | Battery backup |
| Storage | Cloud (GitHub, Figma, Notion) | Local Git repos |
| Communication | Slack + Email | Phone/SMS |
| Payments | Stripe | Manual bank transfer |

### Emergency Contact List (Update Quarterly)

```
Founder Emergency Contact:
  Name: [emergency contact name]
  Phone: [phone]
  Relationship: [relation]

Backup Business Contact:
  Name: [contractor or advisor name]
  Phone: [phone]
  Email: [email]
  Authority: [what they can handle]

Legal Contact:
  Name: [attorney name]
  Phone: [phone]
  Firm: [firm name]

CPA/Financial Contact:
  Name: [CPA name]
  Phone: [phone]
  For: Tax, financial emergency decisions

Cyber Insurance / IT Security:
  Provider: [name]
  Policy #: [number]
  Emergency line: [phone]
```

---

## BCP Testing

**Annual Test:** Simulate a 3-day founder absence
- Designated backup operates the business for 1 day
- Verify all documentation is sufficient
- Identify gaps and update plan

**Quarterly Check:**
- Verify emergency contacts are current
- Verify backup tools are accessible
- Verify all critical work is in cloud/documented

---

## Future Improvements

- Formal cyber insurance policy by Year 2
- Business interruption insurance review by Year 2
- Coworking space membership for workspace redundancy by Year 2
- Full BCP tabletop exercise with leadership team by Year 3
