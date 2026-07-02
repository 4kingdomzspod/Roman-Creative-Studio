# Homepage Engine
## Roman Creative Studio — Phase 4, Document 4

---

### Homepage Purpose

The homepage is not an introduction. It is a conversion funnel.

Every section has a job. Every element moves the visitor forward. Nothing is decorative without function.

**Single conversion goal:** Book a Free Discovery Call
**Audience:** Business owners who need a premium website and are evaluating agencies
**Tone:** Authoritative, direct, premium — never salesy or desperate

---

## Section 1 — Homepage Section Architecture

### Required Sections (in order)

| # | Section | Job | Component |
|---|---|---|---|
| 1 | Hero | Capture attention, establish value proposition, deliver first CTA | Hero — Centered or Split |
| 2 | Trust Bar | Immediately validate credibility after hero | Client logos or metrics row |
| 3 | Problem → Solution | Acknowledge pain, position RCS as the answer | Two-column or narrative section |
| 4 | Services Overview | Show breadth, route to service pages | Card grid — service cards |
| 5 | Industry Specialization | Demonstrate depth, route to industry pages | Grid or tag list with links |
| 6 | Case Studies / Portfolio | Prove results with real work | Card grid — case study cards |
| 7 | Process | Remove fear of the unknown, establish professionalism | 3–4 step horizontal or vertical list |
| 8 | Testimonials | Social proof from real clients | Testimonial cards |
| 9 | Final CTA | Convert the convinced visitor | Full-width CTA section |

---

## Section 2 — Section-by-Section Specification

### Section 1: Hero

**Job:** In 5 seconds, the visitor must know: who this is for, what result they'll get, and what to do next.

**Headline formula:** [Outcome] for [Audience]
```
Example: "Websites That Convert Visitors Into Clients"
Example: "Premium Web Design for Service-Based Businesses"
Example: "Your Website Should Be Working for You"
```

**CTA Group:**
```
Primary: "Book a Free Discovery Call"    [btn--primary btn--lg]
Secondary: "View Our Work"               [btn--secondary btn--lg]
```

**Trust Signal (below CTA):**
```
✓ No long-term contracts   ✓ 30-minute call, no commitment   ✓ Response within 24 hours
```

---

### Section 2: Trust Bar

**Job:** Immediately after the hero, provide proof that others trust RCS.

**Format options:**

Option A — Client Logo Bar: Client logos displayed in grayscale
Option B — Metrics Row: "50+ Websites Delivered", "7 Industries Served", "100% Client Retention Rate"

---

### Section 3: Problem → Solution

**Structure:**
```
Eyebrow: "The Problem"
Headline: "Most Business Websites Are Silently Losing You Clients"

Body copy:
  Most business websites look fine on the surface.
  But they're slow, hard to update, not optimized for search,
  and worst of all — they don't convert visitors into clients.

---

Eyebrow: "The Solution"
Headline: "We Build Websites That Work as Hard as You Do"
```

---

### Section 4: Services Overview

**Headline:** "What We Build"
**Services to show (6):**
1. Brand Identity Design
2. Website Design
3. Website Redesign
4. SEO Optimization
5. Conversion Optimization
6. Website Care & Maintenance

---

### Section 5: Industry Specialization

**Headline:** "Built for Your Industry"
**Industries (7):**
- Dental Practices
- Churches & Faith Organizations
- Healthcare & MedSpas
- Local Businesses
- Real Estate
- Restaurants
- Startups

---

### Section 6: Case Studies

**Headline:** "Work That Speaks"
**Format:** 2–3 featured case study cards with project thumbnail, industry tag, client name, 1 headline result metric.

---

### Section 7: Process

**Headline:** "How We Work"
**Steps (4):**
```
01  Discovery — We learn your business, goals, audience, and competition.
02  Strategy & Design — We build the structure, then craft the visual experience.
03  Build & Optimize — We develop the site, optimize for speed and search.
04  Launch & Support — We launch and stay available for 30 days post-launch.
```

---

### Section 8: Testimonials

**Headline:** "What Our Clients Say"
**Format:** 3-column testimonial card grid
**Rules:** Every testimonial must reference a specific result or experience. Never: "Great work!" Include client name and business.

---

### Section 9: Final CTA

```
Eyebrow: "Ready to Get Started?"
Headline: "Let's Build Something That Works"
Subheadline: "Book a free 30-minute discovery call."

CTA: [Book a Free Discovery Call]    ← btn--primary btn--xl
Secondary: "Or email us at Alexander@romancreativestudio.co"

Reassurance: "No commitment. No sales pressure. Just a conversation."
```

---

## Section 3 — Homepage SEO Requirements

### Title Tag
```
Roman Creative Studio | Premium Web Design for Service Businesses
```

### Meta Description
```
Roman Creative Studio designs high-converting websites for dental practices,
churches, healthcare providers, and local businesses. Book a free discovery call.
```

### JSON-LD Structured Data (Local Business)
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Roman Creative Studio",
  "url": "https://romancreativestudio.co",
  "email": "Alexander@romancreativestudio.co",
  "description": "Premium web design agency specializing in dental, church, healthcare, and service business websites.",
  "areaServed": "US",
  "serviceType": ["Web Design", "SEO", "Brand Identity", "Conversion Optimization"]
}
```

---

## Section 4 — Homepage Performance Rules

| Metric | Target | Method |
|---|---|---|
| Largest Contentful Paint (LCP) | < 2.5s | Preload hero image, inline critical CSS |
| First Input Delay (FID) | < 100ms | Minimal blocking JS |
| Cumulative Layout Shift (CLS) | < 0.1 | Set explicit width/height on all images |
| Time to First Byte (TTFB) | < 600ms | GitHub Pages CDN (already handled) |
| Total page weight | < 1MB | Optimize all images to WebP |

---

## Section 5 — Homepage Anti-Patterns

| Anti-Pattern | Why It Kills Conversion |
|---|---|
| Hero says "Welcome to [Agency Name]" | About the agency, not the visitor |
| First section below hero is "About Us" | Kills momentum — trust must come before story |
| No CTA until the bottom of the page | Loses impatient, high-intent visitors |
| Multiple competing CTAs in one section | Paralyzes decision-making |
| Generic stock photography (laptops, handshakes) | Undermines premium positioning |
| Autoplay video or animation-heavy hero | Slows page, distracts from headline |
| "Learn more" as only CTA | No specific conversion directive |
| Wall-of-text about the agency's history | Wrong order — prove value first, tell story later |