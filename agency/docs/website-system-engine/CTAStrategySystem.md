# CTA Strategy System
## Roman Creative Studio — Phase 4, Document 12

---

### Definition

A Call-to-Action (CTA) is not a button. It is a decision point — the moment a visitor chooses whether to move forward or leave.

Every CTA must earn its placement. It must appear at the right moment in the visitor's journey, with the right message, and ask for the right level of commitment.

**The governing rule:** Every page has ONE dominant CTA. Supporting CTAs exist in service of that dominant action.

---

## Section 1 — CTA Hierarchy

### Primary CTA — Book a Free Discovery Call

**Purpose:** Primary conversion action across all high-intent pages
**Button style:** `btn btn--primary btn--lg` or `btn--xl` (final CTA sections)
**Placement:** Hero section, mid-page CTA, final CTA section
**Target:** `/contact/` with Calendly embed, or a direct Calendly booking link

**Label variants (use consistently):**
- "Book a Free Discovery Call" — default
- "Book a Free Call" — space-constrained contexts (mobile, nav)
- "Get Started" — never. Too vague.
- "Contact Us" — never as primary CTA. Implies email, not conversation.

---

### Secondary CTA — View Our Work

**Purpose:** Directs unconvinced visitors to proof before asking for conversion
**Button style:** `btn btn--secondary btn--lg`
**Placement:** Hero section (paired with Primary CTA), after service descriptions
**Target:** `/portfolio/`

**Label variants:**
- "View Our Work" — default
- "See Our Portfolio" — acceptable variation
- "View Case Studies" — use on service pages specifically

---

### Tertiary CTA — Contact / Send a Message

**Purpose:** Lower-commitment option for visitors not ready to book a call
**Button style:** Text link or `btn btn--ghost`
**Placement:** Below primary CTA as fallback, in footer area
**Target:** `/contact/` (form)

**Label variants:**
- "Or send us a message" — after primary CTA (small, de-emphasized)
- "Email us at Alexander@romancreativestudio.co" — in footer, final CTA sections

---

## Section 2 — CTA Placement by Page

### 2.1 Homepage CTA Map

```
Position 1 — Hero section (top of page)
  Primary:   "Book a Free Discovery Call"   [btn--primary btn--lg]
  Secondary: "View Our Work"                [btn--secondary btn--lg]
  Support:   "✓ No commitment. ✓ Free 30-min call."

Position 2 — Services section (mid-page, after services grid)
  Action:    "Explore All Services"         [btn--secondary btn--md]
  Purpose:   Routing, not conversion (drives to /services/)

Position 3 — Case Studies section
  Action:    "View All Work"                [btn--secondary btn--md]
  Purpose:   Routing to portfolio

Position 4 — Final CTA section (bottom of page)
  Primary:   "Book a Free Discovery Call"   [btn--primary btn--xl]
  Fallback:  "Or email Alexander@romancreativestudio.co"  [text link]
  Support:   "No commitment. No sales pressure. Just a conversation."
```

### 2.2 Service Page CTA Map

```
Position 1 — Hero
  Primary:   "Book a Free Discovery Call"   [btn--primary btn--lg]
  Secondary: "View [Service] Case Studies"  [btn--secondary btn--md]

Position 2 — After "What's Included" section
  Primary:   "Start Your [Service] Project" [btn--primary btn--md]
  Note:      Label uses service name for specificity

Position 3 — After Case Studies
  Primary:   "Book a Free Discovery Call"   [btn--primary btn--lg]

Position 4 — After FAQ (final section)
  Primary:   "Book a Free Discovery Call"   [btn--primary btn--xl]
  Fallback:  Email link
  Support:   Reassurance line
```

### 2.3 Industry Page CTA Map

```
Position 1 — Hero
  Primary:   "Book a Free Discovery Call"   [btn--primary btn--lg]
  Support:   Industry-specific trust line

Position 2 — After Features section
  Primary:   "Get a [Industry] Website Built Right"  [btn--primary btn--md]
  Note:      Industry-specific label increases relevance

Position 3 — After Case Study / Portfolio
  Action:    "See More Work"                [btn--secondary btn--sm]
  Purpose:   Routing to portfolio

Position 4 — After FAQ (final section)
  Primary:   "Book a Free Discovery Call"   [btn--primary btn--xl]
  Support:   "No commitment. 30-minute call."
```

### 2.4 Blog Article CTA Map

```
Position 1 — Mid-article (after main value delivery)
  Format:    Inline callout box (not a full CTA section)
  Label:     Contextual to article topic
  Example:   "Need help with your dental website's SEO?
              See how we approach SEO for dental practices. [link]"
  Style:     Subtle — never interrupts reading flow

Position 2 — After conclusion
  Primary:   "Book a Free Discovery Call"   [btn--primary btn--md]
  Support:   "We'll discuss your specific situation. No commitment."
```

**Blog CTA rule:** Never hard-sell in educational content. The article already demonstrated value. The CTA says "if you want this done for you, here's how."

### 2.5 Contact Page

```
The form itself is the CTA. No additional CTA buttons.

Form submit button label: "Send My Project Details"
Alternative below form: "Prefer to book directly? [Schedule a call via Calendly]"
```

