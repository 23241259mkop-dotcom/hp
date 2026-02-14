const menuToggle = document.querySelector(".menu-toggle");
const globalNav = document.querySelector(".global-nav");
const navLinks = document.querySelectorAll(".global-nav a");
const currentYear = document.getElementById("current-year");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

if (menuToggle && globalNav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    globalNav.classList.toggle("is-open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      globalNav.classList.remove("is-open");
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }

    if (!globalNav.contains(target) && !menuToggle.contains(target)) {
      menuToggle.setAttribute("aria-expanded", "false");
      globalNav.classList.remove("is-open");
    }
  });
}

const setupRevealAnimations = () => {
  const revealTargets = document.querySelectorAll(
    [
      "main .section-kicker",
      "main .section h2",
      "main .section .section-text",
      "main .card",
      "main .company-table-wrap",
      "main .news-list li",
      "main .contact-form",
      "main .contact-points li",
    ].join(", ")
  );

  if (!revealTargets.length) {
    return;
  }

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${(index % 7) * 65}ms`);
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => {
      element.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealTargets.forEach((element) => {
    observer.observe(element);
  });
};

const setupHeroMotion = () => {
  if (prefersReducedMotion) {
    return;
  }

  const hero = document.querySelector(".hero");
  if (!hero) {
    return;
  }

  let pointerX = 0;
  let pointerY = 0;
  let rafId = 0;

  const applyMotion = () => {
    hero.style.setProperty("--hero-tilt-y", `${(pointerX * 8).toFixed(2)}deg`);
    hero.style.setProperty("--hero-tilt-x", `${(pointerY * -8).toFixed(2)}deg`);
    hero.style.setProperty("--hero-shift-x", `${(pointerX * 14).toFixed(2)}px`);
    hero.style.setProperty("--hero-shift-y", `${(pointerY * 11).toFixed(2)}px`);
    hero.style.setProperty("--hero-overlay-x", `${(pointerX * -12).toFixed(2)}px`);
    hero.style.setProperty("--hero-overlay-y", `${(pointerY * -12).toFixed(2)}px`);
    hero.style.setProperty("--hero-grid-x", `${(pointerX * 7).toFixed(2)}px`);
    hero.style.setProperty("--hero-grid-y", `${(pointerY * 7).toFixed(2)}px`);
    rafId = 0;
  };

  const queueMotion = () => {
    if (rafId) {
      return;
    }
    rafId = window.requestAnimationFrame(applyMotion);
  };

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;
    pointerX = normalizedX;
    pointerY = normalizedY;
    queueMotion();
  });

  hero.addEventListener("pointerleave", () => {
    pointerX = 0;
    pointerY = 0;
    queueMotion();
  });
};

const setupCardTilt = () => {
  if (prefersReducedMotion) {
    return;
  }

  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    let tiltX = 0;
    let tiltY = 0;
    let rafId = 0;

    const applyTilt = () => {
      card.style.setProperty("--card-tilt-y", `${(tiltX * 8).toFixed(2)}deg`);
      card.style.setProperty("--card-tilt-x", `${(tiltY * -8).toFixed(2)}deg`);
      rafId = 0;
    };

    const queueTilt = () => {
      if (rafId) {
        return;
      }
      rafId = window.requestAnimationFrame(applyTilt);
    };

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
      const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;
      tiltX = normalizedX;
      tiltY = normalizedY;
      queueTilt();
    });

    card.addEventListener("pointerleave", () => {
      tiltX = 0;
      tiltY = 0;
      queueTilt();
    });
  });
};

setupRevealAnimations();
setupHeroMotion();
setupCardTilt();
