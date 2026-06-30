# SEO Architecture System
## Roman Creative Studio — Phase 4, Document 7

---

### Purpose

SEO architecture determines how Google understands, categorizes, and ranks the Roman Creative Studio website. It is not a checklist applied after the site is built — it is a structural decision made before a single page is written.

This document defines the rules, structures, and standards that govern all SEO decisions across the entire site.

---

## Section 1 — Keyword Strategy

### 1.1 Keyword Hierarchy

**Tier 1 — Brand Keywords** (highest conversion intent)
```
roman creative studio
roman creative studio web design
```
Strategy: Dominate brand search. Never lose brand rankings.

**Tier 2 — Service Keywords** (high intent, competitive)
```
website design agency
custom website design
brand identity design
website redesign service
SEO optimization service
conversion rate optimization
website maintenance service
```
Strategy: Rank for primary service terms. Requires domain authority over time.

**Tier 3 — Industry Keywords** (high intent, less competitive = priority)
```
dental website design
church website design
healthcare website design
local business website design
real estate website design
restaurant website design
startup website design
```
Strategy: **These are the primary SEO growth targets.** Less competition than generic "web design" terms. High-intent visitors. RCS has built-in expertise signals.

**Tier 4 — Informational Keywords** (low intent, high volume, builds authority)
```
how to redesign a dental practice website
what makes a good church website
how much does website design cost
website design vs website builder
```
Strategy: Blog content. Builds topical authority. Funnels to service pages.

### 1.2 Keyword Clustering Strategy

Keywords are grouped into clusters. Each cluster is owned by one page. No two pages target the same primary keyword.

**Cluster 1 — Website Design (owned by `/services/website-design/`)**
- website design
- custom website design
- professional website design
- small business website design

**Cluster 2 — Dental Websites (owned by `/industries/dental/`)**
- dental website design
- dental practice website
- dentist website design
- dental SEO

**Cluster 3 — Church Websites (owned by `/industries/church/`)**
- church website design
- church web design
- faith organization website
- ministry website

**Cluster 4 — Brand Identity (owned by `/services/brand-identity/`)**
- brand identity design
- logo design service
- visual identity design
- brand guidelines

*(One cluster per page, documented for each service and industry page in their respective documents)*

### 1.3 Keyword Cannibalization Rule

If two pages target the same primary keyword, Google does not know which to rank and may rank neither.

**Prevention:**
- Each keyword cluster is assigned to exactly one page
- Before creating new content, check the keyword map to ensure no overlap
- If two pages compete, consolidate or redirect the weaker page

---

## Section 2 — URL Structure Rules

### 2.1 URL Format Standard

```
https://romancreativestudio.co/[section]/[page-slug]/

Examples:
https://romancreativestudio.co/services/website-design/
https://romancreativestudio.co/industries/dental/
https://romancreativestudio.co/blog/how-to-redesign-dental-website/
https://romancreativestudio.co/portfolio/coastal-dental-group/
```

### 2.2 URL Rules

| Rule | Compliant | Non-Compliant |
|---|---|---|
| Lowercase only | `/services/website-design/` | `/Services/WebsiteDesign/` |
| Hyphens only | `/dental-website-design/` | `/dental_website_design/` |
| No stop words | `/dental-website-design/` | `/the-best-dental-website-design/` |
| Keyword in URL | `/website-redesign/` | `/service-3/` |
| No trailing numbers | `/dental/` | `/dental-1/` |
| Consistent trailing slash | `/about/` | `/about` (pick one, apply site-wide) |
| Canonical tag on every page | `<link rel="canonical">` present | Missing canonical |

### 2.3 URL Depth Limit

Maximum URL depth: 3 levels
```
Level 1: /services/
Level 2: /services/website-design/
Level 3: /blog/category/article-slug/   (max depth)
```

---

## Section 3 — Heading Structure Rules

### 3.1 H1 Rules

- One H1 per page — never zero, never two
- H1 must contain the primary keyword for that page
- H1 is the visible headline (never hidden for SEO only)
- H1 is set in semantic HTML `<h1>` not CSS-styled `<div>`

**Formula:** `[Primary Keyword] + [Outcome or Differentiator]`
```
H1 for /services/website-design/:
"Website Design That Converts Visitors Into Clients"

H1 for /industries/dental/:
"Dental Website Design That Converts Website Visitors Into Patients"

H1 for /blog/dental-website-tips/:
"7 Things Every Dental Practice Website Must Have in 2024"
```

### 3.2 H2 Rules

- Multiple H2s allowed per page
- H2s define major page sections
- H2s should contain secondary keywords where natural
- H2s must be descriptive enough to understand the section without reading it

**Example H2s for /services/website-design/:**
```
<h2>Why Your Current Website Isn't Generating Leads</h2>
<h2>Our Website Design Process</h2>
<h2>What's Included in Every Website Design Project</h2>
<h2>Website Design Case Studies</h2>
<h2>Website Design FAQ</h2>
```

### 3.3 H3 Rules

- H3s are subsections within H2 sections
- H3s can be feature names, FAQ questions, process steps
- H3s should not contain the same keyword as the H1
- H3s do not need to contain keywords — clarity over optimization

