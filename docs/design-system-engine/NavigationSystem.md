# Navigation System
**Roman Creative Studio — Design System Engine**
_Last Updated: 2025 | Version 1.0_

---

## Purpose

Define the complete navigation architecture for all RCS websites. The navigation is the one UI pattern that appears on every page — it must be correct, consistent, accessible, and performant everywhere.

---

## Navigation Structure

```
Navbar (.navbar)
  ├── .navbar__inner           ← Container (max-width constrained)
  │   ├── .navbar__logo         ← Logo link + image
  │   ├── .navbar__links        ← Desktop nav links (hidden mobile)
  │   ├── .navbar__actions      ← CTA button (desktop)
  │   └── .navbar__hamburger    ← Mobile menu trigger (hidden desktop)
  └── .nav-mobile              ← Mobile drawer (separate from navbar)
      ├── .nav-mobile__header   ← Logo + close button
      ├── .nav-mobile__links    ← Stacked nav links
      └── .nav-mobile__cta      ← CTA button
```

---

## CSS Implementation

```css
/* ============================================================
   NAVBAR BASE
============================================================ */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background-color: rgba(12, 14, 17, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--color-border);
  transition: border-color var(--duration-normal) var(--ease-out),
              background-color var(--duration-normal) var(--ease-out);
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--container-xl);
  margin-inline: auto;
  padding-inline: var(--space-5);
  height: 72px;
}

@media (min-width: 768px) {
  .navbar__inner { padding-inline: var(--space-8); }
}
@media (min-width: 1024px) {
  .navbar__inner { padding-inline: var(--space-12); }
}

/* ============================================================
   LOGO
============================================================ */
.navbar__logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  text-decoration: none;
}

.navbar__logo-img {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  border: 2px solid rgba(212, 175, 55, 0.75);
  box-shadow: 0 0 18px rgba(212, 175, 55, 0.30);
  object-fit: cover;
  transition: box-shadow var(--duration-normal) var(--ease-out),
              border-color var(--duration-normal) var(--ease-out);
}

.navbar__logo:hover .navbar__logo-img,
.navbar__logo:focus-visible .navbar__logo-img {
  box-shadow: 0 0 28px rgba(212, 175, 55, 0.50);
  border-color: rgba(212, 175, 55, 1);
}

.navbar__logo:focus-visible {
  outline: 2px solid var(--color-brand-gold);
  outline-offset: 4px;
  border-radius: var(--radius-full);
}

@media (min-width: 768px)  { .navbar__logo-img { width: 64px;  height: 64px; } }
@media (min-width: 1024px) { .navbar__logo-img { width: 72px;  height: 72px; } }

/* ============================================================
   DESKTOP NAVIGATION LINKS
============================================================ */
.navbar__links {
  display: none;
  align-items: center;
  gap: var(--space-8);
  list-style: none;
  margin: 0;
  padding: 0;
}

@media (min-width: 1024px) {
  .navbar__links { display: flex; }
}

.navbar__link {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-muted);
  text-decoration: none;
  position: relative;
  padding-block: var(--space-1);
  transition: color var(--duration-fast) var(--ease-out);
}

.navbar__link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--color-brand-gold);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-normal) var(--ease-out);
}

.navbar__link:hover {
  color: var(--color-text);
}

.navbar__link:hover::after {
  transform: scaleX(1);
}

.navbar__link:focus-visible {
  outline: 2px solid var(--color-brand-gold);
  outline-offset: 4px;
  border-radius: var(--radius-sm);
  color: var(--color-text);
}

/* Active state — current page */
.navbar__link[aria-current="page"] {
  color: var(--color-brand-gold);
  font-weight: var(--weight-semibold);
}

.navbar__link[aria-current="page"]::after {
  transform: scaleX(1);
}

/* ============================================================
   NAVBAR ACTIONS (CTA)
============================================================ */
.navbar__actions {
  display: none;
}

@media (min-width: 1024px) {
  .navbar__actions {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }
}

/* ============================================================
   HAMBURGER BUTTON
============================================================ */
.navbar__hamburger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--color-text);
  transition: border-color var(--duration-fast) var(--ease-out),
              background-color var(--duration-fast) var(--ease-out);
}

.navbar__hamburger:hover {
  border-color: var(--color-brand-gold);
  background-color: var(--color-brand-gold-subtle);
}

.navbar__hamburger:focus-visible {
  outline: 2px solid var(--color-brand-gold);
  outline-offset: 3px;
}

.navbar__hamburger svg {
  width: 20px;
  height: 20px;
  stroke-width: 1.5;
}

@media (min-width: 1024px) {
  .navbar__hamburger { display: none; }
}

/* ============================================================
   SCROLL STATE — added by JS on scroll
============================================================ */
.navbar--scrolled {
  background-color: rgba(12, 14, 17, 0.98);
  border-bottom-color: var(--color-border-strong);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.30);
}

/* ============================================================
   MOBILE NAVIGATION DRAWER
============================================================ */
.nav-mobile {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
  transform: translateX(-100%);
  transition: transform var(--duration-moderate) var(--ease-in-out);
  overflow-y: auto;
  overscroll-behavior: contain;
}

.nav-mobile.is-open {
  transform: translateX(0);
}

.nav-mobile__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5);
  border-bottom: 1px solid var(--color-border);
  height: 72px;
}

.nav-mobile__links {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--space-6) var(--space-5);
  gap: var(--space-1);
  list-style: none;
  margin: 0;
}

.nav-mobile__link {
  display: flex;
  align-items: center;
  padding: var(--space-4) var(--space-2);
  font-family: var(--font-body);
  font-size: var(--text-xl);
  font-weight: var(--weight-medium);
  color: var(--color-text-muted);
  text-decoration: none;
  border-bottom: 1px solid var(--color-border);
  transition: color var(--duration-fast) var(--ease-out);
}

.nav-mobile__link:hover,
.nav-mobile__link:focus-visible {
  color: var(--color-brand-gold);
}

.nav-mobile__link[aria-current="page"] {
  color: var(--color-brand-gold);
  font-weight: var(--weight-semibold);
}

.nav-mobile__cta {
  padding: var(--space-6) var(--space-5);
  border-top: 1px solid var(--color-border);
}

.nav-mobile__cta .btn {
  width: 100%;
}

/* Focus trap overlay */
.nav-mobile-overlay {
  position: fixed;
  inset: 0;
  z-index: 199;
  background: rgba(0, 0, 0, 0.60);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--duration-moderate) var(--ease-out);
}

.nav-mobile-overlay.is-visible {
  opacity: 1;
  pointer-events: auto;
}

@media (prefers-reduced-motion: reduce) {
  .nav-mobile { transition: none; }
  .nav-mobile-overlay { transition: none; }
}
```

