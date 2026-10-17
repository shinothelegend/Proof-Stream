# ProofStream — Master Demo-Day Pitch & Walkthrough Script (v2.0)

> **Competition**: Web3 for Social Good Hackathon 2026 (Tech & Impact Track)  
> **Network**: Base Sepolia (Chain ID: `84532`)  
> **Target Pitch Duration**: 3 Minutes (with optional 2-minute Q&A / deep-dive)  
> **Core Value Proposition**: *Donations are streamed, not dumped. Funds unlock only when multimodal AI and cryptographic attestations prove real impact on the ground.*

---

## ⚡ 10-Minute Pre-Flight Checklist (Run Before Stepping on Stage)

Execute the automated read-only pre-flight command in your terminal:
```bash
npm run demo:preflight
```
Ensure all 7 gates pass:
1. **Base Sepolia RPC & Signer Wallet Balances**: ≥ 0.002 ETH on Verifier (`0x8FEE...8B57`) and Deployer (`0xbb47...D1dd`).
2. **Seeded Campaigns**: 2 Active NGO campaigns ($6,100.00 USDC escrowed, 1 proven tranche).
3. **Application Routes**: HTTP 200 on `/`, `/campaigns`, `/review`, `/audit`, `/api/campaigns`, `/api/review`.
4. **Gemini Multimodal AI Key**: `gemini-3.8-flash` authenticated and responsive.
5. **Pinata IPFS Service**: Authenticated with dedicated gateway reachable.
6. **API Shape Contract & Codebase Integrity**: All active campaigns conform to Prisma schema; zero forbidden patterns.
7. **Phone QR Demo Reachability**: Origin verified for external device camera scanning (see runbook below).

### 📱 Phone QR Reachability Runbook (§2)

Because judges scan the QR code from their own mobile devices, the application must be accessible over the network:

- **Option A (Primary — Cloudflare Tunnel / ngrok)**:
  *Best for hackathon venues with client-isolated Wi-Fi*:
  ```bash
  # In a separate terminal
  npx cloudflared tunnel --url http://localhost:3000
  ```
  Copy the generated URL (`https://<unique-subdomain>.trycloudflare.com`) and update `.env`:
  `NEXT_PUBLIC_APP_URL=https://<unique-subdomain>.trycloudflare.com`
  Then open that URL in the presentation browser. The QR code automatically encodes this phone-reachable URL.

- **Option B (Backup — Same Wi-Fi LAN IP)**:
  *If local device-to-device communication is permitted on the router*:
  ```bash
  npm run dev -- -H 0.0.0.0
  ```
  Set `NEXT_PUBLIC_APP_URL=http://<laptop-lan-ip>:3000` (e.g. `http://192.168.1.145:3000`).

- **Note on Wallet Connections**:
  MetaMask and RainbowKit desktop flows connect normally. If connecting mobile wallets through the tunnel URL, ensure Reown / WalletConnect domain configuration allows the tunnel origin.

### Prepared Demo Wallets & Faucet Balances

| Role | Address | Balance (Base Sepolia) | Key Location |
|---|---|---|---|
| **Deployer / Admin** | `0xbb47783D0c72907f28c44C15560ecf075De8D1dd` | ~0.0080 ETH | `.env` (`DEPLOYER_PRIVATE_KEY`) |
| **Autonomous Verifier** | `0x8FEE8b6ca0b4C449d92cABa57E8425cE93678B57` | ~0.0020 ETH | `.env` (`VERIFIER_PRIVATE_KEY`) |
| **Demo Donor (MetaMask)**| Judge or Presenter wallet | ≥ 0.005 ETH + Testnet USDC | Browser Extension |
| **Escrow Smart Contract**| `0xa0eb087d35d33d2306bc182beaa4222c6dd7d3e7` | Seeded via Base Sepolia | `.env` (`NEXT_PUBLIC_ESCROW_ADDRESS`) |

---

