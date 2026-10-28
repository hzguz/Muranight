import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_JS_PATH = path.join(ROOT_DIR, "content.js");
const POPUP_JS_PATH = path.join(ROOT_DIR, "popup.js");

function createMockElement(tagName = "div", id = "") {
  const listeners = new Map();
  const children = [];
  const attributes = new Map();
  const classSet = new Set();

  const element = {
    tagName: tagName.toUpperCase(),
    id,
    nodeType: 1,
    style: {},
    dataset: {},
    textContent: "",
    value: "",
    checked: false,
    disabled: false,
    parentElement: null,
    isConnected: false,
    children,
    options: [],
    classList: {
      add: (...tokens) => tokens.forEach((t) => classSet.add(t)),
      remove: (...tokens) => tokens.forEach((t) => classSet.delete(t)),
      toggle: (token, force) => {
        const shouldAdd = force === undefined ? !classSet.has(token) : Boolean(force);
        if (shouldAdd) {
          classSet.add(token);
        } else {
          classSet.delete(token);
        }
        return shouldAdd;
      },
      contains: (token) => classSet.has(token)
    },
    setAttribute(name, val) {
      attributes.set(name, String(val));
    },
    getAttribute(name) {
      return attributes.get(name) ?? null;
    },
    appendChild(child) {
      if (child.parentElement && child.parentElement !== element) {
        const idx = child.parentElement.children.indexOf(child);
        if (idx !== -1) {
          child.parentElement.children.splice(idx, 1);
        }
      }
      child.parentElement = element;
      child.isConnected = true;
      if (!children.includes(child)) {
        children.push(child);
      }
      return child;
    },
    remove() {
      if (element.parentElement) {
        const idx = element.parentElement.children.indexOf(element);
        if (idx !== -1) {
          element.parentElement.children.splice(idx, 1);
        }
        element.parentElement = null;
      }
      element.isConnected = false;
    },
    addEventListener(type, fn) {
      if (!listeners.has(type)) {
        listeners.set(type, []);
      }
      listeners.get(type).push(fn);
    },
    removeEventListener(type, fn) {
      const list = listeners.get(type) || [];
      const idx = list.indexOf(fn);
      if (idx !== -1) {
        list.splice(idx, 1);
      }
    },
    querySelectorAll() {
      return [];
    },
    getAnimations() {
      return [];
    },
    animate() {
      return {
        finished: Promise.resolve(),
        cancel() {}
      };
    }
  };

  return element;
}

