#!/usr/bin/env node

/**
 * ProofStream Route Verification Script (§4 Anti-Regression Gate)
 * Hits every public route and API endpoint against the running dev/prod server.
 * Verifies HTTP 200 and absence of server/build errors.
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const ROUTES = [
  { path: "/", name: "Landing Hero & Stats", expectJson: false },
  { path: "/campaigns", name: "Campaigns Index & Quest Cards", expectJson: false },
  { path: "/campaigns/cmvba68ow0000u8tkmoa6o86t", name: "Campaign Detail & Escrow Funding", expectJson: false },
  { path: "/submit/cmvba68ox0002u8tkzdbxp1ed", name: "Submit Evidence Field Portal", expectJson: false },
  { path: "/review", name: "Reviewer Queue & Auditor Window", expectJson: false },
  { path: "/audit", name: "Public Audit & EAS Attestations", expectJson: false },
  { path: "/docs", name: "Documentation Overview", expectJson: false },
  { path: "/docs/architecture", name: "Docs: System Architecture", expectJson: false },
  { path: "/docs/contracts", name: "Docs: Smart Contract Escrow", expectJson: false },
  { path: "/docs/verification-agent", name: "Docs: AI Multimodal Verification", expectJson: false },
  { path: "/docs/audit", name: "Docs: EAS Attestations", expectJson: false },
  { path: "/docs/setup", name: "Docs: 60-Second Setup", expectJson: false },
  { path: "/api/campaigns", name: "API: Active Campaigns & On-Chain Stats", expectJson: true },
];

async function checkRoute(route) {
  const url = `${BASE_URL}${route.path}`;
  const start = Date.now();

  try {
    const res = await fetch(url, {
      headers: {
        Accept: route.expectJson ? "application/json" : "text/html,application/xhtml+xml",
      },
    });

    const elapsed = Date.now() - start;
    const body = await res.text();

    if (res.status !== 200) {
      return {
        path: route.path,
        name: route.name,
        ok: false,
        status: res.status,
        elapsed,
        error: `Expected 200, got ${res.status}`,
      };
    }

    // Check for build / runtime error leaks in HTML
    if (
      body.includes("Internal Server Error") ||
      body.includes("ModuleBuildError") ||
      body.includes("Unhandled Runtime Error")
    ) {
      return {
        path: route.path,
        name: route.name,
        ok: false,
        status: 500,
        elapsed,
        error: "Response contains server error text",
      };
    }

    if (route.expectJson) {
      try {
        const json = JSON.parse(body);
        if (!json.success) {
          return {
            path: route.path,
            name: route.name,
            ok: false,
            status: 200,
            elapsed,
            error: "JSON success property is false",
          };
        }
      } catch (err) {
        return {
          path: route.path,
          name: route.name,
          ok: false,
          status: 200,
          elapsed,
          error: "Invalid JSON response",
        };
      }
    }

    return {
      path: route.path,
      name: route.name,
      ok: true,
      status: res.status,
      elapsed,
    };
  } catch (err) {
    return {
      path: route.path,
      name: route.name,
      ok: false,
      status: 0,
      elapsed: Date.now() - start,
      error: err.message,
    };
  }
}

async function run() {
  console.log(`[verify-routes] Starting smoke verification against ${BASE_URL}...\n`);

  let allOk = true;
  const results = [];

  for (const route of ROUTES) {
    process.stdout.write(`  Checking ${route.path.padEnd(42)} `);
    const result = await checkRoute(route);
    results.push(result);

    if (result.ok) {
      console.log(`✓ 200 OK (${result.elapsed}ms)`);
    } else {
      console.log(`✗ FAIL (${result.status}) — ${result.error}`);
      allOk = false;
    }
  }

  console.log("\n" + "=".repeat(70));
  if (allOk) {
    console.log(`[verify-routes] ALL ${results.length} ROUTES VERIFIED 200 OK — ZERO REGRESSIONS ✓`);
    process.exit(0);
  } else {
    console.error(`[verify-routes] Route verification failed. Check errors above.`);
    process.exit(1);
  }
}

run();
