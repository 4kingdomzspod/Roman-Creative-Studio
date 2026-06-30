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

**Headline rules:**
- Font: `var(--font-display)` — Cormorant Garamond
- Size: `--text-4xl` mobile → `--text-5xl` tablet → `--text-display` desktop
- Max 10 words
- Outcome-focused, not feature-focused
- Never start with "We" (it's about them, not you)

**Subheadline formula:** Who it's for + specific problem solved
```
Example: "We help dental practices, churches, and service businesses
          get websites that are fast, beautiful, and built to generate leads."
```

**Subheadline rules:**
- Font: Inter
- Size: `--text-lg` (18px)
- Max 2 lines
- Mentions a specific audience (dental, church, service business)
- References a specific outcome (generate leads, book patients, grow membership)

**CTA Group:**
```
Primary: "Book a Free Discovery Call"    [btn--primary btn--lg]
Secondary: "View Our Work"               [btn--secondary btn--lg]
```

**Trust Signal (below CTA):**
```
✓ No long-term contracts   ✓ 30-minute call, no commitment   ✓ Response within 24 hours
```

**Hero Visual:**
- Option A (Centered): Text centered, full-width with dark background + subtle gold element
- Option B (Split): Text left, featured project mockup/screenshot right
- Never: Generic stock photo of a laptop
- Never: Animated background that distracts from headline

---

### Section 2: Trust Bar

**Job:** Immediately after the hero, provide proof that others trust RCS. Silence the "who is this?" question.

**Format options:**

Option A — Client Logo Bar
```html
<section class="section section--compact section--bg-muted">
  <div class="container">
    <p class="text-body-sm text-muted text-center">Trusted by businesses across industries</p>
    <div class="logo-bar">
      [Client logo 1] [Client logo 2] [Client logo 3] [Client logo 4] [Client logo 5]
    </div>
  </div>
</section>
```

Option B — Metrics Row (if logos not available)
```html
<section class="section section--compact section--bg-muted">
  <div class="container">
    <div class="grid-3">
      <div class="stat">
        <span class="stat__number">50+</span>
        <span class="stat__label">Websites Delivered</span>
      </div>
      <div class="stat">
        <span class="stat__number">7</span>
        <span class="stat__label">Industries Served</span>
      </div>
      <div class="stat">
        <span class="stat__number">100%</span>
        <span class="stat__label">Client Retention Rate</span>
      </div>
    </div>
  </div>
</section>
```

**Rules:**
- Logos must be white/monochrome on dark background
- Metrics must be honest and verifiable
- Section is compact — no padding waste here
- If no logos or metrics are available, use a single strong testimonial pull quote instead

---

### Section 3: Problem → Solution

**Job:** Make the visitor feel understood before selling anything. Show you know their problem before offering a solution.

**Structure:**
```
Eyebrow: "The Problem"
Headline: "Most Business Websites Are Silently Losing You Clients"

Body copy (3–4 sentences):
  Most business websites look fine on the surface.
  But they're slow, hard to update, not optimized for search,
  and worst of all — they don't convert visitors into clients.
  That's a silent revenue leak most owners don't notice until it's too late.

---

Eyebrow: "The Solution"
Headline: "We Build Websites That Work as Hard as You Do"

Body copy:
  Roman Creative Studio designs and builds high-performance websites
  engineered for conversion, optimized for search, and built to represent
  the quality of your business.
```

**Layout:** Two-column on desktop (problem left, solution right), stacked on mobile
**Visual accent:** Single gold divider or accent line between problem and solution

---

### Section 4: Services Overview

**Job:** Show what RCS does, make it scannable, and route interested visitors to individual service pages.

**Headline:** "What We Build"
**Subheadline:** "End-to-end digital presence, from brand to website to growth."

**Format:** 3-column grid of service cards (collapses to 2 on tablet, 1 on mobile)

**Each service card contains:**
```
Icon (Heroicon, gold, 24px)
Service Name (H3 — Inter, not Cormorant)
One-sentence description (max 12 words)
"Learn more →" link to service page
```

**Services to show (6):**
1. Brand Identity Design
2. Website Design
3. Website Redesign
4. SEO Optimization
5. Conversion Optimization
6. Website Care & Maintenance

**CTA after grid:** `btn--secondary` → "Explore All Services"

---

### Section 5: Industry Specialization

**Job:** Show RCS understands specific industries, not just generic businesses. Triggers "that's me" recognition.

**Headline:** "Built for Your Industry"
**Subheadline:** "We don't build generic websites. We build for how your industry works, who your customers are, and what they need to see before they trust you."

**Format:** Industry pill/tag grid or icon grid — each links to industry page

**Industries (7):**
- Dental Practices
- Churches & Faith Organizations
- Healthcare & MedSpas
- Local Businesses
- Real Estate
- Restaurants
- Startups

**Interaction:** On hover, each industry tag expands slightly or shows a brief description

**CTA:** `btn--secondary` → "See All Industries"

---

### Section 6: Case Studies

**Job:** Show real work, real results. This is the proof section. Not a gallery — a results showcase.

**Headline:** "Work That Speaks"
**Subheadline:** "Every project tells a story. Here are a few."

**Format:** 2–3 featured case study cards

**Each card contains:**
```
Project thumbnail (16:9)
Industry tag (e.g., "Dental")
Client name or project title
1 headline result metric (e.g., "+40% contact form submissions")
"View Case Study →" link
```

**Rules:**
- Show max 3 on homepage — full portfolio accessible via button
- Results must be specific and real (no invented metrics)
- If no metrics available yet: use a strong visual + client name + testimonial fragment

**CTA:** `btn--secondary` → "View All Work"

---

### Section 7: Process

**Job:** Remove the fear of the unknown. Show that working with RCS is predictable, structured, and professional.

**Headline:** "How We Work"
**Subheadline:** "A clear process from start to launch — so you always know what's happening."

**Steps (4):**

```
01  Discovery
    We learn your business, goals, audience, and competition.
    Outcome: Project brief + scope document

02  Strategy & Design
    We build the structure, then craft the visual experience.
    Outcome: Wireframes + design mockups for approval

03  Build & Optimize
    We develop the site, optimize for speed and search,
    and test across all devices.
    Outcome: Staging site for review

04  Launch & Support
    We launch and stay available for 30 days post-launch.
    Outcome: Live website + optional Care Plan
```

**Layout:** Horizontal steps on desktop (numbered), vertical on mobile
**Accent:** Gold step numbers using `var(--color-brand-gold)`

---

### Section 8: Testimonials

**Job:** Let clients speak for RCS. Peer validation is more powerful than any claim RCS makes about itself.

**Headline:** "What Our Clients Say"

**Format:** 3-column testimonial card grid (collapses to 1 on mobile)

**Each testimonial card contains:**
```html
<figure class="card card--testimonial">
  <blockquote>
    "[Specific outcome or experience — not vague praise]"
  </blockquote>
  <figcaption>
    <strong>[Client Name]</strong>
    <span>[Title, Business Name]</span>
  </figcaption>
</figure>
```

**Rules:**
- Minimum 3 testimonials shown
- Every testimonial must reference a specific result or experience
- Never: "Great work!" — needs specificity
- Include client name and business (with permission)
- Optional: star rating display

---

### Section 9: Final CTA

**Job:** Convert the visitor who has scrolled this far. They've seen proof, understand the value, and just need a clear, low-risk next step.

**This is the highest-conversion section on the page.**

**Structure:**
```
Eyebrow: "Ready to Get Started?"
Headline: "Let's Build Something That Works"
Subheadline: "Book a free 30-minute discovery call. We'll learn about your business, discuss your goals, and tell you exactly how we'd approach your project."

CTA: [Book a Free Discovery Call]    ← btn--primary btn--xl
Secondary: "Or email us at Alexander@romancreativestudio.co"

Reassurance line: "No commitment. No sales pressure. Just a conversation."
```

**Background:** Dark section — `section--bg-brand` or `section--bg-muted`
**Rule:** This section uses ONE primary CTA only. No competing buttons.

---

## Section 3 — Homepage SEO Requirements

### Title Tag
```
Roman Creative Studio | Premium Web Design for Service Businesses
```
Max 60 characters.

### Meta Description
```
Roman Creative Studio designs high-converting websites for dental practices,
churches, healthcare providers, and local businesses. Book a free discovery call.
```
Max 155 characters.

### H1 (Hero headline — one per page)
Must contain primary keyword: "web design" or "website design"
Example: "Premium Website Design for Service-Based Businesses"

### H2s (section headlines)
Must be descriptive, not clever:
- "Our Web Design Services" (not "What We Do")
- "Industries We Serve" (not "Built for Your World")
- "Website Design Case Studies" (not "Work That Speaks")

**Note:** Display/marketing headlines (the ones visitors read) can use brand voice. SEO H2s must be clear and keyword-relevant. Use a `visually-hidden` span technique or ensure H2 text naturally contains the keyword without sacrificing readability.

### Open Graph Tags
```html
<meta property="og:title" content="Roman Creative Studio — Premium Web Design">
<meta property="og:description" content="High-converting websites for dental practices, churches, healthcare, and local businesses.">
<meta property="og:image" content="https://romancreativestudio.co/assets/images/og-home.jpg">
<meta property="og:url" content="https://romancreativestudio.co/">
<meta property="og:type" content="website">
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
