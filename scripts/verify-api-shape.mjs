import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

console.log("\n=======================================================");
console.log("   PROOFSTREAM API SHAPE & DATA CONTRACT AUDIT         ");
console.log("   Target Endpoint: " + APP_URL + "/api/campaigns      ");
console.log("=======================================================\n");

async function checkApiContract() {
  process.stdout.write("[1/2] Validating /api/campaigns payload contract... ");
  try {
    const res = await fetch(`${APP_URL}/api/campaigns`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Failed to fetch from ${APP_URL}/api/campaigns`);
    }

    const json = await res.json();

    if (json.success !== true) {
      throw new Error("Payload 'success' is not true");
    }

    if (!Array.isArray(json.data)) {
      throw new Error("Payload 'data' is not an array");
    }

    if (json.data.length === 0) {
      throw new Error("Payload 'data' array is empty. Run 'npm run seed' first.");
    }

    for (let i = 0; i < json.data.length; i++) {
      const camp = json.data[i];
      if (!camp.title || typeof camp.title !== "string" || !camp.title.trim()) {
        throw new Error(`Campaign [${i}] is missing non-empty 'title' string`);
      }
      if (!camp.story || typeof camp.story !== "string" || !camp.story.trim()) {
        throw new Error(`Campaign [${i}] (${camp.title}) is missing non-empty 'story' string`);
      }
      if (!camp.siteAddress || typeof camp.siteAddress !== "string" || !camp.siteAddress.trim()) {
        throw new Error(`Campaign [${i}] (${camp.title}) is missing non-empty 'siteAddress' string`);
      }
      if (typeof camp.goal !== "number" || isNaN(camp.goal) || camp.goal <= 0) {
        throw new Error(`Campaign [${i}] (${camp.title}) has invalid numeric 'goal': ${camp.goal}`);
      }
      if (typeof camp.escrowBalance !== "number" || isNaN(camp.escrowBalance) || camp.escrowBalance < 0) {
        throw new Error(`Campaign [${i}] (${camp.title}) has invalid numeric 'escrowBalance': ${camp.escrowBalance}`);
      }
    }

    console.log("✓ PASS");
    console.log(`      • Verified ${json.data.length} active campaigns conform to Prisma model.`);
  } catch (err) {
    console.log("✗ FAIL");
    console.error(`      Error: ${err.message}`);
    process.exit(1);
  }
}

function scanForbiddenPattern() {
  process.stdout.write("[2/2] Scanning src/ for forbidden pattern 'data.campaigns'... ");
  const srcDir = resolve(rootDir, "src");
  const violations = [];

  function walk(dir) {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (/\.(tsx|ts|jsx|js)$/.test(entry)) {
        const content = readFileSync(fullPath, "utf-8");
        if (content.includes("data.campaigns")) {
          violations.push(fullPath);
        }
      }
    }
  }

  walk(srcDir);

  if (violations.length > 0) {
    console.log("✗ FAIL");
    console.error(`      Forbidden pattern 'data.campaigns' found in ${violations.length} file(s):`);
    for (const v of violations) {
      console.error(`        - ${v}`);
    }
    process.exit(1);
  } else {
    console.log("✓ PASS");
    console.log("      • Zero instances of 'data.campaigns' found in src/ codebase.");
  }
}

async function run() {
  await checkApiContract();
  scanForbiddenPattern();
  console.log("\n-------------------------------------------------------");
  console.log("🎯 API SHAPE CONTRACT TEST PASSED WITH ZERO VIOLATIONS.");
  console.log("-------------------------------------------------------\n");
}

run();
