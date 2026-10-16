# ProofStream — Architecture & Engineering Decisions Log

Shared source of truth for architectural choices, deduplications, and fallbacks.

| Decision ID | Area | Choice | Rationale |
|---|---|---|---|
| DEC-001 | Chain Choice | Base Sepolia (`84532`) | Official master chain specified in Part 0–13. Circle faucet provides real testnet USDC; EAS contracts are natively deployed. Replaced conflicting Arbitrum Sepolia mention in secondary sub-prompt. |
| DEC-002 | Brand Identity | `ProofStream` (with `src/lib/brand.ts` centralized config) | Unified primary brand name matching the master specification, while allowing single-file rebranding if desired. |
| DEC-003 | Monorepo Structure | Next.js 15 App Router + `contracts/` inside root | Single deployable unit containing frontend, API endpoints, backend agent pipeline, and Solidity smart contracts. |
| DEC-004 | Database Strategy | Prisma with SQLite for local development; Postgres compatible | Zero-config local execution without requiring external database setups while maintaining production schema parity. |
| DEC-005 | Security Pre-commit & Key Isolation | Backend `chainsigner.ts` isolation | `VERIFIER_PRIVATE_KEY` and `DEPLOYER_PRIVATE_KEY` are strictly server-side and never bundled in client code. `.env` is git-ignored. |
| DEC-006 | AI Verification Pipeline | Real `@google/genai` (Gemini Flash) with vision + OCR + EXIF + pHash | Adheres to the strict Real-Data Law. Returns explicit error if API key is unconfigured rather than silent mock degradation. |
| DEC-007 | Attestation Strategy | EAS SDK / viem contract integration + Escrow contract `DecisionLogged` event emission | Dual proof mechanism ensures on-chain auditability even if EAS schema registry encounters network delays. |
| DEC-008 | Pixel Restyle & Design System | "Arcade Ledger" — strict 5-color tokens, zero border-radius, hard shadows | Replaced generic aurora/glass design. Enforces absolute palette discipline (gold for interactive, cyan for data, mint/alert for status), procedural 64x32 canvas cartridge banners, and dark/light modes with PixelDissolve toggle. |
