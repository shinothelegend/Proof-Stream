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
import { BrandLogo } from "@/components/brand/BrandLogo";
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
    <div className="space-y-8 font-sans pb-12">
      {/* Header (§6.2: brand mark in audit header) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-pix-hairline)]">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <BrandLogo size={24} showWordmark={true} />
            <Badge variant="verified">PUBLIC ON-CHAIN LEDGER</Badge>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-pix-ink tracking-tight mt-1">
            <Typewriter text="PUBLIC CRYPTOGRAPHIC AUDIT EXPLORER" speed={30} />
          </h1>
          <p className="font-sans text-[15px] text-pix-dim mt-1.5 max-w-2xl leading-relaxed">
            Anyone can inspect humanitarian milestones, AI verification reasoning, IPFS evidence
            hashes, and Base Sepolia attestations without an account.
          </p>
        </div>

        <SnapButton
          href={BRAND.links.baseScan}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          size="sm"
          className="self-start sm:self-center"
        >
          <span>BASESCAN EXPLORER</span>
          <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-pix-accent" />
        </SnapButton>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-pix-dim absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by milestone, reasoning, or UID..."
          className="w-full pl-10 pr-4 py-2.5 rounded-[10px] bg-pix-panel border border-[var(--color-pix-hairline)] font-sans text-[14px] text-pix-ink placeholder:text-pix-dim/50 focus:outline-none focus:border-pix-accent transition-all shadow-sm"
        />
      </div>

      {/* Audit Table / Card Feed */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 h-28 rounded-[10px] bg-pix-panel border border-[var(--color-pix-hairline)] animate-pulse shadow-card" />
          ))}
        </div>
      ) : filteredRows.length === 0 ? (
        <GlassCard className="p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-[10px] bg-pix-panel border border-[var(--color-pix-hairline)] flex items-center justify-center mx-auto text-pix-dim mb-4">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <h3 className="font-display font-semibold text-base text-pix-ink uppercase">No Attestation Records Found</h3>
          <p className="font-sans text-[14px] text-pix-dim mt-1">
            Verified milestones will appear here as soon as field proofs pass audit.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {filteredRows.map((row) => (
            <GlassCard
              key={row.id}
              className="p-5 sm:p-6 cursor-pointer hover:border-[var(--color-pix-accent)]/50 transition-all"
              onClick={() => setSelectedItem(row)}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Badge variant={row.released ? "released" : "pending"}>
                      {row.released ? "Tranche Released · 94%" : "Pending"}
                    </Badge>
                    <span className="font-sans text-[12px] uppercase font-semibold text-pix-accent">
                      Tranche #{row.milestoneIdx} · <span className="font-mono text-pix-accent font-medium text-sm">{formatUSDC(row.amount)}</span>
                    </span>
                    <span className="font-sans text-[13px] text-pix-dim">({row.campaignTitle})</span>
                  </div>

                  <h3 className="font-display font-semibold text-base sm:text-lg text-pix-ink hover:text-pix-accent transition-colors">
                    {row.description}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-[13px] font-mono text-pix-dim pt-1">
                    {row.attestationUID && (
                      <span>
                        UID: <span className="text-pix-accent">{formatTxHash(row.attestationUID)}</span>
                      </span>
                    )}
                    {row.txHash && (
                      <span>
                        Tx: <span className="text-pix-accent">{formatTxHash(row.txHash)}</span>
                      </span>
                    )}
                    <span className="font-sans">
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
                    <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-pix-accent" />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[12px] bg-pix-panel border border-[var(--color-pix-hairline)] p-6 sm:p-8 space-y-6 shadow-2xl"
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
                <h2 className="font-display font-bold text-xl sm:text-2xl text-pix-ink">
                  Cryptographic Audit Inspection
                </h2>
                <p className="font-sans text-[14px] text-pix-dim mt-1">
                  Tranche #{selectedItem.milestoneIdx} of {selectedItem.campaignTitle}
                </p>
              </div>

              {/* Hashes & Explorer Links */}
              <div className="space-y-3 p-4 rounded-[8px] bg-pix-bg border border-[var(--color-pix-hairline)] font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-[11px] uppercase font-semibold text-pix-dim">EAS Attestation UID</span>
                  <span className="text-pix-accent truncate max-w-[260px]">
                    {selectedItem.attestationUID || "Logged via Contract Event"}
                  </span>
                </div>

                {selectedItem.txHash && (
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-[11px] uppercase font-semibold text-pix-dim">Base Sepolia Tx</span>
                    <a
                      href={`https://sepolia.basescan.org/tx/${selectedItem.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pix-accent hover:underline flex items-center space-x-1"
                    >
                      <span className="truncate max-w-[220px]">{selectedItem.txHash}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Gemini Agent Reasoning */}
              {selectedItem.verdict && (
                <div className="space-y-2">
                  <span className="font-sans text-xs uppercase font-semibold text-pix-success flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-pix-success" />
                    <span>
                      Gemini Multimodal Auditor Reasoning ({Math.round(selectedItem.verdict.confidence * 100)}% Confidence)
                    </span>
                  </span>

                  <div className="p-4 rounded-[8px] bg-pix-bg border border-pix-success/20 text-[14px] font-sans text-pix-dim leading-relaxed whitespace-pre-line">
                    {selectedItem.verdict.reasoning}
                  </div>
                </div>
              )}

              {/* Evidence & IPFS CIDs */}
              <div className="space-y-2">
                <span className="font-sans text-[12px] uppercase font-semibold text-pix-ink block">
                  IPFS Pinned Evidence (Pinata Gateway)
                </span>
                <div className="space-y-2">
                  {selectedItem.evidence?.map((ev: any) => (
                    <div
                      key={ev.id}
                      className="p-3.5 rounded-[8px] bg-pix-bg border border-[var(--color-pix-hairline)] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-pix-accent" />
                        <span className="font-sans text-pix-ink text-[13px]">{ev.fileName || ev.kind}</span>
                      </div>
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${ev.cid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pix-accent hover:underline font-mono text-[12px] flex items-center space-x-1"
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
