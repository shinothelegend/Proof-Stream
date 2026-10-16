# ProofStream Architecture

ProofStream is an impact-gated streaming donations platform built for the **Web3 for Social Good Hackathon 2026 (Tech Track)**.

---

## 1. High-Level Architecture Diagram

```mermaid
graph TD
    Donor[Donor Wallet] -->|USDC approve & fund| Escrow[CampaignEscrow.sol<br/>Base Sepolia 84532]
    
    FieldWorker[Field Worker Mobile] -->|Geotagged Photo, Receipt, Voice| Pinata[Pinata IPFS]
    Pinata -->|Immutable CIDs| API[/api/submit]
    
    API --> Agent[Verification Agent<br/>src/server/agent/verify.ts]
    
    subgraph Agent Audit Pipeline
        Agent -->|1. EXIF Parser| ExifGate[GPS & Timestamp vs Geofence]
        Agent -->|2. Perceptual dHash| FraudDetector[Hamming Distance < 8 Check]
        Agent -->|3. Multimodal Vision & OCR| Gemini[Google Gemini Flash]
    end
    
    FraudDetector -->|Reused Image| Reject[REJECT: Flagged Fraud]
    Gemini -->|Score >= 0.85 & Valid| ReleaseTrigger[Backend Isolated Signer<br/>chainsigner.ts]
    Gemini -->|Score < 0.85| ReviewQueue[Auditor Review Queue<br/>/review]
    
    ReleaseTrigger -->|1. Create Attestation| EAS[Ethereum Attestation Service<br/>Base Sepolia]
    ReleaseTrigger -->|2. Call release| Escrow
    Escrow -->|Direct USDC Transfer| NGO[Verified NGO Wallet]
    
    AuditPage[Public Audit Explorer<br/>/audit] -->|Cryptographic Verification| EAS
    AuditPage -->|Inspect Reasoning & Proof| API
```

---

## 2. On-Chain vs. Off-Chain Separation

| Concern | Layer | Technology | Details |
|---|---|---|---|
| **Capital Escrow** | On-Chain | `CampaignEscrow.sol` (Base Sepolia) | Holds USDC in milestone tranches. Only `VERIFIER_ROLE` can release. |
| **Stablecoin Asset** | On-Chain | Circle USDC (`0x036CbD53842c5426634e7929541eC2318f3dCF7e`) | Real Base Sepolia USDC. |
| **Public Attestations** | On-Chain | EAS (`0x4200000000000000000000000000000000000021`) | Immutable record of milestone verdict, confidence, and reasoning hash. |
| **Evidence Storage** | Decentralized Storage | Pinata IPFS | Field images, receipts, and audio notes pinned to IPFS. Only CIDs go on-chain. |
| **Multimodal AI** | Off-Chain (Backend) | Google Gemini Flash | Vision scene understanding, receipt OCR, budget validation. |
| **Signing Key Isolation** | Off-Chain (Backend) | `chainsigner.ts` | `VERIFIER_PRIVATE_KEY` is isolated in server environment; never exposed to frontend. |
| **Metadata & Cache** | Off-Chain DB | Prisma + SQLite (Dev) / Postgres (Prod) | Fast UI queries, review queues, and hash index for deduplication. |

---

## 3. Cryptographic Verification Pipeline

1. **EXIF Geofence Gate**:
   - `exifr` parses latitude, longitude, and device metadata from camera photos.
   - Computes Haversine distance against declared milestone target coordinates.
   - Coordinates outside `geoFenceKm` trigger the `OUT_OF_GEOFENCE` flag.
2. **Perceptual Hash Deduplication (Anti-Fraud)**:
   - Computes 64-bit gradient difference hash (`dHash`) of each image.
   - Compares Hamming distance against all past submissions.
   - Distance $< 8$ triggers immediate `REJECT: REUSED_IMAGE`.
3. **Multimodal Vision + OCR**:
   - Single structured `@google/genai` call evaluates visual scene matching, extracts supplier totals, and validates against line-item budgets.
4. **On-Chain Execution**:
   - Attestation recorded on EAS.
   - Tranche release signed by `VERIFIER_ROLE` directly to the NGO recipient wallet.
