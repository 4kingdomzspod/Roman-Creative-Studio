# Photography Guidelines

## Photography Philosophy

Every image used by Roman Creative Studio should communicate **professionalism, trust, and authenticity**. Photography is not decoration — it is a strategic element that either builds or erodes credibility.

---

## Brand Photography Style

### Mood
- **Dark and confident** — consistent with the dark charcoal brand palette
- **Warm highlights** — gold tones in lighting where possible
- **Clean and editorial** — not busy or cluttered
- **Real, not stock-feeling** — authentic environments and genuine subjects

### Color Treatment
- Images should complement the dark theme — avoid bright white backgrounds unless used for contrast
- Warm-toned images (amber, gold, brown) reinforce the brand palette
- Cold or heavily filtered images (high saturation, oversaturated greens/blues) clash with brand identity

---

## Founder / Team Photography

### Current Asset
- **File:** `assets/images/founder.jpg`
- **Size:** 232 KB (optimize to <100 KB WebP for performance)
- **Usage:** About page, speaking bios, press materials

### Standards for Founder Photos
- Professional environment or clean neutral background
- Business casual to smart professional attire
- Direct eye contact with camera preferred
- Lighting: natural or studio, warm preferred
- Expression: confident, approachable — not overly formal

---

## Client Portfolio Photography

When capturing screenshots or mockups for portfolio:
- Use device mockups (browser, mobile) with dark bezels
- Capture on a dark or neutral background
- Avoid bright white UI chrome — mask or crop where possible
- Consistent aspect ratios across portfolio cards

---

## Stock Photography Rules

If stock photography is used on client sites:
- **Never use:** Obvious stock poses, cheesy handshakes, generic office scenes
- **Always prefer:** Real industry imagery (actual dental equipment, real church interiors, real storefronts)
- **Sources:** Unsplash, Pexels (free), Shutterstock (paid) for quality industry imagery
- **Always credit** when required by license

---

## Image Optimization Standards

| Format | Use Case | Target Size |
|--------|----------|-------------|
| WebP | All web images | <150 KB for hero; <80 KB for cards |
| JPG | Fallback for WebP | Compress to 80% quality |
| PNG | Logos, icons with transparency | Minimize; prefer SVG |
| SVG | Icons, logos, illustrations | Always preferred for vectors |

**Required attributes on all `<img>` tags:**
- `alt` — descriptive, not keyword-stuffed
- `loading="lazy"` — for below-fold images
- `width` and `height` — to prevent layout shift (CLS)
