"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Clock, ArrowRight, Sparkles, X, Shield, ExternalLink, Lock, CheckCircle2 } from "lucide-react";
import { Typewriter } from "@/components/pixel/Typewriter";
import { SnapButton } from "@/components/pixel/SnapButton";
import { PixelProgress } from "@/components/pixel/PixelProgress";
import { PixelBanner } from "@/components/pixel/PixelBanner";
import { PixelShield } from "@/components/pixel/PixelIcons";
import { Badge } from "@/components/ui/Badge";
import { CopyHash } from "@/components/ui/CopyHash";
import { formatUSDC, formatTxHash } from "@/lib/format";
import { useTour } from "@/components/tour/SpotlightTour";

interface MilestoneItem {
  id: string;
  idx: number;
  description: string;
  amount: number;
  status: string;
  released: boolean;
  deadline?: string;
  txHash?: string | null;
  attestationUid?: string | null;
}

interface CampaignItem {
  id: string;
  slug: string;
  title: string;
  ngoName: string;
  story: string;
  goal: number;
  escrowBalance: number;
  coverImageCid: string;
  siteAddress: string;
  status: string;
  milestones: MilestoneItem[];
}

export default function CampaignsPage() {
  const { startTour } = useTour();
  const [showTourOffer, setShowTourOffer] = useState(false);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("proofstream.tour.dismissed");
      if (!dismissed) {
        setShowTourOffer(true);
      }
    } catch {}

    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCampaigns(data.data || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const dismissTourOffer = () => {
    setShowTourOffer(false);
    try {
      localStorage.setItem("proofstream.tour.dismissed", "true");
    } catch {}
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ngoName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.siteAddress.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === "ALL") return true;
    if (filterStatus === "ACTIVE") return c.status === "ACTIVE";
    if (filterStatus === "COMPLETED") return c.status === "COMPLETED";
    return true;
  });

  const primaryCampaign = filteredCampaigns[0] || campaigns[0];

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Title Header with Typewriter & Grouped Status (§1.3) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--color-pix-hairline)]">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[13px] font-sans font-semibold uppercase text-pix-accent tracking-widest block">
              AVAILABLE BOUNTIES & IMPACT QUESTS
            </span>
            <span className="text-[13px] font-mono text-pix-dim px-2.5 py-0.5 rounded-[6px] bg-pix-panel border border-[var(--color-pix-hairline)]">
              ACTIVE CAMPAIGNS: <span className="text-pix-accent font-bold">{filteredCampaigns.length}</span>
            </span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl text-pix-ink tracking-tight mt-1">
            <Typewriter text="Select a verifiable impact quest" highlightWord="verifiable" speed={35} />
          </h1>
        </div>

        <div className="text-[13px] font-mono text-pix-dim">
          <span>NETWORK: </span>
          <span className="text-pix-accent font-bold">BASE SEPOLIA</span>
        </div>
      </div>

      {/* Auto-Offer Tour Banner (§7) */}
      {showTourOffer && (
        <div className="p-3.5 px-4 rounded-[10px] bg-pix-panel border border-pix-accent/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-pix-accent flex-shrink-0" />
            <span className="text-[14px] sm:text-[15px] font-sans text-pix-ink">
              New to ProofStream? Take the 60-second guided interactive walkthrough.
            </span>
          </div>
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <SnapButton
              variant="primary"
              size="sm"
              onClick={() => {
                dismissTourOffer();
                startTour(2);
              }}
            >
              START TOUR
            </SnapButton>
            <button
              onClick={dismissTourOffer}
              className="p-1 text-pix-dim hover:text-pix-ink text-xs font-mono rounded cursor-pointer"
              aria-label="Dismiss tour prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Cartridge Tabs Filters & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 w-full md:w-auto bg-pix-panel p-1 rounded-[10px] border border-[var(--color-pix-hairline)]">
          {(["ALL", "ACTIVE", "COMPLETED"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`text-[13px] font-sans font-semibold uppercase px-4 py-1.5 rounded-[8px] transition-all cursor-pointer ${
                filterStatus === status
                  ? "bg-pix-accent text-[var(--color-accent-fg)] shadow-sm font-bold"
                  : "text-pix-dim hover:text-pix-ink hover:bg-pix-bg"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-pix-dim absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter quests or NGO..."
            className="w-full pl-10 pr-4 py-2 rounded-[10px] bg-pix-panel border border-[var(--color-pix-hairline)] text-[15px] font-sans text-pix-ink placeholder-pix-dim focus:outline-none focus:border-pix-accent shadow-sm"
          />
        </div>
      </div>

      {/* Main Layout: 2-Column Quest Cards Left + Live Escrow Feed Right (§1.3) */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 h-[420px] rounded-[10px] bg-pix-panel border border-[var(--color-pix-hairline)] animate-pulse" />
          <div className="lg:col-span-5 h-[420px] rounded-[10px] bg-pix-panel border border-[var(--color-pix-hairline)] animate-pulse" />
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] p-12 text-center max-w-md mx-auto space-y-3 shadow-panel">
          <div className="w-12 h-12 rounded-[10px] bg-pix-accent text-[var(--color-accent-fg)] font-bold flex items-center justify-center mx-auto font-display text-lg">
            ?
          </div>
          <h3 className="font-display font-semibold text-lg text-pix-ink">No Quests Found</h3>
          <p className="text-[15px] font-sans text-pix-dim">Try adjusting search filters or keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Quest Cards */}
          <div className="lg:col-span-7 space-y-6">
            {filteredCampaigns.map((camp) => {
              const releasedCount = camp.milestones.filter((m) => m.released).length;

              return (
                <div
                  key={camp.id}
                  data-tour={camp.id === filteredCampaigns[0]?.id ? "quest-card" : undefined}
                  className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] overflow-hidden shadow-card hover:border-[var(--color-pix-accent)]/50 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Banner: >= 230px tall, 128x72 canvas, title overlay Space Grotesk 24px (§6.1) */}
                    <PixelBanner
                      seed={camp.slug || camp.id}
                      title={camp.title}
                      className="h-[240px]"
                    />

                    {/* Card Content */}
                    <div className="p-6 space-y-4">
                      {/* Header Chips */}
                      <div className="flex items-center justify-between gap-2 text-[13px] font-sans">
                        <span className="flex items-center space-x-1.5 text-pix-accent bg-pix-accent/10 border border-pix-accent/20 px-2.5 py-1 rounded-[6px]">
                          <PixelShield size={13} />
                          <span className="font-semibold uppercase tracking-wider">{camp.ngoName.slice(0, 24)}</span>
                        </span>

                        <span className="text-pix-dim truncate max-w-[180px] flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-pix-accent flex-shrink-0" />
                          <span>{camp.siteAddress.split(",")[0]}</span>
                        </span>
                      </div>

                      {/* Story snippet in Inter */}
                      <p className="text-[15px] text-pix-dim leading-relaxed font-sans line-clamp-3">
                        {camp.story}
                      </p>

                      {/* Escrow Progress */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between items-center text-[13px]">
                          <span className="text-pix-dim font-sans uppercase tracking-wider font-semibold">Escrowed</span>
                          <span className="text-pix-accent font-mono font-medium">
                            {formatUSDC(camp.escrowBalance)} / {formatUSDC(camp.goal)}
                          </span>
                        </div>
                        <PixelProgress current={camp.escrowBalance} total={camp.goal} variant="gold" height={10} />
                      </div>

                      {/* Milestone Flags */}
                      <div className="pt-3 border-t border-[var(--color-pix-hairline)] flex items-center justify-between text-[13px] font-mono">
                        <div className="flex items-center space-x-2">
                          {camp.milestones.map((m, idx) => (
                            <span
                              key={m.id}
                              title={`Tranche #${idx + 1}: ${m.released ? "Proven & Released" : "Pending Verification"}`}
                              className={`w-5 h-5 rounded-[4px] border flex items-center justify-center text-[11px] font-bold ${
                                m.released
                                  ? "bg-pix-success/20 text-pix-success border-pix-success/40"
                                  : "bg-pix-bg text-pix-dim border-[var(--color-pix-hairline)]"
                              }`}
                            >
                              {idx + 1}
                            </span>
                          ))}
                          <span className="text-[13px] text-pix-dim ml-1.5 font-sans">
                            {releasedCount}/{camp.milestones.length} Proven
                          </span>
                        </div>

                        <div className="flex items-center space-x-1 text-[13px] text-pix-accent font-sans uppercase tracking-wider font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Active Quest</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Button */}
                  <div className="p-6 pt-0">
                    <SnapButton
                      href={`/campaigns/${camp.id}`}
                      variant="primary"
                      size="md"
                      className="w-full justify-between"
                    >
                      <span>ENTER QUEST DETAILS & MILESTONES</span>
                      <ArrowRight className="w-4 h-4" />
                    </SnapButton>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column (5 cols): Live Escrow & Tranche Feed Panel (§1.3) */}
          {primaryCampaign && (
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] shadow-card p-6 space-y-6 sticky top-24">
                {/* Panel Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[var(--color-pix-hairline)]">
                  <div>
                    <span className="text-[13px] font-mono uppercase text-pix-accent font-semibold tracking-wider block">
                      ON-CHAIN VAULT STREAM
                    </span>
                    <h3 className="font-display font-bold text-xl text-pix-ink mt-0.5">
                      Live Escrow & Tranches
                    </h3>
                  </div>
                  <div className="flex items-center space-x-1.5 text-pix-success text-[13px] font-mono bg-pix-success/10 px-2.5 py-1 rounded-[6px] border border-pix-success/25">
                    <span className="w-2 h-2 rounded-full bg-pix-success animate-pulse" />
                    <span>SYNCED</span>
                  </div>
                </div>

                {/* Vault Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-[8px] bg-pix-bg border border-[var(--color-pix-hairline)]">
                    <span className="text-[13px] font-sans text-pix-dim uppercase font-semibold block">Total Escrowed</span>
                    <span className="font-mono text-lg font-medium text-pix-accent mt-0.5 block">
                      {formatUSDC(primaryCampaign.escrowBalance)}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-[8px] bg-pix-bg border border-[var(--color-pix-hairline)]">
                    <span className="text-[13px] font-sans text-pix-dim uppercase font-semibold block">Tranches Proven</span>
                    <span className="font-mono text-lg font-medium text-pix-accent mt-0.5 block">
                      {primaryCampaign.milestones.filter((m) => m.released).length} of {primaryCampaign.milestones.length}
                    </span>
                  </div>
                </div>

                {/* Tranche Breakdown List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[13px] font-sans uppercase font-semibold text-pix-dim">
                    <span>Milestone Tranches</span>
                    <span className="text-pix-accent font-mono">3-Tranche Schedule</span>
                  </div>

                  <div className="space-y-2.5">
                    {primaryCampaign.milestones.map((m, idx) => (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-[8px] border transition-all ${
                          m.released
                            ? "bg-pix-success/[0.04] border-pix-success/30"
                            : "bg-pix-bg border-[var(--color-pix-hairline)]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`w-5 h-5 rounded-[4px] border flex items-center justify-center text-[11px] font-bold ${
                                m.released
                                  ? "bg-pix-success/20 text-pix-success border-pix-success/40"
                                  : "bg-pix-panel text-pix-dim border-[var(--color-pix-hairline)]"
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span className="font-display font-semibold text-[15px] text-pix-ink">
                              Tranche 0{idx + 1}
                            </span>
                          </div>

                          <span className="font-mono text-[14px] text-pix-accent font-medium">
                            {formatUSDC(m.amount)}
                          </span>
                        </div>

                        <p className="text-[13px] text-pix-dim mt-1.5 leading-relaxed font-sans line-clamp-1">
                          {m.description}
                        </p>

                        <div className="pt-2.5 mt-2.5 border-t border-[var(--color-pix-hairline)] flex items-center justify-between text-[13px]">
                          {m.released ? (
                            <Badge variant="verified">RELEASED ON-CHAIN</Badge>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-pix-accent font-mono text-[13px]">
                              <Lock className="w-3.5 h-3.5" />
                              <span>IN ESCROW</span>
                            </span>
                          )}

                          {!m.released ? (
                            <Link
                              href={`/submit/${m.id}`}
                              className="text-[13px] text-pix-accent hover:underline font-sans font-semibold inline-flex items-center space-x-1"
                            >
                              <span>Submit Proof →</span>
                            </Link>
                          ) : m.txHash ? (
                            <a
                              href={`https://sepolia.basescan.org/tx/${m.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[12px] font-mono text-pix-accent hover:underline inline-flex items-center space-x-1"
                            >
                              <span>BaseScan</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-[12px] font-mono text-pix-dim">Audit Logged</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Panel Footer Links */}
                <div className="pt-4 border-t border-[var(--color-pix-hairline)] space-y-3">
                  <SnapButton
                    href={`/campaigns/${primaryCampaign.id}`}
                    variant="secondary"
                    size="sm"
                    className="w-full justify-between"
                  >
                    <span>VIEW FULL CONTRACT DETAILS</span>
                    <ArrowRight className="w-4 h-4" />
                  </SnapButton>

                  <Link
                    href="/audit"
                    className="text-[13px] font-mono text-pix-dim hover:text-pix-accent transition-colors block text-center"
                  >
                    View Immutable EAS Audit Explorer →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
