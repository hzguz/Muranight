const THEME_MAP_KEY = "nightModeByUrl";
const SETTINGS_KEY = "nightModeSettings";
const TINT_OVERLAY_ID = "mn-night-overlay";
const DIM_OVERLAY_ID = "mn-night-dim-overlay";
const A11Y_STYLE_ID = "mn-a11y-style";

// Conservative defaults for the accessibility CSS filter. Kept low so the
// effect softens intense light/color without making content hard to read.
const A11Y_BRIGHTNESS = 0.9;
const A11Y_CONTRAST = 0.95;
const A11Y_SATURATE = 0.85;

const MAX_THEME_INTENSITY = 500;
const OVERLAY_FADE_MS = 190;
const OVERLAY_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const SCHEDULE_RECHECK_PADDING_MS = 260;
const MAX_TIMEOUT_MS = 2147483647;

const PRESET_COLORS = {
  warm: "#FFCC66",
  blue: "#6F97FF"
};

const DEFAULT_SCHEDULE = {
  enabled: false,
  startTime: "21:00",
  endTime: "00:00"
};

const DEFAULT_ACCESSIBILITY = {
  reduceMotion: false,
  softenBrightness: false,
  reduceSaturation: false,
  flashMitigation: false
};

const DEFAULT_SETTINGS = {
  mode: "per_page",
  globalPreset: {
    intensity: 45,
    colorMode: "warm",
    customColor: PRESET_COLORS.warm,
    updatedAt: 0
  },
  intensityCap: 200,
  schedule: { ...DEFAULT_SCHEDULE },
  accessibility: { ...DEFAULT_ACCESSIBILITY }
};

const PREFERS_REDUCED_MOTION =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let scheduleRecheckTimerId = null;
let mediaPauseObserver = null;
const overlayRevealFrameById = new Map();
const overlayRemovalTimerById = new Map();
const overlayRemovalTokenById = new Map();

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || typeof message !== "object") {
    return;
  }

  if (message.type === "APPLY_THEME") {
    void applyThemeFromMessage(message.payload, sendResponse);
    return true;
  }

  if (message.type === "REMOVE_THEME") {
    removeOverlay();
    sendResponse({ ok: true });
    return true;
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "local") {
    return;
  }

  if (!changes[THEME_MAP_KEY] && !changes[SETTINGS_KEY]) {
    return;
  }

  initializeFromStorage().catch(() => {
    clearScheduleRecheckTimer();
    removeOverlay();
  });
});

initializeFromStorage().catch(() => {
  clearScheduleRecheckTimer();
  removeOverlay();
});

window.addEventListener("beforeunload", () => {
  clearScheduleRecheckTimer();
  clearOverlayRemovalTimers();
  disconnectMediaPauseObserver();
});

async function initializeFromStorage() {
  const settings = await readSettings();

  // Accessibility is a personal, always-on need: apply it before (and
  // independently of) the night overlay, regardless of mode/schedule.
  applyAccessibility(sanitizeAccessibility(settings.accessibility));

  const { theme, schedule } = await resolveThemeForCurrentPage();
  scheduleNextRecheck(schedule);

  if (!theme) {
    removeOverlay();
    return;
  }

  applyTheme(theme);
}

async function applyThemeFromMessage(rawThemeConfig, sendResponse) {
  try {
    const settings = await readSettings();
    const schedule = sanitizeSchedule(settings.schedule);
    scheduleNextRecheck(schedule);

    if (schedule.enabled && !isWithinSchedule(new Date(), schedule)) {
      removeOverlay();
      sendResponse({ ok: true, skippedBySchedule: true });
      return;
    }

    const theme = sanitizeThemeConfig(rawThemeConfig, normalizeIntensityCap(settings.intensityCap));
    applyTheme(theme);
    sendResponse({ ok: true });
  } catch (_error) {
    sendResponse({ ok: false });
  }
}

async function resolveThemeForCurrentPage() {
  const [themeMap, settings] = await Promise.all([readThemeMap(), readSettings()]);
  const intensityCap = normalizeIntensityCap(settings.intensityCap);
  const schedule = sanitizeSchedule(settings.schedule);

  if (schedule.enabled && !isWithinSchedule(new Date(), schedule)) {
    return { theme: null, schedule };
  }

  if (settings.mode === "global") {
    return {
      theme: sanitizeThemeConfig({ ...settings.globalPreset, enabled: true }, intensityCap),
      schedule
    };
  }

  const urlKey = normalizeUrlKey(window.location.href);
  const savedConfig = themeMap[urlKey];

  if (!savedConfig || !savedConfig.enabled) {
    return { theme: null, schedule };
  }

  return {
    theme: sanitizeThemeConfig(savedConfig, intensityCap),
    schedule
  };
}