function createContentSandbox({ url = "https://example.com/article?a=1", readyState = "loading", storageData = {} } = {}) {
  const elementsById = new Map();
  const docListeners = new Map();
  const winListeners = new Map();
  const documentElement = createMockElement("html", "root-html");
  const head = createMockElement("head", "root-head");

  function registerTree(el) {
    if (el.id) {
      elementsById.set(el.id, el);
    }
    const origAppend = el.appendChild.bind(el);
    el.appendChild = (child) => {
      if (child.id) {
        elementsById.set(child.id, child);
      }
      const origRemove = child.remove.bind(child);
      child.remove = () => {
        if (child.id) {
          elementsById.delete(child.id);
        }
        origRemove();
      };
      return origAppend(child);
    };
  }

  registerTree(documentElement);
  registerTree(head);

  const document = {
    readyState,
    documentElement,
    head,
    body: createMockElement("body"),
    fullscreenElement: null,
    getElementById(id) {
      return elementsById.get(id) || null;
    },
    createElement(tag) {
      const el = createMockElement(tag);
      registerTree(el);
      return el;
    },
    querySelectorAll() {
      return [];
    },
    addEventListener(type, fn) {
      if (!docListeners.has(type)) {
        docListeners.set(type, []);
      }
      docListeners.get(type).push(fn);
    },
    dispatchEvent(type) {
      for (const fn of docListeners.get(type) || []) {
        fn();
      }
    }
  };

  const windowObj = {
    location: { href: url },
    matchMedia: () => ({ matches: false }),
    setTimeout: (fn) => setTimeout(fn, 0),
    clearTimeout: (id) => clearTimeout(id),
    addEventListener(type, fn) {
      if (!winListeners.has(type)) {
        winListeners.set(type, []);
      }
      winListeners.get(type).push(fn);
    },
    dispatchEvent(type) {
      for (const fn of winListeners.get(type) || []) {
        fn();
      }
    }
  };

  const storage = { ...storageData };
  let storageGetCount = 0;

  const chrome = {
    runtime: {
      onMessage: { addListener() {} },
      lastError: null
    },
    storage: {
      local: {
        async get(key) {
          storageGetCount += 1;
          if (typeof key === "string") {
            return { [key]: storage[key] };
          }
          return { ...storage };
        },
        async set(patch) {
          Object.assign(storage, patch);
        }
      },
      onChanged: { addListener() {} }
    }
  };

  class HTMLElementMock {}
  Object.setPrototypeOf(documentElement, HTMLElementMock.prototype);

  const context = vm.createContext({
    window: windowObj,
    document,
    chrome,
    URL,
    Node: { ELEMENT_NODE: 1 },
    HTMLElement: HTMLElementMock,
    MutationObserver: class {
      observe() {}
      disconnect() {}
    },
    requestAnimationFrame: (fn) => {
      fn();
      return 1;
    },
    cancelAnimationFrame: () => {},
    setTimeout,
    clearTimeout
  });

  const code = fs.readFileSync(CONTENT_JS_PATH, "utf8");
  vm.runInContext(code, context, { filename: "content.js" });

  return {
    context,
    document,
    windowObj,
    HTMLElementMock,
    getStorageGetCount: () => storageGetCount
  };
}

test("content.js: applies instant opacity at document_start and reparents overlays on fullscreenchange", async () => {
  const url = "https://example.com/watch?v=123";
  const { context, document, HTMLElementMock } = createContentSandbox({
    url,
    readyState: "loading",
    storageData: {
      nightModeSettings: {
        mode: "per_page",
        intensityCap: 200,
        schedule: { enabled: false, startTime: "21:00", endTime: "00:00" }
      },
      nightModeByUrl: {
        [url]: {
          enabled: true,
          intensity: 80,
          colorMode: "warm",
          customColor: "#FFCC66",
          updatedAt: 1000
        }
      }
    }
  });

  await context.initializeFromStorage();

  const tintOverlay = document.getElementById("mn-night-overlay");
  const dimOverlay = document.getElementById("mn-night-dim-overlay");

  assert.ok(tintOverlay, "Tint overlay should be created");
  assert.ok(dimOverlay, "Dim overlay should be created");
  assert.notEqual(tintOverlay.style.opacity, "0", "Tint overlay should apply target opacity immediately at document_start");
  assert.equal(tintOverlay.parentElement, document.documentElement);

  const fullscreenContainer = createMockElement("div", "video-player");
  Object.setPrototypeOf(fullscreenContainer, HTMLElementMock.prototype);
  document.fullscreenElement = fullscreenContainer;
  document.dispatchEvent("fullscreenchange");

  assert.equal(tintOverlay.parentElement, fullscreenContainer, "Tint overlay should move into fullscreenElement");
  assert.equal(dimOverlay.parentElement, fullscreenContainer, "Dim overlay should move into fullscreenElement");
});

