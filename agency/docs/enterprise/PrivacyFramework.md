# Privacy Framework — Roman Creative Studio
## Enterprise Operating System | Section 7B
**Version:** 1.0
**Last Updated:** 2026-07-01
**Owner:** CEO + CISO
**Review Schedule:** Annual + when regulations change
**Dependencies:** ComplianceFramework.md, DataGovernance.md, SecurityFramework.md
**Related Documents:** RiskManagement.md

---

## Purpose

Define how Roman Creative Studio collects, stores, uses, and protects personal data — for our own website visitors, email subscribers, and clients. Establish privacy as a value, not just a compliance requirement.

**Business Value:** Privacy-respecting companies build more trust. In an era of data breaches and surveillance capitalism, being a company that handles data responsibly is a competitive advantage, especially with healthcare, legal, and financial sector clients who evaluate vendor privacy practices carefully.

---

## Privacy Principles

1. **Data Minimization:** Collect only what we need. If we don’t need it, don’t collect it.
2. **Purpose Limitation:** Data collected for one purpose is not used for another without consent.
3. **Transparency:** Tell people what we collect, why, and how. No dark patterns.
4. **User Control:** People can access, correct, and delete their data.
5. **Security by Design:** Privacy protections built into systems from the start.
6. **Accountability:** Someone is responsible for privacy at RCS (CEO, until CISO hired).

---

## Personal Data Inventory

### Data We Collect

| Data Type | Source | Purpose | Retention | Legal Basis |
|-----------|--------|---------|-----------|-------------|
| Name + Email | Contact form | Inquiry response | 3 years post-contact | Legitimate interest |
| Name + Email | Email signup | Newsletter | Until unsubscribe | Consent |
| Name + Email + Phone | Client contract | Service delivery | 7 years | Contract |
| Payment info | Stripe | Billing | Stripe manages | Contract |
| Project files/assets | Client upload | Project delivery | 12 months post-project | Contract |
| Website analytics | GA4 | Site improvement | 14 months | Legitimate interest |
| IP addresses | Server logs | Security/debugging | 30 days | Legitimate interest |
| Course/product purchase | Lemon Squeezy | License management | 7 years | Contract |
| Community profile | Circle.so | Community participation | Until account deletion | Consent |

### Data We Do NOT Collect (Policy)
- Payment card numbers (Stripe handles this; we never see it)
- Social Security Numbers
- Health information (unless HIPAA-specific engagement with DPA)
- Biometric data
- Government ID numbers
- Children’s data (under 13) — no products or services target minors

---

## Privacy Notices

### Website Privacy Policy (romancreativestudio.co/privacy)
Required contents:
- [ ] Identity of the data controller (RCS + contact)
- [ ] What data is collected
- [ ] How data is collected (forms, analytics, cookies)
- [ ] Why data is collected (purpose)
- [ ] Who data is shared with (Stripe, Google Analytics, MailerLite)
- [ ] How long data is retained
- [ ] User rights (access, correction, deletion, portability)
- [ ] How to exercise rights (email Alexander@romancreativestudio.co)
- [ ] Cookie policy reference
- [ ] Last updated date

### Cookie Consent
**Required for EU/UK visitors and best practice globally:**
- Cookie banner on first visit
- Options: Accept All | Reject Non-Essential | Manage Preferences
- Analytics cookies (GA4): opt-in required for EU visitors
- Essential cookies (session, security): no consent required
- No cookies set before consent is given

**Implementation:** Cookie consent managed via Cookieyes, CookieBot, or equivalent.

### Email Marketing Consent
- Explicit opt-in required for newsletter (no pre-checked boxes)
- Double opt-in recommended for EU subscribers
- Each email includes unsubscribe link
- Unsubscribes processed within 10 business days
- MailerLite maintains consent records

---

## Data Subject Rights

### Rights We Honor (regardless of jurisdiction)

| Right | What It Means | Our Process |
|-------|--------------|-------------|
| Access | Person can request what data we hold | Email response within 30 days |
| Correction | Person can correct inaccurate data | Update within 30 days |
| Deletion | Person can request data deletion | Delete within 30 days, confirm |
| Portability | Person can request data in machine-readable format | Provide CSV/JSON export |
| Objection | Person can object to processing | Honor within 30 days |
| Restriction | Person can request we stop using data | Restrict within 30 days |