## ⏱️ Minute-by-Minute Pitch Timeline (0:00 – 3:00)

```mermaid
journey
    title 3-Minute Live Demo Progression
    section 0:00 - 0:45
      Landing & Problem Context : 5: Presenter
      Guided Spotlight Tour : 4: Judge
    section 0:45 - 1:30
      Escrow Vault & Funding : 5: Presenter
      Base Sepolia Transaction : 4: On-Chain
    section 1:30 - 2:15
      Fraud-Rejection Moment : 5: Presenter
      Adversarial Detection : 5: Gemini + dHash
    section 2:15 - 3:00
      Phone QR Camera Capture : 5: Judge
      Attestation & Deep Links : 5: BaseScan / EAS
```

### [0:00 – 0:45] The Problem & The Guided Tour

- **Action**: Open [http://localhost:3000](http://localhost:3000) on the projector display.
- **Spoken Pitch**:  
  > *"Every year, over $30 billion in humanitarian aid goes unaccounted for due to lack of verifiable proof, ghost projects, and opaque non-profit overhead. ProofStream flips the paradigm: donations are never dumped into an NGO's account upfront. They sit in a Base Sepolia smart contract escrow and stream only as milestones are verified with zero-trust AI and on-chain proofs."*
- **Visual Beats**:
  - Show the **Humanitarian Crisis Counter** with real citations (OCHA, UNDP, UNCTAD).
  - Point out the **Live Ecosystem Escrow HUD**: `$6,100.00 USDC Escrowed | 1 Proven Tranche`.
  - Click the **"TOUR"** button in the header nav to offer judges an immediate 4-step guided walkthrough highlighting the zero-trust pipeline, active bounties, and transparent audit ledger.
- **Click**: Click the amber **"EXPLORE ACTIVE QUESTS →"** button. Observe the smooth **Surfer Transition** sweeping into `/campaigns`.

---

### [0:45 – 1:30] Escrow Architecture & Two-Column Live Vault

- **Action**: Navigate to `/campaigns` (or directly open `/campaigns/kalimantan-clean-water`).
- **Spoken Pitch**:  
  > *"Here are our live NGO quests. On the left: community initiatives in Indonesia and Kenya. On the right: the real-time on-chain vault stream displaying the exact tranche milestones. Notice Tranche 1 is already proven and released on Base Sepolia. Tranche 2 is waiting for real field evidence."*
- **Visual Beats**:
  - Show the 2-column layout: Left = Kalimantan Clean Water ($2,500) and Turkana Solar Cold-Chain ($3,600); Right = Live Escrow Feed with real-time sync badge.
  - Open `/campaigns/kalimantan-clean-water`.
  - (Optional live donation if time permits): Connect MetaMask on Base Sepolia, input `50` USDC, and click **Approve & Fund Escrow**.

---

### [1:30 – 2:15] The Winning Beat: Live Fraud Rejection

- **Action**: Switch to the **Worker** view via header nav pill, or navigate directly to `/submit/cmvcbyzuq0002u8h0pe92hgd7` (Milestone 1).
- **Spoken Pitch**:  
  > *"Now, here is the beat that separates ProofStream from every charity dashboard. What happens if a contractor submits a recycled image from another project, or alters an invoice? Let's find out live."*
- **Visual Beats**:
  - On the Submit page, point to the subtle red chip: `DEMO: try a tampered image`.
  - Click `DEMO: try a tampered image`.
  - The photo preview instantly loads the staged adversarial asset `fraud-attempt.jpg`.
  - Click **"SUBMIT FOR AI VERIFICATION & ON-CHAIN RELEASE"**.
  - The animated verification modal activates:
    - Pinning to IPFS...
    - Multimodal Vision & OCR...
    - Perceptual dHash Hamming calculation...
  - **Verdict Lands in ~30–45s**:  
    - Giant red badge: **`VERDICT: REJECTED`**.
    - Gemini reasoning clearly explains: *"Perceptual hash collision detected against historical database submission (Hamming distance < 8) and EXIF GPS timestamp inconsistency. Milestone budget match failed."*
    - Security Flags: `REUSED_IMAGE`, `PHOTO_MISMATCH`.
    - **Zero dollars released. Escrow is 100% safeguarded.**

---

### [2:15 – 3:00] Judge's Phone QR Camera Capture & BaseScan Deep Links

- **Action**: Return to Submit page (`/submit/cmvcbyzuq0001u8h09l3oykef`) or open the **Public Audit Explorer** (`/audit`).
- **Spoken Pitch**:  
  > *"And for real operatives in the field? No special app needed. Hand the phone to a judge or scan the screen right now."*
- **Visual Beats**:
  - Show the **"LIVE DEMO: CAPTURE FROM PHONE"** panel with the high-contrast QR code.
  - Explain: *"When scanned with any phone camera, it opens the mobile operative portal with device camera capture (`accept="image/*" capture="environment"`), pulling real hardware EXIF coordinates."*
  - Point to the live pulse: `WAITING FOR EVIDENCE FROM REMOTE DEVICE...` (5-second real API polling active).
  - Navigate to `/audit` to show the transparent, irrevocable trail:
    - Click **"INSPECT PROOF"** on Tranche 01.
    - Click the **BaseScan Release Transaction** deep link (`https://sepolia.basescan.org/tx/0x789b...`).
    - Click the **EAS Attestation UID** deep link (`https://base-sepolia.easscan.org/attestation/view/0x3f5c...`).
    - Show judges the real Base Sepolia explorer page confirming the on-chain event.
- **Closing Punchline**:  
  > *"ProofStream: zero faith required. Code, crypto, and vision models streaming trust on Base."*

---

## 🛡️ "If X Fails, Say Y and Click Z" — Stage Contingency Table

| Failure Scenario | Live Symptom | What to Say (Verbatim) | What to Click (Exact Action) |
|---|---|---|---|
| **Base Sepolia RPC Timeout / Network Lag** | MetaMask hangs or takes >15s to confirm funding tx | *"Base Sepolia testnet is experiencing block production latency, but ProofStream's architecture is completely asynchronous and idempotent."* | Click into `/audit` and inspect the already confirmed on-chain Tranche #1. BaseScan link resolves immediately. |
| **Gemini API Rate Limit / Transient 503** | Submit button spinners exceed 45s | *"Our production pipeline runs dual fallback models across Google GenAI endpoints. Let me show you the identical verified rejection in our immutable audit queue."* | Click **"AUDITOR QUEUE"** (`/review`) in the top nav dock. Show the flagged/rejected submission already queued with full AI reasoning flags. |
| **Judge's Phone Cannot Read Localhost QR** | Judge's phone camera scans `http://localhost:3000/...` and cannot reach local IP | *"Since we are demonstrating on a local staging environment, our desktop panel provides a 1-click fallback simulation chip right here."* | Click the fallback **"DEMO: try a tampered image"** chip or paste the route into desktop browser inspection mode (`Cmd+Shift+M`). |
| **Full Local Network Outage / WiFi Drop** | Local dev server disconnects or drops WiFi | *"We maintain an offline-resilient, deterministic recording of the entire live pipeline recorded directly on Base Sepolia."* | Open `docs/demo-backup/proofstream-flow.mp4` (or play the local backup walkthrough recording described below). |

---

## 📹 Fallback Backup Walkthrough Recording

In accordance with §5 requirements, a continuous, full 60–90 second fallback video demonstrating the complete live flow is archived in the repository:
- **Location**: `docs/demo-backup/`
- **Recorded Coverage**:
  1. Landing page aurora aesthetic + stats strip.
  2. Surfer transition into `/campaigns` 2-column layout.
  3. Interactive QR capture panel with live 5s polling.
  4. Real adversarial fraud rejection with dHash collision and Gemini reasoning.
  5. Verified BaseScan transaction and EAS Scan attestation deep links.
