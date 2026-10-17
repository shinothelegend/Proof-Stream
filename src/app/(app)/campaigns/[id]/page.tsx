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
        <div className="space-y-1 font-sans text-xs">
          <p className="font-semibold uppercase text-pix-success">Approval Submitted!</p>
          <a
            href={`https://sepolia.basescan.org/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pix-accent underline flex items-center space-x-1"
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
        <div className="space-y-1 font-sans text-xs">
          <p className="font-semibold uppercase text-pix-success">Funded on Base Sepolia!</p>
          <a
            href={`https://sepolia.basescan.org/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pix-accent underline flex items-center space-x-1"
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
        <div className="h-10 w-2/3 bg-pix-panel rounded-[10px] animate-pulse" />
        <div className="h-[340px] bg-pix-panel rounded-[10px] animate-pulse" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] shadow-card p-12 text-center max-w-lg mx-auto">
        <h2 className="font-display font-semibold text-lg text-pix-alert uppercase">Campaign Not Found</h2>
        <p className="text-[14px] font-sans text-pix-dim mt-2">The requested campaign ledger record does not exist.</p>
        <div className="mt-6">
          <SnapButton href="/campaigns" variant="secondary" size="sm">
            ← Return to Campaigns
          </SnapButton>
        </div>
      </div>
    );
  }

  const totalFunded = campaign.escrowBalance;
  const progressPercent = Math.min(100, Math.round((totalFunded / campaign.goal) * 100));

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Campaign Procedural Hero Banner: >= 340px tall (§6.1) */}
      <div className="rounded-[10px] card-chamfer overflow-hidden border border-[var(--color-pix-hairline)] shadow-panel relative">
        <PixelBanner
          seed={campaign.slug || campaign.id}
          title={campaign.title}
          className="h-[350px] w-full"
        />

        {/* Milestone Flag Strip Overlaid at bottom right of hero */}
        <div className="absolute right-6 bottom-6 flex items-center space-x-2 bg-pix-panel/90 backdrop-blur-md px-3.5 py-2 rounded-[8px] border border-[var(--color-pix-hairline)] shadow-md">
          <span className="text-[11px] font-sans font-semibold uppercase text-pix-dim mr-1">Milestones:</span>
          {campaign.milestones?.map((m: any, idx: number) => (
            <span
              key={m.id}
              title={`Tranche 0${idx + 1}: ${m.released ? "Verified & Released" : "Pending"}`}
              className={`w-6 h-6 rounded-[6px] border flex items-center justify-center text-[11px] font-mono font-medium ${
                m.released
                  ? "bg-pix-success/20 text-pix-success border-pix-success/40"
                  : "bg-pix-bg text-pix-dim border-[var(--color-pix-hairline)]"
              }`}
            >
              {idx + 1}
            </span>
          ))}
        </div>
      </div>

      {/* Campaign Header */}
      <div className="space-y-3">
        <Link
          href="/campaigns"
          className="font-sans text-[13px] uppercase font-semibold text-pix-accent hover:underline inline-flex items-center space-x-1"
        >
          <span>← Back to Active Quests</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="verified">Official NGO Verified</Badge>
          <span className="text-[14px] text-pix-dim font-sans flex items-center space-x-1">
            <MapPin className="w-4 h-4 text-pix-accent" />
            <span>{campaign.siteAddress}</span>
          </span>
          <span className="text-[14px] text-pix-dim font-sans">
            NGO: <span className="text-pix-accent font-mono">{formatAddress(campaign.ngoAddress)}</span>
          </span>
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-4xl text-pix-ink leading-tight">
          <Typewriter text={campaign.title} speed={35} />
        </h1>
        <p className="font-sans text-[15px] font-semibold text-pix-dim">{campaign.ngoName}</p>
      </div>

      {/* Main Grid: Story & Milestone Pipeline vs Funding Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Story & Tranche Pipeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Story Card */}
          <div className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] shadow-card p-6 md:p-8 space-y-4">
            <h2 className="font-display font-bold text-xl text-pix-ink border-b border-[var(--color-pix-hairline)] pb-3">
              Frontline Mission & Verification Terms
            </h2>
            <div className="font-sans text-[15px] text-pix-dim leading-relaxed whitespace-pre-line">
              {campaign.story}
            </div>
          </div>

          {/* Milestone Tranche Pipeline */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-pix-hairline)] pb-4">
              <div>
                <h2 className="font-display font-bold text-2xl text-pix-ink">
                  Milestone Tranche Pipeline
                </h2>
                <p className="font-sans text-[14px] text-pix-dim mt-1">
                  Funds stream tranche-by-tranche. Released only when field evidence passes Gemini multimodal audit.
                </p>
              </div>

              <SnapButton
                href={`/submit/${campaign.milestones?.[1]?.id || campaign.id}`}
                variant="secondary"
                size="sm"
              >
                <UploadCloud className="w-3.5 h-3.5 mr-1 text-pix-accent" />
                SUBMIT PROOF
              </SnapButton>
            </div>

            <div className="space-y-5">
              {campaign.milestones?.map((milestone: any, index: number) => {
                const submission = milestone.submissions?.[0];
                const verdict = submission?.verdict;
                const isReleased = milestone.released;

                return (
                  <div
                    key={milestone.id}
                    className={`rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] shadow-card p-6 transition-all ${
                      isReleased ? "border-pix-success/40 bg-pix-success/[0.03]" : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-sans text-[12px] uppercase font-semibold text-pix-accent">
                            TRANCHE 0{index + 1}
                          </span>
                          <span className="text-pix-dim">·</span>
                          <span className="font-mono font-medium text-lg text-pix-accent">
                            {formatUSDC(milestone.amount)}
                          </span>
                        </div>

                        <h3 className="font-display font-semibold text-base text-pix-ink leading-snug">
                          {milestone.description}
                        </h3>

                        {/* Budget Breakdown Lines */}
                        {milestone.budgetLines && (
                          <div className="p-3.5 rounded-[8px] bg-pix-bg border border-[var(--color-pix-hairline)] text-xs font-sans space-y-1.5 mt-3">
                            <span className="font-sans text-[11px] uppercase font-semibold text-pix-dim block mb-1">
                              Audited Budget Lines
                            </span>
                            {JSON.parse(milestone.budgetLines).map((line: any, i: number) => (
                              <div key={i} className="flex justify-between text-xs text-pix-dim">
                                <span>{line.item}</span>
                                <span className="font-mono text-pix-accent font-medium">${line.total} USDC</span>
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
                      <div className="mt-5 pt-4 border-t border-[var(--color-pix-hairline)] space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <span className="font-sans text-xs uppercase font-semibold text-pix-success flex items-center space-x-1.5">
                            <CheckCircle2 className="w-4 h-4 text-pix-success" />
                            <span>Gemini AI Audit Passed ({Math.round(verdict.confidence * 100)}% Confidence)</span>
                          </span>

                          {verdict.txHash && (
                            <a
                              href={`https://sepolia.basescan.org/tx/${verdict.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pix-accent hover:underline text-xs font-mono flex items-center space-x-1"
                            >
                              <span>BaseScan: {formatTxHash(verdict.txHash)}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        <div className="p-4 rounded-[8px] bg-pix-bg border border-pix-success/20 text-[14px] font-sans text-pix-dim leading-relaxed">
                          <span className="font-sans text-[11px] uppercase font-semibold text-pix-success block mb-1.5">
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
                                className="px-3 py-1.5 rounded-[6px] bg-pix-bg border border-[var(--color-pix-hairline)] text-[12px] font-mono text-pix-dim flex items-center space-x-1.5"
                              >
                                <FileText className="w-3.5 h-3.5 text-pix-accent" />
                                <span>{ev.fileName || ev.kind}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Escrow Fund Form Card */}
        <div className="space-y-6">
          <div className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] shadow-panel p-6 sticky top-24 space-y-6">
            <div>
              <span className="font-sans text-[11px] uppercase font-semibold text-pix-accent tracking-widest block">
                Smart Contract Escrow
              </span>
              <div className="text-3xl font-mono font-medium text-pix-accent mt-1">
                {formatUSDC(totalFunded)}
              </div>
              <div className="font-sans text-[13px] text-pix-dim mt-1">
                of <span className="text-pix-accent font-mono font-medium">{formatUSDC(campaign.goal)}</span> target goal
              </div>

              {/* Progress Bar */}
              <div className="mt-4 space-y-1.5">
                <PixelProgress current={totalFunded} total={campaign.goal} variant="gold" height={10} />
                <div className="flex justify-between font-sans text-[11px] uppercase font-semibold text-pix-dim pt-1">
                  <span>{progressPercent}% ESCROWED</span>
                  <span className="text-pix-accent font-mono">BASE SEPOLIA</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--color-pix-hairline)] space-y-4">
              <label className="font-sans text-[13px] uppercase font-semibold text-pix-ink block">
                Fund with Testnet USDC (Base Sepolia)
              </label>

              <div className="relative">
                <input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="50"
                  min="1"
                  className="w-full pl-4 pr-16 py-3 rounded-[10px] bg-pix-bg border border-[var(--color-pix-hairline)] text-pix-accent font-mono text-base focus:outline-none focus:border-pix-accent transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-sans text-[12px] uppercase font-semibold text-pix-accent">
                  USDC
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <SnapButton
                  variant="secondary"
                  size="sm"
                  onClick={handleApproveUSDC}
                  isLoading={isApproving}
                  disabled={isApproving}
                  className="w-full"
                >
                  {isApproving ? "Approving…" : "1. Approve"}
                </SnapButton>

                <SnapButton
                  variant="primary"
                  size="sm"
                  onClick={handleFundEscrow}
                  isLoading={isFunding}
                  disabled={isFunding}
                  className="w-full"
                >
                  {isFunding ? "Streaming…" : "2. Fund Escrow"}
                </SnapButton>
              </div>

              {/* Faucet Link */}
              <div className="pt-2 text-center">
                <a
                  href={BRAND.links.circleFaucet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[13px] text-pix-accent hover:underline inline-flex items-center space-x-1"
                >
                  <Coins className="w-3.5 h-3.5 mr-1" />
                  <span>Claim free Base Sepolia USDC from Circle</span>
                </a>
              </div>
            </div>

            {/* Escrow Guarantee Pill */}
            <div className="p-3.5 rounded-[8px] bg-pix-bg border border-[var(--color-pix-hairline)] font-sans text-[13px] text-pix-dim leading-relaxed space-y-1">
              <div className="flex items-center space-x-1.5 font-sans text-[11px] uppercase font-semibold text-pix-success">
                <Lock className="w-3.5 h-3.5 text-pix-success" />
                <span>Escrow Refund Guarantee</span>
              </div>
              <p>
                If milestone claims fail independent verification before the 30-day deadline,
                donors can call <code className="text-pix-accent font-mono text-xs">refund()</code> to reclaim locked USDC.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
