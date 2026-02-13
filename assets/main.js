/* Lightweight behavior: theme, nav, contact mailto, header elevation */

function getThemeSetting() {
  // "system" | "dark" | "light"
  return localStorage.getItem("theme") || "system";
}

function applyTheme(setting) {
  const root = document.documentElement;
  if (setting === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", setting);
  }
}

function updateThemeLabel(setting) {
  const el = document.querySelector("[data-theme-state]");
  if (!el) return;
  if (setting === "system") el.textContent = "自動";
  if (setting === "dark") el.textContent = "ダーク";
  if (setting === "light") el.textContent = "ライト";
}

function cycleTheme(setting) {
  if (setting === "system") return "dark";
  if (setting === "dark") return "light";
  return "system";
}

function initThemeToggle() {
  const btn = document.querySelector("[data-theme-toggle]");
  if (!btn) return;

  let setting = getThemeSetting();
  applyTheme(setting);
  updateThemeLabel(setting);

  btn.addEventListener("click", () => {
    setting = cycleTheme(setting);
    localStorage.setItem("theme", setting);
    applyTheme(setting);
    updateThemeLabel(setting);
  });
}

function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-nav-panel]");
  if (!toggle || !panel) return;

  const close = () => {
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const nextOpen = !panel.classList.contains("is-open");
    panel.classList.toggle("is-open", nextOpen);
    toggle.setAttribute("aria-expanded", nextOpen ? "true" : "false");
  });

  panel.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest("a")) close();
  });

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest("[data-nav-panel]") || target.closest("[data-nav-toggle]")) return;
    close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function initSmoothScroll() {
  // Respect reduced motion.
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const a = target.closest('a[href^="#"]');
    if (!(a instanceof HTMLAnchorElement)) return;

    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const el = document.querySelector(id);
    if (!(el instanceof HTMLElement)) return;

    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", id);
  });
}

function initHeaderElevation() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => {
    const elevated = window.scrollY > 8;
    header.setAttribute("data-elevate", elevated ? "true" : "false");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initYear() {
  const y = document.querySelector("[data-year]");
  if (!y) return;
  y.textContent = String(new Date().getFullYear());
}

function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!(form instanceof HTMLFormElement)) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();

    if (!name || !email || !message) return;

    const to = "info@example.com";
    const subject = encodeURIComponent(`【お問い合わせ】${name} 様`);
    const body = encodeURIComponent(
      `お名前: ${name}\nメール: ${email}\n\n${message}\n\n--\nこのメールはWebサイトのお問い合わせフォームから作成されました。`,
    );

    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });
}

initThemeToggle();
initNav();
initSmoothScroll();
initHeaderElevation();
initYear();
initContactForm();
