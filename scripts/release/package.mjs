import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const MANIFEST_PATH = path.join(ROOT_DIR, "manifest.json");
const RELEASE_DIR = path.join(ROOT_DIR, ".release");
const STAGING_DIR = path.join(RELEASE_DIR, "staging");

const RUNTIME_FILES = [
  "manifest.json",
  "popup.html",
  "popup.js",
  "popup.css",
  "content.js",
  "icons/icon-16.png",
  "icons/icon-32.png",
  "icons/icon-48.png",
  "icons/icon-128.png",
  "src/logo.svg",
  "src/fonts/open-sans-latin-400.woff2",
  "src/fonts/open-sans-latin-700.woff2",
  "src/fonts/open-sans-latin-ext-400.woff2",
  "src/fonts/open-sans-latin-ext-700.woff2"
];

function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const version = manifest.version || "1.0.0";
  const zipFilename = `muranight-v${version}.zip`;
  const zipOutputPath = path.join(RELEASE_DIR, zipFilename);

  if (fs.existsSync(STAGING_DIR)) {
    fs.rmSync(STAGING_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(STAGING_DIR, { recursive: true });

  for (const relativeFile of RUNTIME_FILES) {
    const sourcePath = path.join(ROOT_DIR, relativeFile);
    const targetPath = path.join(STAGING_DIR, relativeFile);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.copyFileSync(sourcePath, targetPath);
  }

  if (fs.existsSync(zipOutputPath)) {
    fs.rmSync(zipOutputPath, { force: true });
  }

  if (process.platform === "win32") {
    execFileSync(
      "powershell.exe",
      [
        "-NoProfile",
        "-Command",
        `Compress-Archive -Path '${STAGING_DIR}\\*' -DestinationPath '${zipOutputPath}' -Force`
      ],
      { stdio: "inherit" }
    );
  } else {
    execFileSync("zip", ["-r", zipOutputPath, "."], {
      cwd: STAGING_DIR,
      stdio: "inherit"
    });
  }

  fs.rmSync(STAGING_DIR, { recursive: true, force: true });
  console.log(`Created release archive: .release/${zipFilename}`);
}

main();