function applyTheme(themeConfig) {
  if (!themeConfig.enabled) {
    removeOverlay();
    return;
  }

  const intensity = clamp(themeConfig.intensity, 0, MAX_THEME_INTENSITY);
  if (intensity <= 0) {
    removeOverlay();
    return;
  }

  const themeHexColor = resolveThemeHex(themeConfig);
  const rgb = hexToRgb(themeHexColor);
  if (!rgb) {
    removeOverlay();
    return;
  }

  const tintOverlay = getOrCreateTintOverlay();
  const dimOverlay = getOrCreateDimOverlay();
  cancelOverlayRemoval(TINT_OVERLAY_ID);
  cancelOverlayRemoval(DIM_OVERLAY_ID);

  const tintMultiplier = resolveTintMultiplier(themeConfig.colorMode, rgb);
  const dimMultiplier = resolveDimMultiplier(themeConfig.colorMode);

  const baseRatio = Math.min(intensity, 100) / 100;
  const overflowRatio = Math.max(intensity - 100, 0) / (MAX_THEME_INTENSITY - 100);

  const baseTintOpacity = clamp(Math.pow(baseRatio, 0.84) * tintMultiplier, 0, tintMultiplier);
  const baseDimOpacity = clamp(Math.pow(baseRatio, 1.2) * dimMultiplier, 0, dimMultiplier);

  let tintOpacity = baseTintOpacity;
  let dimOpacity = baseDimOpacity;

  if (overflowRatio > 0) {
    const boost = Math.pow(overflowRatio, 0.76);

    const tintBoostLimit = resolveTintBoostLimit(themeConfig.colorMode, tintMultiplier, rgb);
    const dimBoostLimit = resolveDimBoostLimit(themeConfig.colorMode, dimMultiplier);

    tintOpacity = clamp(lerp(baseTintOpacity, tintBoostLimit, boost), 0, tintBoostLimit);
    dimOpacity = clamp(lerp(baseDimOpacity, dimBoostLimit, boost), 0, dimBoostLimit);
  }

  tintOverlay.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  setOverlayOpacity(tintOverlay, tintOpacity);
  setOverlayOpacity(dimOverlay, dimOpacity);
}

function getOrCreateTintOverlay() {
  let overlay = document.getElementById(TINT_OVERLAY_ID);

  if (overlay) {
    return overlay;
  }

  overlay = document.createElement("div");
  overlay.id = TINT_OVERLAY_ID;
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.pointerEvents = "none";
  overlay.style.zIndex = "2147483646";
  overlay.style.mixBlendMode = "multiply";
  overlay.style.transition = PREFERS_REDUCED_MOTION
    ? "none"
    : `opacity ${OVERLAY_FADE_MS}ms ${OVERLAY_EASING}, background-color ${OVERLAY_FADE_MS}ms ${OVERLAY_EASING}`;
  overlay.style.willChange = "opacity, background-color";
  overlay.style.backgroundColor = PRESET_COLORS.warm;
  overlay.style.opacity = "0";
  overlay.dataset.mnRevealReady = "0";

  appendOverlayToRoot(overlay);
  return overlay;
}

function getOrCreateDimOverlay() {
  let overlay = document.getElementById(DIM_OVERLAY_ID);

  if (overlay) {
    return overlay;
  }

  overlay = document.createElement("div");
  overlay.id = DIM_OVERLAY_ID;
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.pointerEvents = "none";
  overlay.style.zIndex = "2147483645";
  overlay.style.mixBlendMode = "multiply";
  overlay.style.transition = PREFERS_REDUCED_MOTION
    ? "none"
    : `opacity ${OVERLAY_FADE_MS}ms ${OVERLAY_EASING}`;
  overlay.style.willChange = "opacity";
  overlay.style.backgroundColor = "#000000";
  overlay.style.opacity = "0";
  overlay.dataset.mnRevealReady = "0";

  appendOverlayToRoot(overlay);
  return overlay;
}

