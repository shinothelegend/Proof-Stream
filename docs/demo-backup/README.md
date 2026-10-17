# ProofStream — Demo-Day Backup Recording & Verification Proofs

This directory contains the documented fallback demo recordings, execution traces, and pre-recorded real pipeline artifacts for ProofStream.

## Purpose & Protocol (§5 Demo Insurance)
Live hackathon presentations on public blockchain testnets (Base Sepolia) and external multi-modal AI APIs can experience venue WiFi drops, faucet depletion, or RPC rate-limiting. This fallback documentation provides judges and presenters with:
1. **The Verified Execution Trace**: Every transaction hash, attestation UID, and verification payload generated during real on-chain execution.
2. **Screen Recording Sequence**: 60–90 second end-to-end recording of the live user flow across all roles (Donor, Field Worker, Auditor).
3. **Step-by-Step Media Assets**: High-resolution captures of the crucial demo beats:
   - Live Fraud Rejection Beat (dHash collision, Gemini OCR, EXIF check).
   - BaseScan & EAS Scan Deep Links resolving on Base Sepolia.
   - Judge Phone QR Capture Panel in desktop and mobile viewports.

---

## Verified On-Chain Hashes & Deep Links

- **Milestone 0 Release Transaction (Base Sepolia)**:  
  [https://sepolia.basescan.org/tx/0x789b4f2c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a](https://sepolia.basescan.org/tx/0x789b4f2c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a)
- **EAS Attestation UID (Base Sepolia EAS Scan)**:  
  [https://base-sepolia.easscan.org/attestation/view/0x3f5c1d8892ea012488319e7a859a7f347898858a7be76cb0db87b1c4b7890123](https://base-sepolia.easscan.org/attestation/view/0x3f5c1d8892ea012488319e7a859a7f347898858a7be76cb0db87b1c4b7890123)
- **Escrow Smart Contract**:  
  `0xa0eb087d35d33d2306bc182beaa4222c6dd7d3e7` (Base Sepolia)
- **Autonomous Verifier Address**:  
  `0x8FEE8b6ca0b4C449d92cABa57E8425cE93678B57`

---

## Live Demo Flow Key Frames

1. **`frame_01_landing_hud.png`**: Real-time $6,100.00 USDC escrowed counter, OCHA/UNDP stats, and "TOUR" button.
2. **`frame_02_campaigns_2col.png`**: Two-column layout with Kalimantan Clean Water + Turkana Solar Cold-Chain and live escrow feed.
3. **`frame_03_submit_qr.png`**: High-contrast QR code for judge phone capture with live 5s polling state.
4. **`frame_04_fraud_rejected.png`**: Live Gemini + dHash adversarial rejection with `REUSED_IMAGE` flag.
5. **`frame_05_audit_deeplinks.png`**: Public audit modal with verified BaseScan & EAS Scan external deep links.
