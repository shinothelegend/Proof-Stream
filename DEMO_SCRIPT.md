# ProofStream — Hackathon Judge Demo Script

**Project**: ProofStream — Impact-Gated Streaming Donations  
**Network**: Base Sepolia (Chain ID: `84532`)  
**Hackathon**: Web3 for Social Good Hackathon 2026 (Tech Track)  

---

## ⚡ 60-Second Quick Start

1. Start development server:
   ```bash
   npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000) in your browser.
3. Switch your MetaMask / Coinbase wallet network to **Base Sepolia**.

---

## 🎬 Live Judge Walkthrough Steps

### Phase 1: The Landing Experience & Cinematic Transition
1. Open the landing page at `/`.
2. Observe the **Imagica AI-inspired dark aesthetic**:
   - Floating luminous aurora orbs and noise texture
   - Humanitarian crisis metrics strip (with real OCHA/UNDP data citations)
   - 4-step zero-trust architecture bento grid
   - Live on-chain counters
3. Click the glowing **"Get Started"** button.
   - Notice the **expanding radial veil transition** (§5.3) smoothly sweeping into `/campaigns` without page flash.

### Phase 2: Explore Campaigns & Fund Escrow
1. Navigate to the **Kalimantan Clean Water** campaign.
2. Review the **Milestone Tranche Pipeline**:
   - Tranche 1 ($1,200 USDC) is already marked **Released · 94%** with real BaseScan transaction link.
   - Tranche 2 ($800 USDC) is awaiting field evidence.
3. In the right-hand **Smart Contract Escrow card**:
   - Connect your wallet on Base Sepolia.
   - Enter `50` USDC.
   - Click **1. Approve USDC** → Confirm in MetaMask.
   - Click **2. Fund Escrow** → Confirm in MetaMask.
   - Observe live transaction toast linking directly to BaseScan!

### Phase 3: Field Worker Mobile Evidence Submission
1. Switch role to **Field Worker** using the role pill in the left navigation dock.
2. Go to **Submit Evidence** (`/submit/kalimantan-clean-water`).
3. Fill in:
   - Worker name: `Budi Santoso`
   - Select Tranche 2 ("Assemble and distribute 200 family hygiene kits")
   - Attach field photo: `demo-assets/valid_hygiene_kit_distribution.jpg`
   - Attach receipt: `demo-assets/hygiene_kit_invoice_800usdc.jpg`
   - Click **Get GPS** or rely on camera EXIF tags
   - Click **Record Voice** to test local language translation
4. Click **Submit for AI Verification & On-Chain Release**:
   - Watch the animated verification pipeline:
     1. Pinning to Pinata IPFS
     2. Gemini multimodal vision + receipt OCR
     3. Geofence radius distance calculation
     4. On-chain EAS attestation and tranche release!

### Phase 4: The Fraud Detection Demo (Zero Tolerance for Fake Work)
1. In `/submit/kalimantan-clean-water`, submit evidence again.
2. This time, upload `demo-assets/duplicate_fraud_photo.jpg` (an identical or slightly cropped version of the earlier photo).
3. Submit for verification.
4. **Result**: The verification pipeline flags `REUSED_IMAGE` via perceptual dHash Hamming distance ($< 8$).
   - Verdict card immediately turns red: **REJECTED: Fraud Detected**.
   - Zero dollars released from escrow.

### Phase 5: The Public Audit Explorer
1. Navigate to `/audit` (no wallet connection or login required).
2. Filter for Tranche #1 or Tranche #2.
3. Click **Inspect Proof**:
   - Inspect the exact reasoning produced by Gemini.
   - Verify that the on-chain hash matches the displayed audit text.
   - Click the BaseScan transaction link to confirm the real on-chain transfer on Base Sepolia.
