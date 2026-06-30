# Logo Usage Rules
**Roman Creative Studio — Brand Governance System**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

The RCS logo is the most visible expression of the brand. Incorrect logo usage — in any context — degrades brand trust and professionalism. These rules are non-negotiable and apply to all internal and external use of the Roman Creative Studio logo.

---

## 1. Logo Variant Hierarchy

The following variants are the only approved logo forms. Use the correct variant for each context.

| Variant | Primary Use | File Format |
|---------|------------|-------------|
| **Primary Full Lockup** (icon + wordmark, stacked) | Hero placements, proposals, case studies | SVG, PNG |
| **Horizontal Lockup** (icon + wordmark, side-by-side) | Website navigation header | SVG, PNG |
| **Stacked Lockup** (icon above wordmark) | Square contexts, printed collateral | SVG, PNG |
| **Icon Mark Only** (RCS monogram or symbol) | App icons, favicon, small badge use | SVG, PNG, ICO |
| **Wordmark Only** ("Roman Creative Studio" text) | Documents where icon is already established | SVG, PNG |
| **Social Profile Version** | Profile photos across all social platforms | PNG (1:1 ratio) |

### Hierarchy Rule

> **Default to the Primary Full Lockup.** Only use reduced variants when space constraints make the full lockup illegible or impractical.

**Selection logic:**
```
Is there sufficient space and contrast for the full lockup?
  YES → Use Primary Full Lockup
  NO  → Is it a horizontal nav or header bar?
          YES → Use Horizontal Lockup
          NO  → Is space under 80px or square?
                  YES → Use Icon Mark Only
                  NO  → Use Stacked Lockup
```

---

## 2. Minimum Size Requirements

### Digital

| Variant | Minimum Width | Minimum Height |
|---------|--------------|----------------|
| Primary Full Lockup | 180px | 60px |
| Horizontal Lockup | 160px | 44px |
| Stacked Lockup | 100px | 80px |
| Icon Mark Only | 24px | 24px |
| Wordmark Only | 140px | 20px |
| Social Profile Version | 110px × 110px | (displayed; save at 800×800px) |

### Print

| Variant | Minimum Width |
|---------|---------------|
| Primary Full Lockup | 1.5 inches |
| Horizontal Lockup | 1.25 inches |
| Stacked Lockup | 0.75 inches |
| Icon Mark Only | 0.25 inches |

**Rule:** Below minimum size, the logo becomes illegible and must not be used. Use a text reference ("Roman Creative Studio") instead.

---

## 3. Clear Space Rules (Safe Zone)

The clear space zone is the minimum protected area around the logo where no other element — text, image, graphic, border, or UI element — may intrude.

