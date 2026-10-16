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
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { SnapButton } from "@/components/pixel/SnapButton";
import { PixelDissolve } from "@/components/pixel/PixelDissolve";
import { StatChip } from "@/components/pixel/StatChip";
import { PixelChest, PixelShield, PixelScroll } from "@/components/pixel/PixelIcons";
import { BRAND } from "@/lib/brand";
import { formatUSDC } from "@/lib/format";

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
  const [role, setRole] = useState<"Donor" | "Field Worker" | "Reviewer">("Donor");
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

  return (
    <div className="min-h-screen flex flex-col bg-pix-bg text-pix-ink">
      {/* ── Top Full-Width HUD Bar (§6) ── */}
      <header className="sticky top-0 z-40 w-full bg-pix-panel border-b-4 border-pix-gold shadow-[0_4px_0_0_#000000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 py-2 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left: Branding & Breadcrumb in Silkscreen */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-pix-gold flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_#000]">
                <span className="font-display text-xs text-black font-bold">PS</span>
              </div>
              <span className="font-heading font-bold text-sm sm:text-base text-pix-ink tracking-wider">
                PROOFSTREAM <span className="text-pix-gold">▸</span> QUEST BOARD
              </span>
            </Link>

            {/* Mobile Theme Toggle */}
            <div className="md:hidden">
              <PixelDissolve />
            </div>
          </div>

          {/* Right: 3 StatChips + Theme Toggle + Wallet Connect (NO EMPTY DEAD SPACE) */}
          <div className="flex flex-wrap items-center justify-end gap-2.5 w-full md:w-auto">
            <div className="hidden lg:flex items-center space-x-2">
              <div className="px-3 py-1 bg-pix-bg border-2 border-[var(--color-pix-border)] text-xs font-mono">
                <span className="text-pix-dim">ESCROW: </span>
                <span className="text-pix-cyan font-bold">{formatUSDC(stats.totalEscrowed)}</span>
              </div>
              <div className="px-3 py-1 bg-pix-bg border-2 border-[var(--color-pix-border)] text-xs font-mono">
                <span className="text-pix-dim">PROVEN: </span>
                <span className="text-pix-mint font-bold">{stats.totalVerdicts} TRANCHES</span>
              </div>
            </div>

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-black/40 border-2 border-black p-0.5 shadow-[2px_2px_0_0_#000]">
              {(["Donor", "Field Worker", "Reviewer"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`text-[10px] font-heading uppercase px-2 py-1 transition-all ${
                    role === r
                      ? "bg-pix-gold text-black font-bold shadow-[1px_1px_0_0_#000]"
                      : "text-pix-dim hover:text-pix-ink"
                  }`}
                >
                  {r === "Field Worker" ? "Worker" : r}
                </button>
              ))}
            </div>

            {/* Desktop Theme Toggle */}
            <div className="hidden md:block">
              <PixelDissolve />
            </div>

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
        <div className="border-t-2 border-[var(--color-pix-border-subtle)] bg-pix-bg/90 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center space-x-2 overflow-x-auto py-2 scrollbar-none">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/campaigns" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-xs font-heading font-bold uppercase tracking-wider px-3.5 py-1.5 border-2 transition-all flex items-center space-x-1.5 flex-shrink-0 ${
                    isActive
                      ? "bg-pix-gold text-black border-black shadow-[2px_2px_0_0_#000]"
                      : "bg-pix-panel text-pix-dim border-[var(--color-pix-border)] hover:text-pix-ink hover:border-pix-gold"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
