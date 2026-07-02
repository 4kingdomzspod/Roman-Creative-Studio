# Service Page System
## Roman Creative Studio — Phase 4, Document 5

---

### Purpose

Each service page is a standalone conversion unit. Its job is to:
1. Attract organic traffic for that specific service keyword
2. Educate the visitor on the value of that service
3. Establish RCS as the authority in that service category
4. Convert the visitor into a discovery call lead

Every service page follows the same structural template. The content changes. The architecture does not.

---

## Section 1 — Universal Service Page Template

### Required Sections (in order)

| # | Section | Job |
|---|---|---|
| 1 | Hero | Outcome headline + who it's for + primary CTA |
| 2 | Problem Identification | Prove you understand their pain |
| 3 | Solution Explanation | Show how RCS solves it specifically |
| 4 | What's Included | Transparent scope — removes "but what do I get?" friction |
| 5 | Process Breakdown | Predictability reduces fear |
| 6 | Proof / Case Studies | Real results for real clients |
| 7 | FAQ | Handle the top 4–5 objections |
| 8 | Final CTA | Convert the convinced visitor |

---

### Section 1: Service Hero

**Headline formula:** [Result] for [Audience] + [Differentiator]
```
Examples:
"A Website That Converts — Not Just Looks Good"
"Brand Identity Built to Last, Not Just Look Pretty"
"SEO That Builds Traffic You Actually Own"
```

**Subheadline:** One sentence explaining the specific outcome this service delivers

**CTA:** `btn--primary btn--lg` — "Book a Free Discovery Call"
**Secondary CTA:** `btn--secondary btn--md` — "See Our Work" or "View Case Studies"

**Breadcrumb (above hero headline):**
```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/services/">Services</a></li>
    <li aria-current="page">[Service Name]</li>
  </ol>
</nav>
```

---

### Section 2: Problem Identification

**Eyebrow:** "The Problem"
**Headline:** Name the specific pain this service solves
**Body:** 3–4 sentences describing the problem in the client's own language

**Rule:** Use "you" and "your business" — never "our clients" or third-person distance.
**Rule:** Never start solving the problem in this section. Build empathy first.

**Format option — Problem List:**
```html
<ul class="problem-list">
  <li>Your website looks outdated and doesn't reflect the quality of your work</li>
  <li>Visitors leave without contacting you — and you don't know why</li>
  <li>You're losing business to competitors with better-looking sites</li>
  <li>You've outgrown your current site but don't know where to start</li>
</ul>
```

---

### Section 3: Solution Explanation

**Eyebrow:** "The Solution"
**Headline:** How RCS specifically solves this problem
**Body:** 3–4 sentences describing the approach and why it works

**Rule:** Be specific about the method, not just the outcome.
**Rule:** Connect to what makes RCS different — design system, industry knowledge, conversion focus.

---

### Section 4: What's Included

**Headline:** "What You Get"

**Format:** 2-column grid of deliverable items with icons
```html
<div class="grid-2">
  <div class="deliverable">
    <span class="deliverable__icon">[Heroicon]</span>
    <div>
      <strong>Custom Design</strong>
      <p>Unique to your brand — never a template</p>
    </div>
  </div>
  <!-- repeat for each deliverable -->
</div>
```

**Rule:** List deliverables as outcomes, not tasks. "A website that loads in under 2 seconds" not "Performance optimization."

---

### Section 5: Process Breakdown

**Headline:** "How It Works"

**Format:** Numbered steps — 4 steps maximum

**Rule:** Specific to this service, not the generic 4-step process from the homepage. The homepage process is summarized. Service page process is detailed.

---

### Section 6: Case Studies

**Headline:** "Results We've Delivered"

**Format:** 2 featured case study cards (from portfolio) relevant to this service

**If no case studies exist yet:**
Use a single testimonial card with specific outcome language instead.

**Rule:** Never show a portfolio example without a result metric or client testimonial.

---

### Section 7: FAQ

**Headline:** "Common Questions"

**Format:** Accordion (from Phase 3 Accessibility System)
- 4–6 questions maximum
- Questions written from the client's perspective ("How long does it take?" not "What is your timeline?")
- Answers are honest and specific — never evasive

**Required questions for all service pages:**
1. How long does [service] take?
2. How much does [service] cost? (anchor or range, not "contact us for pricing")
3. What do you need from me to get started?
4. What happens after [service] is complete?

---

### Section 8: Final CTA

```
Headline: "Ready to [Specific Outcome for This Service]?"
Subheadline: "Book a free 30-minute discovery call. We'll discuss your project and tell you exactly how we'd approach it."
CTA: [Book a Free Discovery Call]    btn--primary btn--xl
Reassurance: "No commitment. No sales pressure."
```

---

## Section 2 — Individual Service Specifications

### Service 1: Brand Identity Design

**URL:** `/services/brand-identity/`
**Primary keyword:** "brand identity design"
**Secondary keywords:** "logo design", "brand guidelines", "visual identity design"

**Title tag:** `Brand Identity Design | Roman Creative Studio`
**Meta description:** `We design brand identities built for longevity — logo, typography, color, and guidelines. Book a free discovery call with Roman Creative Studio.`

**H1:** "Brand Identity Design That Defines Your Business"

**Problem headline:** "Most Logos Are Just Decorations — Not Brand Systems"

**Solution headline:** "A Brand Identity Built to Scale With Your Business"

**What's Included:**
- Logo design (primary + variations)
- Color palette with token-ready HEX/RGB values
- Typography system (display + body + accent)
- Brand guidelines document
- Icon and pattern library
- Social media asset templates

