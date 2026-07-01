# Security & Privacy Standards

**Owner:** Alexander Roman / Technical Lead  
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Status:** Standards Defined — Implementation Pending

---

## Purpose

Document the security and privacy standards for all Roman Creative Studio systems — website, client portal, internal dashboard, and business operations. This document defines what we protect, how we protect it, and what to do when something goes wrong.

---

## Business Value

Clients trust RCS with their business identity, content, credentials, and customer data. A single breach can destroy that trust permanently. These standards protect clients, protect Alexander, ensure legal compliance, and form the foundation of a professional agency reputation. Security is a business asset, not a technical burden.

---

## Security Principles

1. **Least privilege** — every system, user, and service gets only the access it needs
2. **Defense in depth** — multiple layers of protection; no single point of failure
3. **Zero trust** — verify every request, trust no assumption
4. **Secrets never in code** — API keys, passwords, tokens live in environment variables only
5. **Encrypt in transit and at rest** — all data encrypted everywhere
6. **Audit everything** — every authentication and data access event is logged
7. **Privacy by design** — collect only what's needed; delete when no longer needed

---

## 1. Authentication

### Website (Static Site — romancreativestudio.co)
- No authentication required
- Forms submit via Formspree (no server-side credentials stored)
- Contact form data: stored in Formspree dashboard, forwarded to `Alexander@romancreativestudio.co`

### Client Portal (portal.romancreativestudio.co)

**Phase 1 — Magic Link Auth**
```
Client enters email → Supabase sends magic link → Client clicks link
    ↓
Supabase validates token (15-minute expiry) → Session created
    ↓
Session stored in httpOnly cookie (8-hour expiry)
    ↓
Row-level security enforces data access by client_id
```

**Phase 2 — Password + MFA**
- Password requirements: minimum 12 characters, 1 uppercase, 1 number, 1 symbol
- TOTP MFA required for all client accounts
- Recommended authenticator apps: Google Authenticator, Authy
- Backup codes: 8 single-use codes generated on MFA setup
- Account lockout: 5 failed attempts → 15-minute lockout

**Phase 3 — SSO (Future)**
- Google OAuth for clients who prefer it
- Scope: `openid email profile` only

### Internal Dashboard (admin.romancreativestudio.co)
- Email + password login required
- TOTP MFA **mandatory** — cannot be bypassed
- Session timeout: 2 hours of inactivity
- Single-user initially (Alexander only)
- All admin actions logged to `audit_log` table with timestamp and action

### Password Management
- Use 1Password or Bitwarden for all business credentials
- Never reuse passwords across services
- Rotate all API keys every 90 days
- Immediately rotate any key that may have been exposed

---

## 2. Authorization

### Role Definitions

| Role | Access Level | Systems |
|------|-------------|--------|
| RCS Admin (Alexander) | Full access | All systems |
| RCS Contractor | Read-only assigned projects | Portal (future) |
| Client Owner | Own project data only | Portal |
| Client Viewer | Read-only own project | Portal |
| Public | None | Admin/Portal |

### Row-Level Security (Supabase)

Every table in Supabase has RLS enabled. No table is publicly accessible.

```sql
-- Example: Clients can only read their own project data
CREATE POLICY "clients_own_projects" ON projects
  FOR SELECT USING (
    auth.uid() = client_user_id
    OR EXISTS (
      SELECT 1 FROM rcs_team WHERE user_id = auth.uid()
    )
  );

-- Example: Clients can only read their own invoices
CREATE POLICY "clients_own_invoices" ON invoices
  FOR SELECT USING (
    auth.uid() IN (
      SELECT client_user_id FROM projects WHERE id = project_id
    )
  );
```

### API Authorization
- All API endpoints require a valid JWT (issued by Supabase Auth)
- Service role key is **never** exposed to the client browser
- Anon key is public but all tables are RLS-protected
- Webhook endpoints verify HMAC signatures before processing

---

## 3. Secrets Management

### Where Secrets Live

| Environment | Secrets Storage |
|------------|----------------|
| Local development | `.env.local` file (gitignored) |
| Vercel (Portal/Admin) | Vercel Environment Variables |
| GitHub Actions | GitHub Repository Secrets |
| Production notes | 1Password vault |

### What Is Never Allowed
- API keys in source code
- API keys in commit history
- API keys in documentation files
- API keys in client-side JavaScript bundles
- Sharing API keys over email or Slack

### `.gitignore` Requirements
```
.env
.env.local
.env.production
.env.staging
*.pem
*.key
secrets/
```

### Secret Rotation Schedule
| Secret Type | Rotation Frequency |
|------------|-------------------|
| API keys (all services) | Every 90 days |
| Supabase JWT secret | Every 180 days |
| Stripe webhook secret | On any suspected exposure |
| Admin password | Every 90 days |
| Contractor access tokens | On offboarding |

