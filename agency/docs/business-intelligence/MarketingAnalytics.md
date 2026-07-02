# Marketing Analytics Architecture

**Owner:** Alexander Roman / CEO / Head of Marketing  
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Status:** Architecture Defined — Tools Not Yet Activated

---

## Purpose

Document the complete marketing analytics architecture for Roman Creative Studio — covering SEO reporting, blog analytics, podcast analytics, social media measurement, email marketing performance, lead magnets, referral tracking, campaign attribution, and content ROI.

---

## Key Metrics by Channel

### SEO
- Organic sessions: 2,000+/mo target (Y1)
- Average position: <20 (Y1), <10 (Y2)
- Keywords in top 10: 20+ (Y1)
- Core Web Vitals: all passed

### Email (MailerLite)
- Open rate: 35%+ (industry benchmark: 25–35%)
- Click rate: 5%+
- Unsubscribe rate: <0.5%
- List growth: 10%+/month

### Blog
- Tier A (Star Content): High traffic + high conversions → promote heavily
- Tier B (Traffic Driver): High traffic, low conversions → improve CTAs
- Tier C (Lead Driver): Low traffic, high conversions → invest in SEO
- Tier D (Underperformer): Low traffic + low conversions → update or consolidate

### Social Media
- Engagement rate: 3%+
- Follower growth: 5%+/mo
- Website traffic from social: increasing MoM

---

## UTM Naming Convention

```
utm_source     = platform (google, instagram, mailerlite, podcast)
utm_medium     = channel type (organic, cpc, email, social, referral)
utm_campaign   = campaign name (kebab-case: q3-dental-launch)
utm_content    = specific link variant
utm_term       = keyword (paid search only)
```

---

## Future Integrations Planned

- Google Analytics 4: Ready to install (2–4 hours)
- Google Search Console: Ready to install (1 hour)
- Microsoft Clarity: Ready to install (30 minutes)
- Ahrefs: Month 3+ when SEO is primary investment channel

---

## Related Documents

- `KPIDefinitions.md` — W01–W08 marketing KPIs
- `IntegrationReadiness.md` — GA4, Search Console, MailerLite setup details
- `BusinessIntelligence.md` — how marketing data feeds the BI warehouse
- `ExecutiveDashboard.md` — marketing dashboard section