### 3.4 Heading Hierarchy Enforcement

```
✅ Correct:
<h1>Dental Website Design</h1>
  <h2>Common Dental Website Problems</h2>
    <h3>No Online Booking</h3>
    <h3>Poor Mobile Experience</h3>
  <h2>Our Dental Website Design Process</h2>

❌ Wrong:
<h1>Dental Website Design</h1>
  <h3>Common Problems</h3>  ← Skipped H2
  <h2>Process</h2>
```

Never skip heading levels. H1 → H2 → H3, in order.

---

## Section 4 — Metadata Structure

### 4.1 Title Tag Rules

**Format:** `[Primary Keyword] | Roman Creative Studio`
**Max length:** 60 characters (Google truncates at ~60)
**Min length:** 30 characters

| Page | Title Tag Example |
|---|---|
| Home | `Roman Creative Studio \| Premium Web Design for Service Businesses` |
| Website Design | `Website Design for Service Businesses \| Roman Creative Studio` |
| Dental | `Dental Website Design \| Roman Creative Studio` |
| About | `About Roman Creative Studio \| Web Design Agency` |
| Blog article | `[Article Title] \| Roman Creative Studio` |

**Rules:**
- Never duplicate title tags across pages
- Never use generic titles ("Home", "Services", "Page 1")
- Brand name always at the end (after the pipe)
- Primary keyword always at the beginning

### 4.2 Meta Description Rules

**Max length:** 155 characters
**Required:** Yes, on every page
**Purpose:** Not a ranking factor — it's a click-through rate driver (it shows in search results)

**Formula:**
```
[One sentence describing outcome for visitor] + [Soft call to action with brand name]
```

**Examples:**
```
/services/website-design/:
"Custom website design built for conversion, speed, and SEO.
Roman Creative Studio builds websites that generate leads. Book a free discovery call."

/industries/dental/:
"Website design for dental practices that builds patient trust and drives appointments.
Roman Creative Studio specializes in dental web design. Book a free call."
```

**Rules:**
- Every page needs a unique meta description
- Never keyword-stuff the meta description
- Include a passive CTA ("Book a free call", "See our work")
- Write for the human, not the algorithm

### 4.3 Open Graph Tags (required on all pages)

```html
<meta property="og:title" content="[Page Title]">
<meta property="og:description" content="[Meta description or variation]">
<meta property="og:image" content="https://romancreativestudio.co/assets/images/og-[page].jpg">
<meta property="og:url" content="https://romancreativestudio.co/[page-path]/">
<meta property="og:type" content="website">  <!-- or "article" for blog posts -->
<meta property="og:site_name" content="Roman Creative Studio">
```

**OG image specs:** 1200×630px, `#0C0E11` background, white/gold text, RCS logo — per Phase 2C SocialMediaBrandingRules

### 4.4 Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="[Page Title]">
<meta name="twitter:description" content="[Meta description]">
<meta name="twitter:image" content="https://romancreativestudio.co/assets/images/og-[page].jpg">
```

---

## Section 5 — Image SEO Rules

### 5.1 Alt Text Standard

**Purpose:** Alt text describes the image to screen readers AND to Google Image Search.

| Image Type | Alt Text Formula | Example |
|---|---|---|
| Hero image | Descriptive + page context | `"Roman Creative Studio website design portfolio mockup"` |
| Service image | Service name + action | `"Custom brand identity design process"` |
| Case study image | Client type + outcome | `"Dental practice website redesign - before and after"` |
| Team photo | Person + role | `"Alexander, founder of Roman Creative Studio"` |
| Icon | Function description | `"Website performance optimization icon"` |
| Decorative | Empty alt (intentional) | `alt=""` |

**Rules:**
- Never: `alt="image.jpg"` or `alt="photo"`
- Never: Keyword-stuffed alt text (`alt="website design web design custom web design"` — this is spam)
- Always: Descriptive enough to understand content without seeing the image
- Decorative images: `alt=""` (empty string tells screen readers to skip it)

### 5.2 Image File Naming

**Format:** `[descriptor]-[context]-[variant].[ext]`

```
✅ Correct:  dental-website-design-mockup.webp
❌ Wrong:    IMG_4823.jpg
❌ Wrong:    website-design-web-design-agency-services.webp
```

### 5.3 Image Format Rules

| Use Case | Format | Why |
|---|---|---|
| Photographs | WebP (JPEG fallback) | Best compression/quality ratio |
| Graphics / UI | WebP or PNG | Transparency support if needed |
| Logos | SVG | Resolution-independent |
| Icons | SVG inline | Inherits color, scalable |
| OG/Social images | JPEG | Broadest compatibility |

**Never:** GIF for static images. Never JPEG for logos or graphics with text.

---

## Section 6 — Technical SEO Requirements

### 6.1 sitemap.xml

**Location:** `https://romancreativestudio.co/sitemap.xml`
**Required entries:** Every indexable page
**Excluded:** 404, thank-you, privacy, terms (optional exclusion)

