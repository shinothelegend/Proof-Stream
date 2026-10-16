# ProofStream — Resources Tracking

Shared source of truth for external dependencies, credentials, and API keys.

| Resource | Environment Variable | Status | Date | Notes |
|---|---|---|---|---|
| Gemini API Key | `GEMINI_API_KEY` | Pending Configuration | 2026-10-16 | Required for multimodal vision, OCR, and reasoning pipeline. |
| Pinata IPFS JWT | `PINATA_JWT` | Pending Configuration | 2026-10-16 | Required for evidence pinning on IPFS. |
| Base Sepolia RPC | `NEXT_PUBLIC_RPC_URL` | Configured (Public) | 2026-10-16 | Default `https://sepolia.base.org` |
| Base Sepolia USDC | `NEXT_PUBLIC_USDC_ADDRESS` | Configured | 2026-10-16 | Official Circle testnet USDC: `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |
| EAS Contract | `NEXT_PUBLIC_EAS_ADDRESS` | Configured | 2026-10-16 | Official Base Sepolia EAS: `0x4200000000000000000000000000000000000021` |
| EAS Schema Registry | `NEXT_PUBLIC_SCHEMA_REGISTRY` | Configured | 2026-10-16 | Official Base Sepolia SchemaRegistry: `0x4200000000000000000000000000000000000020` |
| Escrow Contract Address | `NEXT_PUBLIC_ESCROW_ADDRESS` | Pending Deployment | 2026-10-16 | Contracts to be deployed on Base Sepolia. |
| Verifier Private Key | `VERIFIER_PRIVATE_KEY` | Pending Configuration | 2026-10-16 | Backend-only key with `VERIFIER_ROLE` to sign release transactions. |
| Deployer Private Key | `DEPLOYER_PRIVATE_KEY` | Pending Configuration | 2026-10-16 | Used for contract deployment. |
| Real Demo Evidence Pack | N/A (`demo-assets/`) | Prepared | 2026-10-16 | Real geotagged field photos, receipts, and duplicate photo for fraud demo. |
