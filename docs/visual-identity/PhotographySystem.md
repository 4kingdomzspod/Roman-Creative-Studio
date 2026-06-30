# Photography Style System
**Roman Creative Studio — Visual Identity System**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

Define a consistent, premium visual direction for all photography and imagery used across Roman Creative Studio client work, marketing materials, website, and proposals. Photography is not filler — it is a storytelling tool that must reinforce brand trust, authenticity, and quality.

---

## Core Photography Philosophy

> **Real over stock. Context over beauty. Trust over aesthetics.**

Every image should answer one question: *Does this help the right client trust us more?*

The RCS photography direction is grounded in four principles:

| Principle | What It Means |
|-----------|---------------|
| **Authentic** | Real environments, real people, real moments — not staged stock photography |
| **Premium** | High production quality, intentional lighting, clean backgrounds |
| **Context-Driven** | Images show clients in their real work environments |
| **Dark-Compatible** | Imagery that integrates cleanly with the dark brand palette |

---

## Color Grading Direction

### RCS Image Treatment
All photography should feel consistent when placed in the RCS dark theme environment.

**Preferred qualities:**
- Slightly desaturated — not flat, but not oversaturated
- Warm shadow tones (pull toward charcoal/brown, not cool blue)
- Gold/amber highlight presence where natural
- Contrast: medium-high — images should read well on dark backgrounds
- No heavy filters or Instagram-style presets

**CSS overlay when needed:**
```css
.photo-overlay {
  background: linear-gradient(
    to bottom,
    rgba(12, 14, 17, 0.15),
    rgba(12, 14, 17, 0.65)
  );
}
```

**Gold tint overlay for hero images:**
```css
.photo-overlay-brand {
  background: linear-gradient(
    135deg,
    rgba(212, 175, 55, 0.08),
    rgba(12, 14, 17, 0.70)
  );
}
```

---

## Industry-Specific Photography Direction

### 1. Dental Practices

**Visual Direction:** Clinical confidence meets warmth.

| Subject | Guidance |
|---------|----------|
| Staff photos | Clean scrubs, natural smiles, modern operatory background |
| Office shots | Focus on technology, cleanliness, modern equipment |
| Patient-adjacent | Smiling patients (consent required), never in clinical procedures |
| Hero imagery | Exterior of office with good lighting, or reception area |

**Avoid:** Stock dental imagery with unnatural "dentist poses," extreme close-ups of teeth, anything clinical/graphic.

**Lighting:** Bright, natural where possible. Avoid sterile fluorescent wash.

---

### 2. Healthcare & MedSpa

**Visual Direction:** Medical credibility meets lifestyle aspiration.

| Subject | Guidance |
|---------|----------|
| Provider photos | Professional attire, clean background, confident and approachable |
| Treatment rooms | Clean, modern, aesthetically designed — not clinical white boxes |
| Results imagery | Before/after only with full patient consent and proper legal compliance |
| Lifestyle | Confident, glowing subjects — not before/after comparisons |

**Avoid:** Overly clinical imagery, graphic procedure photos, stock "happy patient" clichés.

**Lighting:** Soft, flattering, studio-quality. Avoid harsh shadows.

---

### 3. Church & Faith Organizations

**Visual Direction:** Community, warmth, and authentic worship.

| Subject | Guidance |
|---------|----------|
| Worship services | Candid moments of genuine worship — not posed congregants |
| Community events | Authentic interaction, laughter, connection |
| Leadership photos | Approachable, warm, natural environments — not corporate headshots |
| Campus/building | Exterior in golden hour light where possible |

**Avoid:** Empty sanctuaries (unless architectural), overly staged altar photos, stock "generic church" imagery.

**Lighting:** Natural golden hour tones. Warm indoor lighting preferred.

---

### 4. Restaurants & Food

**Visual Direction:** Appetite-first. Context second.

| Subject | Guidance |
|---------|----------|
| Food photography | Natural light or warm directional light, styled but not over-staged |
| Ambiance | Low light dining shots, warm tones, authentic atmosphere |
| Kitchen/team | Behind-the-scenes authenticity — chefs in motion |
| Exterior | Evening golden light when possible |

