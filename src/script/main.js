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
  const cards = $$(".card, .project-card");
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

function wireActiveNav() {
  const links = $$(".nav-link");
  if (!links.length || !window.ScrollTrigger) return;

  $$("section[id]").forEach((s) => {
    ScrollTrigger.create({
      trigger: s,
      start: "top 25%",
      end: "bottom 25%",
      onToggle: (self) => {
        if (self.isActive) {
          links.forEach((l) => l.classList.remove("is-active"));
          const active = $(`.nav-link[href="#${s.id}"]`);
          if (active) active.classList.add("is-active");
          if (s.dataset.theme) setTheme(s.dataset.theme, s.dataset.themeName);
        }
      },
    });
  });
}

function wireMagneticEffect() {
  if (prefersReduced || !window.gsap) return;
  const elements = $$(".btn, .chip, .nav-link, .contact");
  for (const el of elements) {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out",
      });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    });
  }
}

function animatePage() {
  const enableFx = true;
  if (!enableFx || prefersReduced || !window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  // Constant "excitation" for links and high-priority buttons
  const linkBtns = $$('a.btn, a.nav-link, a.contact');
  gsap.to(linkBtns, {
    scale: 1.03,
    duration: 0.6,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    stagger: {
      each: 0.1,
      from: "random"
    }
  });

  gsap.to(".gradient-text", { backgroundPosition: "200% 50%", duration: 6, ease: "none", repeat: -1, yoyo: true });

  // Parallax on blobs and cards
  gsap.to(".blob", {
    y: "-15%",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1
    }
  });

  // Photo: parallax tilt on scroll
  const portrait = $("#portrait");
  if (portrait) {
    gsap.to(portrait, {
      y: -30,
      rotateZ: 2,
      ease: "none",
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
    // Infinite micro-motion
    gsap.to(portrait, { rotateZ: -2, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
  }

  // Staggered reveal for better "magic" effect
  const reveals = $$("[data-reveal]");
  for (const el of reveals) {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      rotateX: -10,
      scale: 0.95,
      duration: 1.2,
      ease: "power4.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none reverse"
      },
    });
  }

    // Project rail: horizontal scroll
    const track = $("#projectsTrack");
    const container = $("#projets");
    if (track && container && window.innerWidth >= 900) {
      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const progress = $("#projectProgress");
      gsap.to(track, {
        x: () => -getDistance() - 100,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top-=100",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progress) progress.style.width = `${self.progress * 100}%`;
          }
        },
      });
    }
}

function boot() {
  $("#year").textContent = String(new Date().getFullYear());
  document.documentElement.dataset.fx = "on";
  
  wireSpotlight();
  wireCardGlow();
  wireActiveNav();
  wireMagneticEffect();
  animatePage();
  
  // Refresh all triggers after load
  ScrollTrigger.refresh();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}