---

## HTML Pattern

```html
<!-- Skip link — first element in body -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<header role="banner">
  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="navbar__inner">
      <!-- Logo -->
      <a href="/" class="navbar__logo" aria-label="Roman Creative Studio — Home">
        <img
          src="/assets/images/logo.jpg"
          alt="Roman Creative Studio logo"
          class="navbar__logo-img"
          width="72" height="72"
          loading="eager"
        />
      </a>

      <!-- Desktop links -->
      <ul class="navbar__links" role="list">
        <li><a href="/services" class="navbar__link">Services</a></li>
        <li><a href="/work"     class="navbar__link">Our Work</a></li>
        <li><a href="/about"   class="navbar__link">About</a></li>
        <li><a href="/blog"    class="navbar__link">Blog</a></li>
        <li><a href="/pricing" class="navbar__link">Pricing</a></li>
      </ul>

      <!-- Desktop CTA -->
      <div class="navbar__actions">
        <a href="/contact" class="btn btn--primary btn--md">Book a Free Call</a>
      </div>

      <!-- Hamburger -->
      <button
        type="button"
        class="navbar__hamburger"
        aria-expanded="false"
        aria-controls="mobile-nav"
        aria-label="Open navigation menu"
      >
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
    </div>
  </nav>
</header>

<!-- Mobile overlay -->
<div class="nav-mobile-overlay" id="nav-overlay" aria-hidden="true"></div>

<!-- Mobile drawer -->
<nav
  class="nav-mobile"
  id="mobile-nav"
  role="navigation"
  aria-label="Mobile navigation"
  aria-hidden="true"
>
  <div class="nav-mobile__header">
    <a href="/" class="navbar__logo" tabindex="-1" aria-hidden="true">
      <img src="/assets/images/logo.jpg" alt="" class="navbar__logo-img" width="56" height="56" />
    </a>
    <button
      type="button"
      class="btn btn--ghost btn--icon"
      id="close-nav"
      aria-label="Close navigation menu"
    >
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  <ul class="nav-mobile__links" role="list">
    <li><a href="/services" class="nav-mobile__link">Services</a></li>
    <li><a href="/work"     class="nav-mobile__link">Our Work</a></li>
    <li><a href="/about"   class="nav-mobile__link">About</a></li>
    <li><a href="/blog"    class="nav-mobile__link">Blog</a></li>
    <li><a href="/pricing" class="nav-mobile__link">Pricing</a></li>
  </ul>

  <div class="nav-mobile__cta">
    <a href="/contact" class="btn btn--primary btn--lg">Book a Free Call</a>
  </div>
</nav>
```

---

## JavaScript Pattern

```js
(function () {
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const overlay   = document.getElementById('nav-overlay');
  const closeBtn  = document.getElementById('close-nav');
  const navbar    = document.querySelector('.navbar');

  function openNav() {
    mobileNav.classList.add('is-open');
    overlay.classList.add('is-visible');
    mobileNav.removeAttribute('aria-hidden');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeNav() {
    mobileNav.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    mobileNav.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  hamburger.addEventListener('click', openNav);
  closeBtn.addEventListener('click', closeNav);
  overlay.addEventListener('click', closeNav);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) closeNav();
  });

  // Scroll state
  const scrollHandler = () => {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });

  // Active link
  const currentPath = window.location.pathname;
  document.querySelectorAll('.navbar__link, .nav-mobile__link').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();
```

