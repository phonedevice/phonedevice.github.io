import { renderHeader } from "./components/header.js";
import { renderFooter } from "./components/footer.js";
import { renderToolsGrid, wireSearch } from "./components/toolsGrid.js";
import { TOOLS } from "./data/tools-data.js";
import { detectBrowserOS, detectScreen, detectNetwork, detectHardware } from "./detect.js";

document.documentElement.classList.remove("no-js");

function populateHeroSpecs() {
  const browser = detectBrowserOS();
  const screen = detectScreen();
  const network = detectNetwork();
  const hardware = detectHardware();

  document.getElementById("device-title").textContent = `${browser.items[1].value} · ${browser.items[0].value}`;
  document.getElementById("device-subtitle").textContent =
    `${browser.items[2].value} device • ${hardware.items[0].value} CPU cores • ${screen.items[1].value === "Unavailable" ? screen.items[0].value : screen.items[1].value} resolution`;

  setSpec("spec-os", browser.items[1].value, browser.items[0].value);
  setSpec("spec-screen", screen.items[0].value, `${screen.items[1].value} physical @ ${screen.items[2].value}`);
  setSpec("spec-network", network.items.find((i) => i.label === "Effective type")?.value || (network.items[0].value === "Yes" ? "Online" : "Offline"), network.items[0].value === "Yes" ? "Connected" : "No connection");
  setSpec("spec-hardware", hardware.items[0].value + " cores", hardware.items[1].value);
}

function setSpec(id, value, hint) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
  const hintEl = document.getElementById(id + "-hint");
  if (hintEl && hint) hintEl.textContent = hint;
}

function init() {
  renderHeader(document.getElementById("header-root"));
  renderFooter(document.getElementById("footer-root"));

  try {
    populateHeroSpecs();
  } catch {
    /* leave hero placeholders in place if any API throws */
  }

  const grid = document.getElementById("tools-grid");
  renderToolsGrid(grid, TOOLS);

  const search = document.getElementById("diagnostic-search");
  if (search) wireSearch(search, grid);

  const scanBtn = document.getElementById("run-full-scan");
  if (scanBtn) {
    scanBtn.addEventListener("click", () => {
      document.getElementById("detection-tools").scrollIntoView({ behavior: "smooth" });
      grid.querySelectorAll('[data-role="action"]').forEach((btn) => btn.click());
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
