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
      {/* ── Top Full-Width HUD Bar (§6.2, §6.5) ── */}
      <header className="sticky top-0 z-40 w-full bg-pix-panel border-b border-[var(--color-pix-hairline)] shadow-panel backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Brand Logo & Wordmark + Section breadcrumb */}
          <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-start">
            <Link href="/" className="flex items-center space-x-3 group">
              <BrandLogo size={28} showWordmark={true} />
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
              <div className="px-3 py-1.5 rounded-[10px] bg-pix-bg border border-[var(--color-pix-hairline)] text-xs font-medium">
                <span className="text-pix-dim font-sans text-[12px] uppercase tracking-wider mr-1.5">Escrowed</span>
                <span className="text-pix-accent font-mono font-medium text-[14px]">{formatUSDC(stats.totalEscrowed)}</span>
              </div>
              <div className="px-3 py-1.5 rounded-[10px] bg-pix-bg border border-[var(--color-pix-hairline)] text-xs font-medium">
                <span className="text-pix-dim font-sans text-[12px] uppercase tracking-wider mr-1.5">Proven</span>
                <span className="text-pix-accent font-mono font-medium text-[14px]">{stats.totalVerdicts} Tranche</span>
              </div>
            </div>

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-pix-bg border border-[var(--color-pix-hairline)] rounded-[10px] p-1">
              {(["Donor", "Field Worker", "Reviewer"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`text-[12px] font-sans font-semibold uppercase tracking-wider px-3 py-1 rounded-[8px] transition-all cursor-pointer ${
                    role === r
                      ? "bg-pix-accent text-[#1D1D26] shadow-sm"
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
        <div className="border-t border-[var(--color-pix-hairline)] bg-pix-bg/70 px-5">
          <div className="max-w-7xl mx-auto flex items-center space-x-2 overflow-x-auto py-2.5 scrollbar-none">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/campaigns" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-[13px] font-sans font-semibold uppercase tracking-wider px-4 py-2 rounded-[10px] border transition-all flex items-center space-x-2 flex-shrink-0 ${
                    isActive
                      ? "bg-pix-accent text-[#1D1D26] border-pix-accent shadow-sm"
                      : "bg-pix-panel text-pix-dim border-[var(--color-pix-hairline)] hover:text-pix-ink hover:border-[var(--color-pix-accent)]/40"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
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