**Process:**
1. Discovery — brand values, audience, competitors
2. Strategy — positioning, personality, direction
3. Design — concept development, rounds of refinement
4. Delivery — final files + guidelines document

**FAQ questions:**
- "How long does brand identity design take?" (3–5 weeks typical)
- "What file formats will I receive?"
- "Do you offer logo-only projects?"
- "Can you update my existing brand instead of starting over?"

---

### Service 2: Website Design

**URL:** `/services/website-design/`
**Primary keyword:** "website design"
**Secondary keywords:** "web design agency", "custom website design", "small business website design"

**Title tag:** `Website Design for Service Businesses | Roman Creative Studio`
**Meta description:** `Custom website design built for conversion, speed, and SEO. Roman Creative Studio builds websites that generate leads. Book a free discovery call.`

**H1:** "Website Design That Converts Visitors Into Clients"

**Problem headline:** "Your Website Looks Good But Isn't Generating Leads"

**Solution headline:** "A Website Engineered for Conversion, Not Just Aesthetics"

**What's Included:**
- Custom design (not a template)
- Responsive — mobile, tablet, desktop
- On-page SEO structure
- Contact form + CTA integration
- Google Analytics setup
- 30 days post-launch support
- Optional: copywriting, photography direction

**Process:**
1. Discovery — goals, audience, competitors, content
2. Wireframes — structure and flow before design
3. Design — mockups in brand system, client approval
4. Build + Launch — development, QA, deployment

---

### Service 3: Website Redesign

**URL:** `/services/website-redesign/`
**Primary keyword:** "website redesign"
**Secondary keywords:** "redesign existing website", "website refresh", "update old website"

**Title tag:** `Website Redesign Service | Roman Creative Studio`
**Meta description:** `Transform your outdated website into a high-converting lead engine. Roman Creative Studio specializes in website redesigns for service businesses. Book a free call.`

**H1:** "Website Redesign That Transforms Your Digital Presence"

**Problem headline:** "Your Website Represents a Business You No Longer Are"

**Key differentiator to emphasize:** Redesign without losing existing SEO rankings. Migration strategy preserves Google equity.

**What's Included:**
- Full content audit of existing site
- URL mapping + 301 redirect plan (to protect SEO)
- Redesigned pages in RCS design system
- Improved conversion architecture
- Speed optimization
- Analytics continuity

---

### Service 4: SEO Optimization

**URL:** `/services/seo-optimization/`
**Primary keyword:** "SEO optimization service"
**Secondary keywords:** "local SEO", "on-page SEO", "SEO for small business"

**Title tag:** `SEO Optimization Service | Roman Creative Studio`
**Meta description:** `SEO that builds traffic you own. Roman Creative Studio provides on-page SEO, technical SEO, and local SEO for service businesses. Book a free discovery call.`

**H1:** "SEO Optimization That Builds Organic Traffic You Own"

**Problem headline:** "You're Invisible on Google to the Clients You Want Most"

**Key differentiator:** SEO built into the site architecture — not bolted on afterward.

**What's Included:**
- Keyword research and mapping
- On-page optimization (H1–H3, meta tags, alt text)
- Technical SEO audit + fixes
- Local SEO (Google Business Profile optimization)
- Internal linking structure
- Monthly reporting

---

### Service 5: Conversion Optimization

**URL:** `/services/conversion-optimization/`
**Primary keyword:** "conversion rate optimization"
**Secondary keywords:** "CRO service", "improve website conversions", "website lead generation"

**Title tag:** `Conversion Optimization Service | Roman Creative Studio`
**Meta description:** `Turn more of your existing website traffic into leads. Roman Creative Studio analyzes and optimizes your conversion flow. Book a free discovery call.`

**H1:** "Conversion Optimization: Get More Leads from Your Existing Traffic"

**Problem headline:** "Traffic Without Conversion Is Just an Expensive Audience"

**What's Included:**
- Conversion flow audit
- CTA strategy redesign
- Form optimization
- Trust signal implementation
- Landing page improvements
- A/B testing recommendations
- 90-day performance report

---

### Service 6: Website Care & Maintenance

**URL:** `/services/website-care/`
**Primary keyword:** "website maintenance service"
**Secondary keywords:** "website care plan", "website support", "website management"

**Title tag:** `Website Care & Maintenance Plans | Roman Creative Studio`
**Meta description:** `Keep your website secure, fast, and up to date with a Roman Creative Studio Website Care Plan. Monthly maintenance and priority support. Book a free call.`

**H1:** "Website Care Plans: Expert Maintenance, Peace of Mind"

**Problem headline:** "Websites Need More Than a Launch — They Need Ongoing Attention"

**Primary CTA variation:** "Get a Care Plan" (instead of "Book a Discovery Call")

**What's Included:**
- Monthly performance check
- Security monitoring
- Content updates (monthly limit)
- Plugin/dependency updates
- Uptime monitoring
- Priority support response time
- Quarterly strategy review

**Pricing structure (recommended):** Show 2–3 tiered plans. Naming convention: Essential / Professional / Agency

---

## Section 3 — Service Page SEO Rules

### Internal Linking (per service page)

Each service page must link to:
1. 2–3 relevant industry pages (contextual — in body copy)
2. Portfolio page or 1–2 specific case studies
3. 1–2 related service pages (in a "Related Services" section or contextual link)
4. Contact page (via CTA)

### Schema Markup (Service pages)

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "[Service Name]",
  "provider": {
    "@type": "ProfessionalService",
    "name": "Roman Creative Studio",
    "url": "https://romancreativestudio.co"
  },
  "description": "[Service meta description]",
  "areaServed": "US"
}
```
