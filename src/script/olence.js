/* JS minimal pour la page Olence IA — pur vanilla, sans GSAP */

/* Intersection Observer pour les animations d'apparition */
(function () {
  'use strict';

  /* --- Reveal on scroll ------------------------------------------------ */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));

  /* --- Année dans le footer -------------------------------------------- */
  const yearEl = document.getElementById('olence-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* --- Smooth scroll pour les ancres ----------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
