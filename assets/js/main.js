/* ============================================================
   ROMAN CREATIVE STUDIO — MAIN JS
   Navigation, scroll effects, accordion, animations.
   ============================================================ */

(function () {
  'use strict';

  /* ── NAV SCROLL STATE ─────────────────────────────────────── */

  const nav = document.querySelector('.nav');

  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── MOBILE DRAWER ────────────────────────────────────────── */

  const hamburger  = document.querySelector('.nav-hamburger');
  const drawer     = document.querySelector('.nav-drawer');
  const overlay    = document.querySelector('.nav-overlay');
  const closeBtn   = document.querySelector('.nav-drawer-close');

  function openDrawer() {
    drawer?.classList.add('open');
    overlay?.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }

  function closeDrawer(returnFocus = true) {
    drawer?.classList.remove('open');
    overlay?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (returnFocus) hamburger?.focus();
  }

  hamburger?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', () => closeDrawer());
  overlay?.addEventListener('click', () => closeDrawer());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer?.classList.contains('open')) closeDrawer();
  });

  /* Close the drawer as soon as a nav link inside it is activated, so it
     doesn't stay visibly open during the page transition (or on bfcache
     restore when navigating back). Don't steal focus back to the
     hamburger here — the browser is navigating away. */
  document.querySelectorAll('.nav-drawer-links a, .nav-drawer-cta a').forEach(link => {
    link.addEventListener('click', () => closeDrawer(false));
  });

  /* ── NAV DROPDOWN (keyboard) ──────────────────────────────── */

  document.querySelectorAll('.nav-dropdown-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  });

  /* Close dropdowns on outside click */
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown-trigger[aria-expanded="true"]')
        .forEach(t => t.setAttribute('aria-expanded', 'false'));
    }
  });

  /* ── FAQ ACCORDION ────────────────────────────────────────── */

  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      /* Optionally close others */
      document.querySelectorAll('.faq-item.open').forEach(i => {
        if (i !== item) {
          i.classList.remove('open');
          i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ── SCROLL ANIMATIONS ────────────────────────────────────── */

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
  } else {
    /* Fallback: show everything immediately */
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.classList.add('visible');
    });
  }

  /* ── ACTIVE NAV LINK ──────────────────────────────────────── */

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a, .nav-drawer-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (
      href === currentPath ||
      (currentPath === '' && href === 'index.html') ||
      href.endsWith(currentPath)
    ) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });

  /* ── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────────── */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      closeDrawer();
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── CONTACT FORM VALIDATION ──────────────────────────────── */

  const contactForm = document.querySelector('#contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      contactForm.querySelectorAll('[required]').forEach(field => {
        const group = field.closest('.form-group');
        const error = group?.querySelector('.form-error');

        if (!field.value.trim()) {
          valid = false;
          field.classList.add('error');
          if (error) error.textContent = 'This field is required.';
        } else {
          field.classList.remove('error');
          if (error) error.textContent = '';
        }
      });

      if (valid) {
        const btn = contactForm.querySelector('[type="submit"]');
        const original = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Sending…';
        setTimeout(() => {
          btn.textContent = 'Message Sent!';
          contactForm.reset();
          setTimeout(() => {
            btn.disabled = false;
            btn.textContent = original;
          }, 3000);
        }, 1200);
      }
    });
  }

})();
