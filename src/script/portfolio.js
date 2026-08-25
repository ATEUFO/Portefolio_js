/* Portfolio — script vanilla minimal
   - Reveal on scroll
   - Nav active link
   - Hamburger mobile
   - Horizontal scroll rail avec barre de progression
   - Année dans le footer
   Aucune dépendance externe
*/

(function () {
  'use strict';

  /* ── Année ─────────────────────────────────────────────────────── */
  const yearEl = document.getElementById('p-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Smooth scroll ancres ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── Reveal au scroll ──────────────────────────────────────────── */
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  document.querySelectorAll('[data-reveal]').forEach((el) => revealObs.observe(el));

  /* ── Nav active link ───────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.p-nav__link, .p-mobile-menu a');

  const sectionObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((l) => {
            const href = l.getAttribute('href');
            if (href === `#${id}`) {
              l.classList.add('active');
            } else {
              l.classList.remove('active');
            }
          });
        }
      });
    },
    { threshold: 0.35 }
  );
  sections.forEach((s) => sectionObs.observe(s));

  /* ── Hamburger menu mobile ─────────────────────────────────────── */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Ferme au clic sur un lien mobile
    mobileMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Rail de projets — scroll horizontal + progress ───────────── */
  const rail     = document.querySelector('.p-rail');
  const track    = document.getElementById('projectsTrack');
  const progress = document.getElementById('projectProgress');

  if (rail && track && progress) {
    /* Sur desktop (> 900px) on active le scroll horizontal */
    function tryHorizontalScroll() {
      if (window.innerWidth < 901) return;

      rail.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // déjà horizontal
        if (e.deltaY === 0) return;

        const maxScroll = track.scrollWidth - rail.clientWidth;
        if (
          (e.deltaY > 0 && rail.scrollLeft >= maxScroll) ||
          (e.deltaY < 0 && rail.scrollLeft <= 0)
        ) return;

        e.preventDefault();
        rail.scrollLeft += e.deltaY;
      }, { passive: false });

      rail.addEventListener('scroll', () => {
        const maxScroll = track.scrollWidth - rail.clientWidth;
        const pct = maxScroll > 0 ? (rail.scrollLeft / maxScroll) * 100 : 0;
        progress.style.width = `${pct}%`;
      }, { passive: true });
    }

    tryHorizontalScroll();
    window.addEventListener('resize', tryHorizontalScroll, { passive: true });
  }

})();
