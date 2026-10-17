import { createPublicClient, http, formatEther } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

// Load .env manually if not in process.env
function loadEnv() {
  const envPath = resolve(rootDir, ".env");
  if (existsSync(envPath)) {
    const lines = readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      const val = rest.join("=").replace(/^["']|["']$/g, "").trim();
      if (key && val && !process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

loadEnv();

console.log("\n=======================================================");
console.log("   PROOFSTREAM DEMO-DAY PRE-FLIGHT VERIFICATION        ");
console.log("   Target Network: Base Sepolia (Chain ID: 84532)      ");
console.log("=======================================================\n");

let passedCount = 0;
let totalChecks = 7;
let warningCount = 0;

// 1. Check Base Sepolia RPC & Wallet Balances
async function checkWallets() {
  process.stdout.write("[1/7] Checking Base Sepolia RPC & Signer Wallet Balances... ");
  try {
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia.base.org";
    const client = createPublicClient({
      chain: baseSepolia,
      transport: http(rpcUrl),
    });

    const blockNum = await client.getBlockNumber();

    const verifierKey = process.env.VERIFIER_PRIVATE_KEY;
    const deployerKey = process.env.DEPLOYER_PRIVATE_KEY;
    const escrowAddr = process.env.NEXT_PUBLIC_ESCROW_ADDRESS;

    let verifierAddr = "N/A";
    let verifierEth = "0.0";
    if (verifierKey && verifierKey.startsWith("0x")) {
      const acc = privateKeyToAccount(verifierKey);
      verifierAddr = acc.address;
      const bal = await client.getBalance({ address: acc.address });
      verifierEth = formatEther(bal);
    }

    let deployerAddr = "N/A";
    let deployerEth = "0.0";
    if (deployerKey && deployerKey.startsWith("0x")) {
      const acc = privateKeyToAccount(deployerKey);
      deployerAddr = acc.address;
      const bal = await client.getBalance({ address: acc.address });
      deployerEth = formatEther(bal);
    }

    console.log("✓ PASS");
    console.log(`      • RPC Block Height : #${blockNum}`);
    console.log(`      • Verifier Wallet  : ${verifierAddr} (${parseFloat(verifierEth).toFixed(4)} ETH)`);
    console.log(`      • Deployer Wallet  : ${deployerAddr} (${parseFloat(deployerEth).toFixed(4)} ETH)`);
    console.log(`      • Escrow Contract  : ${escrowAddr || "Not Set"}`);
    passedCount++;
  } catch (err) {
    console.log("✗ FAIL");
    console.error(`      Error: ${err.message}`);
  }
}

// 2. Check Seeded Campaigns
async function checkSeededCampaigns() {
  process.stdout.write("[2/7] Checking Seeded Campaigns in Database... ");
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${appUrl}/api/campaigns`);
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${appUrl}/api/campaigns`);
    const data = await res.json();
    if (!data.success || !data.data || data.data.length === 0) {
      throw new Error("No campaigns found. Run 'npm run seed' first.");
    }

    console.log("✓ PASS");
    console.log(`      • Active Campaigns : ${data.data.length}`);
    for (const c of data.data) {
      console.log(`        - [${c.slug}] "${c.title.slice(0, 42)}..." ($${c.goal} USDC)`);
    }
    console.log(`      • Total Escrowed   : $${data.stats?.totalEscrowedUSDC || 0} USDC`);
    console.log(`      • Proven Tranches  : ${data.stats?.releasedTranchesCount || 0}`);
    passedCount++;
  } catch (err) {
    console.log("✗ FAIL");
    console.error(`      Error: ${err.message}`);
  }
}

// 3. Check App API Routes Health (HTTP 200)
async function checkApiRoutes() {
  process.stdout.write("[3/7] Checking Local Application Routes Health (HTTP 200)... ");
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const routes = ["/", "/campaigns", "/review", "/audit", "/api/campaigns", "/api/review"];
    const results = [];

    for (const route of routes) {
      const res = await fetch(`${appUrl}${route}`);
      if (res.status !== 200) {
        throw new Error(`Route ${route} returned HTTP ${res.status}`);
      }
      results.push(`${route}: 200`);
    }

    console.log("✓ PASS");
    console.log(`      • Verified Endpoints: ${results.join(", ")}`);
    passedCount++;
  } catch (err) {
    console.log("✗ FAIL");
    console.error(`      Error: ${err.message}`);
  }
}

// 4. Check Gemini AI Key Configuration
async function checkGemini() {
  process.stdout.write("[4/7] Checking Gemini Multimodal Verification AI Key... ");
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    if (!apiKey || apiKey.length < 10) {
      throw new Error("GEMINI_API_KEY is not configured in .env");
    }

    // Ping Google GenAI endpoint to verify key
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini API key rejected: HTTP ${res.status} - ${errText.slice(0, 100)}`);
    }

    console.log("✓ PASS");
    console.log(`      • Model Configured : ${model}`);
    console.log(`      • API Key Status   : Authenticated & Authorized`);
    passedCount++;
  } catch (err) {
    console.log("✗ FAIL");
    console.error(`      Error: ${err.message}`);
  }
}

// 5. Check Pinata IPFS Reachability
async function checkPinata() {
  process.stdout.write("[5/7] Checking Pinata IPFS Gateway & Pinning Service... ");
  try {
    const jwt = process.env.PINATA_JWT;
    const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "https://gateway.pinata.cloud";
    if (!jwt || jwt.length < 20) {
      throw new Error("PINATA_JWT is not configured in .env");
    }

    const res = await fetch("https://api.pinata.cloud/data/testAuthentication", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Pinata authentication failed: HTTP ${res.status}`);
    }

    const data = await res.json();
    console.log("✓ PASS");
    console.log(`      • Pinata Service   : ${data.message || "Authenticated"}`);
    console.log(`      • IPFS Gateway     : ${gateway}`);
    passedCount++;
  } catch (err) {
    console.log("✗ FAIL");
    console.error(`      Error: ${err.message}`);
  }
}

