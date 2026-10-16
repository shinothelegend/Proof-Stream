"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Layers, Lock, Cpu, FileCheck2, Terminal, ArrowLeft, Menu, X } from "lucide-react";
import { PixelDissolve } from "@/components/pixel/PixelDissolve";
import { SnapButton } from "@/components/pixel/SnapButton";
import { BRAND } from "@/lib/brand";

const DOCS_NAV = [
  { href: "/docs", label: "00. OVERVIEW", icon: BookOpen },
  { href: "/docs/architecture", label: "01. ARCHITECTURE", icon: Layers },
  { href: "/docs/contracts", label: "02. CONTRACTS & ESCROW", icon: Lock },
  { href: "/docs/verification-agent", label: "03. VERIFICATION AGENT", icon: Cpu },
  { href: "/docs/audit", label: "04. PUBLIC AUDIT & EAS", icon: FileCheck2 },
  { href: "/docs/setup", label: "05. 60-SEC SETUP", icon: Terminal },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-pix-bg text-pix-ink flex flex-col font-body">
      {/* Top HUD Nav */}
      <header className="sticky top-0 z-40 bg-pix-panel border-b-2 border-pix-dim/30 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-heading text-xs uppercase tracking-wider text-pix-gold">
                PROOFSTREAM
              </span>
              <span className="text-pix-dim">▸</span>
              <span className="font-heading text-xs uppercase tracking-wider text-pix-ink">
                DOCS
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/campaigns" className="hidden sm:inline-block">
              <SnapButton variant="secondary" size="sm">
                LAUNCH QUEST BOARD →
              </SnapButton>
            </Link>
            <PixelDissolve />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 bg-pix-bg border-2 border-pix-dim/30 text-pix-ink"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Docs Shell */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row px-4 sm:px-8 py-8 gap-8">
        {/* Left TOC Sidebar */}
        <aside
          className={`w-full md:w-64 flex-shrink-0 md:block ${
            mobileMenuOpen ? "block" : "hidden"
          }`}
        >
          <div className="sticky top-24 bg-pix-panel border-2 border-pix-dim/30 p-4 space-y-4 shadow-pixel">
            <div className="font-heading text-[10px] uppercase tracking-widest text-pix-gold border-b-2 border-pix-dim/20 pb-2">
              DOCUMENTATION INDEX
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
                    className={`flex items-center space-x-2 px-3 py-2 text-xs font-heading uppercase transition-all ${
                      isActive
                        ? "bg-pix-gold/15 text-pix-gold border-l-4 border-pix-gold"
                        : "text-pix-dim hover:text-pix-ink hover:bg-pix-bg"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t-2 border-pix-dim/20">
              <Link
                href="/"
                className="font-heading text-[11px] uppercase text-pix-dim hover:text-pix-gold flex items-center space-x-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>RETURN TO LANDING</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 min-w-0 bg-pix-panel border-2 border-pix-dim/30 p-6 sm:p-10 shadow-pixel space-y-8">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-pix-dim/30 py-6 px-4 text-center font-heading text-xs uppercase text-pix-dim">
        <span>PROOFSTREAM · {BRAND.hackathon} · ZERO-SLOP ARCADE LEDGER</span>
      </footer>
    </div>
  );
}
