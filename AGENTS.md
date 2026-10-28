# Project Context for Agents (AGENTS.md)

## Overview

MuraNight is a Chrome and Microsoft Edge Manifest V3 browser extension that applies a customizable night-mode tint/dim overlay and accessibility protections to web pages, either per exact URL (`origin + pathname + search`) or globally.

## Directory Structure

- `/`: Root extension runtime files (`manifest.json`, `content.js`, `popup.html`, `popup.js`, `popup.css`, `tailwind.config.js`)
- `/src`: Tailwind source stylesheet (`src/popup.tailwind.css`), vector logo (`src/logo.svg`), and local `Open Sans` `.woff2` fonts (`src/fonts/`)
- `/icons`: Extension icons (`16`, `32`, `48`, `128` px)
- `/scripts/release`: Pre-release validation (`preflight.mjs`), packaging (`package.mjs`), and version tracking (`mark-submitted.mjs`)
- `/release`: Release metadata (`cws-release.json`)

## Tech Stack

- **Language**: Vanilla JavaScript (ES2022+, no runtime bundler)
- **Framework / Styling**: Tailwind CSS (`^3.4.17`, compiled from `src/popup.tailwind.css` into `popup.css`)
- **Storage**: `chrome.storage.local` (`nightModeSettings` and `nightModeByUrl`)

## Commands

```bash
# Compile Tailwind CSS (mandatory after editing popup.html or src/popup.tailwind.css)
npm run build:css

# Watch Tailwind CSS during UI development
npm run watch:css

# Run Chrome Web Store preflight validation
npm run release:preflight

# Package runtime files into .release/muranight-v<version>.zip
npm run release
```

## Engineering Conventions

- **Sanitize on read**: Always pass values from `chrome.storage.local` or imported files through `sanitize*` / `normalize*` functions.
- **Performance**: Throttle live preview messages with `requestAnimationFrame` and debounce `chrome.storage.local.set` calls during continuous slider/picker input.
- **Localization**: Never hardcode UI strings in JS; use `t(key)` and `I18N` dictionaries (`en`, `pt-BR`, `es`, `fr`, `de`).
- **Tailwind CSS**: Never edit `popup.css` manually. Edit `src/popup.tailwind.css` or `popup.html` and run `npm run build:css`.