function removeOverlay() {
  const tintOverlay = document.getElementById(TINT_OVERLAY_ID);
  const dimOverlay = document.getElementById(DIM_OVERLAY_ID);
  cancelOverlayReveal(TINT_OVERLAY_ID);
  cancelOverlayReveal(DIM_OVERLAY_ID);
  cancelOverlayRemoval(TINT_OVERLAY_ID);
  cancelOverlayRemoval(DIM_OVERLAY_ID);

  if (PREFERS_REDUCED_MOTION) {
    if (tintOverlay) {
      tintOverlay.remove();
    }

    if (dimOverlay) {
      dimOverlay.remove();
    }
    return;
  }

  if (tintOverlay) {
    fadeOutOverlayAndRemove(tintOverlay);
  }

  if (dimOverlay) {
    fadeOutOverlayAndRemove(dimOverlay);
  }
}

function appendOverlayToRoot(overlay) {
  const root = document.documentElement;
  if (root) {
    root.appendChild(overlay);
    return;
  }

  window.addEventListener(
    "DOMContentLoaded",
    () => {
      if (!overlay.isConnected && document.documentElement) {
        document.documentElement.appendChild(overlay);
      }
    },
    { once: true }
  );
}

function setOverlayOpacity(overlay, opacity) {
  const targetOpacity = String(opacity);

  if (PREFERS_REDUCED_MOTION) {
    overlay.style.opacity = targetOpacity;
    overlay.dataset.mnRevealReady = "1";
    return;
  }

  cancelOverlayReveal(overlay.id);

  if (overlay.dataset.mnRevealReady !== "1") {
    overlay.dataset.mnRevealReady = "1";
    overlay.style.opacity = "0";

    const frameId = requestAnimationFrame(() => {
      overlayRevealFrameById.delete(overlay.id);
      overlay.style.opacity = targetOpacity;
    });

    overlayRevealFrameById.set(overlay.id, frameId);
    return;
  }

  overlay.style.opacity = targetOpacity;
}

function cancelOverlayReveal(overlayId) {
  const frameId = overlayRevealFrameById.get(overlayId);
  if (typeof frameId !== "number") {
    return;
  }

  cancelAnimationFrame(frameId);
  overlayRevealFrameById.delete(overlayId);
}

function cancelOverlayRemoval(overlayId) {
  const timerId = overlayRemovalTimerById.get(overlayId);
  if (typeof timerId === "number") {
    clearTimeout(timerId);
  }
  overlayRemovalTimerById.delete(overlayId);
  overlayRemovalTokenById.delete(overlayId);
}

function fadeOutOverlayAndRemove(overlay) {
  if (!overlay) {
    return;
  }

  const nextToken = (overlayRemovalTokenById.get(overlay.id) || 0) + 1;
  overlayRemovalTokenById.set(overlay.id, nextToken);
  overlay.style.opacity = "0";

  const removeIfCurrent = () => {
    if (overlayRemovalTokenById.get(overlay.id) !== nextToken) {
      return;
    }

    overlayRemovalTokenById.delete(overlay.id);
    overlayRemovalTimerById.delete(overlay.id);
    if (overlay.isConnected) {
      overlay.remove();
    }
  };

  const onTransitionEnd = (event) => {
    if (event.target !== overlay || event.propertyName !== "opacity") {
      return;
    }

    overlay.removeEventListener("transitionend", onTransitionEnd);

    if (overlayRemovalTokenById.get(overlay.id) !== nextToken) {
      return;
    }

    const timerId = overlayRemovalTimerById.get(overlay.id);
    if (typeof timerId === "number") {
      clearTimeout(timerId);
      overlayRemovalTimerById.delete(overlay.id);
    }

    removeIfCurrent();
  };

  overlay.addEventListener("transitionend", onTransitionEnd);

  const timerId = window.setTimeout(() => {
    overlay.removeEventListener("transitionend", onTransitionEnd);
    removeIfCurrent();
  }, OVERLAY_FADE_MS + 50);

  overlayRemovalTimerById.set(overlay.id, timerId);
}

function clearOverlayRemovalTimers() {
  for (const timerId of overlayRemovalTimerById.values()) {
    clearTimeout(timerId);
  }
  overlayRemovalTimerById.clear();
  overlayRemovalTokenById.clear();
}

// Accessibility mitigations are driven entirely by injected CSS plus a small
// JS pass for media. They are intentionally decoupled from the tint/dim
// overlays so that turning night mode off never removes them.
function applyAccessibility(accessibility) {
  const css = buildA11yCss(accessibility);

  if (!css) {
    removeAccessibility();
    return;
  }

  let style = document.getElementById(A11Y_STYLE_ID);
  if (!style) {
    style = document.createElement("style");
    style.id = A11Y_STYLE_ID;
    appendA11yStyleToRoot(style);
  }

  style.textContent = css;
  applyMediaPause(accessibility.reduceMotion);
}

