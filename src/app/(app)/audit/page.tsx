"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCheck2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Calendar,
  Layers,
  Search,
  Hash,
  X,
  FileText,
  Lock,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { SnapButton } from "@/components/pixel/SnapButton";
import { Typewriter } from "@/components/pixel/Typewriter";
import { formatAddress, formatTxHash, formatUSDC } from "@/lib/format";
import { BRAND } from "@/lib/brand";

export default function PublicAuditPage() {
  const [auditRows, setAuditRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.length > 0) {
          const rows: any[] = [];
          data.data.forEach((camp: any) => {
            camp.milestones.forEach((m: any) => {
              // Collect verified or released milestones
              if (m.released || m.attestationUID || m.submissions?.length > 0) {
                const sub = m.submissions?.[0];
                rows.push({
                  id: m.id,
                  campaignTitle: camp.title,
                  ngoName: camp.ngoName,
                  milestoneIdx: m.idx + 1,
                  description: m.description,
                  amount: m.amount,
                  status: m.status,
                  released: m.released,
                  attestationUID: m.attestationUID,
                  txHash: m.releaseTxHash || sub?.verdict?.txHash,
                  releasedAt: sub?.verdict?.releasedAt || m.updatedAt,
                  verdict: sub?.verdict,
                  evidence: sub?.evidence || [],
                  siteAddress: camp.siteAddress,
                });
              }
            });
          });
          setAuditRows(rows);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredRows = auditRows.filter((r) =>
    r.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.attestationUID && r.attestationUID.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-pix-gold">
        <div>
          <Badge variant="verified" className="mb-2">
            PUBLIC CRYPTOGRAPHIC LEDGER
          </Badge>
          <h1 className="font-heading text-xl sm:text-2xl text-pix-ink uppercase tracking-wide">
            <Typewriter text="ON-CHAIN AUDIT EXPLORER" speed={30} />
          </h1>
          <p className="font-body text-xs text-pix-dim mt-1 max-w-2xl">
            Anyone can inspect humanitarian milestones, AI verification reasoning, IPFS evidence
            hashes, and Base Sepolia attestations without an account.
          </p>
        </div>

        <a
          href={BRAND.links.baseScan}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start"
        >
          <SnapButton variant="secondary" size="sm">
            <span>BASESCAN EXPLORER</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-pix-cyan" />
          </SnapButton>
        </a>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-pix-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by milestone, reasoning, or UID..."
          className="w-full pl-10 pr-4 py-2.5 bg-pix-panel border-2 border-pix-dim/40 font-body text-xs text-pix-ink placeholder:text-pix-dim/50 focus:outline-none focus:border-pix-gold transition-all"
        />
      </div>

      {/* Audit Table / Card Feed */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 h-28 bg-pix-panel border-2 border-pix-dim/30 animate-pulse" />
          ))}
        </div>
      ) : filteredRows.length === 0 ? (
        <GlassCard className="p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 bg-pix-panel border-2 border-pix-dim/30 flex items-center justify-center mx-auto text-pix-dim mb-4">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-sm text-pix-ink uppercase">NO ATTESTATION RECORDS FOUND</h3>
          <p className="font-body text-xs text-pix-dim mt-1">
            Verified milestones will appear here as soon as field proofs pass audit.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {filteredRows.map((row) => (
            <GlassCard
              key={row.id}
              className="p-5 sm:p-6 cursor-pointer hover:border-pix-gold transition-all"
              onClick={() => setSelectedItem(row)}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={row.released ? "released" : "pending"}>
                      {row.released ? "Tranche Released · 94%" : "Pending"}
                    </Badge>
                    <span className="font-heading text-[10px] uppercase text-pix-gold">
                      Tranche #{row.milestoneIdx} · <span className="font-body text-pix-cyan">{formatUSDC(row.amount)}</span>
                    </span>
                    <span className="font-body text-xs text-pix-dim">({row.campaignTitle})</span>
                  </div>

                  <h3 className="font-heading text-sm sm:text-base text-pix-ink hover:text-pix-gold transition-colors">
                    {row.description}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-body text-pix-dim pt-1">
                    {row.attestationUID && (
                      <span>
                        UID: <span className="text-pix-cyan">{formatTxHash(row.attestationUID)}</span>
                      </span>
                    )}
                    {row.txHash && (
                      <span>
                        Tx: <span className="text-pix-cyan">{formatTxHash(row.txHash)}</span>
                      </span>
                    )}
                    <span>
                      {new Date(row.releasedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end lg:self-center">
                  <SnapButton
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(row);
                    }}
                  >
                    <span>INSPECT PROOF</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-pix-cyan" />
                  </SnapButton>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Inspector Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-pix-panel border-4 border-pix-gold p-6 sm:p-8 space-y-6 shadow-pixel-lg"
            >
              {/* Close Button */}
              <div className="absolute top-4 right-4">
                <SnapButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedItem(null)}
                >
                  <X className="w-5 h-5" />
                </SnapButton>
              </div>

              <div>
                <Badge variant="verified" className="mb-2">
                  VERIFIED ON-CHAIN PROOF
                </Badge>
                <h2 className="font-heading text-lg sm:text-xl text-pix-ink uppercase tracking-wide">
                  Cryptographic Audit Inspection
                </h2>
                <p className="font-body text-xs text-pix-dim mt-1">
                  Tranche #{selectedItem.milestoneIdx} of {selectedItem.campaignTitle}
                </p>
              </div>

              {/* Hashes & Explorer Links */}
              <div className="space-y-3 p-4 bg-pix-bg border-2 border-pix-dim/30 font-body text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-heading text-[10px] uppercase text-pix-dim">EAS Attestation UID</span>
                  <span className="text-pix-cyan truncate max-w-[240px]">
                    {selectedItem.attestationUID || "Logged via Contract Event"}
                  </span>
                </div>

                {selectedItem.txHash && (
                  <div className="flex justify-between items-center">
                    <span className="font-heading text-[10px] uppercase text-pix-dim">Base Sepolia Tx</span>
                    <a
                      href={`https://sepolia.basescan.org/tx/${selectedItem.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pix-cyan hover:underline flex items-center space-x-1"
                    >
                      <span className="truncate max-w-[200px]">{selectedItem.txHash}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Gemini Agent Reasoning */}
              {selectedItem.verdict && (
                <div className="space-y-2">
                  <span className="font-heading text-xs uppercase text-pix-mint flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-pix-mint" />
                    <span>
                      Gemini Multimodal Auditor Reasoning ({Math.round(selectedItem.verdict.confidence * 100)}% Confidence)
                    </span>
                  </span>

                  <div className="p-4 bg-pix-bg border-2 border-pix-mint/30 text-xs font-body text-pix-dim leading-relaxed whitespace-pre-line">
                    {selectedItem.verdict.reasoning}
                  </div>
                </div>
              )}

              {/* Evidence & IPFS CIDs */}
              <div className="space-y-2">
                <span className="font-heading text-xs uppercase text-pix-ink block">
                  IPFS Pinned Evidence (Pinata Gateway)
                </span>
                <div className="space-y-2">
                  {selectedItem.evidence?.map((ev: any) => (
                    <div
                      key={ev.id}
                      className="p-3 bg-pix-bg border-2 border-pix-dim/20 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-pix-cyan" />
                        <span className="font-body text-pix-ink">{ev.fileName || ev.kind}</span>
                      </div>
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${ev.cid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pix-cyan hover:underline font-body text-[11px] flex items-center space-x-1"
                      >
                        <span>CID: {formatAddress(ev.cid)}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <SnapButton
                  variant="secondary"
                  size="md"
                  onClick={() => setSelectedItem(null)}
                  className="w-full"
                >
                  CLOSE INSPECTOR
                </SnapButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
