# Information Architecture
## Roman Creative Studio — Phase 4, Document 2

---

### Definition

Information Architecture (IA) is the structural blueprint of the website. It defines what pages exist, what each page does, how they connect, and what hierarchy they occupy.

Every page in this system serves **one primary intent**. No page serves two masters.

---

## Section 1 — Full Page Inventory

### 1.1 Core Pages (Always Required)

| Page | URL | Primary Intent | Primary CTA |
|---|---|---|---|
| Home | `/` | Convert first-time visitors | Book a Discovery Call |
| About | `/about/` | Build trust and connection | Book a Discovery Call |
| Services | `/services/` | Show breadth, drive to individual pages | Explore Services |
| Portfolio | `/portfolio/` | Demonstrate results | View Case Study |
| Industries | `/industries/` | Show specialization, drive to industry pages | See Our Work |
| Blog | `/blog/` | Build topical authority, attract SEO traffic | Read Article |
| Contact | `/contact/` | Convert warm leads to conversations | Send Message |

### 1.2 Service Pages (Individual)

| Page | URL | Primary Intent | Primary CTA |
|---|---|---|---|
| Brand Identity Design | `/services/brand-identity/` | Sell brand design service | Book a Discovery Call |
| Website Design | `/services/website-design/` | Sell website design service | Book a Discovery Call |
| Website Redesign | `/services/website-redesign/` | Target businesses with outdated sites | Book a Discovery Call |
| SEO Optimization | `/services/seo-optimization/` | Sell SEO as growth strategy | Book a Discovery Call |
| Conversion Optimization | `/services/conversion-optimization/` | Sell CRO as revenue lever | Book a Discovery Call |
| Website Care & Maintenance | `/services/website-care/` | Sell ongoing retainer relationship | Get a Care Plan |

### 1.3 Industry Pages (SEO Engine)

| Page | URL | Primary Intent | Primary CTA |
|---|---|---|---|
| Dental Websites | `/industries/dental/` | Rank for dental web design + convert | Book a Discovery Call |
| Church Websites | `/industries/church/` | Rank for church web design + convert | Book a Discovery Call |
| Healthcare Websites | `/industries/healthcare/` | Rank for healthcare web design + convert | Book a Discovery Call |
| Local Business Websites | `/industries/local-business/` | Rank for local business web design + convert | Book a Discovery Call |
| Real Estate Websites | `/industries/real-estate/` | Rank for real estate web design + convert | Book a Discovery Call |
| Restaurant Websites | `/industries/restaurant/` | Rank for restaurant web design + convert | Book a Discovery Call |
| Startup Websites | `/industries/startup/` | Rank for startup web design + convert | Book a Discovery Call |

### 1.4 Support Pages

| Page | URL | Primary Intent |
|---|---|---|
| FAQ | `/faq/` | Handle objections, reduce contact friction |
| Pricing | `/pricing/` | Qualify leads, anchor value |
| Privacy Policy | `/privacy/` | Legal compliance, trust signal |
| Terms of Service | `/terms/` | Legal compliance |
| 404 Error | `/404.html` | Retain bouncing visitors |
| Thank You | `/thank-you/` | Confirm conversion, guide next step |

### 1.5 Portfolio / Case Study Pages

| Page | URL | Primary Intent |
|---|---|---|
| Portfolio Index | `/portfolio/` | Gallery of all work |
| Case Study (individual) | `/portfolio/[client-slug]/` | Deep proof of results for one client |

---

## Section 2 — Navigation Architecture

### 2.1 Primary Navigation (Desktop)

```
Logo  |  Services ▾  |  Industries ▾  |  Portfolio  |  About  |  Blog  |  [Book a Call]
```

**Services Dropdown:**
- Brand Identity Design
- Website Design
- Website Redesign
- SEO Optimization
- Conversion Optimization
- Website Care & Maintenance

**Industries Dropdown:**
- Dental
- Church
- Healthcare
- Local Business
- Real Estate
- Restaurant
- Startups

### 2.2 Mobile Navigation

```
Logo                              [☰ Menu]

[Drawer Open State]
─ Services
  ─ Brand Identity
  ─ Website Design
  ─ Website Redesign
  ─ SEO Optimization
  ─ Conversion Optimization
  ─ Website Care
─ Industries
  ─ [7 industry links]
─ Portfolio
─ About
─ Blog
─ Contact
─ [Book a Free Call]  ← Gold button, full-width at bottom
```

**Rule:** Mobile nav must close on link click. Focus returns to trigger. Escape key closes drawer.

### 2.3 Footer Architecture

```
Column 1: Brand
  Logo
  Tagline
  Contact info (email only)
  Social links

Column 2: Services
  Brand Identity Design
  Website Design
  Website Redesign
  SEO Optimization
  Conversion Optimization
  Website Care

Column 3: Industries
  Dental / Church / Healthcare
  Local Business / Real Estate
  Restaurant / Startups

Column 4: Company
  About
  Portfolio
  Blog
  FAQ
  Contact

Bottom Bar:
  © 2024 Roman Creative Studio. All rights reserved.
  Privacy Policy  |  Terms of Service
```

