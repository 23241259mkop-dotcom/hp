const menuToggle = document.querySelector(".menu-toggle");
const globalNav = document.querySelector(".global-nav");
const navLinks = document.querySelectorAll(".global-nav a");
const currentYear = document.getElementById("current-year");

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

const closeMenu = () => {
  if (!menuToggle || !globalNav) {
    return;
  }
  menuToggle.setAttribute("aria-expanded", "false");
  globalNav.classList.remove("is-open");
};

if (menuToggle && globalNav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    globalNav.classList.toggle("is-open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) {
      return;
    }
    if (!globalNav.contains(target) && !menuToggle.contains(target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

const revealTargets = document.querySelectorAll("[data-reveal]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (revealTargets.length) {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
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
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    revealTargets.forEach((element, index) => {
      const delay = (index % 6) * 70;
      element.style.transitionDelay = `${delay}ms`;
      observer.observe(element);
    });
  }
}