// 6. Check API Shape Contract & Codebase Scans (§0.3)
async function checkApiShapeContract() {
  process.stdout.write("[6/7] Validating API Payload Contract & Codebase Cleanliness... ");
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${appUrl}/api/campaigns`);
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${appUrl}/api/campaigns`);
    const json = await res.json();

    if (json.success !== true || !Array.isArray(json.data) || json.data.length === 0) {
      throw new Error("Invalid API payload structure or empty data array");
    }

    for (const camp of json.data) {
      if (!camp.title || !camp.story || !camp.siteAddress) {
        throw new Error(`Campaign [${camp.id}] missing required string fields`);
      }
      if (typeof camp.goal !== "number" || typeof camp.escrowBalance !== "number") {
        throw new Error(`Campaign [${camp.id}] missing valid numeric fields`);
      }
    }

    // Scan src for data.campaigns
    const srcDir = resolve(rootDir, "src");
    let hasViolation = false;
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
            hasViolation = true;
          }
        }
      }
    }
    walk(srcDir);

    if (hasViolation) {
      throw new Error("Forbidden pattern 'data.campaigns' detected in src/ directory");
    }

    console.log("✓ PASS");
    console.log(`      • Contract Check   : All ${json.data.length} campaigns conform to Prisma model`);
    console.log(`      • Forbidden Scan   : Zero instances of 'data.campaigns' in src/`);
    passedCount++;
  } catch (err) {
    console.log("✗ FAIL");
    console.error(`      Error: ${err.message}`);
  }
}

// 7. Check QR Demo Reachability (§2)
async function checkQrReachability() {
  process.stdout.write("[7/7] Checking Serving Origin for Phone QR Reachability... ");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const isLocalhost =
    appUrl.includes("localhost") || appUrl.includes("127.0.0.1") || appUrl.includes("::1");

  if (isLocalhost) {
    console.log("⚠️ WARN");
    console.log(`      • Serving Origin   : ${appUrl}`);
    console.log("      • NOTICE: When demonstrating the phone QR capture live on stage:");
    console.log("        A judge's smartphone cannot resolve 'localhost'. Run the demo with a phone-reachable origin:");
    console.log("        Option A (Primary - Cloudflare Tunnel):");
    console.log("          cloudflared tunnel --url http://localhost:3000");
    console.log("          Set NEXT_PUBLIC_APP_URL=<tunnel-url> in .env");
    console.log("        Option B (Backup - Same Wi-Fi LAN IP):");
    console.log("          npm run dev -- -H 0.0.0.0");
    console.log("          Serve and scan using your laptop's LAN IP (e.g. http://192.168.x.x:3000)");
    warningCount++;
    passedCount++; // Counted as pass with warning for local pre-flight
  } else {
    console.log("✓ PASS");
    console.log(`      • Serving Origin   : ${appUrl} (Phone-reachable network origin)`);
    passedCount++;
  }
}

async function run() {
  await checkWallets();
  await checkSeededCampaigns();
  await checkApiRoutes();
  await checkGemini();
  await checkPinata();
  await checkApiShapeContract();
  await checkQrReachability();

  console.log("\n-------------------------------------------------------");
  if (passedCount === totalChecks) {
    console.log(`🎯 PRE-FLIGHT RESULT: ${passedCount}/${totalChecks} CHECKS PASSED (${warningCount} warnings). SYSTEM DEMO-READY!`);
    console.log("-------------------------------------------------------\n");
    process.exit(0);
  } else {
    console.log(`⚠️ PRE-FLIGHT RESULT: ${passedCount}/${totalChecks} CHECKS PASSED. REVIEW WARNINGS/FAILURES ABOVE.`);
    console.log("-------------------------------------------------------\n");
    process.exit(1);
  }
}

run();
