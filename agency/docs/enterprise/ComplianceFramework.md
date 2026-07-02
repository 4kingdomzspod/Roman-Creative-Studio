# Compliance Framework — Roman Creative Studio
## Enterprise Operating System | Section 7A
**Version:** 1.0
**Last Updated:** 2026-07-01
**Owner:** CEO + CLO
**Review Schedule:** Annual + when regulations change
**Dependencies:** PrivacyFramework.md, SecurityFramework.md, DataGovernance.md
**Related Documents:** RiskManagement.md, ContractorHandbook.md (docs/team/)

---

## Purpose

Document the compliance obligations Roman Creative Studio faces as a digital agency handling client data, building websites, and operating as a US business entity. This is a governance framework, not legal advice. Engage qualified legal counsel for specific compliance decisions.

**Business Value:** Non-compliance exposes RCS and our clients to financial penalties, lawsuits, and reputational damage. Proactive compliance is cheaper than reactive legal defense. It also builds client trust — clients in regulated industries (healthcare, legal, finance) specifically seek compliant agency partners.

---

## Compliance Domains

### Domain 1: Business Entity Compliance

**Federal Requirements:**
- [ ] EIN (Employer Identification Number) obtained
- [ ] Quarterly estimated tax payments filed (April, June, September, January)
- [ ] Annual tax return filed by applicable deadline
- [ ] 1099 forms issued to contractors paid >$600/year by January 31
- [ ] W-9 forms collected from all contractors before first payment
- [ ] Business banking separation maintained (no personal account commingling)

**State Requirements:**
- [ ] State business registration current
- [ ] State sales tax obligations reviewed (digital products/SaaS may be taxable)
- [ ] State income tax obligations met
- [ ] Annual report filed with Secretary of State (varies by state)

**Annual Review:** Every January with CPA

---

### Domain 2: Privacy Compliance

#### GDPR (European Union)
**Applicability:** Applies if any website visitor or customer is in the EU — even if RCS is US-based.

**Obligations:**
- [ ] Privacy policy published on romancreativestudio.co
- [ ] Cookie consent banner deployed (for analytics cookies)
- [ ] Data processing agreements (DPA) with EU-based clients
- [ ] Right to deletion: process to delete user data on request
- [ ] Data breach notification: notify within 72 hours of discovery
- [ ] Data inventory: know what personal data we hold and where

#### CCPA (California Consumer Privacy Act)
**Applicability:** Applies if we have California users/customers.

**Obligations:**
- [ ] Privacy policy discloses data categories collected
- [ ] "Do Not Sell My Personal Information" opt-out (if applicable)
- [ ] Consumer data access requests: respond within 45 days
- [ ] Data deletion requests: process within 45 days

#### CAN-SPAM (Email Marketing)
**Applicability:** All commercial email we send.

**Obligations:**
- [ ] Physical mailing address in all marketing emails
- [ ] Clear unsubscribe mechanism in every email
- [ ] Process unsubscribes within 10 business days
- [ ] No deceptive subject lines
- [ ] MailerLite handles most of this automatically

#### COPPA (Children's Online Privacy)
**Applicability:** If any website we build targets users under 13.

**Policy:** RCS does not build websites targeting users under 13 without explicit COPPA compliance review. Flag during discovery.

---

### Domain 3: Accessibility Compliance

#### ADA Title III (Americans with Disabilities Act)
**Applicability:** Any public-facing website built by RCS.

**Our Standard:** WCAG 2.1 AA on all client deliverables. This exceeds current ADA enforcement expectations and positions clients defensively.

**Client Obligations:**
- [ ] All client contracts include WCAG 2.1 AA commitment from RCS
- [ ] Accessibility statement template provided to clients at launch
- [ ] Post-launch accessibility audit for GROW and SCALE tier clients
- [ ] Care Plans include accessibility monitoring

**Internal Obligations:**
- [ ] romancreativestudio.co maintains WCAG 2.1 AA
- [ ] All email templates are accessible
- [ ] All product marketing materials are accessible

**Litigation Risk:** ADA website lawsuits exceed 4,000/year. Every site we build WCAG-compliant is a site our clients won't get sued over.

---

### Domain 4: Intellectual Property Compliance

#### Asset Licensing
**Policy:** RCS uses only properly licensed assets in client deliverables.

