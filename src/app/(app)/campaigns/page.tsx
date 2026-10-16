"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Clock, ArrowRight } from "lucide-react";
import { Typewriter } from "@/components/pixel/Typewriter";
import { SnapButton } from "@/components/pixel/SnapButton";
import { PixelProgress } from "@/components/pixel/PixelProgress";
import { PixelBanner } from "@/components/pixel/PixelBanner";
import { PixelFlag, PixelShield } from "@/components/pixel/PixelIcons";
import { formatUSDC } from "@/lib/format";

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
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "COMPLETED">("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCampaigns(data.data || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

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
    <div className="space-y-8">
      {/* Title Header with Typewriter */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-2 border-[var(--color-pix-border)]">
        <div>
          <span className="text-[10px] font-heading uppercase text-pix-gold font-bold tracking-widest block">
            AVAILABLE BOUNTIES & QUESTS
          </span>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-pix-ink tracking-wide mt-1">
            <Typewriter text="SELECT A VERIFIABLE IMPACT QUEST" speed={35} />
          </h1>
        </div>

        <div className="text-xs font-mono text-pix-dim">
          <span>ACTIVE CAMPAIGNS: </span>
          <span className="text-pix-cyan font-bold">{filteredCampaigns.length}</span>
        </div>
      </div>

      {/* Cartridge Tabs Filters & Pixel Search Bar (§6) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Cartridge Insertion Tabs */}
        <div className="flex items-center space-x-1 w-full md:w-auto bg-black/40 p-1 border-2 border-black shadow-[2px_2px_0_0_#000]">
          {(["ALL", "ACTIVE", "COMPLETED"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`text-[11px] font-heading uppercase px-3 py-1.5 transition-all cursor-pointer ${
                filterStatus === status
                  ? "bg-pix-gold text-black font-bold shadow-[2px_2px_0_0_#000] translate-y-[-2px]"
                  : "text-pix-dim hover:text-pix-ink"
              }`}
            >
              {status === "ALL" ? "[ ALL QUESTS ]" : `[ ${status} ]`}
            </button>
          ))}
        </div>

        {/* Pixel Search Input with Blinking Cursor */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH QUEST / NGO..."
            className="w-full pl-9 pr-4 py-2 bg-pix-panel border-2 border-[var(--color-pix-border)] text-xs font-mono text-pix-ink placeholder-pix-dim focus:outline-none focus:border-pix-gold shadow-[2px_2px_0_0_#000]"
          />
          <Search className="w-4 h-4 text-pix-gold absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Full-Width Quest Cards Grid (grid-cols-1 md:2 xl:3, NO DEAD SPACE) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-96 bg-pix-panel border-2 border-[var(--color-pix-border)] animate-pulse shadow-pixel"
            />
          ))}
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="pixel-panel p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-10 h-10 bg-pix-gold text-black flex items-center justify-center mx-auto border-2 border-black font-display text-sm">
            ?
          </div>
          <h3 className="font-heading font-bold text-sm text-pix-ink">NO QUESTS FOUND</h3>
          <p className="text-xs font-mono text-pix-dim">Try adjusting search filters or keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCampaigns.map((camp) => {
            const fundedPercent = Math.min(
              100,
              Math.round((camp.escrowBalance / camp.goal) * 100)
            );
            const releasedCount = camp.milestones.filter((m) => m.released).length;
            const nextMilestone = camp.milestones.find((m) => !m.released) || camp.milestones[0];

            return (
              <div
                key={camp.id}
                className="pixel-panel flex flex-col justify-between overflow-hidden border-2 border-[var(--color-pix-border)] hover:border-pix-gold transition-all duration-150 group shadow-pixel hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#000]"
              >
                <div>
                  {/* Procedural Pixel Banner (Deterministic per slug) */}
                  <PixelBanner seed={camp.slug} className="h-36" />

                  {/* Card Content */}
                  <div className="p-5 space-y-4">
                    {/* Header Chips */}
                    <div className="flex items-center justify-between gap-2 text-[10px] font-heading">
                      <span className="flex items-center space-x-1 text-pix-mint bg-pix-mint/10 border border-pix-mint/30 px-2 py-0.5">
                        <PixelShield size={12} />
                        <span>GUILD: {camp.ngoName.slice(0, 18)}</span>
                      </span>

                      <span className="text-pix-dim font-mono truncate max-w-[140px] flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-pix-gold flex-shrink-0" />
                        <span>{camp.siteAddress.split(",")[0]}</span>
                      </span>
                    </div>

                    {/* Quest Title */}
                    <h3 className="font-heading font-bold text-base text-pix-ink group-hover:text-pix-gold transition-colors line-clamp-2 leading-snug">
                      {camp.title}
                    </h3>

                    {/* XP Funding Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-pix-dim">ESCROWED</span>
                        <span className="text-pix-cyan font-bold">
                          {formatUSDC(camp.escrowBalance)} / {formatUSDC(camp.goal)}
                        </span>
                      </div>
                      <PixelProgress current={camp.escrowBalance} total={camp.goal} variant="gold" height={10} />
                    </div>

                    {/* Milestone Flags & Event Timer */}
                    <div className="pt-3 border-t border-[var(--color-pix-border-subtle)] flex items-center justify-between text-[11px] font-mono">
                      {/* Flag dots */}
                      <div className="flex items-center space-x-1.5">
                        {camp.milestones.map((m, idx) => (
                          <span
                            key={m.id}
                            title={`Tranche #${idx + 1}: ${m.released ? "Proven" : "Pending"}`}
                            className={`w-3 h-3 border border-black flex items-center justify-center text-[8px] font-bold ${
                              m.released ? "bg-pix-mint text-black" : "bg-black text-pix-dim"
                            }`}
                          >
                            {idx + 1}
                          </span>
                        ))}
                        <span className="text-[10px] text-pix-dim ml-1">
                          {releasedCount}/{camp.milestones.length} PROVEN
                        </span>
                      </div>

                      {/* Event timer */}
                      <div className="flex items-center space-x-1 text-[10px] text-pix-gold font-mono">
                        <Clock className="w-3 h-3" />
                        <span>ACTIVE QUEST</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Button */}
                <div className="p-4 pt-0">
                  <Link href={`/campaigns/${camp.slug || camp.id}`} className="block w-full">
                    <SnapButton variant="gold" size="sm" className="w-full justify-between">
                      <span>VIEW QUEST DETAIL</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </SnapButton>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
