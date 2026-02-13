const menuToggle = document.querySelector(".menu-toggle");
const globalNav = document.querySelector(".global-nav");
const navLinks = document.querySelectorAll(".global-nav a");
const currentYear = document.getElementById("current-year");
const backToTopButton = document.getElementById("back-to-top");
const contactForm = document.querySelector(".contact-form");
const formMessage = document.getElementById("form-message");

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

if (menuToggle && globalNav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    menuToggle.setAttribute("aria-label", expanded ? "メニューを開く" : "メニューを閉じる");
    globalNav.classList.toggle("is-open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "メニューを開く");
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
      menuToggle.setAttribute("aria-label", "メニューを開く");
      globalNav.classList.remove("is-open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "メニューを開く");
      globalNav.classList.remove("is-open");
    }
  });
}

if (contactForm instanceof HTMLFormElement && formMessage) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.textContent =
      "お問い合わせありがとうございます。内容を確認のうえ、担当者よりご連絡いたします。";
    formMessage.hidden = false;
    contactForm.reset();
  });
}

const sectionElements = Array.from(navLinks)
  .map((link) => link.getAttribute("href"))
  .filter((href) => href && href.startsWith("#"))
  .map((href) => document.querySelector(href))
  .filter((section) => section instanceof HTMLElement);

if (sectionElements.length > 0) {
  const setCurrentLink = (sectionId) => {
    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${sectionId}`;
      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentLink(entry.target.id);
        }
      });
    },
    {
      root: null,
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0
    }
  );

  sectionElements.forEach((section) => observer.observe(section));
}

if (backToTopButton) {
  const toggleBackToTop = () => {
    if (window.scrollY > 500) {
      backToTopButton.classList.add("is-visible");
    } else {
      backToTopButton.classList.remove("is-visible");
    }
  };

  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  toggleBackToTop();

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
