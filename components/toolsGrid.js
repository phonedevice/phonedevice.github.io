import { createToolCard, renderResult, renderError } from "./toolCard.js";
import { DETECTORS } from "../detect.js";

const counts = { pass: 0, warn: 0, fail: 0, idle: 0 };

function updateSummary(tools) {
  const total = tools.length;
  const passPct = Math.round((counts.pass / total) * 100) || 0;
  const warnPct = Math.round((counts.warn / total) * 100) || 0;
  const failPct = Math.round((counts.fail / total) * 100) || 0;
  const restPct = Math.max(0, 100 - passPct - warnPct - failPct);

  const passSeg = document.getElementById("health-seg-pass");
  const warnSeg = document.getElementById("health-seg-warn");
  const restSeg = document.getElementById("health-seg-rest");
  if (passSeg) passSeg.style.width = `${passPct}%`;
  if (warnSeg) warnSeg.style.width = `${warnPct}%`;
  if (restSeg) restSeg.style.width = `${restPct}%`;

  const chip = document.getElementById("summary-chip");
  const note = document.getElementById("summary-note");
  if (chip) chip.textContent = `${passPct}% Optimal`;
  const checked = counts.pass + counts.warn + counts.fail;
  if (note) note.textContent = `${counts.pass} Passed • ${counts.warn} Attention • ${total - checked} Not run yet`;
}

async function runTool(tool, card) {
  const btn = card.querySelector('[data-role="action"]');
  const label = card.querySelector('[data-role="action-label"]');
  if (btn) btn.disabled = true;
  if (label && !tool.auto) label.textContent = "Running…";
  try {
    const fn = DETECTORS[tool.detect];
    const result = await fn();
    if (card.dataset.counted !== "1") {
      counts[result.status] = (counts[result.status] || 0) + 1;
      card.dataset.counted = "1";
    } else {
      // re-run: nothing to adjust in counts, previous state already counted
    }
    renderResult(card, result);
  } catch (err) {
    renderError(card);
  } finally {
    if (btn) btn.disabled = false;
  }
}

export function renderToolsGrid(target, tools) {
  target.innerHTML = "";
  const frag = document.createDocumentFragment();
  const cardsByTool = new Map();

  tools.forEach((tool) => {
    const card = createToolCard(tool);
    cardsByTool.set(tool.id, card);
    frag.appendChild(card);

    const btn = card.querySelector('[data-role="action"]');
    btn.addEventListener("click", () => runTool(tool, card));
  });

  target.appendChild(frag);

  // Auto-run tools that don't need a permission-gated user gesture.
  tools.filter((t) => t.auto).forEach((tool) => {
    runTool(tool, cardsByTool.get(tool.id)).then(() => updateSummary(tools));
  });

  updateSummary(tools);

  return cardsByTool;
}

export function wireSearch(input, grid) {
  input.addEventListener("keyup", () => {
    const q = input.value.trim().toLowerCase();
    grid.querySelectorAll(".tool-card").forEach((card) => {
      const match = card.dataset.search.includes(q);
      card.style.display = match ? "" : "none";
    });
  });
}
