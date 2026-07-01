# Marketing Analytics Architecture

**Owner:** Alexander Roman / CEO / Head of Marketing  
**Version:** 1.0  
**Last Updated:** 2026-07-01  
**Status:** Architecture Defined — Tools Not Yet Activated

---

## Purpose

Document the complete marketing analytics architecture for Roman Creative Studio — covering SEO reporting, blog analytics, podcast analytics, social media measurement, email marketing performance, lead magnets, referral tracking, campaign attribution, and content ROI. Define the future integration stack.

---

## Business Value

Marketing without measurement is donation. This architecture ensures every dollar of time invested in content, SEO, and outreach can be traced to leads, clients, and revenue. It enables RCS to double down on what works and cut what doesn’t.

---

## 1. SEO Reporting

### Tracking Objectives
1. Are we visible for the keywords our ideal clients search?
2. Is our visibility growing month over month?
3. Which pages drive the most organic leads?
4. Are our Core Web Vitals competitive?

### Metrics

| Metric | Source | Cadence | Target |
|--------|--------|---------|--------|
| Organic sessions | GA4 | Weekly | 2,000+/mo (Y1) |
| Organic impressions | Search Console | Weekly | Growing MoM |
| Organic CTR | Search Console | Monthly | 3%+ |
| Average position | Search Console | Monthly | <20 (Y1), <10 (Y2) |
| Keywords in top 10 | SEMrush / Ahrefs | Monthly | 20+ (Y1) |
| Keywords in top 3 | SEMrush / Ahrefs | Monthly | 5+ (Y1) |
| Domain authority | Ahrefs DR | Quarterly | Growing |
| Backlinks (new) | Ahrefs | Monthly | 5+/mo |
| Core Web Vitals | Search Console | Monthly | All passed |

### Target Keyword Categories

```
Brand Keywords
  - roman creative studio
  - rcs web design

Service Keywords
  - web design [city]
  - website design for [industry]
  - small business website design
  - dental website design
  - church website design

Problem Keywords
  - my website isn't getting leads
  - how to get more patients from google
  - why is my website not ranking

Content Keywords
  - how to [task] for small business
  - [industry] website best practices
  - website checklist for [industry]
```

### Monthly SEO Report Structure
```
1. Organic traffic (vs last month, vs 3 months ago)
2. Top 5 ranking improvements
3. Top 5 ranking declines (with investigation note)
4. New keywords entering top 20
5. Core Web Vitals status
6. New backlinks acquired
7. Content published this month (titles + target keywords)
8. Next month priorities
```

---

## 2. Blog Analytics

### Tracking Objectives
1. Which blog posts drive the most organic traffic?
2. Which posts convert readers to leads?
3. What topics resonate most with our audience?
4. Is blog investment ROI-positive?

### Metrics Per Post

| Metric | Source | Definition |
|--------|--------|------------|
| Sessions | GA4 | Total page sessions |
| Avg time on page | GA4 | Engagement proxy |
| Scroll depth | Clarity | % reading below fold |
| Leads generated | GA4 | `form_submit` events after blog visit |
| Social shares | Manual | Shares across platforms |
| Backlinks | Ahrefs | External links to this post |
| Keyword rank | Search Console | Position for target keyword |

### Blog Performance Tiers
```
Tier A (Star Content)
  → High traffic AND high conversions
  → Action: Promote heavily, update quarterly, build links to it

Tier B (Traffic Driver)
  → High traffic, low conversions
  → Action: Add stronger CTAs, improve conversion elements

Tier C (Lead Driver)
  → Low traffic, high conversions
  → Action: Invest in SEO to increase reach

Tier D (Underperformer)
  → Low traffic AND low conversions
  → Action: Update, redirect, or consolidate into stronger post
```

### Content ROI Formula
```
Content ROI = (Leads from Content × Lead-to-Client Rate × Avg Project Value) − Content Production Cost
Content Production Cost = (Hours spent) × (Alexander's effective hourly rate)
```

---

## 3. Podcast Analytics

### Platforms to Track
- Podcast host dashboard (Buzzsprout, Anchor, Spotify for Podcasters)
- Apple Podcasts Connect
- Spotify for Podcasters
- GA4 (traffic from podcast-related pages)

### Metrics

| Metric | Source | Cadence | Target |
|--------|--------|---------|--------|
| Downloads per episode | Podcast host | Per episode | 100+ (Y1) |
| Total subscribers | Podcast host | Monthly | Growing |
| Avg completion rate | Spotify | Monthly | 60%+ |
| Listener location | Podcast host | Quarterly | US-dominant |
| Website traffic from podcast | GA4 | Monthly | Trackable |
| Leads attributed to podcast | CRM | Monthly | 1+/mo (Y1) |

