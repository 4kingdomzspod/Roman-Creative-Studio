# Risk Management

**Owner:** Alexander Roman / CEO  
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Status:** Framework Defined — Active Monitoring Begins Month 1

---

## Purpose

Document all material risks to Roman Creative Studio across financial, legal, technical, security, operational, marketing, hiring, client concentration, platform dependency, and disaster recovery dimensions.

---

## Risk Register Summary

| ID | Risk | Score | Priority | Status |
|----|------|-------|----------|--------|
| FIN-01 | Revenue drought | 12 | High | Monitor |
| FIN-02 | Scope creep | 12 | High | Mitigated |
| FIN-03 | Late payment | 9 | High | Mitigated |
| FIN-04 | Underpricing | 6 | Medium | Monitor |
| LEG-01 | Client dispute | 8 | Medium | Mitigated |
| LEG-02 | IP infringement | 8 | Medium | Mitigated |
| LEG-03 | Privacy violation | 8 | Medium | Monitor |
| LEG-04 | Accessibility claim | 6 | Medium | Mitigated |
| TECH-01 | RCS site down | 6 | Medium | Monitor |
| TECH-02 | Client site down | 12 | High | Mitigated |
| TECH-03 | Data loss | 5 | Medium | Mitigated |
| TECH-04 | Dependency deprecation | 6 | Medium | Monitor |
| SEC-01 | API key exposure | 15 | High | Mitigated |
| SEC-02 | Admin compromise | 10 | High | Mitigated |
| SEC-03 | Client data breach | 5 | Medium | Mitigated |
| OPS-01 | Founder unavailable | 8 | Medium | Monitor |
| OPS-02 | Burnout | 12 | High | Active management |
| OPS-03 | Project delivery failure | 9 | High | Mitigated |
| MKT-01 | SEO algorithm update | 9 | High | Monitor |
| MKT-02 | Negative review | 6 | Medium | Monitor |
| HIR-01 | Wrong hire | 9 | High | Process defined |
| HIR-02 | Contractor departure | 9 | High | Mitigated |
| CLT-01 | Client concentration | 12 | High | Monitor |
| PLT-01 | GitHub Pages changes | 3 | Low | Accepted |
| PLT-02 | Stripe changes | 3 | Low | Accepted |
| PLT-03 | Supabase disruption | 6 | Medium | Mitigated |

---

## Key Mitigations

- **Revenue drought:** 2+ months cash reserve; MRR target $1k+ by Month 6; diversified lead sources
- **Scope creep:** Detailed scope document signed before work begins; change order process
- **API key exposure:** `.gitignore` all `.env` files; GitHub secret scanning enabled; immediate rotation if exposed
- **Burnout:** Hard capacity limit: maximum 3 active projects simultaneously
- **Client concentration:** No single client >25% of revenue by Month 12

---

## Risk Review Cadence

- **Monthly:** Review all High and Critical risks
- **Quarterly:** Full risk register review
- **Annually:** Add new risks; retire resolved risks

---

## Related Documents

- `SecurityPrivacy.md` — detailed security risk mitigations
- `ForecastingModels.md` — financial risk models
- `ScalingRoadmap.md` — risks at each growth stage
