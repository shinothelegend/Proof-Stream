import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, ArrowRight, Cpu, Eye, FileSearch, ShieldAlert } from "lucide-react";

export default function DocsVerificationAgentPage() {
  return (
    <div className="space-y-8 font-body">
      <div>
        <Badge variant="verified" className="mb-2">
          SECTION 03
        </Badge>
        <h1 className="font-heading text-2xl sm:text-3xl text-pix-ink uppercase tracking-wide">
          Verification Agent Deep Dive
        </h1>
        <p className="text-sm text-pix-dim mt-2 leading-relaxed">
          The ProofStream verification engine combines sensory EXIF validation, perceptual hashing,
          and Google Gemini multimodal inference into a strict 4-stage pipeline.
        </p>
      </div>

      {/* 4 Pipeline Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-pix-bg border-2 border-pix-dim/30 space-y-2">
          <div className="flex items-center space-x-2 text-pix-gold font-heading text-xs uppercase">
            <span className="w-5 h-5 bg-pix-panel border border-pix-gold flex items-center justify-center">1</span>
            <span>EXIF Geofence Audit</span>
          </div>
          <p className="text-xs text-pix-dim leading-relaxed">
            Extracts native camera metadata (latitude, longitude, timestamp). Calculates haversine
            distance against the registered milestone GPS coordinates. Photos outside a 5km tolerance
            are flagged for manual auditor review.
          </p>
        </div>

        <div className="p-4 bg-pix-bg border-2 border-pix-dim/30 space-y-2">
          <div className="flex items-center space-x-2 text-pix-gold font-heading text-xs uppercase">
            <span className="w-5 h-5 bg-pix-panel border border-pix-gold flex items-center justify-center">2</span>
            <span>dHash Image Reuse Prevention</span>
          </div>
          <p className="text-xs text-pix-dim leading-relaxed">
            Generates a 64-bit gradient difference hash (dHash) for every submitted photo. Computes
            Hamming distance against past historical submissions. If distance ≤ 10, the proof is
            immediately rejected as fraudulent recycled evidence.
          </p>
        </div>

        <div className="p-4 bg-pix-bg border-2 border-pix-dim/30 space-y-2">
          <div className="flex items-center space-x-2 text-pix-gold font-heading text-xs uppercase">
            <span className="w-5 h-5 bg-pix-panel border border-pix-gold flex items-center justify-center">3</span>
            <span>Gemini Vision & OCR Analysis</span>
          </div>
          <p className="text-xs text-pix-dim leading-relaxed">
            Multimodal LLM verifies installation integrity (e.g. submersible pump, solar panels, water pipes)
            and performs OCR on supplier receipts, extracting vendor name, tax ID, line-item totals, and currencies.
          </p>
        </div>

        <div className="p-4 bg-pix-bg border-2 border-pix-dim/30 space-y-2">
          <div className="flex items-center space-x-2 text-pix-gold font-heading text-xs uppercase">
            <span className="w-5 h-5 bg-pix-panel border border-pix-gold flex items-center justify-center">4</span>
            <span>Confidence Scoring & Escalation</span>
          </div>
          <p className="text-xs text-pix-dim leading-relaxed">
            Produces a confidence score between 0.0 and 1.0. If confidence ≥ 0.85 with zero fraud flags,
            it signs on-chain release and logs an EAS attestation. If confidence &lt; 0.85, it diverts to
            the human auditor dispute queue.
          </p>
        </div>
      </div>

      {/* Decision Matrix */}
      <div className="p-5 bg-pix-bg border-2 border-pix-dim/30 space-y-3">
        <h3 className="font-heading text-xs uppercase text-pix-ink">
          Verification Decision Matrix
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-body text-left">
            <thead>
              <tr className="border-b-2 border-pix-dim/20 font-heading text-[10px] uppercase text-pix-dim">
                <th className="py-2 pr-4">Confidence</th>
                <th className="py-2 pr-4">Security Flags</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Autonomous Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pix-dim/10">
              <tr>
                <td className="py-2 text-pix-cyan font-bold">≥ 85%</td>
                <td className="py-2 text-pix-mint">None</td>
                <td className="py-2 text-pix-mint font-heading">PASSED</td>
                <td className="py-2 text-pix-dim">Direct on-chain release + EAS attestation</td>
              </tr>
              <tr>
                <td className="py-2 text-pix-cyan font-bold">&lt; 85%</td>
                <td className="py-2 text-pix-dim">Mild anomaly</td>
                <td className="py-2 text-pix-gold font-heading">FLAGGED</td>
                <td className="py-2 text-pix-dim">Held in auditor queue for 48h human signoff</td>
              </tr>
              <tr>
                <td className="py-2 text-pix-cyan font-bold">Any</td>
                <td className="py-2 text-pix-alert">dHash Duplicate</td>
                <td className="py-2 text-pix-alert font-heading">REJECTED</td>
                <td className="py-2 text-pix-dim">Permanent reject; evidence blacklisted</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-6 border-t-2 border-pix-dim/20">
        <Link href="/docs/contracts" className="text-xs font-heading uppercase text-pix-dim hover:text-pix-gold flex items-center space-x-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>02. CONTRACTS</span>
        </Link>
        <Link href="/docs/audit" className="text-xs font-heading uppercase text-pix-gold hover:text-pix-ink flex items-center space-x-1">
          <span>04. PUBLIC AUDIT & EAS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
