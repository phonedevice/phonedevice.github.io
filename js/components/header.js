import { icon } from "./icons.js";

const NAV_LINKS = [
  { href: "#overview", label: "Overview", current: true },
  { href: "#detection-tools", label: "Detection Tools" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#faq", label: "FAQ" }
];

function navMarkup(extraAttrs = "") {
  return NAV_LINKS.map(
    (l) => `<a href="${l.href}" ${l.current ? 'aria-current="page"' : ""} ${extraAttrs}>${l.label}</a>`
  ).join("");
}

export function renderHeader(target) {
  target.innerHTML = `
    <div class="site-header__inner container">
      <a class="brand" href="#overview" aria-label="Mobile Device Test home">
        <span class="brand__mark">${icon("scan")}</span>
        <span class="brand__name">Mobile Device Test</span>
        <span class="brand__badge">Free Diagnostics</span>
      </a>

      <nav class="main-nav" aria-label="Primary">
        <ul class="main-nav__list">
          ${NAV_LINKS.map((l) => `<li><a class="main-nav__link" href="${l.href}" ${l.current ? 'aria-current="page"' : ""}>${l.label}</a></li>`).join("")}
        </ul>
      </nav>

      <div class="header-actions">
        <span class="live-pill"><span class="live-pill__dot"></span>Detection Active</span>
        <button type="button" class="icon-btn" id="theme-toggle" aria-label="Toggle dark mode" aria-pressed="false">
          <span id="theme-icon-sun">${icon("sun")}</span>
          <span id="theme-icon-moon" style="display:none">${icon("moon")}</span>
        </button>
        <button type="button" class="icon-btn menu-toggle" id="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">
          ${icon("menu")}
        </button>
      </div>
    </div>
    <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile">
      ${navMarkup()}
    </nav>
  `;

  wireThemeToggle();
  wireMobileMenu(target);
}

function wireThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  const sun = document.getElementById("theme-icon-sun");
  const moon = document.getElementById("theme-icon-moon");
  const stored = localStorage.getItem("mdt-theme");
  const systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  let isDark = stored ? stored === "dark" : systemDark;
  applyTheme(isDark);

  btn.addEventListener("click", () => {
    isDark = !isDark;
    applyTheme(isDark);
    localStorage.setItem("mdt-theme", isDark ? "dark" : "light");
  });

  function applyTheme(dark) {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    btn.setAttribute("aria-pressed", String(dark));
    sun.style.display = dark ? "none" : "inline-flex";
    moon.style.display = dark ? "inline-flex" : "none";
  }
}

function wireMobileMenu(target) {
  const toggle = target.querySelector("#menu-toggle");
  const nav = document.getElementById("mobile-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}
