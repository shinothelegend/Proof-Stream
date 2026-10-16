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
import { GlassCard } from "@/components/ui/GlassCard";
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-pix-gold">
        <div>
          <Badge variant="flagged" className="mb-2">
            AUDITOR OVERSIGHT PORTAL
          </Badge>
          <h1 className="font-heading text-xl sm:text-2xl text-pix-ink uppercase tracking-wide">
            <Typewriter text="REVIEWER QUEUE & DISPUTE WINDOW" speed={30} />
          </h1>
          <p className="font-body text-xs text-pix-dim mt-1">
            Submissions with security flags, border anomalies, or confidence &lt; 85% held for human verification.
          </p>
        </div>

        <SnapButton
          variant="secondary"
          size="sm"
          onClick={fetchQueue}
          disabled={loading}
          className="self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          <span>REFRESH QUEUE</span>
        </SnapButton>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 h-48 bg-pix-panel border-2 border-pix-dim/30 animate-pulse" />
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <GlassCard className="p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 bg-pix-mint/10 border-2 border-pix-mint text-pix-mint flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-sm text-pix-ink uppercase">QUEUE CLEAN</h3>
          <p className="font-body text-xs text-pix-dim mt-1">
            All submitted proofs have been automatically resolved or verified.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-6">
          {submissions.map((sub) => {
            const verdict = sub.verdict;
            const flags: string[] = verdict?.flags ? JSON.parse(verdict.flags) : [];
            const isProcessing = processingId === sub.id;

            return (
              <GlassCard key={sub.id} className="p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-heading text-[10px] text-pix-gold uppercase">
                      Campaign: {sub.milestone?.campaign?.title || "Kalimantan Clean Water"}
                    </span>
                    <h3 className="font-heading text-base text-pix-ink mt-1">
                      {sub.milestone?.description}
                    </h3>
                    <div className="flex items-center space-x-3 text-xs text-pix-dim mt-1.5 font-body">
                      <span>Worker: <span className="text-pix-ink">{sub.workerName}</span></span>
                      <span>·</span>
                      <span>Target: <span className="text-pix-cyan">${sub.milestone?.amount} USDC</span></span>
                    </div>
                  </div>

                  <Badge variant={sub.status === "REJECTED" ? "rejected" : "flagged"}>
                    {sub.status}
                  </Badge>
                </div>

                {/* Agent Reasoning & Flags Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-pix-bg border-2 border-pix-dim/20">
                  <div className="space-y-2">
                    <span className="font-heading text-xs uppercase text-pix-alert flex items-center space-x-1.5">
                      <ShieldAlert className="w-4 h-4 text-pix-alert" />
                      <span>Gemini Audit Finding</span>
                    </span>
                    <p className="font-body text-xs text-pix-dim leading-relaxed">
                      {verdict?.reasoning || "Pending agent analysis or EXIF extraction."}
                    </p>
                    {verdict?.confidence !== undefined && (
                      <div className="font-body text-xs text-pix-cyan pt-1">
                        Confidence Score: {Math.round(verdict.confidence * 100)}%
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <span className="font-heading text-xs uppercase text-pix-ink block">Security Flags</span>
                    {flags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {flags.map((flag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-[10px] font-body bg-pix-alert/20 text-pix-alert border border-pix-alert"
                          >
                            {flag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="font-body text-xs text-pix-dim">No hard flags. Low confidence manual check.</span>
                    )}

                    {/* Evidence files preview */}
                    <div className="pt-2">
                      <span className="font-heading text-[10px] uppercase text-pix-gold block mb-1">
                        Attached Evidence
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {sub.evidence?.map((ev: any) => (
                          <span
                            key={ev.id}
                            className="px-2 py-1 bg-pix-panel border border-pix-dim/30 text-[11px] font-body text-pix-dim flex items-center space-x-1"
                          >
                            <FileText className="w-3 h-3 text-pix-cyan" />
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
                    className="w-full px-3.5 py-2.5 bg-pix-bg border-2 border-pix-dim/40 font-body text-xs text-pix-ink placeholder:text-pix-dim/50 focus:outline-none focus:border-pix-gold"
                  />

                  <div className="flex items-center justify-end space-x-3">
                    <SnapButton
                      variant="alert"
                      size="sm"
                      onClick={() => handleAction(sub.id, "REJECT")}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "PROCESSING..." : "REJECT SUBMISSION"}
                    </SnapButton>

                    <SnapButton
                      variant="mint"
                      size="sm"
                      onClick={() => handleAction(sub.id, "APPROVE")}
                      disabled={isProcessing}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      <span>{isProcessing ? "RELEASING..." : "APPROVE & RELEASE"}</span>
                    </SnapButton>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