test("content.js: SPA navigation re-evaluates per_page URL rules", async () => {
  const urlA = "https://example.com/page-a";
  const urlB = "https://example.com/page-b";

  const { context, document, windowObj } = createContentSandbox({
    url: urlA,
    readyState: "complete",
    storageData: {
      nightModeSettings: {
        mode: "per_page",
        intensityCap: 200,
        schedule: { enabled: false, startTime: "21:00", endTime: "00:00" }
      },
      nightModeByUrl: {
        [urlB]: {
          enabled: true,
          intensity: 60,
          colorMode: "blue",
          customColor: "#6F97FF",
          updatedAt: 2000
        }
      }
    }
  });

  await context.initializeFromStorage();
  assert.equal(document.getElementById("mn-night-overlay"), null, "Overlay should not exist on urlA");

  windowObj.location.href = urlB;
  windowObj.dispatchEvent("popstate");
  await new Promise((r) => setTimeout(r, 20));

  const tintOverlay = document.getElementById("mn-night-overlay");
  assert.ok(tintOverlay, "Overlay should be created after SPA navigation to urlB");
});

test("popup.js: I18N dictionaries have 100% key parity across en, pt-BR, es, fr, de and sanitize helpers work", () => {
  const doc = {
    documentElement: { lang: "en" },
    body: createMockElement("body"),
    getElementById: () => createMockElement("div"),
    querySelectorAll: () => [],
    createElement: (tag) => createMockElement(tag)
  };

  const context = vm.createContext({
    window: {
      matchMedia: () => ({ matches: false }),
      addEventListener() {},
      setTimeout,
      clearTimeout
    },
    document: doc,
    navigator: { language: "en-US" },
    chrome: {
      i18n: { getUILanguage: () => "en-US" },
      tabs: { query: async () => [], sendMessage() {} },
      storage: {
        local: {
          get: async () => ({}),
          set: async () => {},
          remove: async () => {}
        }
      },
      runtime: { lastError: null }
    },
    HTMLInputElement: class {},
    HTMLTextAreaElement: class {},
    URL,
    Blob: class {},
    requestAnimationFrame: (fn) => {
      fn();
      return 1;
    },
    setTimeout,
    clearTimeout
  });

  const popupSource =
    fs.readFileSync(POPUP_JS_PATH, "utf8") +
    "\n;globalThis.__TEST_EXPORTS__ = { I18N, sanitizeThemeMap, sanitizeProfileBundle, MAX_SAVED_URLS };";
  vm.runInContext(popupSource, context, { filename: "popup.js" });

  const { I18N, sanitizeThemeMap, sanitizeProfileBundle, MAX_SAVED_URLS } = context.__TEST_EXPORTS__;
  const baseKeys = Object.keys(I18N.en).sort();

  for (const locale of ["pt-BR", "es", "fr", "de"]) {
    const localeKeys = Object.keys(I18N[locale]).sort();
    assert.deepEqual(localeKeys, baseKeys, `Locale ${locale} must contain all I18N keys`);
  }

  // Verify LRU cap on sanitizeThemeMap
  const oversizedMap = {};
  for (let i = 0; i < MAX_SAVED_URLS + 50; i += 1) {
    oversizedMap[`https://example.com/item-${i}`] = {
      enabled: true,
      intensity: 50,
      colorMode: "warm",
      customColor: "#FFCC66",
      updatedAt: i + 1
    };
  }

  const sanitizedMap = sanitizeThemeMap(oversizedMap);
  const sanitizedKeys = Object.keys(sanitizedMap);
  assert.equal(sanitizedKeys.length, MAX_SAVED_URLS, "sanitizeThemeMap should cap entries at MAX_SAVED_URLS");
  assert.ok(!sanitizedMap["https://example.com/item-0"], "Oldest entries should be evicted first");
  assert.ok(
    sanitizedMap[`https://example.com/item-${MAX_SAVED_URLS + 49}`],
    "Most recent entries should be preserved"
  );

  // Verify profile bundle includes mode and accessibility
  const bundle = sanitizeProfileBundle({
    mode: "global",
    accessibility: {
      reduceMotion: true,
      softenBrightness: true,
      reduceSaturation: false,
      flashMitigation: false
    }
  });
  assert.equal(bundle.mode, "global");
  assert.equal(bundle.accessibility.reduceMotion, true);
  assert.equal(bundle.accessibility.softenBrightness, true);
});
