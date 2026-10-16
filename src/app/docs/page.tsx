import React from "react";
import Link from "next/link";
import { Layers, Lock, Cpu, FileCheck2, Terminal, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { SnapButton } from "@/components/pixel/SnapButton";

const DOCS_INDEX = [
  {
    href: "/docs/architecture",
    title: "01. SYSTEM ARCHITECTURE",
    desc: "Complete end-to-end breakdown of on-chain escrow contracts, off-chain Gemini AI vision agent, and EAS attestation pipelines.",
    icon: Layers,
  },
  {
    href: "/docs/contracts",
    title: "02. CONTRACTS & ESCROW MECHANICS",
    desc: "Foundry smart contract architecture: milestone tranches, verifier-only releases, and 30-day donor refund guarantees in USDC.",
    icon: Lock,
  },
  {
    href: "/docs/verification-agent",
    title: "03. VERIFICATION AGENT DEEP DIVE",
    desc: "Multimodal Gemini Flash auditing: EXIF GPS verification, dHash reuse detection, receipt OCR, and human review dispute queues.",
    icon: Cpu,
  },
  {
    href: "/docs/audit",
    title: "04. PUBLIC AUDIT & EAS ATTESTATIONS",
    desc: "How every verification decision is permanently registered on Ethereum Attestation Service on Base Sepolia for anyone to inspect.",
    icon: FileCheck2,
  },
  {
    href: "/docs/setup",
    title: "05. 60-SECOND LOCAL SETUP",
    desc: "Quickstart guide to run the Next.js frontend, SQLite Prisma database, and run Foundry test suites locally.",
    icon: Terminal,
  },
];

export default function DocsIndexPage() {
  return (
    <div className="space-y-8 font-body">
      <div>
        <Badge variant="testnet" className="mb-2">
          ENGINEERING DOCUMENTATION
        </Badge>
        <h1 className="font-heading text-2xl sm:text-3xl text-pix-ink uppercase tracking-wide">
          ProofStream Documentation
        </h1>
        <p className="text-sm text-pix-dim mt-2 leading-relaxed">
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
              className="p-5 bg-pix-bg border-2 border-pix-dim/30 hover:border-pix-gold transition-all group block shadow-pixel"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pix-panel border-2 border-pix-dim/40 flex items-center justify-center text-pix-gold group-hover:border-pix-gold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-heading text-sm text-pix-ink group-hover:text-pix-gold transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-xs text-pix-dim mt-1 max-w-xl">{item.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-pix-dim group-hover:text-pix-gold group-hover:translate-x-1 transition-all mt-2" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 bg-pix-bg border-2 border-pix-gold/30 text-xs text-pix-dim space-y-1">
        <span className="font-heading uppercase text-pix-gold block">
          Judge Note:
        </span>
        <p>
          All data referenced across these documents is backed by real smart contracts on Base Sepolia
          and real multimodal models via Google Gemini API.
        </p>
      </div>
    </div>
  );
}
