# Brand Evolution Rules
**Roman Creative Studio — Brand Governance System**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

Define the rules that govern when, how, and by whom the Roman Creative Studio brand is allowed to evolve. A brand that never evolves becomes stale. A brand that evolves reactively becomes inconsistent. Controlled evolution is the standard: intentional, documented, and always in service of brand strength — not trend chasing.

> **The brand evolves when it should. Not when it's convenient. Not when it's trendy. When it serves the brand.**

---

## 1. When the Brand Is Allowed to Evolve

### Approved Triggers for Brand Evolution

A brand update may be initiated when one or more of the following conditions are true:

| Trigger | Description |
|---------|-------------|
| **Business evolution** | New services, new target markets, or a significant shift in positioning |
| **Audience research** | Research reveals the brand is consistently misread or misunderstood by the target audience |
| **Technology change** | A new platform or medium makes current assets technically insufficient |
| **Competitive repositioning** | A competitor has adopted similar visual language, threatening distinctiveness |
| **System inconsistency** | Accumulated exceptions and workarounds have made the system unworkable |
| **Scheduled evolution** | A version milestone (v2.0) was planned from the beginning and is now timely |

### NOT Approved Triggers

The following are explicitly not valid reasons to initiate a brand update:

- ❌ "I'm tired of how it looks"
- ❌ "This is trending right now"
- ❌ "A competitor just rebranded"
- ❌ "The client suggested we change it"
- ❌ "It would look cool to try something new"
- ❌ "My personal taste has changed"
- ❌ Seasonal re-themes (no holiday or seasonal brand variations)

---

## 2. Brand Update Qualification Test

Before any brand evolution proposal is formally reviewed, it must pass this qualification test. All five questions must have a "yes" answer:

1. **Does this change serve the business or the audience — not personal taste?**
2. **Has the current brand system been given sufficient time to work? (Minimum 12 months from last major update)**
3. **Is there documented evidence (data, research, client feedback) supporting the change?**
4. **Is the change additive or refinement rather than destructive?** (Does it extend the system rather than abandon it?)
5. **Can the change be implemented consistently across all touchpoints simultaneously?** (Partial rollouts are not allowed)

If any answer is no, the proposal is declined until conditions change.

---

## 3. What Qualifies as a "Brand Update"

Not all changes are brand updates. Understand the scope:

| Change Type | Classification | Approval Required |
|------------|---------------|------------------|
| Fixing a typo in a doc | Bug fix | Self |
| Updating a token value (color shade) | Patch (v1.0.x) | Brand lead |
| Adding a new approved component | Minor (v1.x.0) | Brand lead |
| Adding a new logo variant | Minor (v1.x.0) | Alexander |
| Modifying an existing token value | Minor or Major depending on impact | Alexander |
| Changing the primary brand color | Major (v2.0.0) | Alexander + formal review |
| Adding a new font to the system | Major (v2.0.0) | Alexander + formal review |
| Changing the brand's core messaging | Major (v2.0.0) | Alexander + formal review |
| Full visual rebrand | Major (v3.0.0+) | Alexander + strategic review |

---

## 4. Versioning System

The RCS brand system uses semantic versioning:

```
v[Major].[Minor].[Patch]

Current version: Brand System v1.0.0
```

### Version Definitions

| Version Type | Definition | Examples |
|-------------|------------|----------|
| **Patch (x.x.1)** | Non-visual fixes: documentation corrections, clarifications, grammar, dead link fixes | `v1.0.1`, `v1.0.2` |
| **Minor (x.1.0)** | New elements added without breaking existing system: new logo variant, new component, new color token, new approved CTA | `v1.1.0`, `v1.2.0` |
| **Major (2.0.0)** | Breaking changes or significant visual shifts: primary color change, font change, core messaging update, layout system overhaul | `v2.0.0`, `v3.0.0` |

### Version Log

Every version must be logged in `docs/brand-governance/VersionLog.md` (created at first update):

