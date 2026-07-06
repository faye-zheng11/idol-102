import { version, screenToModule, modules, hotspots } from "./spec-data.js";

const frame = document.getElementById("protoFrame");
const hotspotLayer = document.getElementById("hotspotLayer");
const moduleCard = document.getElementById("moduleCard");
const curScreenEl = document.getElementById("curScreen");
const toggleHotspots = document.getElementById("toggleHotspots");

let currentScreenId = null;

/* ---------- Top bar: version + docs ---------- */
document.getElementById("verName").textContent = version.name;
document.getElementById("verTag").textContent = version.tag;

const docList = document.getElementById("docList");
docList.innerHTML = `
  <div class="doc-head">本次版本 · ${version.updated}</div>
  ${version.notes.map((n) => `<div class="doc-note">· ${n}</div>`).join("")}
  <hr />
  <div class="doc-head">文档</div>
  ${version.docs.map((d) => `<a href="${d.href}" target="_blank">${d.label}<span>↗</span></a>`).join("")}
`;
const docToggle = document.getElementById("docToggle");
docToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  docList.classList.toggle("open");
});
document.addEventListener("click", () => docList.classList.remove("open"));

/* ---------- Spec card ---------- */
function renderModuleCard(moduleKey) {
  const m = modules[moduleKey];
  if (!m) {
    moduleCard.innerHTML = `<p class="role">这个页面还没有配置业务说明。</p>`;
    return;
  }
  moduleCard.innerHTML = `
    <div class="eyebrow">当前模块</div>
    <div class="accent-bar" style="background:${m.accent}"></div>
    <h2>${m.name}</h2>
    <p class="role">${m.role}</p>
    <h3>关键规则</h3>
    <ul>${m.keyRules.map((r) => `<li>${r}</li>`).join("")}</ul>
    <h3>边界</h3>
    <ul class="bound">${m.boundaries.map((b) => `<li>${b}</li>`).join("")}</ul>
    <a class="prd-link" href="${m.prd}" target="_blank">查看完整 PRD ↗</a>
    <div class="spot-detail" id="spotDetail"></div>
  `;
}

function showSpotDetail(spot) {
  const el = document.getElementById("spotDetail");
  if (!el) return;
  el.innerHTML = `
    <span class="close" id="spotClose">×</span>
    <div class="eyebrow">页面板块</div>
    <h4>${spot.title}</h4>
    <p>${spot.desc}</p>
  `;
  el.classList.add("show");
  document.getElementById("spotClose").addEventListener("click", () => el.classList.remove("show"));
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ---------- Hotspots overlay ---------- */
function clearHotspots() {
  hotspotLayer.innerHTML = "";
}

function renderHotspots(screenId) {
  clearHotspots();
  if (!toggleHotspots.checked) return;
  const doc = frame.contentDocument;
  if (!doc) return;
  const spots = hotspots[screenId] || [];
  const frameRect = frame.getBoundingClientRect();
  spots.forEach((spot, i) => {
    let target;
    try { target = doc.querySelector(spot.selector); } catch { target = null; }
    if (!target) return;
    const r = target.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    // r is relative to iframe viewport; overlay covers iframe 1:1
    const box = document.createElement("button");
    box.className = "hotspot";
    box.style.left = `${r.left}px`;
    box.style.top = `${r.top}px`;
    box.style.width = `${r.width}px`;
    box.style.height = `${r.height}px`;
    box.innerHTML = `<span class="pin">${i + 1}</span>`;
    box.addEventListener("click", (e) => {
      e.preventDefault();
      hotspotLayer.querySelectorAll(".hotspot").forEach((h) => h.classList.remove("active"));
      box.classList.add("active");
      showSpotDetail(spot);
    });
    hotspotLayer.appendChild(box);
  });
}

/* ---------- Active screen detection ---------- */
function detectScreen() {
  const doc = frame.contentDocument;
  if (!doc) return;
  const active = doc.querySelector(".screen.active");
  const screenId = active ? active.id : null;
  if (screenId && screenId !== currentScreenId) {
    currentScreenId = screenId;
    const moduleKey = screenToModule[screenId] || null;
    curScreenEl.textContent = `${screenId}${moduleKey ? " · " + modules[moduleKey]?.name : ""}`;
    renderModuleCard(moduleKey);
  }
  renderHotspots(currentScreenId);
}

function attachObserver() {
  const doc = frame.contentDocument;
  if (!doc) return;
  const stack = doc.getElementById("screenStack");
  if (!stack) return;
  const obs = new MutationObserver(() => detectScreen());
  obs.observe(stack, { attributes: true, attributeFilter: ["class"], subtree: true, childList: true });
  detectScreen();
  // Recompute hotspot positions periodically (covers async content / animations)
  setInterval(() => renderHotspots(currentScreenId), 700);
}

frame.addEventListener("load", () => {
  currentScreenId = null;
  attachObserver();
});

toggleHotspots.addEventListener("change", () => renderHotspots(currentScreenId));
window.addEventListener("resize", () => renderHotspots(currentScreenId));
document.getElementById("reloadProto").addEventListener("click", () => {
  frame.contentWindow.location.reload();
});