### Podcast Attribution
- UTM link in every episode description: `?utm_source=podcast&utm_medium=description&utm_campaign=4kingdoms`
- Dedicated landing page: `romancreativestudio.co/podcast` with unique tracking
- Mention tracker: note in CRM if a lead says they found RCS via the podcast

---

## 4. Social Media Analytics

### Platforms (Current or Planned)
- Instagram
- Facebook
- LinkedIn
- YouTube (future)
- TikTok (future)

### Metrics (per platform)

| Metric | Cadence | Target |
|--------|---------|--------|
| Follower count | Monthly | Growing |
| Follower growth rate | Monthly | 5%+/mo |
| Avg reach per post | Monthly | Increasing |
| Avg engagement rate | Monthly | 3%+ |
| Profile link clicks | Monthly | Increasing |
| Website traffic from social | GA4 / Monthly | Increasing |
| Leads from social | CRM / Monthly | 1+/mo (Y1) |

### Social Attribution
- GA4 source/medium: `instagram / social`, `facebook / social`, `linkedin / social`
- Link-in-bio tool (Linktree or native): tracked with UTMs
- Social-exclusive offers tracked via unique landing pages

### Social ROI Framework
Social media is a brand and awareness channel for RCS, not a direct response channel. ROI is measured as:
- Indirect: Does social presence increase inbound lead quality and referral rate?
- Direct: Leads who list social as their discovery source
- Brand: Follower growth and engagement as proxy for authority

---

## 5. Email Marketing Analytics

### Platform: MailerLite

### Metrics

| Metric | Cadence | Target | Industry Benchmark |
|--------|---------|--------|--------------------|
| List size | Monthly | Growing 10%+/mo | N/A |
| Open rate | Per campaign | 35%+ | 25–35% |
| Click rate | Per campaign | 5%+ | 2.5–5% |
| Unsubscribe rate | Per campaign | <0.5% | <0.5% |
| Bounce rate | Per campaign | <2% | <2% |
| Automation completion rate | Monthly | 60%+ | N/A |
| Revenue attributed to email | Monthly | Trackable | N/A |

### List Health Checks (Quarterly)
1. Remove hard bounces immediately
2. Sunset (re-engage or remove) subscribers inactive for 90+ days
3. Segment analysis: which segments open most?
4. Subject line A/B test results review

### Email Attribution
- All email CTAs include UTM parameters: `utm_source=mailerlite&utm_medium=email&utm_campaign=[campaign-name]`
- Goal: connect email opens to website visits to form submissions in GA4

---

## 6. Google Business Profile

### Metrics

| Metric | Source | Cadence | Target |
|--------|--------|---------|--------|
| Profile views | GBP Insights | Monthly | Growing |
| Search appearance (discovery) | GBP Insights | Monthly | Increasing |
| Direction requests | GBP Insights | Monthly | N/A (service area) |
| Website clicks from GBP | GBP Insights | Monthly | 20+/mo |
| Phone calls from GBP | GBP Insights | Monthly | N/A |
| Review count | GBP | Monthly | 1 new/mo |
| Avg star rating | GBP | Monthly | 5.0 |

### GBP Optimization Actions
- Post monthly: project showcase, tip, or service highlight
- Respond to all reviews within 48 hours
- Keep services, hours, and service area updated
- Add photos of work monthly

---

## 7. Lead Magnet Performance

### Assets to Track

| Asset | Type | Tracking |
|-------|------|----------|
| Website Checklist | PDF | Unique landing page + GA4 event |
| SEO Starter Guide | PDF | Unique landing page + GA4 event |
| Pricing Guide | PDF | Unique landing page + GA4 event |
| [Future resources] | Various | Same pattern |

### Metrics Per Asset
- Downloads: GA4 `resource_download` event count
- Download-to-lead rate: % of downloaders who later submit contact form
- Subscriber conversion: % who opt into email list
- Traffic source: where are downloaders coming from?

### Lead Magnet ROI
```
Lead Magnet ROI = (Downloaders × Download-to-Lead Rate × Lead-to-Client Rate × APV) - Creation Cost
```

---

## 8. Referral Source Tracking

### Source Taxonomy

```
Organic Search     → utm_source=google, medium=organic
Direct             → No UTM (type-in or bookmark)
Referral           → utm_source=[website], medium=referral
Social             → utm_source=[platform], medium=social
Email              → utm_source=mailerlite, medium=email
Podcast            → utm_source=podcast, medium=description
Partner            → utm_source=[partner-name], medium=partnership
Word of Mouth      → Captured in CRM manually ("How did you hear about us?")
Paid (future)      → utm_source=google, medium=cpc
```

