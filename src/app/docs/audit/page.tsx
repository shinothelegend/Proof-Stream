import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, ArrowRight, FileCheck2, ExternalLink, ShieldCheck, Check } from "lucide-react";
import { BRAND } from "@/lib/brand";

export default function DocsAuditPage() {
  return (
    <div className="space-y-8 font-body">
      <div>
        <Badge variant="verified" className="mb-2">
          SECTION 04
        </Badge>
        <h1 className="font-heading text-2xl sm:text-3xl text-pix-ink uppercase tracking-wide">
          Public Audit & EAS Attestations
        </h1>
        <p className="text-sm text-pix-dim mt-2 leading-relaxed">
          ProofStream eliminates back-office black boxes. Every milestone approval triggers a cryptographic
          attestation on Ethereum Attestation Service (EAS) deployed on Base Sepolia.
        </p>
      </div>

      {/* EAS Schema Structure */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg text-pix-ink uppercase tracking-wide border-b-2 border-pix-dim/20 pb-2">
          EAS Schema Definition
        </h2>
        <div className="p-4 bg-pix-bg border-2 border-pix-gold/30 text-xs font-body">
          <span className="font-heading text-[10px] uppercase text-pix-gold block mb-2">
            ATTESTATION SCHEMA FIELDS
          </span>
          <pre className="text-pix-ink leading-relaxed">
{`bytes32 milestoneId       // Unique milestone UUID
address recipient         // NGO verified wallet receiving USDC
uint256 amountReleased    // Amount in USDC (6 decimals)
string  ipfsEvidenceCID   // Pinata pinned evidence directory
bool    passedAudit       // True if Gemini AI verified
uint16  confidenceScore   // Basis points (e.g. 9400 = 94.00%)
string  verdictReasoning  // Model audit justification text`}
          </pre>
        </div>
      </div>

      {/* Verification Steps for Anyone */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg text-pix-ink uppercase tracking-wide border-b-2 border-pix-dim/20 pb-2">
          How to Independently Verify Any Claim
        </h2>

        <div className="space-y-3 text-xs text-pix-dim leading-relaxed">
          <div className="flex items-start space-x-3 p-3 bg-pix-bg border-2 border-pix-dim/30">
            <span className="font-heading text-pix-gold uppercase">1.</span>
            <div>
              <span className="font-heading text-pix-ink uppercase">Find the Attestation UID:</span> Open the{" "}
              <Link href="/audit" className="text-pix-cyan underline">Public Audit Explorer</Link> and copy
              the 66-character attestation UID or transaction hash.
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-pix-bg border-2 border-pix-dim/30">
            <span className="font-heading text-pix-gold uppercase">2.</span>
            <div>
              <span className="font-heading text-pix-ink uppercase">Inspect BaseScan:</span> Query the transaction on{" "}
              <a href={BRAND.links.baseScan} target="_blank" rel="noopener noreferrer" className="text-pix-cyan underline">
                Base Sepolia BaseScan
              </a>. Verify the event emissions from the EAS registry contract.
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-pix-bg border-2 border-pix-dim/30">
            <span className="font-heading text-pix-gold uppercase">3.</span>
            <div>
              <span className="font-heading text-pix-ink uppercase">Fetch IPFS Raw Evidence:</span> Retrieve the
              original high-res installation image and vendor receipt from any public IPFS gateway via its CID.
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-6 border-t-2 border-pix-dim/20">
        <Link href="/docs/verification-agent" className="text-xs font-heading uppercase text-pix-dim hover:text-pix-gold flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>03. VERIFICATION AGENT</span>
        </Link>
        <Link href="/docs/setup" className="text-xs font-heading uppercase text-pix-gold hover:text-pix-ink flex items-center space-x-1">
          <span>05. 60-SEC SETUP</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
