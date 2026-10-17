"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Layers, Lock, Cpu, FileCheck2, Terminal, ArrowLeft, Menu, X } from "lucide-react";
import { PixelDissolve } from "@/components/pixel/PixelDissolve";
import { SnapButton } from "@/components/pixel/SnapButton";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { BRAND } from "@/lib/brand";

const DOCS_NAV = [
  { href: "/docs", label: "00. Overview", icon: BookOpen },
  { href: "/docs/architecture", label: "01. Architecture", icon: Layers },
  { href: "/docs/contracts", label: "02. Contracts & Escrow", icon: Lock },
  { href: "/docs/verification-agent", label: "03. Verification Agent", icon: Cpu },
  { href: "/docs/audit", label: "04. Public Audit & EAS", icon: FileCheck2 },
  { href: "/docs/setup", label: "05. 60-Sec Setup", icon: Terminal },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-pix-bg text-pix-ink flex flex-col font-sans">
      {/* Top HUD Nav */}
      <header className="sticky top-0 z-40 bg-pix-panel/90 backdrop-blur-md border-b border-[var(--color-pix-hairline)] px-5 sm:px-8 py-3.5 shadow-panel">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              <BrandLogo size={26} showWordmark={true} />
            </Link>
            <span className="text-pix-hairline">/</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-pix-dim">
              Documentation
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <SnapButton href="/campaigns" variant="secondary" size="sm" className="hidden sm:inline-flex">
              LAUNCH QUEST BOARD →
            </SnapButton>
            <PixelDissolve />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-[8px] bg-pix-bg border border-[var(--color-pix-hairline)] text-pix-ink"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Docs Shell */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row px-5 sm:px-8 py-8 gap-8">
        {/* Left TOC Sidebar */}
        <aside
          className={`w-full md:w-64 flex-shrink-0 md:block ${
            mobileMenuOpen ? "block" : "hidden"
          }`}
        >
          <div className="sticky top-24 bg-pix-panel rounded-[10px] border border-[var(--color-pix-hairline)] p-4 space-y-4 shadow-card">
            <div className="font-sans text-[11px] font-semibold uppercase tracking-widest text-pix-accent border-b border-[var(--color-pix-hairline)] pb-2.5">
              Documentation Index
            </div>
            <nav className="space-y-1">
              {DOCS_NAV.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2.5 px-3 py-2 rounded-[8px] text-[13px] font-sans font-medium transition-all ${
                      isActive
                        ? "bg-pix-accent text-[#1D1D26] font-semibold shadow-sm"
                        : "text-pix-dim hover:text-pix-ink hover:bg-pix-bg"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[var(--color-pix-hairline)]">
              <Link
                href="/"
                className="font-sans text-[12px] uppercase font-semibold text-pix-dim hover:text-pix-accent flex items-center space-x-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Landing</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 max-w-4xl">
          {children}
        </main>
      </div>
    </div>
  );
}