### How to Submit a Request
All data subject requests via email: Alexander@romancreativestudio.co
Subject line: “Privacy Request — [Type]”

### Request Process
1. Receive request
2. Verify identity (email reply to the address in our system)
3. Locate all data held in our systems
4. Fulfill request (export, delete, correct)
5. Confirm completion in writing
6. Log in Privacy Request Log (Notion)

---

## Client Data Handling

### What We Receive From Clients
- Brand assets (logos, photos, copy)
- Business documents (service lists, team photos)
- Access credentials (CMS logins, hosting, analytics)
- In rare cases: customer data if building database features

### Client Data Rules
- Client data used only for the purpose agreed upon in the contract
- Client data not stored longer than needed (12 months post-project default)
- Client data not shared with any third party without client consent
- Client data stored in secure systems (Supabase, Figma, GitHub private)
- Client credentials stored only in encrypted password manager

### Data Processing Agreements (DPA)
**When required:** Any client in the EU/UK, or any client whose end users are in EU/UK.
**What it covers:** How we process personal data on behalf of the client; our security measures; deletion obligations.
**Template:** Maintained in Notion; reviewed by CLO annually.

---

## Breach Notification Policy

### Definition of a Breach
Any unauthorized access, disclosure, or loss of personal data.

### Notification Timeline
- **Internal CEO notification:** Within 1 hour of discovery
- **Assessment:** Within 24 hours (what was affected, how many people, severity)
- **GDPR (EU data):** Regulatory notification within 72 hours (to relevant supervisory authority)
- **Client notification:** After legal review; as soon as practical
- **Affected individuals:** If risk to individuals is high: without undue delay

### Notification Content
- Nature of the breach
- Data categories and approximate number of records
- Name and contact of privacy officer
- Likely consequences
- Measures taken or proposed to address the breach

---

## Data Retention Policy

| Data Category | Retention Period | Deletion Method |
|---------------|-----------------|------------------|
| Prospective client inquiries | 3 years | Email deletion + CRM removal |
| Client project files | 12 months post-project | Secure deletion from cloud storage |
| Client contracts and invoices | 7 years (tax requirement) | Secure archive |
| Newsletter subscribers | Until unsubscribe + 1 year | MailerLite deletion |
| Website analytics (GA4) | 14 months | GA4 data retention setting |
| Server/security logs | 30 days | Automated deletion |
| Employee/contractor records | 7 years post-departure | Secure archive |
| Course purchase records | 7 years | Archived per tax requirements |

---

## Privacy by Design Checklist

For every new product, feature, or system, complete before launch:

- [ ] What personal data is collected?
- [ ] Is it the minimum necessary?
- [ ] Is there a legal basis for collection?
- [ ] Is the user informed (privacy notice updated)?
- [ ] Is data encrypted in transit (HTTPS) and at rest?
- [ ] Access controls in place (who can see this data)?
- [ ] Retention period defined?
- [ ] Deletion mechanism exists?
- [ ] Vendor privacy review completed?
- [ ] DPA in place with vendor if they process personal data?

---

## Vendor Privacy Assessment

Before using any tool that handles personal data:

| Assessment Question | Acceptable Answer |
|---------------------|-------------------|
| Data stored in which jurisdiction? | US, EU, or contractually equivalent |
| Subprocessors disclosed? | Yes, list available |
| DPA available? | Yes |
| Privacy policy clear and accessible? | Yes |
| User data used for vendor’s own purposes? | No (or opt-out available) |
| Data exportable? | Yes |
| Data deleted on account closure? | Yes, within reasonable period |

---

## Future Improvements

- Formal Privacy Policy reviewed by attorney by Year 2
- Cookie consent banner implementation on romancreativestudio.co by Month 6
- Privacy training for all team members by Year 2
- Privacy impact assessments (PIA) for all new products by Year 2
- Data map maintained in Notion (all data flows documented) by Year 2
