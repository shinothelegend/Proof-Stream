# ProofStream — Resources Tracking

Shared source of truth for external dependencies, credentials, and API keys.

| Resource | Environment Variable / Path | Status | Date | Notes |
|---|---|---|---|---|
| Foundry CLI (`forge`) | `~/.foundry/bin/forge.exe` | Installed & Verified | 2026-10-17 | Foundry v1.8.5 installed; `forge test -vvv` runs and passes 5/5 tests. |
| Perceptual dHash Script | `scripts/test-dhash.mjs` | Executed & Verified | 2026-10-17 | Generated real 64-bit dHashes (`0x9125a909565658a9`, `0x532ad648a8ad63a9`). |
| Gemini API Key | `GEMINI_API_KEY` | Configured & Tested | 2026-10-17 | Active model: `gemini-3.8-flash`. Verified inference. |
| Pinata IPFS JWT | `PINATA_JWT` | Configured & Tested | 2026-10-17 | Tested successfully with Pinata `/data/testAuthentication`. |
| Base Sepolia RPC | `NEXT_PUBLIC_RPC_URL` | Configured (Public) | 2026-10-17 | Default `https://sepolia.base.org` |
| Base Sepolia USDC | `NEXT_PUBLIC_USDC_ADDRESS` | Configured | 2026-10-17 | Official Circle testnet USDC: `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |
| EAS Contract | `NEXT_PUBLIC_EAS_ADDRESS` | Verified (Canonical OP-Stack Predeploy) | 2026-10-17 | Official Base Sepolia EAS: `0x4200000000000000000000000000000000000021` |
| EAS Schema Registry | `NEXT_PUBLIC_SCHEMA_REGISTRY` | Verified (Canonical OP-Stack Predeploy) | 2026-10-17 | Official Base Sepolia SchemaRegistry: `0x4200000000000000000000000000000000000020` |
| ProofStream EAS Schema | `NEXT_PUBLIC_EAS_SCHEMA_UID` | Registered & Verified | 2026-10-17 | Registered UID: [`0xd3de6adb8faf789116a05f59a390b23af5b491a252a0bda2d11c0e8c194062b3`](https://sepolia.basescan.org/tx/0xe565dea3b5e8dc5a632ff109597a456136321c6e8b4bec2c61a7f10cbc064b46) |
| Escrow Contract Address | `NEXT_PUBLIC_ESCROW_ADDRESS` | Deployed & Active (`0xa0eb...d3e7`) | 2026-10-17 | Deployed to Base Sepolia at [`0xa0eb087d35d33d2306bc182beaa4222c6dd7d3e7`](https://sepolia.basescan.org/address/0xa0eb087d35d33d2306bc182beaa4222c6dd7d3e7) |
| Verifier Private Key | `VERIFIER_PRIVATE_KEY` | Configured (`0x8FEE...8B57`) | 2026-10-17 | Backend-only key with `VERIFIER_ROLE` to sign release transactions. |
| Deployer Private Key | `DEPLOYER_PRIVATE_KEY` | Configured (`0xbb47...D1dd`) | 2026-10-17 | Key used for contract deployment on Base Sepolia. Needs testnet gas. |
| Real Demo Evidence Pack | N/A (`demo-assets/`) | Prepared | 2026-10-17 | Real geotagged field photos, receipts, and duplicate photo for fraud demo. |
