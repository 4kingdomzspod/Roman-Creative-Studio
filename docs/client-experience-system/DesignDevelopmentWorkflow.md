# Design & Development Workflow
## Roman Creative Studio — Phase 6, Document 6

---

### Purpose

The Design & Development Workflow defines the structured production pipeline from research through deployment. Every phase has a defined output, an approval gate, and a clear transition to the next phase. Nothing moves forward without approval. Nothing is built before what it depends on is confirmed.

**Rule:** Design is not started before strategy is approved. Development is not started before design is approved. This sequence is not negotiable.

---

## Section 1 — Production Pipeline

```
PHASE 1   Research
    ↓
PHASE 2   Strategy               ← APPROVAL GATE 1
    ↓
PHASE 3   Wireframes             ← APPROVAL GATE 2
    ↓
PHASE 4   UI Design              ← APPROVAL GATE 3
    ↓
PHASE 5   Development
    ↓
PHASE 6   Internal QA            ← QA GATE
    ↓
PHASE 7   Client Review (Staging)← APPROVAL GATE 4
    ↓
PHASE 8   Revisions
    ↓
PHASE 9   Final Approval         ← APPROVAL GATE 5
    ↓
PHASE 10  Deployment
```

---

## Section 2 — Phase-by-Phase Specifications

### Phase 1: Research

**Owner:** RCS (internal)
**Duration:** 2–5 days
**Client involvement:** Minimal (questionnaire answers + asset delivery)

**Deliverables:**
- Competitor website audit (top 3)
- Audience profile (who visits, what they need to see/feel/do)
- SEO keyword research (primary keywords per page)
- Content inventory (what exists, what needs to be created)
- Technical requirements (integrations, third-party tools)

**Internal standards:**
- Competitor audit uses the same 10-point evaluation criteria every time:
  1. Conversion structure
  2. Trust signals
  3. SEO structure (H1, meta, URL)
  4. Mobile experience
  5. Page load speed (rough)
  6. Design quality
  7. Clarity of value proposition
  8. Navigation efficiency
  9. CTA quality
  10. Content depth

---

### Phase 2: Strategy

**Owner:** RCS (with client approval)
**Duration:** 2–4 days
**Client involvement:** Review and approve strategy document

**Deliverables:**
- Site map (all pages in hierarchy)
- Conversion flow per key page
- SEO keyword mapping (one keyword cluster per page)
- Content outline per page (headlines, sections, word count targets)
- Technology + integration decisions

**APPROVAL GATE 1:**
```
Strategy document sent to client.
Client has 48 hours to review.
Approval = written confirmation via email.
Phase 3 begins only after written approval received.
```

**Feedback handling:** If the client requests changes to the strategy document:
- Minor changes (wording, reordering): implement and resubmit same day
- Structural changes (adding pages, changing approach): assess impact on timeline and scope; communicate before implementing

---

### Phase 3: Wireframes

**Owner:** RCS
**Duration:** 2–3 days
**Client involvement:** Review and approve wireframes

**What wireframes are:**
Low-fidelity, black-and-white structural layouts. No colors, no final typography, no imagery. They define:
- Section order on each page
- Content hierarchy (what's prominent, what's secondary)
- CTA placement
- Navigation structure
- Layout and grid behavior

**What wireframes are NOT:**
- Not the final design
- Not the final copy
- Not the final images

**Why wireframes come before design:**
Changing layout decisions at the design stage costs 3–5× more time than changing them at the wireframe stage. Wireframes are the cheapest place to make structural changes.

**APPROVAL GATE 2:**
```
Wireframes delivered via Figma link or PDF.
Client has 48 hours to review and provide consolidated feedback.
Approval = written confirmation.
If client requests changes: one revision round included.
Phase 4 begins only after written approval received.
```

**Client guidance for wireframe review:**
```
"Focus on structure, not style:
  ✓ Is this the right order of sections?
  ✓ Is the most important information prominent?
  ✓ Are you missing any section or content area?
  ✗ Don't comment on colors or fonts yet — this is structure only"
```

---

### Phase 4: UI Design

**Owner:** RCS
**Duration:** 4–8 days (depending on page count)
**Client involvement:** Design review call + written approval

**Design standards (from Phase 3 Design System Engine):**
- All designs use RCS design system tokens (colors, typography, spacing)
- Cormorant Garamond for display/heading use (30px+ only)
- Inter for all UI and body text
- Brand gold `#D4AF37` used as primary accent
- All designs built in Figma with desktop + mobile views

**Deliverables:**
- Desktop mockup: Homepage + all unique page templates
- Mobile mockup: Homepage + at minimum 2 additional pages
- Component inventory (all reusable UI components used)

**Design review process:**
1. Deliver Figma link + Loom walkthrough video
2. Schedule design review call (30–45 min)
3. Review call: walk through each page, explain decisions
4. Client provides consolidated written feedback within 48 hours
5. RCS implements feedback (up to 2 rounds included)
6. Written approval before development begins

**APPROVAL GATE 3:**
```
Written design approval required before development begins.
Approval email must explicitly confirm:
  - Homepage design approved
  - Interior page templates approved
  - Any unresolved items (noted and accepted as-is)
```

**What changes are NOT allowed after design approval:**
- Changing the overall color scheme
- Restructuring page layouts
- Adding or removing pages
- Restarting design from scratch

These are change orders if requested post-approval.

---

### Phase 5: Development

**Owner:** RCS
**Duration:** 5–10 days (depending on scope)
**Client involvement:** None during this phase

**Build standards:**
- HTML/CSS/JS built to Phase 3 Design System specifications
- 4-layer CSS architecture: tokens.css → base.css → layout.css → components.css
- All CSS custom properties reference design tokens (no hardcoded colors/spacing)
- Mobile-first CSS with min-width breakpoints only
- All images converted to WebP, lazy-loaded below fold
- All forms functional and tested
- Google Analytics 4 + Search Console configured
- SEO structure implemented: title tags, meta descriptions, H1s, schema markup
- `.nojekyll` in place for GitHub Pages hosting

**Development milestone email:**
```
Subject: [Business Name] — Development Complete, Staging Ready Shortly

Hi [Name],

Development is complete. I'm running the site through
final QA checks before sending the staging link.

You'll receive the staging site for review within 24–48 hours.

Alexander
```

*(This prevents the client from anxiously waiting and gives them a clear expectation.)*

---

### Phase 6: Internal QA

**Owner:** RCS (internal — client does NOT see the site during this phase)
**Duration:** 1–2 days
**Purpose:** Catch and fix all issues before the client's first impression of the build

Full QA checklist in QASystem.md.

**QA GATE:**
```
The staging link is NOT sent to the client until the QA checklist is
100% complete. No exceptions. First impressions matter.
```

---

### Phase 7: Client Review (Staging)

**Owner:** Client
**Duration:** 2–5 days for client review
**Client involvement:** Full review of staging site

**Staging delivery:** (see CommunicationSystem.md for email template)

**APPROVAL GATE 4:**
```
Client reviews staging site.
Provides consolidated feedback in structured format.
Feedback due within 48 hours (or agreed date).
RCS implements revisions (see RevisionSystem.md).
Updated staging delivered.
Final client approval received in writing before proceeding.
```

---

### Phase 8: Revisions

Covered fully in RevisionSystem.md.

---

### Phase 9: Final Approval

**APPROVAL GATE 5:**
Formal written sign-off from client. No launch without this.

See ClientJourneyMap.md, Stage 13 for email template.

---

### Phase 10: Deployment

Covered fully in LaunchSystem.md.
