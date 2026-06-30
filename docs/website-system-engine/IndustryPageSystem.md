# Industry Page System
## Roman Creative Studio — Phase 4, Document 6

---

### Purpose

Industry pages are the SEO growth engine of the Roman Creative Studio website.

They serve two simultaneous functions:
1. **Rank on Google** for high-intent keywords like "dental website design" or "church website design"
2. **Convert visitors** from that industry who land on the page

A visitor arriving on `/industries/dental/` has already signaled high intent. They are searching for a web designer who understands dental practices. This page must confirm: *yes, we do, and here's the proof.*

---

## Section 1 — Universal Industry Page Template

### Required Sections (in order)

| # | Section | Job |
|---|---|---|
| 1 | Industry Hero | Industry-specific headline + pain point acknowledgment + CTA |
| 2 | Industry Pain Points | Show deep understanding of this industry's website problems |
| 3 | RCS Solution for This Industry | Specific approach for this vertical |
| 4 | Industry-Specific Features | What the website needs to do for this industry |
| 5 | Case Study / Portfolio Example | Proof that RCS has done this before |
| 6 | Industry-Specific FAQ | Handle this industry's specific objections |
| 7 | Final CTA | Convert the convinced visitor |

---

### Section 1: Industry Hero

**Headline formula:** "[Industry]-Specific Outcome"
```
Examples:
"Dental Websites That Book More Patients"
"Church Websites That Grow Your Congregation"
"Restaurant Websites That Fill Tables"
"Healthcare Websites That Build Patient Trust"
```

**Subheadline:** One sentence proving industry knowledge
```
Example (Dental): "We understand how patients choose a dentist online —
                  and we design websites that answer every question
                  before they even pick up the phone."
```

**Trust signal below CTA:** Include an industry-specific credibility element
```
Example: "✓ HIPAA-aware design   ✓ Patient trust optimization   ✓ Google Maps integration"
```

**Breadcrumb:**
```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/industries/">Industries</a></li>
    <li aria-current="page">[Industry Name] Websites</li>
  </ol>
</nav>
```

---

### Section 2: Industry Pain Points

**Eyebrow:** "The Challenge"
**Headline:** "Why Most [Industry] Websites Fail to Bring In Business"

**Format:** Icon list of 4–5 industry-specific pain points
```html
<ul class="problem-list">
  <li>Your website doesn't communicate trust before a patient decides to call</li>
  <li>No online booking — patients leave and find a competitor who has it</li>
  <li>Your Google ranking puts you on page 2 or 3</li>
  <li>The design looks outdated compared to practices in your area</li>
  <li>You're not showing up in "near me" searches</li>
</ul>
```

**Rule:** Pain points must be specific to the industry. No generic "your website isn't converting" language here.

---

### Section 3: RCS Solution

**Eyebrow:** "Our Approach"
**Headline:** "[Industry] Websites Built for [Primary Industry Goal]"

**Body:** 3–4 sentences explaining:
- What RCS understands about this industry's customers
- How that understanding shapes the design strategy
- What outcome the visitor can expect

---

### Section 4: Industry-Specific Features

**Headline:** "What Your [Industry] Website Needs"

**Format:** 3-column feature grid

Each feature card:
```html
<div class="card card--feature">
  <div class="card__icon">[Heroicon]</div>
  <h3>[Feature Name]</h3>
  <p>[Why this matters for this industry specifically]</p>
</div>
```

**Rule:** Every feature listed must explain WHY it matters to that industry specifically — not just what it is.

---

### Section 5: Portfolio / Case Study

**Headline:** "[Industry] Websites We've Built"

**Format:** 1–2 case study cards, or a featured portfolio item

**If no case study exists yet:** Use a mock example or "Coming soon" placeholder with an honest framing: "We're currently documenting our [industry] work. In the meantime, here's what a project typically looks like."

---

### Section 6: Industry FAQ

**Headline:** "Questions From [Industry] Owners"

**5–6 FAQ items specific to this industry**

---

### Section 7: Final CTA

```
Headline: "Ready for a [Industry] Website That Actually Works?"
Subheadline: "Book a free 30-minute call. We'll discuss your practice, your patients,
              and exactly how we'd build your new website."
CTA: [Book a Free Discovery Call]    btn--primary btn--xl
```

---

## Section 2 — Individual Industry Specifications

### Industry 1: Dental Websites

**URL:** `/industries/dental/`
**Primary keyword:** "dental website design"
**Secondary keywords:** "dental practice website", "dentist website design", "dental SEO"

