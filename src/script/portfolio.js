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

  /* ── Données des projets ────────────────────────────────────────── */
  const PROJECTS_DATA = {
    willo: {
      name: 'Willo',
      category: 'Santé &bull; Offline‑First',
      subtitle: 'Gestion hospitalière & dossiers patients (Offline‑First)',
      logo: '../../assets/willo_logo.png',
      description: 'Application de gestion hospitalière conçue selon le paradigme offline-first pour assurer la continuité des soins et le suivi des patients en milieu médical, y compris en cas de coupure réseau prolongée. Synchronisation sécurisée et incrémentale multi-postes dès le retour de la connectivité.',
      highlights: [
        'Continuité intégrale des opérations médicales hors ligne',
        'Synchronisation incrémentale multi-postes avec résolution des conflits',
        'Gestion des admissions, consultations, ordonnances et stocks de pharmacie'
      ],
      tags: ['Offline‑First', 'IndexedDB / SQLite', 'Node.js', 'Architecture Santé', 'PWA &bull; Desktop']
    },
    planora: {
      name: 'Planora',
      category: 'EdTech &bull; Algorithmique',
      subtitle: 'Planification intelligente d\'emplois du temps scolaires',
      logo: '../../assets/planora_logo.png',
      description: 'Solution desktop et collaborative de génération et de gestion des emplois du temps pour établissements scolaires et universités. Modélise les contraintes complexes (salles, promotions, filières, disponibilités d\'enseignants) et élimine les collisions d\'horaires grâce à un moteur algorithmique strict.',
      highlights: [
        'Algorithme d\'optimisation et de détection automatique des collisions',
        'Modélisation fine des salles, promotions, filières et groupes de TD/TP',
        'Synchronisation cloud et persistance locale temps réel'
      ],
      tags: ['Electron', 'React', 'Node.js', 'MongoDB / Realm', 'Algorithmique']
    },
    eticketer: {
      name: 'Eticketer',
      category: 'FinTech &bull; Web3',
      subtitle: 'Billetterie électronique sécurisée & traçabilité Web3',
      logo: '../../assets/eticketer_logo.png',
      description: 'Plateforme décentralisée de vente et de validation de billets électroniques. Résout la fraude et la revente illicite grâce à des billets cryptographiquement infalsifiables adossés à des QR codes dynamiques à rafraîchissement continu et à un scan instantané aux portes.',
      highlights: [
        'Protection anti-fraude par QR codes dynamiques et tokens Web3',
        'Contrôle d\'accès et scan ultra-rapide aux entrées (< 0.2s par scan)',
        'Architecture hybride Web2 ↔ Web3 avec persistance relationnelle'
      ],
      tags: ['Ethereum / Polygon', 'Solidity', 'PostgreSQL', 'Node.js', 'Anti‑Fraude', 'QR Dynamique']
    },
    boacash: {
      name: 'Boacash',
      category: 'FinTech &bull; Mobile Money',
      subtitle: 'Passerelle de paiement sécurisée pour authentica.cm',
      logo: '../../assets/Logo_mboacach.png',
      description: 'Passerelle de paiement électronique dédiée aux produits et services de la plateforme authentica.cm. Intègre exclusivement les solutions de paiement Mobile Money (Orange Money, MTN MoMo) sans solutions bancaires. Garantit l\'isolation des flux financiers, la signature cryptographique HMAC des transactions et la réconciliation automatisée temps réel.',
      highlights: [
        'Intégration Mobile Money native (Orange Money, MTN MoMo)',
        'Paiement 100% digital pour l\'écosystème authentica.cm (sans solutions bancaires)',
        'Sécurisation cryptographique HMAC, gestion des webhooks & réconciliation instantanée'
      ],
      tags: ['Passerelle Paiement', 'Mobile Money', 'Orange Money', 'MTN MoMo', 'Python / Django', 'APIs REST', 'FinTech Sécurité']
    },
    jobberfind: {
      name: 'Jobberfind',
      category: 'Plateforme &bull; Emploi',
      subtitle: 'Plateforme de recherche & matching pour petits métiers',
      logo: '../../assets/jobbersfind_logo_form.png',
      description: 'Plateforme numérique de mise en relation immédiate et géolocalisée entre particuliers/entreprises et artisans des petits métiers (plombiers, électriciens, mécaniciens, dépanneurs). Valorise les compétences locales avec profils audités et système de notation communautaire transparent.',
      highlights: [
        'Algorithme de mise en relation et recherche géolocalisée par spécialité',
        'Profils d\'artisans audités et système d\'avis communautaires certifiés',
        'Prise de contact directe, messagerie et suivi des interventions'
      ],
      tags: ['Matching Géolocalisé', 'Temps Réel', 'Node.js', 'PostgreSQL', 'PWA Mobile']
    }
  };

  /* ── Modal des détails de projets ──────────────────────────────── */
  const modal = document.getElementById('projectModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalContent = document.getElementById('modalContent');

  function openProjectModal(projectId) {
    const data = PROJECTS_DATA[projectId];
    if (!data || !modal || !modalContent) return;

    modalContent.innerHTML = `
      <div class="p-modal__header">
        <span class="p-modal__header-badge">${data.category}</span>
        <img class="p-modal__header-img" src="${data.logo}" alt="${data.name}" />
      </div>
      <div>
        <h3 class="p-modal__title">${data.name}</h3>
        <p class="p-modal__sub">${data.subtitle}</p>
        <p class="p-modal__body-desc">${data.description}</p>
        <div class="p-modal__highlights">
          ${data.highlights.map(h => `
            <div class="p-modal__highlight-item">
              <span class="p-modal__highlight-dot"></span>
              <span>${h}</span>
            </div>
          `).join('')}
        </div>
        <div class="p-modal__tags">
          ${data.tags.map(t => `<span class="p-tag">${t}</span>`).join('')}
        </div>
      </div>
    `;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalCloseBtn?.focus();
  }

  function closeProjectModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Événements d'ouverture sur chaque carte
  document.querySelectorAll('[data-project]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-project');
      openProjectModal(id);
    });
  });

  // Fermetures
  modalCloseBtn?.addEventListener('click', closeProjectModal);
  modalBackdrop?.addEventListener('click', closeProjectModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('is-open')) {
      closeProjectModal();
    }
  });

})();