### Emergency Key Rotation (If Exposed)
1. Rotate the key immediately in the service dashboard
2. Update environment variables in all deployment platforms
3. Redeploy all affected applications
4. Check audit logs for any unauthorized usage
5. Document the incident in the incident log

---

## 4. Encryption

### In Transit
- All connections use TLS 1.2 minimum (TLS 1.3 preferred)
- Cloudflare handles SSL termination for `romancreativestudio.co`
- Vercel handles SSL for `portal.*` and `admin.*`
- HTTP requests are automatically redirected to HTTPS
- HSTS header enabled with `max-age=31536000; includeSubDomains`

### At Rest
- Supabase: AES-256 encryption at rest (default, managed by Supabase)
- Stripe: PCI-DSS compliant storage (card data never touches RCS servers)
- Google Workspace: AES-128 encryption at rest
- Vercel: Encrypted environment variable storage

### Sensitive Data Handling
- Passwords: Never stored — Supabase Auth handles hashing (bcrypt)
- Payment data: Tokenized by Stripe — RCS stores only `stripe_customer_id`
- Client credentials (hosting passwords, etc.): Stored in encrypted 1Password vault only

---

## 5. Data Privacy

### Data We Collect

| Data Type | Source | Purpose | Retention |
|-----------|--------|---------|----------|
| Name, email, phone | Contact form | Sales follow-up | Until requested deletion |
| Business name, URL | Contact form | Project scoping | Duration of relationship |
| Project files | Client uploads | Project delivery | 12 months post-launch |
| Payment info | Stripe | Billing | Per Stripe's retention |
| Website analytics | GA4 | Traffic analysis | 14 months (GA4 default) |
| Session data | Supabase Auth | Security/access | 30 days after expiry |
| Email engagement | MailerLite | Marketing | Until unsubscribe |

### Data We Do Not Collect
- Social Security Numbers
- Government ID numbers
- Health or medical information
- Financial account numbers (beyond Stripe tokens)
- Children's data (no service to under-18)

### Data Subject Rights (GDPR Readiness)
Even operating primarily in the US, RCS should be prepared for:

| Right | Response Process |
|-------|----------------|
| Access | Provide CSV export of all contact data within 30 days |
| Correction | Update records on written request |
| Deletion | Remove from all systems within 30 days of request |
| Portability | Provide data export in JSON or CSV format |
| Objection to processing | Remove from marketing lists immediately |

### Data Deletion Process
1. Receive deletion request via `Alexander@romancreativestudio.co`
2. Locate data in: Supabase, MailerLite, HubSpot, GA4, Formspree
3. Delete from each system
4. Confirm deletion to requestor in writing
5. Note deletion in `audit_log`

---

## 6. Privacy Policy Considerations

The privacy policy at `romancreativestudio.co/privacy.html` (to be created) must cover:

### Required Sections
1. **What we collect** — name, email, business info, analytics, cookies
2. **Why we collect it** — sales, project delivery, communication, analytics
3. **Who we share it with** — Formspree, MailerLite, Stripe, GA4, Supabase
4. **How long we keep it** — retention table above
5. **Your rights** — access, correction, deletion, objection
6. **Contact for privacy requests** — `Alexander@romancreativestudio.co`
7. **Cookie policy** — GA4 analytics cookies; no advertising cookies
8. **Last updated date** — must be kept current

### Cookie Consent
- GA4 uses cookies — a cookie consent banner is legally required for EU/UK visitors
- Implement a simple consent banner that defers GA4 loading until accepted
- For US-only targeting, consent banner is recommended but not legally required

---

## 7. Backups

### What Gets Backed Up

| Data | Backup Method | Frequency | Retention |
|------|--------------|-----------|----------|
| Supabase database | Supabase Point-in-Time Recovery | Continuous | 7 days (Free), 30 days (Pro) |
| Client project files | Google Drive sync | Real-time | Indefinite |
| Website source code | GitHub | On every commit | Indefinite |
| Business documents | Google Drive | Manual weekly | Indefinite |
| Email (Google Workspace) | Google Vault (optional) | Continuous | Per policy |

### Backup Testing
- Test Supabase restore process quarterly
- Verify GitHub repository can be cloned and deployed
- Confirm Google Drive files accessible from a different device monthly

### Backup Access
- Supabase backups: accessible in Supabase dashboard
- GitHub: remote origin always serves as offsite backup
- Google Drive: accessible via browser from any device with Google account access

---

## 8. Vulnerability Management

### Dependency Updates
- Review `npm audit` output before each project deployment
- Update npm packages monthly (or when a critical CVE is published)
- Subscribe to security advisories for: Next.js, Supabase client, Stripe.js

