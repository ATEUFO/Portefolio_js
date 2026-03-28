/* global gsap, ScrollTrigger */

const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function setTheme(hsl, name) {
  document.documentElement.style.setProperty("--theme-hsl", hsl);
  if (name) document.documentElement.style.setProperty("--theme-name", name);
  const label = $("#themeLabel");
  if (label && name) label.textContent = `Thème: ${name}`;
}

function wireSpotlight() {
  const spot = $("#spotlight");
  if (!spot) return;
  let raf = 0;
  window.addEventListener(
    "pointermove",
    (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        spot.style.setProperty("--mx", `${x}%`);
        spot.style.setProperty("--my", `${y}%`);
      });
    },
    { passive: true },
  );
}

function wireCardGlow() {
  const cards = $$(".card, .service-card-olence");
  for (const card of cards) {
    card.addEventListener(
      "pointermove",
      (e) => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        card.style.setProperty("--hx", `${x}%`);
        card.style.setProperty("--hy", `${y}%`);
      },
      { passive: true },
    );
  }
}

function animateTerminalLines() {
  if (prefersReduced || !window.gsap) {
    $$(".code-line").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    return;
  }
  const lines = $$(".code-line");
  gsap.to(lines, {
    opacity: 1,
    x: 0,
    duration: 0.45,
    stagger: 0.12,
    ease: "power2.out",
    delay: 0.4,
    scrollTrigger: {
      trigger: "#olence-terminal",
      start: "top 80%",
      once: true,
    },
  });
}

function animateSections() {
  if (prefersReduced || !window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  const reveals = $$("[data-reveal]");
  for (const el of reveals) {
    gsap.from(el, {
      y: 48,
      opacity: 0,
      rotateX: -6,
      scale: 0.96,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none reverse",
      },
    });
  }

  const hero = $("#olence-hero-inner");
  if (hero) {
    gsap.from(hero.children, {
      y: 36,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.05,
    });
  }

  gsap.to(".gradient-text", {
    backgroundPosition: "200% 50%",
    duration: 7,
    ease: "none",
    repeat: -1,
    yoyo: true,
  });

  gsap.to(".blob", {
    y: "-12%",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    },
  });

  const logo = $("#olence-logo-hero");
  if (logo) {
    gsap.to(logo, {
      y: -6,
      duration: 3.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }
}

function wireThemeOnScroll() {
  if (!window.ScrollTrigger) return;
  $$("section[data-theme]").forEach((s) => {
    ScrollTrigger.create({
      trigger: s,
      start: "top 30%",
      end: "bottom 30%",
      onToggle: (self) => {
        if (self.isActive && s.dataset.theme) {
          setTheme(s.dataset.theme, s.dataset.themeName);
        }
      },
    });
  });
}

function wireMobileMenu() {
  const toggle = $("#mobile-menu-toggle");
  const menu = $("#mobile-menu");
  const menuIcon = $(".menu-icon", toggle);
  const closeIcon = $(".close-icon", toggle);
  const links = $$(".mobile-nav-link", menu);

  if (!toggle || !menu) return;

  function toggleMenu() {
    const isOpen = menu.classList.contains("active");
    if (isOpen) {
      menu.classList.remove("active");
      menuIcon.classList.remove("hidden");
      closeIcon.classList.add("hidden");
      document.body.classList.remove("body-lock");
      setTimeout(() => {
        menu.classList.add("hidden");
      }, 300);
    } else {
      menu.classList.remove("hidden");
      document.body.classList.add("body-lock");
      // Force reflow
      menu.offsetHeight;
      menu.classList.add("active");
      menuIcon.classList.add("hidden");
      closeIcon.classList.remove("hidden");
    }
  }

  toggle.addEventListener("click", toggleMenu);

  links.forEach((link) => {
    link.addEventListener("click", () => {
      if (menu.classList.contains("active")) {
        toggleMenu();
      }
    });
  });
}

function boot() {
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());
  document.documentElement.dataset.fx = "on";

  const hero = $("#olence-hero");
  if (hero?.dataset.theme) setTheme(hero.dataset.theme, hero.dataset.themeName);

  wireSpotlight();
  wireCardGlow();
  animateTerminalLines();
  animateSections();
  wireThemeOnScroll();
  wireMobileMenu();

  ScrollTrigger.refresh();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