function removeAccessibility() {
  const style = document.getElementById(A11Y_STYLE_ID);
  if (style) {
    style.remove();
  }
  applyMediaPause(false);
}

function appendA11yStyleToRoot(style) {
  const root = document.head || document.documentElement;
  if (root) {
    root.appendChild(style);
    return;
  }

  window.addEventListener(
    "DOMContentLoaded",
    () => {
      if (!style.isConnected) {
        (document.head || document.documentElement).appendChild(style);
      }
    },
    { once: true }
  );
}

function buildA11yCss(accessibility) {
  let css = "";

  // Reduce motion and flash mitigation share the same CSS lever: clamping
  // animation/transition durations is the main flash source addressable
  // without per-pixel analysis. Flash mitigation is therefore best-effort.
  if (accessibility.reduceMotion || accessibility.flashMitigation) {
    css +=
      "*, *::before, *::after {" +
      "animation-duration: 0.001ms !important;" +
      "animation-iteration-count: 1 !important;" +
      "transition-duration: 0.001ms !important;" +
      "scroll-behavior: auto !important;" +
      "}";
  }

  const filterValue = buildFilterValue(accessibility);
  if (filterValue) {
    css += `html { filter: ${filterValue} !important; }`;
  }

  return css;
}

function buildFilterValue(accessibility) {
  // brightness/contrast/saturate are all the single CSS `filter` property and
  // must be concatenated into one declaration, or they override each other.
  const parts = [];

  if (accessibility.softenBrightness) {
    parts.push(`brightness(${A11Y_BRIGHTNESS})`, `contrast(${A11Y_CONTRAST})`);
  }

  if (accessibility.reduceSaturation) {
    parts.push(`saturate(${A11Y_SATURATE})`);
  }

  return parts.join(" ");
}

function applyMediaPause(enabled) {
  if (!enabled) {
    disconnectMediaPauseObserver();
    return;
  }

  pauseAllVideos(document);

  // Autoplay videos added after load (SPAs, lazy embeds) must also be paused.
  // GIFs cannot be paused without canvas replacement, so they are left as is.
  if (mediaPauseObserver) {
    return;
  }

  mediaPauseObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) {
          continue;
        }

        if (node.tagName === "VIDEO") {
          pauseVideoElement(node);
          continue;
        }

        pauseAllVideos(node);
      }
    }
  });

  const observerTarget = document.documentElement || document.body;
  if (observerTarget) {
    mediaPauseObserver.observe(observerTarget, { childList: true, subtree: true });
  }
}

function disconnectMediaPauseObserver() {
  if (mediaPauseObserver) {
    mediaPauseObserver.disconnect();
    mediaPauseObserver = null;
  }
}

function pauseAllVideos(root) {
  if (!root || typeof root.querySelectorAll !== "function") {
    return;
  }

  for (const video of root.querySelectorAll("video")) {
    pauseVideoElement(video);
  }
}

function pauseVideoElement(video) {
  try {
    video.pause();
  } catch (_error) {
    // Cross-origin or DRM-protected media may reject pause(); ignore.
  }
}

function resolveThemeHex(themeConfig) {
  if (themeConfig.colorMode === "blue") {
    return PRESET_COLORS.blue;
  }

  if (themeConfig.colorMode === "custom") {
    const customHex = normalizeHex(themeConfig.customColor);
    if (customHex) {
      return customHex;
    }
  }

  return PRESET_COLORS.warm;
}

function resolveDimMultiplier(colorMode) {
  if (colorMode === "blue") {
    return 0.24;
  }

  if (colorMode === "custom") {
    return 0.14;
  }

  return 0.12;
}

function resolveTintMultiplier(colorMode, rgb) {
  if (colorMode === "blue") {
    return 0.56;
  }

  if (colorMode === "custom") {
    const luminance = getRgbLuminance(rgb);
    if (luminance < 0.35) {
      return 0.34;
    }
    return 0.46;
  }

  return 0.48;
}

function resolveTintBoostLimit(colorMode, tintMultiplier, rgb) {
  if (colorMode === "blue") {
    return clamp(tintMultiplier + 0.2, 0, 0.84);
  }

  if (colorMode === "custom") {
    const luminance = getRgbLuminance(rgb);
    const boost = luminance < 0.35 ? 0.18 : 0.24;
    return clamp(tintMultiplier + boost, 0, 0.86);
  }

  return clamp(tintMultiplier + 0.24, 0, 0.88);
}

