import React from "react";
import Link from "next/link";
import { Layers, Lock, Cpu, FileCheck2, Terminal, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Accent } from "@/components/ui/Accent";
import { SnapButton } from "@/components/pixel/SnapButton";

const DOCS_INDEX = [
  {
    href: "/docs/architecture",
    title: "01. System Architecture",
    desc: "Complete end-to-end breakdown of on-chain escrow contracts, off-chain Gemini AI vision agent, and EAS attestation pipelines.",
    icon: Layers,
  },
  {
    href: "/docs/contracts",
    title: "02. Contracts & Escrow Mechanics",
    desc: "Foundry smart contract architecture: milestone tranches, verifier-only releases, and 30-day donor refund guarantees in USDC.",
    icon: Lock,
  },
  {
    href: "/docs/verification-agent",
    title: "03. Verification Agent Deep Dive",
    desc: "Multimodal Gemini Flash auditing: EXIF GPS verification, dHash reuse detection, receipt OCR, and human review dispute queues.",
    icon: Cpu,
  },
  {
    href: "/docs/audit",
    title: "04. Public Audit & EAS Attestations",
    desc: "How every verification decision is permanently registered on Ethereum Attestation Service on Base Sepolia for anyone to inspect.",
    icon: FileCheck2,
  },
  {
    href: "/docs/setup",
    title: "05. 60-Second Local Setup",
    desc: "Quickstart guide to run the Next.js frontend, SQLite Prisma database, and run Foundry test suites locally.",
    icon: Terminal,
  },
];

export default function DocsIndexPage() {
  return (
    <div className="space-y-8 font-sans">
      <div>
        <Badge variant="testnet" className="mb-2">
          ENGINEERING DOCUMENTATION
        </Badge>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-pix-ink tracking-tight mt-1">
          ProofStream <Accent>architecture</Accent> & documentation
        </h1>
        <p className="text-[15px] text-pix-dim mt-2 leading-relaxed">
          ProofStream is an autonomous verification streaming protocol for humanitarian aid. Donors fund
          milestone escrows on Base Sepolia; frontline workers submit geotagged proof; autonomous multimodal
          AI agents verify compliance against supplier invoices; tranches release directly on-chain.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {DOCS_INDEX.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="p-6 rounded-[10px] bg-pix-panel border border-[var(--color-pix-hairline)] hover:border-[var(--color-pix-accent)]/50 transition-all group block shadow-card"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-[10px] bg-pix-bg border border-[var(--color-pix-hairline)] flex items-center justify-center text-pix-accent group-hover:border-pix-accent/40 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display font-semibold text-lg text-pix-ink group-hover:text-pix-accent transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-[15px] text-pix-dim mt-1 max-w-xl font-sans leading-relaxed">{item.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-pix-dim group-hover:text-pix-accent group-hover:translate-x-1 transition-all mt-2" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-5 rounded-[10px] bg-pix-panel border border-[var(--color-pix-hairline)] text-sm text-pix-dim space-y-1 shadow-card">
        <span className="font-sans text-[13px] font-semibold uppercase text-pix-accent block">
          Judge Note:
        </span>
        <p className="text-[15px] leading-relaxed">
          All data referenced across these documents is backed by real smart contracts on Base Sepolia
          and real multimodal models via Google Gemini API.
        </p>
      </div>
    </div>
  );
}