**Format:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://romancreativestudio.co/</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://romancreativestudio.co/services/website-design/</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>0.8</priority>
  </url>
  <!-- ... all pages ... -->
</urlset>
```

**Priority values:**
- Home: 1.0
- Core service pages: 0.9
- Industry pages: 0.9
- Portfolio: 0.8
- Blog posts: 0.7
- Support pages: 0.5

### 6.2 robots.txt

**Location:** `https://romancreativestudio.co/robots.txt`

```
User-agent: *
Allow: /
Disallow: /thank-you/

Sitemap: https://romancreativestudio.co/sitemap.xml
```

### 6.3 Canonical Tags

Required on every page:
```html
<link rel="canonical" href="https://romancreativestudio.co/[page-path]/">
```

**Purpose:** Prevents duplicate content penalties when pages are accessible via multiple URLs.

### 6.4 JSON-LD Structured Data

**On Homepage:**
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Roman Creative Studio",
  "url": "https://romancreativestudio.co",
  "email": "Alexander@romancreativestudio.co",
  "description": "Premium web design agency specializing in dental, church, healthcare, and service business websites.",
  "areaServed": "US",
  "serviceType": ["Web Design", "SEO", "Brand Identity", "Conversion Optimization"],
  "sameAs": [
    "https://instagram.com/romancreativestudio",
    "https://linkedin.com/company/romancreativestudio"
  ]
}
```

**On Blog Posts:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Article Title]",
  "author": {
    "@type": "Person",
    "name": "Alexander"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Roman Creative Studio",
    "url": "https://romancreativestudio.co"
  },
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]"
}
```

**On FAQ Sections:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Question text]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer text]"
      }
    }
  ]
}
```

FAQ schema surfaces the FAQ directly in Google search results — increases SERP real estate.

---

## Section 7 — Content Silo Structure

Content silos group related pages under a single topic to build topical authority. Google rewards sites that comprehensively cover a topic.

```
SILO 1: Web Design Services
  Hub:    /services/
  Spokes: /services/website-design/
          /services/website-redesign/
          /services/brand-identity/
          /services/seo-optimization/
          /services/conversion-optimization/
          /services/website-care/
  Blog:   /blog/how-to-choose-a-web-design-agency/
          /blog/website-design-cost-guide/
          /blog/custom-vs-template-website/

SILO 2: Industry Web Design
  Hub:    /industries/
  Spokes: /industries/dental/
          /industries/church/
          /industries/healthcare/
          /industries/local-business/
          /industries/real-estate/
          /industries/restaurant/
          /industries/startup/
  Blog:   /blog/dental-website-must-haves/
          /blog/church-website-checklist/
          /blog/restaurant-website-guide/

SILO 3: Portfolio & Results
  Hub:    /portfolio/
  Spokes: /portfolio/[case-study-slug]/
  Blog:   /blog/[case-study-breakdown-articles]/
```

**Silo rule:** Pages within a silo link heavily to each other. Pages cross-link between silos sparingly and contextually.

---

## Section 8 — Local SEO Strategy

### 8.1 Google Business Profile

RCS must maintain a verified Google Business Profile:
- Business name: Roman Creative Studio
- Category: Web Designer
- Website: https://romancreativestudio.co
- Email: Alexander@romancreativestudio.co
- Description: includes primary keywords
- Services list: all 6 services
- Regular posts: at least 1x/month
- Responding to reviews: within 48 hours

### 8.2 NAP Consistency

Name, Address (if applicable), Phone must be identical across:
- Website footer
- Google Business Profile
- Any directory listings (Clutch, DesignRush, etc.)
- Social media profiles

### 8.3 Geographic Targeting

If RCS serves specific geographic markets:
- Add city-specific landing pages: `/web-design-[city]/`
- Add city name to service page title tags where relevant
- Add LocalBusiness schema with address if applicable

If RCS serves clients nationally/remotely:
- Focus on industry keywords (not geo keywords)
- Reference "serving clients across the US" in copy
- Use `areaServed: "US"` in schema

---

## Section 9 — SEO Governance

### 9.1 Monthly SEO Checks

- [ ] Google Search Console: check for crawl errors
- [ ] Check impressions + clicks for top 10 keywords
- [ ] Check Core Web Vitals report
- [ ] Verify new pages are indexed
- [ ] Check for broken internal links

### 9.2 Quarterly SEO Review

- [ ] Update meta descriptions on low CTR pages
- [ ] Add new blog content to underserved keyword clusters
- [ ] Audit internal linking — ensure no orphan pages
- [ ] Review competitor rankings for Tier 3 industry keywords
- [ ] Update sitemap.xml with new pages

### 9.3 SEO Anti-Patterns

| Anti-Pattern | Why It Hurts |
|---|---|
| Keyword stuffing in copy | Google penalty + poor readability |
| Duplicate title tags | Confuses Google on which page to rank |
| Missing H1 | Major on-page SEO signal lost |
| Images without alt text | Accessibility violation + SEO signal lost |
| Pages with no internal links pointing to them | Google may not find or crawl them |
| Changing URLs without 301 redirects | Loses accumulated ranking equity |
| Blocking Googlebot in robots.txt | Site disappears from search entirely |
