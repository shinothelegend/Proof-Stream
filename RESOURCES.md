# ProofStream — Resources Tracking

Shared source of truth for external dependencies, credentials, and API keys.

| Resource | Environment Variable / Path | Status | Date | Notes |
|---|---|---|---|---|
| Foundry CLI (`forge`) | `~/.foundry/bin/forge.exe` | Installed & Verified | 2026-10-17 | Foundry v1.8.5 installed; `forge test -vvv` runs and passes 5/5 tests. |
| Perceptual dHash Script | `scripts/test-dhash.mjs` | Executed & Verified | 2026-10-17 | Generated real 64-bit dHashes (`0x9125a909565658a9`, `0x532ad648a8ad63a9`). |
| Gemini API Key | `GEMINI_API_KEY` | Pending User Configuration | 2026-10-17 | Required for production multimodal vision, OCR, and reasoning pipeline. |
| Pinata IPFS JWT | `PINATA_JWT` | Pending User Configuration | 2026-10-17 | Required for decentralized evidence pinning. |
| Base Sepolia RPC | `NEXT_PUBLIC_RPC_URL` | Configured (Public) | 2026-10-17 | Default `https://sepolia.base.org` |
| Base Sepolia USDC | `NEXT_PUBLIC_USDC_ADDRESS` | Configured | 2026-10-17 | Official Circle testnet USDC: `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |
| EAS Contract | `NEXT_PUBLIC_EAS_ADDRESS` | Verified (Canonical OP-Stack Predeploy) | 2026-10-17 | Official Base Sepolia EAS: `0x4200000000000000000000000000000000000021` |
| EAS Schema Registry | `NEXT_PUBLIC_SCHEMA_REGISTRY` | Verified (Canonical OP-Stack Predeploy) | 2026-10-17 | Official Base Sepolia SchemaRegistry: `0x4200000000000000000000000000000000000020` |
| Escrow Contract Address | `NEXT_PUBLIC_ESCROW_ADDRESS` | Pending On-Chain Deploy | 2026-10-17 | Ready for deployment via `forge create` upon supplying funded testnet key. |
| Verifier Private Key | `VERIFIER_PRIVATE_KEY` | Pending User Configuration | 2026-10-17 | Backend-only key with `VERIFIER_ROLE` to sign release transactions. |
| Deployer Private Key | `DEPLOYER_PRIVATE_KEY` | Pending User Configuration | 2026-10-17 | Key used for contract deployment on Base Sepolia. |
| Real Demo Evidence Pack | N/A (`demo-assets/`) | Prepared | 2026-10-17 | Real geotagged field photos, receipts, and duplicate photo for fraud demo. |
