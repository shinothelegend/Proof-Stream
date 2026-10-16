# ProofStream — Impact-Gated Streaming Donations

> **Web3 for Social Good Hackathon 2026 (Tech Track)**  
> Built for **Base Sepolia (Chain ID: 84532)**  
> Verifiable, zero-trust humanitarian aid streaming through smart contract escrows, multimodal AI audits, and Ethereum Attestation Service (EAS) records.

---

## 🌟 Overview

ProofStream transforms traditional charity funding from blind lump-sum transfers into **impact-gated streaming escrows**. Donors deposit official testnet USDC directly into `CampaignEscrow.sol`. Funds sit locked in milestone tranches and are released to verified NGO wallets **only when frontline workers submit verifiable geotagged field photos and supplier receipts** audited by a multimodal AI verification agent.

Every verification decision is written permanently on-chain as a cryptographic attestation, allowing anyone in the world to audit impact without login or intermediaries.

---

## ⚡ 60-Second Quick Start

### 1. Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- Git

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

# 4. Launch development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔗 Official Smart Contract & Network Addresses

- **Network**: Base Sepolia (`84532`)
- **RPC URL**: `https://sepolia.base.org`
- **Block Explorer**: `https://sepolia.basescan.org`
- **Official Circle USDC**: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`
- **EAS Contract**: `0x4200000000000000000000000000000000000021`
- **EAS Schema Registry**: `0x4200000000000000000000000000000000000020`
- **CampaignEscrow**: `contracts/src/CampaignEscrow.sol`
- **Faucet**: [Circle USDC Faucet](https://faucet.circle.com) / [Alchemy Base Sepolia Faucet](https://www.alchemy.com/faucets/base-sepolia)

---

## 🏛️ System Architecture

```
proofstream/
├── contracts/               # Solidity Smart Contracts (Foundry)
│   ├── src/CampaignEscrow.sol
│   ├── src/MockUSDC.sol    # Faucet fallback
│   ├── test/CampaignEscrow.t.sol
│   └── script/Deploy.s.sol
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Imagica AI-inspired Landing
│   │   ├── (marketing)/how-it-works/ # Technical Architecture Walkthrough
│   │   ├── (app)/layout.tsx          # Floating Glass Dock & Role Switcher
│   │   ├── (app)/campaigns/page.tsx  # Dynamic Campaign Dashboard
│   │   ├── (app)/campaigns/[id]/     # Milestone Tranche Pipeline & Fund Flow
│   │   ├── (app)/submit/[milestoneId]/ # Mobile-First Field Worker Portal
│   │   ├── (app)/review/page.tsx     # Auditor Queue & Dispute Window
│   │   └── (app)/audit/page.tsx      # Public On-Chain Audit Explorer
│   ├── components/ui/       # GlassCard, AuroraOrbs, Badge primitives
│   ├── lib/                 # wagmi, eas, pinata, chainsigner, format, brand
│   └── server/              # db, verify agent, perceptual dHash, geofence
├── prisma/schema.prisma     # SQLite (Dev) / Postgres (Prod)
├── RESOURCES.md             # Shared resource tracking
├── DECISIONS.md             # Architecture decisions log
└── DEMO_SCRIPT.md           # Step-by-step judge demonstration guide
```

---

## 🛡️ Anti-Slop & Real-Data Constitution

ProofStream adheres to a strict zero-tolerance policy against fake numbers and UI shortcuts:
1. **Zero Mock Data**: All numbers in the UI are read from on-chain smart contracts or the seeded relational database. No hardcoded `$12,500` strings.
2. **Real AI Multimodal Verification**: The verification pipeline executes actual Google Gemini calls to extract receipt totals via OCR and evaluate scene authenticity.
3. **Real Image Reuse Fraud Detection**: A 64-bit difference hash (`dHash`) calculates Hamming distance against historical submissions. Submissions with distance $< 8$ are automatically rejected for fraud.
4. **Isolated Key Management**: `VERIFIER_PRIVATE_KEY` exists exclusively in backend memory and is never bundled in client code.

---

## 📊 Real-World Humanitarian Data Sources

- **4.5% direct aid reaching local NGOs**: OCHA/FTS via Défis Humanitaires, 2024.
- **1.2% historical low in direct funding**: Development Initiatives / The New Humanitarian.
- **10× lost to corruption vs ODA**: UNDP Global Report on Illicit Financial Flows.
- **$88B+ annual illegal capital flight**: UNCTAD Economic Development in Africa.
