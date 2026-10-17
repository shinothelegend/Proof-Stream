"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  MapPin,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { SnapButton } from "@/components/pixel/SnapButton";
import { Typewriter } from "@/components/pixel/Typewriter";
import { formatAddress, formatTxHash } from "@/lib/format";

export default function ReviewQueuePage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState<Record<string, string>>({});

  const fetchQueue = () => {
    setLoading(true);
    fetch("/api/review")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSubmissions(data.data || []);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleAction = async (submissionId: string, action: "APPROVE" | "REJECT") => {
    try {
      setProcessingId(submissionId);
      const notes = reviewerNotes[submissionId] || "";

      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-review-token": "proofstream_review_pass_2026",
        },
        body: JSON.stringify({
          submissionId,
          action,
          reviewerNotes: notes,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Action failed");

      toast.success(
        action === "APPROVE"
          ? "Tranche approved and released on-chain!"
          : "Submission marked as rejected"
      );

      fetchQueue();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Review action failed");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-pix-hairline)]">
        <div>
          <Badge variant="flagged" className="mb-2">
            AUDITOR OVERSIGHT PORTAL
          </Badge>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-pix-ink tracking-tight mt-1">
            <Typewriter text="REVIEWER QUEUE & DISPUTE WINDOW" speed={30} />
          </h1>
          <p className="font-sans text-[15px] text-pix-dim mt-1.5 max-w-2xl leading-relaxed">
            Submissions with security flags, border anomalies, or confidence &lt; 85% held for human verification.
          </p>
        </div>

        <SnapButton
          variant="secondary"
          size="sm"
          onClick={fetchQueue}
          disabled={loading}
          className="self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          <span>REFRESH QUEUE</span>
        </SnapButton>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 h-48 rounded-[10px] bg-pix-panel border border-[var(--color-pix-hairline)] animate-pulse shadow-card" />
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] shadow-card p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-[10px] bg-pix-success/10 border border-pix-success/30 text-pix-success flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-display font-semibold text-base text-pix-ink uppercase">Queue Clean</h3>
          <p className="font-sans text-[14px] text-pix-dim mt-1">
            All submitted proofs have been automatically resolved or verified.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {submissions.map((sub) => {
            const verdict = sub.verdict;
            const flags: string[] = verdict?.flags ? JSON.parse(verdict.flags) : [];
            const isProcessing = processingId === sub.id;

            return (
              <div key={sub.id} className="rounded-[10px] card-chamfer bg-pix-panel border border-[var(--color-pix-hairline)] shadow-card p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-sans text-[11px] font-semibold text-pix-accent uppercase tracking-wider">
                      Campaign: {sub.milestone?.campaign?.title || "Kalimantan Clean Water"}
                    </span>
                    <h3 className="font-display font-semibold text-lg text-pix-ink mt-1">
                      {sub.milestone?.description}
                    </h3>
                    <div className="flex items-center space-x-3 text-[13px] text-pix-dim mt-1.5 font-sans">
                      <span>Worker: <span className="text-pix-ink font-medium">{sub.workerName}</span></span>
                      <span>·</span>
                      <span>Target: <span className="text-pix-accent font-mono font-medium">${sub.milestone?.amount} USDC</span></span>
                    </div>
                  </div>

                  <Badge variant={sub.status === "REJECTED" ? "rejected" : "flagged"}>
                    {sub.status}
                  </Badge>
                </div>

                {/* Agent Reasoning & Flags Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-[8px] bg-pix-bg border border-[var(--color-pix-hairline)]">
                  <div className="space-y-2">
                    <span className="font-sans text-[12px] uppercase font-semibold text-pix-alert flex items-center space-x-1.5">
                      <ShieldAlert className="w-4 h-4 text-pix-alert" />
                      <span>Gemini Audit Finding</span>
                    </span>
                    <p className="font-sans text-[14px] text-pix-dim leading-relaxed">
                      {verdict?.reasoning || "Pending agent analysis or EXIF extraction."}
                    </p>
                    {verdict?.confidence !== undefined && (
                      <div className="font-mono text-xs text-pix-accent pt-1">
                        Confidence Score: {Math.round(verdict.confidence * 100)}%
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <span className="font-sans text-[12px] uppercase font-semibold text-pix-ink block">Security Flags</span>
                    {flags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {flags.map((flag, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 text-[11px] font-mono rounded-[6px] bg-pix-alert/15 text-pix-alert border border-pix-alert/30"
                          >
                            {flag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="font-sans text-[13px] text-pix-dim">No hard flags. Low confidence manual check.</span>
                    )}

                    {/* Evidence files preview */}
                    <div className="pt-2">
                      <span className="font-sans text-[11px] uppercase font-semibold text-pix-accent block mb-1.5">
                        Attached Evidence
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {sub.evidence?.map((ev: any) => (
                          <span
                            key={ev.id}
                            className="px-2.5 py-1 rounded-[6px] bg-pix-panel border border-[var(--color-pix-hairline)] text-[12px] font-mono text-pix-dim flex items-center space-x-1.5"
                          >
                            <FileText className="w-3.5 h-3.5 text-pix-accent" />
                            <span>{ev.fileName || ev.kind}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviewer Actions */}
                <div className="space-y-3 pt-2">
                  <input
                    type="text"
                    value={reviewerNotes[sub.id] || ""}
                    onChange={(e) =>
                      setReviewerNotes({ ...reviewerNotes, [sub.id]: e.target.value })
                    }
                    placeholder="Enter audit notes / justification for manual override..."
                    className="w-full px-4 py-2.5 rounded-[10px] bg-pix-bg border border-[var(--color-pix-hairline)] font-sans text-[14px] text-pix-ink placeholder:text-pix-dim/50 focus:outline-none focus:border-pix-accent shadow-sm"
                  />

                  <div className="flex items-center justify-end space-x-3">
                    <SnapButton
                      variant="alert"
                      size="sm"
                      onClick={() => handleAction(sub.id, "REJECT")}
                      isLoading={isProcessing}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Rejecting…" : "Reject Submission"}
                    </SnapButton>

                    <SnapButton
                      variant="success"
                      size="sm"
                      onClick={() => handleAction(sub.id, "APPROVE")}
                      isLoading={isProcessing}
                      disabled={isProcessing}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      <span>{isProcessing ? "Releasing…" : "Approve & Release"}</span>
                    </SnapButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