### Security Headers
All pages served by RCS should include:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Content Security Policy (Portal/Admin)
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://js.stripe.com https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://*.supabase.co https://api.stripe.com;
  frame-src https://js.stripe.com;
```

### XSS Prevention
- Never use `innerHTML` with user-provided content
- Sanitize all user input server-side before database insertion
- Use parameterized queries (Supabase ORM handles this)
- Escape all dynamic content rendered to HTML

### SQL Injection Prevention
- Use Supabase client library exclusively — no raw SQL from user input
- All query parameters pass through Supabase's prepared statement system
- RLS policies provide an additional layer of data isolation

---

## 9. Incident Response

### Incident Severity Levels

| Level | Description | Response Time | Example |
|-------|-------------|--------------|--------|
| P1 Critical | Active breach, data exposed | Immediate | Database compromised, credentials leaked |
| P2 High | Potential breach, unusual activity | 1 hour | Failed login spike, suspicious API calls |
| P3 Medium | Security misconfiguration | 24 hours | Misconfigured CORS, weak CSP |
| P4 Low | Best-practice gap | 1 week | Missing security header |

### P1 Incident Response Playbook
```
1. CONTAIN (0-15 min)
   → Rotate all API keys immediately
   → Revoke all active sessions in Supabase
   → Take affected system offline if necessary
   → Change admin passwords

2. ASSESS (15-60 min)
   → Review audit logs for extent of access
   → Identify what data was potentially accessed
   → Determine entry point

3. NOTIFY (1-4 hours)
   → Notify affected clients if their data was involved
   → If EU data subjects involved, notify within 72 hours (GDPR)

4. REMEDIATE (same day)
   → Patch the vulnerability
   → Re-deploy with fix
   → Restore from backup if data corrupted

5. DOCUMENT (24 hours)
   → Write incident report
   → Add to incident log
   → Update security standards if needed
```

### Incident Log Location
`docs/business-systems/incidents/YYYY-MM-DD-incident-description.md`

---

## 10. Disaster Recovery

### Recovery Time Objectives

| System | RTO (Max Downtime) | RPO (Max Data Loss) |
|--------|-------------------|-----------------|
| Website (static) | 15 minutes | 0 (GitHub is source of truth) |
| Client Portal | 4 hours | 1 hour (Supabase PITR) |
| Internal Dashboard | 8 hours | 1 hour (Supabase PITR) |
| Email (Google Workspace) | 4 hours | Near-zero |
| Business Documents | 24 hours | 1 week |

### Recovery Playbooks

**Website Down:**
1. Check GitHub Pages status at githubstatus.com
2. Check Cloudflare status at cloudflarestatus.com
3. If GitHub Pages down: enable Cloudflare cache to serve last-known-good version
4. If DNS issue: verify A record in Cloudflare points to correct GitHub Pages IP

**Portal/Dashboard Down:**
1. Check Vercel status at vercel-status.com
2. Check Supabase status at status.supabase.com
3. If Supabase down: portal is read-only (cached data visible, writes fail gracefully)
4. If Vercel down: no recovery action; await Vercel restoration

**Email Down:**
1. Check Google Workspace status at workspace.google.com/status
2. Temporary: use personal Gmail to notify active clients of delay
3. Once restored: no data loss expected (Google's infrastructure)

### Business Continuity
- Critical client contact info backed up in 1Password (offline accessible)
- Active project deliverables backed up to Google Drive (accessible offline)
- Alexander's personal email serves as backup contact during outages
- Client contracts stored in Google Drive AND printed/scanned copies

---

## 11. Contractor & Third-Party Security

### Contractor Access Controls
- Contractors receive minimum-privilege access only
- Access provisioned per-project, revoked immediately on project completion
- Contractors never receive production API keys or admin credentials
- Contractors work in isolated GitHub branches only
- Signed NDA required before any access is provisioned

### Third-Party Service Vetting
Before adding any new service to the stack, verify:
- [ ] SOC 2 Type II certified or equivalent
- [ ] GDPR-compliant data processing agreement available
- [ ] Data stored in US or EU (not unverified third countries)
- [ ] Security contact/bug bounty program exists
- [ ] Service has been in operation for 2+ years

---

## Future Enhancements

- [ ] Annual third-party security audit
- [ ] Bug bounty program (when portal is public)
- [ ] Penetration testing before portal launch
- [ ] SOC 2 readiness assessment (Year 2)
- [ ] Security awareness training for any contractors hired
- [ ] Automated secret scanning in GitHub Actions (detect accidentally committed keys)

---

## Related Documents

- `IntegrationReadiness.md` — API keys and environment variables per integration
- `ClientPortalArchitecture.md` — portal auth and RLS implementation
- `InternalDashboardArchitecture.md` — admin auth and MFA requirements
- `AutomationRoadmap.md` — webhook security requirements
- `DocumentManagement.md` — document retention policies
