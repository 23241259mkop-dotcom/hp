const menuToggle = document.querySelector(".menu-toggle");
const globalNav = document.querySelector(".global-nav");
const navLinks = document.querySelectorAll(".global-nav a");
const currentYear = document.getElementById("current-year");

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