### Referral Attribution Rules
1. CRM lead source is captured from form question "How did you hear about us?"
2. GA4 source is captured automatically from UTM or referrer
3. When both exist, CRM self-reported source takes precedence for revenue attribution
4. GA4 source used for traffic and funnel analytics

---

## 9. Campaign Tracking

### UTM Naming Convention

```
utm_source     = platform or origin (google, instagram, mailerlite, podcast)
utm_medium     = channel type (organic, cpc, email, social, referral)
utm_campaign   = specific campaign name (kebab-case: q3-dental-launch)
utm_content    = specific link variant (cta-button, text-link, image)
utm_term       = keyword (for paid search only)
```

### Campaign Register
Maintain a spreadsheet/Notion table of all active campaigns:
- Campaign name
- Start/end date
- Budget (time or money)
- UTM parameters
- Goal (leads, traffic, signups)
- Results at close

### Campaign Performance Report
For each campaign:
1. Traffic generated
2. Form submissions
3. Email signups
4. Leads created in CRM
5. Deals influenced
6. Revenue attributed
7. ROI (if paid investment)

---

## 10. Industry Page Performance

### Pages to Track
Each industry landing page (Dental, Church, Healthcare, Real Estate, Restaurant, etc.) tracked individually.

### Per-Page Metrics

| Metric | Source | Target |
|--------|--------|--------|
| Organic sessions | GA4 | 100+/mo per page |
| Avg position for target keyword | Search Console | Top 20 (Y1) |
| Conversion rate | GA4 | 3%+ |
| Time on page | GA4 | 2+ minutes |
| Scroll depth | Clarity | 50%+ reach bottom |
| Leads generated | CRM | 1+/mo per page |

### Industry Page Priority Matrix
Score each industry by: (Market size × Competition level × Conversion potential)
Focus SEO investment on highest-scoring industries first.

---

## 11. Content Performance Analytics

### Content Types
- Blog posts
- Industry landing pages
- Service pages
- Case studies (future)
- Resources / lead magnets
- Podcast episodes

### Content Calendar Metrics
- Planned vs published (consistency rate)
- Time to publish (from draft to live)
- Average content score (SEO tool grade)
- Average time to first organic traffic (days from publish)

---

## 12. Future Integrations

### Google Analytics 4
- **Status:** Planned (ready to install today)
- **Setup:** Snippet on all HTML pages + GA4 property creation
- **Events to configure:** `form_submit`, `cta_click`, `resource_download`, `calendly_open`, `page_scroll_75`
- **Estimated setup time:** 2–4 hours

### Google Search Console
- **Status:** Planned (requires domain verification)
- **Setup:** DNS TXT record via Cloudflare, sitemap submission
- **Estimated setup time:** 1 hour

### Microsoft Clarity
- **Status:** Planned (free, immediate value)
- **Setup:** Single script tag on all pages
- **Value:** Heatmaps, session recordings, rage click detection
- **Estimated setup time:** 30 minutes

### Plausible Analytics (alternative to GA4)
- **Status:** Future consideration
- **Value:** Privacy-first, no cookie consent banner needed
- **Cost:** $9/mo
- **Decision trigger:** If GA4 cookie consent complexity becomes a barrier

### Ahrefs
- **Status:** Future (Month 3+)
- **Value:** Keyword rank tracking, competitor analysis, backlink monitoring
- **Cost:** $99/mo
- **Decision trigger:** When SEO becomes a primary investment channel

### SEMrush
- **Status:** Alternative to Ahrefs
- **Value:** Similar to Ahrefs; slightly better content marketing tools
- **Cost:** $119/mo
- **Decision trigger:** Choose one: Ahrefs OR SEMrush (not both)

---

## Technical Notes

- All UTM-tagged links stored in a URL builder sheet (Google Sheets or Notion database)
- GA4 custom dimensions: `lead_source`, `page_type` (service/blog/industry/resource), `form_type`
- All analytics data archived monthly to Supabase `traffic_daily` and `kpi_snapshots` tables
- Microsoft Clarity data is not API-accessible; reviewed in Clarity dashboard weekly

---

## Future Enhancements

- [ ] Marketing attribution model: multi-touch (first touch, last touch, linear)
- [ ] Paid advertising integration (Google Ads) when ready to invest in paid
- [ ] Automated weekly marketing digest (top 5 metrics delivered by email)
- [ ] A/B testing infrastructure for landing pages
- [ ] Video analytics (YouTube) when video content strategy begins

---

## Related Documents

- `KPIDefinitions.md` — W01–W08 marketing KPIs
- `IntegrationReadiness.md` — GA4, Search Console, MailerLite setup details
- `ContentStrategy.md` (future) — content calendar and production standards
- `BusinessIntelligence.md` — how marketing data feeds the BI warehouse
- `ExecutiveDashboard.md` — marketing dashboard section
