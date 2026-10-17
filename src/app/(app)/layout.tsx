"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Compass,
  UploadCloud,
  ShieldCheck,
  FileCheck2,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { SnapButton } from "@/components/pixel/SnapButton";
import { PixelDissolve } from "@/components/pixel/PixelDissolve";
import { StatChip } from "@/components/pixel/StatChip";
import { PixelChest, PixelShield, PixelScroll } from "@/components/pixel/PixelIcons";
import { BRAND } from "@/lib/brand";
import { formatUSDC } from "@/lib/format";
import { useTour } from "@/components/tour/SpotlightTour";

import { BrandLogo } from "@/components/brand/BrandLogo";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: "QUESTS", href: "/campaigns", icon: Compass },
  { name: "SUBMIT PROOF", href: "/submit/kalimantan-clean-water", icon: UploadCloud },
  { name: "AUDITOR QUEUE", href: "/review", icon: ShieldCheck },
  { name: "PUBLIC AUDIT", href: "/audit", icon: FileCheck2 },
  { name: "DOCS", href: "/docs", icon: BookOpen },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { startTour } = useTour();
  const [role, setRole] = useState<"Donor" | "Field Worker" | "Reviewer">("Donor");
  const [stats, setStats] = useState<{
    totalEscrowed: number;
    totalReleased: number;
    totalVerdicts: number;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    // Load persisted role
    try {
      const savedRole = localStorage.getItem("proofstream.role") as any;
      if (savedRole && ["Donor", "Field Worker", "Reviewer"].includes(savedRole)) {
        setRole(savedRole);
      }
    } catch {}

    setStatsLoading(true);
    fetch("/api/campaigns")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load HUD stats");
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
        setStatsLoading(false);
      })
      .catch((err) => {
        console.error("HUD stats load error:", err);
        setStatsError(true);
        setStatsLoading(false);
      });
  }, []);

  const handleRoleChange = (newRole: "Donor" | "Field Worker" | "Reviewer") => {
    setRole(newRole);
    try {
      localStorage.setItem("proofstream.role", newRole);
    } catch {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-pix-bg text-pix-ink">
      {/* ── Top Full-Width HUD Bar (§6.2, §6.5) ── */}
      <header className="sticky top-0 z-40 w-full bg-pix-panel border-b border-[var(--color-pix-hairline)] shadow-panel backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Brand Logo & Wordmark + Section breadcrumb */}
          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-start">
            <Link href="/" className="flex items-center space-x-3 group">
              <BrandLogo size={28} showWordmark={true} showTagline={true} />
            </Link>

            <span className="hidden sm:inline-block text-pix-hairline">/</span>
            <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-pix-dim">
              Dashboard
            </span>

            {/* Mobile Theme Toggle */}
            <div className="md:hidden">
              <PixelDissolve />
            </div>
          </div>

          {/* Right: Live Escrow StatChips + Role Pill + Theme Toggle + Wallet Connect */}
          <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
            <div className="hidden lg:flex items-center space-x-2.5">
              {statsLoading ? (
                <div className="h-8 w-44 rounded-[10px] bg-pix-bg/60 border border-[var(--color-pix-hairline)] animate-pulse" />
              ) : statsError || !stats ? (
                <span className="text-[11px] font-mono text-pix-dim">STATS OFFLINE</span>
              ) : (
                <>
                  <div className="px-3 py-1.5 rounded-[10px] bg-pix-bg border border-[var(--color-pix-hairline)] text-xs font-medium">
                    <span className="text-pix-dim font-sans text-[12px] uppercase tracking-wider mr-1.5">Escrowed</span>
                    <span className="text-pix-accent font-mono font-medium text-[14px]">{formatUSDC(stats.totalEscrowed)}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-[10px] bg-pix-bg border border-[var(--color-pix-hairline)] text-xs font-medium">
                    <span className="text-pix-dim font-sans text-[12px] uppercase tracking-wider mr-1.5">Proven</span>
                    <span className="text-pix-accent font-mono font-medium text-[14px]">{stats.totalVerdicts} Tranche</span>
                  </div>
                </>
              )}
            </div>

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-pix-bg border border-[var(--color-pix-hairline)] rounded-[10px] p-1">
              {(["Donor", "Field Worker", "Reviewer"] as const).map((r) => {
                const isSelected = role === r;
                return (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    style={
                      isSelected
                        ? {
                            backgroundColor: "var(--color-accent)",
                            color: "#0E0E12",
                            fontWeight: 700,
                          }
                        : undefined
                    }
                    className={`text-[12px] font-sans font-semibold uppercase tracking-wider px-3 py-1 rounded-[8px] transition-all cursor-pointer ${
                      isSelected
                        ? "shadow-sm"
                        : "text-pix-dim hover:text-pix-ink"
                    }`}
                  >
                    {r === "Field Worker" ? "Worker" : r}
                  </button>
                );
              })}
            </div>

            {/* Desktop Theme Toggle */}
            <div className="hidden md:block">
              <PixelDissolve />
            </div>

            {/* Spotlight Tour Trigger */}
            <button
              onClick={() => startTour(1)}
              data-snap
              className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded-[8px] bg-pix-bg hover:bg-pix-panel border border-[var(--color-pix-hairline)] text-xs font-mono uppercase text-pix-dim hover:text-pix-accent transition-colors cursor-pointer"
              title="Test It Yourself — Guided Tour"
            >
              <Sparkles className="w-3.5 h-3.5 text-pix-accent" />
              <span>Tour</span>
            </button>

            {/* Wallet Connect */}
            <div className="overflow-hidden">
              <ConnectButton
                showBalance={false}
                chainStatus="icon"
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "address",
                }}
              />
            </div>
          </div>
        </div>

        {/* Sub-Nav Tabs Strip */}
        <div className="border-t border-[var(--color-pix-hairline)] bg-pix-bg/70 px-5">
          <div className="max-w-7xl mx-auto flex items-center space-x-2 overflow-x-auto py-2.5 scrollbar-none">
            {navItems.map((item) => {
              const isCurrent =
                item.href === "/campaigns"
                  ? pathname === "/campaigns" || (pathname.startsWith("/campaigns/") && !pathname.includes("/submit"))
                  : item.href.startsWith("/submit")
                  ? pathname.startsWith("/submit")
                  : pathname === item.href || pathname.startsWith(item.href);
              const Icon = item.icon;

              const isRecommended =
                (role === "Donor" && item.href === "/campaigns") ||
                (role === "Field Worker" && item.href.startsWith("/submit")) ||
                (role === "Reviewer" && item.href === "/review");

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  data-snap
                  style={
                    isCurrent
                      ? {
                          backgroundColor: "var(--color-accent)",
                          color: "#0E0E12",
                          borderColor: "var(--color-accent)",
                          fontWeight: 700,
                          boxShadow: "0 0 16px rgba(255, 180, 84, 0.45)",
                        }
                      : isRecommended
                      ? {
                          backgroundColor: "var(--color-panel)",
                          color: "var(--color-ink)",
                          borderColor: "var(--color-accent)",
                          boxShadow: "0 0 10px rgba(255, 180, 84, 0.2)",
                        }
                      : {
                          backgroundColor: "var(--color-panel)",
                          color: "var(--color-dim)",
                          borderColor: "var(--color-hairline)",
                        }
                  }
                  className={`text-[13px] font-sans uppercase tracking-wider px-4 py-2 rounded-[10px] border transition-all flex items-center space-x-2 flex-shrink-0 cursor-pointer ${
                    isCurrent
                      ? ""
                      : "hover:text-pix-ink hover:border-[var(--color-accent)]/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {isRecommended && !isCurrent && (
                    <span className="ml-1.5 px-1.5 py-0.2 text-[9px] font-mono font-bold bg-pix-accent/20 text-pix-accent border border-pix-accent/40 rounded">
                      FOCUS
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-5 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
