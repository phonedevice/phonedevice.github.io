/**
 * Detection engine — every function here reads only standard, already-
 * available browser APIs. Nothing is sent off the device; all results
 * stay in memory for the current page view.
 * Each function returns { status: 'pass'|'warn'|'fail', items: [{label, value}] }.
 */

function parseUserAgentData(ua, uaDataBrands) {
  let browser = "Unknown", version = "";
  if (uaDataBrands && uaDataBrands.length) {
    const notFake = uaDataBrands.find(b => !/Not.A.Brand/i.test(b.brand));
    if (notFake) { browser = notFake.brand; version = notFake.version; }
  } else {
    const patterns = [
      [/Edg\/([\d.]+)/, "Microsoft Edge"],
      [/OPR\/([\d.]+)/, "Opera"],
      [/Chrome\/([\d.]+)/, "Chrome"],
      [/CriOS\/([\d.]+)/, "Chrome (iOS)"],
      [/FxiOS\/([\d.]+)/, "Firefox (iOS)"],
      [/Firefox\/([\d.]+)/, "Firefox"],
      [/Version\/([\d.]+).*Safari/, "Safari"],
      [/Safari\/([\d.]+)/, "Safari"]
    ];
    for (const [re, name] of patterns) {
      const m = ua.match(re);
      if (m) { browser = name; version = m[1]; break; }
    }
  }
  let os = "Unknown";
  if (/Windows NT/.test(ua)) os = "Windows";
  else if (/Mac OS X/.test(ua) && !/Mobile/.test(ua)) os = "macOS";
  else if (/iPhone|iPad|iPod/.test(ua)) os = "iOS";
  else if (/Android/.test(ua)) os = "Android";
  else if (/CrOS/.test(ua)) os = "Chrome OS";
  else if (/Linux/.test(ua)) os = "Linux";
  return { browser, version, os };
}

export function detectBrowserOS() {
  const ua = navigator.userAgent;
  const uaData = navigator.userAgentData;
  const { browser, version } = parseUserAgentData(ua, uaData && uaData.brands);
  const os = (uaData && uaData.platform) || parseUserAgentData(ua).os;
  const mobile = uaData ? uaData.mobile : /Mobi|Android|iPhone|iPad/.test(ua);
  return {
    status: "pass",
    items: [
      { label: "Browser", value: version ? `${browser} ${version.split(".")[0]}` : browser },
      { label: "Operating system", value: os },
      { label: "Form factor", value: mobile ? "Mobile" : "Desktop" },
      { label: "Language", value: navigator.language || "—" },
      { label: "Cookies enabled", value: navigator.cookieEnabled ? "Yes" : "No" }
    ]
  };
}

export function detectScreen() {
  const s = window.screen || {};
  const dpr = window.devicePixelRatio || 1;
  const physW = Math.round((s.width || 0) * dpr);
  const physH = Math.round((s.height || 0) * dpr);
  let refresh = "—";
  return {
    status: "pass",
    items: [
      { label: "Viewport (CSS px)", value: `${window.innerWidth} × ${window.innerHeight}` },
      { label: "Physical resolution", value: physW && physH ? `${physW} × ${physH}` : "Unavailable" },
      { label: "Pixel ratio", value: `${dpr}×` },
      { label: "Color depth", value: `${s.colorDepth || 24}-bit` },
      { label: "Orientation", value: (s.orientation && s.orientation.type) || (window.innerWidth > window.innerHeight ? "landscape" : "portrait") }
    ]
  };
}

export function detectHardware() {
  const cores = navigator.hardwareConcurrency;
  const mem = navigator.deviceMemory;
  return {
    status: cores ? "pass" : "warn",
    items: [
      { label: "Logical CPU cores", value: cores ? String(cores) : "Not reported" },
      { label: "Device memory", value: mem ? `≈ ${mem} GB` : "Not reported (Chromium only)" }
    ]
  };
}

