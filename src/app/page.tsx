"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Globe2,
  Cpu,
  FileCheck2,
  Sparkles,
} from "lucide-react";
import { Typewriter } from "@/components/pixel/Typewriter";
import { Accent } from "@/components/ui/Accent";
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
import { BrandLogo } from "@/components/brand/BrandLogo";
import { BRAND } from "@/lib/brand";
import { formatUSDC } from "@/lib/format";
import { useTour } from "@/components/tour/SpotlightTour";

export default function LandingPage() {
  const { startTour } = useTour();
  const [triggerSurfer, setTriggerSurfer] = useState(false);
  const [stats, setStats] = useState<{
    totalEscrowed: number;
    totalReleased: number;
    totalVerdicts: number;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);
  const [featuredCampaign, setFeaturedCampaign] = useState<{
    id: string;
    title: string;
    siteAddress: string;
    escrowBalance: number;
    goal: number;
    story: string;
  } | null>(null);

  const fetchCampaigns = () => {
    setStatsLoading(true);
    setStatsError(false);
    fetch("/api/campaigns")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch campaigns");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.stats) {
          setStats({
            totalEscrowed: data.stats.totalEscrowedUSDC ?? 0,
            totalReleased: data.stats.totalReleasedUSDC ?? 0,
            totalVerdicts: data.stats.releasedTranchesCount ?? 0,
          });
        }
        if (data.success && data.data && data.data.length > 0) {
          const camp = data.data[0];
          setFeaturedCampaign({
            id: camp.id,
            title: camp.title,
            siteAddress: camp.siteAddress,
            escrowBalance: camp.escrowBalance ?? 0,
            goal: camp.goal ?? 0,
            story: camp.story,
          });
        }
        setStatsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading stats and campaigns:", err);
        setStatsError(true);
        setStatsLoading(false);
      });
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleGetStarted = () => {
    setTriggerSurfer(true);
  };

  return (
    <div className="min-h-screen text-pix-ink bg-pix-bg font-sans selection:bg-pix-accent selection:text-[var(--color-accent-fg)]">
      {/* Surfer Transition (§6.4) */}
      <SurferTransition trigger={triggerSurfer} onComplete={() => setTriggerSurfer(false)} />

      {/* Top Header with Brand Logo (§6.2) */}
      <header className="sticky top-0 z-40 w-full bg-pix-panel/90 backdrop-blur-md border-b border-[var(--color-pix-hairline)] shadow-panel">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <BrandLogo size={28} showWordmark={true} />
          </Link>

          {/* Navigation Links (Inter 13px uppercase) */}
          <nav className="hidden md:flex items-center space-x-8 text-[13px] font-sans font-semibold uppercase tracking-wider text-pix-dim">
            <a href="#how-it-works" data-snap className="hover:text-pix-accent transition-colors">
              How It Works
            </a>
            <a href="#tech-stack" data-snap className="hover:text-pix-accent transition-colors">
              Architecture
            </a>
            <a href="#impact" data-snap className="hover:text-pix-accent transition-colors">
              Impact
            </a>
            <Link href="/docs" data-snap className="hover:text-pix-accent transition-colors">
              Docs
            </Link>
            <Link href="/audit" data-snap className="hover:text-pix-accent text-pix-accent transition-colors font-bold">
              Public Audit
            </Link>
          </nav>

          {/* Right Actions: Theme Toggle & Launch App */}
          <div className="flex items-center space-x-3">
            <PixelDissolve />

            <SnapButton onClick={handleGetStarted} variant="primary" size="sm">
              <span>LAUNCH APP</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </SnapButton>
          </div>
        </div>
      </header>

      {/* Main Content Landmark */}
      <main className="flex-1">
        {/* 1. Hero Section (§6.3) */}
        <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 max-w-5xl mx-auto px-5 sm:px-6 text-center space-y-8 overflow-hidden">
          {/* Pixel Wave Motif SVG scene decoration behind/below headline (blurred 0%, opacity 60%) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[720px] max-w-full opacity-60 pointer-events-none select-none">
            <svg viewBox="0 0 400 120" className="w-full h-auto" shapeRendering="crispEdges">
              <path
                d="M0 80 Q50 60 100 80 T200 80 T300 80 T400 80 L400 120 L0 120 Z"
                fill="var(--color-pix-panel)"
              />
              <path
                d="M0 92 Q50 72 100 92 T200 92 T300 92 T400 92"
                stroke="var(--color-pix-accent)"
                strokeWidth="2"
                fill="none"
                opacity="0.35"
              />
              <circle cx="200" cy="40" r="14" fill="var(--color-pix-accent)" opacity="0.15" />
            </svg>
          </div>

          {/* Network Chip */}
          <div className="flex justify-center mb-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-pix-panel border border-[var(--color-pix-hairline)] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-pix-accent animate-pulse" />
              <span className="text-[13px] font-sans font-semibold uppercase tracking-widest text-pix-accent">
                Base Sepolia · Verifiable Escrow
              </span>
            </div>
          </div>

          {/* Typewriter H1: 56-72px Space Grotesk */}
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-[68px] text-pix-ink tracking-tight leading-[1.15] max-w-4xl mx-auto">
            <Typewriter text="Trust is earned in blocks." highlightWord="blocks" speed={45} />
          </h1>

          {/* Subtitle: 17px Inter */}
          <p className="text-[17px] text-pix-dim max-w-2xl mx-auto font-sans leading-relaxed">
            Donors stream stablecoins to frontline NGOs into smart contract escrows.
            Funds release automatically only when multimodal AI proves geotagged field
            evidence and logs public on-chain attestations.
          </p>

          {/* CTAs */}
          <div data-tour="hero-escrow" className="pt-4 flex flex-col items-center justify-center gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <SnapButton onClick={handleGetStarted} variant="primary" size="lg" className="w-full sm:w-auto">
                <span>EXPLORE ACTIVE CAMPAIGNS</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </SnapButton>

              <SnapButton href="/audit" variant="secondary" size="lg" className="w-full sm:w-auto">
                <span>VIEW LIVE AUDIT TRAIL</span>
              </SnapButton>
            </div>

            <SnapButton
              onClick={() => startTour(1)}
              variant="ghost"
              size="sm"
              className="mt-1 text-pix-dim hover:text-pix-accent transition-colors"
            >
              <Sparkles className="w-4 h-4 mr-2 text-pix-accent" />
              <span>TEST IT YOURSELF (GUIDED TOUR)</span>
            </SnapButton>
          </div>
        </section>

        {/* Hairline Divider */}
        <div className="w-full h-px bg-[var(--color-pix-hairline)]" />

        {/* 2. Live Stats Strip */}
        <section className="py-12 bg-pix-panel border-y border-[var(--color-pix-hairline)]">
          <div className="max-w-7xl mx-auto px-5 sm:px-6">
            {statsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="p-4 rounded-[10px] bg-pix-bg/60 border border-[var(--color-pix-hairline)] animate-pulse flex items-center space-x-3 h-20"
                  >
                    <div className="w-9 h-9 rounded-[8px] bg-white/5 flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-white/10 rounded w-24" />
                      <div className="h-5 bg-white/10 rounded w-32" />
                    </div>
                  </div>
                ))}
              </div>
            ) : statsError || !stats ? (
              <div className="flex items-center justify-center p-4 rounded-[10px] bg-pix-bg border border-[var(--color-alert)]/30 text-pix-alert text-sm space-x-3">
                <span>Live on-chain stats temporarily unavailable.</span>
                <button
                  onClick={fetchCampaigns}
                  className="px-3 py-1 text-xs font-mono uppercase bg-pix-panel hover:bg-pix-alert/20 border border-[var(--color-alert)]/50 rounded cursor-pointer transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatChip
                  label="TOTAL ESCROWED"
                  value={formatUSDC(stats.totalEscrowed)}
                  subValue="USDC ON BASE"
                  icon={<PixelChest />}
                />
                <StatChip
                  label="TRANCHES PROVEN"
                  value={`${stats.totalVerdicts} RELEASED`}
                  subValue="EAS ATTESTED"
                  icon={<PixelShield />}
                />
                <StatChip
                  label="SETTLEMENT CHAIN"
                  value="BASE SEPOLIA"
                  subValue="CHAIN ID 84532"
                  icon={<PixelScroll />}
                />
              </div>
            )}
          </div>
        </section>

        {/* 3. HOW IT WORKS — 4 Deterministic Steps (§6.5: 24px section gaps) */}
        <section id="how-it-works" className="py-16 max-w-7xl mx-auto px-5 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <span className="text-[13px] font-sans font-semibold uppercase text-pix-accent tracking-widest block">
              EXECUTION PIPELINE
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-pix-ink">
              How ProofStream <Accent>streams</Accent> aid
            </h2>
            <p className="text-[15px] text-pix-dim font-sans max-w-xl mx-auto">
              Four deterministic steps. Zero human gatekeepers. 100% cryptographic consensus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] p-6 space-y-4 shadow-card hover:border-[var(--color-pix-accent)]/40 transition-colors">
              <div className="w-10 h-10 rounded-[8px] bg-pix-accent/15 flex items-center justify-center text-pix-accent border border-pix-accent/30">
                <Lock className="w-5 h-5" />
              </div>
              <div className="text-[13px] font-mono text-pix-accent font-semibold uppercase tracking-wider">STEP 01</div>
              <h3 className="font-display font-semibold text-lg text-pix-ink">Tranche Escrow</h3>
              <p className="text-base text-pix-dim leading-relaxed font-sans">
                Donors fund campaigns in USDC. Capital sits locked in <code className="text-xs bg-pix-bg px-1.5 py-0.5 rounded text-pix-accent font-mono">CampaignEscrow.sol</code>, partitioned into milestone tranches.
              </p>
            </div>

            {/* Step 2 */}
            <div className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] p-6 space-y-4 shadow-card hover:border-[var(--color-pix-accent)]/40 transition-colors">
              <div className="w-10 h-10 rounded-[8px] bg-pix-accent/15 flex items-center justify-center text-pix-accent border border-pix-accent/30">
                <PixelCamera className="w-5 h-5" />
              </div>
              <div className="text-[13px] font-mono text-pix-accent font-semibold uppercase tracking-wider">STEP 02</div>
              <h3 className="font-display font-semibold text-lg text-pix-ink">Field Evidence</h3>
              <p className="text-base text-pix-dim leading-relaxed font-sans">
                Workers capture geotagged photos and supplier invoices in the field. Files are pinned cryptographically to IPFS via Pinata.
              </p>
            </div>

            {/* Step 3 */}
            <div className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] p-6 space-y-4 shadow-card hover:border-[var(--color-pix-accent)]/40 transition-colors">
              <div className="w-10 h-10 rounded-[8px] bg-pix-accent/15 flex items-center justify-center text-pix-accent border border-pix-accent/30">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="text-[13px] font-mono text-pix-accent font-semibold uppercase tracking-wider">STEP 03</div>
              <h3 className="font-display font-semibold text-lg text-pix-ink">AI Audit Gate</h3>
              <p className="text-base text-pix-dim leading-relaxed font-sans">
                Multimodal Gemini Flash validates scene content, runs invoice OCR, verifies GPS fences, and rejects duplicate dHashes.
              </p>
            </div>

            {/* Step 4 */}
            <div className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] p-6 space-y-4 shadow-card hover:border-[var(--color-pix-accent)]/40 transition-colors">
              <div className="w-10 h-10 rounded-[8px] bg-pix-accent/15 flex items-center justify-center text-pix-accent border border-pix-accent/30">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div className="text-[13px] font-mono text-pix-accent font-semibold uppercase tracking-wider">STEP 04</div>
              <h3 className="font-display font-semibold text-lg text-pix-ink">On-Chain Release</h3>
              <p className="text-base text-pix-dim leading-relaxed font-sans">
                Verified audits issue EAS attestations and release USDC directly to the verified frontline NGO wallet.
              </p>
            </div>
          </div>
        </section>

        {/* Hairline Divider */}
        <div className="w-full h-px bg-[var(--color-pix-hairline)]" />

        {/* 4. WHAT POWERS PROOFSTREAM — Tech Architecture */}
        <section id="tech-stack" className="py-16 bg-pix-panel">
          <div className="max-w-7xl mx-auto px-5 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
              <span className="text-[13px] font-sans font-semibold uppercase text-pix-accent tracking-widest block">
                PRODUCTION STACK
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-pix-ink">
                What <Accent>powers</Accent> ProofStream
              </h2>
              <p className="text-[15px] text-pix-dim font-sans max-w-xl mx-auto">
                Engineered with production-grade protocols. Every layer independently auditable.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Base Sepolia",
                  role: "EVM Settlement",
                  desc: "Sub-cent gas fees, native Circle USDC faucet, and instant transaction finality on Chain 84532.",
                },
                {
                  name: "Solidity / Foundry",
                  role: "CampaignEscrow.sol",
                  desc: "Milestone-tranche escrow with AccessControl, verifier isolation, and time-locked refund safety.",
                },
                {
                  name: "EAS Attestations",
                  role: "Public Audit Trail",
                  desc: "Ethereum Attestation Service logs immutable proof hashes and decision records permanently on-chain.",
                },
                {
                  name: "Gemini Flash 2.5",
                  role: "Multimodal AI Agent",
                  desc: "High-accuracy visual verification, supplier receipt OCR, and line-item budget validation.",
                },
                {
                  name: "Pinata IPFS",
                  role: "Decentralized Storage",
                  desc: "Cryptographic content pinning ensuring immutable evidence storage with no single point of failure.",
                },
                {
                  name: "Perceptual dHash",
                  role: "Image Fraud Defense",
                  desc: "64-bit gradient hashing detects reused or cropped evidence via Hamming distance < 8 comparisons.",
                },
                {
                  name: "Wagmi & Viem",
                  role: "Web3 Client Pipeline",
                  desc: "Strict type-safe wallet connection supporting MetaMask, Coinbase Wallet, and Rainbow.",
                },
                {
                  name: "Next.js 15 + Prisma",
                  role: "Full-Stack App Router",
                  desc: "Fast client hydration, server-side signer isolation, and SQLite/Postgres schema parity.",
                },
              ].map((cart, idx) => (
                <div
                  key={idx}
                  className="rounded-[10px] bg-pix-bg border border-[var(--color-pix-hairline)] p-5 shadow-card space-y-2 hover:border-[var(--color-pix-accent)]/30 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <PixelCartridge />
                    <span className="font-display font-semibold text-sm text-pix-ink">{cart.name}</span>
                  </div>
                  <div className="text-[13px] font-mono text-pix-accent font-medium uppercase tracking-wider">{cart.role}</div>
                  <p className="text-[15px] text-pix-dim leading-relaxed font-sans">{cart.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hairline Divider */}
        <div className="w-full h-px bg-[var(--color-pix-hairline)]" />

        {/* 5. IMPACT DATA STRIP — Real statistics */}
        <section id="impact" className="py-16 max-w-7xl mx-auto px-5 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <span className="text-[13px] font-sans font-semibold uppercase text-pix-alert tracking-widest block">
              THE ACCOUNTABILITY GAP
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-pix-ink">
              Why proof-of-<Accent>impact</Accent> is mandatory
            </h2>
            <p className="text-[15px] text-pix-dim font-sans max-w-xl mx-auto">
              Uncontested humanitarian funding statistics from OCHA, UNDP, and UNCTAD.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {BRAND.impactStats.map((item, idx) => (
              <div key={idx} className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] p-6 space-y-4 shadow-card">
                <div className="flex justify-between items-baseline">
                  <span className="font-sans font-semibold text-[15px] text-pix-ink">
                    {item.label}
                  </span>
                  <span className="font-mono font-medium text-2xl text-pix-accent">
                    {item.metric}
                  </span>
                </div>

                <PixelProgress
                  current={item.barPercent || 75}
                  total={100}
                  variant="gold"
                  height={10}
                />

                <p className="text-[15px] text-pix-dim leading-relaxed font-sans">{item.description}</p>
                <div className="text-[13px] font-mono text-pix-dim italic">Source: {item.source}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Hairline Divider */}
        <div className="w-full h-px bg-[var(--color-pix-hairline)]" />

        {/* 6. FEATURED CAMPAIGN CARTRIDGE (§6.1: banner >= 280px tall) */}
        <section className="py-16 bg-pix-panel">
          <div className="max-w-4xl mx-auto px-5 sm:px-6">
            {statsLoading ? (
              <div className="rounded-[10px] card-chamfer bg-pix-bg border border-[var(--color-pix-hairline)] p-6 sm:p-8 space-y-6 shadow-panel animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-6 w-32 bg-white/10 rounded" />
                  <div className="h-4 w-40 bg-white/10 rounded" />
                </div>
                <div className="h-72 sm:h-80 bg-white/5 rounded-[6px]" />
                <div className="space-y-3 pt-2">
                  <div className="h-7 bg-white/10 rounded w-3/4" />
                  <div className="h-4 bg-white/10 rounded w-full" />
                  <div className="h-4 bg-white/10 rounded w-2/3" />
                </div>
                <div className="h-3 bg-white/10 rounded w-full" />
                <div className="pt-4 flex items-center justify-between border-t border-[var(--color-pix-hairline)]">
                  <div className="h-5 bg-white/10 rounded w-48" />
                  <div className="h-10 bg-white/10 rounded w-44" />
                </div>
              </div>
            ) : statsError || !featuredCampaign ? (
              <div className="flex items-center justify-center p-6 rounded-[10px] bg-pix-bg border border-[var(--color-alert)]/30 text-pix-alert text-sm space-x-3">
                <span>Featured campaign data temporarily unavailable.</span>
                <button
                  onClick={fetchCampaigns}
                  className="px-3 py-1 text-xs font-mono uppercase bg-pix-panel hover:bg-pix-alert/20 border border-[var(--color-alert)]/50 rounded cursor-pointer transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="rounded-[10px] card-chamfer bg-pix-bg border border-[var(--color-pix-hairline)] p-6 sm:p-8 space-y-6 shadow-panel">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[13px] font-mono font-semibold px-3 py-1 rounded-[6px] bg-pix-panel border border-[var(--color-pix-accent)]/40 text-pix-accent">
                    ACTIVE CAMPAIGN
                  </span>
                  <span className="text-[13px] font-mono text-pix-dim">
                    {featuredCampaign.siteAddress}
                  </span>
                </div>

                {/* Procedural Banner: >= 280px tall canvas with title overlay (§6.1) */}
                <PixelBanner
                  seed={featuredCampaign.id}
                  title={featuredCampaign.title}
                  className="h-72 sm:h-80"
                />

                <div className="space-y-3 pt-2">
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-pix-ink">
                    {featuredCampaign.title}
                  </h3>
                  <p className="text-[15px] text-pix-dim leading-relaxed font-sans line-clamp-3">
                    {featuredCampaign.story}
                  </p>
                </div>

                {/* Funding Progress */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-[13px]">
                    <span className="text-pix-dim font-sans uppercase tracking-wider font-semibold">Escrowed</span>
                    <span className="text-pix-accent font-mono font-medium">
                      {formatUSDC(featuredCampaign.escrowBalance)} / {formatUSDC(featuredCampaign.goal)}
                    </span>
                  </div>
                  <PixelProgress
                    current={featuredCampaign.escrowBalance}
                    total={featuredCampaign.goal}
                    variant="gold"
                    height={12}
                  />
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--color-pix-hairline)]">
                  <span className="font-mono text-[15px] text-pix-accent font-medium">
                    {featuredCampaign.goal > 0
                      ? `${Math.round((featuredCampaign.escrowBalance / featuredCampaign.goal) * 100)}% ESCROWED (${formatUSDC(featuredCampaign.escrowBalance)})`
                      : `0% ESCROWED (${formatUSDC(featuredCampaign.escrowBalance)})`}
                  </span>

                  <SnapButton
                    href={`/campaigns/${featuredCampaign.id}`}
                    variant="primary"
                    size="md"
                  >
                    <span>VIEW CAMPAIGN DETAILS</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </SnapButton>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-pix-hairline)] py-12 bg-pix-bg text-center text-sm text-pix-dim">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <BrandLogo size={24} showWordmark={true} />
            <span className="text-pix-hairline">|</span>
            <span className="text-xs text-pix-dim">{BRAND.hackathon}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[13px] font-sans font-semibold uppercase tracking-wider text-pix-dim">
            <Link href="/campaigns" className="hover:text-pix-accent transition-colors">
              Campaigns
            </Link>
            <Link href="/docs" className="hover:text-pix-accent transition-colors">
              Docs
            </Link>
            <Link href="/audit" className="hover:text-pix-accent text-pix-accent transition-colors">
              Audit
            </Link>
            <a href={BRAND.links.baseScan} target="_blank" rel="noopener noreferrer" className="hover:text-pix-accent transition-colors">
              BaseScan
            </a>
            <a href={BRAND.links.github} target="_blank" rel="noopener noreferrer" className="hover:text-pix-accent transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