**Title tag:** `Dental Website Design | Roman Creative Studio`
**Meta description:** `Website design for dental practices that builds patient trust and drives appointments. Roman Creative Studio specializes in dental web design. Book a free call.`

**H1:** "Dental Website Design That Converts Website Visitors Into Patients"

**Pain points specific to dental:**
- No online appointment booking loses patients immediately
- Outdated design signals outdated practice
- Not ranking in "dentist near me" searches
- Not showing insurance accepted — first question of every new patient
- No before/after gallery — missed trust opportunity
- Not HIPAA-aware in form handling

**Industry-specific features:**
- Online appointment request form
- Insurance accepted display
- Before/after gallery system
- Google Maps + directions integration
- Services menu (cleanings, implants, cosmetic, etc.)
- Patient testimonials + star ratings
- Team profiles with credentials
- HIPAA-aware form handling notes

**Industry FAQ:**
- "Do you design websites that integrate with dental software like Dentrix or Eaglesoft?"
- "Is my patient contact form HIPAA compliant?"
- "Can you help my practice rank on Google Maps?"
- "How many dental websites have you built?"
- "Do you include online booking?"

---

### Industry 2: Church Websites

**URL:** `/industries/church/`
**Primary keyword:** "church website design"
**Secondary keywords:** "church web design", "faith organization website", "ministry website design"

**Title tag:** `Church Website Design | Roman Creative Studio`
**Meta description:** `Website design for churches and faith organizations that builds community and grows attendance. Roman Creative Studio builds church websites that connect. Book a free call.`

**H1:** "Church Website Design That Welcomes New Visitors Before They Walk Through the Door"

**Pain points specific to churches:**
- New families visit the website before ever visiting in person — first impression is digital
- No clear "I'm New" pathway for first-time visitors
- Service times + location are buried or outdated
- Events and announcements are scattered and hard to find
- Online giving not integrated or not trustworthy in appearance
- Live stream not prominently featured

**Industry-specific features:**
- "Plan Your Visit" section (address, times, what to expect)
- Online giving integration (Tithe.ly, Pushpay, Stripe)
- Sermon/message archive
- Events calendar
- Ministry/group directory
- Live stream integration
- Staff/leadership pages
- "I'm New Here" dedicated section or page

**Industry FAQ:**
- "Can you integrate our online giving platform?"
- "How do we keep the events calendar updated?"
- "Can you include a sermon library or podcast feed?"
- "Do you work with small churches or only large ones?"
- "How do we attract new families searching online?"

---

### Industry 3: Healthcare Websites

**URL:** `/industries/healthcare/`
**Primary keyword:** "healthcare website design"
**Secondary keywords:** "medical practice website", "medspa website design", "healthcare web design"

**Title tag:** `Healthcare & MedSpa Website Design | Roman Creative Studio`
**Meta description:** `Website design for healthcare practices and medspas that builds patient trust and drives appointments. Book a free discovery call with Roman Creative Studio.`

**H1:** "Healthcare Website Design That Builds Patient Trust and Drives Appointments"

**Pain points specific to healthcare:**
- Patients research providers extensively before booking — trust is everything
- HIPAA compliance concerns around forms and data handling
- Before/after gallery compliance requirements (medspas)
- Insurance and billing information is the top patient question
- Provider credentials need to be front and center
- Online booking expectation is now standard

**Industry-specific features:**
- Provider credentials + bios
- Insurance accepted section
- Before/after gallery (with proper consent disclaimers)
- HIPAA-aware form handling
- Online appointment request
- Services menu organized by treatment category
- Patient testimonials + star ratings
- Location + parking information

---

### Industry 4: Local Business Websites

**URL:** `/industries/local-business/`
**Primary keyword:** "local business website design"
**Secondary keywords:** "small business website", "local SEO website", "website for local business"

**Title tag:** `Local Business Website Design | Roman Creative Studio`
**Meta description:** `Website design for local businesses that ranks on Google and converts local customers. Roman Creative Studio builds local business websites that generate leads. Book a free call.`

**H1:** "Local Business Website Design That Ranks in Your City and Converts Your Neighbors"

**Pain points specific to local business:**
- Not showing up in Google local pack ("near me" searches)
- Website looks amateur compared to chain competitors
- No clear service area definition on the site
- Customer reviews not displayed prominently
- No consistent NAP (Name, Address, Phone) across the web

**Industry-specific features:**
- Local SEO structure (city + service keywords)
- Google Business Profile optimization guidance
- Service area map or text description
- Google/Yelp review display
- Phone number click-to-call (prominent mobile display)
- Hours of operation
- Local trust signals (years in business, community involvement)

---