---

## Section 3 — URL Structure Rules

### 3.1 URL Format

```
Format:   /[section]/[page-slug]/
Example:  /services/website-design/
Example:  /industries/dental/
Example:  /portfolio/sacred-heart-dental/
Example:  /blog/how-to-redesign-your-dental-website/
```

### 3.2 URL Rules

| Rule | Correct | Wrong |
|---|---|---|
| Always lowercase | `/services/brand-identity/` | `/Services/BrandIdentity/` |
| Hyphens only, no underscores | `/website-design/` | `/website_design/` |
| No trailing parameters | `/dental/` | `/dental?ref=home` |
| Trailing slash consistent | `/about/` | `/about` (inconsistent) |
| No keyword stuffing | `/dental-website-design/` | `/best-dental-website-design-company/` |
| Canonical on all pages | `<link rel="canonical">` | Missing canonical |

### 3.3 Canonical URL Standard

Every page must include:
```html
<link rel="canonical" href="https://romancreativestudio.co/[page-path]/">
```

---

## Section 4 — Page Intent Matrix

Each page has exactly one primary intent and one secondary intent. Never two primary intents.

| Page | Primary Intent | Secondary Intent | Forbidden |
|---|---|---|---|
| Home | Convert visitor to lead | Establish brand positioning | Detailed service descriptions |
| About | Build emotional trust | Show team/process | Sell services directly |
| Services (index) | Route visitor to correct service page | Show breadth of capability | Deep service explanations |
| Service (individual) | Sell that specific service | Establish authority in that area | Pitching unrelated services |
| Industries (index) | Route to correct industry page | Show specialization | Generic agency talk |
| Industry (individual) | Rank for that industry keyword + convert | Demonstrate industry knowledge | Generic web design talk |
| Portfolio | Show proof of results | Build confidence in quality | Sell services |
| Case Study | Prove one specific result in depth | Make visitor imagine their own result | Portfolio browsing |
| Blog | Rank for informational keywords | Build authority | Selling in every paragraph |
| Contact | Receive lead conversion | Reduce friction for contact | Introducing new services |
| FAQ | Eliminate objections | Reduce contact friction | Creating new uncertainty |
| 404 | Recover lost visitor | Return them to productive path | Dead end |

---

## Section 5 — Internal Linking Architecture

### 5.1 Hub-and-Spoke Model

```
Home (Hub)
├── Services (Hub)
│   ├── Brand Identity (Spoke)
│   ├── Website Design (Spoke)
│   ├── Website Redesign (Spoke)
│   ├── SEO Optimization (Spoke)
│   ├── Conversion Optimization (Spoke)
│   └── Website Care (Spoke)
├── Industries (Hub)
│   ├── Dental (Spoke)
│   ├── Church (Spoke)
│   ├── Healthcare (Spoke)
│   ├── Local Business (Spoke)
│   ├── Real Estate (Spoke)
│   ├── Restaurant (Spoke)
│   └── Startup (Spoke)
├── Portfolio (Hub)
│   └── Case Studies (Spokes)
└── Blog (Hub)
    └── Articles (Spokes)
```

### 5.2 Internal Link Rules

1. **Every service page links to 2–3 related industry pages** ("We design websites for dental practices → see Dental Websites")
2. **Every industry page links to 2–3 related service pages** ("Dental websites need strong SEO → see SEO Optimization")
3. **Blog articles link to relevant service or industry pages** (contextual anchor text, not generic "click here")
4. **Portfolio case studies link to the service used** and the industry page
5. **Homepage links to top-performing service, top industry page, and portfolio**
6. **No orphan pages** — every page must be linked from at least one other page

### 5.3 Anchor Text Rules

| Type | Correct | Wrong |
|---|---|---|
| Descriptive | "dental website design" | "click here" |
| Natural | "how we approach SEO" | "SEO Optimization page" |
| Keyword-relevant | "website redesign for local businesses" | "learn more" |
| Never over-optimized | Use phrase naturally in sentence | Repeating exact keyword 5× |

---

## Section 6 — Page Depth Rules

**Maximum navigation depth: 3 levels**

```
Level 1:  /services/              (hub page)
Level 2:  /services/website-design/   (service page)
Level 3:  /portfolio/client-case/     (case study — deepest allowed)
```

No page should require more than 3 clicks from the homepage to reach.

---

## Section 7 — IA Governance

### Adding New Pages

Before creating a new page, answer all of the following:
1. What is the single primary intent of this page?
2. What keyword(s) will this page rank for?
3. Where does this page sit in the navigation/IA?
4. What page links TO this page (it cannot be an orphan)?
5. What is the primary CTA on this page?

If any question cannot be answered, **the page does not get created**.

### Retiring Pages

Before removing a page:
1. Check if any other page links to it (fix those links first)
2. Set up a 301 redirect to the most relevant current page
3. Update sitemap.xml
4. Check Google Search Console for any indexed traffic before removal
