# Brand Violation Prevention System
**Roman Creative Studio — Brand Governance System**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

Define how brand inconsistencies are identified, classified, and corrected. A governance system is only as strong as its enforcement. This document is the operational backbone of brand quality control at Roman Creative Studio.

> **Every violation, left uncorrected, becomes the new standard. Act on all violations.**

---

## 1. How Violations Are Identified

### Identification Sources

| Source | Description |
|--------|-------------|
| **Pre-launch QA** | Mandatory review before any page, document, or asset is released (see `docs/operations/QAChecklist.md`) |
| **Peer review** | Second set of eyes on any client-facing deliverable |
| **Periodic audits** | Scheduled brand audits (see Audit Schedule below) |
| **Client/team reports** | Anyone may and should flag a suspected violation |
| **Accessibility scans** | Automated tools (axe, WAVE, Lighthouse) flag accessibility violations |
| **Post-launch review** | 48-hour review after any significant publish |

### What to Look For (Violation Triggers)

**Visual triggers:**
- A color not matching the brand palette
- A font other than Cormorant Garamond, Inter, or JetBrains Mono
- A spacing value that feels "off" (likely not using the token system)
- A logo that looks stretched, rotated, recolored, or incorrectly placed
- A button that doesn't match the defined button variants
- Two Primary buttons in the same section
- Two gold accent elements in the same section

**Content triggers:**
- A prohibited buzzword or phrase
- A tone that doesn't match the channel
- A CTA that doesn't match the approved CTA library
- Missing or vague alt text on images
- A heading hierarchy that skips levels

**Technical triggers:**
- Hardcoded color values in CSS
- Hardcoded pixel values for typography or spacing
- An image not using a `--color-*` token
- Missing focus states on interactive elements
- Contrast ratio below 4.5:1 for body text
- Missing alt text on informational images

---

## 2. Violation Classification System

### Severity Level 1: CRITICAL

**Definition:** The violation directly harms the brand, accessibility, or legal standing. Blocks release or requires immediate rollback.

| Example | Why Critical |
|---------|-------------|
| Logo used on a background it fails contrast on | Brand integrity + accessibility |
| Contrast ratio fails WCAG AA for body text | Legal accessibility risk |
| Wrong domain (`romancreativestudio.com` instead of `.co`) | Misdirects users, undermines credibility |
| Incorrect pricing on client-facing document | Legal and financial risk |
| Outdated logo version on live production | Brand integrity |
| Missing alt text on informational images (live site) | Legal accessibility risk |
| Hardcoded email address that bounces | Business continuity |

**Action:** Fix before release. If already live: hotfix within 24 hours.

---

### Severity Level 2: MAJOR

**Definition:** The violation significantly degrades brand consistency or quality but does not create immediate legal or safety risk.

| Example | Why Major |
|---------|----------|
| Wrong font used in a client deliverable | Brand inconsistency |
| Hardcoded color values in production CSS | Breaks token system, causes drift |
| Two Primary buttons in the same section | Dilutes conversion hierarchy |
| Prohibited buzzword in website headline | Undermines brand positioning |
| Missing focus state on an interactive element | Accessibility barrier |
| Social post using non-brand colors | Visual identity inconsistency |
| Logo used below minimum size (illegible) | Brand integrity |
| Component built from scratch instead of reusing system component | Design system integrity |

**Action:** Fix before the next release cycle. If already live: fix within the next planned deploy (maximum 1 week).

---

### Severity Level 3: MINOR

**Definition:** The violation represents a deviation from best practices or advisory guidelines that doesn't significantly impact quality.

| Example | Why Minor |
|---------|----------|
| AAA contrast failing (AA still passing) | Advisory — still meets minimum |
| Caption text at 11px (1px below minimum) | Very small deviation |
| Social post missing logo watermark | Minor brand inconsistency |
| File named incorrectly (not critical) | Process issue |
| Image not WebP (but still optimized JPEG) | Suboptimal format |
| Advisory tone mismatch on low-stakes internal content | Voice consistency |