**Clear space unit = X**, where X equals the height of the "R" in the RCS wordmark (or the cap-height of the display font at the logo's current size).

| Variant | Clear Space (all sides) |
|---------|------------------------|
| Primary Full Lockup | 1× X |
| Horizontal Lockup | 1× X |
| Stacked Lockup | 1× X |
| Icon Mark Only | 0.5× X |

**Practical rule for digital:** Minimum 16px of clear space around any logo variant at any size. For hero/featured placement, minimum 32px.

**Website nav exception:** The navigation logo container (72px) has its defined border and padding — those counts as the clear space enforcement boundary. No text or icon may overlap the logo container's bounding box.

---

## 4. Approved Background Contexts

| Background | Approved Variant | Notes |
|------------|-----------------|-------|
| Dark brand (`#0C0E11`) | All variants | Primary context |
| Dark surface (`#1B1E23`) | All variants | Standard |
| Dark elevated (`#252930`) | All variants | OK in modals, cards |
| True white (`#FFFFFF`) | Light mode variant only | Light mode logo required |
| Light neutral (off-white, cream) | Light mode variant only | |
| Medium gray | Not recommended | Use light or dark variant depending on contrast |
| Complex photography | Icon Mark Only with overlay | Requires dark overlay behind logo |
| Solid brand gold (`#D4AF37`) | Dark/inverse variant only | Use black/charcoal logo on gold bg |
| Gradient backgrounds | Case-by-case approval | Logo must meet 4.5:1 contrast |

**Rule:** The logo must always achieve minimum 4.5:1 contrast against its background. No exceptions.

---

## 5. Prohibited Logo Uses

The following are explicitly prohibited. No exceptions, no approvals, no workarounds.

### Geometric Distortion
- ❌ Stretching the logo horizontally or vertically
- ❌ Skewing or shearing the logo
- ❌ Rotating the logo any angle other than 0°
- ❌ Applying perspective or 3D transforms

### Color Modification
- ❌ Recoloring the logo in any color not in the approved variant set
- ❌ Applying gradients to the logo
- ❌ Applying drop shadows to the logo itself (the container may have a shadow; the logo mark may not)
- ❌ Reducing opacity below 80% (the logo must read clearly)
- ❌ Inverting or flipping color relationships within the logo

### Context Violations
- ❌ Placing the logo on a background that fails contrast minimums
- ❌ Placing the logo over complex, busy photography without an overlay
- ❌ Overlapping the logo with text, icons, or graphic elements
- ❌ Using the logo as a watermark at low opacity on unbranded content
- ❌ Using a screenshot or photograph of the logo (always use the source file)

### File/Format Violations
- ❌ Scaling up a raster PNG beyond its native resolution (pixelation)
- ❌ Using a JPEG version of the logo (compression artifacts on transparent areas)
- ❌ Using an outdated logo version after a brand update

### Combination Violations
- ❌ Combining the RCS logo with another brand's logo without explicit co-branding approval
- ❌ Placing the RCS logo adjacent to competitor logos in a way that implies comparison
- ❌ Using the logo in social posts in a way that implies endorsement of third-party content

---

## 6. Placement Rules by Context

### Website
- **Header:** Horizontal Lockup, left-aligned, 72px container, gold border + glow (per nav spec)
- **Footer:** Full Lockup or Horizontal Lockup, left-aligned or centered
- **Favicon:** Icon Mark, 32×32px ICO + 180×180px Apple Touch PNG
- **OG/Social preview image:** Full Lockup on dark background, centered

### Documents (Proposals, Contracts, Invoices)
- **Header:** Horizontal or Full Lockup, top-left, minimum 120px wide
- **Footer:** Wordmark Only or Icon Mark, right-aligned or centered
- **Cover page:** Full Lockup, centered, large (minimum 200px wide)

### Social Media
- **Profile photo:** Social Profile Version (1:1 ratio)
- **Post graphics:** Full or Horizontal Lockup, bottom-right corner OR as header
- **Watermark position:** Bottom-right, 16px from edge, 80–100% opacity

### Presentations
- **Title slide:** Full Lockup, centered or top-left
- **Content slides:** Wordmark or Icon Mark, bottom-right corner, small
- **Final/closing slide:** Full Lockup, centered, prominent

---

## 7. File Usage Rules

| Format | Use Case | Notes |
|--------|----------|-------|
| **SVG** | All digital, all web, all scalable contexts | Preferred default for digital |
| **PNG (transparent)** | When SVG not supported; presentations; social | Export at 2× minimum |
| **PNG (on dark bg)** | Thumbnail-specific versions | |
| **ICO** | Favicon only | 16×16, 32×32, 48×48 in single file |
| **JPEG** | Never | No exceptions |
| **PDF** | Print-ready documents where vector is embedded | |
| **WebP** | Not for logos | Only for photography |

**Source file rule:** All logo source files must be maintained in the `assets/brand/logo/` folder with version suffixes. The working file is never the source of truth — the committed/versioned file is.

---

## Related Documents
- `docs/visual-identity/LogoSystem.md` — Logo variant definitions and specifications
- `docs/brand-governance/FileAssetManagement.md` — File naming and storage rules
- `docs/brand-governance/BrandConsistencyRules.md` — System-wide consistency enforcement
- `docs/brand-governance/BusinessAssetGuidelines.md` — Logo placement in documents