export function detectGPU() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return { status: "fail", items: [{ label: "WebGL", value: "Not supported" }] };
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    const vendor = dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
    return {
      status: "pass",
      items: [
        { label: "WebGL version", value: gl.getParameter(gl.VERSION) },
        { label: "Renderer", value: String(renderer).slice(0, 60) },
        { label: "Vendor", value: String(vendor) },
        { label: "Max texture size", value: `${gl.getParameter(gl.MAX_TEXTURE_SIZE)} px` }
      ]
    };
  } catch (e) {
    return { status: "fail", items: [{ label: "WebGL", value: "Detection failed" }] };
  }
}

export function detectNetwork() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const online = navigator.onLine;
  const items = [{ label: "Online", value: online ? "Yes" : "No" }];
  if (conn) {
    items.push(
      { label: "Effective type", value: (conn.effectiveType || "—").toUpperCase() },
      { label: "Downlink", value: conn.downlink != null ? `${conn.downlink} Mbps (est.)` : "—" },
      { label: "Round-trip time", value: conn.rtt != null ? `${conn.rtt} ms` : "—" },
      { label: "Data saver", value: conn.saveData ? "On" : "Off" }
    );
  } else {
    items.push({ label: "Network Information API", value: "Not supported in this browser" });
  }
  return { status: online ? "pass" : "fail", items };
}

export async function detectBattery() {
  if (!navigator.getBattery) {
    return { status: "warn", items: [{ label: "Battery Status API", value: "Not supported (Safari & Firefox block this API)" }] };
  }
  try {
    const b = await navigator.getBattery();
    const pct = Math.round(b.level * 100);
    return {
      status: pct <= 20 && !b.charging ? "warn" : "pass",
      items: [
        { label: "Charge level", value: `${pct}%` },
        { label: "Charging", value: b.charging ? "Yes" : "No" },
        { label: "Time to full", value: b.charging && isFinite(b.chargingTime) ? `${Math.round(b.chargingTime / 60)} min` : "—" },
        { label: "Time remaining", value: !b.charging && isFinite(b.dischargingTime) ? `${Math.round(b.dischargingTime / 60)} min` : "—" }
      ]
    };
  } catch {
    return { status: "fail", items: [{ label: "Battery Status API", value: "Request failed" }] };
  }
}

export function detectTouch() {
  const maxPoints = navigator.maxTouchPoints || 0;
  const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  const hover = window.matchMedia && window.matchMedia("(hover: hover)").matches;
  const touchEvents = "ontouchstart" in window;
  return {
    status: maxPoints > 0 || touchEvents ? "pass" : "warn",
    items: [
      { label: "Max touch points", value: String(maxPoints) },
      { label: "Primary pointer", value: coarse ? "Touch (coarse)" : "Mouse / trackpad (fine)" },
      { label: "Hover capable", value: hover ? "Yes" : "No" },
      { label: "Touch events", value: touchEvents ? "Supported" : "Not detected" }
    ]
  };
}

export function detectSensors() {
  return new Promise((resolve) => {
    const hasOrientation = "DeviceOrientationEvent" in window;
    const hasMotion = "DeviceMotionEvent" in window;
    if (!hasOrientation && !hasMotion) {
      resolve({ status: "fail", items: [{ label: "Motion sensors", value: "Not supported on this device" }] });
      return;
    }
    const needsPermission = typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function";
    const finish = (granted) => {
      resolve({
        status: granted ? "pass" : "warn",
        items: [
          { label: "Device orientation", value: hasOrientation ? "API present" : "Unavailable" },
          { label: "Device motion", value: hasMotion ? "API present" : "Unavailable" },
          { label: "Permission", value: needsPermission ? (granted ? "Granted" : "Denied / not requested") : "Not required on this browser" }
        ]
      });
    };
    if (needsPermission) {
      DeviceMotionEvent.requestPermission().then(state => finish(state === "granted")).catch(() => finish(false));
    } else {
      finish(true);
    }
  });
}

