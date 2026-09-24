import { icon } from "./icons.js";

/**
 * Builds the DOM node for one detection tool card.
 * Status/result rendering is handled separately by toolsGrid.js so this
 * module stays a pure view factory.
 */
export function createToolCard(tool) {
  const card = document.createElement("article");
  card.className = "tool-card";
  card.id = `tool-${tool.id}`;
  card.setAttribute("data-tool-id", tool.id);
  card.setAttribute("data-category", tool.category);
  card.setAttribute("data-search", `${tool.title} ${tool.desc} ${tool.category}`.toLowerCase());

  card.innerHTML = `
    <div class="tool-card__top">
      <span class="tool-card__icon">${icon(tool.icon)}</span>
      <span class="tool-card__status tool-card__status--idle" data-role="status">
        <i></i><span data-role="status-text">${tool.auto ? "Scanning…" : "Not tested"}</span>
      </span>
    </div>
    <h3 class="tool-card__title">${tool.title}</h3>
    <p class="tool-card__desc">${tool.desc}</p>
    <div class="tool-card__result" data-role="result"></div>
    <div class="tool-card__action">
      <button type="button" class="btn btn--secondary btn--sm btn--block" data-role="action">
        ${icon("play")}<span data-role="action-label">${tool.auto ? "View details" : (tool.actionLabel || "Run check")}</span>
      </button>
    </div>
  `;
  return card;
}

export function renderResult(card, result) {
  const statusEl = card.querySelector('[data-role="status"]');
  const statusText = card.querySelector('[data-role="status-text"]');
  const resultEl = card.querySelector('[data-role="result"]');
  const actionLabel = card.querySelector('[data-role="action-label"]');

  statusEl.className = `tool-card__status tool-card__status--${result.status}`;
  statusText.textContent = { pass: "Passed", warn: "Attention", fail: "Unsupported" }[result.status] || "Checked";

  resultEl.innerHTML = `<dl>${result.items
    .map((i) => `<dt>${i.label}</dt><dd>${i.value}</dd>`)
    .join("")}</dl>`;
  resultEl.classList.add("is-visible");
  card.classList.add("is-open");
  if (actionLabel) actionLabel.textContent = "Re-run check";
}

export function renderError(card) {
  const statusEl = card.querySelector('[data-role="status"]');
  const statusText = card.querySelector('[data-role="status-text"]');
  statusEl.className = "tool-card__status tool-card__status--fail";
  statusText.textContent = "Error";
}