function resolveDimBoostLimit(colorMode, dimMultiplier) {
  if (colorMode === "blue") {
    return clamp(dimMultiplier + 0.32, 0, 0.7);
  }

  if (colorMode === "custom") {
    return clamp(dimMultiplier + 0.34, 0, 0.72);
  }

  return clamp(dimMultiplier + 0.36, 0, 0.74);
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function getRgbLuminance(rgb) {
  if (!rgb) {
    return 0.5;
  }

  const toLinear = (channel) => {
    const normalized = channel / 255;
    if (normalized <= 0.03928) {
      return normalized / 12.92;
    }
    return Math.pow((normalized + 0.055) / 1.055, 2.4);
  };

  const r = toLinear(rgb.r);
  const g = toLinear(rgb.g);
  const b = toLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function scheduleNextRecheck(rawSchedule) {
  clearScheduleRecheckTimer();

  const schedule = sanitizeSchedule(rawSchedule);
  if (!schedule.enabled) {
    return;
  }

  const msUntilBoundary = getMsUntilNextBoundary(schedule, new Date());
  if (!Number.isFinite(msUntilBoundary)) {
    return;
  }

  scheduleRecheckTimerId = window.setTimeout(() => {
    scheduleRecheckTimerId = null;
    initializeFromStorage().catch(() => {
      clearScheduleRecheckTimer();
      removeOverlay();
    });
  }, msUntilBoundary);
}

function clearScheduleRecheckTimer() {
  if (typeof scheduleRecheckTimerId === "number") {
    clearTimeout(scheduleRecheckTimerId);
  }

  scheduleRecheckTimerId = null;
}

function getMsUntilNextBoundary(schedule, now) {
  const startMinutes = parseTimeToMinutes(schedule.startTime);
  const endMinutes = parseTimeToMinutes(schedule.endTime);
  if (startMinutes === null || endMinutes === null) {
    return NaN;
  }

  const boundaryMinutes = Array.from(new Set([startMinutes, endMinutes]));
  let nextBoundaryAt = NaN;

  for (const minuteOfDay of boundaryMinutes) {
    const candidateAt = toNextOccurrence(now, minuteOfDay).getTime();
    if (!Number.isFinite(nextBoundaryAt) || candidateAt < nextBoundaryAt) {
      nextBoundaryAt = candidateAt;
    }
  }

  if (!Number.isFinite(nextBoundaryAt)) {
    return NaN;
  }

  const rawDelay = nextBoundaryAt - now.getTime() + SCHEDULE_RECHECK_PADDING_MS;
  return clamp(rawDelay, 250, MAX_TIMEOUT_MS);
}

function toNextOccurrence(now, minuteOfDay) {
  const candidate = new Date(now.getTime());
  candidate.setHours(Math.floor(minuteOfDay / 60), minuteOfDay % 60, 0, 0);

  if (candidate.getTime() <= now.getTime()) {
    candidate.setDate(candidate.getDate() + 1);
  }

  return candidate;
}

function isWithinSchedule(now, schedule) {
  const startMinutes = parseTimeToMinutes(schedule.startTime);
  const endMinutes = parseTimeToMinutes(schedule.endTime);
  if (startMinutes === null || endMinutes === null) {
    return true;
  }

  if (startMinutes === endMinutes) {
    return true;
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  if (startMinutes < endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  }

  return currentMinutes >= startMinutes || currentMinutes < endMinutes;
}

async function readThemeMap() {
  const raw = await chrome.storage.local.get(THEME_MAP_KEY);
  return asThemeMap(raw[THEME_MAP_KEY]);
}

async function readSettings() {
  const raw = await chrome.storage.local.get(SETTINGS_KEY);
  return sanitizeSettings(raw[SETTINGS_KEY]);
}

function sanitizeSettings(rawSettings) {
  const mode = normalizeApplyMode(rawSettings && rawSettings.mode);
  const intensityCap = normalizeIntensityCap(rawSettings && rawSettings.intensityCap);
  const schedule = sanitizeSchedule(rawSettings && rawSettings.schedule);
  const accessibility = sanitizeAccessibility(rawSettings && rawSettings.accessibility);

  const globalPresetSource =
    rawSettings && (rawSettings.globalPreset || rawSettings.globalTheme)
      ? rawSettings.globalPreset || rawSettings.globalTheme
      : DEFAULT_SETTINGS.globalPreset;

  const globalPreset = sanitizePreset(globalPresetSource, intensityCap);

  return {
    mode,
    globalPreset,
    intensityCap,
    schedule,
    accessibility
  };
}

function sanitizeAccessibility(rawAccessibility) {
  const accessibility =
    rawAccessibility && typeof rawAccessibility === "object" ? rawAccessibility : {};

  return {
    reduceMotion: Boolean(accessibility.reduceMotion),
    softenBrightness: Boolean(accessibility.softenBrightness),
    reduceSaturation: Boolean(accessibility.reduceSaturation),
    flashMitigation: Boolean(accessibility.flashMitigation)
  };
}

function sanitizePreset(rawPreset, intensityCap = MAX_THEME_INTENSITY) {
  const preset = rawPreset && typeof rawPreset === "object" ? rawPreset : {};

  return {
    intensity: clamp(toNumber(preset.intensity, 45), 0, Math.min(MAX_THEME_INTENSITY, intensityCap)),
    colorMode: normalizeColorMode(preset.colorMode),
    customColor: normalizeHex(preset.customColor) || PRESET_COLORS.warm,
    updatedAt: toNumber(preset.updatedAt, Date.now())
  };
}

function sanitizeThemeConfig(rawConfig, intensityCap = MAX_THEME_INTENSITY) {
  const preset = sanitizePreset(rawConfig, intensityCap);
  return {
    enabled: Boolean(rawConfig && rawConfig.enabled),
    intensity: preset.intensity,
    colorMode: preset.colorMode,
    customColor: preset.customColor,
    updatedAt: preset.updatedAt
  };
}

function normalizeApplyMode(mode) {
  return mode === "global" ? "global" : "per_page";
}

function normalizeColorMode(colorMode) {
  if (colorMode === "blue" || colorMode === "custom") {
    return colorMode;
  }
  return "warm";
}

function normalizeIntensityCap(rawCap) {
  const parsed = Number(rawCap);

  if (!Number.isFinite(parsed)) {
    return 200;
  }

  if (parsed <= 200) {
    return 200;
  }
  if (parsed <= 300) {
    return 300;
  }
  if (parsed <= 400) {
    return 400;
  }
  return 500;
}

function sanitizeSchedule(rawSchedule) {
  const schedule = rawSchedule && typeof rawSchedule === "object" ? rawSchedule : {};
  const legacyStartTime =
    typeof schedule.startTime === "string"
      ? schedule.startTime
      : typeof schedule.time === "string"
        ? schedule.time
        : schedule.start;
  const legacyEndTime = typeof schedule.endTime === "string" ? schedule.endTime : schedule.end;

  return {
    enabled: Boolean(schedule.enabled),
    startTime: normalizeTimeString(legacyStartTime, DEFAULT_SCHEDULE.startTime),
    endTime: normalizeTimeString(legacyEndTime, DEFAULT_SCHEDULE.endTime)
  };
}

function normalizeTimeString(rawValue, fallback) {
  const safeFallback = isValidTimeString(fallback) ? fallback : "00:00";

  if (typeof rawValue !== "string") {
    return safeFallback;
  }

  const trimmed = rawValue.trim();
  const match = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (!match) {
    return safeFallback;
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (!Number.isInteger(hour) || !Number.isInteger(minute)) {
    return safeFallback;
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return safeFallback;
  }

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function parseTimeToMinutes(timeString) {
  if (!isValidTimeString(timeString)) {
    return null;
  }

  const [hours, minutes] = timeString.split(":");
  return Number(hours) * 60 + Number(minutes);
}

function isValidTimeString(value) {
  return typeof value === "string" && /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

function normalizeUrlKey(rawUrl) {
  const parsed = new URL(rawUrl);
  return `${parsed.origin}${parsed.pathname}${parsed.search}`;
}

function asThemeMap(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const map = {};
  for (const [urlKey, rawConfig] of Object.entries(value)) {
    if (typeof urlKey !== "string" || !urlKey) {
      continue;
    }

    map[urlKey] = sanitizeThemeConfig(rawConfig);
  }
  return map;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeHex(value) {
  if (typeof value !== "string") {
    return null;
  }

  const hex = value.trim();

  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    return hex.toUpperCase();
  }

  if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return `#${hex.toUpperCase()}`;
  }

  return null;
}

function hexToRgb(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) {
    return null;
  }

  const pureHex = normalized.slice(1);
  return {
    r: parseInt(pureHex.slice(0, 2), 16),
    g: parseInt(pureHex.slice(2, 4), 16),
    b: parseInt(pureHex.slice(4, 6), 16)
  };
}