### 2.6 Portfolio / Case Study Page

```
End of each case study:
  Headline:  "Ready for results like this?"
  Primary:   "Book a Free Discovery Call"   [btn--primary btn--lg]
```

---

## Section 3 — CTA Copywriting Rules

### 3.1 Label Rules

| Rule | Correct | Wrong |
|---|---|---|
| Verb-first | "Book a Free Discovery Call" | "Free Discovery Call" |
| Specific | "Book a Free Discovery Call" | "Get Started" |
| Outcome-oriented | "Get a [Industry] Website" | "Submit" |
| Not about RCS | "Book a Free Discovery Call" | "Hire Us" |
| Honest | "Free 30-Minute Call" | "Get a Free Website Audit" (if not offering one) |

### 3.2 Supporting Copy

Every primary CTA benefits from 1 line of friction-reducing copy beneath it:

```
"No commitment. No sales pressure."
"Free 30-minute call. Response within 24 hours."
"No long-term contracts required."
"We'll tell you honestly if we're not the right fit."
```

This copy is small (`--text-sm`, `--color-text-muted`). It reassures without competing with the button.

### 3.3 CTA Section Headline Patterns

The headline above the final CTA section is a conversion variable. Use outcome-framing:

```
Pattern 1: Question
"Ready to [outcome they want]?"
"Ready for a website that actually generates leads?"

Pattern 2: Invitation
"Let's Build [Outcome]"
"Let's Build a Website That Works as Hard as You Do"

Pattern 3: Challenge reframe
"Your [problem] doesn't have to be permanent."
"Your outdated website doesn't have to cost you clients."
```

Never: "Contact Us Today" as a CTA section headline. No outcome. No emotion. No reason to act.

---

## Section 4 — CTA Design Rules

### 4.1 Visual Hierarchy

Within any section, one CTA is dominant. All others are visually subordinate.

```
Dominant (Primary):  Gold filled button     — btn--primary
Supporting (Secondary): Gold outlined       — btn--secondary
Soft (Tertiary):     Text link or ghost btn — btn--ghost or <a> link
```

If two buttons appear together, they must be clearly different in visual weight. Never two Primary buttons in the same section.

### 4.2 CTA Spacing

- Minimum space between CTA group and surrounding content: `var(--space-6)` (24px)
- Space between stacked CTAs (mobile): `var(--space-3)` (12px)
- Space between inline CTAs (desktop): `var(--space-4)` (16px)

### 4.3 CTA Accessibility

- All CTA buttons must meet 4.5:1 contrast minimum
- Gold on dark (`#D4AF37` on `#0C0E11`): 8.1:1 — passes AAA
- Focus ring: `2px solid var(--color-brand-gold); outline-offset: 3px`
- `aria-label` if button label is not self-explanatory out of context
- Loading state: `aria-busy="true"` when form submit button is processing

---

## Section 5 — CTA Performance Tracking

### 5.1 What to Track

| Event | Tracking Method |
|---|---|
| CTA button click (primary) | GA4 event: `cta_click`, parameter: `cta_label` |
| Form submission | GA4 event: `form_submit`, parameter: `form_name` |
| Calendly booking initiated | Calendly webhook or GA4 via iframe listener |
| Portfolio view (case study) | GA4 page view on `/portfolio/[slug]/` |
| Contact page visit | GA4 page view on `/contact/` |

### 5.2 CTA Optimization Signals

If a CTA is underperforming (low click rate relative to page views):

1. **Check placement** — is it above the fold on mobile?
2. **Check label** — is it specific and outcome-oriented?
3. **Check context** — does it appear before trust is established?
4. **Check friction** — is there reassurance copy below it?
5. **Check competition** — is another element distracting from it?

### 5.3 A/B Testing Guidelines

When testing CTA variations:
- Test one variable at a time (label, color, placement, or supporting copy — not all at once)
- Run test for minimum 2 weeks or 500 visitors per variant (whichever comes last)
- Declare a winner only at 95% statistical confidence
- Document every test and result in a testing log

**Simple tests to start with:**
- "Book a Free Discovery Call" vs. "Get a Free Discovery Call"
- CTA in hero: centered vs. left-aligned
- Supporting copy: present vs. absent
- Button size: `btn--lg` vs. `btn--xl` in final CTA section

---

## Section 6 — CTA Anti-Patterns

| Anti-Pattern | Why It Fails | Fix |
|---|---|---|
| "Submit" as button label | No outcome, no motivation | "Send My Project Details" |
| "Learn More" as CTA | Endless loop — learn more leads to learn more | Specific action: "See Dental Website Examples" |
| Two Primary CTAs in one section | Decision paralysis | One Primary, one Secondary max |
| CTA before trust is established | Asking too early | Build at least 2 trust layers first |
| CTA with no supporting copy | Feels high-commitment | Add reassurance line below button |
| Generic CTA across all pages | Misses page context | Industry/service-specific CTA labels |
| CTA buried in a wall of text | Never seen | Whitespace above and below CTA group |
| "Click Here" as link anchor text | Accessibility failure + SEO failure | Descriptive text: "See our dental website case study" |