```markdown
## v1.0.0 — 2025
Initial Brand System. Phase 2A (Brand Bible) + Phase 2B (Visual Identity) + Phase 2C (Governance).

## v1.1.0 — [Date]
[Summary of what was added/changed]
Approved by: Alexander
Documents updated: [list]

## v2.0.0 — [Date]
[Summary of major changes]
Approved by: Alexander
Rationale: [Business reason]
Documents updated: [list]
```

---

## 5. How Changes Are Documented

Every brand update — regardless of version level — must be documented before implementation.

### Documentation Checklist for Any Brand Update

- [ ] **Proposal document:** What is changing, why, and what evidence supports it
- [ ] **Impact assessment:** Which documents, files, and touchpoints are affected
- [ ] **Rollout plan:** How and when all affected touchpoints will be updated simultaneously
- [ ] **Approval record:** Who approved it, when, and at what version level
- [ ] **Backward compatibility note:** What (if anything) breaks or requires migration
- [ ] **Updated governance documents:** All relevant docs in `docs/brand-governance/`, `docs/brand/`, and `docs/visual-identity/` updated
- [ ] **Updated design files:** Figma component library and token file updated
- [ ] **Updated CSS token file:** `tokens.css` updated and committed
- [ ] **Version log entry:** Added to version log

---

## 6. Backward Compatibility Rules

### Patch and Minor Updates

- **Backward compatible by definition.** Nothing that worked before breaks.
- New tokens added alongside old ones if old ones are deprecated (never deleted immediately).
- Deprecation period: minimum 90 days before a token or component is removed.
- Deprecated items marked with `[DEPRECATED - use X instead]` in documentation.

### Major Updates

- **May be breaking.** A migration path must be documented.
- All instances of the old pattern must be identified before the update is published.
- All instances are updated as part of the rollout — partial rollouts are prohibited.
- Old assets are archived (not deleted) in an `archive/v[old-version]/` folder.

### Rollout Completeness Rule

> **A brand update is not complete until every touchpoint has been updated. Partial rollouts are brand violations.**

If a Major update cannot be rolled out to all touchpoints simultaneously (e.g., a client contract is mid-execution), document the exception explicitly with a rollout deadline. Do not let exceptions become permanent.

---

## 7. Controlled Evolution vs. Reactive Redesign

This is the critical distinction:

| Controlled Evolution | Reactive Redesign |
|---------------------|------------------|
| Triggered by business need | Triggered by boredom or trend |
| Documented and planned | Rushed and undocumented |
| Extends the existing system | Abandons the existing system |
| Rolled out completely | Partially rolled out and inconsistent |
| Strengthens brand recognition | Resets brand recognition to zero |
| Approved by defined process | Decided by whoever is most vocal |

Roman Creative Studio has spent significant investment building a brand system that communicates premium, consistent, authoritative quality. Every reactive redesign resets that investment to zero. Controlled evolution compounds it.

---

## 8. Special Rules for Client-Facing Brand Assets

When a Major brand update occurs, the following client-facing assets must be updated before the update is considered complete:

- [ ] Website (all pages)
- [ ] Email signature
- [ ] Proposal template
- [ ] Contract template
- [ ] Invoice template
- [ ] Presentation templates
- [ ] Social media profile images and banners
- [ ] OG/social preview images
- [ ] Logo package (delivered to existing clients if logo changed)

This list is non-negotiable. No Major update is marked complete until all items above are checked.

---

## 9. Who Can Authorize Brand Changes

| Change Level | Authorized By |
|-------------|---------------|
| Patch | Brand lead (self-authorized with documentation) |
| Minor | Brand lead with Alexander sign-off |
| Major | Alexander only, after formal review process |
| Logo modification | Alexander only |
| Core messaging change | Alexander only |
| Full rebrand | Alexander only, after strategic business review |

No brand changes of any level are made without documentation. No exceptions.

---

## Related Documents
- `docs/brand-governance/BrandViolationPrevention.md` — How violations are handled
- `docs/brand-governance/DesignSystemGovernance.md` — Design system versioning
- `docs/brand-governance/FileAssetManagement.md` — Asset archiving rules
- `docs/brand/Mission.md` — What the brand stands for (must survive any evolution)
- `docs/brand/CoreValues.md` — What never changes regardless of brand version
