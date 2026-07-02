# Industry Page System
## Roman Creative Studio — Phase 4, Document 6

---

### Purpose

Industry pages are the SEO growth engine of the Roman Creative Studio website.

They serve two simultaneous functions:
1. **Rank on Google** for high-intent keywords like "dental website design" or "church website design"
2. **Convert visitors** from that industry who land on the page

A visitor arriving on `/industries/dental/` has already signaled high intent. This page must confirm: *yes, we do, and here's the proof.*

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

## Section 2 — Individual Industry Specifications

### Industry 1: Dental Websites

**URL:** `/industries/dental/`
**Primary keyword:** "dental website design"
**Title tag:** `Dental Website Design | Roman Creative Studio`
**H1:** "Dental Website Design That Converts Website Visitors Into Patients"

**Pain points specific to dental:**
- No online appointment booking loses patients immediately
- Outdated design signals outdated practice
- Not ranking in "dentist near me" searches
- Not showing insurance accepted
- No before/after gallery
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

---

### Industry 2: Church Websites

**URL:** `/industries/church/`
**Primary keyword:** "church website design"
**Title tag:** `Church Website Design | Roman Creative Studio`
**H1:** "Church Website Design That Welcomes New Visitors Before They Walk Through the Door"

**Industry-specific features:**
- "Plan Your Visit" section (address, times, what to expect)
- Online giving integration (Tithe.ly, Pushpay, Stripe)
- Sermon/message archive
- Events calendar
- Ministry/group directory
- Live stream integration
- Staff/leadership pages
- "I'm New Here" dedicated section or page

---

### Industry 3: Healthcare Websites

**URL:** `/industries/healthcare/`
**Primary keyword:** "healthcare website design"
**Title tag:** `Healthcare & MedSpa Website Design | Roman Creative Studio`
**H1:** "Healthcare Website Design That Builds Patient Trust and Drives Appointments"

**Industry-specific features:**
- Provider credentials + bios
- Insurance accepted section
- Before/after gallery (with proper consent disclaimers)
- HIPAA-aware form handling
- Online appointment request
- Services menu organized by treatment category

---

### Industry 4: Local Business Websites

**URL:** `/industries/local-business/`
**Primary keyword:** "local business website design"
**Title tag:** `Local Business Website Design | Roman Creative Studio`
**H1:** "Local Business Website Design That Ranks in Your City and Converts Your Neighbors"

**Industry-specific features:**
- Local SEO structure (city + service keywords)
- Google Business Profile optimization guidance
- Service area map or text description
- Google/Yelp review display
- Phone number click-to-call
- Hours of operation

---

### Industry 5: Real Estate Websites

**URL:** `/industries/real-estate/`
**Primary keyword:** "real estate website design"
**Title tag:** `Real Estate Website Design | Roman Creative Studio`
**H1:** "Real Estate Website Design That Generates Buyer and Seller Leads"

**Industry-specific features:**
- Property showcase / listing display
- Lead capture forms per listing
- Neighborhood guides (SEO opportunity)
- Agent credentials and sales volume
- Testimonials from buyers and sellers
- IDX integration notes

---

### Industry 6: Restaurant Websites

**URL:** `/industries/restaurant/`
**Primary keyword:** "restaurant website design"
**Title tag:** `Restaurant Website Design | Roman Creative Studio`
**H1:** "Restaurant Website Design That Fills Tables and Drives Online Orders"

**Industry-specific features:**
- Digital menu (HTML, not PDF)
- Online reservation integration (OpenTable, Resy, or direct)
- Online ordering integration
- Food photography showcase
- Location + hours prominently displayed (mobile-first)
- Local SEO for neighborhood + cuisine type

---

### Industry 7: Startup Websites

**URL:** `/industries/startup/`
**Primary keyword:** "startup website design"
**Title tag:** `Startup Website Design | Roman Creative Studio`
**H1:** "Startup Website Design That Communicates What You Do in Under 5 Seconds"

**Industry-specific features:**
- Crystal-clear value proposition section
- Feature/benefit breakdown
- Pricing section (SaaS pricing table)
- Early adopter or waitlist CTA option
- Social proof: beta users, press mentions, early metrics
- FAQ for product-specific questions

---

## Section 3 — Industry Page SEO Architecture

### Title Tag Formula
```
[Industry] Website Design | Roman Creative Studio
```

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