export function detectStorage() {
  const lsOk = (() => { try { localStorage.setItem("__t", "1"); localStorage.removeItem("__t"); return true; } catch { return false; } })();
  const idbOk = "indexedDB" in window;
  if (navigator.storage && navigator.storage.estimate) {
    return navigator.storage.estimate().then(est => {
      const usedMB = est.usage ? (est.usage / (1024 * 1024)).toFixed(1) : "0";
      const quotaGB = est.quota ? (est.quota / (1024 * 1024 * 1024)).toFixed(1) : "—";
      return {
        status: "pass",
        items: [
          { label: "Storage used", value: `${usedMB} MB` },
          { label: "Storage quota", value: `${quotaGB} GB` },
          { label: "localStorage", value: lsOk ? "Available" : "Blocked" },
          { label: "IndexedDB", value: idbOk ? "Available" : "Unavailable" }
        ]
      };
    });
  }
  return Promise.resolve({
    status: "warn",
    items: [
      { label: "Storage estimate API", value: "Not supported" },
      { label: "localStorage", value: lsOk ? "Available" : "Blocked" },
      { label: "IndexedDB", value: idbOk ? "Available" : "Unavailable" }
    ]
  });
}

export async function detectMediaDevices() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    return { status: "fail", items: [{ label: "Media Devices API", value: "Not supported" }] };
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cams = devices.filter(d => d.kind === "videoinput").length;
    const mics = devices.filter(d => d.kind === "audioinput").length;
    const speakers = devices.filter(d => d.kind === "audiooutput").length;
    return {
      status: cams || mics ? "pass" : "warn",
      items: [
        { label: "Cameras detected", value: String(cams) },
        { label: "Microphones detected", value: String(mics) },
        { label: "Audio outputs detected", value: String(speakers) },
        { label: "Device labels", value: "Hidden until permission is granted" }
      ]
    };
  } catch {
    return { status: "fail", items: [{ label: "Media Devices API", value: "Detection failed" }] };
  }
}

export function detectAudio() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return { status: "fail", items: [{ label: "Web Audio API", value: "Not supported" }] };
    const ctx = new Ctx();
    const info = {
      status: "pass",
      items: [
        { label: "Web Audio API", value: "Supported" },
        { label: "Sample rate", value: `${ctx.sampleRate.toLocaleString()} Hz` },
        { label: "Output channels", value: String(ctx.destination.maxChannelCount) },
        { label: "State", value: ctx.state }
      ]
    };
    ctx.close();
    return info;
  } catch {
    return { status: "fail", items: [{ label: "Web Audio API", value: "Detection failed" }] };
  }
}

export function detectLocation() {
  return new Promise((resolve) => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "—";
    const locale = navigator.language || "—";
    if (!navigator.geolocation) {
      resolve({ status: "warn", items: [
        { label: "Timezone", value: tz },
        { label: "Locale", value: locale },
        { label: "Geolocation API", value: "Not supported" }
      ]});
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ status: "pass", items: [
        { label: "Timezone", value: tz },
        { label: "Locale", value: locale },
        { label: "Latitude", value: pos.coords.latitude.toFixed(3) },
        { label: "Longitude", value: pos.coords.longitude.toFixed(3) },
        { label: "Accuracy", value: `± ${Math.round(pos.coords.accuracy)} m` }
      ]}),
      () => resolve({ status: "warn", items: [
        { label: "Timezone", value: tz },
        { label: "Locale", value: locale },
        { label: "Geolocation", value: "Permission denied or unavailable" }
      ]}),
      { timeout: 8000 }
    );
  });
}

export const DETECTORS = {
  detectBrowserOS, detectScreen, detectHardware, detectGPU, detectNetwork,
  detectBattery, detectTouch, detectSensors, detectStorage, detectMediaDevices,
  detectAudio, detectLocation
};
