# Security & Privacy Standards

**Owner:** Alexander Roman / Technical Lead
**Version:** 1.0
**Last Updated:** 2026-07-01
**Status:** Standards Defined — Implementation Pending

---

## Purpose

Document the security and privacy standards for all Roman Creative Studio systems — website, client portal, internal dashboard, and business operations.

## Security Principles

1. **Least privilege** — every system, user, and service gets only the access it needs
2. **Defense in depth** — multiple layers; no single point of failure
3. **Secrets never in code** — API keys, passwords, tokens in environment variables only
4. **Encrypt in transit and at rest** — all data encrypted everywhere
5. **Audit everything** — every authentication and data access event is logged
6. **Privacy by design** — collect only what's needed; delete when no longer needed

---

## 1. Authentication

### Client Portal (portal.romancreativestudio.co)

**Phase 1 — Magic Link:** Client enters email → Supabase sends magic link (15-min expiry) → Session created (httpOnly cookie, 8-hr expiry) → RLS enforces data access by client_id

**Phase 2 — Password + MFA:**
- Password: minimum 12 chars, 1 uppercase, 1 number, 1 symbol
- TOTP MFA required for all client accounts
- Account lockout: 5 failed attempts → 15-minute lockout
- Backup codes: 8 single-use codes on MFA setup

**Phase 3 — SSO (Future):** Google OAuth, scope: `openid email profile` only

### Internal Dashboard (admin.romancreativestudio.co)
- Email + password + TOTP MFA **mandatory** — cannot be bypassed
- Session timeout: 2 hours of inactivity
- All admin actions logged to `audit_log` table

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

```sql
-- Clients can only read their own project data
CREATE POLICY "clients_own_projects" ON projects
  FOR SELECT USING (
    auth.uid() = client_user_id
    OR EXISTS (SELECT 1 FROM rcs_team WHERE user_id = auth.uid())
  );

-- Clients can only read their own invoices
CREATE POLICY "clients_own_invoices" ON invoices
  FOR SELECT USING (
    auth.uid() IN (SELECT client_user_id FROM projects WHERE id = project_id)
  );
```

### API Authorization
- All API endpoints require a valid JWT (issued by Supabase Auth)
- Service role key is **never** exposed to the client browser
- Webhook endpoints verify HMAC signatures before processing

---

## 3. Secrets Management

| Environment | Secrets Storage |
|------------|----------------|
| Local development | `.env.local` (gitignored) |
| Vercel (Portal/Admin) | Vercel Environment Variables |
| GitHub Actions | GitHub Repository Secrets |
| Production notes | 1Password vault |

**What Is Never Allowed:** API keys in source code, commit history, documentation files, or client-side JavaScript bundles; sharing API keys over email or Slack.

### `.gitignore` Requirements
```
.env, .env.local, .env.production, .env.staging, *.pem, *.key, secrets/
```

### Secret Rotation Schedule
| Secret Type | Rotation Frequency |
|------------|-------------------|
| API keys (all services) | Every 90 days |
| Supabase JWT secret | Every 180 days |
| Admin password | Every 90 days |
| Contractor access tokens | On offboarding |

---

## 4. Encryption

- **In Transit:** TLS 1.2 minimum (1.3 preferred); Cloudflare for `romancreativestudio.co`; Vercel for portal/admin; HSTS enabled
- **At Rest:** Supabase AES-256 (managed); Stripe PCI-DSS compliant (card data never touches RCS servers); Google Workspace AES-128
- **Passwords:** Never stored — Supabase Auth handles hashing (bcrypt)
- **Payment data:** Tokenized by Stripe — RCS stores only `stripe_customer_id`

---

## 5. Data Privacy

### Data We Collect

| Data Type | Source | Retention |
|-----------|--------|-----------|
| Name, email, phone | Contact form | Until requested deletion |
| Business name, URL | Contact form | Duration of relationship |
| Project files | Client uploads | 12 months post-launch |
| Payment info | Stripe | Per Stripe's retention |
| Website analytics | GA4 | 14 months (GA4 default) |
| Email engagement | MailerLite | Until unsubscribe |

### Data Subject Rights (GDPR Readiness)
| Right | Response Process |
|-------|----------------|
| Access | CSV export of all contact data within 30 days |
| Correction | Update records on written request |
| Deletion | Remove from all systems within 30 days |
| Portability | JSON or CSV export |
| Objection | Remove from marketing lists immediately |

---

## 6. Privacy Policy Considerations

The privacy policy at `romancreativestudio.co/privacy.html` must cover: what we collect, why, who we share it with, how long we keep it, your rights, contact for privacy requests (`Alexander@romancreativestudio.co`), cookie policy (GA4 only; no advertising cookies), last updated date.

**Cookie Consent:** GA4 uses cookies — banner required for EU/UK visitors; defer GA4 until accepted.

---

## 7. Backups

| Data | Method | Frequency | Retention |
|------|--------|-----------|-----------|
| Supabase database | Point-in-Time Recovery | Continuous | 7 days (Free) / 30 days (Pro) |
| Client project files | Google Drive sync | Real-time | Indefinite |
| Website source code | GitHub | On every commit | Indefinite |
| Business documents | Google Drive | Manual weekly | Indefinite |

---

## 8. Vulnerability Management

**Dependency Updates:** Review `npm audit` before each deployment; update packages monthly.

**Security Headers (all pages):**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

**XSS Prevention:** Never use `innerHTML` with user-provided content; sanitize all input server-side; use parameterized queries (Supabase ORM).

---

## 9. Incident Response

### Severity Levels
| Level | Example | Response Time |
|-------|---------|---------------|
| P1 Critical | Database compromised, credentials leaked | Immediate |
| P2 High | Failed login spike, suspicious API calls | 1 hour |
| P3 Medium | Misconfigured CORS, weak CSP | 24 hours |
| P4 Low | Missing security header | 1 week |

### P1 Playbook
1. **CONTAIN (0-15 min):** Rotate all API keys; revoke all sessions; take affected system offline; change admin passwords
2. **ASSESS (15-60 min):** Review audit logs for extent of access; identify data potentially accessed; determine entry point
3. **NOTIFY (1-4 hrs):** Notify affected clients if their data was involved; EU GDPR: notify within 72 hours
4. **REMEDIATE (same day):** Patch vulnerability; redeploy with fix; restore from backup if needed
5. **DOCUMENT (24 hrs):** Write incident report; update security standards

Incident log: `docs/business-systems/incidents/YYYY-MM-DD-incident-description.md`

---

## 10. Disaster Recovery

| System | RTO (Max Downtime) | RPO (Max Data Loss) |
|--------|-------------------|-----------------------|
| Website (static) | 15 minutes | 0 (GitHub is source of truth) |
| Client Portal | 4 hours | 1 hour (Supabase PITR) |
| Internal Dashboard | 8 hours | 1 hour |
| Email | 4 hours | Near-zero |

**Website Down:** Check GitHub/Cloudflare status → if GitHub Pages down, enable Cloudflare cache → if DNS issue, verify A record in Cloudflare.

---

## 11. Contractor & Third-Party Security

- Contractors receive minimum-privilege access only; provisioned per-project, revoked on completion
- Contractors never receive production API keys or admin credentials
- Signed NDA required before any access is provisioned
- New services must be: SOC 2 Type II (or equivalent), GDPR-compliant, data in US/EU, 2+ years in operation

**Related Documents:** IntegrationReadiness.md, ClientPortalArchitecture.md, InternalDashboardArchitecture.md, AutomationRoadmap.md