### Industry 5: Real Estate Websites

**URL:** `/industries/real-estate/`
**Primary keyword:** "real estate website design"
**Secondary keywords:** "realtor website design", "real estate agent website", "property website design"

**Title tag:** `Real Estate Website Design | Roman Creative Studio`
**Meta description:** `Website design for real estate agents and brokers that generates leads and showcases listings. Roman Creative Studio builds real estate websites. Book a free discovery call.`

**H1:** "Real Estate Website Design That Generates Buyer and Seller Leads"

**Pain points specific to real estate:**
- Generic template sites look identical to every other agent
- No lead capture on property listing pages
- No clear value proposition for why a buyer/seller should choose this agent
- Market update content exists but isn't attracting traffic
- IDX integration is clunky or missing

**Industry-specific features:**
- Property showcase / listing display
- Lead capture forms per listing
- Neighborhood guides (SEO opportunity)
- Market statistics section
- Agent credentials and sales volume
- Testimonials from buyers and sellers
- IDX integration notes (third-party)
- Community/local area content

---

### Industry 6: Restaurant Websites

**URL:** `/industries/restaurant/`
**Primary keyword:** "restaurant website design"
**Secondary keywords:** "restaurant web design", "menu website design", "food business website"

**Title tag:** `Restaurant Website Design | Roman Creative Studio`
**Meta description:** `Website design for restaurants that showcases your menu, drives reservations, and builds local visibility. Book a free discovery call with Roman Creative Studio.`

**H1:** "Restaurant Website Design That Fills Tables and Drives Online Orders"

**Pain points specific to restaurants:**
- Menu is a PDF that can't be indexed by Google
- No online reservation or ordering integration
- Photography doesn't do the food justice
- Not ranking in local "restaurants near me" searches
- Hours and location are hard to find on mobile
- Social media is active but website is stale

**Industry-specific features:**
- Digital menu (HTML, not PDF)
- Online reservation integration (OpenTable, Resy, or direct)
- Online ordering integration (direct or third-party)
- Food photography showcase
- Location + hours prominently displayed (mobile-first)
- Private dining / events section
- Gift card link
- Local SEO for neighborhood + cuisine type

---

### Industry 7: Startup Websites

**URL:** `/industries/startup/`
**Primary keyword:** "startup website design"
**Secondary keywords:** "tech startup website", "SaaS landing page design", "startup web design agency"

**Title tag:** `Startup Website Design | Roman Creative Studio`
**Meta description:** `Website design for startups that communicates your value proposition clearly and converts visitors into users or investors. Book a free discovery call with Roman Creative Studio.`

**H1:** "Startup Website Design That Communicates What You Do in Under 5 Seconds"

**Pain points specific to startups:**
- Value proposition is unclear — visitors don't understand what the product does
- "We're disrupting X" language doesn't convert
- No clear differentiation from competitors
- Investor-facing and customer-facing pages mixed together
- No social proof (pre-launch or early-stage)
- Launch speed matters — can't spend 6 months on the website

**Industry-specific features:**
- Crystal-clear value proposition section
- Feature/benefit breakdown
- Pricing section (SaaS pricing table)
- Integration/compatibility display
- Early adopter or waitlist CTA option
- Investor section (if applicable, separate page)
- Social proof: beta users, press mentions, early metrics
- FAQ for product-specific questions

---

## Section 3 — Industry Page SEO Architecture

### Keyword Hierarchy

```
Primary (H1):     "[Industry] Website Design"
Secondary (H2):   "[Industry] Websites Built for [Outcome]"
Supporting (H3):  "[Feature] for [Industry]", "[Industry] Website FAQ"
Long-tail (body): "[Industry] website design for [city/region]" (if geo-targeting)
```

### Title Tag Formula
```
[Industry] Website Design | Roman Creative Studio
```
Max 60 characters.

### Meta Description Formula
```
[One sentence on what type of website + industry outcome].
Roman Creative Studio [builds/specializes in] [industry] websites. Book a free call.
```
Max 155 characters.

### Internal Links (per industry page)

Each industry page must link to:
1. 2–3 service pages ("Our dental websites include SEO Optimization — [link]")
2. 1–2 related industry pages ("We also serve healthcare practices — [link]")
3. Portfolio page or specific case study
4. Contact page (via CTA)

### Schema Markup

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "[Industry] Website Design",
  "provider": {
    "@type": "ProfessionalService",
    "name": "Roman Creative Studio",
    "url": "https://romancreativestudio.co"
  },
  "description": "[Industry-specific meta description]",
  "serviceType": "Website Design",
  "areaServed": "US"
}
```
