import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const MANIFEST_PATH = path.join(ROOT_DIR, "manifest.json");
const RELEASE_CONFIG_PATH = path.join(ROOT_DIR, "release", "cws-release.json");

function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const version = manifest.version;

  fs.mkdirSync(path.dirname(RELEASE_CONFIG_PATH), { recursive: true });
  const payload = {
    lastSubmittedVersion: version,
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(RELEASE_CONFIG_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Marked v${version} as submitted in release/cws-release.json`);
}

main();