---

## Footer Structure

```html
<footer class="footer" role="contentinfo">
  <div class="footer__inner">
    <div class="footer__brand">
      <a href="/" class="navbar__logo" aria-label="Roman Creative Studio">
        <img src="/assets/images/logo.jpg" alt="Roman Creative Studio logo"
          class="navbar__logo-img" width="64" height="64" />
      </a>
      <p class="footer__tagline">Build. Grow. Scale.</p>
      <p class="footer__description">Premium web design and digital strategy for businesses ready to grow.</p>
    </div>

    <nav class="footer__nav" aria-label="Footer navigation">
      <div class="footer__nav-col">
        <h3 class="footer__nav-heading">Services</h3>
        <ul role="list">
          <li><a href="/services/web-design"  class="footer__link">Web Design</a></li>
          <li><a href="/services/seo"         class="footer__link">SEO</a></li>
          <li><a href="/services/branding"    class="footer__link">Branding</a></li>
          <li><a href="/services/maintenance" class="footer__link">Maintenance</a></li>
        </ul>
      </div>
      <div class="footer__nav-col">
        <h3 class="footer__nav-heading">Company</h3>
        <ul role="list">
          <li><a href="/about"   class="footer__link">About</a></li>
          <li><a href="/work"    class="footer__link">Our Work</a></li>
          <li><a href="/blog"    class="footer__link">Blog</a></li>
          <li><a href="/contact" class="footer__link">Contact</a></li>
        </ul>
      </div>
      <div class="footer__nav-col">
        <h3 class="footer__nav-heading">Legal</h3>
        <ul role="list">
          <li><a href="/privacy"      class="footer__link">Privacy Policy</a></li>
          <li><a href="/terms"        class="footer__link">Terms of Service</a></li>
          <li><a href="/accessibility" class="footer__link">Accessibility</a></li>
        </ul>
      </div>
    </nav>
  </div>

  <div class="footer__bottom">
    <p class="footer__copy">&copy; <span id="footer-year"></span> Roman Creative Studio. All rights reserved.</p>
    <p class="footer__contact">
      <a href="mailto:Alexander@romancreativestudio.co" class="footer__link">Alexander@romancreativestudio.co</a>
    </p>
  </div>
</footer>
```

```css
.footer {
  background-color: var(--color-surface-muted);
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-16);
}

.footer__inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-10);
  max-width: var(--container-xl);
  margin-inline: auto;
  padding-inline: var(--space-5);
  padding-bottom: var(--space-10);
}

@media (min-width: 768px) {
  .footer__inner {
    grid-template-columns: 1fr 2fr;
    padding-inline: var(--space-8);
  }
}

.footer__tagline {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  color: var(--color-brand-gold);
  margin-block: var(--space-4) var(--space-2);
}

.footer__description {
  font-size: var(--text-sm);
  color: var(--color-text-subtle);
  line-height: var(--leading-relaxed);
  max-width: 280px;
}

.footer__nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
}

.footer__nav-heading {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-widest);
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}

.footer__link {
  display: block;
  font-size: var(--text-sm);
  color: var(--color-text-subtle);
  text-decoration: none;
  padding-block: var(--space-1);
  transition: color var(--duration-fast) var(--ease-out);
}

.footer__link:hover {
  color: var(--color-text);
}

.footer__link:focus-visible {
  outline: 2px solid var(--color-brand-gold);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.footer__bottom {
  max-width: var(--container-xl);
  margin-inline: auto;
  padding-inline: var(--space-5);
  padding-block: var(--space-6);
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-3);
}

.footer__copy {
  font-size: var(--text-xs);
  color: var(--color-text-subtle);
}
```

---

## Navigation Rules

| Rule | Specification |
|------|---------------|
| Sticky behavior | Always sticky on all pages. No exceptions. |
| Backdrop blur | `blur(16px)` with semi-transparent dark bg |
| Max nav links | 6 primary links. More requires a dropdown or restructure. |
| Dropdowns | Avoid. If needed: accessible with `aria-expanded` + keyboard control |
| Active state | `aria-current="page"` set on current page link |
| Mobile breakpoint | Hamburger shown below 1024px |
| Focus trap | Mobile drawer traps focus while open. Escape closes. |
| Logo size | 56px mobile / 64px tablet / 72px desktop |

---

## Related Documents
- `docs/visual-identity/LogoSystem.md` — Logo variant specs
- `docs/design-system-engine/AccessibilitySystem.md` — Focus management, ARIA
- `docs/design-system-engine/ResponsiveBehaviorSystem.md` — Mobile breakpoints
- `docs/brand-governance/BrandConsistencyRules.md` — Nav consistency enforcement
