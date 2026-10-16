import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, ArrowRight, Layers, Lock, Cpu, Globe2, FileCheck2 } from "lucide-react";

export default function DocsArchitecturePage() {
  return (
    <div className="space-y-8 font-body">
      <div>
        <Badge variant="verified" className="mb-2">
          SECTION 01
        </Badge>
        <h1 className="font-heading text-2xl sm:text-3xl text-pix-ink uppercase tracking-wide">
          System Architecture
        </h1>
        <p className="text-sm text-pix-dim mt-2 leading-relaxed">
          ProofStream decouples funding custody, frontline evidence capture, autonomous multimodal
          auditing, and cryptographic attestation into rigorous on-chain and off-chain boundaries.
        </p>
      </div>

      {/* Architecture ASCII Flow */}
      <div className="p-5 bg-pix-bg border-2 border-pix-gold/40 text-xs font-body overflow-x-auto">
        <span className="font-heading text-[10px] uppercase text-pix-gold block mb-3">
          SYSTEM COMPONENT TOPOLOGY
        </span>
        <pre className="text-pix-ink font-body leading-relaxed">
{`┌──────────────────────────┐      ┌──────────────────────────┐
│   DONOR WALLET           │      │   FIELD WORKER           │
│   (Wagmi / Base Sepolia) │      │   (Mobile Camera / GPS)  │
└────────────┬─────────────┘      └────────────┬─────────────┘
             │ fund() USDC                     │ multipart/form-data
             ▼                                 ▼
┌──────────────────────────┐      ┌──────────────────────────┐
│   CampaignEscrow.sol     │      │   Next.js API Routes     │
│   - Milestone Tranches   │      │   - Rate limited, Zod    │
│   - 30-Day Refund Clock  │      └────────────┬─────────────┘
└────────────▲─────────────┘                   │
             │                                 ▼
             │ release()          ┌──────────────────────────┐
             │ (VERIFIER_ROLE)    │   Pinata IPFS Gateway    │
             │                    │   - Immutable CIDs       │
             │                    └────────────┬─────────────┘
             │                                 │
┌────────────┴─────────────┐                   ▼
│   ChainSigner Engine     │◄─────┌──────────────────────────┐
│   - Gas-Optimized Relayer│      │   Gemini 1.5 Agent       │
│   - EAS Attestation EIP  │      │   - EXIF GPS Geofence    │
└──────────────────────────┘      │   - dHash Fraud Check    │
                                  │   - Receipt OCR Engine   │
                                  └──────────────────────────┘`}
        </pre>
      </div>

      {/* Boundary Specification */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg text-pix-ink uppercase tracking-wide border-b-2 border-pix-dim/20 pb-2">
          On-Chain vs Off-Chain Boundary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-pix-bg border-2 border-pix-cyan/30 space-y-2">
            <span className="font-heading text-xs uppercase text-pix-cyan block">
              ON-CHAIN BOUNDARY (BASE SEPOLIA)
            </span>
            <ul className="text-xs text-pix-dim space-y-1.5 list-disc list-inside">
              <li>Custody of USDC escrow balance via <code className="text-pix-cyan">CampaignEscrow.sol</code>.</li>
              <li>Milestone release triggers limited strictly to <code className="text-pix-cyan">VERIFIER_ROLE</code>.</li>
              <li>Autonomous 30-day donor refund guarantee callable by anyone if unproven.</li>
              <li>Immutable attestation registries via Ethereum Attestation Service (EAS).</li>
            </ul>
          </div>

          <div className="p-4 bg-pix-bg border-2 border-pix-gold/30 space-y-2">
            <span className="font-heading text-xs uppercase text-pix-gold block">
              OFF-CHAIN BOUNDARY (VERIFIER ENGINE)
            </span>
            <ul className="text-xs text-pix-dim space-y-1.5 list-disc list-inside">
              <li>High-resolution visual inspection with Google Gemini multimodal model.</li>
              <li>Difference Hash (dHash) duplicate and reuse fraud prevention algorithms.</li>
              <li>Optical Character Recognition (OCR) cross-referencing vendor line-item bills.</li>
              <li>Pinata IPFS file pinning and metadata content-addressing.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-6 border-t-2 border-pix-dim/20">
        <Link href="/docs" className="text-xs font-heading uppercase text-pix-dim hover:text-pix-gold flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>INDEX</span>
        </Link>
        <Link href="/docs/contracts" className="text-xs font-heading uppercase text-pix-gold hover:text-pix-ink flex items-center space-x-1">
          <span>02. CONTRACTS & ESCROW</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
