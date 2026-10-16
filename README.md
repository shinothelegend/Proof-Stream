# ProofStream — Verifiable Autonomous Streaming Aid Protocol

> **Web3 for Social Good Hackathon 2026**  
> Built for **Base Sepolia (Chain ID: 84532)**  
> Verifiable, zero-trust humanitarian aid streaming through smart contract escrows, multimodal AI audits, and Ethereum Attestation Service (EAS) records.

---

## 🌟 Overview

ProofStream transforms traditional charity funding from opaque lump-sum transfers into **impact-gated streaming escrows**. Donors deposit official testnet USDC directly into `CampaignEscrow.sol`. Funds sit locked in milestone tranches and are released to verified frontline NGO wallets **only when field workers submit verifiable geotagged field photos and supplier receipts** audited by a multimodal AI verification agent.

Every verification decision is written permanently on-chain as a cryptographic attestation on Base Sepolia, allowing anyone in the world to audit humanitarian impact without login or intermediaries.

---

## ⚡ 60-Second Quick Start

### 1. Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- Git
- Foundry (`forge`) for smart contract test execution

### 2. Installation & Setup
```bash
# 1. Clone & install dependencies
git clone https://github.com/proofstream/proofstream.git
cd proofstream
npm install --legacy-peer-deps

# 2. Configure environment
cp .env.example .env

# 3. Synchronize database & seed realistic demo campaign
npx prisma db push
npx tsx prisma/seed.ts

# 4. Run Foundry test suite (all 5 tests passing)
forge test -vvv

# 5. Launch development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔗 Official Smart Contract & Network Addresses

- **Network**: Base Sepolia (`84532`)
- **RPC URL**: `https://sepolia.base.org`
- **Block Explorer**: `https://sepolia.basescan.org`
- **Official Circle USDC**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **EAS Contract**: `0x4200000000000000000000000000000000000021` (Canonical OP-Stack Predeploy)
- **EAS Schema Registry**: `0x4200000000000000000000000000000000000020` (Canonical OP-Stack Predeploy)
- **CampaignEscrow Contract**: `contracts/src/CampaignEscrow.sol`
- **Circle USDC Faucet**: [Circle Faucet](https://faucet.circle.com) / [Alchemy Base Sepolia](https://www.alchemy.com/faucets/base-sepolia)

---

## 🎨 Design System: "Ember & Paper" (v3)

- **Typography**: Space Grotesk (Hero & Titles 56–72px / 36–42px), Inter (Descriptions & Body, min 14px), JetBrains Mono (Numbers, USDC, and on-chain hashes). Zero pixelated fonts for human-readable content.
- **Palette**: Neutral-first (~90% neutrals) with single hero amber accent (`#FFB454` dark, `#B36612` light). Zero cyan. Semantic badges only for status (`#6FCF8E` success, `#F0787E` alert).
- **Retro-Modern Surfaces**: 10px rounded panels with 1px hairline border, soft shadows, and 8px top-right chamfered signature corner (`card-chamfer`).
- **Button System**: 4 state morphs (loading spinner, success checkmark, error shake, disabled with tooltip) and retuned magnetic snap cursor (24px radius, 4px lean).
- **Brand Identity**: 28x28 inline SVG brand mark (amber coin with wave) + Space Grotesk wordmark across HUD, landing nav, audit explorer, and favicon (`app/icon.svg`).

---

## 🛡️ Anti-Slop & Real-Data Constitution

ProofStream adheres to a strict zero-tolerance policy against fake numbers and UI shortcuts:
1. **Zero Mock Data**: All numbers in the UI are read from on-chain smart contracts or the seeded relational database ($2,500 total campaign goal; $1,200 / $800 / $500 milestone tranches).
2. **Real AI Multimodal Verification**: The verification pipeline executes actual Google Gemini calls to extract receipt totals via OCR and evaluate scene authenticity against GPS fences.
3. **Real Image Reuse Fraud Detection**: A 64-bit gradient difference hash (`dHash`) calculates Hamming distance against historical submissions. Submissions with distance $< 8$ are automatically rejected for fraud.
4. **Foundry Test Verification**: All 5 contract tests in `CampaignEscrow.t.sol` execute and pass with 0 failures under `forge test -vvv`.
5. **Isolated Key Management**: `VERIFIER_PRIVATE_KEY` exists exclusively in backend memory and is never bundled in client code.

---

## 📊 Real-World Humanitarian Data Sources

- **4.5% direct aid reaching local NGOs**: OCHA/FTS via Défis Humanitaires, 2024.
- **$3.7B annual procurement fraud loss**: UN Global Compact / UNDP Transparency Studies.
- **30-day average emergency cash delay**: UNCTAD & World Bank Disaster Financing Reports.
