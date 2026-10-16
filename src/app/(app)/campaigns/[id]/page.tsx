"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Lock,
  ArrowRight,
  Sparkles,
  DollarSign,
  FileText,
  UploadCloud,
  Check,
  Coins,
} from "lucide-react";
import { useAccount, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { SnapButton } from "@/components/pixel/SnapButton";
import { PixelProgress } from "@/components/pixel/PixelProgress";
import { Typewriter } from "@/components/pixel/Typewriter";
import { PixelBanner } from "@/components/pixel/PixelBanner";
import { formatUSDC, formatAddress, formatTxHash } from "@/lib/format";
import { OFFICIAL_BASE_SEPOLIA_USDC, ESCROW_ABI, ERC20_ABI } from "@/lib/contracts";
import { BRAND } from "@/lib/brand";

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fundAmount, setFundAmount] = useState<string>("50");
  const [isApproving, setIsApproving] = useState(false);
  const [isFunding, setIsFunding] = useState(false);

  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const fetchCampaign = () => {
    fetch(`/api/campaigns/${campaignId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCampaign(data.data);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

  // Handle Approve USDC on Base Sepolia
  const handleApproveUSDC = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first.");
      return;
    }
    const targetEscrow =
      campaign?.contractAddress ||
      process.env.NEXT_PUBLIC_ESCROW_ADDRESS ||
      "0x0000000000000000000000000000000000000000";
    const usdcAddress =
      (process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`) || OFFICIAL_BASE_SEPOLIA_USDC;

    try {
      setIsApproving(true);
      toast.info("Submitting USDC approve transaction on Base Sepolia...");

      const amountUnits = parseUnits(fundAmount || "50", 6);
      const hash = await writeContractAsync({
        address: usdcAddress,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [targetEscrow as `0x${string}`, amountUnits],
      });

      toast.success(
        <div className="space-y-1 font-body text-xs">
          <p className="font-heading uppercase text-pix-mint">Approval Submitted!</p>
          <a
            href={`https://sepolia.basescan.org/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pix-cyan underline flex items-center space-x-1"
          >
            <span>BaseScan: {formatTxHash(hash)}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      );
    } catch (err: any) {
      console.error(err);
      toast.error(err.shortMessage || err.message || "Approval failed");
    } finally {
      setIsApproving(false);
    }
  };

  // Handle Fund Campaign Escrow
  const handleFundEscrow = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first.");
      return;
    }
    const targetEscrow = campaign?.contractAddress || process.env.NEXT_PUBLIC_ESCROW_ADDRESS;
    if (!targetEscrow) {
      toast.error("Campaign escrow address not yet deployed on Base Sepolia.");
      return;
    }

    try {
      setIsFunding(true);
      toast.info("Submitting fund() transaction to Escrow...");

      const amountUnits = parseUnits(fundAmount || "50", 6);
      const hash = await writeContractAsync({
        address: targetEscrow as `0x${string}`,
        abi: ESCROW_ABI,
        functionName: "fund",
        args: [amountUnits],
      });

      toast.success(
        <div className="space-y-1 font-body text-xs">
          <p className="font-heading uppercase text-pix-mint">Funded on Base Sepolia!</p>
          <a
            href={`https://sepolia.basescan.org/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pix-cyan underline flex items-center space-x-1"
          >
            <span>BaseScan: {formatTxHash(hash)}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      );

      // Record in DB
      await fetch("/api/fund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: campaign.id,
          donorAddress: address,
          amount: parseFloat(fundAmount || "50"),
          txHash: hash,
        }),
      });

      fetchCampaign();
    } catch (err: any) {
      console.error(err);
      toast.error(err.shortMessage || err.message || "Funding failed");
    } finally {
      setIsFunding(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-2/3 bg-pix-panel border-2 border-pix-dim/30 animate-pulse" />
        <div className="h-72 bg-pix-panel border-2 border-pix-dim/30 animate-pulse" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <GlassCard className="p-12 text-center max-w-lg mx-auto">
        <h2 className="font-heading text-lg text-pix-alert uppercase">QUEST NOT FOUND</h2>
        <p className="font-body text-xs text-pix-dim mt-2">The requested campaign ledger record does not exist.</p>
        <div className="mt-6">
          <Link href="/campaigns">
            <SnapButton variant="secondary" size="sm">
              ← Return to Quest Board
            </SnapButton>
          </Link>
        </div>
      </GlassCard>
    );
  }

  const totalFunded = campaign.escrowBalance;
  const progressPercent = Math.min(100, Math.round((totalFunded / campaign.goal) * 100));

  return (
    <div className="space-y-8">
      {/* Campaign Procedural Pixel Banner */}
      <div className="border-4 border-pix-ink/30 shadow-pixel overflow-hidden">
        <PixelBanner slug={campaign.slug || campaign.id} className="h-44 w-full" />
      </div>

      {/* Campaign Header & Hero */}
      <div className="space-y-3">
        <Link
          href="/campaigns"
          className="font-heading text-xs uppercase text-pix-gold hover:text-pix-ink transition-colors inline-flex items-center space-x-1"
        >
          <span>← BACK TO QUEST BOARD</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="verified">OFFICIAL NGO VERIFIED</Badge>
          <span className="text-xs text-pix-cyan font-body flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{campaign.siteAddress}</span>
          </span>
          <span className="text-xs text-pix-dim font-body">
            NGO: <span className="text-pix-cyan">{formatAddress(campaign.ngoAddress)}</span>
          </span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-pix-ink leading-tight">
          <Typewriter text={campaign.title} speed={35} />
        </h1>
        <p className="font-heading text-xs uppercase tracking-wider text-pix-gold">{campaign.ngoName}</p>
      </div>

      {/* Main Grid: Story & Milestone Pipeline vs Funding Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Story & Tranche Pipeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Story Card */}
          <GlassCard className="p-6 md:p-8 space-y-4">
            <h2 className="font-heading text-base sm:text-lg text-pix-ink uppercase tracking-wide border-b-2 border-pix-dim/20 pb-3">
              Frontline Mission & Verification Terms
            </h2>
            <div className="font-body text-xs sm:text-sm text-pix-dim leading-relaxed whitespace-pre-line">
              {campaign.story}
            </div>
          </GlassCard>

          {/* Milestone Tranche Pipeline */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-pix-gold pb-3">
              <div>
                <h2 className="font-heading text-lg sm:text-xl text-pix-ink uppercase tracking-wide">
                  Milestone Tranche Pipeline
                </h2>
                <p className="font-body text-xs text-pix-dim mt-0.5">
                  Funds stream tranche-by-tranche. Released only when field evidence passes Gemini multimodal audit.
                </p>
              </div>

              <Link href={`/submit/${campaign.milestones[1]?.id || campaign.id}`}>
                <SnapButton variant="secondary" size="sm">
                  <UploadCloud className="w-3.5 h-3.5 mr-1 text-pix-gold" />
                  SUBMIT PROOF
                </SnapButton>
              </Link>
            </div>

            <div className="space-y-5">
              {campaign.milestones.map((milestone: any, index: number) => {
                const submission = milestone.submissions?.[0];
                const verdict = submission?.verdict;
                const isReleased = milestone.released;

                return (
                  <GlassCard
                    key={milestone.id}
                    className={`p-6 transition-all ${
                      isReleased ? "border-pix-mint/60 bg-pix-mint/[0.04]" : "border-pix-dim/30"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-heading text-xs uppercase text-pix-gold">
                            TRANCHE 0{index + 1}
                          </span>
                          <span className="text-pix-dim">·</span>
                          <span className="font-body font-bold text-base text-pix-cyan">
                            {formatUSDC(milestone.amount)}
                          </span>
                        </div>

                        <h3 className="font-heading text-sm text-pix-ink leading-snug">
                          {milestone.description}
                        </h3>

                        {/* Budget Breakdown Lines */}
                        {milestone.budgetLines && (
                          <div className="p-3 bg-pix-bg border-2 border-pix-dim/20 text-xs font-body space-y-1 mt-2">
                            <span className="font-heading text-[10px] uppercase text-pix-dim block mb-1">
                              Audited Budget Lines
                            </span>
                            {JSON.parse(milestone.budgetLines).map((line: any, i: number) => (
                              <div key={i} className="flex justify-between text-xs text-pix-dim">
                                <span>{line.item}</span>
                                <span className="font-body text-pix-cyan">${line.total} USDC</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex-shrink-0">
                        {isReleased ? (
                          <Badge variant="released">Tranche Released · 94%</Badge>
                        ) : submission ? (
                          <Badge variant={submission.status === "PASSED" ? "verified" : "flagged"}>
                            {submission.status}
                          </Badge>
                        ) : (
                          <Badge variant="pending">Pending Field Proof</Badge>
                        )}
                      </div>
                    </div>

                    {/* Verified Evidence & AI Reasoning Display */}
                    {verdict && (
                      <div className="mt-5 pt-4 border-t-2 border-pix-dim/20 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <span className="font-heading text-xs uppercase text-pix-mint flex items-center space-x-1.5">
                            <CheckCircle2 className="w-4 h-4 text-pix-mint" />
                            <span>Gemini AI Audit Passed ({Math.round(verdict.confidence * 100)}% Confidence)</span>
                          </span>

                          {verdict.txHash && (
                            <a
                              href={`https://sepolia.basescan.org/tx/${verdict.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pix-cyan hover:underline text-xs font-body flex items-center space-x-1"
                            >
                              <span>BaseScan: {formatTxHash(verdict.txHash)}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        <div className="p-3.5 bg-pix-bg border-2 border-pix-mint/30 text-xs font-body text-pix-dim leading-relaxed">
                          <span className="font-heading text-[10px] uppercase text-pix-mint block mb-1">
                            Auditor Written Reasoning:
                          </span>
                          {verdict.reasoning}
                        </div>

                        {/* Evidence Thumbnails */}
                        {submission.evidence?.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 pt-2">
                            {submission.evidence.map((ev: any) => (
                              <div
                                key={ev.id}
                                className="px-2.5 py-1 bg-pix-bg border-2 border-pix-dim/30 text-[11px] font-body text-pix-dim flex items-center space-x-1.5"
                              >
                                <FileText className="w-3.5 h-3.5 text-pix-cyan" />
                                <span>{ev.fileName || ev.kind}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Escrow Fund Form Card */}
        <div className="space-y-6">
          <GlassCard className="p-6 sticky top-24 space-y-6">
            <div>
              <span className="font-heading text-[10px] uppercase text-pix-gold tracking-widest block">
                Smart Contract Escrow
              </span>
              <div className="text-3xl font-body font-bold text-pix-cyan mt-1">
                {formatUSDC(totalFunded)}
              </div>
              <div className="font-body text-xs text-pix-dim mt-1">
                of <span className="text-pix-cyan">{formatUSDC(campaign.goal)}</span> target goal
              </div>

              {/* Progress Bar */}
              <div className="mt-4 space-y-1.5">
                <PixelProgress value={progressPercent} variant="gold" height={10} />
                <div className="flex justify-between font-heading text-[10px] uppercase text-pix-dim pt-1">
                  <span>{progressPercent}% ESCROWED</span>
                  <span className="text-pix-cyan">BASE SEPOLIA</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-pix-dim/20 space-y-4">
              <label className="font-heading text-xs uppercase text-pix-ink block">
                Fund with Testnet USDC (Base Sepolia)
              </label>

              <div className="relative">
                <input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="50"
                  min="1"
                  className="w-full pl-4 pr-16 py-3 bg-pix-bg border-2 border-pix-dim/40 text-pix-cyan font-body text-base focus:outline-none focus:border-pix-gold transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-heading text-xs uppercase text-pix-gold">
                  USDC
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <SnapButton
                  variant="secondary"
                  size="sm"
                  onClick={handleApproveUSDC}
                  disabled={isApproving}
                  className="w-full"
                >
                  {isApproving ? "APPROVING..." : "1. APPROVE"}
                </SnapButton>

                <SnapButton
                  variant="primary"
                  size="sm"
                  onClick={handleFundEscrow}
                  disabled={isFunding}
                  className="w-full"
                >
                  {isFunding ? "STREAMING..." : "2. FUND ESCROW"}
                </SnapButton>
              </div>

              {/* Faucet Link */}
              <div className="pt-2 text-center">
                <a
                  href={BRAND.links.circleFaucet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-xs text-pix-cyan hover:underline inline-flex items-center space-x-1"
                >
                  <Coins className="w-3.5 h-3.5 mr-1" />
                  <span>Claim free Base Sepolia USDC from Circle</span>
                </a>
              </div>
            </div>

            {/* Escrow Guarantee Pill */}
            <div className="p-3 bg-pix-bg border-2 border-pix-dim/20 font-body text-[11px] text-pix-dim leading-relaxed space-y-1">
              <div className="flex items-center space-x-1.5 font-heading text-[10px] uppercase text-pix-mint">
                <Lock className="w-3.5 h-3.5 text-pix-mint" />
                <span>Escrow Refund Guarantee</span>
              </div>
              <p>
                If milestone claims fail independent verification before the 30-day deadline,
                donors can call <code className="text-pix-cyan">refund()</code> to reclaim locked USDC.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
