import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

const MANIFEST_PATH = path.join(ROOT_DIR, "manifest.json");
const PACKAGE_JSON_PATH = path.join(ROOT_DIR, "package.json");
const RELEASE_CONFIG_PATH = path.join(ROOT_DIR, "release", "cws-release.json");

const RUNTIME_REQUIRED_FILES = [
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
  "src/fonts/manrope-400.woff2",
  "src/fonts/manrope-700.woff2"
];

const CODE_SCAN_FILES = ["popup.html", "popup.js", "content.js"];

const DANGEROUS_PATTERNS = [
  {
    label: "remote <script src>",
    regex: /<script[^>]+src=["']https?:\/\//i
  },
  {
    label: "dynamic remote import",
    regex: /\bimport\s*\(\s*["']https?:\/\//i
  },
  {
    label: "eval usage",
    regex: /\beval\s*\(/i
  },
  {
    label: "new Function usage",
    regex: /\bnew\s+Function\s*\(/i
  }
];

function readJson(filePath, fallbackValue = null) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (_error) {
    return fallbackValue;
  }
}

function parseSemver(version) {
  if (typeof version !== "string" || !/^\d+\.\d+\.\d+$/.test(version)) {
    return null;
  }

  return version.split(".").map((value) => Number(value));
}

function compareSemver(a, b) {
  const maxLen = Math.max(a.length, b.length);
  for (let i = 0; i < maxLen; i += 1) {
    const left = a[i] ?? 0;
    const right = b[i] ?? 0;
    if (left > right) {
      return 1;
    }
    if (left < right) {
      return -1;
    }
  }
  return 0;
}

function toRelative(filePath) {
  return path.relative(ROOT_DIR, filePath).split(path.sep).join("/");
}

function main() {
  const checks = [];
  const failures = [];

  const manifest = readJson(MANIFEST_PATH);
  const packageJson = readJson(PACKAGE_JSON_PATH, {});
  const releaseConfig = readJson(RELEASE_CONFIG_PATH, {
    lastSubmittedVersion: "0.0.0"
  });

  if (!manifest) {
    console.error("Could not read manifest.json.");
    process.exit(1);
  }

  const currentVersion = manifest.version;
  const previousSubmittedVersion =
    typeof releaseConfig.lastSubmittedVersion === "string"
      ? releaseConfig.lastSubmittedVersion
      : "0.0.0";

  const parsedCurrentVersion = parseSemver(currentVersion);
  const parsedPreviousVersion = parseSemver(previousSubmittedVersion);

  if (!parsedCurrentVersion) {
    failures.push(`manifest.version is invalid: "${currentVersion}"`);
  } else if (!parsedPreviousVersion) {
    failures.push(`release/cws-release.json lastSubmittedVersion is invalid: "${previousSubmittedVersion}"`);
  } else {
    const hasVersionBumped = compareSemver(parsedCurrentVersion, parsedPreviousVersion) > 0;
    checks.push({
      name: "Manifest version incremented against last submitted version",
      passed: hasVersionBumped,
      detail: `${currentVersion} (current) > ${previousSubmittedVersion} (last submitted)`
    });
  }

  checks.push({
    name: "package.json version matches manifest version",
    passed: packageJson.version === currentVersion,
    detail: `package.json=${String(packageJson.version || "")}, manifest.json=${String(currentVersion || "")}`
  });

  const missingRuntimeFiles = RUNTIME_REQUIRED_FILES.filter((relativePath) => {
    const absolutePath = path.join(ROOT_DIR, relativePath);
    return !fs.existsSync(absolutePath);
  });

  checks.push({
    name: "Required runtime files present",
    passed: missingRuntimeFiles.length === 0,
    detail:
      missingRuntimeFiles.length === 0
        ? `${RUNTIME_REQUIRED_FILES.length} files checked`
        : `missing: ${missingRuntimeFiles.join(", ")}`
  });

  const permissions = Array.isArray(manifest.permissions) ? manifest.permissions : [];
  const hostPermissions = Array.isArray(manifest.host_permissions) ? manifest.host_permissions : [];

  const hasExpectedPermissions = permissions.includes("storage") && permissions.includes("tabs");
  const hasAllUrlsHostPermission = hostPermissions.includes("<all_urls>");

  checks.push({
    name: "Manifest permissions kept as approved scope",
    passed: hasExpectedPermissions && hasAllUrlsHostPermission,
    detail: `permissions=[${permissions.join(", ")}], host_permissions=[${hostPermissions.join(", ")}]`
  });

  const codeIssues = [];
  for (const relativePath of CODE_SCAN_FILES) {
    const absolutePath = path.join(ROOT_DIR, relativePath);
    if (!fs.existsSync(absolutePath)) {
      codeIssues.push(`${relativePath}: file not found`);
      continue;
    }

    const source = fs.readFileSync(absolutePath, "utf8");
    for (const pattern of DANGEROUS_PATTERNS) {
      if (pattern.regex.test(source)) {
        codeIssues.push(`${relativePath}: found ${pattern.label}`);
      }
    }
  }

  checks.push({
    name: "No risky remote/dynamic code patterns in runtime scripts",
    passed: codeIssues.length === 0,
    detail: codeIssues.length === 0 ? "scan passed" : codeIssues.join(" | ")
  });

  const releaseConfigExists = fs.existsSync(RELEASE_CONFIG_PATH);
  checks.push({
    name: "Release config file is present",
    passed: releaseConfigExists,
    detail: toRelative(RELEASE_CONFIG_PATH)
  });

  console.log("Chrome Web Store Preflight");
  console.log("==========================");

  for (const check of checks) {
    const label = check.passed ? "[PASS]" : "[FAIL]";
    console.log(`${label} ${check.name}`);
    console.log(`       ${check.detail}`);
    if (!check.passed) {
      failures.push(`${check.name}: ${check.detail}`);
    }
  }

  if (failures.length > 0) {
    console.error("\nPreflight failed.");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log("\nPreflight passed. Ready to package.");
}

main();
