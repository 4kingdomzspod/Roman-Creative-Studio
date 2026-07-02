# Blog Strategy System
## Roman Creative Studio — Phase 7: Marketing Engine System

---

## Purpose of This Document

This document defines the blog architecture, article structure, SEO strategy, and content types for the Roman Creative Studio blog. The RCS blog is not a company news feed. It is a high-intent content engine that generates organic traffic, builds authority, and drives qualified visitors toward conversion.

Every article published has a defined keyword target, a defined audience, and a defined conversion path.

---

## Blog Philosophy

> **The RCS blog is a salesperson that works 24 hours a day, 7 days a week, without requiring a salary.**

A published article does not expire. It compounds. A well-optimized article written today may generate Discovery Call inquiries 3 years from now.

This means:
- Quality over quantity
- SEO-driven topics, not random ideas
- Specific over generic
- Every article ends with a clear next step

---

## Blog Categories

### Category 1 — Web Design Education
**Purpose:** Teach business owners about web design, user experience, and conversion optimization. Target informational and commercial-adjacent keywords.

**Example articles:**
- `"What Makes a High-Converting Website? (7 Essential Elements)"`
- `"How Much Does a Professional Website Cost in 2025?"`
- `"Website Redesign vs. New Website: Which Do You Need?"`
- `"10 Signs Your Business Website Is Losing You Customers"`
- `"What Is Conversion Rate Optimization and Why Does It Matter?"`
- `"How Long Does It Take to Build a Website?"`

**Keyword intent:** Informational + commercial
**Target audience:** Business owners researching web design
**Conversion path:** Article → Service page CTA → Discovery Call

---

### Category 2 — Industry Guides
**Purpose:** Establish deep niche authority in each target industry. Answer industry-specific questions that competitors are not answering well. Target high-intent long-tail keywords.

**Example articles (Dental):**
- `"5 Features Every Dental Website Must Have to Convert New Patients"`
- `"How to Get More Patients From Your Dental Website"`
- `"Dental Website Design: What Top-Performing Practices Do Differently"`
- `"HIPAA Compliance and Your Dental Website: What You Need to Know"`

**Example articles (Church):**
- `"How to Build a Church Website That Grows Your Congregation"`
- `"Church Website Features: What Visitors Actually Need"`
- `"Why Your Church Website Is Your Most Important Outreach Tool"`

**Example articles (Restaurant):**
- `"Restaurant Website Design: How to Turn Website Visitors Into Reservations"`
- `"Should Restaurants Have Online Ordering on Their Website?"`
- `"What Every Restaurant Website Needs (And Most Are Missing)"`

**One industry guide rule:** Publish a minimum of 3 supporting articles per industry. Each article links to the corresponding industry landing page.

**Keyword intent:** Informational + long-tail commercial
**Target audience:** Business owners in each specific vertical
**Conversion path:** Article → Industry landing page → Discovery Call

---

### Category 3 — Comparison Articles
**Purpose:** Capture bottom-of-funnel searchers actively comparing options. These searchers are closest to making a decision.

**Example articles:**
- `"Web Design Agency vs. Freelancer: Which Is Right for Your Business?"`
- `"Squarespace vs. Custom Website: Why It Matters for Your Business"`
- `"DIY Website vs. Professional Web Design: The Real Cost Comparison"`
- `"WordPress vs. Custom HTML: Which Should Your Business Choose?"`
- `"Cheap Website vs. Premium Website: What You're Actually Paying For"`

**Keyword intent:** Commercial investigation
**Target audience:** Decision-ready business owners evaluating options
**Conversion path:** Article → Direct CTA to book Discovery Call (no intermediate step — reader is ready)

---

### Category 4 — Case Study Breakdowns
**Purpose:** Transform completed projects into long-form authority content. Demonstrate measurable outcomes. Build trust at scale.

**Format:** Full case study article (see `CaseStudySystem.md` for structure)

**Example articles:**
- `"How We Redesigned [Dental Practice Name]'s Website and Increased New Patient Inquiries by 40%"`
- `"From Zero Online Presence to Full Booking: [Restaurant Name]'s Website Transformation"`
- `"How [Church Name] Used a New Website to Grow Their Online Congregation"`

**Keyword intent:** Navigational / brand awareness / long-tail commercial
**Target audience:** Prospects in the same industry as the case study subject
**Conversion path:** Case study → Related industry page CTA → Discovery Call

---

### Category 5 — "Best Of" and Resource Articles
**Purpose:** Capture research-phase searchers looking for curated information. Build backlinks through resource linkability.

**Example articles:**
- `"The Best Website Features for Local Service Businesses in 2025"`
- `"10 Website Mistakes That Cost Small Businesses Customers"`
- `"The Ultimate Checklist for Launching a New Business Website"`
- `"Best Practices for Healthcare Website Design"`

**Keyword intent:** Informational + research phase
**Target audience:** Business owners early in the awareness journey
**Conversion path:** Article → Lead magnet download (checklist or guide) → Email sequence → Discovery Call

---

## Article Structure Standard

Every blog article follows this structure:

### 1. SEO Title
- Contains primary keyword
- 50–60 characters for Google display
- Uses power words, numbers, or question format where relevant
- Never misleading; always delivers on the headline's promise

