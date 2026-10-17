"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Clock, ArrowRight, Sparkles, X } from "lucide-react";
import { Typewriter } from "@/components/pixel/Typewriter";
import { SnapButton } from "@/components/pixel/SnapButton";
import { PixelProgress } from "@/components/pixel/PixelProgress";
import { PixelBanner } from "@/components/pixel/PixelBanner";
import { PixelShield } from "@/components/pixel/PixelIcons";
import { formatUSDC } from "@/lib/format";
import { useTour } from "@/components/tour/SpotlightTour";

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
  milestones: Array<{
    id: string;
    idx: number;
    description: string;
    amount: number;
    status: string;
    released: boolean;
    deadline: string;
  }>;
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

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Title Header with Typewriter */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[var(--color-pix-hairline)]">
        <div>
          <span className="text-[12px] font-sans font-semibold uppercase text-pix-accent tracking-widest block">
            AVAILABLE BOUNTIES & IMPACT QUESTS
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-pix-ink tracking-tight mt-1.5">
            <Typewriter text="Select a verifiable impact quest" highlightWord="verifiable" speed={35} />
          </h1>
        </div>

        <div className="text-[13px] font-mono text-pix-dim">
          <span>ACTIVE CAMPAIGNS: </span>
          <span className="text-pix-accent font-bold">{filteredCampaigns.length}</span>
        </div>
      </div>

      {/* Auto-Offer Tour Banner (§7) */}
      {showTourOffer && (
        <div className="p-3.5 px-4 rounded-[10px] bg-pix-panel border border-pix-accent/30 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-pix-accent flex-shrink-0" />
            <span className="text-sm font-sans text-pix-ink">
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
              className={`text-[12px] font-sans font-semibold uppercase px-4 py-1.5 rounded-[8px] transition-all cursor-pointer ${
                filterStatus === status
                  ? "bg-pix-accent text-[#1D1D26] shadow-sm"
                  : "text-pix-dim hover:text-pix-ink"
              }`}
            >
              {status === "ALL" ? "All Quests" : status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quest or NGO..."
            className="w-full pl-10 pr-4 py-2 rounded-[10px] bg-pix-panel border border-[var(--color-pix-hairline)] text-[14px] font-sans text-pix-ink placeholder-pix-dim focus:outline-none focus:border-pix-accent shadow-sm"
          />
          <Search className="w-4 h-4 text-pix-accent absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Quest Cards Grid (§6.1: Banner >= 220px tall, title in Space Grotesk 24px) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-96 rounded-[10px] bg-pix-panel border border-[var(--color-pix-hairline)] animate-pulse shadow-card"
            />
          ))}
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] p-12 text-center max-w-md mx-auto space-y-3 shadow-panel">
          <div className="w-12 h-12 rounded-[10px] bg-pix-accent text-[#1D1D26] font-bold flex items-center justify-center mx-auto font-display text-lg">
            ?
          </div>
          <h3 className="font-display font-semibold text-base text-pix-ink">No Quests Found</h3>
          <p className="text-[14px] font-sans text-pix-dim">Try adjusting search filters or keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCampaigns.map((camp) => {
            const releasedCount = camp.milestones.filter((m) => m.released).length;

            return (
              <div
                key={camp.id}
                data-tour={camp.id === filteredCampaigns[0]?.id ? "quest-card" : undefined}
                className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] overflow-hidden shadow-card hover:border-[var(--color-pix-accent)]/50 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Banner: >= 220px tall, 128x72 canvas, title overlay Space Grotesk 24px (§6.1) */}
                  <PixelBanner
                    seed={camp.slug}
                    title={camp.title}
                    className="h-[230px]"
                  />

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    {/* Header Chips */}
                    <div className="flex items-center justify-between gap-2 text-[12px] font-sans">
                      <span className="flex items-center space-x-1.5 text-pix-accent bg-pix-accent/10 border border-pix-accent/20 px-2.5 py-1 rounded-[6px]">
                        <PixelShield size={12} />
                        <span className="font-semibold uppercase tracking-wider">{camp.ngoName.slice(0, 20)}</span>
                      </span>

                      <span className="text-pix-dim truncate max-w-[150px] flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-pix-accent flex-shrink-0" />
                        <span>{camp.siteAddress.split(",")[0]}</span>
                      </span>
                    </div>

                    {/* Story snippet in Inter */}
                    <p className="text-[14px] text-pix-dim leading-relaxed font-sans line-clamp-2">
                      {camp.story}
                    </p>

                    {/* Escrow Progress */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-pix-dim font-sans uppercase tracking-wider text-[11px] font-semibold">Escrowed</span>
                        <span className="text-pix-accent font-mono font-medium">
                          {formatUSDC(camp.escrowBalance)} / {formatUSDC(camp.goal)}
                        </span>
                      </div>
                      <PixelProgress current={camp.escrowBalance} total={camp.goal} variant="gold" height={8} />
                    </div>

                    {/* Milestone Flags */}
                    <div className="pt-3 border-t border-[var(--color-pix-hairline)] flex items-center justify-between text-[12px] font-mono">
                      <div className="flex items-center space-x-1.5">
                        {camp.milestones.map((m, idx) => (
                          <span
                            key={m.id}
                            title={`Tranche #${idx + 1}: ${m.released ? "Proven" : "Pending"}`}
                            className={`w-4 h-4 rounded-[4px] border flex items-center justify-center text-[9px] font-bold ${
                              m.released
                                ? "bg-pix-success/20 text-pix-success border-pix-success/40"
                                : "bg-pix-bg text-pix-dim border-[var(--color-pix-hairline)]"
                            }`}
                          >
                            {idx + 1}
                          </span>
                        ))}
                        <span className="text-[12px] text-pix-dim ml-1.5 font-sans">
                          {releasedCount}/{camp.milestones.length} Proven
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 text-[11px] text-pix-accent font-sans uppercase tracking-wider font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Button */}
                <div className="p-6 pt-0">
                  <SnapButton
                    href={`/campaigns/${camp.slug || camp.id}`}
                    variant="primary"
                    size="sm"
                    className="w-full justify-between"
                  >
                    <span>ENTER QUEST DETAILS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </SnapButton>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
