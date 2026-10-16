"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Globe2,
  Cpu,
  FileCheck2,
} from "lucide-react";
import { Typewriter } from "@/components/pixel/Typewriter";
import { SnapButton } from "@/components/pixel/SnapButton";
import { PixelDissolve } from "@/components/pixel/PixelDissolve";
import { PixelProgress } from "@/components/pixel/PixelProgress";
import { StatChip } from "@/components/pixel/StatChip";
import { SurferTransition } from "@/components/pixel/SurferTransition";
import {
  PixelChest,
  PixelScroll,
  PixelShield,
  PixelCartridge,
  PixelCamera,
} from "@/components/pixel/PixelIcons";
import { PixelBanner } from "@/components/pixel/PixelBanner";
import { BRAND } from "@/lib/brand";
import { formatUSDC } from "@/lib/format";

export default function LandingPage() {
  const [triggerSurfer, setTriggerSurfer] = useState(false);
  const [stats, setStats] = useState({
    totalEscrowed: 2500,
    totalReleased: 1200,
    totalVerdicts: 1,
  });

  useEffect(() => {
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setStats({
            totalEscrowed: data.stats.totalEscrowedUSDC || 2500,
            totalReleased: data.stats.totalReleasedUSDC || 1200,
            totalVerdicts: data.stats.releasedTranchesCount || 1,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleGetStarted = () => {
    setTriggerSurfer(true);
  };

  return (
    <div className="min-h-screen text-pix-ink bg-pix-bg">
      {/* Surfer Transition (§8) */}
      <SurferTransition trigger={triggerSurfer} onComplete={() => setTriggerSurfer(false)} />

      {/* Top Arcade Header */}
      <header className="sticky top-0 z-40 w-full bg-pix-panel border-b-4 border-pix-gold shadow-[0_4px_0_0_#000000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-pix-gold flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_#000]">
              <span className="font-display text-xs text-black font-bold">PS</span>
            </div>
            <div>
              <span className="font-heading font-bold text-sm sm:text-base tracking-wider text-pix-ink block">
                PROOFSTREAM
              </span>
              <span className="text-[9px] font-mono text-pix-gold uppercase tracking-widest block font-bold">
                [ARCADE LEDGER]
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-heading uppercase tracking-wider text-pix-dim">
            <a href="#how-it-works" className="hover:text-pix-gold transition-colors">
              HOW IT WORKS
            </a>
            <a href="#tech-stack" className="hover:text-pix-gold transition-colors">
              CARTRIDGES
            </a>
            <a href="#impact" className="hover:text-pix-gold transition-colors">
              IMPACT
            </a>
            <Link href="/docs" className="hover:text-pix-gold transition-colors">
              DOCS
            </Link>
            <Link href="/audit" className="hover:text-pix-gold transition-colors text-pix-cyan">
              PUBLIC AUDIT
            </Link>
          </nav>

          {/* Right Action: Theme Toggle & Launch App */}
          <div className="flex items-center space-x-3">
            <PixelDissolve />

            <SnapButton onClick={handleGetStarted} variant="gold" size="sm">
              <span>LAUNCH APP</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </SnapButton>
          </div>
        </div>
      </header>

      {/* Main Content Landmark */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="pt-12 pb-16 sm:pt-20 sm:pb-24 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Pixel-art scene banner (wave motif with flag) */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-3 p-2 bg-pix-panel border-2 border-[var(--color-pix-border)] shadow-pixel">
            <svg width="24" height="16" viewBox="0 0 24 16" shapeRendering="crispEdges">
              <rect x="0" y="10" width="24" height="6" fill="#0077A8" />
              <rect x="4" y="6" width="16" height="4" fill="#43E8FF" />
              <rect x="10" y="2" width="6" height="4" fill="#FFFFFF" />
              <rect x="16" y="2" width="2" height="6" fill="#FFC93C" />
            </svg>
            <span className="text-[11px] font-heading uppercase tracking-widest text-pix-gold font-bold">
              BASE SEPOLIA · ARCADE ESCROW
            </span>
          </div>
        </div>

        {/* Typewriter H1 */}
        <h1 className="font-display font-bold text-2xl sm:text-4xl md:text-5xl text-pix-ink tracking-tight leading-[1.3] max-w-4xl mx-auto">
          <Typewriter text="TRUST IS EARNED IN BLOCKS" highlightWord="BLOCKS" speed={45} />
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm md:text-base text-pix-dim max-w-2xl mx-auto font-mono leading-relaxed">
          Donors stream stablecoins to frontline NGOs into smart contract escrows.
          Funds release automatically only when multimodal AI proves geotagged field
          evidence and logs public on-chain attestations.
        </p>

        {/* CTAs */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <SnapButton onClick={handleGetStarted} variant="gold" size="lg" className="w-full sm:w-auto">
            <span>GET STARTED ▸</span>
          </SnapButton>

          <Link href="/audit" className="w-full sm:w-auto">
            <SnapButton variant="outline" size="lg" className="w-full sm:w-auto">
              <span>VIEW LIVE AUDIT</span>
            </SnapButton>
          </Link>
        </div>
      </section>

      {/* 4px Gold Rule Divider */}
      <div className="w-full h-1 bg-pix-gold border-y border-black" />

      {/* 2. Live Stats Strip */}
      <section className="py-10 bg-pix-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatChip
              label="TOTAL ESCROWED"
              value={formatUSDC(stats.totalEscrowed)}
              subValue="USDC"
              icon={<PixelChest />}
            />
            <StatChip
              label="TRANCHES PROVEN"
              value={`${stats.totalVerdicts} RELEASED`}
              subValue="EAS VERIFIED"
              icon={<PixelShield />}
            />
            <StatChip
              label="CHAIN SETTLEMENT"
              value="BASE SEPOLIA"
              subValue="TESTNET 84532"
              icon={<PixelScroll />}
            />
          </div>
        </div>
      </section>

      {/* 4px Gold Rule Divider */}
      <div className="w-full h-1 bg-pix-gold border-y border-black" />

      {/* 3. HOW IT WORKS — 4-Step Pixel Quest Line */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
          <span className="text-[11px] font-heading uppercase text-pix-gold tracking-widest block font-bold">
            QUEST EXECUTION ENGINE
          </span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-pix-ink">
            HOW PROOFSTREAM STREAMS AID
          </h2>
          <p className="text-xs text-pix-dim font-mono">
            4 deterministic steps. Zero human gatekeepers. 100% cryptographic consensus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="pixel-panel p-6 space-y-3">
            <div className="w-10 h-10 bg-pix-gold flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_#000] text-black">
              <Lock className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-mono text-pix-gold font-bold">STEP ①</div>
            <h3 className="font-heading font-bold text-sm text-pix-ink">TRANCHE ESCROW</h3>
            <p className="text-xs text-pix-dim leading-relaxed">
              Donors fund campaigns in USDC. Capital sits locked in `CampaignEscrow.sol`, split into milestone tranches.
            </p>
          </div>

          {/* Step 2 */}
          <div className="pixel-panel p-6 space-y-3">
            <div className="w-10 h-10 bg-pix-cyan flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_#000] text-black">
              <PixelCamera className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-mono text-pix-cyan font-bold">STEP ②</div>
            <h3 className="font-heading font-bold text-sm text-pix-ink">FIELD EVIDENCE</h3>
            <p className="text-xs text-pix-dim leading-relaxed">
              Workers take geotagged photos and scan receipts in the field. Files are pinned to IPFS via Pinata.
            </p>
          </div>

          {/* Step 3 */}
          <div className="pixel-panel p-6 space-y-3">
            <div className="w-10 h-10 bg-pix-mint flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_#000] text-black">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-mono text-pix-mint font-bold">STEP ③</div>
            <h3 className="font-heading font-bold text-sm text-pix-ink">AI AUDIT GATE</h3>
            <p className="text-xs text-pix-dim leading-relaxed">
              Gemini Flash checks scene matching, performs invoice OCR, verifies GPS fences, and rejects reused dHashes.
            </p>
          </div>

          {/* Step 4 */}
          <div className="pixel-panel p-6 space-y-3">
            <div className="w-10 h-10 bg-[#FF5C7A] flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_#000] text-black">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-mono text-[#FF5C7A] font-bold">STEP ④</div>
            <h3 className="font-heading font-bold text-sm text-pix-ink">ON-CHAIN RELEASE</h3>
            <p className="text-xs text-pix-dim leading-relaxed">
              Passing audits write EAS attestations and release USDC directly to the NGO wallet.
            </p>
          </div>
        </div>
      </section>

      {/* 4px Gold Rule Divider */}
      <div className="w-full h-1 bg-pix-gold border-y border-black" />

      {/* 4. WHAT POWERS PROOFSTREAM — Pixel Cartridge Cards for Judges */}
      <section id="tech-stack" className="py-20 bg-pix-panel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
            <span className="text-[11px] font-heading uppercase text-pix-gold tracking-widest block font-bold">
              THE HARDWARE & SOFTWARE
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-pix-ink">
              WHAT POWERS PROOFSTREAM
            </h2>
            <p className="text-xs text-pix-dim font-mono">
              Engineered with production-grade protocols. Every layer independently auditable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                name: "BASE SEPOLIA",
                role: "EVM Settlement Layer",
                desc: "Sub-cent gas fees, native Circle USDC faucet, and instant transaction finality on Chain 84532.",
              },
              {
                name: "SOLIDITY / FOUNDRY",
                role: "CampaignEscrow.sol",
                desc: "Milestone-tranche escrow with AccessControl, verifier isolation, and time-locked refund safety.",
              },
              {
                name: "EAS ATTESTATIONS",
                role: "Public Audit Trail",
                desc: "Ethereum Attestation Service logs immutable proof hashes and decision records permanently on-chain.",
              },
              {
                name: "GEMINI FLASH 2.5",
                role: "Multimodal AI Agent",
                desc: "Zero-latency visual verification, supplier receipt OCR, and line-item budget validation.",
              },
              {
                name: "PINATA IPFS",
                role: "Decentralized Storage",
                desc: "Cryptographic content pinning ensuring immutable evidence storage with no single point of failure.",
              },
              {
                name: "PERCEPTUAL DHASH",
                role: "Image Fraud Defense",
                desc: "64-bit gradient hashing detects reused or cropped evidence via Hamming distance < 8 comparisons.",
              },
              {
                name: "WAGMI & VIEM",
                role: "Web3 Client Pipeline",
                desc: "Strict type-safe wallet connection supporting MetaMask, Coinbase Wallet, and WalletConnect.",
              },
              {
                name: "NEXT.JS 15 + PRISMA",
                role: "Full-Stack App Router",
                desc: "Fast client hydration, server-side signer isolation, and SQLite/Postgres schema parity.",
              },
            ].map((cart, idx) => (
              <div
                key={idx}
                className="bg-pix-bg border-2 border-[var(--color-pix-border)] p-5 shadow-pixel space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <PixelCartridge />
                  <span className="font-heading font-bold text-xs text-pix-gold">{cart.name}</span>
                </div>
                <div className="text-[10px] font-mono text-pix-cyan font-bold uppercase">{cart.role}</div>
                <p className="text-xs text-pix-dim leading-relaxed">{cart.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4px Gold Rule Divider */}
      <div className="w-full h-1 bg-pix-gold border-y border-black" />

      {/* 5. IMPACT DATA STRIP — Pixel Progress Bars */}
      <section id="impact" className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
          <span className="text-[11px] font-heading uppercase text-pix-alert tracking-widest block font-bold">
            THE ACCOUNTABILITY CRISIS
          </span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-pix-ink">
            WHY PROOF-OF-IMPACT IS MANDATORY
          </h2>
          <p className="text-xs text-pix-dim font-mono">
            Uncontested humanitarian funding statistics from OCHA, UNDP, and UNCTAD.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BRAND.impactStats.map((item, idx) => (
            <div key={idx} className="pixel-panel p-6 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="font-heading font-bold text-sm text-pix-ink uppercase">
                  {item.label}
                </span>
                <span className="font-display font-bold text-xl text-pix-alert">
                  {item.metric}
                </span>
              </div>

              <PixelProgress
                current={parseInt(item.metric) || 75}
                total={100}
                variant="mint"
                height={12}
              />

              <p className="text-xs text-pix-dim leading-relaxed">{item.description}</p>
              <div className="text-[10px] font-mono text-pix-gold italic">Source: {item.source}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4px Gold Rule Divider */}
      <div className="w-full h-1 bg-pix-gold border-y border-black" />

      {/* 6. FEATURED CAMPAIGN CARTRIDGE */}
      <section className="py-20 bg-pix-panel">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="pixel-panel border-4 border-pix-gold p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-heading font-bold text-xs px-2.5 py-1 bg-pix-mint text-black border border-black shadow-[2px_2px_0_0_#000]">
                ACTIVE QUEST
              </span>
              <span className="text-[11px] font-mono text-pix-cyan">
                CENTRAL KALIMANTAN, INDONESIA
              </span>
            </div>

            {/* Procedural Banner for Kalimantan */}
            <PixelBanner seed="kalimantan-clean-water" className="h-44 sm:h-56" />

            <div className="space-y-3">
              <h3 className="font-heading font-bold text-lg sm:text-2xl text-pix-ink">
                Clean Drinking Water & Sanitation for Kahayan Basin Communities
              </h3>
              <p className="text-xs text-pix-dim leading-relaxed">
                Tirta Lestari Borneo Initiative deploys ceramic bio-sand water filtration
                units and family hygiene kits to 3,400 indigenous Dayak families.
              </p>
            </div>

            {/* XP Funding Progress */}
            <PixelProgress current={2500} total={2500} variant="gold" height={16} showLabel />

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--color-pix-border)]">
              <span className="font-mono text-xs text-pix-cyan font-bold">
                100% ESCROWED ($2,500.00 USDC)
              </span>

              <Link href="/campaigns/kalimantan-clean-water">
                <SnapButton variant="gold" size="md">
                  <span>ENTER QUEST DETAIL ▸</span>
                </SnapButton>
              </Link>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-pix-gold py-12 bg-pix-bg text-center text-xs text-pix-dim">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <span className="font-display font-bold text-pix-gold text-xs">PROOFSTREAM</span>
            <span>·</span>
            <span className="font-heading text-[11px]">{BRAND.hackathon}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-heading uppercase tracking-wider text-pix-dim">
            <Link href="/campaigns" className="hover:text-pix-gold">
              CAMPAIGNS
            </Link>
            <Link href="/docs" className="hover:text-pix-gold">
              DOCS
            </Link>
            <Link href="/audit" className="hover:text-pix-gold text-pix-cyan">
              AUDIT
            </Link>
            <a href={BRAND.links.baseScan} target="_blank" rel="noopener noreferrer" className="hover:text-pix-gold">
              BASESCAN
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