**Permitted Sources:**
- Fonts: Google Fonts (open license), purchased commercial licenses
- Icons: Purchased licenses (Noun Project, Icon Scout) or open-source (MIT, Apache)
- Photography: Purchased (Unsplash Pro, Pexels Pro, Shutterstock) or client-provided
- Illustrations: Purchased licenses or custom-created
- Code libraries: MIT or Apache license (not GPL for commercial client work without review)

**Prohibited:**
- Unlicensed fonts in client deliverables
- Stock photo watermarks (never — always purchase)
- AI-generated images where training data licensing is unclear
- Copy or code from competitor sites

**License Documentation:**
- All purchased assets catalogued in Notion (Asset License Registry)
- License proof stored in Supabase Storage
- Client deliverables include asset license summary in handoff package

#### Client Work Product
- Client owns all deliverables upon final payment
- RCS retains right to display work in portfolio (contract clause)
- RCS retains rights to underlying tools, frameworks, and code libraries
- AI-generated content in deliverables: client notified; disclosed in contract

---

### Domain 5: Contract Compliance

**Minimum Contract Requirements (all client projects):**
- [ ] Scope of work defined in writing
- [ ] Payment terms and schedule specified
- [ ] Revision policy documented
- [ ] Intellectual property ownership stated
- [ ] Confidentiality clause included
- [ ] Termination clause included
- [ ] Dispute resolution method specified (arbitration recommended)
- [ ] Governing law stated (state where RCS is registered)
- [ ] Portfolio/testimonial permission (optional but recommended)

**Contractor Compliance:**
- W-9 collected before first payment
- Contractor agreement signed (IP ownership, non-solicitation, confidentiality)
- Correct 1099 issuance by January 31
- Clear IC vs. employee classification

---

### Domain 6: Data Security Compliance

**Client Data Obligations:**
- Client data handled only for the purpose disclosed
- Client credentials (logins, API keys) stored in encrypted password manager only
- Client data deleted upon project completion per data retention policy
- No client data shared with third parties without client consent

**Payment Card Compliance (PCI-DSS):**
- RCS does not store, process, or transmit payment card data
- Stripe handles all payment processing (PCI-DSS Level 1 certified)
- If client websites process payments: recommend Stripe; document in project

---

### Domain 7: Healthcare Industry Compliance (HIPAA)
**Applicability:** If we build websites for healthcare providers who handle PHI.

**RCS Policy:** We build websites for healthcare clients (dental, medical practices). We do not store or process Protected Health Information (PHI) on any RCS systems.

**When building for healthcare:**
- [ ] Confirm: does the website handle PHI? (patient portals, booking with PHI = yes)
- If PHI involved: Business Associate Agreement (BAA) required with client
- If PHI involved: HIPAA-compliant hosting required (not standard Vercel/Supabase without BAA)
- Contact forms on healthcare sites: do NOT ask for PHI (medical history, SSN, etc.)
- Analytics: use IP anonymization on GA4 for healthcare sites

---

## Compliance Calendar

| Month | Action |
|-------|--------|
| January | 1099s issued to contractors; tax prep begins |
| January | Annual compliance review with CPA |
| April | Q1 estimated taxes paid |
| April | Annual report filing (state, varies) |
| June | Q2 estimated taxes paid |
| July | Mid-year privacy policy review |
| September | Q3 estimated taxes paid |
| October | Year-end compliance planning |
| December | Review all contracts; update templates for next year |

---

## Compliance Responsibility Matrix

| Domain | Primary Owner | Secondary | Review Frequency |
|--------|--------------|-----------|------------------|
| Business entity | CEO + CPA | COO | Annual |
| Privacy (GDPR/CCPA) | CEO + CLO | CISO | Annual + on change |
| Accessibility | CTO | Creative Director | Per project |
| Intellectual property | CLO | CEO | Per project |
| Contracts | CEO + CLO | COO | Per contract |
| Data security | CISO | CTO | Quarterly |
| Healthcare (HIPAA) | CEO + CLO | CTO | Per healthcare client |

---

## Future Improvements

- Formal legal counsel relationship established by Year 2
- Compliance audit by external firm by Year 3
- SOC 2 Type I audit consideration by Year 4 (if SaaS reaches enterprise clients)
- HIPAA compliant infrastructure (if healthcare client volume grows) by Year 3
- International compliance review (UK GDPR, PIPEDA Canada) if expansion pursued
