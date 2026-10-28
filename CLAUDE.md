# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

MuraNight is a Chrome/Edge MV3 browser extension that applies a night mode overlay to web pages. It is a **no-build, no-bundler** project — all JS files are served directly to the browser. The only build step is Tailwind CSS compilation.

## Commands

```bash
# Compile Tailwind CSS (required after editing popup.html classes or src/popup.tailwind.css)
npm run build:css

# Watch mode during UI work
npm run watch:css

# Pre-release checks (version sync, required files, security scan)
npm run release:preflight

# Package for Chrome Web Store submission
npm run release
```

Loading into Chrome/Edge for testing: open `chrome://extensions` (or `edge://extensions`), enable Developer Mode, then "Load unpacked" and select this folder. Changes to JS/HTML take effect on popup reopen; CSS requires `build:css` first.

## Architecture

The extension has two runtime contexts that communicate via `chrome.tabs.sendMessage`:

**`content.js`** — injected into every page at `document_start`. Listens for `APPLY_THEME` and `REMOVE_THEME` messages and manages two fixed-position overlay `<div>` elements injected into `document.documentElement`:
- `mn-night-overlay` (tint layer, `mix-blend-mode: multiply`, z-index `2147483646`)
- `mn-night-dim-overlay` (black dim layer, z-index `2147483645`)

Opacity math uses power curves with separate multipliers per color mode (`warm`/`blue`/`custom`). Intensity 0–100 maps to base opacity; 101–500 uses a boost curve for extra darkening. The content script also reacts to `chrome.storage.onChanged` so it self-updates when settings change from another tab.

**`popup.js`** — runs in the popup window. Owns all UI state and user interactions. On open, it reads both storage keys, resolves the active theme for the current tab, applies it immediately via messaging, then mirrors the live state into the form controls. All persisted state flows through two keys:
- `nightModeSettings` — global settings object (mode, presets, intensityCap, schedule, locale, profiles)
- `nightModeByUrl` — map of `origin+pathname+search` → theme config

The `suspendHandlers` flag prevents re-entrant storage writes while the popup is programmatically updating form controls.

**Storage schema** (`SETTINGS_VERSION = 3`):
```js
{
  mode: "per_page" | "global",
  perPagePreset: { intensity, colorMode, customColor, updatedAt },
  globalPreset: { intensity, colorMode, customColor, updatedAt },
  intensityCap: 200 | 300 | 400 | 500,
  schedule: { enabled, startTime, endTime },
  accessibility: { reduceMotion, softenBrightness, reduceSaturation, flashMitigation },
  localeMode: "auto" | "manual",
  manualLocale: "en" | "pt-BR" | "es" | "fr" | "de",
  profiles: [{ id, name, bundle, createdAt, updatedAt }]
}
```

## Key conventions

- **URL key**: `origin + pathname + search` (hash ignored). Both files share `normalizeUrlKey()` for consistency.
- **Sanitize on read, always**: every value from storage passes through a `sanitize*` / `normalize*` helper before use. Never trust raw storage values.
- **i18n**: text is never hardcoded in JS. All UI strings go through `t(key)`, resolved from the `I18N` map in `popup.js`. HTML elements use `data-i18n`, `data-i18n-title`, `data-i18n-aria-label`, or `data-i18n-placeholder` attributes — `applyLocalization()` fills them at runtime.
- **Tailwind**: source is `src/popup.tailwind.css`, compiled output is `popup.css`. The `tailwind.config.js` scans only `popup.html`. **Never edit `popup.css` directly.**
- **Release**: `manifest.json` and `package.json` versions must match. The `release/cws-release.json` file tracks the last submitted version to enforce a version bump before each submission.
