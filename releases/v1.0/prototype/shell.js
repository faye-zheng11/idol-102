/**
 * App shell: fixed 390×844 logical viewport, scale to fit the browser window.
 */
const PHONE_W = 390;
const PHONE_H = 844;
const STAGE_PAD = 32;

function fitPhone() {
  const scaler = document.getElementById("phoneScaler");
  const device = document.getElementById("phoneDevice");
  if (!scaler || !device) return;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const narrow = vw <= 430;

  const scale = narrow
    ? Math.min(vw / PHONE_W, vh / PHONE_H)
    : Math.min(1, (vw - STAGE_PAD) / PHONE_W, (vh - STAGE_PAD) / PHONE_H);

  scaler.style.width = `${PHONE_W * scale}px`;
  scaler.style.height = `${PHONE_H * scale}px`;
  device.style.transform = `scale(${scale})`;
  document.documentElement.style.setProperty("--phone-scale", String(scale));
}

window.addEventListener("resize", fitPhone);
window.addEventListener("orientationchange", fitPhone);
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", fitPhone);
} else {
  fitPhone();
}