### 2. Meta Description
- 150–160 characters
- Contains primary keyword
- Ends with an implied or explicit CTA

### 3. Introduction (150–250 words)
- Opens with the problem or pain point — not with RCS
- Establishes why this article matters to the reader
- States clearly what the reader will learn
- No SEO keyword stuffing in the intro
- No generic openers (`"In today's digital world..."`)

### 4. Body Content (Structured with H2/H3 subheadings)
- Minimum 1,200 words; 1,500–2,500 words for authority articles
- Each H2 targets a secondary or LSI keyword
- Each section delivers the promised information completely
- Includes at least 1 internal link to a service or industry page per 400 words
- Includes relevant examples, data points, or industry-specific context
- Short paragraphs (3 sentences maximum)
- No padding, repetition, or filler sentences

### 5. FAQ Section (Optional but Recommended)
- 3–5 question-and-answer pairs targeting long-tail question keywords
- Use `FAQPage` JSON-LD schema markup
- Answers are concise (2–4 sentences) and complete

### 6. Conclusion (100–150 words)
- Summarizes the 1–2 most important takeaways
- Does NOT repeat the entire article
- Transitions naturally into the CTA

### 7. CTA Section
- Every article ends with a dedicated CTA block
- Primary CTA: `Book a Free Discovery Call` (links to booking page)
- Secondary CTA (optional): Lead magnet download or related service page
- CTA copy is specific to the article topic:
  - Dental article CTA: `"Ready to build a dental website that converts new patients? Book a free Discovery Call."`
  - Comparison article CTA: `"See the difference a premium web design agency makes. Book your free Discovery Call today."`

---

## Internal Linking Strategy

| Link Type | Rule |
|---|---|
| Service page links | Every article links to at least 1 relevant service page |
| Industry page links | Industry guide articles link to the corresponding industry landing page |
| Related articles | Each article links to 2–3 related blog posts |
| Anchor text | Descriptive, keyword-rich anchor text (never `"click here"`) |
| Link placement | At least 1 link in the first 300 words |
| No orphan pages | Every new article is linked from at least 1 existing page |

---

## Blog SEO Rules

1. **One primary keyword per article.** Target it in: title, URL, H1, first paragraph, at least 2 H2s, meta description, and image alt text.
2. **Keyword density:** Primary keyword appears naturally — approximately once per 200–300 words. No stuffing.
3. **URL format:** `/blog/[short-keyword-slug]/` — no dates, no stop words.
4. **Image requirements:** Every article includes at least 1 WebP image with descriptive alt text. Original graphics preferred over stock.
5. **Publish date:** Include original publish date. Update date when article is substantially revised.
6. **Author byline:** `By Alexander, Roman Creative Studio` — builds author authority signal.
7. **Word count signal:** Longer, more comprehensive articles outrank thin content for competitive keywords. Target 1,500+ words for all competitive topics.
8. **No AI-generated filler.** Every article must reflect genuine expertise and specific knowledge. Generic AI-sounding content damages authority and rankings.

---

## Blog Publishing Workflow

```
1. Keyword selection
   → Identify primary keyword from master keyword list
   → Confirm no existing page targets this keyword
   → Map to appropriate content pillar and blog category

2. Content brief creation
   → Define: Title / Primary keyword / Secondary keywords / Target audience / Word count target / Internal links required / CTA

3. Article writing
   → Follow article structure standard above
   → Include all required SEO elements

4. Review checklist
   → [ ] Primary keyword in title, URL, H1, meta description
   → [ ] Minimum word count met
   → [ ] At least 2 internal links
   → [ ] CTA section present
   → [ ] FAQ section with schema (if applicable)
   → [ ] Image with alt text
   → [ ] Brand voice check (no weak/vague language)

5. Publish and distribute
   → Publish blog article
   → Add to sitemap
   → Distribute via email newsletter (Thursday send)
   → Repurpose to LinkedIn, Instagram, TikTok (see ContentRepurposingEngine.md)
   → Link from at least 1 existing page
```

---

## Blog Content Calendar (Sample — 12 Weeks)

| Week | Category | Title | Primary Keyword | Target Industry |
|---|---|---|---|---|
| 1 | Education | What Makes a High-Converting Website? | high converting website | All |
| 2 | Industry Guide | 5 Features Every Dental Website Must Have | dental website design | Dental |
| 3 | Comparison | Web Design Agency vs. Freelancer | web design agency vs freelancer | All |
| 4 | Case Study | How We Helped [Client] Increase Inquiries | [client industry] website design | [Client industry] |
| 5 | Education | How Much Does a Professional Website Cost? | how much does a website cost | All |
| 6 | Industry Guide | How Churches Can Use Their Website to Grow | church website design | Church |
| 7 | Best Of | 10 Website Mistakes Costing You Customers | website mistakes small business | All |
| 8 | Industry Guide | Restaurant Website Design: Visitors to Reservations | restaurant website design | Restaurant |
| 9 | Education | What Is Conversion Rate Optimization? | conversion rate optimization | All |
| 10 | Comparison | DIY Website vs. Professional Design: Real Cost | DIY website vs professional | All |
| 11 | Industry Guide | Healthcare Website Design: What Patients Need | healthcare website design | Healthcare |
| 12 | Best Of | The Ultimate Website Launch Checklist | website launch checklist | All |
