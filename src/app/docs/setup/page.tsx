import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Terminal, CheckCircle2, Play } from "lucide-react";

export default function DocsSetupPage() {
  return (
    <div className="space-y-8 font-body">
      <div>
        <Badge variant="verified" className="mb-2">
          SECTION 05
        </Badge>
        <h1 className="font-heading text-2xl sm:text-3xl text-pix-ink uppercase tracking-wide">
          60-Second Local Setup
        </h1>
        <p className="text-sm text-pix-dim mt-2 leading-relaxed">
          ProofStream is engineered for turnkey zero-friction developer onboarding. Follow these 4 steps
          to launch the full stack locally in under 60 seconds.
        </p>
      </div>

      {/* Step by Step Commands */}
      <div className="space-y-4">
        <div className="p-4 bg-pix-bg border-2 border-pix-dim/30 space-y-2">
          <div className="flex items-center space-x-2 text-pix-gold font-heading text-xs uppercase">
            <span className="w-5 h-5 bg-pix-panel border border-pix-gold flex items-center justify-center">1</span>
            <span>Clone & Install Dependencies</span>
          </div>
          <pre className="p-3 bg-pix-panel border border-pix-dim/20 text-xs text-pix-cyan font-body overflow-x-auto">
{`git clone https://github.com/shinothelegend/Proof-Stream.git
cd Proof-Stream
npm install`}
          </pre>
        </div>

        <div className="p-4 bg-pix-bg border-2 border-pix-dim/30 space-y-2">
          <div className="flex items-center space-x-2 text-pix-gold font-heading text-xs uppercase">
            <span className="w-5 h-5 bg-pix-panel border border-pix-gold flex items-center justify-center">2</span>
            <span>Configure Environment Variables</span>
          </div>
          <p className="text-xs text-pix-dim">
            Copy the template file. Pre-configured testnet defaults are already provided for instant testing:
          </p>
          <pre className="p-3 bg-pix-panel border border-pix-dim/20 text-xs text-pix-cyan font-body overflow-x-auto">
{`cp .env.example .env`}
          </pre>
        </div>

        <div className="p-4 bg-pix-bg border-2 border-pix-dim/30 space-y-2">
          <div className="flex items-center space-x-2 text-pix-gold font-heading text-xs uppercase">
            <span className="w-5 h-5 bg-pix-panel border border-pix-gold flex items-center justify-center">3</span>
            <span>Initialize & Seed SQLite Database</span>
          </div>
          <pre className="p-3 bg-pix-panel border border-pix-dim/20 text-xs text-pix-cyan font-body overflow-x-auto">
{`npx prisma db push
npx prisma db seed`}
          </pre>
        </div>

        <div className="p-4 bg-pix-bg border-2 border-pix-dim/30 space-y-2">
          <div className="flex items-center space-x-2 text-pix-gold font-heading text-xs uppercase">
            <span className="w-5 h-5 bg-pix-panel border border-pix-gold flex items-center justify-center">4</span>
            <span>Start Local Dev Server</span>
          </div>
          <pre className="p-3 bg-pix-panel border border-pix-dim/20 text-xs text-pix-cyan font-body overflow-x-auto">
{`npm run dev`}
          </pre>
          <p className="text-xs text-pix-dim">
            Open <code className="text-pix-cyan">http://localhost:3000</code> in your browser to view the Arcade Ledger interface.
          </p>
        </div>
      </div>

      {/* Foundry Test Suite */}
      <div className="p-5 bg-pix-bg border-2 border-pix-mint/40 space-y-3">
        <h3 className="font-heading text-xs uppercase text-pix-mint">
          Running Smart Contract Foundry Tests
        </h3>
        <p className="text-xs text-pix-dim leading-relaxed">
          To execute the full Foundry test suite against the escrow contracts:
        </p>
        <pre className="p-3 bg-pix-panel border border-pix-dim/20 text-xs text-pix-mint font-body overflow-x-auto">
{`forge test -vvv`}
        </pre>
        <p className="text-xs text-pix-dim">
          All test cases for authorization, milestone release, double-spend prevention, and timelocked refunds must pass.
        </p>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-6 border-t-2 border-pix-dim/20">
        <Link href="/docs/audit" className="text-xs font-heading uppercase text-pix-dim hover:text-pix-gold flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>04. PUBLIC AUDIT & EAS</span>
        </Link>
        <Link href="/campaigns" className="text-xs font-heading uppercase text-pix-gold hover:text-pix-ink flex items-center space-x-1">
          <span>LAUNCH QUEST BOARD →</span>
        </Link>
      </div>
    </div>
  );
}