**Avoid:** Cold/blue-toned food photos, flat overhead-only shots without atmosphere, generic food stock.

**Lighting:** Warm, directional. Golden hour for exterior. Candle/ambient for interior.

---

### 5. Professional Services (Law, Finance, Consulting)

**Visual Direction:** Authority, trust, and modern professionalism.

| Subject | Guidance |
|---------|----------|
| Team photos | Polished but not stiff. Modern office or architectural backdrop |
| Office environment | Clean, ordered, premium — conveys competence |
| Working shots | Authentic work moments, not staged "looking at laptop" poses |
| Headshots | Consistent lighting, neutral backgrounds, approachable confidence |

**Avoid:** Cheesy handshake stock photos, overly corporate stiffness, dated styling.

**Lighting:** Clean studio or natural window light. Avoid dramatic shadows.

---

### 6. Startups & Technology

**Visual Direction:** Innovation, team energy, product clarity.

| Subject | Guidance |
|---------|----------|
| Team photos | Casual but intentional — modern workspace, authentic interaction |
| Product shots | Dark backgrounds, clean product presentation, detail focus |
| Office/workspace | Modern, collaborative, energetic environments |
| Abstract tech | Dark backgrounds, light-trail effects, geometric precision |

**Avoid:** Dated "people pointing at whiteboards" clichés, neon glitch aesthetics.

**Lighting:** Dramatic for product (dark bg + spotlight). Natural for team.

---

### 7. Real Estate

**Visual Direction:** Space, light, and lifestyle aspiration.

| Subject | Guidance |
|---------|----------|
| Property exteriors | Twilight/golden hour preferred, sky replacement if needed |
| Interiors | Wide-angle, natural light, virtually staged if empty |
| Lifestyle | People enjoying spaces — not posed, not empty rooms |
| Agent photos | Confident, modern, polished — not stiff or dated |

**Avoid:** Dark, poorly lit interiors; distorted fisheye angles; cluttered staged rooms.

**Lighting:** Twilight exterior. Blended natural + flash for interiors.

---

### 8. Fitness & Wellness

**Visual Direction:** Energy, transformation, and community.

| Subject | Guidance |
|---------|----------|
| Training shots | Motion blur intentional, authentic effort, diverse subjects |
| Facility shots | Clean, high-energy, well-equipped |
| Coaches/trainers | Action shots preferred over static headshots |
| Wellness | Calm, serene — yoga, recovery, meditation |

**Avoid:** Overly posed "flexing" shots, overly aggressive aesthetics, exclusionary body standards.

**Lighting:** High contrast for energy/gym. Soft diffused for wellness.

---

## Photography Checklist

Before approving any image for client use, verify:

- [ ] Is this a real photo (or clearly intentional illustration) — not generic stock?
- [ ] Does it integrate cleanly with the dark brand palette?
- [ ] Does it have appropriate resolution (minimum 1920px wide for hero, 800px for section)?
- [ ] Is it properly licensed (paid stock, client-owned, or CC0)?
- [ ] Has the color grading been reviewed for brand consistency?
- [ ] Are all people in the image consented/licensed?
- [ ] Does it tell a story or does it just fill space?

---

## Stock Photography Guidelines

When client photography is not available:

**Preferred sources (paid):**
- Unsplash+ (licensed commercial)
- Shutterstock
- Adobe Stock
- Getty Images

**Acceptable free sources (verify license):**
- Unsplash (check individual license)
- Pexels
- Pixabay

**Never use:**
- Random Google image search results
- Social media screenshots
- Watermarked images
- Images where license is unclear

---

## Related Documents
- `docs/visual-identity/ColorSystem.md` — Overlay token values
- `docs/visual-identity/DesignLanguage.md` — Depth and shadow philosophy
- `docs/visual-identity/AccessibilitySystem.md` — Image alt text requirements
- `docs/design-system/HeroSections.md` — Hero image implementation
