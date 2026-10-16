import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, ArrowRight, Lock, ShieldCheck, RefreshCw, FileCode } from "lucide-react";

export default function DocsContractsPage() {
  return (
    <div className="space-y-8 font-body">
      <div>
        <Badge variant="verified" className="mb-2">
          SECTION 02
        </Badge>
        <h1 className="font-heading text-2xl sm:text-3xl text-pix-ink uppercase tracking-wide">
          Contracts & Escrow Mechanics
        </h1>
        <p className="text-sm text-pix-dim mt-2 leading-relaxed">
          The ProofStream smart contract suite is written in Solidity 0.8.20 and deployed to Base Sepolia.
          Contracts enforce non-custodial milestone-locked funding with programmatic donor safeguards.
        </p>
      </div>

      {/* Contract Functions Table */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg text-pix-ink uppercase tracking-wide border-b-2 border-pix-dim/20 pb-2">
          Core Contract Methods (`CampaignEscrow.sol`)
        </h2>

        <div className="space-y-3">
          <div className="p-4 bg-pix-bg border-2 border-pix-dim/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-heading text-xs text-pix-cyan uppercase">
                function fund(uint256 amount) external
              </span>
              <Badge variant="testnet">Public Access</Badge>
            </div>
            <p className="text-xs text-pix-dim leading-relaxed">
              Transfers USDC from the caller into escrow custody. Records cumulative donor contributions
              in <code className="text-pix-cyan">donations[donor]</code> to preserve proportional refund claims.
            </p>
          </div>

          <div className="p-4 bg-pix-bg border-2 border-pix-dim/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-heading text-xs text-pix-mint uppercase">
                function release(uint256 milestoneIdx, address recipient) external
              </span>
              <Badge variant="verified">VERIFIER_ROLE Only</Badge>
            </div>
            <p className="text-xs text-pix-dim leading-relaxed">
              Triggers the release of a specific milestone tranche to the designated NGO address.
              Can ONLY be invoked by the cryptographic key holding <code className="text-pix-cyan">VERIFIER_ROLE</code>,
              preventing unauthorized drain. Prevents double-release via strict boolean guards.
            </p>
          </div>

          <div className="p-4 bg-pix-bg border-2 border-pix-dim/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-heading text-xs text-pix-alert uppercase">
                function refund() external
              </span>
              <Badge variant="rejected">Donor Safeguard</Badge>
            </div>
            <p className="text-xs text-pix-dim leading-relaxed">
              If a campaign does not complete its milestones before the 30-day deadline, donors
              can autonomously call this function to recover their remaining pro-rata USDC balance.
              No admin permission or multi-sig veto can stop a valid refund.
            </p>
          </div>
        </div>
      </div>

      {/* Security Invariants */}
      <div className="p-5 bg-pix-bg border-2 border-pix-gold/30 space-y-3">
        <h3 className="font-heading text-xs uppercase text-pix-gold">
          Formal Contract Invariants
        </h3>
        <ul className="text-xs text-pix-dim space-y-2 list-disc list-inside">
          <li><span className="text-pix-ink font-heading">Solvency Invariant:</span> Escrow balance must always equal or exceed total unreleased milestone allocations.</li>
          <li><span className="text-pix-ink font-heading">Auth Invariant:</span> No entity other than the audited backend verifier can release funds.</li>
          <li><span className="text-pix-ink font-heading">Timelock Invariant:</span> The refund window opens unconditionally 30 days after escrow creation.</li>
        </ul>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-6 border-t-2 border-pix-dim/20">
        <Link href="/docs/architecture" className="text-xs font-heading uppercase text-pix-dim hover:text-pix-gold flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>01. ARCHITECTURE</span>
        </Link>
        <Link href="/docs/verification-agent" className="text-xs font-heading uppercase text-pix-gold hover:text-pix-ink flex items-center space-x-1">
          <span>03. VERIFICATION AGENT</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