**Action:** Document and schedule. Fix in next batch update. Does not block release.

---

## 3. Violation Correction Workflow

### Step 1: Flag
Anyone who identifies a violation should:
- Take a screenshot or note the location (URL, file name, component name)
- Note the violation type and suspected severity
- Report it (see Reporting Channels below)

### Step 2: Classify
The brand lead reviews the flagged issue and assigns a severity level (1, 2, or 3).

### Step 3: Assign
- Level 1: Assigned immediately. Fix required before any other work.
- Level 2: Assigned to next available slot. Fix within 1 week.
- Level 3: Added to backlog. Addressed in batch.

### Step 4: Fix
The responsible party makes the correction following the appropriate governance document.

### Step 5: Verify
A second person verifies the fix is correct before marking it resolved.

### Step 6: Document
The fix is documented:
- What was wrong
- What was changed
- When it was fixed
- What governance rule it violated

### Step 7: Review for Systemic Cause
If the same violation type appears more than twice, it is a systemic issue:
- Identify the root cause (unclear documentation? missing training? process gap?)
- Update the relevant governance document
- Brief the team

---

## 4. Reporting Channels

| Reporter | Reporting Method |
|----------|----------------|
| Internal team member | Flag directly to brand lead |
| Contractor / freelancer | Flag via project channel |
| Anyone | Note in the project's QA log |

No violation report is "too small" to log. Pattern recognition across minor violations often reveals major systemic issues before they compound.

---

## 5. Approval Workflow for Changes

Not all changes require the same level of approval. This matrix defines when approval is required:

| Change Type | Approval Required | Approver |
|------------|------------------|----------|
| Text edit (copy correction, typo fix) | No | Self-review |
| New blog post / social post | Peer review | Any team member |
| New page or landing page | Brand review | Brand lead |
| New component added to design system | Design system review | Brand lead |
| New color token | Brand amendment | Brand lead |
| Logo modification | Executive approval | Alexander |
| Brand system update (Phase 3.0+) | Full brand review | Alexander |
| Typography system change | Brand amendment | Alexander |
| New font addition | Prohibited without formal amendment | Alexander |

---

## 6. Brand Audit Schedule

Periodic proactive audits catch drift before it compounds.

| Audit Type | Frequency | Covers |
|-----------|-----------|--------|
| Website brand audit | Quarterly | All pages: colors, fonts, spacing, components, logo, CTAs |
| Social media audit | Monthly | Profile images, banner, recent posts, bio |
| Document template audit | Bi-annually | Proposals, contracts, invoices, presentations |
| Accessibility audit | Quarterly | Automated + manual checks |
| Content/voice audit | Bi-annually | Website copy, email templates, proposal language |
| Full brand system audit | Annually | Cross-reference all documents against visual identity system |

### Audit Output

Each audit produces a short report:
- Date of audit
- Areas reviewed
- Violations found (severity, location)
- Violations already resolved
- Recommendations

---

## 7. Zero-Tolerance Violations

The following violations are never acceptable and require immediate correction regardless of context:

1. Incorrect domain (`.com` instead of `.co`)
2. Wrong contact email
3. Logo on a failing contrast background
4. Completely missing alt text on an informational image (live site)
5. Website content referencing wrong pricing
6. Competitor logo or name used in an inaccurate comparison
7. Outdated logo version on any live client-facing touchpoint

---

## Related Documents
- `docs/brand-governance/BrandConsistencyRules.md` — What the rules are
- `docs/brand-governance/AccessibilityGovernance.md` — Accessibility violation standards
- `docs/brand-governance/DesignSystemGovernance.md` — Design system violation rules
- `docs/operations/QAChecklist.md` — Pre-launch quality gate
- `docs/brand-governance/BrandEvolutionRules.md` — When changes are allowed
